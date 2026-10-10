import { HALLOWEEN_SETTLE_TYPES, HALLOWEEN_THRILL_TYPES, HALLOWEEN_DATE_NIGHT_TYPES } from "./season";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { hasDistinctHalloweenPlanPair } from "./availability";
import type { DateNightPlace, DateNightSearchResponse, DateNightTypeId } from "./types";

export const DATE_NIGHT_HEALTHY_AUDIT_DELAY_MS = 2000;
export const DATE_NIGHT_HEALTHY_AUDIT_SPACING_MS = 2000;
export const DATE_NIGHT_ZERO_YIELD_LIMIT = 4;
export type DateNightAuditMode = "healthy" | "thin" | "recovery";
export interface DateNightAuditView {
  selectedTypes: readonly DateNightTypeId[];
  eligible: (places: DateNightPlace[]) => DateNightPlace[];
}

export function dateNightPrimaryFailed(response: DateNightSearchResponse | null, requested: readonly DateNightTypeId[], halloween: boolean) {
  if (!response?.discovery || response.source === "fallback" || response.discovery.partial) return true;
  const successful = new Set(response.discovery.groups.filter(g => g.outcome === "succeeded-empty" ||
    g.outcome === "succeeded-nonempty" || g.outcome === "cache-hit").flatMap(g => g.activityTypes));
  return normalizeDateNightActivityTypes(requested, halloween).some(t => !successful.has(t));
}

/** Small semantic predicate, not a quality score or a geographic coverage claim. */
export function dateNightHealthyPool(eligible: DateNightPlace[], selectedTypes: readonly DateNightTypeId[], halloween: boolean) {
  if (new Set(eligible.map(v => v.id)).size < 4) return false;
  const requested = normalizeDateNightActivityTypes(selectedTypes, halloween);
  const present = new Set(eligible.flatMap(v => v.activityTypes).filter(t => requested.includes(t)));
  const semantic = selectedTypes.filter(t => halloween || !HALLOWEEN_DATE_NIGHT_TYPES.includes(t));
  const anything = semantic.includes("anything") || !semantic.length;
  if (anything ? present.size < 2 : requested.some(t => !present.has(t))) return false;
  const planApplicable = halloween && requested.some(t => HALLOWEEN_THRILL_TYPES.includes(t)) &&
    requested.some(t => HALLOWEEN_SETTLE_TYPES.includes(t));
  return !planApplicable || hasDistinctHalloweenPlanPair(
    eligible.filter(v => v.activityTypes.some(t => HALLOWEEN_THRILL_TYPES.includes(t))),
    eligible.filter(v => v.activityTypes.some(t => HALLOWEEN_SETTLE_TYPES.includes(t))),
  );
}

export function dateNightIdentityIds(place: DateNightPlace) {
  return [place.id, ...(place.discoveryEvidence?.map(e => e.id) ?? [])];
}

export function rememberDateNightUsefulIdentities(places: DateNightPlace[], seen: Set<string>) {
  let additions = 0;
  for (const place of places) {
    const ids = dateNightIdentityIds(place);
    if (!ids.some(id => seen.has(id))) additions++;
    ids.forEach(id => seen.add(id));
  }
  return additions;
}
