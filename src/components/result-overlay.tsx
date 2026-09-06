import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Heart, MapPinned, Phone, RotateCcw, Star, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cuisinePhotoSrc } from "@/lib/restaurants/cuisines";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import { TAGLINES, type DecoratedRestaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const RATING_LABELS = ["Never again", "Not great", "Fine", "Really good", "Favorite"] as const;
const SPIN_DELAYS = [50, 50, 55, 60, 70, 80, 95, 115, 140, 170, 210, 260, 320];

function doorDashSearchUrl(restaurantName: string): string {
  return `https://www.doordash.com/search/store/${encodeURIComponent(restaurantName)}`;
}

function grubhubSearchUrl(restaurant: DecoratedRestaurant): string {
  const params = new URLSearchParams({
    orderMethod: "delivery",
    locationMode: "DELIVERY",
    queryText: restaurant.name,
    latitude: String(restaurant.lat),
    longitude: String(restaurant.lon),
    tab: "all",
  });
  return `https://www.grubhub.com/search?${params.toString()}`;
}

export function ResultOverlay({
  restaurant,
  reelNames,
  onClose,
  onReroll,
  onNotTonight,
  skipSpin = false,
}: {
  restaurant: DecoratedRestaurant;
  reelNames: string[];
  onClose: () => void;
  onReroll: () => void;
  onNotTonight: () => void;
  skipSpin?: boolean;
}) {
  const preferences = useAppStore((s) => s.preferences);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const recordVisit = useAppStore((s) => s.recordVisit);
  const favorite = Boolean(preferences[restaurant.id]?.favorite);
  const [phase, setPhase] = useState<"spin" | "result">(skipSpin ? "result" : "spin");
  const [reel, setReel] = useState(reelNames[0] ?? restaurant.name);
  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState<number>(4);
  const [mounted, setMounted] = useState(false);
  const tagline = useMemo(
    () => TAGLINES[Math.floor(Math.random() * TAGLINES.length)] ?? TAGLINES[0],
    [restaurant.id],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setRateOpen(false);
    setReel(reelNames[0] ?? restaurant.name);

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipSpin || reduceMotion) {
      setPhase("result");
      return;
    }

    setPhase("spin");
    const names = reelNames.filter(Boolean);
    const pool = names.length > 1 ? names : [restaurant.name];
    let cancelled = false;
    let timeout = 0;
    let tick = 0;

    const step = () => {
      if (cancelled) return;
      if (tick >= SPIN_DELAYS.length) {
        setReel(restaurant.name);
        setPhase("result");
        if ("vibrate" in navigator) navigator.vibrate?.(24);
        return;
      }
      const next = pool[Math.floor(Math.random() * pool.length)] ?? restaurant.name;
      setReel(next === restaurant.name && tick < SPIN_DELAYS.length - 2 ? (pool[(pool.indexOf(next) + 1) % pool.length] ?? next) : next);
      timeout = window.setTimeout(step, SPIN_DELAYS[tick] ?? 80);
      tick += 1;
    };

    timeout = window.setTimeout(step, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [restaurant.id, restaurant.name, reelNames, skipSpin]);

  const destination = restaurant.address && restaurant.address !== "Address unavailable"
    ? restaurant.address
    : `${restaurant.lat},${restaurant.lon}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  const doorDashUrl = doorDashSearchUrl(restaurant.name);
  const grubhubUrl = grubhubSearchUrl(restaurant);

  function saveChoice() {
    recordVisit({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      cuisineLabel: restaurant.cuisineLabel,
      personalRating: rating,
    });
    setRateOpen(false);
    onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
        {phase === "spin" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-kicker text-subtle">Choosing</p>
            <div className="mt-6 w-full overflow-hidden rounded-xl bg-surface px-4 py-8 shadow-border">
              <p key={reel} className="reel-name font-display text-3xl text-fg">
                {reel}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-56 overflow-hidden">
              <img
                src={cuisinePhotoSrc(restaurant.photoKey)}
                alt=""
                className="size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-md bg-bg/70 text-fg"
                aria-label="Close result"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="result-in px-5 pt-2 pb-10">
              <p className="text-kicker text-subtle">Tonight's pick</p>
              <h2 className="font-display mt-2 text-4xl leading-tight text-fg">{restaurant.name}</h2>
              <p className="mt-2 text-sm text-muted">{tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{restaurant.cuisineLabel}</span>
                <span>{formatPrice(restaurant.priceLevel)}</span>
                {restaurant.rating ? (
                  <span className="inline-flex items-center gap-1 text-fg">
                    <Star className="size-3.5 fill-fg" />
                    {restaurant.rating.toFixed(1)}
                    {restaurant.reviewCount ? (
                      <span className="text-subtle">({restaurant.reviewCount})</span>
                    ) : null}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-sm text-muted">
                {formatDistance(restaurant.distanceMiles)}
                {restaurant.hoursKnown
                  ? ` · ${restaurant.isOpen ? restaurant.closesLabel ?? "Open" : "Closed"}`
                  : ""}
              </p>
              {restaurant.closingSoon ? (
                <p className="mt-1 text-sm text-danger">Closing soon — go now if you're in.</p>
              ) : null}
              <p className="mt-1 text-sm text-subtle">{restaurant.address}</p>

              <div className="mt-6 space-y-2">
                <Button size="lg" className="w-full" asChild>
                  <a href={mapsUrl} target="_blank" rel="noreferrer">
                    <MapPinned className="size-5" />
                    <span className="tracking-kicker uppercase">Go here</span>
                  </a>
                </Button>
                {rateOpen ? (
                  <div className="rounded-xl bg-surface p-4 shadow-border">
                    <p className="text-sm text-fg">Our rating</p>
                    <div className="mt-3 flex justify-between">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="flex size-11 items-center justify-center"
                          aria-label={`${value} ${RATING_LABELS[value - 1]}`}
                        >
                          <Heart
                            className={cn(
                              "size-6",
                              value <= rating ? "fill-heart text-heart" : "text-subtle",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-center text-xs text-subtle">{RATING_LABELS[rating - 1]}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => setRateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveChoice}>Save choice</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" onClick={onReroll}>
                        <RotateCcw className="size-4" />
                        Reroll
                      </Button>
                      <Button variant="danger" onClick={onNotTonight}>
                        <Ban className="size-4" />
                        Not tonight
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={favorite ? "default" : "outline"}
                        onClick={() =>
                          toggleFavorite({
                            restaurantId: restaurant.id,
                            name: restaurant.name,
                            cuisineLabel: restaurant.cuisineLabel,
                            photoKey: restaurant.photoKey,
                            lat: restaurant.lat,
                            lon: restaurant.lon,
                            address: restaurant.address,
                            priceLevel: restaurant.priceLevel,
                          })
                        }
                      >
                        <Heart className={cn("size-4", favorite && "fill-accent-fg")} />
                        {favorite ? "Favorited" : "Favorite"}
                      </Button>
                      <Button variant="outline" onClick={() => setRateOpen(true)}>
                        <Utensils className="size-4" />
                        We chose this
                      </Button>
                    </div>

                    <div className="mt-4 rounded-xl bg-surface px-4 py-3 shadow-border">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs tracking-[0.18em] text-subtle uppercase">Order delivery</p>
                          <p className="mt-1 text-xs text-muted">Availability is confirmed in the delivery app.</p>
                        </div>
                        <Button
                          size="icon"
                          className="bg-[#ff3008] text-white shadow-none hover:bg-[#e52b07]"
                          asChild
                        >
                          <a
                            href={doorDashUrl}
                            rel="noreferrer"
                            aria-label={`Search DoorDash for ${restaurant.name}`}
                            title="DoorDash"
                          >
                            <img
                              src="https://cdn.simpleicons.org/doordash/FFFFFF"
                              alt=""
                              className="size-6"
                            />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          className="bg-[#ff8000] text-white shadow-none hover:bg-[#e67300]"
                          asChild
                        >
                          <a
                            href={grubhubUrl}
                            rel="noreferrer"
                            aria-label={`Search Grubhub for ${restaurant.name}`}
                            title="Grubhub"
                          >
                            <img
                              src="https://unpkg.com/simple-icons@5.0.0/icons/grubhub.svg"
                              alt=""
                              className="size-6 brightness-0 invert"
                            />
                          </a>
                        </Button>
                      </div>
                    </div>

                    {restaurant.phone ? (
                      <Button variant="ghost" className="w-full" asChild>
                        <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}>
                          <Phone className="size-4" />
                          Call
                        </a>
                      </Button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
