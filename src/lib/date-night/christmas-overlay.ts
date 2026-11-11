import type { HomeMode } from "../nightlife/types";
import type { DateNightAvailability } from "./availability";
import type { ConcreteDateNightType, DecoratedDateNightPlace } from "./types";

// Fixed product calendar: both midnights are in America/Chicago for this edition.
const CHRISTMAS_START = Date.parse("2026-11-27T00:00:00-06:00");
const CHRISTMAS_END = Date.parse("2027-01-01T00:00:00-06:00");

export interface ChristmasOverlay {
  readonly overlayId: `christmas-2026/${string}`;
  readonly parentVenueId: string;
  // A reviewer must establish a venue-wide identity with the same visitor access.
  // A separately operated/ticketed event or distinct entrance cannot rename the parent.
  readonly association: "venue-wide" | "linked-event";
  readonly eventName: string;
  readonly evidence: {
    readonly status: "confirmed" | "partial" | "unconfirmed" | "not-operating";
    readonly operatorSources: readonly string[];
    readonly reviewRevision: string;
    readonly checkedOn: string; // YYYY-MM-DD in the event time zone
    readonly validThrough: string; // inclusive editorial review deadline
  };
  readonly timeZone: string;
  readonly occurrences: readonly {
    readonly date: string; // an explicitly reviewed operating day
    // Complete same-day admission windows [opens, closes), in local HH:mm.
    // null means hours/last admission are insufficient for Open Now.
    readonly hours: readonly { readonly opens: string; readonly closes: string }[] | null;
  }[];
}

export type ChristmasEventCategory =
  | "christmas-lights"
  | "holiday-market"
  | "holiday-craft-fair"
  | "holiday-community-event";
export type DateNightPresentationCategory = ConcreteDateNightType | ChristmasEventCategory;

export function isChristmasAppWindow(now: Date) {
  const instant = now.getTime();
  return instant >= CHRISTMAS_START && instant < CHRISTMAS_END;
}
export function dateNightCategoryWeight(category: DateNightPresentationCategory, reduceParks: boolean) {
  return category === "park" && reduceParks ? 0.08 : 1;
}

interface PresentationContext {
  homeMode: HomeMode;
  now: Date;
  christmasEnabled?: boolean; // automatic unless opted out; no persisted state here
}

interface BasePresentation {
  baseVenueId: string;
  displayName: string;
  categoryLabel: string;
  venueAvailability: DateNightAvailability;
  // This foundation has no independently reviewed event navigation targets.
  directionsTarget: null;
}

export type DateNightPresentation = BasePresentation &
  (
    | {
        overlayApplied: false;
        effectiveCategory: ConcreteDateNightType | null;
        iconKey: ConcreteDateNightType | null;
        eventAvailability: null;
      }
    | {
        overlayApplied: true;
        overlayId: ChristmasOverlay["overlayId"];
        effectiveCategory: "christmas-lights";
        iconKey: "christmas-lights";
        evidence: ChristmasOverlay["evidence"];
        eventAvailability: { status: "open-now" | "closed-now" | "hours-unknown"; openNowEligible: boolean };
      }
  );

function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

function isOperatorUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function eventClock(now: Date, timeZone: string) {
  if (!timeZone?.trim()) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const fields = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return { day: `${fields.year}-${fields.month}-${fields.day}`, time: `${fields.hour}:${fields.minute}` };
  } catch {
    return null;
  }
}

function eventStatus(overlay: ChristmasOverlay, now: Date) {
  const { evidence } = overlay;
  if (
    overlay.association !== "venue-wide" ||
    evidence.status !== "confirmed" ||
    !/^christmas-2026\/[a-z0-9][a-z0-9-]*$/.test(overlay.overlayId) ||
    !overlay.eventName.trim() ||
    !evidence.reviewRevision.trim() ||
    !evidence.operatorSources.length ||
    !evidence.operatorSources.every(isOperatorUrl) ||
    !validDate(evidence.checkedOn) ||
    !evidence.checkedOn.startsWith("2026-") ||
    !validDate(evidence.validThrough)
  )
    return null;

  const local = eventClock(now, overlay.timeZone);
  if (!local || local.day < evidence.checkedOn || local.day > evidence.validThrough) return null;
  const today = overlay.occurrences.filter((occurrence) => occurrence.date === local.day);
  if (today.length !== 1) return null; // Off-day, upcoming or conflicting schedule.

  const hours = today[0].hours;
  const clock = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (
    !hours?.length ||
    !hours.every(
      ({ opens, closes }) =>
        clock.test(opens) && (clock.test(closes) || closes === "24:00") && opens < closes,
    )
  )
    return "hours-unknown";
  if (hours.some(({ opens, closes }) => opens <= local.time && local.time < closes)) return "open-now";
  // Browse today's future window, including between sessions. Once today's
  // final admission window ends, restore the ordinary venue immediately.
  return hours.some(({ opens }) => local.time < opens) ? "closed-now" : null;
}

/** Resolve after ordinary identity merge. Never insert a row, union activity types,
 * persist this view, or use ordinary venue hours to decide event admission. */
export function resolveDateNightPresentation(
  venue: DecoratedDateNightPlace,
  context: PresentationContext,
  overlays: readonly ChristmasOverlay[],
): DateNightPresentation {
  const category = venue.activityTypes[0] ?? null;
  const base: BasePresentation = {
    baseVenueId: venue.id,
    displayName: venue.name,
    categoryLabel: venue.cuisineLabel,
    venueAvailability: venue.availability,
    directionsTarget: null,
  };
  const ordinary: DateNightPresentation = {
    ...base,
    overlayApplied: false,
    effectiveCategory: category,
    iconKey: category,
    eventAvailability: null,
  };
  if (
    context.homeMode !== "date-night" ||
    context.christmasEnabled === false ||
    !isChristmasAppWindow(context.now) ||
    venue.lifecycle ||
    venue.availability.season !== "ordinary" ||
    !venue.availability.browseEligible
  )
    return ordinary;

  const associated = overlays.filter((overlay) => overlay.parentVenueId === venue.id);
  // Conflicting revisions (including negative evidence) need editorial resolution.
  if (new Set(associated.map((overlay) => overlay.overlayId)).size !== associated.length) return ordinary;
  let selected: DateNightPresentation = ordinary;
  for (const overlay of associated) {
    const status = eventStatus(overlay, context.now);
    if (!status) continue;
    if (selected.overlayApplied) return ordinary; // Multiple active venue identities are ambiguous.
    selected = {
      ...base,
      displayName: overlay.eventName,
      categoryLabel: "Christmas Lights",
      overlayApplied: true,
      overlayId: overlay.overlayId,
      effectiveCategory: "christmas-lights",
      iconKey: "christmas-lights",
      evidence: overlay.evidence,
      eventAvailability: { status, openNowEligible: status === "open-now" },
    };
  }
  return selected;
}
