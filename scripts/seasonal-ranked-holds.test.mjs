import assert from "node:assert/strict";
import test from "node:test";
import { admissionPresentationAfter } from "./test-support/admission-amendments.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { RANKED_HOLDS_PROJECTION_SHA256, RANKED_HOLDS_MATERIAL_FACTS, RANKED_HOLDS_CONFIDENCE } from "./test-support/ranked-holds-browser-facts.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_RANKED_HOLDS_CATALOG: rows, MISSOURI_2026_RANKED_HOLDS_LISTINGS: listings } = load("src/lib/date-night/missouri-2026-ranked-holds-catalog.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds } = load("src/lib/date-night/identity-receipts.ts");
const { seasonalListingToPlace } = load("src/lib/date-night/listing.ts");
const { seasonalPresentation } = load("src/lib/date-night/seasonal-presentation.ts");
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { getDateNightAvailability } = load("src/lib/date-night/availability.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const projectionBytes = readFileSync("scripts/test-support/ranked-holds-browser-projections.json");
const accepted = JSON.parse(projectionBytes);
const baselineBytes = readFileSync("scripts/test-support/ranked-holds-baseline-receipts.json");
const baseline = JSON.parse(baselineBytes);
const previous = Object.keys(baseline.files).flatMap(file => Object.entries(load(file)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, values]) => values));
const at = new Date("2026-10-16T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, season, preferences, exclusions, now.getTime());
const providerFor = row => ({ ...row, id: `date-night-osm-node-${998700 + rows.indexOf(row)}`, source: "osm", openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
const forbiddenCopy = /\$\s*\d|\bUSD\b|audit|provenance|retention|Census|reviewRevision|listingExpiresAt|ListingCompletenessV1|machine opening|2027/i;

test("ranked hold is bound to accepted fields and preserves all 62 released objects and presentations", () => {
  assert.equal(createHash("sha256").update(projectionBytes).digest("hex"), RANKED_HOLDS_PROJECTION_SHA256);
  assert.equal(createHash("sha256").update(baselineBytes).digest("hex"), "061c6257716f0a556c36feab1700528805e3ea935f011c40cbbd0c82f35b3482");
  assert.equal(baseline.ref, "70682626484fb848fb9addb2c22cdd5f52839b62");
  assert.equal(baseline.tree, "057282e66443396f25bad44941885f3c15cd84c4");
  assert.equal(accepted.baseSha, baseline.ref);
  assert.equal(previous.length, 62);
  assert.deepEqual(previous.map(row => row.id), baseline.canonicalIds);
  assert.equal(baseline.identityCount, 62);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), ["DELTA2-FEARFACTORY"]);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), Object.keys(RANKED_HOLDS_MATERIAL_FACTS));
  assert.deepEqual(rows.map(row => row.id), accepted.newRecords.map(row => row.canonicalId));
  assert.equal(new Set([...previous, ...rows].map(row => row.id)).size, 62 + rows.length);
  for (const [file, hash] of Object.entries(baseline.files)) assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), hash, `Released catalog is byte-preserved: ${file}`);
  assert.equal(Object.keys(baseline.presentations).length, 62);
  assert.deepEqual(Object.keys(SEASONAL_PRESENTATIONS).sort(), [...Object.keys(baseline.presentations), ...Object.keys(RANKED_HOLDS_MATERIAL_FACTS)].sort());
  for (const [recordId, presentation] of Object.entries(baseline.presentations)) assert.deepEqual(SEASONAL_PRESENTATIONS[recordId], admissionPresentationAfter(recordId, presentation), recordId);
  for (const row of [...previous, ...rows]) assert.equal(getCuratedSeasonalPlace(row.id), row);
});

for (const row of rows) {
  const projection = accepted.newRecords.find(item => item.canonicalId === row.id);
  test(`${row.name}: exact reviewed fields, approximate address placement and display-only schedule`, () => {
    assert.ok(projection);
    assert.equal(row.name, projection.name); assert.equal(row.address, projection.visitorAddress);
    assert.deepEqual(row.activityTypes, projection.activityTypes);
    assert.equal(row.website, projection.website); assert.equal(row.phone, projection.phone);
    assert.deepEqual([row.lat, row.lon], [projection.placement.lat, projection.placement.lon]);
    for (const key of ["contract", "seasonYear", "timeZone", "listingExpiresAt", "expiryBasis", "ridesharePolicy"]) assert.equal(row.seasonalListing[key], projection[key]);
    for (const key of ["basis", "sourceUrl", "checkedAt", "precisionLabel"]) assert.equal(row.seasonalListing.placement[key], projection.placement[key]);
    assert.notEqual(row.seasonalListing.placement.basis, "verified-arrival");
    assert.deepEqual(row.seasonalListing.directionsTarget, projection.directionsTarget);
    assert.equal(row.seasonalListing.visitorAddress, projection.visitorAddress);
    assert.deepEqual(row.seasonalListing.hours, { state: projection.hours.state, displayText: projection.hours.displayText });
    assert.deepEqual(row.seasonalAvailability.activeDates, projection.exactActiveDates);
    assert.equal(row.seasonalAvailability.activeFrom, projection.activeFrom);
    assert.equal(row.seasonalAvailability.activeUntil, projection.activeUntil);
    assert.equal(row.seasonalAvailability.listingExpiresAt, row.seasonalListing.listingExpiresAt);
    assert.equal(Date.parse(row.seasonalListing.listingExpiresAt), Date.parse(projection.listingExpiresAtUtc));
    assert.deepEqual(row.seasonalListing.sourceUrls, projection.sourceUrls);
    assert.deepEqual(seasonalPresentation(row).details, projection.details);
    assert.equal(seasonalPresentation(row).confidence, RANKED_HOLDS_CONFIDENCE[projection.recordId]);
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), forbiddenCopy);
    for (const fact of RANKED_HOLDS_MATERIAL_FACTS[projection.recordId]) assert.match(seasonalPresentation(row).details.join(" "), fact);
    const listing = listings.find(item => item.id === row.id);
    assert.equal(seasonalListingToPlace({ ...listing, seasonalListing: { ...listing.seasonalListing, placement: null } }), null);
  });
  test(`${row.name}: exact expiry boundaries, no 2027, address Directions and conservative rides/Open Now`, () => {
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
    assert.equal(pool(row, [row], at, {}, {}, [], false).length, 0);
  });
  test(`${row.name}: duplicate/cache order retains exact policy, no negative lifecycle resurrection`, () => {
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
        assert.equal(pool(row, places, new Date("2027-10-16T20:00:00-05:00")).length, 0);
      }
    }
    assert.equal(pool(row, dedupeDateNight([row, { ...provider, lifecycle: "permanently-closed" }])).length, 0);
    assert.equal(pool(row, [row], at, {}, { [row.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(row, [row], at, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, 1);
    assert.equal(pool(row, [row], at, {}, {}, [{ restaurantId: row.id, name: row.name, expiresAt: at.getTime() + 1000, reason: "not-tonight" }]).length, 0);
  });
  test(`${row.name}: stale saved exact-ID and provider alias restore reviewed details and cutoff`, t => {
    const storage = new Map(), prior = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } });
    t.after(() => prior ? Object.defineProperty(globalThis, "localStorage", prior) : delete globalThis.localStorage);
    const stale = { ...row, lat: 0, lon: 0, openingHours: "24/7", seasonalListing: undefined, seasonalAvailability: undefined };
    const restored = decorateDateNight([stale], row, at)[0];
    assert.deepEqual([restored.lat, restored.lon], [row.lat, row.lon]);
    assert.deepEqual(restored.seasonalListing, row.seasonalListing); assert.equal(restored.isOpen, false);
    const provider = providerFor(row); recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
    const saved = resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name });
    assert.equal(saved.id, row.id); assert.deepEqual(seasonalPresentation(saved), seasonalPresentation(row));
    assert.equal(new URL(directionsUrl(saved)).searchParams.get("destination"), row.address);
    for (const delta of [-1, 0, 1]) assert.equal(pool(row, [saved], new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta)).length, delta < 0 ? 1 : 0);
    assert.equal(pool(row, [saved], new Date("2027-10-16T20:00:00-05:00")).length, 0);
  });
  test(`${row.name}: actual search and fallback respect current season and expiry`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() }); let outage = false;
    t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Controlled provider outage"); return Response.json({ elements: [] }); });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true };
    for (const failure of [false, true]) { outage = failure; const response = await searchDateNight({ data: query }); assert.ok(pool(row, response.venues).some(place => place.id === row.id)); }
    outage = false;
    const off = await searchDateNight({ data: { ...query, spookySeasonEnabled: false } });
    assert.equal(off.venues.some(place => place.id === row.id), false);
    for (const delta of [-1, 0, 1]) {
      const now = new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta);
      t.mock.timers.setTime(now.getTime());
      const response = await searchDateNight({ data: query });
      assert.equal(pool(row, response.venues, now).some(place => place.id === row.id), delta < 0);
    }
    t.mock.timers.setTime(new Date("2027-10-16T20:00:00-05:00").getTime());
    const nextYear = await searchDateNight({ data: query });
    assert.equal(pool(row, nextYear.venues, new Date()).some(place => place.id === row.id), false);
  });
}

test("Fear Factory binds ten secondary-source dates, qualified warnings and the last supported closing time", () => {
  const row = rows[0], projection = accepted.newRecords[0];
  assert.equal(row.id, "date-night-mo26-fear-factory");
  assert.equal(row.address, "102 South Main Street, Mountain Grove, MO 65711");
  const dates = ["2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10", "2026-10-16", "2026-10-17", "2026-10-23", "2026-10-24", "2026-10-30", "2026-10-31"];
  assert.deepEqual(row.seasonalAvailability.activeDates, dates);
  assert.equal(Date.parse(row.seasonalListing.listingExpiresAt), Date.parse("2026-11-01T04:00:00Z"));
  assert.equal(row.seasonalAvailability.startsAt, undefined);
  assert.equal(row.seasonalAvailability.endsAt, undefined);
  assert.equal(row.seasonalListing.visibility, undefined);
  assert.equal(projection.provenance.scheduleSourceClass, "CURRENT_TRUSTWORTHY_SECONDARY_DIRECTORY");
  assert.equal(projection.provenance.operator2026ScheduleIndependentlyVerified, false);
  assert.equal(projection.provenance.directoryRawSha256, "4586a67e00ce6998ac7f6e3af6d789722bb2844ad7f9a654450fa6d9d0390a04");
  assert.equal(projection.provenance.placementRawSha256, "b8bbb64fa60d7b20fa85d51c23876aed5a8e0199a7bb1bc2a9e777ee1acd70e6");
  assert.equal(row.seasonalListing.placement.basis, "address-geocode");
  assert.match(row.seasonalListing.placement.sourceUrl, /^https:\/\/www\.waze\.com\/live-map\/directions\//);
  assert.match(row.seasonalListing.placement.precisionLabel, /Approximate named venue\/address map location/);
  const details = seasonalPresentation(row).details;
  assert.equal(details.length, 4);
  assert.match(details[1], /^Directory lists 8–11 p\.m\.; confirm with venue before travel\.$/);
  assert.match(details[3], /directory advises against visits for people with seizures because of frequent strobe lights/);
  assert.match(details[3], /recommends parental discretion for children under 13/);
  assert.match(details[3], /Confirm visitor restrictions with the venue/);
  assert.equal(row.priceLevel, null);
  for (const date of dates) {
    const status = getDateNightAvailability({ ...row, hoursKnown: false, isOpen: false }, new Date(`${date}T20:30:00-05:00`));
    assert.equal(status.status, "hours-unknown"); assert.equal(status.openNowEligible, false);
  }
  for (const date of ["2026-10-01", "2026-10-04", "2026-10-18", "2026-10-29"]) {
    const status = getDateNightAvailability({ ...row, hoursKnown: false, isOpen: false }, new Date(`${date}T20:30:00-05:00`));
    assert.equal(status.status, date < "2026-10-02" ? "upcoming-season" : "closed-now"); assert.equal(status.openNowEligible, false);
  }
});
