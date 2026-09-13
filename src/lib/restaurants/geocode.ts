import {
  coordinateLocation,
  isCoordinates,
  normalizeLocationQuery,
  requireCoordinates,
} from "../location/model.ts";
import type { Coordinates } from "../location/model.ts";
import type { GeocodeResult } from "./types";

const USER_AGENT = "PickForUs/1.0 (couple restaurant roulette)";

/** Normalize provider fields without inferring a country from a region name. */
export function locationFromNominatim(
  value: unknown,
  coordinates?: Coordinates,
): GeocodeResult | null {
  if (!value || typeof value !== "object") return null;
  const place = value as Record<string, unknown>;
  if (place.error) return null;
  const number = (input: unknown) =>
    typeof input === "number"
      ? input
      : typeof input === "string" && input.trim()
        ? Number(input)
        : NaN;
  const point = coordinates ?? { lat: number(place.lat), lon: number(place.lon) };
  if (!isCoordinates(point)) return null;
  const address =
    place.address && typeof place.address === "object"
      ? (place.address as Record<string, unknown>)
      : {};
  const text = (...values: unknown[]) =>
    values.find((item): item is string => typeof item === "string" && Boolean(item.trim()))?.trim();
  const locality = text(
    address.city,
    address.town,
    address.village,
    address.hamlet,
    address.municipality,
    address.county,
    place.name,
  );
  const region = text(address.state, address.province, address.region, address.state_district);
  const country = text(address.country);
  const code = text(address.country_code);
  const countryCode = code && /^[a-z]{2}$/i.test(code) ? code.toUpperCase() : undefined;
  const label =
    [...new Set([locality, region, country].filter(Boolean))].join(", ") ||
    text(place.display_name);
  if (!label) return null;
  return { ...point, label, locality, region, country, countryCode };
}

export async function geocodeQuery(query: string): Promise<GeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", normalizeLocationQuery(query));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  // Free text, including any supplied country, reaches the provider unchanged.
  // No country filter or implicit U.S. suffix: postal codes may need a country.
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Location lookup is unavailable. Please try again.");
  const results: unknown = await response.json();
  if (!Array.isArray(results))
    throw new Error("Location lookup returned an invalid response. Please try again.");
  return locationFromNominatim(results[0]);
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult> {
  const coordinates = requireCoordinates({ lat, lon });
  const fallback = coordinateLocation(coordinates);
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return fallback;
    // A reverse result is a nearby mapped feature, not a replacement GPS point.
    return locationFromNominatim(await response.json(), coordinates) ?? fallback;
  } catch {
    return fallback;
  }
}
