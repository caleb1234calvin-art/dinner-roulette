import { isCoordinates } from "./model.ts";

/** Seasonal navigation evidence overrides the approximate discovery placement. */
export interface NavigablePlace {
  id?: string;
  restaurantId?: string;
  /** Event addresses/placement are not independently reviewed visitor gates. */
  dateNightEvent?: unknown;
  dateNightEventUnavailable?: boolean;
  lat?: number;
  lon?: number;
  address?: string;
  name?: string;
  seasonalListing?: {
    directionsTarget:
      | { kind: "visitor-address"; address: string }
      | { kind: "verified-point"; lat: number; lon: number; description: string };
  };
}

/** Ordinary places keep coordinate-first navigation; seasonal listings use their reviewed target. */
export function directionsUrl(place: NavigablePlace): string | null {
  if (place.dateNightEvent !== undefined || place.dateNightEventUnavailable ||
      place.id?.startsWith("date-night-event-christmas-2026-") ||
      place.restaurantId?.startsWith("date-night-event-christmas-2026-")) return null;
  const target = place.seasonalListing?.directionsTarget;
  const destination = target?.kind === "visitor-address"
    ? target.address
    : target?.kind === "verified-point"
      ? (isCoordinates(target) ? `${target.lat},${target.lon}` : "")
      : isCoordinates(place)
        ? `${place.lat},${place.lon}`
        : [place.name, place.address === "Address unavailable" ? undefined : place.address]
            .filter(Boolean)
            .join(", ");
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
