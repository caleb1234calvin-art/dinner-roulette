import {
  DATE_NIGHT_TYPE_CHIPS,
  type DateNightTypeId,
} from "./types";

/** Inclusive local-season window for the Halloween Date Night experiment. */
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
  { id: "haunted-house", label: "Haunted House" },
  { id: "corn-maze", label: "Corn Maze" },
  { id: "pumpkin-patch", label: "Pumpkin Patch" },
];

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
  if (!isHalloweenDateNightSeason(now)) return DATE_NIGHT_TYPE_CHIPS;
  return [...DATE_NIGHT_TYPE_CHIPS, ...HALLOWEEN_DATE_NIGHT_CHIPS];
}
