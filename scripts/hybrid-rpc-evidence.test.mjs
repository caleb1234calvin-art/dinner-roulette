import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dateNightRpcEvidence, assertBoundedSeasonalAudit } from "./test-support/hybrid-rpc-evidence.mjs";
const payloads = JSON.parse(readFileSync(new URL("./test-support/hybrid-rpc-payloads.json", import.meta.url)));
test("actual hosted63b serialization distinguishes undefined primary patch from explicit core", () => {
  assert.ok(payloads.every(p => p.includes("patchId")));
  assert.equal(dateNightRpcEvidence(payloads[0]).kind, "primary");
  assert.equal(dateNightRpcEvidence(payloads[1]).patchId, "radial-v1:core");
  assertBoundedSeasonalAudit(payloads.map(body => ({ acquisition: dateNightRpcEvidence(body) })));
});
test("malformed/unrecognized RPC evidence fails closed rather than disappearing from counts", () => {
  for (const body of ["{}", "invalid", payloads[1].replace("radial-v1:core", "unknown"), payloads[0].replace('"patchId"', '"missingPatch"')]) assert.throws(() => dateNightRpcEvidence(body));
});
test("duplicate audit cannot hide behind primary-filtered counts", () => {
  const rows = payloads.map(body => ({ acquisition: dateNightRpcEvidence(body) }));
  assert.throws(() => assertBoundedSeasonalAudit([...rows, rows[1]]));
});
