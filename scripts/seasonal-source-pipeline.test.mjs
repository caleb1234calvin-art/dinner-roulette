import assert from "node:assert/strict";
import test from "node:test";
import { analyzeSeasonalFixture } from "./seasonal-source-pipeline.mjs";
import { readResearchRegistry } from "./seasonal-source-discovery.mjs";
import { triageSeasonalProposals } from "./seasonal-source-triage.mjs";

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

test("missing end date remains HOLD and is absent from source evidence", () => {
  const report = scan({ published: [], pending: [], html: markup.replace('"endDate":"2026-10-31",', "") });
  assert.equal(report.counts.held, 1);
  assert.equal(report.proposals[0].endDate, null);
  assert.ok(!report.proposals[0].evidence.fields.includes("endDate"));
});

test("cancelled, postponed, rescheduled and unknown event statuses remain HOLD", () => {
  for (const eventStatus of ["EventCancelled", "EventPostponed", "EventRescheduled", "UnknownStatus"]) {
    const report = scan({ published: [], pending: [],
      html: markup.replace('"@type":"Event",', '"@type":"Event","eventStatus":"https://schema.org/' + eventStatus + '",'),
    });
    assert.equal(report.counts.held, 1);
    assert.equal(report.proposals[0].eventStatus, "https://schema.org/" + eventStatus);
    assert.ok(report.proposals[0].evidence.fields.includes("eventStatus"));
    assert.ok(report.proposals[0].triage.reasons.includes("event-status-not-scheduled"));
  }
  const scheduled = scan({ published: [], pending: [],
    html: markup.replace('"@type":"Event",', '"@type":"Event","eventStatus":"https://schema.org/EventScheduled",'),
  });
  assert.equal(scheduled.counts.awaitingIndependentReview, 1);
  assert.equal(scheduled.counts.publishable, 0);
});

test("contradictory duplicate event dates remain visible HOLD in either source order", () => {
  const different = markup.replace('"endDate":"2026-10-31"', '"endDate":"2026-10-24"');
  for (const html of [markup + different, different + markup]) {
    const report = scan({ published: [], pending: [], html });
    assert.equal(report.counts.extracted, 2);
    assert.equal(report.counts.held, 2);
    assert.equal(report.counts.awaitingIndependentReview, 0);
    for (const proposal of report.proposals)
      assert.ok(proposal.triage.reasons.includes("conflicting-structured-events"));
  }
});

test("conflicts beyond the output cap cannot silently clear an earlier event", () => {
  const otherEvents = Array.from({ length: 5 }, (_, index) =>
    markup.replaceAll("The Harvest Haunted House", "Different Haunted House " + index)).join("");
  const conflicting = markup.replace('"endDate":"2026-10-31"', '"endDate":"2026-10-24"');
  const report = scan({ published: [], pending: [], html: markup + otherEvents + conflicting });
  assert.equal(report.counts.extracted, 5);
  assert.ok(report.proposals[0].triage.reasons.includes("conflicting-structured-events"));
});

test("case folding preserves Unicode offsets before JSON-LD and page titles", () => {
  const report = scan({ published: [], pending: [], html: "İ" + markup });
  assert.equal(report.counts.awaitingIndependentReview, 1);
  const title = scan({ html: "İ<title>Haunted House</title>" });
  assert.equal(title.proposals[0].proposedName, "Haunted House");
  assert.equal(title.proposals[0].evidence.format, "page-title-only");
});

test("only an unambiguous actual script type attribute supplies JSON-LD evidence", () => {
  for (const attributes of [
    'data-type="application/ld+json"',
    'data-x="type=\'application/ld+json\'"',
    'type="text/plain" data-type="application/ld+json"',
    'type="application/ld+json" type="text/plain"',
    'type="text/plain" type="application/ld+json"',
    'type="application/ld+json"type="text/plain"',
  ]) {
    const report = scan({ published: [], pending: [],
      html: markup.replace('type="application/ld+json"', attributes),
    });
    assert.equal(report.counts.extracted, 0);
  }
  for (const attributes of [
    'TYPE = "APPLICATION/LD+JSON"',
    'id="facts" type="application/ld+json" data-other="type=\'text/plain\'"',
    "async type='application/ld+json'",
  ]) {
    assert.equal(scan({ published: [], pending: [],
      html: markup.replace('type="application/ld+json"', attributes),
    }).counts.awaitingIndependentReview, 1);
  }
});

test("date-time evidence requires complete valid syntax before preserving its local date", () => {
  for (const suffix of ["Tgarbage", "T25:00:00Z", "T19:99:00Z", "T19:00:00+14:30", "T19:00:00Z trailing"]) {
    assert.equal(scan({ published: [], pending: [], html: markup
      .replace('"2026-10-23"', '"2026-10-23' + suffix + '"')
      .replace('"2026-10-31"', '"2026-10-31' + suffix + '"'),
    }).counts.extracted, 0);
  }
  for (const suffix of ["T19:00", "T19:00:00Z", "T19:00:00.123-05:00"]) {
    const report = scan({ published: [], pending: [], html: markup
      .replace('"2026-10-23"', '"2026-10-23' + suffix + '"')
      .replace('"2026-10-31"', '"2026-10-31' + suffix + '"'),
    });
    assert.equal(report.counts.awaitingIndependentReview, 1);
    assert.equal(report.proposals[0].startDate, "2026-10-23");
    assert.equal(report.proposals[0].endDate, "2026-10-31");
  }
});


test("malformed research concern metadata is held without throwing", () => {
  const proposal = scan({ published: [], pending: [] }).proposals[0];
  for (const researchConcerns of [1, {}, "conflicting-structured-events", [null]]) {
    const [result] = triageSeasonalProposals([{ ...proposal, researchConcerns }]);
    assert.equal(result.triage.status, "hold-for-research");
    assert.ok(result.triage.reasons.includes("malformed-research-concerns"));
    assert.equal(result.publishable, false);
  }
});
