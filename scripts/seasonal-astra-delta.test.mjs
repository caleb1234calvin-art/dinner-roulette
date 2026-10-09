import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_ASTRA_DELTA_CATALOG: rows } = load("src/lib/date-night/missouri-2026-astra-delta-catalog.ts");
const { MISSOURI_2026_ASTRA_ELEVEN_CATALOG: eleven } = load("src/lib/date-night/missouri-2026-astra-eleven-catalog.ts");
const { MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG: commercial } = load("src/lib/date-night/missouri-2026-astra-commercial-catalog.ts");
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
const ids = ["DELTA6-WORLDS-OF-FUN","DELTA2-OZARK","DELTA3-BALLWIN","DELTA6-OFALLON","DELTA3-GROTTO"];
const cutoffs = ["2026-11-01T00:00:00-05:00","2026-11-01T00:00:00-05:00","2026-10-24T21:30:00-05:00","2026-10-24T21:30:00-05:00","2026-10-31T22:00:00-05:00"];
const providerFor = row => ({...row,id:`date-night-osm-node-${rows.indexOf(row)+902100}`,source:"osm",openingHours:"24/7",seasonalAvailability:undefined,seasonalListing:undefined,seasonalVisitNotes:undefined});

test("delta subset contains exactly independently cleared5 and no unresolved neighboring hold",()=>{
  assert.deepEqual(rows.map(row=>row.seasonalListing.recordId),ids);
  assert.equal(new Set([...eleven,...commercial,...rows].map(row=>row.id)).size,20);
  for(const row of rows){
    assert.equal(getCuratedSeasonalPlace(row.id),row);
    assert.equal(row.openingHours,null);
    assert.equal(row.seasonalAvailability.openNowPolicy,"never");
    assert.equal(row.seasonalListing.visibility,undefined);
    assert.equal(row.seasonalListing.seasonYear,2026);
    assert.equal(seasonalPresentation(row).confidence,"limited");
  }
});
const normalized = value => value.replace(/\\u(2013|2014|2019)/g,(_,hex)=>String.fromCharCode(parseInt(hex,16)));
test("five runtime projections bind exact independently approved fields and reviewed visitor copy",()=>{
 const research=JSON.parse(readFileSync("audit/astra-delta-2026-10-09/Delta6-Independent-Final-R2.json","utf8")).records;
 for(const [i,row] of rows.entries()){
  const source=research[i];
  assert.equal(row.name,normalized(source.name));
  assert.equal(row.address,normalized(source.visitorAddress));
  assert.deepEqual([row.lat,row.lon],[source.placement.lat,source.placement.lon]);
  assert.deepEqual(row.seasonalAvailability.activeDates,source.exactActiveDates);
  assert.equal(row.seasonalListing.listingExpiresAt,cutoffs[i]);
  assert.equal(row.seasonalListing.listingExpiresAt,source.listingExpiresAt);
  assert.equal(row.seasonalListing.hours.state,source.fields.hours.value.state);
  assert.equal(row.seasonalListing.hours.displayText,normalized(source.fields.hours.value.displayText));
  assert.equal(row.phone,source.fields.phone?.value??null);
  assert.deepEqual(seasonalPresentation(row).details,source.consumerDetailsProposal.map(normalized));
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
test("Worlds dates exclude the passholder-only October29 event and never use park hours",()=>{
 const worlds=rows[0];assert.equal(worlds.seasonalAvailability.activeDates.length,11);assert.ok(!worlds.seasonalAvailability.activeDates.includes("2026-10-29"));
 assert.equal(worlds.seasonalAvailability.endsAt,undefined);
 assert.equal(worlds.seasonalListing.expiryBasis,"date-only");
 const details=seasonalPresentation(worlds).details.join(" ");assert.match(details,/17 and younger/);assert.match(details,/21 or older/);assert.match(details,/five minors per chaperone/);assert.match(details,/No re-entry after 6 p.m./);
 assert.doesNotMatch(details,/noon|midnight|6 p.m.–/);
});
test("Ozark retains unknown hours without stale 11pm or inferred operating intervals",()=>{
 const ozark=rows[1];assert.equal(ozark.seasonalListing.hours.state,"unknown");assert.equal(ozark.seasonalAvailability.activeDates.length,12);assert.equal(ozark.seasonalAvailability.endsAt,undefined);
 assert.match(seasonalPresentation(ozark).details.join(" "),/Check the operator for nightly hours and admission/);assert.doesNotMatch(ozark.seasonalListing.hours.displayText,/11/);
});
test("Tommy's locations remain separate vehicle experiences with independently bound destinations",()=>{
 const [ballwin,ofallon]=rows.slice(2,4);assert.deepEqual(JSON.parse(JSON.stringify(dedupeDateNight([ballwin,ofallon]))),JSON.parse(JSON.stringify([ballwin,ofallon])));
 for(const row of [ballwin,ofallon]){
  assert.deepEqual(row.activityTypes,["other-halloween-fall"]);
  assert.deepEqual(row.seasonalAvailability.activeDates,["2026-10-23","2026-10-24"]);
  assert.match(seasonalPresentation(row).details[0],/Haunted car wash/);
  assert.match(seasonalPresentation(row).details[1],/vehicle rules/);
  assert.equal(pool(row,[row],at,{activityTypes:["haunted-house"]}).length,0);
  assert.equal(pool(row,[row],at,{activityTypes:["other-halloween-fall"]}).length,1);
  assert.equal(uberRideTarget(row).url,"https://m.uber.com/");
 }
 assert.match(ballwin.address,/14918 Manchester Road, Ballwin/);assert.match(ofallon.address,/101 Fallon Loop Road, O’Fallon/);
});
test("Grotto keeps operator October dates and correct address-derived point without feed contamination",()=>{
 const grotto=rows[4];assert.equal(grotto.seasonalAvailability.activeDates.length,8);
 assert.equal(grotto.seasonalAvailability.activeDates[0],"2026-10-09");
 assert.deepEqual([grotto.lat,grotto.lon],[36.7950117,-90.4314449]);
 assert.equal(grotto.address,"3102 Aad Grotto Road, Poplar Bluff, MO 63901");
 assert.match(grotto.seasonalListing.placement.sourceUrl,/waze/);
 assert.doesNotMatch(seasonalPresentation(grotto).details.join(" "),/1097|September|\$20/);
});
