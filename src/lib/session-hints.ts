const HINT_SEEN_KEY = "dinner-roulette-hint-seen";
export const HINTS_RESET_EVENT = "dinner-roulette:hints-reset";

export function hasSeenHint(): boolean {
  if (typeof window === "undefined") return true;
  return window.sessionStorage.getItem(HINT_SEEN_KEY) === "1";
}

export function markHintSeen(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(HINT_SEEN_KEY, "1");
}

export function resetHints(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(HINT_SEEN_KEY);
  window.dispatchEvent(new Event(HINTS_RESET_EVENT));
}
