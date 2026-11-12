import type { ChristmasPilotChoice } from "./christmas-pilot";
import type { DecoratedDateNightPlace } from "./types";

/** A UI transport record, never an ordinary provider result. The snapshot is
 * authoritative for every event field; the canonical parent remains untouched.
 * Coordinates, links and ordinary hours deliberately carry no navigation data. */
export function toChristmasEventRecord(choice: ChristmasPilotChoice): DecoratedDateNightPlace {
  const snapshot = choice.presentation;
  const open = snapshot.status === "open-now" && snapshot.attendanceEligible;
  const bounded = snapshot.sessions.every(session => session.closes !== null);
  const active = snapshot.sessions.find(session => session.sessionKey === snapshot.activeSessionKey);
  return {
    id: choice.preferenceKey, name: snapshot.eventName,
    lat: Number.NaN, lon: Number.NaN, address: snapshot.host.address,
    cuisines: [], cuisineLabel: snapshot.categoryLabel, priceLevel: null,
    rating: null, reviewCount: null, openingHours: null, phone: null, website: null,
    isChain: false, photoKey: "cafe", source: "catalog",
    distanceMiles: choice.distanceMiles, isOpen: open, hoursKnown: bounded,
    closesLabel: active?.closes ?? null, closingSoon: false,
    activityTypes: [], moodLevel: choice.moodLevel, dateNightEvent: snapshot,
    availability: {
      status: open ? "open-now" : bounded ? "closed-now" : "hours-unknown",
      season: snapshot.status === "expired" ? "finished" : "active",
      label: open ? "Open now" : bounded ? "See event schedule" : "Finish time unknown",
      browseEligible: snapshot.attendanceEligible, openNowEligible: open,
      revalidationDue: false,
    },
  };
}
