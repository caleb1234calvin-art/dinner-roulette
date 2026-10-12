import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { HOLD_CLEANUP_PROJECTION_SHA256, HOLD_CLEANUP_MATERIAL_FACTS, HOLD_CLEANUP_CONFIDENCE, assertCleanupConsumerCopy } from "./test-support/hold-cleanup-browser-facts.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_HOLD_CLEANUP_CATALOG: rows, MISSOURI_2026_HOLD_CLEANUP_LISTINGS: listings } = load("src/lib/date-night/missouri-2026-hold-cleanup-catalog.ts");
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
const projectionBytes = readFileSync("scripts/test-support/hold-cleanup-browser-projections.json");
const accepted = JSON.parse(projectionBytes);
const baselineBytes = readFileSync("scripts/test-support/hold-cleanup-baseline-receipts.json");
const baseline = JSON.parse(baselineBytes);
const previous = Object.keys(baseline.files).flatMap(file => Object.entries(load(file)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, values]) => values));
const at = new Date("2026-10-16T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, season, preferences, exclusions, now.getTime());
const providerFor = row => ({ ...row, id: `date-night-osm-node-${998700 + rows.indexOf(row)}`, source: "osm", openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
const forbiddenCopy = /\$\s*\d|\bUSD\b|audit|provenance|retention|Census|reviewRevision|listingExpiresAt|ListingCompletenessV1|machine opening|2027/i;

test("cleanup is bound to reviewed projections and preserves all 60 released objects and presentations", () => {
  assert.equal(createHash("sha256").update(projectionBytes).digest("hex"), HOLD_CLEANUP_PROJECTION_SHA256);
  assert.equal(createHash("sha256").update(baselineBytes).digest("hex"), "6accc09ffc62347df7e4ef528518e9477b2e6fc0259ae1b9a6302f2961bfca44");
  assert.equal(baseline.ref, "f92870632b71def18d7642596dc9dd3357675f76");
  assert.equal(baseline.tree, "9153ead1946bbbb7e38c45981c47332997001c3e");
  assert.equal(accepted.baseSha, baseline.ref);
  assert.equal(previous.length, 60);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), ["MO26-007", "DELTA6-BOSS"]);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), Object.keys(HOLD_CLEANUP_MATERIAL_FACTS));
  assert.deepEqual(rows.map(row => row.id), accepted.newRecords.map(row => row.canonicalId));
  assert.equal(new Set([...previous, ...rows].map(row => row.id)).size, 60 + rows.length);
  for (const [file, hash] of Object.entries(baseline.files)) assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), hash, `Released catalog is byte-preserved: ${file}`);
  assert.equal(Object.keys(baseline.presentations).length, 60);
  assert.deepEqual(Object.keys(SEASONAL_PRESENTATIONS).sort(), [...Object.keys(baseline.presentations), ...Object.keys(HOLD_CLEANUP_MATERIAL_FACTS), "DELTA2-FEARFACTORY"].sort());
  for (const [recordId, presentation] of Object.entries(baseline.presentations)) assert.deepEqual(SEASONAL_PRESENTATIONS[recordId], presentation, recordId);
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
    assert.equal(seasonalPresentation(row).confidence, HOLD_CLEANUP_CONFIDENCE[projection.recordId]);
    assertCleanupConsumerCopy(seasonalPresentation(row).details.join(" "), projection.recordId, forbiddenCopy);
    for (const fact of HOLD_CLEANUP_MATERIAL_FACTS[projection.recordId]) assert.match(seasonalPresentation(row).details.join(" "), fact);
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

test("Cadaver preserves thirteen exact 2026 dates, October 29 exception, $15 and owner-evidence limits", () => {
  const cadaver = rows.find(row => row.seasonalListing.recordId === "MO26-007");
  const projection = accepted.newRecords.find(row => row.recordId === "MO26-007");
  assert.equal(rows.filter(row => /cadaver/i.test(row.name)).length, 1);
  assert.equal(cadaver.id, "date-night-mo26-007-cadaver-zone");
  assert.equal(cadaver.address, "25088 Kafir Rd, Webb City, MO");
  assert.deepEqual(cadaver.seasonalAvailability.activeDates, ["2026-09-25", "2026-09-26", "2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10", "2026-10-16", "2026-10-17", "2026-10-23", "2026-10-24", "2026-10-29", "2026-10-30", "2026-10-31"]);
  assert.equal(Date.parse(cadaver.seasonalListing.listingExpiresAt), Date.parse("2026-11-01T05:00:00Z"));
  assert.equal(cadaver.seasonalListing.expiryBasis, "exact");
  assert.match(cadaver.seasonalListing.hours.displayText, /7 PM–midnight; October 29, 7–10 PM/);
  assert.equal(projection.admission.displayedGeneralAdmissionUsd, 15);
  assert.equal(projection.provenance.sourceClass, "OWNER-SUPPLIED FIRST-PARTY EVIDENCE");
  assert.equal(projection.provenance.officialOriginIndependentlyRecaptured, false);
  assert.equal(projection.provenance.posterSha256, "203d12ea4634752d27fa94544aa307c8c792b3644707e419c8d18cd6a16b4578");
  for (const date of cadaver.seasonalAvailability.activeDates) {
    const status = getDateNightAvailability({ ...cadaver, hoursKnown: false, isOpen: false }, new Date(`${date}T20:00:00-05:00`));
    assert.equal(status.status, "hours-unknown"); assert.equal(status.openNowEligible, false);
  }
  const unlisted = getDateNightAvailability({ ...cadaver, hoursKnown: false, isOpen: false }, new Date("2026-10-28T20:00:00-05:00"));
  assert.equal(unlisted.status, "closed-now"); assert.equal(unlisted.openNowEligible, false);
});

test("Cadaver price exception is exact, record-scoped and retains forbidden-copy controls", () => {
  assert.doesNotThrow(() => assertCleanupConsumerCopy("Admission $15. Location is approximate.", "MO26-007", forbiddenCopy));
  for (const text of ["Admission $16.", "Admission $150.", "Admission $15. Other $10.", "Admission $15. audit", "Admission $15. 2027"]) assert.throws(() => assertCleanupConsumerCopy(text, "MO26-007", forbiddenCopy));
  assert.throws(() => assertCleanupConsumerCopy("Admission $15.", "UNREVIEWED-ID", forbiddenCopy));
});

test("BOSS preserves the one-day event bound and prominent public-access conditions without invented haunt hours", () => {
  const boss = rows.find(row => row.seasonalListing.recordId === "DELTA6-BOSS");
  const projection = accepted.newRecords.find(row => row.recordId === "DELTA6-BOSS");
  assert.equal(boss.id, "date-night-mo26-boss-harvest-fest");
  assert.equal(boss.address, "18694 FLW 20, BLDG 10221, Fort Leonard Wood, MO 65473");
  assert.deepEqual(boss.seasonalAvailability.activeDates, ["2026-10-24"]);
  assert.equal(boss.seasonalAvailability.activeFrom, "2026-10-24");
  assert.equal(boss.seasonalAvailability.activeUntil, "2026-10-24");
  assert.equal(Date.parse(boss.seasonalListing.listingExpiresAt), Date.parse("2026-10-25T02:00:00Z"));
  assert.equal(boss.seasonalListing.expiryBasis, "exact");
  assert.equal(boss.seasonalAvailability.startsAt, undefined);
  assert.equal(boss.seasonalAvailability.endsAt, undefined);
  assert.equal(projection.startsAt, null); assert.equal(projection.endsAt, null);
  assert.equal(projection.hours.finalDateClosingTime, null);
  assert.equal(projection.provenance.noGeneralGolfEligibilityInference, true);
  const details = seasonalPresentation(boss).details;
  assert.equal(details.length, 5);
  assert.match(details[0], /during Harvest Fest \(3:30–9 PM\).*Haunted-house hours are not separately confirmed/);
  assert.match(details[1], /Open to the public, subject to Fort Leonard Wood access approval/);
  assert.match(details[1], /screening and a pass/); assert.match(details[1], /physical ID \(REAL ID or accepted supplemental documents\)/);
  assert.match(details[1], /Confirm event access requirements before traveling/);
  assert.match(details[2], /current license, vehicle insurance and registration/);
  assert.match(details[3], /Shuttles begin at 3 PM from the Pershing Community Center parking lot/);
  assert.match(details[4], /Approximate venue location.*visitor address for Directions/);
});
