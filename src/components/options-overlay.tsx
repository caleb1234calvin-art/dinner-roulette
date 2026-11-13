import { ChristmasEventActions, ChristmasEventDetails } from "@/components/christmas-event-details";
import { ChristmasEventDialog } from "@/components/christmas-event-dialog";
import { refreshChristmasEventSnapshot } from "@/lib/date-night/christmas-pilot-model";
import { hasSavedChristmasEvent, sanitizeChristmasEventSnapshot } from "@/lib/date-night/christmas-saved";
import { useDateNightClock } from "@/lib/date-night/use-clock";
import { UnifiedFooter } from "@/components/unified-footer";
import { seasonalDistancePrefix } from "@/lib/date-night/listing";
import { SeasonalVisitNotes } from "@/components/seasonal-visit-notes";
import { dateNightStatusLabel } from "@/lib/date-night/availability";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Shuffle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDateNightIcon } from "@/lib/date-night/icons";
import { isHalloweenDateNightActive } from "@/lib/date-night/season";
import { dateNightTypeLabel, type DecoratedDateNightPlace } from "@/lib/date-night/types";
import { nightlifeArtwork, type DecoratedNightlifePlace } from "@/lib/nightlife/types";
import { dinnerRestaurantIcon } from "@/lib/restaurants/dinner-icons";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import type { DecoratedRestaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type ResultMode = "dinner" | "nightlife" | "date-night";

export function OptionsOverlay({ restaurants, onClose, onSelect, onShuffle, onNotTonight, mode = "dinner", dialogContext }: {
  restaurants: DecoratedRestaurant[];
  onClose: () => void;
  onSelect: (restaurant: DecoratedRestaurant) => void;
  onShuffle: () => void;
  onNotTonight: (restaurant: DecoratedRestaurant) => void;
  mode?: ResultMode;
  dialogContext?: "christmas";
}) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const spookySeasonEnabled = useAppStore((s) => s.spookySeasonEnabled);
  const halloween = mode === "date-night" && isHalloweenDateNightActive(spookySeasonEnabled);
  const hasEvents = mode === "date-night" && restaurants.some(hasSavedChristmasEvent);
  const requestedDialog = mode === "date-night" && dialogContext === "christmas";
  const [eventDialog, setEventDialog] = useState(hasEvents || requestedDialog);
  const useEventDialog = hasEvents || requestedDialog || eventDialog;
  const seenEvents = new Set<string>();
  const shownRestaurants = restaurants.filter(restaurant => {
    if (mode !== "date-night" || !hasSavedChristmasEvent(restaurant)) return true;
    if (seenEvents.has(restaurant.id)) return false;
    seenEvents.add(restaurant.id);
    return true;
  });

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (hasEvents || requestedDialog) setEventDialog(true); }, [hasEvents, requestedDialog]);
  if (!mounted) return null;

  const kicker = mode === "nightlife" ? "Nightlife shortlist" : mode === "date-night" ? (halloween ? "🎃 Date Night · Halloween" : "Date Night shortlist") : "Compressed shortlist";

  const content = (
    <div className={cn("fixed inset-0 z-50 overflow-y-auto bg-bg", halloween && "date-night-halloween-options")}>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1"><p className="text-kicker text-subtle">{kicker}</p><h2 id={useEventDialog ? "christmas-options-heading" : undefined} className="font-display mt-1 text-3xl leading-tight text-fg">{hasEvents ? "Date Night options" : "Tonight's options"}</h2><p className="mt-1 text-sm text-muted">{hasEvents ? "Review each event’s schedule and admission." : "Pick one, or let us shuffle again."}</p></div>
          <button type="button" onClick={onClose} className="mt-2 flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-fg shadow-border" aria-label="Close options"><X className="size-5" /></button>
        </div>
        <div className={cn("mt-5 grid content-start gap-x-3 gap-y-4", shownRestaurants.length === 1 ? "grid-cols-1" : hasEvents ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2")}>
          {shownRestaurants.map((restaurant) => <OptionCard key={restaurant.id} restaurant={restaurant} mode={mode} halloween={halloween} onSelect={() => onSelect(restaurant)} onNotTonight={() => onNotTonight(restaurant)} />)}
        </div>
        <div className="mt-4"><Button size="lg" variant="secondary" className="w-full" onClick={onShuffle}><Shuffle className="size-4" /><span className="tracking-kicker uppercase">Shuffle options</span></Button></div>
        <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]"><UnifiedFooter artworkSources={restaurants.map((restaurant) => mode === "date-night" ? hasSavedChristmasEvent(restaurant) ? null : getDateNightIcon({ activityTypes: (restaurant as DecoratedDateNightPlace).activityTypes, cuisineLabel: restaurant.cuisineLabel, halloween }) : mode === "nightlife" ? nightlifeArtwork((restaurant as DecoratedNightlifePlace).venueTypes ?? []) : dinnerRestaurantIcon(restaurant, theme))} /></div>
      </div>
    </div>
  );
  return useEventDialog
    ? <ChristmasEventDialog labelledBy="christmas-options-heading" onClose={onClose}>{content.props.children}</ChristmasEventDialog>
    : createPortal(content, document.body);
}

function OrdinaryOptionCard({ restaurant, mode, halloween, onSelect, onNotTonight }: { restaurant: DecoratedRestaurant; mode: ResultMode; halloween: boolean; onSelect: () => void; onNotTonight: () => void; }) {
  const openLabel = mode === "date-night" ? dateNightStatusLabel(restaurant as DecoratedDateNightPlace) : restaurant.hoursKnown ? (restaurant.isOpen ? restaurant.closesLabel ?? "Open" : "Closed") : null;
  const theme = useAppStore((s) => s.theme);
  const visualSrc = dinnerRestaurantIcon(restaurant, theme);
  const dateNightRestaurant = restaurant as DecoratedDateNightPlace;
  const dateNightIcon = mode === "date-night" ? getDateNightIcon({ activityTypes: dateNightRestaurant.activityTypes, cuisineLabel: restaurant.cuisineLabel, halloween }) : null;
  const seasonal = mode === "date-night" && Boolean(dateNightRestaurant.seasonalListing || dateNightRestaurant.seasonalAvailability || dateNightRestaurant.seasonalVisitNotes?.length);
  const activityTypes = mode === "date-night" ? dateNightRestaurant.activityTypes ?? [] : [];
  const nightlifeRestaurant = restaurant as DecoratedNightlifePlace;
  const nightlifeIcon = mode === "nightlife" ? nightlifeArtwork(nightlifeRestaurant.venueTypes ?? []) : null;

  return (
    <article className="flex min-h-[17rem] flex-col overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="relative flex flex-1 flex-col">
        <button type="button" onClick={onSelect} className="flex w-full flex-1 flex-col text-left" style={{ outlineOffset: -3 }}>
          <span className="sr-only">Choose </span>
          <div className="relative w-full">
            {mode === "date-night" && dateNightIcon ? (
              <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={dateNightIcon} alt="" className={cn("size-24 rounded-2xl object-cover shadow-sm", halloween && "date-night-halloween-icon")} /></div>
            ) : mode === "date-night" ? (
              <div className="flex h-28 w-full items-center justify-center bg-elevated outline outline-1 -outline-offset-1 outline-fg/10"><Sparkles className="size-10 text-accent" /></div>
            ) : mode === "nightlife" && nightlifeIcon ? (
              <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={nightlifeIcon} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
            ) : mode === "nightlife" ? (
              <div className="h-28 w-full bg-elevated outline outline-1 -outline-offset-1 outline-fg/10" aria-hidden="true" />
            ) : (
              <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={visualSrc} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
            )}
          </div>
          <div className={cn("flex w-full flex-1 flex-col text-left", seasonal ? "px-2 pt-2 pb-0" : "px-3 py-3")}>
          <h3 title={restaurant.name} className={cn("font-display text-fg", seasonal ? "w-full truncate text-sm leading-[18px]" : "line-clamp-2 text-lg leading-tight")}>{restaurant.name}</h3>
          {mode === "date-night" && activityTypes.length ? <div className={cn("flex gap-1", seasonal ? "mt-1 w-full min-w-0" : "mt-2 flex-wrap")}>{activityTypes.slice(0, 3).map((type) => <span key={type} title={dateNightTypeLabel([type])} className={cn("rounded-full bg-elevated text-[10px] tracking-wide text-muted uppercase", seasonal ? "min-w-0 truncate px-1 py-0.5 leading-[14px]" : "px-2 py-1")}>{dateNightTypeLabel([type])}</span>)}</div> : <p className="mt-1 text-xs text-muted">{restaurant.cuisineLabel}{restaurant.priceLevel ? ` · ${formatPrice(restaurant.priceLevel)}` : ""}</p>}
          <p className={cn("text-xs text-subtle", seasonal ? "mt-1 leading-[14px]" : "mt-2")}>{seasonalDistancePrefix(restaurant)}{formatDistance(restaurant.distanceMiles)}{openLabel ? ` · ${openLabel}` : ""}</p>
          {mode === "date-night" && !restaurant.hoursKnown && !dateNightRestaurant.seasonalListing && !dateNightRestaurant.seasonalAvailability && !dateNightRestaurant.seasonalVisitNotes?.length ? <p className="mt-1 text-xs text-subtle">Hours unknown — check before going</p> : null}
          {restaurant.closingSoon ? <p className="mt-1 text-xs text-danger">Closing soon</p> : null}
          </div>
        </button>
        <button type="button" onClick={onNotTonight} className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-md bg-bg/80 text-fg" aria-label={`Not tonight: ${restaurant.name}`}><Ban className="size-4" /></button>
      </div>
      {mode === "date-night" && (dateNightRestaurant.seasonalListing || dateNightRestaurant.seasonalAvailability || dateNightRestaurant.seasonalVisitNotes?.length) ? <div className="px-2 pb-1"><SeasonalVisitNotes place={dateNightRestaurant} /></div> : null}
    </article>
  );
}

function OptionCard(props: Parameters<typeof OrdinaryOptionCard>[0]) {
  if (props.mode === "date-night" && hasSavedChristmasEvent(props.restaurant)) return <ChristmasOptionCard {...props} />;
  return <OrdinaryOptionCard {...props} />;
}

function ChristmasOptionCard({ restaurant, onSelect, onNotTonight }: Parameters<typeof OrdinaryOptionCard>[0]) {
  const now = useDateNightClock();
  const verified = sanitizeChristmasEventSnapshot(restaurant.dateNightEvent, restaurant.id);
  const event = verified ? refreshChristmasEventSnapshot(verified, now) : null;
  return <article className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl bg-surface p-3 shadow-border" data-christmas-surface="options">
    <h3 className="font-display break-words text-lg leading-tight text-fg">{event?.eventName ?? "Event details unavailable"}</h3>
    {event ? <>
      <ChristmasEventDetails event={event} compact />
      <ChristmasEventActions compact />
      <Button className="mt-auto min-h-11 whitespace-normal" disabled={!event.attendanceEligible} onClick={onSelect}>{event.attendanceEligible ? "Choose event" : "Schedule only"}</Button>
      <Button className="min-h-11 whitespace-normal" variant="ghost" onClick={onNotTonight} aria-label={`Not tonight: ${event.eventName}`}><Ban className="size-4 shrink-0" />Not tonight</Button>
    </> : <p className="text-sm text-muted">Event information could not be verified. Attendance and travel actions are unavailable.</p>}
  </article>;
}
