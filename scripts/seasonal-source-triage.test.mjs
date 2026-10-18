import assert from "node:assert/strict";
import test from "node:test";
import { triageSeasonalProposals } from "./seasonal-source-triage.mjs";

const candidate = {
  sourceId: "fixture-only",
  sourceUrl: "https://operator.example/events",
  proposedName: "Hallow's Eve & Haunted Trail",
  proposedAddress: "123 Old Road, Example, MO",
  startDate: "2026-10-23",
  endDate: "2026-10-31",
  evidence: { format: "json-ld", checkedAt: "2026-10-18T12:00:00Z" },
  verified: true, publishable: true, openNowEligible: true,
};

test("complete candidate stays unpublished and queued for independent review", () => {
  const input = structuredClone(candidate);
  const [value] = triageSeasonalProposals([input], { todayLocalDate: "2026-10-18" });
  assert.equal(value.triage.status, "awaiting-independent-review");
  assert.deepEqual(value.triage.reasons, []);
  assert.equal(value.verified, false);
  assert.equal(value.publishable, false);
  assert.equal(value.openNowEligible, false);
  assert.equal(value.triage.operatorVerificationRequired, true);
  assert.equal(value.triage.humanApprovalRequired, true);
  assert.deepEqual(input, candidate, "never mutate provider input");
});

test("both published and pending identities trigger conservative holds", () => {
  const [result] = triageSeasonalProposals([candidate], {
    published: [{ id: "a", name: "Hallows Eve and Haunted Trail", address: "456 Second St" }],
    pending: [{ id: "b", name: "Another attraction", address: "123 Old Road Example MO" }],
  });
  assert.equal(result.triage.status, "hold-for-research");
  assert.deepEqual(result.triage.possibleMatches, [
    { source: "published", id: "a", basis: "name" },
    { source: "pending", id: "b", basis: "address" },
  ]);
  assert.ok(result.triage.reasons.includes("possible-existing-identity"));
});

test("same operator name at two addresses remains ambiguous, not auto-merged", () => {
  const [result] = triageSeasonalProposals([candidate], {
    published: [{ id: "first", name: candidate.proposedName,
      address: "901 Unrelated Road, Example, MO" }],
  });
  assert.equal(result.triage.status, "hold-for-research");
  assert.equal(result.triage.possibleMatches[0].basis, "name");
});

test("a title-only page and unknown dates cannot masquerade as seasonal evidence", () => {
  const [result] = triageSeasonalProposals([{
    ...candidate, proposedAddress: null,
    startDate: null, endDate: null, evidence: { format: "page-title-only" },
  }]);
  assert.deepEqual(result.triage.reasons, [
    "missing-address", "missing-or-invalid-2026-date-range", "insufficient-structured-evidence",
  ]);
  assert.equal(result.triage.status, "hold-for-research");
});

test("expiration requires caller-provided destination-local calendar day", () => {
  const noLocalDay = triageSeasonalProposals([candidate])[0];
  assert.ok(!noLocalDay.triage.reasons.includes("ended-before-local-day"));
  const late = triageSeasonalProposals([candidate], { todayLocalDate: "2026-11-01" })[0];
  assert.ok(late.triage.reasons.includes("ended-before-local-day"));
  const lastDay = triageSeasonalProposals([candidate], { todayLocalDate: "2026-10-31" })[0];
  assert.ok(!lastDay.triage.reasons.includes("ended-before-local-day"));
  assert.throws(() => triageSeasonalProposals([candidate], { todayLocalDate: "2026-02-30" }),
    /todayLocalDate/);
});

test("incoherent and non-2026 date ranges are not cleared", () => {
  for (const [startDate, endDate] of [
    ["2026-10-31", "2026-10-20"],
    ["2025-10-20", "2026-10-31"],
    ["2026-10-20", "2027-10-31"],
    ["2026-02-30", "2026-03-01"],
  ]) {
    const [result] = triageSeasonalProposals([{ ...candidate, startDate, endDate }]);
    assert.equal(result.triage.status, "hold-for-research");
    assert.ok(result.triage.reasons.includes("missing-or-invalid-2026-date-range"));
  }
});

test("malformed proposals fail conservatively and input size is bounded", () => {
  const results = triageSeasonalProposals([null, {}, ...Array.from({length: 110}, () => candidate)]);
  assert.equal(results.length, 100);
  assert.equal(results[0].publishable, false);
  assert.ok(results[0].triage.reasons.includes("missing-name"));
  assert.deepEqual(triageSeasonalProposals(null), []);
});
