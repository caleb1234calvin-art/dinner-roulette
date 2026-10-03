import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryModes, discoveryPayload } from "./test-support/discovery-component-harness.mjs";
const load = appModuleLoader();
const { createDateNightRadialCache, clipDateNightRadius } = load("src/lib/date-night/radial-cache.ts");
const { createDateNightDiscoveryCache } = load("src/lib/date-night/cache.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const base = { lat: 37.176447, lon: -94.310223, radiusMiles: 50, halloweenActive: true, activityTypes: ["movies"] };
const patches = planDateNightPatches(base, 50);
const q = (patch = patches[0], changes = {}) => ({ ...base, patchId: patch.id, ...changes });
const venue = (patch, id = patch.id, changes = {}) => ({ ...discoveryPayload(discoveryModes[1]).venues[0],
  ...patch.center, id, name: id, ...changes });
const response = (query, venues = [], outcomes = {}) => ({ venues, source: "live", patch: { id: query.patchId, version: "radial-v1" },
  discovery: { groups: buildDateNightQueryPlan(query.activityTypes, query.halloweenActive).map(g => ({ ...g, outcome: outcomes[g.id] ?? (venues.length ? "succeeded-nonempty" : "succeeded-empty") })), partial: false } });

test("radial cache counts valid-empty successful patches as proof and outer success never covers missing core", () => {
  const cache = createDateNightRadialCache();
  for (const p of patches.slice(1)) cache.store(q(p), response(q(p)));
  let state = cache.read(base);
  assert.equal(state.coverage.continuousRadiusMiles, 0);
  assert.deepEqual(state.coverage.missingPatchIds, [patches[0].id]);
  cache.store(q(), response(q()));
  state = cache.read(base);
  assert.equal(state.coverage.continuousRadiusMiles, 50);
  assert.equal(state.coverage.complete, true);
  assert.deepEqual(state.response.venues, []);
  assert.equal(state.response.source, "live");
});

test("a failed outermost patch preserves 0–40 completeness; retry work is only missing patch/category", () => {
  const cache = createDateNightRadialCache();
  const mixed = { ...base, activityTypes: ["movies", "park"] };
  for (const p of patches) {
    const query = q(p, mixed);
    cache.store(query, response(query, [], p === patches.at(-1) ? { outdoor: "failed" } : {}));
  }
  const failed = { id: patches.at(-1).id, completeActivityTypes: [], failedActivityTypes: ["park"] };
  const state = cache.read(mixed, [failed]);
  assert.equal(state.coverage.continuousRadiusMiles, 40);
  assert.equal(state.coverage.failedPatchIds.length, 1);
  const missing = state.coverage.patches.filter(p => p.missingActivityTypes.length);
  assert.deepEqual(missing.map(p => [p.id, p.missingActivityTypes]), [[patches.at(-1).id, ["park"]]]);
  const retry = q(patches.at(-1), { activityTypes: ["park"] });
  cache.store(retry, response(retry));
  assert.equal(cache.read(mixed).coverage.continuousRadiusMiles, 50);
});

for (const bad of ["fallback", "failed", "cancelled", "cache-hit", "legacy", "wrong-patch", "wrong-version"]) {
  test(`radial cache rejects ${bad} as coverage`, () => {
    const cache = createDateNightRadialCache(), query = q(), result = response(query);
    if (bad === "fallback") result.source = "fallback";
    else if (bad === "legacy") delete result.discovery;
    else if (bad === "wrong-patch") result.patch.id = patches[1].id;
    else if (bad === "wrong-version") result.patch.version = "old";
    else result.discovery.groups[0].outcome = bad;
    assert.equal(cache.store(query, result), false);
    assert.equal(cache.read(base).coverage.continuousRadiusMiles, 0);
  });
}

test("positive circle overlap is owned once; identities/evidence dedupe without clipping classifications", () => {
  const cache = createDateNightRadialCache();
  const shared = venue(patches[0], "shared", { activityTypes: ["movies", "corn-maze"], discoveryEvidence: [
    { id: "shared", source: "osm", activityTypes: ["movies", "corn-maze"], openingHours: "24/7", website: null },
  ] });
  cache.store(q(), response(q(), [shared]));
  cache.store(q(patches[1]), response(q(patches[1]), [shared, venue(patches[1])]));
  const state = cache.read(base);
  assert.equal(state.response.venues.filter(p => p.id === "shared").length, 1);
  assert.deepEqual(state.response.venues.find(p => p.id === "shared").activityTypes, shared.activityTypes);
  cache.store(q(), response(q()));
  assert.equal(cache.read(base).response.venues.some(p => p.id === "shared"), false, "overlap must not resurrect superseded positive identity");
});

for (const capacity of ["maxEntries", "maxVenues"]) {
  test(`radial V-DR-02: ${capacity} eviction cannot resurrect superseded patch/category authority`, () => {
    const cache = createDateNightRadialCache({ maxEntries: capacity === "maxEntries" ? 2 : 128, maxVenues: capacity === "maxVenues" ? 3 : 20000 });
    const anything = q(patches[0], { activityTypes: ["movies", "corn-maze"] });
    const corn = q(patches[0], { activityTypes: ["corn-maze"] });
    cache.store(anything, response(anything, [venue(patches[0], "old-corn", { activityTypes: ["corn-maze"], lat: base.lat + 0.05 }), venue(patches[0], "movie")]));
    cache.store(corn, response(corn));
    cache.read(base); // keeps old Movies authority most recently used
    const pressure = q(patches[1]);
    cache.store(pressure, response(pressure, [venue(patches[1], "pressure1"), venue(patches[1], "pressure2", { lat: patches[1].center.lat + 0.01 })]));
    const state = cache.read({ ...base, activityTypes: ["corn-maze"] });
    assert.equal(state.response?.venues.some(p => p.id === "old-corn") ?? false, false);
    assert.ok(state.coverage.missingPatchIds.includes(patches[0].id));
    assert.equal(state.coverage.continuousRadiusMiles, 0);
  });
}

test("radial cross-patch/category negative evidence suppresses positives and eviction cannot resurrect them", () => {
  const cache = createDateNightRadialCache({ maxEntries: 2 });
  const active = venue(patches[0], "identity", { activityTypes: ["movies", "corn-maze"] });
  cache.store(q(), response(q(), [active]));
  const corn = q(patches[1], { activityTypes: ["corn-maze"] });
  cache.store(corn, response(corn, [{ ...active, lifecycle: "permanently-closed" }]));
  let state = cache.read(base);
  assert.equal(state.response.venues[0].lifecycle, "permanently-closed");
  assert.equal(state.coverage.patches[1].missingActivityTypes.includes("movies"), true);
  cache.store(q(patches[2]), response(q(patches[2])));
  state = cache.read(base);
  assert.equal(state.response.venues.some(p => p.id === "identity" && !p.lifecycle), false);
});

test("legacy disk authority and patch authority never satisfy or supersede one another", () => {
  const cache = createDateNightDiscoveryCache();
  cache.store(base, { ...response(base), patch: undefined });
  assert.deepEqual(cache.read(q()).missingActivityTypes, ["movies"]);
  cache.store(q(), response(q()));
  assert.deepEqual(cache.read(base).missingActivityTypes, []);
  assert.deepEqual(cache.read(q()).missingActivityTypes, []);
});

test("TTL/eviction remove proof; radius and semantic changes are scoped; local eligibility strictly clips", () => {
  let now = 0;
  const cache = createDateNightRadialCache({ now: () => now, ttlMs: 100 });
  cache.store(q(), response(q(), [venue(patches[0])]));
  for (const radiusMiles of [1, 3, 5, 10, 15]) {
    const hit = cache.read({ ...base, radiusMiles });
    assert.equal(hit.coverage.complete, true);
    assert.equal(hit.coverage.continuousRadiusMiles, radiusMiles);
  }
  for (const change of [{ lat: 38 }, { lon: -93 }, { halloweenActive: false }, { semanticVersion: "future" }]) {
    assert.equal(cache.read({ ...base, ...change }).coverage.continuousRadiusMiles, 0);
  }
  assert.deepEqual(clipDateNightRadius([venue(patches.at(-1))], { ...base, radiusMiles: 15 }), []);
  now = 99;
  assert.equal(cache.read(base).coverage.continuousRadiusMiles, 15);
  now = 100;
  assert.equal(cache.read(base).coverage.continuousRadiusMiles, 0);
  assert.equal(cache.read(base).response, null);
});
