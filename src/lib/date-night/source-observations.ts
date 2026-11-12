import type { DateNightEvidence, DateNightPlace } from "./types";

/** Same upper bound as the ordinary provider/cache venue budget. Do not truncate
 * a response: its final observation may be the one that contradicts a binding. */
export const DATE_NIGHT_MAX_IDENTITY_OBSERVATIONS = 20_000;

/** Bound accumulated provenance on a retained row, without turning omitted
 * proof into permission to bind. Callers must propagate the overflow marker. */
export function boundDateNightIdentityEvidence(evidence: readonly DateNightEvidence[]) {
  let count = 0, overflow = false;
  const retained = evidence.filter(item => {
    if (!item.sourceIdentity || ++count <= DATE_NIGHT_MAX_IDENTITY_OBSERVATIONS) return true;
    overflow = true;
    return false;
  });
  return { evidence: retained, overflow };
}

export function sourceObservationKey(observation: DateNightEvidence): string {
  const source = observation.sourceIdentity;
  return JSON.stringify({
    id: observation.id, source: observation.source,
    activityTypes: [...observation.activityTypes].sort(), lifecycle: observation.lifecycle ?? null,
    sourceIdentity: source ? {
      objectType: source.objectType, objectId: source.objectId,
      version: source.version ?? null, changeset: source.changeset ?? null,
      name: source.name, address: source.address,
      classification: Object.fromEntries(Object.entries(source.classification).sort(([a], [b]) => a.localeCompare(b))),
    } : null,
  });
}

export function mergeDateNightIdentityObservations(
  ...groups: readonly (readonly DateNightEvidence[] | undefined)[]
): DateNightEvidence[] {
  const byKey = new Map<string, DateNightEvidence>();
  for (const group of groups) for (const observation of group ?? []) {
    if (observation.source !== "osm" || !observation.sourceIdentity) continue;
    byKey.set(sourceObservationKey(observation), observation);
  }
  return [...byKey].sort(([a], [b]) => a.localeCompare(b)).map(([, observation]) => observation);
}

/** Attach only to an already-existing source identity. A school-only packet
 * cannot manufacture a venue, change ordinary categories or grant coverage. */
export function attachDateNightIdentityObservations(
  venues: readonly DateNightPlace[], observations: readonly DateNightEvidence[],
): DateNightPlace[] {
  if (!observations.length) return [...venues];
  const byId = new Map<string, DateNightEvidence[]>();
  for (const observation of observations) {
    const rows = byId.get(observation.id) ?? [];
    rows.push(observation);
    byId.set(observation.id, rows);
  }
  return venues.map(venue => {
    // Only a fresh provider row can restore complete binding authority. Keep
    // previously observed facts and ordinary fields intact after overflow.
    if (venue.identityObservationOverflow) return venue;
    const existing = venue.discoveryEvidence ?? [];
    const ids = new Set([venue.id, ...existing.map(item => item.id)]);
    const relevant = [...ids].flatMap(id => byId.get(id) ?? []);
    if (!relevant.length) return venue;
    const known = new Set(existing.map(sourceObservationKey));
    const raw = mergeDateNightIdentityObservations(relevant).filter(item => !known.has(sourceObservationKey(item)));
    if (!raw.length) return venue;
    const bounded = boundDateNightIdentityEvidence([...existing, ...raw]);
    return { ...venue, discoveryEvidence: bounded.evidence,
      ...(bounded.overflow ? { identityObservationOverflow: true as const } : {}) };
  });
}
