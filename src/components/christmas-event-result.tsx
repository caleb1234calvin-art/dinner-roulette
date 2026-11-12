import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Heart, RotateCcw, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedFooter } from "@/components/unified-footer";
import { ChristmasEventActions, ChristmasEventDetails } from "@/components/christmas-event-details";
import { refreshChristmasEventSnapshot } from "@/lib/date-night/christmas-pilot-model";
import { sanitizeChristmasEventSnapshot } from "@/lib/date-night/christmas-saved";
import { useDateNightClock } from "@/lib/date-night/use-clock";
import type { DecoratedRestaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const RATINGS = ["Never again", "Not great", "Fine", "Really good", "Favorite"] as const;

export function ChristmasEventResult({ restaurant, onClose, onReroll, onNotTonight }: {
  restaurant: DecoratedRestaurant;
  onClose: () => void;
  onReroll: () => void;
  onNotTonight: () => void;
}) {
  const now = useDateNightClock();
  const preferences = useAppStore(state => state.preferences);
  const toggleFavorite = useAppStore(state => state.toggleFavorite);
  const recordVisit = useAppStore(state => state.recordVisit);
  const [mounted, setMounted] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(4);
  useEffect(() => setMounted(true), []);
  const verified = sanitizeChristmasEventSnapshot(restaurant.dateNightEvent, restaurant.id);
  const event = verified ? refreshChristmasEventSnapshot(verified, now) : null;
  if (!mounted) return null;
  const favorite = event ? Boolean(preferences[event.preferenceKey]?.favorite) : false;
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg" role="dialog" aria-modal="true" aria-labelledby="christmas-result-heading" data-christmas-surface="result">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-kicker text-subtle">Date Night event</p>
            <h2 id="christmas-result-heading" className="font-display mt-2 break-words text-3xl leading-tight text-fg">{event?.eventName ?? "Event details unavailable"}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-fg" aria-label="Close result"><X className="size-5" /></button>
        </div>
        {event ? <>
          <div className="mt-5"><ChristmasEventDetails event={event} /></div>
          <div className="mt-5"><ChristmasEventActions /></div>
          <div className="mt-5 space-y-3">
            {ratingOpen ? <div className="rounded-xl bg-surface p-4 shadow-border">
              <p className="text-sm text-fg">Our rating</p>
              <div className="mt-3 flex justify-between">{RATINGS.map((label, index) => (
                <button key={label} type="button" className="flex size-11 items-center justify-center" onClick={() => setRating(index + 1)} aria-label={`${index + 1} ${label}`} aria-pressed={rating === index + 1}>
                  <Heart className={cn("size-6", index < rating ? "fill-heart text-heart" : "text-subtle")} />
                </button>
              ))}</div>
              <p className="mt-1 text-center text-xs text-subtle">{RATINGS[rating - 1]}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button className="min-h-11" variant="outline" onClick={() => setRatingOpen(false)}>Cancel</Button>
                <Button className="min-h-11" onClick={() => {
                  recordVisit({ restaurantId: event.preferenceKey, restaurantName: event.eventName, cuisineLabel: event.categoryLabel, personalRating: rating, dateNightEvent: event });
                  onClose();
                }}>Save choice</Button>
              </div>
            </div> : <>
              <div className="grid grid-cols-2 gap-2">
                <Button className="min-h-11" variant="secondary" onClick={onReroll}><RotateCcw className="size-4" />Reroll</Button>
                <Button className="min-h-11" variant="danger" onClick={onNotTonight}><Ban className="size-4" />Not tonight</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="min-h-11" variant={favorite ? "default" : "outline"} onClick={() => toggleFavorite({ restaurantId: event.preferenceKey, name: event.eventName, cuisineLabel: event.categoryLabel, dateNightEvent: event })}>
                  <Heart className={cn("size-4", favorite && "fill-current")} />{favorite ? "Saved" : "Save"}
                </Button>
                <Button className="min-h-11" variant="outline" onClick={() => setRatingOpen(true)}><Star className="size-4" />We did this</Button>
              </div>
            </>}
          </div>
        </> : <p className="mt-5 text-sm text-muted">The saved event information could not be verified. Travel and attendance actions are unavailable.</p>}
        <div className="mt-auto pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]"><UnifiedFooter artworkSources={[]} /></div>
      </div>
    </div>, document.body,
  );
}
