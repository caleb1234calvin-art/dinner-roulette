import assert from "node:assert/strict";

/** Reverse only this candidate's explicit provider-uncertainty and named
 * selection-control amendments to reviewed parent d933c75. Every exact
 * replacement must occur once; all other bytes retain their immutable
 * ordinary/Halloween receipts. No runtime git diff or replacement baseline. */
const amendments = {
  "src/lib/date-night/cache.ts": [
    [`import { getCuratedSeasonalPlace } from "./curated-policy";
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
`,
`import { getCuratedSeasonalPlace } from "./curated-policy";
import { mergeDateNight } from "./identity";
import { attachDateNightIdentityObservations, mergeDateNightIdentityObservations } from "./source-observations";
import { buildDateNightQueryPlan, normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_VERSION, dateNightPatchOwns, resolveDateNightPatch } from "./radial-plan";
import type {
  ConcreteDateNightType,
  DateNightEvidence,
  DateNightGroupCoverage,
  DateNightPlace,
  DateNightSearchResponse,
  DateNightTypeId,
`],
    [`  missingActivityTypes: ConcreteDateNightType[];
  negativeEvidence?: DateNightPlace[];
  identityObservations?: DateNightEvidence[];
  identityUncertainty?: DateNightIdentityUncertainty;
  acquiredAt?: number;
}

`,
`  missingActivityTypes: ConcreteDateNightType[];
  negativeEvidence?: DateNightPlace[];
  identityObservations?: DateNightEvidence[];
  acquiredAt?: number;
}

`],
    [`    place.discoveryEvidence?.some((record) => record.source === "catalog")) ? "merged" : "live";
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

`,
`    place.discoveryEvidence?.some((record) => record.source === "catalog")) ? "merged" : "live";
}

/** Combine a fresh response with the snapshot that was fresh when acquisition
 * started. Never store this assembled response: that would extend older TTLs. */
export function combineDateNightDiscovery(snapshot: DateNightCacheSnapshot, fresh: DateNightSearchResponse): DateNightSearchResponse {
  const identityObservations = mergeDateNightIdentityObservations(snapshot.identityObservations, snapshot.response?.identityObservations, fresh.identityObservations);
  const observed = (venues: DateNightPlace[]) => attachDateNightIdentityObservations(canonicalMerge(venues), identityObservations);
  if (!snapshot.response) return identityObservations.length || snapshot.negativeEvidence?.length
    ? { ...fresh, venues: observed([...fresh.venues, ...(snapshot.negativeEvidence ?? [])]),
      ...(identityObservations.length ? { identityObservations } : {}) }
    : fresh;
  const venues = observed([...snapshot.response.venues, ...fresh.venues, ...(snapshot.negativeEvidence ?? [])]);
  // Legacy responses can still be displayed, but cannot assert category coverage.
  if (!fresh.discovery) return { venues, source: liveSource(venues), warning: fresh.warning,
    ...(identityObservations.length ? { identityObservations } : {}) };
  const groups = [...snapshot.response.discovery!.groups, ...fresh.discovery.groups];
  const partial = groups.some((group) => group.outcome === "failed" || group.outcome === "cancelled");
  return { venues, source: liveSource(venues), warning: partial ? PARTIAL_WARNING : undefined,
    ...(identityObservations.length ? { identityObservations } : {}),
    discovery: { groups, partial } };
}

`],
    [`export function failedDateNightAcquisition(acquisition: DateNightAcquisition): DateNightSearchResponse {
  return {
    venues: [], source: "fallback",
    identityUncertainty: identityUncertaintyFor(acquisition, normalizeDateNightActivityTypes(acquisition.activityTypes, acquisition.halloweenActive)),
    ...(acquisition.patchId ? { patch: { id: acquisition.patchId, version: DATE_NIGHT_RADIAL_VERSION } } : {}),
    discovery: {
      groups: buildDateNightQueryPlan(acquisition.activityTypes, acquisition.halloweenActive)
        .map((group) => ({ ...group, outcome: "failed" })),
`,
`export function failedDateNightAcquisition(acquisition: DateNightAcquisition): DateNightSearchResponse {
  return {
    venues: [], source: "fallback",
    discovery: {
      groups: buildDateNightQueryPlan(acquisition.activityTypes, acquisition.halloweenActive)
        .map((group) => ({ ...group, outcome: "failed" })),
`],
    [`}: { now?: () => number; ttlMs?: number; maxEntries?: number; maxVenues?: number } = {}) {
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
`,
`}: { now?: () => number; ttlMs?: number; maxEntries?: number; maxVenues?: number } = {}) {
  let entries: CacheEntry[] = [];
  let sequence = 0;
  // If a spatial negative is evicted, retire conflicting older positives before
  // removing its proof. Eviction must not turn a known closed venue back on.
  // Expiry retains the legacy freshness policy; a newer acquisition can refresh
`],
    [`  const evidenceCount = (entry: CacheEntry) => mergeDateNightIdentityObservations(entry.identityObservations,
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
`,
`  const evidenceCount = (entry: CacheEntry) => mergeDateNightIdentityObservations(entry.identityObservations,
    ...entry.venues.map(place => place.discoveryEvidence)).length;
  return {
    read(query: DateNightAcquisition): DateNightCacheSnapshot {
      prune(now());
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      // Fresh negative evidence protects an identity even when acquired through
      // a different category. It does not establish coverage for that category.
      const negativeEvidence = entries.filter((entry) => sameSignature(entry, query))
`],
    [`      }
      const missingActivityTypes = requested.filter((type) => !selected.has(type));
      if (!selected.size) return { response: null, missingActivityTypes, negativeEvidence,
        ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}) };
      const usedEntries = [...new Set([...selected.values()].map(({ entry }) => entry))];
      for (const entry of usedEntries) entry.used = ++sequence;
      const groups: DateNightGroupCoverage[] = [];
`,
`      }
      const missingActivityTypes = requested.filter((type) => !selected.has(type));
      if (!selected.size) return { response: null, missingActivityTypes, negativeEvidence,
        ...(identityObservations.length ? { identityObservations } : {}) };
      const usedEntries = [...new Set([...selected.values()].map(({ entry }) => entry))];
      for (const entry of usedEntries) entry.used = ++sequence;
      const groups: DateNightGroupCoverage[] = [];
`],
    [`        if (existing) existing.activityTypes.push(type);
        else groups.push({ id: hit.group.id, activityTypes: [type], outcome: "cache-hit", originOutcome });
      }
      const venues = retainIdentityProof(attachDateNightIdentityObservations(canonicalMerge([...usedEntries.flatMap((entry) => {
        const covered = requested.filter((type) => selected.get(type)?.entry === entry);
        // Reusing an old superset for Movies must not resurrect an old Corn Maze
        // snapshot after a newer Corn Maze query returned valid-empty. Retain
`,
`        if (existing) existing.activityTypes.push(type);
        else groups.push({ id: hit.group.id, activityTypes: [type], outcome: "cache-hit", originOutcome });
      }
      const venues = attachDateNightIdentityObservations(canonicalMerge([...usedEntries.flatMap((entry) => {
        const covered = requested.filter((type) => selected.get(type)?.entry === entry);
        // Reusing an old superset for Movies must not resurrect an old Corn Maze
        // snapshot after a newer Corn Maze query returned valid-empty. Retain
`],
    [`          // Their ordinary filters, radius, expiry and Open Now policy are applied
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
`,
`          // Their ordinary filters, radius, expiry and Open Now policy are applied
          // downstream; only a current registry identity can claim this exception.
          (!query.halloweenActive && getCuratedSeasonalPlace(place.id)?.seasonalListing?.visibility === "listing-lifecycle"));
      }), ...negativeEvidence]), identityObservations);
      return { missingActivityTypes, negativeEvidence, ...(identityObservations.length ? { identityObservations } : {}),
        acquiredAt: Math.min(...usedEntries.map(entry => entry.acquiredAt)),
        response: { venues, source: liveSource(venues), ...(identityObservations.length ? { identityObservations } : {}), discovery: { groups, partial: false } } };
    },
    store(query: DateNightAcquisition, response: DateNightSearchResponse): boolean {
      const at = now();
      prune(at);
      // Missing metadata, complete fallback and prior cache assemblies cannot
      // become proof that a provider acquired a category.
      if (response.source === "fallback" || !response.discovery || response.venues.length > maxVenues ||
          (response.identityObservations?.length ?? 0) > maxVenues) return false;
      const patch = query.patchId ? resolveDateNightPatch(query, query.radiusMiles, query.patchId) : undefined;
      if (patch && (response.patch?.id !== patch.id || response.patch.version !== DATE_NIGHT_RADIAL_VERSION)) return false;
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      const groups = response.discovery.groups.filter(succeeded).map((group) => ({
        ...group, activityTypes: group.activityTypes.filter((type) => requested.includes(type)),
`],
    [`      }
      const admitted = ++sequence;
      entries.push({ acquisition: { ...query, activityTypes: [...query.activityTypes] },
        venues: patch ? retainedVenues.filter(place => place.lifecycle || dateNightPatchOwns(query, patch, place)) : retainedVenues,
        identityObservations: mergeDateNightIdentityObservations(response.identityObservations),
        groups, acquiredAt: at, admitted, used: admitted });
      // Compose source facts back onto the exact existing records, not only the
`,
`      }
      const admitted = ++sequence;
      entries.push({ acquisition: { ...query, activityTypes: [...query.activityTypes] },
        venues: patch ? response.venues.filter(place => place.lifecycle || dateNightPatchOwns(query, patch, place)) : response.venues,
        identityObservations: mergeDateNightIdentityObservations(response.identityObservations),
        groups, acquiredAt: at, admitted, used: admitted });
      // Compose source facts back onto the exact existing records, not only the
`],
  ],
  "src/lib/date-night/radial-cache.ts": [
    [`import { hasReviewedSeasonalPlacement } from "./listing";
import { createDateNightDiscoveryCache, type DateNightAcquisition } from "./cache";
import { mergeDateNight } from "./identity";
import { attachDateNightIdentityObservations, attachDateNightIdentityUncertainty,
  mergeDateNightIdentityObservations, mergeDateNightIdentityUncertainty } from "./source-observations";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_VERSION, planDateNightPatches, summarizeDateNightCoverage,
  type DateNightPatchCoverageRecord } from "./radial-plan";
`,
`import { hasReviewedSeasonalPlacement } from "./listing";
import { createDateNightDiscoveryCache, type DateNightAcquisition } from "./cache";
import { mergeDateNight } from "./identity";
import { attachDateNightIdentityObservations, mergeDateNightIdentityObservations } from "./source-observations";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_VERSION, planDateNightPatches, summarizeDateNightCoverage,
  type DateNightPatchCoverageRecord } from "./radial-plan";
`],
    [`  const versioned = (query: DateNightAcquisition) => ({ ...query,
    semanticVersion: query.semanticVersion ?? DATE_NIGHT_RADIAL_VERSION });
  return {
    annotateIdentityEvidence(venues: readonly DateNightPlace[]) {
      return cache.annotateIdentityEvidence(venues);
    },
    store(query: DateNightAcquisition, response: DateNightSearchResponse) {
      if (!query.patchId) return false;
      return cache.store(versioned(query), response);
`,
`  const versioned = (query: DateNightAcquisition) => ({ ...query,
    semanticVersion: query.semanticVersion ?? DATE_NIGHT_RADIAL_VERSION });
  return {
    store(query: DateNightAcquisition, response: DateNightSearchResponse) {
      if (!query.patchId) return false;
      return cache.store(versioned(query), response);
`],
    [`      const successful = snapshots.flatMap(({ snapshot }) => snapshot.response ? [snapshot.response] : []);
      const negativeEvidence = snapshots[0]?.snapshot.negativeEvidence ?? [];
      const identityObservations = mergeDateNightIdentityObservations(...snapshots.map(({ snapshot }) => snapshot.identityObservations));
      const identityUncertainty = mergeDateNightIdentityUncertainty(...snapshots.map(({ snapshot }) => snapshot.identityUncertainty));
      const allVenues = attachDateNightIdentityUncertainty(attachDateNightIdentityObservations(mergeDateNight([...successful.flatMap(r => r.venues), ...negativeEvidence]
        .sort((a, b) => a.id.localeCompare(b.id) || JSON.stringify(a).localeCompare(JSON.stringify(b))), []), identityObservations), identityUncertainty);
      const venues = clipDateNightRadius(allVenues, query);
      const source = venues.some(p => p.source !== "osm" || p.discoveryEvidence?.some(e => e.source === "catalog")) ? "merged" : "live";
      const response: DateNightSearchResponse | null = successful.length ? {
        venues, source, ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}), discovery: { groups: successful.flatMap(r => r.discovery?.groups ?? []), partial: coverage.failedPatchIds.length > 0 },
      } : null;
      return { coverage, response, negativeEvidence, ...(identityObservations.length ? { identityObservations } : {}), ...(identityUncertainty ? { identityUncertainty } : {}) };
    },
  };
}
`,
`      const successful = snapshots.flatMap(({ snapshot }) => snapshot.response ? [snapshot.response] : []);
      const negativeEvidence = snapshots[0]?.snapshot.negativeEvidence ?? [];
      const identityObservations = mergeDateNightIdentityObservations(...snapshots.map(({ snapshot }) => snapshot.identityObservations));
      const allVenues = attachDateNightIdentityObservations(mergeDateNight([...successful.flatMap(r => r.venues), ...negativeEvidence]
        .sort((a, b) => a.id.localeCompare(b.id) || JSON.stringify(a).localeCompare(JSON.stringify(b))), []), identityObservations);
      const venues = clipDateNightRadius(allVenues, query);
      const source = venues.some(p => p.source !== "osm" || p.discoveryEvidence?.some(e => e.source === "catalog")) ? "merged" : "live";
      const response: DateNightSearchResponse | null = successful.length ? {
        venues, source, ...(identityObservations.length ? { identityObservations } : {}), discovery: { groups: successful.flatMap(r => r.discovery?.groups ?? []), partial: coverage.failedPatchIds.length > 0 },
      } : null;
      return { coverage, response, negativeEvidence, ...(identityObservations.length ? { identityObservations } : {}) };
    },
  };
}
`],
  ],
  "src/lib/date-night/radial-session.ts": [
    [`import { startDiscoveryRequest } from "../discovery/client-request";
import { DATE_NIGHT_CACHE_TTL_MS, dateNightAcquisitionIdentityEvidence, failedDateNightAcquisition, type DateNightAcquisition } from "./cache";
import { getCuratedSeasonalPlaces } from "./curated-policy";
import { createDateNightRadialCache, clipDateNightRadius } from "./radial-cache";
import { mergeDateNight } from "./identity";
import { attachDateNightIdentityObservations, attachDateNightIdentityUncertainty,
  freshDateNightIdentityIds, mergeDateNightIdentityObservations, mergeDateNightIdentityUncertainty, refreshDateNightIdentityUncertainty } from "./source-observations";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_MAX_PATCHES, type DateNightCoverageState, type DateNightPatchCoverageRecord } from "./radial-plan";
import type { ConcreteDateNightType, DateNightPlace, DateNightSearchResponse } from "./types";
`,
`import { startDiscoveryRequest } from "../discovery/client-request";
import { DATE_NIGHT_CACHE_TTL_MS, failedDateNightAcquisition, type DateNightAcquisition } from "./cache";
import { getCuratedSeasonalPlaces } from "./curated-policy";
import { createDateNightRadialCache, clipDateNightRadius } from "./radial-cache";
import { mergeDateNight } from "./identity";
import { attachDateNightIdentityObservations, mergeDateNightIdentityObservations } from "./source-observations";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_MAX_PATCHES, type DateNightCoverageState, type DateNightPatchCoverageRecord } from "./radial-plan";
import type { ConcreteDateNightType, DateNightPlace, DateNightSearchResponse } from "./types";
`],
    [`
  const publish = () => {
    if (!query || !onChange) return;
    const { coverage, response, negativeEvidence, identityObservations: cachedObservations, identityUncertainty: cachedUncertainty } = snapshot();
    const identityObservations = mergeDateNightIdentityObservations(cachedObservations, displayOnly?.identityObservations);
    const identityUncertainty = mergeDateNightIdentityUncertainty(cachedUncertainty, displayOnly?.identityUncertainty);
    // Presentation-only rows have no cache entry to retain composed evidence.
    // Keep actual source observations with these bounded records until a fresh
    // acquisition replaces them; expiry cannot silently restore old authority.
    if (displayOnly) displayOnly = { ...displayOnly,
      venues: cache.annotateIdentityEvidence(attachDateNightIdentityUncertainty(
        attachDateNightIdentityObservations(displayOnly.venues, identityObservations), identityUncertainty)) };
    savedPool = attachDateNightIdentityUncertainty(attachDateNightIdentityObservations(savedPool, identityObservations), identityUncertainty);
    let visible = response;
    if (displayOnly) {
      const venues = clipDateNightRadius(mergeDateNight([
`,
`
  const publish = () => {
    if (!query || !onChange) return;
    const { coverage, response, negativeEvidence, identityObservations: cachedObservations } = snapshot();
    const identityObservations = mergeDateNightIdentityObservations(cachedObservations, displayOnly?.identityObservations);
    // Presentation-only rows have no cache entry to retain composed evidence.
    // Keep actual source observations with these bounded records until a fresh
    // acquisition replaces them; expiry cannot silently restore old authority.
    if (displayOnly) displayOnly = { ...displayOnly,
      venues: attachDateNightIdentityObservations(displayOnly.venues, identityObservations) };
    savedPool = attachDateNightIdentityObservations(savedPool, identityObservations);
    let visible = response;
    if (displayOnly) {
      const venues = clipDateNightRadius(mergeDateNight([
`],
    [`    const hasFailure = coverage.failedPatchIds.length > 0;
    if (visible && identityObservations.length) visible = { ...visible, identityObservations,
      venues: attachDateNightIdentityObservations(visible.venues, identityObservations) };
    if (visible && identityUncertainty) visible = { ...visible, identityUncertainty,
      venues: attachDateNightIdentityUncertainty(visible.venues, identityUncertainty) };
    if (visible) {
      // A composed or retained view cannot masquerade as a fresh acquisition.
      const { identityEvidenceCoverage: _freshCoverage, ...retainedView } = visible;
      visible = retainedView;
    }
    if (visible && hasFailure && response) visible = { ...visible, warning: PARTIAL_WARNING,
      discovery: { groups: visible.discovery?.groups ?? [], partial: true } };
    const ready = Boolean(visible) || (coreSettled && !inFlight);
`,
`    const hasFailure = coverage.failedPatchIds.length > 0;
    if (visible && identityObservations.length) visible = { ...visible, identityObservations,
      venues: attachDateNightIdentityObservations(visible.venues, identityObservations) };
    if (visible && hasFailure && response) visible = { ...visible, warning: PARTIAL_WARNING,
      discovery: { groups: visible.discovery?.groups ?? [], partial: true } };
    const ready = Boolean(visible) || (coreSettled && !inFlight);
`],
    [`      request: signal => request(flight.query, signal),
      onSuccess: result => {
        if (inFlight !== flight) return;
        // An opaque legacy refresh is display data, not proof that a previously
        // incomplete identity acquisition has become complete. Keep its gaps
        // before admission, so a display row cannot launder them into the cache.
        const freshIds = freshDateNightIdentityIds(dateNightAcquisitionIdentityEvidence(flight.query, result));
        if (displayOnly) {
          const prior = new Map(displayOnly.venues.map(venue => [venue.id, venue.identityUncertainty]));
          result = { ...result, venues: result.venues.map(venue => freshIds.has(venue.id) ? venue
            : attachDateNightIdentityUncertainty([venue], prior.get(venue.id))[0]!) };
        }
        cache.store(flight.query, result);
        result = dateNightAcquisitionIdentityEvidence(flight.query, result);
        result = { ...result, venues: cache.annotateIdentityEvidence(result.venues) };
        savedPool = refreshDateNightIdentityUncertainty(savedPool, result);
        const after = snapshot().coverage.patches.find(p => p.id === candidate.id)!;
        const missing = flight.types.filter(t => after.missingActivityTypes.includes(t));
        degraded = missing.length > 0;
`,
`      request: signal => request(flight.query, signal),
      onSuccess: result => {
        if (inFlight !== flight) return;
        cache.store(flight.query, result);
        const after = snapshot().coverage.patches.find(p => p.id === candidate.id)!;
        const missing = flight.types.filter(t => after.missingActivityTypes.includes(t));
        degraded = missing.length > 0;
`],
    [`      },
      onError: failure => {
        if (inFlight !== flight) return;
        cache.store(flight.query, failedDateNightAcquisition(flight.query));
        degraded = true;
        const failures = failed.get(candidate.id) ?? new Set<ConcreteDateNightType>();
        flight.types.forEach(t => failures.add(t));
`,
`      },
      onError: failure => {
        if (inFlight !== flight) return;
        degraded = true;
        const failures = failed.get(candidate.id) ?? new Set<ConcreteDateNightType>();
        flight.types.forEach(t => failures.add(t));
`],
  ],
  "src/lib/date-night/identity.ts": [
    [`import { haversineMiles } from "../restaurants/geo";
import { namesMatch, normalizeName } from "../utils";
import { dateNightTypeLabel, type ConcreteDateNightType, type DateNightPlace } from "./types";
import { boundDateNightIdentityEvidence, mergeDateNightIdentityUncertainty } from "./source-observations";

const DATE_NIGHT_ALIAS_GROUPS = [
  [
`,
`import { haversineMiles } from "../restaurants/geo";
import { namesMatch, normalizeName } from "../utils";
import { dateNightTypeLabel, type ConcreteDateNightType, type DateNightPlace } from "./types";
import { boundDateNightIdentityEvidence } from "./source-observations";

const DATE_NIGHT_ALIAS_GROUPS = [
  [
`],
    [`  return {
    ...second!, ...first!, activityTypes, discoveryEvidence,
    ...(a.identityObservationOverflow || b.identityObservationOverflow || bounded.overflow ? { identityObservationOverflow: true as const } : {}),
    ...(a.identityUncertainty || b.identityUncertainty
      ? { identityUncertainty: mergeDateNightIdentityUncertainty(a.identityUncertainty, b.identityUncertainty) } : {}),
    lifecycle: a.lifecycle === "permanently-closed" || b.lifecycle === "permanently-closed"
      ? "permanently-closed" : a.lifecycle ?? b.lifecycle,
    openingHours: (first!.seasonalAvailability ?? second!.seasonalAvailability)?.openNowPolicy === "never"
`,
`  return {
    ...second!, ...first!, activityTypes, discoveryEvidence,
    ...(a.identityObservationOverflow || b.identityObservationOverflow || bounded.overflow ? { identityObservationOverflow: true as const } : {}),
    lifecycle: a.lifecycle === "permanently-closed" || b.lifecycle === "permanently-closed"
      ? "permanently-closed" : a.lifecycle ?? b.lifecycle,
    openingHours: (first!.seasonalAvailability ?? second!.seasonalAvailability)?.openNowPolicy === "never"
`],
  ],
  "src/components/options-overlay.tsx": [
    [`
  return (
    <article className="flex min-h-[17rem] flex-col overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="relative flex flex-1 flex-col">
        <button type="button" onClick={onSelect} className="flex w-full flex-1 flex-col text-left" style={{ outlineOffset: -3 }}>
          <span className="sr-only">Choose </span>
          <div className="relative w-full">
            {mode === "date-night" && dateNightIcon ? (
              <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={dateNightIcon} alt="" className={cn("size-24 rounded-2xl object-cover shadow-sm", halloween && "date-night-halloween-icon")} /></div>
            ) : mode === "date-night" ? (
              <div className="flex h-28 w-full items-center justify-center bg-elevated outline outline-1 -outline-offset-1 outline-fg/10"><Sparkles className="size-10 text-accent" /></div>
            ) : mode === "nightlife" && nightlifeIcon ? (
              <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={nightlifeIcon} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
            ) : mode === "nightlife" ? (
              <div className="h-28 w-full bg-elevated outline outline-1 -outline-offset-1 outline-fg/10" aria-hidden="true" />
            ) : (
              <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={visualSrc} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
            )}
          </div>
          <div className={cn("flex w-full flex-1 flex-col text-left", seasonal ? "px-2 pt-2 pb-0" : "px-3 py-3")}>
          <h3 title={restaurant.name} className={cn("font-display text-fg", seasonal ? "w-full truncate text-sm leading-[18px]" : "line-clamp-2 text-lg leading-tight")}>{restaurant.name}</h3>
          {mode === "date-night" && activityTypes.length ? <div className={cn("flex gap-1", seasonal ? "mt-1 w-full min-w-0" : "mt-2 flex-wrap")}>{activityTypes.slice(0, 3).map((type) => <span key={type} title={dateNightTypeLabel([type])} className={cn("rounded-full bg-elevated text-[10px] tracking-wide text-muted uppercase", seasonal ? "min-w-0 truncate px-1 py-0.5 leading-[14px]" : "px-2 py-1")}>{dateNightTypeLabel([type])}</span>)}</div> : <p className="mt-1 text-xs text-muted">{restaurant.cuisineLabel}{restaurant.priceLevel ? \` · \${formatPrice(restaurant.priceLevel)}\` : ""}</p>}
          <p className={cn("text-xs text-subtle", seasonal ? "mt-1 leading-[14px]" : "mt-2")}>{seasonalDistancePrefix(restaurant)}{formatDistance(restaurant.distanceMiles)}{openLabel ? \` · \${openLabel}\` : ""}</p>
          {mode === "date-night" && !restaurant.hoursKnown && !dateNightRestaurant.seasonalListing && !dateNightRestaurant.seasonalAvailability && !dateNightRestaurant.seasonalVisitNotes?.length ? <p className="mt-1 text-xs text-subtle">Hours unknown — check before going</p> : null}
          {restaurant.closingSoon ? <p className="mt-1 text-xs text-danger">Closing soon</p> : null}
          </div>
        </button>
        <button type="button" onClick={onNotTonight} className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-md bg-bg/80 text-fg" aria-label={\`Not tonight: \${restaurant.name}\`}><Ban className="size-4" /></button>
      </div>
      {mode === "date-night" && (dateNightRestaurant.seasonalListing || dateNightRestaurant.seasonalAvailability || dateNightRestaurant.seasonalVisitNotes?.length) ? <div className="px-2 pb-1"><SeasonalVisitNotes place={dateNightRestaurant} /></div> : null}
    </article>
  );
`,
`
  return (
    <article className="flex min-h-[17rem] flex-col overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="relative">
        <button type="button" onClick={onSelect} className="block w-full text-left">
          {mode === "date-night" && dateNightIcon ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={dateNightIcon} alt="" className={cn("size-24 rounded-2xl object-cover shadow-sm", halloween && "date-night-halloween-icon")} /></div>
          ) : mode === "date-night" ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated outline outline-1 -outline-offset-1 outline-fg/10"><Sparkles className="size-10 text-accent" /></div>
          ) : mode === "nightlife" && nightlifeIcon ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={nightlifeIcon} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
          ) : mode === "nightlife" ? (
            <div className="h-28 w-full bg-elevated outline outline-1 -outline-offset-1 outline-fg/10" aria-hidden="true" />
          ) : (
            <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={visualSrc} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
          )}
        </button>
        <button type="button" onClick={onNotTonight} className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-md bg-bg/80 text-fg" aria-label={\`Not tonight: \${restaurant.name}\`}><Ban className="size-4" /></button>
      </div>
      <button type="button" onClick={onSelect} className={cn("flex flex-1 flex-col text-left", seasonal ? "px-2 pt-2 pb-0" : "px-3 py-3")}>
        <h3 title={restaurant.name} className={cn("font-display text-fg", seasonal ? "w-full truncate text-sm leading-[18px]" : "line-clamp-2 text-lg leading-tight")}>{restaurant.name}</h3>
        {mode === "date-night" && activityTypes.length ? <div className={cn("flex gap-1", seasonal ? "mt-1 w-full min-w-0" : "mt-2 flex-wrap")}>{activityTypes.slice(0, 3).map((type) => <span key={type} title={dateNightTypeLabel([type])} className={cn("rounded-full bg-elevated text-[10px] tracking-wide text-muted uppercase", seasonal ? "min-w-0 truncate px-1 py-0.5 leading-[14px]" : "px-2 py-1")}>{dateNightTypeLabel([type])}</span>)}</div> : <p className="mt-1 text-xs text-muted">{restaurant.cuisineLabel}{restaurant.priceLevel ? \` · \${formatPrice(restaurant.priceLevel)}\` : ""}</p>}
        <p className={cn("text-xs text-subtle", seasonal ? "mt-1 leading-[14px]" : "mt-2")}>{seasonalDistancePrefix(restaurant)}{formatDistance(restaurant.distanceMiles)}{openLabel ? \` · \${openLabel}\` : ""}</p>
        {mode === "date-night" && !restaurant.hoursKnown && !dateNightRestaurant.seasonalListing && !dateNightRestaurant.seasonalAvailability && !dateNightRestaurant.seasonalVisitNotes?.length ? <p className="mt-1 text-xs text-subtle">Hours unknown — check before going</p> : null}
        {restaurant.closingSoon ? <p className="mt-1 text-xs text-danger">Closing soon</p> : null}
      </button>
      {mode === "date-night" && (dateNightRestaurant.seasonalListing || dateNightRestaurant.seasonalAvailability || dateNightRestaurant.seasonalVisitNotes?.length) ? <div className="px-2 pb-1"><SeasonalVisitNotes place={dateNightRestaurant} /></div> : null}
    </article>
  );
`],
  ],
};

export function christmasTwoSourceBefore(path, bytes) {
  let source = bytes.toString();
  for (const [index, [after, before]] of (amendments[path] ?? []).entries()) {
    assert.equal(source.split(after).length, 2, `${path}: one exact PR #97 correction amendment ${index + 1}`);
    source = source.replace(after, before);
  }
  return Buffer.from(source);
}
