import type { ChristmasEventCategory } from "./christmas-overlay";

export type ChristmasResearchId = "C26-001" | "C26-005" | "C26-010" | "C26-007";

/** Research facts, not permanent places or navigation authority. No recurrence
 * beyond the explicitly evidenced dates and no guessed editorial expiry. */
export interface ChristmasPilotAttraction {
  readonly researchId: ChristmasResearchId;
  readonly eventName: string;
  readonly category: ChristmasEventCategory;
  readonly relationship: "permanent-venue-display" | "linked-event" | "fixed-site-and-route";
  readonly venue: {
    readonly name: string;
    readonly address: string;
    readonly publicSpaces: readonly string[];
  };
  readonly evidence: {
    readonly verdict: "VERIFIED";
    readonly reviewUrl: string;
    readonly checkedOn: string;
    readonly sources: readonly { readonly url: string; readonly supports: readonly string[] }[];
  };
  readonly sessions: readonly {
    readonly id: string;
    readonly label: string;
    readonly dates: readonly string[];
    readonly opens: string;
    /** null is a start-only announcement, never a machine Open Now interval. */
    readonly closes: string | null;
    readonly admission: {
      readonly kind: "free" | "paid";
      readonly priceUsd: number | null;
      readonly note: string;
    };
    readonly scheduleNote: string;
  }[];
  readonly route: {
    readonly description: string;
    readonly startLocation: string;
    readonly finishTime: null;
  } | null;
  readonly unknowns: readonly string[];
}

/** Explicit post-merge binding supplied by a separate identity review. The pilot
 * intentionally ships no guessed OSM IDs, coordinates, or name-based matching. */
export interface ChristmasVenueBinding {
  readonly researchId: ChristmasResearchId;
  readonly canonicalVenueId: string;
  readonly reviewUrl: string;
}

export function chicagoEventClock(now: Date): { day: string; time: string } | null {
  if (!Number.isFinite(now.getTime())) return null;
  const fields = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(now).map(({ type, value }) => [type, value]),
  );
  return { day: `${fields.year}-${fields.month}-${fields.day}`, time: `${fields.hour}:${fields.minute}` };
}

export function christmasSessionAvailability(attraction: ChristmasPilotAttraction, now: Date) {
  const local = chicagoEventClock(now);
  const sessions = local ? attraction.sessions.filter(session => session.dates.includes(local.day)) : [];
  const clock = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const intervalsValid = sessions.every(session => clock.test(session.opens) &&
    (session.closes === null || ((clock.test(session.closes) || session.closes === "24:00") && session.opens < session.closes)));
  const conflicting = sessions.some((session, index) => sessions.some((other, otherIndex) =>
    otherIndex !== index && (session.id === other.id ||
      (session.closes !== null && other.closes !== null && session.opens < other.closes && other.opens < session.closes))));
  const browseEligible = !!local && intervalsValid && !conflicting &&
    sessions.some(session => session.closes === null || local.time < session.closes);
  const activeSessions = browseEligible && local
    ? sessions.filter(session => session.closes !== null && session.opens <= local.time && local.time < session.closes)
    : [];
  const openNowEligible = activeSessions.length === 1;
  return {
    browseEligible,
    openNowEligible,
    status: openNowEligible ? "open-now" as const :
      sessions.some(session => session.closes === null) ? "end-time-unknown" as const : "closed-now" as const,
    // Do not flatten gala/market price or fill the overnight gap.
    sessions,
    activeSession: activeSessions[0] ?? null,
  };
}
