import { createProviderChain, ProviderResponseError } from "../discovery/provider-chain";
import { DEFAULT_LOCATION } from "../restaurants/types";
import { formatOsmAddress, requireCoordinates } from "../location/model";
import { createServerFn } from "@tanstack/react-start";
import { isLikelyChain } from "@/lib/restaurants/chains";
import { haversineMiles } from "@/lib/restaurants/geo";
import { namesMatch } from "@/lib/utils";
import type { PhotoKey } from "@/lib/restaurants/types";
import { JASPER_COUNTY_DATE_NIGHT_CATALOG } from "./jasper-county-catalog";
import { JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG } from "./seasonal-catalog";
import { seasonalQueryClauses, seasonalTypes, providerLifecycle } from "./provider-evidence";
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
  ${halloweenSeason ? seasonalQueryClauses(`(around:${Math.round(radiusMeters)},${lat},${lon})`) : ""}
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

  if (halloweenSeason) seasonalTypes(tags).forEach((type) => types.add(type));

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
  const rawTags = element.tags ?? {};
  const lifecycle = providerLifecycle(rawTags);
  const tags = { ...rawTags };
  // Retain lifecycle-only records so a duplicate cannot resurrect a closed venue.
  for (const [key, value] of Object.entries(rawTags)) {
    const match = key.match(/^(disused|abandoned|was|demolished|removed|razed|destroyed):(leisure|tourism|attraction|amenity)$/);
    if (match && !tags[match[2]!]) tags[match[2]!] = value;
  }
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

function combineTypes(a: readonly ConcreteDateNightType[], b: readonly ConcreteDateNightType[]) {
  return [...new Set([...a, ...b])].sort();
}

function evidenceFor(place: DateNightPlace) {
  return place.discoveryEvidence ?? [{
    id: place.id, source: place.source === "osm" ? "osm" as const : "catalog" as const,
    activityTypes: place.activityTypes, openingHours: place.openingHours,
    website: place.website, lifecycle: place.lifecycle,
  }];
}

function mergeIdentity(a: DateNightPlace, b: DateNightPlace): DateNightPlace {
  // Catalog coordinates/identity take priority; otherwise stable provider ID wins.
  const rank = (place: DateNightPlace) => `${place.id.startsWith("date-night-osm-") ? "1" : "0"}:${place.id}`;
  const [first, second] = [a, b].sort((x, y) => rank(x).localeCompare(rank(y)));
  const activityTypes = combineTypes(a.activityTypes, b.activityTypes);
  const evidence = [...evidenceFor(a), ...evidenceFor(b)];
  const discoveryEvidence = [...new Map(evidence.map((item) => [JSON.stringify(item), item])).values()]
    .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
  const hours = [...new Set(discoveryEvidence.map((item) => item.openingHours).filter((value) => value && value !== "unknown"))];
  const curated = discoveryEvidence.find((item) => item.source === "catalog" && item.openingHours && item.openingHours !== "unknown");
  return {
    ...second!, ...first!, activityTypes, discoveryEvidence,
    lifecycle: a.lifecycle === "permanently-closed" || b.lifecycle === "permanently-closed"
      ? "permanently-closed" : a.lifecycle ?? b.lifecycle,
    openingHours: curated?.openingHours ?? (hours.length === 1 ? hours[0]! : null),
    phone: first!.phone ?? second!.phone,
    website: first!.website ?? second!.website,
    address: first!.address !== "Address unavailable" ? first!.address : second!.address,
    cuisineLabel: dateNightTypeLabel(activityTypes), moodLevel: moodFor(activityTypes),
    source: discoveryEvidence.some((item) => item.source === "catalog") && discoveryEvidence.some((item) => item.source === "osm")
      ? "merged" : first!.source,
  };
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

    result[matchIndex] = mergeIdentity(result[matchIndex]!, place);
  }
  return result;
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
      merged[matchIndex] = mergeIdentity(merged[matchIndex]!, place);
      continue;
    }
    merged.push(place);
  }
  return dedupeDateNight(merged);
}

export const searchDateNight = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number; radiusMiles: number; spookySeasonEnabled?: boolean }) => {
    requireCoordinates(data);
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
    const chain = createProviderChain("date-night");
    let lastError: unknown;
    try {
      const live = await chain.run(MIRRORS, (mirror, signal) => queryMirror(mirror, body, halloweenSeason, signal));
      const venues = mergeDateNight(live, local);
      const source = local.length ? "merged" : "live";
      chain.finish(source);
      return { venues, source };
    } catch (error) {
      lastError = error;
    }

    if (local.length > 0) {
      chain.finish("fallback");
      return {
        venues: dedupeDateNight(local),
        source: "fallback",
        warning: "Using saved Jasper County Date Night places while the live map is unavailable.",
      };
    }

    chain.finish("error");
    throw lastError instanceof Error ? lastError : new Error("Could not load date-night activities for that area.");
  });
