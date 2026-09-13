import { isCoordinates } from "./model.ts";

/** Coordinates avoid ambiguous partial addresses when searching another country. */
export function directionsUrl(place: {
  lat?: number;
  lon?: number;
  address?: string;
  name?: string;
}): string | null {
  const destination = isCoordinates(place)
    ? `${place.lat},${place.lon}`
    : [place.name, place.address === "Address unavailable" ? undefined : place.address]
        .filter(Boolean)
        .join(", ");
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
