import assert from "node:assert/strict";
import test from "node:test";
import { createSeasonalDiscoveryPilot, extractSeasonalProposals, readResearchRegistry } from "./seasonal-source-discovery.mjs";

const original = readResearchRegistry();
const source = original.officialOperatorPilotQueue[0];
const markup = '<html><head><script type="application/ld+json">' +
  JSON.stringify({ "@context": "https://schema.org", "@type": "Event",
    name: "Test Haunted House", startDate: "2026-10-24",
    endDate: "2026-10-31", location: { "@type": "Place",
      name: "Test House", address: { streetAddress: "123 Main",
        addressLocality: "Test", addressRegion: "MO" } } }) +
  '</script></head></html>';
const cleared = () => ({
  ...original, automationEnabled: true,
  officialOperatorPilotQueue: original.officialOperatorPilotQueue.map(s => ({
    ...s,
    automaticAccess: "reviewed-allow",
    fetchClearance: { robots: "allow", reviewer: "fixture-only",
      reviewedAt: "2026-10-18", rightsBasis: "TEST FIXTURE ONLY — NOT FOR PRODUCTION" },
  })),
});

test("checked-in registry is fail-closed without touching fetch", async () => {
  let calls = 0;
  const pilot = createSeasonalDiscoveryPilot({ registry: original,
    fetchImpl: async () => { calls++; throw new Error("must not fetch"); } });
  assert.deepEqual(await pilot.discover(source.id), { status: "blocked-by-policy", proposals: [] });
  assert.equal(calls, 0);
  assert.deepEqual(await pilot.discover("not-registered"), { status: "unknown-source", proposals: [] });
});

test("structured seasonal extraction records unverified, nonpublishable facts", () => {
  const results = extractSeasonalProposals(markup, source, "2026-10-18T00:00:00.000Z");
  assert.equal(results.length, 1);
  assert.equal(results[0].proposedName, "Test Haunted House");
  assert.equal(results[0].proposedAddress, "123 Main, Test, MO");
  assert.equal(results[0].endDate, "2026-10-31");
  assert.deepEqual(results[0].activityHints, ["haunted-house"]);
  assert.equal(results[0].publishable, false);
  assert.equal(results[0].openNowEligible, false);
  assert.equal(results[0].verified, false);
});

test("fixture-only clearance produces cached results and coalesces simultaneous requests", async () => {
  let calls = 0;
  let clock = Date.parse("2026-10-18T12:00:00Z");
  const pilot = createSeasonalDiscoveryPilot({
    registry: cleared(), now: () => clock,
    fetchImpl: async () => { calls++; return new Response(markup, {
      headers: { "content-type": "text/html" }, status: 200 }); },
  });
  const [a, b] = await Promise.all([pilot.discover(source.id), pilot.discover(source.id)]);
  assert.deepEqual(a, b);
  assert.equal(a.status, "fresh");
  assert.equal(calls, 1);
  const c = await pilot.discover(source.id);
  assert.equal(c.status, "cached");
  assert.equal(calls, 1);
  clock += 7 * 60 * 60 * 1000;
  assert.equal((await pilot.discover(source.id)).status, "fresh");
  assert.equal(calls, 2);
});

test("invalid source or disallowed redirect and oversized response fails safely", async () => {
  const invalid = cleared();
  invalid.officialOperatorPilotQueue = [{...source,
    url: "http://localhost/internal", automaticAccess: "reviewed-allow",
    fetchClearance: { robots: "allow", reviewer: "fixture",
      reviewedAt: "2026-10-18", rightsBasis: "test" }}];
  let count = 0;
  const reject = createSeasonalDiscoveryPilot({ registry: invalid,
    fetchImpl: async () => { count++; throw Error("network"); } });
  assert.equal((await reject.discover(source.id)).status, "invalid-source-url");
  assert.equal(count, 0);
  const badBody = createSeasonalDiscoveryPilot({ registry: cleared(),
    fetchImpl: async () => new Response("bad", {headers: {
      "content-type": "text/plain" }}) });
  assert.deepEqual(await badBody.discover(source.id), { status: "fetch-error", proposals: [] });
  const tooLarge = createSeasonalDiscoveryPilot({ registry: cleared(),
    fetchImpl: async () => new Response("x", {headers: {
      "content-type": "text/html", "content-length": "600000" }}) });
  assert.equal((await tooLarge.discover(source.id)).status, "fetch-error");
});

test("incomplete LD or out-of-season dates are never treated as confirmed operations", () => {
  const broken = '<title>A haunted maze</title><script type="application/ld+json">broken</script>';
  const rows = extractSeasonalProposals(broken, source, "2026-10-18T00:00:00Z");
  assert.equal(rows[0].evidence.format, "page-title-only");
  assert.equal(rows[0].startDate, null);
  assert.equal(rows[0].verified, false);
  assert.equal(extractSeasonalProposals(markup.replaceAll("2026-10", "2027-10"), source,
    "2026-10-18T00:00:00Z")[0].startDate, null);
});
