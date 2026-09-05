import { namesMatch } from "@/lib/utils";
import { LOCAL_CATALOG, catalogToRestaurant, type CatalogEntry } from "./catalog";
import { isLikelyChain, inferPriceLevel } from "./chains";
import { cuisineLabelFor, mapOsmCuisines, photoForCuisines } from "./cuisines";
import { haversineMiles } from "./geo";
import type { FallbackPlace } from "./fallback-data";
import type { Restaurant } from "./types";

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

export function fallbackToRaw(place: FallbackPlace): RawPlace {
  return { ...place };
}

export function rawToRestaurant(place: RawPlace): Restaurant | null {
  if (!place.name || !Number.isFinite(place.lat) || !Number.isFinite(place.lon)) return null;
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
  return LOCAL_CATALOG.find((entry) => {
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
        address: overlay.address || base.address,
        cuisines: overlay.cuisines,
        cuisineLabel: overlay.cuisineLabel,
        priceLevel: overlay.priceLevel,
        rating: overlay.rating,
        reviewCount: overlay.reviewCount,
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

  for (const entry of LOCAL_CATALOG) {
    if (usedCatalog.has(entry.id)) continue;
    if (origin && haversineMiles(origin.lat, origin.lon, entry.lat, entry.lon) > catalogRadius) {
      continue;
    }
    merged.push(catalogToRestaurant(entry));
  }

  return dedupeRestaurants(merged);
}
