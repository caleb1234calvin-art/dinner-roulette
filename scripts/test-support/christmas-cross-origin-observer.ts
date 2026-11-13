import { createDateNightRadialSession as createActualSession } from "@cross-origin/actual-radial-session";
import { decorateDateNight } from "@/lib/date-night/eligibility";
import { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } from "@/lib/date-night/christmas-binding";
import { buildChristmasPilotCandidate, buildIsolatedChristmasPilotCandidate, isChristmasPilotChoice } from "@/lib/date-night/christmas-pilot";
import { DEFAULT_DATE_NIGHT_FILTERS } from "@/lib/date-night/types";
export { dateNightRadialProgress, DATE_NIGHT_RADIAL_PAUSE_MS, DATE_NIGHT_RADIAL_SUCCESS_PAUSE_MS,
  DATE_NIGHT_RADIAL_MIN_OUTER_START_MS, DATE_NIGHT_RADIAL_FAILURE_LIMIT } from "@cross-origin/actual-radial-session";

export const updates: unknown[] = [];
export let actualSessionFactoryCalls = 0;
// Read-only instrumentation: the real session receives the original acquisition
// and forwards its original update object to Home. No cache/source/choice field
// is added, removed or substituted by this observer.
export function createDateNightRadialSession(...args: Parameters<typeof createActualSession>) {
  actualSessionFactoryCalls += 1;
  const actual = createActualSession(...args);
  return {
    ...actual,
    update(acquisition: Parameters<typeof actual.update>[0], callbacks: Parameters<typeof actual.update>[1]) {
      return actual.update(acquisition, { ...callbacks, onChange(state: Parameters<typeof callbacks.onChange>[0]) {
        const now = new Date();
        const location = { lat: acquisition.lat, lon: acquisition.lon, label: "Synthetic review origin", source: "manual" as const };
        const venues = decorateDateNight(state.response?.venues ?? [], location, now);
        const input = { venues, location, filters: { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15 as const,
          activityTypes: ["movies", "park"] as const, openNowOnly: false, reduceParks: false },
          selectedCategories: ["christmas-lights"] as const, now, homeMode: "date-night" as const,
          christmasEnabled: true, halloweenActive: false };
        const isolated = buildIsolatedChristmasPilotCandidate({ ...input, placements: [] });
        const park = state.response?.venues.find(venue => venue.id === "date-night-osm-way-987588580");
        updates.push({ acquisition: structuredClone(acquisition), binding: resolveChristmasParkBinding(venues, REVIEWED_CHRISTMAS_BINDINGS).state,
          complete: state.coverage.complete, loading: state.loading, expanding: state.expanding, paused: state.paused,
          publicEvents: buildChristmasPilotCandidate(input).choices.filter(isChristmasPilotChoice).length,
          isolatedEvents: isolated.choices.filter(isChristmasPilotChoice).map(choice => ({ eventKey: choice.eventKey,
            selectionKey: choice.selectionKey, activeSessionKey: choice.presentation.activeSessionKey })),
          parkPresent: Boolean(park), parkEvidence: park?.discoveryEvidence?.map(item => item.sourceIdentity).filter(Boolean),
          schoolSelectable: state.response?.venues.some(venue => venue.activityTypes.some(type => String(type) === "school")) ?? false });
        callbacks.onChange(state);
      } });
    },
  };
}
