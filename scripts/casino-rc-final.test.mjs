import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";

const { records } = await loadCasinoCatalogs();
const { canonical, failures } = auditCasinoRecords(records, {});
const evidence = JSON.parse(fs.readFileSync("audit/casino-rc-pass-53-evidence-2026-09-13.json", "utf8"));

test("final adversarial additions and correction preserve observed property destinations", () => {
  assert.deepEqual(failures, []);
  const batch = records.filter(row => row.file.endsWith("/casino-catalog-pass-53.ts"));
  assert.equal(batch.length, evidence.records.length);
  for (const row of batch) {
    const proof = evidence.records.find(value => value.id === row.id);
    assert.ok(proof, row.id);
    for (const key of ["name", "address", "lat", "lon"]) assert.equal(row[key], proof[key], row.id);
    const point = proof.coordinateEvidence.finalUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
    assert.ok(point);
    assert.deepEqual([row.lat, row.lon], [Number(point[1]), Number(point[2])]);
    for (const key of ["identitySource", "coordinateSource", "verifiedOn"]) assert.equal(row.audit[key], proof[key]);
    assert.equal(canonical.filter(value => value.id === row.id).length, 1);
  }
});

test("Slot Palace routing uses its operator directions address and preserves the separate resort", () => {
  const proof = evidence.records.find(row => row.status === "correction");
  const active = canonical.find(row => row.id === proof.id);
  const old = records.find(row => row.id === proof.id && row.file === proof.previous.file);
  const resort = canonical.find(row => row.id === "casino-catalog-soaring-eagle");
  assert.deepEqual([old.lat, old.lon, old.address], [proof.previous.lat, proof.previous.lon, proof.previous.address]);
  assert.notEqual(active.address, resort.address, "The separate casino must no longer route to the shared resort address");
  assert.match(new URL(proof.operatorDirectionsUrl).searchParams.get("daddr"), /7566 Ogemaw Dr #7076/);
  assert.match(active.address, /^7566 Ogemaw Dr #7076,/);
  assert.notDeepEqual([active.lat, active.lon], [resort.lat, resort.lon]);
});
