import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";

const { records } = await loadCasinoCatalogs();
const qa = JSON.parse(fs.readFileSync("audit/casino-rc-pass-51-evidence-2026-09-13.json", "utf8"));
const current = records.filter(r => r.file.endsWith("/casino-catalog-pass-51.ts"));
const previous = records.filter(r => !r.file.endsWith("/casino-catalog-pass-51.ts"));
const before = auditCasinoRecords(previous, {});
const after = auditCasinoRecords(records, {});

test("newly registered destinations preserve numerical property evidence and scope decisions", () => {
  assert.equal(current.length, qa.records.length);
  assert.equal(new Set(current.map(r => r.id)).size, current.length);
  for (const record of current) {
    const proof = qa.records.find(r => r.id === record.id);
    assert.ok(proof, record.id);
    for (const key of ["id", "name", "address", "lat", "lon"]) assert.equal(record[key], proof[key]);
    for (const key of ["identitySource", "coordinateSource", "verifiedOn"]) assert.equal(record.audit[key], proof[key]);
    const point = proof.coordinateEvidence;
    if (point.finalUrl) {
      const destination = point.finalUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
      assert.ok(destination, record.id + " requires destination coordinates");
      assert.equal(record.lat, Number(destination[1]));
      assert.equal(record.lon, Number(destination[2]));
    } else if (point.fields) {
      assert.equal(record.lat, Number(point.fields.geo.latitude));
      assert.equal(record.lon, Number(point.fields.geo.longitude));
    } else {
      assert.equal(point.method, "named-OSM-feature-meta");
      assert.match(record.audit.coordinateSource, /mapcarta\.com\/[NW]\d+$/);
      assert.equal(record.lat, point.latitude);
      assert.equal(record.lon, point.longitude);
    }
    assert.ok(proof.decision.length > 0);
  }
});

test("additions enter once while pin corrections retain IDs and historical evidence", () => {
  assert.deepEqual(after.failures, []);
  const added = qa.records.filter(r => r.status === "verified-ready");
  assert.equal(after.canonical.length - before.canonical.length, added.length);
  for (const proof of added) assert.equal(before.canonical.some(r => r.id === proof.id), false, proof.id);
  for (const proof of qa.records.filter(r => r.status === "correction")) {
    const old = previous.find(r => r.id === proof.id && r.file === proof.previous.file);
    assert.ok(old);
    assert.deepEqual([old.lat, old.lon, old.address], [proof.previous.lat, proof.previous.lon, proof.previous.address]);
    const active = after.canonical.filter(r => r.id === proof.id);
    assert.equal(active.length, 1);
    assert.deepEqual([active[0].lat, active[0].lon], [proof.lat, proof.lon]);
  }
});

test("nearby branded buildings and separately operated Oneida venues survive canonicalization", () => {
  for (const ids of [
    ["nv-eldorado-reno", "nv-silver-legacy-reno", "nv-circus-circus-reno"],
    ["ok-native-lights", "ok-seven-clans-first-council"],
    ["wi-oneida-airport", "wi-oneida-imac"],
  ]) {
    const group = ids.map(id => after.canonical.find(r => r.id === "casino-catalog-" + id));
    assert.ok(group.every(Boolean));
    assert.equal(new Set(group.map(r => r.lat + "," + r.lon)).size, ids.length);
  }
  assert.equal(after.counts.Wisconsin, before.counts.Wisconsin);
});
