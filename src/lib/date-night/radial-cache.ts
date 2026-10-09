import { hasReviewedSeasonalPlacement } from "./listing";
import { createDateNightDiscoveryCache, type DateNightAcquisition } from "./cache";
import { mergeDateNight } from "./identity";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_VERSION, planDateNightPatches, summarizeDateNightCoverage,
  type DateNightPatchCoverageRecord } from "./radial-plan";
import { haversineMiles } from "../restaurants/geo";
import type { DateNightPlace, DateNightSearchResponse } from "./types";

export const DATE_NIGHT_RADIAL_MAX_CACHE_ENTRIES = 128;
export function createDateNightRadialCache(options: Parameters<typeof createDateNightDiscoveryCache>[0] = {},
  cache = createDateNightDiscoveryCache({ maxEntries: DATE_NIGHT_RADIAL_MAX_CACHE_ENTRIES, ...options })) {
  const versioned = (query: DateNightAcquisition) => ({ ...query,
    semanticVersion: query.semanticVersion ?? DATE_NIGHT_RADIAL_VERSION });
  return {
    store(query: DateNightAcquisition, response: DateNightSearchResponse) {
      if (!query.patchId) return false;
      return cache.store(versioned(query), response);
    },
    read(query: DateNightAcquisition, attempts: DateNightPatchCoverageRecord[] = []) {
      const plan = planDateNightPatches(query, query.radiusMiles);
      const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
      const snapshots = plan.map(patch => ({ patch, snapshot: cache.read(versioned({ ...query, patchId: patch.id })) }));
      const records = snapshots.map(({ patch, snapshot }) => ({
        ...attempts.find(a => a.id === patch.id), id: patch.id,
        completeActivityTypes: requested.filter(t => !snapshot.missingActivityTypes.includes(t)),
        acquiredAt: snapshot.acquiredAt,
      }));
      const coverage = summarizeDateNightCoverage(plan, query.radiusMiles, requested, records);
      const successful = snapshots.flatMap(({ snapshot }) => snapshot.response ? [snapshot.response] : []);
      const negativeEvidence = snapshots[0]?.snapshot.negativeEvidence ?? [];
      const allVenues = mergeDateNight([...successful.flatMap(r => r.venues), ...negativeEvidence]
        .sort((a, b) => a.id.localeCompare(b.id) || JSON.stringify(a).localeCompare(JSON.stringify(b))), []);
      const venues = clipDateNightRadius(allVenues, query);
      const source = venues.some(p => p.source !== "osm" || p.discoveryEvidence?.some(e => e.source === "catalog")) ? "merged" : "live";
      const response: DateNightSearchResponse | null = successful.length ? {
        venues, source, discovery: { groups: successful.flatMap(r => r.discovery?.groups ?? []), partial: coverage.failedPatchIds.length > 0 },
      } : null;
      return { coverage, response, negativeEvidence };
    },
  };
}

/** Geographic eligibility never expands by the query-circle safety margin. */
export function clipDateNightRadius(venues: DateNightPlace[], query: Pick<DateNightAcquisition, "lat" | "lon" | "radiusMiles">) {
  return venues.filter(p => (!p.seasonalListing || hasReviewedSeasonalPlacement(p.seasonalListing)) &&
    haversineMiles(query.lat, query.lon, p.lat, p.lon) <= query.radiusMiles + 1e-8);
}
