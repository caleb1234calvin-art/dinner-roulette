import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Shuffle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import type { DecoratedRestaurant } from "@/lib/restaurants/types";
import { cn } from "@/lib/utils";

export function OptionsOverlay({
  restaurants,
  onClose,
  onSelect,
  onShuffle,
  onNotTonight,
}: {
  restaurants: DecoratedRestaurant[];
  onClose: () => void;
  onSelect: (restaurant: DecoratedRestaurant) => void;
  onShuffle: () => void;
  onNotTonight: (restaurant: DecoratedRestaurant) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-8 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-kicker text-subtle">Compressed shortlist</p>
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

        <div
          className={cn(
            "mt-5 grid flex-1 gap-3",
            restaurants.length === 1 ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {restaurants.map((restaurant) => (
            <OptionCard
              key={restaurant.id}
              restaurant={restaurant}
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
  onSelect,
  onNotTonight,
}: {
  restaurant: DecoratedRestaurant;
  onSelect: () => void;
  onNotTonight: () => void;
}) {
  const openLabel = restaurant.hoursKnown
    ? restaurant.isOpen
      ? restaurant.closesLabel ?? "Open"
      : "Closed"
    : null;
  const visual = restaurantVisual(restaurant.name, restaurant.photoKey);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="relative">
        <button type="button" onClick={onSelect} className="block w-full text-left">
          <img
            src={visual.src}
            alt=""
            className={cn(
              "h-28 w-full outline outline-1 -outline-offset-1 outline-fg/10",
              visual.isLogo ? "bg-fg/[0.06] object-contain p-8" : "object-cover",
            )}
          />
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
