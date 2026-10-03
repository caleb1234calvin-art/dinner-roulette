import { mergeDateNight } from "./identity";
import { buildDateNightQueryPlan, normalizeDateNightActivityTypes } from "./query-plan";
import type {
  ConcreteDateNightType,
  DateNightGroupCoverage,
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
}

export interface DateNightCacheSnapshot {
  response: DateNightSearchResponse | null;
  missingActivityTypes: ConcreteDateNightType[];
  negativeEvidence?: DateNightPlace[];
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
  groups: DateNightGroupCoverage[];
  acquiredAt: number;
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

/** Combine a fresh response with the snapshot that was fresh when acquisition
 * started. Never store this assembled response: that would extend older TTLs. */
export function combineDateNightDiscovery(snapshot: DateNightCacheSnapshot, fresh: DateNightSearchResponse): DateNightSearchResponse {
  if (!snapshot.response) return snapshot.negativeEvidence?.length
    ? { ...fresh, venues: canonicalMerge([...fresh.venues, ...snapshot.negativeEvidence]) }
    : fresh;
  const venues = canonicalMerge([...snapshot.response.venues, ...fresh.venues, ...(snapshot.negativeEvidence ?? [])]);
  // Legacy responses can still be displayed, but cannot assert category coverage.
  if (!fresh.discovery) return { venues, source: liveSource(venues), warning: fresh.warning };
  const groups = [...snapshot.response.discovery!.groups, ...fresh.discovery.groups];
  const partial = groups.some((group) => group.outcome === "failed" || group.outcome === "cancelled");
  return { venues, source: liveSource(venues), warning: partial ? PARTIAL_WARNING : undefined,
    discovery: { groups, partial } };
}

/** A transport error must not erase successful coverage acquired earlier in this
 * mounted session. It also must not invent coverage for the missing categories. */
export function failedDateNightAcquisition(acquisition: DateNightAcquisition): DateNightSearchResponse {
  return {
    venues: [], source: "fallback",
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
    sameSignature(entry, query) && entry.acquisition.radiusMiles >= query.radiusMiles;
  return {
    read(query: DateNightAcquisition): DateNightCacheSnapshot {
      prune(now());
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      // Fresh negative evidence protects an identity even when acquired through
      // a different category. It does not establish coverage for that category.
      const negativeEvidence = entries.filter((entry) => sameSignature(entry, query))
        .flatMap((entry) => entry.venues.filter((place) => Boolean(place.lifecycle)));
      const selected = new Map<ConcreteDateNightType, { entry: CacheEntry; group: DateNightGroupCoverage }>();
      for (const entry of [...entries].sort((a, b) => b.acquiredAt - a.acquiredAt || b.used - a.used)) {
        if (!compatible(entry, query)) continue;
        for (const group of entry.groups) {
          for (const type of group.activityTypes) {
            if (requested.includes(type) && !selected.has(type)) selected.set(type, { entry, group });
          }
        }
      }
      const missingActivityTypes = requested.filter((type) => !selected.has(type));
      if (!selected.size) return { response: null, missingActivityTypes, negativeEvidence };
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
      const venues = canonicalMerge([...usedEntries.flatMap((entry) => {
        const covered = requested.filter((type) => selected.get(type)?.entry === entry);
        // Reusing an old superset for Movies must not resurrect an old Corn Maze
        // snapshot after a newer Corn Maze query returned valid-empty. Retain
        // full provenance/classification on every included identity.
        return entry.venues.filter((place) => place.activityTypes.some((type) => covered.includes(type)));
      }), ...negativeEvidence]);
      return { missingActivityTypes, negativeEvidence, response: { venues, source: liveSource(venues), discovery: { groups, partial: false } } };
    },
    store(query: DateNightAcquisition, response: DateNightSearchResponse): boolean {
      const at = now();
      prune(at);
      // Missing metadata, complete fallback and prior cache assemblies cannot
      // become proof that a provider acquired a category.
      if (response.source === "fallback" || !response.discovery || response.venues.length > maxVenues) return false;
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      const groups = response.discovery.groups.filter(succeeded).map((group) => ({
        ...group, activityTypes: group.activityTypes.filter((type) => requested.includes(type)),
      })).filter((group) => group.activityTypes.length > 0);
      if (!groups.length) return false;
      entries.push({ acquisition: { ...query, activityTypes: [...query.activityTypes] },
        venues: response.venues, groups, acquiredAt: at, used: ++sequence });
      while (entries.length > maxEntries || entries.reduce((sum, entry) => sum + entry.venues.length, 0) > maxVenues) {
        const oldest = entries.reduce((a, b) => a.used < b.used ? a : b);
        entries.splice(entries.indexOf(oldest), 1);
      }
      return true;
    },
  };
}
