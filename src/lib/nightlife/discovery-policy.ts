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
  const full = normalized(name);
  const identity = full.replace(/\b(?:the|hotel|casino|resort|spa|and|gambling|hall)\b/g, "")
    .replace(/\s+/g, " ").trim();
  return identity || full;

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
  {"names":["Ioway Casino"],"bounds":[35.65,35.75,-97.04,-96.93],"reason":"Permanently closed predecessor of Harrah's Oklahoma; new Chandler site is distinct"},
  {"names":["Kiowa Casino Verden","Kiowa Casino - Verden"],"bounds":[35.04,35.14,-98.16,-98.04],"reason":"Closed October 31, 2023; current Kiowa portfolio is Devol, Carnegie and Elk Creek"},
  {"names":["Creek Nation Casino Eufaula","Creek Nation Casino - Eufaula"],"bounds":[35.25,35.35,-95.64,-95.54],"reason":"Retired 806 W Forrest Ave predecessor; current Lake Eufaula Casino Hotel is at 1045 Birkes Rd"},
  { names: ["Golden Pony Casino"], bounds: [35.2, 35.65, -96.7, -95.8], reason: "Closure reported in late 2025; a 2020 reopening result and generic hours do not establish subsequent reopening" },
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

/** Discard malformed optional provider fields without losing valid neighboring records. */
export function nightlifeTags(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([key, text]) => [key, text.trim()]));
}

export function nightlifeWebsite(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

// Reviewed same-property aliases. The caller must also require physical proximity.
const CASINO_ALIAS_GROUPS = [
  ["The Vanderpump Hotel", "The Cromwell"],
  ["J Resort", "Sands Regency", "Sands Regency Casino Hotel"],
  ["Caesars Republic Lake Tahoe", "Harveys Lake Tahoe"],
  ["Golden Nugget Lake Tahoe", "Hard Rock Hotel & Casino Lake Tahoe"],
  ["Bally's Lake Tahoe", "MontBleu Resort Casino & Spa"],
] as const;

export function casinoNamesMatch(a: string, b: string) {
  const left = casinoIdentityName(a);
  const right = casinoIdentityName(b);
  if (!left || !right) return false;
  if (left === right) return true;
  return CASINO_ALIAS_GROUPS.some(group =>
    group.some(alias => casinoIdentityName(alias) === left)
    && group.some(alias => casinoIdentityName(alias) === right));
}
