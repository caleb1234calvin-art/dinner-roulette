import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";
import { createTsTestLoader } from "./ts-test-loader.mjs";

const load = createTsTestLoader();
const { mergeNightlife, elementToPlace } = load("src/lib/nightlife/search.ts", "\nexport { mergeNightlife, elementToPlace };");
const { heldCasino } = load("src/lib/nightlife/discovery-policy.ts");
const { haversineMiles } = load("src/lib/restaurants/geo.ts");
const { records, catalogs } = await loadCasinoCatalogs();
const { canonical } = auditCasinoRecords(records, {});
const get = suffix => {
  const row = canonical.find(r => r.id === "casino-catalog-" + suffix);
  assert.ok(row, suffix);
  return row;
};

test("final casino aliases preserve canonical routing and do not absorb distant same-name properties", () => {
  for (const [suffix, alias] of [
    ["nv-pioneer-crossing-dayton", "Pioneer Crossing"],
    ["nv-pioneer-crossing-fernley", "Pioneer Crossing Casino"],
    ["nv-pioneer-crossing-yerington", "Pioneer Crossing"],
    ["nv-gold-ranch-dayton", "Gold Ranch Casino"],
    ["nv-pahrump-nugget", "Golden Casino Group"],
    ["nv-lakeside-pahrump", "Lakeside Casino"],
    ["nv-saddle-west-pahrump", "Saddle West"],
    ["nv-terribles-pahrump", "Mountain View Casino"],
    ["nv-jackpot-joanies-pahrump", "Irene’s Casino"],
    ["nv-colt-battle-mountain", "Colt Casino"],
    ["nv-big-wheel-lovelock", "Big Wheel Casino"],
    ["ok-konawa-rivermist", "Rivermist Casino"],
    ["ok-pawnee-trading-post", "StoneWolf Casino Pawnee"],
    ["ok-teepee-yale", "Tee Pee Casino (StoneWolf Casino Yale)"],
  ]) {
    const saved = get(suffix);
    const live = { ...saved, id: "live-alias", name: alias, source: "osm", lat: saved.lat + 0.0001, phone: "live-contact" };
    const merged = mergeNightlife([live], [saved]);
    assert.equal(merged.length, 1, suffix);
    for (const key of ["id", "name", "address", "lat", "lon"]) assert.equal(merged[0][key], saved[key]);
    assert.equal(merged[0].phone, "live-contact");
    assert.equal(mergeNightlife([{ ...live, lat: saved.lat + 1 }], [saved]).length, 2);
  }
});

test("nearby final-pass casinos remain distinct even inside the alias distance threshold", () => {
  for (const [suffix, neighborSuffix, alias] of [
    ["nv-terribles-roadhouse-searchlight", "nv-terribles-casino-searchlight", "Terrible's Roadhouse Searchlight"],
    ["nv-pioneer-crossing-dayton", "nv-nevada-nugget-dayton", "Pioneer Crossing"],
    ["nv-pioneer-crossing-yerington", "nv-dinis-yerington", "Pioneer Crossing"],
    ["nv-wildfire-lanes", "nv-barleys-henderson", "Wildfire Casino"],
    ["nv-wildfire-sunset", "nv-sunset-station", "Wildfire Sunset"],
    ["nv-silver-strike-silver-springs", "nv-silver-springs-nugget", "Silver Strike Casino"],
  ]) {
    const saved = get(suffix), neighbor = get(neighborSuffix);
    const merged = mergeNightlife([{ ...saved, id: "nearby-live", name: alias, phone: "this-floor-only" }], [neighbor, saved]);
    assert.equal(merged.length, 2, suffix);
    assert.equal(merged.find(r => r.id === neighbor.id).phone, neighbor.phone);
    assert.equal(merged.find(r => r.id === saved.id).phone, "this-floor-only");
    assert.notEqual(saved.address, neighbor.address);
  }
});

test("same-brand town names and Pawnee satellite aliases cannot redirect live details to another casino", () => {
  const towns = ["nv-pioneer-crossing-dayton", "nv-pioneer-crossing-fernley", "nv-pioneer-crossing-yerington"].map(get);
  const bigWheel = [get("nv-big-wheel-lovelock"), get("nv-big-wheel-battle-mountain")];
  for (const [pool, target, alias] of [
    [towns, towns[1], "Pioneer Crossing Casino"],
    [bigWheel, bigWheel[0], "Big Wheel Casino"],
    [[get("ok-stonewolf"), get("ok-pawnee-trading-post"), get("ok-teepee-yale")], get("ok-teepee-yale"), "StoneWolf Casino Yale"],
  ]) {
    const merged = mergeNightlife([{ ...target, id: "town-live", name: alias, phone: "selected-town" }], pool);
    assert.equal(merged.length, pool.length);
    assert.equal(merged.find(r => r.id === target.id).phone, "selected-town");
    for (const other of pool.filter(r => r.id !== target.id)) assert.equal(merged.find(r => r.id === other.id).phone, other.phone);
  }
});

test("Gold Town closure rejects stale casino tags while nearby Pahrump properties survive", () => {
  const element = (name, lat, lon) => ({ type: "node", id: 123, lat, lon, tags: { name, amenity: "casino" } });
  for (const name of ["Gold Town Casino", "Gold Town", "Terrible's Town Casino"]) {
    assert.equal(elementToPlace(element(name, 36.2091399, -115.9832627)), null);
    assert.ok(elementToPlace(element(name, 39, -119)), "Unrelated distant names must not be suppressed");
  }
  for (const suffix of ["nv-pahrump-nugget", "nv-lakeside-pahrump", "nv-terribles-pahrump"]) {
    const row = get(suffix);
    assert.ok(elementToPlace(element(row.name, row.lat, row.lon)));
    assert.equal(heldCasino(row.name, row.lat, row.lon), undefined);
  }
});

test("conflicting casino map metadata cannot replace the reviewed property or component point", () => {
  const fernley = get("nv-pioneer-crossing-fernley");
  assert.ok(fernley.lon > -119.22, "Reject the west-Fernley MapQuest point");
  const konawa = get("ok-konawa-rivermist");
  assert.ok(Math.abs(konawa.lat - 34.9394807) < 0.0001 && Math.abs(konawa.lon + 96.6838545) < 0.0001, "Independent Apple casino point corroborates the chosen point");
  const colt = get("nv-colt-battle-mountain");
  assert.ok(Math.abs(colt.lat - 40.6483607) < 0.0001 && Math.abs(colt.lon + 116.9435101) < 0.0001, "Casino and diner share the building; RV point is elsewhere");
  assert.match(colt.address, /^654 W Front St,/);
  const lakeside = get("nv-lakeside-pahrump");
  assert.ok(lakeside.lon > -115.9588, "Use the casino/restaurant building, not the west-side RV destination");
  assert.match(lakeside.address, /^5870 S Homestead Rd,/);
  assert.match(get("nv-wildfire-valley-view").address, /^3045 S Valley View Blvd,/);
});

test("freeze accounting preserves resolved holds, unresolved candidates and historical rows honestly", () => {
  const freeze = JSON.parse(fs.readFileSync("audit/casino-final-freeze-2026-09-13.json", "utf8"));
  assert.equal(freeze.counts.canonical, canonical.length);
  assert.equal(freeze.counts.serialized, records.length);
  assert.equal(freeze.counts.passes, catalogs.length);
  assert.equal(freeze.counts.addedThisCompletion, freeze.changes.addedIds.length);
  for (const id of freeze.changes.addedIds) assert.equal(canonical.filter(r => r.id === id).length, 1);
  const decisions = freeze.originalHoldDecisions;
  assert.equal(decisions.length, 8);
  assert.equal(decisions.filter(r => r.classification === "PROMOTE").length, freeze.counts.originalHoldsResolved);
  for (const row of decisions.filter(r => r.classification === "PROMOTE")) assert.ok(canonical.some(r => r.id === row.canonicalId));
  const cts = decisions.find(r => r.property === "Chickasaw Travel Stop Thackerville");
  assert.equal(cts.classification, "HOLD");
  assert.ok(cts.recheckTrigger && cts.sources.length);
  assert.equal(canonical.some(r => r.id === "casino-catalog-ok-cts-thackerville-gaming"), false);
  assert.equal(get("ok-border-casino").address, "22953 Brown Springs Rd, Thackerville, OK 73459");
  assert.equal(records.length - canonical.length, freeze.changes.historicalSupersededRowsRetained);
});

test("captured live casino responses exclude closed aliases and reconcile the reviewed regional pools", () => {
  const evidence = JSON.parse(fs.readFileSync("audit/casino-freeze-live-provider-findings-2026-09-13.json", "utf8"));
  assert.ok(evidence.providerCasinos.some(row => row.tags.name === "Kaw Southwind Casino"), "Replay the actual stale provider alias");
  for (const [name, lat, lon] of [["Newkirk", 36.977, -97.045], ["Pahrump", 36.208, -115.983], ["Pawnee", 36.338, -96.804]]) {
    const nearby = row => haversineMiles(lat, lon, row.lat, row.lon) <= 10.05;
    const saved = canonical.filter(nearby);
    const live = evidence.providerCasinos.filter(nearby).map(elementToPlace).filter(Boolean);
    const merged = mergeNightlife(live, saved);
    assert.deepEqual(merged.map(row => row.id).sort(), saved.map(row => row.id).sort(), name + " must not revive a closed casino or duplicate a mapped alias");
    for (const row of merged) {
      const reviewed = saved.find(candidate => candidate.id === row.id);
      for (const key of ["name", "address", "lat", "lon"]) assert.equal(row[key], reviewed[key]);
    }
  }
  assert.equal(heldCasino("Kaw Southwind Casino", 36.923, -97.332), undefined, "Keep Braman outside the Newkirk closure area");
});
