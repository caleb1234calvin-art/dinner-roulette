import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { setImmediate as nextTurn } from "node:timers/promises";
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
  assert.deepEqual(extractSeasonalProposals(markup.replaceAll("2026-10", "2027-10"), source,
    "2026-10-18T00:00:00Z"), []);
});

test("explicit transport is required even for test-only cleared registry", async () => {
  const pilot = createSeasonalDiscoveryPilot({ registry: cleared() });
  assert.deepEqual(await pilot.discover(source.id),
    { status: "transport-not-configured", proposals: [] });
});


test("caller mutation cannot poison cached results or the concurrent response", async () => {
  let requests = 0;
  const pilot = createSeasonalDiscoveryPilot({
    registry: cleared(), now: () => Date.parse("2026-10-18T12:00:00Z"),
    fetchImpl: async () => {
      requests++;
      return new Response(markup, {headers: {"content-type": "text/html"}});
    },
  });
  const [first, second] = await Promise.all([pilot.discover(source.id), pilot.discover(source.id)]);
  assert.equal(first.status, "fresh");
  assert.equal(second.status, "fresh");
  assert.notStrictEqual(first.proposals, second.proposals);
  first.proposals[0].proposedName = "ATTACKER REPLACEMENT";
  second.proposals.pop();
  const third = await pilot.discover(source.id);
  assert.equal(third.status, "cached");
  assert.equal(third.proposals.length, 1);
  assert.equal(third.proposals[0].proposedName, "Test Haunted House");
  assert.equal(requests, 1);
});

test("transport redirects and cross-source final URLs are rejected", async () => {
  for (const finalUrl of [
    "https://other-source.example/events",
    "http://localhost/private",
  ]) {
    const pilot = createSeasonalDiscoveryPilot({
      registry: cleared(), fetchImpl: async () => ({
        ok: true, redirected: false, url: finalUrl,
        headers: new Headers({ "content-type": "text/html" }),
        body: new Response(markup).body,
      }),
    });
    assert.equal((await pilot.discover(source.id)).status, "upstream-redirect-rejected");
  }
});

test("missing end date stays unknown and is never labeled a source field", () => {
  const [proposal] = extractSeasonalProposals(markup.replace('"endDate":"2026-10-31",', ""),
    source, "2026-10-18T12:00:00Z");
  assert.equal(proposal.endDate, null);
  assert.ok(!proposal.evidence.fields.includes("endDate"));
});

test("invalid or future policy review dates cannot reach the transport", async () => {
  for (const reviewedAt of ["2026-99-99", "2026-02-30", "2026-10-19", "yesterday"]) {
    const registry = cleared();
    registry.officialOperatorPilotQueue[0].fetchClearance.reviewedAt = reviewedAt;
    let calls = 0;
    const pilot = createSeasonalDiscoveryPilot({ registry,
      now: () => Date.parse("2026-10-18T12:00:00Z"),
      fetchImpl: async () => { calls++; throw Error("must not fetch"); },
    });
    assert.equal((await pilot.discover(source.id)).status, "blocked-by-policy");
    assert.equal(calls, 0);
  }
});

test("in-flight source or clearance changes discard the old response without relabeling it", async () => {
  for (const change of [
    registry => { registry.officialOperatorPilotQueue[0].url = "https://changed.operator.org/"; },
    registry => { registry.officialOperatorPilotQueue[0].fetchClearance.rightsBasis = "changed"; },
    registry => { registry.automationEnabled = false; },
    registry => { registry.officialOperatorPilotQueue = []; },
  ]) {
    const registry = cleared();
    let release;
    let requestedUrl;
    const pilot = createSeasonalDiscoveryPilot({ registry,
      now: () => Date.parse("2026-10-18T12:00:00Z"),
      fetchImpl: url => { requestedUrl = url; return new Promise(resolve => { release = resolve; }); },
    });
    const pending = pilot.discover(source.id);
    change(registry);
    release(new Response(markup, { headers: { "content-type": "text/html" } }));
    assert.equal(requestedUrl, source.url);
    assert.deepEqual(await pending, { status: "source-policy-changed", proposals: [] });
  }
});

test("cache identity follows URL and policy, and clock rollback cannot serve old data", async () => {
  const registry = cleared();
  let clock = Date.parse("2026-10-18T12:00:00Z");
  const requests = [];
  const pilot = createSeasonalDiscoveryPilot({ registry, now: () => clock,
    fetchImpl: async url => {
      requests.push(url);
      return new Response(markup, { headers: { "content-type": "text/html" } });
    },
  });
  assert.equal((await pilot.discover(source.id)).status, "fresh");
  assert.equal((await pilot.discover(source.id)).status, "cached");
  registry.officialOperatorPilotQueue[0].url = "https://changed.operator.org/events";
  const changed = await pilot.discover(source.id);
  assert.equal(changed.status, "fresh");
  assert.equal(changed.proposals[0].sourceUrl, "https://changed.operator.org/events");
  registry.officialOperatorPilotQueue[0].fetchClearance.rightsBasis = "changed fixture";
  assert.equal((await pilot.discover(source.id)).status, "fresh");
  clock -= 1000;
  assert.equal((await pilot.discover(source.id)).status, "fresh");
  registry.automationEnabled = false;
  assert.equal((await pilot.discover(source.id)).status, "blocked-by-policy");
  assert.equal(requests.length, 4);
});

test("abort-ignoring fetch settles at six seconds and cannot write a late cache entry", async t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let release;
  let calls = 0;
  let signal;
  const pilot = createSeasonalDiscoveryPilot({ registry: cleared(),
    now: () => Date.parse("2026-10-18T12:00:00Z"),
    fetchImpl: (_url, options) => {
      calls++;
      signal = options.signal;
      if (calls === 1) return new Promise(resolve => { release = resolve; });
      return Promise.resolve(new Response(markup, { headers: { "content-type": "text/html" } }));
    },
  });
  let settled = false;
  const pending = pilot.discover(source.id).then(result => { settled = true; return result; });
  t.mock.timers.tick(6000);
  await nextTurn();
  assert.equal(signal.aborted, true);
  assert.equal(settled, true, "deadline must settle even when transport ignores abort");
  assert.deepEqual(await pending, { status: "fetch-timeout", proposals: [] });
  release(new Response(markup, { headers: { "content-type": "text/html" } }));
  await nextTurn();
  assert.equal((await pilot.discover(source.id)).status, "fresh");
  assert.equal(calls, 2, "the late result must not populate cache or strand in-flight state");
});

test("a stalled body read is also deadline-bounded, with late bytes discarded", async t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let releaseRead;
  let cancelCalls = 0;
  const pilot = createSeasonalDiscoveryPilot({ registry: cleared(),
    now: () => Date.parse("2026-10-18T12:00:00Z"),
    fetchImpl: async () => ({ ok: true,
      headers: new Headers({ "content-type": "text/html" }),
      body: { getReader: () => ({
        read: () => new Promise(resolve => { releaseRead = resolve; }),
        cancel: () => { cancelCalls++; return new Promise(() => {}); },
      }) },
    }),
  });
  let settled = false;
  const pending = pilot.discover(source.id).then(result => { settled = true; return result; });
  await nextTurn();
  t.mock.timers.tick(6000);
  await nextTurn();
  assert.equal(settled, true);
  assert.equal((await pending).status, "fetch-timeout");
  assert.equal(cancelCalls, 1, "deadline requests cancellation without awaiting it");
  releaseRead({ value: new TextEncoder().encode(markup), done: false });
  await nextTurn();
  assert.equal(cancelCalls, 1);
});

test("unsettled stream cleanup never blocks a successfully bounded response", async () => {
  let read = false;
  let cancelled = 0;
  const pilot = createSeasonalDiscoveryPilot({ registry: cleared(),
    now: () => Date.parse("2026-10-18T12:00:00Z"),
    fetchImpl: async () => ({ ok: true,
      headers: new Headers({ "content-type": "text/html" }),
      body: { getReader: () => ({
        read: async () => {
          if (read) return { done: true };
          read = true;
          return { value: new TextEncoder().encode(markup), done: false };
        },
        cancel: () => { cancelled++; return new Promise(() => {}); },
      }) },
    }),
  });
  assert.equal((await pilot.discover(source.id)).status, "fresh");
  assert.equal(cancelled, 1);
});

test("early HTTP, redirect, content-type and length rejections cancel response bodies", async () => {
  for (const rejection of [
    { ok: false }, { redirected: true }, { url: "https://changed.operator.org/" },
    { headers: new Headers({ "content-type": "text/plain" }) },
    { headers: new Headers({ "content-type": "text/htmlish" }) },
    { headers: new Headers({ "content-type": "application/xhtml+xml-bogus" }) },
    { headers: new Headers({ "content-type": "text/html", "content-length": "600000" }) },
  ]) {
    let cancelled = 0;
    const pilot = createSeasonalDiscoveryPilot({ registry: cleared(),
      now: () => Date.parse("2026-10-18T12:00:00Z"),
      fetchImpl: async () => ({ ok: true,
        headers: new Headers({ "content-type": "text/html" }),
        body: { cancel: () => { cancelled++; return new Promise(() => {}); } },
        ...rejection,
      }),
    });
    assert.notEqual((await pilot.discover(source.id)).status, "fresh");
    assert.equal(cancelled, 1);
  }
});

test("bounded malformed markup cannot repeatedly rescan the remaining document", () => {
  for (const html of [
    "<script ".repeat(64_000),
    "<script ".repeat(63_999) + ">",
    '<script type="application/ld+json">'.repeat(14_000),
    "<title ".repeat(64_000),
    "<title ".repeat(63_999) + ">",
  ]) assert.deepEqual(extractSeasonalProposals(html, source, "2026-10-18T12:00:00Z"), []);
  const nested = '<script <script type="application/ld+json">' +
    JSON.stringify({ "@type": "Event", name: "<".repeat(30_000) + "Haunted House",
      startDate: "2026-10-24", endDate: "2026-10-31" }) + '</script>';
  const [proposal] = extractSeasonalProposals(nested, source, "2026-10-18T12:00:00Z");
  assert.equal(proposal.publishable, false);
  assert.equal(proposal.proposedName.length, 160);
});


test("capture hashes bind exact UTF-8 bytes while JSON-LD pointers bind observed fields", () => {
  const firstBlock = '<script type="application/ld+json">invalid json</script>';
  const record = { "@type": "Event", name: "Fixture Haunted House", startDate: "2026-10-23T19:00:00-05:00",
    endDate: "2026-10-31T23:30:00-05:00", eventStatus: "https://schema.org/EventCancelled",
    location: { address: { streetAddress: "14 Example Road", addressLocality: "Joplin", addressRegion: "MO" } },
  };
  const html = "İ" + firstBlock + '<script type="application/ld+json">' +
    JSON.stringify({ "@graph": [{ mainEntity: [record] }] }) + "</script>";
  const [proposal] = extractSeasonalProposals(html, source, "2026-10-18T12:00:00Z");
  assert.equal(proposal.evidence.capture.sha256, createHash("sha256").update(html).digest("hex"));
  assert.equal(proposal.evidence.capture.utf8Bytes, Buffer.byteLength(html));
  assert.equal(proposal.evidence.capture.authenticity, "unverified-caller-input");
  assert.equal(proposal.evidence.jsonLdBlockIndex, 1);
  assert.equal(proposal.evidence.nodePointer, "/@graph/0/mainEntity/0");
  assert.equal(proposal.evidence.fieldProvenance.startDate.jsonPointer, "/@graph/0/mainEntity/0/startDate");
  assert.equal(proposal.evidence.fieldProvenance.startDate.observedValue, "2026-10-23T19:00:00-05:00");
  assert.equal(proposal.evidence.fieldProvenance.startDate.normalizedValue, "2026-10-23");
  assert.equal(proposal.evidence.fieldProvenance.endDate.observedValue, "2026-10-31T23:30:00-05:00");
  assert.equal(proposal.evidence.fieldProvenance.eventStatus.observedValue, record.eventStatus);
  assert.equal(proposal.lifecycleConfidence, "source-stated-unverified");
  assert.equal(proposal.evidence.fieldProvenance.address.components.streetAddress.jsonPointer,
    "/@graph/0/mainEntity/0/location/address/streetAddress");
  assert.equal(proposal.publishable, false);
  const [changed] = extractSeasonalProposals(html + " ", source, "2026-10-18T12:00:00Z");
  assert.notEqual(changed.evidence.capture.sha256, proposal.evidence.capture.sha256);
});

test("omitted lifecycle and date fields stay unknown without fabricated provenance", () => {
  const html = markup.replace('"endDate":"2026-10-31",', "");
  const [proposal] = extractSeasonalProposals(html, source, "2026-10-18T12:00:00Z");
  assert.equal(proposal.lifecycleConfidence, "unknown");
  assert.equal(proposal.eventStatus, null);
  assert.equal(proposal.endDate, null);
  assert.equal(proposal.evidence.fieldProvenance.endDate, undefined);
  assert.equal(proposal.evidence.fieldProvenance.eventStatus, undefined);
  const [fallback] = extractSeasonalProposals("<title>Haunted House</title>", source, "2026-10-18T12:00:00Z");
  assert.equal(fallback.evidence.capture.sha256.length, 64);
  assert.equal(fallback.evidence.fieldProvenance.title.htmlElement, "title");
  assert.equal(fallback.evidence.fieldProvenance.startDate, undefined);
});
