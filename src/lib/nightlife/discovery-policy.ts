export function validCoordinates(lat: unknown, lon: unknown): lat is number {
  return typeof lat === "number" && Number.isFinite(lat) && lat >= -90 && lat <= 90
    && typeof lon === "number" && Number.isFinite(lon) && lon >= -180 && lon <= 180;
}

export function validateNightlifeQuery(data: { lat: number; lon: number; radiusMiles: number }) {
  if (!data || !validCoordinates(data.lat, data.lon)) throw new Error("A valid location is required");
  if (data.radiusMiles != null && !Number.isFinite(data.radiusMiles)) throw new Error("A valid radius is required");
  return { lat: data.lat, lon: data.lon, radiusMiles: Math.min(Math.max(data.radiusMiles || 10, 1), 50) };
}

const normalized = (name: string) => name.normalize("NFKD").toLowerCase()
  .replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, " ").trim();

export function casinoIdentityName(name: string) {
  return normalized(name).replace(/\b(?:the|hotel|casino|resort|spa|and|gambling|hall)\b/g, "")
    .replace(/\s+/g, " ").trim();
}

// Broad address areas are exclusion scopes, NOT routing pins. Matching is exact
// against reviewed aliases, so unrelated same-name casinos elsewhere survive.
export const CASINO_STATUS_HOLDS = [
  { names: ["The Pass Casino", "Pass Casino"], bounds: [35.98, 36.08, -115.03, -114.93], reason: "Renovation closure; current reopening evidence required" },
  { names: ["Jokers Wild Casino", "Joker's Wild Casino"], bounds: [35.99, 36.12, -115.06, -114.93], reason: "Retired predecessor of Cadence Crossing; do not revive old footprint" },
  { names: ["Whiskey Pete's", "Whiskey Pete's Hotel & Casino", "Whiskey Pete's Casino"], bounds: [35.5, 35.7, -115.5, -115.3], reason: "Main resort closed; license-preserving annex is not a reopened resort" },
  { names: ["Buffalo Bill's", "Buffalo Bill's Resort & Casino", "Buffalo Bill's Casino"], bounds: [35.5, 35.7, -115.5, -115.3], reason: "Regular casino operations closed" },
  { names: ["Eastside Cannery", "Eastside Cannery Casino & Hotel"], bounds: [36.04, 36.14, -115.12, -115.01], reason: "Long-term closure" },
  { names: ["The Mirage", "The Mirage Hotel & Casino", "Mirage"], bounds: [36.09, 36.15, -115.21, -115.14], reason: "Closed predecessor; Hard Rock replacement not yet open" },
  { names: ["Tropicana Las Vegas", "Tropicana Las Vegas Hotel & Casino"], bounds: [36.07, 36.13, -115.21, -115.14], reason: "Closed and demolished" },
  { names: ["Texas Station", "Texas Station Gambling Hall & Hotel", "Fiesta Rancho"], bounds: [36.18, 36.24, -115.24, -115.14], reason: "Closed and demolished" },
  { names: ["Harrah's Reno", "Harrah's Reno Hotel & Casino"], bounds: [39.50, 39.56, -119.85, -119.78], reason: "Closed casino; redevelopment is not operating casino evidence" },
  { names: ["Wa She Shu Casino", "Wa She Shu Casino & Travel Plaza"], bounds: [38.82, 38.98, -119.79, -119.64], reason: "Casino closure; travel plaza alone does not clear reopening gate" },
  { names: ["Comanche War Pony Casino", "War Pony Casino"], bounds: [34.10, 34.23, -98.62, -98.45], reason: "Closed Aug 24, 2025; stale operator roster contradicted by corrected dated reporting" },
] as const;

export function heldCasino(name: string, lat: number, lon: number) {
  const key = normalized(name);
  return CASINO_STATUS_HOLDS.find((hold) => {
    const [south, north, west, east] = hold.bounds;
    return lat >= south && lat <= north && lon >= west && lon <= east
      && hold.names.some((alias) => normalized(alias) === key);
  });
}

export function inactivePlace(tags: Record<string, string>) {
  if (["disused", "abandoned", "demolished", "construction"].some((key) => tags[key] === "yes")) return true;
  if (tags.amenity === "casino" && tags.gambling === "no") return true;
  // A current bar may legitimately retain a disused:amenity=casino history.
  return !tags.amenity && ["disused:amenity", "abandoned:amenity", "demolished:amenity", "construction:amenity"]
    .some((key) => Boolean(tags[key]));
}
