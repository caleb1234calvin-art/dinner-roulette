import { occurrencePresentationAfter } from "./occurrence-amendments.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Independent accepted projection, never generated from mutable runtime copy.
export const ADMISSION_ACCEPTED_SHA256 = "3fbf5703bb2f8bfea4b793b5fb1e8f5defd2f0dbe543adf6cea7f8d1d20140ce";
const bytes = readFileSync(new URL("./admission-approved-amendments.json", import.meta.url));
assert.equal(createHash("sha256").update(bytes).digest("hex"), ADMISSION_ACCEPTED_SHA256);
export const ADMISSION_ACCEPTED = JSON.parse(bytes);
export const ADMISSION_AMENDMENTS = ADMISSION_ACCEPTED.amendments;
assert.equal(ADMISSION_ACCEPTED.baseSha, "2cb05f37126eebd10de3182f1f8db40434e7d557");
assert.equal(ADMISSION_ACCEPTED.expectedIdentityCount, 63);
assert.deepEqual(ADMISSION_AMENDMENTS.map(row => row.recordId).sort(),
  ["MO26-019", "MO26-030", "MO26-034", "MO26-071", "MO26-115", "MO26-116"]);
for (const amendment of ADMISSION_AMENDMENTS) {
  const { before, after, change, recordId } = amendment;
  assert.equal(before.canonicalId, amendment.canonicalId, recordId);
  assert.equal(after.canonicalId, amendment.canonicalId, recordId);
  assert.ok(["insert", "replace"].includes(change.operation), recordId);
  const expected = structuredClone(before);
  if (change.operation === "replace") assert.equal(expected.details[change.detailsIndex], change.oldText, recordId);
  else assert.equal(change.oldText, null, recordId);
  expected.details.splice(change.detailsIndex, change.operation === "replace" ? 1 : 0, change.newText);
  assert.deepEqual(after, expected, `${recordId}: only the exact accepted operation`);
}

/** Historical snapshots remain immutable; accept only this explicit before/after
 * link. A changed prior value, confidence, ID or unapproved extra detail fails. */
export function admissionPresentationAfter(recordId, before) {
  const amendment = ADMISSION_AMENDMENTS.find(row => row.recordId === recordId);
  if (!amendment) return occurrencePresentationAfter(recordId, before);
  assert.deepEqual(before, amendment.before, `${recordId}: admission amendment starts at the exact frozen presentation`);
  return structuredClone(amendment.after);
}

/** Browser callers pass actual paragraph strings for exact copy equality, or
 * actual card text when inspecting the complete rendered Details container. */
export function assertAdmissionConsumerCopy(recordId, detailsOrText) {
  const amendment = ADMISSION_AMENDMENTS.find(row => row.recordId === recordId);
  if (!amendment) return;
  if (Array.isArray(detailsOrText)) {
    assert.deepEqual(detailsOrText, amendment.after.details, `${recordId}: exact approved Details`);
    return;
  }
  assert.equal(typeof detailsOrText, "string");
  for (const detail of amendment.after.details) assert.ok(detailsOrText.includes(detail), `${recordId}: missing approved fact: ${detail}`);
  assert.equal(detailsOrText.split(amendment.change.newText).length - 1, 1, `${recordId}: admission qualification appears exactly once`);
}

export function assertAdmissionPresentationRegistry(presentations, baseline) {
  assert.deepEqual(Object.keys(presentations).sort(), Object.keys(baseline).sort(), "Admission amendments add/remove no presentation identity");
  for (const [recordId, before] of Object.entries(baseline)) {
    assert.deepEqual(presentations[recordId], admissionPresentationAfter(recordId, before), recordId);
  }
}
