import { hasSavedChristmasEvent, sanitizeChristmasEventSnapshot } from "./christmas-saved";
import { chicagoEventClock } from "./christmas-pilot-model";
import type { DecoratedDateNightPlace } from "./types";

/** Preference identity deliberately joins Sparkle to the permanent park and
 * both market admissions to one event. An open UI choice needs a stricter key:
 * its event facts and the dated occurrence the user actually selected.
 * Runtime status, refresh time and active/open state may change within that
 * same occurrence without silently choosing a different presentation. */
export function dateNightSelectionKey(place: DecoratedDateNightPlace): string | null {
  if (!hasSavedChristmasEvent(place)) return JSON.stringify(["ordinary", place.id]);
  const event = sanitizeChristmasEventSnapshot(place.dateNightEvent, place.id);
  if (!event) return null;
  const local = chicagoEventClock(new Date(event.recordedAt));
  if (!local) return null;
  const today = event.sessions.filter(session => session.date === local.day);
  const bounded = today.filter(session => session.closes !== null && local.time < session.closes)
    .sort((a, b) => a.opens.localeCompare(b.opens));
  const admission = bounded.find(session => session.opens <= local.time) ?? bounded[0];
  // A bounded admission retains its own identity before and during opening.
  // Announced square/parade starts form one explicitly displayed outing; none
  // invent an operating interval or become an inferred "active" admission.
  const occurrence = admission ? [admission.sessionKey] :
    today.filter(session => session.closes === null).map(session => session.sessionKey).sort();
  if (!occurrence.length) return null;
  return JSON.stringify([
    "event", event.edition, event.kind, event.eventKey, event.preferenceKey,
    occurrence, event.eventName, event.category, event.categoryLabel, event.host,
    event.sessions,
  ]);
}

/** Return only a refreshed copy of the same selected presentation/occurrence.
 * A shared permanent ID must never turn an event into ordinary Directions. */
export function reconcileDateNightSelection(
  selected: DecoratedDateNightPlace,
  eligible: readonly DecoratedDateNightPlace[],
): DecoratedDateNightPlace | null {
  const key = dateNightSelectionKey(selected);
  if (key === null) return null;
  return eligible.find(place => dateNightSelectionKey(place) === key) ?? null;
}

export function reconcileDateNightSelections(
  selected: readonly DecoratedDateNightPlace[],
  eligible: readonly DecoratedDateNightPlace[],
): DecoratedDateNightPlace[] {
  return selected.map(place => reconcileDateNightSelection(place, eligible))
    .filter((place): place is DecoratedDateNightPlace => place !== null);
}

/** Only event selections retire irreversibly. Ordinary discovery keeps its
 * existing transient-loss behavior: hide the missing result, then refresh the
 * same ordinary selection if that venue returns. */
export function retainDateNightSelectionState(
  selected: readonly DecoratedDateNightPlace[],
  eligible: readonly DecoratedDateNightPlace[],
): DecoratedDateNightPlace[] {
  return selected.filter(place => !hasSavedChristmasEvent(place) || reconcileDateNightSelection(place, eligible) !== null);
}
