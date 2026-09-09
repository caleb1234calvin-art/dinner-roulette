import { createServerFn } from "@tanstack/react-start";
import { isLikelyChain } from "@/lib/restaurants/chains";
import { haversineMiles } from "@/lib/restaurants/geo";
import { namesMatch } from "@/lib/utils";
import type { PhotoKey } from "@/lib/restaurants/types";
import { JASPER_COUNTY_DATE_NIGHT_CATALOG } from "./jasper-county-catalog";
import { JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG } from "./seasonal-catalog";
import { isHalloweenDateNightActive } from "./season";
import {
  dateNightTypeLabel,
  type ConcreteDateNightType,
  type DateNightPlace,
  type DateNightSearchResponse,
} from "./types";

const MIRRORS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

const QUERY = (lat: number, lon: number, radiusMeters: number, halloweenSeason: boolean) => `
[out:json][timeout:20];
(
  nwr["leisure"="bowling_alley"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["leisure"="amusement_arcade"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="cinema"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["leisure"="miniature_golf"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["leisure"="escape_game"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["tourism"="museum"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["leisure"="ice_rink"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["sport"="roller_skating"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["leisure"="park"](around:${Math.round(radiusMeters)},${lat},${lon});
  ${halloweenSeason ? `nwr["leisure"="maze"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["attraction"="maze"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["attraction"="haunted_house"](around:${Math.round(radiusMeters)},${lat},${lon});\n  nwr["attraction"="pumpkin_patch"](around:${Math.round(radiusMeters)},${lat},${lon});` : ""}
);
out center tags;
`;

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const RETIRED_DATE_NIGHT_NAMES = ["powers museum"] as const;

const DATE_NIGHT_ALIAS_GROUPS = [
  [
    "precious moments chapel",
    "precious moments chapel and gardens",
    "precious moments chapel & gardens",
    "samuel j butcher museum",
    "samuel j. butcher museum",
  ],
] as const;

function isRetiredDateNightName(name: string): boolean {
  return RETIRED_DATE_NIGHT_NAMES.some((retired) => namesMatch(retired, name));
}

function dateNightNamesMatch(a: string, b: string): boolean {
  if (namesMatch(a, b)) return true;
  return DATE_NIGHT_ALIAS_GROUPS.some(
    (group) =>
      group.some((candidate) => namesMatch(candidate, a)) &&
      group.some((candidate) => namesMatch(candidate, b)),
  );
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

  if (halloweenSeason) {
    if (tags.attraction === "haunted_house") types.add("haunted-house");
    if (tags.leisure === "maze" || tags.attraction === "maze") types.add("corn-maze");
    if (tags.attraction === "pumpkin_patch") types.add("pumpkin-patch");

    const name = `${tags.name ?? ""} ${tags.description ?? ""}`.toLowerCase();
    if (name.includes("haunted") || name.includes("haunt")) types.add("haunted-house");
    if (name.includes("corn maze") || name.includes("maize")) types.add("corn-maze");
    if (name.includes("pumpkin patch") || name.includes("pumpkin farm")) types.add("pumpkin-patch");
  }

  return [...types];
}

function moodFor(types: readonly ConcreteDateNightType[]): 1 | 2 | 3 {
  if (types.includes("haunted-house")) return 3;
  if (types.includes("corn-maze") || types.includes("pumpkin-patch")) return 2;
  if (types.includes("movies") || types.includes("museum") || types.includes("park")) return 1;
  if (types.includes("bowling") || types.includes("arcade") || types.includes("mini-golf")) return 2;
  return 3;
}

function elementToPlace(element: OverpassElement, halloweenSeason: boolean): DateNightPlace | null {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  if (!name || /closed/i.test(name) || isRetiredDateNightName(name)) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat == null || lon == null) return null;
  const house = tags["addr:housenumber"] ?? "";
  const street = tags["addr:street"] ?? "";
  const city = tags["addr:city"] ?? "";
  const address = [`${house} ${street}`.trim(), city].filter(Boolean).join(", ") || "Address unavailable";
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
    moodLevel: moodFor(activityTypes),
  };
}

function combineTypes(a: readonly ConcreteDateNightType[], b: readonly ConcreteDateNightType[]) {
  return [...new Set([...a, ...b])];
}

function dedupeDateNight(places: DateNightPlace[]): DateNightPlace[] {
  const result: DateNightPlace[] = [];
  for (const place of places) {
    const matchIndex = result.findIndex((candidate) => {
      const distance = haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon);
      const sameName = namesMatch(candidate.name, place.name);
      const sharedType = candidate.activityTypes.some((type) => place.activityTypes.includes(type));
      return (sameName && distance < 0.6) || (distance < 0.03 && sharedType);
    });

    if (matchIndex < 0) {
      result.push(place);
      continue;
    }

    const existing = result[matchIndex]!;
    const activityTypes = combineTypes(existing.activityTypes, place.activityTypes);
    result[matchIndex] = {
      ...place,
      ...existing,
      activityTypes,
      cuisineLabel: dateNightTypeLabel(activityTypes),
      openingHours: existing.openingHours ?? place.openingHours,
      phone: existing.phone ?? place.phone,
      website: existing.website ?? place.website,
      address: existing.address !== "Address unavailable" ? existing.address : place.address,
      moodLevel: moodFor(activityTypes),
      source: existing.source === "catalog" || place.source === "catalog" ? "merged" : existing.source,
    };
  }
  return result;
}

async function queryMirror(url: string, body: string, halloweenSeason: boolean): Promise<DateNightPlace[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json",
      "User-Agent": "DinnerRoulette/3 (date night discovery)",
    },
    body,
    signal: AbortSignal.timeout(22000),
  });
  if (!response.ok) throw new Error(`Overpass ${response.status}`);
  const json = (await response.json()) as { elements?: OverpassElement[] };
  const unique = new Map<string, DateNightPlace>();
  for (const element of json.elements ?? []) {
    const place = elementToPlace(element, halloweenSeason);
    if (!place) continue;
    const key = `${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lon.toFixed(4)}`;
    unique.set(key, place);
  }
  return dedupeDateNight([...unique.values()]);
}

function localWithin(lat: number, lon: number, radiusMiles: number, halloweenActive: boolean): DateNightPlace[] {
  const catalog = halloweenActive
    ? [...JASPER_COUNTY_DATE_NIGHT_CATALOG, ...JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG]
    : JASPER_COUNTY_DATE_NIGHT_CATALOG;
  return catalog.filter((place) => haversineMiles(lat, lon, place.lat, place.lon) <= radiusMiles + 1);
}

function mergeDateNight(live: DateNightPlace[], local: DateNightPlace[]): DateNightPlace[] {
  const merged = [...local];
  for (const place of live) {
    const matchIndex = merged.findIndex(
      (candidate) =>
        dateNightNamesMatch(candidate.name, place.name) &&
        haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon) < 0.35,
    );
    if (matchIndex >= 0) {
      const curated = merged[matchIndex]!;
      const activityTypes = combineTypes(curated.activityTypes, place.activityTypes);
      merged[matchIndex] = {
        ...place,
        id: curated.id,
        name: curated.name,
        lat: curated.lat,
        lon: curated.lon,
        address: curated.address || place.address,
        openingHours: curated.openingHours || place.openingHours,
        phone: curated.phone ?? place.phone,
        website: curated.website ?? place.website,
        activityTypes,
        moodLevel: moodFor(activityTypes),
        cuisineLabel: dateNightTypeLabel(activityTypes),
        source: "merged",
      };
      continue;
    }
    merged.push(place);
  }
  return dedupeDateNight(merged);
}

export const searchDateNight = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number; radiusMiles: number; spookySeasonEnabled?: boolean }) => {
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lon)) throw new Error("A location is required");
    return {
      lat: data.lat,
      lon: data.lon,
      radiusMiles: Math.min(Math.max(data.radiusMiles || 15, 1), 50),
      spookySeasonEnabled: Boolean(data.spookySeasonEnabled),
    };
  })
  .handler(async ({ data }): Promise<DateNightSearchResponse> => {
    const fetchRadius = Math.max(data.radiusMiles, 15);
    const radiusMeters = Math.min(fetchRadius * 1609.34, 80467);
    const halloweenSeason = isHalloweenDateNightActive(data.spookySeasonEnabled);
    const body = `data=${encodeURIComponent(QUERY(data.lat, data.lon, radiusMeters, halloweenSeason))}`;
    const local = localWithin(data.lat, data.lon, fetchRadius, halloweenSeason);
    let lastError: unknown;

    for (const mirror of MIRRORS) {
      try {
        const live = await queryMirror(mirror, body, halloweenSeason);
        const venues = mergeDateNight(live, local);
        if (venues.length > 0) {
          return {
            venues,
            source: local.length ? "merged" : "live",
          };
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (local.length > 0) {
      return {
        venues: dedupeDateNight(local),
        source: "fallback",
        warning: "Using saved Jasper County Date Night places while the live map is unavailable.",
      };
    }

    throw lastError instanceof Error ? lastError : new Error("Could not load date-night activities for that area.");
  });
