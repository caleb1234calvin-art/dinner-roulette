import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";

const { records } = await loadCasinoCatalogs();
const { canonical } = auditCasinoRecords(records, {});
const index = JSON.parse(fs.readFileSync("audit/casino-recent-provenance-index-2026-09-13.json", "utf8"));
const resolvePointer = (root, pointer) => pointer.split("/").slice(1).reduce((value, key) => value?.[key], root);

test("recent legacy exports retain their latest source identity and property point", () => {
  const recent = canonical.filter(row => !row.audit && Number(row.file.match(/pass-(\d+)\.ts$/)?.[1]) >= 38);
  assert.deepEqual(index.records.map(row => row.id).sort(), recent.map(row => row.id).sort());
  for (const reference of index.records) {
    assert.match(reference.evidenceFile, /^audit\/[a-z0-9-]+\.json$/);
    const evidence = JSON.parse(fs.readFileSync(reference.evidenceFile, "utf8"));
    const identity = resolvePointer(evidence, reference.identityPointer);
    const point = resolvePointer(evidence, reference.coordinatePointer);
    const active = recent.find(row => row.id === reference.id);
    assert.equal(active.file, reference.recordFile);
    for (const field of ["id", "name", "address"]) assert.equal(active[field], identity[field], active.id + ": " + field);
    assert.deepEqual([active.lat, active.lon], [point.lat, point.lon], active.id);
    assert.ok(reference.sourceUrls.length >= 2, active.id);
    for (const source of reference.sourceUrls) {
      assert.match(source, /^https?:\/\//);
      assert.ok(JSON.stringify(evidence).includes(source), "Source must occur in the referenced evidence");
    }
  }
});
