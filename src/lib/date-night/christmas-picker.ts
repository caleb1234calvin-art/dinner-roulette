import { dateNightCategoryWeight, resolveDateNightPresentation } from "./christmas-overlay";
import type { ChristmasOverlay, DateNightPresentation, DateNightPresentationCategory } from "./christmas-overlay";
import { eligibleDateNight } from "./eligibility";
import type { DateNightFilters, DecoratedDateNightPlace } from "./types";
import type { RestaurantPreference, TemporaryExclusion } from "../restaurants/types";

export type ChristmasSelection = DateNightPresentationCategory | "anything";
export interface ChristmasChoice {
  /** The canonical record is never rewritten or given a permanent holiday type. */
  readonly venue: DecoratedDateNightPlace;
  readonly presentation: DateNightPresentation;
  readonly categories: readonly DateNightPresentationCategory[];
}

/** Adapt *after* canonical merge/decorate. Reuse the ordinary eligibility gates
 * before applying effective Christmas category and independent event hours.
 * Synthetic fixtures belong only in tests; production supplies no overlays yet. */
export function eligibleChristmasChoices(
  venues: readonly DecoratedDateNightPlace[],
  filters: DateNightFilters,
  selectedCategories: readonly ChristmasSelection[],
  overlays: readonly ChristmasOverlay[],
  now: Date,
  preferences: Record<string, RestaurantPreference> = {},
  exclusions: TemporaryExclusion[] = [],
  christmasEnabled = true,
  halloweenActive = false,
): ChristmasChoice[] {
  const baseEligible = eligibleDateNight(
    [...venues],
    { ...filters, activityTypes: ["anything"], openNowOnly: false },
    halloweenActive,
    preferences,
    exclusions,
    now.getTime(),
  );
  const selected = new Set(selectedCategories);
  const anything = !selected.size || selected.has("anything");
  const seenIds = new Set<string>();
  const result: ChristmasChoice[] = [];
  for (const venue of baseEligible) {
    if (seenIds.has(venue.id)) continue; // Never manufacture two picks for one park.
    seenIds.add(venue.id);
    const presentation = resolveDateNightPresentation(
      venue,
      { homeMode: "date-night", now, christmasEnabled },
      overlays,
    );
    const categories: DateNightPresentationCategory[] = presentation.overlayApplied
      ? ["christmas-lights"]
      : venue.activityTypes;
    if (!anything && !categories.some(category => selected.has(category))) continue;
    if (
      filters.openNowOnly &&
      !(presentation.overlayApplied
        ? presentation.eventAvailability.openNowEligible
        : venue.availability.openNowEligible)
    ) continue;
    result.push({ venue, presentation, categories });
  }
  return result;
}

type Random = () => number;
function unitRandom(random: Random): number {
  const sample = random();
  return Number.isFinite(sample) ? Math.min(0.999999999999, Math.max(0, sample)) : 0;
}
function weighted<T>(values: readonly T[], weights: readonly number[], random: Random): T | null {
  if (!values.length) return null;
  const total = weights.reduce((a, b) => a + b, 0);
  let cursor = unitRandom(random) * total;
  for (let i = 0; i < values.length; i++) {
    cursor -= weights[i] ?? 0;
    if (cursor <= 0) return values[i] ?? null;
  }
  return values[values.length - 1] ?? null;
}
function categoryPool(items: readonly ChristmasChoice[]) {
  return [...new Set(items.flatMap(item => item.categories))];
}
function chooseCategory(
  categories: readonly DateNightPresentationCategory[],
  reduceParks: boolean,
  previous: DateNightPresentationCategory | null,
  random: Random,
) {
  const alternative = previous !== null && categories.some(category => category !== previous);
  const weights = categories.map(category =>
    dateNightCategoryWeight(category, reduceParks) *
    (alternative && category === previous ? 0.18 : 1),
  );
  return weighted(categories, weights, random);
}
function chooseVenue(
  choices: readonly ChristmasChoice[],
  mood: number,
  shown: readonly string[],
  random: Random,
) {
  const target = 1 + Math.min(100, Math.max(0, mood)) / 100 * 2;
  const weights = choices.map(({ venue }) =>
    Math.max(0.001,
      1 / (1 + venue.distanceMiles * 0.04) *
      1 / (1 + Math.abs(venue.moodLevel - target) * 0.8) *
      (shown.includes(venue.id) ? 0.12 : 1)),
  );
  return weighted(choices, weights, random);
}

/** Keep the existing category-first roulette semantics and ordinary park penalty. */
export function pickChristmasChoice(
  choices: readonly ChristmasChoice[],
  filters: Pick<DateNightFilters, "mood" | "reduceParks">,
  shown: readonly string[] = [],
  previous: DateNightPresentationCategory | null = null,
  random: Random = Math.random,
): ChristmasChoice | null {
  const category = chooseCategory(categoryPool(choices), filters.reduceParks, previous, random);
  if (!category) return null;
  return chooseVenue(choices.filter(item => item.categories.includes(category)), filters.mood, shown, random);
}

/** Four distinct canonical IDs, preferring distinct effective categories first. */
export function pickChristmasOptions(
  choices: readonly ChristmasChoice[],
  filters: Pick<DateNightFilters, "mood" | "reduceParks">,
  shown: readonly string[] = [],
  count = 4,
  random: Random = Math.random,
): ChristmasChoice[] {
  const result: ChristmasChoice[] = [];
  const used = new Set<string>();
  const remainingCategories = categoryPool(choices);
  const maximum = Number.isFinite(count) ? Math.max(0, Math.min(4, Math.floor(count))) : 4;
  while (remainingCategories.length && result.length < maximum) {
    const category = chooseCategory(remainingCategories, filters.reduceParks, null, random);
    if (!category) break;
    remainingCategories.splice(remainingCategories.indexOf(category), 1);
    const choice = chooseVenue(
      choices.filter(item => !used.has(item.venue.id) && item.categories.includes(category)),
      filters.mood, shown, random,
    );
    if (choice) {
      result.push(choice);
      used.add(choice.venue.id);
    }
  }
  while (result.length < maximum) {
    const choice = pickChristmasChoice(
      choices.filter(item => !used.has(item.venue.id)),
      filters, shown, null, random,
    );
    if (!choice) break;
    result.push(choice);
    used.add(choice.venue.id);
  }
  return result;
}
