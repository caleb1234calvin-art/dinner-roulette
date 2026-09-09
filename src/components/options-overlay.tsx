import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Shuffle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDateNightIcon } from "@/lib/date-night/icons";
import { isHalloweenDateNightActive } from "@/lib/date-night/season";
import { dateNightTypeLabel, type DecoratedDateNightPlace } from "@/lib/date-night/types";
import { nightlifeArtwork, type DecoratedNightlifePlace } from "@/lib/nightlife/types";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";
import { formatDistance } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import type { DecoratedRestaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type ResultMode = "dinner" | "nightlife" | "date-night";

function decodeXmlText(value: string): string {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function generatedBadgeLabel(src: string): string | null {
  if (!src.startsWith("data:image/svg+xml")) return null;
  try {
    const comma = src.indexOf(",");
    if (comma < 0) return null;
    const svg = decodeURIComponent(src.slice(comma + 1));
    const lines = [...svg.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map((match) => decodeXmlText(match[1] ?? "").trim()).filter(Boolean);
    return lines.length ? lines.join("\n") : null;
  } catch {
    return null;
  }
}

function badgeDisplayLabel(generatedLabel: string, restaurantName: string): string {
  const generatedWords = generatedLabel.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  const sourceWords = restaurantName.replace(/\s+/g, " ").trim();
  return generatedWords === sourceWords.toUpperCase() ? sourceWords : generatedLabel;
}

function badgeTextSize(label: string): string {
  const longestLine = Math.max(...label.split("\n").map((line) => line.length));
  if (longestLine > 20) return "text-[12px]";
  if (longestLine > 16) return "text-[13px]";
  if (longestLine > 13) return "text-sm";
  if (longestLine > 9) return "text-base";
  return "text-lg";
}

export function OptionsOverlay({ restaurants, onClose, onSelect, onShuffle, onNotTonight, mode = "dinner" }: {
  restaurants: DecoratedRestaurant[];
  onClose: () => void;
  onSelect: (restaurant: DecoratedRestaurant) => void;
  onShuffle: () => void;
  onNotTonight: (restaurant: DecoratedRestaurant) => void;
  mode?: ResultMode;
}) {
  const [mounted, setMounted] = useState(false);
  const spookySeasonEnabled = useAppStore((s) => s.spookySeasonEnabled);
  const halloween = mode === "date-night" && isHalloweenDateNightActive(spookySeasonEnabled);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const kicker = mode === "nightlife" ? "Nightlife shortlist" : mode === "date-night" ? (halloween ? "🎃 Date Night · Halloween" : "Date Night shortlist") : "Compressed shortlist";

  return createPortal(
    <div className={cn("fixed inset-0 z-50 overflow-y-auto bg-bg", halloween && "date-night-halloween-options")}>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1"><p className="text-kicker text-subtle">{kicker}</p><h2 className="font-display mt-1 text-3xl leading-tight text-fg">Tonight's options</h2><p className="mt-1 text-sm text-muted">Pick one, or let us shuffle again.</p></div>
          <button type="button" onClick={onClose} className="mt-2 flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-fg shadow-border" aria-label="Close options"><X className="size-5" /></button>
        </div>
        <div className={cn("mt-5 grid content-start gap-x-3 gap-y-4", restaurants.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
          {restaurants.map((restaurant) => <OptionCard key={restaurant.id} restaurant={restaurant} mode={mode} halloween={halloween} onSelect={() => onSelect(restaurant)} onNotTonight={() => onNotTonight(restaurant)} />)}
        </div>
        <div className="mt-4"><Button size="lg" variant="secondary" className="w-full" onClick={onShuffle}><Shuffle className="size-4" /><span className="tracking-kicker uppercase">Shuffle options</span></Button></div>
      </div>
    </div>,
    document.body,
  );
}

function OptionCard({ restaurant, mode, halloween, onSelect, onNotTonight }: { restaurant: DecoratedRestaurant; mode: ResultMode; halloween: boolean; onSelect: () => void; onNotTonight: () => void; }) {
  const openLabel = restaurant.hoursKnown ? (restaurant.isOpen ? restaurant.closesLabel ?? "Open" : "Closed") : null;
  const visual = restaurantVisual(restaurant.name, restaurant.photoKey);
  const generatedLabel = visual.isLogo ? generatedBadgeLabel(visual.src) : null;
  const displayLabel = generatedLabel ? badgeDisplayLabel(generatedLabel, restaurant.name) : null;
  const dateNightRestaurant = restaurant as DecoratedDateNightPlace;
  const dateNightIcon = mode === "date-night" ? getDateNightIcon({ activityTypes: dateNightRestaurant.activityTypes, cuisineLabel: restaurant.cuisineLabel, halloween }) : null;
  const activityTypes = mode === "date-night" ? dateNightRestaurant.activityTypes ?? [] : [];
  const nightlifeRestaurant = restaurant as DecoratedNightlifePlace;
  const nightlifeIcon = mode === "nightlife" ? nightlifeArtwork(nightlifeRestaurant.venueTypes ?? []) : null;

  return (
    <article className="flex min-h-[17rem] flex-col overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="relative">
        <button type="button" onClick={onSelect} className="block w-full text-left">
          {mode === "date-night" && dateNightIcon ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={dateNightIcon} alt="" className={cn("size-24 rounded-2xl object-cover shadow-sm", halloween && "date-night-halloween-icon")} /></div>
          ) : mode === "date-night" ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated outline outline-1 -outline-offset-1 outline-fg/10"><Sparkles className="size-10 text-accent" /></div>
          ) : nightlifeIcon ? (
            <div className="flex h-28 w-full items-center justify-center bg-elevated p-2 outline outline-1 -outline-offset-1 outline-fg/10"><img src={nightlifeIcon} alt="" className="size-24 rounded-2xl object-cover shadow-sm" /></div>
          ) : visual.isLogo ? (
            <div className="flex h-28 w-full items-center justify-center bg-surface outline outline-1 -outline-offset-1 outline-fg/10"><div className="shortlist-brand-stage relative flex h-20 w-[76%] items-center justify-center overflow-hidden rounded-xl p-3"><div className="absolute -top-5 -left-4 size-16 rounded-full bg-accent/15 blur-sm" /><div className="absolute -right-3 -bottom-5 size-14 rounded-full bg-accent/10 blur-sm" /><Sparkles className="absolute top-2 left-2 size-3.5 text-accent/70" />{displayLabel ? <span className={cn("relative z-10 max-w-[90%] whitespace-pre-line break-words text-center font-display font-semibold leading-[0.98] tracking-[0.015em] text-balance text-fg", badgeTextSize(displayLabel))}>{displayLabel}</span> : <img src={visual.src} alt="" className="shortlist-logo-image relative z-10 max-h-[78%] max-w-[78%] object-contain" />}</div></div>
          ) : <img src={visual.src} alt="" className="h-28 w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10" />}
        </button>
        <button type="button" onClick={onNotTonight} className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-md bg-bg/80 text-fg" aria-label={`Not tonight: ${restaurant.name}`}><Ban className="size-4" /></button>
      </div>
      <button type="button" onClick={onSelect} className="flex flex-1 flex-col px-3 py-3 text-left">
        <h3 className="font-display line-clamp-2 text-lg leading-tight text-fg">{restaurant.name}</h3>
        {mode === "date-night" && activityTypes.length ? <div className="mt-2 flex flex-wrap gap-1">{activityTypes.slice(0, 3).map((type) => <span key={type} className="rounded-full bg-elevated px-2 py-1 text-[10px] tracking-wide text-muted uppercase">{dateNightTypeLabel([type])}</span>)}</div> : <p className="mt-1 text-xs text-muted">{restaurant.cuisineLabel}{restaurant.priceLevel ? ` · ${formatPrice(restaurant.priceLevel)}` : ""}</p>}
        <p className="mt-2 text-xs text-subtle">{formatDistance(restaurant.distanceMiles)}{openLabel ? ` · ${openLabel}` : ""}</p>
        {mode === "date-night" && !restaurant.hoursKnown ? <p className="mt-1 text-xs text-subtle">Hours unknown — check before going</p> : null}
        {restaurant.closingSoon ? <p className="mt-1 text-xs text-danger">Closing soon</p> : null}
      </button>
    </article>
  );
}