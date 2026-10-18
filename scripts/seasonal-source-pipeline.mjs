import { extractSeasonalProposals, readResearchRegistry } from "./seasonal-source-discovery.mjs";
import { triageSeasonalProposals } from "./seasonal-source-triage.mjs";

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
  if (typeof checkedAt !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(checkedAt) ||
    !Number.isFinite(Date.parse(checkedAt))) {
    return { status: "invalid-capture-timestamp", proposals: [], networkRequests: 0 };
  }

  const proposals = extractSeasonalProposals(html, source, checkedAt);
  const identityInputsComplete = Array.isArray(published) && Array.isArray(pending);
  const triaged = triageSeasonalProposals(proposals, {
    published: identityInputsComplete ? published : [],
    pending: identityInputsComplete ? pending : [],
    todayLocalDate,
  }).map(item => {
    const reasons = [...item.triage.reasons];
    if (!identityInputsComplete) reasons.push("unreconciled-published-and-pending-identities");
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
