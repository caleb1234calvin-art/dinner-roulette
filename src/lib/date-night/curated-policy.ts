import { MISSOURI_2026_DEFERRED_BATCH_3_CATALOG } from "./missouri-2026-deferred-batch-3-catalog";
import { MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG } from "./missouri-2026-v1-next-catalog";
import { MISSOURI_2026_CLEARED_SEASONAL_CATALOG } from "./missouri-2026-cleared-catalog";
import { MISSOURI_2026_V1_SEASONAL_CATALOG } from "./missouri-2026-v1-catalog";
import type { DateNightPlace } from "./types";

const reviewed = new Map([...MISSOURI_2026_CLEARED_SEASONAL_CATALOG,
  ...MISSOURI_2026_V1_SEASONAL_CATALOG, ...MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG,
  ...MISSOURI_2026_DEFERRED_BATCH_3_CATALOG].map(place => [place.id, place]));

export function getCuratedSeasonalPlace(id: string): DateNightPlace | undefined {
  return reviewed.get(id);
}

/** Cached/saved IDs never restore superseded coordinates or lose current policy.
 * Preserve negative provider lifecycle evidence; never resurrect a closed venue. */
export function applyCuratedSeasonalPolicy(place: DateNightPlace): DateNightPlace {
  const current = reviewed.get(place.id);
  if (!current) return place;
  return { ...place, ...current, lifecycle: place.lifecycle ?? current.lifecycle,
    discoveryEvidence: place.discoveryEvidence ?? current.discoveryEvidence };
}
