import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, deferred, flush } from "./test-support/discovery-clock.mjs";
import { discoveryModes, discoveryPayload, discoveryComponentHarness } from "./test-support/discovery-component-harness.mjs";
const load = appModuleLoader();
const { createDateNightHybridSession } = load("src/lib/date-night/hybrid-session.ts");
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { dateNightHealthyPool, rememberDateNightUsefulIdentities } = load("src/lib/date-night/adaptive-audit.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const base = { lat: 43, lon: -79, radiusMiles: 50, halloweenActive: true, activityTypes: ["movies"] };
const venue = (id, changes = {}) => ({ ...discoveryPayload(discoveryModes[1]).venues[0], ...base,
  id, name: id, openingHours: "24/7", activityTypes: ["movies"], ...changes });
const primary = () => Array.from({ length: 4 }, (_, i) => venue(`initial-${i}`, { lat: 43 + i * .01 }));
const response = (q, venues = [], outcome = venues.length ? "succeeded-nonempty" : "succeeded-empty") => ({ venues, source: "live",
  ...(q.patchId ? { patch: { id: q.patchId, version: "radial-v1" } } : {}),
  discovery: { partial: false, groups: buildDateNightQueryPlan(q.activityTypes, q.halloweenActive).map(g => ({ ...g, outcome })) } });
function setup(t, changes = {}) {
  const clock = discoveryClock(t), calls = [], states = [], session = createDateNightHybridSession();
  t.mock.method(console, "warn", () => {});
  let q = { ...base, ...changes };
  const filters = { radiusMiles: q.radiusMiles, activityTypes: q.activityTypes, openNowOnly: false, favoritesOnly: false };
  const preferences = {}, exclusions = [];
  const callbacks = { auditView: { selectedTypes: filters.activityTypes, eligible: places => eligibleDateNight(
    decorateDateNight(places, q, new Date(Date.now())), filters, q.halloweenActive, preferences, exclusions, Date.now()) },
    request(query, signal) { const d = deferred(); calls.push({ q: query, signal, at: clock.now, ...d }); return d.promise; },
    onChange(s) { states.push(s); } };
  const update = (change = {}) => { q = { ...q, ...change }; filters.radiusMiles = q.radiusMiles; session.update(q, callbacks); };
  t.after(() => session.dispose()); update();
  return { clock, calls, states, session, filters, preferences, exclusions, callbacks, update,
    get state() { return states.at(-1); },
    async reply(rows = [], outcome) { const c = calls.at(-1); c.resolve(response(c.q, rows, outcome)); await flush(); } };
}
async function firstFour(h, fourth = []) {
  await h.reply(primary());
  assert.equal(h.calls.length, 1); assert.equal(h.state.phase, "audit-deferred");
  assert.equal(h.state.loading, false); await h.clock.tick(1999); assert.equal(h.calls.length, 1);
  await h.clock.tick(1);
  for (let i = 0; i < 4; i++) { await h.reply(i === 3 ? fourth : []); if (i < 3) await h.clock.tick(2000); }
}

test("healthy readiness is immediate; four zero patches stop with incomplete coverage and 28 avoided audit acquisitions", async t => {
  const h = setup(t); await firstFour(h);
  assert.deepEqual(h.calls.map(c => c.at), [0, 2000, 4000, 6000, 8000]);
  assert.equal(h.state.auditPolicy.zeroYieldPatches, 4); assert.equal(h.state.auditPolicy.stopped, true);
  assert.equal(h.state.phase, "audit-stopped"); assert.equal(h.state.coverage.complete, false);
  assert.equal(h.state.coverage.continuousRadiusMiles, 15);
  assert.equal(h.state.coverage.missingPatchIds.length, 28);
  assert.deepEqual(h.state.response.venues.map(v => v.id).sort(), primary().map(v => v.id).sort());
  await h.clock.tick(100000); assert.equal(h.calls.length, 5);
  for (const patch of [{ favoritesOnly: true }, { favoritesOnly: false, openNowOnly: true }]) {
    Object.assign(h.filters, patch); h.update(); await h.clock.tick(10000); assert.equal(h.calls.length, 5);
  }
});

test("honest recall tradeoff: sole fifth-patch omission at 15–20mi is lost, retained radial reference finds it", async t => {
  const h = setup(t), patches = planDateNightPatches(base, 50);
  const late = venue("known-late-omission", patches[4].center);
  await firstFour(h); assert.equal(h.state.response.venues.some(v => v.id === late.id), false);
  const reference = createDateNightRadialSession(), calls = []; let final;
  t.after(() => reference.dispose());
  reference.update(base, { request: async q => { calls.push(q); return response(q,
    q.patchId === patches[0].id ? primary() : q.patchId === patches[4].id ? [late] : []); }, onChange: s => { final = s; } });
  await h.clock.tick(40000);
  assert.equal(calls.length, 32); assert.equal(final.coverage.complete, true);
  assert.deepEqual(final.response.venues.map(v => v.id).sort(), [...primary(), late].map(v => v.id).sort());
  assert.equal(32 - (h.calls.length - 1), 28);
  assert.equal(patches[4].id, "radial-v1:20:3");
  t.diagnostic(JSON.stringify({ fixture: "fifth-patch-omission", stoppedAuditAcquisitions: h.calls.length - 1,
    exhaustiveAuditAcquisitions: calls.length, avoidedAuditAcquisitions: 28, lostUsefulIds: [late.id],
    adaptiveFinalIds: h.state.response.venues.map(v => v.id).sort(), radialFinalIds: final.response.venues.map(v => v.id).sort(),
    omittedPatch: patches[4].id, bandMiles: [15, 20], physicalProviderAttempts: "not measured: transport is mocked" }));
});

test("useful fourth-patch omission resets streak and is retained before a later stop", async t => {
  const h = setup(t), patch = planDateNightPatches(base, 50)[3], added = venue("useful", patch.center);
  await firstFour(h, [added]); assert.equal(h.state.auditPolicy.zeroYieldPatches, 0);
  assert.equal(h.state.auditPolicy.stopped, false);
  for (let i = 0; i < 4; i++) { await h.clock.tick(2000); await h.reply(); }
  assert.equal(h.state.auditPolicy.stopped, true); assert.equal(h.state.response.venues.some(v => v.id === added.id), true);
  assert.equal(h.calls.length, 9);
});

test("thin starts immediately, promotes to healthy after useful recovery, then requires four fresh zero patches", async t => {
  const h = setup(t); await h.reply(primary().slice(0, 1));
  assert.equal(h.calls.length, 2); assert.equal(h.calls[1].at, 0);
  assert.equal(h.state.auditPolicy.mode, "thin");
  await h.reply(primary()); assert.equal(h.state.auditPolicy.mode, "healthy");
  assert.equal(h.state.auditPolicy.zeroYieldPatches, 0);
  for (let i = 0; i < 4; i++) { await h.clock.tick(2000); await h.reply(); }
  assert.equal(h.state.auditPolicy.stopped, true);
});

test("failed primary recovers immediately and never yield-stops even with four eligible recovered venues", async t => {
  const h = setup(t); h.calls[0].reject(new Error("primary failed")); await flush();
  assert.equal(h.calls.length, 2); assert.equal(h.calls[1].at, 0); assert.equal(h.state.loading, false);
  await h.reply(primary());
  await h.clock.tick(249); assert.equal(h.calls.length, 2); await h.clock.tick(1); assert.equal(h.calls.length, 3);
  for (let i = 1; i < 32; i++) { await h.reply(); if (i < 31) await h.clock.tick(1000); }
  assert.equal(h.calls.length, 33); assert.equal(h.state.coverage.complete, true);
  assert.equal(h.state.auditPolicy.mode, "recovery"); assert.equal(h.state.auditPolicy.stopped, false);
});

test("fourth patch negative applies before stop and makes four-venue primary thin", async t => {
  const h = setup(t); await firstFour(h, [{ ...primary()[0], lifecycle: "permanently-closed" }]);
  assert.equal(h.state.auditPolicy.mode, "thin"); assert.equal(h.state.auditPolicy.stopped, false);
  assert.equal(h.state.response.venues.filter(v => !v.lifecycle).length, 3);
  await h.clock.tick(1000); assert.equal(h.calls.length, 6);
});

test("fourth patch failure resets zero streak without sacrificing usable primary", async t => {
  const h = setup(t); await h.reply(primary()); await h.clock.tick(2000);
  for (let i = 0; i < 3; i++) { await h.reply(); await h.clock.tick(2000); }
  h.calls.at(-1).reject(new Error("fourth failed")); await flush();
  assert.equal(h.state.auditPolicy.zeroYieldPatches, 0); assert.equal(h.state.auditPolicy.stopped, false);
  assert.equal(h.state.response.venues.length, 4); await h.clock.tick(2000); assert.equal(h.calls.length, 6);
});

for (const action of ["dispose", "location", "category"]) test(`${action} cancels healthy deferred dispatch`, async t => {
  const h = setup(t); await h.reply(primary());
  if (action === "dispose") h.session.dispose();
  else h.update(action === "location" ? { lat: 44 } : { activityTypes: ["park"] });
  const count = h.calls.length; await h.clock.tick(2000);
  assert.equal(h.calls.length, count); assert.ok(h.calls.every(c => !c.q.patchId));
});

test("local exclusion during deferral accelerates existing audit without refetching primary", async t => {
  const h = setup(t); await h.reply(primary());
  h.exclusions.push({ restaurantId: "initial-0", expiresAt: Date.now() + 100000 }); h.update();
  assert.equal(h.calls.length, 2); assert.equal(h.calls[1].at, 0); assert.equal(h.state.auditPolicy.mode, "thin");
  await h.clock.tick(2000); assert.equal(h.calls.length, 2);
});

test("semantic category coverage and genuine Plan applicability use the user's selection", () => {
  const movies = primary(), mixed = [movies[0], movies[1], venue("thrill", { activityTypes: ["escape-room"] }), venue("park", { activityTypes: ["park"] })];
  assert.equal(dateNightHealthyPool(movies, ["movies"], true), true);
  assert.equal(dateNightHealthyPool(movies, ["movies", "park"], true), false);
  assert.equal(dateNightHealthyPool(movies, ["anything"], true), false);
  assert.equal(dateNightHealthyPool(mixed, ["anything"], true), true);
  assert.equal(dateNightHealthyPool(mixed, ["haunted-house"], false), true);
  assert.equal(dateNightHealthyPool(mixed, ["movies", "escape-room"], true), true);
  assert.equal(dateNightHealthyPool([movies[0], movies[1], movies[2], venue("dual", { activityTypes: ["escape-room", "park"] })], ["escape-room", "park"], true), true);
  assert.equal(dateNightHealthyPool([venue("same", { activityTypes: ["escape-room", "park"] })], ["escape-room", "park"], true), false);
});

test("affirmed aliases do not inflate useful-yield count", () => {
  const seen = new Set(); assert.equal(rememberDateNightUsefulIdentities([venue("z")], seen), 1);
  assert.equal(rememberDateNightUsefulIdentities([venue("a", { discoveryEvidence: [{ id: "z" }, { id: "a" }] })], seen), 0);
  assert.equal(rememberDateNightUsefulIdentities([venue("b")], seen), 1);
});

test("actual UI gets four options before healthy audit dispatch", async t => {
  const clock = discoveryClock(t), h = discoveryComponentHarness(discoveryModes[1]); t.after(() => h.dispose());
  h.store.location = { ...base, source: "manual", label: "Control" }; h.store.spookySeasonEnabled = true;
  h.store.setDateNightFilters({ activityTypes: ["movies"], radiusMiles: 50, openNowOnly: false }); h.render();
  h.requests[0].resolve(response(base, primary())); await h.settle();
  assert.equal(h.requests.length, 1); h.button(h.render(), "Give us options").props.onClick();
  assert.equal(h.overlay(h.render(), "OptionsOverlay").props.restaurants.length, 4);
  const ids = h.overlay(h.render(), "OptionsOverlay").props.restaurants.map(v => v.id);
  await clock.tick(2000); assert.equal(h.requests.length, 2);
  h.requests[1].resolve(response({ ...base, patchId: "radial-v1:core" }, [])); await h.settle();
  assert.deepEqual(h.overlay(h.render(), "OptionsOverlay").props.restaurants.map(v => v.id), ids);
});

test("unobserved negative in skipped patch remains a disclosed stale-positive risk, radial reference removes it", async t => {
  const h = setup(t), patches = planDateNightPatches(base, 50); await firstFour(h);
  assert.equal(h.state.response.venues.some(v => v.id === "initial-0" && !v.lifecycle), true);
  const reference = createDateNightRadialSession(); let final; t.after(() => reference.dispose());
  reference.update(base, { request: async q => response(q,
    q.patchId === patches[0].id ? primary() : q.patchId === patches[4].id ? [{ ...primary()[0], lifecycle: "permanently-closed" }] : []),
    onChange: s => { final = s; } });
  await h.clock.tick(40000);
  assert.equal(final.coverage.complete, true);
  assert.equal(final.response.venues.some(v => v.id === "initial-0" && !v.lifecycle), false);
  t.diagnostic(JSON.stringify({ fixture: "skipped-negative", skippedPatch: patches[4].id, stalePositiveId: "initial-0",
    adaptiveEligibleIds: h.state.response.venues.filter(v => !v.lifecycle).map(v => v.id).sort(),
    radialEligibleIds: final.response.venues.filter(v => !v.lifecycle).map(v => v.id).sort(), observedNegativeResurrected: false }));
});

test("expiry at deferred dispatch reclassifies as thin; expired identity cannot support health", async t => {
  const h = setup(t); const rows = primary();
  rows[0].seasonalAvailability = { status: "confirmed", checkedAt: "2026-10-01", seasonYear: 2026,
    activeFrom: "2026-10-01", activeUntil: "2026-10-31", endsAt: new Date(Date.now() + 1000).toISOString().replace(".000", "") };
  rows[0].activityTypes = ["movies", "haunted-house"];
  await h.reply(rows); assert.equal(h.state.phase, "audit-deferred");
  await h.clock.tick(2000); assert.equal(h.state.auditPolicy.mode, "thin");
  await h.reply(); assert.equal(h.state.auditPolicy.zeroYieldPatches, 0);
});

test("filtered-only patch additions have zero useful yield", async t => {
  const h = setup(t); h.preferences["excluded-new"] = { neverRecommend: true };
  const patch = planDateNightPatches(base, 50)[3];
  await firstFour(h, [venue("excluded-new", patch.center)]);
  assert.equal(h.state.auditPolicy.stopped, true); assert.equal(h.state.auditPolicy.zeroYieldPatches, 4);
});

test("partial mixed primary remains immediate recovery despite a rich eligible pool", async t => {
  const h = setup(t, { activityTypes: ["movies", "escape-room"] });
  const c = h.calls[0], r = response(c.q, [...primary(), venue("thrill", { activityTypes: ["escape-room"] })]);
  r.discovery.groups.find(g => g.id === "entertainment").outcome = "failed"; r.discovery.partial = true;
  c.resolve(r); await flush();
  assert.equal(h.calls.length, 2); assert.equal(h.state.auditPolicy.mode, "recovery");
});
