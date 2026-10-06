import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, flush } from "./test-support/discovery-clock.mjs";
import { discoveryComponentHarness, discoveryModes, discoveryPayload, textOf } from "./test-support/discovery-component-harness.mjs";

const load = appModuleLoader();
const { createDateNightDiscoveryCache, combineDateNightDiscovery, failedDateNightAcquisition,
  DATE_NIGHT_CACHE_TTL_MS } = load("src/lib/date-night/cache.ts");
const { buildDateNightQueryPlan, normalizeDateNightActivityTypes } = load("src/lib/date-night/query-plan.ts");
const config = discoveryModes.find(({ mode }) => mode === "date-night");
const origin = { lat: 37.176447, lon: -94.310223, radiusMiles: 15, halloweenActive: true };
const query = (activityTypes = ["anything"], changes = {}) => ({ ...origin, activityTypes, ...changes });
const venue = (id = "date-night-osm-node-1", types = ["haunted-house"], changes = {}) => ({
  ...discoveryPayload(config).venues[0], id, name: id, activityTypes: types, ...changes,
});
function response(q, venues = [venue()], outcomes = {}) {
  const groups = buildDateNightQueryPlan(q.activityTypes, q.halloweenActive).map((group) => ({
    ...group, outcome: outcomes[group.id] ?? (venues.length ? "succeeded-nonempty" : "succeeded-empty"),
  }));
  const success = groups.some((group) => group.outcome.startsWith("succeeded-"));
  return { venues, source: success ? "live" : "fallback", ...(q.patchId ? { patch: { id: q.patchId, version: "radial-v1" } } : {}), discovery: {
    groups, partial: success && groups.some((group) => group.outcome === "failed" || group.outcome === "cancelled"),
  } };
}

test("Anything coverage satisfies every later category and subset without acquiring again", () => {
  const cache = createDateNightDiscoveryCache();
  const q = query();
  cache.store(q, response(q));
  for (const type of normalizeDateNightActivityTypes(["anything"], true)) {
    const hit = cache.read(query([type]));
    assert.deepEqual(hit.missingActivityTypes, []);
    assert.equal(hit.response.discovery.groups[0].outcome, "cache-hit");
  }
  assert.deepEqual(cache.read(query(["haunted-house", "movies"])).missingActivityTypes, []);
});

test("coverage is category-specific within a group; only missing types are requested", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(query(["haunted-house"]), response(query(["haunted-house"])));
  assert.deepEqual(cache.read(query(["haunted-house", "corn-maze", "movies"])).missingActivityTypes, ["corn-maze", "movies"]);
  cache.store(query(["movies"]), response(query(["movies"]), [venue("movies", ["movies"])]));
  assert.deepEqual(cache.read(query(["haunted-house", "movies"])).missingActivityTypes, []);
});

test("valid-empty coverage is reusable and preserves its origin; failed/cancelled categories stay missing", () => {
  const cache = createDateNightDiscoveryCache();
  const q = query(["haunted-house", "movies", "park"]);
  cache.store(q, response(q, [], { culture: "failed", outdoor: "cancelled" }));
  const hit = cache.read(q);
  assert.deepEqual(hit.missingActivityTypes, ["movies", "park"]);
  assert.deepEqual(hit.response.discovery.groups, [{ id: "seasonal", activityTypes: ["haunted-house"], outcome: "cache-hit", originOutcome: "succeeded-empty" }]);
  assert.deepEqual(hit.response.venues, []);
  assert.equal(hit.response.source, "live");
});

test("complete fallback and legacy missing metadata never establish reusable live coverage", () => {
  const cache = createDateNightDiscoveryCache();
  const q = query(["movies"]);
  assert.equal(cache.store(q, { ...response(q), source: "fallback" }), false);
  assert.equal(cache.store(q, discoveryPayload(config)), false);
  assert.deepEqual(cache.read(q).missingActivityTypes, ["movies"]);
});

test("cached successes plus fresh failure preserve partial live data and disjoint category outcomes", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(query(["haunted-house"]), response(query(["haunted-house"])));
  const snapshot = cache.read(query(["haunted-house", "corn-maze"]));
  const saved = venue("catalog-place", ["haunted-house"], { name: "Saved place", lat: 37.3, source: "catalog" });
  const fresh = response(query(["corn-maze"]), [saved], { seasonal: "failed" });
  const combined = combineDateNightDiscovery(snapshot, fresh);
  assert.equal(combined.source, "merged");
  assert.equal(combined.venues.length, 2);
  assert.equal(combined.discovery.partial, true);
  assert.match(combined.warning, /coverage may be incomplete/i);
  assert.deepEqual(combined.discovery.groups.map(({ id, activityTypes, outcome }) => ({ id, activityTypes, outcome })), [
    { id: "seasonal", activityTypes: ["haunted-house"], outcome: "cache-hit" },
    { id: "seasonal", activityTypes: ["corn-maze"], outcome: "failed" },
  ]);
  assert.equal(cache.store(query(["corn-maze"]), fresh), false);
  assert.deepEqual(cache.read(query(["corn-maze"])).missingActivityTypes, ["corn-maze"]);
});

test("cached live success survives missing-category transport failure without asserting coverage", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(query(["haunted-house"]), response(query(["haunted-house"])));
  const snapshot = cache.read(query(["haunted-house", "movies"]));
  const combined = combineDateNightDiscovery(snapshot, failedDateNightAcquisition(query(snapshot.missingActivityTypes)));
  assert.equal(combined.source, "live");
  assert.equal(combined.discovery.partial, true);
  assert.equal(combined.venues[0].id, "date-night-osm-node-1");
  assert.equal(combined.discovery.groups[1].outcome, "failed");
});

test("radius narrowing reuses larger coverage but widening cannot use a narrower entry", () => {
  const cache = createDateNightDiscoveryCache();
  const q = query(["movies"]);
  cache.store(q, response(q));
  assert.deepEqual(cache.read(query(["movies"], { radiusMiles: 50 })).missingActivityTypes, ["movies"]);
  cache.store(query(["movies"], { radiusMiles: 50 }), response(q));
  assert.deepEqual(cache.read(query(["movies"], { radiusMiles: 30 })).missingActivityTypes, []);
});

for (const [dimension, change] of [
  ["latitude", { lat: origin.lat + 0.000001 }], ["longitude", { lon: origin.lon + 0.000001 }],
  ["Halloween activation", { halloweenActive: false }], ["semantic version", { semanticVersion: "next" }],
]) {
  test(`${dimension} separates incompatible cache coverage`, () => {
    const cache = createDateNightDiscoveryCache();
    cache.store(query(), response(query()));
    assert.deepEqual(cache.read(query(["movies"], change)).missingActivityTypes, ["movies"]);
  });
}

test("TTL expires exactly at bound; reads and fresh missing-category combinations never rejuvenate old coverage", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now });
  cache.store(query(["haunted-house"]), response(query(["haunted-house"])));
  now = DATE_NIGHT_CACHE_TTL_MS - 1;
  const snapshot = cache.read(query(["haunted-house", "movies"]));
  const movies = response(query(["movies"]), [venue("movies", ["movies"])]);
  cache.store(query(["movies"]), movies);
  combineDateNightDiscovery(snapshot, movies);
  now++;
  assert.deepEqual(cache.read(query(["haunted-house", "movies"])).missingActivityTypes, ["haunted-house"]);
  now = -1;
  assert.equal(cache.read(query(["movies"])).response, null, "clock rollback does not immortalize entries");
});

test("new valid-empty category coverage cannot resurrect old venues through a reused superset", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now });
  cache.store(query(), response(query(), [venue("corn", ["corn-maze"]), venue("movie", ["movies"])]));
  now++;
  cache.store(query(["corn-maze"]), response(query(["corn-maze"]), []));
  const hit = cache.read(query());
  assert.deepEqual(hit.response.venues.map(({ id }) => id), ["movie"]);
  assert.ok(hit.response.discovery.groups.some((group) => group.activityTypes.includes("corn-maze") && group.originOutcome === "succeeded-empty"));
});

test("equal-timestamp freshness uses admission order even after an older superset becomes most recently used", () => {
  const cache = createDateNightDiscoveryCache({ now: () => 100 });
  cache.store(query(), response(query(), [venue("old-corn", ["corn-maze"]), venue("movie", ["movies"])]));
  cache.store(query(["corn-maze"]), response(query(["corn-maze"]), []));
  assert.deepEqual(cache.read(query(["corn-maze"])).response.venues, []);
  assert.deepEqual(cache.read(query(["movies"])).response.venues.map(({ id }) => id), ["movie"]);
  const corn = cache.read(query(["corn-maze"]));
  assert.deepEqual(corn.response.venues, [], "an LRU read must not make an older acquisition newer");
  assert.deepEqual(corn.missingActivityTypes, []);
  assert.equal(corn.response.discovery.groups[0].originOutcome, "succeeded-empty");
});

function assertNoSupersededCorn(snapshot) {
  assert.equal(snapshot.response?.venues.some(({ id }) => id === "superseded-corn") ?? false, false,
    "eviction must never restore the superseded Corn identity");
  if (!snapshot.missingActivityTypes.includes("corn-maze")) {
    assert.ok(snapshot.response, "complete coverage requires a response");
    assert.ok(snapshot.response.discovery.groups.some((group) =>
      group.activityTypes.includes("corn-maze") && group.originOutcome === "succeeded-empty"),
    "a complete Corn cache-hit must come from retained successful-empty coverage");
  }
}

for (const capacity of ["maxEntries", "maxVenues"]) {
  for (const equalTimestamps of [false, true]) {
    test(`V-DR-02: ${capacity} eviction cannot resurrect superseded Corn (${equalTimestamps ? "equal" : "increasing"} timestamps)`, () => {
      let now = 100;
      const cache = createDateNightDiscoveryCache({ now: () => now,
        maxEntries: capacity === "maxEntries" ? 2 : 8, maxVenues: capacity === "maxVenues" ? 4 : 20 });
      const anything = query(), corn = query(["corn-maze"]), movies = query(["movies"]);
      cache.store(anything, response(anything, [venue("superseded-corn", ["corn-maze"]), venue("movie", ["movies"])]));
      if (!equalTimestamps) now++;
      cache.store(corn, response(corn, []));
      assertNoSupersededCorn(cache.read(corn));
      const filler = query(["park"], { lat: 38 });
      if (capacity === "maxVenues") cache.store(filler, response(filler, [venue("filler", ["park"])]));
      // A Movies read changes only LRU priority. The old Anything stays alive
      // while the newer empty Corn snapshot becomes the first eviction victim.
      assert.deepEqual(cache.read(movies).response.venues.map(({ id }) => id), ["movie"]);
      const pressure = query(["museum"], { lat: 39 });
      cache.store(pressure, response(pressure, capacity === "maxVenues"
        ? [venue("pressure-1", ["museum"]), venue("pressure-2", ["museum"])] : [venue("pressure", ["museum"])]));
      assert.ok(cache.read(pressure).response, "new pressure entry remains cached");
      if (capacity === "maxVenues") assert.equal(cache.read(filler).response, null,
        "raw-venue pressure evicts the zero-row Corn snapshot then the expendable filler");
      assert.deepEqual(cache.read(movies).response.venues.map(({ id }) => id), ["movie"],
        "unrelated old Movies coverage remains reusable");
      assertNoSupersededCorn(cache.read(corn));
      assertNoSupersededCorn(cache.read(anything));
    });
  }
}

for (const [oldRadius, newRadius] of [[50, 15], [15, 50]]) {
  test(`V-DR-02: radius ${oldRadius}→${newRadius} supersession is durable and never claims wider coverage`, () => {
    let now = 0;
    const cache = createDateNightDiscoveryCache({ now: () => now, maxEntries: 2 });
    const anything = query(["anything"], { radiusMiles: oldRadius });
    const corn = query(["corn-maze"], { radiusMiles: newRadius });
    cache.store(anything, response(anything, [venue("superseded-corn", ["corn-maze"]), venue("movie", ["movies"])]));
    now++;
    cache.store(corn, response(corn, []));
    assertNoSupersededCorn(cache.read(query(["corn-maze"], { radiusMiles: 15 })));
    const wide = cache.read(query(["corn-maze"], { radiusMiles: 50 }));
    assertNoSupersededCorn(wide);
    if (newRadius === 15) assert.deepEqual(wide.missingActivityTypes, ["corn-maze"],
      "new narrower success conservatively requires a fresh wider acquisition");
    const movies = query(["movies"], { radiusMiles: oldRadius });
    assert.deepEqual(cache.read(movies).response.venues.map(({ id }) => id), ["movie"]);
    const pressure = query(["museum"], { lat: 38 });
    cache.store(pressure, response(pressure));
    for (const radiusMiles of [15, 50, 75]) {
      const after = cache.read(query(["corn-maze"], { radiusMiles }));
      assertNoSupersededCorn(after);
      if (radiusMiles > newRadius) assert.deepEqual(after.missingActivityTypes, ["corn-maze"]);
    }
    assert.deepEqual(cache.read(movies).missingActivityTypes, []);
  });
}

test("V-DR-02: supersession lasts through the old TTL and never rejuvenates unaffected Movies", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now, ttlMs: 100, maxEntries: 2 });
  cache.store(query(), response(query(), [venue("superseded-corn", ["corn-maze"]), venue("movie", ["movies"])]));
  now = 10;
  cache.store(query(["corn-maze"]), response(query(["corn-maze"]), []));
  cache.read(query(["movies"]));
  const pressure = query(["museum"], { lat: 38 });
  cache.store(pressure, response(pressure));
  now = 99;
  assertNoSupersededCorn(cache.read(query(["corn-maze"])));
  assert.deepEqual(cache.read(query(["movies"])).missingActivityTypes, []);
  now = 100;
  assert.deepEqual(cache.read(query(["movies"])).missingActivityTypes, ["movies"],
    "LRU reuse did not extend the old acquisition TTL");
  assert.deepEqual(cache.read(query(["corn-maze"])).missingActivityTypes, ["corn-maze"]);
  now = 110;
  assert.equal(cache.read(pressure).response, null);
});

for (const [dimension, change] of [
  ["latitude", { lat: origin.lat + 0.000001 }], ["longitude", { lon: origin.lon + 0.000001 }],
  ["Halloween activation", { halloweenActive: false }], ["semantic version", { semanticVersion: "next" }],
]) {
  test(`V-DR-02: successful coverage for another ${dimension} cannot supersede this signature`, () => {
    const cache = createDateNightDiscoveryCache();
    const original = query(["movies"]), other = query(["movies"], change);
    cache.store(original, response(original, [venue("original-movie", ["movies"])]));
    cache.store(other, response(other, []));
    assert.deepEqual(cache.read(original).response.venues.map(({ id }) => id), ["original-movie"]);
    assert.deepEqual(cache.read(other).response.venues, []);
  });
}

test("V-DR-02: valid-empty supersession retains full classification and evidence for an identity still reused through Movies", () => {
  const cache = createDateNightDiscoveryCache({ maxEntries: 2 });
  const shared = venue("shared-identity", ["corn-maze", "movies"], { openingHours: "Mo-Su 10:00-20:00",
    discoveryEvidence: [
      { id: "shared-corn", source: "osm", activityTypes: ["corn-maze"], openingHours: null, website: null },
      { id: "shared-movie", source: "catalog", activityTypes: ["movies"], openingHours: "Mo-Su 10:00-20:00", website: null },
    ] });
  const original = response(query(), [shared]);
  cache.store(query(), original);
  cache.store(query(["corn-maze"]), response(query(["corn-maze"]), []));
  cache.read(query(["movies"]));
  const pressure = query(["museum"], { lat: 38 });
  cache.store(pressure, response(pressure));
  const hit = cache.read(query(["movies"]));
  assert.deepEqual(hit.response.venues[0].activityTypes, ["corn-maze", "movies"]);
  assert.deepEqual(hit.response.venues[0].discoveryEvidence, shared.discoveryEvidence);
  assert.equal(hit.response.venues[0].openingHours, shared.openingHours);
  assert.deepEqual(hit.response.discovery.groups.flatMap((group) => group.activityTypes), ["movies"]);
  const corn = cache.read(query(["corn-maze"]));
  assert.deepEqual(corn.missingActivityTypes, ["corn-maze"], "truthful classification is not proof of still-valid Corn acquisition");
  assert.equal(corn.response, null);
  assert.ok(original.discovery.groups.some((group) => group.activityTypes.includes("corn-maze")),
    "cache invalidation must not mutate the caller's response metadata");
});

for (const outcome of ["fallback", "failed", "cancelled", "cache-hit", "legacy", "oversize"]) {
  test(`V-DR-02: rejected ${outcome} response cannot supersede successful older coverage`, () => {
    const cache = createDateNightDiscoveryCache({ maxVenues: 2 });
    const corn = query(["corn-maze"]);
    cache.store(query(), response(query(), [venue("still-valid-corn", ["corn-maze"]), venue("movie", ["movies"])]));
    let rejected = response(corn, []);
    if (outcome === "fallback") rejected.source = "fallback";
    else if (outcome === "legacy") delete rejected.discovery;
    else if (outcome === "oversize") rejected.venues = [1, 2, 3].map((id) => venue(`oversize-${id}`, ["corn-maze"]));
    else rejected.discovery.groups[0].outcome = outcome;
    assert.equal(cache.store(corn, rejected), false);
    assert.deepEqual(cache.read(corn).response.venues.map(({ id }) => id), ["still-valid-corn"]);
    assert.deepEqual(cache.read(corn).missingActivityTypes, []);
  });
}

test("V-DR-02: partial success supersedes only its successful categories", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(query(), response(query(), [venue("still-valid-corn", ["corn-maze"]), venue("old-movie", ["movies"])]));
  const partial = query(["corn-maze", "movies"]);
  cache.store(partial, response(partial, [], { seasonal: "failed" }));
  assert.deepEqual(cache.read(query(["corn-maze"])).response.venues.map(({ id }) => id), ["still-valid-corn"]);
  assert.deepEqual(cache.read(query(["movies"])).response.venues, []);
});

test("V-DR-02: an entry with all coverage superseded retains terminal identity evidence until TTL", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now, ttlMs: 100 });
  const active = venue("cross-category-identity", ["corn-maze", "movies"]);
  const corn = query(["corn-maze"]), movies = query(["movies"]);
  cache.store(corn, response(corn, [{ ...active, lifecycle: "permanently-closed" }]));
  now = 10;
  cache.store(corn, response(corn, []));
  now = 20;
  cache.store(movies, response(movies, [active]));
  const protectedHit = cache.read(movies);
  assert.equal(protectedHit.response.venues.length, 1);
  assert.equal(protectedHit.response.venues[0].lifecycle, "permanently-closed",
    "superseding the negative entry's last category must not discard its identity evidence");
  assert.deepEqual(protectedHit.response.discovery.groups.flatMap((group) => group.activityTypes), ["movies"]);
  assert.equal(cache.read(corn).response.discovery.groups[0].originOutcome, "succeeded-empty");
  now = 100;
  assert.equal(cache.read(movies).response.venues[0].lifecycle, undefined,
    "retained negative evidence follows its original TTL, not the replacement acquisition TTL");
});

test("LRU entry and aggregate raw-venue caps evict whole entries without truncated coverage", () => {
  const cache = createDateNightDiscoveryCache({ maxEntries: 2, maxVenues: 3 });
  const a = query(["movies"]), b = query(["movies"], { lat: 38 }), c = query(["movies"], { lat: 39 });
  cache.store(a, response(a)); cache.store(b, response(b));
  cache.read(a);
  cache.store(c, response(c));
  assert.equal(cache.read(b).response, null);
  assert.ok(cache.read(a).response);
  const huge = response(b, [1, 2, 3, 4].map((id) => venue(String(id))));
  assert.equal(cache.store(b, huge), false);
  assert.equal(cache.read(b).response, null);
  cache.store(c, response(c, [venue("a", ["movies"]), venue("b", ["movies"]), venue("c", ["movies"])]));
  assert.equal(cache.read(a).response, null, "total raw count is bounded, including duplicate snapshots");
  assert.equal(cache.read(c).response.venues.length > 0, true);
});

test("cache assembly preserves catalog aliases, full evidence, hours precedence and lifecycle in either insertion order", () => {
  const catalog = venue("local-precious", ["museum"], { name: "Precious Moments Chapel", source: "catalog", openingHours: "Mo-Su 10:00-17:00" });
  const osm = venue("date-night-osm-node-4", ["haunted-house"], { name: "Samuel J. Butcher Museum", source: "osm", openingHours: "24/7", lifecycle: "permanently-closed" });
  const acquire = (reverse) => {
    const cache = createDateNightDiscoveryCache();
    const pairs = [[query(["museum"]), catalog], [query(["haunted-house"]), osm]];
    for (const [q, place] of reverse ? pairs.reverse() : pairs) cache.store(q, response(q, [place]));
    return cache.read(query(["haunted-house", "museum"])).response.venues;
  };
  const actual = acquire(false);
  assert.deepEqual(actual, acquire(true));
  assert.equal(actual.length, 1);
  assert.equal(actual[0].id, catalog.id);
  assert.deepEqual(actual[0].activityTypes, ["haunted-house", "museum"]);
  assert.equal(actual[0].discoveryEvidence.length, 2);
  assert.equal(actual[0].lifecycle, "permanently-closed");
  assert.equal(actual[0].openingHours, catalog.openingHours);
  assert.equal(actual[0].source, "merged");
});

test("fresh cross-category lifecycle evidence suppresses an older cached active identity without adding coverage", () => {
  let now = 0;
  const cache = createDateNightDiscoveryCache({ now: () => now });
  const active = venue("date-night-osm-node-88", ["movies", "haunted-house"]);
  cache.store(query(["movies"]), response(query(["movies"]), [active]));
  now++;
  const closed = { ...active, lifecycle: "permanently-closed" };
  cache.store(query(["haunted-house"]), response(query(["haunted-house"]), [closed]));
  const hit = cache.read(query(["movies"]));
  assert.equal(hit.response.venues[0].lifecycle, "permanently-closed");
  assert.deepEqual(hit.response.discovery.groups.flatMap((group) => group.activityTypes), ["movies"]);
  const absent = cache.read(query(["park"]));
  assert.equal(absent.response, null);
  const fresh = response(query(["park"]), [active]);
  assert.equal(combineDateNightDiscovery(absent, fresh).venues[0].lifecycle, "permanently-closed");
  const wider = cache.read(query(["movies"], { radiusMiles: 50 }));
  assert.equal(wider.response, null, "narrow positive coverage cannot cover wider radius");
  assert.equal(combineDateNightDiscovery(wider, fresh).venues[0].lifecycle, "permanently-closed", "known negative identity survives radius widening");
});

function setup(t, activityTypes = ["anything"]) {
  const clock = discoveryClock(t);
  const h = discoveryComponentHarness(config);
  h.store.spookySeasonEnabled = true;
  h.store.dateNightFilters = { ...h.store.dateNightFilters, activityTypes };
  t.after(() => h.dispose());
  h.render();
  return { h, clock };
}
function resolveRequest(h, index = h.requests.length - 1, overrides = {}) {
  const request = h.requests[index];
  const q = query(request.args.data.activityTypes, request.args.data);
  request.resolve({ ...response(q, [venue("movie", ["movies"])]), ...overrides });
}

test("actual DateNightHome: Anything→subsets and every local-only filter reuse data without network", async (t) => {
  const { h, clock } = setup(t);
  resolveRequest(h);
  await h.settle();
  for (const patch of [
    { openNowOnly: true }, { mood: 90 }, { favoritesOnly: true }, { reduceParks: false },
    { activityTypes: ["haunted-house"] }, { activityTypes: ["corn-maze", "pumpkin-patch"] },
    { activityTypes: ["movies"] }, { activityTypes: ["anything"] },
  ]) {
    h.store.setDateNightFilters(patch);
    h.render();
    assert.equal(h.status().loading, false);
    assert.equal(h.requests.length, 1);
  }
  assert.equal(clock.pending, 0);
});

test("actual DateNightHome: stale persisted unknown categories recover to Anything without weakening RPC validation", async (t) => {
  const { h } = setup(t, ["retired-category"]);
  assert.deepEqual(h.requests[0].args.data.activityTypes, normalizeDateNightActivityTypes(["anything"], true));
  resolveRequest(h);
  const state = await h.settle();
  assert.match(textOf(state.tree), /1 activities match/);
  assert.equal(h.button(state.tree, "Anything").props["aria-pressed"], true);
  assert.throws(() => normalizeDateNightActivityTypes(["retired-category"], true), /Choose valid/);
});

test("actual DateNightHome: subset then mixed selection fetches only missing categories", async (t) => {
  const { h } = setup(t, ["haunted-house"]);
  assert.deepEqual(h.requests[0].args.data.activityTypes, ["haunted-house"]);
  resolveRequest(h); await h.settle();
  h.store.setDateNightFilters({ activityTypes: ["haunted-house", "movies"] });
  h.render();
  assert.deepEqual(h.requests[1].args.data.activityTypes, ["movies"]);
  resolveRequest(h); await h.settle();
  h.store.setDateNightFilters({ activityTypes: ["movies"] });
  h.render();
  assert.equal(h.requests.length, 2);
});

test("actual DateNightHome: bounded missing-category timeout preserves cached live contribution and partial warning", async (t) => {
  const { h, clock } = setup(t, ["movies"]);
  t.mock.method(console, "warn", () => {});
  resolveRequest(h); await h.settle();
  h.store.setDateNightFilters({ activityTypes: ["movies", "park"] });
  h.render();
  await clock.tick(25_000);
  const state = h.status();
  assert.equal(state.loading, false);
  assert.equal(h.requests[1].args.signal.aborted, true);
  assert.match(state.notices[0].title, /Some live searches/);
  assert.match(textOf(state.tree), /1 activities match/);
  assert.equal(clock.pending, 0);
  state.notices[0].onRetry(); h.render();
  assert.deepEqual(h.requests[2].args.data.activityTypes, ["park"], "partial retry acquires only missing coverage");
});

test("actual DateNightHome: TTL refreshes on next category acquisition, not local-only toggles or elapsed time", async (t) => {
  const { h, clock } = setup(t);
  resolveRequest(h); await h.settle();
  await clock.tick(DATE_NIGHT_CACHE_TTL_MS);
  h.store.setDateNightFilters({ openNowOnly: true }); h.render();
  assert.equal(h.requests.length, 1);
  h.store.setDateNightFilters({ activityTypes: ["movies"] }); h.render();
  assert.equal(h.requests.length, 2);
  assert.deepEqual(h.requests[1].args.data.activityTypes, ["movies"]);
});

test("actual DateNightHome: radius widening schedules an outer patch; narrowing reuses core without RPC", async (t) => {
  const { h, clock } = setup(t, ["movies"]);
  resolveRequest(h); await h.settle();
  h.store.setDateNightFilters({ radiusMiles: 50 }); h.render();
  assert.equal(h.requests.length, 1, "widening respects the pending success delay");
  await clock.tick(250);
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1].args.data.patchId, "radial-v1:20:0");
  assert.notEqual(h.requests[1].args.data.patchId, h.requests[0].args.data.patchId);
  resolveRequest(h); await h.settle();
  h.store.setDateNightFilters({ radiusMiles: 15 }); h.render();
  assert.equal(h.requests.length, 2);
  assert.equal(h.status().loading, false);
});

for (const scenario of ["replacement", "timeout"]) {
  test(`actual DateNightHome: late ${scenario} response cannot seed reusable cache`, async (t) => {
    const { h, clock } = setup(t, ["movies"]);
    t.mock.method(console, "warn", () => {});
    const old = h.requests[0];
    if (scenario === "timeout") {
      await clock.tick(25_000);
      h.status().notices[0].onRetry();
    } else h.store.location = { ...h.store.location, lat: 38 };
    h.render();
    assert.equal(old.args.signal.aborted, true);
    resolveRequest(h, 0); await flush();
    // Cancel the current request and revisit the abandoned location/category.
    h.store.setDateNightFilters({ activityTypes: ["museum"] }); h.render();
    h.store.location = { ...h.store.location, lat: origin.lat };
    h.store.setDateNightFilters({ activityTypes: ["movies"] }); h.render();
    assert.equal(h.requests.length, 4, "late old success was not reusable");
    assert.equal(h.status().loading, true);
  });
}

test("actual DateNightHome: component cache lifetime does not survive unmount or contaminate another session", async (t) => {
  const { h } = setup(t);
  resolveRequest(h); await h.settle();
  h.dispose();
  const next = discoveryComponentHarness(config);
  t.after(() => next.dispose());
  next.store.spookySeasonEnabled = true;
  next.render();
  assert.equal(next.requests.length, 1);
  assert.equal(next.status().loading, true);
});
