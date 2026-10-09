import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG: rows } = load("src/lib/date-night/missouri-2026-astra-commercial-catalog.ts");
const { MISSOURI_2026_ASTRA_ELEVEN_CATALOG: eleven } = load("src/lib/date-night/missouri-2026-astra-eleven-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { seasonalPresentation } = load("src/lib/date-night/seasonal-presentation.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds } = load("src/lib/date-night/identity-receipts.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-16T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], halloween = true) => eligibleDateNight(
  decorateDateNight(places,row,now),{...DEFAULT_DATE_NIGHT_FILTERS,radiusMiles:1,activityTypes:["anything"],openNowOnly:false,...filters},halloween,preferences,exclusions,now.getTime());
const ids = ["MO26-002","DELTA2-SHEPHERD-LANTERN","DELTA2-HOLLOWS","MO26-039"];
const cutoffs = ["2026-10-31T22:00:00-05:00","2026-10-17T22:00:00-05:00","2026-10-30T23:00:00-05:00","2026-11-01T21:00:00-06:00"];
const providerFor = row => ({...row,id:`date-night-osm-node-${rows.indexOf(row)+901100}`,source:"osm",openingHours:"24/7",seasonalAvailability:undefined,seasonalListing:undefined,seasonalVisitNotes:undefined});

test("commercial subset contains exactly independently cleared4 and no unresolved neighboring hold",()=>{
  assert.deepEqual(rows.map(row=>row.seasonalListing.recordId),ids);
  assert.equal(new Set([...eleven,...rows].map(row=>row.id)).size,15);
  for(const row of rows){
    assert.equal(getCuratedSeasonalPlace(row.id),row);
    assert.equal(row.openingHours,null);
    assert.equal(row.seasonalAvailability.openNowPolicy,"never");
    assert.equal(row.seasonalListing.visibility,undefined);
    assert.equal(row.seasonalListing.seasonYear,2026);
    assert.equal(seasonalPresentation(row).confidence,"limited");
  }
});
test("four runtime projections bind exact independently approved fields and normalized visitor copy",()=>{
  const research=[...JSON.parse(readFileSync("audit/astra-commercial-2026-10-09/Commercial-Holds-Independent-Eligible-R1.json","utf8")).records,...JSON.parse(readFileSync("audit/astra-commercial-2026-10-09/Commercial-Feemster-Independent-Eligible-R2.json","utf8")).records];
  for(const [i,row] of rows.entries()){
    const source=research[i].projection;
    assert.equal(row.address,source.address);
    assert.deepEqual([row.lat,row.lon],[source.lat,source.lon]);
    assert.deepEqual(row.activityTypes,source.activityTypes);
    assert.deepEqual(row.seasonalAvailability.activeDates,source.valid_dates);
    assert.equal(row.seasonalListing.listingExpiresAt,cutoffs[i]);
    assert.equal(row.seasonalListing.listingExpiresAt,source.expires_at);
    if(i>=2)assert.equal(row.phone,research[i].fields.phone.value);
    assert.equal(seasonalPresentation(row).details.join(" "),source.details.replaceAll("\\u2013","–")+" Location is approximate.");
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "),/\\u[0-9a-f]{4}|audit|runtime|recurrence|machine intervals/i);
  }
});
for(const [i,row] of rows.entries()){
 test(`${row.name}: hard cutoff ±1ms, never Open Now, 2027 non-revival`,()=>{
  const cutoff=Date.parse(cutoffs[i]);
  for(const now of [at,new Date(cutoff-1)]){
   assert.equal(pool(row,[row],now).length,1);
   assert.equal(pool(row,[row],now,{openNowOnly:true}).length,0);
  }
  for(const now of [new Date(cutoff),new Date(cutoff+1),new Date("2027-10-16T20:00:00-05:00")])assert.equal(pool(row,[row],now).length,0);
 });
 test(`${row.name}: address navigation, approximate radius and preference rules`,()=>{
  assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"),row.address);
  assert.equal(uberRideTarget(row).url,"https://m.uber.com/");
  assert.equal(pool({...row,lat:row.lat+0.04},[row]).length,0);
  assert.equal(pool(row,[row],at,{favoritesOnly:true}).length,0);
  assert.equal(pool(row,[row],at,{favoritesOnly:true},{[row.id]:{favorite:true}}).length,1);
  assert.equal(pool(row,[row],at,{},{[row.id]:{neverRecommend:true}}).length,0);
  assert.equal(pool(row,[row],at,{},{},[{restaurantId:row.id,expiresAt:at.getTime()+1}]).length,0);
  assert.equal(pool(row,[row],at,{},{},[],false).length,0);
  for(const activityTypes of [["park"],["museum"],["movies"]])assert.equal(pool(row,[row],at,{activityTypes}).length,0);
 });
 test(`${row.name}: provider 24/7 duplicate and negative closure cannot overwrite curated policy`,()=>{
  const provider=providerFor(row);
  for(const order of [[row,provider],[provider,row]]){
   const merged=dedupeDateNight(order);
   assert.equal(merged.length,1);assert.equal(merged[0].id,row.id);
   const cached=combineDateNightDiscovery({response:{venues:[order[0]],source:"merged"},missingActivityTypes:[]},{venues:[order[1]],source:"live"});
   for(const places of [merged,cached.venues]){
    assert.deepEqual(places[0].seasonalListing,row.seasonalListing);
    assert.equal(places[0].openingHours,null);
    assert.equal(pool(row,places,at,{openNowOnly:true}).length,0);
    assert.equal(pool(row,places,new Date(cutoffs[i])).length,0);
   }
  }
  assert.equal(pool(row,dedupeDateNight([row,{...provider,lifecycle:"permanently-closed"}])).length,0);
 });
 test(`${row.name}: saved receipts and stale current IDs rehydrate current destination/lifecycle`,t=>{
  const store=new Map(),previous=Object.getOwnPropertyDescriptor(globalThis,"localStorage");
  Object.defineProperty(globalThis,"localStorage",{configurable:true,value:{getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)}});
  t.after(()=>previous?Object.defineProperty(globalThis,"localStorage",previous):delete globalThis.localStorage);
  const stale={...row,lat:0,lon:0,openingHours:"24/7",seasonalListing:undefined,seasonalAvailability:undefined};
  const restored=decorateDateNight([stale],row,at)[0];
  assert.deepEqual([restored.lat,restored.lon],[row.lat,row.lon]);
  assert.deepEqual(restored.seasonalListing,row.seasonalListing);
  assert.equal(restored.isOpen,false);
  const provider=providerFor(row);recordSeasonalIdentityReceipts(dedupeDateNight([provider,row]));
  assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
  const saved=resolveSavedSeasonalPlace({restaurantId:provider.id,name:row.name});
  assert.equal(saved.id,row.id);
  assert.equal(new URL(directionsUrl(saved)).searchParams.get("destination"),row.address);
  assert.equal(pool(row,[saved],new Date(cutoffs[i])).length,0);
 });
 test(`${row.name}: real provider success/fallback search and season-off`,async t=>{
  t.mock.timers.enable({apis:["Date"],now:at.getTime()});let outage=false;
  t.mock.method(globalThis,"fetch",async()=>{if(outage)throw new Error("Controlled provider outage");return Response.json({elements:[]});});
  const query={lat:row.lat,lon:row.lon,radiusMiles:1,activityTypes:["anything"],spookySeasonEnabled:true};
  for(const failure of [false,true]){outage=failure;const response=await searchDateNight({data:query});assert.ok(response.venues.some(place=>place.id===row.id));assert.ok(pool(row,response.venues).some(place=>place.id===row.id));}
  outage=false;const off=await searchDateNight({data:{...query,spookySeasonEnabled:false}});assert.ok(!off.venues.some(place=>place.id===row.id));
 });
}
test("Aurora last-admission cutoff is not encoded as final-exit time",()=>{
 const aurora=rows[0];assert.equal(aurora.seasonalAvailability.endsAt,undefined);
 assert.match(seasonalPresentation(aurora).details.join(" "),/last-admission times; final exit is not specified/);
 assert.equal(aurora.seasonalListing.directionsTarget.address,"20591 County Road 2200, Aurora, MO 65605");
});
test("Hollows stays a four-date subset and ignores conflicting generic schema hours",()=>{
 const hollows=rows[2];assert.deepEqual(hollows.seasonalAvailability.activeDates,["2026-10-09","2026-10-10","2026-10-24","2026-10-30"]);
 assert.match(seasonalPresentation(hollows).details.join(" "),/Confirmed ticket dates/);
 assert.doesNotMatch(hollows.seasonalListing.hours.displayText,/00:30|04:00/);
 const unlisted=decorateDateNight([hollows],hollows,new Date("2026-10-11T21:00:00-05:00"))[0];
 assert.equal(unlisted.availability.status,"closed-now");assert.equal(unlisted.isOpen,false);
 assert.equal(decorateDateNight([hollows],hollows,new Date("2026-10-17T21:00:00-05:00"))[0].availability.status,"schedule-unconfirmed");
 assert.equal(pool(hollows,[hollows],new Date("2026-10-31T12:00:00-05:00")).length,0);
});
test("Feemster retains East-address placement, no pumpkin claim, last tickets and DST expiry",()=>{
 const feemster=rows[3];assert.deepEqual(feemster.activityTypes,["corn-maze"]);
 assert.match(feemster.address,/2501 E Farm Road 94/);assert.deepEqual([feemster.lat,feemster.lon],[37.273100307742,-93.24361332435]);
 const details=seasonalPresentation(feemster).details.join(" ");assert.match(details,/Last tickets are sold one hour before closing/);assert.match(details,/includes service animals/);assert.match(details,/stop at sunset/);
 for(const time of ["2026-11-01T01:30:00-05:00","2026-11-01T01:30:00-06:00","2026-11-01T20:59:59-06:00"])assert.equal(pool(feemster,[feemster],new Date(time)).length,1);
 assert.equal(pool(feemster,[feemster],new Date("2026-11-01T21:00:00-06:00")).length,0);
});
