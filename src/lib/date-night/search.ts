import { createServerFn } from "@tanstack/react-start";
import { isLikelyChain } from "@/lib/restaurants/chains";
import { haversineMiles } from "@/lib/restaurants/geo";
import { namesMatch } from "@/lib/utils";
import type { PhotoKey } from "@/lib/restaurants/types";
import { JASPER_COUNTY_DATE_NIGHT_CATALOG } from "./jasper-county-catalog";
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

const QUERY = (lat: number, lon: number, radiusMeters: number) => `
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

function classify(tags: Record<string, string>): ConcreteDateNightType[] {
  const types = new Set<ConcreteDateNightType>();
  if (tags.leisure === "bowling_alley") types.add("bowling");
  if (tags.leisure === "amusement_arcade") types.add("arcade");
  if (tags.amenity === "cinema") types.add("movies");
  if (tags.leisure === "miniature_golf") types.add("mini-golf");
  if (tags.leisure === "escape_game") types.add("escape-room");
  if (tags.tourism === "museum") types.add("museum");
  if (tags.leisure === "ice_rink" || tags.sport === "roller_skating") types.add("skating");
  if (tags.leisure === "park") types.add("park");
  if (types.size === 0) return [];
  return [...types];
}

function moodFor(types: readonly ConcreteDateNightType[]): 1 | 2 | 3 {
  if (types.includes("movies") || types.includes("museum") || types.includes("park")) return 1;
  if (types.includes("bowling") || types.includes("arcade") || types.includes("mini-golf")) return 2;
  return 3;
}

function elementToPlace(element: OverpassElement): DateNightPlace | null {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  if (!name || /closed/i.test(name)) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat == null || lon == null) return null;
  const house = tags["addr:housenumber"] ?? "";
  const street = tags["addr:street"] ?? "";
  const city = tags["addr:city"] ?? "";
  const address = [`${house} ${street}`.trim(), city].filter(Boolean).join(", ") || "Address unavailable";
  const activityTypes = classify(tags);
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

async function queryMirror(url: string, body: string): Promise<DateNightPlace[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json",
      "User-Agent": "DinnerRoulette/2.1 (date night discovery)",
    },
    body,
    signal: AbortSignal.timeout(22000),
  });
  if (!response.ok) throw new Error(`Overpass ${response.status}`);
  const json = (await response.json()) as { elements?: OverpassElement[] };
  const unique = new Map<string, DateNightPlace>();
  for (const element of json.elements ?? []) {
    const place = elementToPlace(element);
    if (!place) continue;
    const key = `${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lon.toFixed(4)}`;
    unique.set(key, place);
  }
  return [...unique.values()];
}

function localWithin(lat: number, lon: number, radiusMiles: number): DateNightPlace[] {
  return JASPER_COUNTY_DATE_NIGHT_CATALOG.filter(
    (place) => haversineMiles(lat, lon, place.lat, place.lon) <= radiusMiles + 1,
  );
}

function mergeDateNight(live: DateNightPlace[], local: DateNightPlace[]): DateNightPlace[] {
  const merged = [...local];
  for (const place of live) {
    const matchIndex = merged.findIndex(
      (candidate) =>
        namesMatch(candidate.name, place.name) &&
        haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon) < 0.35,
    );
    if (matchIndex >= 0) {
      const curated = merged[matchIndex]!;
      merged[matchIndex] = {
        ...place,
        id: curated.id,
        name: curated.name,
        address: curated.address || place.address,
        openingHours: curated.openingHours || place.openingHours,
        phone: curated.phone ?? place.phone,
        website: curated.website ?? place.website,
        activityTypes: curated.activityTypes,
        moodLevel: curated.moodLevel,
        cuisineLabel: curated.cuisineLabel,
        source: "merged",
      };
      continue;
    }
    merged.push(place);
  }
  return merged;
}

export const searchDateNight = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number; radiusMiles: number }) => {
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lon)) throw new Error("A location is required");
    return {
      lat: data.lat,
      lon: data.lon,
      radiusMiles: Math.min(Math.max(data.radiusMiles || 15, 1), 30),
    };
  })
  .handler(async ({ data }): Promise<DateNightSearchResponse> => {
    const fetchRadius = Math.max(data.radiusMiles, 15);
    const radiusMeters = Math.min(fetchRadius * 1609.34, 48280);
    const body = `data=${encodeURIComponent(QUERY(data.lat, data.lon, radiusMeters))}`;
    const local = localWithin(data.lat, data.lon, fetchRadius);
    let lastError: unknown;

    for (const mirror of MIRRORS) {
      try {
        const live = await queryMirror(mirror, body);
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
        venues: local,
        source: "fallback",
        warning: "Using saved Jasper County Date Night places while the live map is unavailable.",
      };
    }

    throw lastError instanceof Error ? lastError : new Error("Could not load date-night activities for that area.");
  });
