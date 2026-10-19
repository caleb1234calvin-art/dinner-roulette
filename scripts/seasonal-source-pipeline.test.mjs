import assert from "node:assert/strict";
import test from "node:test";
import { analyzeSeasonalFixture } from "./seasonal-source-pipeline.mjs";
import { readResearchRegistry } from "./seasonal-source-discovery.mjs";
import { triageSeasonalProposals } from "./seasonal-source-triage.mjs";
import { readBoundIdentityInventories } from "./seasonal-source-identities.mjs";

const registry = readResearchRegistry();
const identityInventories = readBoundIdentityInventories();
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
  evaluatedAt: "2026-10-18T14:00:00.000Z",
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

test("revision-bound identity inputs only elevate to independent review, never live eligibility", () => {
  const report = scan({ identityInventories });
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
  const expired = scan({ identityInventories, todayLocalDate: "2026-11-01" });
  assert.ok(expired.proposals[0].triage.reasons.includes("ended-before-local-day"));
  const future = scan({ identityInventories,
    html: markup.replaceAll("2026-10", "2027-10") });
  assert.equal(future.counts.extracted, 0);
  const incomplete = scan({ identityInventories, html: "<title>Harvest Haunt</title>" });
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
  const report = scan({ identityInventories, html: markup.replace('"endDate":"2026-10-31",', "") });
  assert.equal(report.counts.held, 1);
  assert.equal(report.proposals[0].endDate, null);
  assert.ok(!report.proposals[0].evidence.fields.includes("endDate"));
});

test("cancelled, postponed, rescheduled and unknown event statuses remain HOLD", () => {
  for (const eventStatus of ["EventCancelled", "EventPostponed", "EventRescheduled", "UnknownStatus"]) {
    const report = scan({ identityInventories,
      html: markup.replace('"@type":"Event",', '"@type":"Event","eventStatus":"https://schema.org/' + eventStatus + '",'),
    });
    assert.equal(report.counts.held, 1);
    assert.equal(report.proposals[0].eventStatus, "https://schema.org/" + eventStatus);
    assert.ok(report.proposals[0].evidence.fields.includes("eventStatus"));
    assert.ok(report.proposals[0].triage.reasons.includes("event-status-not-scheduled"));
  }
  const scheduled = scan({ identityInventories,
    html: markup.replace('"@type":"Event",', '"@type":"Event","eventStatus":"https://schema.org/EventScheduled",'),
  });
  assert.equal(scheduled.counts.awaitingIndependentReview, 1);
  assert.equal(scheduled.counts.publishable, 0);
});

test("contradictory duplicate event dates remain visible HOLD in either source order", () => {
  const different = markup.replace('"endDate":"2026-10-31"', '"endDate":"2026-10-24"');
  for (const html of [markup + different, different + markup]) {
    const report = scan({ identityInventories, html });
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
  const report = scan({ identityInventories, html: markup + otherEvents + conflicting });
  assert.equal(report.counts.extracted, 5);
  assert.ok(report.proposals[0].triage.reasons.includes("conflicting-structured-events"));
});

test("case folding preserves Unicode offsets before JSON-LD and page titles", () => {
  const report = scan({ identityInventories, html: "İ" + markup });
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
    const report = scan({ identityInventories,
      html: markup.replace('type="application/ld+json"', attributes),
    });
    assert.equal(report.counts.extracted, 0);
  }
  for (const attributes of [
    'TYPE = "APPLICATION/LD+JSON"',
    'id="facts" type="application/ld+json" data-other="type=\'text/plain\'"',
    "async type='application/ld+json'",
  ]) {
    assert.equal(scan({ identityInventories,
      html: markup.replace('type="application/ld+json"', attributes),
    }).counts.awaitingIndependentReview, 1);
  }
});

test("date-time evidence requires complete valid syntax before preserving its local date", () => {
  for (const suffix of ["Tgarbage", "T25:00:00Z", "T19:99:00Z", "T19:00:00+14:30", "T19:00:00Z trailing"]) {
    assert.equal(scan({ identityInventories, html: markup
      .replace('"2026-10-23"', '"2026-10-23' + suffix + '"')
      .replace('"2026-10-31"', '"2026-10-31' + suffix + '"'),
    }).counts.extracted, 0);
  }
  for (const suffix of ["T19:00", "T19:00:00Z", "T19:00:00.123-05:00"]) {
    const report = scan({ identityInventories, html: markup
      .replace('"2026-10-23"', '"2026-10-23' + suffix + '"')
      .replace('"2026-10-31"', '"2026-10-31' + suffix + '"'),
    });
    assert.equal(report.counts.awaitingIndependentReview, 1);
    assert.equal(report.proposals[0].startDate, "2026-10-23");
    assert.equal(report.proposals[0].endDate, "2026-10-31");
  }
});


test("malformed research concern metadata is held without throwing", () => {
  const proposal = scan({ identityInventories }).proposals[0];
  for (const researchConcerns of [1, {}, "conflicting-structured-events", [null]]) {
    const [result] = triageSeasonalProposals([{ ...proposal, researchConcerns }]);
    assert.equal(result.triage.status, "hold-for-research");
    assert.ok(result.triage.reasons.includes("malformed-research-concerns"));
    assert.equal(result.publishable, false);
  }
});


test("arbitrary empty identity arrays cannot stand in for complete pinned inventories", () => {
  const report = scan({ published: [], pending: [] });
  assert.equal(report.identityInputsComplete, false);
  assert.equal(report.counts.held, 1);
  assert.ok(report.proposals[0].triage.reasons.includes("unreconciled-published-and-pending-identities"));
});

test("timestamps must be genuine calendar values and cannot come from the future", () => {
  assert.equal(scan({ checkedAt: "2026-02-30T12:00:00Z" }).status, "invalid-capture-timestamp");
  assert.equal(scan({ checkedAt: "2026-10-18T14:00:00.001Z" }).status, "future-capture-timestamp");
  assert.equal(scan({ evaluatedAt: "2026-02-30T12:00:00Z" }).status, "invalid-evaluation-timestamp");
  assert.equal(scan({ todayLocalDate: "2026-02-30" }).status, "invalid-destination-local-day");
});

test("age confidence is bounded and explicitly does not verify the source", () => {
  const fresh = scan({ identityInventories });
  assert.equal(fresh.captureFreshness.status, "within-age-limit");
  assert.equal(fresh.captureFreshness.confidence, "timestamp-age-only-not-source-verification");
  assert.equal(fresh.identityEvidence.factualFreshness, "not-established");
  assert.equal(fresh.counts.awaitingIndependentReview, 1);
  const expired = scan({ identityInventories, checkedAt: "2026-10-18T08:00:00.000Z" });
  assert.equal(expired.captureFreshness.status, "stale");
  assert.equal(expired.counts.held, 1);
  assert.ok(expired.proposals[0].triage.reasons.includes("stale-capture-evidence"));
  const noLocalDay = scan({ identityInventories, todayLocalDate: null });
  assert.equal(noLocalDay.counts.held, 1);
  assert.ok(noLocalDay.proposals[0].triage.reasons.includes("missing-destination-local-day"));
});

test("tampered inventory content does not gain completeness from its own claims", () => {
  const changed = structuredClone(identityInventories);
  changed.pending.records = [];
  changed.pending.expectedCount = 0;
  changed.pending.completeness = "complete";
  const report = scan({ identityInventories: changed });
  assert.equal(report.identityInputsComplete, false);
  assert.equal(report.counts.held, 1);
  assert.equal(report.identityEvidence.pending.valid, false);
});

test("known published, pending and held identities remain exclusion inputs", () => {
  for (const [record, expectedSource] of [
    [identityInventories.published.records[0], "published"],
    [identityInventories.pending.records[0], "pending"],
    [identityInventories.pending.negativeRecords[0], "pending"],
  ]) {
    const report = scan({ identityInventories,
      html: markup.replaceAll("The Harvest Haunted House", record.name),
    });
    assert.equal(report.counts.held, 1);
    assert.ok(report.proposals[0].triage.possibleMatches.some(match =>
      match.id === record.id && match.source === expectedSource));
    assert.equal(report.proposals[0].publishable, false);
  }
});

test("expired inventory receipts create HOLD instead of silently treating old names as new", () => {
  const report = scan({ identityInventories, evaluatedAt: "2026-10-19T14:00:00.000Z" });
  assert.equal(report.identityInputsComplete, false);
  assert.equal(report.counts.awaitingIndependentReview, 0);
  assert.equal(report.counts.held, 1);
  assert.equal(report.identityEvidence.published.reason, "identity-inventory-expired");
  assert.equal(report.identityEvidence.pending.reason, "identity-inventory-expired");
});

test("pinned published, pending and held aliases remain exclusion hints after an address change", () => {
  for (const [id, alias, expectedSource] of [
    ["date-night-ar26-warehouse", "Haunted Attractions at Riverside Entertainment", "published"],
    ["date-night-ks26-louisburg", "Cider Mill Pumpkin Patch and Corn Maze", "published"],
    ["date-night-ar26-chill", "Chill Factor", "pending"],
    ["date-night-ks26-acres", "HELLS Gate", "pending"],
    ["date-night-mo26-mid-america-fright-fest", "Six Flags St. Louis Fright Fest", "published"],
  ]) {
    const report = scan({ identityInventories,
      html: markup.replaceAll("The Harvest Haunted House", alias),
    });
    assert.equal(report.identityInputsComplete, true);
    assert.equal(report.counts.held, 1);
    assert.ok(report.proposals[0].triage.reasons.includes("possible-existing-identity"));
    assert.ok(report.proposals[0].triage.possibleMatches.some(match =>
      match.id === id && match.source === expectedSource && match.basis === "alias" &&
      match.matchedAlias === alias));
    assert.equal(report.proposals[0].proposedName, alias);
    assert.equal(report.proposals[0].publishable, false);
  }
});

test("bounded parser omissions never clear an earlier positive candidate", () => {
  const node = { "@type": "Event", name: "The Harvest Haunted House",
    startDate: "2026-10-23", endDate: "2026-10-31", eventStatus: "EventScheduled",
    location: { address: "14 Example Road, Joplin, MO" } };
  const cancelled = { ...node, eventStatus: "EventCancelled" };
  const script = value => '<script type="application/ld+json">' + JSON.stringify(value) + '</script>';
  const cases = [
    script([...Array.from({ length: 50 }, () => node), cancelled]),
    script(node).repeat(12) + script(cancelled),
    script(node) + script({ mainEntity: { mainEntity: { mainEntity: { mainEntity: { mainEntity: cancelled } } } } }),
    script(node) + script({ padding: "x".repeat(64_000), ...cancelled }),
    script(node) + '<script type="application/ld+json">malformed</script>',
    script(node) + '<script type="application/ld+json">' + JSON.stringify(cancelled),
    script([...Array.from({ length: 5 }, (_, index) => ({ ...node, name: node.name + index })),
      { ...cancelled, name: "Another Haunted House" }]),
  ];
  for (const html of cases) {
    const report = scan({ identityInventories, html });
    assert.ok(report.counts.extracted > 0);
    assert.equal(report.counts.awaitingIndependentReview, 0);
    for (const proposal of report.proposals) {
      assert.ok(proposal.researchConcerns.includes("bounded-parser-incomplete"));
      assert.ok(proposal.triage.reasons.includes("bounded-parser-incomplete"));
      assert.equal(proposal.publishable, false);
    }
  }
  assert.equal(scan({ identityInventories, html: script(node) }).counts.awaitingIndependentReview, 1);
});
