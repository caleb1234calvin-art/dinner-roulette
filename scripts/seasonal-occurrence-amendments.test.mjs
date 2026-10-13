import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { OCCURRENCE_AMENDMENTS, occurrenceCatalogAfter, occurrenceCatalogBefore,
  occurrencePresentationAfter, occurrencePresentationBefore, occurrenceSourceBefore,
  assertOccurrenceConsumerCopy } from "./test-support/occurrence-amendments.mjs";
const load = appModuleLoader();
const bytes = readFileSync("scripts/test-support/occurrence-release-baseline.json");
assert.equal(createHash("sha256").update(bytes).digest("hex"), "f9ab4af54bcff0d5206674c11370b35c0450a8edfa0a2688d1b8b19ce2fc7e0a");
const baseline = JSON.parse(bytes);
const files = readdirSync("src/lib/date-night").filter(file => /^missouri-.*catalog\.ts$/.test(file)).sort().map(file => `src/lib/date-night/${file}`);
const current = files.flatMap(file => Object.entries(load(file)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, rows]) => rows));
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { getCuratedSeasonalPlace, applyCuratedSeasonalPolicy } = load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds, SEASONAL_IDENTITY_RECEIPTS_KEY } = load("src/lib/date-night/identity-receipts.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-31T20:00:00-05:00");
const pool = (row, places, now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, season, preferences, exclusions, now.getTime());
const plain = value => JSON.parse(JSON.stringify(value));

test("exact 13-field amendment chain preserves all 67 identities and every other field", () => {
  assert.equal(createHash("sha256").update(readFileSync("audit/occurrence-amendments-2026-10-13/AUTHOR-PROJECTIONS-R1.json")).digest("hex"), "0b32fc6fdb1840dd66606bd766e7a89c86729a939c8176799aabf32dec0b4098");
  assert.deepEqual(JSON.parse(readFileSync("audit/occurrence-amendments-2026-10-13/AUTHOR-PROJECTIONS-R1.json")).projections, OCCURRENCE_AMENDMENTS);
  assert.equal(baseline.source, "8353e60056fb0568360c5c13878d102880395d9f");
  assert.equal(baseline.tree, "a10e02b3151fda349322b612c371ddacd88350e1");
  assert.equal(current.length, 67); assert.equal(baseline.catalog.length, 67);
  assert.deepEqual(files, Object.keys(baseline.files));
  assert.deepEqual(current.map(row => row.id), baseline.catalog.map(row => row.id));
  assert.equal(new Set(current.map(row => row.id)).size, 67);
  assert.equal(new Set(current.map(row => row.seasonalListing.recordId)).size, 67);
  assert.deepEqual(plain(current), baseline.catalog.map(occurrenceCatalogAfter));
  assert.deepEqual(plain(current.map(occurrenceCatalogBefore)), baseline.catalog);
  assert.deepEqual(Object.keys(SEASONAL_PRESENTATIONS).sort(), Object.keys(baseline.presentations).sort());
  for (const [id, before] of Object.entries(baseline.presentations)) {
    assert.deepEqual(SEASONAL_PRESENTATIONS[id], occurrencePresentationAfter(id, before), id);
    assert.deepEqual(occurrencePresentationBefore(id, SEASONAL_PRESENTATIONS[id]), before, id);
  }
  for (const [file, hash] of Object.entries(baseline.files)) assert.equal(createHash("sha256").update(occurrenceSourceBefore(file)).digest("hex"), hash, file);
  assert.equal(current.filter(row => !OCCURRENCE_AMENDMENTS.some(item => item.canonicalId === row.id)).length, 65);
});

test("amendment checks reject stale before/after values and preserve metadata rather than claim new freshness", () => {
  for (const amendment of OCCURRENCE_AMENDMENTS) {
    const before = baseline.catalog.find(row => row.id === amendment.canonicalId), row = getCuratedSeasonalPlace(before.id);
    const malformed = structuredClone(before); malformed.seasonalVisitNotes[0] += " unsupported";
    assert.throws(() => occurrenceCatalogAfter(malformed));
    const malformedAfter = structuredClone(row); malformedAfter.seasonalVisitNotes[0] += " unsupported";
    assert.throws(() => occurrenceCatalogBefore(malformedAfter));
    for (const key of ["checkedAt", "revalidateAfter"]) assert.equal(row.seasonalAvailability[key], before.seasonalAvailability[key]);
    assert.equal(row.seasonalListing.reviewRevision, before.seasonalListing.reviewRevision);
    assert.deepEqual(row.seasonalListing.placement, before.seasonalListing.placement);
    assert.deepEqual(row.seasonalListing.directionsTarget, before.seasonalListing.directionsTarget);
    assert.equal(row.openingHours, null); assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assertOccurrenceConsumerCopy(amendment.recordId, SEASONAL_PRESENTATIONS[amendment.recordId].details);
    assert.throws(() => assertOccurrenceConsumerCopy(amendment.recordId, baseline.presentations[amendment.recordId].details));
  }
});

for (const [index, amendment] of OCCURRENCE_AMENDMENTS.entries()) {
  const before = baseline.catalog.find(row => row.id === amendment.canonicalId);
  const row = getCuratedSeasonalPlace(amendment.canonicalId);
  const provider = { ...before, id: `date-night-osm-node-${997810 + index}`, source: "osm", openingHours: "24/7", seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined };
  const cutoff = Date.parse(row.seasonalListing.listingExpiresAt);
  test(`${amendment.recordId}: older exact-ID cache and both duplicate orders obey current cutoff ±1 and no 2027`, () => {
    const old = structuredClone(before);
    assert.deepEqual(applyCuratedSeasonalPolicy(old).seasonalAvailability, row.seasonalAvailability);
    for (const order of [[old, provider], [provider, old], [old, row], [row, old]]) {
      const merged = dedupeDateNight(order);
      const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
      for (const places of [merged, cached.venues]) {
        assert.equal(places.length, 1); assert.equal(places[0].id, row.id);
        assert.deepEqual(places[0].seasonalAvailability, row.seasonalAvailability);
        assert.deepEqual(places[0].seasonalListing, row.seasonalListing);
        for (const delta of [-1, 0, 1]) assert.equal(pool(row, places, new Date(cutoff + delta)).length, delta < 0 ? 1 : 0);
        assert.equal(pool(row, places, at, { openNowOnly: true }).length, 0);
        assert.equal(pool(row, places, new Date("2027-10-31T20:00:00-05:00")).length, 0);
      }
    }
    assert.deepEqual(old, before, "Cache input must not mutate");
  });
  test(`${amendment.recordId}: permanent closure/disused and all historical exclusions survive amendment`, () => {
    for (const lifecycle of ["permanently-closed", "disused"]) {
      const negative = { ...before, lifecycle };
      assert.equal(pool(row, [negative]).length, 0);
      for (const order of [[row, { ...provider, lifecycle }], [{ ...provider, lifecycle }, row]]) {
        assert.equal(pool(row, dedupeDateNight(order)).length, 0);
        assert.equal(pool(row, combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" }).venues).length, 0);
      }
    }
    assert.equal(pool(row, [before], at, { favoritesOnly: true }).length, 0);
    assert.equal(pool(row, [before], at, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, 1);
    assert.equal(pool(row, [before], at, {}, { [row.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(row, [before], at, {}, {}, [{ restaurantId: row.id, expiresAt: at.getTime() + 1 }]).length, 0);
    assert.equal(pool(row, [before], at, {}, {}, [], false).length, 0);
    assert.equal(pool(row, [before], at, { activityTypes: ["museum"] }).length, 0);
    assert.equal(pool({ ...row, lat: row.lat + 0.04 }, [before]).length, 0);
    assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), before.address);
    assert.equal(uberRideTarget(row).url, "https://m.uber.com/");
  });
  test(`${amendment.recordId}: old approved provider receipt and saved canonical ID restore amended record`, t => {
    const storage = new Map(), prior = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } });
    t.after(() => prior ? Object.defineProperty(globalThis, "localStorage", prior) : delete globalThis.localStorage);
    storage.set(SEASONAL_IDENTITY_RECEIPTS_KEY, JSON.stringify({ [provider.id]: { canonicalId: before.id, canonicalName: before.name, reviewRevision: before.seasonalListing.reviewRevision } }));
    for (const restaurantId of [row.id, provider.id]) {
      const saved = resolveSavedSeasonalPlace({ restaurantId, name: before.name });
      assert.equal(saved, row); assert.equal(pool(row, [saved]).length, 1);
      assert.equal(pool(row, [saved], new Date(cutoff)).length, 0);
    }
    recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
    assert.equal(resolveSavedSeasonalPlace({ restaurantId: "date-night-osm-node-999999", name: row.name }), undefined);
  });
  test(`${amendment.recordId}: search success and fallback use the current reviewed record`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() }); let outage = false;
    t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Controlled provider outage"); return Response.json({ elements: [] }); });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true };
    for (const failure of [false, true]) {
      outage = failure; const result = await searchDateNight({ data: query });
      const found = result.venues.find(item => item.id === row.id); assert.ok(found);
      assert.deepEqual(found.seasonalAvailability, row.seasonalAvailability);
      assert.equal(pool(row, result.venues).filter(item => item.id === row.id).length, 1);
    }
  });
}

test("Hollows lawful extension crosses the old cutoff, retains historical dates and adds no inferred dates", () => {
  const before = baseline.catalog.find(row => row.seasonalListing.recordId === "DELTA2-HOLLOWS"), row = getCuratedSeasonalPlace(before.id);
  assert.deepEqual(row.seasonalAvailability.activeDates, ["2026-10-09", "2026-10-10", "2026-10-16", "2026-10-17", "2026-10-23", "2026-10-24", "2026-10-30", "2026-10-31"]);
  assert.equal(Date.parse(row.seasonalListing.listingExpiresAt), Date.parse("2026-11-01T04:00:00Z"));
  for (const delta of [-1, 0, 1]) assert.equal(pool(row, [before], new Date(Date.parse(before.seasonalListing.listingExpiresAt) + delta)).length, 1);
  for (const day of ["2026-10-16", "2026-10-17", "2026-10-23", "2026-10-31"]) assert.equal(pool(row, [before], new Date(`${day}T20:00:00-05:00`)).length, 1);
  for (const day of ["2026-10-11", "2026-10-18", "2026-10-25"]) assert.equal(row.seasonalAvailability.activeDates.includes(day), false);
});

test("Nightmare preserves entire lifecycle and distinguishes ticket time from closing", () => {
  const before = baseline.catalog.find(row => row.seasonalListing.recordId === "DELTA2-MISSOURI-NIGHTMARE"), row = getCuratedSeasonalPlace(before.id);
  assert.deepEqual(row.seasonalAvailability, before.seasonalAvailability);
  assert.equal(row.seasonalListing.listingExpiresAt, "2026-11-01T20:30:00-06:00");
  assert.equal(Date.parse(row.seasonalListing.listingExpiresAt), Date.parse("2026-11-02T02:30:00Z"));
  assert.equal(row.seasonalAvailability.activeDates, undefined);
  assert.match(row.seasonalListing.hours.displayText, /final listed ticket time is November 1 at 8:30 p\.m\. CST/);
  assert.doesNotMatch(row.seasonalListing.hours.displayText, /occurrence ends|event ends|closing/);
});
