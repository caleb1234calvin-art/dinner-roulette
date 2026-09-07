import type { ConcreteDateNightType } from "./types";

export const DATE_NIGHT_ICON_BY_TYPE: Record<ConcreteDateNightType, string> = {
  park: "/date-night-icons/park.png",
  movies: "/date-night-icons/movies.png",
  arcade: "/date-night-icons/arcade.png",
  bowling: "/date-night-icons/bowling.png",
  "mini-golf": "/date-night-icons/mini-golf.png",
  "escape-room": "/date-night-icons/escape-room.png",
  museum: "/date-night-icons/museum.png",
  skating: "/date-night-icons/skating.png",
};

function inferTypeFromLabel(label?: string | null): ConcreteDateNightType | null {
  const value = label?.toLowerCase() ?? "";
  if (!value) return null;
  if (value.includes("bowling")) return "bowling";
  if (value.includes("arcade") || value.includes("game")) return "arcade";
  if (value.includes("drive-in") || value.includes("movie") || value.includes("cinema")) return "movies";
  if (value.includes("mini golf") || value.includes("miniature golf")) return "mini-golf";
  if (value.includes("escape")) return "escape-room";
  if (value.includes("museum")) return "museum";
  if (value.includes("skating") || value.includes("roller") || value.includes("ice rink")) return "skating";
  if (value.includes("park") || value.includes("disc golf")) return "park";
  return null;
}

export function isDateNightRecord(restaurantId?: string | null): boolean {
  return Boolean(restaurantId?.startsWith("date-night-"));
}

export function getDateNightIcon(input: {
  activityTypes?: readonly ConcreteDateNightType[] | null;
  cuisineLabel?: string | null;
}): string | null {
  const primary = input.activityTypes?.[0] ?? inferTypeFromLabel(input.cuisineLabel);
  return primary ? DATE_NIGHT_ICON_BY_TYPE[primary] : null;
}
