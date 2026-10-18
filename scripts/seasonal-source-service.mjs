/** SERVER-ONLY isolated research orchestration. No app imports or enabled sources.
 * State is bounded to one service instance. It is not a durable lifecycle store,
 * a factual verifier, a publication endpoint, or authorization to access a site.
 */
import { createHash } from "node:crypto";
import { readResearchRegistry } from "./seasonal-source-discovery.mjs";
import { analyzeSeasonalFixture } from "./seasonal-source-pipeline.mjs";
import { readBoundIdentityInventories, validateIdentityInventory } from "./seasonal-source-identities.mjs";
import { createSeasonalSourceTransport, createSeasonalSourceTransportForTests } from "./seasonal-source-transport.mjs";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_CACHE = 8;
const MAX_SUBSCRIBERS = 32;
const MAX_NEGATIVES = 64;
const MAX_UNCERTAIN_SOURCES = 16;
const NEGATIVE_REASONS = new Set([
  "event-status-not-scheduled", "conflicting-structured-events", "ended-before-local-day",
]);
const failure = code => Object.assign(new Error(code), { code });
const normalized = value => typeof value === "string" ? value.normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ") : "";
function validDay(day) {
  if (typeof day !== "string" || !/^20\d\d-\d\d-\d\d$/.test(day)) return false;
  const parsed = Date.parse(day + "T00:00:00Z");
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === day;
}

function buildService({ transport, now }) {
  const cache = new Map();
  const inFlight = new Map();
  const negatives = [];
  const uncertainSources = new Set();
  let capacityHold = false;

  function current(sourceId) {
    const policy = transport.inspectPolicy(sourceId);
    const time = now();
    if (!Number.isFinite(time)) throw failure("invalid-evaluation-time");
    const inventories = readBoundIdentityInventories();
    const published = validateIdentityInventory(inventories.published, { kind: "published", now: time });
    const pending = validateIdentityInventory(inventories.pending, { kind: "pending", now: time });
    if (!published.valid || !pending.valid) throw failure("identity-inventories-unavailable");
    return { policy, time, inventories, records: [...published.records, ...pending.records,
      ...(pending.negativeRecords ?? [])] };
  }
  function samePolicy(sourceId, expected, admittedTime = -Infinity) {
    const context = current(sourceId);
    if (context.time < admittedTime) throw failure("source-clock-rollback");
    if (context.policy.fingerprint !== expected.fingerprint || context.policy.sourceUrl !== expected.sourceUrl)
      throw failure("source-policy-changed");
    return context;
  }
  function uncertain(sourceId) {
    if (uncertainSources.has(sourceId)) return;
    if (uncertainSources.size === MAX_UNCERTAIN_SOURCES) { capacityHold = true; return; }
    uncertainSources.add(sourceId);
  }
  function identity(proposal, records) {
    const names = new Set([normalized(proposal.proposedName)].filter(Boolean));
    const addresses = new Set([normalized(proposal.proposedAddress)].filter(Boolean));
    const ids = new Set();
    // Only pinned inventory aliases/IDs expand an identity. Expansion is an
    // exclusion hint, not a merge assertion or provider-supplied alias grant.
    for (const record of records) {
      const recordNames = [record.name, ...(Array.isArray(record.aliases) ? record.aliases : [])]
        .map(normalized).filter(Boolean);
      if (!recordNames.some(name => names.has(name)) && !addresses.has(normalized(record.address))) continue;
      if (typeof record.id === "string") ids.add(record.id);
      for (const name of recordNames) names.add(name);
    }
    return { names: [...names], addresses: [...addresses], ids: [...ids] };
  }
  function collision(a, b) {
    return ["names", "addresses", "ids"].some(field => a[field].some(value => b[field].includes(value)));
  }
  function analyze(capture, context, todayLocalDate, retrieval) {
    const report = analyzeSeasonalFixture({
      registry: { officialOperatorPilotQueue: [{ id: capture.sourceId, url: capture.sourceUrl }] },
      sourceId: capture.sourceId, html: capture.html, checkedAt: capture.checkedAt,
      evaluatedAt: new Date(context.time).toISOString(), todayLocalDate,
      identityInventories: context.inventories,
    });
    const sha256 = createHash("sha256").update(capture.html, "utf8").digest("hex");
    if (!report.proposals.length || report.proposals.some(proposal =>
      proposal.researchConcerns?.includes("bounded-parser-incomplete"))) uncertain(capture.sourceId);
    for (const proposal of report.proposals) {
      const reasons = proposal.triage.reasons.filter(reason => NEGATIVE_REASONS.has(reason));
      if (!reasons.length) continue;
      const observedIdentity = identity(proposal, context.records);
      const key = JSON.stringify(observedIdentity);
      if (negatives.some(entry => entry.key === key)) continue;
      if (negatives.length === MAX_NEGATIVES) { capacityHold = true; break; }
      negatives.push({ key, ...observedIdentity, evidence: {
        sourceId: capture.sourceId, sourceUrl: capture.sourceUrl, captureSha256: sha256,
        checkedAt: capture.checkedAt, reasons, confidence: "observed-research-conflict-only",
      } });
    }
    const researchHoldReasons = [];
    if (capacityHold) researchHoldReasons.push("negative-ledger-capacity-hold");
    if (uncertainSources.has(capture.sourceId)) researchHoldReasons.push("persistent-incomplete-source-evidence");
    const proposals = report.proposals.map(proposal => {
      const candidateIdentity = identity(proposal, context.records);
      const matches = negatives.filter(entry => collision(candidateIdentity, entry));
      const reasons = [...new Set([...proposal.triage.reasons, ...researchHoldReasons,
        ...(matches.length ? ["persistent-negative-evidence-collision"] : [])])];
      return { ...proposal, verified: false, publishable: false, openNowEligible: false,
        negativeEvidence: matches.slice(0, 20).map(entry => structuredClone(entry.evidence)),
        triage: { ...proposal.triage, reasons,
          status: reasons.length ? "hold-for-research" : "awaiting-independent-review" } };
    });
    return { ...report, status: "research-only", retrieval, networkRequests: undefined,
      transportRequests: retrieval === "fresh" ? 1 : 0,
      negativeEvidenceScope: "service-instance-only", researchHoldReasons,
      capture: { sha256, checkedAt: capture.checkedAt, sourceUrl: capture.sourceUrl,
        authenticity: "transport-observed-bytes-not-independent-source-verification" },
      counts: { extracted: proposals.length,
        held: proposals.filter(proposal => proposal.triage.status === "hold-for-research").length,
        awaitingIndependentReview: proposals.filter(proposal => proposal.triage.status === "awaiting-independent-review").length,
        publishable: 0 }, proposals };
  }
  function operation(sourceId, policy, key, admittedTime) {
    const controller = new AbortController();
    const op = { controller, subscribers: new Set(), abandoned: false, finished: false };
    op.promise = transport.retrieve(sourceId, { signal: controller.signal }).then(capture => {
      if (op.abandoned) throw failure("source-aborted");
      samePolicy(sourceId, policy, admittedTime);
      if (capture.sourceId !== sourceId || capture.sourceUrl !== policy.sourceUrl)
        throw failure("source-identity-changed");
      return Object.freeze({ ...capture });
    }).finally(() => {
      op.finished = true;
      if (inFlight.get(key) === op) inFlight.delete(key);
    });
    op.promise.catch(() => {});
    inFlight.set(key, op);
    return op;
  }
  function subscribe(op, key, signal) {
    if (op.subscribers.size >= MAX_SUBSCRIBERS) return Promise.reject(failure("source-subscriber-capacity"));
    return new Promise((resolve, reject) => {
      const subscriber = {};
      let settled = false;
      const finish = (error, value) => {
        if (settled) return;
        settled = true;
        signal?.removeEventListener("abort", abort);
        op.subscribers.delete(subscriber);
        if (error) reject(error); else resolve(value);
      };
      const abort = () => {
        finish(failure("source-aborted"));
        if (!op.finished && op.subscribers.size === 0) {
          op.abandoned = true;
          op.controller.abort();
          if (inFlight.get(key) === op) inFlight.delete(key);
        }
      };
      op.subscribers.add(subscriber);
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) { abort(); return; }
      op.promise.then(value => finish(null, value), error => finish(error));
    });
  }
  return Object.freeze({
    async discover(sourceId, { todayLocalDate = null, signal } = {}) {
      let transportRequests = 0;
      try {
        if (signal !== undefined && !(signal instanceof AbortSignal)) throw failure("invalid-abort-signal");
        if (signal?.aborted) throw failure("source-aborted");
        if (!validDay(todayLocalDate)) throw failure("invalid-destination-local-day");
        if (capacityHold) throw failure("negative-ledger-capacity-hold");
        const admitted = current(sourceId);
        const key = JSON.stringify([sourceId, admitted.policy.sourceUrl, admitted.policy.fingerprint]);
        const saved = cache.get(sourceId);
        if (saved && (saved.key !== key || admitted.time < Date.parse(saved.capture.checkedAt) ||
          admitted.time - Date.parse(saved.capture.checkedAt) >= CACHE_TTL_MS)) cache.delete(sourceId);
        const reusable = cache.get(sourceId);
        if (reusable) {
          const context = samePolicy(sourceId, admitted.policy, admitted.time);
          if (signal?.aborted) throw failure("source-aborted");
          const report = analyze(reusable.capture, context, todayLocalDate, "cached");
          samePolicy(sourceId, admitted.policy, context.time);
          if (signal?.aborted) throw failure("source-aborted");
          return report;
        }
        let op = inFlight.get(key);
        const retrieval = op ? "coalesced" : "fresh";
        if (!op) { op = operation(sourceId, admitted.policy, key, admitted.time); transportRequests = 1; }
        const capture = await subscribe(op, key, signal);
        if (signal?.aborted || op.abandoned) throw failure("source-aborted");
        const context = samePolicy(sourceId, admitted.policy, admitted.time);
        if (capacityHold) throw failure("negative-ledger-capacity-hold");
        const report = analyze(capture, context, todayLocalDate, retrieval);
        samePolicy(sourceId, admitted.policy, context.time);
        if (signal?.aborted || op.abandoned) throw failure("source-aborted");
        if (!capacityHold && report.captureFreshness?.status === "within-age-limit") {
          if (!cache.has(sourceId) && cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
          cache.set(sourceId, { key, capture });
        }
        return report;
      } catch (error) {
        cache.delete(sourceId);
        return { status: error?.code ?? "research-service-failed", proposals: [], transportRequests,
          negativeEvidenceScope: "service-instance-only" };
      }
    },
  });
}

export function createSeasonalResearchService({ registry = readResearchRegistry() } = {}) {
  return buildService({ transport: createSeasonalSourceTransport({ registry }), now: Date.now });
}
/** Internal offline fixtures only: low-level DNS and HTTPS mocks are mandatory.
 * There is no arbitrary URL, completed-capture, transport or inventory bypass. */
export function createSeasonalResearchServiceForTests({ registry, now = Date.now,
  resolverFactory, request, deadlineMs } = {}) {
  if (typeof now !== "function") throw new TypeError("Offline fixture clock must be a function");
  return buildService({ now, transport: createSeasonalSourceTransportForTests({
    registry, now, resolverFactory, request, deadlineMs,
  }) });
}
