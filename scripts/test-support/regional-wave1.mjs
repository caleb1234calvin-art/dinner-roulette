import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

export const REGIONAL_PROJECTION_SHA256 = "6924a8b0747e780be1fe90f636d950ca1cdf0ec388435e004b9d35fb0b7ae8bc";
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const bytes = readFileSync("audit/regional-successor-2026-10-14/SELECTED-12-EXACT-ACCEPTED-OBJECTS.json");
assert.equal(sha256(bytes), REGIONAL_PROJECTION_SHA256);
const accepted = JSON.parse(bytes);
assert.equal(accepted.acceptedCombinedSha256, "c0dc677c1acfa64b652581e85e7dbdbed1ab8d75bea6b23272869f0dd9389688");
export const REGIONAL_RECORDS = accepted.records;
export const REGIONAL_IDS = accepted.canonicalIDs;
export const REGIONAL_RECORD_IDS = REGIONAL_RECORDS.map(row => row.seasonalListing.recordId);
export const REGIONAL_PRESENTATIONS = Object.fromEntries(REGIONAL_RECORDS.map(row =>
  [row.seasonalListing.recordId, accepted.presentations[row.id]]));
export const REGIONAL_ROWS = REGIONAL_RECORDS.map(row => ({ ...row,
  lat: row.seasonalListing.placement.lat, lon: row.seasonalListing.placement.lon, openingHours: null,
}));
assert.equal(REGIONAL_RECORDS.length, 12);
assert.equal(new Set(REGIONAL_IDS).size, 12);
assert.equal(new Set(REGIONAL_RECORD_IDS).size, 12);
assert.deepEqual(REGIONAL_RECORDS.map(row => row.id), REGIONAL_IDS);
assert.deepEqual(Object.keys(accepted.presentations).sort(), [...REGIONAL_IDS].sort());
const baselineBytes = readFileSync("scripts/test-support/regional-wave1-baseline.json");
assert.equal(sha256(baselineBytes), "6cce10ba61933192fa414fba1f73212734f43bf79248b76d7d7562cdd90b2d35");
export const REGIONAL_BASELINE = JSON.parse(baselineBytes);
assert.equal(REGIONAL_BASELINE.source, "6c619adda4d9ef3b2683befb2ca874b257505eb2");
assert.equal(REGIONAL_BASELINE.tree, "236110f86f9f3dc8c0cf0a5a664be79e2569bc43");
assert.equal(REGIONAL_BASELINE.catalog.length, 70);
assert.equal(Object.keys(REGIONAL_BASELINE.presentations).length, 70);
assert.equal(Object.keys(REGIONAL_BASELINE.files).length, 16);
// Every checklist sentence comes from the immutable independently accepted
// presentation, never from the new mutable runtime registry.
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const REGIONAL_MATERIAL_FACTS = Object.fromEntries(Object.entries(REGIONAL_PRESENTATIONS)
  .map(([id, presentation]) => [id, presentation.details.map(detail => new RegExp(escape(detail)))]));
export const REGIONAL_CONFIDENCE = Object.fromEntries(Object.entries(REGIONAL_PRESENTATIONS)
  .map(([id, presentation]) => [id, presentation.confidence]));

// New 2026 Wave 2 entries are independently enumerated; the 82-record baseline
// remains exact and the registry may contain *only* these ten additional IDs.
const wave2Bytes = readFileSync("audit/halloween-wave2-2026-10-14/ADAPTED-TEN-FROZEN-INPUTS.json");
const WAVE2_FROZEN = JSON.parse(wave2Bytes);
assert.equal(WAVE2_FROZEN.records.length, 10);
assert.equal(Object.keys(WAVE2_FROZEN.presentations).length, 10);
assert.equal(new Set(WAVE2_FROZEN.identityOrder).size, 10);
const EXPECTED_RELEASED_PRESENTATIONS = { ...REGIONAL_BASELINE.presentations, ...REGIONAL_PRESENTATIONS };
export const WAVE2_EXPECTED_PRESENTATIONS = WAVE2_FROZEN.presentations;
const EXPECTED_92_PRESENTATIONS = { ...EXPECTED_RELEASED_PRESENTATIONS, ...WAVE2_EXPECTED_PRESENTATIONS };
assert.equal(Object.keys(EXPECTED_RELEASED_PRESENTATIONS).length, 82);
assert.equal(Object.keys(EXPECTED_92_PRESENTATIONS).length, 92);
const EXPECTED_92_RECORD_IDS = [
  ...[...REGIONAL_BASELINE.catalog, ...REGIONAL_ROWS].map(row => row.seasonalListing.recordId),
  ...WAVE2_FROZEN.records.map(row => row.seasonalListing.recordId),
];
assert.equal(new Set(EXPECTED_92_RECORD_IDS).size, 92);

const normalized = rows => JSON.parse(JSON.stringify(rows)).sort((a, b) => a.id.localeCompare(b.id));
export function assertRegionalCatalog(rows, presentations) {
  assert.equal(rows.length, 82, "Exactly released 70 plus independently selected 12");
  assert.equal(new Set(rows.map(row => row.id)).size, 82, "No duplicate canonical IDs");
  assert.equal(new Set(rows.map(row => row.seasonalListing.recordId)).size, 82, "No duplicate record IDs");
  assert.deepEqual(normalized(rows), normalized([...REGIONAL_BASELINE.catalog, ...REGIONAL_ROWS]),
    "Complete immutable released and independently accepted objects, without missing or extra fields");
  assert.deepEqual(presentations, EXPECTED_92_PRESENTATIONS,
    "Immutable 82-presentation baseline plus exact ten Wave 2 additions, with no orphan, replacement or altered field");
  assert.deepEqual(Object.keys(presentations).sort(), EXPECTED_92_RECORD_IDS.slice().sort());
  for (const row of [...rows, ...WAVE2_FROZEN.records])
    assert.equal(presentations[row.seasonalListing.recordId].canonicalId, row.id);
}
export function releasedSeventyPresentationsOnly(registry) {
  assert.deepEqual(registry, EXPECTED_92_PRESENTATIONS, "Only frozen 82 plus approved ten presentation IDs");
  const legacy = Object.fromEntries(Object.entries(registry).filter(([id]) => !REGIONAL_RECORD_IDS.includes(id)));
  assert.deepEqual(legacy, REGIONAL_BASELINE.presentations, "All 70 legacy presentations remain exact");
  return legacy;
}
