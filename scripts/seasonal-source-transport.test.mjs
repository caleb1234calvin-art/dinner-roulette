import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import { Agent } from "node:https";
import test from "node:test";
import { performance } from "node:perf_hooks";
import { setTimeout as delay } from "node:timers/promises";
import { createSeasonalSourceTransport, createSeasonalSourceTransportForTests } from "./seasonal-source-transport.mjs";

const NOW = Date.parse("2026-10-18T12:00:00.000Z");
let sequence = 0;
function registryFixture() {
  const id = "fixture-" + ++sequence;
  const url = `https://${id}.seasonal-fixture.org/events?q=fall`;
  return { automationEnabled: true, officialOperatorPilotQueue: [{ id, url,
    automaticAccess: "reviewed-allow", fetchClearance: {
      policyVersion: 1, approvedUrl: url, robots: "allow", terms: "allow", reuse: "allow",
      reviewer: "offline fixture", rightsBasis: "OFFLINE TEST ONLY",
      reviewedAt: "2026-10-18", expiresAt: "2026-10-19T00:00:00.000Z",
    } }] };
}
function fixture(options = {}) {
  const registry = options.registry ?? registryFixture();
  const source = registry.officialOperatorPilotQueue[0];
  const calls = { dns: [], requests: [], cancels: 0, requestDestroyed: 0,
    responseDestroyed: 0, socketDestroyed: 0 };
  let controls;
  const resolverFactory = () => ({
    async resolve4(host) { calls.dns.push([4, host]); return options.resolve4 ? options.resolve4() : ["93.184.216.34"]; },
    async resolve6(host) { calls.dns.push([6, host]); return options.resolve6 ? options.resolve6() : []; },
    cancel() { calls.cancels++; return options.cancel?.(); },
  });
  const request = (requestOptions, callback) => {
    calls.requests.push(requestOptions);
    const req = new EventEmitter();
    const socket = Object.assign(new EventEmitter(), { encrypted: true, authorized: true,
      remoteAddress: requestOptions.hostname, remotePort: 443, ...options.socket });
    const res = Object.assign(new EventEmitter(), { statusCode: 200, complete: false, aborted: false,
      socket, rawHeaders: ["Content-Type", "text/html; charset=UTF-8"], ...options.response });
    socket.destroy = () => { calls.socketDestroyed++; return options.socketDestroy?.(); };
    req.destroy = () => { calls.requestDestroyed++; return options.requestDestroy?.(); };
    res.destroy = () => { calls.responseDestroyed++; return options.responseDestroy?.(); };
    controls = { req, res, socket, callback, requestOptions,
      headers() { callback(res); },
      body(chunks = [Buffer.from("<title>Seasonal fixture</title>")]) {
        for (const chunk of chunks) res.emit("data", chunk);
        res.complete = true; res.emit("end");
      },
    };
    req.end = () => queueMicrotask(() => {
      req.emit("socket", socket);
      socket.emit("secureConnect");
      if (options.run) options.run(controls);
      else { controls.headers(); controls.body(); }
    });
    return req;
  };
  const transport = (options.factory ?? createSeasonalSourceTransportForTests)({ registry, now: options.now ?? (() => NOW),
    resolverFactory, request, deadlineMs: options.deadlineMs ?? 500 });
  return { transport, calls, registry, source, get controls() { return controls; },
    retrieve: extra => transport.retrieve(source.id, extra) };
}
const rejects = (promise, code) => assert.rejects(promise, { code });
async function started(f) {
  for (let i = 0; i < 100 && !f.controls; i++) await delay(1);
  assert.ok(f.controls, "offline request started");
}

test("checked-in registry is blocked in production; there is no implicit network activation", async () => {
  const registry = JSON.parse(readFileSync(new URL("../audit/seasonal-source-discovery-2026-10-18/source-registry.json", import.meta.url)));
  const transport = createSeasonalSourceTransport();
  for (const source of registry.officialOperatorPilotQueue) await rejects(transport.retrieve(source.id), "blocked-by-policy");
  await rejects(transport.retrieve("https://unregistered.org/"), "unknown-source");
  assert.throws(() => createSeasonalSourceTransportForTests({ registry }), /Both offline/);
});

test("unambiguous source IDs and complete current exact-URL clearance are required before DNS", async () => {
  const changes = [
    (r) => { r.automationEnabled = false; },
    (r, s) => { s.automaticAccess = "blocked"; },
    (r, s) => { delete s.fetchClearance; },
    ...["robots", "terms", "reuse", "reviewer", "rightsBasis", "approvedUrl", "policyVersion", "reviewedAt", "expiresAt"].map(key =>
      (r, s) => { delete s.fetchClearance[key]; }),
    (r, s) => { s.fetchClearance.approvedUrl += "/other"; },
    (r, s) => { s.fetchClearance.reviewedAt = "2026-02-30"; },
    (r, s) => { s.fetchClearance.reviewedAt = "2026-10-19"; },
    (r, s) => { s.fetchClearance.expiresAt = "2026-10-18T12:00:00.000Z"; },
    (r, s) => { s.fetchClearance.expiresAt = "2026-11-31T00:00:00.000Z"; },
    (r, s) => { s.fetchClearance.robotsMinimumIntervalMs = -1; },
  ];
  for (const change of changes) {
    const f = fixture(); change(f.registry, f.source);
    await rejects(f.retrieve(), "blocked-by-policy"); assert.equal(f.calls.dns.length, 0);
  }
  const f = fixture(); f.registry.officialOperatorPilotQueue.push(structuredClone(f.source));
  await rejects(f.retrieve(), "ambiguous-source"); assert.equal(f.calls.dns.length, 0);
});

test("only canonical DNS HTTPS port443 URLs are admitted", async () => {
  for (const url of ["http://good.org/", "https://good.org:444/", "https://good.org:443/",
    "https://user:password@good.org/", "https://good.org/#fragment", "https://127.0.0.1/",
    "https://2130706433/", "https://0177.0.0.1/", "https://0x7f000001/", "https://[::1]/",
    "https://[2606:4700:4700::1111]/", "https://localhost/", "https://x.local/", "https://x.onion/",
    "https://good.org./", "https://good..org/", "https://-good.org/", "https://good_.org/", "https://GOOD.org/",
    " https://good.org/", "https://good.org/a/../b", "https://good.org/\\evil"]) {
    const f = fixture(); f.source.url = url; f.source.fetchClearance.approvedUrl = url;
    await rejects(f.retrieve(), "invalid-source-url"); assert.equal(f.calls.dns.length, 0);
  }
});

test("pins the actual numeric socket, preserves original HTTP/TLS identity, and rejects option overrides", async () => {
  const f = fixture();
  const result = await f.retrieve({ url: "https://attacker.org/", method: "POST", headers: { Authorization: "bad" },
    rejectUnauthorized: false, agent: {}, lookup: () => {}, timeout: 100_000 });
  assert.equal(result.html, "<title>Seasonal fixture</title>");
  assert.equal(result.sourceUrl, f.source.url);
  assert.equal(result.checkedAt, "2026-10-18T12:00:00.000Z");
  const opts = f.calls.requests[0];
  const hostname = new URL(f.source.url).hostname;
  assert.equal(opts.hostname, "93.184.216.34");
  assert.equal(opts.servername, hostname); assert.equal(opts.headers.Host, hostname);
  assert.equal(opts.port, 443); assert.equal(opts.family, 4); assert.equal(opts.autoSelectFamily, false);
  assert.equal(opts.method, "GET"); assert.equal(opts.path, "/events?q=fall");
  assert.equal(opts.headers["Accept-Encoding"], "identity");
  assert.equal(opts.headers.Authorization, undefined); assert.equal(opts.headers.Cookie, undefined);
  assert.equal(opts.rejectUnauthorized, true); assert.equal(opts.insecureHTTPParser, false);
  assert.equal(opts.maxHeaderSize, 16 * 1024); assert.ok(opts.agent instanceof Agent);
  assert.equal(opts.agent.options.keepAlive, false); assert.equal(opts.agent.maxCachedSessions, 0);
  assert.equal(opts.checkServerIdentity("wrong-host", { subjectaltname: `DNS:${hostname}` }), undefined);
  assert.equal(opts.checkServerIdentity(hostname, { subjectaltname: "DNS:attacker.org" }).code, "ERR_TLS_CERT_ALTNAME_INVALID");
  opts.lookup(hostname, {}, error => assert.equal(error.code, "source-unexpected-dns-lookup"));
  assert.equal(f.calls.dns.length, 2); assert.equal(f.calls.requests.length, 1);
  assert.ok(f.calls.cancels && f.calls.requestDestroyed && f.calls.responseDestroyed && f.calls.socketDestroyed);
});

test("all reviewed IPv4 special ranges reject both first and last addresses before a socket", async () => {
  const cidrs = ["0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8", "169.254.0.0/16",
    "172.16.0.0/12", "192.0.0.0/24", "192.0.2.0/24", "192.31.196.0/24", "192.52.193.0/24",
    "192.88.99.0/24", "192.168.0.0/16", "192.175.48.0/24", "198.18.0.0/15", "198.51.100.0/24",
    "203.0.113.0/24", "224.0.0.0/4", "240.0.0.0/4"];
  for (const cidr of cidrs) {
    const [base, bits] = cidr.split("/");
    const first = base.split(".").reduce((n, octet) => n * 256 + Number(octet), 0);
    const last = first + 2 ** (32 - Number(bits)) - 1;
    const lastText = [24, 16, 8, 0].map(shift => Math.floor(last / 2 ** shift) % 256).join(".");
    for (const address of [base, lastText]) {
      const f = fixture({ resolve4: () => [address] });
      await rejects(f.retrieve(), "source-dns-address-rejected"); assert.equal(f.calls.requests.length, 0);
    }
  }
});

test("IPv6 global-only policy denies special, mapped, transition, scoped, and malformed answers", async () => {
  for (const address of ["::", "::1", "::ffff:93.184.216.34", "::ffff:127.0.0.1", "64:ff9b::5db8:d822",
    "64:ff9b:1::1", "100::1", "100:0:0:1::1", "2001::", "2001:1ff:ffff:ffff:ffff:ffff:ffff:ffff",
    "2001:db8::", "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff", "2002::", "2002:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
    "2620:4f:8000::", "2620:4f:8000:ffff:ffff:ffff:ffff:ffff", "3fff::", "3fff:fff:ffff:ffff:ffff:ffff:ffff:ffff",
    "5f00::1", "fc00::1", "fe80::1", "ff02::1", "2606:4700:4700::1111%eth0", "not-an-ip", "127.1",
    "0x7f000001", "0177.0.0.1", "2130706433", "93.184.216.34", "2606:::1111"]) {
    const f = fixture({ resolve4: () => [], resolve6: () => [address] });
    await rejects(f.retrieve(), "source-dns-address-rejected"); assert.equal(f.calls.requests.length, 0);
  }
  const good = fixture({ resolve4: () => [], resolve6: () => ["2606:4700:4700::1111"] });
  await good.retrieve(); assert.equal(good.calls.requests[0].family, 6);
});

test("mixed DNS answers, errors, and ambiguous answers never fall through to a public fallback", async () => {
  for (const options of [
    { resolve4: () => ["93.184.216.34", "10.0.0.1"] },
    { resolve4: () => ["93.184.216.34"], resolve6: () => ["::1"] },
    { resolve4: () => [{ address: "93.184.216.34" }] },
    { resolve4: () => null },
    { resolve4: () => Array(65).fill("93.184.216.34") },
  ]) {
    const f = fixture(options); await rejects(f.retrieve(), "source-dns-address-rejected"); assert.equal(f.calls.requests.length, 0);
  }
  for (const code of ["ENOTFOUND", "ESERVFAIL", "ETIMEOUT", "ECANCELLED", "UNKNOWN"]) {
    const f = fixture({ resolve6: () => { throw Object.assign(Error(code), { code }); } });
    await rejects(f.retrieve(), "source-dns-failed"); assert.equal(f.calls.requests.length, 0);
  }
  const noV6 = fixture({ resolve6: () => { throw Object.assign(Error("none"), { code: "ENODATA" }); } });
  await noV6.retrieve();
  const empty = fixture({ resolve4: () => [], resolve6: () => [] });
  await rejects(empty.retrieve(), "source-dns-empty");
});

test("changed DNS cannot rebind a pinned socket and TLS/remote-address mismatches fail closed", async () => {
  let answers = ["93.184.216.34"];
  const rebind = fixture({ resolve4: () => { const first = answers; answers = ["127.0.0.1"]; return first; } });
  await rebind.retrieve(); assert.equal(rebind.calls.requests[0].hostname, "93.184.216.34");
  assert.equal(rebind.calls.dns.length, 2);
  for (const socket of [{ remoteAddress: "127.0.0.1" }, { remoteAddress: "1.1.1.1" }, { remotePort: 8443 },
    { encrypted: false }, { authorized: false }, { remoteAddress: "not-an-ip" }]) {
    const f = fixture({ socket }); await rejects(f.retrieve(), "source-socket-rejected");
    assert.ok(f.calls.requestDestroyed && f.calls.socketDestroyed);
  }
  const mappedSocket = fixture({ socket: { remoteAddress: "::ffff:93.184.216.34" } });
  await mappedSocket.retrieve(); // Native exact-IP comparison handles OS mapped presentation.
});

test("redirects, HTTP errors, upgrades and informational responses never trigger a retry", async () => {
  for (const statusCode of [301, 302, 303, 307, 308, 404, 500, 204]) {
    const f = fixture({ response: { statusCode, rawHeaders: ["Location", "http://127.0.0.1/"] } });
    await rejects(f.retrieve(), statusCode >= 300 && statusCode < 400 ? "source-redirect-rejected" : "source-http-error");
    assert.equal(f.calls.requests.length, 1); assert.ok(f.calls.responseDestroyed);
  }
  const upgrade = fixture({ run: ({ req, res, socket }) => req.emit("upgrade", res, socket) });
  await rejects(upgrade.retrieve(), "source-upgrade-rejected");
  const informational = fixture({ run: ({ req }) => req.emit("information", { statusCode: 103 }) });
  await rejects(informational.retrieve(), "source-informational-response-rejected");
});

test("strict MIME, identity encoding, duplicate/ambiguous headers and header/body limits", async () => {
  const cases = [
    [["Content-Type", "text/html-evil"], "source-not-html"],
    [["Content-Type", "text/plain; text/html"], "source-not-html"],
    [["Content-Type", "text/html; charset=latin1"], "source-not-html"],
    [["Content-Type", "text/html", "Content-Encoding", "gzip"], "source-encoding-rejected"],
    [["Content-Type", "text/html", "Content-Encoding", "identity, gzip"], "source-encoding-rejected"],
    [["Content-Type", "text/html", "Content-Type", "text/html"], "source-malformed-headers"],
    [["Content-Type", "text/html", "Content-Length", "-1"], "source-malformed-headers"],
    [["Content-Type", "text/html", "Content-Length", "01"], "source-malformed-headers"],
    [["Content-Type", "text/html", "Content-Length", "4", "Transfer-Encoding", "chunked"], "source-malformed-headers"],
    [["Content-Type", "text/html", "Content-Length", "512001"], "source-body-too-large"],
    [["Content-Type", "text/html", "X-Too-Big", "x".repeat(16384)], "source-headers-too-large"],
    [["Content-Type", "text/html", "X-Inject", "a\r\nb"], "source-malformed-headers"],
    [["Content-Type"], "source-malformed-headers"],
  ];
  for (const [rawHeaders, code] of cases) {
    const f = fixture({ response: { rawHeaders } }); await rejects(f.retrieve(), code); assert.ok(f.calls.responseDestroyed);
  }
  const exact = fixture({ response: { rawHeaders: ["Content-Type", "application/xhtml+xml", "Content-Length", "512000"] },
    run: controls => { controls.headers(); controls.body([Buffer.alloc(512000, "x")]); } });
  assert.equal((await exact.retrieve()).html.length, 512000);
  for (const chunks of [[Buffer.alloc(512001)], [Buffer.alloc(300000), Buffer.alloc(212001)]]) {
    const f = fixture({ run: controls => { controls.headers(); controls.body(chunks); } });
    await rejects(f.retrieve(), "source-body-too-large"); assert.ok(f.calls.responseDestroyed && f.calls.requestDestroyed);
  }
});

test("malformed, truncated and errored streams destroy resources without accepting a partial page", async () => {
  const cases = [
    [controls => { controls.headers(); controls.body(["not-a-buffer"]); }, "source-malformed-body"],
    [controls => { controls.headers(); controls.res.emit("data", Buffer.from("short")); controls.res.emit("end"); }, "source-response-truncated"],
    [controls => { controls.headers(); controls.res.emit("close"); }, "source-response-truncated"],
    [controls => { controls.headers(); controls.res.emit("aborted"); }, "source-response-aborted"],
    [controls => { controls.headers(); controls.res.emit("error", Error("body failure")); }, "source-response-error"],
    [controls => controls.req.emit("error", Error("certificate failed")), "source-request-error"],
    [controls => controls.callback({}), "source-malformed-response"],
  ];
  for (const [run, code] of cases) {
    const f = fixture({ run }); await rejects(f.retrieve(), code); assert.ok(f.calls.requestDestroyed);
  }
  const length = fixture({ response: { rawHeaders: ["Content-Type", "text/html", "Content-Length", "100"] } });
  await rejects(length.retrieve(), "source-response-truncated");
  const utf8 = fixture({ run: controls => { controls.headers(); controls.body([Buffer.from([0xff])]); } });
  await assert.rejects(utf8.retrieve());
});

test("one hard deadline covers noncooperative DNS, headers, body and never-settling cleanup", async () => {
  let release;
  const dns = fixture({ deadlineMs: 25, resolve4: () => new Promise(resolve => { release = resolve; }),
    cancel: () => new Promise(() => {}) });
  await rejects(dns.retrieve(), "source-deadline-exceeded");
  assert.equal(dns.calls.cancels, 1); release(["93.184.216.34"]); await delay(5);
  assert.equal(dns.calls.requests.length, 0);
  for (const run of [() => {}, controls => controls.headers()]) {
    const f = fixture({ deadlineMs: 25, run, responseDestroy: () => new Promise(() => {}), requestDestroy: () => new Promise(() => {}) });
    const before = performance.now(); await rejects(f.retrieve(), "source-deadline-exceeded");
    assert.ok(performance.now() - before < 500); assert.ok(f.calls.requestDestroyed);
    f.controls.headers(); f.controls.body(); // late mock work must not deliver a result or crash
  }
});

test("caller abort settles immediately at every phase and late data remains ignored", async () => {
  const early = fixture(); const earlyController = new AbortController(); earlyController.abort();
  await rejects(early.retrieve({ signal: earlyController.signal }), "source-aborted"); assert.equal(early.calls.dns.length, 0);
  for (const run of [() => {}, controls => controls.headers()]) {
    const f = fixture({ run }); const controller = new AbortController();
    const pending = f.retrieve({ signal: controller.signal }); await started(f); controller.abort();
    await rejects(pending, "source-aborted"); assert.ok(f.calls.requestDestroyed);
    f.controls.headers(); f.controls.body(); f.controls.res.emit("error", Error("late"));
  }
});

test("expiry, revocation, policy mutation and wall-clock rollback prevent late success", async () => {
  for (const change of [
    f => { f.registry.automationEnabled = false; },
    f => { f.source.fetchClearance.reviewer = "changed"; },
    f => { f.source.url += "/changed"; },
    f => { f.source.fetchClearance.expiresAt = "2026-10-18T11:59:59.000Z"; },
  ]) {
    const f = fixture({ run: controls => controls.headers() });
    const pending = f.retrieve(); await started(f); change(f); f.controls.body(); await assert.rejects(pending);
  }
  for (const later of [NOW - 1, NOW + 24 * 3600_000]) {
    let now = NOW;
    const f = fixture({ now: () => now, run: controls => controls.headers() });
    const pending = f.retrieve(); await started(f); now = later; f.controls.body(); await assert.rejects(pending);
  }
});

test("global concurrency and host spacing hold across instances, no queued work, and slots release", async () => {
  const a = fixture({ run: () => {} }); const b = fixture({ run: () => {} });
  const ca = new AbortController(); const cb = new AbortController();
  const pa = a.retrieve({ signal: ca.signal }); const pb = b.retrieve({ signal: cb.signal });
  const blocked = fixture(); await rejects(blocked.retrieve(), "source-capacity-exceeded");
  assert.equal(blocked.calls.dns.length, 0);
  ca.abort(); cb.abort(); await rejects(pa, "source-aborted"); await rejects(pb, "source-aborted");
  const released = fixture(); await released.retrieve();
  const sameHost = fixture({ registry: released.registry });
  await rejects(sameHost.retrieve(), "source-host-cooldown"); assert.equal(sameHost.calls.dns.length, 0);
  const failedHost = fixture({ registry: a.registry });
  await rejects(failedHost.retrieve(), "source-host-cooldown"); assert.equal(failedHost.calls.requests.length, 0);
});

test("DNS abort and a combined DNS/body deadline do not admit late work", async () => {
  let resolveDns;
  const controller = new AbortController();
  const aborted = fixture({ resolve4: () => new Promise(resolve => { resolveDns = resolve; }) });
  const pending = aborted.retrieve({ signal: controller.signal });
  controller.abort(); await rejects(pending, "source-aborted");
  resolveDns(["93.184.216.34"]); await delay(1);
  assert.equal(aborted.calls.requests.length, 0); assert.equal(aborted.calls.cancels, 1);

  const combined = fixture({ deadlineMs: 50, resolve4: async () => { await delay(30); return ["93.184.216.34"]; },
    run: controls => { controls.headers(); setTimeout(() => controls.body(), 40); } });
  await rejects(combined.retrieve(), "source-deadline-exceeded");
  await delay(30); assert.equal(combined.calls.requests.length, 1);

  const late = fixture({ deadlineMs: 10, run: controls => {
    controls.headers(); const until = performance.now() + 20;
    while (performance.now() < until) { /* Hold timer dispatch to test monotonic completion guard. */ }
    controls.body();
  } });
  await rejects(late.retrieve(), "source-deadline-exceeded");
});

test("native-style parser failure, duplicate response, detached socket, and many tiny chunks stay bounded", async () => {
  const parser = fixture({ run: controls => controls.req.emit("error", Object.assign(Error("headers"), { code: "HPE_HEADER_OVERFLOW" })) });
  await rejects(parser.retrieve(), "source-request-error");
  const duplicate = fixture({ run: controls => { controls.headers(); controls.headers(); } });
  await rejects(duplicate.retrieve(), "source-duplicate-response");
  const detached = fixture({ run: controls => { controls.res.socket = {}; controls.headers(); } });
  await rejects(detached.retrieve(), "source-socket-rejected");
  const tiny = fixture({ run: controls => {
    controls.headers(); const one = Buffer.from("x");
    for (let i = 0; i < 512000; i++) controls.res.emit("data", one);
    controls.res.complete = true; controls.res.emit("end");
  } });
  assert.equal((await tiny.retrieve()).html.length, 512000);
});

test("per-host backoff persists across instances, caps at 300s, resets after success, and honors robots spacing", async context => {
  const { createSeasonalSourceTransportForTests: factory } = await import("./seasonal-source-transport.mjs?rate-fixtures");
  let tick = 1000;
  context.mock.method(performance, "now", () => tick);
  const registry = registryFixture();
  const makeFailure = (selected = registry) => fixture({ factory, registry: selected,
    resolve4: () => { throw Object.assign(Error("offline DNS failure"), { code: "ESERVFAIL" }); } });
  for (const gap of [10000, 20000, 40000, 80000, 160000, 300000, 300000]) {
    await rejects(makeFailure().retrieve(), "source-dns-failed");
    tick += gap - 1;
    const blocked = makeFailure(); await rejects(blocked.retrieve(), "source-host-cooldown");
    assert.equal(blocked.calls.dns.length, 0); tick++;
  }
  await fixture({ factory, registry }).retrieve();
  tick += 9999; await rejects(makeFailure().retrieve(), "source-host-cooldown"); tick++;
  await rejects(makeFailure().retrieve(), "source-dns-failed");
  tick += 10000; await rejects(makeFailure().retrieve(), "source-dns-failed"); // Backoff reset to 10s.

  const slow = registryFixture(); slow.officialOperatorPilotQueue[0].fetchClearance.robotsMinimumIntervalMs = 60000;
  await rejects(makeFailure(slow).retrieve(), "source-dns-failed");
  tick += 59999; await rejects(makeFailure(slow).retrieve(), "source-host-cooldown"); tick++;
  await rejects(makeFailure(slow).retrieve(), "source-dns-failed");
});

test("bounded host ledger never evicts active spacing and can reclaim an elapsed entry", async context => {
  const { createSeasonalSourceTransportForTests: factory } = await import("./seasonal-source-transport.mjs?ledger-fixtures");
  let tick = 1000;
  context.mock.method(performance, "now", () => tick);
  const slow = registryFixture(); slow.officialOperatorPilotQueue[0].fetchClearance.robotsMinimumIntervalMs = 60000;
  const makeFailure = (registry = registryFixture()) => fixture({ factory, registry,
    resolve4: () => { throw Object.assign(Error("offline DNS failure"), { code: "ESERVFAIL" }); } });
  await rejects(makeFailure(slow).retrieve(), "source-dns-failed");
  for (let index = 0; index < 255; index++) await rejects(makeFailure().retrieve(), "source-dns-failed");
  const blocked = makeFailure(); await rejects(blocked.retrieve(), "source-capacity-exceeded");
  assert.equal(blocked.calls.dns.length, 0);
  tick += 10000;
  await rejects(makeFailure().retrieve(), "source-dns-failed");
  await rejects(makeFailure(slow).retrieve(), "source-host-cooldown");
});
