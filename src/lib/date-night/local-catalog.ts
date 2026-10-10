import { MISSOURI_2026_ASTRA_DELTA_CATALOG } from "./missouri-2026-astra-delta-catalog";
import { MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG } from "./missouri-2026-astra-commercial-catalog";
import { MISSOURI_2026_ASTRA_ELEVEN_CATALOG } from "./missouri-2026-astra-eleven-catalog";
import { MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG } from "./missouri-2026-three-source-tier-a-catalog";
import { MISSOURI_2026_LATE_FALL_CATALOG } from "./missouri-2026-late-fall-catalog";
import { MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG } from "./missouri-2026-v1-next-catalog";
import { MISSOURI_2026_DEFERRED_BATCH_3_CATALOG } from "./missouri-2026-deferred-batch-3-catalog";
import { MISSOURI_2026_FINAL_FOUR_CATALOG } from "./missouri-2026-final-four-catalog";
import { JASPER_COUNTY_DATE_NIGHT_CATALOG } from "./jasper-county-catalog";
import { JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG } from "./seasonal-catalog";
import { MISSOURI_2026_V1_SEASONAL_CATALOG } from "./missouri-2026-v1-catalog";
import { MISSOURI_2026_CLEARED_SEASONAL_CATALOG } from "./missouri-2026-cleared-catalog";
import { haversineMiles } from "../restaurants/geo";
import type { DateNightPlace } from "./types";

export function localDateNightCatalog(lat: number, lon: number, radiusMiles: number, halloweenActive: boolean): DateNightPlace[] {
  const catalog = halloweenActive
    ? [...JASPER_COUNTY_DATE_NIGHT_CATALOG, ...JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG, ...MISSOURI_2026_CLEARED_SEASONAL_CATALOG, ...MISSOURI_2026_V1_SEASONAL_CATALOG, ...MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG, ...MISSOURI_2026_DEFERRED_BATCH_3_CATALOG, ...MISSOURI_2026_FINAL_FOUR_CATALOG, ...MISSOURI_2026_LATE_FALL_CATALOG, ...MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG, ...MISSOURI_2026_ASTRA_ELEVEN_CATALOG, ...MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG, ...MISSOURI_2026_ASTRA_DELTA_CATALOG]
    : [...JASPER_COUNTY_DATE_NIGHT_CATALOG, ...MISSOURI_2026_LATE_FALL_CATALOG, ...MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG.filter((place) => place.seasonalListing?.visibility === "listing-lifecycle"), ...MISSOURI_2026_ASTRA_ELEVEN_CATALOG.filter((place) => place.seasonalListing?.visibility === "listing-lifecycle")];
  return catalog.filter((place) => haversineMiles(lat, lon, place.lat, place.lon) <= radiusMiles + 1);
}
