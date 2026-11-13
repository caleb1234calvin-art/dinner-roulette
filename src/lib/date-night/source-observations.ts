import { haversineMiles } from "../restaurants/geo";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_VERSION, resolveDateNightPatch } from "./radial-plan";
import type { ConcreteDateNightType, DateNightEvidence, DateNightIdentityCoverage, DateNightIdentityScope,
  DateNightIdentityUncertainty, DateNightPlace, DateNightSearchResponse } from "./types";

// At most 32 radial scopes per origin. Extra origins/legacy circles remain
// bounded too; capacity loss blocks identity authority instead of truncating it.
export const DATE_NIGHT_MAX_IDENTITY_SCOPES = 128;
type IdentityAcquisition = { lat: number; lon: number; radiusMiles: number; halloweenActive: boolean; patchId?: string; semanticVersion?: string };
const providerTypes = (types: readonly ConcreteDateNightType[]) => [...new Set(types)]
  .filter(type => type !== "other-halloween-fall" && normalizeDateNightActivityTypes(["anything"], true).includes(type)).sort();

export function dateNightIdentityScope(query: IdentityAcquisition): DateNightIdentityScope {
  return { lat: query.lat, lon: query.lon, halloweenActive: query.halloweenActive,
    semanticVersion: query.semanticVersion ?? (query.patchId ? "radial-v1" : "date-night-groups-v1"),
    ...(query.patchId ? { patchId: query.patchId } : {}),
    // A radial ID fixes the acquisition footprint independently of the chosen
    // display radius. The legacy disk likewise always fetches at least 15mi.
    radiusMiles: query.patchId ? 0 : Math.max(15, Math.min(50, query.radiusMiles)) };
}

const sameIdentityOrigin = (a: DateNightIdentityScope, b: DateNightIdentityScope) => a.lat === b.lat && a.lon === b.lon &&
  a.halloweenActive === b.halloweenActive && a.semanticVersion === b.semanticVersion;
const scopeKey = (scope: DateNightIdentityScope) => JSON.stringify([scope.lat, scope.lon, scope.halloweenActive,
  scope.semanticVersion, scope.patchId ?? null, scope.radiusMiles]);

export function identityUncertaintyFor(query: IdentityAcquisition, types: readonly ConcreteDateNightType[]): DateNightIdentityUncertainty | undefined {
  const activityTypes = providerTypes(types);
  return activityTypes.length ? { scopes: [{ scope: dateNightIdentityScope(query), activityTypes }] } : undefined;
}

export function mergeDateNightIdentityUncertainty(...states: readonly (DateNightIdentityUncertainty | undefined)[]): DateNightIdentityUncertainty | undefined {
  const scopes = new Map<string, DateNightIdentityCoverage>();
  let overflow = false;
  for (const state of states) {
    if (state?.overflow) overflow = true;
    for (const item of state?.scopes ?? []) {
      const key = scopeKey(item.scope), existing = scopes.get(key);
      if (!existing && scopes.size >= DATE_NIGHT_MAX_IDENTITY_SCOPES) { overflow = true; continue; }
      const activityTypes = providerTypes([...(existing?.activityTypes ?? []), ...item.activityTypes]);
      if (activityTypes.length) scopes.set(key, { scope: item.scope, activityTypes });
    }
  }
  return scopes.size || overflow ? { scopes: [...scopes].sort(([a], [b]) => a.localeCompare(b)).map(([, item]) => item),
    ...(overflow ? { overflow: true as const } : {}) } : undefined;
}

function identityFootprint(scope: DateNightIdentityScope) {
  if (scope.patchId) {
    const patch = resolveDateNightPatch(scope, 50, scope.patchId);
    return { center: patch.center, radiusMeters: patch.radiusMeters };
  }
  return { center: scope, radiusMeters: Math.min(scope.radiusMiles * 1609.34, 80_467) };
}

function footprintsOverlap(a: DateNightIdentityScope, b: DateNightIdentityScope) {
  try {
    const left = identityFootprint(a), right = identityFootprint(b);
    return haversineMiles(left.center.lat, left.center.lon, right.center.lat, right.center.lon) * 1609.344 <=
      left.radiusMeters + right.radiusMeters + 1;
  } catch { return true; } // An invalid retained scope cannot prove absence.
}

export function identityUncertaintyAtVenue(state: DateNightIdentityUncertainty | undefined, venue: DateNightPlace) {
  return mergeDateNightIdentityUncertainty(state ? { ...state, scopes: state.scopes.filter(item => {
    try {
      const footprint = identityFootprint(item.scope);
      return haversineMiles(venue.lat, venue.lon, footprint.center.lat, footprint.center.lon) * 1609.344 <= footprint.radiusMeters + 1;
    } catch { return true; }
  }) } : undefined);
}

export function identityUncertaintyForQuery(state: DateNightIdentityUncertainty | undefined, query: IdentityAcquisition) {
  const scope = dateNightIdentityScope(query);
  // A nearby origin change cannot hide a known gap from the same physical
  // venue. Distant acquisitions retain their own obligations without making an
  // unrelated venue's source incomplete.
  return mergeDateNightIdentityUncertainty(state ? { ...state, scopes: state.scopes.filter(item => footprintsOverlap(item.scope, scope)) } : undefined);
}

export function freshIdentityCoverage(response: DateNightSearchResponse): DateNightIdentityCoverage | undefined {
  const coverage = response.identityEvidenceCoverage;
  if (!coverage || response.source === "fallback" || !response.discovery || response.discovery.partial ||
      response.identityUncertainty?.overflow || response.identityUncertainty?.scopes.length ||
      response.discovery.groups.some(group => !["succeeded-nonempty", "succeeded-empty"].includes(group.outcome))) return undefined;
  const actualTypes = providerTypes(response.discovery.groups.flatMap(group => group.activityTypes));
  const coveredTypes = providerTypes(coverage.activityTypes);
  if (!coveredTypes.length || coveredTypes.length !== coverage.activityTypes.length ||
      coveredTypes.length !== actualTypes.length || coveredTypes.some(type => !actualTypes.includes(type))) return undefined;
  const scope = coverage.scope;
  if (!Number.isFinite(scope.lat) || Math.abs(scope.lat) > 90 || !Number.isFinite(scope.lon) || Math.abs(scope.lon) > 180) return undefined;
  if (scope.patchId) {
    if (scope.radiusMiles !== 0 || response.patch?.id !== scope.patchId || response.patch.version !== DATE_NIGHT_RADIAL_VERSION ||
        scope.semanticVersion !== DATE_NIGHT_RADIAL_VERSION) return undefined;
    try { resolveDateNightPatch(scope, 50, scope.patchId); } catch { return undefined; }
  } else if (response.patch || !Number.isFinite(scope.radiusMiles) || scope.radiusMiles < 15 || scope.radiusMiles > 50) return undefined;
  return coverage;
}

/** Complete empty acquisition can discharge its global scope obligation. It
 * cannot by itself rehabilitate any retained row; that requires fresh ID proof. */
export function resolveDateNightIdentityUncertainty(state: DateNightIdentityUncertainty | undefined, fresh: DateNightSearchResponse) {
  const coverage = freshIdentityCoverage(fresh);
  if (!state || !coverage) return state;
  const scopes = state.scopes.map(item => {
    const covered = sameIdentityOrigin(item.scope, coverage.scope) && item.scope.patchId === coverage.scope.patchId &&
      (item.scope.patchId !== undefined || coverage.scope.radiusMiles >= item.scope.radiusMiles);
    return { ...item, activityTypes: covered ? item.activityTypes.filter(type => !coverage.activityTypes.includes(type)) : item.activityTypes };
  });
  return mergeDateNightIdentityUncertainty({ ...state, scopes });
}

export function attachDateNightIdentityUncertainty(venues: readonly DateNightPlace[], state: DateNightIdentityUncertainty | undefined): DateNightPlace[] {
  if (!state) return [...venues];
  return venues.map(venue => {
    if (venue.source !== "osm" && !venue.discoveryEvidence?.some(item => item.source === "osm")) return venue;
    const identityUncertainty = mergeDateNightIdentityUncertainty(venue.identityUncertainty, identityUncertaintyAtVenue(state, venue));
    return identityUncertainty ? { ...venue, identityUncertainty } : venue;
  });
}

export function freshDateNightIdentityIds(fresh: DateNightSearchResponse): Set<string> {
  const coverage = freshIdentityCoverage(fresh);
  if (!coverage) return new Set();
  const footprint = identityFootprint(coverage.scope);
  return new Set(fresh.venues.filter(venue => Number.isFinite(venue.lat) && Number.isFinite(venue.lon) &&
    haversineMiles(venue.lat, venue.lon, footprint.center.lat, footprint.center.lon) * 1609.344 <= footprint.radiusMeters + 1 &&
    !venue.identityUncertainty && venue.discoveryEvidence?.some(item => {
    const source = item.sourceIdentity;
    return item.id === venue.id && item.source === "osm" && source && ["node", "way", "relation"].includes(source.objectType) &&
      Number.isInteger(source.objectId) && source.objectId > 0 && item.id === `date-night-osm-${source.objectType}-${source.objectId}` &&
      Number.isInteger(source.version) && source.version! > 0 && Number.isInteger(source.changeset) && source.changeset! > 0;
  })).map(venue => venue.id));
}

/** An existing row requires fresh source metadata for its own canonical ID as
 * well as complete reacquisition of its missing scope/category obligations. */
export function refreshDateNightIdentityUncertainty(venues: readonly DateNightPlace[], fresh: DateNightSearchResponse): DateNightPlace[] {
  const freshIds = freshDateNightIdentityIds(fresh);
  return venues.map(venue => {
    if (!venue.identityUncertainty || !freshIds.has(venue.id)) return venue;
    const identityUncertainty = resolveDateNightIdentityUncertainty(venue.identityUncertainty, fresh);
    if (identityUncertainty) return { ...venue, identityUncertainty };
    const { identityUncertainty: _previousUncertainty, ...complete } = venue;
    return complete;
  });
}

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
