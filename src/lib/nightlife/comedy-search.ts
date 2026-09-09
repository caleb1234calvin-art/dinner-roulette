import { haversineMiles } from "@/lib/restaurants/geo";
import type { PhotoKey } from "@/lib/restaurants/types";
import type { NightlifePlace } from "./types";

interface NominatimPlace {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name?: string;
  type?: string;
  category?: string;
  extratags?: Record<string, string>;
  address?: Record<string, string>;
}

function boundsFor(lat: number, lon: number, radiusMiles: number) {
  const latDelta = radiusMiles / 69;
  const lonDelta = radiusMiles / Math.max(10, 69 * Math.cos((lat * Math.PI) / 180));
  return {
    left: lon - lonDelta,
    top: lat + latDelta,
    right: lon + lonDelta,
    bottom: lat - latDelta,
  };
}

function toNightlifePlace(item: NominatimPlace, origin: { lat: number; lon: number; radiusMiles: number }): NightlifePlace | null {
  const lat = Number(item.lat);
  const lon = Number(item.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (haversineMiles(origin.lat, origin.lon, lat, lon) > origin.radiusMiles + 0.25) return null;

  const name = (item.name ?? item.display_name?.split(",")[0] ?? "").trim();
  if (!name) return null;

  const extra = item.extratags ?? {};
  const addressParts = item.address
    ? [item.address.house_number, item.address.road, item.address.city ?? item.address.town ?? item.address.village]
        .filter(Boolean)
        .join(" ")
    : "";

  return {
    id: `nightlife-nominatim-${item.place_id}`,
    name,
    lat,
    lon,
    address: addressParts || item.display_name || "Address unavailable",
    cuisines: ["other"],
    cuisineLabel: "Comedy Club",
    priceLevel: null,
    rating: null,
    reviewCount: null,
    openingHours: extra.opening_hours ?? null,
    phone: extra.phone ?? extra["contact:phone"] ?? null,
    website: extra.website ?? extra["contact:website"] ?? null,
    isChain: false,
    photoKey: "cafe" as PhotoKey,
    source: "osm",
    venueTypes: ["comedy-club"],
    energyLevel: 2,
  };
}

export async function searchComedyClubsByText(lat: number, lon: number, radiusMiles: number): Promise<NightlifePlace[]> {
  const bounds = boundsFor(lat, lon, radiusMiles);
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", "comedy club");
  url.searchParams.set("limit", "40");
  url.searchParams.set("bounded", "1");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("extratags", "1");
  url.searchParams.set("viewbox", `${bounds.left},${bounds.top},${bounds.right},${bounds.bottom}`);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "DinnerRoulette/3.5 (nightlife comedy discovery)",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return [];

  const json = (await response.json()) as NominatimPlace[];
  const unique = new Map<string, NightlifePlace>();
  for (const item of json) {
    const place = toNightlifePlace(item, { lat, lon, radiusMiles });
    if (!place) continue;
    const key = `${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lon.toFixed(4)}`;
    unique.set(key, place);
  }
  return [...unique.values()];
}
