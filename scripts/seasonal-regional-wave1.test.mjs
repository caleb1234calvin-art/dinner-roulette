import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { REGIONAL_RECORDS, REGIONAL_ROWS, REGIONAL_PRESENTATIONS, REGIONAL_IDS,
  REGIONAL_RECORD_IDS, REGIONAL_MATERIAL_FACTS, REGIONAL_CONFIDENCE, REGIONAL_BASELINE,
  assertRegionalCatalog, releasedSeventyPresentationsOnly, WAVE2_EXPECTED_PRESENTATIONS } from "./test-support/regional-wave1.mjs";

// Expectations bind independent accepted bytes and the immutable released 70.
// This suite does not derive its expected objects from the candidate catalog.
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const plain = value => JSON.parse(JSON.stringify(value));
const ids = rows => rows.map(row => row.id).sort();
const acceptedBytes = readFileSync("audit/regional-successor-2026-10-14/SELECTED-12-EXACT-ACCEPTED-OBJECTS.json");
const accepted = JSON.parse(acceptedBytes);
const baselineBytes = readFileSync("scripts/test-support/regional-wave1-baseline.json");
const oracleBytes = readFileSync("scripts/test-support/regional-wave1-radius-oracle.json");
const oracle = JSON.parse(oracleBytes);
const regionalFile = "src/lib/date-night/regional-2026-wave1-catalog.ts";
const load = appModuleLoader();
const { REGIONAL_2026_WAVE1_LISTINGS: listings, REGIONAL_2026_WAVE1_CATALOG: rows } = load(regionalFile);
const previous = Object.keys(REGIONAL_BASELINE.files).flatMap(file => Object.entries(load(file))
  .filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, values]) => values));
const allRows = [...previous, ...rows];
const { getCuratedSeasonalPlace, applyCuratedSeasonalPolicy } = load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS, DATE_NIGHT_TYPE_CHIPS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight, mergeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery, createDateNightDiscoveryCache, DATE_NIGHT_CACHE_TTL_MS } = load("src/lib/date-night/cache.ts");
const { buildDateNightQueryPlan, normalizeDateNightActivityTypes } = load("src/lib/date-night/query-plan.ts");
const { clipDateNightRadius, createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { planDateNightPatches, dateNightPatchOwns } = load("src/lib/date-night/radial-plan.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds,
  clearSeasonalIdentityReceipts, SEASONAL_IDENTITY_RECEIPTS_KEY } = load("src/lib/date-night/identity-receipts.ts");
const { seasonalIdentityPreference, seasonalFavoriteToggleIds } = load("src/lib/date-night/identity-preferences.ts");
const { seasonalListingToPlace, isApproximateSeasonalPlace, seasonalDistancePrefix } = load("src/lib/date-night/listing.ts");
const { seasonalPresentation, SEASONAL_VISITOR_NOTICE } = load("src/lib/date-night/seasonal-presentation.ts");
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { getDateNightAvailability, hasDistinctHalloweenPlanPair } = load("src/lib/date-night/availability.ts");
const { dateNightChipsForNow, isHalloweenDateNightActive, HALLOWEEN_THRILL_TYPES,
  HALLOWEEN_SETTLE_TYPES } = load("src/lib/date-night/season.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-14T12:00:00-05:00");
const november5 = new Date("2026-11-05T12:00:00-06:00");
const nextYear = new Date("2027-10-14T12:00:00-05:00");
const ordinaryTypes = DATE_NIGHT_TYPE_CHIPS.map(chip => chip.id).filter(id => id !== "anything");
const allTypes = [...ordinaryTypes, "haunted-house", "corn-maze", "pumpkin-patch", "other-halloween-fall"];
const pool = (origin, places = [origin], now = at, filters = {}, preferences = {}, exclusions = [], season = true) => eligibleDateNight(
  decorateDateNight(places, origin, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1,
    activityTypes: ["anything"], openNowOnly: false, ...filters }, season, preferences, exclusions, now.getTime());
const providerFor = row => ({ ...row, id: `date-night-osm-node-${998100 + rows.indexOf(row)}`, source: "osm",
  openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
const response = (query, venues = [], outcome) => ({ venues, source: "merged",
  ...(query.patchId ? { patch: { id: query.patchId, version: "radial-v1" } } : {}),
  discovery: { partial: false, groups: buildDateNightQueryPlan(query.activityTypes, query.halloweenActive)
    .map(group => ({ ...group, outcome: outcome ?? (venues.length ? "succeeded-nonempty" : "succeeded-empty") })) } });
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
  const cutoff = Date.parse(row.seasonalListing.listingExpiresAt);
  for (const delta of [-1, 0, 1]) {
    const now = new Date(cutoff + delta);
    assert.equal(pool(row, places, now).length, delta < 0 ? 1 : 0, `${row.id}: cutoff ${delta}ms`);
    assert.equal(pool(row, places, now, { openNowOnly: true }).length, 0, `${row.id}: never Open Now at ${delta}`);
    assert.equal(pool(row, places, now, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, delta < 0 ? 1 : 0);
  }
  for (const now of [november5, nextYear]) assert.equal(pool(row, places, now).length, 0);
}
// Render the actual saved-list components with only their store/clock/UI leaf
// boundary replaced. Browser reload/layout acceptance is independently gated.
function savedPages(store, now) {
  const pure = appModuleLoader(), requirePackage = createRequire(import.meta.url);
  const render = (file, name) => {
    const module = { exports: {} };
    const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
    } });
    const require = specifier => {
      if (specifier === "@/lib/store") return { useAppStore: selector => selector(store) };
      if (specifier === "@/lib/date-night/use-clock") return { useDateNightClock: () => now };
      if (specifier === "@/components/ui/button") return { Button: props => { const clean = { ...props }; delete clean.asChild; return React.createElement("button", clean, props.children); } };
      if (specifier.startsWith("@/")) return pure(`src/${specifier.slice(2)}.ts`);
      return requirePackage(specifier);
    };
    new Function("require", "module", "exports", outputText)(require, module, module.exports);
    return renderToStaticMarkup(React.createElement(module.exports[name]));
  };
  return { favorites: render("src/components/favorites-page.tsx", "FavoritesPage"),
    history: render("src/components/history-page.tsx", "HistoryPage") };
}

const expectedIds = ["date-night-ok26-w1-annabelle", "date-night-ar26-warehouse", "date-night-ar26-asylum",
  "date-night-ks26-louisburg", "date-night-ks26-exiled", "date-night-ok26-w1-psycho", "date-night-ar26-river",
  "date-night-ok26-w1-roots", "date-night-ok26-w1-castle", "date-night-ar26-hollow", "date-night-ok26-w1-plantation", "date-night-ar26-magic"];
const expectedRecordIds = ["OK-W1-ANNABELLE-2026", "AR26-W1-003", "AR26-W1-002", "KS26-W1-LOUISBURG", "KS26-W1-EXILED",
  "OK-W1-PSYCHO-2026", "AR26-W1-007", "OK-W1-ROOTS-2026", "OK-W1-CASTLE-2026", "AR26-W1-019", "OK-W1-PLANTATION-2026", "AR26-W1-018"];

test("regional successor binds exact independent selected bytes and all 70 released full objects / 16 file bytes", () => {
  assert.equal(sha256(acceptedBytes), "6924a8b0747e780be1fe90f636d950ca1cdf0ec388435e004b9d35fb0b7ae8bc");
  assert.equal(sha256(baselineBytes), "6cce10ba61933192fa414fba1f73212734f43bf79248b76d7d7562cdd90b2d35");
  assert.equal(REGIONAL_BASELINE.source, "6c619adda4d9ef3b2683befb2ca874b257505eb2");
  assert.equal(REGIONAL_BASELINE.tree, "236110f86f9f3dc8c0cf0a5a664be79e2569bc43");
  assert.equal(previous.length, 70);
  assert.deepEqual(plain(previous), REGIONAL_BASELINE.catalog);
  assert.equal(Object.keys(REGIONAL_BASELINE.files).length, 16);
  for (const [file, hash] of Object.entries(REGIONAL_BASELINE.files)) assert.equal(sha256(readFileSync(file)), hash, file);
  assert.deepEqual(REGIONAL_IDS, expectedIds);
  assert.deepEqual(REGIONAL_RECORD_IDS, expectedRecordIds);
  assert.deepEqual(listings, accepted.records);
  assert.deepEqual(listings, REGIONAL_RECORDS, "Source fields and intentional absences are exact");
  assert.deepEqual(rows, REGIONAL_ROWS, "Only top-level reviewed coordinates and null machine-hours adaptation");
  assert.deepEqual(Object.keys(load(regionalFile)).sort(), ["REGIONAL_2026_WAVE1_CATALOG", "REGIONAL_2026_WAVE1_LISTINGS"]);
  assertRegionalCatalog(allRows, SEASONAL_PRESENTATIONS);
  assert.equal(new Set(allRows.map(row => row.id)).size, 82);
  assert.equal(new Set(allRows.map(row => row.seasonalListing.recordId)).size, 82);
  for (const row of allRows) assert.equal(getCuratedSeasonalPlace(row.id), row);
});

test("exact 82 registry presentations, module imports and legacy adapter cannot hide a reserve or replacement", () => {
  assert.deepEqual(SEASONAL_PRESENTATIONS, { ...REGIONAL_BASELINE.presentations, ...REGIONAL_PRESENTATIONS, ...WAVE2_EXPECTED_PRESENTATIONS },
    "The immutable 82 presentations plus exactly ten new reviewed-queue entries are preserved");
  assert.deepEqual(releasedSeventyPresentationsOnly(SEASONAL_PRESENTATIONS), REGIONAL_BASELINE.presentations);
  assert.equal(SEASONAL_VISITOR_NOTICE, "Check current hours, admission, and weather before you go.");
  const files = [...Object.keys(REGIONAL_BASELINE.files), regionalFile];
  assert.deepEqual(readdirSync("src/lib/date-night").filter(file => /^(?:missouri|regional)-2026-.*-catalog\.ts$/.test(file)).sort(),
    files.map(file => file.split("/").at(-1)).sort());
  const modules = files.map(file => `./${file.split("/").at(-1).replace(/\.ts$/, "")}`).sort();
  for (const file of ["src/lib/date-night/curated-policy.ts", "src/lib/date-night/search.ts"]) {
    const imports = [...readFileSync(file, "utf8").matchAll(/from "(\.\/(?:missouri|regional)-2026-[^"]+-catalog)"/g)].map(match => match[1]).sort();
    assert.deepEqual(imports, modules, `${file}: exact module set`);
  }
  // Exactly the accepted IDs excludes every reserve, held subtype and unrelated identity.
  assert.deepEqual(allRows.filter(row => !REGIONAL_BASELINE.catalog.some(old => old.id === row.id)).map(row => row.id), expectedIds);
});

test("global contract mutation controls reject missing/extra/borrowed identities, legacy edits and source/presentation drift", () => {
  const mutations = [
    rows => rows.pop(),
    rows => rows.push({ ...plain(rows.at(-1)), id: "unaccepted-reserve", seasonalListing: { ...rows.at(-1).seasonalListing, recordId: "RESERVE" } }),
    rows => { rows.at(-1).id = rows[0].id; },
    rows => { rows.at(-1).seasonalListing.recordId = rows[0].seasonalListing.recordId; },
    rows => { rows[0].seasonalAvailability.checkedAt = "2026-10-14"; rows[0].seasonalListing.reviewRevision += "-mutated"; },
    rows => { rows[0].unapprovedLegacyField = true; },
    rows => { delete rows[0].seasonalListing.sourceUrls; },
    rows => { rows.at(-1).seasonalListing.placement.lat += 0.001; },
    rows => { rows.at(-1).seasonalAvailability.activeDates.push("2026-11-07"); },
    rows => { rows.at(-1).seasonalAvailability.endsAt = "2027-11-01T00:00:00Z"; },
    rows => { rows.at(-1).openingHours = "24/7"; },
  ];
  for (const mutate of mutations) { const changed = plain(allRows); mutate(changed); assert.throws(() => assertRegionalCatalog(changed, SEASONAL_PRESENTATIONS)); }
  for (const mutate of [
    p => { delete p[expectedRecordIds[0]]; },
    p => { p.ORPHAN = p[expectedRecordIds[0]]; },
    p => { p[expectedRecordIds[0]].canonicalId = expectedIds[1]; },
    p => { p[expectedRecordIds[0]].details.push("Unreviewed visitor claim"); },
    p => { p[Object.keys(REGIONAL_BASELINE.presentations)[0]].confidence = "mutated"; },
  ]) {
    const changed = plain(SEASONAL_PRESENTATIONS); mutate(changed);
    assert.throws(() => assertRegionalCatalog(allRows, changed));
    assert.throws(() => releasedSeventyPresentationsOnly(changed));
  }
});

for (const row of rows) {
  test(`${row.name}: exact V1 presentation, approximate placement, visitor address and external ride picker`, () => {
    const listing = row.seasonalListing, recordId = listing.recordId;
    assert.equal(listing.contract, "ListingCompletenessV1");
    assert.equal(listing.seasonYear, 2026);
    assert.equal(listing.timeZone, "America/Chicago");
    assert.deepEqual(seasonalPresentation(row), accepted.presentations[row.id]);
    assert.equal(seasonalPresentation(row).confidence, REGIONAL_CONFIDENCE[recordId]);
    for (const fact of REGIONAL_MATERIAL_FACTS[recordId]) assert.match(seasonalPresentation(row).details.join(" "), fact);
    assert.deepEqual(seasonalPresentation({ ...row, id: "unreviewed-canonical-id" }), { confidence: "limited", details: ["Hours unconfirmed"] });
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), /\$\s*\d|\bUSD\b|audit|provenance|retention|Census|reviewRevision|listingExpiresAt|ListingCompletenessV1|machine opening|2027/i);
    assert.equal(isApproximateSeasonalPlace(row), true);
    assert.equal(seasonalDistancePrefix(row), "Approx. ");
    assert.notEqual(listing.placement.basis, "verified-arrival");
    assert.match(listing.placement.precisionLabel, /not (?:a verified |an )entrance/);
    assert.deepEqual(listing.directionsTarget, { kind: "visitor-address", address: row.address });
    assert.equal(listing.visitorAddress, row.address);
    assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
    assert.deepEqual(uberRideTarget(row), { url: "https://m.uber.com/", ariaLabel: "Open Uber; choose your destination in the external service" });
    for (const placement of [null, { ...listing.placement, lat: NaN }, { ...listing.placement, lon: 181 },
      { ...listing.placement, sourceUrl: "" }, { ...listing.placement, checkedAt: "" }]) {
      const unplaced = { ...row, id: `${row.id}-unreviewed`, seasonalListing: { ...listing, placement } };
      assert.equal(seasonalListingToPlace(unplaced), null);
      assert.deepEqual(decorateDateNight([unplaced], row, at), []);
      assert.deepEqual(clipDateNightRadius([unplaced], { ...row, radiusMiles: 1 }), []);
    }
  });

  test(`${row.name}: Anything / supported categories only, lifecycle toggles, exact expiry and no 2027 revival`, () => {
    assertLifecycle(row, [row]);
    assert.equal(row.openingHours, null);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(Object.hasOwn(row.seasonalAvailability, "startsAt"), false);
    for (const activityTypes of [["anything"], ...row.activityTypes.map(type => [type])]) assert.deepEqual(ids(pool(row, [row], at, { activityTypes })), [row.id]);
    for (const type of allTypes.filter(type => !row.activityTypes.includes(type))) assert.equal(pool(row, [row], at, { activityTypes: [type] }).length, 0, type);
    for (const enabled of [true, false, true, false]) {
      assert.equal(pool(row, [row], at, {}, {}, [], enabled).length, enabled || row.seasonalListing.visibility === "listing-lifecycle" ? 1 : 0);
      for (const type of ordinaryTypes) assert.equal(pool(row, [row], at, { activityTypes: [type] }, {}, [], enabled).length, 0, `${type}: no seasonal-only ordinary eligibility`);
    }
    assert.equal(pool({ ...row, lat: row.lat + 0.04 }, [row]).length, 0);
    assert.equal(clipDateNightRadius([row], { ...row, radiusMiles: 1 }).length, 1);
    assert.equal(clipDateNightRadius([row], { ...row, lat: row.lat + 1, radiusMiles: 1 }).length, 0);
    for (const date of row.seasonalAvailability.activeDates) for (const state of ["unknown", "partial", "verified"]) {
      const now = new Date(`${date}T12:00:00-05:00`);
      const stale = { ...row, openingHours: "24/7", seasonalAvailability: { ...row.seasonalAvailability, openNowPolicy: undefined },
        seasonalListing: { ...row.seasonalListing, hours: { state } }, hoursKnown: true, isOpen: true };
      assert.equal(getDateNightAvailability(stale, now).openNowEligible, false, `${date}: ${state}`);
      assert.equal(pool(row, [stale], now, { openNowOnly: true }).length, 0);
    }
  });

  test(`${row.name}: both provider orders retain merged provenance, current policy and all negative / preference authority`, () => {
    const provider = providerFor(row);
    for (const order of [[row, provider], [provider, row]]) {
      const merged = dedupeDateNight(order);
      assert.equal(merged[0].source, "merged");
      const combined = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
      for (const places of [merged, mergeDateNight([order[0]], [order[1]]), combined.venues, plain(combined.venues)]) {
        assert.equal(places.length, 1); const match = places[0];
        assert.equal(match.id, row.id);
        assert.deepEqual([...new Set(match.discoveryEvidence.map(e => e.source))].sort(), ["catalog", "osm"]);
        assert.deepEqual(match.discoveryEvidence.map(e => e.id).sort(), [row.id, provider.id].sort());
        assert.deepEqual(match.seasonalListing, row.seasonalListing);
        assert.deepEqual(match.seasonalAvailability, row.seasonalAvailability);
        assert.deepEqual(seasonalPresentation(match), seasonalPresentation(row));
        assert.equal(match.openingHours, null);
        assertLifecycle(row, places);
        for (const id of [row.id, provider.id]) {
          const favorite = { [id]: { favorite: true } };
          assert.equal(pool(row, places, at, { favoritesOnly: true }, favorite).length, 1);
          assert.deepEqual(seasonalFavoriteToggleIds(match, favorite), [id]);
          assert.deepEqual(seasonalFavoriteToggleIds(match, { [id]: { favorite: false } }), [row.id]);
          assert.equal(seasonalIdentityPreference(match, { [id]: { favorite: false } }).favorite, false);
          assert.equal(pool(row, places, at, {}, { [row.id]: { favorite: true }, [id]: { favorite: true, neverRecommend: true } }).length, 0);
          const exclusions = [{ restaurantId: id, name: row.name, expiresAt: at.getTime() + 1000, reason: "not-tonight" }];
          assert.equal(pool(row, places, at, {}, {}, exclusions).length, 0);
          assert.equal(pool(row, places, new Date(at.getTime() + 1000), {}, {}, exclusions).length, 1);
        }
      }
      for (const lifecycle of ["disused", "permanently-closed"]) {
        const negative = order.map(place => place.id === provider.id ? { ...place, lifecycle } : place);
        for (const places of [dedupeDateNight(negative), combineDateNightDiscovery({ response: { venues: [negative[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [negative[1]], source: "live" }).venues]) {
          assert.equal(places.length, 1);
          assert.equal(places[0].lifecycle, lifecycle);
          assert.equal(pool(row, places).length, 0);
          assert.equal(pool(row, places, at, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, 0);
        }
      }
    }
    assert.equal(pool(row, [row], at, { favoritesOnly: true }).length, 0);
  });

  test(`${row.name}: shared address / generic name / distant names cannot acquire identity or preference aliases`, t => {
    receiptStorage(t);
    const provider = providerFor(row);
    const unrelated = [{ ...provider, name: `${row.name} Private Tour` }, { ...provider, name: "Fall Festival" },
      { ...provider, name: "Haunted House" }, { ...provider, lat: row.lat + 0.1 },
      { ...provider, seasonalListing: { ...row.seasonalListing, recordId: "UNRELATED-EVENT" } }];
    for (const other of unrelated) for (const order of [[row, other], [other, row]]) {
      const distinct = dedupeDateNight(order);
      assert.equal(distinct.length, 2, "Approximate location, address and shared type are not affirmative identity");
      recordSeasonalIdentityReceipts(distinct);
      assert.deepEqual(seasonalReceiptAliasIds(row.id), []);
      const current = distinct.find(place => place.id === row.id);
      assert.equal(seasonalIdentityPreference(current, { [other.id]: { favorite: true, neverRecommend: true } }).favorite, false);
      assert.equal(seasonalIdentityPreference(current, { [other.id]: { favorite: true, neverRecommend: true } }).neverRecommend, false);
      assert.deepEqual(seasonalFavoriteToggleIds(current, { [other.id]: { favorite: true } }), [row.id]);
      assert.equal(resolveSavedSeasonalPlace({ restaurantId: other.id, name: other.name }), undefined);
    }
  });

  test(`${row.name}: real cache coverage, exact TTL and valid-empty refresh never rejuvenate saved positives`, () => {
    let time = at.getTime();
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, halloweenActive: true, activityTypes: [...row.activityTypes] };
    const cache = createDateNightDiscoveryCache({ now: () => time });
    assert.equal(cache.store(query, response(query, dedupeDateNight([providerFor(row), row]))), true);
    assert.deepEqual(cache.read(query).missingActivityTypes, []);
    assertLifecycle(row, cache.read(query).response.venues);
    for (const change of [{ lat: row.lat + 1 }, { lon: row.lon + 1 }, { halloweenActive: false }, { semanticVersion: "unreviewed-future" }]) {
      assert.equal(cache.read({ ...query, ...change }).response, null);
    }
    assert.deepEqual(cache.read({ ...query, activityTypes: ["movies"] }).missingActivityTypes, ["movies"]);
    time = at.getTime() + DATE_NIGHT_CACHE_TTL_MS - 1;
    assert.deepEqual(cache.read(query).missingActivityTypes, []);
    time += 1;
    assert.equal(cache.read(query).response, null, "Reads do not extend the acquisition TTL");
    assert.deepEqual(cache.read(query).missingActivityTypes.sort(), [...query.activityTypes].sort());
    assert.equal(cache.store(query, response(query, [row])), true);
    time += 1;
    assert.equal(cache.store(query, response(query, [])), true);
    assert.deepEqual(cache.read(query).response.venues, []);
    assert.deepEqual(cache.read(query).missingActivityTypes, []);
    for (const outcome of ["failed", "cancelled", "cache-hit"]) {
      assert.equal(cache.store(query, response(query, [row], outcome)), false);
      assert.deepEqual(cache.read(query).response.venues, []);
    }
    assert.equal(cache.store(query, { ...response(query, [row]), source: "fallback" }), false);
    assert.equal(cache.store(query, { venues: [row], source: "live" }), false);
  });

  test(`${row.name}: stale canonical snapshots restore policy and affirmed receipts / Favorites / History survive reload`, t => {
    const storage = receiptStorage(t), provider = providerFor(row);
    const saved = { restaurantId: provider.id, name: row.name, lat: 0, lon: 0, address: "Old provider address", favorite: true, cuisineLabel: row.cuisineLabel };
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
    recordSeasonalIdentityReceipts([row, provider]);
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
    const stale = { ...row, lat: 0, lon: 0, name: "Stale name", address: "Old address", openingHours: "24/7",
      seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined };
    const restored = decorateDateNight([stale], row, at)[0];
    assert.deepEqual([restored.lat, restored.lon, restored.address, restored.name], [row.lat, row.lon, row.address, row.name]);
    assert.deepEqual(restored.seasonalListing, row.seasonalListing);
    assert.deepEqual(restored.seasonalAvailability, row.seasonalAvailability);
    assert.equal(restored.isOpen, false);
    for (const lifecycle of ["disused", "permanently-closed"]) assert.equal(applyCuratedSeasonalPolicy({ ...stale, lifecycle }).lifecycle, lifecycle);
    assert.deepEqual(resolveSavedSeasonalPlace({ restaurantId: row.id, name: "Stale name" }), row);
    recordSeasonalIdentityReceipts(mergeDateNight([provider], [row]));
    assert.deepEqual(JSON.parse(storage.get(SEASONAL_IDENTITY_RECEIPTS_KEY))[provider.id], {
      canonicalId: row.id, reviewRevision: row.seasonalListing.reviewRevision, canonicalName: row.name,
    });
    assert.deepEqual(seasonalReceiptAliasIds(row.id), [provider.id]);
    const reloaded = appModuleLoader()("src/lib/date-night/identity-receipts.ts").resolveSavedSeasonalPlace(plain(saved));
    assert.deepEqual(reloaded, row);
    assertLifecycle(row, [reloaded]);
    assert.equal(pool(row, [reloaded], at, { favoritesOnly: true }, { [provider.id]: saved }).length, 1);
    assert.equal(pool(row, [reloaded], at, {}, { [provider.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(row, [reloaded], at, {}, {}, [{ restaurantId: provider.id, expiresAt: at.getTime() + 1000 }]).length, 0);
    const store = { location: row, preferences: { [provider.id]: saved, [row.id]: { ...saved, restaurantId: row.id } },
      visits: [{ id: `visit-${row.id}`, restaurantId: row.id, restaurantName: row.name, cuisineLabel: row.cuisineLabel, date: at.toISOString() }], toggleFavorite() {} };
    for (const now of [at, new Date(Date.parse(row.seasonalListing.listingExpiresAt)), nextYear]) {
      const pages = savedPages(plain(store), now);
      assert.match(pages.favorites, /Approx\./);
      assert.ok(pages.favorites.includes(row.address.replaceAll("&", "&amp;")));
      assert.doesNotMatch(pages.favorites, /Old provider address|Open now/);
      assert.equal((pages.favorites.match(/aria-label="Remove /g) ?? []).length, 1, "Alias favorites render once after reload");
      assert.ok(pages.history.includes(row.name.replaceAll("&", "&amp;")));
      if (now >= new Date(row.seasonalListing.listingExpiresAt)) assert.match(pages.favorites, /Season ended/);
    }
    assert.equal(resolveSavedSeasonalPlace({ ...saved, name: "Unrelated saved place" }), undefined);
    clearSeasonalIdentityReceipts();
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
  });

  test(`${row.name}: malformed, stale and conflicting receipt reloads fail closed`, t => {
    const storage = receiptStorage(t), provider = providerFor(row), saved = { restaurantId: provider.id, name: row.name };
    const good = { canonicalId: row.id, reviewRevision: row.seasonalListing.reviewRevision, canonicalName: row.name };
    for (const value of [null, [], "bad", { [provider.id]: null }, { [provider.id]: { ...good, reviewRevision: "superseded" } },
      { [provider.id]: { ...good, canonicalId: "unreviewed" } }, { [provider.id]: { ...good, canonicalName: "Unrelated" } },
      { [provider.id]: { conflict: true } }, { "untrusted-provider-id": good }]) {
      storage.set(SEASONAL_IDENTITY_RECEIPTS_KEY, JSON.stringify(value));
      assert.equal(appModuleLoader()("src/lib/date-night/identity-receipts.ts").resolveSavedSeasonalPlace(saved), undefined);
    }
    storage.set(SEASONAL_IDENTITY_RECEIPTS_KEY, "not-json");
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
    storage.clear();
    const other = rows[(rows.indexOf(row) + 1) % rows.length];
    for (const candidate of [row, other]) recordSeasonalIdentityReceipts(dedupeDateNight([{ ...providerFor(candidate), id: provider.id }, candidate]));
    assert.deepEqual(JSON.parse(storage.get(SEASONAL_IDENTITY_RECEIPTS_KEY))[provider.id], { conflict: true });
    assert.equal(resolveSavedSeasonalPlace(saved), undefined);
    assert.deepEqual(seasonalReceiptAliasIds(row.id), []);
    recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    assert.equal(resolveSavedSeasonalPlace(saved), undefined, "A later positive cannot clear an identity conflict");
  });

  test(`${row.name}: real search, provider failure, season toggles and cutoff policy preserve exact registration`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
    let outage = false;
    t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Controlled regional provider outage"); return Response.json({ elements: [] }); });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true };
    for (const failure of [false, true]) {
      outage = failure;
      for (const activityTypes of [["anything"], ...row.activityTypes.map(type => [type])]) {
        const result = await searchDateNight({ data: { ...query, activityTypes } });
        const match = result.venues.filter(place => place.id === row.id);
        assert.equal(match.length, 1);
        assert.deepEqual(match[0].seasonalListing, row.seasonalListing);
        assert.equal(pool(row, result.venues, at, { activityTypes }).some(place => place.id === row.id), true);
        assert.equal(pool(row, result.venues, at, { activityTypes, openNowOnly: true }).some(place => place.id === row.id), false);
      }
    }
    outage = false;
    for (const spookySeasonEnabled of [false, true, false]) {
      const result = await searchDateNight({ data: { ...query, spookySeasonEnabled } });
      assert.equal(result.venues.some(place => place.id === row.id), spookySeasonEnabled || row.seasonalListing.visibility === "listing-lifecycle");
      for (const type of ordinaryTypes) assert.equal(pool(row, result.venues, at, { activityTypes: [type] }, {}, [], spookySeasonEnabled).some(place => place.id === row.id), false);
    }
    for (const now of [-1, 0, 1].map(delta => new Date(Date.parse(row.seasonalListing.listingExpiresAt) + delta)).concat(november5, nextYear)) {
      t.mock.timers.setTime(now.getTime());
      const result = await searchDateNight({ data: query });
      assert.equal(pool(row, result.venues, now).some(place => place.id === row.id), now.getTime() < Date.parse(row.seasonalListing.listingExpiresAt));
    }
  });

  test(`${row.name}: a pre-expiry pending RPC delivered at cutoff cannot restore a selectable favorite`, async t => {
    const cutoff = Date.parse(row.seasonalListing.listingExpiresAt);
    t.mock.timers.enable({ apis: ["Date"], now: cutoff - 1 });
    let release;
    const wait = new Promise(resolve => { release = resolve; });
    t.mock.method(globalThis, "fetch", async () => { await wait; return Response.json({ elements: [] }); });
    const pending = searchDateNight({ data: { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true } });
    await new Promise(resolve => setImmediate(resolve));
    t.mock.timers.setTime(cutoff);
    release();
    const result = await pending;
    assert.equal(result.venues.some(place => place.id === row.id), true, "The response genuinely contains the pre-expiry catalog positive");
    assert.equal(pool(row, result.venues, new Date(cutoff), { favoritesOnly: true }, { [row.id]: { favorite: true } }).some(place => place.id === row.id), false);
    assert.equal(pool(row, result.venues, new Date(cutoff + 1)).some(place => place.id === row.id), false);
  });
}

const datesFrom = text => text.split(" ");
const octoberFridaysSaturdays = datesFrom("2026-10-02 2026-10-03 2026-10-09 2026-10-10 2026-10-16 2026-10-17 2026-10-23 2026-10-24 2026-10-30 2026-10-31");
const datesById = {
  "date-night-ok26-w1-annabelle": datesFrom("2026-09-26 2026-09-27 2026-10-02 2026-10-03 2026-10-04 2026-10-09 2026-10-10 2026-10-11 2026-10-16 2026-10-17 2026-10-18 2026-10-23 2026-10-24 2026-10-25 2026-10-30 2026-10-31 2026-11-01"),
  "date-night-ar26-warehouse": octoberFridaysSaturdays,
  "date-night-ar26-asylum": datesFrom("2026-10-16 2026-10-17 2026-10-23 2026-10-24 2026-10-29 2026-10-30 2026-10-31"),
  "date-night-ks26-louisburg": Array.from({ length: 52 }, (_, i) => new Date(Date.UTC(2026, 8, 11 + i)).toISOString().slice(0, 10)),
  "date-night-ks26-exiled": datesFrom("2026-10-02 2026-10-03 2026-10-09 2026-10-10 2026-10-16 2026-10-17 2026-10-23 2026-10-24 2026-10-25 2026-10-29 2026-10-30 2026-10-31 2026-11-01"),
  "date-night-ok26-w1-psycho": octoberFridaysSaturdays,
  "date-night-ar26-river": octoberFridaysSaturdays.slice(1),
  "date-night-ok26-w1-roots": octoberFridaysSaturdays,
  "date-night-ok26-w1-castle": octoberFridaysSaturdays,
  "date-night-ar26-hollow": ["2026-09-19", "2026-09-26", ...octoberFridaysSaturdays],
  "date-night-ok26-w1-plantation": datesFrom("2026-10-16 2026-10-17 2026-10-23 2026-10-24 2026-10-30 2026-10-31"),
  "date-night-ar26-magic": datesFrom("2026-09-26 2026-09-27 2026-10-03 2026-10-04 2026-10-10 2026-10-11 2026-10-17 2026-10-18 2026-10-24 2026-10-25 2026-10-31 2026-11-01"),
};

test("all 12 retain finite independently dated calendars, date-only omissions and exact CST final ends", () => {
  for (const row of rows) {
    assert.deepEqual(row.seasonalAvailability.activeDates, datesById[row.id], row.id);
    assert.equal(new Set(row.seasonalAvailability.activeDates).size, row.seasonalAvailability.activeDates.length);
    assert.ok(row.seasonalAvailability.activeDates.every(date => date.startsWith("2026-") && date <= "2026-11-01"));
    assert.equal(Object.hasOwn(row.seasonalAvailability, "endsAt"), row.seasonalListing.expiryBasis === "exact");
    if (row.seasonalListing.expiryBasis === "exact") assert.equal(Date.parse(row.seasonalAvailability.endsAt), Date.parse(row.seasonalListing.listingExpiresAt));
    assert.equal(Date.parse(row.seasonalAvailability.listingExpiresAt), Date.parse(row.seasonalListing.listingExpiresAt));
  }
  for (const id of ["date-night-ok26-w1-annabelle", "date-night-ks26-louisburg"]) {
    assert.equal(Date.parse(rows.find(row => row.id === id).seasonalListing.listingExpiresAt), Date.parse("2026-11-01T18:00:00-06:00"));
  }
  assert.equal(Date.parse(rows.find(row => row.id === "date-night-ar26-magic").seasonalListing.listingExpiresAt), Date.parse("2026-11-01T21:00:00-06:00"));
  assert.equal(Date.parse(rows.find(row => row.id === "date-night-ks26-exiled").seasonalListing.listingExpiresAt), Date.parse("2026-11-02T00:00:00-06:00"));
  assert.equal(Date.parse(rows.find(row => row.id === "date-night-ok26-w1-roots").seasonalListing.listingExpiresAt), Date.parse("2026-10-31T23:00:00-05:00"));
});

test("both repeated DST hours preserve the same four November 1 records without extending Halloween or eight lifecycles", () => {
  const november1Ids = ["date-night-ok26-w1-annabelle", "date-night-ks26-louisburg", "date-night-ks26-exiled", "date-night-ar26-magic"].sort();
  const hours = [new Date("2026-11-01T01:30:00-05:00"), new Date("2026-11-01T01:30:00-06:00")];
  assert.equal(hours[1].getTime() - hours[0].getTime(), 3_600_000);
  for (const now of hours) {
    assert.equal(new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(now), "1:30 AM");
    assert.deepEqual(rows.filter(row => pool(row, [row], now).length).map(row => row.id).sort(), november1Ids);
    assert.deepEqual(rows.filter(row => pool(row, [row], now, {}, {}, [], false).length).map(row => row.id).sort(), november1Ids);
  }
  assert.equal(rows.filter(row => row.seasonalListing.visibility === "listing-lifecycle").length, 8);
  for (const row of rows) {
    assert.ok(Date.parse(row.seasonalListing.listingExpiresAt) < november5.getTime());
    assert.equal(pool(row, [row], november5, {}, {}, [], false).length, 0);
    if (row.seasonalListing.visibility === "listing-lifecycle") assert.equal(pool(row, [row], at, {}, {}, [], false).length, 1);
  }
  for (const now of [new Date("2026-11-03T12:00:00-06:00"), november5]) {
    assert.equal(isHalloweenDateNightActive(true, now), false);
    assert.deepEqual(dateNightChipsForNow(true, now), DATE_NIGHT_TYPE_CHIPS);
    assert.deepEqual(normalizeDateNightActivityTypes(["anything"], false).sort(), [...ordinaryTypes].sort());
    assert.ok(buildDateNightQueryPlan(["anything"], false).flatMap(group => group.activityTypes).every(type => ordinaryTypes.includes(type)));
  }
});

test("source-specific qualifications keep distinct admissions, timing, ages, accessibility and approximate placements", () => {
  const byId = Object.fromEntries(rows.map(row => [row.id, row]));
  const detail = id => seasonalPresentation(byId[id]).details.join(" ");
  const warehouse = byId["date-night-ar26-warehouse"];
  assert.equal(warehouse.seasonalAvailability.activeDates.includes("2026-10-22"), false);
  assert.match(detail(warehouse.id), /separate no-scare visit runs October 22, 6–9 PM/);
  assert.match(detail(warehouse.id), /no-contact.*not recommended for children.*not wheelchair accessible/);
  assert.match(detail("date-night-ar26-asylum"), /Ticket window opens 7 PM; haunt start and closing time are unconfirmed/);
  assert.match(detail("date-night-ar26-asylum"), /No refunds.*onsite parking attendants and signs/);
  const louisburg = byId["date-night-ks26-louisburg"];
  assert.deepEqual([louisburg.lat, louisburg.lon], [38.6218568, -94.755488]);
  assert.equal(louisburg.seasonalListing.placement.basis, "operator-site");
  assert.match(louisburg.seasonalListing.hours.displayText, /8 p\.m\. versus 10 p\.m\. closing/);
  assert.match(detail(louisburg.id), /closing time is unconfirmed because operator pages differ/);
  assert.match(detail(louisburg.id), /Family Farm admission required; Country Store entry is free\. Pumpkins are separate/);
  assert.match(detail("date-night-ks26-exiled"), /Paid timed Trail ticket required; Carnival entry is free/);
  assert.match(detail("date-night-ks26-exiled"), /30-minute window beginning at your ticket time/);
  assert.match(detail("date-night-ks26-exiled"), /cannot accommodate mobility aids.*Optional Green Level is 16\+.*consent required/);
  const psycho = byId["date-night-ok26-w1-psycho"];
  assert.deepEqual([psycho.lat, psycho.lon], [36.3076991, -95.9675955]);
  assert.equal(psycho.seasonalListing.placement.basis, "operator-site");
  assert.doesNotMatch(detail(psycho.id), /hayride|Map placement is not yet available/i);
  assert.match(detail(psycho.id), /Book main admission online for a timed entry/);
  assert.match(detail(psycho.id), /Shadow Box-only tickets are listed as on-site/);
  assert.match(detail("date-night-ar26-river"), /Gates open 7 PM; trail opens 8 PM.*Ticket sales end 10 PM; nominal close is 11 PM.*final exit time is unconfirmed/);
  const roots = byId["date-night-ok26-w1-roots"];
  assert.match(roots.address, /Muskogee/);
  assert.doesNotMatch(roots.address, /Chelsea|Ada/);
  assert.match(detail(roots.id), /Optional Twisted Touch upgrade is 18\+.*Not wheelchair accessible; uneven terrain, inclines and stairs/);
  assert.match(detail("date-night-ok26-w1-castle"), /Gates open 5:30 p\.m\.; indoor attractions at 6:15 p\.m\., outdoor attractions at dusk/);
  assert.match(detail("date-night-ok26-w1-castle"), /Ticket sales end 11 p\.m\.; haunts may run later/);
  assert.match(detail("date-night-ok26-w1-castle"), /Under 16s need a parent or legal guardian throughout.*under-18s need photo ID.*Children cannot be carried/);
  assert.match(detail("date-night-ok26-w1-castle"), /wheelchairs up to 36 inches wide; other haunts have limitations/);
  assert.match(detail("date-night-ar26-hollow"), /online tickets must be exchanged before 10 PM.*Final closing time depends/);
  assert.match(detail("date-night-ar26-hollow"), /seizure, heart or breathing conditions and during pregnancy/);
  assert.match(detail("date-night-ar26-hollow"), /Check the operator’s current directions for the Highway 62 bridge detour/);
  assert.match(detail("date-night-ok26-w1-plantation"), /light touching and theatrical blood; a waiver is required.*age recommendations vary, so parental discretion applies/);
  assert.doesNotMatch(detail("date-night-ok26-w1-plantation"), /Zombie Rampage|minimum age|must be \d/i);
  assert.match(detail("date-night-ar26-magic"), /scare attractions begin opening at 6 PM, with some starting at 7 PM/);
  assert.match(detail("date-night-ar26-magic"), /No re-entry after 6 PM.*Bags are searched/);
  assert.match(detail("date-night-ar26-magic"), /guests over 13 require a costume-policy exception/);
  assert.match(detail("date-night-ar26-magic"), /recommended for ages 12\+ with parental discretion.*independently and willingly; children cannot be carried/);
});

test("qualified Plan roles require reviewed categories and distinct eligible venues; Other alone never invents a partner", () => {
  for (const row of rows) {
    const movie = { ...providerFor(row), id: `ordinary-movie-${row.id}`, name: "Independent ordinary movie fixture", activityTypes: ["movies"], openingHours: "24/7" };
    const available = pool(row, [row, movie]);
    const thrill = available.filter(place => place.activityTypes.some(type => HALLOWEEN_THRILL_TYPES.includes(type)));
    const settle = available.filter(place => place.activityTypes.some(type => HALLOWEEN_SETTLE_TYPES.includes(type)));
    assert.equal(thrill.some(place => place.id === row.id), true);
    assert.equal(hasDistinctHalloweenPlanPair(thrill, settle), true);
    assert.equal(hasDistinctHalloweenPlanPair([row], [row]), false);
    assert.equal(pool(row, [row, movie], at, {}, { [movie.id]: { neverRecommend: true } }).some(place => place.id === movie.id), false);
    const other = { ...row, id: `${row.id}-other-only-control`, activityTypes: ["other-halloween-fall"] };
    const otherPool = pool(row, [other]);
    assert.equal(otherPool.length, 1);
    assert.equal(hasDistinctHalloweenPlanPair(otherPool.filter(place => place.activityTypes.some(type => HALLOWEEN_THRILL_TYPES.includes(type))),
      otherPool.filter(place => place.activityTypes.some(type => HALLOWEEN_SETTLE_TYPES.includes(type)))), false);
  }
});

test("independent spherical-vector oracle is immutable and covers exactly all 82 source-bound coordinates", () => {
  assert.equal(sha256(oracleBytes), "e167aa2334ac90f011a1d6ffb823d838a3496e36657620ac5e9c6a83a69460e8");
  assert.equal(oracle.acceptedSha256, sha256(acceptedBytes));
  assert.equal(oracle.baselineSha256, sha256(baselineBytes));
  assert.deepEqual(oracle.canonicalIds, ids(allRows));
  assert.deepEqual(oracle.radiiMiles, [1, 15, 25, 50]);
  assert.equal(oracle.origins.length, 14);
  for (const row of rows) {
    const origin = oracle.origins.find(origin => origin.id === row.id);
    assert.deepEqual([origin.lat, origin.lon], [row.lat, row.lon]);
    assert.equal(origin.distancesMiles[row.id], 0);
  }
  assert.equal(oracle.origins.filter(origin => origin.id.startsWith("mo-side-")).length, 2);
});

for (const origin of oracle.origins) {
  test(`${origin.label}: independent 1/15/25/50-mile membership and unique radial ownership cross state borders`, () => {
    const patches = planDateNightPatches(origin, 50);
    for (const row of allRows) {
      const distance = decorateDateNight([row], origin, at)[0].distanceMiles;
      assert.ok(Math.abs(distance - origin.distancesMiles[row.id]) < 0.0000002, `${row.id}: independent distance oracle`);
      assert.deepEqual(patches.filter(patch => dateNightPatchOwns(origin, patch, row)).map(patch => patch.id),
        origin.ownersAt50Miles[row.id] ? [origin.ownersAt50Miles[row.id]] : [], `${row.id}: exactly one independent owner`);
    }
    for (const radiusMiles of oracle.radiiMiles) {
      const expected = origin.memberships[radiusMiles];
      assert.deepEqual(ids(clipDateNightRadius(allRows, { ...origin, radiusMiles })), expected);
      const regional = expected.filter(id => expectedIds.includes(id));
      assert.deepEqual(ids(pool(origin, rows, at, { radiusMiles })), regional);
      assert.deepEqual(ids(pool(origin, rows, at, { radiusMiles, openNowOnly: true })), []);
      const acquisitionRadius = radiusMiles === 25 ? 30 : radiusMiles;
      const query = { ...origin, radiusMiles: acquisitionRadius, halloweenActive: true, activityTypes: ["anything"] };
      const cache = createDateNightRadialCache({ now: () => at.getTime() });
      for (const patch of planDateNightPatches(origin, acquisitionRadius)) {
        const acquisition = { ...query, patchId: patch.id };
        assert.equal(cache.store(acquisition, response(acquisition, allRows)), true);
      }
      const state = cache.read(query);
      assert.equal(state.coverage.complete, true);
      assert.deepEqual(ids(clipDateNightRadius(state.response.venues, { ...origin, radiusMiles })), expected,
        "Overlapping provider circles cannot duplicate or leak positive identities");
    }
  });
}

for (const row of rows) {
  test(`${row.name}: radial ownership and cross-patch negative evidence never revive cleared or closed positives`, () => {
    const origin = { lat: row.lat, lon: row.lon }, patches = planDateNightPatches(origin, 50);
    const base = { ...origin, radiusMiles: 50, halloweenActive: true, activityTypes: [...row.activityTypes] };
    const core = { ...base, patchId: patches[0].id }, overlap = { ...base, patchId: patches[1].id };
    const cache = createDateNightRadialCache({ now: () => at.getTime() });
    assert.equal(cache.store(core, response(core, [row])), true);
    assert.equal(cache.store(overlap, response(overlap, [row])), true);
    assert.deepEqual(ids(cache.read(base).response.venues), [row.id]);
    assert.equal(cache.store(core, response(core, [])), true);
    assert.deepEqual(cache.read(base).response.venues, [], "Unowned circle positives cannot revive a valid-empty owner refresh");
    for (const lifecycle of ["disused", "permanently-closed"]) {
      let time = at.getTime();
      const negativeCache = createDateNightRadialCache({ now: () => time, ttlMs: 100, maxEntries: 2 });
      negativeCache.store(core, response(core, [row]));
      time += 1;
      const negative = dedupeDateNight([row, { ...providerFor(row), lifecycle }]);
      negativeCache.store(overlap, response(overlap, negative));
      const state = negativeCache.read(base);
      assert.equal(state.response.venues.length, 1);
      assert.equal(state.response.venues[0].lifecycle, lifecycle);
      assert.equal(pool(row, state.response.venues).length, 0);
      negativeCache.read({ ...base, radiusMiles: 1 }); // Core remains hot; evict the negative next.
      const pressure = { ...base, patchId: patches[2].id };
      negativeCache.store(pressure, response(pressure, []));
      assert.equal(negativeCache.read(base).response.venues.some(place => place.id === row.id && !place.lifecycle), false,
        "Evicting negative evidence destructively retires the old positive");
      time += 100;
      assert.equal(negativeCache.read(base).response, null);
    }
  });
}

test("regional relocation through actual search uses public KS / AR / OK / MO-border origins and independent radius membership", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
  t.mock.method(globalThis, "fetch", async () => Response.json({ elements: [] }));
  for (const origin of oracle.origins) for (const radiusMiles of oracle.radiiMiles) {
    const result = await searchDateNight({ data: { lat: origin.lat, lon: origin.lon, radiusMiles, spookySeasonEnabled: true, activityTypes: ["anything"] } });
    const candidates = result.venues.filter(place => expectedIds.includes(place.id));
    assert.deepEqual(ids(pool(origin, candidates, at, { radiusMiles })), origin.memberships[radiusMiles].filter(id => expectedIds.includes(id)));
  }
});
