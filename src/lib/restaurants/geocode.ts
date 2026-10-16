import {
  coordinateLocation,
  isCoordinates,
  normalizeLocationQuery,
  requireCoordinates,
} from "../location/model.ts";
import type { Coordinates, LocationCandidate } from "../location/model.ts";
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

/** Full provider labels distinguish municipality, county, postal and street results. */
export function candidateFromNominatim(value: unknown): LocationCandidate | null {
  const location = locationFromNominatim(value);
  if (!location) return null;
  const place = value as Record<string, unknown>;
  const address = place.address && typeof place.address === "object"
    ? place.address as Record<string, unknown> : {};
  const text = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : undefined;
  const label = text(place.display_name) ?? location.label;
  const placeType = text(place.addresstype) ?? text(place.type) ?? "place";
  // OSM identity survives provider reindexing; Nominatim place_id does not.
  const osmType = text(place.osm_type);
  const osmId = typeof place.osm_id === "number" && Number.isSafeInteger(place.osm_id) && place.osm_id > 0
    ? String(place.osm_id) : typeof place.osm_id === "string" && /^[1-9]\d*$/.test(place.osm_id) ? place.osm_id : undefined;
  const id = osmType && ["node", "way", "relation"].includes(osmType) && osmId
    ? `osm:${osmType}:${osmId}` : JSON.stringify([label, placeType, location.lat, location.lon]);
  return { ...location, label, id, placeType, county: text(address.county), postalCode: text(address.postcode) };
}

export async function geocodeQuery(query: string): Promise<LocationCandidate[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", normalizeLocationQuery(query));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
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
  const candidates = new Map<string, LocationCandidate>();
  for (const result of results.slice(0, 5)) {
    const candidate = candidateFromNominatim(result);
    if (candidate && !candidates.has(candidate.id)) candidates.set(candidate.id, candidate);
  }
  return [...candidates.values()];
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
