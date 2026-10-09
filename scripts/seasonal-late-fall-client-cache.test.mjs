import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { flush } from "./test-support/discovery-clock.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_LATE_FALL_CATALOG } = load(
  "src/lib/date-night/missouri-2026-late-fall-catalog.ts",
);
const { MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG } = load(
  "src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts",
);
const { createDateNightDiscoveryCache } = load("src/lib/date-night/cache.ts");
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { HALLOWEEN_DATE_NIGHT_TYPES } = load("src/lib/date-night/season.ts");
const { MISSOURI_2026_ASTRA_ELEVEN_CATALOG } = load("src/lib/date-night/missouri-2026-astra-eleven-catalog.ts");
const rows = [
  ...MISSOURI_2026_ASTRA_ELEVEN_CATALOG,
  ...MISSOURI_2026_LATE_FALL_CATALOG,
  ...MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG,
].filter((row) => row.seasonalListing.visibility === "listing-lifecycle");
const now = new Date("2026-11-05T12:00:00-06:00");
const queryFor = (row) => ({
  lat: row.lat,
  lon: row.lon,
  radiusMiles: 1,
  halloweenActive: false,
  activityTypes: ["anything"],
});
const responseFor = (query, venues) => {
  const patch =
    query.patchId &&
    planDateNightPatches(query, query.radiusMiles).find((patch) => patch.id === query.patchId);
  return {
    venues,
    source: "merged",
    ...(patch ? { patch: { id: patch.id, version: patch.version } } : {}),
    discovery: {
      partial: false,
      groups: buildDateNightQueryPlan(query.activityTypes, false).map((group) => ({
        ...group,
        outcome: "succeeded-empty",
      })),
    },
  };
};
const pool = (row, venues, date = now, filters = {}) =>
  eligibleDateNight(
    decorateDateNight(venues, row, date),
    {
      ...DEFAULT_DATE_NIGHT_FILTERS,
      radiusMiles: 1,
      activityTypes: ["anything"],
      openNowOnly: false,
      ...filters,
    },
    false,
    {},
    [],
    date.getTime(),
  );
function assertOrdinaryCoverage(response) {
  assert.ok(response.discovery.groups.length > 0);
  for (const group of response.discovery.groups) {
    assert.notEqual(group.id, "seasonal");
    assert.ok(group.activityTypes.every((type) => !HALLOWEEN_DATE_NIGHT_TYPES.includes(type)));
    assert.equal(group.outcome, "cache-hit");
    assert.equal(group.originOutcome, "succeeded-empty");
  }
}
function assertRetained(row, response) {
  assert.ok(response, "Client emission must contain a response");
  assert.deepEqual(
    response.venues.map((place) => place.id),
    [row.id],
  );
  assertOrdinaryCoverage(response);
  assert.equal(pool(row, response.venues).length, 1);
  for (const activityTypes of [["museum"], ["park"]])
    assert.equal(pool(row, response.venues, now, { activityTypes }).length, 0);
  assert.equal(pool(row, response.venues, now, { openNowOnly: true }).length, 0);
  const expiry = Date.parse(row.seasonalListing.listingExpiresAt);
  assert.equal(pool(row, response.venues, new Date(expiry - 1)).length, 1);
  for (const date of [new Date(expiry), new Date("2027-11-05T12:00:00-06:00")]) {
    assert.equal(pool(row, response.venues, date).length, 0);
    assert.equal(pool(row, response.venues, date, { openNowOnly: true }).length, 0);
  }
}

test("client-cache regression covers exactly Cobb, Brookdale, Creepyworld and Darkness", () => {
  assert.deepEqual(
    rows.map((row) => row.seasonalListing.recordId).sort(),
    ["DELTA3-COBB", "MO26-085", "DELTA-CREEPYWORLD-2026", "DELTA-DARKNESS-2026"].sort(),
  );
});
for (const row of rows) {
  test(`${row.name}: real discovery cache preserves lifecycle supplement beside empty ordinary provider coverage`, () => {
    const cache = createDateNightDiscoveryCache({ now: () => now.getTime() });
    const query = queryFor(row);
    assert.equal(cache.store(query, responseFor(query, [row])), true);
    const snapshot = cache.read(query);
    assert.deepEqual(snapshot.missingActivityTypes, []);
    assertRetained(row, snapshot.response);
    // Narrow category acquisition must keep truthful ordinary coverage; local
    // eligibility, not a fabricated seasonal provider group, selects activities.
    for (const activityTypes of [["museum"], ["park"]]) {
      const narrow = cache.read({ ...query, activityTypes });
      assert.deepEqual(narrow.missingActivityTypes, []);
      assertOrdinaryCoverage(narrow.response);
      assert.equal(pool(row, narrow.response.venues, now, { activityTypes }).length, 0);
    }
  });

  test(`${row.name}: real radial session emits retained core result and reuses it without a second request`, async (t) => {
    const cache = createDateNightRadialCache({ now: () => now.getTime() });
    const session = createDateNightRadialSession({ cache, now: () => now.getTime() });
    t.after(() => session.dispose());
    const updates = [],
      requests = [];
    const callbacks = {
      request: async (query) => {
        requests.push(query);
        return responseFor(query, [row]);
      },
      onChange: (state) => updates.push(state),
    };
    session.update(queryFor(row), callbacks);
    await flush();
    assert.equal(requests.length, 1);
    assert.equal(requests[0].patchId, "radial-v1:core");
    const settled = updates.at(-1);
    assert.equal(settled.loading, false);
    assert.equal(settled.coverage.complete, true);
    assertRetained(row, settled.response);
    session.update(queryFor(row), callbacks);
    await flush();
    assert.equal(requests.length, 1);
    assertRetained(row, updates.at(-1).response);
  });

  test(`${row.name}: discovery and radial caches retain canonical 24/7 aliases while honoring negative evidence`, () => {
    const provider = {
      ...row,
      id: "date-night-osm-node-88199",
      source: "osm",
      openingHours: "24/7",
      seasonalListing: undefined,
      seasonalAvailability: undefined,
      seasonalVisitNotes: undefined,
    };
    for (const radial of [false, true]) {
      for (const venues of [
        [row, provider],
        [provider, row],
      ]) {
        const cache = radial
          ? createDateNightRadialCache({ now: () => now.getTime() })
          : createDateNightDiscoveryCache({ now: () => now.getTime() });
        const query = { ...queryFor(row), ...(radial ? { patchId: "radial-v1:core" } : {}) };
        assert.equal(cache.store(query, responseFor(query, venues)), true);
        assertRetained(row, cache.read(query).response);
        assert.equal(
          cache.store(
            query,
            responseFor(query, [row, { ...provider, lifecycle: "permanently-closed" }]),
          ),
          true,
        );
        const negative = cache.read(query).response;
        assertOrdinaryCoverage(negative);
        assert.equal(pool(row, negative.venues).length, 0);
        assert.equal(pool(row, negative.venues, now, { openNowOnly: true }).length, 0);
      }
    }
  });
}

test("unknown lifecycle-shaped provider rows cannot manufacture curated supplement authority", () => {
  const row = rows[0],
    query = queryFor(row);
  const cache = createDateNightDiscoveryCache({ now: () => now.getTime() });
  const unknown = { ...row, id: "unreviewed-lifecycle-control", source: "osm" };
  cache.store(query, responseFor(query, [unknown]));
  const result = cache.read(query);
  assert.deepEqual(result.missingActivityTypes, []);
  assert.deepEqual(result.response.venues, []);
  assertOrdinaryCoverage(result.response);
});

for (const row of rows) {
  test(`${row.name}: partial ordinary success retains supplement without covering failed types`, () => {
    const query = queryFor(row);
    const cache = createDateNightDiscoveryCache({ now: () => now.getTime() });
    const response = responseFor(query, [row]);
    response.discovery.partial = true;
    for (const group of response.discovery.groups) {
      if (group.id !== "culture") group.outcome = "failed";
    }
    assert.equal(cache.store(query, response), true);
    const snapshot = cache.read(query);
    const failedTypes = response.discovery.groups
      .filter((group) => group.outcome === "failed")
      .flatMap((group) => group.activityTypes);
    assert.deepEqual([...snapshot.missingActivityTypes].sort(), [...failedTypes].sort());
    assertRetained(row, snapshot.response);
    assert.deepEqual(
      snapshot.response.discovery.groups.map((group) => group.id),
      ["culture"],
    );
    assert.ok(
      snapshot.response.discovery.groups.every((group) =>
        group.activityTypes.every((type) => !failedTypes.includes(type)),
      ),
    );
  });

  test(`${row.name}: fallback-only radial display retains supplement without provider coverage`, async (t) => {
    const cache = createDateNightRadialCache({ now: () => now.getTime() });
    const session = createDateNightRadialSession({ cache, now: () => now.getTime() });
    t.after(() => session.dispose());
    const updates = [],
      requests = [];
    session.update(queryFor(row), {
      request: async (query) => {
        requests.push(query);
        const response = responseFor(query, [row]);
        response.source = "fallback";
        for (const group of response.discovery.groups) group.outcome = "failed";
        return response;
      },
      onChange: (state) => updates.push(state),
    });
    await flush();
    const settled = updates.at(-1);
    assert.equal(requests.length, 1);
    assert.equal(settled.loading, false);
    assert.equal(settled.coverage.complete, false);
    assert.equal(settled.paused, true);
    assert.deepEqual(
      settled.response.venues.map((place) => place.id),
      [row.id],
    );
    assert.equal(pool(row, settled.response.venues).length, 1);
    assert.equal(pool(row, settled.response.venues, now, { openNowOnly: true }).length, 0);
    assert.ok(
      settled.response.discovery.groups.every(
        (group) => group.outcome === "failed" && group.id !== "seasonal",
      ),
    );
    const reread = cache.read(queryFor(row));
    assert.equal(reread.response, null);
    assert.equal(reread.coverage.complete, false);
    assert.ok(reread.coverage.patches[0].missingActivityTypes.length > 0);
  });

  test(`${row.name}: narrow radial radius excludes lifecycle supplement outside one mile`, async (t) => {
    const query = { ...queryFor(row), lat: row.lat + 0.04 };
    const cache = createDateNightRadialCache({ now: () => now.getTime() });
    const session = createDateNightRadialSession({ cache, now: () => now.getTime() });
    t.after(() => session.dispose());
    const updates = [];
    session.update(query, {
      request: async (acquisition) => responseFor(acquisition, [row]),
      onChange: (state) => updates.push(state),
    });
    await flush();
    const settled = updates.at(-1);
    assert.equal(settled.coverage.complete, true);
    assertOrdinaryCoverage(settled.response);
    assert.deepEqual(settled.response.venues, []);
    assert.deepEqual(cache.read(query).response.venues, []);
  });

  test(`${row.name}: stale current-ID cache snapshot rehydrates current visibility and expiry`, () => {
    const query = queryFor(row);
    const cache = createDateNightDiscoveryCache({ now: () => now.getTime() });
    const stale = {
      ...row,
      openingHours: "24/7",
      seasonalAvailability: {
        ...row.seasonalAvailability,
        openNowPolicy: undefined,
        activeUntil: "2027-12-31",
        endsAt: undefined,
      },
      seasonalListing: {
        ...row.seasonalListing,
        visibility: undefined,
        listingExpiresAt: "2027-12-31T23:59:59-06:00",
      },
    };
    assert.equal(cache.store(query, responseFor(query, [stale])), true);
    const snapshot = cache.read(query);
    assertRetained(row, snapshot.response);
    const restored = decorateDateNight(snapshot.response.venues, row, now)[0];
    assert.deepEqual(restored.seasonalListing, row.seasonalListing);
    assert.deepEqual(restored.seasonalAvailability, row.seasonalAvailability);
    assert.equal(restored.openingHours, null);
  });
}
