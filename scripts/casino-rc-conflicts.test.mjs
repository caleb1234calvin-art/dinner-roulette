import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";
import { createTsTestLoader } from "./ts-test-loader.mjs";

const { records } = await loadCasinoCatalogs();
const qa = JSON.parse(fs.readFileSync("audit/casino-rc-pass-52-evidence-2026-09-13.json", "utf8"));
const active = auditCasinoRecords(records, {}).canonical;
const { heldCasino } = createTsTestLoader()("src/lib/nightlife/discovery-policy.ts");

test("current RC points match observed destination or named source fields", () => {
  const batch = records.filter(r => r.file.endsWith("/casino-catalog-pass-52.ts"));
  assert.equal(batch.length, qa.records.length);
  for (const record of batch) {
    const proof = qa.records.find(r => r.id === record.id);
    assert.ok(proof, record.id);
    for (const field of ["name", "lat", "lon", "address"]) assert.equal(record[field], proof[field]);
    assert.equal(record.audit.coordinateSource, proof.coordinateSource);
    const point = proof.coordinateEvidence;
    if (point.finalUrl) {
      const place = point.finalUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
      const route = [...point.finalUrl.matchAll(/!1d(-?[\d.]+)!2d(-?[\d.]+)/g)].at(-1);
      assert.ok(place || route, record.id);
      assert.deepEqual([record.lat, record.lon], place ? [Number(place[1]), Number(place[2])] : [Number(route[2]), Number(route[1])]);
    } else {
      assert.deepEqual([record.lat, record.lon], [Number(point.fields.geo.latitude), Number(point.fields.geo.longitude)]);
    }
    assert.equal(heldCasino(record.name, record.lat, record.lon), undefined);
  }
});

test("rejected map centres cannot silently replace verified casino points", () => {
  for (const conflict of qa.sourceConflicts) {
    assert.ok(conflict.reason && conflict.rejectedSource);
    assert.equal(active.some(r => r.lat === conflict.rejectedPoint[0] && r.lon === conflict.rejectedPoint[1]), false, conflict.property);
  }
  const i40 = active.find(r => r.id === "casino-catalog-ok-seminole-i40");
  assert.ok(i40.lat > 35.35, "city-centre listings about ten miles south are not the casino");
  assert.equal(active.some(r => /rivermist|river mist|montego bay|horseshu/i.test(r.name)), false, "documented coordinate/address/scope holds stay out");
});

test("current casinos survive while all reviewed closure aliases remain out of the curated catalog", () => {
  assert.equal(active.filter(r => heldCasino(r.name, r.lat, r.lon)).length, 0);
  for (const id of ["nv-caesars-republic-tahoe", "nv-harrahs-tahoe", "nv-peppermill-wendover", "nv-rainbow-wendover", "ok-kiowa-elk-creek", "ok-kiowa-devol", "ok-kiowa-carnegie"]) {
    assert.equal(active.filter(r => r.id === "casino-catalog-" + id).length, 1);
  }
});
