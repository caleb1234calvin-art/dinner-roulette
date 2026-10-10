import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dateNightRpcEvidence, assertBoundedSeasonalAudit, primaryCatalogEnvelopeMiles } from "./test-support/hybrid-rpc-evidence.mjs";
const payloads = JSON.parse(readFileSync(new URL("./test-support/hybrid-rpc-payloads.json", import.meta.url)));
test("actual hosted63b serialization distinguishes undefined primary patch from explicit core", () => {
  assert.ok(payloads.every(p => p.includes("patchId")));
  assert.equal(dateNightRpcEvidence(payloads[0]).kind, "primary");
  assert.equal(dateNightRpcEvidence(payloads[1]).patchId, "radial-v1:core");
  assertBoundedSeasonalAudit(payloads.map(body => ({ fixtureAt: "2026-10-07T18:00:00Z", acquisition: dateNightRpcEvidence(body) })));
});
test("malformed/unrecognized RPC evidence fails closed rather than disappearing from counts", () => {
  for (const body of ["{}", "invalid", payloads[1].replace("radial-v1:core", "unknown"), payloads[0].replace('"patchId"', '"missingPatch"')]) assert.throws(() => dateNightRpcEvidence(body));
});
test("duplicate audit cannot hide behind primary-filtered counts", () => {
  const rows = payloads.map(body => ({ fixtureAt: "2026-10-07T18:00:00Z", acquisition: dateNightRpcEvidence(body) }));
  assert.throws(() => assertBoundedSeasonalAudit([...rows, rows[1]]));
});

const pair = at => payloads.map(body => ({ fixtureAt: at, acquisition: dateNightRpcEvidence(body) }));
test("raw toggle mismatch outside seasonal window can represent identical effective context", () => {
  for (const at of ["2026-08-31T18:00:00Z", "2026-11-03T00:00:00Z", "2027-01-01T00:00:00Z"]) {
    const rows = pair(at); rows[1].acquisition.seasonEncoding = { t: 2, s: 3 };
    assertBoundedSeasonalAudit(rows);
  }
});
test("active-season true versus false remains incompatible, including November2", () => {
  for (const at of ["2026-09-01T00:00:00Z", "2026-10-07T18:00:00Z", "2026-11-02T23:59:59Z"]) {
    const rows = pair(at); rows[1].acquisition.seasonEncoding = { t: 2, s: 3 };
    assert.throws(() => assertBoundedSeasonalAudit(rows));
  }
});
test("effective context never excuses wrong origin, category, radius, missing clock or malformed toggle", () => {
  for (const change of [r => { r.acquisition.lat++; }, r => { r.acquisition.lon++; }, r => { r.acquisition.radiusMiles = 1; },
    r => { r.acquisition.activityTypes = ["movies"]; }, r => { delete r.fixtureAt; }, r => { r.fixtureAt = "invalid"; },
    r => { r.acquisition.seasonEncoding = { t: 2, s: 1 }; }]) {
    const rows = pair("2026-11-08T18:00:00Z"); change(rows[1]); assert.throws(() => assertBoundedSeasonalAudit(rows));
  }
});
test("primary catalog response envelope is exact max(radius,15)+1, never a UI eligibility allowance", () => {
  const primary = dateNightRpcEvidence(payloads[0]);
  for (const [radius, envelope] of [[1,16],[15,16],[20,21],[50,51]]) assert.equal(primaryCatalogEnvelopeMiles({ ...primary, radiusMiles: radius }), envelope);
  for (const radius of [0,51,NaN,Infinity]) assert.throws(() => primaryCatalogEnvelopeMiles({ ...primary, radiusMiles: radius }));
  assert.throws(() => primaryCatalogEnvelopeMiles(dateNightRpcEvidence(payloads[1])));
});
