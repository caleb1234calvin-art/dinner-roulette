import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { deferred, discoveryClock, flush } from "./test-support/discovery-clock.mjs";

// Invoke this same file with cwd set to the immutable d933 checkout for before
// controls. Fixtures describe epistemic loss, never a fabricated OSM negative.
const load = appModuleLoader();
const { createDateNightDiscoveryCache, combineDateNightDiscovery, failedDateNightAcquisition } = load("src/lib/date-night/cache.ts");
const { createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load("src/lib/date-night/christmas-binding.ts");
const recorded = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8")).element;
const parkId = "date-night-osm-way-987588580";
const query = { ...recorded.center, radiusMiles: 15, halloweenActive: false, activityTypes: ["park"] };
const movies = { ...query, activityTypes: ["movies"] };
const combined = { ...query, activityTypes: ["movies", "park"] };
const core = "radial-v1:core";
const evidence = { id: parkId, source: "osm", activityTypes: ["park"], openingHours: null, website: null,
  sourceIdentity: { objectType: "way", objectId: recorded.id, version: recorded.version, changeset: recorded.changeset,
    name: "Central Park", address: "305 West Chestnut Street, Carthage, MO, 64836", classification: { leisure: "park" } } };
const park = { id: parkId, name: "Central Park", ...recorded.center, address: evidence.sourceIdentity.address,
  cuisines: ["other"], cuisineLabel: "Park", priceLevel: null, rating: null, reviewCount: null,
  openingHours: null, phone: null, website: null, isChain: false, photoKey: "cafe", source: "osm",
  activityTypes: ["park"], moodLevel: 1, discoveryEvidence: [evidence] };
const scope = q => ({ lat: q.lat, lon: q.lon, halloweenActive: q.halloweenActive,
  semanticVersion: q.semanticVersion ?? (q.patchId ? "radial-v1" : "date-night-groups-v1"),
  ...(q.patchId ? { patchId: q.patchId } : {}), radiusMiles: q.patchId ? 0 : Math.max(15, Math.min(50, q.radiusMiles)) });
const uncertainty = q => ({ scopes: [{ scope: scope(q), activityTypes: q.activityTypes }] });
const packet = (q, venues = [park], failedTypes = []) => ({ venues, source: "live",
  identityObservations: venues.flatMap(row => row.discoveryEvidence ?? []),
  ...(q.patchId ? { patch: { id: q.patchId, version: "radial-v1" } } : {}),
  ...(failedTypes.length ? { identityUncertainty: uncertainty({ ...q, activityTypes: failedTypes }) }
    : { identityEvidenceCoverage: { scope: scope(q), activityTypes: q.activityTypes } }),
  discovery: { partial: failedTypes.length > 0,
    groups: buildDateNightQueryPlan(q.activityTypes, q.halloweenActive).map(group => ({ ...group,
      outcome: group.activityTypes.some(type => failedTypes.includes(type)) ? "failed" : venues.length ? "succeeded-nonempty" : "succeeded-empty" })) } });
const failure = q => ({ ...packet(q, [], q.activityTypes), source: "fallback" });
const bind = response => resolveChristmasParkBinding(decorateDateNight(response?.venues ?? [], query), REVIEWED_CHRISTMAS_BINDINGS).state;
const blocked = response => assert.equal(bind(response), "incomplete-source-evidence");

function ordinaryParkRetained(response) {
  const row = response.venues.find(venue => venue.id === parkId);
  assert.ok(row);
  const { identityUncertainty: _uncertainty, ...ordinary } = row;
  assert.deepEqual(ordinary, park, "uncertainty cannot fabricate source facts or alter the ordinary park");
  assert.equal(row.lifecycle, undefined);
  assert.equal(response.venues.some(venue => venue.activityTypes.includes("school")), false);
  const now = new Date("2026-12-04T18:00:00-06:00");
  assert.equal(eligibleDateNight(decorateDateNight([row], query, now), {
    ...DEFAULT_DATE_NIGHT_FILTERS, activityTypes: ["park"], radiusMiles: 15, openNowOnly: false,
  }, false, {}, [], now.getTime()).length, 1, "ordinary Date Night eligibility remains functional");
}

test("partial-group uncertainty reaches ordinary cache without changing successful coverage or park facts", () => {
  const cache = createDateNightDiscoveryCache();
  assert.equal(cache.store(combined, packet(combined, [park], ["movies"])), true);
  const state = cache.read(combined);
  blocked(state.response); ordinaryParkRetained(state.response);
  assert.deepEqual(state.missingActivityTypes, ["movies"]);
  assert.equal(state.response.identityEvidenceCoverage, undefined, "cache assemblies cannot claim fresh evidence");
});

test("gap-only exhausted fallback protects an existing reviewed park without acquiring coverage", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(query, packet(query));
  assert.equal(cache.store(movies, failure(movies)), false);
  blocked(cache.read(query).response); ordinaryParkRetained(cache.read(query).response);
  assert.equal(cache.read(movies).response, null);
  assert.deepEqual(cache.read(movies).missingActivityTypes, ["movies"]);
});

for (const retirement of ["ttl", "lru"]) test(`no-row gap survives ${retirement} before the first park response arrives`, () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now, ttlMs: 100, maxEntries: 1 });
  cache.store(movies, failure(movies));
  if (retirement === "ttl") now = 101;
  else {
    const elsewhere = { ...query, lat: query.lat + 1 };
    cache.store(elsewhere, packet(elsewhere, []));
  }
  cache.store(query, packet(query));
  blocked(cache.read(query).response);
  ordinaryParkRetained(cache.read(query).response);
});

for (const retirement of ["ttl", "lru"]) test(`uncertainty survives ${retirement} and an ordinary-only refresh cannot discharge a lost culture group`, () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now, ttlMs: 100, maxEntries: 1 });
  cache.store(combined, packet(combined, [park], ["movies"]));
  if (retirement === "ttl") now = 101;
  else {
    const elsewhere = { ...query, lat: query.lat + 1 };
    cache.store(elsewhere, packet(elsewhere, []));
  }
  cache.store(query, packet(query));
  blocked(cache.read(query).response);
  cache.store(combined, packet(combined));
  assert.equal(bind(cache.read(query).response), "bound", "complete scope plus fresh reviewed ID restores authority");
});

test("complete empty culture settles its obligation but only fresh park proof can rehabilitate the old row", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(combined, packet(combined, [park], ["movies"]));
  cache.store(movies, packet(movies, []));
  blocked(cache.read(query).response);
  assert.equal(cache.read(query).identityUncertainty, undefined, "global acquisition gap is resolved separately from row proof");
  cache.store(query, packet(query));
  assert.equal(bind(cache.read(query).response), "bound");
});

for (const kind of ["legacy", "cached", "wrong origin", "wrong query category", "missing source revision", "distant coverage"]) {
  test(`a ${kind} replacement cannot erase a retained row gap after global completion`, () => {
    const cache = createDateNightDiscoveryCache();
    cache.store(combined, packet(combined, [park], ["movies"]));
    cache.store(movies, packet(movies, []));
    let replacement = packet(query);
    if (kind === "legacy") delete replacement.identityEvidenceCoverage;
    if (kind === "cached") replacement.discovery.groups = replacement.discovery.groups.map(group => ({
      ...group, outcome: "cache-hit", originOutcome: "succeeded-nonempty",
    }));
    if (kind === "wrong origin") replacement = packet({ ...query, lat: query.lat + 1 });
    if (kind === "missing source revision") replacement.venues = [{ ...park, discoveryEvidence: [{
      ...evidence, sourceIdentity: { ...evidence.sourceIdentity, version: undefined },
    }] }];
    const distant = { ...query, lat: query.lat + 1 };
    if (kind === "distant coverage") replacement = packet(distant);
    cache.store(kind === "distant coverage" ? distant : kind === "wrong query category" ? movies : query, replacement);
    blocked(cache.read(query).response);
    cache.store(query, packet(query));
    assert.equal(bind(cache.read(query).response), "bound");
  });
}

for (const kind of ["wrong patch", "missing claimed patch"]) test(`${kind} rejection retains uncertainty on an already bound core`, () => {
  const cache = createDateNightRadialCache();
  const q = { ...query, patchId: core };
  cache.store(q, packet(q));
  assert.equal(bind(cache.read(query).response), "bound");
  const rejected = packet(q);
  if (kind === "wrong patch") rejected.patch.id = "radial-v1:20:0";
  else delete rejected.patch;
  assert.equal(cache.store(q, rejected), false);
  blocked(cache.read(query).response);
  ordinaryParkRetained(cache.read(query).response);
  cache.store(q, packet(q));
  assert.equal(bind(cache.read(query).response), "bound");
});

for (const [name, patch] of [
  ["location", { lat: query.lat + 1 }], ["season", { halloweenActive: true }],
  ["semantics", { semanticVersion: "unrelated-proof" }],
]) test(`${name}-mismatched complete evidence cannot resolve this uncertainty`, () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(movies, failure(movies));
  const elsewhere = { ...combined, ...patch };
  cache.store(elsewhere, packet(elsewhere));
  cache.store(query, packet(query));
  blocked(cache.read(query).response);
  blocked(cache.read(elsewhere).response, "another acquisition descriptor cannot erase the same canonical park's missing source");
});

test("a nearby origin cannot hide a lost provider footprint and distant unrelated venues remain usable", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(movies, failure(movies));
  const nearby = { ...query, lat: query.lat + 0.001 };
  cache.store(nearby, packet(nearby));
  blocked(cache.read(nearby).response);
  const nearbyComplete = { ...nearby, activityTypes: ["movies", "park"] };
  cache.store(nearbyComplete, packet(nearbyComplete));
  blocked(cache.read(nearby).response, "fresh evidence at another origin does not discharge the original footprint");
  cache.store(combined, packet(combined));
  assert.equal(bind(cache.read(query).response), "bound");

  const distant = createDateNightDiscoveryCache();
  const elsewhere = { ...movies, lat: query.lat + 1 };
  distant.store(elsewhere, failure(elsewhere));
  distant.store(query, packet(query));
  assert.equal(bind(distant.read(query).response), "bound");
});

for (const retirement of ["ttl", "lru", "nearby origin", "changed coordinates"]) test(`own-ID proof obligation survives ${retirement} after complete empty culture`, () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now, ttlMs: 100, maxEntries: 2 });
  cache.store(combined, packet(combined, [park], ["movies"]));
  cache.store(movies, packet(movies, []));
  assert.equal(cache.read(query).identityUncertainty, undefined);
  blocked(cache.read(query).response);
  if (retirement === "ttl") now = 101;
  if (retirement === "lru") {
    const elsewhere = { ...query, lat: query.lat + 1 };
    cache.store(elsewhere, packet(elsewhere, []));
    cache.store({ ...elsewhere, activityTypes: ["museum"] }, packet({ ...elsewhere, activityTypes: ["museum"] }, []));
  }
  const refreshed = retirement === "nearby origin" ? { ...query, lat: query.lat + 0.001 } : query;
  const opaque = packet(refreshed);
  delete opaque.identityEvidenceCoverage;
  if (retirement === "changed coordinates") opaque.venues = [{ ...park, lat: park.lat + 1 }];
  cache.store(refreshed, opaque);
  blocked(cache.read(refreshed).response);
  cache.store(refreshed, packet(refreshed));
  assert.equal(bind(cache.read(refreshed).response), "bound", "fresh complete own-ID proof resolves the retained obligation");
});

test("own-ID obligation capacity fails closed without fabricating a source observation", () => {
  const cache = createDateNightDiscoveryCache({ maxVenues: 1 });
  cache.store(combined, packet(combined, [park], ["movies"]));
  const otherId = "date-night-osm-way-987588581";
  const other = { ...park, id: otherId, name: "Another ordinary park", discoveryEvidence: [{
    ...evidence, id: otherId, sourceIdentity: { ...evidence.sourceIdentity, objectId: 987588581, name: "Another ordinary park" },
  }] };
  cache.store(query, packet(query, [other]));
  cache.store(combined, packet(combined));
  const state = cache.read(query);
  blocked(state.response);
  assert.equal(state.identityUncertainty.overflow, true);
  assert.deepEqual(state.response.identityObservations, [evidence]);
  ordinaryParkRetained(state.response);
});

test("narrower legacy disk and different radial patch cannot discharge an exhausted footprint", () => {
  const cache = createDateNightDiscoveryCache();
  const wide = { ...movies, radiusMiles: 30 };
  cache.store(wide, failure(wide));
  cache.store(combined, packet(combined));
  blocked(cache.read(query).response);
  const wideComplete = { ...combined, radiusMiles: 30 };
  cache.store(wideComplete, packet(wideComplete));
  assert.equal(bind(cache.read(query).response), "bound");
  const radial = createDateNightRadialCache();
  const origin = { ...combined, radiusMiles: 20, patchId: core };
  const outer = { ...origin, patchId: "radial-v1:20:0" };
  radial.store(origin, packet(origin, [park], ["movies"]));
  radial.store(outer, packet(outer, []));
  blocked(radial.read(origin).response);
  radial.store(origin, packet(origin));
  assert.equal(bind(radial.read(origin).response), "bound");
});

test("a forged completion scope or cached response cannot resolve exhausted source evidence", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(combined, packet(combined, [park], ["movies"]));
  const museum = { ...query, activityTypes: ["museum"] };
  const forged = packet(museum, []);
  forged.identityEvidenceCoverage = { scope: scope(combined), activityTypes: ["movies", "park"] };
  cache.store(museum, forged);
  blocked(cache.read(query).response);
  const cached = packet(combined);
  cached.discovery.groups = cached.discovery.groups.map(group => ({ ...group, outcome: "cache-hit", originOutcome: "succeeded-nonempty" }));
  cache.store(combined, cached);
  blocked(cache.read(query).response);
  const wrongOrigin = packet({ ...combined, lat: query.lat + 1 });
  cache.store(combined, wrongOrigin);
  blocked(cache.read(query).response);
});

test("bounded uncertainty capacity fails closed rather than forgetting older unobserved scopes", () => {
  const cache = createDateNightDiscoveryCache();
  for (let i = 0; i < 129; i++) {
    const q = { ...movies, lat: query.lat + i / 1000 };
    cache.store(q, failure(q));
  }
  cache.store(query, packet(query));
  const state = cache.read(query);
  blocked(state.response);
  assert.equal(state.identityUncertainty.overflow, true);
  assert.ok(state.identityUncertainty.scopes.length <= 128);
  ordinaryParkRetained(state.response);
});

test("fresh and snapshot composition retain uncertainty and never expose fresh coverage on assembled views", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(combined, packet(combined, [park], ["movies"]));
  const snapshot = cache.read(query);
  blocked(combineDateNightDiscovery(snapshot, packet(query)));
  const complete = combineDateNightDiscovery(snapshot, packet(combined));
  assert.equal(bind(complete), "bound");
  assert.equal(complete.identityEvidenceCoverage, undefined);
});

test("radial transport failure retires identity authority while ordinary retained discovery remains usable", async t => {
  discoveryClock(t);
  const requests = [], updates = [];
  const session = createDateNightRadialSession();
  t.after(() => session.dispose());
  const callbacks = { request: q => { const pending = deferred(); requests.push({ q, ...pending }); return pending.promise; }, onChange: state => updates.push(state) };
  session.update(query, callbacks); await flush();
  requests[0].resolve(packet(requests[0].q)); await flush();
  assert.equal(bind(updates.at(-1).response), "bound");
  session.update(combined, callbacks); await flush();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].q.activityTypes, ["movies"]);
  requests[1].reject(new Error("Exhausted provider group")); await flush();
  blocked(updates.at(-1).response); ordinaryParkRetained(updates.at(-1).response);
  assert.equal(updates.at(-1).response.identityEvidenceCoverage, undefined);
  session.update(combined, { ...callbacks, retryVersion: 1 }); await flush();
  requests[2].resolve(packet(requests[2].q, [])); await flush();
  blocked(updates.at(-1).response, "complete empty culture cannot refresh retained park metadata");
});

test("legacy display-only refresh cannot erase uncertainty after its standalone registry obligation resolves", async t => {
  discoveryClock(t);
  const requests = [], updates = [];
  const cache = createDateNightRadialCache();
  const session = createDateNightRadialSession({ cache });
  t.after(() => session.dispose());
  const callbacks = { request: q => { const pending = deferred(); requests.push({ q, ...pending }); return pending.promise; }, onChange: state => updates.push(state) };
  session.update(query, callbacks); await flush();
  requests[0].resolve({ source: "live", venues: [park] }); await flush();
  assert.equal(bind(updates.at(-1).response), "bound");
  const failed = { ...movies, patchId: core };
  cache.store(failed, failure(failed));
  session.update(query, { ...callbacks, retryVersion: 1 }); await flush();
  blocked(updates.at(-1).response);
  cache.store(failed, packet(failed, []));
  requests[1].resolve({ source: "live", venues: [park] }); await flush();
  blocked(updates.at(-1).response, "a legacy response lacks completion authority");
  session.update(query, { ...callbacks, retryVersion: 2 }); await flush();
  requests[2].resolve(packet(requests[2].q)); await flush();
  assert.equal(bind(updates.at(-1).response), "bound", "adequate fresh source proof restores availability");
});

test("wrong-origin fresh claims cannot move a retained display gap into an apparently complete cache row", async t => {
  discoveryClock(t);
  let now = 0;
  const requests = [], updates = [];
  const cache = createDateNightRadialCache({ ttlMs: 100, now: () => now });
  const session = createDateNightRadialSession({ cache, now: () => now });
  t.after(() => session.dispose());
  const callbacks = { request: q => { const pending = deferred(); requests.push({ q, ...pending }); return pending.promise; }, onChange: state => updates.push(state) };
  session.update(query, callbacks); await flush();
  requests[0].resolve({ source: "live", venues: [park] }); await flush();
  const failed = { ...movies, patchId: core };
  cache.store(failed, failure(failed));
  session.update(query, { ...callbacks, retryVersion: 1 }); await flush();
  blocked(updates.at(-1).response);
  cache.store(failed, packet(failed, []));
  requests[1].resolve(packet({ ...requests[1].q, lat: query.lat + 1 })); await flush();
  blocked(updates.at(-1).response);
  blocked(cache.read(query).response);
  now = 101;
  session.update(query, { ...callbacks, retryVersion: 2 }); await flush();
  requests[2].resolve(packet(requests[2].q)); await flush();
  assert.equal(bind(updates.at(-1).response), "bound");
});

test("expired row proof debt reaches a new legacy display-only result without serializing the debt ledger", async t => {
  discoveryClock(t);
  let now = 0;
  const requests = [], updates = [];
  const cache = createDateNightRadialCache({ ttlMs: 100, now: () => now });
  const full = { ...combined, patchId: core }, culture = { ...movies, patchId: core };
  cache.store(full, packet(full, [park], ["movies"]));
  cache.store(culture, packet(culture, []));
  now = 101;
  const session = createDateNightRadialSession({ cache, now: () => now });
  t.after(() => session.dispose());
  const callbacks = { request: q => { const pending = deferred(); requests.push({ q, ...pending }); return pending.promise; }, onChange: state => updates.push(state) };
  session.update(query, callbacks); await flush();
  requests[0].resolve({ source: "live", venues: [park] }); await flush();
  blocked(updates.at(-1).response);
  ordinaryParkRetained(updates.at(-1).response);
  assert.equal(updates.at(-1).response.identityEvidenceCoverage, undefined);
  session.update(query, { ...callbacks, retryVersion: 1 }); await flush();
  requests[1].resolve(packet(requests[1].q)); await flush();
  assert.equal(bind(updates.at(-1).response), "bound");
});

test("a late rejected acquisition from a cancelled location cannot taint the new location", async t => {
  discoveryClock(t);
  const requests = [], updates = [];
  const session = createDateNightRadialSession();
  t.after(() => session.dispose());
  const callbacks = { request: q => { const pending = deferred(); requests.push({ q, ...pending }); return pending.promise; }, onChange: state => updates.push(state) };
  session.update(combined, callbacks); await flush();
  const elsewhere = { ...query, lat: query.lat + 0.001 };
  session.update(elsewhere, callbacks); await flush();
  requests[1].resolve(packet(requests[1].q)); await flush();
  requests[0].reject(new Error("Old scope oversized")); await flush();
  assert.equal(bind(updates.at(-1).response), "bound");
});

test("transport failure description carries only provider uncertainty, never curated-only category loss", () => {
  const failed = failedDateNightAcquisition({ ...query, halloweenActive: true, activityTypes: ["other-halloween-fall"] });
  assert.equal(failed.identityUncertainty, undefined);
  assert.deepEqual(failed.venues, []);
});
