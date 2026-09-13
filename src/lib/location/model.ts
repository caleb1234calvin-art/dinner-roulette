export interface Coordinates {
  lat: number;
  lon: number;
}

/** Optional address fields support legacy saved locations and countries without regions. */
export interface GeographicLocation extends Coordinates {
  label: string;
  country?: string;
  countryCode?: string;
  region?: string;
  locality?: string;
}

export function isCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;
  const { lat, lon } = value as Coordinates;
  return (
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    Math.abs(lat) <= 90 &&
    typeof lon === "number" &&
    Number.isFinite(lon) &&
    Math.abs(lon) <= 180
  );
}

export function requireCoordinates(value: unknown): Coordinates {
  if (!isCoordinates(value)) throw new Error("A valid location is required");
  return { lat: value.lat, lon: value.lon };
}

export function isGeographicLocation(value: unknown): value is GeographicLocation {
  return (
    isCoordinates(value) &&
    typeof (value as GeographicLocation).label === "string" &&
    Boolean((value as GeographicLocation).label.trim())
  );
}

export function coordinateLocation(value: Coordinates): GeographicLocation {
  const coordinates = requireCoordinates(value);
  return {
    ...coordinates,
    label: `Current location (${coordinates.lat.toFixed(4)}, ${coordinates.lon.toFixed(4)})`,
  };
}

function uniqueParts(parts: Array<string | undefined>): string {
  return [...new Set(parts.map((part) => part?.trim()).filter(Boolean))].join(", ");
}

/** OSM address tags vary by country; no state or postcode is mandatory. */
export function formatOsmAddress(tags: Record<string, string>): string {
  return (
    tags["addr:full"]?.trim() ||
    uniqueParts([
      [tags["addr:housenumber"], tags["addr:street"] || tags["addr:place"]]
        .filter(Boolean)
        .join(" "),
      tags["addr:city"] || tags["addr:town"] || tags["addr:village"] || tags["addr:hamlet"],
      tags["addr:state"] || tags["addr:province"] || tags["addr:region"],
      tags["addr:postcode"],
      tags["addr:country"],
    ])
  );
}

export function normalizeLocationQuery(query: unknown): string {
  if (typeof query !== "string" || !query.trim())
    throw new Error("Enter a city, region and country, or a postal code");
  const trimmed = query.trim();
  if (trimmed.length > 300 || /[\u0000-\u001f\u007f]/.test(trimmed))
    throw new Error("Enter a valid location of 300 characters or fewer");
  return trimmed;
}
