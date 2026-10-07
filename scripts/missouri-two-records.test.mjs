import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_CLEARED_SEASONAL_CATALOG: records } = load("src/lib/date-night/missouri-2026-cleared-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { mergeIdentity } = load("src/lib/date-night/identity.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { dateNightChipsForNow } = load("src/lib/date-night/season.ts");
const { getDateNightIcon } = load("src/lib/date-night/icons.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { normalizeDateNightActivityTypes } = load("src/lib/date-night/query-plan.ts");
const at = new Date("2026-10-10T17:00:00Z");
function pool(row, date = at, openNowOnly = false, active = true) {
  return eligibleDateNight(decorateDateNight([row], row, date), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, openNowOnly }, active, {}, [], date.getTime());
}
test("exact two-record whitelist, qualified facts and immutable 2026 bounds", () => {
 assert.equal(records.length, 2);
 const [lloyd, sam] = records;
 assert.deepEqual(lloyd.activityTypes, ["corn-maze", "pumpkin-patch"]);
 assert.equal(lloyd.seasonalAvailability.activeDates.length, 11);
 assert.equal(lloyd.seasonalAvailability.endsAt, "2026-10-31T16:00:00-05:00");
 assert.deepEqual(sam.activityTypes, ["other-halloween-fall"]);
 assert.deepEqual(sam.seasonalAvailability.activeDates, ["2026-10-31"]);
 assert.equal(sam.seasonalAvailability.endsAt, "2026-10-31T18:00:00-05:00");
 const l = lloyd.seasonalVisitNotes.join(" "), s = sam.seasonalVisitNotes.join(" ");
 for (const word of ["younger than 18", "$1.20", "nonrefundable", "pumpkins extra", "10:00–16:00", "hayride", "Approximate", "24 hours"]) assert.ok(l.toLowerCase().includes(word.toLowerCase()), word);
 for (const word of ["14:00–16:00", "14:00–17:00", "15:00–18:00", "Shelter 1", "48 hours"]) assert.ok(s.includes(word), word);
 assert.doesNotMatch(s, /craft/i);
 for (const row of records) assert.equal(row.openingHours, null);
});
test("Other is seasonal, included in Anything, own label and temporary existing icon", () => {
 assert.ok(normalizeDateNightActivityTypes(["anything"], true).includes("other-halloween-fall"));
 assert.ok(!normalizeDateNightActivityTypes(["anything"], false).includes("other-halloween-fall"));
 assert.ok(dateNightChipsForNow(true, at).some(c => c.id === "other-halloween-fall" && c.label === "Other Halloween / Fall"));
 assert.ok(!dateNightChipsForNow(false, at).some(c => c.id === "other-halloween-fall"));
 for (const halloween of [false,true]) assert.equal(getDateNightIcon({ activityTypes:["other-halloween-fall"], halloween }),getDateNightIcon({ activityTypes:["haunted-house"], halloween }));
});
test("never Open Now, no 2027 rollover, activity cutoff rather than archive, Chicago dates", () => {
 for (const row of records) {
  assert.equal(pool(row).length, 1);
  assert.equal(pool(row,at,true).length,0);
  assert.equal(pool(row,at,false,false).length,0);
  const end=Date.parse(row.seasonalAvailability.endsAt);
  assert.equal(pool(row,new Date(end-1)).length,1);
  for (const date of [new Date(end),new Date("2026-11-01T01:00:00Z"),new Date("2027-10-10T18:00:00Z")]) assert.equal(pool(row,date).length,0);
  const chicagoPreviousDay=new Date("2026-10-31T02:00:00Z");
  assert.notEqual(decorateDateNight([row],row,chicagoPreviousDay)[0].availability.status,"open-now");
 }
});
test("live duplicate cannot invent opening hours, erase expiry, arrival or restrictions", () => {
 for (const row of records) for (const reverse of [false,true]) {
  const live={...row,id:"date-night-osm-node-999",source:"osm",openingHours:"24/7",seasonalAvailability:undefined,seasonalVisitNotes:undefined};
  const merged=reverse?mergeIdentity(live,row):mergeIdentity(row,live);
  assert.equal(merged.openingHours,null);
  assert.deepEqual(merged.seasonalAvailability,row.seasonalAvailability);
  assert.deepEqual(merged.seasonalVisitNotes,row.seasonalVisitNotes);
  assert.equal(pool(merged,at,true).length,0);
  assert.equal(pool(merged,new Date("2027-10-10T18:00:00Z")).length,0);
  const dest=new URL(directionsUrl(merged)).searchParams.get("destination");
  assert.equal(dest,`${row.lat},${row.lon}`);
 }
});
test("real handler finds only the two regional additions; Other makes zero provider requests", async(t)=>{
 t.mock.timers.enable({apis:["Date"],now:at.getTime()});
 let calls=0;t.mock.method(globalThis,"fetch",async()=>{calls++;return Response.json({elements:[]});});
 for(const row of records){
  const response=await searchDateNight({data:{lat:row.lat,lon:row.lon,radiusMiles:15,activityTypes:row.activityTypes,spookySeasonEnabled:true}});
  assert.ok(response.venues.some(p=>p.id===row.id));
 }
 const before=calls;
 await searchDateNight({data:{lat:records[1].lat,lon:records[1].lon,radiusMiles:15,activityTypes:["other-halloween-fall"],spookySeasonEnabled:true}});
 assert.equal(calls,before);
});

for (const row of records) test(`actual component keeps ${row.id} qualified through options, pick, Open Now and expiry`, async(t)=>{
 const {dateNightComponentHarness,textOf}=await import("./test-support/date-night-component-harness.mjs");
 t.mock.timers.enable({apis:["Date"],now:at.getTime()});
 const prior=Object.getOwnPropertyDescriptor(globalThis,"document");
 Object.defineProperty(globalThis,"document",{configurable:true,value:{body:{},documentElement:{classList:{contains:()=>true}}}});
 t.after(()=>{if(prior)Object.defineProperty(globalThis,"document",prior);else delete globalThis.document;});
 const store={location:{...row,label:row.name,source:"manual"},preferences:{},exclusions:[],sessionShown:[],dateNightFilters:{...DEFAULT_DATE_NIGHT_FILTERS,openNowOnly:false},spookySeasonEnabled:true,theme:"dark",markShown(){},excludeTonight(){},setDateNightFilters(patch){this.dateNightFilters={...this.dateNightFilters,...patch};}};
 const clock={value:at};
 const harness=dateNightComponentHarness({store,now:clock,search:async()=>({venues:[row],source:"merged"})});
 t.after(()=>harness.dispose());harness.render();let tree=await harness.settle();
 assert.match(textOf(tree),/1 activities match/);
 harness.button(tree,"Give us options").props.onClick();tree=harness.render();
 assert.ok(harness.html(tree).includes(row.seasonalVisitNotes[0]));
 harness.button(tree,"Pick our date").props.onClick();tree=harness.render();
 assert.equal(harness.overlay(tree,"ResultOverlay").props.restaurant.id,row.id);
 assert.ok(harness.html(tree).includes(row.seasonalVisitNotes.at(-1)));
 store.dateNightFilters.openNowOnly=true;tree=harness.render();
 assert.match(textOf(tree),/0 activities match/);assert.equal(harness.overlay(tree,"ResultOverlay"),null);assert.equal(harness.overlay(tree,"OptionsOverlay"),null);
 store.dateNightFilters.openNowOnly=false;tree=harness.render();assert.match(textOf(tree),/1 activities match/);
 clock.value=new Date(row.seasonalAvailability.endsAt);tree=harness.render();assert.match(textOf(tree),/0 activities match/);
 clock.value=new Date("2027-10-10T18:00:00Z");tree=harness.render();assert.match(textOf(tree),/0 activities match/);
});
