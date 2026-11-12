import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { deferred, discoveryClock, flush } from "./test-support/discovery-clock.mjs";

const load = appModuleLoader();
const { createDateNightDiscoveryCache, combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { decorateDateNight } = load("src/lib/date-night/eligibility.ts");
const { mergeDateNight } = load("src/lib/date-night/identity.ts");
const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load("src/lib/date-night/christmas-binding.ts");
const recorded = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8")).element;
const parkId = "date-night-osm-way-987588580";
const query = { ...recorded.center, radiusMiles: 15, halloweenActive: false, activityTypes: ["park"] };
const reviewedEvidence = {
  id: parkId, source: "osm", activityTypes: ["park"], openingHours: null, website: null,
  sourceIdentity: { objectType: "way", objectId: recorded.id, version: recorded.version, changeset: recorded.changeset,
    name: "Central Park", address: "305 West Chestnut Street, Carthage, MO, 64836", classification: { leisure: "park" } },
};
// Synthetic contrary source observation: no eligible school venue is created.
const schoolEvidence = { ...reviewedEvidence, activityTypes: [], sourceIdentity: {
  ...reviewedEvidence.sourceIdentity, version: 3, changeset: 189037688, classification: { amenity: "school" },
} };
const park = {
  id: parkId, name: "Central Park", ...recorded.center, address: reviewedEvidence.sourceIdentity.address,
  cuisines: ["other"], cuisineLabel: "Park", priceLevel: null, rating: null, reviewCount: null,
  openingHours: null, phone: null, website: null, isChain: false, photoKey: "cafe", source: "osm",
  activityTypes: ["park"], moodLevel: 1, discoveryEvidence: [reviewedEvidence],
};
const packet = (q, venues = [], identityObservations = []) => ({
  venues, identityObservations, source: "live",
  ...(q.patchId ? { patch: { id: q.patchId, version: "radial-v1" } } : {}),
  discovery: { partial: false, groups: buildDateNightQueryPlan(q.activityTypes, q.halloweenActive)
    .map(group => ({ ...group, outcome: venues.length ? "succeeded-nonempty" : "succeeded-empty" })) },
});
const bind = response => resolveChristmasParkBinding(decorateDateNight(response?.venues ?? [], query), REVIEWED_CHRISTMAS_BINDINGS).state;
const movies = { ...query, activityTypes: ["movies"] };

for (const reverse of [false, true]) test(`cache retains rejected classification across category arrivals (${reverse ? "school first" : "park first"})`, () => {
  const cache = createDateNightDiscoveryCache();
  const inputs = [[query, packet(query, [park], [reviewedEvidence])], [movies, packet(movies, [], [schoolEvidence])]];
  if (reverse) inputs.reverse();
  for (const [q, result] of inputs) assert.equal(cache.store(q, result), true);
  const snapshot = cache.read(query);
  assert.equal(snapshot.response.venues.filter(place => place.id === parkId).length, 1);
  assert.equal(snapshot.identityObservations.length, 2);
  assert.equal(bind(snapshot.response), "conflicting-source");
  assert.deepEqual(snapshot.response.venues[0].activityTypes, ["park"]);
  assert.equal(cache.read(movies).response.venues.length, 0, "observation is never an ordinary school choice");
});

test("school-only cache snapshot carries its evidence into fresh park assembly without claiming park coverage", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(movies, packet(movies, [], [schoolEvidence]));
  const snapshot = cache.read(query);
  assert.equal(snapshot.response, null);
  assert.deepEqual(snapshot.missingActivityTypes, ["park"]);
  assert.equal(snapshot.identityObservations.length, 1);
  const combined = combineDateNightDiscovery(snapshot, packet(query, [park], [reviewedEvidence]));
  assert.equal(bind(combined), "conflicting-source");
});

test("radial assembly retains contrary observations from a non-owning patch without creating a venue or expanding radius", () => {
  const radialQuery = { ...query, radiusMiles: 20 };
  const patches = planDateNightPatches(radialQuery, 20);
  const core = { ...radialQuery, patchId: patches[0].id };
  const outer = { ...radialQuery, patchId: patches[1].id };
  const cache = createDateNightRadialCache();
  assert.equal(cache.store(core, packet(core, [park], [reviewedEvidence])), true);
  assert.equal(cache.store(outer, packet(outer, [], [schoolEvidence])), true);
  const state = cache.read({ ...radialQuery, radiusMiles: 1 });
  assert.equal(state.response.venues.filter(place => place.id === parkId).length, 1);
  assert.equal(bind(state.response), "conflicting-source");
  assert.equal(state.coverage.continuousRadiusMiles, 1);
});

test("observation eviction cannot resurrect a conflicting retained park; a new acquisition is required", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ maxEntries: 2, now: () => now });
  cache.store(query, packet(query, [park], [reviewedEvidence]));
  now++;
  cache.store(movies, packet(movies, [], [schoolEvidence]));
  cache.read(query); // Keep the older positive recently used; evict the contrary packet first.
  now++;
  const museum = { ...query, activityTypes: ["museum"] };
  cache.store(museum, packet(museum));
  const retired = cache.read(query).response;
  assert.equal(retired.venues.length, 1, "ordinary park remains available after proof eviction");
  assert.equal(bind(retired), "conflicting-source");
  now++;
  cache.store(query, packet(query, [park], [reviewedEvidence]));
  assert.equal(bind(cache.read(query).response), "bound", "explicit new provider acquisition can establish fresh evidence");
});

test("expiry of contrary proof cannot leave its stale positive bound and evidence stays location-scoped", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ ttlMs: 100, now: () => now });
  cache.store(movies, packet(movies, [], [schoolEvidence]));
  now = 50;
  cache.store(query, packet(query, [park], [reviewedEvidence]));
  const elsewhere = { ...query, lat: query.lat + 0.001 };
  cache.store(elsewhere, packet(elsewhere, [park], [reviewedEvidence]));
  assert.equal(bind(cache.read(query).response), "conflicting-source");
  assert.equal(bind(cache.read(elsewhere).response), "bound");
  now = 101;
  const retired = cache.read(query).response;
  assert.equal(retired.venues.length, 1, "ordinary park remains available after proof expiry");
  assert.equal(bind(retired), "conflicting-source");
  assert.equal(bind(cache.read(elsewhere).response), "bound");
});

test("retiring an older revision preserves a fresh ordinary park and actual observed revision facts", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ ttlMs: 100, now: () => now });
  const older = { ...reviewedEvidence, sourceIdentity: { ...reviewedEvidence.sourceIdentity, version: 1, changeset: 189037686 } };
  cache.store(movies, packet(movies, [], [older]));
  now = 50;
  cache.store(query, packet(query, [park], [reviewedEvidence]));
  now = 101;
  const retired = cache.read(query).response;
  assert.equal(retired.venues.length, 1);
  const { discoveryEvidence, ...ordinary } = retired.venues[0];
  const { discoveryEvidence: _original, ...expected } = park;
  assert.deepEqual(ordinary, expected, "name, address, location, ordinary fields and classification survive");
  assert.deepEqual(discoveryEvidence.map(evidence => evidence.sourceIdentity?.version).sort(), [1, 2]);
  assert.equal(bind(retired), "stale-source");
});

for (const retirement of ["expiry", "eviction"]) test(`legacy display-only evidence cannot rebound after contrary observation ${retirement}`, async t => {
  discoveryClock(t);
  let now = 0;
  const cache = createDateNightRadialCache({ ttlMs: 100, maxEntries: 1, now: () => now });
  const core = planDateNightPatches(query, query.radiusMiles)[0].id;
  const schoolQuery = { ...movies, patchId: core };
  cache.store(schoolQuery, packet(schoolQuery, [], [schoolEvidence]));
  const requests = [], updates = [];
  const session = createDateNightRadialSession({ cache, now: () => now });
  t.after(() => session.dispose());
  const callbacks = { request: q => {
    const pending = deferred(); requests.push({ q, ...pending }); return pending.promise;
  }, onChange: state => updates.push(state) };
  session.update(query, callbacks);
  await flush();
  requests[0].resolve({ source: "live", venues: [park] });
  await flush();
  assert.equal(bind(updates.at(-1).response), "conflicting-source");
  if (retirement === "expiry") now = 101;
  else {
    const museum = { ...query, patchId: core, activityTypes: ["museum"] };
    cache.store(museum, packet(museum));
  }
  session.update(query, { ...callbacks, retryVersion: 1 });
  await flush();
  assert.equal(requests.length, 2, "refresh is pending while the previous result remains displayed");
  const retired = updates.at(-1).response;
  assert.equal(retired.venues.filter(venue => venue.id === parkId).length, 1, "ordinary park is preserved");
  assert.equal(bind(retired), "conflicting-source", "expired or evicted standalone proof cannot authorize a retained legacy result");
  assert.deepEqual(retired.venues.find(venue => venue.id === parkId).discoveryEvidence
    .map(evidence => evidence.sourceIdentity?.version).sort(), [2, 3], "actual observed source facts survive");
  requests[1].resolve({ source: "live", venues: [park] });
  await flush();
  assert.equal(bind(updates.at(-1).response), "bound", "a genuine new acquisition replaces the retired binding authority");
});

for (const [scope, change] of [["location", { lat: query.lat + 0.001 }], ["season", { halloweenActive: true }], ["semantics", { semanticVersion: "unrelated-discovery-version" }]]) {
  test(`retiring observation authority cannot change legacy presentation from another ${scope}`, async t => {
    discoveryClock(t);
    let now = 0;
    const cache = createDateNightRadialCache({ ttlMs: 100, now: () => now });
    const schoolQuery = { ...movies, ...change, patchId: planDateNightPatches(query, query.radiusMiles)[0].id };
    cache.store(schoolQuery, packet(schoolQuery, [], [schoolEvidence]));
    const requests = [], updates = [];
    const session = createDateNightRadialSession({ cache, now: () => now });
    t.after(() => session.dispose());
    const callbacks = { request: q => {
      const pending = deferred(); requests.push({ q, ...pending }); return pending.promise;
    }, onChange: state => updates.push(state) };
    session.update(query, callbacks);
    await flush();
    requests[0].resolve({ source: "live", venues: [park] });
    await flush();
    assert.equal(bind(updates.at(-1).response), "bound");
    now = 101;
    session.update(query, { ...callbacks, retryVersion: 1 });
    await flush();
    assert.equal(bind(updates.at(-1).response), "bound");
  });
}

test("oversized observation packets are rejected rather than truncating contrary evidence", () => {
  const cache = createDateNightDiscoveryCache({ maxVenues: 1 });
  assert.equal(cache.store(query, packet(query, [park], [reviewedEvidence, schoolEvidence])), false);
  assert.equal(cache.read(query).response, null);
});

test("cache evidence budget includes embedded facts and evicts whole entries without truncation", () => {
  const cache = createDateNightDiscoveryCache({ maxVenues: 2 });
  cache.store(query, packet(query, [park], [reviewedEvidence]));
  cache.store(movies, packet(movies, [], [schoolEvidence]));
  assert.equal(cache.read(query).response, null, "the complete older entry is evicted when attached evidence exhausts capacity");
  const retained = cache.read(movies);
  assert.equal(retained.response.venues.length, 0);
  assert.deepEqual(retained.identityObservations, [schoolEvidence], "remaining proof is complete");
});

test("legacy evidence accumulated across TTL is bounded, preserves ordinary facts, and withholds overflowed binding", async t => {
  discoveryClock(t);
  let now = 0;
  const cache = createDateNightRadialCache({ ttlMs: 100, now: () => now });
  const schoolQuery = { ...movies, patchId: planDateNightPatches(query, query.radiusMiles)[0].id };
  const batch = start => Array.from({ length: 10_000 }, (_, index) => ({ ...schoolEvidence,
    sourceIdentity: { ...schoolEvidence.sourceIdentity, version: start + index, changeset: 190000000 + start + index } }));
  cache.store(schoolQuery, packet(schoolQuery, [], batch(3)));
  const requests = [], updates = [];
  const session = createDateNightRadialSession({ cache, now: () => now });
  t.after(() => session.dispose());
  const callbacks = { request: q => {
    const pending = deferred(); requests.push({ q, ...pending }); return pending.promise;
  }, onChange: state => updates.push(state) };
  session.update(query, callbacks);
  await flush();
  requests[0].resolve({ source: "live", venues: [park] });
  await flush();
  assert.equal(updates.at(-1).response.venues.find(venue => venue.id === parkId).discoveryEvidence.length, 10_001);
  now = 101;
  cache.store(schoolQuery, packet(schoolQuery, [], batch(10_003)));
  session.update(query, { ...callbacks, retryVersion: 1 });
  await flush();
  const retained = updates.at(-1).response.venues.find(venue => venue.id === parkId);
  assert.equal(retained.discoveryEvidence.length, 20_000);
  assert.equal(retained.identityObservationOverflow, true);
  assert.equal(retained.discoveryEvidence.some(evidence => evidence.sourceIdentity?.version === 2), true, "reviewed facts were not rewritten");
  assert.equal(retained.name, park.name);
  assert.deepEqual(retained.activityTypes, park.activityTypes);
  const verdict = resolveChristmasParkBinding(decorateDateNight([retained], query), REVIEWED_CHRISTMAS_BINDINGS);
  assert.equal(verdict.state, "conflicting-source");
  assert.match(verdict.reason, /bounded capacity/);
  for (const order of [[retained, park], [park, retained]]) {
    const merged = mergeDateNight(order, []);
    assert.equal(merged.length, 1);
    assert.equal(merged[0].identityObservationOverflow, true, "merging an ordinary alias cannot restore overflowed binding authority");
    assert.ok(merged[0].discoveryEvidence.length <= 20_000);
    assert.equal(bind({ venues: merged }), "conflicting-source");
  }
  now = 202;
  requests[1].resolve({ source: "live", venues: [park] });
  await flush();
  assert.equal(bind(updates.at(-1).response), "bound", "only a fresh acquisition can replace overflowed authority");
});

test("cancelled request observations cannot leak into a new location's radial session", async t => {
  const clock = discoveryClock(t);
  const requests = [], updates = [];
  const session = createDateNightRadialSession();
  t.after(() => session.dispose());
  const callbacks = { request: (q, signal) => {
    const pending = deferred(); requests.push({ q, signal, ...pending }); return pending.promise;
  }, onChange: state => updates.push(state) };
  session.update(query, callbacks);
  await flush();
  const elsewhere = { ...query, lat: query.lat + 0.001 };
  session.update(elsewhere, callbacks);
  await flush();
  assert.equal(requests.length, 2);
  assert.equal(requests[0].signal.aborted, true);
  requests[1].resolve(packet(requests[1].q, [park], [reviewedEvidence]));
  await flush();
  requests[0].resolve(packet(requests[0].q, [], [schoolEvidence]));
  await flush(); await clock.tick(1);
  assert.equal(bind(updates.at(-1).response), "bound");
  assert.equal(updates.at(-1).response.identityObservations.some(item => item.sourceIdentity?.version === 3), false);
});
