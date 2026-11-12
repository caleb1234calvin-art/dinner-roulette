import type { HomeMode } from "../nightlife/types";
import type { RestaurantPreference, SearchLocation, TemporaryExclusion } from "../restaurants/types";
import { haversineMiles } from "../restaurants/geo";
import { isChristmasAppWindow } from "./christmas-overlay";
import { CHRISTMAS_2026_PILOT } from "./christmas-pilot-catalog";
import { CHRISTMAS_EDITION, CHRISTMAS_EVENT_KEYS, SPARKLE_VENUE_ID, chicagoEventClock, christmasSessionAvailability } from "./christmas-pilot-model";
import type { ChristmasEventPlacement, ChristmasEventSnapshot, ChristmasPilotAttraction, ChristmasVenueBinding } from "./christmas-pilot-model";
import { REVIEWED_CHRISTMAS_BINDINGS, resolveChristmasParkBinding } from "./christmas-binding";
import { eligibleChristmasChoices } from "./christmas-picker";
import type { ChristmasChoice, ChristmasPickableChoice, ChristmasSelection } from "./christmas-picker";
import { seasonalIdentityPreference } from "./identity-preferences";
import type { DateNightFilters, DecoratedDateNightPlace } from "./types";

interface EventChoiceBase extends ChristmasPickableChoice {
  readonly selectionKey: string;
  readonly preferenceKey: string;
  readonly eventKey: string;
  readonly distanceMiles: number;
  readonly moodLevel: 1 | 2 | 3;
  readonly presentation: ChristmasEventSnapshot;
}
export type ChristmasPilotChoice = EventChoiceBase & (
  { readonly kind: "permanent-venue-display"; readonly venue: DecoratedDateNightPlace } |
  { readonly kind: "temporary-event"; readonly venue?: never }
);
export type ChristmasCandidateChoice = ChristmasChoice | ChristmasPilotChoice;
export function isChristmasPilotChoice(choice: ChristmasPickableChoice): choice is ChristmasPilotChoice {
  return "kind" in choice && (choice.kind === "permanent-venue-display" || choice.kind === "temporary-event");
}

export const CHRISTMAS_CATEGORY_LABELS = {
  "christmas-lights": "Christmas Lights",
  "holiday-market": "Holiday Market",
  "holiday-craft-fair": "Holiday Craft Fair",
  "holiday-community-event": "Holiday Community Event",
} as const;

export interface ChristmasPilotInput {
  readonly venues: readonly DecoratedDateNightPlace[];
  readonly filters: DateNightFilters;
  readonly selectedCategories: readonly ChristmasSelection[];
  readonly now: Date;
  readonly homeMode: HomeMode;
  readonly location: SearchLocation;
  readonly christmasEnabled?: boolean;
  readonly halloweenActive?: boolean;
  readonly preferences?: Record<string, RestaurantPreference>;
  readonly exclusions?: TemporaryExclusion[];
  readonly bindings?: readonly ChristmasVenueBinding[];
}
export interface IsolatedChristmasPilotInput extends ChristmasPilotInput {
  readonly attractions?: readonly ChristmasPilotAttraction[];
  readonly placements?: readonly ChristmasEventPlacement[];
}
export interface ChristmasPilotResult {
  choices: ChristmasCandidateChoice[];
  scheduleOnlyChoices: ChristmasPilotChoice[];
  bindingBlockers: { researchId: ChristmasPilotAttraction["researchId"]; code: string; reason: string }[];
  bindings: { researchId: ChristmasPilotAttraction["researchId"]; state: string; reason: string }[];
}

function httpsUrl(value: string) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
function validLocation(location: Pick<SearchLocation, "lat" | "lon"> | null | undefined) {
  return !!location && Number.isFinite(location.lat) && Math.abs(location.lat) <= 90 && Number.isFinite(location.lon) && Math.abs(location.lon) <= 180;
}
function placementAgrees(placement: ChristmasEventPlacement, attraction: ChristmasPilotAttraction) {
  return placement.eventKey === attraction.eventKey && placement.hostReference === attraction.hostReference &&
    placement.scope === (attraction.relationship === "fixed-site-and-route" ? "spectator-distance" : "venue-distance") &&
    validLocation(placement) && placement.review?.status === "reviewed" && typeof placement.review.revision === "string" && !!placement.review.revision.trim() &&
    httpsUrl(placement.review.reviewUrl) && /^2026-\d{2}-\d{2}$/.test(placement.review.checkedOn) &&
    Array.isArray(placement.sourceRefs) && placement.sourceRefs.length > 0 && placement.sourceRefs.every(ref => attraction.hostSourceRefs.includes(ref));
}
function eventSnapshot(attraction: ChristmasPilotAttraction, now: Date, preferenceKey: string): ChristmasEventSnapshot {
  const availability = christmasSessionAvailability(attraction, now);
  const day = chicagoEventClock(now)!.day;
  const sessionKey = (id: string, date = day) => `${attraction.eventKey}/${id}/${date}`;
  // One market identity has two admissions. A Friday save must retain the
  // Saturday terms, while recordedAt/activeSessionKey preserve the visit itself.
  const occurrences = attraction.researchId === "C26-005"
    ? attraction.sessions.flatMap(session => session.dates.map(date => ({ session, date })))
    : availability.sessions.map(session => ({ session, date: day }));
  return {
    schemaVersion: 1, edition: CHRISTMAS_EDITION, eventKey: attraction.eventKey, preferenceKey,
    kind: attraction.kind, researchId: attraction.researchId, eventName: attraction.eventName,
    category: attraction.category, categoryLabel: CHRISTMAS_CATEGORY_LABELS[attraction.category],
    host: { name: attraction.venue.name, address: attraction.venue.address, sourceRefs: attraction.hostSourceRefs,
      ...(attraction.permanentVenueId ? { permanentVenueId: attraction.permanentVenueId } : {}) },
    sessions: occurrences.map(({ session, date }) => ({
      sessionKey: sessionKey(session.id, date), label: session.label, date, opens: session.opens, closes: session.closes,
      announcedStarts: session.announcedStarts, admission: session.admission, scheduleNote: session.scheduleNote,
      location: attraction.locations[session.locationId],
    })),
    recordedAt: now.toISOString(), status: availability.status, attendanceEligible: availability.attendanceEligible,
    activeSessionKey: availability.activeSession ? sessionKey(availability.activeSession.id) : null,
    actions: { directions: null, ticketCheckout: null, parking: null, accessibility: null, inventory: null, lastAdmission: null },
  };
}

function resolve(input: IsolatedChristmasPilotInput, isolated: boolean): ChristmasPilotResult {
  const { venues, filters, now } = input;
  const preferences = input.preferences ?? {};
  const exclusions = input.exclusions ?? [];
  const bindingBlockers: ChristmasPilotResult["bindingBlockers"] = [];
  const bindingResults: ChristmasPilotResult["bindings"] = [];
  const empty = { choices: [], scheduleOnlyChoices: [], bindingBlockers, bindings: bindingResults };
  if (input.homeMode !== "date-night" || !Number.isFinite(now.getTime())) return empty;
  const attractions = isolated ? input.attractions ?? CHRISTMAS_2026_PILOT : CHRISTMAS_2026_PILOT;
  const published = attractions.filter(attraction => isolated || attraction.publicationStatus === "accepted");
  const enabled = input.christmasEnabled !== false && isChristmasAppWindow(now) && published.length > 0;
  // Ordinary selections are stored independently; a retained holiday chip cannot
  // suppress ordinary Date Night after opt-out, expiry or publication HOLD.
  const selectedCategories = enabled ? input.selectedCategories : filters.activityTypes;
  const ordinary = eligibleChristmasChoices(venues, filters, selectedCategories, [], now,
    preferences, [...exclusions], false, input.halloweenActive ?? false);
  if (!enabled) return { ...empty, choices: ordinary };
  const selected = new Set(selectedCategories);
  const anything = !selected.size || selected.has("anything");
  const choices: ChristmasPilotChoice[] = [];
  const scheduleOnlyChoices: ChristmasPilotChoice[] = [];
  const reserved = new Set<string>();
  const bindings = input.bindings ?? REVIEWED_CHRISTMAS_BINDINGS;
  const placements = isolated ? input.placements ?? [] : [];
  const eventKeys = new Set<string>();
  const block = (attraction: ChristmasPilotAttraction, code: string, reason: string) => bindingBlockers.push({ researchId: attraction.researchId, code, reason });

  for (const attraction of published) {
    if (eventKeys.has(attraction.eventKey) || attractions.filter(event => event.eventKey === attraction.eventKey).length !== 1) {
      block(attraction, "conflicting-event", "Duplicate event identity requires review."); continue;
    }
    eventKeys.add(attraction.eventKey);
    if (attraction.edition !== CHRISTMAS_EDITION || !/^date-night-event-christmas-2026-[a-z0-9-]+$/.test(attraction.eventKey) ||
        attraction.lifecycle !== "scheduled" || attraction.evidence.verdict !== "VERIFIED" ||
        attraction.sessions.some(session => !attraction.locations[session.locationId])) {
      block(attraction, "missing-event-evidence", "Edition, lifecycle, research verdict or session location evidence is missing."); continue;
    }
    if (!validLocation(input.location)) {
      block(attraction, "invalid-location", "A valid search origin is required for radius-based event recommendations."); continue;
    }
    if (!Number.isFinite(filters.radiusMiles) || filters.radiusMiles < 0) {
      block(attraction, "invalid-radius", "A finite nonnegative radius is required for event recommendations."); continue;
    }
    let parent: DecoratedDateNightPlace | undefined;
    let distanceMiles: number;
    let preferenceKey: string;
    if (attraction.kind === "permanent-venue-display") {
      if (attraction.researchId !== "C26-001" || attraction.eventKey !== CHRISTMAS_EVENT_KEYS["C26-001"] ||
          attraction.permanentVenueId !== SPARKLE_VENUE_ID || attraction.hostReference !== "osm:way:987588580" ||
          attraction.eventName !== "Sparkle in the Park" || attraction.venue.name !== "Central Park") {
        block(attraction, "conflicting-review", "Only Sparkle's reviewed Central Park relationship may use the permanent-venue display model."); continue;
      }
      const binding = resolveChristmasParkBinding(venues, bindings);
      bindingResults.push({ researchId: attraction.researchId, state: binding.state, reason: binding.reason });
      if (!binding.venue || binding.state !== "bound" || attraction.permanentVenueId !== binding.venue.id) {
        block(attraction, binding.state, binding.reason); continue;
      }
      parent = binding.venue;
      distanceMiles = parent.distanceMiles;
      preferenceKey = parent.id;
      if (parent.lifecycle || !parent.availability.browseEligible || parent.availability.season !== "ordinary") continue;
    } else {
      if (bindings.some(binding => binding.researchId === attraction.researchId)) {
        block(attraction, "binding-not-applicable", "This is an independent temporary event; an ordinary venue binding cannot replace its reviewed host."); continue;
      }
      bindingResults.push({ researchId: attraction.researchId, state: "independent-event", reason: "Temporary event identity is independent of ordinary host discovery." });
      const possible = placements.filter(placement => placement.eventKey === attraction.eventKey);
      if (!possible.length) { block(attraction, "missing-placement", "No independently reviewed distance or spectator placement is available."); continue; }
      if (possible.length !== 1 || !placementAgrees(possible[0], attraction) || !validLocation(input.location)) {
        block(attraction, "invalid-placement", "Distance placement is conflicting, unreviewed or does not match this event's documented host/site."); continue;
      }
      distanceMiles = haversineMiles(input.location.lat, input.location.lon, possible[0].lat, possible[0].lon);
      preferenceKey = attraction.eventKey;
      // An optional permanent association is never used as the event preference
      // key, but affirmatively bound host restrictions still veto attendance.
      if (attraction.permanentVenueId) {
        const host = venues.find(venue => venue.id === attraction.permanentVenueId);
        const hostPref = host ? seasonalIdentityPreference(host, preferences) : { neverRecommend: preferences[attraction.permanentVenueId]?.neverRecommend, ids: [attraction.permanentVenueId] };
        if (host?.lifecycle || hostPref.neverRecommend || exclusions.some(item => hostPref.ids.includes(item.restaurantId) && item.expiresAt > now.getTime())) continue;
      }
    }
    if (!Number.isFinite(distanceMiles) || distanceMiles < 0 || distanceMiles > filters.radiusMiles + 0.05) continue;
    const pref = parent ? seasonalIdentityPreference(parent, preferences) : {
      ids: [preferenceKey], favorite: !!preferences[preferenceKey]?.favorite, neverRecommend: !!preferences[preferenceKey]?.neverRecommend,
    };
    if (pref.neverRecommend || (filters.favoritesOnly && !pref.favorite) || exclusions.some(item => pref.ids.includes(item.restaurantId) && item.expiresAt > now.getTime())) continue;
    const availability = christmasSessionAvailability(attraction, now);
    if (!availability.browseEligible) continue;
    const categorySelected = anything || selected.has(attraction.category);
    if (parent && (categorySelected || attraction.kind === "permanent-venue-display")) reserved.add(parent.id);
    if (!categorySelected || (filters.openNowOnly && !availability.openNowEligible)) continue;
    const base = {
      selectionKey: preferenceKey, preferenceKey, eventKey: attraction.eventKey, distanceMiles,
      moodLevel: parent?.moodLevel ?? 2 as const, categories: [attraction.category],
      presentation: eventSnapshot(attraction, now, preferenceKey),
    };
    const choice: ChristmasPilotChoice = parent
      ? { ...base, kind: "permanent-venue-display", venue: parent }
      : { ...base, kind: "temporary-event" };
    if (availability.attendanceEligible) choices.push(choice); else scheduleOnlyChoices.push(choice);
  }
  return { choices: [...choices, ...ordinary.filter(choice => !reserved.has(choice.venue.id))], scheduleOnlyChoices, bindingBlockers, bindings: bindingResults };
}

/** Public path: all four catalog publication gates currently remain HOLD. */
export function buildChristmasPilotCandidate(input: ChristmasPilotInput): ChristmasPilotResult {
  return resolve(input, false);
}
/** Explicit isolated review entry point. Never enabled by URL, storage or env. */
export function buildIsolatedChristmasPilotCandidate(input: IsolatedChristmasPilotInput): ChristmasPilotResult {
  return resolve(input, true);
}
