import { ProviderResponseError } from "../discovery/provider-chain";
import { createDateNightProvider } from "../discovery/hedged-provider";
import { DEFAULT_LOCATION } from "../restaurants/types";
import { formatOsmAddress, requireCoordinates } from "../location/model";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { isLikelyChain } from "@/lib/restaurants/chains";
import { haversineMiles } from "@/lib/restaurants/geo";
import { namesMatch } from "@/lib/utils";
import type { PhotoKey } from "@/lib/restaurants/types";
import { JASPER_COUNTY_DATE_NIGHT_CATALOG } from "./jasper-county-catalog";
import { JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG } from "./seasonal-catalog";
import { MISSOURI_2026_V1_SEASONAL_CATALOG } from "./missouri-2026-v1-catalog";
import { MISSOURI_2026_CLEARED_SEASONAL_CATALOG } from "./missouri-2026-cleared-catalog";
import { seasonalTypes, providerLifecycle } from "./provider-evidence";
import { normalizeLifecycleTags } from "./lifecycle";
import { isHalloweenDateNightActive } from "./season";
import { dedupeDateNight, mergeDateNight, mergeIdentity, moodFor } from "./identity";
import { buildDateNightQuery, buildDateNightQueryPlan, validateDateNightActivityTypes } from "./query-plan";
import { dateNightPatchOwns, resolveDateNightPatch } from "./radial-plan";
import {
  dateNightTypeLabel,
  type ConcreteDateNightType,
  type DateNightPlace,
  type DateNightSearchResponse,
  type DateNightGroupCoverage,
} from "./types";

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const RETIRED_DATE_NIGHT_NAMES = ["powers museum"] as const;

function isRetiredDateNightName(name: string): boolean {
  return RETIRED_DATE_NIGHT_NAMES.some((retired) => namesMatch(retired, name));
}

function classify(tags: Record<string, string>, halloweenSeason: boolean): ConcreteDateNightType[] {
  const types = new Set<ConcreteDateNightType>();
  if (tags.leisure === "bowling_alley") types.add("bowling");
  if (tags.leisure === "amusement_arcade") types.add("arcade");
  if (tags.amenity === "cinema") types.add("movies");
  if (tags.leisure === "miniature_golf") types.add("mini-golf");
  if (tags.leisure === "escape_game") types.add("escape-room");
  if (tags.tourism === "museum") types.add("museum");
  if (tags.leisure === "ice_rink" || tags.sport === "roller_skating") types.add("skating");
  if (tags.leisure === "park") types.add("park");

  if (halloweenSeason) seasonalTypes(tags).forEach((type) => types.add(type));

  return [...types];
}

function elementToPlace(element: OverpassElement, halloweenSeason: boolean): DateNightPlace | null {
  const rawTags = element.tags ?? {};
  const lifecycle = providerLifecycle(rawTags);
  // Retain lifecycle-only records so a duplicate cannot resurrect a closed venue.
  const tags = normalizeLifecycleTags(rawTags);
  const name = tags.name?.trim();
  if (!name || /closed/i.test(name)) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat == null || lon == null) return null;
  if (haversineMiles(lat, lon, DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon) <= 40 && isRetiredDateNightName(name)) return null;
  const address = formatOsmAddress(tags) || "Address unavailable";
  const activityTypes = classify(tags, halloweenSeason);
  if (!activityTypes.length) return null;
  const brand = tags.brand ?? null;
  const isChain = isLikelyChain(name, brand);

  return {
    id: `date-night-osm-${element.type}-${element.id}`,
    name,
    lat,
    lon,
    address,
    cuisines: ["other"],
    cuisineLabel: dateNightTypeLabel(activityTypes),
    priceLevel: null,
    rating: null,
    reviewCount: null,
    openingHours: tags.opening_hours ?? null,
    phone: tags.phone ?? tags["contact:phone"] ?? null,
    website: tags.website ?? tags["contact:website"] ?? null,
    isChain,
    photoKey: "cafe" as PhotoKey,
    source: "osm",
    activityTypes,
    lifecycle,
    discoveryEvidence: [{
      id: `date-night-osm-${element.type}-${element.id}`,
      source: "osm",
      activityTypes,
      openingHours: tags.opening_hours ?? null,
      website: tags.website ?? tags["contact:website"] ?? null,
      lifecycle,
    }],
    moodLevel: moodFor(activityTypes),
  };
}

async function queryMirror(url: string, body: string, halloweenSeason: boolean, signal: AbortSignal): Promise<DateNightPlace[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json",
      "User-Agent": "DinnerRoulette/3 (date night discovery)",
    },
    body,
    signal,
  });
  if (!response.ok) throw new ProviderResponseError(`Overpass ${response.status}`, "http-error", response.status);
  const json = (await response.json()) as { elements?: OverpassElement[]; remark?: string };
  if (!Array.isArray(json?.elements) || json.remark) throw new ProviderResponseError("Live discovery returned an incomplete response. Please try again.", "malformed");
  const unique = new Map<string, DateNightPlace>();
  for (const element of json.elements.slice().sort((a, b) => `${a.type}-${a.id}`.localeCompare(`${b.type}-${b.id}`))) {
    const place = elementToPlace(element, halloweenSeason);
    if (!place) continue;
    const key = `${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lon.toFixed(4)}`;
    const existing = unique.get(key);
    unique.set(key, existing ? mergeIdentity(existing, place) : place);
  }
  return dedupeDateNight([...unique.values()].sort((a, b) => a.id.localeCompare(b.id)));
}

function localWithin(lat: number, lon: number, radiusMiles: number, halloweenActive: boolean): DateNightPlace[] {
  const catalog = halloweenActive
    ? [...JASPER_COUNTY_DATE_NIGHT_CATALOG, ...JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG, ...MISSOURI_2026_CLEARED_SEASONAL_CATALOG, ...MISSOURI_2026_V1_SEASONAL_CATALOG]
    : JASPER_COUNTY_DATE_NIGHT_CATALOG;
  return catalog.filter((place) => haversineMiles(lat, lon, place.lat, place.lon) <= radiusMiles + 1);
}

export const searchDateNight = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number; radiusMiles: number; spookySeasonEnabled?: boolean; activityTypes?: unknown; patchId?: unknown }) => {
    requireCoordinates(data);
    if (data.radiusMiles !== undefined && (typeof data.radiusMiles !== "number" || !Number.isFinite(data.radiusMiles))) throw new Error("A valid discovery radius is required");
    const patch = data.patchId === undefined ? undefined : resolveDateNightPatch(data, data.radiusMiles, data.patchId);
    if (patch && Object.keys(data).some(key => !["lat", "lon", "radiusMiles", "spookySeasonEnabled", "activityTypes", "patchId"].includes(key))) {
      throw new Error("Date Night patch geometry is server-owned");
    }
    return {
      lat: data.lat,
      lon: data.lon,
      radiusMiles: Math.min(Math.max(data.radiusMiles || 15, 1), 50),
      spookySeasonEnabled: Boolean(data.spookySeasonEnabled),
      activityTypes: validateDateNightActivityTypes(data.activityTypes),
      patch,
    };
  })
  .handler(async ({ data }): Promise<DateNightSearchResponse> => {
    const fetchRadius = Math.max(data.radiusMiles, 15);
    const radiusMeters = data.patch?.radiusMeters ?? Math.min(fetchRadius * 1609.34, 80467);
    const center = data.patch?.center ?? data;
    const halloweenSeason = isHalloweenDateNightActive(data.spookySeasonEnabled);
    const plan = buildDateNightQueryPlan(data.activityTypes, halloweenSeason);
    const owned = (place: DateNightPlace) => !data.patch || dateNightPatchOwns(data, data.patch, place);
    const local = localWithin(data.lat, data.lon, fetchRadius, halloweenSeason).filter(owned);
    const chain = createDateNightProvider(data.patch ? getRequest().signal : undefined);
    const outcomes = await Promise.allSettled(plan.map(async (group) => {
      const providerTypes = group.activityTypes.filter((type) => type !== "other-halloween-fall");
      if (!providerTypes.length) return []; // Curated-only category; never query generic parks/events.
      const body = `data=${encodeURIComponent(buildDateNightQuery({ activityTypes: providerTypes }, center.lat, center.lon, radiusMeters))}`;
      return chain.run(group.id, (mirror, signal) => queryMirror(mirror, body, halloweenSeason, signal));
    }));
    const groups: DateNightGroupCoverage[] = plan.map((group, index) => {
      const result = outcomes[index]!;
      return { ...group, outcome: result.status === "fulfilled"
        ? result.value.length ? "succeeded-nonempty" : "succeeded-empty"
        : "failed" };
    });
    const successes = outcomes.filter((result): result is PromiseFulfilledResult<DateNightPlace[]> => result.status === "fulfilled");
    const failedTypes = groups.filter((group) => group.outcome === "failed").flatMap((group) => group.activityTypes);
    const discovery = { groups, partial: successes.length > 0 && failedTypes.length > 0 };
    const patch = data.patch ? { id: data.patch.id, version: data.patch.version } : undefined;
    if (successes.length > 0) {
      // Keep negative companions across overlapping acquisition circles; positive
      // rows belong to one logical sector. Lifecycle evidence is never coverage.
      const live = successes.flatMap((result) => result.value).filter(place => place.lifecycle || owned(place));
      const venues = mergeDateNight(live, local);
      const source = local.length ? "merged" : "live";
      chain.finish(source);
      return { venues, source, discovery, ...(patch ? { patch } : {}),
        ...(discovery.partial ? { warning: `Some live activity searches are unavailable: ${failedTypes.map((type) => dateNightTypeLabel([type])).join(", ")}. Available live results and saved places are included; coverage may be incomplete.` } : {}),
      };
    }
    const lastError = outcomes.slice().reverse().find((result) => result.status === "rejected");

    if (local.length > 0) {
      chain.finish("fallback");
      return {
        venues: dedupeDateNight(local),
        source: "fallback",
        discovery,
        ...(patch ? { patch } : {}),
        warning: "Using saved Date Night places while the live map is unavailable.",
      };
    }

    chain.finish("error");
    throw lastError?.status === "rejected" && lastError.reason instanceof Error ? lastError.reason : new Error("Could not load date-night activities for that area.");
  });
