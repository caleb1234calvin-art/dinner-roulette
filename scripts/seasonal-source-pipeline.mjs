import { extractSeasonalProposals, readResearchRegistry } from "./seasonal-source-discovery.mjs";
import { triageSeasonalProposals } from "./seasonal-source-triage.mjs";
import { validateIdentityInventory } from "./seasonal-source-identities.mjs";

const MAX_CAPTURE_AGE_MS = 6 * 60 * 60 * 1000;

function utcTimestamp(value) {
  if (typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return null;
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return null;
  const canonical = new Date(time).toISOString();
  return canonical === (value.includes(".") ? value : value.replace("Z", ".000Z")) ? time : null;
}

function validLocalDay(value) {
  return typeof value === "string" && /^20\d{2}-\d{2}-\d{2}$/.test(value) &&
    utcTimestamp(value + "T00:00:00Z") !== null;
}

/**
 * Offline-only assembly of parsing + conservative candidate triage.
 *
 * Intentionally accepts HTML supplied by a caller, never requests a URL, and
 * never produces a publishable or Open Now result. It is not an app endpoint.
 * A registry entry is an identity/provenance hint, NOT scraping permission.
 */
export function analyzeSeasonalFixture({
  registry = readResearchRegistry(),
  sourceId,
  html,
  checkedAt,
  published,
  pending,
  identityInventories,
  evaluatedAt = new Date().toISOString(),
  todayLocalDate = null,
} = {}) {
  const source = registry?.officialOperatorPilotQueue?.find(item => item.id === sourceId);
  if (!source || typeof sourceId !== "string") {
    return { status: "unknown-operator-source", proposals: [], networkRequests: 0 };
  }
  if (!source.url?.startsWith("https://") || !source.id) {
    return { status: "invalid-registered-source", proposals: [], networkRequests: 0 };
  }
  if (typeof html !== "string" || !html.trim()) {
    return { status: "no-offline-html", proposals: [], networkRequests: 0 };
  }
  const captureTime = utcTimestamp(checkedAt);
  const evaluationTime = utcTimestamp(evaluatedAt);
  if (captureTime === null) {
    return { status: "invalid-capture-timestamp", proposals: [], networkRequests: 0 };
  }
  if (evaluationTime === null) {
    return { status: "invalid-evaluation-timestamp", proposals: [], networkRequests: 0 };
  }
  if (captureTime > evaluationTime) {
    return { status: "future-capture-timestamp", proposals: [], networkRequests: 0 };
  }
  if (todayLocalDate !== null && !validLocalDay(todayLocalDate)) {
    return { status: "invalid-destination-local-day", proposals: [], networkRequests: 0 };
  }

  const captureAgeMs = evaluationTime - captureTime;
  const captureFreshness = {
    status: captureAgeMs < MAX_CAPTURE_AGE_MS ? "within-age-limit" : "stale",
    ageMs: captureAgeMs, maximumAgeMs: MAX_CAPTURE_AGE_MS, evaluatedAt,
    confidence: "timestamp-age-only-not-source-verification",
  };
  const proposals = extractSeasonalProposals(html, source, checkedAt);
  const publishedValidation = validateIdentityInventory(identityInventories?.published,
    { kind: "published", now: evaluationTime });
  const pendingValidation = validateIdentityInventory(identityInventories?.pending,
    { kind: "pending", now: evaluationTime });
  const identityInputsComplete = publishedValidation.valid && pendingValidation.valid;
  const triaged = triageSeasonalProposals(proposals, {
    published: publishedValidation.valid ? publishedValidation.records : (Array.isArray(published) ? published : []),
    pending: pendingValidation.valid
      ? [...pendingValidation.records, ...(pendingValidation.negativeRecords ?? [])]
      : (Array.isArray(pending) ? pending : []),
    todayLocalDate,
  }).map(item => {
    const reasons = [...item.triage.reasons];
    if (!identityInputsComplete) reasons.push("unreconciled-published-and-pending-identities");
    if (captureFreshness.status === "stale") reasons.push("stale-capture-evidence");
    if (todayLocalDate === null) reasons.push("missing-destination-local-day");
    return {
      ...item,
      verified: false,
      publishable: false,
      openNowEligible: false,
      triage: {
        ...item.triage,
        status: reasons.length ? "hold-for-research" : "awaiting-independent-review",
        reasons,
        operatorVerificationRequired: true,
        humanApprovalRequired: true,
      },
    };
  });

  return {
    status: "offline-research-only",
    sourceId,
    networkRequests: 0,
    identityInputsComplete,
    identityEvidence: {
      published: { valid: publishedValidation.valid, reason: publishedValidation.reason },
      pending: { valid: pendingValidation.valid, reason: pendingValidation.reason },
      factualFreshness: "not-established",
    },
    captureFreshness,
    counts: {
      extracted: triaged.length,
      held: triaged.filter(item => item.triage.status === "hold-for-research").length,
      awaitingIndependentReview: triaged.filter(item =>
        item.triage.status === "awaiting-independent-review").length,
      publishable: 0,
    },
    proposals: triaged,
  };
}
