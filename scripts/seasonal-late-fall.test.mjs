import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_LATE_FALL_CATALOG } = load(
  "src/lib/date-night/missouri-2026-late-fall-catalog.ts",
);
const { MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG } = load(
  "src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts",
);
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { isHalloweenDateNightSeason, dateNightChipsForNow, HALLOWEEN_DATE_NIGHT_TYPES } = load(
  "src/lib/date-night/season.ts",
);
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds } = load(
  "src/lib/date-night/identity-receipts.ts",
);
const { searchDateNight } = load("src/lib/date-night/search.ts");

const rows = [
  ...MISSOURI_2026_LATE_FALL_CATALOG,
  ...MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG,
].filter((row) => row.seasonalListing.visibility === "listing-lifecycle");
const nov5 = new Date("2026-11-05T12:00:00-06:00");
const pool = (row, places = [row], now = nov5, filters = {}, halloweenActive = false) =>
  eligibleDateNight(
    decorateDateNight(places, row, now),
    {
      ...DEFAULT_DATE_NIGHT_FILTERS,
      radiusMiles: 15,
      activityTypes: ["anything"],
      openNowOnly: false,
      ...filters,
    },
    halloweenActive,
    {},
    [],
    now.getTime(),
  );
const providerFor = (row, index = 0) => ({
  ...row,
  id: `date-night-osm-node-${99000 + index}`,
  source: "osm",
  openingHours: "24/7",
  seasonalListing: undefined,
  seasonalAvailability: undefined,
  seasonalVisitNotes: undefined,
});

// Independently verified final operating times, after Chicago's DST rollback.
// The -06:00 offset is intentional, not the October daylight-saving offset.
const effectiveExpiry = {
  "MO26-085": "2026-11-08T18:00:00-06:00",
  "DELTA-CREEPYWORLD-2026": "2026-11-13T22:00:00-06:00",
  "DELTA-DARKNESS-2026": "2026-11-13T22:00:00-06:00",
};

test("all three reviewed late-fall identities have lifecycle-only visibility", () => {
  assert.deepEqual(
    rows.map((row) => row.seasonalListing.recordId).sort(),
    Object.keys(effectiveExpiry).sort(),
  );
  for (const row of rows) {
    assert.equal(getCuratedSeasonalPlace(row.id)?.id, row.id);
    assert.equal(row.seasonalListing.timeZone, "America/Chicago");
    assert.equal(row.seasonalListing.seasonYear, 2026);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.openingHours, null);
  }
});

test("Halloween chips end November 2 without hiding late-fall Anything results", () => {
  // UI season intentionally follows the user's local calendar.
  assert.equal(isHalloweenDateNightSeason(new Date(2026, 10, 2, 23, 59, 59)), true);
  assert.equal(isHalloweenDateNightSeason(new Date(2026, 10, 3, 0, 0, 0)), false);
  for (const enabled of [false, true]) {
    const chips = dateNightChipsForNow(enabled, nov5).map((chip) => chip.id);
    assert.ok(HALLOWEEN_DATE_NIGHT_TYPES.every((type) => !chips.includes(type)));
  }
  for (const row of rows) {
    assert.deepEqual(
      pool(row).map((place) => place.id),
      [row.id],
    );
    assert.equal(pool(row, [row], nov5, { openNowOnly: true }).length, 0);
    assert.equal(pool(row, [row], nov5, { activityTypes: ["museum"] }).length, 0);
  }
});

for (const row of rows) {
  test(`${row.name}: real Anything search retains curated results without seasonal provider queries`, async (t) => {
    t.mock.timers.enable({ apis: ["Date"], now: nov5.getTime() });
    const queries = [];
    t.mock.method(globalThis, "fetch", async (_url, init) => {
      queries.push(decodeURIComponent(String(init.body)));
      return Response.json({ elements: [] });
    });
    for (const spookySeasonEnabled of [false, true]) {
      const response = await searchDateNight({
        data: {
          lat: row.lat,
          lon: row.lon,
          radiusMiles: 1,
          activityTypes: ["anything"],
          spookySeasonEnabled,
        },
      });
      assert.ok(response.venues.some((place) => place.id === row.id));
      assert.ok(pool(row, response.venues).some((place) => place.id === row.id));
      assert.ok(
        response.discovery.groups.every(
          (group) =>
            group.id !== "seasonal" &&
            group.activityTypes.every((type) => !HALLOWEEN_DATE_NIGHT_TYPES.includes(type)),
        ),
      );
    }
    assert.ok(queries.length > 0, "The assertion inspects actual provider calls");
    for (const query of queries) {
      assert.doesNotMatch(query, /seasonal_context/);
      // Negative lifecycle acquisition still inspects seasonal venue contexts.
      // Only the final result union must omit positive seasonal discovery.
      const resultUnion = query.split("->.lifecycle_context;").at(-1);
      assert.doesNotMatch(
        resultUnion,
        /corn_maze|maize_maze|pumpkin_patch|haunted_house|haunted_trail|haunted_forest|haunted_attraction/,
      );
    }
  });

  test(`${row.name}: exact effective expiry and next-year non-revival across DST`, () => {
    const expiry = Date.parse(effectiveExpiry[row.seasonalListing.recordId]);
    const metadataExpiry = Date.parse(row.seasonalListing.listingExpiresAt);
    assert.equal(row.seasonalAvailability.listingExpiresAt, row.seasonalListing.listingExpiresAt);
    assert.equal(metadataExpiry, expiry);
    assert.equal(Date.parse(row.seasonalAvailability.endsAt), expiry);
    assert.equal(row.seasonalListing.expiryBasis, "exact");
    for (const now of [
      new Date("2026-11-01T01:30:00-05:00"),
      new Date("2026-11-01T01:30:00-06:00"),
      new Date(expiry - 1),
    ]) {
      assert.equal(pool(row, [row], now).length, 1, now.toISOString());
      assert.equal(pool(row, [row], now, { openNowOnly: true }).length, 0);
    }
    for (const now of [
      new Date(expiry),
      new Date(expiry + 1),
      new Date(metadataExpiry),
      new Date("2027-10-10T20:00:00Z"),
    ]) {
      for (const halloweenActive of [false, true])
        assert.equal(pool(row, [row], now, {}, halloweenActive).length, 0, now.toISOString());
      assert.equal(decorateDateNight([row], row, now)[0].availability.status, "finished-season");
    }
  });

  test(`${row.name}: 24/7 duplicates and cache assembly never override current lifecycle`, () => {
    const provider = providerFor(row);
    for (const order of [
      [provider, row],
      [row, provider],
    ]) {
      const merged = dedupeDateNight(order);
      const cached = combineDateNightDiscovery(
        { response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] },
        { venues: [order[1]], source: "live" },
      );
      for (const places of [merged, cached.venues]) {
        assert.equal(places.length, 1);
        assert.equal(places[0].id, row.id);
        assert.equal(places[0].openingHours, null);
        assert.deepEqual(places[0].seasonalListing, row.seasonalListing);
        assert.equal(pool(row, places).length, 1);
        assert.equal(pool(row, places, nov5, { openNowOnly: true }).length, 0);
        assert.equal(decorateDateNight(places, row, nov5)[0].isOpen, false);
        const expiry = Date.parse(effectiveExpiry[row.seasonalListing.recordId]);
        assert.equal(pool(row, places, new Date(expiry - 1)).length, 1);
        assert.equal(pool(row, places, new Date(expiry)).length, 0);
        assert.equal(pool(row, places, new Date("2027-10-10T20:00:00Z"), {}, true).length, 0);
      }
      const negative = combineDateNightDiscovery(
        {
          response: { venues: [row], source: "merged" },
          missingActivityTypes: [],
          negativeEvidence: [{ ...provider, lifecycle: "permanently-closed" }],
        },
        { venues: [], source: "live" },
      );
      assert.equal(
        pool(row, negative.venues).length,
        0,
        "Cached negative evidence must not resurrect the venue",
      );
    }
  });

  test(`${row.name}: stale canonical snapshots and saved provider receipts rehydrate current policy`, (t) => {
    const storage = new Map();
    const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      },
    });
    t.after(() =>
      previousStorage
        ? Object.defineProperty(globalThis, "localStorage", previousStorage)
        : delete globalThis.localStorage,
    );
    const stale = {
      ...row,
      lat: 0,
      lon: 0,
      openingHours: "24/7",
      seasonalAvailability: undefined,
      seasonalListing: undefined,
      seasonalVisitNotes: undefined,
    };
    const restored = decorateDateNight([stale], row, nov5)[0];
    assert.deepEqual([restored.lat, restored.lon], [row.lat, row.lon]);
    assert.deepEqual(restored.seasonalListing, row.seasonalListing);
    assert.equal(restored.isOpen, false);
    assert.equal(pool(row, [stale]).length, 1);
    assert.equal(
      pool(row, [stale], new Date(effectiveExpiry[row.seasonalListing.recordId])).length,
      0,
    );
    assert.equal(resolveSavedSeasonalPlace({ restaurantId: row.id, name: row.name }).id, row.id);
    const provider = providerFor(row);
    assert.equal(
      resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name }),
      undefined,
    );
    recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
    const saved = resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name });
    assert.equal(saved.id, row.id);
    assert.deepEqual(saved.seasonalListing, row.seasonalListing);
    assert.equal(pool(row, [saved]).length, 1);
    assert.equal(pool(row, [saved], nov5, { openNowOnly: true }).length, 0);
    assert.equal(
      pool(row, [saved], new Date(effectiveExpiry[row.seasonalListing.recordId])).length,
      0,
    );
    assert.equal(pool(row, [saved], new Date("2027-10-10T20:00:00Z"), {}, true).length, 0);
  });
}

test("ordinary seasonal records cannot inherit lifecycle-only post-window visibility", () => {
  for (const row of rows) {
    const ordinary = {
      ...row,
      id: `control-${row.id}`,
      seasonalListing: { ...row.seasonalListing, recordId: "CONTROL", visibility: undefined },
    };
    assert.equal(pool(row, [ordinary]).length, 0);
  }
});


test("late-fall ordinary filters stay explicit and stale seasonal-only filters normalize without seasonal queries", () => {
  const { buildDateNightQueryPlan, buildDateNightQuery } = load("src/lib/date-night/query-plan.ts");
  for (const row of rows) {
    for (const activityTypes of [["museum"], ["park"], ["museum", "haunted-house"]]) {
      assert.equal(pool(row, [row], nov5, { activityTypes }).length, 0);
    }
    for (const activityTypes of [["haunted-house"], ["corn-maze"], ["other-halloween-fall"]]) {
      assert.deepEqual(pool(row, [row], nov5, { activityTypes }).map(place => place.id), [row.id]);
      const plan = buildDateNightQueryPlan(activityTypes, false);
      assert.ok(plan.length > 0);
      assert.ok(plan.every(group => group.id !== "seasonal"));
      for (const group of plan) assert.doesNotMatch(buildDateNightQuery(group, row.lat, row.lon, 1609), /seasonal_context/);
    }
    assert.equal(pool(row, [row], new Date("2026-10-20T18:00:00-05:00"), {}, false).length, 1,
      "Explicit lifecycle visibility also survives an October user switch-off");
  }
});
