import assert from "node:assert/strict";
import test from "node:test";
import { analyzeSeasonalFixture } from "./seasonal-source-pipeline.mjs";
import { readResearchRegistry } from "./seasonal-source-discovery.mjs";

const registry = readResearchRegistry();
const sourceId = registry.officialOperatorPilotQueue[0].id;
const checkedAt = "2026-10-18T12:00:00.000Z";
const markup = '<!doctype html><html><head><script type="application/ld+json">' +
  JSON.stringify({
    "@context": "https://schema.org", "@type": "Event",
    name: "The Harvest Haunted House",
    startDate: "2026-10-23", endDate: "2026-10-31",
    location: { name: "Harvest Haunted House", address: {
      streetAddress: "14 Example Road", addressLocality: "Joplin",
      addressRegion: "MO", postalCode: "64801",
    }},
  }) + '</script></head></html>';
const scan = overrides => analyzeSeasonalFixture({
  registry, sourceId, checkedAt, html: markup, todayLocalDate: "2026-10-18",
  ...overrides,
});

test("offline capture without identity inputs remains HOLD even with complete JSON-LD", () => {
  const report = scan();
  assert.equal(report.status, "offline-research-only");
  assert.equal(report.networkRequests, 0);
  assert.equal(report.identityInputsComplete, false);
  assert.equal(report.counts.extracted, 1);
  assert.equal(report.counts.held, 1);
  assert.equal(report.counts.publishable, 0);
  assert.equal(report.proposals[0].triage.status, "hold-for-research");
  assert.ok(report.proposals[0].triage.reasons.includes("unreconciled-published-and-pending-identities"));
  assert.equal(report.proposals[0].verified, false);
  assert.equal(report.proposals[0].publishable, false);
  assert.equal(report.proposals[0].openNowEligible, false);
});

test("full identity inputs only elevate to independent review, never live eligibility", () => {
  const report = scan({ published: [], pending: [] });
  assert.equal(report.identityInputsComplete, true);
  assert.deepEqual(report.counts, {
    extracted: 1, held: 0, awaitingIndependentReview: 1, publishable: 0,
  });
  assert.equal(report.proposals[0].triage.status, "awaiting-independent-review");
  assert.equal(report.proposals[0].triage.operatorVerificationRequired, true);
  assert.equal(report.proposals[0].triage.humanApprovalRequired, true);
  assert.equal(report.proposals[0].openNowEligible, false);
});

test("pending and published matches remain visible research holds", () => {
  const report = scan({
    published: [{ id: "existing", name: "The Harvest Haunted House", address: "Another Rd" }],
    pending: [{ id: "queued", name: "Different Name", address: "14 Example Road, Joplin, MO, 64801" }],
  });
  assert.equal(report.counts.held, 1);
  assert.deepEqual(report.proposals[0].triage.possibleMatches, [
    { source: "published", id: "existing", basis: "name" },
    { source: "pending", id: "queued", basis: "address" },
  ]);
});

test("expired, missing, and off-year seasons never become publishable", () => {
  const expired = scan({ published: [], pending: [], todayLocalDate: "2026-11-01" });
  assert.ok(expired.proposals[0].triage.reasons.includes("ended-before-local-day"));
  const future = scan({ published: [], pending: [],
    html: markup.replaceAll("2026-10", "2027-10") });
  assert.equal(future.counts.extracted, 0);
  const incomplete = scan({ published: [], pending: [], html: "<title>Harvest Haunt</title>" });
  assert.equal(incomplete.counts.held, 1);
  assert.ok(incomplete.proposals[0].triage.reasons.includes("missing-or-invalid-2026-date-range"));
});

test("directory IDs are rejected even for already-supplied offline HTML", () => {
  for (const sourceId of ["frightmaps", "frightfind", "haunts", "hauntworld", "unknown"]) {
    assert.deepEqual(scan({ sourceId }), {
      status: "unknown-operator-source", proposals: [], networkRequests: 0,
    });
  }
});

test("missing HTML and untrusted capture timestamps fail closed", () => {
  assert.equal(scan({ html: "" }).status, "no-offline-html");
  assert.equal(scan({ checkedAt: "yesterday" }).status, "invalid-capture-timestamp");
  assert.equal(scan({ checkedAt: "2026-10-18T14:20:00-05:00" }).status, "invalid-capture-timestamp");
});
