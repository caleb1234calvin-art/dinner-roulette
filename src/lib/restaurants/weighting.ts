import type {
  AppFilters,
  DecoratedRestaurant,
  RestaurantPreference,
  TemporaryExclusion,
  VisitRecord,
} from "./types";
import { isAnythingSelected } from "./cuisines";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface WeightContext {
  filters: AppFilters;
  preferences: Record<string, RestaurantPreference>;
  visits: VisitRecord[];
  exclusions: TemporaryExclusion[];
  sessionShown: string[];
  now: number;
}

export type EmptyCause = "distance" | "price" | "cuisine" | "open" | "exclusions" | "favorites" | "chains";

export function isExcluded(id: string, ctx: WeightContext): boolean {
  return ctx.exclusions.some((item) => item.restaurantId === id && item.expiresAt > ctx.now);
}

export function applyHardFilters(
  restaurants: DecoratedRestaurant[],
  ctx: WeightContext,
  radiusOverride?: number,
): DecoratedRestaurant[] {
  const radius = radiusOverride ?? ctx.filters.radiusMiles;
  const cuisineFilter = ctx.filters.cuisines;
  const anything = isAnythingSelected(cuisineFilter);

  return restaurants.filter((restaurant) => {
    if (restaurant.distanceMiles > radius + 0.05) return false;
    if (isExcluded(restaurant.id, ctx)) return false;

    const pref = ctx.preferences[restaurant.id];
    if (pref?.neverRecommend) return false;
    if (ctx.filters.neverRecommendOneStar && pref?.ourRating === 1) return false;
    if (ctx.filters.favoritesOnly && !pref?.favorite) return false;
    if (ctx.filters.chainPreference === "local" && restaurant.isChain) return false;
    if (ctx.filters.chainPreference === "chains" && !restaurant.isChain) return false;

    if (ctx.filters.openNowOnly && restaurant.hoursKnown && !restaurant.isOpen) return false;

    if (restaurant.priceLevel == null) {
      if (!ctx.filters.includeUnknownPrice) return false;
    } else if (
      restaurant.priceLevel < ctx.filters.minPrice ||
      restaurant.priceLevel > ctx.filters.maxPrice
    ) {
      return false;
    }

    if (!anything) {
      const hit = restaurant.cuisines.some((cuisine) => cuisineFilter.includes(cuisine));
      if (!hit) return false;
    }

    return true;
  });
}

function daysSince(iso: string | null | undefined, now: number): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return null;
  return (now - then) / DAY_MS;
}

export function weightOf(restaurant: DecoratedRestaurant, ctx: WeightContext): number {
  const pref = ctx.preferences[restaurant.id];
  const adventure = Math.min(Math.max(ctx.filters.adventure, 0), 100) / 100;
  const familiar = 1 - adventure;
  let weight = 1;

  if (pref?.favorite) weight *= 1.4;

  const lastVisitDays = daysSince(pref?.lastVisited, ctx.now);
  if (lastVisitDays == null) {
    // Never visited: adventurous boosts, familiar damps.
    weight *= 0.5 + adventure * 1.1;
  } else if (lastVisitDays <= 3) {
    weight *= 0.2;
  } else if (lastVisitDays <= 7) {
    weight *= 0.45;
  } else if (lastVisitDays <= 30) {
    weight *= 0.75;
  } else {
    weight *= 1.3;
  }

  if (pref?.ourRating === 5) weight *= 1 + 0.5 * familiar;
  else if (pref?.ourRating === 4) weight *= 1 + 0.25 * familiar;
  else if (pref?.ourRating === 2) weight *= 0.55;
  else if (pref?.ourRating === 1) weight *= 0.05;

  if (ctx.sessionShown.includes(restaurant.id)) weight *= 0.12;
  if (restaurant.closingSoon) weight *= 0.55;

  const distRatio = Math.min(restaurant.distanceMiles / Math.max(ctx.filters.radiusMiles, 1), 1);
  weight *= 1 + familiar * (1 - distRatio) * 0.35 + adventure * distRatio * 0.2;

  if (!restaurant.isChain) weight *= 1 + adventure * 0.35;
  else weight *= 1 + familiar * 0.12;

  return Math.max(weight, 0.001);
}

export function pickWeighted<T>(items: T[], weights: number[]): T | null {
  if (items.length === 0) return null;
  const total = weights.reduce((sum, value) => sum + Math.max(value, 0), 0);
  if (total <= 0) return items[Math.floor(Math.random() * items.length)] ?? null;
  let cursor = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    cursor -= Math.max(weights[i] ?? 0, 0);
    if (cursor <= 0) return items[i] ?? null;
  }
  return items[items.length - 1] ?? null;
}

export function selectRestaurant(
  eligible: DecoratedRestaurant[],
  ctx: WeightContext,
): DecoratedRestaurant | null {
  if (eligible.length === 0) return null;
  const unshown = eligible.filter((item) => !ctx.sessionShown.includes(item.id));
  const pool = unshown.length > 0 ? unshown : eligible;
  const weights = pool.map((item) => weightOf(item, ctx));
  return pickWeighted(pool, weights);
}

function diversityWeight(
  restaurant: DecoratedRestaurant,
  selected: DecoratedRestaurant[],
  ctx: WeightContext,
  avoid: Set<string>,
): number {
  let weight = weightOf(restaurant, ctx);
  if (avoid.has(restaurant.id)) weight *= 0.06;

  const visited = (ctx.preferences[restaurant.id]?.timesVisited ?? 0) > 0;
  for (const other of selected) {
    if (restaurant.cuisineLabel === other.cuisineLabel) weight *= 0.18;
    else if (restaurant.cuisines.some((cuisine) => other.cuisines.includes(cuisine))) weight *= 0.4;
    if (restaurant.photoKey === other.photoKey) weight *= 0.55;
    if (restaurant.priceLevel != null && restaurant.priceLevel === other.priceLevel) weight *= 0.72;
    if (restaurant.isChain === other.isChain) weight *= 0.8;
    const otherVisited = (ctx.preferences[other.id]?.timesVisited ?? 0) > 0;
    if (visited === otherVisited) weight *= 0.88;
  }
  return Math.max(weight, 0.0001);
}

export function selectOptions(
  eligible: DecoratedRestaurant[],
  ctx: WeightContext,
  count = 4,
  avoidIds: readonly string[] = [],
): DecoratedRestaurant[] {
  if (eligible.length === 0) return [];
  const target = Math.min(count, eligible.length);
  const avoid = new Set(avoidIds);
  const fresh = eligible.filter((item) => !avoid.has(item.id));
  const remaining =
    fresh.length >= target
      ? [...fresh]
      : [...fresh, ...eligible.filter((item) => avoid.has(item.id))];

  const selected: DecoratedRestaurant[] = [];
  while (selected.length < target && remaining.length > 0) {
    const weights = remaining.map((item) => diversityWeight(item, selected, ctx, avoid));
    const next = pickWeighted(remaining, weights);
    if (!next) break;
    selected.push(next);
    const index = remaining.findIndex((item) => item.id === next.id);
    if (index >= 0) remaining.splice(index, 1);
  }
  return selected;
}

export function diagnoseEmptyPool(
  restaurants: DecoratedRestaurant[],
  ctx: WeightContext,
): EmptyCause[] {
  const causes: EmptyCause[] = [];
  const base = applyHardFilters(restaurants, ctx);
  if (base.length > 0) return causes;

  const withoutOpen = applyHardFilters(restaurants, {
    ...ctx,
    filters: { ...ctx.filters, openNowOnly: false },
  });
  const withoutCuisine = applyHardFilters(restaurants, {
    ...ctx,
    filters: { ...ctx.filters, cuisines: ["anything"] },
  });
  const withoutPrice = applyHardFilters(restaurants, {
    ...ctx,
    filters: { ...ctx.filters, minPrice: 1, maxPrice: 4, includeUnknownPrice: true },
  });
  const farther = applyHardFilters(restaurants, ctx, Math.min(ctx.filters.radiusMiles * 2, 30));
  const withoutExclusions = applyHardFilters(restaurants, { ...ctx, exclusions: [] });
  const withoutFavorites = applyHardFilters(restaurants, {
    ...ctx,
    filters: { ...ctx.filters, favoritesOnly: false },
  });
  const withoutChains = applyHardFilters(restaurants, {
    ...ctx,
    filters: { ...ctx.filters, chainPreference: "both" },
  });

  if (ctx.filters.favoritesOnly && withoutFavorites.length > 0) causes.push("favorites");
  if (ctx.filters.chainPreference !== "both" && withoutChains.length > 0) causes.push("chains");
  if (farther.length > 0) causes.push("distance");
  if (withoutPrice.length > 0) causes.push("price");
  if (withoutCuisine.length > 0) causes.push("cuisine");
  if (withoutOpen.length > 0) causes.push("open");
  if (withoutExclusions.length > 0) causes.push("exclusions");
  return causes;
}
