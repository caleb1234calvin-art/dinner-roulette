import { DATE_NIGHT_TYPE_CHIPS, type DateNightFilters, type DateNightTypeId } from "./types";

export const HALLOWEEN_DATE_NIGHT_START = { month: 9, day: 1 } as const;
export const HALLOWEEN_DATE_NIGHT_END = { month: 11, day: 2 } as const;

export const HALLOWEEN_DATE_NIGHT_TYPES: readonly DateNightTypeId[] = [
  "haunted-house",
  "corn-maze",
  "pumpkin-patch",
];

export const HALLOWEEN_DATE_NIGHT_CHIPS: ReadonlyArray<{
  id: DateNightTypeId;
  label: string;
}> = [
  { id: "haunted-house", label: "Haunted" },
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
];

/**
 * Local-calendar gate for the experimental Halloween Date Night skin.
 * It begins in September for planning and ends after the Halloween weekend.
 */
export function isHalloweenDateNightSeason(now = new Date()): boolean {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const start = HALLOWEEN_DATE_NIGHT_START;
  const end = HALLOWEEN_DATE_NIGHT_END;

  if (month > start.month && month < end.month) return true;
  if (month === start.month && day >= start.day) return true;
  if (month === end.month && day <= end.day) return true;
  return false;
}

export function dateNightChipsForNow(now = new Date()) {
  return isHalloweenDateNightSeason(now)
    ? [...DATE_NIGHT_TYPE_CHIPS, ...HALLOWEEN_DATE_NIGHT_CHIPS]
    : DATE_NIGHT_TYPE_CHIPS;
}

export function normalizeSeasonalDateNightFilters(
  filters: DateNightFilters,
  now = new Date(),
): DateNightFilters {
  if (isHalloweenDateNightSeason(now)) return filters;
  const activityTypes = filters.activityTypes.filter(
    (type) => !HALLOWEEN_DATE_NIGHT_TYPES.includes(type),
  );
  return {
    ...filters,
    activityTypes: activityTypes.length ? activityTypes : ["anything"],
  };
}
