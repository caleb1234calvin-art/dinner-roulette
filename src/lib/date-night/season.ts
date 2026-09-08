import { isSeasonalFeatureEnabled } from "@/lib/seasonal-features";
import { DATE_NIGHT_TYPE_CHIPS, type DateNightFilters, type DateNightTypeId } from "./types";

export const HALLOWEEN_DATE_NIGHT_START = { month: 9, day: 1 } as const;
export const HALLOWEEN_DATE_NIGHT_END = { month: 11, day: 2 } as const;

export const HALLOWEEN_DATE_NIGHT_TYPES: readonly DateNightTypeId[] = [
  "haunted-house",
  "corn-maze",
  "pumpkin-patch",
];

export const HALLOWEEN_THRILL_TYPES: readonly DateNightTypeId[] = [
  "haunted-house",
  "escape-room",
  "corn-maze",
];

export const HALLOWEEN_SETTLE_TYPES: readonly DateNightTypeId[] = [
  "movies",
  "museum",
  "pumpkin-patch",
  "park",
];

export const HALLOWEEN_DATE_NIGHT_CHIPS: ReadonlyArray<{
  id: DateNightTypeId;
  label: string;
}> = [
  { id: "haunted-house", label: "Haunted House" },
  { id: "corn-maze", label: "Corn Maze" },
  { id: "pumpkin-patch", label: "Pumpkin Patch" },
];

export const HALLOWEEN_DATE_NIGHT_PRESETS: ReadonlyArray<{
  id: string;
  label: string;
  note: string;
  activityTypes: DateNightTypeId[];
  mood: number;
}> = [
  {
    id: "something-wicked",
    label: "Something Wicked",
    note: "Haunts, escape rooms, and anything that earns a nervous laugh.",
    activityTypes: ["haunted-house", "escape-room"],
    mood: 92,
  },
  {
    id: "autumn-after-dark",
    label: "Autumn After Dark",
    note: "Corn mazes, pumpkin patches, parks, and cool-air wandering.",
    activityTypes: ["corn-maze", "pumpkin-patch", "park"],
    mood: 66,
  },
  {
    id: "velvet-night",
    label: "Velvet Night",
    note: "Low light, old stories, movies, and places with atmosphere.",
    activityTypes: ["movies", "museum"],
    mood: 38,
  },
  {
    id: "full-night",
    label: "Scare, Then Settle",
    note: "One sharp thrill, then a quieter closer so the night has an arc.",
    activityTypes: ["haunted-house", "movies"],
    mood: 72,
  },
];

export const HALLOWEEN_DATE_NIGHT_TAGLINES = [
  "That's the night.",
  "October picked for you.",
  "Go while the air still feels strange.",
  "The hard part was deciding. Done.",
  "Make it a memory before November.",
  "Plans made. Let the dark do the rest.",
] as const;

/**
 * Local-calendar availability window for the Halloween Date Night layer.
 * The master feature flag can disable the whole seasonal package without
 * reverting any permanent Date Night polish.
 */
export function isHalloweenDateNightSeason(now = new Date()): boolean {
  if (!isSeasonalFeatureEnabled("halloweenDateNight")) return false;

  const month = now.getMonth() + 1;
  const day = now.getDate();
  const start = HALLOWEEN_DATE_NIGHT_START;
  const end = HALLOWEEN_DATE_NIGHT_END;

  if (month > start.month && month < end.month) return true;
  if (month === start.month && day >= start.day) return true;
  if (month === end.month && day <= end.day) return true;
  return false;
}

export function isHalloweenDateNightActive(spookySeasonEnabled: boolean, now = new Date()) {
  return spookySeasonEnabled && isHalloweenDateNightSeason(now);
}

export function isSeasonalDateNightType(type: DateNightTypeId) {
  return HALLOWEEN_DATE_NIGHT_TYPES.includes(type);
}

export function dateNightChipsForNow(spookySeasonEnabled: boolean, now = new Date()) {
  return isHalloweenDateNightActive(spookySeasonEnabled, now)
    ? [...DATE_NIGHT_TYPE_CHIPS, ...HALLOWEEN_DATE_NIGHT_CHIPS]
    : DATE_NIGHT_TYPE_CHIPS;
}

export function normalizeSeasonalDateNightFilters(
  filters: DateNightFilters,
  spookySeasonEnabled = isHalloweenDateNightSeason(),
  now = new Date(),
): DateNightFilters {
  if (isHalloweenDateNightActive(spookySeasonEnabled, now)) return filters;
  const activityTypes = filters.activityTypes.filter((type) => !HALLOWEEN_DATE_NIGHT_TYPES.includes(type));
  return {
    ...filters,
    activityTypes: activityTypes.length ? activityTypes : ["anything"],
  };
}
