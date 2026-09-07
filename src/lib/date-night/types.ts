import type { DecoratedRestaurant, DistanceMiles, Restaurant } from "@/lib/restaurants/types";

export type DateNightTypeId =
  | "anything"
  | "bowling"
  | "arcade"
  | "movies"
  | "mini-golf"
  | "escape-room"
  | "park"
  | "museum"
  | "skating";

export type ConcreteDateNightType = Exclude<DateNightTypeId, "anything">;

export interface DateNightFilters {
  radiusMiles: DistanceMiles;
  activityTypes: DateNightTypeId[];
  mood: number;
  openNowOnly: boolean;
  favoritesOnly: boolean;
  reduceParks: boolean;
}

export interface DateNightPlace extends Restaurant {
  activityTypes: ConcreteDateNightType[];
  moodLevel: 1 | 2 | 3;
}

export interface DecoratedDateNightPlace extends DecoratedRestaurant {
  activityTypes: ConcreteDateNightType[];
  moodLevel: 1 | 2 | 3;
}

export interface DateNightSearchResponse {
  venues: DateNightPlace[];
  source: "live" | "merged" | "fallback";
  warning?: string;
}

export const DEFAULT_DATE_NIGHT_FILTERS: DateNightFilters = {
  radiusMiles: 15,
  activityTypes: ["anything"],
  mood: 50,
  openNowOnly: true,
  favoritesOnly: false,
  reduceParks: true,
};

export const DATE_NIGHT_TYPE_CHIPS: ReadonlyArray<{
  id: DateNightTypeId;
  label: string;
}> = [
  { id: "anything", label: "Anything" },
  { id: "bowling", label: "Bowling" },
  { id: "arcade", label: "Arcade" },
  { id: "movies", label: "Movies" },
  { id: "mini-golf", label: "Mini Golf" },
  { id: "escape-room", label: "Escape Room" },
  { id: "park", label: "Parks" },
  { id: "museum", label: "Museum" },
  { id: "skating", label: "Skating" },
];

export const DATE_NIGHT_TAGLINES = [
  "That's the date.",
  "Plans made. Go have fun.",
  "No more scrolling for ideas.",
  "Tonight has a plan now.",
  "Go make a memory.",
  "The hard part was deciding. Done.",
] as const;

export function dateNightMoodLabel(value: number): string {
  if (value < 34) return "Cozy";
  if (value < 67) return "Playful";
  return "Adventurous";
}

export function dateNightTypeLabel(types: readonly ConcreteDateNightType[]): string {
  if (types.includes("bowling")) return "Bowling";
  if (types.includes("arcade")) return "Arcade";
  if (types.includes("movies")) return "Movies";
  if (types.includes("mini-golf")) return "Mini Golf";
  if (types.includes("escape-room")) return "Escape Room";
  if (types.includes("park")) return "Park";
  if (types.includes("museum")) return "Museum";
  if (types.includes("skating")) return "Skating";
  return "Activity";
}
