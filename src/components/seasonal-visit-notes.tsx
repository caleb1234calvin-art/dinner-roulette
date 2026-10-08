import type { DateNightPlace } from "@/lib/date-night/types";

/** Source-scoped text only: never parse advertised activity times as Open Now. */
export function SeasonalVisitNotes({ place }: { place: Pick<DateNightPlace, "seasonalVisitNotes" | "seasonalAvailability" | "seasonalListing"> }) {
  if (!place.seasonalListing && !place.seasonalAvailability && !place.seasonalVisitNotes?.length) return null;
  return <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted" data-seasonal-visit-notes>
    <p>Check the venue for current hours, admission, and weather updates.</p>
    {place.seasonalVisitNotes?.length ? <details>
      <summary className="cursor-pointer rounded-sm font-medium text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Details</summary>
      <div className="mt-2 space-y-2">
        {place.seasonalVisitNotes.map((note) => <p key={note} className="[overflow-wrap:anywhere]">{note}</p>)}
      </div>
    </details> : null}
  </div>;
}
