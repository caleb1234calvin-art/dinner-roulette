import type { DecoratedNightlifePlace, NightlifeFilters } from "./types";
import type { RestaurantPreference, TemporaryExclusion } from "../restaurants/types";

export function weightedPick(items: DecoratedNightlifePlace[], energy: number, shown: string[], random = Math.random) {
  if (!items.length) return null;
  const target = 1 + (Math.min(Math.max(energy, 0), 100) / 100) * 2;
  const weights = items.map((item) => {
    const distancePenalty = 1 / (1 + item.distanceMiles * 0.04);
    const energyFit = 1 / (1 + Math.abs(item.energyLevel - target) * 0.8);
    const shownPenalty = shown.includes(item.id) ? 0.12 : 1;
    return Math.max(0.001, distancePenalty * energyFit * shownPenalty);
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = random() * total;
  for (let i = 0; i < items.length; i += 1) {
    cursor -= weights[i] ?? 0;
    if (cursor <= 0) return items[i] ?? items[0];
  }
  return items[items.length - 1] ?? null;
}

export function pickOptions(items: DecoratedNightlifePlace[], energy: number, shown: string[], count = 4, random = Math.random) {
  const remaining = [...new Map(items.map((item) => [item.id, item])).values()];
  const result: DecoratedNightlifePlace[] = [];
  while (remaining.length && result.length < count) {
    const next = weightedPick(remaining, energy, shown, random);
    if (!next) break;
    result.push(next);
    remaining.splice(remaining.findIndex((item) => item.id === next.id), 1);
  }
  return result;
}

export function eligibleNightlife(
  venues: DecoratedNightlifePlace[],
  filters: NightlifeFilters,
  preferences: Record<string, RestaurantPreference>,
  exclusions: TemporaryExclusion[],
  now = Date.now(),
) {
    const anything = filters.venueTypes.includes("anything");
    return venues.filter((venue) => {
      if (venue.distanceMiles > filters.radiusMiles + 0.05) return false;
      if (exclusions.some((item) => item.restaurantId === venue.id && item.expiresAt > now)) return false;
      const pref = preferences[venue.id];
      if (pref?.neverRecommend) return false;
      if (filters.favoritesOnly && !pref?.favorite) return false;
      if (filters.openNowOnly && (!venue.hoursKnown || !venue.isOpen)) return false;
      if (venue.priceLevel == null) {
        if (!filters.includeUnknownPrice) return false;
      } else if (venue.priceLevel < filters.minPrice || venue.priceLevel > filters.maxPrice) return false;
      if (!anything && !venue.venueTypes.some((type) => filters.venueTypes.includes(type))) return false;
      return true;
    });
}
