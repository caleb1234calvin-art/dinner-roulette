import assert from "node:assert/strict";
import test from "node:test";
import { auditCasinoRecords, auditManifestCoverage, mergeJurisdictions, validateJurisdictionMetadata } from "./casino-audit.mjs";

const venue = (overrides = {}) => ({
  file: "pass-1.ts",
  id: "casino-catalog-nv-test",
  name: "Test Casino",
  lat: 36.1,
  lon: -115.1,
  address: "1 Test Street, Henderson, NV 89011",
  ...overrides,
});
const complete = (count) => ({ Nevada: { status: "complete", expectedCount: count } });

test("keyed manifests preserve state names and integration override precedence", () => {
  const jurisdictions = mergeJurisdictions([
    { path: "base.json", data: { jurisdictions: {
      Nevada: { status: "inventory", expectedCount: 174 },
      Texas: { status: "complete", expectedCount: 4 },
    } } },
    { path: "integration.json", data: { jurisdictions: complete(1) } },
  ]);
  assert.equal(jurisdictions.Nevada.expectedCount, 1);
  assert.equal(jurisdictions.Texas.expectedCount, 4);
  const result = auditCasinoRecords([venue()], jurisdictions);
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /Texas expected 4, found 0/);
});

test("missing or malformed jurisdiction objects fail closed", () => {
  for (const jurisdictions of [undefined, null, [], "Nevada"]) {
    assert.throws(() => mergeJurisdictions([
      { path: "bad.json", data: { jurisdictions } },
    ]), /jurisdictions must be an object/);
  }
  assert.throws(() => mergeJurisdictions([
    { path: "bad.json", data: { jurisdictions: { Nevada: null } } },
  ]), /invalid jurisdiction record/);
});

test("nearby same-name rows reconcile once with latest ID and metadata", () => {
  const latest = venue({
    file: "pass-2.ts", id: "casino-catalog-nv-new", name: "TEST CASINO",
    lat: 36.1001, website: "https://example.com/current",
  });
  const result = auditCasinoRecords([venue(), latest], complete(1));
  assert.deepEqual(result.failures, []);
  assert.equal(result.canonical.length, 1);
  assert.equal(result.canonical[0].id, latest.id);
  assert.equal(result.canonical[0].website, latest.website);
  assert.equal(result.counts.Nevada, 1);
});

test("same ID at distinct locations remains a hard failure", () => {
  const result = auditCasinoRecords([venue(), venue({ lat: 37.1 })], {});
  assert.match(result.failures.join("\n"), /duplicate id at distinct locations/);
});

test("small successive moves cannot conceal a distant same-ID conflict", () => {
  const result = auditCasinoRecords([
    venue(), venue({ lat: 36.104 }), venue({ lat: 36.108 }),
  ], {});
  assert.match(result.failures.join("\n"), /duplicate id at distinct locations/);
});

test("distant same-name destinations with distinct IDs are retained", () => {
  const result = auditCasinoRecords([
    venue(), venue({ id: "casino-catalog-nv-other", lat: 37.1 }),
  ], complete(2));
  assert.deepEqual(result.failures, []);
  assert.equal(result.canonical.length, 2);
  assert.match(result.warnings.join("\n"), /same name at distinct locations retained/);
});

test("complete jurisdiction counts reject both missing and excess destinations", () => {
  const missing = auditCasinoRecords([venue()], complete(2));
  assert.match(missing.failures.join("\n"), /Nevada expected 2, found 1/);
  const excess = auditCasinoRecords([
    venue(), venue({ id: "casino-catalog-nv-other", name: "Other Casino", lat: 37.1 }),
  ], complete(1));
  assert.match(excess.failures.join("\n"), /Nevada expected 1, found 2/);
});

test("legacy IDs use exported jurisdiction metadata rather than ID prefixes", () => {
  const result = auditCasinoRecords([venue({
    id: "casino-catalog-foxwoods", name: "Foxwoods Resort Casino",
    lat: 41.47, lon: -71.95, address: "Legacy address",
    audit: { jurisdiction: "Connecticut" },
  })], { Connecticut: { status: "complete", expectedCount: 1 } });
  assert.deepEqual(result.failures, []);
  assert.equal(result.counts.Connecticut, 1);
});

test("invalid coordinates, jurisdictions and complete-count values fail closed", () => {
  for (const bad of [{ lat: NaN }, { lon: -130 }]) {
    assert.match(auditCasinoRecords([venue(bad)], {}).failures.join("\n"), /implausible coordinate/);
  }
  assert.match(auditCasinoRecords([venue({ address: "Unknown" })], {}).failures.join("\n"), /missing or invalid jurisdiction/);
  assert.match(auditCasinoRecords([venue()], complete("1")).failures.join("\n"), /invalid expectedCount/);
});

test("pending decision universes are not treated as runtime quotas", () => {
  const result = auditCasinoRecords([venue()], {
    Nevada: { status: "pending", expectedCount: 174 },
  });
  assert.deepEqual(result.failures, []);
  assert.equal(result.counts.Nevada, 1);
});

test("nearby same-ID records with a renamed property use latest metadata", () => {
  const result = auditCasinoRecords([
    venue(), venue({ name: "Renamed Casino", lat: 36.1001, file: "pass-2.ts" }),
  ], complete(1));
  assert.deepEqual(result.failures, []);
  assert.equal(result.canonical[0].name, "Renamed Casino");
});

test("missing identities cannot silently disappear from the audit", () => {
  for (const bad of [{ id: "" }, { name: null }]) {
    assert.match(auditCasinoRecords([venue(bad)], {}).failures.join("\n"), /invalid casino identity/);
  }
});

test("every active jurisdiction needs an explicit manifest status", () => {
  assert.deepEqual(auditManifestCoverage({ Colorado: 31, Oklahoma: 56 }, {
    Colorado: { status: "complete", expectedCount: 31 },
  }), ["runtime jurisdiction missing from manifest: Oklahoma"]);
  assert.deepEqual(auditManifestCoverage({ Oklahoma: 56 }, {
    Oklahoma: { status: "pending", expectedCount: null },
  }), []);
});

test("unknown totals are allowed only for explicitly pending jurisdictions", () => {
  const source = "https://example.com/authority";
  assert.deepEqual(validateJurisdictionMetadata({
    Oklahoma: { status: "pending", expectedCount: null, source },
  }), []);
  for (const status of ["complete", "inventory"]) {
    assert.match(validateJurisdictionMetadata({
      Colorado: { status, expectedCount: null, source },
    }).join("\n"), /invalid expectedCount/);
  }
});

test("a supplied pending count must still be a positive integer", () => {
  for (const expectedCount of [0, -1, "56", 1.5]) {
    assert.match(validateJurisdictionMetadata({
      Oklahoma: { status: "pending", expectedCount, source: "https://example.com/authority" },
    }).join("\n"), /invalid expectedCount/);
  }
});

test("authoritative sources and allowed status values remain required", () => {
  const failures = validateJurisdictionMetadata({
    Colorado: { status: "guessed", expectedCount: 31, source: "" },
  });
  assert.match(failures.join("\n"), /missing authoritative source/);
  assert.match(failures.join("\n"), /invalid status guessed/);
});
