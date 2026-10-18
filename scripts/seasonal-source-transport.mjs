/** Isolated, opt-in SERVER-ONLY research transport. Nothing in the app imports it.
 * No checked-in source is enabled. Policy v1 approves only this fixed GET/UA,
 * exact canonical URL, and the stated review interval; it is not crawl consent.
 * No URL API, redirects, retries, proxy, cookies, credentials, or caller TLS options.
 */
import { readFileSync } from "node:fs";
import { Resolver } from "node:dns/promises";
import { Agent, request as httpsRequest } from "node:https";
import { BlockList, isIP } from "node:net";
import { checkServerIdentity } from "node:tls";
import { performance } from "node:perf_hooks";

const MAX_BODY_BYTES = 512_000;
const MAX_HEADER_BYTES = 16 * 1024;
const DEADLINE_MS = 6000;
const MAX_ACTIVE = 2;
const USER_AGENT = "SeasonalSourceResearch/1.0 (non-production)";
let activeOperations = 0;
const hostLedger = new Map();
const MAX_HOSTS = 256;
const MIN_HOST_INTERVAL_MS = 10_000;

// Conservative deny: all IANA special-purpose allocations, including special
// globally-reachable exceptions, plus IPv4 multicast. Reviewed 2026-10-18:
// https://www.iana.org/assignments/iana-ipv4-special-registry/
// https://www.iana.org/assignments/iana-ipv6-special-registry/
const denied = new BlockList();
for (const cidr of [
  "0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8",
  "169.254.0.0/16", "172.16.0.0/12", "192.0.0.0/24", "192.0.2.0/24",
  "192.31.196.0/24", "192.52.193.0/24", "192.88.99.0/24", "192.168.0.0/16",
  "192.175.48.0/24", "198.18.0.0/15", "198.51.100.0/24", "203.0.113.0/24",
  "224.0.0.0/4", "240.0.0.0/4",
]) {
  const [address, prefix] = cidr.split("/");
  denied.addSubnet(address, Number(prefix), "ipv4");
}
for (const cidr of ["2001::/23", "2001:db8::/32", "2002::/16", "2620:4f:8000::/48", "3fff::/20"]) {
  const [address, prefix] = cidr.split("/");
  denied.addSubnet(address, Number(prefix), "ipv6");
}
const globalV6 = new BlockList();
globalV6.addSubnet("2000::", 3, "ipv6");

function failure(code) { return Object.assign(new Error(code), { code }); }
function publicAddress(address, expectedFamily) {
  if (typeof address !== "string" || address.includes("%")) return false;
  const family = isIP(address);
  if (!family || family !== expectedFamily) return false;
  const type = family === 4 ? "ipv4" : "ipv6";
  return (family === 4 || globalV6.check(address, type)) && !denied.check(address, type);
}
function canonicalUrl(value) {
  if (typeof value !== "string" || value.length > 2048) throw failure("invalid-source-url");
  let url;
  try { url = new URL(value); } catch { throw failure("invalid-source-url"); }
  const labels = url.hostname.split(".");
  if (url.href !== value || url.protocol !== "https:" || url.port || url.username || url.password ||
      url.hash || isIP(url.hostname) || labels.length < 2 || url.hostname.length > 253 ||
      labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) ||
      /(?:^|\.)(?:localhost|local|internal|home|test|invalid|example|onion)$/.test(url.hostname))
    throw failure("invalid-source-url");
  return url;
}
function timestamp(value, allowDate = false) {
  if (typeof value !== "string") return NaN;
  const dateOnly = allowDate && /^20\d\d-\d\d-\d\d$/.test(value);
  if (!dateOnly && !/^20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(value)) return NaN;
  const text = dateOnly ? value + "T00:00:00.000Z" : value;
  const parsed = Date.parse(text);
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString() !== text.replace(/(?<=\d\d:\d\d:\d\d)Z$/, ".000Z")) return NaN;
  return parsed;
}
function approvedSource(registry, sourceId, now) {
  if (typeof sourceId !== "string" || !sourceId || sourceId.length > 128)
    throw failure("unknown-source");
  const sources = registry?.officialOperatorPilotQueue;
  if (Array.isArray(sources) && sources.length > 512) throw failure("blocked-by-policy");
  const matches = Array.isArray(sources) ? sources.filter(source => source?.id === sourceId) : [];
  if (matches.length !== 1) throw failure(matches.length ? "ambiguous-source" : "unknown-source");
  const source = matches[0];
  if (registry?.automationEnabled !== true || source.automaticAccess !== "reviewed-allow")
    throw failure("blocked-by-policy");
  const url = canonicalUrl(source.url);
  const clearance = source.fetchClearance;
  const reviewed = timestamp(clearance?.reviewedAt, true);
  const expires = timestamp(clearance?.expiresAt);
  if (clearance?.policyVersion !== 1 || clearance?.approvedUrl !== url.href ||
      clearance?.robots !== "allow" || clearance?.terms !== "allow" || clearance?.reuse !== "allow" ||
      ![clearance?.reviewer, clearance?.rightsBasis].every(value => typeof value === "string" && value.trim() && value.length <= 4096) ||
      !Number.isFinite(now) || !Number.isFinite(reviewed) || !Number.isFinite(expires) ||
      reviewed > now || expires <= now || expires <= reviewed ||
      (clearance.robotsMinimumIntervalMs !== undefined && (!Number.isSafeInteger(clearance.robotsMinimumIntervalMs) ||
        clearance.robotsMinimumIntervalMs < 0 || clearance.robotsMinimumIntervalMs > 3_600_000)))
    throw failure("blocked-by-policy");
  // Re-read at completion: revocation, URL changes, expiry, or changed review
  // cannot publish a response admitted under an earlier policy snapshot.
  return { url, intervalMs: Math.max(MIN_HOST_INTERVAL_MS, clearance.robotsMinimumIntervalMs ?? 0),
    fingerprint: JSON.stringify([source.id, source.url, source.automaticAccess, clearance]) };
}
function cleanupCall(callback) {
  try { const result = callback(); result?.catch?.(() => {}); } catch { /* never await cleanup */ }
}
function responseMetadata(response) {
  if (response.statusCode !== 200) throw failure(response.statusCode >= 300 && response.statusCode < 400
    ? "source-redirect-rejected" : "source-http-error");
  if (!Array.isArray(response.rawHeaders) || response.rawHeaders.length % 2 ||
      response.rawHeaders.length > 1024) throw failure("source-malformed-headers");
  const headers = new Map();
  let bytes = 32; // conservative status-line + terminal CRLF allowance
  for (let i = 0; i < response.rawHeaders.length; i += 2) {
    const [name, value] = response.rawHeaders.slice(i, i + 2);
    if (typeof name !== "string" || !/^[!#$%&'*+.^_`|~0-9a-z-]+$/i.test(name) ||
        typeof value !== "string" || !/^[\t\x20-\xff]*$/.test(value)) throw failure("source-malformed-headers");
    bytes += Buffer.byteLength(name + ": " + value + "\r\n", "latin1");
    if (bytes > MAX_HEADER_BYTES) throw failure("source-headers-too-large");
    const key = name.toLowerCase();
    if (headers.has(key) && ["content-type", "content-length", "content-encoding", "transfer-encoding"].includes(key))
      throw failure("source-malformed-headers");
    headers.set(key, value.trim());
  }
  if (!/^(?:text\/html|application\/xhtml\+xml)(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"|us-ascii|"us-ascii"))?$/i.test(headers.get("content-type") ?? ""))
    throw failure("source-not-html");
  if (headers.has("content-encoding") && !/^identity$/i.test(headers.get("content-encoding")))
    throw failure("source-encoding-rejected");
  if (headers.has("transfer-encoding") && headers.get("transfer-encoding").toLowerCase() !== "chunked")
    throw failure("source-malformed-headers");
  const length = headers.get("content-length");
  if (length !== undefined && (!/^(?:0|[1-9]\d*)$/.test(length) || headers.has("transfer-encoding")))
    throw failure("source-malformed-headers");
  const expectedLength = length === undefined ? null : Number(length);
  if (expectedLength !== null && (!Number.isSafeInteger(expectedLength) || expectedLength > MAX_BODY_BYTES))
    throw failure("source-body-too-large");
  return expectedLength;
}
function directAgent() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  // proxyEnv was introduced in 22.21 / 24.5. Older Node22 has no built-in
  // env-proxy behavior. Never use globalAgent or rely on an ignored option.
  const supportsProxyEnv = major > 24 || (major === 24 && minor >= 5) || (major === 22 && minor >= 21);
  return new Agent({ keepAlive: false, maxCachedSessions: 0,
    ...(supportsProxyEnv ? { proxyEnv: {} } : {}) });
}
function buildTransport({ registry, now, resolverFactory, request, deadlineMs }) {
  return Object.freeze({
    async retrieve(sourceId, { signal } = {}) {
      const started = performance.now();
      const admittedAt = now();
      const admitted = approvedSource(registry, sourceId, admittedAt);
      if (signal !== undefined && !(signal instanceof AbortSignal)) throw failure("invalid-abort-signal");
      if (signal?.aborted) throw failure("source-aborted");
      if (activeOperations >= MAX_ACTIVE) throw failure("source-capacity-exceeded");
      // One shared bounded ledger across instances: no queue, no per-instance
      // escape from robots spacing, and bounded exponential failure backoff.
      const host = admitted.url.hostname;
      let hostState = hostLedger.get(host);
      if (hostState && (hostState.inFlight || hostState.nextAt > started)) throw failure("source-host-cooldown");
      if (!hostState) {
        if (hostLedger.size >= MAX_HOSTS) {
          for (const [key, value] of hostLedger) {
            if (!value.inFlight && value.nextAt <= started) { hostLedger.delete(key); break; }
          }
        }
        if (hostLedger.size >= MAX_HOSTS) throw failure("source-capacity-exceeded");
        hostState = { failures: 0, nextAt: 0, inFlight: false };
        hostLedger.set(host, hostState);
      }
      hostState.inFlight = true;
      hostState.nextAt = started + admitted.intervalMs;
      activeOperations++;
      return new Promise((resolve, reject) => {
        let settled = false;
        let resolver, req, res, socket, agent;
        let body = Buffer.alloc(MAX_BODY_BYTES);
        let bodyBytes = 0;
        const onAbort = () => finish(failure("source-aborted"));
        const timer = setTimeout(() => finish(failure("source-deadline-exceeded")), Math.max(0, deadlineMs - (performance.now() - started)));
        function finish(error, value) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          signal?.removeEventListener("abort", onAbort);
          activeOperations--;
          hostState.inFlight = false;
          hostState.failures = error ? Math.min(hostState.failures + 1, 6) : 0;
          const backoff = error ? Math.min(300_000, MIN_HOST_INTERVAL_MS * 2 ** (hostState.failures - 1)) : 0;
          // Space from completion, so slow DNS cannot compress actual GETs.
          hostState.nextAt = Math.max(hostState.nextAt, performance.now() + Math.max(admitted.intervalMs, backoff));
          body = null;
          // Settle independently of cancel/destroy, including mocks which return
          // promises that never settle. Late events remain guarded and absorbed.
          if (error) reject(error); else resolve(value);
          cleanupCall(() => resolver?.cancel());
          cleanupCall(() => res?.destroy());
          cleanupCall(() => req?.destroy());
          cleanupCall(() => socket?.destroy());
          cleanupCall(() => agent?.destroy());
        }
        function current() {
          if (settled) return false;
          if (performance.now() - started >= deadlineMs) {
            finish(failure("source-deadline-exceeded")); return false;
          }
          return true;
        }
        function verifyPolicy() {
          const checked = now();
          if (checked < admittedAt || approvedSource(registry, sourceId, checked).fingerprint !== admitted.fingerprint)
            throw failure("source-policy-changed");
          return checked;
        }
        signal?.addEventListener("abort", onAbort, { once: true });
        if (signal?.aborted) { onAbort(); return; }
        void (async () => {
          resolver = resolverFactory();
          const resolveFamily = async family => {
            try {
              const answers = await resolver[family === 4 ? "resolve4" : "resolve6"](admitted.url.hostname);
              if (!Array.isArray(answers) || answers.length > 64 ||
                  !answers.every(address => publicAddress(address, family))) throw failure("source-dns-address-rejected");
              return answers.map(address => ({ address, family }));
            } catch (error) {
              if (error?.code === "ENODATA") return [];
              throw error?.code === "source-dns-address-rejected" ? error : failure("source-dns-failed");
            }
          };
          const [v4, v6] = await Promise.all([resolveFamily(4), resolveFamily(6)]);
          if (!current()) return;
          const pin = v4[0] ?? v6[0];
          if (!pin) throw failure("source-dns-empty");
          verifyPolicy();
          const exactAddress = new BlockList();
          exactAddress.addAddress(pin.address, pin.family === 4 ? "ipv4" : "ipv6");
          function validSocket(candidate) {
            const family = isIP(candidate?.remoteAddress ?? "");
            return candidate?.encrypted === true && candidate?.authorized === true && candidate?.remotePort === 443 &&
              family !== 0 && !candidate.remoteAddress.includes("%") &&
              exactAddress.check(candidate.remoteAddress, family === 4 ? "ipv4" : "ipv6");
          }
          agent = directAgent();
          req = request({
            protocol: "https:", hostname: pin.address, port: 443,
            path: admitted.url.pathname + admitted.url.search, method: "GET",
            family: pin.family, autoSelectFamily: false, agent,
            // Connect numerically; hostname is never resolved again. TLS and
            // HTTP authority remain the exact approved DNS name.
            servername: admitted.url.hostname, rejectUnauthorized: true,
            checkServerIdentity: (_hostname, cert) => checkServerIdentity(admitted.url.hostname, cert),
            lookup: (_hostname, _options, callback) => callback(failure("source-unexpected-dns-lookup")),
            maxHeaderSize: MAX_HEADER_BYTES, insecureHTTPParser: false,
            headers: { Host: admitted.url.hostname, Accept: "text/html,application/xhtml+xml",
              "Accept-Encoding": "identity", "User-Agent": USER_AGENT, Connection: "close" },
          }, response => {
            if (!response || typeof response.on !== "function" || typeof response.destroy !== "function") {
              finish(failure("source-malformed-response")); return;
            }
            response.on("error", () => finish(failure("source-response-error")));
            if (!current()) { cleanupCall(() => response.destroy()); return; }
            if (res) { cleanupCall(() => response.destroy()); finish(failure("source-duplicate-response")); return; }
            res = response;
            // Error handler was attached before checking state or destroying.
            res.on("aborted", () => finish(failure("source-response-aborted")));
            res.on("close", () => { if (!settled) finish(failure("source-response-truncated")); });
            try {
              if (!validSocket(socket) || res.socket !== socket) throw failure("source-socket-rejected");
              const expectedLength = responseMetadata(res);
              res.on("data", chunk => {
                if (!current()) return;
                if (!Buffer.isBuffer(chunk)) { finish(failure("source-malformed-body")); return; }
                bodyBytes += chunk.byteLength;
                if (bodyBytes > MAX_BODY_BYTES || (expectedLength !== null && bodyBytes > expectedLength)) {
                  finish(failure("source-body-too-large")); return;
                }
                chunk.copy(body, bodyBytes - chunk.byteLength);
              });
              res.on("end", () => {
                if (!current()) return;
                try {
                  if (res.complete !== true || res.aborted || (expectedLength !== null && expectedLength !== bodyBytes))
                    throw failure("source-response-truncated");
                  const checkedAt = new Date(verifyPolicy()).toISOString();
                  const html = new TextDecoder("utf-8", { fatal: true }).decode(body.subarray(0, bodyBytes));
                  finish(null, { sourceId, sourceUrl: admitted.url.href, html, checkedAt });
                } catch (error) { finish(error); }
              });
            } catch (error) { finish(error); }
          });
          req.on("error", () => finish(failure("source-request-error")));
          req.on("socket", candidate => {
            socket = candidate;
            socket.on("error", () => finish(failure("source-socket-error")));
            if (!current()) { cleanupCall(() => socket.destroy()); return; }
            socket.once("secureConnect", () => {
              if (current() && !validSocket(socket)) finish(failure("source-socket-rejected"));
            });
          });
          req.on("upgrade", (_response, upgradedSocket) => {
            cleanupCall(() => upgradedSocket.destroy()); finish(failure("source-upgrade-rejected"));
          });
          req.on("information", () => finish(failure("source-informational-response-rejected")));
          if (!current()) { cleanupCall(() => req.destroy()); return; }
          req.end();
        })().catch(error => finish(error));
      });
    },
  });
}

/** Production entry point: only a reviewed registry and source IDs are accepted.
 * Creating the object does no DNS or network I/O. No app/default pilot wiring. */
export function createSeasonalSourceTransport({ registry = JSON.parse(readFileSync(
  new URL("../audit/seasonal-source-discovery-2026-10-18/source-registry.json", import.meta.url), "utf8")) } = {}) {
  return buildTransport({ registry, now: Date.now, resolverFactory: () => new Resolver(),
    request: httpsRequest, deadlineMs: DEADLINE_MS });
}

/** OFFLINE TEST HARNESS ONLY. Both low-level boundaries are mandatory, so a
 * missing mock can never silently fall back to live DNS or HTTPS. */
export function createSeasonalSourceTransportForTests({ registry, now = Date.now, resolverFactory, request,
  deadlineMs = DEADLINE_MS } = {}) {
  if (typeof resolverFactory !== "function" || typeof request !== "function" || typeof now !== "function" ||
      !Number.isFinite(deadlineMs) || deadlineMs <= 0 || deadlineMs > DEADLINE_MS)
    throw new TypeError("Both offline transport mocks and a bounded deadline are required");
  return buildTransport({ registry, now, resolverFactory, request, deadlineMs });
}
