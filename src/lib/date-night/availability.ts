import type { DecoratedDateNightPlace } from "./types";

export type SeasonalDateStatus = "available" | "unavailable" | "unconfirmed";

export type SeasonalVenueAvailability =
  | {
      status: "confirmed";
      activeFrom?: string;
      activeUntil?: string;
      activeDates?: readonly string[];
      checkedAt: string;
      note?: string;
    }
  | {
      status: "unconfirmed";
      checkedAt: string;
      note?: string;
    };

/**
 * Curated seasonal availability is intentionally separate from weekly opening
 * hours. A weekly "Fr-Sa 19:00-24:00" rule must not make a haunt look open
 * before its season starts.
 *
 * The Werehouse window is deliberately conservative: current 2026 listings
 * identify Sep 25 as the first open date, while the venue's own site confirms
 * Friday/Saturday 7 PM-midnight hours. We stop the trusted window at Oct 31
 * rather than guessing any special post-Halloween date.
 *
 * Myer's Inn remains unconfirmed because its own site still publishes 2025
 * calendar dates. It may be shown when Open now is disabled, but it must never
 * be represented as open-now until the 2026 schedule is confirmed.
 */
export const SEASONAL_VENUE_AVAILABILITY: Readonly<Record<string, SeasonalVenueAvailability>> = {
  "date-night-werehouse-joplin": {
    status: "confirmed",
    activeFrom: "2026-09-25",
    activeUntil: "2026-10-31",
    checkedAt: "2026-09-07",
    note: "2026 season begins Sep 25; venue hours are Friday-Saturday 7 PM-midnight.",
  },
  "date-night-myers-inn-carthage": {
    status: "unconfirmed",
    checkedAt: "2026-09-07",
    note: "Official site still publishes 2025 dates; confirm the 2026 schedule before travel.",
  },
};

export function hasSeasonalAvailabilityRecord(venueId: string): boolean {
  return Boolean(SEASONAL_VENUE_AVAILABILITY[venueId]);
}

function localDateKey(now: Date): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getSeasonalDateStatus(venueId: string, now = new Date()): SeasonalDateStatus {
  const availability = SEASONAL_VENUE_AVAILABILITY[venueId];
  if (!availability || availability.status === "unconfirmed") return "unconfirmed";

  const today = localDateKey(now);
  if (availability.activeDates?.length) {
    return availability.activeDates.includes(today) ? "available" : "unavailable";
  }

  if (!availability.activeFrom && !availability.activeUntil) return "unconfirmed";
  if (availability.activeFrom && today < availability.activeFrom) return "unavailable";
  if (availability.activeUntil && today > availability.activeUntil) return "unavailable";
  return "available";
}

/**
 * Closed-for-season is always excluded. An unconfirmed seasonal calendar may
 * still be browsed when Open now is off so users can inspect it and verify the
 * schedule themselves.
 */
export function isSeasonalDateSelectable(venueId: string, now = new Date()): boolean {
  return getSeasonalDateStatus(venueId, now) !== "unavailable";
}

/**
 * "Open now" is a strict promise: unknown weekly hours fail closed, and a
 * seasonal venue additionally needs a confirmed active date.
 */
export function isDateNightOpenNowEligible(
  venue: Pick<DecoratedDateNightPlace, "id" | "hoursKnown" | "isOpen">,
  seasonal: boolean,
  now = new Date(),
): boolean {
  if (!venue.hoursKnown || !venue.isOpen) return false;
  if (!seasonal) return true;
  return getSeasonalDateStatus(venue.id, now) === "available";
}

/** A two-stop Halloween plan must contain two different real venues. */
export function hasDistinctHalloweenPlanPair<T extends { id: string }>(thrillPool: T[], settlePool: T[]): boolean {
  return thrillPool.some((thrill) => settlePool.some((settle) => settle.id !== thrill.id));
}
