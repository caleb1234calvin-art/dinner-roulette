import type { DateNightPlace, DecoratedDateNightPlace } from "./types";

export type SeasonalDateStatus = "available" | "unavailable" | "unconfirmed";
export type SeasonalVenueAvailability = {
  status: "confirmed" | "unconfirmed" | "not-operating";
  activeFrom?: string;
  activeUntil?: string;
  activeDates?: readonly string[];
  checkedAt: string;
  revalidateAfter?: string;
  sourceUrls?: readonly string[];
  note?: string;
};

/** Existing anchors only. Evidence: original audit reference-event-metadata.json
 * and reference-source-retrievals.json, fetched 2026-09-30 UTC / Sep 29 Chicago.
 * Dates expire after this season; never roll a past calendar into a new year.
 * Recheck operator calendars before each season and when revalidateAfter passes.
 */
export const SEASONAL_VENUE_AVAILABILITY: Readonly<Record<string, SeasonalVenueAvailability>> = {
  "date-night-werehouse-joplin": {
    status: "confirmed", activeFrom: "2026-09-25", activeUntil: "2026-10-31",
    checkedAt: "2026-09-29", revalidateAfter: "2026-10-31",
    sourceUrls: ["https://thewerehouse.net/", "https://www.missourihauntedhouses.com/halloween/haunted-house-joplin.html"],
    note: "Operator weekly hours and current directory season corroborated by the retained audit retrievals.",
  },
  "date-night-myers-inn-carthage": {
    status: "confirmed", activeFrom: "2026-10-02", activeUntil: "2026-10-31",
    activeDates: ["2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10", "2026-10-16", "2026-10-17", "2026-10-23", "2026-10-24", "2026-10-30", "2026-10-31"],
    checkedAt: "2026-09-29", revalidateAfter: "2026-10-31",
    sourceUrls: ["https://www.myersinnhaunt.com/"],
    note: "Ten October 2026 dates in the operator calendar, retained in original audit evidence. Verify changes before travel.",
  },
};

export type DateNightAvailabilityStatus = "open-now" | "closed-now" | "hours-unknown" |
  "schedule-unconfirmed" | "upcoming-season" | "finished-season" | "not-operating-season" |
  "permanently-closed" | "disused";
export interface DateNightAvailability {
  status: DateNightAvailabilityStatus;
  season: "ordinary" | "unconfirmed" | "upcoming" | "active" | "finished" | "not-operating";
  label: string;
  browseEligible: boolean;
  openNowEligible: boolean;
  checkedAt?: string;
  revalidationDue: boolean;
}

export function hasSeasonalAvailabilityRecord(venueId: string): boolean {
  return Boolean(SEASONAL_VENUE_AVAILABILITY[venueId]);
}

function localDateKey(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function calendarState(record: SeasonalVenueAvailability | undefined, now: Date) {
  const today = localDateKey(now);
  const dates = record?.activeDates?.slice().sort();
  const from = record?.activeFrom ?? dates?.[0];
  const until = record?.activeUntil ?? dates?.[dates.length - 1];
  const priorYear = Boolean(until && until.slice(0, 4) < today.slice(0, 4));
  const expired = Boolean(record?.revalidateAfter && today > record.revalidateAfter);
  const due = !record || priorYear || expired || record.checkedAt.slice(0, 4) !== today.slice(0, 4);
  // A known ended season remains ended for its year; next year needs new evidence.
  if (record?.status === "confirmed" && until && today > until && !priorYear) return { season: "finished" as const, dateOpen: false, due };
  // Revalidation can become due without supplying evidence of renewed operation.
  if (record?.status === "not-operating") return { season: "not-operating" as const, dateOpen: false, due };
  if (due || !record || record.status === "unconfirmed") return { season: "unconfirmed" as const, dateOpen: false, due };
  // Both ends (or explicit dates) are required; generic opening/start dates do not
  // establish a current seasonal calendar.
  if (!from || !until) return { season: "unconfirmed" as const, dateOpen: false, due: true };
  if (today < from) return { season: "upcoming" as const, dateOpen: false, due };
  return { season: "active" as const, dateOpen: !dates?.length || dates.includes(today), due };
}

export function getSeasonalDateStatus(venueId: string, now = new Date()): SeasonalDateStatus {
  const state = calendarState(SEASONAL_VENUE_AVAILABILITY[venueId], now);
  if (state.season === "unconfirmed") return "unconfirmed";
  return state.season === "active" && state.dateOpen ? "available" : "unavailable";
}

/** OFF retains upcoming, closed-today and unknown schedules, never ended or disused. */
export function isSeasonalDateSelectable(venueId: string, now = new Date()): boolean {
  const { season } = calendarState(SEASONAL_VENUE_AVAILABILITY[venueId], now);
  return season !== "finished" && season !== "not-operating";
}

export function getDateNightAvailability(
  venue: Pick<DateNightPlace, "id"> & Partial<Pick<DateNightPlace, "activityTypes" | "lifecycle" | "seasonalAvailability">> &
    Pick<DecoratedDateNightPlace, "hoursKnown" | "isOpen">,
  now = new Date(),
): DateNightAvailability {
  const seasonal = venue.activityTypes?.some((type) => ["haunted-house", "corn-maze", "pumpkin-patch"].includes(type)) ?? false;
  const record = venue.seasonalAvailability ?? SEASONAL_VENUE_AVAILABILITY[venue.id];
  const calendar = calendarState(record, now);
  const season = seasonal ? calendar.season : "ordinary";
  let status: DateNightAvailabilityStatus;
  if (venue.lifecycle) status = venue.lifecycle;
  else if (season === "finished") status = "finished-season";
  else if (season === "not-operating") status = "not-operating-season";
  else if (season === "upcoming") status = "upcoming-season";
  else if (season === "unconfirmed") status = "schedule-unconfirmed";
  else if (seasonal && !calendar.dateOpen) status = "closed-now";
  else if (!venue.hoursKnown) status = "hours-unknown";
  else status = venue.isOpen ? "open-now" : "closed-now";
  const labels: Record<DateNightAvailabilityStatus, string> = {
    "open-now": "Open now", "closed-now": "Closed now", "hours-unknown": "Hours unknown",
    "schedule-unconfirmed": "Schedule unconfirmed", "upcoming-season": "Season upcoming",
    "finished-season": "Season ended", "not-operating-season": "Not operating this season",
    "permanently-closed": "Permanently closed", disused: "No longer operating",
  };
  return {
    status, season, label: labels[status],
    browseEligible: !["finished-season", "not-operating-season", "permanently-closed", "disused"].includes(status),
    openNowEligible: status === "open-now", checkedAt: seasonal ? record?.checkedAt : undefined,
    revalidationDue: seasonal && calendar.due,
  };
}

/** Strict ON requires known hours AND a confirmed active seasonal date. */
export function isDateNightOpenNowEligible(
  venue: Pick<DecoratedDateNightPlace, "id" | "hoursKnown" | "isOpen"> & Partial<Pick<DateNightPlace, "lifecycle" | "seasonalAvailability">>,
  seasonal: boolean,
  now = new Date(),
): boolean {
  return getDateNightAvailability({ ...venue, activityTypes: seasonal ? ["haunted-house"] : [] }, now).openNowEligible;
}

export function dateNightStatusLabel(venue: DecoratedDateNightPlace): string {
  return venue.availability?.label ?? (venue.hoursKnown ? venue.isOpen ? "Open now" : "Closed now" : "Hours unknown");
}

/** A two-stop Halloween plan must contain two different real venues. */
export function hasDistinctHalloweenPlanPair<T extends { id: string }>(thrillPool: T[], settlePool: T[]): boolean {
  return thrillPool.some((thrill) => settlePool.some((settle) => settle.id !== thrill.id));
}
