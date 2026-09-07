export type MainMode = "dinner" | "nightlife" | "date-night";

const PREFIX = "dinner-roulette-hint-seen:";
export const HINTS_RESET_EVENT = "dinner-roulette:hints-reset";

function keyFor(mode: MainMode): string {
  return `${PREFIX}${mode}`;
}

export function hasSeenModeHint(mode: MainMode): boolean {
  if (typeof window === "undefined") return true;
  return window.sessionStorage.getItem(keyFor(mode)) === "1";
}

export function markModeHintSeen(mode: MainMode): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(keyFor(mode), "1");
}

export function resetModeHints(): void {
  if (typeof window === "undefined") return;
  (["dinner", "nightlife", "date-night"] as const).forEach((mode) => {
    window.sessionStorage.removeItem(keyFor(mode));
  });
  window.dispatchEvent(new Event(HINTS_RESET_EVENT));
}
