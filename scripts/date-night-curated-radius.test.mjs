import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, deferred, flush } from "./test-support/discovery-clock.mjs";

const load = appModuleLoader();
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const origin = { lat: 39.114053, lon: -94.627463, radiusMiles: 50, halloweenActive: true, activityTypes: ["haunted-house"] };
const targets = ["date-night-ks26-exiled", "date-night-mo26-dark-nightmares-haunted-forest", "date-night-mo26-astra-terror-at-the-ranch"];
const visit = new Date("2026-10-17T01:00:00Z");
const ids = places => places.map(p => p.id);
function setup(t, changes = {}, cacheOptions = {}) {
  const clock = discoveryClock(t), cache = createDateNightRadialCache(cacheOptions);
  const session = createDateNightRadialSession({ cache }), calls = [], states = [];
  let query = { ...origin, ...changes };
  const callbacks = { request(q, signal) { const pending = deferred(); calls.push({ q, signal, ...pending }); return pending.promise; }, onChange: state => states.push(state) };
  const update = (changes = {}) => { query = { ...query, ...changes }; session.update(query, callbacks); };
  const response = (call, venues = [], outcome = "failed") => ({ venues, source: outcome === "failed" ? "fallback" : "merged", patch: { id: call.q.patchId, version: "radial-v1" }, discovery: { partial: false, groups: buildDateNightQueryPlan(call.q.activityTypes, call.q.halloweenActive).map(g => ({ ...g, outcome })) } });
  const eligible = (now = visit, extra = {}) => eligibleDateNight(decorateDateNight(states.at(-1).response?.venues ?? [], query, now), { ...DEFAULT_DATE_NIGHT_FILTERS, ...query, openNowOnly: false, ...extra }, query.halloweenActive, {}, [], now.getTime());
  t.mock.method(console, "warn", () => {});
  t.after(() => session.dispose());
  update();
  return { clock, cache, session, calls, states, update, response, eligible, get state() { return states.at(-1); } };
}
function containsTargets(places) { const found = ids(places); for (const id of targets) assert.ok(found.includes(id), `missing selected-radius curated identity ${id}`); }

test("KC actual handler + controller: failed core retains selected-radius saved identities without outer acquisition", async t => {
  const h = setup(t);
  t.mock.method(globalThis, "fetch", async () => { throw new Error("controlled provider failure"); });
  const data = { ...origin, spookySeasonEnabled: true, patchId: "radial-v1:core" };
  delete data.halloweenActive;
  const pending = searchDateNight({ data });
  await h.clock.tick(15000);
  const result = await pending;
  assert.equal(result.source, "fallback");
  assert.ok(targets.every(id => !ids(result.venues).includes(id)), "preserved server patch ownership isolates the inherited mechanism");
  h.calls[0].resolve(result); await flush();
  containsTargets(h.eligible());
  assert.equal(h.state.coverage.continuousRadiusMiles, 0);
  assert.equal(h.state.paused, true);
  assert.match(h.state.response.warning, /saved|incomplete/i);
  await h.clock.tick(100000);
  assert.equal(h.calls.length, 1, "provider failure cannot cause outer attempts or retry loop");
});

test("15→50→15→50 recomputes exact selected radius without provider retry or false core proof", async t => {
  const h = setup(t, { radiusMiles: 15 });
  h.calls[0].resolve(h.response(h.calls[0])); await flush();
  assert.ok(targets.every(id => !ids(h.eligible()).includes(id)));
  h.update({ radiusMiles: 50 }); containsTargets(h.eligible());
  h.update({ radiusMiles: 15 }); assert.ok(targets.every(id => !ids(h.eligible()).includes(id)));
  h.update({ radiusMiles: 50 }); containsTargets(h.eligible());
  assert.equal(h.calls.length, 1);
  assert.equal(h.state.coverage.complete, false);
});

test("20/30/40-mile selections admit only the KC targets inside the actual distance and preserve stable IDs", async t => {
  const h = setup(t, { radiusMiles: 15 });
  h.calls[0].resolve(h.response(h.calls[0])); await flush();
  for (const [radiusMiles, expected] of [[20, targets.slice(0, 1)], [30, targets.slice(0, 2)], [40, targets]]) {
    h.update({ radiusMiles });
    assert.deepEqual(ids(h.eligible()).filter(id => targets.includes(id)).sort(), [...expected].sort());
    assert.equal(new Set(ids(h.eligible())).size, h.eligible().length);
    assert.ok(h.eligible().every(p => p.distanceMiles <= radiusMiles));
  }
  assert.equal(h.calls.length, 1);
});

test("transport error and watchdog failure expose saved identities with honest incomplete coverage", async t => {
  const h = setup(t);
  h.calls[0].reject(new Error("controlled transport failure")); await flush();
  containsTargets(h.eligible());
  assert.equal(h.state.coverage.complete, false);
  assert.match(h.state.response.warning, /saved|incomplete/i);
  h.update({ lat: origin.lat + 0.001 });
  await h.clock.tick(25000);
  containsTargets(h.eligible());
  assert.equal(h.calls.at(-1).signal.aborted, true);
  assert.equal(h.state.coverage.complete, false);
});

test("relocation cancels old requests and rejects late saved records from a different origin", async t => {
  const h = setup(t);
  const old = h.calls[0];
  h.update({ lat: 37.176447, lon: -94.310223 });
  assert.equal(old.signal.aborted, true);
  old.resolve(h.response(old, targets.map(getCuratedSeasonalPlace))); await flush();
  assert.equal(h.state.response, null);
  h.calls[1].resolve(h.response(h.calls[1])); await flush();
  assert.ok(targets.every(id => !ids(h.eligible()).includes(id)));
});

test("saved-radius additions preserve source-bound expiry, conservative Open Now, seasonal off and type filters", async t => {
  const h = setup(t);
  h.calls[0].resolve(h.response(h.calls[0])); await flush();
  containsTargets(h.eligible());
  assert.ok(targets.every(id => !ids(h.eligible(visit, { openNowOnly: true })).includes(id)));
  assert.ok(targets.every(id => !ids(h.eligible(new Date("2026-11-03T12:00:00Z"))).includes(id)));
  for (const id of targets) {
    const expiry = new Date(getCuratedSeasonalPlace(id).seasonalAvailability.listingExpiresAt);
    assert.ok(!ids(h.eligible(expiry)).includes(id), `${id} expires at source bound`);
  }
  h.update({ activityTypes: ["movies"] });
  assert.ok(targets.every(id => !ids(h.eligible()).includes(id)));
  h.update({ halloweenActive: false, activityTypes: ["anything"] });
  h.calls.at(-1).resolve(h.response(h.calls.at(-1))); await flush();
  assert.ok(ids(h.eligible()).includes(targets[0]), "Exiled's reviewed listing-lifecycle visibility is intentionally independent of Spooky");
  assert.ok(targets.slice(1).every(id => !ids(h.eligible()).includes(id)));
});

test("cached successful core still composes saved selected-radius candidates without pretending outer coverage", async t => {
  const h = setup(t, { radiusMiles: 15 });
  h.calls[0].resolve(h.response(h.calls[0], [], "succeeded-empty")); await flush();
  h.update({ radiusMiles: 50 });
  containsTargets(h.eligible());
  assert.equal(h.state.coverage.continuousRadiusMiles, 15);
  assert.equal(h.calls.length, 1);
  await h.clock.tick(250);
  assert.equal(h.calls.length, 2, "existing outer acquisition pacing is preserved");
});

test("negative provider lifecycle evidence dominates selected-radius saved identity", async t => {
  const h = setup(t);
  const closed = { ...getCuratedSeasonalPlace(targets[0]), lifecycle: "permanently-closed" };
  h.calls[0].resolve(h.response(h.calls[0], [closed], "succeeded-nonempty")); await flush();
  assert.ok(!ids(h.eligible()).includes(targets[0]));
  for (const id of targets.slice(1)) assert.ok(ids(h.eligible()).includes(id));
});

test("evicting negative provider evidence cannot regenerate a known closed curated identity", async t => {
  const h = setup(t, {}, { maxEntries: 2 });
  const closed = { ...getCuratedSeasonalPlace(targets[0]), lifecycle: "permanently-closed" };
  h.calls[0].resolve(h.response(h.calls[0], [closed], "succeeded-nonempty")); await flush();
  for (let i = 0; i < 2; i++) {
    await h.clock.tick(1000);
    h.calls.at(-1).resolve(h.response(h.calls.at(-1), [], "succeeded-empty")); await flush();
  }
  assert.ok(!ids(h.eligible()).includes(targets[0]), "static saved composition must respect negative retirement after cache eviction");
});
