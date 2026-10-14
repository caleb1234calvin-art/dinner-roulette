import { assertRegionalCatalog, releasedSeventyPresentationsOnly, REGIONAL_IDS } from "./regional-wave1.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
export const THREE_CLEARED_PROJECTION_SHA256 = "40af9e9076b7d18f9f037e3e7e75a980630e66f760d866abae1dd6a4062438e3";
const bytes = readFileSync("audit/three-cleared-2026-10-13/CLEARED-PROJECTIONS-R1.json");
assert.equal(createHash("sha256").update(bytes).digest("hex"), THREE_CLEARED_PROJECTION_SHA256);
const accepted = JSON.parse(bytes);
assert.equal(accepted.baseCommit, "3b6b9ed0f4be1581b3b541207b2637183fff57d3");
export const THREE_CLEARED_RECORDS = accepted.exactRecords;
export const THREE_CLEARED_PRESENTATIONS = accepted.exactPresentations;
export const THREE_CLEARED_IDS = ["date-night-mo26-delta-rowe-crop-farm", "date-night-mo26-096-meramec-spooktacular", "date-night-mo26-046-pets-and-pumpkins"];
export const THREE_CLEARED_RECORD_IDS = ["DELTA-ROWE-CROP-FARM-2026", "MO26-096", "MO26-046"];
assert.deepEqual(THREE_CLEARED_RECORDS.map(row => row.id), THREE_CLEARED_IDS);
assert.deepEqual(Object.keys(THREE_CLEARED_PRESENTATIONS), THREE_CLEARED_RECORD_IDS);
const baselineBytes = readFileSync("scripts/test-support/three-cleared-baseline.json");
assert.equal(createHash("sha256").update(baselineBytes).digest("hex"), "cf19a8c41d3c6f49a5a3d9e56dff5525baeb3c5e2c78b2bfc838aec4ac729074");
export const THREE_CLEARED_BASELINE = JSON.parse(baselineBytes);
export const THREE_CLEARED_MATERIAL_FACTS = {
  "DELTA-ROWE-CROP-FARM-2026": [/September 12–October 25, 2026/, /Wednesday\/Thursday opening is pumpkin barn store only/, /Wednesday–Thursday 10 a\.m\.–3 p\.m\./, /Last admission is not stated/, /Location is approximate/],
  "MO26-096": [/October 17, 2026 in the campground/, /trick-or-treating starts at 5 p\.m\./, /Final end time is unconfirmed/, /no registration required/, /road closes to vehicle traffic at 4:45 p\.m\./, /does not identify campground parking or an entrance/],
  "MO26-046": [/October 24, 2026, 11 a\.m\.–4 p\.m\./, /Park Central Square/, /Rain or shine/, /about 2:15 p\.m\. on Park Central East next to Civil Kitchen/, /not an admission entrance or ride-dropoff point/],
};
export const THREE_CLEARED_CONFIDENCE = { "DELTA-ROWE-CROP-FARM-2026": "good", "MO26-096": "good", "MO26-046": "high" };
// Historical suites retain their complete released registry, after affirming the
// entire current registry has exactly the pinned three additions and no edits.
export function releasedPresentationsOnly(registry) {
  registry = releasedSeventyPresentationsOnly(registry);
  assert.deepEqual(registry, { ...THREE_CLEARED_BASELINE.presentations, ...THREE_CLEARED_PRESENTATIONS });
  return Object.fromEntries(Object.entries(registry).filter(([id]) => !THREE_CLEARED_RECORD_IDS.includes(id)));
}
export function assertThreeClearedCatalog(rows, presentations) {
  assertRegionalCatalog(rows, presentations);
  rows = rows.filter(row => !REGIONAL_IDS.includes(row.id));
  const normalize = values => JSON.parse(JSON.stringify(values)).sort((a, b) => a.id.localeCompare(b.id));
  const newRows = THREE_CLEARED_RECORDS.map(row => ({ ...row, lat: row.seasonalListing.placement.lat, lon: row.seasonalListing.placement.lon }));
  assert.deepEqual(normalize(rows), normalize([...THREE_CLEARED_BASELINE.catalog, ...newRows]));
  assert.equal(rows.length, 70); assert.equal(new Set(rows.map(row => row.id)).size, 70);
  releasedPresentationsOnly(presentations);
}
