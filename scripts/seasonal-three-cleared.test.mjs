import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

// Frozen independent inputs, not expectations reconstructed from the new source.
const projectionBytes = readFileSync("audit/three-cleared-2026-10-13/CLEARED-PROJECTIONS-R1.json");
const accepted = JSON.parse(projectionBytes);
const baselineBytes = readFileSync("scripts/test-support/three-cleared-baseline.json");
const baseline = JSON.parse(baselineBytes);
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const plain = value => JSON.parse(JSON.stringify(value));
const newFile = "src/lib/date-night/missouri-2026-three-cleared-catalog.ts";
const expectedIds = ["date-night-mo26-delta-rowe-crop-farm", "date-night-mo26-096-meramec-spooktacular", "date-night-mo26-046-pets-and-pumpkins"];
const expectedRecordIds = ["DELTA-ROWE-CROP-FARM-2026", "MO26-096", "MO26-046"];
const load = appModuleLoader();
const { MISSOURI_2026_THREE_CLEARED_LISTINGS: listings, MISSOURI_2026_THREE_CLEARED_CATALOG: rows } = load(newFile);
const previous = Object.keys(baseline.files).flatMap(file => Object.entries(load(file))
  .filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, values]) => values));
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight, mergeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery, createDateNightDiscoveryCache } = load("src/lib/date-night/cache.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { clipDateNightRadius } = load("src/lib/date-night/radial-cache.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds,
  clearSeasonalIdentityReceipts, SEASONAL_IDENTITY_RECEIPTS_KEY } = load("src/lib/date-night/identity-receipts.ts");
const { seasonalIdentityPreference, seasonalFavoriteToggleIds } = load("src/lib/date-night/identity-preferences.ts");
const { seasonalListingToPlace, isApproximateSeasonalPlace, seasonalDistancePrefix } = load("src/lib/date-night/listing.ts");
const { seasonalPresentation, SEASONAL_VISITOR_NOTICE } = load("src/lib/date-night/seasonal-presentation.ts");
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { getDateNightAvailability } = load("src/lib/date-night/availability.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-13T12:00:00-05:00");
const nextYear = new Date("2027-10-13T12:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters },
  season, preferences, exclusions, now.getTime());
const providerFor = row => ({ ...row, id: `date-night-osm-node-${999100 + rows.indexOf(row)}`, source: "osm", openingHours: "24/7",
  seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
function receiptStorage(t) {
  const prior = Object.getOwnPropertyDescriptor(globalThis, "localStorage"), data = new Map();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key),
  } });
  t.after(() => prior ? Object.defineProperty(globalThis, "localStorage", prior) : delete globalThis.localStorage);
  return data;
}
function assertLifecycle(row, places) {
  assert.equal(pool(row, places).length, 1);
  assert.equal(pool(row, places, at, { openNowOnly: true }).length, 0);
  const cutoff = Date.parse(row.seasonalListing.listingExpiresAt);
  for (const delta of [-1, 0, 1]) {
    assert.equal(pool(row, places, new Date(cutoff + delta)).length, delta < 0 ? 1 : 0, `${row.id}: cutoff ${delta}ms`);
    assert.equal(pool(row, places, new Date(cutoff + delta), { openNowOnly: true }).length, 0);
  }
  assert.equal(pool(row, places, nextYear).length, 0);
}

test("three cleared additions bind independently frozen full projections and preserve every released object and file", () => {
  assert.equal(sha256(projectionBytes), "40af9e9076b7d18f9f037e3e7e75a980630e66f760d866abae1dd6a4062438e3");
  assert.equal(sha256(baselineBytes), "cf19a8c41d3c6f49a5a3d9e56dff5525baeb3c5e2c78b2bfc838aec4ac729074");
  assert.equal(baseline.source, "3b6b9ed0f4be1581b3b541207b2637183fff57d3");
  assert.equal(baseline.tree, "577d680f089e0a6e6892da2bdd6419132b890354");
  assert.equal(accepted.baseCommit, baseline.source);
  assert.equal(accepted.baseTree, baseline.tree);
  assert.equal(previous.length, 67);
  assert.deepEqual(plain(previous), baseline.catalog, "All fields, including freshness and schedules, remain unchanged");
  for (const [file, hash] of Object.entries(baseline.files)) assert.equal(sha256(readFileSync(file)), hash, file);
  assert.deepEqual(readdirSync("src/lib/date-night").filter(file => /^missouri-2026-.*-catalog\.ts$/.test(file)).sort(),
    [...Object.keys(baseline.files), newFile].map(file => file.split("/").at(-1)).sort(), "Exactly one new Missouri catalog file");
  assert.deepEqual(listings, accepted.exactRecords, "Every source field, key presence and omission matches the independent projection");
  assert.deepEqual(rows, accepted.exactRecords.map(record => ({ ...record,
    lat: record.seasonalListing.placement.lat, lon: record.seasonalListing.placement.lon, openingHours: null,
  })), "Only the documented adapter normalization is allowed");
  assert.deepEqual(rows.map(row => row.id), expectedIds);
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), expectedRecordIds);
  assert.equal(new Set([...previous, ...rows].map(row => row.id)).size, 70);
  for (const row of [...previous, ...rows]) assert.equal(getCuratedSeasonalPlace(row.id), row);
});

test("all 70 exact canonical-ID presentations are registered with no orphan, replacement or changed shared notice", () => {
  assert.equal(Object.keys(baseline.presentations).length, 67);
  assert.deepEqual(SEASONAL_PRESENTATIONS, { ...baseline.presentations, ...accepted.exactPresentations });
  assert.deepEqual(Object.keys(SEASONAL_PRESENTATIONS).sort(), [...previous, ...rows].map(row => row.seasonalListing.recordId).sort());
  assert.equal(SEASONAL_VISITOR_NOTICE, "Check current hours, admission, and weather before you go.");
  for (const row of [...previous, ...rows]) assert.equal(SEASONAL_PRESENTATIONS[row.seasonalListing.recordId].canonicalId, row.id);
  const catalogModules = [...Object.keys(baseline.files), newFile].map(file => `./${file.split("/").at(-1).replace(/\.ts$/, "")}`).sort();
  for (const file of ["src/lib/date-night/curated-policy.ts", "src/lib/date-night/search.ts"]) {
    const imports = [...readFileSync(file, "utf8").matchAll(/from "(\.\/missouri-2026-[^"]+-catalog)"/g)].map(match => match[1]).sort();
    assert.deepEqual(imports, catalogModules, `${file} imports precisely the released catalogs and three cleared additions`);
  }
});

for (const row of rows) {
  test(`${row.name}: exact visitor presentation, qualified placement and conservative navigation`, () => {
    const recordId = row.seasonalListing.recordId;
    assert.deepEqual(seasonalPresentation(row), accepted.exactPresentations[recordId]);
    assert.deepEqual(seasonalPresentation({ ...row, id: "unreviewed-canonical-id" }), { confidence: "limited", details: ["Hours unconfirmed"] });
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), /\$\s*\d|\bUSD\b|audit|provenance|retention|Census|reviewRevision|listingExpiresAt|ListingCompletenessV1|machine opening|2027/i);
    assert.equal(isApproximateSeasonalPlace(row), true);
    assert.equal(seasonalDistancePrefix(row), "Approx. ");
    assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
    assert.deepEqual(uberRideTarget(row), { url: "https://m.uber.com/", ariaLabel: "Open Uber; choose your destination in the external service" });
    for (const placement of [null, { ...row.seasonalListing.placement, lat: NaN }, { ...row.seasonalListing.placement, lon: 181 }]) {
      const unplaced = { ...row, id: `${row.id}-unplaced`, seasonalListing: { ...row.seasonalListing, placement } };
      assert.equal(seasonalListingToPlace(unplaced), null);
      assert.deepEqual(decorateDateNight([unplaced], row, at), []);
      assert.deepEqual(clipDateNightRadius([unplaced], { ...row, radiusMiles: 1 }), []);
    }
  });

  test(`${row.name}: Anything and only reviewed categories enter counts/pick pool; exact cutoff and Open Now fail closed`, () => {
    assertLifecycle(row, [row]);
    for (const activityTypes of [["anything"], ...row.activityTypes.map(type => [type])]) assert.deepEqual(pool(row, [row], at, { activityTypes }).map(place => place.id), [row.id]);
    for (const type of ["park", "movies", "haunted-house", "corn-maze", "pumpkin-patch", "other-halloween-fall"].filter(type => !row.activityTypes.includes(type))) {
      assert.equal(pool(row, [row], at, { activityTypes: [type] }).length, 0, type);
    }
    assert.equal(pool(row, [row], at, {}, {}, [], false).length, 0);
    assert.equal(pool({ ...row, lat: row.lat + 0.04 }, [row]).length, 0);
    assert.equal(clipDateNightRadius([row], { ...row, radiusMiles: 1 }).length, 1);
    assert.equal(clipDateNightRadius([row], { ...row, lat: row.lat + 1, radiusMiles: 1 }).length, 0);
    assert.equal(row.openingHours, null);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.seasonalAvailability.startsAt, undefined);
    for (const date of row.seasonalAvailability.activeDates) {
      const now = new Date(`${date}T12:00:00-05:00`);
      for (const state of ["unknown", "partial", "verified"]) {
        const stale = { ...row, openingHours: "24/7", seasonalAvailability: { ...row.seasonalAvailability, openNowPolicy: undefined },
          seasonalListing: { ...row.seasonalListing, hours: { state } }, hoursKnown: true, isOpen: true };
        assert.equal(getDateNightAvailability(stale, now).openNowEligible, false, `${date}: ${state}`);
        assert.equal(pool(row, [stale], now, { openNowOnly: true }).length, 0);
      }
    }
  });

  test(`${row.name}: both duplicate/cache orders preserve policy, alias preferences, exclusions and negative lifecycle`, () => {
    const provider = providerFor(row);
    for (const order of [[row, provider], [provider, row]]) {
      const merged = dedupeDateNight(order);
      const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
      for (const places of [merged, cached.venues, plain(cached.venues)]) {
        assert.equal(places.length, 1);
        assert.equal(places[0].id, row.id);
        assert.deepEqual(places[0].seasonalListing, row.seasonalListing);
        assert.deepEqual(places[0].seasonalAvailability, row.seasonalAvailability);
        assert.deepEqual(seasonalPresentation(places[0]), seasonalPresentation(row));
        assert.equal(places[0].openingHours, null);
        assertLifecycle(row, places);
        for (const id of [row.id, provider.id]) {
          const preferences = { [id]: { favorite: true } };
          assert.equal(pool(row, places, at, { favoritesOnly: true }, preferences).length, 1);
          assert.equal(pool(row, places, at, {}, { [id]: { neverRecommend: true }, [row.id]: { favorite: true, neverRecommend: id === row.id } }).length, 0);
          const exclusion = [{ restaurantId: id, name: row.name, expiresAt: at.getTime() + 1000, reason: "not-tonight" }];
          assert.equal(pool(row, places, at, {}, {}, exclusion).length, 0);
          assert.equal(pool(row, places, new Date(at.getTime() + 1000), {}, {}, exclusion).length, 1);
          assert.deepEqual(seasonalFavoriteToggleIds(places[0], preferences), [id]);
          assert.equal(seasonalIdentityPreference(places[0], { [id]: { favorite: false } }).favorite, false);
          assert.deepEqual(seasonalFavoriteToggleIds(places[0], { [id]: { favorite: false } }), [row.id]);
        }
      }
      for (const lifecycle of ["disused", "permanently-closed"]) {
        const negativeOrder = order.map(place => place.id === provider.id ? { ...place, lifecycle } : place);
        for (const places of [dedupeDateNight(negativeOrder), combineDateNightDiscovery({ response: { venues: [negativeOrder[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [negativeOrder[1]], source: "live" }).venues]) {
          assert.equal(places.length, 1);
          assert.equal(places[0].lifecycle, lifecycle);
          assert.equal(pool(row, places).length, 0);
        }
      }
    }
    assert.equal(pool(row, [row], at, { favoritesOnly: true }).length, 0);
    for (const unrelated of [{ ...provider, name: `${row.name} Private Tour` }, { ...provider, lat: row.lat + 0.1 },
      { ...provider, seasonalListing: { ...row.seasonalListing, recordId: "UNRELATED-EVENT" } }]) {
      assert.equal(dedupeDateNight([row, unrelated]).length, 2, "Approximate location is not identity authority");
    }
  });

  test(`${row.name}: real acquisition cache and valid-empty refresh cannot restore expired or superseded positives`, () => {
    let time = at.getTime();
    const cache = createDateNightDiscoveryCache({ now: () => time });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, halloweenActive: true, activityTypes: [...row.activityTypes] };
    const response = venues => ({ venues, source: "merged", discovery: { partial: false,
      groups: buildDateNightQueryPlan(query.activityTypes, true).map(group => ({ ...group, outcome: venues.length ? "succeeded-nonempty" : "succeeded-empty" })),
    } });
    assert.equal(cache.store(query, response(dedupeDateNight([providerFor(row), row]))), true);
    const first = cache.read(query);
    assert.deepEqual(first.missingActivityTypes, []);
    assertLifecycle(row, first.response.venues);
    time += 1000;
    assert.equal(cache.store(query, response([])), true);
    const refreshed = cache.read(query);
    assert.deepEqual(refreshed.missingActivityTypes, []);
    assert.deepEqual(refreshed.response.venues, [], "New successful empty coverage retires the older positive snapshot");
  });

  test(`${row.name}: stale saved canonical IDs and affirmed identity-only receipts survive module reload safely`, t => {
    const storage = receiptStorage(t), provider = providerFor(row);
    const saved = { restaurantId: provider.id, name: row.name, lat: 0, lon: 0, address: "Old provider address" };
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
    recordSeasonalIdentityReceipts([row, provider]);
    assert.equal(resolveSavedSeasonalPlace(saved), undefined, "Unmerged rows never create a receipt");
    const stale = { ...row, lat: 0, lon: 0, address: "Old address", openingHours: "24/7", seasonalListing: undefined, seasonalAvailability: undefined };
    const restored = decorateDateNight([stale], row, at)[0];
    assert.deepEqual([restored.lat, restored.lon, restored.address], [row.lat, row.lon, row.address]);
    assert.deepEqual(restored.seasonalListing, row.seasonalListing);
    assert.equal(restored.isOpen, false);
    assert.deepEqual(resolveSavedSeasonalPlace({ restaurantId: row.id, name: row.name }), row);
    recordSeasonalIdentityReceipts(mergeDateNight([provider], [row]));
    assert.deepEqual(JSON.parse(storage.get(SEASONAL_IDENTITY_RECEIPTS_KEY))[provider.id], {
      canonicalId: row.id, reviewRevision: row.seasonalListing.reviewRevision, canonicalName: row.name,
    });
    assert.deepEqual(seasonalReceiptAliasIds(row.id), [provider.id]);
    const reloaded = appModuleLoader()("src/lib/date-night/identity-receipts.ts").resolveSavedSeasonalPlace(saved);
    assert.deepEqual(reloaded, row);
    assert.deepEqual(seasonalPresentation(reloaded), seasonalPresentation(row));
    assert.equal(new URL(directionsUrl(reloaded)).searchParams.get("destination"), row.address);
    assert.deepEqual(uberRideTarget(reloaded), uberRideTarget(row));
    assertLifecycle(row, [reloaded]);
    assert.equal(pool(row, [reloaded], at, { favoritesOnly: true }, { [provider.id]: { favorite: true } }).length, 1);
    assert.equal(pool(row, [reloaded], at, {}, { [provider.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(row, [reloaded], at, {}, {}, [{ restaurantId: provider.id, expiresAt: at.getTime() + 1000 }]).length, 0);
    assert.equal(resolveSavedSeasonalPlace({ ...saved, name: "Unrelated saved place" }), undefined);
    clearSeasonalIdentityReceipts();
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
  });

  test(`${row.name}: actual search, provider outage and category filtering preserve exact current-season registry policy`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
    let outage = false;
    t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Controlled provider outage"); return Response.json({ elements: [] }); });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true };
    for (const failure of [false, true]) {
      outage = failure;
      for (const activityTypes of [["anything"], ...row.activityTypes.map(type => [type])]) {
        const result = await searchDateNight({ data: { ...query, activityTypes } });
        const match = result.venues.filter(place => place.id === row.id);
        assert.equal(match.length, 1);
        assert.deepEqual(match[0].seasonalListing, row.seasonalListing);
        assert.equal(pool(row, result.venues, at, { activityTypes }).filter(place => place.id === row.id).length, 1);
        assert.equal(pool(row, result.venues, at, { activityTypes, openNowOnly: true }).some(place => place.id === row.id), false);
      }
    }
    outage = false;
    const disabled = await searchDateNight({ data: { ...query, spookySeasonEnabled: false } });
    assert.equal(disabled.venues.some(place => place.id === row.id), false);
    for (const now of [-1, 0, 1].map(delta => new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta)).concat(nextYear)) {
      t.mock.timers.setTime(now.getTime());
      const result = await searchDateNight({ data: query });
      assert.equal(pool(row, result.venues, now).some(place => place.id === row.id), now.getTime() < Date.parse(row.seasonalListing.listingExpiresAt));
    }
  });
}

test("Rowe has exactly 27 month-specific activity dates with no September barn-store Wednesday/Thursday leakage", () => {
  const rowe = rows[0], dates = [];
  for (let time = Date.parse("2026-09-12T12:00:00Z"); time <= Date.parse("2026-10-25T12:00:00Z"); time += 86_400_000) {
    const date = new Date(time), day = date.getUTCDay();
    if ((date.getUTCMonth() === 8 ? [5, 6, 0] : [3, 4, 5, 6, 0]).includes(day)) dates.push(date.toISOString().slice(0, 10));
  }
  assert.equal(dates.length, 27);
  assert.deepEqual(rowe.seasonalAvailability.activeDates, dates);
  for (const date of ["2026-09-16", "2026-09-17", "2026-09-23", "2026-09-24", "2026-09-30"]) assert.equal(dates.includes(date), false);
  assert.deepEqual(rowe.activityTypes, ["corn-maze", "pumpkin-patch"]);
  assert.equal(rowe.seasonalListing.expiryBasis, "exact");
  assert.equal(rowe.seasonalAvailability.endsAt, "2026-10-25T23:00:00Z");
  assert.equal(Date.parse(rowe.seasonalListing.listingExpiresAt), Date.parse("2026-10-25T18:00:00-05:00"));
});

test("Meramec's 5 p.m. is a start, its end is date-only, and Pets expires at the exact 4 p.m. end", () => {
  const [, meramec, pets] = rows;
  assert.deepEqual(meramec.activityTypes, ["other-halloween-fall"]);
  assert.deepEqual(pets.activityTypes, ["other-halloween-fall"]);
  assert.deepEqual(meramec.seasonalAvailability.activeDates, ["2026-10-17"]);
  assert.equal(meramec.seasonalListing.expiryBasis, "date-only");
  assert.equal(Object.hasOwn(meramec.seasonalAvailability, "endsAt"), false);
  assert.equal(Object.hasOwn(meramec.seasonalAvailability, "startsAt"), false);
  assert.match(meramec.seasonalListing.hours.displayText, /trick-or-treating starts 5 p\.m\. Final end time unconfirmed\./);
  assert.match(seasonalPresentation(meramec).details.join(" "), /road closes to vehicle traffic at 4:45 p\.m\./);
  assert.equal(Date.parse(meramec.seasonalListing.listingExpiresAt), Date.parse("2026-10-18T00:00:00-05:00"));
  for (const time of ["2026-10-17T16:45:00-05:00", "2026-10-17T17:00:00-05:00", "2026-10-17T22:00:00-05:00"]) assert.equal(pool(meramec, [meramec], new Date(time)).length, 1);
  assert.deepEqual(pets.seasonalAvailability.activeDates, ["2026-10-24"]);
  assert.equal(pets.seasonalListing.expiryBasis, "exact");
  assert.equal(pets.seasonalAvailability.endsAt, "2026-10-24T21:00:00Z");
  assert.equal(Date.parse(pets.seasonalListing.listingExpiresAt), Date.parse("2026-10-24T16:00:00-05:00"));
  assert.match(seasonalPresentation(pets).details.join(" "), /about 2:15 p\.m\. on Park Central East next to Civil Kitchen/);
});

test("new identity receipts reject malformed, stale, unrelated and conflicting records rather than guessing", t => {
  const storage = receiptStorage(t), row = rows[0], provider = providerFor(row), saved = { restaurantId: provider.id, name: row.name };
  const good = { canonicalId: row.id, reviewRevision: row.seasonalListing.reviewRevision, canonicalName: row.name };
  for (const value of [null, [], "bad", { [provider.id]: { ...good, reviewRevision: "superseded" } },
    { [provider.id]: { ...good, canonicalId: "unreviewed" } }, { [provider.id]: { ...good, canonicalName: "Unrelated" } }, { [provider.id]: { conflict: true } }]) {
    storage.set(SEASONAL_IDENTITY_RECEIPTS_KEY, JSON.stringify(value));
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
  }
  storage.set(SEASONAL_IDENTITY_RECEIPTS_KEY, "not-json");
  assert.equal(resolveSavedSeasonalPlace(saved), undefined);
  storage.clear();
  for (const candidate of rows.slice(0, 2)) recordSeasonalIdentityReceipts(dedupeDateNight([{ ...providerFor(candidate), id: provider.id }, candidate]));
  assert.deepEqual(JSON.parse(storage.get(SEASONAL_IDENTITY_RECEIPTS_KEY))[provider.id], { conflict: true });
  assert.equal(resolveSavedSeasonalPlace(saved), undefined);
  assert.deepEqual(seasonalReceiptAliasIds(row.id), []);
});
