import { isChristmasAppWindow } from "./christmas-overlay";
import type { ChristmasEventCategory } from "./christmas-overlay";

export const CHRISTMAS_EDITION = "christmas-2026" as const;
export const SPARKLE_VENUE_ID = "date-night-osm-way-987588580";
export const CHRISTMAS_REVIEW_URL = "https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6810772595";
export const CHRISTMAS_EVENT_KEYS = {
  "C26-001": "date-night-event-christmas-2026-sparkle-in-the-park",
  "C26-005": "date-night-event-christmas-2026-olde-world-market",
  "C26-010": "date-night-event-christmas-2026-newcaps-craft-fair",
  "C26-007": "date-night-event-christmas-2026-carthage-lighting-parade",
} as const;
export type ChristmasResearchId = keyof typeof CHRISTMAS_EVENT_KEYS;

/** Includes unknown keys in the edition namespace so invalid saved rows also
 * stay out of ordinary venue navigation and discovery. */
export function isChristmasEventKey(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("date-night-event-christmas-2026-");
}

export type ChristmasSessionLocation = {
  readonly kind: "fixed-site";
  readonly name: string;
  readonly address: string;
  readonly publicSpaces: readonly string[];
} | {
  readonly kind: "route";
  readonly name: string;
  readonly description: string;
  readonly startLocation: string;
  readonly finishTime: null;
};

export interface ChristmasAdmission {
  readonly kind: "free" | "paid";
  readonly priceUsd: number | null;
  readonly note: string;
}

/** Research, event identity, host identity and distance placement are separate. */
export interface ChristmasPilotAttraction {
  readonly edition: typeof CHRISTMAS_EDITION;
  readonly eventKey: string;
  readonly researchId: ChristmasResearchId;
  readonly eventName: string;
  readonly category: ChristmasEventCategory;
  readonly kind: "permanent-venue-display" | "temporary-event";
  readonly permanentVenueId?: string;
  readonly hostReference: string;
  readonly hostSourceRefs: readonly string[];
  readonly publicationStatus: "hold" | "accepted";
  readonly lifecycle: "scheduled" | "cancelled";
  readonly relationship: "permanent-venue-display" | "linked-event" | "fixed-site-and-route";
  readonly venue: { readonly name: string; readonly address: string; readonly publicSpaces: readonly string[] };
  readonly locations: Readonly<Record<string, ChristmasSessionLocation>>;
  readonly evidence: {
    readonly verdict: "VERIFIED";
    readonly reviewUrl: string;
    readonly checkedOn: string;
    readonly sources: readonly { readonly url: string; readonly supports: readonly string[] }[];
  };
  readonly sessions: readonly {
    readonly id: string;
    readonly locationId: string;
    readonly label: string;
    readonly dates: readonly string[];
    readonly opens: string;
    readonly closes: string | null;
    readonly admission: ChristmasAdmission;
    readonly scheduleNote: string;
    /** Includes each separately announced start, never an inferred finish. */
    readonly announcedStarts?: readonly string[];
  }[];
  readonly route: { readonly description: string; readonly startLocation: string; readonly finishTime: null } | null;
  readonly unknowns: readonly string[];
}

export interface ChristmasVenueBinding {
  readonly researchId: ChristmasResearchId;
  readonly eventKey: string;
  readonly canonicalVenueId: string;
  readonly scope: "permanent-venue-display";
  readonly reviewUrl: string;
  readonly reviewRevision: string;
  readonly checkedOn: string;
  readonly sourceObject: { readonly type: "way"; readonly id: number; readonly version: number; readonly changeset: number; readonly url: string };
  readonly expected: { readonly name: string; readonly address: string; readonly classification: "park"; readonly leisure: "park" };
  readonly supportingSources: readonly string[];
}

/** Coordinates measure distance only. They never establish identity or an entrance. */
export interface ChristmasEventPlacement {
  readonly eventKey: string;
  readonly hostReference: string;
  readonly scope: "venue-distance" | "spectator-distance";
  readonly lat: number;
  readonly lon: number;
  readonly review: { readonly status: "reviewed"; readonly revision: string; readonly reviewUrl: string; readonly checkedOn: string };
  readonly sourceRefs: readonly string[];
}

export interface ChristmasEventSnapshot {
  readonly schemaVersion: 1;
  readonly edition: typeof CHRISTMAS_EDITION;
  readonly eventKey: string;
  readonly preferenceKey: string;
  readonly kind: "permanent-venue-display" | "temporary-event";
  readonly researchId: ChristmasResearchId;
  readonly eventName: string;
  readonly category: ChristmasEventCategory;
  readonly categoryLabel: string;
  readonly host: { readonly name: string; readonly address: string; readonly sourceRefs: readonly string[]; readonly permanentVenueId?: string };
  readonly sessions: readonly {
    readonly sessionKey: string;
    readonly label: string;
    readonly date: string;
    readonly opens: string;
    readonly closes: string | null;
    readonly announcedStarts?: readonly string[];
    readonly admission: ChristmasAdmission;
    readonly scheduleNote: string;
    readonly location: ChristmasSessionLocation;
  }[];
  readonly recordedAt: string;
  readonly status: "open-now" | "closed-now" | "end-time-unknown" | "past-announced-start" | "expired";
  readonly attendanceEligible: boolean;
  readonly activeSessionKey: string | null;
  readonly actions: { readonly directions: null; readonly ticketCheckout: null; readonly parking: null; readonly accessibility: null; readonly inventory: null; readonly lastAdmission: null };
}

export function chicagoEventClock(now: Date): { day: string; time: string } | null {
  if (!Number.isFinite(now.getTime())) return null;
  const fields = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  return { day: `${fields.year}-${fields.month}-${fields.day}`, time: `${fields.hour}:${fields.minute}` };
}

function noLaterThanAnnouncedStart(now: Date, localTime: string, start: string): boolean {
  return localTime < start || (localTime === start && now.getUTCSeconds() === 0 && now.getUTCMilliseconds() === 0);
}

export function christmasSessionAvailability(attraction: ChristmasPilotAttraction, now: Date) {
  const local = chicagoEventClock(now);
  const sessions = local ? attraction.sessions.filter(session => session.dates.includes(local.day)) : [];
  const clock = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const intervalsValid = sessions.every(session => clock.test(session.opens) &&
    (session.closes === null || ((clock.test(session.closes) || session.closes === "24:00") && session.opens < session.closes)) &&
    (session.announcedStarts ?? []).every(start => clock.test(start) && start >= session.opens));
  const conflicting = sessions.some((session, index) => sessions.some((other, otherIndex) =>
    otherIndex !== index && (session.id === other.id || (session.closes !== null && other.closes !== null && session.opens < other.closes && other.opens < session.closes))));
  const browseEligible = !!local && intervalsValid && !conflicting && attraction.lifecycle !== "cancelled" &&
    sessions.some(session => session.closes === null || local.time < session.closes);
  const activeSessions = browseEligible && local ? sessions.filter(session => session.closes !== null && session.opens <= local.time && local.time < session.closes) : [];
  const openNowEligible = activeSessions.length === 1;
  const lastAnnouncedStart = sessions.flatMap(session => session.announcedStarts ?? [session.opens]).sort().at(-1) ?? null;
  const attendanceEligible = browseEligible && !!local && (sessions.some(session => session.closes !== null && local.time < session.closes) ||
    (lastAnnouncedStart !== null && noLaterThanAnnouncedStart(now, local.time, lastAnnouncedStart)));
  return {
    browseEligible, attendanceEligible, openNowEligible,
    status: openNowEligible ? "open-now" as const :
      browseEligible && !attendanceEligible ? "past-announced-start" as const :
      sessions.some(session => session.closes === null) ? "end-time-unknown" as const : "closed-now" as const,
    sessions, activeSession: activeSessions[0] ?? null,
  };
}

/** Refresh live cards after midnight, close, opt-out or resume without replacing
 * saved occurrence facts. Historical renderers additionally force attendance off. */
export function refreshChristmasEventSnapshot(snapshot: ChristmasEventSnapshot, now: Date): ChristmasEventSnapshot {
  const local = chicagoEventClock(now);
  const current = local ? snapshot.sessions.filter(session => session.date === local.day) : [];
  const validClock = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const valid = current.length > 0 && current.every(session => validClock.test(session.opens) &&
    (session.closes === null || ((validClock.test(session.closes) || session.closes === "24:00") && session.opens < session.closes)));
  const inWindow = isChristmasAppWindow(now);
  const active = local && valid && inWindow ? current.filter(session => session.closes !== null && session.opens <= local.time && local.time < session.closes) : [];
  const lastStart = current.flatMap(session => session.announcedStarts ?? [session.opens]).sort().at(-1);
  const upcomingOrOperating = !!local && valid && inWindow && current.some(session => session.closes !== null && local.time < session.closes);
  const beforeAnnounced = !!local && valid && inWindow && !!lastStart && noLaterThanAnnouncedStart(now, local.time, lastStart);
  const attendanceEligible = upcomingOrOperating || beforeAnnounced;
  const futureOccurrence = !!local && snapshot.sessions.some(session => session.date > local.day);
  const status = !inWindow || (!valid && !futureOccurrence) || (!upcomingOrOperating && current.every(session => session.closes !== null) && !futureOccurrence) ? "expired" :
    futureOccurrence && !attendanceEligible && current.every(session => session.closes !== null) ? "closed-now" :
    active.length === 1 ? "open-now" : !attendanceEligible ? "past-announced-start" :
      current.some(session => session.closes === null) ? "end-time-unknown" : "closed-now";
  return { ...snapshot, status, attendanceEligible, activeSessionKey: active.length === 1 ? active[0].sessionKey : null,
    actions: { directions: null, ticketCheckout: null, parking: null, accessibility: null, inventory: null, lastAdmission: null } };
}
