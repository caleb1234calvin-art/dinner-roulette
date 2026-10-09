import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, deferred, flush, untilAbort } from "./test-support/discovery-clock.mjs";
import { discoveryComponentHarness, discoveryModes, discoveryPayload } from "./test-support/discovery-component-harness.mjs";
const load = appModuleLoader();
const { createDateNightHybridSession } = load("src/lib/date-night/hybrid-session.ts");
const { createDateNightDiscoveryCache } = load("src/lib/date-night/cache.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const base = { lat: 43, lon: -79, radiusMiles: 50, halloweenActive: true, activityTypes: ["movies"] };
const venue = (id = "movie", change = {}) => ({ ...discoveryPayload(discoveryModes[1]).venues[0],
  ...base, id, name: id, activityTypes: ["movies"], ...change });
const response = (q, venues = [], outcome = "succeeded-nonempty") => ({ venues, source: "live",
  ...(q.patchId ? { patch: { id: q.patchId, version: "radial-v1" } } : {}),
  discovery: { partial: false, groups: buildDateNightQueryPlan(q.activityTypes, q.halloweenActive).map(g => ({ ...g, outcome })) } });
function setup(t, options = {}) {
  const clock = discoveryClock(t), calls = [], states = [];
  t.mock.method(console, "warn", () => {});
  const session = createDateNightHybridSession(options);
  const callbacks = { request(q, signal) { const d = deferred(); calls.push({ q, signal, ...d }); return d.promise; },
    onChange(s) { states.push(s); } };
  let query = { ...base };
  const update = changes => { query = { ...query, ...changes }; session.update(query, callbacks); };
  t.after(() => session.dispose()); update({});
  return { session, calls, states, update, clock, get state() { return states.at(-1); },
    async reply(index, venues = [], outcome) { calls[index].resolve(response(calls[index].q, venues, outcome)); await flush(); } };
}

test("primary disk resolves READY independently; serial audit recovers omitted unique venues without foreground loading", async t => {
  const h = setup(t);
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].q.patchId, undefined);
  assert.equal(h.state.phase, "initial-loading");
  await h.reply(0, [venue()]);
  assert.equal(h.state.loading, false); assert.equal(h.state.primaryPending, false);
  assert.equal(h.state.phase, "background-auditing");
  assert.equal(h.calls[1].q.patchId, "radial-v1:core");
  await h.reply(1, [venue(), venue("audit-only", { lat: 43.01 })]);
  assert.deepEqual(h.state.response.venues.map(v => v.id).sort(), ["audit-only", "movie"]);
  await h.clock.tick(250);
  assert.equal(h.calls[2].q.patchId, "radial-v1:20:0");
  h.calls[2].reject(new Error("audit unavailable")); await flush();
  assert.equal(h.state.loading, false);
  assert.equal(h.state.response.venues.length, 2);
});

test("curated-first readiness carries no live coverage and waits for primary settlement before auditing", async t => {
  const h = setup(t);
  h.update({ lat: 37.08, lon: -94.5, activityTypes: ["haunted-house"], radiusMiles: 20 });
  assert.equal(h.state.loading, false);
  assert.equal(h.state.primaryPending, true);
  assert.equal(h.state.coverage, undefined);
  assert.equal(h.state.response.discovery, undefined);
  assert.ok(h.state.response.venues.some(v => v.seasonalListing));
  assert.ok(h.calls.every(c => !c.q.patchId));
});

for (const change of [{ lat: 42 }, { activityTypes: ["park"] }, { radiusMiles: 20 }]) {
  test(`obsolete primary is aborted on ${JSON.stringify(change)} and late results cannot seed cache`, async t => {
    const h = setup(t), old = h.calls[0];
    h.update(change); assert.equal(old.signal.aborted, true);
    const count = h.states.length;
    old.resolve(response(old.q, [venue("obsolete")])); await flush();
    assert.equal(h.states.length, count);
    assert.equal(h.state.response?.venues.some(v => v.id === "obsolete") ?? false, false);
  });
}

test("audit aborts on category/location change and disposal; cancelled audit cannot publish", async t => {
  const h = setup(t); await h.reply(0, [venue()]);
  const old = h.calls[1]; h.update({ activityTypes: ["park"] });
  assert.equal(old.signal.aborted, true);
  old.resolve(response(old.q, [venue("old-audit")])); await flush();
  assert.equal(h.state.response?.venues.some(v => v.id === "old-audit") ?? false, false);
  const last = h.calls.at(-1); h.session.dispose(); assert.equal(last.signal.aborted, true);
  const count = h.states.length; last.resolve(response(last.q, [venue("disposed")])); await flush();
  assert.equal(h.states.length, count);
});

test("50-mile disk authority permits local decrease and covered increase; widening beyond authority requests disk", async t => {
  const h = setup(t); await h.reply(0, [venue(), venue("far", { lat: 43.5 })]);
  await h.reply(1, [venue()]);
  const primaryCount = () => h.calls.filter(c => !c.q.patchId).length;
  h.update({ radiusMiles: 15 }); assert.equal(primaryCount(), 1); assert.equal(h.state.loading, false);
  assert.equal(h.state.response.venues.some(v => v.id === "far"), false);
  h.update({ radiusMiles: 20 }); assert.equal(primaryCount(), 1);
  h.update({ radiusMiles: 50 }); assert.equal(primaryCount(), 1);
  h.update({ lat: 44, radiusMiles: 15 }); assert.equal(primaryCount(), 2);
  await h.reply(h.calls.length - 1, [venue("new-origin", { lat: 44 })]);
  h.update({ radiusMiles: 50 }); assert.equal(primaryCount(), 3);
});

for (const negativePatch of [undefined, "radial-v1:core"]) {
  test(`negative eviction retires older disk positives, patch=${negativePatch ?? "none"}`, () => {
    const cache = createDateNightDiscoveryCache({ maxEntries: 2 });
    const q = { ...base, semanticVersion: "radial-v1" };
    const active = venue();
    cache.store(q, response(q, [active]));
    const negative = { ...q, activityTypes: ["corn-maze"], patchId: negativePatch };
    cache.store(negative, response(negative, [{ ...active, lifecycle: "permanently-closed" }]));
    assert.equal(cache.read(q).response.venues[0].lifecycle, "permanently-closed");
    const pressure = { ...q, activityTypes: ["park"] };
    cache.store(pressure, response(pressure, [venue("pressure", { activityTypes: ["park"] })]));
    assert.equal(cache.read(q).response?.venues.some(v => v.id === active.id && !v.lifecycle) ?? false, false);
  });
}

test("audit lifecycle negatives override disk positives through radius/category changes", async t => {
  const h = setup(t, { cache: createDateNightDiscoveryCache({ maxEntries: 2 }) });
  await h.reply(0, [venue()]);
  await h.reply(1, [venue("movie", { lifecycle: "permanently-closed" })]);
  h.update({ radiusMiles: 15 });
  assert.equal(h.state.response.venues.find(v => v.id === "movie")?.lifecycle, "permanently-closed");
  h.update({ activityTypes: ["park"] });
  await h.reply(h.calls.length - 1, [venue("park", { activityTypes: ["park"] })]);
  h.update({ activityTypes: ["movies"] });
  assert.equal(h.state.response?.venues.some(v => v.id === "movie" && !v.lifecycle) ?? false, false);
});

for (const patchId of [undefined, "radial-v1:core"]) {
  test(`actual server handler propagates abort upstream and never starts later mirrors (${patchId ?? "primary"})`, async t => {
    const clock = discoveryClock(t), controller = new AbortController(), signals = [];
    t.mock.method(console, "warn", () => {});
    const { searchDateNight } = appModuleLoader({ requestSignal: controller.signal })("src/lib/date-night/search.ts");
    t.mock.method(globalThis, "fetch", (_url, { signal }) => { signals.push(signal); return untilAbort(signal); });
    const rejected = assert.rejects(searchDateNight({ data: { lat: base.lat, lon: base.lon, radiusMiles: base.radiusMiles, activityTypes: base.activityTypes, spookySeasonEnabled: true, patchId } }), { name: "AbortError" });
    await clock.tick(100); controller.abort(); await rejected;
    assert.equal(signals.length, 1); assert.ok(signals.every(s => s.aborted));
    await clock.tick(30_000); assert.equal(signals.length, 1); assert.equal(clock.pending, 0);
  });
}

test("audit positive ownership remains spatially clipped and primary disk does not claim patch coverage", async t => {
  const h = setup(t); await h.reply(0, [venue()]);
  assert.equal(h.state.coverage.complete, false);
  const patch = planDateNightPatches(base, 50)[0];
  assert.equal(h.state.coverage.patches.find(p => p.id === patch.id).completeActivityTypes.length, 0);
  await h.reply(1, [venue(), venue("outside", { lat: 48 })]);
  assert.equal(h.state.response.venues.some(v => v.id === "outside"), false);
});

for (const maxEntries of [2, 3, 8]) {
  test(`bounded negative retirement survives repeated cap pressure and alias/category/radius changes (cap ${maxEntries})`, () => {
    const cache = createDateNightDiscoveryCache({ maxEntries, maxVenues: 12 });
    const q = { ...base, semanticVersion: "radial-v1" };
    const active = venue("positive", { name: "Shared Cinema", activityTypes: ["movies", "corn-maze"] });
    cache.store(q, response(q, [active]));
    const negativeQuery = { ...q, activityTypes: ["corn-maze"] };
    cache.store(negativeQuery, response(negativeQuery, [venue("closed-alias", {
      name: "Shared Cinema", activityTypes: ["corn-maze"], lifecycle: "permanently-closed" })]));
    cache.read(q); // Keep older Movies positive recently used before negative eviction.
    for (let i = 0; i < 40; i++) {
      const pressure = { ...q, radiusMiles: i % 2 ? 20 : 50, activityTypes: ["park"] };
      cache.store(pressure, response(pressure, [venue(`pressure-${i}`, { activityTypes: ["park"], lat: 43.1 })]));
      for (const radiusMiles of [15, 20, 50]) {
        const hit = cache.read({ ...q, radiusMiles });
        assert.equal(hit.response?.venues.some(v => v.name === active.name && !v.lifecycle) ?? false, false);
      }
    }
  });
}

for (const cap of [1, 20000]) for (const auditStage of ["core", "outer"]) {
  test(`HYB-IV-01 capacity-rejected ${auditStage} negative still suppresses primary and cached aliases (cap ${cap})`, async t => {
    const h = setup(t, { cache: createDateNightDiscoveryCache({ maxVenues: cap }) });
    const positive = venue("movie", { name: "Shared Cinema" });
    await h.reply(0, [positive]);
    if (auditStage === "outer") { await h.reply(1, []); await h.clock.tick(250); }
    const call = h.calls.at(-1);
    call.resolve(response(call.q, [venue("negative-alias", { name: "Shared Cinema", lifecycle: "permanently-closed" }),
      ...Array.from({ length: cap }, (_, i) => venue(`overflow-${i}`, { lat: 43.05 }))]));
    await flush();
    const safe = () => assert.equal(h.state.response?.venues.some(v => v.name === "Shared Cinema" && !v.lifecycle) ?? false, false);
    safe(); h.update({ radiusMiles: 15 }); safe();
    h.update({ activityTypes: ["park"] });
    h.update({ activityTypes: ["movies"] }); safe();
  });
}

test("cancelled oversized audit cannot retire a newer origin's positive identity", async t => {
  const h = setup(t, { cache: createDateNightDiscoveryCache({ maxVenues: 1 }) });
  await h.reply(0, [venue()]); const obsolete = h.calls[1];
  h.update({ lat: 43.01 }); const primary = h.calls.at(-1);
  primary.resolve(response(primary.q, [venue()])); await flush();
  obsolete.resolve(response(obsolete.q, [venue("movie", { lifecycle: "permanently-closed" }), venue("overflow")]));
  await flush();
  assert.equal(h.state.response.venues.find(v => v.id === "movie").lifecycle, undefined);
});

for (const order of [["z", "a"], ["a", "z"]]) {
  for (const [label, overlay, prop] of [["Pick our date", "ResultOverlay", "restaurant"],
    ["Give us options", "OptionsOverlay", "restaurants"], ["Plan the night", "DateNightPlanOverlay", "plan"]]) {
    test(`HYB-IV-02 ${overlay} follows affirmed rekey ${order.join("→")} but still invalidates lifecycle negatives`, async t => {
      const clock = discoveryClock(t), h = discoveryComponentHarness(discoveryModes[1]);
      t.after(() => h.dispose()); h.store.spookySeasonEnabled = true;
      h.store.location = { lat: 43, lon: -79, label: "Control", source: "manual" };
      h.store.setDateNightFilters({ radiusMiles: 20, activityTypes: ["movies"] }); h.render();
      const row = id => venue(`date-night-osm-${id}`, { name: "Affirmed Alias Cinema" });
      const reply = async (index, rows) => {
        const q = h.requests[index].args.data;
        h.requests[index].resolve(response({ ...q, halloweenActive: true }, rows)); await h.settle();
      };
      await reply(0, [row(order[0])]); h.button(h.render(), label).props.onClick();
      const names = () => [h.overlay(h.render(), overlay).props[prop]].flat().map(v => v.name);
      const before = names();
      const presentation = () => { const props = h.overlay(h.render(), overlay).props; return props.decisionIdentity ?? props.decisionKeys; };
      const stablePresentation = presentation();
      await reply(1, [row(order[1]), venue("unrelated", { name: "Unrelated Recreation Venue", lat: 43.02 })]);
      assert.deepEqual(names(), before, "new canonical representative cannot dismiss or replace the decision");
      assert.deepEqual(presentation(), stablePresentation, "animation and card keys stay tied to the user’s selection");
      await clock.tick(250);
      await reply(h.requests.length - 1, [{ ...row(order[1]), lifecycle: "permanently-closed" }]);
      assert.equal(h.overlay(h.render(), overlay), null, "closure authority must invalidate even an alias-preserved decision");
    });
  }
}
