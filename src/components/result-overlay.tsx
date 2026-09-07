import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Heart, MapPinned, MoonStar, Phone, RotateCcw, Sparkles, Star, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import { TAGLINES, type DecoratedRestaurant } from "@/lib/restaurants/types";
import { NIGHTLIFE_TAGLINES } from "@/lib/nightlife/types";
import { DATE_NIGHT_TAGLINES } from "@/lib/date-night/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const RATING_LABELS = ["Never again", "Not great", "Fine", "Really good", "Favorite"] as const;
const SPIN_DELAYS = [50, 50, 55, 60, 70, 80, 95, 115, 140, 170, 210, 260, 320];
type ResultMode = "dinner" | "nightlife" | "date-night";

function doorDashSearchUrl(name: string) {
  return `https://www.doordash.com/search/store/${encodeURIComponent(name)}`;
}

function grubhubSearchUrl(restaurant: DecoratedRestaurant) {
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

function uberEatsSearchUrl(name: string) {
  return `https://www.ubereats.com/search?q=${encodeURIComponent(name)}`;
}

export function ResultOverlay({
  restaurant,
  reelNames,
  onClose,
  onReroll,
  onNotTonight,
  skipSpin = false,
  mode = "dinner",
}: {
  restaurant: DecoratedRestaurant;
  reelNames: string[];
  onClose: () => void;
  onReroll: () => void;
  onNotTonight: () => void;
  skipSpin?: boolean;
  mode?: ResultMode;
}) {
  const preferences = useAppStore((s) => s.preferences);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const recordVisit = useAppStore((s) => s.recordVisit);
  const favorite = Boolean(preferences[restaurant.id]?.favorite);
  const [phase, setPhase] = useState<"spin" | "result">(skipSpin ? "result" : "spin");
  const [reel, setReel] = useState(reelNames[0] ?? restaurant.name);
  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState(4);
  const [mounted, setMounted] = useState(false);
  const taglines = mode === "nightlife" ? NIGHTLIFE_TAGLINES : mode === "date-night" ? DATE_NIGHT_TAGLINES : TAGLINES;
  const tagline = useMemo(
    () => taglines[Math.floor(Math.random() * taglines.length)] ?? taglines[0],
    [restaurant.id, mode],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setRateOpen(false);
    setReel(reelNames[0] ?? restaurant.name);
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipSpin || reduceMotion) {
      setPhase("result");
      return;
    }
    setPhase("spin");
    const pool = reelNames.filter(Boolean).length > 1 ? reelNames.filter(Boolean) : [restaurant.name];
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
      setReel(next);
      timeout = window.setTimeout(step, SPIN_DELAYS[tick] ?? 80);
      tick += 1;
    };
    timeout = window.setTimeout(step, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [restaurant.id, restaurant.name, reelNames, skipSpin]);

  if (!mounted) return null;

  const destination = restaurant.address && restaurant.address !== "Address unavailable" ? restaurant.address : `${restaurant.lat},${restaurant.lon}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  const visual = restaurantVisual(restaurant.name, restaurant.photoKey);

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

  const resultKicker = mode === "nightlife" ? "Tonight's move" : mode === "date-night" ? "Tonight's date" : "Tonight's pick";
  const chosenLabel = mode === "nightlife" ? "We went here" : mode === "date-night" ? "We did this" : "We chose this";

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
        {phase === "spin" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-kicker text-subtle">Choosing</p>
            <div className="mt-6 w-full overflow-hidden rounded-xl bg-surface px-4 py-8 shadow-border">
              <p key={reel} className="reel-name font-display text-3xl text-fg">{reel}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-56 overflow-hidden">
              {mode === "date-night" ? (
                <div className="flex size-full items-center justify-center bg-elevated outline outline-1 -outline-offset-1 outline-fg/10">
                  <div className="flex size-28 items-center justify-center rounded-full bg-surface shadow-border">
                    <Sparkles className="size-12 text-accent" />
                  </div>
                </div>
              ) : visual.isLogo ? (
                <div className="flex size-full items-center justify-center bg-surface outline outline-1 -outline-offset-1 outline-fg/10">
                  <div className="flex h-32 w-[70%] items-center justify-center rounded-2xl bg-[#d8d8d4] p-6 shadow-sm">
                    <img src={visual.src} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              ) : (
                <>
                  <img src={visual.src} alt="" className="size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                </>
              )}
              <button type="button" onClick={onClose} className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-md bg-bg/70 text-fg" aria-label="Close result">
                <X className="size-5" />
              </button>
            </div>

            <div className="result-in px-5 pt-2 pb-10">
              <p className="text-kicker text-subtle">{resultKicker}</p>
              <h2 className="font-display mt-2 text-4xl leading-tight text-fg">{restaurant.name}</h2>
              <p className="mt-2 text-sm text-muted">{tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{restaurant.cuisineLabel}</span>
                {restaurant.priceLevel ? <span>{formatPrice(restaurant.priceLevel)}</span> : null}
                {restaurant.rating ? (
                  <span className="inline-flex items-center gap-1 text-fg">
                    <Star className="size-3.5 fill-fg" />
                    {restaurant.rating.toFixed(1)}
                    {restaurant.reviewCount ? <span className="text-subtle">({restaurant.reviewCount})</span> : null}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-sm text-muted">
                {formatDistance(restaurant.distanceMiles)}
                {restaurant.hoursKnown ? ` · ${restaurant.isOpen ? restaurant.closesLabel ?? "Open" : "Closed"}` : ""}
              </p>
              {restaurant.closingSoon ? <p className="mt-1 text-sm text-danger">Closing soon — go now if you're in.</p> : null}
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
                        <button key={value} type="button" onClick={() => setRating(value)} className="flex size-11 items-center justify-center" aria-label={`${value} ${RATING_LABELS[value - 1]}`}>
                          <Heart className={cn("size-6", value <= rating ? "fill-heart text-heart" : "text-subtle")} />
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-center text-xs text-subtle">{RATING_LABELS[rating - 1]}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => setRateOpen(false)}>Cancel</Button>
                      <Button onClick={saveChoice}>Save choice</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" onClick={onReroll}><RotateCcw className="size-4" />Reroll</Button>
                      <Button variant="danger" onClick={onNotTonight}><Ban className="size-4" />Not tonight</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant={favorite ? "default" : "outline"} onClick={() => toggleFavorite({ restaurantId: restaurant.id, name: restaurant.name, cuisineLabel: restaurant.cuisineLabel, photoKey: restaurant.photoKey, lat: restaurant.lat, lon: restaurant.lon, address: restaurant.address, priceLevel: restaurant.priceLevel })}>
                        <Heart className={cn("size-4", favorite && "fill-accent-fg")} />
                        {favorite ? "Favorited" : "Favorite"}
                      </Button>
                      <Button variant="outline" onClick={() => setRateOpen(true)}>
                        {mode === "nightlife" ? <MoonStar className="size-4" /> : mode === "date-night" ? <Sparkles className="size-4" /> : <Utensils className="size-4" />}
                        {chosenLabel}
                      </Button>
                    </div>

                    {mode === "dinner" ? (
                      <div className="mt-4 rounded-xl bg-surface px-4 py-3 shadow-border">
                        <p className="text-xs tracking-[0.18em] text-subtle uppercase">Order delivery</p>
                        <p className="mt-1 text-xs text-muted">Availability is confirmed in the delivery app.</p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <Button size="sm" variant="secondary" asChild><a href={doorDashSearchUrl(restaurant.name)} target="_blank" rel="noreferrer">DoorDash</a></Button>
                          <Button size="sm" variant="secondary" asChild><a href={grubhubSearchUrl(restaurant)} target="_blank" rel="noreferrer">Grubhub</a></Button>
                          <Button size="sm" variant="secondary" asChild><a href={uberEatsSearchUrl(restaurant.name)} target="_blank" rel="noreferrer">Uber Eats</a></Button>
                        </div>
                      </div>
                    ) : null}

                    {restaurant.phone ? (
                      <Button variant="ghost" className="w-full" asChild>
                        <a href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}><Phone className="size-4" />Call</a>
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
