import { getCuratedSeasonalPlace } from "./curated-policy";
import { mergeDateNight } from "./identity";
import { attachDateNightIdentityObservations, attachDateNightIdentityUncertainty, dateNightIdentityScope, freshDateNightIdentityIds, freshIdentityCoverage,
  identityUncertaintyAtVenue, identityUncertaintyFor, identityUncertaintyForQuery, mergeDateNightIdentityObservations, mergeDateNightIdentityUncertainty,
  refreshDateNightIdentityUncertainty, resolveDateNightIdentityUncertainty } from "./source-observations";
import { buildDateNightQueryPlan, normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_VERSION, dateNightPatchOwns, resolveDateNightPatch } from "./radial-plan";
import type {
  ConcreteDateNightType,
  DateNightEvidence,
  DateNightGroupCoverage,
  DateNightIdentityUncertainty,
  DateNightPlace,
  DateNightSearchResponse,
  DateNightTypeId,
} from "./types";

export const DATE_NIGHT_CACHE_TTL_MS = 10 * 60_000;
export const DATE_NIGHT_CACHE_MAX_ENTRIES = 8;
export const DATE_NIGHT_CACHE_MAX_VENUES = 20_000;
export const DATE_NIGHT_ACQUISITION_VERSION = "date-night-groups-v1";
const PARTIAL_WARNING = "Some live date-night searches are unavailable. Showing available live results and saved places; coverage may be incomplete.";

export interface DateNightAcquisition {
  lat: number;
  lon: number;
  radiusMiles: number;
  halloweenActive: boolean;
  activityTypes: readonly DateNightTypeId[];
  semanticVersion?: string;
  /** Logical positive authority; legacy disk authority is a separate namespace. */
  patchId?: string;
}

export interface DateNightCacheSnapshot {
  response: DateNightSearchResponse | null;
  missingActivityTypes: ConcreteDateNightType[];
  negativeEvidence?: DateNightPlace[];
  identityObservations?: DateNightEvidence[];
  identityUncertainty?: DateNightIdentityUncertainty;
  acquiredAt?: number;
}

/** Persisted UI settings can outlive category names. Recover locally without
 * relaxing the strict server RPC validator or accepting query fragments. */
export function sanitizeDateNightClientActivityTypes(raw: unknown): DateNightTypeId[] {
  const allowed: readonly DateNightTypeId[] = ["anything", ...normalizeDateNightActivityTypes(["anything"], true)];
  const valid = Array.isArray(raw)
    ? [...new Set(raw.filter((type): type is DateNightTypeId => typeof type === "string" && allowed.includes(type as DateNightTypeId)))]
    : [];
  return !valid.length || valid.includes("anything") ? ["anything"] : valid;
}

export function normalizeDateNightClientActivityTypes(raw: unknown, halloweenActive: boolean) {
  return normalizeDateNightActivityTypes(sanitizeDateNightClientActivityTypes(raw), halloweenActive);
}

interface CacheEntry {
  acquisition: DateNightAcquisition;
  venues: DateNightPlace[];
  identityObservations: DateNightEvidence[];
  groups: DateNightGroupCoverage[];
  acquiredAt: number;
  readonly admitted: number;
  used: number;
}

function succeeded(group: DateNightGroupCoverage) {
  return group.outcome === "succeeded-nonempty" || group.outcome === "succeeded-empty";
}

function canonicalMerge(venues: DateNightPlace[]): DateNightPlace[] {
  // A canonical traversal retains the existing alias/distance merge semantics
  // independently of network completion order or cache insertion order.
  return mergeDateNight([...venues].sort((a, b) => a.id.localeCompare(b.id) ||
    JSON.stringify(a).localeCompare(JSON.stringify(b))), []);
}

function liveSource(venues: DateNightPlace[]): DateNightSearchResponse["source"] {
  return venues.some((place) => place.source !== "osm" ||
    place.discoveryEvidence?.some((record) => record.source === "catalog")) ? "merged" : "live";
}

/** Only the response for this actual acquisition can resolve its missing
 * evidence. Session-owned rows use the same guard as admitted cache entries. */
export function dateNightAcquisitionIdentityEvidence(query: DateNightAcquisition, response: DateNightSearchResponse,
  maxVenues = DATE_NIGHT_CACHE_MAX_VENUES): DateNightSearchResponse {
  const expected = dateNightIdentityScope(query), coverage = freshIdentityCoverage(response), actual = coverage?.scope;
  const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive).filter(type => type !== "other-halloween-fall");
  const patchMatches = !query.patchId || response.patch?.id === query.patchId && response.patch.version === DATE_NIGHT_RADIAL_VERSION;
  const matches = response.venues.length <= maxVenues && (response.identityObservations?.length ?? 0) <= maxVenues && patchMatches && actual &&
    Object.entries(expected).every(([key, value]) => actual[key as keyof typeof actual] === value) && actual.patchId === expected.patchId &&
    requested.length === coverage.activityTypes.length && requested.every(type => coverage.activityTypes.includes(type));
  if (matches) return response;
  const { identityEvidenceCoverage: _unverifiedCoverage, ...displayOnly } = response;
  return displayOnly;
}

/** Combine a fresh response with the snapshot that was fresh when acquisition
 * started. Never store this assembled response: that would extend older TTLs. */
export function combineDateNightDiscovery(snapshot: DateNightCacheSnapshot, fresh: DateNightSearchResponse): DateNightSearchResponse {
  const identityObservations = mergeDateNightIdentityObservations(snapshot.identityObservations, snapshot.response?.identityObservations, fresh.identityObservations);
  const identityUncertainty = mergeDateNightIdentityUncertainty(
    resolveDateNightIdentityUncertainty(snapshot.identityUncertainty, fresh),
    resolveDateNightIdentityUncertainty(snapshot.response?.identityUncertainty, fresh), fresh.identityUncertainty);
  const observed = (venues: DateNightPlace[]) => attachDateNightIdentityUncertainty(
    attachDateNightIdentityObservations(canonicalMerge(refreshDateNightIdentityUncertainty(venues, fresh)), identityObservations), identityUncertainty);
  const { identityEvidenceCoverage: _freshCoverage, ...assembledFresh } = fresh;
  if (!snapshot.response) return identityObservations.length || identityUncertainty || snapshot.negativeEvidence?.length
    ? { ...assembledFresh, venues: observed([...fresh.venues, ...(snapshot.negativeEvidence ?? [])]),
      ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}) }
    : assembledFresh;
  const venues = observed([...snapshot.response.venues, ...fresh.venues, ...(snapshot.negativeEvidence ?? [])]);
  // Legacy responses can still be displayed, but cannot assert category coverage.
  if (!fresh.discovery) return { venues, source: liveSource(venues), warning: fresh.warning,
    ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}) };
  const groups = [...snapshot.response.discovery!.groups, ...fresh.discovery.groups];
  const partial = groups.some((group) => group.outcome === "failed" || group.outcome === "cancelled");
  return { venues, source: liveSource(venues), warning: partial ? PARTIAL_WARNING : undefined,
    ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}),
    discovery: { groups, partial } };
}

/** A transport error must not erase successful coverage acquired earlier in this
 * mounted session. It also must not invent coverage for the missing categories. */
export function failedDateNightAcquisition(acquisition: DateNightAcquisition): DateNightSearchResponse {
  return {
    venues: [], source: "fallback",
    identityUncertainty: identityUncertaintyFor(acquisition, normalizeDateNightActivityTypes(acquisition.activityTypes, acquisition.halloweenActive)),
    ...(acquisition.patchId ? { patch: { id: acquisition.patchId, version: DATE_NIGHT_RADIAL_VERSION } } : {}),
    discovery: {
      groups: buildDateNightQueryPlan(acquisition.activityTypes, acquisition.halloweenActive)
        .map((group) => ({ ...group, outcome: "failed" })),
      partial: false,
    },
  };
}

/** Memory only, owned by one mounted DateNightHome. No coordinates are persisted
 * or logged. TTL is checked at the next acquisition, not on local clock ticks;
 * venue eligibility is always recomputed separately. */
export function createDateNightDiscoveryCache({
  now = Date.now,
  ttlMs = DATE_NIGHT_CACHE_TTL_MS,
  maxEntries = DATE_NIGHT_CACHE_MAX_ENTRIES,
  maxVenues = DATE_NIGHT_CACHE_MAX_VENUES,
}: { now?: () => number; ttlMs?: number; maxEntries?: number; maxVenues?: number } = {}) {
  let entries: CacheEntry[] = [];
  let sequence = 0;
  // Missing source is not venue coverage and has no TTL that can prove it
  // complete. This bounded scope registry also protects rows arriving later.
  let unresolvedIdentity: DateNightIdentityUncertainty | undefined;
  // Settling an empty group does not supply a retained venue's own revision.
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
      return { ...venue, identityUncertainty };
    });
    return attachDateNightIdentityUncertainty(retained, unresolvedIdentity);
  };
  // If a spatial negative is evicted, retire conflicting older positives before
  // removing its proof. Eviction must not turn a known closed venue back on.
  // Expiry retains the legacy freshness policy; a newer acquisition can refresh
  // a venue after old evidence expires. This is destructive retirement, no
  // unbounded tombstone registry or rejuvenated negative TTL.
  const retireEvictedNegative = (removed: CacheEntry) => {
    if (!removed.acquisition.patchId) return;
    const negatives = removed.venues.filter(place => place.lifecycle);
    if (!negatives.length) return;
    for (const entry of entries) {
      if (entry === removed || !sameSignature(entry, removed.acquisition)) continue;
      entry.venues = entry.venues.filter(place => place.lifecycle ||
        !negatives.some(negative => mergeDateNight([place], [negative]).length === 1));
    }
  };
  const prune = (at: number) => {
    entries = entries.filter((entry) => at >= entry.acquiredAt && at - entry.acquiredAt < ttlMs);
  };
  const sameSignature = (entry: CacheEntry, query: DateNightAcquisition) => {
    const saved = entry.acquisition;
    return saved.lat === query.lat && saved.lon === query.lon &&
      saved.halloweenActive === query.halloweenActive &&
      (saved.semanticVersion ?? DATE_NIGHT_ACQUISITION_VERSION) ===
        (query.semanticVersion ?? DATE_NIGHT_ACQUISITION_VERSION);
  };
  const compatible = (entry: CacheEntry, query: DateNightAcquisition) =>
    sameSignature(entry, query) && entry.acquisition.patchId === query.patchId &&
      (Boolean(query.patchId) || entry.acquisition.radiusMiles >= query.radiusMiles);
  const evidenceCount = (entry: CacheEntry) => mergeDateNightIdentityObservations(entry.identityObservations,
    ...entry.venues.map(place => place.discoveryEvidence)).length;
  return {
    annotateIdentityEvidence(venues: readonly DateNightPlace[]) {
      return retainIdentityProof(venues);
    },
    read(query: DateNightAcquisition): DateNightCacheSnapshot {
      prune(now());
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      let identityUncertainty = identityUncertaintyForQuery(unresolvedIdentity, query);
      // Fresh negative evidence protects an identity even when acquired through
      // a different category. It does not establish coverage for that category.
      const negativeEvidence = entries.filter((entry) => sameSignature(entry, query))
        .flatMap((entry) => entry.venues.filter((place) => Boolean(place.lifecycle)));
      const identityObservations = mergeDateNightIdentityObservations(...entries.filter(entry => sameSignature(entry, query))
        .map(entry => entry.identityObservations));
      const selected = new Map<ConcreteDateNightType, { entry: CacheEntry; group: DateNightGroupCoverage }>();
      // Equal-resolution clock readings still follow acquisition order. LRU
      // reads may change eviction priority, never a snapshot's freshness.
      for (const entry of [...entries].sort((a, b) => b.acquiredAt - a.acquiredAt || b.admitted - a.admitted)) {
        if (!compatible(entry, query)) continue;
        for (const group of entry.groups) {
          for (const type of group.activityTypes) {
            if (requested.includes(type) && !selected.has(type)) selected.set(type, { entry, group });
          }
        }
      }
      const missingActivityTypes = requested.filter((type) => !selected.has(type));
      if (!selected.size) return { response: null, missingActivityTypes, negativeEvidence,
        ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}) };
      const usedEntries = [...new Set([...selected.values()].map(({ entry }) => entry))];
      for (const entry of usedEntries) entry.used = ++sequence;
      const groups: DateNightGroupCoverage[] = [];
      for (const type of requested) {
        const hit = selected.get(type);
        if (!hit) continue;
        const originOutcome = hit.group.outcome as "succeeded-nonempty" | "succeeded-empty";
        const existing = groups.find((group) => group.id === hit.group.id && group.originOutcome === originOutcome);
        if (existing) existing.activityTypes.push(type);
        else groups.push({ id: hit.group.id, activityTypes: [type], outcome: "cache-hit", originOutcome });
      }
      const venues = retainIdentityProof(attachDateNightIdentityObservations(canonicalMerge([...usedEntries.flatMap((entry) => {
        const covered = requested.filter((type) => selected.get(type)?.entry === entry);
        // Reusing an old superset for Movies must not resurrect an old Corn Maze
        // snapshot after a newer Corn Maze query returned valid-empty. Retain
        // full provenance/classification on every included identity.
        return entry.venues.filter((place) => place.activityTypes.some((type) => covered.includes(type)) ||
          // Current catalog lifecycle supplements are not provider category coverage.
          // Their ordinary filters, radius, expiry and Open Now policy are applied
          // downstream; only a current registry identity can claim this exception.
          (!query.halloweenActive && getCuratedSeasonalPlace(place.id)?.seasonalListing?.visibility === "listing-lifecycle"));
      }), ...negativeEvidence]), identityObservations));
      identityUncertainty = identityUncertaintyForQuery(unresolvedIdentity, query);
      return { missingActivityTypes, negativeEvidence, ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}),
        acquiredAt: Math.min(...usedEntries.map(entry => entry.acquiredAt)),
        response: { venues, source: liveSource(venues), ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}), discovery: { groups, partial: false } } };
    },
    store(query: DateNightAcquisition, response: DateNightSearchResponse): boolean {
      const at = now();
      prune(at);
      const patch = query.patchId ? resolveDateNightPatch(query, query.radiusMiles, query.patchId) : undefined;
      const packetFits = response.venues.length <= maxVenues && (response.identityObservations?.length ?? 0) <= maxVenues;
      const patchMatches = !patch || response.patch?.id === patch.id && response.patch.version === DATE_NIGHT_RADIAL_VERSION;
      // Fresh coverage is scoped to this actual acquisition, not an arbitrary
      // descriptor supplied alongside an otherwise legitimate provider result.
      const fresh = dateNightAcquisitionIdentityEvidence(query, response, maxVenues);
      // Opaque legacy display data has never claimed patch authority. An
      // explicit wrong patch or an unfulfilled fresh-coverage claim has, and
      // rejection must not make the existing patch appear complete by default.
      const rejectedPatch = !patchMatches && Boolean(response.patch || response.identityEvidenceCoverage);
      const failedTypes = !packetFits || rejectedPatch ? normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive)
        : response.discovery?.groups.filter(group => ["failed", "cancelled"].includes(group.outcome)).flatMap(group => group.activityTypes) ?? [];
      unresolvedIdentity = mergeDateNightIdentityUncertainty(resolveDateNightIdentityUncertainty(unresolvedIdentity, fresh), response.identityUncertainty,
        identityUncertaintyFor(query, failedTypes));
      const freshIds = freshDateNightIdentityIds(fresh);
      for (const entry of entries) entry.venues = retainIdentityProof(refreshDateNightIdentityUncertainty(entry.venues, fresh), freshIds);
      const retainedVenues = retainIdentityProof(response.venues, freshIds);
      // Protective uncertainty is retained even for a failed/no-coverage result.
      // The return value still means ordinary coverage was actually admitted.
      if (response.source === "fallback" || !response.discovery || !packetFits || !patchMatches) return false;
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      const groups = response.discovery.groups.filter(succeeded).map((group) => ({
        ...group, activityTypes: group.activityTypes.filter((type) => requested.includes(type)),
      })).filter((group) => group.activityTypes.length > 0);
      if (!groups.length) return false;
      // Successful coverage retires older authority before ordinary LRU eviction.
      // Otherwise evicting a newer empty snapshot could restore an older superset.
      // Invalidate across radii for the same signature: a narrower refresh may
      // require a later wider refetch, but can never make old coverage fresh again.
      const superseded = new Set(groups.flatMap((group) => group.activityTypes));
      for (const entry of entries) {
        if (!sameSignature(entry, query) || entry.acquisition.patchId !== query.patchId) continue;
        entry.groups = entry.groups.map((group) => ({
          ...group, activityTypes: group.activityTypes.filter((type) => !superseded.has(type)),
        })).filter((group) => group.activityTypes.length > 0);
        // Raw identities stay intact for any still-covered category; even entries
        // with no coverage retain protective negative evidence until TTL/eviction.
      }
      const admitted = ++sequence;
      entries.push({ acquisition: { ...query, activityTypes: [...query.activityTypes] },
        venues: patch ? retainedVenues.filter(place => place.lifecycle || dateNightPatchOwns(query, patch, place)) : retainedVenues,
        identityObservations: mergeDateNightIdentityObservations(response.identityObservations),
        groups, acquiredAt: at, admitted, used: admitted });
      // Compose source facts back onto the exact existing records, not only the
      // transient read result. Standalone evidence may expire or be evicted,
      // but cannot make a retained venue forget a contradiction it has received.
      // A genuinely new acquisition replaces its category authority normally.
      const scoped = entries.filter(entry => sameSignature(entry, query));
      const observations = mergeDateNightIdentityObservations(...scoped.map(entry => entry.identityObservations));
      for (const entry of scoped) entry.venues = attachDateNightIdentityObservations(entry.venues, observations);
      while (entries.length > maxEntries || entries.reduce((sum, entry) => sum + entry.venues.length, 0) > maxVenues ||
          entries.reduce((sum, entry) => sum + evidenceCount(entry), 0) > maxVenues) {
        const oldest = entries.reduce((a, b) => a.used < b.used ? a : b);
        retireEvictedNegative(oldest);
        entries.splice(entries.indexOf(oldest), 1);
      }
      return true;
    },
  };
}
