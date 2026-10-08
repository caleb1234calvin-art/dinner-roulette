import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load=appModuleLoader();
const {MISSOURI_2026_V1_SEASONAL_CATALOG:rows,MISSOURI_2026_V1_LISTINGS:registry}=load("src/lib/date-night/missouri-2026-v1-catalog.ts");
const {decorateDateNight,eligibleDateNight}=load("src/lib/date-night/eligibility.ts");
const {DEFAULT_DATE_NIGHT_FILTERS}=load("src/lib/date-night/types.ts");
const {mergeDateNight,mergeIdentity,dedupeDateNight}=load("src/lib/date-night/identity.ts");
const {directionsUrl}=load("src/lib/location/maps.ts");
const {uberRideTarget}=load("src/lib/location/ride-target.ts");
const {seasonalListingToPlace,isApproximateSeasonalPlace}=load("src/lib/date-night/listing.ts");
const {getDateNightAvailability}=load("src/lib/date-night/availability.ts");
const {combineDateNightDiscovery}=load("src/lib/date-night/cache.ts");
const {clipDateNightRadius}=load("src/lib/date-night/radial-cache.ts");
const {searchDateNight}=load("src/lib/date-night/search.ts");
const at=new Date("2026-10-10T20:00:00Z");
const pool=(places,now=at,filters={},active=true,preferences={},exclusions=[])=>eligibleDateNight(decorateDateNight(places,places[0]??rows[0],now),{...DEFAULT_DATE_NIGHT_FILTERS,radiusMiles:50,openNowOnly:false,...filters},active,preferences,exclusions,now.getTime());
const fixture=(row=rows[0])=>({...structuredClone(row),id:"fixture-unregistered"});

test("V1 only the exact five authorized reviewed projections enter the adapter",()=>{
 assert.deepEqual(rows.map(r=>r.seasonalListing.recordId),["MO26-003","MO26-010","MO26-011","MO26-029","MO26-030"]);
 const audit=JSON.parse(readFileSync("audit/seasonal-completeness-v1-five-record-import.json"));
 assert.equal(audit.reviewedSourceSha256,"76896ea4131f68927b7287eb46cda1d25b8993dd28527b0a2d072a72ef9ef1a6");
 for(const row of rows){
  assert.equal(row.openingHours,null);assert.equal(row.priceLevel,null);
  assert.equal(row.seasonalAvailability.openNowPolicy,"never");assert.equal(row.seasonalListing.seasonYear,2026);
  assert.ok(isApproximateSeasonalPlace(row));assert.ok(row.seasonalListing.placement.sourceUrl);
  assert.deepEqual(registry.find(r=>r.id===row.id).seasonalListing,row.seasonalListing);
  const source=audit.records.find(r=>r.venue_id===row.seasonalListing.recordId).corrected_projection;
  assert.equal(row.address,source.visitor_address??source.visitorAddress.text);
  assert.equal(row.seasonalListing.listingExpiresAt,source.lifecycle.listing_expires_at??source.lifecycle.listingExpiresAt);
 }
});
for(const row of rows)test(`V1 ${row.id}: ordinary picking, navigation, expiry and preferences`,()=>{
 assert.equal(pool([row]).length,1);assert.equal(pool([row],at,{openNowOnly:true}).length,0);
 assert.equal(pool([row],at,{},false).length,0);
 assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"),row.address);
 assert.deepEqual(uberRideTarget(row),{url:"https://m.uber.com/",ariaLabel:"Open Uber; choose your destination in the external service"});
 assert.equal(pool([row],at,{favoritesOnly:true}).length,0);
 assert.equal(pool([row],at,{favoritesOnly:true},true,{[row.id]:{favorite:true}}).length,1);
 assert.equal(pool([row],at,{},true,{[row.id]:{neverRecommend:true}}).length,0);
 assert.equal(pool([row],at,{},true,{},[{restaurantId:row.id,expiresAt:at.getTime()+1000}]).length,0);
 const end=Date.parse(row.seasonalListing.listingExpiresAt);
 assert.equal(pool([row],new Date(end-1)).length,1);
 for(const instant of [end,end+60000,Date.parse("2027-10-10T20:00:00Z")]){
  assert.equal(pool([row],new Date(instant)).length,0);assert.equal(pool([row],new Date(instant),{openNowOnly:true}).length,0);
 }
 assert.equal(clipDateNightRadius([row],{...row,radiusMiles:1}).length,1);
 assert.equal(clipDateNightRadius([row],{lat:row.lat+1,lon:row.lon,radiusMiles:1}).length,0);
});
for(const state of ["unknown","partial","verified"])test(`V1 ${state} hours never inherit machine Open Now, even 24/7`,()=>{
 const row=fixture();row.seasonalListing.hours={state};row.openingHours="24/7";row.seasonalAvailability.openNowPolicy=undefined;
 assert.equal(pool([row]).length,1);assert.equal(pool([row],at,{openNowOnly:true}).length,0);
 assert.equal(getDateNightAvailability({...row,hoursKnown:true,isOpen:true},at).openNowEligible,false);
});
test("V1 exact/date-only/editorial cutoff and malformed/year guards fail closed",()=>{
 for(const basis of ["exact","date-only","editorial"]){
  const row=fixture();row.seasonalListing.expiryBasis=basis;row.seasonalListing.listingExpiresAt="2026-11-03T00:00:00-06:00";
  row.seasonalAvailability={status:"unconfirmed",checkedAt:"2026-10-08",timeZone:"America/Chicago",seasonYear:2026};
  assert.equal(pool([row],new Date("2026-11-03T05:59:59Z")).length,1);
  assert.equal(pool([row],new Date("2026-11-03T06:00:00Z")).length,0);
  assert.equal(pool([row],new Date("2027-10-10T20:00:00Z")).length,0);
 }
 for(const invalid of ["not-a-date","2026-11-01",""]){const row=fixture();row.seasonalListing.listingExpiresAt=invalid;assert.equal(pool([row]).length,0);}
 const overEditorial=fixture();overEditorial.seasonalListing.expiryBasis="editorial";overEditorial.seasonalListing.listingExpiresAt="2026-11-04T00:00:00-06:00";assert.equal(pool([overEditorial]).length,0);
 const badZone=fixture();badZone.seasonalListing.timeZone="Invalid/Zone";assert.equal(pool([badZone]).length,0);
 const badDay=fixture();badDay.seasonalAvailability.activeUntil="2026-02-31";assert.equal(pool([badDay]).length,0);
 const missingCalendar=fixture();delete missingCalendar.seasonalAvailability;assert.equal(pool([missingCalendar],new Date("2027-10-10T20:00:00Z")).length,0);
});
test("V1 factually cleared address-only is staged outside all radius math",()=>{
 for(const placement of [null,{...registry[0].seasonalListing.placement,lat:NaN},{...registry[0].seasonalListing.placement,lon:181}]){
  const record=structuredClone(registry[0]);record.seasonalListing.placement=placement;
  assert.equal(seasonalListingToPlace(record),null);
  const unregistered={...record,id:"address-only-fixture",lat:0,lon:0};
  assert.equal(decorateDateNight([unregistered],rows[0],at).length,0);
  assert.equal(clipDateNightRadius([unregistered],{lat:0,lon:0,radiusMiles:50}).length,0);
  assert.equal(new URL(directionsUrl(unregistered)).searchParams.get("destination"),record.address);
  assert.equal(uberRideTarget(unregistered).url,"https://m.uber.com/");
 }
});
for(const row of rows)test(`V1 ${row.id}: duplicate/cache order preserves policy and negative evidence`,()=>{
 const live={...row,id:"date-night-osm-node-99",source:"osm",openingHours:"24/7",seasonalListing:undefined,seasonalAvailability:undefined,seasonalVisitNotes:undefined};
 for(const order of [[row,live],[live,row]]){
  const merged=dedupeDateNight(order);assert.equal(merged.length,1);assert.equal(merged[0].id,row.id);
  assert.deepEqual(merged[0].seasonalListing,row.seasonalListing);assert.equal(merged[0].openingHours,null);
  assert.equal(pool(merged,at,{openNowOnly:true}).length,0);
  const cached=combineDateNightDiscovery({response:{venues:[order[0]],source:"merged"},missingActivityTypes:[]},{venues:[order[1]],source:"live"});
  assert.equal(cached.venues.length,1);assert.equal(pool(cached.venues,at,{openNowOnly:true}).length,0);
  assert.equal(pool(cached.venues,new Date(row.seasonalListing.listingExpiresAt)).length,0);
  assert.equal(pool([mergeIdentity(order[0],{...order[1],lifecycle:"permanently-closed"})]).length,0);
 }
 const stranger={...live,name:"Different visitor attraction",id:"date-night-osm-node-other"};
 assert.equal(dedupeDateNight([row,stranger]).length,2);assert.equal(dedupeDateNight([stranger,row]).length,2);
 assert.equal(mergeDateNight([stranger],[row]).length,2);
 const substring={...stranger,name:row.name+" separate kids event"};assert.equal(dedupeDateNight([row,substring]).length,2);assert.equal(mergeDateNight([substring],[row]).length,2);
});
test("V1 shared approximate geometry and activity do not merge distinct curated identities",()=>{
 const a=fixture(rows[0]),b={...fixture(rows[1]),id:"distinct-fixture",lat:a.lat,lon:a.lon};
 for(const order of [[a,b],[b,a]])assert.equal(dedupeDateNight(order).length,2);
 const verified={...b,seasonalListing:{...b.seasonalListing,placement:{...b.seasonalListing.placement,basis:"verified-arrival"}}};
 assert.equal(dedupeDateNight([a,verified]).length,2);assert.equal(dedupeDateNight([verified,a]).length,2);
});
test("V1 Myer legacy cached ID is rehydrated without restoring trusted entrance assumptions",()=>{
 const myer=rows[0],stale={...myer,lat:37,lon:-94,openingHours:"24/7",seasonalListing:undefined,seasonalAvailability:undefined,seasonalVisitNotes:undefined};
 const resumed=decorateDateNight([stale],myer,at)[0];
 assert.equal(resumed.lat,myer.lat);assert.equal(resumed.lon,myer.lon);assert.equal(resumed.isOpen,false);
 assert.deepEqual(resumed.seasonalListing,myer.seasonalListing);
 assert.equal(pool([stale],new Date("2027-10-10T20:00:00Z")).length,0);
 const old=load("src/lib/date-night/seasonal-catalog.ts").JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG;
 assert.ok(!old.some(r=>r.id===myer.id));
});
test("V1 material facts remain qualified, no generated machine last-admission or generic hours",()=>{
 const notes=id=>rows.find(r=>r.seasonalListing.recordId===id).seasonalVisitNotes.join(" ");
 assert.match(notes("MO26-029"),/21:00/);assert.match(notes("MO26-029"),/one hour before closing/);assert.match(notes("MO26-029"),/Last-admission time remains unknown/);
 assert.match(notes("MO26-030"),/65802/);assert.match(notes("MO26-030"),/65807/);assert.match(notes("MO26-030"),/closed Mondays/);assert.match(notes("MO26-030"),/accompanying adult/);
 for(const id of ["MO26-010","MO26-011"]){for(const fact of [/18:00/,/19:30/,/23:30/,/00:30/,/Final exit/,/No costumes/,/not wheelchair accessible/])assert.match(notes(id),fact);}
});
test("V1 real provider failure keeps bounded five catalogs browseable without provider health claims",async t=>{
 t.mock.timers.enable({apis:["Date"],now:at.getTime()});
 t.mock.method(globalThis,"fetch",async()=>Response.json({elements:[]},{status:503}));
 for(const row of rows){const result=await searchDateNight({data:{...row,radiusMiles:1,activityTypes:row.activityTypes,spookySeasonEnabled:true}});assert.ok(result.venues.some(p=>p.id===row.id));assert.equal(result.source,"fallback");}
});
