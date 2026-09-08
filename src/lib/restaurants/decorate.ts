import { getSeasonalDateStatus, hasSeasonalAvailabilityRecord } from "@/lib/date-night/availability";
import { haversineMiles } from "./geo";
import { getOpenStatus } from "./hours";
import type { DecoratedRestaurant, Restaurant, SearchLocation } from "./types";

export function decorateRestaurant(
  restaurant: Restaurant,
  location: SearchLocation,
  now = new Date(),
): DecoratedRestaurant {
  const weeklyStatus = getOpenStatus(restaurant.openingHours, now);
  let status = weeklyStatus;

  if (hasSeasonalAvailabilityRecord(restaurant.id)) {
    const seasonalStatus = getSeasonalDateStatus(restaurant.id, now);

    if (seasonalStatus === "unavailable") {
      status = {
        isOpen: false,
        hoursKnown: true,
        closesLabel: null,
        closingSoon: false,
      };
    } else if (seasonalStatus === "unconfirmed") {
      // Fail closed for Open-now filtering. An unconfirmed seasonal calendar
      // is not proof that the venue is open at this moment.
      status = {
        isOpen: false,
        hoursKnown: true,
        closesLabel: "Schedule unconfirmed",
        closingSoon: false,
      };
    }
  }

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
