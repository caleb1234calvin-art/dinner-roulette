import type { ConcreteDateNightType } from "./types";

const OPTIMIZED_ICON_WIDTH = 640;
const OPTIMIZED_ICON_QUALITY = 90;

function optimizedIcon(path: string): string {
  return `/_vercel/image?url=${encodeURIComponent(path)}&w=${OPTIMIZED_ICON_WIDTH}&q=${OPTIMIZED_ICON_QUALITY}`;
}

function svgIcon(body: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2d1d1c"/><stop offset="1" stop-color="#120f10"/></linearGradient><linearGradient id="ember" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0bc82"/><stop offset=".55" stop-color="#d56a2f"/><stop offset="1" stop-color="#8a3039"/></linearGradient></defs><rect width="640" height="640" rx="128" fill="url(#bg)"/><circle cx="492" cy="146" r="68" fill="#e8b975" opacity=".22"/><g fill="none" stroke="url(#ember)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SPOOKY_HAUNTED_HOUSE_ICON = svgIcon(`
  <path d="M150 500V292l170-132 170 132v208"/>
  <path d="M225 500V368h78v132M366 328h64v70h-64zM214 282l-20-62 62 22 64-94 64 94 62-22-20 62"/>
  <path d="M95 174c38-28 70-27 96 5 27-35 57-35 90 0 32-32 64-33 101-5-43 4-68 23-78 56-18-24-39-36-65-36-26 0-47 12-64 36-11-33-37-52-80-56Z" stroke-width="18"/>
`);

const SPOOKY_CORN_MAZE_ICON = svgIcon(`
  <path d="M164 514V178M236 514V144M308 514V192M380 514V142M452 514V184"/>
  <path d="M164 228c-48-6-69-36-66-82 46 3 72 25 78 67M236 198c-48-6-69-36-66-82 46 3 72 25 78 67M308 242c-48-6-69-36-66-82 46 3 72 25 78 67M380 198c-48-6-69-36-66-82 46 3 72 25 78 67M452 234c-48-6-69-36-66-82 46 3 72 25 78 67" stroke-width="20"/>
  <path d="M122 514c48-72 92-102 132-90 35 11 58 45 91 32 34-13 53-73 151-50"/>
`);

const SPOOKY_PUMPKIN_PATCH_ICON = svgIcon(`
  <path d="M320 208c-18-58 24-92 78-90-33 24-43 54-34 91"/>
  <path d="M320 220c-126 0-206 78-206 174s80 142 206 142 206-46 206-142-80-174-206-174Z"/>
  <path d="M320 224c-76 43-88 236 0 309M320 224c76 43 88 236 0 309M236 244c-53 73-48 218 0 272M404 244c53 73 48 218 0 272" stroke-width="22"/>
  <path d="M258 370l42 26-42 24M382 370l-42 26 42 24M274 464c30 25 62 37 96 0" stroke-width="20"/>
`);

export const DATE_NIGHT_ICON_BY_TYPE: Record<ConcreteDateNightType, string> = {
  park: optimizedIcon("/date-night-icons/park.png"),
  movies: optimizedIcon("/date-night-icons/movies.png"),
  arcade: optimizedIcon("/date-night-icons/arcade.png"),
  bowling: optimizedIcon("/date-night-icons/bowling.png"),
  "mini-golf": optimizedIcon("/date-night-icons/mini-golf.png"),
  "escape-room": optimizedIcon("/date-night-icons/escape-room.png"),
  museum: optimizedIcon("/date-night-icons/museum.png"),
  skating: optimizedIcon("/date-night-icons/skating.png"),
  "haunted-house": SPOOKY_HAUNTED_HOUSE_ICON,
  "corn-maze": SPOOKY_CORN_MAZE_ICON,
  "pumpkin-patch": SPOOKY_PUMPKIN_PATCH_ICON,
};

function inferTypeFromLabel(label?: string | null): ConcreteDateNightType | null {
  const value = label?.toLowerCase() ?? "";
  if (!value) return null;
  if (value.includes("haunt") || value.includes("spook")) return "haunted-house";
  if (value.includes("corn maze") || value.includes("maize")) return "corn-maze";
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
