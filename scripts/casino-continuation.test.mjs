import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";
import { createTsTestLoader } from "./ts-test-loader.mjs";

const load = createTsTestLoader();
const { mergeNightlife, elementToPlace } = load("src/lib/nightlife/search.ts", "\nexport { mergeNightlife, elementToPlace };");
const { heldCasino } = load("src/lib/nightlife/discovery-policy.ts");
const { records } = await loadCasinoCatalogs();
const { canonical, failures } = auditCasinoRecords(records, {});
const get = suffix => {
  const row = canonical.find(r => r.id === "casino-catalog-" + suffix);
  assert.ok(row, suffix);
  return row;
};

test("resumed additions preserve explicit point evidence, casino schema and active canonical identity", () => {
  assert.deepEqual(failures, []);
  for (const pass of [55, 56, 57, 58, 59, 60]) {
    const proof = JSON.parse(fs.readFileSync("audit/casino-rc-pass-" + pass + "-evidence-2026-09-13.json", "utf8"));
    const batch = records.filter(r => r.file.endsWith("/casino-catalog-pass-" + pass + ".ts"));
    assert.equal(batch.length, proof.records.length);
    for (const row of batch) {
      const evidence = proof.records.find(r => r.id === row.id);
      assert.ok(evidence, row.id);
      for (const key of ["name", "address", "lat", "lon"]) assert.equal(row[key], evidence[key], row.id);
      for (const key of ["identitySource", "coordinateSource", "verifiedOn"]) assert.equal(row.audit[key], evidence[key]);
      const point = evidence.coordinateEvidence;
      if (point.method === "operator-linked-public-KML-Placemark-Point") {
        assert.equal(point.coordinateOrder, "longitude,latitude,altitude");
        assert.deepEqual([row.lat, row.lon], [point.coordinates[1], point.coordinates[0]]);
      } else if (point.method === "operator-embedded-named-building-destination") {
        assert.ok(point.placeId && point.placeLabel && point.cid);
        assert.deepEqual([row.lat, row.lon], [point.latitude, point.longitude]);
      } else if (point.fields?.geo) {
        assert.deepEqual([row.lat, row.lon], [point.fields.geo.latitude, point.fields.geo.longitude]);
      } else {
        const match = point.finalUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
        assert.ok(match, row.id);
        assert.deepEqual([row.lat, row.lon], [Number(match[1]), Number(match[2])]);
      }
      assert.equal(heldCasino(row.name, row.lat, row.lon), undefined, row.id);
      assert.equal(canonical.filter(r => r.id === row.id).length, 1);
    }
  }
});

test("local operator aliases merge without losing canonical points or merging distant same-brand casinos", () => {
  for (const [suffix, alias] of [
    ["nv-cactus-jacks", "Cactus Jack’s Casino"],
    ["nv-cod-minden", "C.O.D. Garage"],
    ["nv-comstock-carson", "Comstock Casino"],
    ["nv-comstock-fallon", "Comstock Casino"],
    ["nv-jackpot-crossing-carson", "Jackpot Crossing"],
    ["nv-jackpot-crossing-fernley", "Jackpot Crossing Casino"],
    ["ok-seven-clans-red-rock", "Lil Bit of Paradise Casino 2"],
  ]) {
    const saved = get(suffix);
    const live = { ...saved, id: "osm-test", name: alias, source: "osm", lat: saved.lat + 0.0001, phone: "test-phone" };
    const merged = mergeNightlife([live], [saved]);
    assert.equal(merged.length, 1, suffix);
    for (const key of ["id", "name", "address", "lat", "lon"]) assert.equal(merged[0][key], saved[key]);
    assert.equal(merged[0].phone, "test-phone");
    assert.equal(mergeNightlife([{ ...live, lat: saved.lat + 1 }], [saved]).length, 2);
  }
  const carson = get("nv-comstock-carson"), fallon = get("nv-comstock-fallon");
  const merged = mergeNightlife([{ ...fallon, id: "live-fallon", name: "Comstock Casino", phone: "Fallon-only" }], [carson, fallon]);
  assert.equal(merged.length, 2);
  assert.equal(merged.find(r => r.id === carson.id).phone, null);
  assert.equal(merged.find(r => r.id === fallon.id).phone, "Fallon-only");
});

test("neighboring Otoe-Missouria casino floors and related travel components retain separate identity", () => {
  const chilocco = get("ok-seven-clans-chilocco"), council = get("ok-seven-clans-first-council");
  assert.notEqual(chilocco.address, council.address);
  const merged = mergeNightlife([{ ...chilocco, id: "osm-chilocco", phone: "Chilocco-only" }], [council, chilocco]);
  assert.equal(merged.length, 2);
  assert.equal(merged.find(r => r.id === council.id).phone, council.phone);
  assert.equal(merged.find(r => r.id === chilocco.id).phone, "Chilocco-only");
  const redRock = get("ok-seven-clans-red-rock");
  const paradise = canonical.find(r => /7 Clans Paradise Casino/.test(r.name));
  assert.ok(paradise);
  assert.notEqual(redRock.address, paradise.address);
  assert.equal(mergeNightlife([{ ...redRock, id: "osm-red-rock", name: "Lil Bit of Paradise Casino 2" }], [paradise, redRock]).length, 2);
});

test("Casino Oklahoma uses its named casino point and routing street, separately from Sugar Creek", () => {
  const casino = get("ok-casino-oklahoma");
  const sugar = canonical.find(r => /Sugar Creek Casino/.test(r.name));
  assert.ok(sugar);
  assert.match(casino.address, /^220 E Cummins St,/);
  assert.deepEqual([casino.lat, casino.lon], [35.524263, -98.348493]);
  assert.notDeepEqual([casino.lat, casino.lon], [sugar.lat, sugar.lon]);
  assert.notDeepEqual([casino.lat, casino.lon], [35.468773, -98.323994]);
  assert.equal(mergeNightlife([{ ...casino, id: "osm-casino-oklahoma" }], [sugar, casino]).length, 2);
});

test("Golden Eagle casinos in Oklahoma and Kansas survive identical names across states", () => {
  const ok = get("ok-golden-eagle-apache"), ks = get("golden-eagle-kansas");
  assert.equal(ok.name, ks.name);
  const merged = mergeNightlife([{ ...ok, id: "osm-golden-eagle", phone: "Oklahoma-only" }], [ks, ok]);
  assert.equal(merged.length, 2);
  assert.equal(merged.find(r => r.id === ks.id).phone, ks.phone);
  assert.equal(merged.find(r => r.id === ok.id).phone, "Oklahoma-only");
});

test("Prairie Sun closure cannot be revived by stale live tags or suppress current Prairie Moon", () => {
  const element = (name, lat, lon) => ({ type: "node", id: 123, lat, lon, tags: { name, amenity: "casino" } });
  for (const name of ["Prairie Sun Casino", "Prairie Sun"]) {
    assert.equal(elementToPlace(element(name, 36.9185076, -94.8963338)), null);
    assert.ok(elementToPlace(element(name, 35, -96)));
  }
  const moon = get("ok-prairie-moon");
  assert.ok(elementToPlace(element(moon.name, moon.lat, moon.lon)));
  assert.equal(heldCasino(moon.name, moon.lat, moon.lon), undefined);
});

test("new operator aliases cannot merge nearby independently operated casino floors", () => {
  for (const [suffix, neighborSuffix, alias] of [
    ["nv-alamo-wells", "nv-luckys-wells", "Alamo Casino"],
    ["nv-alamo-las-vegas-ta", "nv-silverton", "Alamo Casino"],
    ["nv-luckys-fernley", "nv-pilot-fernley", "4 Way Casino"],
    ["nv-roadhouse-winnemucca", "nv-pilot-winnemucca", "Winger's Roadhouse Casino"],
  ]) {
    const saved = get(suffix), neighbor = get(neighborSuffix);
    const merged = mergeNightlife([{ ...saved, id: "live-operator", name: alias, phone: "verified-floor-only" }], [neighbor, saved]);
    assert.equal(merged.length, 2, suffix);
    assert.equal(merged.find(r => r.id === neighbor.id).phone, neighbor.phone);
    assert.equal(merged.find(r => r.id === saved.id).phone, "verified-floor-only");
    assert.equal(merged.find(r => r.id === saved.id).address, saved.address);
  }
});

test("reconciled travel-center destinations use the right city and current postal identity", () => {
  const elko = get("nv-roadhouse-elko"), win = get("nv-roadhouse-winnemucca");
  assert.match(elko.address, /^1165 E Jennings Way #102, Elko,/);
  assert.match(win.address, /^4400 Rim Rock Rd, Winnemucca,/);
  const diamond = get("nv-diamonds-reno");
  assert.match(diamond.address, /^1010 E 6th St,/);
  const west = get("ok-ada-west-gaming"), east = get("ok-ada-gaming");
  assert.notEqual(west.address, east.address);
  assert.equal(mergeNightlife([{ ...west, id: "live-west" }], [east, west]).length, 2);
  const davis = get("ok-davis-west-gaming"), treasure = get("ok-treasure-valley-casino-hotel");
  assert.equal(mergeNightlife([{ ...davis, id: "live-davis" }], [treasure, davis]).length, 2);
});
