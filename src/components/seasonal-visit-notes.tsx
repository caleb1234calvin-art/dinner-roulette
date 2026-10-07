import type { DateNightPlace } from "@/lib/date-night/types";

/** Source-scoped text only: never parse advertised activity times as Open Now. */
export function SeasonalVisitNotes({ place }: { place: Pick<DateNightPlace, "seasonalVisitNotes"> }) {
  if (!place.seasonalVisitNotes?.length) return null;
  return <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted" data-seasonal-visit-notes>
    {place.seasonalVisitNotes.map((note) => <p key={note}>{note}</p>)}
  </div>;
}
