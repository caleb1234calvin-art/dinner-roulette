import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { ADMISSION_ACCEPTED, ADMISSION_AMENDMENTS, admissionPresentationAfter,
  assertAdmissionConsumerCopy, assertAdmissionPresentationRegistry } from "./test-support/admission-amendments.mjs";

const load = appModuleLoader();
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const readPinned = (file, sha) => {
  const bytes = readFileSync(`scripts/test-support/${file}`);
  assert.equal(hash(bytes), sha, file);
  return JSON.parse(bytes);
};
const baseline = readPinned("admission-released-presentations.json", ADMISSION_ACCEPTED.inputHashes.servedPresentationsFileSha256);
const releasedCatalog = readPinned("admission-released-catalog.json", ADMISSION_ACCEPTED.inputHashes.servedCatalogFileSha256);
// The pinned release receipt holds 61 raw LISTINGS and two already hydrated
// records. Add only absent top-level coordinates from that same frozen receipt;
// retain every explicit coordinate and compare the complete resulting objects.
const releasedPlaces = releasedCatalog.map(record => ({
  ...record,
  ...(!Object.hasOwn(record, "lat") ? { lat: record.seasonalListing.placement.lat } : {}),
  ...(!Object.hasOwn(record, "lon") ? { lon: record.seasonalListing.placement.lon } : {}),
}));
const manifest = readPinned("admission-catalog-file-hashes.json", "8f1186cbef39690daf693a7362ed29d5cbc19d492d17edf122473d8eea94b578");
const files = readdirSync("src/lib/date-night").filter(name => /^missouri-.*catalog\.ts$/.test(name) && name !== "missouri-2026-owner-evidence-catalog.ts").map(name => `src/lib/date-night/${name}`).sort();
const rows = files.flatMap(file => Object.entries(load(file)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, values]) => values));
const { SEASONAL_PRESENTATIONS: allPresentations } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
// Preserve the complete historical 63-record amendment contract. The new exact
// 67-record membership and no-extra gate lives in seasonal-owner-evidence.test.
const newIds = new Set(load("src/lib/date-night/missouri-2026-owner-evidence-catalog.ts").MISSOURI_2026_OWNER_EVIDENCE_CATALOG.map(row => row.seasonalListing.recordId));
const SEASONAL_PRESENTATIONS = Object.fromEntries(Object.entries(allPresentations).filter(([id]) => !newIds.has(id)));
const { seasonalPresentation } = load("src/lib/date-night/seasonal-presentation.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const serializedRows = values => JSON.parse(JSON.stringify([...values].sort((a, b) => a.id.localeCompare(b.id))));

function assertRegistryParity(catalog, presentations) {
  assert.equal(catalog.length, 63);
  assert.equal(new Set(catalog.map(row => row.id)).size, 63, "No duplicate canonical identity");
  assert.equal(new Set(catalog.map(row => row.seasonalListing.recordId)).size, 63, "No duplicate record identity");
  assert.deepEqual(catalog.map(row => row.seasonalListing.recordId).sort(), Object.keys(presentations).sort(), "One presentation per current catalog record");
  for (const row of catalog) assert.equal(presentations[row.seasonalListing.recordId].canonicalId, row.id, row.id);
}

test("admission-only change preserves all 63 catalog bytes, objects, identities and current registry membership", () => {
  assert.equal(manifest.source, ADMISSION_ACCEPTED.baseSha);
  assert.equal(manifest.tree, ADMISSION_ACCEPTED.baseTree);
  assert.deepEqual(files, Object.keys(manifest.files).sort(), "No new, removed or unreviewed catalog file");
  for (const [file, sha] of Object.entries(manifest.files)) assert.equal(hash(readFileSync(file)), sha, file);
  assert.deepEqual(serializedRows(rows), serializedRows(releasedPlaces));
  assertRegistryParity(rows, SEASONAL_PRESENTATIONS);
  for (const row of rows) assert.equal(getCuratedSeasonalPlace(row.id), row);
});

test("exact six approved before/after qualifications preserve every other 57 presentation object", () => {
  assert.equal(ADMISSION_AMENDMENTS.length, 6);
  assert.equal(Object.keys(baseline).length, 63);
  assertAdmissionPresentationRegistry(SEASONAL_PRESENTATIONS, baseline);
  const amended = new Set(ADMISSION_AMENDMENTS.map(row => row.recordId));
  assert.equal(Object.keys(baseline).filter(id => !amended.has(id)).length, 57);
  for (const amendment of ADMISSION_AMENDMENTS) {
    assert.deepEqual(baseline[amendment.recordId], amendment.before);
    assert.deepEqual(SEASONAL_PRESENTATIONS[amendment.recordId], amendment.after);
    const row = rows.find(row => row.id === amendment.canonicalId);
    assert.ok(row);
    assert.equal(row.seasonalListing.listingExpiresAt, amendment.listingExpiresAt);
    assertAdmissionConsumerCopy(amendment.recordId, seasonalPresentation(row).details);
    assert.equal(row.openingHours, null); assert.equal(row.seasonalAvailability.openNowPolicy, "never");
  }
});

test("frozen amendment chain rejects stale before values, changed IDs/confidence, missing facts and extra claims", () => {
  for (const amendment of ADMISSION_AMENDMENTS) {
    const changedBefore = structuredClone(amendment.before); changedBefore.details[0] += " unapproved";
    assert.throws(() => admissionPresentationAfter(amendment.recordId, changedBefore));
    for (const mutate of [
      value => { value.canonicalId = "unapproved-identity"; },
      value => { value.confidence = "limited"; },
      value => { value.details.pop(); },
      value => { value.details.push("All food, camping and activities are free."); },
      value => { value.details[amendment.change.detailsIndex] = "Everything is free."; },
    ]) {
      const bad = structuredClone(SEASONAL_PRESENTATIONS);
      mutate(bad[amendment.recordId]);
      assert.throws(() => assertAdmissionPresentationRegistry(bad, baseline));
    }
    assert.throws(() => assertAdmissionConsumerCopy(amendment.recordId, amendment.before.details));
  }
  const other = Object.keys(baseline).find(id => !ADMISSION_AMENDMENTS.some(row => row.recordId === id));
  const bad = structuredClone(SEASONAL_PRESENTATIONS); bad[other].details.push("Unapproved change to another attraction.");
  assert.throws(() => assertAdmissionPresentationRegistry(bad, baseline));
});

test("global parity gate rejects missing/orphan presentations and duplicate or borrowed catalog identities", () => {
  const missing = structuredClone(SEASONAL_PRESENTATIONS); delete missing[rows[0].seasonalListing.recordId];
  assert.throws(() => assertRegistryParity(rows, missing));
  assert.throws(() => assertRegistryParity(rows, { ...SEASONAL_PRESENTATIONS, ORPHAN: { canonicalId: "orphan", details: [] } }));
  assert.throws(() => assertRegistryParity([...rows.slice(1), rows[1]], SEASONAL_PRESENTATIONS));
  const wrong = structuredClone(SEASONAL_PRESENTATIONS); wrong[rows[0].seasonalListing.recordId].canonicalId = rows[1].id;
  assert.throws(() => assertRegistryParity(rows, wrong));
});
