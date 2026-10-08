import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG: rows } = load("src/lib/date-night/missouri-2026-v1-next-catalog.ts");
const { MISSOURI_2026_V1_SEASONAL_CATALOG: first } = load("src/lib/date-night/missouri-2026-v1-catalog.ts");
const { MISSOURI_2026_CLEARED_SEASONAL_CATALOG: prior } = load("src/lib/date-night/missouri-2026-cleared-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { seasonalPresentation } = load("src/lib/date-night/seasonal-presentation.ts");
const { resolveSavedSeasonalPlace, seasonalReceiptAliasIds, SEASONAL_IDENTITY_RECEIPTS_KEY } = load("src/lib/date-night/identity-receipts.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-10T20:00:00Z");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = []) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, openNowOnly: false, radiusMiles: 50, ...filters }, true, preferences, exclusions, now.getTime());

test("Next batch contains only the bounded freshly reviewed record IDs with unique canonical identities", () => {
  const audit = JSON.parse(readFileSync("audit/seasonal-completeness-v1-next-import.json"));
  assert.ok(rows.length > 0 && rows.length <= 10);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId).sort(), audit.selectedRecordIds.toSorted());
  const all = [...prior, ...first, ...rows];
  assert.equal(new Set(all.map(row => row.id)).size, all.length);
  assert.equal(new Set(all.map(row => row.seasonalListing.recordId)).size, all.length);
  for (const row of rows) {
    assert.equal(row.openingHours, null); assert.equal(row.priceLevel, null);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.seasonalListing.seasonYear, 2026);
    assert.ok(row.seasonalListing.placement.sourceUrl);
    assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
    assert.ok(seasonalPresentation(row).details.length);
    const source = audit.research.records.find(record => record.recordId === row.seasonalListing.recordId).approvedProjection;
    const lifecycle = source.lifecycle;
    assert.equal(row.address, source.visitorAddress.text ?? source.visitorAddress.address);
    assert.deepEqual([row.lat, row.lon], [source.placement.lat, source.placement.lon]);
    assert.equal(row.seasonalListing.placement.basis, source.placement.basis);
    assert.equal(row.seasonalListing.placement.sourceUrl, source.placement.sourceUrl);
    assert.equal(row.seasonalListing.listingExpiresAt, lifecycle.listingExpiresAt);
    assert.equal(row.seasonalListing.expiryBasis, lifecycle.eventEndsAt ? "exact" : "date-only");
    assert.deepEqual(row.seasonalListing.hours, { state: source.hours.state, displayText: source.hours.displayText });
    assert.equal(row.seasonalAvailability.activeFrom, source.seasonStartDate ?? lifecycle.seasonStartDate ?? lifecycle.seasonStartsOn);
    assert.equal(row.seasonalAvailability.activeUntil, source.seasonEndDate ?? lifecycle.seasonEndDate ?? lifecycle.eventEndsOn ?? lifecycle.lastSourcedActiveDate);
    assert.deepEqual(row.seasonalAvailability.activeDates ?? null, source.exactActiveDates ?? lifecycle.exactActiveDates ?? lifecycle.knownActiveDates ?? null);
    assert.equal(row.seasonalAvailability.endsAt ?? null, lifecycle.eventEndsAt ?? null);
    const categories = { "Corn Maze": "corn-maze", "Pumpkin Patch": "pumpkin-patch", "Other Halloween / Fall": "other-halloween-fall", "Haunted House / Haunted Attraction": "haunted-house" };
    assert.deepEqual(row.activityTypes, source.categories.map(category => categories[category]));
  }
});
for (const row of rows) test(`Next batch ${row.id}: radius, navigation, preferences, exact expiry and provider 24/7`, () => {
  assert.equal(pool(row).length, 1); assert.equal(pool(row, [row], at, { openNowOnly: true }).length, 0);
  assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
  assert.equal(uberRideTarget(row).url, "https://m.uber.com/");
  assert.equal(pool(row, [row], at, { favoritesOnly: true }).length, 0);
  assert.equal(pool(row, [row], at, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, 1);
  assert.equal(pool(row, [row], at, {}, { [row.id]: { neverRecommend: true } }).length, 0);
  assert.equal(pool(row, [row], at, {}, {}, [{ restaurantId: row.id, expiresAt: at.getTime() + 1000 }]).length, 0);
  const provider = { ...row, id: "date-night-osm-node-996", source: "osm", seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined, openingHours: "24/7" };
  for (const order of [[provider, row], [row, provider]]) {
    const merged = dedupeDateNight(order);
    assert.equal(merged.length, 1); assert.equal(merged[0].id, row.id);
    assert.equal(merged[0].openingHours, null);
    const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
    assert.equal(pool(row, cached.venues, at, { openNowOnly: true }).length, 0);
    const expiry = Date.parse(row.seasonalListing.listingExpiresAt);
    assert.equal(pool(row, merged, new Date(expiry - 1)).length, 1);
    for (const now of [new Date(expiry), new Date(expiry + 1000), new Date("2027-10-10T20:00:00Z")]) {
      assert.equal(pool(row, cached.venues, now).length, 0);
      assert.equal(pool(row, cached.venues, now, { openNowOnly: true }).length, 0);
    }
  }
  const other = { ...row, id: "distinct-curated", name: "A separate seasonal event", seasonalListing: { ...row.seasonalListing, recordId: "different" } };
  assert.equal(dedupeDateNight([row, other]).length, 2, "Shared approximate geometry is not shared identity");
});
for (const row of rows) test(`Next batch ${row.id}: real search fallback and season-off`, async t => {
  t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
  let outage = true;
  t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Bounded fixture outage"); return Response.json({ elements: [] }); });
  const input = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: row.activityTypes, spookySeasonEnabled: true };
  const response = await searchDateNight({ data: input });
  assert.ok(response.venues.some(place => place.id === row.id));
  outage = false; // Season-off empty provider success is distinct from an unavailable provider with no fallback.
  const off = await searchDateNight({ data: { ...input, spookySeasonEnabled: false } });
  assert.ok(!off.venues.some(place => place.id === row.id));
});
test("Batch addition preserves existing reviewed identity receipt revisions and direct Favorites navigation", t => {
  const receipts = Object.fromEntries([...prior, ...first].map((row, index) => [`date-night-osm-node-${800 + index}`, {
    canonicalId: row.id, canonicalName: row.name, reviewRevision: index < 2 ? "Shipped-two-record-corrected-projections-2026-10-07" : "MO2026-Phase2-R2-76896ea4",
  }]));
  const existing = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => key === SEASONAL_IDENTITY_RECEIPTS_KEY ? JSON.stringify(receipts) : null } });
  t.after(() => existing ? Object.defineProperty(globalThis, "localStorage", existing) : delete globalThis.localStorage);
  for (const [index, row] of [...prior, ...first].entries()) {
    const provider = `date-night-osm-node-${800 + index}`;
    const current = resolveSavedSeasonalPlace({ restaurantId: provider, name: row.name });
    assert.equal(current.id, row.id);
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider));
    assert.equal(new URL(directionsUrl(current)).searchParams.get("destination"), row.seasonalListing.directionsTarget.kind === "verified-point" ? `${row.lat},${row.lon}` : row.address);
    assert.deepEqual(seasonalPresentation(current), seasonalPresentation(row));
  }
  assert.ok(!resolveSavedSeasonalPlace({ restaurantId: "date-night-osm-node-800", name: "Another name" }));
});
