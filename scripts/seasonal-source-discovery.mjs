import { readFileSync } from "node:fs";

const REGISTRY_PATH = "audit/seasonal-source-discovery-2026-10-18/source-registry.json";
const MAX_HTML_BYTES = 512_000;
const MAX_JSON_LD_BLOCKS = 12;
const MAX_PROPOSALS = 5;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function readResearchRegistry() {
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
}

function verifiedFetchClearance(registry, source) {
  const approval = source?.fetchClearance;
  return registry?.automationEnabled === true &&
    source?.automaticAccess === "reviewed-allow" &&
    approval?.robots === "allow" &&
    typeof approval?.reviewer === "string" && approval.reviewer.trim().length > 0 &&
    typeof approval?.reviewedAt === "string" && /^20\d\d-\d\d-\d\d$/.test(approval.reviewedAt) &&
    typeof approval?.rightsBasis === "string" && approval.rightsBasis.trim().length > 0;
}

function trustedSourceUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
      url.hash || !/^[a-z0-9.-]+$/i.test(url.hostname) ||
      !url.hostname.includes(".") || url.hostname.endsWith(".") ||
      /^(localhost|.*\.(?:localhost|local|internal|home|test|invalid|example))$/i.test(url.hostname) ||
      /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) ||
      url.hostname.includes("..")) return null;
    return url.href;
  } catch {
    return null;
  }
}

async function readBoundedHtml(response) {
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_HTML_BYTES) throw new Error("source-body-too-large");
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml"))
    throw new Error("source-not-html");
  if (!response.body?.getReader) throw new Error("source-stream-unavailable");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let result = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_HTML_BYTES) throw new Error("source-body-too-large");
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } finally {
    await reader.cancel().catch(() => {});
  }
}

function flatText(value, length = 160) {
  return typeof value === "string"
    ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, length)
    : "";
}

function htmlTitle(html) {
  const match = html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i);
  return flatText(match?.[1]?.replace(/&amp;/gi, "&").replace(/&quot;/gi, '"') ?? "");
}

function isoDate2026(value) {
  if (typeof value !== "string" || !/^2026-\d{2}-\d{2}(?:T|$)/.test(value)) return null;
  const day = value.slice(0, 10);
  return Number.isFinite(Date.parse(day + "T00:00:00Z")) &&
    new Date(day + "T00:00:00Z").toISOString().slice(0, 10) === day ? day : null;
}

function addressText(address) {
  if (typeof address === "string") return flatText(address, 240);
  if (!address || typeof address !== "object") return "";
  return [address.streetAddress, address.addressLocality,
    address.addressRegion, address.postalCode].map(value => flatText(value, 100)).filter(Boolean).join(", ").slice(0, 240);
}

function discoveryHints(input) {
  const words = input.toLowerCase();
  const hints = [];
  if (/\b(?:haunt(?:ed)?|house of horror|scare|terror)\b/.test(words)) hints.push("haunted-house");
  if (/\b(?:corn|maize)\s+maze\b/.test(words)) hints.push("corn-maze");
  if (/\bpumpkin\s+patch\b/.test(words)) hints.push("pumpkin-patch");
  return hints;
}

function collectNodes(node, result, depth = 0) {
  if (!node || depth > 4 || result.length >= 50) return;
  if (Array.isArray(node)) {
    for (const value of node.slice(0, 50)) collectNodes(value, result, depth + 1);
    return;
  }
  if (typeof node !== "object") return;
  if (node["@type"]) result.push(node);
  if (node["@graph"]) collectNodes(node["@graph"], result, depth + 1);
  if (node.mainEntity) collectNodes(node.mainEntity, result, depth + 1);
}

export function extractSeasonalProposals(html, source, checkedAt) {
  if (typeof html !== "string" || html.length > MAX_HTML_BYTES) return [];
  const nodes = [];
  const pattern = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let match;
  let blockCount = 0;
  while ((match = pattern.exec(html)) && blockCount++ < MAX_JSON_LD_BLOCKS) {
    if (match[1].length > 64_000) continue;
    try { collectNodes(JSON.parse(match[1]), nodes); } catch { /* malformed LD is not evidence */ }
  }
  const proposals = [];
  const seen = new Set();
  let rejectedOutOfSeason = false;
  for (const node of nodes) {
    if (proposals.length >= MAX_PROPOSALS) break;
    const types = (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]])
      .filter(x => typeof x === "string").map(x => x.toLowerCase());
    if (!types.some(x => /(?:^|\/)event$|(?:^|\/)place$|(?:^|\/)touristattraction$/.test(x))) continue;
    const name = flatText(node.name || node.location?.name);
    if (!name) continue;
    const startDate = isoDate2026(node.startDate);
    const explicitEnd = isoDate2026(node.endDate);
    // A known non-2026 date is not an unknown date; refuse stale/future records.
    if ((node.startDate && !startDate) || (node.endDate && !explicitEnd)) {
      rejectedOutOfSeason = true;
      continue;
    }
    const endDate = explicitEnd ?? startDate;
    if (startDate && endDate && endDate < startDate) continue;
    const address = addressText(node.location?.address ?? node.address);
    const dedup = [name.toLowerCase(), address.toLowerCase(), startDate || ""].join("|");
    if (seen.has(dedup)) continue;
    seen.add(dedup);
    const fields = ["name"];
    if (address) fields.push("address");
    if (startDate) fields.push("startDate");
    if (endDate) fields.push("endDate");
    proposals.push({
      sourceId: source.id,
      sourceUrl: source.url,
      proposedName: name,
      proposedAddress: address || null,
      startDate,
      endDate,
      activityHints: discoveryHints(name),
      verified: false,
      publishable: false,
      openNowEligible: false,
      evidence: { format: "json-ld", checkedAt, fields },
    });
  }
  if (proposals.length || rejectedOutOfSeason) return proposals;
  const title = htmlTitle(html);
  return title ? [{
    sourceId: source.id, sourceUrl: source.url, proposedName: title,
    proposedAddress: null, startDate: null, endDate: null,
    activityHints: discoveryHints(title),
    verified: false, publishable: false, openNowEligible: false,
    evidence: { format: "page-title-only", checkedAt, fields: ["title"] },
  }] : [];
}

/** Isolated non-production pilot. No app runtime imports or automatic scheduled fetches.
 * No source is enabled in the checked-in registry. Callers cannot supply URLs. */
export function createSeasonalDiscoveryPilot({
  registry = readResearchRegistry(),
  fetchImpl = null,
  now = () => Date.now(),
  ttlMs = CACHE_TTL_MS,
} = {}) {
  const cache = new Map();
  const inFlight = new Map();
  const operatorSources = new Map((registry.officialOperatorPilotQueue ?? []).map(item => [item.id, item]));
  async function discover(sourceId) {
    const source = operatorSources.get(sourceId);
    if (!source) return { status: "unknown-source", proposals: [] };
    if (!verifiedFetchClearance(registry, source)) return { status: "blocked-by-policy", proposals: [] };
    const url = trustedSourceUrl(source.url);
    if (!url) return { status: "invalid-source-url", proposals: [] };
    // No built-in transport: enabling a registry is never enough to start crawling.
    // Future server-only adapters must enforce DNS/egress and destination policy.
    if (typeof fetchImpl !== "function") return { status: "transport-not-configured", proposals: [] };
    const saved = cache.get(sourceId);
    if (saved && now() < saved.until) return { status: "cached", proposals: saved.proposals };
    if (inFlight.has(sourceId)) return inFlight.get(sourceId);
    const operation = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      try {
        const response = await fetchImpl(url, {
          method: "GET", redirect: "error", signal: controller.signal,
          headers: { Accept: "text/html,application/xhtml+xml" },
        });
        if (!response.ok) return { status: "upstream-http-error", proposals: [] };
        const html = await readBoundedHtml(response);
        const checkedAt = new Date(now()).toISOString();
        const proposals = extractSeasonalProposals(html, source, checkedAt);
        cache.set(sourceId, { proposals, until: now() + Math.max(1, Math.min(ttlMs, CACHE_TTL_MS)) });
        return { status: "fresh", proposals };
      } catch {
        return { status: "fetch-error", proposals: [] };
      } finally {
        clearTimeout(timer);
      }
    })();
    inFlight.set(sourceId, operation);
    try { return await operation; } finally { inFlight.delete(sourceId); }
  }
  return { discover };
}
