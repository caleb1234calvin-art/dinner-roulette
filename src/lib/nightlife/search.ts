import { createServerFn } from "@tanstack/react-start";
import { namesMatch } from "@/lib/utils";
import { isLikelyChain, inferPriceLevel } from "@/lib/restaurants/chains";
import { haversineMiles } from "@/lib/restaurants/geo";
import type { RawPlace } from "@/lib/restaurants/normalize";
import type { PhotoKey } from "@/lib/restaurants/types";
import { LOCAL_NIGHTLIFE_CATALOG } from "./catalog";
import { searchComedyClubsByText } from "./comedy-search";
import { JASPER_COUNTY_NIGHTLIFE_CATALOG } from "./jasper-county-catalog";
import {
  nightlifeTypeLabel,
  type ConcreteNightlifeType,
  type NightlifePlace,
  type NightlifeSearchResponse,
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
  nwr["amenity"="bar"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="pub"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="nightclub"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="biergarten"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="casino"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["gambling"="casino"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="theatre"]["theatre:genre"~"comedy|stand[_ -]?up|improv",i](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="theatre"]["name"~"comedy|improv|stand[ -]?up",i](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="arts_centre"]["genre"~"comedy|stand[_ -]?up|improv",i](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="arts_centre"]["name"~"comedy|improv|stand[ -]?up",i](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="events_venue"]["name"~"comedy|improv|stand[ -]?up",i](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["name"~"comedy club|comedy mothership|comedy theater|comedy theatre|improv theater|improv theatre",i](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["craft"="brewery"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["microbrewery"="yes"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="restaurant"]["bar"="yes"](around:${Math.round(radiusMeters)},${lat},${lon});
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

const ALL_LOCAL_NIGHTLIFE = [...JASPER_COUNTY_NIGHTLIFE_CATALOG, ...LOCAL_NIGHTLIFE_CATALOG];
const RETIRED_NIGHTLIFE_NAMES = ["dead cow saloon and grill", "dead cow saloon & grill", "dead cow saloon"] as const;
const NIGHTLIFE_ALIAS_GROUPS = [["joe's 19th hole", "joes 19th hole", "aussie's", "aussies"]] as const;

function isRetiredNightlifeName(name: string): boolean {
  return RETIRED_NIGHTLIFE_NAMES.some((retired) => namesMatch(retired, name));
}

function nightlifeNamesMatch(a: string, b: string): boolean {
  if (namesMatch(a, b)) return true;
  return NIGHTLIFE_ALIAS_GROUPS.some((group) => group.some((candidate) => namesMatch(candidate, a)) && group.some((candidate) => namesMatch(candidate, b)));
}

function classify(tags: Record<string, string>, name: string): ConcreteNightlifeType[] {
  const types = new Set<ConcreteNightlifeType>();
  const amenity = tags.amenity ?? "";
  const lower = `${name} ${tags.description ?? ""} ${tags["theatre:genre"] ?? ""} ${tags.genre ?? ""}`.toLowerCase();
  if (amenity === "casino" || tags.gambling === "casino" || /\bcasino\b/.test(lower)) types.add("casino");
  if (/comedy|stand[_ -]?up|standup|improv/.test(lower)) types.add("comedy-club");
  if (amenity === "nightclub") types.add("club");
  if (amenity === "pub") types.add("pub");
  if (amenity === "bar" || tags.bar === "yes") types.add("bar");
  if (amenity === "biergarten" || tags.craft === "brewery" || tags.microbrewery === "yes") types.add("brewery");
  if (/lounge|cocktail|wine bar/.test(lower)) types.add("lounge");
  if (/club|dance/.test(lower) && !/country club|comedy club/.test(lower)) types.add("club");
  if (types.size === 0) types.add("bar");
  return [...types];
}

function energyFor(types: readonly ConcreteNightlifeType[], tags: Record<string, string>, name: string): 1 | 2 | 3 {
  const lower = `${name} ${tags.description ?? ""}`.toLowerCase();
  if (types.includes("club") || /dance|dj|nightclub|dancefloor|karaoke/.test(lower)) return 3;
  if (types.includes("lounge") || types.includes("brewery") || /wine|cocktail|speakeasy/.test(lower)) return 1;
  return 2;
}

function elementToPlace(element: OverpassElement): NightlifePlace | null {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  if (!name || /closed/i.test(name) || isRetiredNightlifeName(name)) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat == null || lon == null) return null;
  const house = tags["addr:housenumber"] ?? "";
  const street = tags["addr:street"] ?? "";
  const city = tags["addr:city"] ?? "";
  const address = [`${house} ${street}`.trim(), city].filter(Boolean).join(", ") || "Address unavailable";
  const venueTypes = classify(tags, name);
  const isChain = isLikelyChain(name, tags.brand ?? null);
  const raw: RawPlace = { id: `nightlife-osm-${element.type}-${element.id}`, name, lat, lon, address, amenity: tags.amenity ?? "bar", cuisine: tags.cuisine ?? "", openingHours: tags.opening_hours ?? null, phone: tags.phone ?? tags["contact:phone"] ?? null, website: tags.website ?? tags["contact:website"] ?? null, brand: tags.brand ?? null };
  return { id: raw.id, name, lat, lon, address, cuisines: ["other"], cuisineLabel: nightlifeTypeLabel(venueTypes), priceLevel: inferPriceLevel({ amenity: raw.amenity, cuisine: raw.cuisine, name, isChain }), rating: null, reviewCount: null, openingHours: raw.openingHours, phone: raw.phone, website: raw.website, isChain, photoKey: "cafe" as PhotoKey, source: "osm", venueTypes, energyLevel: energyFor(venueTypes, tags, name) };
}

async function queryMirror(url: string, body: string): Promise<NightlifePlace[]> {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Accept: "application/json", "User-Agent": "PickForUs/2.0 (nightlife roulette)" }, body, signal: AbortSignal.timeout(22000) });
  if (!response.ok) throw new Error(`Overpass ${response.status}`);
  const json = (await response.json()) as { elements?: OverpassElement[] };
  const unique = new Map<string, NightlifePlace>();
  for (const element of json.elements ?? []) {
    const place = elementToPlace(element);
    if (!place) continue;
    unique.set(`${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lon.toFixed(4)}`, place);
  }
  return [...unique.values()];
}

function localWithin(lat: number, lon: number, radiusMiles: number): NightlifePlace[] {
  return ALL_LOCAL_NIGHTLIFE.filter((place) => haversineMiles(lat, lon, place.lat, place.lon) <= radiusMiles + 1);
}

function mergeNightlife(live: NightlifePlace[], local: NightlifePlace[]): NightlifePlace[] {
  const merged = [...local];
  for (const place of live) {
    const matchIndex = merged.findIndex((candidate) => nightlifeNamesMatch(candidate.name, place.name) && haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon) < 0.35);
    if (matchIndex >= 0) {
      const curated = merged[matchIndex]!;
      merged[matchIndex] = { ...place, id: curated.id, name: curated.name, lat: curated.lat, lon: curated.lon, address: curated.address || place.address, cuisines: curated.cuisines, cuisineLabel: curated.cuisineLabel, priceLevel: curated.priceLevel ?? place.priceLevel, rating: curated.rating ?? place.rating, reviewCount: curated.reviewCount ?? place.reviewCount, openingHours: curated.openingHours || place.openingHours, phone: curated.phone ?? place.phone, website: curated.website ?? place.website, venueTypes: curated.venueTypes, energyLevel: curated.energyLevel, source: "merged" };
      continue;
    }
    merged.push(place);
  }
  return merged;
}

function mergeDiscovered(base: NightlifePlace[], additions: NightlifePlace[]): NightlifePlace[] {
  const merged = [...base];
  for (const place of additions) {
    if (merged.some((candidate) => nightlifeNamesMatch(candidate.name, place.name) && haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon) < 0.5)) continue;
    merged.push(place);
  }
  return merged;
}

export const searchNightlife = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number; radiusMiles: number }) => {
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lon)) throw new Error("A location is required");
    return { lat: data.lat, lon: data.lon, radiusMiles: Math.min(Math.max(data.radiusMiles || 10, 1), 50) };
  })
  .handler(async ({ data }): Promise<NightlifeSearchResponse> => {
    const fetchRadius = Math.max(data.radiusMiles, 15);
    const radiusMeters = Math.min(fetchRadius * 1609.34, 80467);
    const body = `data=${encodeURIComponent(QUERY(data.lat, data.lon, radiusMeters))}`;
    const local = localWithin(data.lat, data.lon, fetchRadius);
    const comedyPromise = searchComedyClubsByText(data.lat, data.lon, fetchRadius).catch(() => [] as NightlifePlace[]);
    let lastError: unknown;
    for (const mirror of MIRRORS) {
      try {
        const [live, comedy] = await Promise.all([queryMirror(mirror, body), comedyPromise]);
        const venues = mergeNightlife(mergeDiscovered(live, comedy), local);
        if (venues.length > 0) return { venues, source: local.length ? "merged" : "live" };
      } catch (error) {
        lastError = error;
      }
    }

    const comedy = await comedyPromise;
    const fallback = mergeNightlife(comedy, local);
    if (fallback.length > 0) return { venues: fallback, source: local.length ? "fallback" : "live", warning: local.length ? "Using saved Jasper County nightlife while part of live discovery is unavailable." : undefined };
    throw lastError instanceof Error ? lastError : new Error("Could not load nightlife venues for that area.");
  });
