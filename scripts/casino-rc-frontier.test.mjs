import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";
import { createTsTestLoader } from "./ts-test-loader.mjs";
const { heldCasino } = createTsTestLoader()("src/lib/nightlife/discovery-policy.ts");
const { records } = await loadCasinoCatalogs();
const { canonical, failures } = auditCasinoRecords(records, {});
const proof = JSON.parse(fs.readFileSync("audit/casino-rc-pass-54-evidence-2026-09-13.json", "utf8"));

test("final frontier destinations retain property evidence and survive all closure scopes", () => {
  assert.deepEqual(failures, []);
  const batch = records.filter(row => row.file.endsWith("/casino-catalog-pass-54.ts"));
  assert.equal(batch.length, proof.records.length);
  for (const row of batch) {
    const evidence = proof.records.find(value => value.id === row.id);
    for (const key of ["name", "address", "lat", "lon"]) assert.equal(row[key], evidence[key], row.id);
    for (const key of ["identitySource", "coordinateSource", "verifiedOn"]) assert.equal(row.audit[key], evidence[key]);
    const point = evidence.coordinateEvidence;
    if (point.finalUrl) {
      const match = point.finalUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
      assert.ok(match, row.id);
      assert.deepEqual([row.lat, row.lon], [Number(match[1]), Number(match[2])]);
    } else {
      assert.deepEqual([row.lat, row.lon], [point.fields.geo.latitude, point.fields.geo.longitude]);
    }
    assert.equal(heldCasino(row.name, row.lat, row.lon), undefined, row.id);
    assert.equal(canonical.filter(value => value.id === row.id).length, 1);
  }
});

test("casino floors remain distinct from nearby casino properties, off-site lodges and closed predecessors", () => {
  const get = id => canonical.find(row => row.id === "casino-catalog-" + id);
  const nugget = get("nv-wendover-nugget"), montego = get("nv-montego-bay-wendover");
  assert.ok(nugget && montego);
  assert.notEqual(nugget.address, montego.address);
  const grandLake = get("ok-grand-lake");
  assert.match(grandLake.address, /^24701 /);
  assert.notDeepEqual([grandLake.lat, grandLake.lon], [36.63434, -94.70977], "Off-site lodge is not the casino");
  const currentKaw = get("ok-rock-brews-braman");
  assert.ok(currentKaw);
  assert.equal(heldCasino(currentKaw.name, currentKaw.lat, currentKaw.lon), undefined);
  assert.ok(heldCasino("Southwind Casino", 36.877795, -97.0303071));
  assert.equal(canonical.some(row => /Southwind.*Newkirk/i.test(row.name)), false);
});
