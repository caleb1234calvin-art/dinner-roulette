import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_ASTRA_ELEVEN_CATALOG: rows } = load("src/lib/date-night/missouri-2026-astra-eleven-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { seasonalPresentation, SEASONAL_VISITOR_NOTICE } = load("src/lib/date-night/seasonal-presentation.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds } = load("src/lib/date-night/identity-receipts.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-16T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], halloween = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, halloween, preferences, exclusions, now.getTime());
const providerFor = (row) => ({ ...row, id: `date-night-osm-node-${rows.indexOf(row) + 801100}`, source: "osm", openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
const expectedIds = ["DELTA2-BRANSON-GHOSTER", "MO26-056", "DELTA3-RANCH", "DELTA3-COBB", "MO26-037", "DELTA2-MISSOURI-NIGHTMARE", "DELTA2-TREPIDATIONS", "DELTA3-FREAKS", "DELTA4-HELL-HARVEST", "MO26-005", "MO26-027"];
const cutoffs = ["2026-10-31T22:00:00-05:00", "2026-10-30T23:00:00-05:00", "2026-10-31T23:00:00-05:00", "2026-11-07T23:00:00-06:00", "2026-11-02T00:00:00-06:00", "2026-11-01T20:30:00-06:00", "2026-11-01T23:00:00-06:00", "2026-10-31T22:30:00-05:00", "2026-11-01T00:00:00-05:00", "2026-11-01T00:00:00-05:00", "2026-11-01T00:00:00-05:00"];
const priorCatalogs = [
  ["missouri-2026-cleared-catalog", "MISSOURI_2026_CLEARED_SEASONAL_CATALOG"],
  ["missouri-2026-v1-catalog", "MISSOURI_2026_V1_SEASONAL_CATALOG"],
  ["missouri-2026-v1-next-catalog", "MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG"],
  ["missouri-2026-deferred-batch-3-catalog", "MISSOURI_2026_DEFERRED_BATCH_3_CATALOG"],
  ["missouri-2026-final-four-catalog", "MISSOURI_2026_FINAL_FOUR_CATALOG"],
  ["missouri-2026-late-fall-catalog", "MISSOURI_2026_LATE_FALL_CATALOG"],
  ["missouri-2026-three-source-tier-a-catalog", "MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG"],
].flatMap(([file, key]) => load(`src/lib/date-night/${file}.ts`)[key]);

test("Astra batch is the exact eleven independently cleared identities, with 32 distinct prior curated records", () => {
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), expectedIds);
  assert.equal(priorCatalogs.length, 32);
  const all = [...priorCatalogs, ...rows];
  assert.equal(new Set(all.map(row => row.id)).size, 43);
  assert.equal(new Set(all.map(row => row.seasonalListing.recordId)).size, 43);
  assert.equal(rows.filter(row => row.seasonalListing.visibility === "listing-lifecycle").length, 1);
  assert.equal(rows.find(row => row.seasonalListing.visibility === "listing-lifecycle").seasonalListing.recordId, "DELTA3-COBB");
  assert.equal(SEASONAL_VISITOR_NOTICE, "Check current hours, admission, and weather before you go.");
});

test("accepted field projections and reviewed visitor copy survive the runtime mapping", () => {
  const priorNine = JSON.parse(readFileSync("audit/astra-eleven-2026-10-09/Nine-Preimport-Eligible-Author-Subset-R2.json", "utf8")).records;
  const priorTwo = JSON.parse(readFileSync("audit/astra-eleven-2026-10-09/Independent-Delta5-R2-Final-Eligible-Subset.json", "utf8")).records;
  for (const [i, row] of rows.entries()) {
    assert.equal(row.seasonalListing.listingExpiresAt, cutoffs[i]);
    assert.equal(row.seasonalAvailability.listingExpiresAt, cutoffs[i]);
    assert.equal(row.seasonalListing.seasonYear, 2026);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.openingHours, null);
    assert.equal(row.seasonalListing.placement.basis === "verified-arrival", false);
    assert.equal(getCuratedSeasonalPlace(row.id), row);
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), /audit|retention|runtime|recurrence|machine intervals|revalidation|\$\s*\d/i);
    if (i < 9) {
      const source = priorNine[i].projection;
      const presentation = source.consumer_presentation_proposal;
      assert.deepEqual(seasonalPresentation(row).details, presentation.details);
      assert.equal(row.address, presentation.directions.value);
      assert.deepEqual([row.lat, row.lon], [presentation.placement.latitude, presentation.placement.longitude]);
      assert.equal(row.seasonalListing.expiryBasis, source.lifecycle_for_audit_not_consumer_copy.basis);
      assert.equal(seasonalPresentation(row).confidence, presentation.confidence === "Good confidence" ? "good" : "limited");
    } else {
      const source = priorTwo[i-9].projection;
      assert.equal(row.address, source.address);
      assert.deepEqual([row.lat, row.lon], [source.lat, source.lon]);
      assert.deepEqual(row.seasonalAvailability.activeDates, source.valid_dates);
      assert.equal(row.seasonalListing.expiryBasis, "date-only");
      assert.equal(row.seasonalAvailability.endsAt, undefined);
      assert.equal(seasonalPresentation(row).confidence, "limited");
      assert.equal(seasonalPresentation(row).details.join(" "), `${source.details} Location is approximate.`);
    }
  }
});

for (const [i, row] of rows.entries()) {
  test(`${row.name}: independent exact cutoff ±1ms, no Open Now and no 2027 revival`, () => {
    const cutoff = Date.parse(cutoffs[i]);
    for (const time of [at, new Date(cutoff-1)]) {
      assert.equal(pool(row, [row], time).length, 1);
      assert.equal(pool(row, [row], time, { openNowOnly: true }).length, 0);
    }
    for (const time of [new Date(cutoff), new Date(cutoff+1), new Date("2027-10-16T20:00:00-05:00")]) {
      assert.equal(pool(row, [row], time).length, 0);
      assert.equal(pool(row, [row], time, { openNowOnly: true }).length, 0);
    }
    if (row.seasonalListing.expiryBasis === "exact") assert.equal(row.seasonalAvailability.endsAt, cutoffs[i]);
    else assert.equal(row.seasonalAvailability.endsAt, undefined, "Date-only retention is not a closing time");
  });

  test(`${row.name}: address navigation, approximate radius, favorites and exclusions`, () => {
    assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
    assert.equal(uberRideTarget(row).url, "https://m.uber.com/");
    assert.equal(pool({ ...row, lat: row.lat+0.04 }).length, 0);
    assert.equal(pool(row, [row], at, { favoritesOnly: true }).length, 0);
    assert.equal(pool(row, [row], at, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, 1);
    assert.equal(pool(row, [row], at, {}, { [row.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(row, [row], at, {}, {}, [{ restaurantId: row.id, expiresAt: at.getTime()+1000 }]).length, 0);
    for (const activityTypes of [["park"], ["museum"], ["movies"]]) assert.equal(pool(row, [row], at, { activityTypes }).length, 0);
    assert.equal(pool(row, [row], at, {}, {}, [], false).length, row.seasonalListing.recordId === "DELTA3-COBB" ? 1 : 0);
  });

  test(`${row.name}: provider duplicates, negative closure and cache merge preserve current policy`, () => {
    const provider = providerFor(row);
    for (const order of [[row, provider], [provider, row]]) {
      const merged = dedupeDateNight(order);
      assert.equal(merged.length, 1);
      assert.equal(merged[0].id, row.id);
      const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
      for (const places of [merged, cached.venues]) {
        assert.equal(places.length, 1);
        assert.equal(places[0].openingHours, null);
        assert.deepEqual(places[0].seasonalListing, row.seasonalListing);
        assert.equal(pool(row, places, at, { openNowOnly: true }).length, 0);
        assert.equal(pool(row, places, new Date(Date.parse(cutoffs[i])-1)).length, 1);
        assert.equal(pool(row, places, new Date(cutoffs[i])).length, 0);
      }
    }
    const negative = dedupeDateNight([row, { ...provider, lifecycle: "permanently-closed" }]);
    assert.equal(pool(row, negative).length, 0);
    const distinct = { ...row, id: "another-venue", name: "An unrelated attraction", seasonalListing: { ...row.seasonalListing, recordId: "different-record" } };
    assert.equal(dedupeDateNight([row, distinct]).length, 2);
  });

  test(`${row.name}: saved/current-ID snapshots and provider receipts reapply current policy`, t => {
    const store = new Map(), previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key,value) } });
    t.after(() => previous ? Object.defineProperty(globalThis,"localStorage",previous) : delete globalThis.localStorage);
    const stale = { ...row, lat: 0, lon: 0, openingHours: "24/7", seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined };
    const restored = decorateDateNight([stale], row, at)[0];
    assert.deepEqual([restored.lat,restored.lon], [row.lat,row.lon]);
    assert.deepEqual(restored.seasonalListing,row.seasonalListing);
    assert.equal(restored.isOpen,false);
    const provider = providerFor(row);
    assert.equal(resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name }), undefined);
    recordSeasonalIdentityReceipts(dedupeDateNight([provider,row]));
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
    const saved = resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name });
    assert.equal(saved.id,row.id);
    assert.equal(new URL(directionsUrl(saved)).searchParams.get("destination"),row.address);
    assert.equal(pool(row,[saved],new Date(cutoffs[i])).length,0);
    assert.equal(pool(row,[saved],new Date("2027-10-16T20:00:00-05:00")).length,0);
  });

  test(`${row.name}: actual search returns it after provider success or failure without leaking through season-off`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
    let outage=false;
    t.mock.method(globalThis,"fetch",async () => { if(outage) throw new Error("Explicit test provider outage");return Response.json({elements:[]}); });
    const query={lat:row.lat,lon:row.lon,radiusMiles:1,activityTypes:["anything"],spookySeasonEnabled:true};
    for(const failure of [false,true]) {
      outage=failure;
      const result=await searchDateNight({data:query});
      assert.ok(result.venues.some(place=>place.id===row.id));
      assert.ok(pool(row,result.venues).some(place=>place.id===row.id));
    }
    outage=false;
    const off=await searchDateNight({data:{...query,spookySeasonEnabled:false}});
    assert.equal(off.venues.some(place=>place.id===row.id),row.seasonalListing.recordId==="DELTA3-COBB");
  });
}

test("Nixa, Nightmare, Trepidations and Cobb preserve post-DST lifecycle while October-only records remain expired", () => {
  const surviving = ["DELTA3-COBB", "MO26-037", "DELTA2-MISSOURI-NIGHTMARE", "DELTA2-TREPIDATIONS"];
  for (const time of [new Date("2026-11-01T01:30:00-05:00"), new Date("2026-11-01T01:30:00-06:00")]) {
    for (const row of rows) assert.equal(pool(row,[row],time).length, surviving.includes(row.seasonalListing.recordId) ? 1 : 0);
  }
});

test("reviewed taxonomy, explicit-date subsets and separate Myers identities are preserved", () => {
  const by = Object.fromEntries(rows.map(row=>[row.seasonalListing.recordId,row]));
  assert.deepEqual(by["DELTA2-BRANSON-GHOSTER"].activityTypes,["other-halloween-fall"]);
  assert.deepEqual(by["MO26-056"].activityTypes,["corn-maze"]);
  assert.deepEqual(by["DELTA3-RANCH"].activityTypes,["haunted-house","corn-maze"]);
  assert.deepEqual(by["DELTA3-FREAKS"].seasonalAvailability.activeDates,["2026-10-23","2026-10-24","2026-10-30","2026-10-31"]);
  assert.equal(by["DELTA3-RANCH"].seasonalAvailability.activeDates,undefined);
  assert.equal(by["DELTA2-MISSOURI-NIGHTMARE"].seasonalAvailability.activeDates,undefined);
  assert.equal(by["MO26-005"].seasonalListing.hours.state,"unknown");
  assert.equal(by["MO26-027"].seasonalListing.hours.state,"partial");
  const inn=priorCatalogs.find(row=>row.seasonalListing.recordId==="MO26-003");
  const forest=by["MO26-005"];
  assert.ok(inn,"Existing Myer Inn fixture must resolve");
  assert.equal(dedupeDateNight([inn,forest]).length,2);
});
