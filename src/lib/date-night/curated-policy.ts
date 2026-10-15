import { WAVE2_2026_CATALOG } from "./halloween-2026-wave2-catalog";
import { REGIONAL_2026_WAVE1_CATALOG } from "./regional-2026-wave1-catalog";
import { MISSOURI_2026_THREE_CLEARED_CATALOG } from "./missouri-2026-three-cleared-catalog";
import { normalizeName } from "../utils";
import { haversineMiles } from "../restaurants/geo";
import { MISSOURI_2026_OWNER_EVIDENCE_CATALOG } from "./missouri-2026-owner-evidence-catalog";
import { MISSOURI_2026_RANKED_HOLDS_CATALOG } from "./missouri-2026-ranked-holds-catalog";
import { MISSOURI_2026_HOLD_CLEANUP_CATALOG } from "./missouri-2026-hold-cleanup-catalog";
import { MISSOURI_2026_NEXT_CATALOG } from "./missouri-2026-next-catalog";
import { MISSOURI_2026_PHASE4_RECOVERY_CATALOG } from "./missouri-2026-phase4-recovery-catalog";
import { MISSOURI_2026_ASTRA_DELTA_CATALOG } from "./missouri-2026-astra-delta-catalog";
import { MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG } from "./missouri-2026-astra-commercial-catalog";
import { MISSOURI_2026_ASTRA_ELEVEN_CATALOG } from "./missouri-2026-astra-eleven-catalog";
import { MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG } from "./missouri-2026-three-source-tier-a-catalog";
import { MISSOURI_2026_LATE_FALL_CATALOG } from "./missouri-2026-late-fall-catalog";
import { MISSOURI_2026_FINAL_FOUR_CATALOG } from "./missouri-2026-final-four-catalog";
import { MISSOURI_2026_DEFERRED_BATCH_3_CATALOG } from "./missouri-2026-deferred-batch-3-catalog";
import { MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG } from "./missouri-2026-v1-next-catalog";
import { MISSOURI_2026_CLEARED_SEASONAL_CATALOG } from "./missouri-2026-cleared-catalog";
import { MISSOURI_2026_V1_SEASONAL_CATALOG } from "./missouri-2026-v1-catalog";
import type { DateNightPlace } from "./types";

const reviewed = new Map([...WAVE2_2026_CATALOG, ...REGIONAL_2026_WAVE1_CATALOG, ...MISSOURI_2026_THREE_CLEARED_CATALOG, ...MISSOURI_2026_OWNER_EVIDENCE_CATALOG, ...MISSOURI_2026_RANKED_HOLDS_CATALOG, ...MISSOURI_2026_HOLD_CLEANUP_CATALOG, ...MISSOURI_2026_NEXT_CATALOG, ...MISSOURI_2026_PHASE4_RECOVERY_CATALOG, ...MISSOURI_2026_CLEARED_SEASONAL_CATALOG,
  ...MISSOURI_2026_V1_SEASONAL_CATALOG, ...MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG,
  ...MISSOURI_2026_DEFERRED_BATCH_3_CATALOG, ...MISSOURI_2026_FINAL_FOUR_CATALOG,
  ...MISSOURI_2026_LATE_FALL_CATALOG, ...MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG, ...MISSOURI_2026_ASTRA_ELEVEN_CATALOG, ...MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG, ...MISSOURI_2026_ASTRA_DELTA_CATALOG].map(place => [place.id, place]));

export function getCuratedSeasonalPlace(id: string): DateNightPlace | undefined {
  return reviewed.get(id);
}

/** Saved discovery is independent of live patch coverage. The caller must still
 * apply exact radius, category, lifecycle, date and Open Now eligibility. */
export function getCuratedSeasonalPlaces(halloweenActive: boolean): DateNightPlace[] {
  return [...reviewed.values()].filter(place => halloweenActive || place.seasonalListing?.visibility === "listing-lifecycle");
}

/** Cached/saved IDs never restore superseded coordinates or lose current policy.
 * Preserve negative provider lifecycle evidence; never resurrect a closed venue. */
export function applyCuratedSeasonalPolicy(place: DateNightPlace): DateNightPlace {
  let current = reviewed.get(place.id);
  if (!current && place.id.startsWith("date-night-osm-") &&
    normalizeName(place.name) === normalizeName("Six Flags St. Louis Fright Fest")) {
    const park = reviewed.get("date-night-mo26-mid-america-fright-fest");
    // Affirmed full event rebrand only. A different curated event, ordinary park
    // name, shared address or distant same-name provider creates no authority.
    if (park && (!place.seasonalListing || place.seasonalListing.recordId === park.seasonalListing?.recordId) &&
      Number.isFinite(place.lat) && Number.isFinite(place.lon) &&
      haversineMiles(place.lat, place.lon, park.lat, park.lon) < 0.6) {
      current = park;
      const evidence = place.discoveryEvidence ?? [{
        id: place.id, source: "osm" as const, activityTypes: place.activityTypes,
        openingHours: place.openingHours, website: place.website, lifecycle: place.lifecycle,
      }];
      place = { ...place,
        lifecycle: place.lifecycle === "permanently-closed" || evidence.some(item => item.lifecycle === "permanently-closed") ? "permanently-closed"
          : place.lifecycle === "disused" || evidence.some(item => item.lifecycle === "disused") ? "disused" : place.lifecycle,
        discoveryEvidence: [...evidence, { id: park.id, source: "catalog",
          activityTypes: park.activityTypes, openingHours: park.openingHours,
          website: park.website, lifecycle: park.lifecycle }],
      };
    }
  }
  if (!current) return place;
  return { ...place, ...current, lifecycle: place.lifecycle ?? current.lifecycle,
    discoveryEvidence: place.discoveryEvidence ?? current.discoveryEvidence };
}
