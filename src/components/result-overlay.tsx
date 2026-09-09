import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, ExternalLink, Heart, MapPinned, MoonStar, Phone, RotateCcw, Sparkles, Star, Utensils, X } from "lucide-react";
import { RideshareQuickActions } from "@/components/rideshare-quick-actions";
import { Button } from "@/components/ui/button";
import { getDateNightIcon } from "@/lib/date-night/icons";
import { DATE_NIGHT_TAGLINES, dateNightTypeLabel, type DecoratedDateNightPlace } from "@/lib/date-night/types";
import { NIGHTLIFE_TAGLINES, nightlifeArtwork, type DecoratedNightlifePlace } from "@/lib/nightlife/types";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";
import { TAGLINES, type DecoratedRestaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const RATING_LABELS = ["Never again", "Not great", "Fine", "Really good", "Favorite"] as const;
const SPIN_DELAYS = [50, 50, 55, 60, 70, 80, 95, 115, 140, 170, 210, 260, 320];
type ResultMode = "dinner" | "nightlife" | "date-night";

// Keep delivery shortcuts intentionally shallow. Dinner Roulette launches the independent
// service and does not deep-link to a merchant, copy marketplace data, or claim availability.
const DELIVERY_SERVICES = [
  { name: "DoorDash", href: "https://www.doordash.com/" },
  { name: "Grubhub", href: "https://www.grubhub.com/" },
  { name: "Uber Eats", href: "https://www.ubereats.com/" },
] as const;

function levelLabel(level: number | undefined, mode: ResultMode): string | null {
  if (!level) return null;
  if (mode === "nightlife") return level === 1 ? "Chill vibe" : level === 2 ? "Balanced vibe" : "Lively vibe";
  if (mode === "date-night") return level === 1 ? "Cozy mood" : level === 2 ? "Playful mood" : "Adventurous mood";
  return null;
}

function buildWhyReasons(restaurant: DecoratedRestaurant, mode: ResultMode, favorite: boolean): string[] {
  const reasons: string[] = [];
  if (mode === "date-night") {
    const date = restaurant as DecoratedDateNightPlace;
    if (date.activityTypes?.length) reasons.push(dateNightTypeLabel([date.activityTypes[0]!]));
    const mood = levelLabel(date.moodLevel, mode); if (mood) reasons.push(mood);
  } else if (mode === "nightlife") {
    const nightlife = restaurant as DecoratedNightlifePlace; reasons.push(restaurant.cuisineLabel);
    const vibe = levelLabel(nightlife.energyLevel, mode); if (vibe) reasons.push(vibe);
  } else {
    reasons.push(restaurant.cuisineLabel); if (restaurant.priceLevel) reasons.push(`${formatPrice(restaurant.priceLevel)} budget match`);
  }
  if (favorite) reasons.push("Saved favorite");
  if (restaurant.hoursKnown && restaurant.isOpen) reasons.push("Open now"); else if (!restaurant.hoursKnown) reasons.push("Hours unconfirmed");
  reasons.push(`${formatDistance(restaurant.distanceMiles)} away`);
  return [...new Set(reasons)].slice(0, 4);
}

export function ResultOverlay({ restaurant, reelNames, onClose, onReroll, onNotTonight, skipSpin = false, mode = "dinner" }: { restaurant: DecoratedRestaurant; reelNames: string[]; onClose: () => void; onReroll: () => void; onNotTonight: () => void; skipSpin?: boolean; mode?: ResultMode; }) {
  const preferences = useAppStore((s) => s.preferences);
  const spookySeasonEnabled = useAppStore((s) => s.spookySeasonEnabled);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const recordVisit = useAppStore((s) => s.recordVisit);
  const favorite = Boolean(preferences[restaurant.id]?.favorite);
  const [phase, setPhase] = useState<"spin" | "result">(skipSpin ? "result" : "spin");
  const [reel, setReel] = useState(reelNames[0] ?? restaurant.name);
  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState(4);
  const [mounted, setMounted] = useState(false);
  const taglines = mode === "nightlife" ? NIGHTLIFE_TAGLINES : mode === "date-night" ? DATE_NIGHT_TAGLINES : TAGLINES;
  const tagline = useMemo(() => taglines[Math.floor(Math.random() * taglines.length)] ?? taglines[0], [restaurant.id, mode]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setRateOpen(false); setReel(reelNames[0] ?? restaurant.name);
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipSpin || reduceMotion) { setPhase("result"); return; }
    setPhase("spin"); const pool = reelNames.filter(Boolean).length > 1 ? reelNames.filter(Boolean) : [restaurant.name];
    let cancelled = false; let timeout = 0; let tick = 0;
    const step = () => { if (cancelled) return; if (tick >= SPIN_DELAYS.length) { setReel(restaurant.name); setPhase("result"); if ("vibrate" in navigator) navigator.vibrate?.(24); return; } setReel(pool[Math.floor(Math.random() * pool.length)] ?? restaurant.name); timeout = window.setTimeout(step, SPIN_DELAYS[tick] ?? 80); tick += 1; };
    timeout = window.setTimeout(step, 40); return () => { cancelled = true; window.clearTimeout(timeout); };
  }, [restaurant.id, restaurant.name, reelNames, skipSpin]);

  if (!mounted) return null;
  const destination = restaurant.address && restaurant.address !== "Address unavailable" ? restaurant.address : `${restaurant.lat},${restaurant.lon}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  const visual = restaurantVisual(restaurant.name, restaurant.photoKey);
  const nightlifeRestaurant = restaurant as DecoratedNightlifePlace;
  const nightlifeIcon = mode === "nightlife" ? nightlifeArtwork(nightlifeRestaurant.venueTypes ?? []) : null;
  const dateNightRestaurant = restaurant as DecoratedDateNightPlace;
  const dateNightIcon = mode === "date-night" ? getDateNightIcon({ activityTypes: dateNightRestaurant.activityTypes, cuisineLabel: restaurant.cuisineLabel, halloween: spookySeasonEnabled }) : null;
  const dateNightTypes = mode === "date-night" ? dateNightRestaurant.activityTypes ?? [] : [];
  const websiteLabel = dateNightTypes.includes("movies") ? "Check showtimes" : "Website & info";
  const whyReasons = buildWhyReasons(restaurant, mode, favorite);

  function saveChoice() { recordVisit({ restaurantId: restaurant.id, restaurantName: restaurant.name, cuisineLabel: restaurant.cuisineLabel, personalRating: rating }); setRateOpen(false); onClose(); }
  const resultKicker = mode === "nightlife" ? "Tonight's move" : mode === "date-night" ? "Tonight's date" : "Tonight's pick";
  const chosenLabel = mode === "nightlife" ? "We went here" : mode === "date-night" ? "We did this" : "We chose this";

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg"><div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      {phase === "spin" ? <div className="flex flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-kicker text-subtle">Choosing</p><div className="mt-6 w-full overflow-hidden rounded-xl bg-surface px-4 py-8 shadow-border"><p key={reel} className="reel-name font-display text-3xl text-fg">{reel}</p></div></div> : <>
        <div className="relative h-56 overflow-hidden">
          {mode === "nightlife" && nightlifeIcon ? <div className="flex size-full items-center justify-center bg-elevated p-4 outline outline-1 -outline-offset-1 outline-fg/10"><img src={nightlifeIcon} alt="" className="size-44 rounded-[2rem] object-cover shadow-lg" /></div> : mode === "date-night" && dateNightIcon ? <div className="flex size-full items-center justify-center bg-elevated p-4 outline outline-1 -outline-offset-1 outline-fg/10"><img src={dateNightIcon} alt="" className="size-44 rounded-[2rem] object-cover shadow-lg" /></div> : mode === "date-night" ? <div className="flex size-full items-center justify-center bg-elevated outline outline-1 -outline-offset-1 outline-fg/10"><div className="flex size-28 items-center justify-center rounded-full bg-surface shadow-border"><Sparkles className="size-12 text-accent" /></div></div> : visual.isLogo ? <div className="flex size-full items-center justify-center bg-surface outline outline-1 -outline-offset-1 outline-fg/10"><div className="flex h-32 w-[70%] items-center justify-center rounded-2xl bg-[#d8d8d4] p-6 shadow-sm"><img src={visual.src} alt="" className="max-h-full max-w-full object-contain" /></div></div> : <><img src={visual.src} alt="" className="size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10" /><div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" /></>}
          <button type="button" onClick={onClose} className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-md bg-bg/70 text-fg" aria-label="Close result"><X className="size-5" /></button>
        </div>
        <div className="result-in px-5 pt-2 pb-10"><p className="text-kicker text-subtle">{resultKicker}</p><h2 className="font-display mt-2 text-4xl leading-tight text-fg">{restaurant.name}</h2><p className="mt-2 text-sm text-muted">{tagline}</p>
          {mode === "date-night" && dateNightTypes.length ? <div className="mt-4 flex flex-wrap gap-2">{dateNightTypes.map((type) => <span key={type} className="rounded-full bg-elevated px-3 py-1.5 text-xs tracking-wide text-muted uppercase shadow-border">{dateNightTypeLabel([type])}</span>)}</div> : <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted"><span>{restaurant.cuisineLabel}</span>{restaurant.priceLevel ? <span>{formatPrice(restaurant.priceLevel)}</span> : null}{restaurant.rating ? <span className="inline-flex items-center gap-1 text-fg"><Star className="size-3.5 fill-fg" />{restaurant.rating.toFixed(1)}{restaurant.reviewCount ? <span className="text-subtle">({restaurant.reviewCount})</span> : null}</span> : null}</div>}
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="text-sm text-muted">{formatDistance(restaurant.distanceMiles)}{restaurant.hoursKnown ? ` · ${restaurant.isOpen ? restaurant.closesLabel ?? "Open" : "Closed"}` : ""}</p>{!restaurant.hoursKnown ? <p className="mt-1 text-sm text-subtle">Hours unconfirmed — verify before going.</p> : null}{restaurant.closingSoon ? <p className="mt-1 text-sm text-danger">Closing soon — verify before making the trip.</p> : null}<p className="mt-1 text-sm text-subtle">{restaurant.address}</p></div><RideshareQuickActions restaurant={restaurant} /></div>
          <div className="mt-5 rounded-xl bg-surface p-4 shadow-border"><div className="flex items-center gap-2"><Sparkles className="size-4 text-accent" /><p className="text-xs tracking-[0.18em] text-subtle uppercase">Why this pick?</p></div><div className="mt-3 flex flex-wrap gap-2">{whyReasons.map((reason) => <span key={reason} className="rounded-full bg-elevated px-3 py-1.5 text-xs text-muted">{reason}</span>)}</div></div>
          <div className="mt-6 space-y-2"><Button size="lg" className="w-full" asChild><a href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPinned className="size-5" /><span className="tracking-kicker uppercase">Directions · Google Maps ↗</span></a></Button>
            <p className="px-2 text-center text-[11px] leading-relaxed text-subtle">Directions open an independent third-party mapping service. Verify destination details before travel.</p>
            {mode === "date-night" && restaurant.website ? <Button size="lg" variant="secondary" className="w-full" asChild><a href={restaurant.website} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /><span className="tracking-kicker uppercase">{websiteLabel} ↗</span></a></Button> : null}
            {mode === "date-night" && restaurant.website ? <p className="px-2 text-center text-[11px] leading-relaxed text-subtle">Opens the venue's external website. Hours, prices, tickets, and availability are controlled by the venue.</p> : null}
            {rateOpen ? <div className="rounded-xl bg-surface p-4 shadow-border"><p className="text-sm text-fg">Our rating</p><div className="mt-3 flex justify-between">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} className="flex size-11 items-center justify-center" aria-label={`${value} ${RATING_LABELS[value-1]}`}><Heart className={cn("size-6", value <= rating ? "fill-heart text-heart" : "text-subtle")} /></button>)}</div><p className="mt-1 text-center text-xs text-subtle">{RATING_LABELS[rating-1]}</p><div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => setRateOpen(false)}>Cancel</Button><Button onClick={saveChoice}>Save choice</Button></div></div> : <><div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={onReroll}><RotateCcw className="size-4" />Reroll</Button><Button variant="danger" onClick={onNotTonight}><Ban className="size-4" />Not tonight</Button></div><div className="grid grid-cols-2 gap-2"><Button variant={favorite ? "default" : "outline"} onClick={() => toggleFavorite({ restaurantId: restaurant.id, name: restaurant.name, cuisineLabel: restaurant.cuisineLabel, photoKey: restaurant.photoKey, lat: restaurant.lat, lon: restaurant.lon, address: restaurant.address, priceLevel: restaurant.priceLevel })}><Heart className={cn("size-4", favorite && "fill-current")} />{favorite ? "Saved" : "Save"}</Button><Button variant="outline" onClick={() => setRateOpen(true)}><Star className="size-4" />{chosenLabel}</Button></div></>}
            {mode === "dinner" ? <div className="mt-4 rounded-xl bg-surface p-4 shadow-border"><div className="flex items-center gap-2"><Utensils className="size-4 text-accent" /><p className="text-xs tracking-[0.18em] text-subtle uppercase">Order instead · external services</p></div><p className="mt-2 text-[11px] leading-relaxed text-subtle">Open an independent delivery service, then search for {restaurant.name}. Dinner Roulette does not place orders, copy marketplace listings, or claim that this restaurant is available on any service.</p><div className="mt-3 grid grid-cols-3 gap-2">{DELIVERY_SERVICES.map((service) => <a key={service.name} className="rounded-lg bg-elevated px-2 py-3 text-center text-xs text-fg" href={service.href} target="_blank" rel="noopener noreferrer external" aria-label={`Open ${service.name}, external service`}>{service.name} ↗</a>)}</div></div> : null}
            {mode === "nightlife" ? <div className="mt-4 rounded-xl bg-surface p-3 text-center text-xs leading-relaxed text-subtle shadow-border"><div className="flex items-center justify-center gap-2"><MoonStar className="size-4" />Nightlife and casino information is for discovery only.</div><p className="mt-2">Verify admission, age rules, hours, and local requirements directly with the venue. Dinner Roulette does not sell alcohol, accept wagers, or provide gambling services.</p></div> : null}
            {restaurant.phone ? <Button variant="ghost" className="w-full" asChild><a href={`tel:${restaurant.phone}`}><Phone className="size-4" />Call venue</a></Button> : null}
          </div>
        </div></>}
    </div></div>, document.body,
  );
}