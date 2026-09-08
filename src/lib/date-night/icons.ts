import type { ConcreteDateNightType } from "./types";

function glossyIcon(body: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#171717"/>
      <stop offset=".52" stop-color="#111111"/>
      <stop offset="1" stop-color="#0c0c0c"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#6d6d72"/>
      <stop offset=".5" stop-color="#3b3b40"/>
      <stop offset="1" stop-color="#77777d"/>
    </linearGradient>
    <linearGradient id="subject" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#d7d7dc"/>
      <stop offset=".28" stop-color="#9a9aa1"/>
      <stop offset=".55" stop-color="#5d5d64"/>
      <stop offset=".78" stop-color="#8b8b92"/>
      <stop offset="1" stop-color="#d0d0d6"/>
    </linearGradient>
    <linearGradient id="highlight" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#ffffff" stop-opacity=".74"/>
      <stop offset=".45" stop-color="#ffffff" stop-opacity=".13"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="softGlow" cx="50%" cy="50%" r="55%">
      <stop stop-color="#ffffff" stop-opacity=".14"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
    <filter id="subjectShadow" x="-35%" y="-35%" width="170%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#000000" flood-opacity=".72"/>
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffffff" flood-opacity=".12"/>
    </filter>
  </defs>
  <rect x="30" y="30" width="580" height="580" rx="132" fill="url(#tile)"/>
  <rect x="42" y="42" width="556" height="556" rx="122" fill="none" stroke="url(#edge)" stroke-width="12"/>
  <ellipse cx="320" cy="320" rx="235" ry="235" fill="url(#softGlow)" opacity=".65" filter="url(#soft)"/>
  <g filter="url(#subjectShadow)" fill="url(#subject)" stroke="#f3eee9" stroke-opacity=".28" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">${body}</g>
  <path d="M104 108c86-46 344-46 432 0" fill="none" stroke="url(#highlight)" stroke-width="22" stroke-linecap="round" opacity=".38"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PARK_ICON = glossyIcon(`
  <path d="M190 430h260v42H190z"/>
  <path d="M220 430v92M420 430v92" fill="none"/>
  <path d="M160 388c0-58 38-102 90-102 6-70 54-116 116-116 61 0 106 43 114 104 46 8 80 48 80 96 0 53-41 96-92 96H244c-46 0-84-35-84-78Z"/>
  <path d="M330 286v186" fill="none"/>
`);

const MOVIES_ICON = glossyIcon(`
  <path d="M166 284h308v224H166z"/>
  <path d="M146 202l314-62 24 112-314 62z"/>
  <path d="M202 191l56 94M292 174l56 94M382 156l56 94" fill="none"/>
  <path d="M182 344h276" fill="none"/>
`);

const ARCADE_ICON = glossyIcon(`
  <path d="M186 304c-10 0-20 8-22 18l-28 150c-8 44 42 70 72 38l66-70h92l66 70c30 32 80 6 72-38l-28-150c-2-10-12-18-22-18H186Z"/>
  <path d="M224 352v76M186 390h76" fill="none"/>
  <circle cx="406" cy="370" r="18"/>
  <circle cx="448" cy="410" r="18"/>
`);

const BOWLING_ICON = glossyIcon(`
  <path d="M218 178c-28 44-38 92-18 140l22 46h72l22-46c20-48 10-96-18-140-10-16-28-26-40-26s-30 10-40 26Z"/>
  <path d="M336 170c-24 42-32 86-14 130l20 44h64l20-44c18-44 10-88-14-130-10-16-24-24-38-24s-28 8-38 24Z"/>
  <path d="M146 212c-20 40-26 78-10 116l18 40h56l18-40c16-38 10-76-10-116-8-14-22-22-32-22s-24 8-40 22Z"/>
  <circle cx="330" cy="432" r="116"/>
  <circle cx="292" cy="390" r="15" fill="#181615" stroke="none"/>
  <circle cx="342" cy="374" r="15" fill="#181615" stroke="none"/>
  <circle cx="366" cy="424" r="15" fill="#181615" stroke="none"/>
`);

const MINI_GOLF_ICON = glossyIcon(`
  <path d="M236 150v288" fill="none"/>
  <path d="M236 160l182 62-182 62z"/>
  <path d="M132 494c98-52 194-42 286 18" fill="none"/>
  <circle cx="404" cy="474" r="28"/>
  <ellipse cx="236" cy="452" rx="62" ry="24" fill="#151816"/>
`);

const ESCAPE_ROOM_ICON = glossyIcon(`
  <path d="M192 142h256v360H192z"/>
  <path d="M244 196h152v250H244z" fill="#151816"/>
  <circle cx="360" cy="326" r="20"/>
  <path d="M360 344v52" fill="none"/>
  <path d="M448 274h72v104h-72" fill="none"/>
`);

const MUSEUM_ICON = glossyIcon(`
  <path d="M120 252l200-116 200 116H120Z"/>
  <path d="M154 290h332M168 448h304M144 486h352" fill="none"/>
  <path d="M190 288v160M260 288v160M330 288v160M400 288v160M470 288v160" fill="none"/>
`);

const SKATING_ICON = glossyIcon(`
  <path d="M176 174h176l56 152-84 58H174l-34-58 36-152Z"/>
  <path d="M202 214h116M220 252h116M238 290h112" fill="none"/>
  <path d="M170 394h252c26 0 46 20 46 46H148c0-26 10-46 22-46Z"/>
  <circle cx="214" cy="474" r="42"/>
  <circle cx="384" cy="474" r="42"/>
`);

const HAUNTED_HOUSE_ICON = glossyIcon(`
  <path d="M162 490V300l158-126 158 126v190H162Z"/>
  <path d="M232 490V374h72v116M362 332h60v66h-60z" fill="#151816"/>
  <path d="M118 198c38-30 72-28 98 6 28-36 62-36 96 0 34-34 68-36 106-6-48 6-78 26-90 60-20-24-42-36-68-36-28 0-52 12-70 36-12-34-36-54-72-60Z"/>
`);

const CORN_MAZE_ICON = glossyIcon(`
  <path d="M162 500V184M236 500V148M310 500V196M384 500V150M458 500V188" fill="none"/>
  <path d="M162 232c-46-6-68-34-64-80 42 2 68 24 76 64M236 204c-46-6-68-34-64-80 42 2 68 24 76 64M310 246c-46-6-68-34-64-80 42 2 68 24 76 64M384 204c-46-6-68-34-64-80 42 2 68 24 76 64M458 236c-46-6-68-34-64-80 42 2 68 24 76 64" fill="none"/>
  <path d="M124 500c52-70 100-96 144-82 42 14 60 50 102 34 38-14 56-68 146-46" fill="none"/>
`);

const PUMPKIN_PATCH_ICON = glossyIcon(`
  <path d="M320 218c-16-54 22-88 72-86-30 22-40 50-30 86" fill="none"/>
  <path d="M320 224c-120 0-200 72-200 166 0 92 80 140 200 140s200-48 200-140c0-94-80-166-200-166Z"/>
  <path d="M320 230c-72 42-82 228 0 296M320 230c72 42 82 228 0 296M238 248c-48 68-44 210 0 264M402 248c48 68 44 210 0 264" fill="none"/>
`);

export const DATE_NIGHT_ICON_BY_TYPE: Record<ConcreteDateNightType, string> = {
  park: PARK_ICON,
  movies: MOVIES_ICON,
  arcade: ARCADE_ICON,
  bowling: BOWLING_ICON,
  "mini-golf": MINI_GOLF_ICON,
  "escape-room": ESCAPE_ROOM_ICON,
  museum: MUSEUM_ICON,
  skating: SKATING_ICON,
  "haunted-house": HAUNTED_HOUSE_ICON,
  "corn-maze": CORN_MAZE_ICON,
  "pumpkin-patch": PUMPKIN_PATCH_ICON,
};

const HALLOWEEN_DATE_NIGHT_ICON_BY_TYPE: Partial<Record<ConcreteDateNightType, string>> = {
  park: "/date-night-icons/grok_1788905177823.jpg",
  "corn-maze": "/date-night-icons/grok_1788905180227.jpg",
  "pumpkin-patch": "/date-night-icons/grok_1788905184073.jpg",
  "escape-room": "/date-night-icons/grok_1788905187785.jpg",
  "mini-golf": "/date-night-icons/grok_1788905190727.jpg",
  museum: "/date-night-icons/grok_1788905196749.jpg",
  "haunted-house": "/date-night-icons/grok_1788905199846.jpg",
  bowling: "/date-night-icons/grok_1788905202767.jpg",
  skating: "/date-night-icons/grok_1788905205875.jpg",
  arcade: "/date-night-icons/grok_1788905208616.jpg",
  movies: "/date-night-icons/grok_1788905211949.jpg",
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
  halloween?: boolean;
}): string | null {
  const primary = input.activityTypes?.[0] ?? inferTypeFromLabel(input.cuisineLabel);
  if (!primary) return null;
  if (input.halloween) return HALLOWEEN_DATE_NIGHT_ICON_BY_TYPE[primary] ?? DATE_NIGHT_ICON_BY_TYPE[primary];
  return DATE_NIGHT_ICON_BY_TYPE[primary];
}
