import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChristmasEventActions, ChristmasEventDetails } from "@/components/christmas-event-details";
import { chicagoEventClock } from "@/lib/date-night/christmas-pilot-model";
import { sanitizeChristmasEventSnapshot, savedChristmasEventPresentation } from "@/lib/date-night/christmas-saved";
import type { RestaurantPreference, VisitRecord } from "@/lib/restaurants/types";

export function ChristmasSavedFavorite({ item, now, onRemove }: {
  item: RestaurantPreference;
  now: Date;
  onRemove: () => void;
}) {
  const event = savedChristmasEventPresentation(sanitizeChristmasEventSnapshot(item.dateNightEvent, item.restaurantId), now);
  const permanent = event?.kind === "permanent-venue-display";
  const displayName = permanent ? item.name : event?.eventName ?? "Saved event details unavailable";
  return <li className="min-w-0 overflow-hidden rounded-xl bg-surface p-4 shadow-border" data-christmas-surface="favorites">
    <div className="flex items-start justify-between gap-3">
      <h2 className="font-display min-w-0 flex-1 break-words text-xl text-fg">{displayName}</h2>
      <Button className="min-h-11 min-w-11 shrink-0" variant="ghost" aria-label={`Remove ${permanent ? item.name : event?.eventName ?? "saved event"}`} onClick={onRemove}><Trash2 className="size-4" /></Button>
    </div>
    {permanent ? <p className="mt-1 text-sm text-muted">{item.cuisineLabel ?? "Permanent venue"}</p> : null}
    {event ? <div className="mt-3 space-y-4">{permanent ? <p className="text-sm text-muted">Saved Christmas event: {event.eventName}</p> : null}<ChristmasEventDetails event={event} historical /><ChristmasEventActions compact /></div>
      : <p className="mt-3 text-sm text-muted">This saved event cannot be verified. It remains removable; travel and attendance actions are unavailable.</p>}
    <p className="mt-3 text-xs text-subtle">{item.ourRating ? `Our rating ${item.ourRating}/5` : "Not rated"}{item.lastVisited ? ` · Last chose ${new Date(item.lastVisited).toLocaleDateString()}` : ""}</p>
  </li>;
}

export function ChristmasEventHistory({ visit, now }: { visit: VisitRecord; now: Date }) {
  const recorded = sanitizeChristmasEventSnapshot(visit.dateNightEvent, visit.restaurantId);
  const event = savedChristmasEventPresentation(recorded, now);
  const recordedActiveSession = recorded?.sessions.find(session => session.sessionKey === recorded.activeSessionKey);
  const recordedDay = recordedActiveSession?.date ?? (recorded ? chicagoEventClock(new Date(recorded.recordedAt))?.day : null);
  const recordedSessions = recorded ? recorded.sessions.filter(session => recordedActiveSession ? session.sessionKey === recordedActiveSession.sessionKey : session.date === recordedDay) : [];
  return <li className="min-w-0 rounded-lg bg-surface p-4 shadow-border" data-christmas-surface="history">
    <h3 className="font-display break-words text-xl text-fg">{event?.eventName ?? "Saved event details unavailable"}</h3>
    {recorded && recordedDay ? <p className="mt-1 text-sm text-muted">Recorded occurrence: {recordedDay}{recordedSessions.length ? ` · ${recordedSessions.map(session => session.label).join("; ")}` : ""} · America/Chicago</p> : null}
    {visit.personalRating ? <p className="mt-1 text-sm text-muted">Our rating {visit.personalRating}/5</p> : null}
    {event ? <div className="mt-3 space-y-3"><ChristmasEventDetails event={event} historical /><ChristmasEventActions compact /></div>
      : <p className="mt-3 text-sm text-muted">Historical event information is unavailable. This visit does not enable current attendance or travel actions.</p>}
    {visit.note ? <p className="mt-3 break-words text-sm text-muted">{visit.note}</p> : null}
  </li>;
}
