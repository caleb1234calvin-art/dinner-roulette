import type { ChristmasEventCategory } from "./christmas-overlay";
import type { ChristmasSelection } from "./christmas-picker";
import {
  CHRISTMAS_EVENT_KEYS,
  SPARKLE_VENUE_ID,
  chicagoEventClock,
  type ChristmasEventSnapshot,
  type ChristmasResearchId,
} from "./christmas-pilot-model";
import { DATE_NIGHT_TYPE_CHIPS, type DateNightTypeId } from "./types";
import { HALLOWEEN_DATE_NIGHT_TYPES } from "./season";

const categories: readonly ChristmasEventCategory[] = [
  "christmas-lights", "holiday-market", "holiday-craft-fair", "holiday-community-event",
];
const ordinaryTypes: readonly DateNightTypeId[] = [
  ...DATE_NIGHT_TYPE_CHIPS.map(chip => chip.id), ...HALLOWEEN_DATE_NIGHT_TYPES,
];
const states = ["open-now", "closed-now", "end-time-unknown", "past-announced-start", "expired"] as const;
const text = (value: unknown, maximum = 2000): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= maximum && [...value].every(character => {
    const code = character.charCodeAt(0);
    return code >= 32 || code === 9 || code === 10 || code === 13;
  });
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const date = (value: unknown): value is string => text(value, 10) && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const clock = (value: unknown): value is string => typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
const strings = (value: unknown, maximum = 32): value is string[] =>
  Array.isArray(value) && value.length <= maximum && value.every(item => text(item));
function https(value: unknown): value is string {
  if (!text(value, 4096)) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function isChristmasEventPreferenceKey(value: unknown): value is string {
  return typeof value === "string" && /^date-night-event-christmas-\d{4}-/.test(value);
}

/** A malformed saved event must never fall through to ordinary host Directions. */
export function hasSavedChristmasEvent(value: unknown): boolean {
  return object(value) && (value.dateNightEvent !== undefined || value.dateNightEventUnavailable === true ||
    isChristmasEventPreferenceKey(value.restaurantId) || isChristmasEventPreferenceKey(value.id));
}

/** Saved display facts are historical records, never current admission, identity
 * review, publication or navigation authority. Reject mismatched event keys and
 * rebuild the object explicitly so unknown fields cannot smuggle capabilities. */
export function sanitizeChristmasEventSnapshot(value: unknown, expectedPreferenceKey?: string): ChristmasEventSnapshot | null {
  if (!object(value) || value.schemaVersion !== 1 || value.edition !== "christmas-2026") return null;
  const researchId = value.researchId as ChristmasResearchId;
  if (!Object.hasOwn(CHRISTMAS_EVENT_KEYS, researchId)) return null;
  const eventKey = CHRISTMAS_EVENT_KEYS[researchId];
  const expectedCategory: Record<ChristmasResearchId, ChristmasEventCategory> = {
    "C26-001": "christmas-lights", "C26-005": "holiday-market", "C26-010": "holiday-craft-fair", "C26-007": "holiday-community-event",
  };
  const permanent = researchId === "C26-001";
  const preferenceKey = permanent ? SPARKLE_VENUE_ID : eventKey;
  if (value.eventKey !== eventKey || value.preferenceKey !== preferenceKey ||
      (expectedPreferenceKey !== undefined && expectedPreferenceKey !== preferenceKey) ||
      value.kind !== (permanent ? "permanent-venue-display" : "temporary-event") ||
      !text(value.eventName, 250) || !text(value.categoryLabel, 100) ||
      value.category !== expectedCategory[researchId] ||
      !text(value.recordedAt, 64) || !/^\d{4}-\d{2}-\d{2}T/.test(value.recordedAt) || !Number.isFinite(Date.parse(value.recordedAt)) ||
      !states.includes(value.status as typeof states[number]) || !object(value.host) ||
      !text(value.host.name, 250) || !text(value.host.address, 500) || !Array.isArray(value.host.sourceRefs) ||
      value.host.sourceRefs.length === 0 || value.host.sourceRefs.length > 32 || !value.host.sourceRefs.every(https) ||
      (permanent && value.host.permanentVenueId !== SPARKLE_VENUE_ID) ||
      (value.host.permanentVenueId !== undefined && !text(value.host.permanentVenueId, 200)) ||
      !Array.isArray(value.sessions) || value.sessions.length === 0 || value.sessions.length > 16) return null;

  const sessions: ChristmasEventSnapshot["sessions"][number][] = [];
  for (const item of value.sessions) {
    if (!object(item) || !text(item.sessionKey, 300) || !date(item.date) || !clock(item.opens) ||
        !(item.closes === null || (typeof item.closes === "string" && (clock(item.closes) || item.closes === "24:00") && item.opens < item.closes)) ||
        (item.announcedStarts !== undefined && (!Array.isArray(item.announcedStarts) || item.announcedStarts.length > 16 ||
          !item.announcedStarts.every(start => clock(start) && start >= (item.opens as string)))) ||
        !item.sessionKey.startsWith(`${eventKey}/`) || !item.sessionKey.endsWith(`/${item.date}`) ||
        !/^[a-z0-9-]+$/.test(item.sessionKey.slice(eventKey.length + 1, -item.date.length - 1)) ||
        !text(item.label, 250) || !text(item.scheduleNote) || !object(item.admission) ||
        !(item.admission.kind === "free" || item.admission.kind === "paid") ||
        !(item.admission.priceUsd === null || (typeof item.admission.priceUsd === "number" && Number.isFinite(item.admission.priceUsd) && item.admission.priceUsd >= 0 && item.admission.priceUsd <= 100000)) ||
        (item.admission.kind === "free" && item.admission.priceUsd !== 0) || !text(item.admission.note) || !object(item.location)) return null;
    let location: ChristmasEventSnapshot["sessions"][number]["location"];
    if (item.location.kind === "fixed-site" && text(item.location.name, 250) && text(item.location.address, 500) && strings(item.location.publicSpaces)) {
      location = { kind: "fixed-site", name: item.location.name, address: item.location.address, publicSpaces: [...item.location.publicSpaces] };
    } else if (item.location.kind === "route" && text(item.location.name, 250) && text(item.location.description) && text(item.location.startLocation, 500) && item.location.finishTime === null) {
      location = { kind: "route", name: item.location.name, description: item.location.description, startLocation: item.location.startLocation, finishTime: null };
    } else return null;
    if (sessions.some(session => session.sessionKey === item.sessionKey)) return null;
    sessions.push({
      sessionKey: item.sessionKey, label: item.label, date: item.date, opens: item.opens, closes: item.closes,
      ...(Array.isArray(item.announcedStarts) ? { announcedStarts: [...item.announcedStarts] as string[] } : {}),
      admission: { kind: item.admission.kind, priceUsd: item.admission.priceUsd, note: item.admission.note },
      scheduleNote: item.scheduleNote, location,
    });
  }
  const activeSessionKey = typeof value.activeSessionKey === "string" && sessions.some(session => session.sessionKey === value.activeSessionKey)
    ? value.activeSessionKey : null;
  return {
    schemaVersion: 1, edition: "christmas-2026", eventKey, preferenceKey,
    kind: permanent ? "permanent-venue-display" : "temporary-event", researchId,
    eventName: value.eventName, category: value.category as ChristmasEventCategory, categoryLabel: value.categoryLabel,
    host: { name: value.host.name, address: value.host.address, sourceRefs: [...value.host.sourceRefs],
      ...(value.host.permanentVenueId ? { permanentVenueId: value.host.permanentVenueId } : {}) },
    sessions, recordedAt: value.recordedAt, status: value.status as typeof states[number],
    activeSessionKey, attendanceEligible: false,
    actions: { directions: null, ticketCheckout: null, parking: null, accessibility: null, inventory: null, lastAdmission: null },
  };
}

/** Refresh descriptive schedule status without replacing the original recordedAt
 * or activeSessionKey. A Friday gala visit retains its paid admission context
 * even when its saved event also contains Saturday's separately dated market. */
export function savedChristmasEventPresentation(value: unknown, now: Date): ChristmasEventSnapshot | null {
  const snapshot = sanitizeChristmasEventSnapshot(value);
  if (!snapshot) return null;
  const local = chicagoEventClock(now);
  const today = local ? snapshot.sessions.filter(session => session.date === local.day) : [];
  const open = local ? today.filter(session => session.closes !== null && session.opens <= local.time && local.time < session.closes) : [];
  const future = !!local && snapshot.sessions.some(session => session.date > local.day ||
    (session.date === local.day && session.opens > local.time));
  const unknown = today.filter(session => session.closes === null);
  const lastStart = unknown.flatMap(session => session.announcedStarts ?? [session.opens]).sort().at(-1);
  let status: ChristmasEventSnapshot["status"] = "expired";
  if (open.length) status = "open-now";
  else if (unknown.length && local) status = lastStart && (local.time > lastStart ||
    (local.time === lastStart && (now.getUTCSeconds() > 0 || now.getUTCMilliseconds() > 0))) ? "past-announced-start" : "end-time-unknown";
  else if (future) status = "closed-now";
  return { ...snapshot, status, attendanceEligible: false };
}

export function sanitizeOrdinaryDateNightTypes(raw: unknown, fallback: readonly DateNightTypeId[] = ["anything"]): DateNightTypeId[] {
  const valid = Array.isArray(raw) ? [...new Set(raw.filter((type): type is DateNightTypeId => ordinaryTypes.includes(type as DateNightTypeId)))] : [];
  if (!valid.length) return [...fallback];
  return valid.includes("anything") ? ["anything"] : valid;
}

export function sanitizeChristmasSelections(raw: unknown): ChristmasSelection[] {
  const allowed: readonly string[] = [...ordinaryTypes, ...categories];
  const valid = Array.isArray(raw) ? [...new Set(raw.filter((type): type is ChristmasSelection => typeof type === "string" && allowed.includes(type)))] : [];
  return !valid.length || valid.includes("anything") ? ["anything"] : valid;
}

/** Preserve legacy record fields while removing executable/unreviewed event
 * additions. The unavailable marker prevents unsafe ordinary UI fallback. */
export function sanitizeSavedChristmasMetadata<T extends { restaurantId: string; dateNightEvent?: ChristmasEventSnapshot; dateNightEventUnavailable?: true }>(record: T, expectedPreferenceKey = record.restaurantId): T {
  if (!hasSavedChristmasEvent(record)) return record;
  const snapshot = record.restaurantId === expectedPreferenceKey ? sanitizeChristmasEventSnapshot(record.dateNightEvent, expectedPreferenceKey) : null;
  const { dateNightEvent: _old, dateNightEventUnavailable: _unavailable, ...ordinary } = record;
  return { ...ordinary, ...(snapshot ? { dateNightEvent: snapshot } : { dateNightEventUnavailable: true as const }) } as T;
}
