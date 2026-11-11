import type { HomeMode } from "../nightlife/types";

// The owner's 2026 Christmas product window uses Chicago midnight, not the
// device's current timezone or an individual event's operating schedule.
export const CHRISTMAS_ATMOSPHERE_START = Date.parse("2026-11-27T00:00:00-06:00");
export const CHRISTMAS_ATMOSPHERE_END = Date.parse("2027-01-01T00:00:00-06:00");

/** Cosmetic-only gate. The optional enabled argument is for a future opt-out;
 * this candidate deliberately does not add or persist a preference. */
export function isChristmasAtmosphereEnabled(mode: HomeMode, now: Date, enabled = true): boolean {
  const epoch = now.getTime();
  return (
    mode === "date-night" &&
    enabled &&
    Number.isFinite(epoch) &&
    epoch >= CHRISTMAS_ATMOSPHERE_START &&
    epoch < CHRISTMAS_ATMOSPHERE_END
  );
}
