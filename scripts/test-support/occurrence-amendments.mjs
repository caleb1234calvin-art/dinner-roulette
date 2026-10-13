import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const hash = value => createHash("sha256").update(value).digest("hex");
export const OCCURRENCE_CLEARANCE_SHA256 = "9bdbdf739844bfb8884c9fb0342a2ef08abe07cd5917ab071450d2e2e512e993";
const bytes = readFileSync(new URL("./occurrence-cleared-projections.json", import.meta.url));
assert.equal(hash(bytes), OCCURRENCE_CLEARANCE_SHA256);
export const OCCURRENCE_CLEARANCE = JSON.parse(bytes);
export const OCCURRENCE_AMENDMENTS = OCCURRENCE_CLEARANCE.exactProjections;
assert.equal(OCCURRENCE_CLEARANCE.baseCommit, "8353e60056fb0568360c5c13878d102880395d9f");
assert.equal(OCCURRENCE_CLEARANCE.allOtherRuntimeChanges, false);
assert.deepEqual(OCCURRENCE_AMENDMENTS.map(row => row.recordId), ["DELTA2-HOLLOWS", "DELTA2-MISSOURI-NIGHTMARE"]);
assert.equal(OCCURRENCE_AMENDMENTS.reduce((n, row) => n + row.catalogFields.length + row.presentationFields.length, 0), 13);
const sourceBytes = readFileSync(new URL("./occurrence-source-baselines.json", import.meta.url));
assert.equal(hash(sourceBytes), "728a3351b23b18158093435195cd50cc0cf94cf23846130d1380788a3b3a63f7");
const sources = JSON.parse(sourceBytes);

function project(value, fields, reverse = false, prefix = 0) {
  const result = structuredClone(value);
  for (const field of fields) {
    const keys = field.path.split(".").slice(prefix);
    let target = result;
    for (const key of keys.slice(0, -1)) target = target[key];
    const key = keys.at(-1);
    assert.deepEqual(target[key], reverse ? field.after : field.before, `Exact amendment ${field.path}`);
    target[key] = structuredClone(reverse ? field.before : field.after);
  }
  return result;
}
export function occurrenceCatalogAfter(row) {
  const amendment = OCCURRENCE_AMENDMENTS.find(item => item.canonicalId === row.id);
  return amendment ? project(row, amendment.catalogFields) : row;
}
export function occurrenceCatalogBefore(row) {
  const amendment = OCCURRENCE_AMENDMENTS.find(item => item.canonicalId === row.id);
  return amendment ? project(row, amendment.catalogFields, true) : row;
}
export function occurrencePresentationAfter(recordId, before) {
  const amendment = OCCURRENCE_AMENDMENTS.find(item => item.recordId === recordId);
  return amendment ? project(before, amendment.presentationFields, false, 2) : before;
}
export function occurrencePresentationBefore(recordId, after) {
  const amendment = OCCURRENCE_AMENDMENTS.find(item => item.recordId === recordId);
  return amendment ? project(after, amendment.presentationFields, true, 2) : after;
}
/** Historical byte receipts remain immutable. Only these fully pinned current
 * files can be mapped back to their fully pinned original source bytes. Other
 * source files are returned unmodified and retain their old byte-level gate. */
export function occurrenceSourceBefore(file) {
  const bytes = readFileSync(file);
  const source = sources[file];
  if (!source) return bytes;
  assert.equal(hash(bytes), source.afterSha256, `${file}: exact amended source`);
  assert.equal(hash(source.beforeSource), source.beforeSha256, `${file}: exact historical source`);
  return Buffer.from(source.beforeSource);
}
export function assertOccurrenceConsumerCopy(recordId, detailsOrText) {
  const amendment = OCCURRENCE_AMENDMENTS.find(item => item.recordId === recordId);
  if (!amendment) return;
  for (const field of amendment.presentationFields) {
    const expected = Array.isArray(field.after) ? field.after : [field.after];
    if (Array.isArray(detailsOrText)) {
      if (field.path.endsWith(".details")) assert.deepEqual(detailsOrText, expected);
      else assert.equal(detailsOrText[Number(field.path.split(".").at(-1))], field.after);
    } else for (const detail of expected) assert.ok(detailsOrText.includes(detail), `${recordId}: missing ${detail}`);
  }
  const text = Array.isArray(detailsOrText) ? detailsOrText.join(" ") : detailsOrText;
  assert.doesNotMatch(text, /November 1 event ends|First occurrence starts at 7 p\.m\.|Confirmed ticket dates: October 9, 10, 24 and 30/);
}
