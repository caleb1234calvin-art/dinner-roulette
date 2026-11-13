import { useEffect, useState } from "react";
import { ChristmasEventDialog } from "@/components/christmas-event-dialog";
import { MapPinned, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedFooter } from "@/components/unified-footer";
import { ChristmasEventActions, ChristmasEventDetails } from "@/components/christmas-event-details";
import { refreshChristmasEventSnapshot } from "@/lib/date-night/christmas-pilot-model";
import { hasSavedChristmasEvent, sanitizeChristmasEventSnapshot } from "@/lib/date-night/christmas-saved";
import { useDateNightClock } from "@/lib/date-night/use-clock";
import { dateNightStatusLabel } from "@/lib/date-night/availability";
import type { DecoratedDateNightPlace } from "@/lib/date-night/types";
import { directionsUrl } from "@/lib/location/maps";

export function ChristmasEventPlan({ plan, onClose, onReplan }: {
  plan: DecoratedDateNightPlace[];
  onClose: () => void;
  onReplan: () => void;
}) {
  const now = useDateNightClock();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !plan.length) return null;
  const seen = new Set<string>();
  const stops = plan.filter(place => {
    const key = place.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(place => {
    const saved = hasSavedChristmasEvent(place) ? sanitizeChristmasEventSnapshot(place.dateNightEvent, place.id) : null;
    return { place, event: saved ? refreshChristmasEventSnapshot(saved, now) : null, isEvent: hasSavedChristmasEvent(place) };
  });
  const hasEvents = stops.some(stop => stop.isEvent);
  const current = stops.every(stop => !stop.isEvent || stop.event?.attendanceEligible);
  return (
    <ChristmasEventDialog labelledBy="christmas-plan-heading" onClose={onClose} surface="plan">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-kicker text-subtle">{hasEvents ? "Date Night events" : "Date Night"}</p>
            <h2 id="christmas-plan-heading" className="font-display mt-2 text-3xl leading-tight text-fg">{current ? "Date Night plan candidates" : "Published schedules"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{current ? "Compare each suggestion’s schedule and admission. Travel time and a combined itinerary have not been verified." : "One or more events no longer support a current attendance recommendation. Their published details remain here for reference."}</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-fg" aria-label="Close night plan"><X className="size-5" /></button>
        </div>
        <div className="mt-5 space-y-4">
          {stops.map(({ place, event, isEvent }, index) => <article key={place.id} className="min-w-0 rounded-xl bg-surface p-4 shadow-border">
            <p className="text-xs uppercase tracking-wide text-accent">Suggestion {index + 1}</p>
            <h3 className="font-display mt-1 break-words text-xl text-fg">{isEvent ? event?.eventName ?? "Event details unavailable" : place.name}</h3>
            {isEvent ? event ? <div className="mt-3 space-y-4"><ChristmasEventDetails event={event} /><ChristmasEventActions /></div> : <p className="mt-3 text-sm text-muted">Event details could not be verified. Attendance and travel actions are unavailable.</p> : <div className="mt-3 space-y-3">
              <p className="text-sm text-muted">{place.cuisineLabel} · {dateNightStatusLabel(place)}</p>
              <p className="text-sm text-subtle">{place.address}</p>
              {directionsUrl(place) ? <Button className="min-h-11" asChild><a href={directionsUrl(place) ?? undefined} target="_blank" rel="noreferrer"><MapPinned className="size-4" />Directions</a></Button> : null}
            </div>}
          </article>)}
        </div>
        <Button className="mt-6 min-h-11 w-full" variant="secondary" onClick={onReplan}><RotateCcw className="size-4" />Plan a different night</Button>
        <div className="mt-auto pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]"><UnifiedFooter artworkSources={[]} /></div>
      </div>
    </ChristmasEventDialog>
  );
}
