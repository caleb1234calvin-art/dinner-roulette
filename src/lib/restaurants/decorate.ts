import { haversineMiles } from "./geo";
import { getOpenStatus } from "./hours";
import type { DecoratedRestaurant, Restaurant, SearchLocation } from "./types";

export function decorateRestaurant(
  restaurant: Restaurant,
  location: SearchLocation,
  now = new Date(),
): DecoratedRestaurant {
  const status = getOpenStatus(restaurant.openingHours, now);
  return {
    ...restaurant,
    distanceMiles: haversineMiles(location.lat, location.lon, restaurant.lat, restaurant.lon),
    isOpen: status.isOpen,
    hoursKnown: status.hoursKnown,
    closesLabel: status.closingSoon ? "Closing soon" : status.closesLabel,
    closingSoon: status.closingSoon,
  };
}

export function decorateAll(
  restaurants: Restaurant[],
  location: SearchLocation,
  now = new Date(),
): DecoratedRestaurant[] {
  return restaurants
    .map((restaurant) => decorateRestaurant(restaurant, location, now))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}
