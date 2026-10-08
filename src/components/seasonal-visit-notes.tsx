import type { DateNightPlace } from "@/lib/date-night/types";
import { seasonalPresentation, SEASONAL_CONFIDENCE_LABELS, SEASONAL_VISITOR_NOTICE } from "@/lib/date-night/seasonal-presentation";

/** Only reviewed visitor copy is rendered. Raw audit notes remain non-consumer data. */
export function SeasonalVisitNotes({ place }: { place: Pick<DateNightPlace, "id" | "seasonalVisitNotes" | "seasonalAvailability" | "seasonalListing"> }) {
  if (!place.seasonalListing && !place.seasonalAvailability && !place.seasonalVisitNotes?.length) return null;
  const presentation = seasonalPresentation(place);
  return <div className="mt-1 text-xs leading-tight text-muted" data-seasonal-visit-notes>
    <p className="text-[11px] leading-[14px]">{SEASONAL_VISITOR_NOTICE}</p>
    <details>
      <summary className="flex min-h-6 cursor-pointer items-center justify-between gap-1 rounded-sm text-[10px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <span className="whitespace-nowrap" data-seasonal-confidence>{SEASONAL_CONFIDENCE_LABELS[presentation.confidence]}</span>
        <span className="shrink-0 text-fg">Details</span>
      </summary>
      <div className="mt-1 space-y-2 text-xs leading-relaxed">
        {presentation.details.map((note) => <p key={note} className="[overflow-wrap:anywhere]">{note}</p>)}
      </div>
    </details>
  </div>;
}
