import type { ChristmasEventSnapshot } from "@/lib/date-night/christmas-pilot-model";
import { Button } from "@/components/ui/button";

function clockLabel(value: string) {
  if (value === "24:00") return "midnight";
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${hour < 12 ? "a.m." : "p.m."}`;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T12:00:00Z`));
}

export function ChristmasEventDetails({ event, compact = false, historical = false }: {
  event: ChristmasEventSnapshot;
  compact?: boolean;
  historical?: boolean;
}) {
  const includesRoute = event.sessions.some(session => session.location.kind === "route");
  const status = historical ? "Saved event details — not a current attendance recommendation."
    : event.status === "expired" ? "This event schedule does not support current attendance. Saved details remain available."
      : event.status === "past-announced-start" ? "The last announced start has passed. Current attendance is unconfirmed."
        : event.status === "open-now" ? "Open now according to the published event hours."
          : event.status === "end-time-unknown" ? "Published start times; finish times are unconfirmed."
            : "Not operating now. See the published session times.";
  return (
    <div className="min-w-0 space-y-3 break-words" data-christmas-event-details={event.eventKey}>
      <p className="text-xs text-accent">{event.categoryLabel} · 2026 edition</p>
      <p className="text-sm leading-relaxed text-muted" role="status">{status}</p>
      <div className="space-y-1 text-xs leading-relaxed text-subtle">
        <p>{includesRoute ? "Event setting" : "Host"}: {event.host.name}</p>
        <p>{includesRoute ? "Reviewed square address" : "Reviewed venue address"}: {event.host.address}</p>
        <p>Visitor entrance unconfirmed.</p>
      </div>
      <ul className="space-y-3" aria-label="Event sessions">
        {event.sessions.map((session) => (
          <li key={`${session.sessionKey}/${session.date}`} className="min-w-0 rounded-lg bg-elevated p-3 text-xs leading-relaxed">
            <p className="font-medium text-fg">{session.label}</p>
            <p className="mt-1 text-muted">{dateLabel(session.date)} · {clockLabel(session.opens)}{session.closes ? `–${clockLabel(session.closes)}` : " start; finish unconfirmed"} · America/Chicago</p>
            <p className="mt-1 font-medium text-fg">{session.admission.kind === "free" ? "Free public admission" : session.admission.priceUsd === null ? "Admission price unconfirmed" : `$${session.admission.priceUsd} admission`}</p>
            {!compact ? <p className="mt-1 text-muted">{session.admission.note}</p> : null}
            {session.location.kind === "fixed-site" ? (
              <div className="mt-2 text-subtle">
                <p>Fixed site: {session.location.name}</p>
                <p>Venue address: {session.location.address}</p>
                {session.location.publicSpaces.length ? <p>Event spaces: {session.location.publicSpaces.join(", ")}</p> : null}
              </div>
            ) : (
              <div className="mt-2 text-subtle">
                <p>Parade route: {session.location.name}</p>
                <p>Route starts at {session.location.startLocation}.</p>
                <p>{session.location.description}</p>
                <p>Finishing time unconfirmed.</p>
              </div>
            )}
            {!compact || session.closes === null ? <p className="mt-2 text-subtle">{session.scheduleNote}</p> : null}
          </li>
        ))}
      </ul>
      {!compact ? <p className="text-xs leading-relaxed text-subtle">Parking, accessibility, ticket inventory and last admission are unconfirmed. A venue address does not establish a visitor entrance.</p> : null}
    </div>
  );
}

/** This pilot has no independently cleared travel or checkout actions. No host
 * coordinates, website, or persisted action fields can manufacture one. */
export function ChristmasEventActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-1" : "space-y-2"} data-christmas-event-actions>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button className="min-h-11 whitespace-normal" variant="secondary" disabled>Directions unavailable</Button>
        <Button className="min-h-11 whitespace-normal" variant="secondary" disabled>Ticket checkout unavailable</Button>
      </div>
      {!compact ? <p className="text-xs leading-relaxed text-subtle">No verified visitor entrance or ticket checkout is available for this event.</p> : null}
    </div>
  );
}
