import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { OWNER_EVIDENCE_PROJECTION_SHA256, OWNER_EVIDENCE_MATERIAL_FACTS, OWNER_EVIDENCE_CONFIDENCE } from "./test-support/owner-evidence-browser-facts.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_OWNER_EVIDENCE_CATALOG: rows, MISSOURI_2026_OWNER_EVIDENCE_LISTINGS: listings } = load("src/lib/date-night/missouri-2026-owner-evidence-catalog.ts");
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
const projectionBytes = readFileSync("scripts/test-support/owner-evidence-browser-projections.json");
const accepted = JSON.parse(projectionBytes);
const baselineBytes = readFileSync("scripts/test-support/owner-evidence-baseline-receipts.json");
const baseline = JSON.parse(baselineBytes);
const previous = Object.keys(baseline.files).flatMap(file => Object.entries(load(file)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, values]) => values));
const at = new Date("2026-10-16T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, season, preferences, exclusions, now.getTime());
const providerFor = row => ({ ...row, id: `date-night-osm-node-${998700 + rows.indexOf(row)}`, source: "osm", openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
const forbiddenCopy = /\$\s*\d|\bUSD\b|audit|provenance|retention|Census|reviewRevision|listingExpiresAt|ListingCompletenessV1|machine opening|2027/i;

test("four owner-evidence records bind accepted fields and preserve all 63 released objects and presentations", () => {
  assert.equal(createHash("sha256").update(projectionBytes).digest("hex"), OWNER_EVIDENCE_PROJECTION_SHA256);
  assert.equal(createHash("sha256").update(baselineBytes).digest("hex"), "a49974d510cd14a8d0dd93f7fe9e1d7ee1cc099a3808c740a62fea788f2a2766");
  assert.equal(baseline.source, "0032d913efaca4bd97d730414a50a5b01e1a2099");
  assert.equal(baseline.tree, "f0d0a777ec90d5e82cc089d71b5c2eaf0646f21b");
  assert.equal(accepted.baseSha, baseline.source);
  assert.equal(previous.length, 63);
  assert.deepEqual(previous.map(row => row.id), baseline.catalog.map(row => row.id));
  assert.deepEqual(JSON.parse(JSON.stringify(previous)), baseline.catalog);
  assert.equal(rows.length, 4);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), ["DELTA2-WACO", "DELTA3-DARK-NIGHTMARES", "DELTA3-FARRINGTON", "NEW-MID-AMERICA-FRIGHT-FEST"]);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), Object.keys(OWNER_EVIDENCE_MATERIAL_FACTS));
  assert.deepEqual(rows.map(row => row.id), accepted.newRecords.map(row => row.canonicalId));
  assert.equal(new Set([...previous, ...rows].map(row => row.id)).size, 67);
  for (const [file, hash] of Object.entries(baseline.files)) assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), hash, `Released catalog is byte-preserved: ${file}`);
  assert.equal(Object.keys(baseline.presentations).length, 63);
  assert.deepEqual(Object.keys(SEASONAL_PRESENTATIONS).sort(), [...Object.keys(baseline.presentations), ...Object.keys(OWNER_EVIDENCE_MATERIAL_FACTS)].sort());
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
    assert.equal(seasonalPresentation(row).confidence, OWNER_EVIDENCE_CONFIDENCE[projection.recordId]);
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), forbiddenCopy);
    for (const fact of OWNER_EVIDENCE_MATERIAL_FACTS[projection.recordId]) assert.match(seasonalPresentation(row).details.join(" "), fact);
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


test("source-bound local cutoffs preserve date-only, queue/ticket boundaries and November DST", () => {
  const byId = Object.fromEntries(rows.map(row => [row.seasonalListing.recordId, row]));
  const expected = {
    "DELTA2-WACO": ["2026-11-01T04:30:00Z", "2026-10-31T23:30:00-05:00"],
    "DELTA3-DARK-NIGHTMARES": ["2026-11-01T05:00:00Z", "2026-11-01T00:00:00-05:00"],
    "DELTA3-FARRINGTON": ["2026-10-19T05:00:00Z", "2026-10-19T00:00:00-05:00"],
    "NEW-MID-AMERICA-FRIGHT-FEST": ["2026-11-02T03:00:00Z", "2026-11-01T21:00:00-06:00"],
  };
  for (const [id, [utc, local]] of Object.entries(expected)) {
    const row = byId[id]; assert.equal(Date.parse(utc), Date.parse(local));
    assert.equal(Date.parse(row.seasonalListing.listingExpiresAt), Date.parse(utc));
    for (const date of row.seasonalAvailability.activeDates) {
      const status = getDateNightAvailability({ ...row, hoursKnown: false, isOpen: false }, new Date(`${date}T20:00:00-05:00`));
      assert.equal(status.openNowEligible, false);
    }
    assert.equal(row.seasonalAvailability.startsAt, undefined);
    assert.equal(row.seasonalAvailability.endsAt, undefined);
    assert.equal(row.seasonalListing.visibility, undefined);
    assert.equal(row.seasonalListing.hours.state, id === "NEW-MID-AMERICA-FRIGHT-FEST" ? "verified" : "partial");
    assert.equal(row.seasonalListing.expiryBasis, id === "DELTA3-FARRINGTON" ? "date-only" : "exact");
  }
  assert.equal(byId["DELTA2-WACO"].seasonalAvailability.activeDates.length, 8);
  assert.equal(byId["DELTA3-DARK-NIGHTMARES"].seasonalAvailability.activeDates.length, 6);
  assert.deepEqual(byId["DELTA3-FARRINGTON"].seasonalAvailability.activeDates, ["2026-10-17", "2026-10-18"]);
  const park = byId["NEW-MID-AMERICA-FRIGHT-FEST"];
  assert.equal(park.seasonalAvailability.activeDates.length, 9);
  assert.equal(park.seasonalAvailability.activeDates.at(-1), "2026-11-01");
  const format = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", timeZoneName: "short" });
  assert.match(format.format(new Date("2026-11-01T05:00:00Z")), /CDT/);
  assert.match(format.format(new Date("2026-11-02T03:00:00Z")), /9 PM CST/);
});

test("four exact registry additions cannot replace prior objects or add an orphan presentation", () => {
  const validate = (catalog, presentations) => {
    assert.equal(catalog.length, 67);
    assert.equal(new Set(catalog.map(row => row.id)).size, 67);
    assert.deepEqual(catalog.map(row => row.seasonalListing.recordId).sort(), Object.keys(presentations).sort());
    for (const row of catalog) assert.equal(presentations[row.seasonalListing.recordId].canonicalId, row.id);
  };
  const catalog = [...previous, ...rows]; validate(catalog, SEASONAL_PRESENTATIONS);
  assert.throws(() => validate([...catalog, rows[0]], SEASONAL_PRESENTATIONS));
  assert.throws(() => validate(catalog, { ...SEASONAL_PRESENTATIONS, ORPHAN: {} }));
  const missing = { ...SEASONAL_PRESENTATIONS }; delete missing[rows[0].seasonalListing.recordId];
  assert.throws(() => validate(catalog, missing));
});

test("reviewed renamed park event merges only exact affirmed event names with canonical authority", () => {
  const park = rows.find(row => row.seasonalListing.recordId === "NEW-MID-AMERICA-FRIGHT-FEST");
  const legacy = { ...providerFor(park), name: "Six Flags St. Louis Fright Fest" };
  for (const order of [[park, legacy], [legacy, park]]) {
    const merged = dedupeDateNight(order);
    assert.equal(merged.length, 1); assert.equal(merged[0].id, park.id);
    assert.deepEqual(merged[0].seasonalListing, park.seasonalListing);
    assert.equal(merged[0].openingHours, null);
    assert.equal(pool(park, merged, at, { openNowOnly: true }).length, 0);
    const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
    assert.equal(cached.venues.length, 1); assert.equal(cached.venues[0].id, park.id);
    for (const delta of [-1, 0, 1]) assert.equal(pool(park, cached.venues, new Date(Date.parse(park.seasonalListing.listingExpiresAt) + delta)).length, delta < 0 ? 1 : 0);
    assert.equal(pool(park, merged, new Date("2027-10-16T20:00:00-05:00")).length, 0);
  }
  for (const name of ["Six Flags St. Louis", "Mid America Adventure", "Six Flags Great America Fright Fest", "Six Flags St. Louis Fright Fest VIP Tour"]) {
    assert.equal(dedupeDateNight([park, { ...legacy, name }]).length, 2, name);
  }
  assert.equal(dedupeDateNight([park, { ...legacy, lat: park.lat + 0.1 }]).length, 2, "Distance guard remains");
  assert.equal(dedupeDateNight([park, { ...legacy, seasonalListing: { ...park.seasonalListing, recordId: "DIFFERENT-EVENT" } }]).length, 2);
  const farProvider = { ...providerFor(park), id: "date-night-osm-node-111", lat: park.lat + 1 };
  const farLegacy = { ...legacy, lat: park.lat + 1.002 };
  assert.equal(dedupeDateNight([farProvider, farLegacy]).length, 2, "Distant provider names do not acquire canonical rebrand authority");
  assert.equal(pool(park, dedupeDateNight([park, { ...legacy, lifecycle: "permanently-closed" }])).length, 0);
});

test("standalone old-name provider cache cannot revive the reviewed park after cutoff or in 2027", t => {
  const park = rows.find(row => row.seasonalListing.recordId === "NEW-MID-AMERICA-FRIGHT-FEST");
  const legacy = { ...providerFor(park), name: "Six Flags St. Louis Fright Fest" };
  const storage = new Map(), prior = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } });
  t.after(() => prior ? Object.defineProperty(globalThis, "localStorage", prior) : delete globalThis.localStorage);
  for (const cached of [[legacy], [legacy, park], [park, legacy]]) {
    const merged = dedupeDateNight(cached); assert.equal(merged.length, 1); assert.equal(merged[0].id, park.id);
    assert.equal(merged[0].openingHours, null); assert.deepEqual(merged[0].seasonalListing, park.seasonalListing);
    recordSeasonalIdentityReceipts(merged); assert.ok(seasonalReceiptAliasIds(park.id).includes(legacy.id));
    assert.equal(pool(park, merged, at, { favoritesOnly: true }, { [legacy.id]: { favorite: true } }).length, 1);
    assert.equal(pool(park, merged, at, {}, { [legacy.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(park, merged, at, {}, {}, [{ restaurantId: legacy.id, name: legacy.name, expiresAt: at.getTime() + 1000, reason: "not-tonight" }]).length, 0);
    for (const delta of [-1, 0, 1]) assert.equal(pool(park, merged, new Date(Date.parse(park.seasonalListing.listingExpiresAt) + delta)).length, delta < 0 ? 1 : 0);
    assert.equal(pool(park, merged, at, { openNowOnly: true }).length, 0);
    assert.equal(pool(park, merged, new Date("2027-10-16T20:00:00-05:00")).length, 0);
  }
  const saved = resolveSavedSeasonalPlace({ restaurantId: legacy.id, name: park.name });
  assert.equal(saved.id, park.id);
  assert.equal(pool(park, [saved], new Date(park.seasonalListing.listingExpiresAt)).length, 0);
  assert.equal(resolveSavedSeasonalPlace({ restaurantId: "date-night-osm-node-unknown", name: legacy.name }), undefined);
  assert.equal(resolveSavedSeasonalPlace({ restaurantId: legacy.id, name: legacy.name }), undefined, "Unconfirmed historical bookmark text does not silently map by name");
  assert.equal(pool(park, [ { ...legacy, lifecycle: "permanently-closed" } ]).length, 0);
  const { applyCuratedSeasonalPolicy } = load("src/lib/date-night/curated-policy.ts");
  for (const negative of [{ ...legacy, lat: park.lat + 1 }, { ...legacy, name: "Six Flags St. Louis" }, { ...legacy, seasonalListing: { ...park.seasonalListing, recordId: "OTHER-EVENT" } }]) {
    assert.equal(applyCuratedSeasonalPolicy(negative).id, legacy.id);
  }
});


test("reviewed park alias retains every lifecycle-negative kind from mixed provider evidence", () => {
  const park = rows.find(row => row.seasonalListing.recordId === "NEW-MID-AMERICA-FRIGHT-FEST");
  const legacy = { ...providerFor(park), name: "Six Flags St. Louis Fright Fest" };
  const { applyCuratedSeasonalPolicy } = load("src/lib/date-night/curated-policy.ts");
  for (const lifecycle of ["disused", "permanently-closed"]) {
    for (const topLevel of [undefined, "disused", "permanently-closed"]) {
      const evidence = [{ id: legacy.id, source: "osm", activityTypes: ["park"], openingHours: "24/7", lifecycle },
        { id: "date-night-osm-node-positive", source: "osm", activityTypes: ["park"], openingHours: "24/7" }];
      for (const discoveryEvidence of [evidence, [...evidence].reverse()]) {
        const negative = { ...legacy, lifecycle: topLevel, discoveryEvidence };
        const converted = applyCuratedSeasonalPolicy(negative);
        assert.equal(converted.lifecycle, lifecycle === "permanently-closed" || topLevel === "permanently-closed" ? "permanently-closed" : "disused");
        assert.equal(pool(park, [negative], at, { openNowOnly: false }).length, 0);
        for (const order of [[negative, park], [park, negative]]) {
          const merged = dedupeDateNight(order);
          assert.equal(merged.length, 1);
          assert.equal(pool(park, merged, at, { openNowOnly: false }).length, 0);
          assert.ok(merged[0].discoveryEvidence.some(item => item.id === legacy.id && item.lifecycle === lifecycle));
        }
      }
    }
  }
});
