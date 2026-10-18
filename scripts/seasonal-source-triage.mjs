/**
 * Pure, conservative intake for untrusted seasonal discoveries.
 * This is a research queue, NOT an eligibility, publication, or Open Now decision.
 * Date-only expiry comparisons require an explicitly supplied destination-local day.
 */

const DAY = /^20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

function validDay(value) {
  if (typeof value !== "string" || !DAY.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalized(value) {
  return typeof value === "string"
    ? value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim()
      .replace(/\s+/g, " ")
    : "";
}

function publicIdentity(record) {
  return {
    id: typeof record?.id === "string" ? record.id.slice(0, 120) : null,
    name: normalized(record?.name || record?.proposedName),
    address: normalized(record?.address || record?.proposedAddress),
  };
}

/** Distinct-sounding venues can share one physical site; do not automatically merge.
 * A matching name OR a matching full address creates a manual-review hold.
 * All match identities are untrusted inputs and must be independently assessed. */
function possibleMatches(proposal, existing, pending) {
  const candidate = publicIdentity(proposal);
  const results = [];
  for (const [source, items] of [["published", existing], ["pending", pending]]) {
    if (!Array.isArray(items)) continue;
    for (const record of items.slice(0, 10000)) {
      const compared = publicIdentity(record);
      const nameMatch = !!candidate.name && candidate.name === compared.name;
      const addressMatch = !!candidate.address && candidate.address === compared.address;
      if (!nameMatch && !addressMatch) continue;
      results.push({
        source,
        id: compared.id,
        basis: nameMatch && addressMatch ? "name-and-address" : nameMatch ? "name" : "address",
      });
      if (results.length >= 20) return results;
    }
  }
  return results;
}

export function triageSeasonalProposals(proposals, {
  published = [],
  pending = [],
  todayLocalDate = null,
} = {}) {
  if (!Array.isArray(proposals)) return [];
  if (todayLocalDate !== null && !validDay(todayLocalDate))
    throw new TypeError("todayLocalDate must be a valid destination-local YYYY-MM-DD date");

  return proposals.slice(0, 100).map(proposal => {
    const reasons = [];
    const matches = possibleMatches(proposal, published, pending);
    const name = typeof proposal?.proposedName === "string" ? proposal.proposedName.trim() : "";
    const address = typeof proposal?.proposedAddress === "string" ? proposal.proposedAddress.trim() : "";
    const start = proposal?.startDate;
    const end = proposal?.endDate;
    const hasDates = validDay(start) && validDay(end) && start.slice(0, 4) === "2026" &&
      end.slice(0, 4) === "2026" && start <= end;
    if (!name) reasons.push("missing-name");
    if (!address) reasons.push("missing-address");
    if (!hasDates) reasons.push("missing-or-invalid-2026-date-range");
    if (proposal?.evidence?.format !== "json-ld") reasons.push("insufficient-structured-evidence");
    if (hasDates && todayLocalDate && end < todayLocalDate) reasons.push("ended-before-local-day");
    if (matches.length) reasons.push("possible-existing-identity");

    return {
      ...proposal,
      // Never trust inherited flags from providers or old cached data.
      verified: false,
      publishable: false,
      openNowEligible: false,
      triage: {
        status: reasons.length ? "hold-for-research" : "awaiting-independent-review",
        reasons,
        possibleMatches: matches,
        // Sufficient candidate fields do not establish operating dates or category.
        operatorVerificationRequired: true,
        humanApprovalRequired: true,
      },
    };
  });
}
