import { readFileSync } from "node:fs";

const REGISTRY_PATH = "audit/seasonal-source-discovery-2026-10-18/source-registry.json";
const MAX_HTML_BYTES = 512_000;
const MAX_JSON_LD_BLOCKS = 12;
const MAX_PROPOSALS = 5;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function readResearchRegistry() {
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
}

function validReviewDay(value, time) {
  if (typeof value !== "string" || !/^20\d\d-\d\d-\d\d$/.test(value) ||
    !Number.isFinite(time)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value &&
    value <= new Date(time).toISOString().slice(0, 10);
}

function verifiedFetchClearance(registry, source, time) {
  const approval = source?.fetchClearance;
  return registry?.automationEnabled === true &&
    source?.automaticAccess === "reviewed-allow" &&
    approval?.robots === "allow" &&
    typeof approval?.reviewer === "string" && approval.reviewer.trim().length > 0 &&
    validReviewDay(approval?.reviewedAt, time) &&
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

function cancelBody(body) {
  // Cleanup must not extend the operation deadline, including custom transports.
  try { Promise.resolve(body?.cancel?.()).catch(() => {}); } catch { /* best effort */ }
}

async function readBoundedHtml(response, signal) {
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_HTML_BYTES) throw new Error("source-body-too-large");
  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (contentType !== "text/html" && contentType !== "application/xhtml+xml")
    throw new Error("source-not-html");
  if (!response.body?.getReader) throw new Error("source-stream-unavailable");
  const reader = response.body.getReader();
  let cancelled = false;
  const cancel = () => {
    if (!cancelled) { cancelled = true; cancelBody(reader); }
  };
  signal.addEventListener("abort", cancel, { once: true });
  const decoder = new TextDecoder();
  let bytes = 0;
  let result = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (signal.aborted) throw new Error("source-deadline");
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_HTML_BYTES) throw new Error("source-body-too-large");
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } finally {
    signal.removeEventListener("abort", cancel);
    cancel();
  }
}

function flatText(value, length = 160) {
  return typeof value === "string"
    ? value.replace(/<[^<>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, length)
    : "";
}

function asciiLower(value) {
  return value.replace(/[A-Z]/g, character => character.toLowerCase());
}

function jsonLdTypeAttribute(attributes) {
  let cursor = 0;
  let type = null;
  let typeCount = 0;
  while (cursor < attributes.length) {
    while (/\s/.test(attributes[cursor] || "")) cursor++;
    if (cursor === attributes.length) break;
    if (attributes[cursor] === "/" && !attributes.slice(cursor + 1).trim()) break;
    const start = cursor;
    while (cursor < attributes.length && !/[\s=/<>\x22\x27]/.test(attributes[cursor])) cursor++;
    if (cursor === start) return false;
    const name = asciiLower(attributes.slice(start, cursor));
    while (/\s/.test(attributes[cursor] || "")) cursor++;
    let value = null;
    let quoted = false;
    if (attributes[cursor] === "=") {
      cursor++;
      while (/\s/.test(attributes[cursor] || "")) cursor++;
      const quote = attributes[cursor];
      if (quote === String.fromCharCode(34) || quote === String.fromCharCode(39)) {
        quoted = true;
        const valueStart = ++cursor;
        while (cursor < attributes.length && attributes[cursor] !== quote) cursor++;
        if (cursor === attributes.length) return false;
        value = attributes.slice(valueStart, cursor++);
        if (cursor < attributes.length && !/[\s/]/.test(attributes[cursor])) return false;
      } else {
        const valueStart = cursor;
        while (cursor < attributes.length && !/\s/.test(attributes[cursor])) cursor++;
        if (cursor === valueStart) return false;
      }
    }
    if (name === "type") { typeCount++; type = quoted ? value : null; }
  }
  return typeCount === 1 && type !== null && asciiLower(type) === "application/ld+json";
}

function nextTagBoundary(html, start) {
  for (let index = start; index < html.length; index++) {
    if (html[index] === "<" || html[index] === ">") return index;
  }
  return -1;
}

function htmlTitle(html) {
  const lower = asciiLower(html);
  let start = lower.indexOf("<title");
  while (start !== -1) {
    const boundary = lower[start + 6];
    if (boundary === ">" || /\s/.test(boundary || "")) {
      const openEnd = nextTagBoundary(lower, start + 6);
      if (openEnd === -1) return "";
      if (lower[openEnd] === ">") {
        const close = lower.indexOf("</title", openEnd + 1);
        return close === -1 ? "" : flatText(html.slice(openEnd + 1, close)
          .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"'));
      }
    }
    start = lower.indexOf("<title", start + 6);
  }
  return "";
}

function jsonLdBlocks(html) {
  const lower = asciiLower(html);
  const blocks = [];
  let cursor = 0;
  let scanned = 0;
  while (scanned < MAX_JSON_LD_BLOCKS) {
    const start = lower.indexOf("<script", cursor);
    if (start === -1) break;
    cursor = start + 7;
    if (!/[\s>]/.test(lower[cursor] || "")) continue;
    // Do not restart an unbounded [^>]* match at every malformed opening tag.
    const openEnd = nextTagBoundary(lower, cursor);
    if (openEnd === -1) break;
    if (lower[openEnd] === "<") {
      cursor = openEnd;
      continue;
    }
    let close = lower.indexOf("</script", openEnd + 1);
    let closeEnd;
    while (close !== -1) {
      closeEnd = close + 8;
      while (/\s/.test(lower[closeEnd] || "")) closeEnd++;
      if (lower[closeEnd] === ">") break;
      close = lower.indexOf("</script", close + 8);
    }
    if (close === -1) break;
    cursor = closeEnd + 1;
    const attributes = html.slice(start + 7, openEnd);
    if (!jsonLdTypeAttribute(attributes)) continue;
    scanned++;
    if (close - openEnd - 1 <= 64_000) blocks.push(html.slice(openEnd + 1, close));
  }
  return blocks;
}

function isoDate2026(value) {
  const syntax = /^2026-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,9})?)?(?:Z|[+-](?:(?:0\d|1[0-3]):[0-5]\d|14:00))?)?$/;
  if (typeof value !== "string" || !syntax.test(value) || !Number.isFinite(Date.parse(value)))
    return null;
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
  if (typeof html !== "string" || Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) return [];
  const nodes = [];
  for (const block of jsonLdBlocks(html)) {
    try { collectNodes(JSON.parse(block), nodes); } catch { /* malformed LD is not evidence */ }
  }
  const proposals = [];
  const seen = new Set();
  const eventVariants = new Map();
  let rejectedOutOfSeason = false;
  for (const node of nodes) {
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
    // Missing is unknown, never an inferred one-day event or a quoted source fact.
    const endDate = explicitEnd;
    if (startDate && endDate && endDate < startDate) continue;
    const address = addressText(node.location?.address ?? node.address);
    const eventStatus = node.eventStatus == null ? null :
      typeof node.eventStatus === "string" ? flatText(node.eventStatus, 160) : "unrecognized";
    const identity = JSON.stringify([name.toLowerCase(), address.toLowerCase(), startDate]);
    const variant = JSON.stringify([endDate, eventStatus]);
    if (!eventVariants.has(identity)) eventVariants.set(identity, new Set());
    eventVariants.get(identity).add(variant);
    const dedup = JSON.stringify([identity, variant]);
    if (seen.has(dedup)) continue;
    seen.add(dedup);
    const fields = ["name"];
    if (address) fields.push("address");
    if (startDate) fields.push("startDate");
    if (endDate) fields.push("endDate");
    if (node.eventStatus != null) fields.push("eventStatus");
    proposals.push({
      sourceId: source.id,
      sourceUrl: source.url,
      proposedName: name,
      proposedAddress: address || null,
      startDate,
      endDate,
      eventStatus,
      activityHints: discoveryHints(name),
      verified: false,
      publishable: false,
      openNowEligible: false,
      evidence: { format: "json-ld", checkedAt, fields },
    });
  }
  // Inspect every bounded node before truncation so later conflicting copies
  // cannot be hidden by the proposal limit or whichever JSON-LD block came first.
  for (const proposal of proposals) {
    const identity = JSON.stringify([proposal.proposedName.toLowerCase(),
      (proposal.proposedAddress || "").toLowerCase(), proposal.startDate]);
    proposal.researchConcerns = eventVariants.get(identity).size > 1
      ? ["conflicting-structured-events"] : [];
  }
  if (proposals.length || rejectedOutOfSeason) return proposals.slice(0, MAX_PROPOSALS);
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
  const cacheTtl = Number.isFinite(ttlMs) && ttlMs > 0 ? Math.min(ttlMs, CACHE_TTL_MS) : 0;
  function policySnapshot(sourceId) {
    const matches = (registry?.officialOperatorPilotQueue ?? []).filter(item => item.id === sourceId);
    if (matches.length !== 1) return null;
    const source = matches[0];
    return { source: structuredClone(source),
      fingerprint: JSON.stringify({ automationEnabled: registry.automationEnabled, source }) };
  }
  async function discover(sourceId) {
    const snapshot = policySnapshot(sourceId);
    if (!snapshot) return { status: "unknown-source", proposals: [] };
    const { source, fingerprint } = snapshot;
    const startedAt = now();
    if (!verifiedFetchClearance(registry, source, startedAt)) {
      cache.delete(sourceId);
      return { status: "blocked-by-policy", proposals: [] };
    }
    const url = trustedSourceUrl(source.url);
    if (!url) return { status: "invalid-source-url", proposals: [] };
    // No built-in transport: enabling a registry is never enough to start crawling.
    // Future server-only adapters must enforce DNS/egress and destination policy.
    if (typeof fetchImpl !== "function") return { status: "transport-not-configured", proposals: [] };
    const saved = cache.get(sourceId);
    if (saved && saved.fingerprint === fingerprint && startedAt >= saved.capturedAt &&
      startedAt < saved.until) return { status: "cached", proposals: structuredClone(saved.proposals) };
    cache.delete(sourceId);
    const key = JSON.stringify([sourceId, fingerprint]);
    if (inFlight.has(key)) return structuredClone(await inFlight.get(key));
    const operation = (async () => {
      const controller = new AbortController();
      let timer;
      const deadline = new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error("source-deadline"));
        }, 6000);
      });
      const unchangedPolicy = () => {
        const current = policySnapshot(sourceId);
        return current?.fingerprint === fingerprint &&
          verifiedFetchClearance(registry, current.source, now());
      };
      try {
        const work = (async () => {
          const response = await fetchImpl(url, {
            method: "GET", redirect: "error", signal: controller.signal,
            headers: { Accept: "text/html,application/xhtml+xml" },
          });
          if (controller.signal.aborted) {
            cancelBody(response?.body);
            throw new Error("source-deadline");
          }
          if (response.redirected || (response.url && response.url !== url)) {
            cancelBody(response.body);
            return { status: "upstream-redirect-rejected", proposals: [] };
          }
          if (!response.ok) {
            cancelBody(response.body);
            return { status: "upstream-http-error", proposals: [] };
          }
          let html;
          try { html = await readBoundedHtml(response, controller.signal); }
          catch (error) { cancelBody(response.body); throw error; }
          if (controller.signal.aborted) throw new Error("source-deadline");
          if (!unchangedPolicy()) return { status: "source-policy-changed", proposals: [] };
          const capturedAt = now();
          const proposals = extractSeasonalProposals(html, { ...source, url },
            new Date(capturedAt).toISOString());
          // Late responses, changed URLs/clearance and clock rollback must never
          // populate or relabel a previously approved source's cache entry.
          if (controller.signal.aborted) throw new Error("source-deadline");
          if (!unchangedPolicy() || capturedAt < startedAt)
            return { status: "source-policy-changed", proposals: [] };
          if (cacheTtl) cache.set(sourceId, { fingerprint, capturedAt,
            proposals: structuredClone(proposals), until: capturedAt + cacheTtl });
          return { status: "fresh", proposals };
        })();
        return await Promise.race([work, deadline]);
      } catch {
        return { status: controller.signal.aborted ? "fetch-timeout" : "fetch-error", proposals: [] };
      } finally {
        clearTimeout(timer);
      }
    })();
    inFlight.set(key, operation);
    try { return structuredClone(await operation); } finally { inFlight.delete(key); }
  }
  return { discover };
}
