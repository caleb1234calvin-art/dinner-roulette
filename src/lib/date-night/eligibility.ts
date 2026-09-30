import { decorateRestaurant } from "../restaurants/decorate";
import { getOpenStatus } from "../restaurants/hours";
import type {
  RestaurantPreference,
  SearchLocation,
  TemporaryExclusion,
} from "../restaurants/types";
import { getDateNightAvailability } from "./availability";
import { HALLOWEEN_DATE_NIGHT_TYPES } from "./season";
import type { DateNightPlace, DecoratedDateNightPlace, DateNightFilters } from "./types";

export function decorateDateNight(
  places: DateNightPlace[],
  location: SearchLocation,
  now = new Date(),
): DecoratedDateNightPlace[] {
  return places
    .map((place) => {
      const weekly = getOpenStatus(place.openingHours, now);
      const availability = getDateNightAvailability({ ...place, ...weekly }, now);
      return {
        ...place,
        ...decorateRestaurant(place, location, now),
        ...weekly,
        isOpen: availability.openNowEligible,
        closesLabel: availability.status === "open-now" ? weekly.closesLabel : availability.label,
        closingSoon: availability.openNowEligible && weekly.closingSoon,
        availability,
      };
    })
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

export function eligibleDateNight(
  places: DecoratedDateNightPlace[],
  filters: DateNightFilters,
  halloweenActive: boolean,
  preferences: Record<string, RestaurantPreference> = {},
  exclusions: TemporaryExclusion[] = [],
  now = Date.now(),
): DecoratedDateNightPlace[] {
  const selected = filters.activityTypes.filter(
    (type) => halloweenActive || !HALLOWEEN_DATE_NIGHT_TYPES.includes(type),
  );
  const anything = !selected.length || selected.includes("anything");
  return places.filter((venue) => {
    if (
      !halloweenActive &&
      venue.activityTypes.every((type) => HALLOWEEN_DATE_NIGHT_TYPES.includes(type))
    )
      return false;
    if (venue.distanceMiles > filters.radiusMiles + 0.05) return false;
    if (exclusions.some((item) => item.restaurantId === venue.id && item.expiresAt > now))
      return false;
    const pref = preferences[venue.id];
    if (pref?.neverRecommend || (filters.favoritesOnly && !pref?.favorite)) return false;
    if (!venue.availability.browseEligible) return false;
    if (filters.openNowOnly && !venue.availability.openNowEligible) return false;
    return anything || venue.activityTypes.some((type) => selected.includes(type));
  });
}
