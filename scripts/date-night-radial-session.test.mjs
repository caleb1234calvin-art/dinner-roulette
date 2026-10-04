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
  const p = planDateNightPatches(data, data.radiusMiles).find(patch => patch.id === data.patchId);
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

test("actual UI: core completes first, actions enable before maximum coverage and outer work continues serially", async t => {
  const { h, clock } = setup(t);
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].args.data.patchId, "radial-v1:core");
  assert.equal(h.status().loading, true);
  reply(h); await h.settle();
  assert.equal(h.status().loading, false);
  for (const label of ["Pick our date", "Give us options", "Plan the night"]) assert.equal(h.button(h.render(), label).props.disabled, false);
  assert.match(progress(h), /Loaded through 15 miles · expanding toward 50/);
  await clock.tick(DATE_NIGHT_RADIAL_SUCCESS_PAUSE_MS - 1);
  assert.equal(h.requests.length, 1);
  await clock.tick(1);
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:20:0");
  await clock.tick(1000);
  assert.equal(h.requests.length, 2, "one in-flight patch even while provider has not settled");
  reply(h); await h.settle();
  assert.match(progress(h), /5 activities match/);
  assert.match(progress(h), /Loaded through 15 miles/, "one sector is not a complete 20-mile ring");
});

for (const [label, overlay, prop] of [["Pick our date", "ResultOverlay", "restaurant"], ["Give us options", "OptionsOverlay", "restaurants"], ["Plan the night", "DateNightPlanOverlay", "plan"]]) {
  test(`actual UI: open ${overlay} stays stable when outer venues arrive; next action uses fresh pool`, async t => {
    const { h, clock } = setup(t);
    reply(h); await h.settle();
    t.mock.method(Math, "random", () => 0.9999999);
    h.button(h.render(), label).props.onClick();
    const ids = () => [h.overlay(h.render(), overlay).props[prop]].flat().map(v => v.id);
    const before = ids();
    await clock.tick(1000);
    reply(h); await h.settle();
    assert.deepEqual(ids(), before);
    const node = h.overlay(h.render(), overlay);
    (node.props.onReroll ?? node.props.onShuffle ?? node.props.onReplan)();
    assert.ok(ids().some(id => id.startsWith("radial-v1:20:0")), "future interaction sees newly acquired venue");
  });
}

test("middle failure leaves a truthful gap, retains nearby picks, and retry targets only the failed sector", async t => {
  const { h, clock } = setup(t, 20);
  reply(h); await h.settle();
  for (let i = 0; i < 4; i++) { await clock.tick(1000); reply(h, { fail: i === 1 }); await h.settle(); }
  assert.equal(h.requests.length, 5);
  assert.match(progress(h), /Loaded through 15 miles · some outer areas could not be loaded/);
  assert.doesNotMatch(progress(h), /Loaded through 20 miles/);
  assert.equal(h.button(h.render(), "Pick our date").props.disabled, false);
  h.status().notices[0].onRetry(); h.render();
  assert.equal(h.requests.length, 5, "retry respects the most recent outer start");
  await clock.tick(1000);
  assert.equal(h.requests.length, 6);
  assert.equal(h.requests[5].args.data.patchId, "radial-v1:20:1");
  reply(h); await h.settle();
  assert.match(progress(h), /Loaded through 20 miles/);
  assert.equal(clock.pending, 0);
});

test("outermost failure preserves complete 0–40 and no failure triggers runaway auto-retry", async t => {
  const { h, clock } = setup(t);
  const total = planDateNightPatches(h.store.location, 50).length;
  reply(h); await h.settle();
  for (let i = 1; i < total; i++) { await clock.tick(1000); reply(h, { fail: i === total - 1 }); await h.settle(); }
  assert.equal(h.requests.length, total);
  assert.match(progress(h), /Loaded through 40 miles · some outer areas could not be loaded/);
  assert.equal(h.button(h.render(), "Give us options").props.disabled, false);
  await clock.tick(1_000_000);
  assert.equal(h.requests.length, total);
  assert.equal(clock.pending, 0);
});

test("three consecutive degraded outer patches stop the bounded pass and preserve inner results", async t => {
  const { h, clock } = setup(t);
  reply(h); await h.settle();
  for (let i = 0; i < 3; i++) { await clock.tick(1000); reply(h, { fail: true }); await h.settle(); }
  await clock.tick(100_000);
  assert.equal(h.requests.length, 4);
  assert.match(progress(h), /4 activities match/);
  assert.match(progress(h), /Loaded through 15 miles · some outer areas could not be loaded/);
  assert.equal(clock.pending, 0);
});

test("15→50 schedules only missing outer work; decreasing cancels obsolete work without refetch or late admission", async t => {
  const { h, clock } = setup(t, 15);
  reply(h); await h.settle();
  h.store.setDateNightFilters({ radiusMiles: 50 }); h.render();
  assert.equal(h.requests.length, 1, "compatible widening retains core success pacing");
  await clock.tick(250);
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:20:0");
  h.store.setDateNightFilters({ radiusMiles: 15 }); h.render();
  assert.equal(h.requests[1].args.signal.aborted, true);
  assert.equal(h.requests.length, 2);
  reply(h, { index: 1 }); await flush();
  assert.match(progress(h), /4 activities match/);
  assert.equal(clock.pending, 0);
  h.store.setDateNightFilters({ radiusMiles: 50 }); h.render();
  await clock.tick(999);
  assert.equal(h.requests.length, 2, "re-expansion cannot burst outer starts");
  await clock.tick(1);
  assert.equal(h.requests.length, 3, "cancelled response cannot seed reuse");
  assert.equal(h.requests[2].args.data.patchId, "radial-v1:20:0");
});

test("shrinking while core is in flight retains the necessary core request and strictly clips future venues", async t => {
  const { h } = setup(t);
  h.store.setDateNightFilters({ radiusMiles: 1 }); h.render();
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].args.signal.aborted, false);
  reply(h); await h.settle();
  assert.match(progress(h), /1 activities match/);
  assert.match(progress(h), /Loaded through 1 miles/);
});

test("all local-only filters cause zero RPCs and do not cancel background expansion", async t => {
  const { h, clock } = setup(t);
  reply(h); await h.settle(); await clock.tick(1000);
  for (const patch of [{ openNowOnly: true }, { mood: 99 }, { favoritesOnly: true }, { reduceParks: false }]) {
    h.store.setDateNightFilters(patch); h.render();
    assert.equal(h.requests.length, 2);
    assert.equal(h.requests[1].args.signal.aborted, false);
  }
  reply(h); await h.settle(); await clock.tick(1000);
  assert.equal(h.requests.length, 3);
});

test("location changes invalidate incompatible coverage and late outer responses cannot mutate new origin", async t => {
  const { h, clock } = setup(t);
  reply(h); await h.settle(); await clock.tick(1000);
  h.store.location = { ...h.store.location, lat: 38 }; h.render();
  assert.equal(h.requests[1].args.signal.aborted, true);
  assert.equal(h.requests[2].args.data.patchId, "radial-v1:core");
  reply(h, { index: 1 }); await flush();
  assert.equal(h.status().loading, true);
});

test("all-stall core settles by watchdog, does not expand, and explicit retry reacquires only core", async t => {
  const { h, clock } = setup(t);
  await clock.tick(25_000);
  assert.equal(h.status().loading, false);
  assert.match(h.status().notices[0].title, /timed out/);
  assert.equal(h.requests[0].args.signal.aborted, true);
  await clock.tick(100_000);
  assert.equal(h.requests.length, 1);
  h.status().notices[0].onRetry(); h.render();
  assert.equal(h.requests.length, 2);
  assert.equal(h.status().loading, true);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:core");
});

test("saved core fallback remains usable and exposes an explicit missing-area retry without false coverage", async t => {
  const { h, clock } = setup(t);
  const req = h.requests[0], result = discoveryPayload(config, "fallback");
  result.venues[0].source = "catalog";
  result.patch = { id: req.args.data.patchId, version: "radial-v1" };
  result.discovery = { partial: false, groups: [{ id: "culture", activityTypes: ["movies"], outcome: "failed" }] };
  req.resolve(result); await h.settle();
  assert.equal(h.button(h.render(), "Pick our date").props.disabled, false);
  assert.doesNotMatch(progress(h), /Loaded through/);
  assert.equal(clock.pending, 0);
  h.button(h.render(), "Retry missing areas").props.onClick(); h.render();
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:core");
});
