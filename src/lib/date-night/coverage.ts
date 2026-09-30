import { HALLOWEEN_DATE_NIGHT_TYPES } from "./season";
import {
  dateNightTypeLabel,
  type ConcreteDateNightType,
  type DateNightFilters,
  type DateNightSearchResponse,
  type DecoratedDateNightPlace,
} from "./types";

/** Coverage describes the discovered pool in the chosen radius, before personal
 * and Open-now filters. It is deliberately separate from the eligible count. */
export function seasonalCoverage(
  places: DecoratedDateNightPlace[],
  filters: DateNightFilters,
  source: DateNightSearchResponse["source"],
  halloweenActive: boolean,
) {
  const selected = (
    filters.activityTypes.includes("anything") ? HALLOWEEN_DATE_NIGHT_TYPES : filters.activityTypes
  ).filter(
    (type): type is ConcreteDateNightType =>
      type !== "anything" && HALLOWEEN_DATE_NIGHT_TYPES.includes(type),
  );
  if (!halloweenActive || !selected.length) return null;
  const pool = places.filter(
    (place) =>
      place.distanceMiles <= filters.radiusMiles + 0.05 && place.availability.browseEligible,
  );
  const live: ConcreteDateNightType[] = [],
    savedOnly: ConcreteDateNightType[] = [],
    missing: ConcreteDateNightType[] = [];
  for (const type of selected) {
    const matches = pool.filter((place) => place.activityTypes.includes(type));
    const hasLive = matches.some((place) =>
      place.discoveryEvidence
        ? place.discoveryEvidence.some(
            (record) => record.source === "osm" && record.activityTypes.includes(type),
          )
        : place.source === "osm",
    );
    if (hasLive) live.push(type);
    else if (matches.length) savedOnly.push(type);
    else missing.push(type);
  }
  const outage = source === "fallback";
  const sparse = !outage && (missing.length > 0 || savedOnly.length > 0);
  const labels = (types: ConcreteDateNightType[]) =>
    types.map((type) => dateNightTypeLabel([type])).join(", ");
  const parts = [
    outage
      ? "Live map unavailable; using saved places."
      : live.length
        ? "Live seasonal results included."
        : "No live results for these seasonal categories.",
    savedOnly.length ? `Saved places only: ${labels(savedOnly)}.` : "",
    missing.length ? `No places found: ${labels(missing)}.` : "",
    "Coverage may be incomplete; check schedules before going.",
  ];
  return { live, savedOnly, missing, outage, sparse, text: parts.filter(Boolean).join(" ") };
}
