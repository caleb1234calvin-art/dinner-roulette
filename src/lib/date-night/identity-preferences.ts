import { seasonalReceiptAliasIds } from "./identity-receipts";
import type { RestaurantPreference } from "../restaurants/types";
import type { DateNightPlace } from "./types";

type IdentityPlace = Pick<DateNightPlace, "id"> & Partial<Pick<DateNightPlace, "seasonalListing" | "discoveryEvidence">>;

/** Only IDs already admitted by the affirmative identity merge are aliases.
 * Never infer a user preference from nearby geometry, shared types or an address.
 * Ordinary Dinner/Nightlife and noncurated records keep their existing ID behavior. */
export function seasonalPreferenceIds(place: IdentityPlace): string[] {
  return place.seasonalListing
    ? [...new Set([place.id, ...(place.discoveryEvidence ?? []).map(item => item.id), ...seasonalReceiptAliasIds(place.id)])]
    : [place.id];
}

export function seasonalIdentityPreference(place: IdentityPlace, preferences: Record<string, RestaurantPreference>) {
  const ids = seasonalPreferenceIds(place);
  return {
    ids,
    favorite: ids.some(id => Boolean(preferences[id]?.favorite)),
    neverRecommend: ids.some(id => Boolean(preferences[id]?.neverRecommend)),
  };
}

/** Unsave clears currently affirmed favorites; re-save uses the canonical ID only.
 * Do not create duplicate provider favorites or erase ratings/never-recommend data. */
export function seasonalFavoriteToggleIds(place: IdentityPlace, preferences: Record<string, RestaurantPreference>): string[] {
  const state = seasonalIdentityPreference(place, preferences);
  return state.favorite ? state.ids.filter(id => preferences[id]?.favorite) : [place.id];
}
