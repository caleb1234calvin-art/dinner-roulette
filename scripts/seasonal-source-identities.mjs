import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";

// Offline collision/exclusion authority only. These anchors bind reviewed source
// membership, not operator freshness, runtime eligibility or permission to publish.
const DIRECTORY = new URL("../audit/seasonal-source-discovery-2026-10-18/identity-inventories/", import.meta.url);
const ANCHORS = Object.freeze({
  published: Object.freeze({ count: 92, negativeCount: 0,
    manifestSha256: "d31e4cf56b613008fb96fd6d800dd50c1e87e4832615fcfd457181c8999138cb" }),
  pending: Object.freeze({ count: 20, negativeCount: 1,
    manifestSha256: "777a829096096a9064b6e8c3919ef33fa6b884478d0098983590f1822b3137ff" }),
});
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_NODES = 100_000;
const SHA256 = /^[a-f0-9]{64}$/;
const GIT_SHA = /^[a-f0-9]{40}$/;
const ISO_INSTANT = /^20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/;
const sha256 = value => createHash("sha256").update(value).digest("hex");
const plainObject = value => value !== null && typeof value === "object" &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

function canonicalJSON(value) {
  let nodes = 0;
  let stringBytes = 0;
  const ancestors = new Set();
  function visit(item, depth) {
    if (++nodes > MAX_NODES || depth > 24) throw new Error("inventory-size");
    if (item === null || typeof item === "boolean") return item;
    if (typeof item === "number") {
      if (!Number.isFinite(item)) throw new Error("inventory-non-json");
      return item;
    }
    if (typeof item === "string") {
      stringBytes += Buffer.byteLength(item);
      if (item.length > 65_536 || stringBytes > MAX_BYTES) throw new Error("inventory-size");
      return item;
    }
    if ((!Array.isArray(item) && !plainObject(item)) || ancestors.has(item))
      throw new Error("inventory-non-json");
    ancestors.add(item);
    let result;
    if (Array.isArray(item)) {
      if (item.length > 10_000 || Object.keys(item).length !== item.length)
        throw new Error("inventory-array");
      result = item.map(child => visit(child, depth + 1));
    } else {
      const keys = Object.keys(item).sort();
      if (keys.length > 1000 || Object.getOwnPropertySymbols(item).length)
        throw new Error("inventory-object");
      result = Object.fromEntries(keys.map(key => {
        const descriptor = Object.getOwnPropertyDescriptor(item, key);
        if (!descriptor || !("value" in descriptor) || key.length > 512)
          throw new Error("inventory-non-json");
        return [key, visit(descriptor.value, depth + 1)];
      }));
    }
    ancestors.delete(item);
    return result;
  }
  const serialized = JSON.stringify(visit(value, 0));
  if (Buffer.byteLength(serialized) > MAX_BYTES) throw new Error("inventory-size");
  return serialized;
}

function readBoundedJSON(filename) {
  const url = new URL(filename, DIRECTORY);
  const size = statSync(url).size;
  if (size < 2 || size > MAX_BYTES) throw new Error("inventory-file-size");
  const bytes = readFileSync(url);
  if (bytes.length !== size || bytes.length > MAX_BYTES) throw new Error("inventory-file-size");
  return { bytes, value: JSON.parse(bytes.toString("utf8")) };
}

function exactInstant(value) {
  if (typeof value !== "string" || !ISO_INSTANT.test(value)) return NaN;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value ? time : NaN;
}

function freeze(value) {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

function invalid(reason) {
  return Object.freeze({ valid: false, reason, factualFreshness: "not-established", runtimeApproval: false });
}

/** Verify against module-pinned manifests, never against caller-provided counts
 * or digests alone. Expired identities remain in records; held identities remain
 * in negativeRecords. Neither returned array may be interpreted as active venues. */
export function validateIdentityInventory(inventory, { kind, now = Date.now() } = {}) {
  if (typeof kind !== "string" || !Object.hasOwn(ANCHORS, kind)) return invalid("identity-inventory-unknown-kind");
  if (typeof now !== "number" || !Number.isFinite(now)) return invalid("identity-inventory-invalid-clock");
  const anchor = ANCHORS[kind];
  try {
    const { bytes, value: manifest } = readBoundedJSON(`${kind}-manifest.json`);
    if (sha256(bytes) !== anchor.manifestSha256)
      return invalid("identity-inventory-untrusted-manifest");
    if (!plainObject(inventory) || inventory.schemaVersion !== 1 || inventory.kind !== kind ||
      inventory.completeness !== "complete" || inventory.expectedCount !== anchor.count ||
      !Array.isArray(inventory.records) || inventory.records.length !== anchor.count ||
      !Array.isArray(inventory.negativeRecords) || inventory.negativeRecords.length !== anchor.negativeCount ||
      inventory.factualFreshness !== "not-established" || inventory.runtimeApproval !== false)
      return invalid("identity-inventory-incomplete");
    if (manifest.expectedCount !== anchor.count || manifest.negativeCount !== anchor.negativeCount ||
      manifest.kind !== kind || !GIT_SHA.test(inventory.sourceRevision) || !GIT_SHA.test(inventory.sourceTree) ||
      !SHA256.test(inventory.recordsSha256) || !SHA256.test(inventory.negativeRecordsSha256))
      return invalid("identity-inventory-invalid-authority");
    const observed = exactInstant(inventory.observedAt);
    const expires = exactInstant(inventory.expiresAt);
    if (!Number.isFinite(observed) || !Number.isFinite(expires) || expires <= observed ||
      expires - observed > 6 * 60 * 60 * 1000)
      return invalid("identity-inventory-invalid-window");
    if (now < observed) return invalid("identity-inventory-not-yet-observed");
    if (now >= expires) return invalid("identity-inventory-expired");
    const all = [...inventory.records, ...inventory.negativeRecords];
    if (all.some(record => !plainObject(record) || typeof record.id !== "string" || !record.id.trim() ||
      typeof record.name !== "string" || !record.name.trim()) || new Set(all.map(record => record.id)).size !== all.length)
      return invalid("identity-inventory-invalid-identities");
    const serialized = canonicalJSON(inventory);
    if (sha256(serialized) !== manifest.inventorySha256 ||
      sha256(canonicalJSON(inventory.records)) !== manifest.recordsSha256 ||
      sha256(canonicalJSON(inventory.negativeRecords)) !== manifest.negativeRecordsSha256)
      return invalid("identity-inventory-content-mismatch");
    // A detached frozen copy prevents post-validation edits from removing expiry,
    // negative lifecycle evidence, aliases or authority before collision checks.
    const snapshot = freeze(JSON.parse(serialized));
    return Object.freeze({ valid: true, reason: null, records: snapshot.records,
      negativeRecords: snapshot.negativeRecords, sourceRevision: snapshot.sourceRevision,
      observedAt: snapshot.observedAt, expiresAt: snapshot.expiresAt,
      completeness: "complete", factualFreshness: "not-established", runtimeApproval: false });
  } catch {
    return invalid("identity-inventory-unavailable-or-malformed");
  }
}

/** Files resolve relative to this module, not process cwd. A failed read is an
 * explicit invalid object, never an empty array that could imply reconciliation. */
export function readBoundIdentityInventories() {
  const result = {};
  for (const kind of Object.keys(ANCHORS)) {
    try { result[kind] = readBoundedJSON(`${kind}-inventory.json`).value; }
    catch { result[kind] = { kind, completeness: "unknown", unavailable: true }; }
  }
  return result;
}
