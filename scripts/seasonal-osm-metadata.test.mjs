import assert from "node:assert/strict";
import test from "node:test";
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
