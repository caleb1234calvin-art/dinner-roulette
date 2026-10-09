import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, flush } from "./test-support/discovery-clock.mjs";
import { discoveryComponentHarness, discoveryModes, discoveryPayload, textOf } from "./test-support/discovery-component-harness.mjs";
const load = appModuleLoader();
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { DATE_NIGHT_RADIAL_SUCCESS_PAUSE_MS } = load("src/lib/date-night/radial-session.ts");
const config = discoveryModes[1];
function setup(t, radiusMiles = 50) {
  const clock = discoveryClock(t), h = discoveryComponentHarness(config);
  t.mock.method(console, "warn", () => {});
  h.store.spookySeasonEnabled = true;
  h.store.setDateNightFilters({ radiusMiles, activityTypes: ["movies"] });
  t.after(() => h.dispose());
  h.render();
  return { h, clock };
}
function reply(h, { index = h.requests.length - 1, fail = false, empty = false } = {}) {
  const req = h.requests[index], data = req.args.data;
  const p = data.patchId ? planDateNightPatches(data, data.radiusMiles).find(patch => patch.id === data.patchId) : { id: "primary", innerMiles: 0, center: data };
  const count = p.innerMiles ? 1 : 4;
  const venues = empty || fail ? [] : Array.from({ length: count }, (_, i) => ({
    ...discoveryPayload(config).venues[0], ...p.center, lat: p.center.lat + i * 0.015,
    id: `${p.id}-venue-${i}`, name: `${p.id}-venue-${i}`,
  }));
  const result = { venues, source: fail ? "fallback" : "live", patch: { id: p.id, version: p.version },
    discovery: { partial: false, groups: buildDateNightQueryPlan(data.activityTypes, true).map(group => ({ ...group,
      outcome: fail ? "failed" : empty ? "succeeded-empty" : "succeeded-nonempty" })) } };
  req.resolve(result);
  return result;
}
const progress = h => textOf(h.status().tree);

test("actual UI: selected-radius primary enables all actions before serial background audit", async t => {
  const { h, clock } = setup(t);
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].args.data.patchId, undefined);
  assert.equal(h.requests[0].args.data.radiusMiles, 50);
  assert.equal(h.status().loading, false, "supported local cinemas are immediately usable before live primary");
  assert.equal(h.button(h.render(), "Pick our date").props.disabled, false);
  reply(h); await h.settle();
  assert.equal(h.status().loading, false);
  for (const label of ["Pick our date", "Give us options", "Plan the night"]) assert.equal(h.button(h.render(), label).props.disabled, false);
  assert.match(progress(h), /Ready/);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:core");
  await clock.tick(1000);
  assert.equal(h.requests.length, 2, "one audit RPC in flight");
  reply(h); await h.settle(); await clock.tick(DATE_NIGHT_RADIAL_SUCCESS_PAUSE_MS);
  assert.equal(h.requests[2].args.data.patchId, "radial-v1:20:0");
});

for (const [label, overlay, prop] of [["Pick our date", "ResultOverlay", "restaurant"], ["Give us options", "OptionsOverlay", "restaurants"], ["Plan the night", "DateNightPlanOverlay", "plan"]]) {
  test(`actual UI: open ${overlay} stays stable when audit venues arrive; future action uses enlarged pool`, async t => {
    const { h, clock } = setup(t);
    reply(h); await h.settle();
    t.mock.method(Math, "random", () => 0.9999999);
    h.button(h.render(), label).props.onClick();
    const ids = () => [h.overlay(h.render(), overlay).props[prop]].flat().map(v => v.id);
    const before = ids();
    reply(h); await h.settle(); await clock.tick(1000);
    reply(h); await h.settle();
    assert.deepEqual(ids(), before);
    const node = h.overlay(h.render(), overlay);
    (node.props.onReroll ?? node.props.onShuffle ?? node.props.onReplan)();
    assert.ok(ids().some(id => id.startsWith("radial-v1:20:0")));
  });
}

test("audit middle failure retains primary picks and explicit retry targets missing sector", async t => {
  const { h, clock } = setup(t, 20);
  reply(h); await h.settle(); reply(h); await h.settle();
  for (let i = 0; i < 4; i++) { await clock.tick(1000); reply(h, { fail: i === 1 }); await h.settle(); }
  assert.equal(h.requests.length, 6);
  assert.match(progress(h), /Ready · some background coverage checks are unavailable/);
  assert.equal(h.button(h.render(), "Pick our date").props.disabled, false);
  h.button(h.render(), "Retry missing areas").props.onClick(); h.render();
  await clock.tick(1000);
  assert.equal(h.requests.at(-1).args.data.patchId, "radial-v1:20:1");
  reply(h); await h.settle();
  assert.match(progress(h), /Ready · background coverage checked/);
});

test("outermost audit failure preserves primary and bounded audit never auto-retries", async t => {
  const { h, clock } = setup(t);
  const total = planDateNightPatches(h.store.location, 50).length;
  reply(h); await h.settle();
  for (let i = 0; i < total; i++) { if (i) await clock.tick(1000); reply(h, { fail: i === total - 1 }); await h.settle(); }
  assert.equal(h.requests.length, total + 1);
  assert.match(progress(h), /Ready · some background coverage checks are unavailable/);
  assert.equal(h.button(h.render(), "Give us options").props.disabled, false);
  await clock.tick(1_000_000);
  assert.equal(h.requests.length, total + 1);
  assert.equal(clock.pending, 0);
});

test("three consecutive degraded audit patches stop bounded pass without removing primary", async t => {
  const { h, clock } = setup(t);
  reply(h); await h.settle(); reply(h); await h.settle();
  for (let i = 0; i < 3; i++) { await clock.tick(1000); reply(h, { fail: true }); await h.settle(); }
  await clock.tick(100_000);
  assert.equal(h.requests.length, 5);
  assert.match(progress(h), /Ready · some background coverage checks are unavailable/);
  assert.equal(h.button(h.render(), "Pick our date").props.disabled, false);
  assert.equal(clock.pending, 0);
});

test("15→50 acquires missing disk authority; narrowing cancels obsolete work and clips locally", async t => {
  const { h } = setup(t, 15);
  reply(h); await h.settle();
  h.store.setDateNightFilters({ radiusMiles: 50 }); h.render();
  const wide = h.requests.at(-1);
  assert.equal(wide.args.data.patchId, undefined);
  assert.equal(wide.args.data.radiusMiles, 50);
  h.store.setDateNightFilters({ radiusMiles: 15 }); h.render();
  assert.equal(wide.args.signal.aborted, true);
  const primaryCount = h.requests.filter(r => !r.args.data.patchId).length;
  wide.resolve({ venues: [], source: "live" }); await flush();
  assert.equal(h.status().loading, false);
  assert.equal(h.requests.filter(r => !r.args.data.patchId).length, primaryCount);
  h.store.setDateNightFilters({ radiusMiles: 50 }); h.render();
  assert.equal(h.requests.filter(r => !r.args.data.patchId).length, primaryCount + 1, "cancelled response cannot seed authority");
});

test("rapid radius change cancels obsolete primary and strictly clips its replacement", async t => {
  const { h } = setup(t);
  h.store.setDateNightFilters({ radiusMiles: 1 }); h.render();
  assert.equal(h.requests[0].args.signal.aborted, true);
  assert.equal(h.requests.at(-1).args.data.radiusMiles, 1);
  reply(h); await h.settle();
  assert.match(progress(h), /1 activities match/);
  reply(h, { index: 0 }); await h.settle();
  assert.match(progress(h), /1 activities match/);
});

test("all local-only filters cause zero RPCs and do not cancel background audit", async t => {
  const { h } = setup(t);
  reply(h); await h.settle();
  for (const patch of [{ openNowOnly: true }, { mood: 99 }, { favoritesOnly: true }, { reduceParks: false }]) {
    h.store.setDateNightFilters(patch); h.render();
    assert.equal(h.requests.length, 2);
    assert.equal(h.requests[1].args.signal.aborted, false);
  }
});

test("location change cancels audit and late response cannot replace newer primary", async t => {
  const { h } = setup(t);
  reply(h); await h.settle();
  h.store.location = { ...h.store.location, lat: 38 }; h.render();
  assert.equal(h.requests[1].args.signal.aborted, true);
  assert.equal(h.requests[2].args.data.patchId, undefined);
  reply(h, { index: 1 }); await flush();
  assert.equal(h.status().loading, true);
});

test("stalled primary watchdog cancels obsolete work and settles foreground state", async t => {
  const { h, clock } = setup(t);
  await clock.tick(25_000);
  assert.equal(h.status().loading, false);
  assert.equal(h.requests[0].args.signal.aborted, true);
  assert.ok(h.status().notices.length);
});

test("saved primary fallback remains usable without inventing live coverage", async t => {
  const { h } = setup(t);
  const result = discoveryPayload(config, "fallback");
  result.venues[0].source = "catalog";
  result.discovery = { partial: false, groups: [{ id: "culture", activityTypes: ["movies"], outcome: "failed" }] };
  h.requests[0].resolve(result); await h.settle();
  assert.equal(h.button(h.render(), "Pick our date").props.disabled, false);
  assert.doesNotMatch(progress(h), /Loaded through/);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:core");
});
