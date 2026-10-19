import assert from "node:assert/strict";
import { EventEmitter, getEventListeners } from "node:events";
import test from "node:test";
import { performance } from "node:perf_hooks";
import { setTimeout as delay } from "node:timers/promises";
import { createSeasonalResearchService, createSeasonalResearchServiceForTests } from "./seasonal-source-service.mjs";
import { readResearchRegistry } from "./seasonal-source-discovery.mjs";

const NOW = Date.parse("2026-10-18T14:00:00.000Z");
let sequence = 0;
const node = { "@type": "Event", name: "New Fixture Haunted House", startDate: "2026-10-23",
  endDate: "2026-10-31", eventStatus: "EventScheduled", location: { address: "987 New Road, Joplin, MO" } };
const markup = value => '<script type="application/ld+json">' + JSON.stringify(value) + '</script>';
function sourceFixture() {
  const id = "research-service-" + ++sequence;
  const url = `https://${id}.seasonal-fixture.org/events`;
  return { id, url, automaticAccess: "reviewed-allow", fetchClearance: {
    policyVersion: 1, approvedUrl: url, robots: "allow", terms: "allow", reuse: "allow",
    reviewer: "OFFLINE FIXTURE", rightsBasis: "OFFLINE FIXTURE ONLY",
    reviewedAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00.000Z",
  } };
}
function fixture(options = {}) {
  const registry = options.registry ?? { automationEnabled: true,
    officialOperatorPilotQueue: Array.from({ length: options.sourceCount ?? 1 }, sourceFixture) };
  const source = registry.officialOperatorPilotQueue[0];
  const calls = { dns: 0, requests: 0, cancelled: 0, destroyed: 0 };
  const controls = [];
  const resolverFactory = () => ({
    async resolve4() { calls.dns++; return options.resolve4 ? options.resolve4() : ["93.184.216.34"]; },
    async resolve6() { calls.dns++; return []; },
    cancel() { calls.cancelled++; },
  });
  const request = (requestOptions, callback) => {
    calls.requests++;
    const req = new EventEmitter();
    const socket = Object.assign(new EventEmitter(), { encrypted: true, authorized: true,
      remoteAddress: requestOptions.hostname, remotePort: 443, destroy() { calls.destroyed++; } });
    const res = Object.assign(new EventEmitter(), { statusCode: 200, complete: false, aborted: false,
      socket, rawHeaders: ["Content-Type", "text/html; charset=utf-8"], destroy() { calls.destroyed++; } });
    req.destroy = () => { calls.destroyed++; };
    const control = { req, res, socket, requestOptions,
      finish(html = markup(node)) { callback(res); res.emit("data", Buffer.from(html)); res.complete = true; res.emit("end"); } };
    controls.push(control);
    req.end = () => queueMicrotask(() => {
      req.emit("socket", socket); socket.emit("secureConnect");
      if (options.run) options.run(control); else control.finish(options.html ?? markup(node));
    });
    return req;
  };
  const service = createSeasonalResearchServiceForTests({ registry, now: options.now ?? (() => NOW),
    resolverFactory, request, deadlineMs: options.deadlineMs ?? 200 });
  return { service, registry, source, calls, controls,
    discover: (extra = {}, id = source.id) => service.discover(id, { todayLocalDate: "2026-10-18", ...extra }) };
}
async function started(f, count = 1) {
  for (let index = 0; index < 100 && f.controls.length < count; index++) await delay(1);
  assert.equal(f.controls.length, count);
}
const reason = (report, value) => assert.ok(report.proposals.every(proposal => proposal.triage.reasons.includes(value)));

test("production defaults deny every checked-in source and test factory cannot bypass low-level mocks", async () => {
  const service = createSeasonalResearchService();
  for (const source of readResearchRegistry().officialOperatorPilotQueue) {
    const report = await service.discover(source.id, { todayLocalDate: "2026-10-18" });
    assert.equal(report.status, "blocked-by-policy"); assert.equal(report.transportRequests, 0);
  }
  assert.throws(() => createSeasonalResearchServiceForTests({ registry: {} }), /Both offline/);
});

test("full mocked transport to pinned inventory triage returns detached unpublished research", async () => {
  const f = fixture();
  const report = await f.discover();
  assert.equal(report.status, "research-only"); assert.equal(report.retrieval, "fresh");
  assert.equal(report.counts.awaitingIndependentReview, 1); assert.equal(report.identityInputsComplete, true);
  assert.equal(report.proposals[0].publishable, false); assert.equal(report.proposals[0].openNowEligible, false);
  assert.equal(report.capture.sha256, report.proposals[0].evidence.capture.sha256);
  assert.equal(f.calls.requests, 1);
  report.proposals[0].proposedName = "mutated";
  const cached = await f.discover(); assert.equal(cached.retrieval, "cached");
  assert.equal(cached.proposals[0].proposedName, node.name); assert.equal(f.calls.requests, 1);
});

test("one coalesced subscriber cancellation leaves the other live and detaches listeners", async () => {
  const f = fixture({ run() {} });
  const a = new AbortController(); const b = new AbortController();
  const first = f.discover({ signal: a.signal }); const second = f.discover({ signal: b.signal });
  await started(f); a.abort();
  assert.equal((await first).status, "source-aborted");
  assert.equal(getEventListeners(a.signal, "abort").length, 0);
  assert.equal(f.calls.destroyed, 0);
  f.controls[0].finish();
  assert.equal((await second).retrieval, "coalesced"); assert.equal(f.calls.requests, 1);
  assert.equal(getEventListeners(b.signal, "abort").length, 0);
  b.abort(); assert.equal((await f.discover()).retrieval, "cached");
});

test("all subscribers cancel upstream and late response cannot populate cache", async context => {
  let tick = 1000; context.mock.method(performance, "now", () => tick);
  const f = fixture({ run() {} }); const a = new AbortController(); const b = new AbortController();
  const pa = f.discover({ signal: a.signal }); const pb = f.discover({ signal: b.signal });
  await started(f); a.abort(); b.abort();
  assert.equal((await pa).status, "source-aborted"); assert.equal((await pb).status, "source-aborted");
  assert.ok(f.calls.destroyed > 0); f.controls[0].finish(); await delay(1);
  tick += 10000; const next = f.discover(); await started(f, 2); f.controls[1].finish();
  assert.equal((await next).retrieval, "fresh");
});

test("deadline settles ignored upstream work and late completion cannot cache", async context => {
  let tick = 1000; context.mock.method(performance, "now", () => tick);
  const f = fixture({ run() {}, deadlineMs: 10 });
  const pending = f.discover(); await started(f);
  assert.equal((await pending).status, "source-deadline-exceeded");
  f.controls[0].finish(); await delay(1); tick += 10000;
  const next = f.discover(); await started(f, 2); f.controls[1].finish();
  assert.equal((await next).retrieval, "fresh");
});

test("policy revocation blocks cached results and policy changes invalidate coalesced work", async () => {
  const cached = fixture(); await cached.discover(); cached.source.automaticAccess = "blocked";
  assert.equal((await cached.discover()).status, "blocked-by-policy"); assert.equal(cached.calls.requests, 1);
  const pending = fixture({ run() {} });
  const a = pending.discover(); const b = pending.discover(); await started(pending);
  pending.source.fetchClearance.rightsBasis = "changed review"; pending.controls[0].finish();
  assert.equal((await a).status, "source-policy-changed"); assert.equal((await b).status, "source-policy-changed");
});

test("local day and inventory expiry are rechecked on every cache read and after await", async () => {
  let time = NOW;
  const f = fixture({ now: () => time }); await f.discover();
  const expiredEvent = await f.discover({ todayLocalDate: "2026-11-01" });
  assert.equal(expiredEvent.retrieval, "cached"); reason(expiredEvent, "ended-before-local-day");
  const replay = await f.discover(); reason(replay, "persistent-negative-evidence-collision");
  time = Date.parse("2026-10-18T19:41:16Z");
  assert.equal((await f.discover()).status, "identity-inventories-unavailable"); assert.equal(f.calls.requests, 1);
  let after = NOW;
  const waiting = fixture({ now: () => after, run() {} });
  const pending = waiting.discover(); await started(waiting);
  after = Date.parse("2026-10-18T19:41:16Z"); waiting.controls[0].finish();
  assert.equal((await pending).status, "identity-inventories-unavailable");
  const invalid = fixture(); assert.equal((await invalid.discover({ todayLocalDate: null })).status, "invalid-destination-local-day");
  assert.equal(invalid.calls.requests, 0);
});

test("negative evidence survives cache eviction, URL revision and cross-source name or address collision", async context => {
  let tick = 1000; context.mock.method(performance, "now", () => tick);
  let html = markup({ ...node, eventStatus: "EventCancelled" });
  const f = fixture({ sourceCount: 10, run: control => control.finish(html) });
  const negative = await f.discover(); reason(negative, "persistent-negative-evidence-collision");
  html = markup({ ...node, name: "Unrelated Haunted House", location: { address: "Unrelated Road" } });
  for (const source of f.registry.officialOperatorPilotQueue.slice(1, 9)) await f.discover({}, source.id);
  html = markup({ ...node, location: { address: "New Changed Address" } }); tick += 10000;
  const old = await f.discover(); assert.equal(old.retrieval, "fresh"); reason(old, "persistent-negative-evidence-collision");
  f.source.url += "?revised=1"; f.source.fetchClearance.approvedUrl = f.source.url; tick += 10000;
  const changed = await f.discover(); reason(changed, "persistent-negative-evidence-collision");
  html = markup({ ...node, name: "Changed Name Haunted House" });
  const other = await f.discover({}, f.registry.officialOperatorPilotQueue[9].id);
  reason(other, "persistent-negative-evidence-collision");
  assert.equal(other.proposals[0].negativeEvidence[0].sourceUrl, negative.capture.sourceUrl);
});

test("known aliases preserve cross-source negative collision without claiming a merge", async () => {
  let html = markup({ ...node, name: "Acres of Madness", eventStatus: "EventCancelled" });
  const f = fixture({ sourceCount: 2, run: control => control.finish(html) });
  await f.discover(); html = markup({ ...node, name: "HELLS Gate", location: { address: "Changed Address" } });
  const alias = await f.discover({}, f.registry.officialOperatorPilotQueue[1].id);
  reason(alias, "persistent-negative-evidence-collision"); assert.equal(alias.proposals[0].proposedName, "HELLS Gate");
});

test("conflicting, empty and incomplete captures latch conservative source uncertainty", async context => {
  let tick = 1000; context.mock.method(performance, "now", () => tick);
  for (const original of ["<html>No structured evidence</html>", markup([node, { ...node, endDate: "2026-10-24" }]),
    markup([...Array.from({ length: 50 }, () => node), { ...node, eventStatus: "EventCancelled" }]),
    markup([...Array.from({ length: 5 }, (_, index) => ({ ...node, name: `Haunted House ${index}` })),
      { ...node, name: "Sixth Haunted House", eventStatus: "EventCancelled" }])]) {
    let html = original;
    const f = fixture({ run: control => control.finish(html) }); const first = await f.discover();
    html = markup(node); f.source.url += "?new=1"; f.source.fetchClearance.approvedUrl = f.source.url; tick += 10000;
    const later = await f.discover(); assert.equal(later.counts.awaitingIndependentReview, 0);
    assert.ok(later.proposals[0].triage.reasons.some(value => /persistent/.test(value)));
    assert.equal(first.counts.publishable, 0);
  }
});

test("negative ledger overflow latches before subsequent network work instead of evicting authority", async context => {
  let tick = 1000; context.mock.method(performance, "now", () => tick);
  let value = node;
  const f = fixture({ run: control => control.finish(markup(value)) });
  for (let index = 0; index < 65; index++) {
    value = { ...node, name: `Negative Haunted House ${index}`, location: { address: `Different address ${index}` }, eventStatus: "EventCancelled" };
    f.source.url = `https://${f.source.id}.seasonal-fixture.org/${index}`; f.source.fetchClearance.approvedUrl = f.source.url;
    tick += 10000; const report = await f.discover(); assert.equal(report.status, "research-only");
    if (index === 64) assert.ok(report.researchHoldReasons.includes("negative-ledger-capacity-hold"));
  }
  const before = f.calls.requests; assert.equal((await f.discover()).status, "negative-ledger-capacity-hold");
  assert.equal(f.calls.requests, before);
});

test("subscriber count remains bounded and extra callers do not cancel admitted work", async () => {
  const f = fixture({ run() {}, deadlineMs: 6000 });
  const pending = Array.from({ length: 32 }, () => f.discover());
  assert.equal((await f.discover()).status, "source-subscriber-capacity");
  await started(f); f.controls[0].finish();
  const reports = await Promise.all(pending); assert.ok(reports.every(report => report.status === "research-only"));
  assert.equal(f.calls.requests, 1);
});

test("clearance expiry and clock rollback while pending cannot create cached evidence", async () => {
  let time = NOW;
  const f = fixture({ now: () => time, run() {} });
  f.source.fetchClearance.expiresAt = "2026-10-18T14:01:00.000Z";
  const pending = f.discover(); await started(f);
  time += 60000; f.controls[0].finish();
  assert.equal((await pending).status, "blocked-by-policy");
  let clock = NOW;
  const backward = fixture({ now: () => clock, run() {} });
  const waiting = backward.discover(); await started(backward); clock--;
  backward.controls[0].finish();
  assert.equal((await waiting).status, "source-policy-changed");
});

test("empty-source uncertainty capacity latches without discarding earlier uncertainty", async () => {
  const f = fixture({ sourceCount: 18, html: "<html>Unparseable absence of evidence</html>" });
  for (const source of f.registry.officialOperatorPilotQueue.slice(0, 17)) {
    const report = await f.discover({}, source.id); assert.equal(report.status, "research-only");
  }
  const before = f.calls.requests;
  assert.equal((await f.discover({}, f.registry.officialOperatorPilotQueue[17].id)).status, "negative-ledger-capacity-hold");
  assert.equal(f.calls.requests, before);
});

test("DNS refusal remains a stable failed research attempt with no HTTP request", async () => {
  const f = fixture({ resolve4: () => ["127.0.0.1"] });
  assert.equal((await f.discover()).status, "source-dns-address-rejected");
  assert.equal(f.calls.requests, 0);
});
