import { namesMatch } from "@/lib/utils";
import { LOCAL_CATALOG, catalogToRestaurant, type CatalogEntry } from "./catalog";
import { REFRESHED_LOCAL_CATALOG, REPLACED_CATALOG_IDS } from "./catalog-refresh";
import {
  RETIRED_LOCAL_NAMES,
  SECOND_PASS_LOCAL_CATALOG,
  SECOND_PASS_REPLACED_IDS,
} from "./catalog-refresh-2";
import { JASPER_COUNTY_LOCAL_CATALOG } from "./jasper-county-catalog";
import { isLikelyChain, inferPriceLevel } from "./chains";
import { cuisineLabelFor, mapOsmCuisines, photoForCuisines } from "./cuisines";
import { haversineMiles } from "./geo";
import type { FallbackPlace } from "./fallback-data";
import { DEFAULT_LOCATION, type Restaurant } from "./types";

export interface RawPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  amenity: string;
  cuisine: string;
  openingHours: string | null;
  phone: string | null;
  website: string | null;
  brand: string | null;
}

const ACTIVE_LOCAL_CATALOG: CatalogEntry[] = [
  ...JASPER_COUNTY_LOCAL_CATALOG,
  ...SECOND_PASS_LOCAL_CATALOG,
  ...REFRESHED_LOCAL_CATALOG.filter((entry) => !SECOND_PASS_REPLACED_IDS.has(entry.id)),
  ...LOCAL_CATALOG.filter(
    (entry) => !REPLACED_CATALOG_IDS.has(entry.id) && !SECOND_PASS_REPLACED_IDS.has(entry.id),
  ),
];

const COUNTY_RETIRED_NAMES = [
  "gem dandy's pizza",
  "gem dandys pizza",
  "dead cow saloon and grill",
  "dead cow saloon & grill",
  "dead cow saloon",
  "granny shaffer's family restaurant",
  "granny shaffers family restaurant",
  "granny shaffer's",
  "granny shaffers",
] as const;

function isRetiredLocalName(name: string): boolean {
  return [...RETIRED_LOCAL_NAMES, ...COUNTY_RETIRED_NAMES].some((retired) => namesMatch(retired, name));
}

export function fallbackToRaw(place: FallbackPlace): RawPlace {
  return { ...place };
}

export function rawToRestaurant(place: RawPlace): Restaurant | null {
  if (!place.name || !Number.isFinite(place.lat) || !Number.isFinite(place.lon)) return null;
  if (haversineMiles(place.lat, place.lon, DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon) <= 40 && isRetiredLocalName(place.name)) return null;
  const cuisines = mapOsmCuisines(place.cuisine, place.amenity, place.name);
  const isChain = isLikelyChain(place.name, place.brand);
  return {
    id: place.id,
    name: place.name,
    lat: place.lat,
    lon: place.lon,
    address: place.address || "Address unavailable",
    cuisines,
    cuisineLabel: cuisineLabelFor(cuisines),
    priceLevel: inferPriceLevel({
      amenity: place.amenity,
      cuisine: place.cuisine,
      name: place.name,
      isChain,
    }),
    rating: null,
    reviewCount: null,
    openingHours: place.openingHours,
    phone: place.phone,
    website: place.website,
    isChain,
    photoKey: photoForCuisines(cuisines),
    source: "osm",
  };
}

function findCatalogMatch(name: string, lat: number, lon: number): CatalogEntry | undefined {
  return ACTIVE_LOCAL_CATALOG.find((entry) => {
    const nameHit = entry.matchNames.some((candidate) => namesMatch(candidate, name));
    if (!nameHit) return false;
    return haversineMiles(entry.lat, entry.lon, lat, lon) < 8;
  });
}

function sourceRank(source: Restaurant["source"]): number {
  if (source === "merged") return 3;
  if (source === "catalog") return 2;
  return 1;
}

function dedupeRestaurants(restaurants: Restaurant[]): Restaurant[] {
  const sorted = [...restaurants].sort((a, b) => sourceRank(b.source) - sourceRank(a.source));
  const kept: Restaurant[] = [];
  for (const restaurant of sorted) {
    const duplicate = kept.find(
      (item) =>
        namesMatch(item.name, restaurant.name) &&
        haversineMiles(item.lat, item.lon, restaurant.lat, restaurant.lon) < 0.2,
    );
    if (duplicate) continue;
    kept.push(restaurant);
  }
  return kept;
}

export function mergePlaces(
  rawPlaces: RawPlace[],
  origin?: { lat: number; lon: number; radiusMiles: number },
): Restaurant[] {
  const merged: Restaurant[] = [];
  const usedCatalog = new Set<string>();
  const catalogRadius = origin ? Math.max(origin.radiusMiles, 20) + 1 : 40;

  for (const raw of rawPlaces) {
    const base = rawToRestaurant(raw);
    if (!base) continue;
    const overlay = findCatalogMatch(base.name, base.lat, base.lon);
    if (overlay) {
      usedCatalog.add(overlay.id);
      merged.push({
        ...base,
        id: overlay.id,
        name: overlay.name,
        lat: overlay.lat,
        lon: overlay.lon,
        address: overlay.address || base.address,
        cuisines: overlay.cuisines,
        cuisineLabel: overlay.cuisineLabel,
        priceLevel: overlay.priceLevel,
        rating: overlay.rating || base.rating,
        reviewCount: overlay.reviewCount || base.reviewCount,
        openingHours: overlay.openingHours || base.openingHours,
        phone: overlay.phone ?? base.phone,
        website: overlay.website ?? base.website,
        isChain: overlay.isChain,
        photoKey: overlay.photoKey,
        source: "merged",
      });
    } else {
      merged.push(base);
    }
  }

  for (const entry of ACTIVE_LOCAL_CATALOG) {
    if (usedCatalog.has(entry.id)) continue;
    if (origin && haversineMiles(origin.lat, origin.lon, entry.lat, entry.lon) > catalogRadius) {
      continue;
    }
    merged.push(catalogToRestaurant(entry));
  }

  return dedupeRestaurants(merged);
}
