import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const registry = JSON.parse(readFileSync("audit/seasonal-source-discovery-2026-10-18/source-registry.json", "utf8"));

test("seasonal research registry is disabled by default and has unique source IDs", () => {
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.automationEnabled, false);
  assert.equal(registry.decisionRules.discoveryIsVerification, false);
  assert.equal(registry.decisionRules.sourceAccessMustNotRequireOutreach, true);
  assert.equal(registry.decisionRules.publishRequiresIndependentEvidenceAndOwnerApproval, true);
  assert.equal(registry.directories.length, 9);
  const ids = registry.directories.map(source => source.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const source of registry.directories) {
    assert.ok(source.url.startsWith("https://"));
    assert.equal(source.automaticAccess, "blocked", source.id);
    assert.ok(source.rationale);
  }
  assert.equal(registry.directories.find(source => source.id === "frightmaps").status, "excluded");
});

test("pilot attractions cannot be silently promoted to production", () => {
  assert.equal(registry.officialOperatorPilotQueue.length, 3);
  const ids = registry.officialOperatorPilotQueue.map(pilot => pilot.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const pilot of registry.officialOperatorPilotQueue) {
    assert.equal(pilot.status, "research-candidate-only");
    assert.equal(pilot.automaticAccess, "blocked-pending-policy-review");
    assert.ok(pilot.publishedDuplicateCheck);
    assert.ok(pilot.url.startsWith("https://"));
    assert.ok(pilot.observed2026Dates.every(date => /^2026-\d{2}-\d{2}$/.test(date)));
  }
});
