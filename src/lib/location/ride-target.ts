import { isApproximateSeasonalPlace } from "../date-night/listing.ts";
import { isCoordinates } from "./model.ts";
import type { NavigablePlace } from "./maps.ts";

type RidePlace = NavigablePlace & {
  name: string;
  seasonalListing?: NavigablePlace["seasonalListing"] & {
    placement: null | { lat: number; lon: number; basis: "address-geocode" | "operator-site" | "verified-arrival" };
  };
};

/** Approximate discovery points must never be presented as precise ride dropoffs. */
export function uberRideTarget(place: RidePlace): { url: string; ariaLabel: string } {
  const target = place.seasonalListing?.directionsTarget;
  const coordinates = target?.kind === "verified-point" ? target : place;
  if ((target?.kind !== "verified-point" && (isApproximateSeasonalPlace(place) || target?.kind === "visitor-address")) || !isCoordinates(coordinates)) {
    return { url: "https://m.uber.com/", ariaLabel: "Open Uber; choose your destination in the external service" };
  }
  const params = new URLSearchParams();
  params.set("pickup", "my_location");
  params.set("dropoff[latitude]", String(coordinates.lat));
  params.set("dropoff[longitude]", String(coordinates.lon));
  params.set("dropoff[nickname]", place.name);
  if (place.address && place.address !== "Address unavailable") {
    params.set("dropoff[formatted_address]", place.address);
  }
  return {
    url: `https://m.uber.com/looking?${params.toString()}`,
    ariaLabel: `Open Uber with ${place.name} as the destination; external service`,
  };
}
