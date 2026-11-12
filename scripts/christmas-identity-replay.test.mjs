import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const PARK_ID = "date-night-osm-way-987588580";
const recordedPark = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8"));
const parkElement = recordedPark.element;
const origin = { ...parkElement.center, radiusMiles: 15 };
// The recorded map geometry supports provider replay and distance only. It is
// explicitly not visitor-gate or event navigation clearance.
// Church/courthouse tags below are review-derived classifier controls. Their
// deliberately shared synthetic center is not reviewed host placement evidence.
const churchElement = {
  type: "way", id: 437235888, version: 2,
  center: { lat: origin.lat, lon: origin.lon },
  tags: {
    name: "Grace Episcopal Church", amenity: "place_of_worship",
    "addr:housenumber": "820", "addr:street": "Howard Street",
    "addr:city": "Carthage", "addr:state": "MO", denomination: "episcopal",
    website: "https://gracecarthage.com/",
  },
};
const courthouseElement = {
  type: "way", id: 437235836,
  center: { lat: origin.lat, lon: origin.lon },
  tags: { name: "Jasper County Courthouse", amenity: "courthouse",
    "addr:housenumber": "302", "addr:street": "South Main Street", "addr:city": "Carthage" },
};

function replay(t, initialElements = []) {
  let elements = initialElements;
  const queries = [];
  t.mock.method(console, "warn", () => {});
  t.mock.method(console, "info", () => {});
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    queries.push(new URLSearchParams(init.body).get("data"));
    return Response.json({ elements, osm3s: { timestamp_osm_base: "2026-11-11T18:00:00Z" } });
  });
  const load = appModuleLoader();
  const { searchDateNight } = load("src/lib/date-night/search.ts");
  const search = (extra = {}) => searchDateNight({ data: {
    ...origin, spookySeasonEnabled: false, activityTypes: ["park"], ...extra,
  } });
  return { load, search, queries, setElements(value) { elements = value; } };
}

test("provider-to-merge replay preserves the reviewed Central Park identity without a curated duplicate", async t => {
  const h = replay(t);
  const localOnly = await h.search();
  assert.equal(localOnly.venues.some(place => place.id === PARK_ID || place.name === "Central Park"), false);
  h.setElements([parkElement, structuredClone(parkElement)]);
  const response = await h.search();
  const matches = response.venues.filter(place => place.id === PARK_ID);
  assert.equal(matches.length, 1);
  const park = matches[0];
  assert.equal(park.name, "Central Park");
  assert.deepEqual(park.activityTypes, ["park"]);
  assert.equal(park.source, "osm");
  assert.equal(park.openingHours, null, "ordinary unknown park hours cannot be display admission hours");
  assert.match(park.address, /305 West Chestnut Street/);
  assert.match(park.address, /Carthage/);
  const source = park.discoveryEvidence.find(item => item.id === PARK_ID && item.source === "osm").sourceIdentity;
  assert.deepEqual(source, {
    objectType: "way", objectId: 987588580, version: 2, changeset: 189037687,
    name: "Central Park", address: "305 West Chestnut Street, Carthage, MO, 64836",
    classification: { leisure: "park" },
  });
  assert.equal(source.observedAt, undefined, "replay cannot manufacture an observation timestamp from object edit time");
  const { decorateDateNight } = h.load("src/lib/date-night/eligibility.ts");
  const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = h.load("src/lib/date-night/christmas-binding.ts");
  assert.equal(resolveChristmasParkBinding(decorateDateNight(response.venues, origin), REVIEWED_CHRISTMAS_BINDINGS).state, "bound");
  assert.equal(resolveChristmasParkBinding(decorateDateNight(localOnly.venues, origin), REVIEWED_CHRISTMAS_BINDINGS).state, "absent-from-query");
  assert.ok(h.queries.every(query => !/christmas|holiday|place_of_worship|courthouse|school/i.test(query)), "ordinary acquisition remains ordinary");
});

test("provider replay distinguishes missing metadata, a changed revision and conflicting preserved source fields", async t => {
  const h = replay(t);
  const { decorateDateNight } = h.load("src/lib/date-night/eligibility.ts");
  const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = h.load("src/lib/date-night/christmas-binding.ts");
  const { version: _version, changeset: _changeset, ...withoutRevision } = parkElement;
  for (const [elements, expected] of [
    [[withoutRevision], "missing-source-evidence"],
    [[{ ...parkElement, version: 3 }], "stale-source"],
    [[{ ...parkElement, changeset: 189037688 }], "stale-source"],
    [[{ ...parkElement, tags: { ...parkElement.tags, name: "Unrelated park" } }], "conflicting-source"],
    [[parkElement, { ...parkElement, tags: { ...parkElement.tags, "addr:housenumber": "820" } }], "conflicting-source"],
  ]) {
    h.setElements(elements);
    const response = await h.search();
    const binding = resolveChristmasParkBinding(decorateDateNight(response.venues, origin), REVIEWED_CHRISTMAS_BINDINGS);
    assert.equal(binding.state, expected, JSON.stringify(elements.map(element => ({ version: element.version, name: element.tags.name }))));
    assert.ok(binding.reason.length > 20);
  }
});

test("identity conflicts survive provider normalization and deduplication instead of last-write-wins", async t => {
  const conflicting = { ...parkElement, tags: { ...parkElement.tags, "addr:housenumber": "820" } };
  const h = replay(t, [parkElement, conflicting]);
  const response = await h.search();
  const matches = response.venues.filter(place => place.id === PARK_ID);
  assert.equal(matches.length, 1);
  assert.deepEqual(new Set(matches[0].discoveryEvidence.map(item => item.sourceIdentity?.address)), new Set([
    "305 West Chestnut Street, Carthage, MO, 64836", "820 West Chestnut Street, Carthage, MO, 64836",
  ]));
});

test("ordinary acquisition does not manufacture a church, school, square or parade host row", async t => {
  const syntheticSchool = {
    type: "way", id: 999999999, center: { lat: origin.lat, lon: origin.lon },
    tags: { name: "Synthetic high school classifier control", amenity: "school",
      "addr:housenumber": "511", "addr:street": "South Neosho Boulevard" },
  };
  const h = replay(t, [churchElement, courthouseElement, syntheticSchool]);
  const response = await h.search({ activityTypes: ["anything"] });
  for (const id of ["date-night-osm-way-437235888", "date-night-osm-way-437235836", "date-night-osm-way-999999999"])
    assert.equal(response.venues.some(place => place.id === id), false, id);
  assert.equal(response.venues.some(place => place.name === "Grace Episcopal Church"), false);
  assert.equal(response.venues.some(place => place.name === "Carthage Square"), false);
});

test("holiday categories are rejected by the ordinary discovery RPC before provider acquisition", async t => {
  const h = replay(t, [parkElement]);
  for (const category of ["christmas-lights", "holiday-market", "holiday-craft-fair", "holiday-community-event"])
    await assert.rejects(h.search({ activityTypes: [category] }));
  assert.equal(h.queries.length, 0);
});
