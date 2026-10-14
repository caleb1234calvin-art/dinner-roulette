import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// This reviewed fixture is independent of the mutable application registry. The
// original R2 source projection is retained; only the explicit R3 copy receipt
// may amend it. New acceptance requires independent review of this pinned file.
export const WAVE2_ORACLE_SHA256 = "7024f4159d20eb1e6799808792e93293ee3eb97df4d159262a5d24637ea98aaa";
const bytes = readFileSync("scripts/test-support/wave2-browser-oracle.json");
assert.equal(createHash("sha256").update(bytes).digest("hex"), WAVE2_ORACLE_SHA256);
const frozen = JSON.parse(bytes);
export const WAVE2_IDS = [
  "date-night-ks26-walters", "date-night-il26-w1-spook", "date-night-il26-w1-boo",
  "date-night-il26-w1-sonny-acres-haunted-experiences", "date-night-il26-w1-hayride-horror-bayou",
  "date-night-il26-w1-217", "date-night-il26-w1-paintball", "date-night-il26-w1-chitty",
  "date-night-ks26-nightmare", "date-night-ar26-royal",
];
export const WAVE2_OFF_IDS = ["date-night-ks26-walters", "date-night-ks26-nightmare"];
export const WAVE2_RECORDS = frozen.records;
export const WAVE2_ROWS = WAVE2_RECORDS.map(row => ({ ...row,
  lat: row.seasonalListing.placement.lat, lon: row.seasonalListing.placement.lon, openingHours: null,
}));
export const WAVE2_PRESENTATIONS = frozen.presentations;
const originalBytes = readFileSync("audit/halloween-wave2-2026-10-14/ADAPTED-TEN-R2-PRE-TAKEOVER.json");
assert.equal(createHash("sha256").update(originalBytes).digest("hex"),
  "6ba010aced6367e52b7f0e1b269801b5e6605d2e44dd5275219bbcc08b6d20af",
  "Preserve the exact original evidence before the narrow copy amendments");
const original = JSON.parse(originalBytes);
const amendedIds = ["date-night-il26-w1-sonny-acres-haunted-experiences", "date-night-il26-w1-hayride-horror-bayou", "date-night-il26-w1-chitty"];
for (const row of WAVE2_RECORDS) {
  const before = original.records.find(record => record.id === row.id);
  assert.ok(before);
  assert.deepEqual({ ...row, seasonalVisitNotes: before.seasonalVisitNotes }, before,
    "Copy remediation cannot change an identity, source schedule, placement, expiry or other factual object field");
  const id = row.seasonalListing.recordId;
  if (!amendedIds.includes(row.id)) {
    assert.deepEqual(row, before);
    assert.deepEqual(WAVE2_PRESENTATIONS[id], original.presentations[id]);
  } else {
    assert.deepEqual({ ...WAVE2_PRESENTATIONS[id], details: original.presentations[id].details }, original.presentations[id],
      "Copy remediation preserves the original confidence and canonical identity");
    assert.deepEqual(row.seasonalVisitNotes, WAVE2_PRESENTATIONS[id].details);
  }
}

assert.deepEqual(frozen.identityOrder, WAVE2_IDS);
assert.deepEqual(WAVE2_RECORDS.map(row => row.id), WAVE2_IDS);
assert.equal(new Set(WAVE2_RECORDS.map(row => row.seasonalListing.recordId)).size, 10);
assert.equal(Object.keys(WAVE2_PRESENTATIONS).length, 10);
assert.deepEqual(WAVE2_RECORDS.filter(row => row.seasonalListing.visibility === "listing-lifecycle").map(row => row.id), WAVE2_OFF_IDS);
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const WAVE2_MATERIAL_FACTS = Object.fromEntries(Object.entries(WAVE2_PRESENTATIONS)
  .map(([id, presentation]) => [id, presentation.details.map(detail => new RegExp(escape(detail)))]));
export const WAVE2_CONFIDENCE = Object.fromEntries(Object.entries(WAVE2_PRESENTATIONS)
  .map(([id, presentation]) => [id, presentation.confidence]));
export function assertWave2Catalog(rows, presentations) {
  assert.deepEqual(rows, WAVE2_ROWS, "All ten runtime identities, schedules, expiry and copy match the independently frozen oracle");
  assert.deepEqual(rows.filter(row => row.seasonalListing.visibility === "listing-lifecycle").map(row => row.id), WAVE2_OFF_IDS,
    "Only Walters and Nightmare have independently source-scoped OFF visibility");
  for (const row of rows) assert.deepEqual(presentations[row.seasonalListing.recordId], WAVE2_PRESENTATIONS[row.seasonalListing.recordId]);
}

// Explicit per-record completion manifest: a total alone cannot substitute one
// repeated scenario for a missing expiry, filter, Details or history journey.
export const WAVE2_RECORD_SCENARIOS = [
  "consumer-anything-category-320", "consumer-anything-category-390", "consumer-anything-category-512",
  "open-now", "ended", "next-year", "season-off", "radius-exclusion", "mixed-alias-toggle-cache",
  "resume-expiry-options", "resume-expiry-result", "provider-failure", "favorite-alias-cache-resume-unsave",
  "negative-alias-beats-canonical-favorite", "alias-exclusion-expiry-and-not-tonight",
  "affirmed-favorites-direct-reload-expiry", "qualified-night-plan", "supported-category-matrix",
  "negative-lifecycle-permanently-closed", "negative-lifecycle-disused", "history-choice-reload-expiry",
  "explicit-nonseasonal-filter", "pending-rpc-at-expiry", "november5-expired-negative",
];
assert.equal(WAVE2_RECORD_SCENARIOS.length, 24);
assert.equal(new Set(WAVE2_RECORD_SCENARIOS).size, 24);

export const WAVE2_RADIUS_SHA256 = "2a49ffd42e700f2cfd79e8f9127b9f778548993fb9f3d39169f15acdb56412d0";
const radiusBytes = readFileSync("scripts/test-support/wave2-radius-oracle.json");
assert.equal(createHash("sha256").update(radiusBytes).digest("hex"), WAVE2_RADIUS_SHA256);
const radiusOracle = JSON.parse(radiusBytes);
assert.equal(radiusOracle.sourceSha, "0336b55a2a059423c8d5c0dc4f52f79b71bdcacc");
assert.deepEqual(radiusOracle.canonicalIds, [...WAVE2_IDS].sort());
export const WAVE2_LOCATIONS = radiusOracle.locations.map(location => ({ ...location,
  label: `${location.locality}, ${location.region}, United States`, source: "manual", country: "United States", countryCode: "US",
}));
assert.deepEqual(WAVE2_LOCATIONS.map(location => location.key), ["KS", "AR", "IL-N", "IL-C"]);
for (const location of WAVE2_LOCATIONS) {
  assert.deepEqual(Object.keys(location.measurements).sort(), [...WAVE2_IDS].sort());
  for (const radius of [1, 15, 25, 30, 50]) assert.ok(location.expected[radius].length <= 4,
    "Literal expected membership must fit the real four-card shortlist");
}
export const WAVE2_EXPECTED_SCENARIO_COUNT = 277;
assert.equal(WAVE2_EXPECTED_SCENARIO_COUNT, 10 * 24 + 32 + 4 + 1);
