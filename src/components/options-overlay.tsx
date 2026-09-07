import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDateNightIcon } from "@/lib/date-night/icons";
import type { DecoratedDateNightPlace } from "@/lib/date-night/types";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import type { DecoratedRestaurant } from "@/lib/restaurants/types";
import { cn } from "@/lib/utils";

type ResultMode = "dinner" | "nightlife" | "date-night";

export function OptionsOverlay({
  restaurants,
  onClose,
  onSelect,
  onShuffle,
  onNotTonight,
  mode = "dinner",
}: {
  restaurants: DecoratedRestaurant[];
  onClose: () => void;
  onSelect: (restaurant: DecoratedRestaurant) => void;
  onShuffle: () => void;
  onNotTonight: (restaurant: DecoratedRestaurant) => void;
  mode?: ResultMode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const kicker = mode === "nightlife" ? "Nightlife shortlist" : mode === "date-night" ? "Date Night shortlist" : "Compressed shortlist";

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-8 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-kicker text-subtle">{kicker}</p>
            <h2 className="font-display mt-1 text-3xl leading-tight text-fg">Tonight's options</h2>
            <p className="mt-1 text-sm text-muted">Pick one, or let us shuffle again.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-fg shadow-border"
            aria-label="Close options"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className={cn("mt-5 grid flex-1 gap-3", restaurants.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
          {restaurants.map((restaurant) => (
            <OptionCard
              key={restaurant.id}
              restaurant={restaurant}
              mode={mode}
              onSelect={() => onSelect(restaurant)}
              onNotTonight={() => onNotTonight(restaurant)}
            />
          ))}
        </div>

        <div className="mt-5">
          <Button size="lg" variant="secondary" className="w-full" onClick={onShuffle}>
            <Shuffle className="size-4" />
            <span className="tracking-kicker uppercase">Shuffle options</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function OptionCard({
  restaurant,
  mode,
  onSelect,
  onNotTonight,
}: {
  restaurant: DecoratedRestaurant;
  mode: ResultMode;
  onSelect: () => void;
  onNotTonight: () => void;
}) {
  const openLabel = restaurant.hoursKnown ? (restaurant.isOpen ? restaurant.closesLabel ?? "Open" : "Closed") : null;
  const visual = restaurantVisual(restaurant.name, restaurant.photoKey);
  const dateNightRestaurant = restaurant as DecoratedDateNightPlace;
  const dateNightIcon = mode === "date-night"
    ? getDateNightIcon({ activityTypes: dateNightRestaurant.activityTypes, cuisineLabel: restaurant.cuisineLabel })
    : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="relative">
        <button type="button" onClick={onSelect} className="block w-full text-left">
          {mode === "date-night" && dateNightIcon ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10">
              <img src={dateNightIcon} alt="" className="size-24 rounded-2xl object-cover shadow-sm" />
            </div>
          ) : visual.isLogo ? (
            <div className="flex h-28 w-full items-center justify-center bg-surface outline outline-1 -outline-offset-1 outline-fg/10">
              <div className="flex h-20 w-[72%] items-center justify-center rounded-xl bg-[#d8d8d4] p-3 shadow-sm">
                <img src={visual.src} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          ) : (
            <img src={visual.src} alt="" className="h-28 w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10" />
          )}
        </button>
        <button
          type="button"
          onClick={onNotTonight}
          className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-md bg-bg/80 text-fg"
          aria-label={`Not tonight: ${restaurant.name}`}
        >
          <Ban className="size-4" />
        </button>
      </div>
      <button type="button" onClick={onSelect} className="flex flex-1 flex-col px-3 py-3 text-left">
        <h3 className="font-display line-clamp-2 text-lg leading-tight text-fg">{restaurant.name}</h3>
        <p className="mt-1 text-xs text-muted">
          {restaurant.cuisineLabel}
          {restaurant.priceLevel ? ` · ${formatPrice(restaurant.priceLevel)}` : ""}
        </p>
        <p className="mt-1 text-xs text-subtle">
          {formatDistance(restaurant.distanceMiles)}
          {openLabel ? ` · ${openLabel}` : ""}
        </p>
        {restaurant.closingSoon ? <p className="mt-1 text-xs text-danger">Closing soon</p> : null}
      </button>
    </article>
  );
}
