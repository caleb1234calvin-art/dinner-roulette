import { createServerFn } from "@tanstack/react-start";
import { JOPLIN_FALLBACK } from "./fallback-data";
import { reverseGeocode, geocodeQuery } from "./geocode";
import { haversineMiles } from "./geo";
import { fallbackToRaw, mergePlaces } from "./normalize";
import { fetchOverpassPlaces } from "./overpass";
import { DEFAULT_LOCATION, type SearchQuery, type SearchResponse } from "./types";

const JOPLIN = { lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon };

function withinJoplinArea(lat: number, lon: number): boolean {
  return haversineMiles(lat, lon, JOPLIN.lat, JOPLIN.lon) <= 40;
}

export const searchRestaurants = createServerFn({ method: "POST" })
  .validator((data: SearchQuery) => {
    if (!Number.isFinite(data.lat) || !Number.isFinite(data.lon)) {
      throw new Error("A location is required");
    }
    return {
      lat: data.lat,
      lon: data.lon,
      radiusMiles: Math.min(Math.max(data.radiusMiles || 10, 1), 30),
    };
  })
  .handler(async ({ data }): Promise<SearchResponse> => {
    const fetchRadius = Math.max(data.radiusMiles, 15);
    const origin = { lat: data.lat, lon: data.lon, radiusMiles: fetchRadius };
    try {
      const live = await fetchOverpassPlaces(data.lat, data.lon, fetchRadius);
      return {
        restaurants: mergePlaces(live, origin),
        source: "live",
      };
    } catch (error) {
      if (withinJoplinArea(data.lat, data.lon)) {
        return {
          restaurants: mergePlaces(JOPLIN_FALLBACK.map(fallbackToRaw), origin),
          source: "fallback",
          warning:
            error instanceof Error
              ? "Using saved Joplin restaurants while the live map is unavailable."
              : undefined,
        };
      }
      throw new Error("Could not load restaurants for that area. Try again in a moment.");
    }
  });

export const lookupLocation = createServerFn({ method: "POST" })
  .validator((data: { query: string }) => {
    if (!data.query?.trim()) throw new Error("Enter a city or ZIP code");
    return { query: data.query.trim() };
  })
  .handler(async ({ data }) => {
    const result = await geocodeQuery(data.query);
    if (!result) throw new Error("Couldn't find that place");
    return result;
  });

export const lookupReverseLocation = createServerFn({ method: "POST" })
  .validator((data: { lat: number; lon: number }) => data)
  .handler(async ({ data }) => {
    const label = await reverseGeocode(data.lat, data.lon);
    return { lat: data.lat, lon: data.lon, label };
  });
