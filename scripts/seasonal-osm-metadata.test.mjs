import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { adaptOsmSeasonalMetadata } from "./seasonal-osm-metadata.mjs";

const place = (id, tags, position = {lat:37.1, lon:-94.5}) =>
  ({ type:"node", id, ...position, tags });

test("mapped haunt produces only a held metadata lead without dates or Open Now", () => {
  const r=adaptOsmSeasonalMetadata({elements:[place(123,{name:"Mock Haunt",attraction:"haunted_house",
    "addr:housenumber":"1","addr:street":"Example St","addr:city":"Joplin","addr:state":"MO"})]});
  assert.equal(r.status,"metadata-proposals-only");
  assert.equal(r.proposals.length,1);
  const p=r.proposals[0];
  assert.equal(p.osm.elementUrl,"https://www.openstreetmap.org/node/123");
  assert.deepEqual(p.activityHints,["haunted-house"]);
  assert.equal(p.proposedAddress,"1 Example St, Joplin, MO");
  assert.equal(p.startDate,null);
  assert.equal(p.openNowEligible,false);
  assert.equal(p.publishable,false);
  assert.equal(p.verified,false);
  assert.equal(p.year2026Verified,false);
  assert.equal(p.license.identifier,"ODbL-1.0");
});
test("mapped maze and pumpkin patch require explicit classification tags", () => {
  const r=adaptOsmSeasonalMetadata({elements:[
    place(1,{name:"Example Farm",tourism:"farm"}),
    place(2,{name:"Example Corn Maze",leisure:"maze","maze:type":"corn"}),
    place(3,{name:"Example Pumpkin Patch",attraction:"pumpkin_patch"}),
  ]});
  assert.equal(r.proposals.length,2);
  assert.deepEqual(r.proposals.map(x=>x.activityHints),[["corn-maze"],["pumpkin-patch"]]);
});
test("closed or disused evidence must remain a visible negative HOLD", () => {
  const r=adaptOsmSeasonalMetadata({elements:[place(1,{name:"Former Haunt",
    "disused:attraction":"haunted_house",attraction:"haunted_house",closed:"yes"})]});
  assert.ok(r.proposals[0].triage.reasons.includes("negative-lifecycle-evidence"));
  assert.ok(r.proposals[0].mappedLifecycleConcerns.length);
});
test("ways use center and never imply a verified entrance", () => {
  const r=adaptOsmSeasonalMetadata({elements:[{type:"way",id:7,center:{lat:37.25,lon:-94.51},
    tags:{name:"The Maze",attraction:"corn_maze",website:"https://example.org"}}]});
  assert.equal(r.proposals[0].approximateLocation.precision,"mapped-center-not-verified-entrance");
  assert.equal(r.proposals[0].sourceWebsite,null);
});
test("bad geometry and malformed records cause coverage HOLD rather than partial success", () => {
  const r=adaptOsmSeasonalMetadata({elements:[place(1,{name:"Haunt",attraction:"haunted_house"}),
    {type:"node",id:"bad",tags:{name:"Bad"}}]});
  assert.equal(r.status,"coverage-incomplete");
  assert.deepEqual(r.proposals,[]);
  const missing=adaptOsmSeasonalMetadata({elements:[
    place(2,{name:"Maze",attraction:"corn_maze"},{lat:1000,lon:0})]});
  assert.equal(missing.proposals[0].approximateLocation,null);
  assert.ok(missing.proposals[0].triage.reasons.includes("missing-mapped-location"));
});
test("response caps, remarks and malformed data fail closed", () => {
  assert.equal(adaptOsmSeasonalMetadata("bad").status,"malformed-response");
  assert.equal(adaptOsmSeasonalMetadata({elements:[],remark:"timed out"}).status,"malformed-response");
  assert.equal(adaptOsmSeasonalMetadata({elements:Array(101).fill(place(1,{}))}).status,"coverage-incomplete");
  assert.equal(adaptOsmSeasonalMetadata("a".repeat(600000)).status,"bounded-input-rejected");
});
test("same mapped name cannot be silently deduplicated", () => {
  const r=adaptOsmSeasonalMetadata({elements:[
    place(1,{name:"The Haunted Barn",attraction:"haunted_house"}),
    place(2,{name:"The Haunted Barn",attraction:"haunted_house"}, {lat:38,lon:-93}),
  ]});
  assert.equal(r.proposals.length,2);
  assert.ok(r.proposals.every(x=>x.triage.reasons.includes("possible-mapped-identity-collision")));
});

test("retired mapped identity survives as warning without positive activity", () => {
 const r=adaptOsmSeasonalMetadata({elements:[place(90,{name:"Former Fright",
  "disused:attraction":"haunted_house"})]});
 assert.equal(r.proposals.length,1);
 assert.deepEqual(r.proposals[0].activityHints,[]);
 assert.deepEqual(r.proposals[0].historicalCategoryHints,["haunted-house"]);
 assert.ok(r.proposals[0].triage.reasons.includes("historical-mapping-only"));
 assert.ok(r.proposals[0].triage.reasons.includes("negative-lifecycle-evidence"));
});
test("object fixtures obey the same byte limit as JSON strings", () => {
 const r=adaptOsmSeasonalMetadata({elements:[place(1,{name:"Haunt",
  attraction:"haunted_house",notes:"x".repeat(600000)})]});
 assert.equal(r.status,"bounded-input-rejected");
});
test("contradictory objects with identical OSM identity remain separate holds", () => {
 const r=adaptOsmSeasonalMetadata({elements:[
  place(7,{name:"Haunted House A",attraction:"haunted_house"}),
  place(7,{name:"Haunted House B",attraction:"haunted_house"}),
 ]});
 assert.equal(r.proposals.length,2);
 assert.ok(r.proposals.every(x=>x.triage.reasons.includes("conflicting-osm-identity")));
});
test("malformed tag values fail closed", () => {
 const r=adaptOsmSeasonalMetadata({elements:[
  place(1,{name:"Haunt",attraction:"haunted_house"}),
  place(2,{name:"Bad",attraction:["haunted_house"]})
 ]});
 assert.equal(r.status,"coverage-incomplete");
 assert.deepEqual(r.proposals,[]);
});

for (const reverse of [false,true]) {
 test(`same ID negative nonseasonal row must survive filtering (reverse=${reverse})`,()=>{
  const elements=[place(7,{name:'Former Haunt',attraction:'haunted_house'}), place(7,{name:'Former Haunt',shop:'vacant',closed:'yes'})];
  if(reverse) elements.reverse();
  const r=adaptOsmSeasonalMetadata({elements});
  assert.ok(r.status==='coverage-incomplete'||r.proposals.some(p=>p.triage.reasons.includes('conflicting-osm-identity')&&p.triage.reasons.includes('negative-lifecycle-evidence')),JSON.stringify(r));
 });
}
test('historical categories from different lifecycle prefixes must not shadow each other',()=>{
 const r=adaptOsmSeasonalMetadata({elements:[place(7,{name:'Former Farm','disused:attraction':'unknown','demolished:attraction':'haunted_house'})]});
 assert.equal(r.proposals.length,1);
 assert.deepEqual(r.proposals[0].historicalCategoryHints,['haunted-house']);
});
test('historical categories must not combine unrelated lifecycle prefixes',()=>{
 const r=adaptOsmSeasonalMetadata({elements:[place(7,{name:'Former Farm','disused:leisure':'maze','demolished:crop':'corn'})]});
 assert.ok(!r.proposals.some(p=>p.historicalCategoryHints.includes('corn-maze')));
});

const row = tags => ({type:'node',id:7,lat:37,lon:-94,tags:{name:'Synthetic',attraction:'haunted_house',...tags}});
for (const value of [undefined,()=>{},Symbol('tag')]) test(`lossy ${typeof value} rejected`,()=>{
 assert.equal(adaptOsmSeasonalMetadata({elements:[row({note:value})]}).status,'malformed-response');
});
for(const prefix of ['destroyed','razed']) test(`${prefix} retained`,()=>{
 const r=adaptOsmSeasonalMetadata({elements:[row({attraction:'', [prefix+':attraction']:'haunted_house'})]});
 assert.equal(r.proposals.length,1);
 assert.deepEqual(r.proposals[0].activityHints,[]);
 assert.ok(r.proposals[0].triage.reasons.includes('negative-lifecycle-evidence'));
});
test('false prefixed lifecycle does not imply negative',()=>{
 assert.deepEqual(adaptOsmSeasonalMetadata({elements:[row({'disused:attraction':'no'})]}).proposals[0].mappedLifecycleConcerns,[]);
});
test('full address preserved',()=>assert.equal(adaptOsmSeasonalMetadata({elements:[row({'addr:full':'12 Synthetic Road'})]}).proposals[0].proposedAddress,'12 Synthetic Road'));
test('identical rows not called conflict and reasons unique',()=>{
 const r=adaptOsmSeasonalMetadata({elements:Array.from({length:100},()=>row({}))});
 assert.ok(r.proposals.every(p=>!p.triage.reasons.includes('conflicting-osm-identity')));
 assert.ok(r.proposals.every(p=>p.triage.reasons.length===new Set(p.triage.reasons).size));
});

const load = appModuleLoader();
const { providerLifecycle } = load('src/lib/date-night/lifecycle.ts');
const { formatOsmAddress } = load('src/lib/location/model.ts');
test('lifecycle warning parity with existing pure provider helper', () => {
 for (const prefix of ['disused','abandoned','was','demolished','removed','razed','destroyed']) {
  for (const suffix of ['', ':attraction', ':leisure', ':unrelated']) {
   for (const value of ['yes','haunted_house','no','false','0','FALSE','']) {
    const tags = {name:'Synthetic', attraction:'haunted_house', [prefix+suffix]:value};
    const p = adaptOsmSeasonalMetadata({elements:[place(1,tags)]}).proposals[0];
    assert.equal(p.mappedLifecycleConcerns.length > 0, Boolean(providerLifecycle(tags)), JSON.stringify(tags));
   }
  }
 }
});
test('bounded address variants match existing pure address helper', () => {
 for (const address of [
  {'addr:full':'12 Synthetic Road, Test Village'},
  {'addr:housenumber':'12','addr:place':'Synthetic Road','addr:village':'Village','addr:province':'Province','addr:country':'Country'},
  {'addr:street':'Street','addr:town':'Town','addr:region':'Region','addr:postcode':'ZIP'},
  {'addr:hamlet':'Hamlet'}, {'addr:city':'Same','addr:state':'Same'}, {},
 ]) {
  const p = adaptOsmSeasonalMetadata({elements:[row(address)]}).proposals[0];
  assert.equal(p.proposedAddress, formatOsmAddress(address) || null);
 }
});
test('input hash binds exact supplied bytes, row hashes bind canonical unfiltered records', () => {
 const elements = [row({}), row({attraction:'', closed:'yes', 'note':'retain hash fidelity'})];
 const input = JSON.stringify({elements},null,2);
 const r = adaptOsmSeasonalMetadata(input);
 assert.equal(r.provenance.inputSha256,createHash('sha256').update(input,'utf8').digest('hex'));
 assert.equal(r.provenance.inputHashBasis,'supplied-string-utf8-bytes');
 assert.equal(r.provenance.recordHashBasis,'canonical-json-original-element-utf8');
 assert.deepEqual(r.proposals[0].provenance.negativeEvidenceIndices,[1]);
 assert.equal(r.proposals[0].provenance.elementIndex,0);
 assert.equal(r.provenance.sourceRows[1].elementIndex,1);
 assert.equal(r.provenance.sourceRows[1].osmId,7);
 assert.deepEqual(r.provenance.sourceRows[1].lifecycleTags,{closed:'yes'});
 const changed = adaptOsmSeasonalMetadata({elements:[elements[0],row({attraction:'',closed:'yes',note:'different'})]});
 assert.notEqual(changed.provenance.sourceRows[1].recordSha256,r.provenance.sourceRows[1].recordSha256);
 const reordered = adaptOsmSeasonalMetadata({elements:[{tags:elements[0].tags,lon:-94,lat:37,id:7,type:'node'},elements[1]]});
 assert.equal(reordered.provenance.sourceRows[0].recordSha256,r.provenance.sourceRows[0].recordSha256);
 assert.equal(reordered.provenance.inputHashBasis,'canonical-json-object-snapshot-utf8');
});
test('strict JSON fixture fidelity rejects accessors, sparse arrays, symbols, cycles, nonfinite and custom objects', () => {
 const accessor = {}; Object.defineProperty(accessor,'elements',{get(){throw new Error('must not execute');},enumerable:true});
 const cycle = {}; cycle.self = cycle;
 const symbolKey = {elements:[]}; symbolKey[Symbol('hidden')] = 'secret';
 for (const input of [accessor, {elements:Array(1)}, symbolKey, cycle, new Date(), {elements:[],x:NaN}, {elements:[],x:Infinity}]) {
  assert.equal(adaptOsmSeasonalMetadata(input).status,'malformed-response');
 }
});
test('all retained duplicate and negative rows remain research-only with bounded unique reasons', () => {
 const r = adaptOsmSeasonalMetadata({elements:Array.from({length:100},()=>row({closed:'yes'}))});
 assert.equal(r.proposals.length,100);
 assert.equal(r.provenance.sourceRows.length,100);
 for(const p of r.proposals) {
  assert.ok(p.triage.reasons.includes('duplicate-osm-record'));
  assert.ok(p.triage.reasons.includes('negative-lifecycle-evidence'));
  assert.ok(!p.triage.reasons.includes('conflicting-osm-identity'));
  assert.equal(p.triage.reasons.length,new Set(p.triage.reasons).size);
  assert.ok(p.triage.reasons.length <= 10);
  assert.equal(p.provenance.negativeEvidenceIndices.length,100);
  for(const key of ['verified','publishable','openNowEligible','year2026Verified']) assert.equal(p[key],false);
  for(const key of ['sourceWebsite','startDate','endDate','openingHours']) assert.equal(p[key],null);
 }
});
test('explicit crop fallback remains independent from a noncorn maze type', () => {
 const r = adaptOsmSeasonalMetadata({elements:[row({attraction:'', leisure:'maze','maze:type':'hedge',crop:'corn'})]});
 assert.deepEqual(r.proposals[0].activityHints,['corn-maze']);
});
test('raw evidence whitelist preserves exact values and rejects overflow without truncation', () => {
 const tags = {name:'  Synthetic\n Site  ', attraction:'haunted_house','addr:full':'  12 Road  ',closed:'yes',website:'https://example.invalid/',opening_hours:'24/7'};
 const r = adaptOsmSeasonalMetadata({elements:[place(1,tags)]});
 assert.deepEqual(r.provenance.sourceRows[0].rawTags,{name:tags.name,attraction:tags.attraction,'addr:full':tags['addr:full'],closed:'yes'});
 assert.equal(r.proposals[0].proposedName,'Synthetic Site');
 for (const tags of [
  {name:'x'.repeat(4097)},
  Object.fromEntries(Array.from({length:65},(_,i)=>['destroyed:field'+i,'yes'])),
  {'addr:full':'x'.repeat(4096),'addr:street':'y'.repeat(4096),'addr:city':'z'.repeat(4096),'addr:state':'w'.repeat(4096)},
 ]) {
  const result=adaptOsmSeasonalMetadata({elements:[row(tags)]});
  assert.equal(result.status,'coverage-incomplete');
  assert.equal(result.diagnostic,'evidence-tag-limit');
  assert.deepEqual(result.proposals,[]);
 }
});
