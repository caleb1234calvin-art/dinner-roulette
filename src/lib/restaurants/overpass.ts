import { formatOsmAddress, requireCoordinates } from "../location/model";
import type { RawPlace } from "./normalize";

const MIRRORS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

const QUERY = (lat: number, lon: number, radiusMeters: number) => `
[out:json][timeout:20];
(
  nwr["amenity"="restaurant"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="fast_food"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="cafe"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="ice_cream"](around:${Math.round(radiusMeters)},${lat},${lon});
  nwr["amenity"="pub"]["food"="yes"](around:${Math.round(radiusMeters)},${lat},${lon});
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

function elementToRaw(element: OverpassElement): RawPlace | null {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  if (!name) return null;
  if (/closed/i.test(name)) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat == null || lon == null) return null;
  const address = formatOsmAddress(tags);
  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    lat,
    lon,
    address,
    amenity: tags.amenity ?? "restaurant",
    cuisine: tags.cuisine ?? "",
    openingHours: tags.opening_hours ?? null,
    phone: tags.phone ?? tags["contact:phone"] ?? null,
    website: tags.website ?? tags["contact:website"] ?? null,
    brand: tags.brand ?? null,
  };
}

async function queryMirror(url: string, body: string): Promise<RawPlace[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json",
      "User-Agent": "PickForUs/1.0 (couple restaurant roulette)",
    },
    body,
    signal: AbortSignal.timeout(22000),
  });
  if (!response.ok) {
    throw new Error(`Overpass ${response.status}`);
  }
  const json = (await response.json()) as { elements?: OverpassElement[]; remark?: string };
  if (!Array.isArray(json?.elements) || json.remark) throw new Error("Live discovery returned an incomplete response. Please try again.");
  const unique = new Map<string, RawPlace>();
  for (const element of json.elements ?? []) {
    const raw = elementToRaw(element);
    if (!raw) continue;
    unique.set(raw.name.toLowerCase() + raw.id, raw);
  }
  return [...unique.values()];
}

export async function fetchOverpassPlaces(
  lat: number,
  lon: number,
  radiusMiles: number,
): Promise<RawPlace[]> {
  requireCoordinates({ lat, lon });
  const radiusMeters = Math.min(Math.max(radiusMiles, 1) * 1609.34, 80467);
  const body = `data=${encodeURIComponent(QUERY(lat, lon, radiusMeters))}`;
  let lastError: unknown;
  let hadSuccessfulResponse = false;
  for (const mirror of MIRRORS) {
    try {
      const places = await queryMirror(mirror, body);
      hadSuccessfulResponse = true;
      if (places.length > 0) return places;
    } catch (error) {
      lastError = error;
    }
  }
  if (hadSuccessfulResponse) return [];
  throw lastError instanceof Error ? lastError : new Error("Restaurant search failed");
}
