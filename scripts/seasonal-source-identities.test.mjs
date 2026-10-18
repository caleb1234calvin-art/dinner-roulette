import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { readBoundIdentityInventories, validateIdentityInventory } from "./seasonal-source-identities.mjs";

const AT = Date.parse("2026-10-18T14:00:00.000Z");
const inventories = readBoundIdentityInventories();
const copy = value => JSON.parse(JSON.stringify(value));
const validate = (kind, value = inventories[kind], now = AT) => validateIdentityInventory(value, { kind, now });
const canonical = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]));
  return value;
}
const digest = value => createHash("sha256").update(canonical(value)).digest("hex");

test("real immutable inventories bind all 92 published and 20 pending identities", () => {
  const published = validate("published"), pending = validate("pending");
  assert.equal(published.valid, true);
  assert.equal(pending.valid, true);
  assert.equal(published.records.length, 92);
  assert.equal(pending.records.length, 20);
  assert.equal(new Set([...published.records, ...pending.records].map(row => row.id)).size, 112);
  assert.equal(published.sourceRevision, "c3208d9fdc9a21d698efa9254be1286f5d3d2836");
  assert.equal(pending.sourceRevision, "d0f09d4c20938a40dab70c96bc8bd53ba598bebd");
  for (const result of [published, pending]) {
    assert.equal(result.factualFreshness, "not-established");
    assert.equal(result.runtimeApproval, false);
  }
});

test("seven expired published identities and one held negative identity are never filtered out", () => {
  const published = validate("published"), pending = validate("pending");
  const expired = published.records.filter(row => row.expiredAsOfObservation);
  assert.equal(expired.length, 7);
  assert.ok(expired.every(row => row.negativeSignals.includes("source-bound-listing-expired")));
  assert.ok(expired.some(row => row.id === "date-night-mo26-071-pomme-de-terror"));
  assert.ok(expired.some(row => row.id === "date-night-mo26-096-meramec-spooktacular"));
  assert.equal(pending.negativeRecords.length, 1);
  const acres = pending.negativeRecords[0];
  assert.equal(acres.id, "date-night-ks26-acres");
  assert.equal(acres.factualStatus, "HOLD");
  assert.equal(acres.lifecycle, null); // HOLD is not a fabricated closure.
  assert.deepEqual(acres.negativeSignals, ["documented-hold"]);
  assert.equal(acres.holdSource.gitBlob, "d8ce11eea64df9bbf5d7a754e7188c00555139e3");
  assert.ok(acres.aliases.includes("HELLS Gate"));
});

test("pending evidence remains factual-qualified history with due freshness and no runtime acceptance", () => {
  const result = validate("pending");
  assert.ok(result.records.every(row => row.factualStatus === "INHERITED_EXACT_OBJECT_QUALIFIED_PASS"));
  assert.ok(result.records.every(row => row.runtimeStatus === "NOT_RUN" && row.releaseStatus === "NO_APPROVAL"));
  assert.ok(result.records.every(row => row.sourceFreshness === "due-or-overdue-as-of-observation"));
  assert.ok(result.records.every(row => row.visibility === "halloween-layer" && row.openNowPolicy === "never"));
  assert.equal(result.records.filter(row => row.expiredAsOfObservation).length, 0);
});

test("arbitrary empty/raw/partial inventories cannot establish complete authority", () => {
  for (const value of [undefined, null, [], {}, { records: [], completeness: "complete", expectedCount: 0 },
    { ...inventories.pending, records: [] }, { ...inventories.pending, records: inventories.pending.records.slice(1) },
    { ...inventories.pending, completeness: "partial" }, { ...inventories.pending, completeness: "unknown" }]) {
    const result = validateIdentityInventory(value, { kind: "pending", now: AT });
    assert.equal(result.valid, false);
    assert.equal(Object.hasOwn(result, "records"), false);
  }
});

test("caller counts, revised hashes and invented authority cannot replace the independently pinned receipt", () => {
  const changed = copy(inventories.pending);
  changed.records[0].name = "Unreviewed replacement";
  changed.recordsSha256 = digest(changed.records);
  assert.equal(validate("pending", changed).valid, false);
  assert.equal(validate("pending", { ...inventories.pending, expectedCount: 92 }).valid, false);
  assert.equal(validate("pending", { ...inventories.published, kind: "pending" }).valid, false);
  assert.equal(validateIdentityInventory(inventories.pending, { kind: "invented", now: AT }).valid, false);
});

test("each source binding and policy boundary is covered by the immutable inventory digest", () => {
  for (const key of ["sourceRevision", "sourceTree", "sourcePath", "recordsSha256", "negativeRecordsSha256",
    "repository", "observedAt", "expiresAt", "runtimeApproval", "factualFreshness"]) {
    const changed = copy(inventories.pending);
    changed[key] = key === "runtimeApproval" ? true : String(changed[key]) + "x";
    assert.equal(validate("pending", changed).valid, false, key);
  }
  const changed = copy(inventories.pending);
  changed.sourceBlobs[0].gitBlob = "0".repeat(40);
  assert.equal(validate("pending", changed).valid, false);
});

test("identity names, aliases, address, URL, expiration and negative status cannot be edited", () => {
  for (const key of ["id", "recordId", "name", "address", "website", "operatorUrl", "listingExpiresAt",
    "sourcePath", "sourceBlob", "lifecycle", "sourceFreshness"]) {
    const changed = copy(inventories.pending);
    changed.records[0][key] = "unreviewed";
    assert.equal(validate("pending", changed).valid, false, key);
  }
  for (const mutate of [value => { value.negativeRecords = []; },
    value => { value.negativeRecords[0].factualStatus = "PASS"; },
    value => { value.negativeRecords[0].aliases = []; },
    value => { value.records[0].aliases.push("Unreviewed alias"); }]) {
    const changed = copy(inventories.pending); mutate(changed);
    assert.equal(validate("pending", changed).valid, false);
  }
  const changed = copy(inventories.published);
  changed.records.find(row => row.expiredAsOfObservation).expiredAsOfObservation = false;
  assert.equal(validate("published", changed).valid, false);
});

test("complete receipt validity is half-open and fails closed before observation and at expiration", () => {
  const inventory = inventories.pending;
  const observed = Date.parse(inventory.observedAt), expires = Date.parse(inventory.expiresAt);
  assert.equal(validate("pending", inventory, observed - 1).reason, "identity-inventory-not-yet-observed");
  assert.equal(validate("pending", inventory, observed).valid, true);
  assert.equal(validate("pending", inventory, expires - 1).valid, true);
  assert.equal(validate("pending", inventory, expires).reason, "identity-inventory-expired");
  assert.equal(validate("pending", inventory, expires + 1).reason, "identity-inventory-expired");
  for (const bad of [NaN, Infinity, -Infinity, "2026-10-18T14:00:00Z", null])
    assert.equal(validate("pending", inventory, bad).reason, "identity-inventory-invalid-clock");
});

test("invalid and normalized dates or a widened time window fail closed", () => {
  for (const observedAt of ["2026-02-30T13:41:16.000Z", "2026-10-18", "2026-10-18T13:41:16Z", "not-a-date"]) {
    assert.equal(validate("pending", { ...inventories.pending, observedAt }).valid, false);
  }
  assert.equal(validate("pending", { ...inventories.pending, expiresAt: "2026-10-20T19:41:16.000Z" }).valid, false);
});

test("same-count duplicates and reordered or missing negative entries are not accepted", () => {
  const duplicate = copy(inventories.pending);
  duplicate.records[1] = copy(duplicate.records[0]);
  assert.equal(validate("pending", duplicate).reason, "identity-inventory-invalid-identities");
  assert.equal(validate("pending", { ...inventories.pending, records: [...inventories.pending.records].reverse() }).valid, false);
  assert.equal(validate("pending", { ...inventories.pending, negativeRecords: undefined }).valid, false);
});

test("validation returns detached deeply frozen identity and negative records", () => {
  const input = copy(inventories.pending), result = validate("pending", input);
  assert.equal(result.valid, true);
  input.records[0].name = "changed after validation";
  input.negativeRecords[0].aliases.length = 0;
  assert.notEqual(result.records[0].name, input.records[0].name);
  assert.ok(result.negativeRecords[0].aliases.includes("HELLS Gate"));
  assert.ok(Object.isFrozen(result.records[0]));
  assert.ok(Object.isFrozen(result.negativeRecords[0].aliases));
  assert.throws(() => { result.records[0].name = "mutated"; }, TypeError);
});

test("cycles, nonfinite values, accessors and excessive inputs fail closed", () => {
  const cycle = copy(inventories.pending); cycle.extra = cycle;
  assert.equal(validate("pending", cycle).valid, false);
  for (const extra of [NaN, Infinity, new Date(), "x".repeat(65_537), () => true])
    assert.equal(validate("pending", { ...inventories.pending, extra }).valid, false);
  const accessor = copy(inventories.pending);
  Object.defineProperty(accessor, "extra", { enumerable: true, get() { throw new Error("must reject"); } });
  assert.equal(validate("pending", accessor).valid, false);
});

test("missing data or a tampered manifest cannot silently become complete inventory", async t => {
  const root = mkdtempSync(join(tmpdir(), "seasonal-identity-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts"));
  const modulePath = join(root, "scripts", "seasonal-source-identities.mjs");
  writeFileSync(modulePath, readFileSync(new URL("./seasonal-source-identities.mjs", import.meta.url)));
  const isolated = await import(pathToFileURL(modulePath).href);
  const missing = isolated.readBoundIdentityInventories();
  assert.equal(missing.pending.completeness, "unknown");
  assert.equal(isolated.validateIdentityInventory(missing.pending, { kind: "pending", now: AT }).valid, false);
  const data = join(root, "audit/seasonal-source-discovery-2026-10-18/identity-inventories");
  mkdirSync(data, { recursive: true });
  cpSync(new URL("../audit/seasonal-source-discovery-2026-10-18/identity-inventories/", import.meta.url), data, { recursive: true });
  assert.equal(isolated.validateIdentityInventory(inventories.pending, { kind: "pending", now: AT }).valid, true);
  const manifestPath = join(data, "pending-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.expectedCount = 0;
  writeFileSync(manifestPath, JSON.stringify(manifest));
  assert.equal(isolated.validateIdentityInventory(inventories.pending, { kind: "pending", now: AT }).reason,
    "identity-inventory-untrusted-manifest");
});
