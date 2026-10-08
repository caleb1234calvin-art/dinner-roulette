import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_DEFERRED_BATCH_3_CATALOG } = load(
  "src/lib/date-night/missouri-2026-deferred-batch-3-catalog.ts",
);
const { MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG } = load(
  "src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts",
);
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts } = load(
  "src/lib/date-night/identity-receipts.ts",
);

const ids = ["MO26-058", "DELTA-EDGE-2026"];
const rows = [
  ...MISSOURI_2026_DEFERRED_BATCH_3_CATALOG,
  ...MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG,
].filter((row) => ids.includes(row.seasonalListing.recordId));
const beforeEnd = [
  "2026-10-31T23:59:59.999-05:00",
  "2026-11-01T00:00:00-05:00",
  "2026-11-01T00:29:59.999-05:00",
].map((value) => new Date(value));
const end = new Date("2026-11-01T00:30:00-05:00");
const afterEnd = [
  end,
  new Date(end.getTime() + 1),
  new Date("2026-11-01T01:30:00-05:00"),
  new Date("2026-11-01T01:30:00-06:00"),
  new Date("2027-10-31T23:59:59-05:00"),
];
const pool = (row, places, now, openNowOnly = false) =>
  eligibleDateNight(
    decorateDateNight(places, row, now),
    { ...DEFAULT_DATE_NIGHT_FILTERS, activityTypes: ["anything"], radiusMiles: 15, openNowOnly },
    true,
    {},
    [],
    now.getTime(),
  );
const providerFor = (row) => ({
  ...row,
  id: "date-night-osm-node-99777",
  source: "osm",
  openingHours: "24/7",
  seasonalListing: undefined,
  seasonalAvailability: undefined,
  seasonalVisitNotes: undefined,
});

function assertFinalEnd(row, places) {
  for (const now of beforeEnd) {
    assert.equal(pool(row, places, now).length, 1, now.toISOString());
    assert.equal(
      pool(row, places, now, true).length,
      0,
      "Browse retention is never machine Open Now evidence",
    );
    const decorated = decorateDateNight(places, row, now);
    assert.equal(decorated[0].availability.openNowEligible, false);
    assert.equal(decorated[0].isOpen, false);
  }
  for (const now of afterEnd) {
    assert.equal(pool(row, places, now).length, 0, now.toISOString());
    assert.equal(pool(row, places, now, true).length, 0);
    assert.equal(decorateDateNight(places, row, now)[0].availability.status, "finished-season");
  }
}

test("Beast and Edge retain their original October final active date and exact overnight end", () => {
  assert.deepEqual(rows.map((row) => row.seasonalListing.recordId).sort(), [...ids].sort());
  for (const row of rows) {
    assert.equal(row.seasonalAvailability.activeUntil, "2026-10-31");
    assert.equal(row.seasonalAvailability.activeDates.at(-1), "2026-10-31");
    assert.ok(row.seasonalAvailability.activeDates.every((day) => day <= "2026-10-31"));
    assert.equal(row.seasonalAvailability.activeDates.includes("2026-11-01"), false);
    assert.equal(row.seasonalListing.listingExpiresAt, "2026-11-01T00:30:00-05:00");
    assert.equal(row.seasonalListing.expiryBasis, "exact");
    assert.equal(row.seasonalListing.timeZone, "America/Chicago");
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.openingHours, null);
  }
});

for (const row of rows) {
  test(`${row.name}: midnight is eligible, exact 00:30 CDT end is terminal`, () => {
    assertFinalEnd(row, [row]);
  });

  test(`${row.name}: 24/7 duplicates and JSON-resumed cache snapshots preserve the exact final end`, () => {
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
      for (const places of [merged, cached.venues, JSON.parse(JSON.stringify(cached.venues))]) {
        assert.equal(places.length, 1);
        assert.equal(places[0].id, row.id);
        assert.equal(places[0].openingHours, null);
        assertFinalEnd(row, places);
      }
    }
  });

  test(`${row.name}: stale canonical snapshots and saved provider receipts restore current exact-end policy`, (t) => {
    const storage = new Map();
    const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      },
    });
    t.after(() =>
      previous
        ? Object.defineProperty(globalThis, "localStorage", previous)
        : delete globalThis.localStorage,
    );
    const stale = JSON.parse(
      JSON.stringify({
        ...row,
        lat: 0,
        lon: 0,
        openingHours: "24/7",
        seasonalListing: undefined,
        seasonalAvailability: undefined,
      }),
    );
    assertFinalEnd(row, [stale]);
    const restored = decorateDateNight([stale], row, beforeEnd[1])[0];
    assert.deepEqual([restored.lat, restored.lon], [row.lat, row.lon]);
    assert.deepEqual(restored.seasonalListing, row.seasonalListing);
    const provider = providerFor(row);
    recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    for (const restaurantId of [row.id, provider.id]) {
      const saved = resolveSavedSeasonalPlace({ restaurantId, name: row.name });
      assert.equal(saved.id, row.id);
      assertFinalEnd(row, [saved]);
    }
  });
}

// Synthetic, distinct IDs prevent canonical rehydration from replacing each
// control's deliberately non-exact policy with the actual reviewed exact record.
for (const expiryBasis of ["date-only", "editorial", undefined]) {
  test(`${expiryBasis ?? "unknown"} retention cannot borrow an exact event's post-midnight extension`, () => {
    const row = rows[0];
    const control = {
      ...row,
      id: `non-exact-control-${expiryBasis}`,
      seasonalListing: {
        ...row.seasonalListing,
        recordId: "CONTROL",
        expiryBasis,
      },
    };
    assert.equal(pool(row, [control], beforeEnd[0]).length, 1);
    for (const now of beforeEnd.slice(1)) {
      assert.equal(pool(row, [control], now).length, 0);
      assert.equal(pool(row, [control], now, true).length, 0);
    }
  });
}

test("unreviewed provider calendar and negative lifecycle cannot borrow exact curated retention", () => {
  const row = rows[0];
  const provider = { ...providerFor(row), seasonalAvailability: row.seasonalAvailability };
  for (const now of beforeEnd.slice(1)) assert.equal(pool(row, [provider], now).length, 0);
  for (const lifecycle of ["permanently-closed", "disused"]) {
    for (const now of beforeEnd) assert.equal(pool(row, [{ ...row, lifecycle }], now).length, 0);
  }
});

test("explicit earlier final endsAt and invalid exact timestamps remain terminal", () => {
  const row = rows[0];
  const earlier = {
    ...row,
    id: "earlier-end-control",
    seasonalAvailability: {
      ...row.seasonalAvailability,
      endsAt: "2026-11-01T00:15:00-05:00",
    },
  };
  assert.equal(pool(row, [earlier], new Date("2026-11-01T00:14:59.999-05:00")).length, 1);
  assert.equal(pool(row, [earlier], new Date("2026-11-01T00:15:00-05:00")).length, 0);
  for (const listingExpiresAt of [
    "not-a-date",
    "2026-11-01T00:30:00",
    "2026-02-30T00:30:00-06:00",
  ]) {
    const malformed = {
      ...row,
      id: "invalid-end-control",
      seasonalListing: {
        ...row.seasonalListing,
        listingExpiresAt,
      },
    };
    for (const now of beforeEnd) assert.equal(pool(row, [malformed], now).length, 0);
  }
});
