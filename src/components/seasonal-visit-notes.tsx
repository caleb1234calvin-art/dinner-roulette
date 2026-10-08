import type { DateNightPlace } from "@/lib/date-night/types";
import { seasonalPresentation, SEASONAL_CONFIDENCE_LABELS, SEASONAL_VISITOR_NOTICE } from "@/lib/date-night/seasonal-presentation";

/** Only reviewed visitor copy is rendered. Raw audit notes remain non-consumer data. */
export function SeasonalVisitNotes({ place }: { place: Pick<DateNightPlace, "id" | "seasonalVisitNotes" | "seasonalAvailability" | "seasonalListing"> }) {
  if (!place.seasonalListing && !place.seasonalAvailability && !place.seasonalVisitNotes?.length) return null;
  const presentation = seasonalPresentation(place);
  return <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted" data-seasonal-visit-notes>
    <p>{SEASONAL_VISITOR_NOTICE}</p>
    <span className="block font-medium" data-seasonal-confidence>{SEASONAL_CONFIDENCE_LABELS[presentation.confidence]}</span>
    <details>
      <summary className="cursor-pointer rounded-sm font-medium text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Details</summary>
      <div className="mt-2 space-y-2">
        {presentation.details.map((note) => <p key={note} className="[overflow-wrap:anywhere]">{note}</p>)}
      </div>
    </details>
  </div>;
}
