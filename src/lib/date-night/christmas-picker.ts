import { dateNightCategoryWeight, resolveDateNightPresentation } from "./christmas-overlay";
import type { ChristmasOverlay, DateNightPresentation, DateNightPresentationCategory } from "./christmas-overlay";
import { eligibleDateNight } from "./eligibility";
import type { DateNightFilters, DecoratedDateNightPlace } from "./types";
import type { RestaurantPreference, TemporaryExclusion } from "../restaurants/types";

export type ChristmasSelection = DateNightPresentationCategory | "anything";
export interface ChristmasPickableChoice {
  /** The canonical record is never rewritten or given a permanent holiday type. */
  readonly venue?: DecoratedDateNightPlace;
  readonly selectionKey?: string;
  readonly preferenceKey?: string;
  readonly distanceMiles?: number;
  readonly moodLevel?: 1 | 2 | 3;
  readonly categories: readonly DateNightPresentationCategory[];
}
export interface ChristmasChoice extends ChristmasPickableChoice {
  readonly venue: DecoratedDateNightPlace;
  readonly presentation: DateNightPresentation;
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

export function christmasChoiceKey(choice: ChristmasPickableChoice): string {
  return choice.selectionKey ?? choice.venue?.id ?? "";
}
function mayRecommend(choice: ChristmasPickableChoice) {
  const presentation = (choice as ChristmasPickableChoice & { presentation?: { attendanceEligible?: boolean } }).presentation;
  const distance = choice.distanceMiles ?? choice.venue?.distanceMiles;
  return !!christmasChoiceKey(choice) && presentation?.attendanceEligible !== false &&
    typeof distance === "number" && Number.isFinite(distance) && distance >= 0;
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
function categoryPool(items: readonly ChristmasPickableChoice[]) {
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
function chooseVenue<T extends ChristmasPickableChoice>(
  choices: readonly T[],
  mood: number,
  shown: readonly string[],
  random: Random,
) {
  const target = 1 + Math.min(100, Math.max(0, mood)) / 100 * 2;
  const weights = choices.map(choice =>
    Math.max(0.001,
      1 / (1 + (choice.distanceMiles ?? choice.venue?.distanceMiles ?? Infinity) * 0.04) *
      1 / (1 + Math.abs((choice.moodLevel ?? choice.venue?.moodLevel ?? 2) - target) * 0.8) *
      (shown.includes(christmasChoiceKey(choice)) ? 0.12 : 1)),
  );
  return weighted(choices, weights, random);
}

/** Keep the existing category-first roulette semantics and ordinary park penalty. */
export function pickChristmasChoice<T extends ChristmasPickableChoice>(
  choices: readonly T[],
  filters: Pick<DateNightFilters, "mood" | "reduceParks">,
  shown: readonly string[] = [],
  previous: DateNightPresentationCategory | null = null,
  random: Random = Math.random,
): T | null {
  const eligible = choices.filter(mayRecommend);
  const category = chooseCategory(categoryPool(eligible), filters.reduceParks, previous, random);
  if (!category) return null;
  return chooseVenue(eligible.filter(item => item.categories.includes(category)), filters.mood, shown, random);
}

/** Four distinct selection identities; multiple sessions never create extra picks. */
export function pickChristmasOptions<T extends ChristmasPickableChoice>(
  choices: readonly T[],
  filters: Pick<DateNightFilters, "mood" | "reduceParks">,
  shown: readonly string[] = [],
  count = 4,
  random: Random = Math.random,
): T[] {
  const result: T[] = [];
  const used = new Set<string>();
  const eligible = choices.filter(mayRecommend);
  const remainingCategories = categoryPool(eligible);
  const maximum = Number.isFinite(count) ? Math.max(0, Math.min(4, Math.floor(count))) : 4;
  while (remainingCategories.length && result.length < maximum) {
    const category = chooseCategory(remainingCategories, filters.reduceParks, null, random);
    if (!category) break;
    remainingCategories.splice(remainingCategories.indexOf(category), 1);
    const choice = chooseVenue(
      eligible.filter(item => !used.has(christmasChoiceKey(item)) && item.categories.includes(category)),
      filters.mood, shown, random,
    );
    if (choice) {
      result.push(choice);
      used.add(christmasChoiceKey(choice));
    }
  }
  while (result.length < maximum) {
    const choice = pickChristmasChoice(
      eligible.filter(item => !used.has(christmasChoiceKey(item))),
      filters, shown, null, random,
    );
    if (!choice) break;
    result.push(choice);
    used.add(christmasChoiceKey(choice));
  }
  return result;
}
