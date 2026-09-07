import type { ConcreteDateNightType } from "./types";

const OPTIMIZED_ICON_WIDTH = 640;
const OPTIMIZED_ICON_QUALITY = 90;

function optimizedIcon(path: string): string {
  return `/_vercel/image?url=${encodeURIComponent(path)}&w=${OPTIMIZED_ICON_WIDTH}&q=${OPTIMIZED_ICON_QUALITY}`;
}

export const DATE_NIGHT_ICON_BY_TYPE: Record<ConcreteDateNightType, string> = {
  park: optimizedIcon("/date-night-icons/park.png"),
  movies: optimizedIcon("/date-night-icons/movies.png"),
  arcade: optimizedIcon("/date-night-icons/arcade.png"),
  bowling: optimizedIcon("/date-night-icons/bowling.png"),
  "mini-golf": optimizedIcon("/date-night-icons/mini-golf.png"),
  "escape-room": optimizedIcon("/date-night-icons/escape-room.png"),
  museum: optimizedIcon("/date-night-icons/museum.png"),
  skating: optimizedIcon("/date-night-icons/skating.png"),
  "haunted-house": optimizedIcon("/date-night-icons/escape-room.png"),
  "corn-maze": optimizedIcon("/date-night-icons/park.png"),
  "pumpkin-patch": optimizedIcon("/date-night-icons/park.png"),
};

function inferTypeFromLabel(label?: string | null): ConcreteDateNightType | null {
  const value = label?.toLowerCase() ?? "";
  if (!value) return null;
  if (value.includes("haunt") || value.includes("spook")) return "haunted-house";
  if (value.includes("corn maze") || value.includes("maze")) return "corn-maze";
  if (value.includes("pumpkin")) return "pumpkin-patch";
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
