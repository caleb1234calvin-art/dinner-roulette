import { occurrenceSourceBefore } from "./test-support/occurrence-amendments.mjs";
import { OWNER_EVIDENCE_MATERIAL_FACTS } from "./test-support/owner-evidence-browser-facts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { admissionPresentationAfter } from "./test-support/admission-amendments.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { NEXT_MISSOURI_PROJECTION_SHA256, NEXT_MISSOURI_MATERIAL_FACTS } from "./test-support/next-missouri-browser-facts.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_HOLD_CLEANUP_CATALOG: cleanupAdditions } = load("src/lib/date-night/missouri-2026-hold-cleanup-catalog.ts");
const { MISSOURI_2026_NEXT_CATALOG: additions, MISSOURI_2026_NEXT_LISTINGS: listings } = load("src/lib/date-night/missouri-2026-next-catalog.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds } = load("src/lib/date-night/identity-receipts.ts");
const { seasonalListingToPlace } = load("src/lib/date-night/listing.ts");
const { seasonalPresentation } = load("src/lib/date-night/seasonal-presentation.ts");
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const acceptedBytes = readFileSync("scripts/test-support/next-missouri-browser-projections.json");
const accepted = JSON.parse(acceptedBytes);
const baselineBytes = readFileSync("scripts/test-support/next-missouri-baseline-receipts.json");
const baseline = JSON.parse(baselineBytes);
const previousRows = Object.keys(baseline.files).flatMap(file => Object.entries(load(file)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, rows]) => rows));
const rows = [...additions, ...accepted.amendments.map(row => getCuratedSeasonalPlace(row.canonicalId))];
const goblin = additions[0], projection = accepted.newRecords[0];
const at = new Date("2026-10-16T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, season, preferences, exclusions, now.getTime());
const providerFor = row => ({ ...row, id: `date-night-osm-node-${rows.indexOf(row) + 998100}`, source: "osm", openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });

test("exact independently accepted one addition and two presentation amendments retain all 59 released catalog objects", () => {
  assert.equal(createHash("sha256").update(acceptedBytes).digest("hex"), NEXT_MISSOURI_PROJECTION_SHA256);
  assert.equal(createHash("sha256").update(readFileSync("audit/missouri-next-2026-10-11/research/Accepted-Projections-R2.json")).digest("hex"), NEXT_MISSOURI_PROJECTION_SHA256);
  assert.equal(createHash("sha256").update(readFileSync("audit/missouri-next-2026-10-11/research/Independent-Eligible-Subset-R2.json")).digest("hex"), "96fa3143a4cc19f5295a524f57e1059ff42f277e596e7ed65354961e50810e1c");
  assert.equal(createHash("sha256").update(baselineBytes).digest("hex"), "1ed4e451be969a1c4689a5dbc670b7e17ce0e1b1140b49fcef4f414d1a44f501");
  assert.equal(baseline.ref, accepted.baseSha);
  assert.equal(baseline.tree, "7d91061065f5e7e36e4f76307a7b915a66ea006d");
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), ["DELTA3-GOBLIN", "MO26-085", "MO26-124"]);
  assert.equal(additions.length, 1); assert.equal(previousRows.length, 59);
  assert.equal(new Set([...previousRows, ...additions].map(row => row.id)).size, 60);
  for (const [path, hash] of Object.entries(baseline.files)) assert.equal(createHash("sha256").update(occurrenceSourceBefore(path)).digest("hex"), hash, `Every released catalog byte remains intact: ${path}`);
  for (const row of [...previousRows, ...additions]) assert.equal(getCuratedSeasonalPlace(row.id), row);
  assert.equal(Object.keys(baseline.presentations).length, 59);
  assert.equal(Object.keys(SEASONAL_PRESENTATIONS).filter(id => !Object.hasOwn(OWNER_EVIDENCE_MATERIAL_FACTS, id)).length, 60 + cleanupAdditions.length + 1, "Only the cleanup additions and the single reviewed Fear Factory extend this registry");
  assert.equal(SEASONAL_PRESENTATIONS["DELTA2-FEARFACTORY"].canonicalId, "date-night-mo26-fear-factory");
  for (const [recordId, before] of Object.entries(baseline.presentations)) {
    const amendment = accepted.amendments.find(row => row.recordId === recordId);
    if (!amendment) { assert.deepEqual(SEASONAL_PRESENTATIONS[recordId], admissionPresentationAfter(recordId, before), recordId); continue; }
    assert.deepEqual(amendment.before, before.details);
    assert.deepEqual(amendment.after, [...amendment.before.slice(0, -1), amendment.addedSentence, amendment.before.at(-1)]);
    assert.deepEqual(SEASONAL_PRESENTATIONS[recordId], { ...before, details: amendment.after });
  }
});

test("Goblin uses exact source-bound dates, qualified operator map point, date-only cutoff and no generalized hours", () => {
  assert.equal(goblin.id, projection.canonicalId); assert.equal(goblin.name, projection.name);
  assert.equal(goblin.address, projection.visitorAddress);
  assert.deepEqual(goblin.activityTypes, projection.activityTypes);
  assert.equal(goblin.website, projection.website); assert.equal(goblin.phone, projection.phone);
  assert.deepEqual([goblin.lat, goblin.lon], [projection.placement.lat, projection.placement.lon]);
  assert.deepEqual(goblin.seasonalListing.directionsTarget, projection.directionsTarget);
  for (const key of ["contract", "seasonYear", "timeZone", "listingExpiresAt", "expiryBasis"]) assert.equal(goblin.seasonalListing[key], projection[key]);
  for (const key of ["basis", "sourceUrl", "checkedAt", "precisionLabel"]) assert.equal(goblin.seasonalListing.placement[key], projection.placement[key]);
  assert.equal(goblin.seasonalListing.visitorAddress, projection.visitorAddress);
  assert.deepEqual(goblin.seasonalListing.hours, { state: projection.hours.state, displayText: projection.hours.displayText });
  assert.deepEqual(goblin.seasonalAvailability.activeDates, projection.exactActiveDates);
  assert.equal(goblin.seasonalAvailability.activeFrom, projection.activeFrom);
  assert.equal(goblin.seasonalAvailability.activeUntil, projection.activeUntil);
  assert.equal(goblin.seasonalAvailability.endsAt, undefined, "Date-only expiry never claims a final closing time");
  assert.equal(Date.parse(goblin.seasonalListing.listingExpiresAt), Date.parse("2026-10-25T05:00:00Z"));
  assert.equal(goblin.seasonalAvailability.listingExpiresAt, goblin.seasonalListing.listingExpiresAt);
  assert.deepEqual(seasonalPresentation(goblin).details, projection.details);
  assert.equal(seasonalPresentation(goblin).confidence, "limited");
  assert.equal(seasonalListingToPlace({ ...listings[0], seasonalListing: { ...listings[0].seasonalListing, placement: null } }), null, "Address alone never enters radius math");
  assert.ok(!goblin.seasonalAvailability.activeDates.includes("2026-10-31"), "The separate Feast does not create a trail date");
});

for (const row of rows) {
  test(`${row.name}: expiry -1ms/exact/+1ms, 2027, address Directions and conservative ride/Open Now`, () => {
    const cutoff = Date.parse(row.seasonalListing.listingExpiresAt);
    assert.equal(row.openingHours, null); assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    for (const now of [at, new Date(cutoff - 1)]) {
      assert.equal(pool(row, [row], now).length, 1);
      assert.equal(pool(row, [row], now, { openNowOnly: true }).length, 0);
    }
    for (const now of [new Date(cutoff), new Date(cutoff + 1), new Date("2027-10-16T20:00:00-05:00")]) assert.equal(pool(row, [row], now).length, 0);
    assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
    assert.deepEqual(uberRideTarget(row), { url: "https://m.uber.com/", ariaLabel: "Open Uber; choose your destination in the external service" });
    assert.equal(pool({ ...row, lat: row.lat + 0.04 }, [row]).length, 0);
    assert.equal(pool(row, [row], at, { activityTypes: ["park"] }).length, 0);
    assert.equal(pool(row, [row], at, {}, {}, [], false).length, row.seasonalListing.visibility === "listing-lifecycle" ? 1 : 0);
    for (const fact of NEXT_MISSOURI_MATERIAL_FACTS[row.seasonalListing.recordId]) assert.match(seasonalPresentation(row).details.join(" "), fact);
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), /\$\s*\d|audit|Census|reviewRevision|ListingCompletenessV1|machine opening|2027/i);
  });
  test(`${row.name}: provider/cache duplicate order preserves current policy and negative lifecycle`, () => {
    const provider = providerFor(row);
    for (const order of [[row, provider], [provider, row]]) {
      const merged = dedupeDateNight(order);
      const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
      for (const places of [merged, cached.venues]) {
        assert.equal(places.length, 1); assert.equal(places[0].id, row.id);
        assert.deepEqual(places[0].seasonalListing, row.seasonalListing);
        assert.equal(places[0].openingHours, null);
        assert.equal(pool(row, places, at, { openNowOnly: true }).length, 0);
        for (const delta of [-1, 0, 1]) assert.equal(pool(row, places, new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta)).length, delta < 0 ? 1 : 0);
      }
    }
    assert.equal(pool(row, dedupeDateNight([row, { ...provider, lifecycle: "permanently-closed" }])).length, 0);
    assert.equal(pool(row, [row], at, {}, { [row.id]: { neverRecommend: true } }).length, 0);
  });
  test(`${row.name}: stale saved ID and provider alias hydrate current details/address/lifecycle`, t => {
    const store = new Map(), prior = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) } });
    t.after(() => prior ? Object.defineProperty(globalThis, "localStorage", prior) : delete globalThis.localStorage);
    const stale = { ...row, lat: 0, lon: 0, openingHours: "24/7", seasonalListing: undefined, seasonalAvailability: undefined };
    const current = decorateDateNight([stale], row, at)[0];
    assert.deepEqual([current.lat, current.lon], [row.lat, row.lon]);
    assert.deepEqual(current.seasonalListing, row.seasonalListing); assert.equal(current.isOpen, false);
    const provider = providerFor(row); recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
    const saved = resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name });
    assert.equal(saved.id, row.id); assert.deepEqual(seasonalPresentation(saved), seasonalPresentation(row));
    assert.equal(new URL(directionsUrl(saved)).searchParams.get("destination"), row.address);
    for (const delta of [-1, 0, 1]) assert.equal(pool(row, [saved], new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta)).length, delta < 0 ? 1 : 0);
    assert.equal(pool(row, [saved], new Date("2027-10-16T20:00:00-05:00")).length, 0);
  });
  test(`${row.name}: actual server search success and fallback enforce season, current listing and expiry`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() }); let outage = false;
    t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Controlled provider outage"); return Response.json({ elements: [] }); });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true };
    for (const failure of [false, true]) { outage = failure; const response = await searchDateNight({ data: query }); assert.ok(pool(row, response.venues).some(place => place.id === row.id)); }
    outage = false;
    const off = await searchDateNight({ data: { ...query, spookySeasonEnabled: false } });
    assert.equal(off.venues.some(place => place.id === row.id), row.seasonalListing.visibility === "listing-lifecycle");
    for (const delta of [-1, 0, 1]) {
      t.mock.timers.setTime(Date.parse(row.seasonalListing.listingExpiresAt) + delta);
      const response = await searchDateNight({ data: query });
      assert.equal(pool(row, response.venues, new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta)).some(place => place.id === row.id), delta < 0);
    }
  });
}

test("admission and transfer notes preserve separate attractions and navigation with only explicitly cleared counterpart amendments", () => {
  for (const ids of [["MO26-085", "DELTA2-HOLLOWS"], ["MO26-124", "MO26-125"]]) {
    const pair = ids.map(id => previousRows.find(row => row.seasonalListing.recordId === id));
    assert.equal(dedupeDateNight(pair).length, 2);
    assert.notEqual(pair[0].id, pair[1].id);
    assert.notDeepEqual(pair[0].activityTypes, undefined);
    for (const row of pair) assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
    const counterpart = pair[1];
    assert.deepEqual(SEASONAL_PRESENTATIONS[counterpart.seasonalListing.recordId], admissionPresentationAfter(counterpart.seasonalListing.recordId, baseline.presentations[counterpart.seasonalListing.recordId]));
  }
  const brookdale = rows[1];
  assert.deepEqual(brookdale.activityTypes, ["corn-maze", "pumpkin-patch"]);
  assert.equal(Date.parse(brookdale.seasonalListing.listingExpiresAt), Date.parse("2026-11-08T18:00:00-06:00"));
});
