import type { GeocodeResult } from "./types";

const USER_AGENT = "PickForUs/1.0 (couple restaurant roulette)";

function formatLabel(place: {
  address?: Record<string, string>;
  display_name?: string;
  name?: string;
}): string {
  const address = place.address ?? {};
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.county ||
    place.name;
  const state = address.state;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  const display = place.display_name ?? "";
  return display.split(",").slice(0, 2).join(",").trim() || "Selected location";
}

export async function geocodeQuery(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const nominatim = new URL("https://nominatim.openstreetmap.org/search");
  nominatim.searchParams.set("q", trimmed);
  nominatim.searchParams.set("format", "json");
  nominatim.searchParams.set("addressdetails", "1");
  nominatim.searchParams.set("limit", "1");
  nominatim.searchParams.set("countrycodes", "us");

  const response = await fetch(nominatim, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Location lookup failed");
  const results = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name?: string;
    name?: string;
    address?: Record<string, string>;
  }>;
  const hit = results[0];
  if (!hit) return null;
  return {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    label: formatLabel(hit),
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return "Current location";
  const place = (await response.json()) as {
    display_name?: string;
    name?: string;
    address?: Record<string, string>;
  };
  return formatLabel(place);
}
