import assert from "node:assert/strict";
import { createHash } from "node:crypto";

/** Reverse only the explicit cross-origin recovery amendment to reviewed PR #98.
 * Exact anchors and the complete parent cache hash preserve every historical
 * ordinary/Halloween receipt; no runtime git diff or replacement baseline. */
const amendments = [
  [`  // Settling an empty group does not supply a retained venue's own revision.
  // Keep that proof obligation independently of venue TTL/LRU until a complete
  // acquisition supplies this canonical ID. Capacity loss is fail-closed.
  // Canonical obligations cross origin boundaries; the actual facts that
  // discharge them must follow the same boundary. Only identities that owed
  // missing-source proof enter this bounded ledger. Ordinary observations with
  // no such obligation retain their existing origin-scoped cache semantics.
  // Recovery facts outlive venue TTL/LRU, just like the obligation they replace;
  // neither an opaque old row nor proof-entry eviction can undo that recovery.
  // Both tracked IDs and their total deduplicated observations share the
  // existing venue-budget limit. Capacity loss keeps session uncertainty sticky.
  const identityProofOwed = new Map<string, {
    uncertainty?: DateNightIdentityUncertainty;
    observations: DateNightEvidence[];
  }>();
  let proofObservationCount = 0;
  const completeOwnIdentity = (item: DateNightEvidence) => {
    const source = item.sourceIdentity;
    return item.source === "osm" && source && ["node", "way", "relation"].includes(source.objectType) &&
      Number.isInteger(source.objectId) && source.objectId > 0 && item.id === \`date-night-osm-\${source.objectType}-\${source.objectId}\` &&
      Number.isInteger(source.version) && source.version! > 0 && Number.isInteger(source.changeset) && source.changeset! > 0;
  };
  const retainRecoveryProof = (groups: readonly (readonly DateNightEvidence[] | undefined)[]) => {
    const incoming = new Map<string, DateNightEvidence[]>();
    for (const group of groups) {
      for (const item of group ?? []) {
        // Missing revision metadata is an unresolved proof obligation, not a
        // definitive revision to preserve after adequate fresh proof arrives.
        if (!identityProofOwed.has(item.id) || !completeOwnIdentity(item)) continue;
        const rows = incoming.get(item.id) ?? [];
        rows.push(item);
        incoming.set(item.id, rows);
      }
    }
    for (const [id, rows] of incoming) {
      const proof = identityProofOwed.get(id)!;
      const observations = mergeDateNightIdentityObservations(proof.observations, rows);
      const count = proofObservationCount - proof.observations.length + observations.length;
      if (count > maxVenues) {
        unresolvedIdentity = mergeDateNightIdentityUncertainty(unresolvedIdentity, { scopes: [], overflow: true });
        continue;
      }
      proof.observations = observations;
      proofObservationCount = count;
    }
  };
  const retainIdentityProof = (venues: readonly DateNightPlace[], freshIds = new Set<string>()) => {
    const retained = venues.map(original => {
      const proof = identityProofOwed.get(original.id);
      const venue = proof?.observations.length
        ? attachDateNightIdentityObservations([original], proof.observations)[0]! : original;
      if (venue.source !== "osm" && !venue.discoveryEvidence?.some(item => item.source === "osm")) return venue;
      const pending = identityUncertaintyAtVenue(unresolvedIdentity, venue);
      if (freshIds.has(venue.id) && !pending) {
        if (proof) proof.uncertainty = undefined;
        const { identityUncertainty: _previousUncertainty, ...complete } = venue;
        return complete;
      }
      const identityUncertainty = mergeDateNightIdentityUncertainty(venue.identityUncertainty, proof?.uncertainty, pending);
      if (!identityUncertainty) return venue;
      if (proof) proof.uncertainty = identityUncertainty;
      else if (identityProofOwed.size < maxVenues) identityProofOwed.set(venue.id, { uncertainty: identityUncertainty, observations: [] });
      else unresolvedIdentity = mergeDateNightIdentityUncertainty(unresolvedIdentity, { scopes: [], overflow: true });
      // A canonical ID already owes this proof even if a later opaque row
      // changes its coordinates. Geography limits new unknown scopes only.
`,
`  // Settling an empty group does not supply a retained venue's own revision.
  // Keep that proof obligation independently of venue TTL/LRU until a complete
  // acquisition supplies this canonical ID. Capacity loss is fail-closed.
  const identityProofOwed = new Map<string, DateNightIdentityUncertainty>();
  const retainIdentityProof = (venues: readonly DateNightPlace[], freshIds = new Set<string>()) => {
    const retained = venues.map(venue => {
      if (venue.source !== "osm" && !venue.discoveryEvidence?.some(item => item.source === "osm")) return venue;
      const pending = identityUncertaintyAtVenue(unresolvedIdentity, venue);
      if (freshIds.has(venue.id) && !pending) {
        identityProofOwed.delete(venue.id);
        const { identityUncertainty: _previousUncertainty, ...complete } = venue;
        return complete;
      }
      const identityUncertainty = mergeDateNightIdentityUncertainty(venue.identityUncertainty, identityProofOwed.get(venue.id), pending);
      if (!identityUncertainty) return venue;
      if (identityProofOwed.has(venue.id) || identityProofOwed.size < maxVenues) identityProofOwed.set(venue.id, identityUncertainty);
      else unresolvedIdentity = mergeDateNightIdentityUncertainty(unresolvedIdentity, { scopes: [], overflow: true });
      // A canonical ID already owes this proof even if a later opaque row
      // changes its coordinates. Geography limits new unknown scopes only.
`],
  [`      unresolvedIdentity = mergeDateNightIdentityUncertainty(resolveDateNightIdentityUncertainty(unresolvedIdentity, fresh), response.identityUncertainty,
        identityUncertaintyFor(query, failedTypes));
      const freshIds = freshDateNightIdentityIds(fresh);
      // One complete observation cannot certify an ambiguous same-ID packet.
      // Unknown/mismatched observations keep uncertainty instead of becoming
      // invented definitive source facts in the canonical recovery ledger.
      for (const group of [fresh.identityObservations, ...fresh.venues.map(venue => venue.discoveryEvidence)])
        for (const item of group ?? []) if (item.source === "osm" && !completeOwnIdentity(item)) freshIds.delete(item.id);
      for (const venue of fresh.venues)
        if (venue.discoveryEvidence?.some(item => item.source === "osm" && item.sourceIdentity && item.id !== venue.id)) freshIds.delete(venue.id);
      // Register newly affected IDs before capturing facts, including a first
      // partial packet's ineligible observations. A later successful group must
      // not erase facts already received while this canonical proof was owed.
      for (const entry of entries) entry.venues = retainIdentityProof(entry.venues);
      retainIdentityProof(response.venues);
      retainRecoveryProof(entries.flatMap(entry => [entry.identityObservations, ...entry.venues.map(venue => venue.discoveryEvidence)]));
      if (packetFits && patchMatches && response.source !== "fallback" && response.discovery?.groups.some(succeeded) &&
          (!response.identityEvidenceCoverage || fresh.identityEvidenceCoverage))
        retainRecoveryProof([response.identityObservations, ...response.venues.map(venue => venue.discoveryEvidence)]);
      // Record actual source facts before globally clearing uncertainty; their
      // revision/classification eligibility remains the reviewed binder's job.
      for (const entry of entries) entry.venues = retainIdentityProof(refreshDateNightIdentityUncertainty(entry.venues, fresh), freshIds);
      const retainedVenues = retainIdentityProof(response.venues, freshIds);
      // Protective uncertainty is retained even for a failed/no-coverage result.
`,
`      unresolvedIdentity = mergeDateNightIdentityUncertainty(resolveDateNightIdentityUncertainty(unresolvedIdentity, fresh), response.identityUncertainty,
        identityUncertaintyFor(query, failedTypes));
      const freshIds = freshDateNightIdentityIds(fresh);
      for (const entry of entries) entry.venues = retainIdentityProof(refreshDateNightIdentityUncertainty(entry.venues, fresh), freshIds);
      const retainedVenues = retainIdentityProof(response.venues, freshIds);
      // Protective uncertainty is retained even for a failed/no-coverage result.
`]
];

export function christmasCrossOriginSourceBefore(path, input) {
  if (path !== "src/lib/date-night/cache.ts") return input;
  let source = input.toString("utf8");
  for (const [index, [after, before]] of amendments.entries()) {
    assert.equal(source.split(after).length, 2, `One exact cross-origin amendment ${index + 1}`);
    source = source.replace(after, before);
  }
  assert.equal(createHash("sha256").update(source).digest("hex"),
    "6f6b2581cbdfb9e3887f62df1bb6fad691a3a414adfe4dee131c5a415adb41be",
    "Restore the entire reviewed PR #98 cache before historical assertions");
  return Buffer.from(source);
}
