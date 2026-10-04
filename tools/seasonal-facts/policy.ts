import { isIP } from "node:net";
import { instant, source, url, type Source } from "./schema.ts";

export const NETWORK_ENABLED = false as const;
export const EXECUTION_POLICY = Object.freeze({ execution: "inert-only", scripts: false, browser: false,
  eval: false, llmExtraction: false, remoteCode: false, subresources: false, credentials: false,
  accessBypass: false, arbitraryUserUrls: false, retries: 0, paidFallback: false });

export function permissionApproved(raw: unknown, at: string): boolean {
  const s = source.parse(raw);
  instant.parse(at);
  const reviewed = (r: Source["robots"]) => r.state === "approved" && r.evidenceIds.length > 0 &&
    r.reviewer !== null && r.reviewedAt !== null && r.reviewedAt <= at;
  return reviewed(s.robots) && reviewed(s.terms) && reviewed(s.permission) && s.permission.reuse === "approved" &&
    s.permission.expiresAt !== null && s.permission.expiresAt > at &&
    (!s.attribution.required || (s.attribution.text !== null && s.attribution.license !== null));
}

export function automaticCollectionAllowed(raw: unknown, at: string): boolean {
  // Validate even though no input can enable A1 networking.
  permissionApproved(raw, at);
  return NETWORK_ENABLED;
}

export function validateUrl(raw: string, definition: unknown): URL {
  const s = source.parse(definition);
  url.parse(raw);
  // WHATWG URL parsing normalizes away dot segments, empty userinfo and odd IP
  // spellings. Reject ambiguity BEFORE normalization, including encoded delimiters.
  if (!raw.startsWith("https://") || [...raw].some(c => c.charCodeAt(0) <= 32 || c.charCodeAt(0) === 127) || /[\\#]/u.test(raw) ||
    raw.slice(8).split(/[/?]/)[0].includes("@")) throw new Error("Unsafe URL syntax");
  const u = new URL(raw);
  if (u.protocol !== "https:" || (u.port && u.port !== "443") || u.username || u.password || u.hash ||
    isIP(u.hostname.replace(/^\[|\]$/g, "")) || !s.allowedHosts.includes(u.hostname)) throw new Error("URL origin denied");
  const rawPath = raw.slice(8).replace(/^[^/ ?]+/, "").split("?")[0] || "/";
  if (/%|\\|\/\//u.test(rawPath) || rawPath.split("/").some(v => v === "." || v === "..")) throw new Error("Ambiguous path");
  if (!s.allowedPaths.some(p => p.kind === "exact" ? u.pathname === p.value :
    u.pathname === p.value || u.pathname.startsWith(p.value.endsWith("/") ? p.value : `${p.value}/`)))
    throw new Error("Path denied");
  const keys = [...u.searchParams.keys()];
  if (new Set(keys).size !== keys.length || [...u.searchParams].some(([k, v]) =>
    !s.allowedQuery.some(q => q.name === k && q.values.includes(v)))) throw new Error("Query denied");
  return u;
}

function ipNumber(ip: string): { version: number; value: bigint } {
  if (ip.includes("%")) throw new Error("Scoped address denied");
  const version = isIP(ip);
  if (version === 4) return { version, value: ip.split(".").reduce((n, part) => (n << 8n) + BigInt(part), 0n) };
  if (version !== 6) throw new Error("Invalid IP");
  let s = ip.toLowerCase();
  if (s.includes(".")) {
    const last = s.lastIndexOf(":");
    const v4 = ipNumber(s.slice(last + 1)).value;
    s = `${s.slice(0, last)}:${(v4 >> 16n).toString(16)}:${(v4 & 65535n).toString(16)}`;
  }
  const halves = s.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const parts = halves.length === 2 ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right] : left;
  return { version, value: parts.reduce((n, p) => (n << 16n) + BigInt(`0x${p}`), 0n) };
}
const inRange = (value: bigint, base: string, bits: number) => {
  const parsed = ipNumber(base);
  const shift = BigInt((parsed.version === 4 ? 32 : 128) - bits);
  return value >> shift === parsed.value >> shift;
};
export function assertPublicIp(ip: string): string {
  const { version, value } = ipNumber(ip);
  const denied4: [string, number][] = [["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
    ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24],
    ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 3],
    ["168.63.129.16", 32]]; // Cloud platform virtual/metadata endpoint.
  const denied = version === 4 ? denied4.some(([base, bits]) => inRange(value, base, bits)) :
    // Conservative global-unicast-only policy rejects mapped/compatible IPv4,
    // NAT64, ULA, link-local, multicast and other special IPv6 ranges outright.
    !inRange(value, "2000::", 3) || inRange(value, "2001::", 23) || inRange(value, "2001:db8::", 32) ||
    inRange(value, "2002::", 16) || inRange(value, "3fff::", 20);
  if (denied) throw new Error("Non-public/reserved IP denied");
  return `${version}:${value.toString(16)}`;
}

/** Future transport must resolve each hop, reject ANY non-public answer, pin an
 * approved address and validate the connected socket peer before consuming it.
 * Automatic redirect following is forbidden. This pure hook performs no DNS. */
export function validateDnsAndPeer(rawUrl: string, s: unknown, answers: string[], peer: string): void {
  validateUrl(rawUrl, s);
  if (!answers.length || answers.length > 16) throw new Error("DNS answer bound");
  const pinned = answers.map(assertPublicIp);
  if (!pinned.includes(assertPublicIp(peer))) throw new Error("Unpinned peer/rebinding denied");
}
export function validateRedirectChain(chain: string[], s: unknown): void {
  const parsed = source.parse(s);
  if (!Array.isArray(chain)) throw new Error("Invalid redirect chain");
  if (!chain.length || chain.length - 1 > parsed.budget.redirects || chain.length > 3) throw new Error("Redirect bound");
  for (let index = 0; index < chain.length; index++) {
    if (!Object.hasOwn(chain, index) || typeof chain[index] !== "string") throw new Error("Invalid redirect hop");
    validateUrl(chain[index], parsed);
  }
}
export function validateResponseEnvelope(s: unknown, metrics: {
  contentType: string; headerBytes: number; wireBytes: number; decompressedBytes: number;
  elapsedMs: number; domNodes: number; depth: number; jsonLdBytes: number; requests: number;
}): void {
  const p = source.parse(s);
  const numericKeys = ["headerBytes", "wireBytes", "decompressedBytes", "elapsedMs", "domNodes", "depth", "jsonLdBytes", "requests"] as const;
  const requiredKeys = ["contentType", ...numericKeys];
  if (metrics === null || typeof metrics !== "object" ||
    (Object.getPrototypeOf(metrics) !== Object.prototype && Object.getPrototypeOf(metrics) !== null) ||
    Reflect.ownKeys(metrics).length !== requiredKeys.length || !requiredKeys.every(key => Object.hasOwn(metrics, key)) ||
    typeof metrics.contentType !== "string" || !numericKeys.every(key => Number.isSafeInteger(metrics[key]) && metrics[key] >= 0))
    throw new Error("Invalid response metrics");
  const { contentType } = metrics;
  if (!p.contentTypes.includes(contentType as Source["contentTypes"][number]) ||
    metrics.headerBytes > p.budget.maxHeaderBytes || metrics.wireBytes > p.budget.maxBodyBytes ||
    metrics.decompressedBytes > p.budget.maxBodyBytes || metrics.elapsedMs > p.budget.deadlineMs ||
    metrics.domNodes > p.budget.maxDomNodes || metrics.depth > p.budget.maxDepth ||
    metrics.jsonLdBytes > p.budget.maxJsonLdBytes || metrics.requests > p.budget.requests) throw new Error("Response budget/type denied");
}
export function collectSource(): never { throw new Error("OFFLINE_ONLY: network collection is unavailable in A1"); }
