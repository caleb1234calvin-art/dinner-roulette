import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Shuffle } from "lucide-react";
import { DiscoveryLoading, DiscoveryNotice } from "@/components/discovery-status";
import { OptionsOverlay } from "@/components/options-overlay";
import { ResultOverlay } from "@/components/result-overlay";
import { Button } from "@/components/ui/button";
import { LocationControl } from "@/components/location-control";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { weightedPick, pickOptions, eligibleNightlife } from "@/lib/nightlife/selection";
import { searchNightlife } from "@/lib/nightlife/search";
import {
  DEFAULT_NIGHTLIFE_FILTERS,
  NIGHTLIFE_TYPE_CHIPS,
  nightlifeEnergyLabel,
  type DecoratedNightlifePlace,
  type NightlifeFilters,
  type NightlifePlace,
  type NightlifeTypeId,
} from "@/lib/nightlife/types";
import { decorateAll } from "@/lib/restaurants/decorate";
import { formatPrice } from "@/lib/restaurants/hours";
import { DISTANCE_OPTIONS, type DecoratedRestaurant, type Restaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function NightlifeHome() {
  const location = useAppStore((s) => s.location);
  const preferences = useAppStore((s) => s.preferences);
  const exclusions = useAppStore((s) => s.exclusions);
  const sessionShown = useAppStore((s) => s.sessionShown);
  const markShown = useAppStore((s) => s.markShown);
  const excludeTonight = useAppStore((s) => s.excludeTonight);

  const [filters, setFilters] = useState<NightlifeFilters>(DEFAULT_NIGHTLIFE_FILTERS);
  const [venues, setVenues] = useState<NightlifePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pick, setPick] = useState<DecoratedNightlifePlace | null>(null);
  const [reelNames, setReelNames] = useState<string[]>([]);
  const [skipSpin, setSkipSpin] = useState(false);
  const [options, setOptions] = useState<DecoratedNightlifePlace[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setWarning(null);
    searchNightlife({
      data: {
        lat: location.lat,
        lon: location.lon,
        radiusMiles: Math.max(filters.radiusMiles, 15),
      },
    })
      .then((result) => {
        if (cancelled) return;
        setVenues(result.venues);
        setWarning(result.warning ?? null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setVenues([]);
        setError(err instanceof Error ? err.message : "Could not load nightlife venues");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lon, filters.radiusMiles]);

  const decorated = useMemo(
    () => decorateAll(venues as Restaurant[], location) as DecoratedNightlifePlace[],
    [venues, location],
  );

  const eligible = useMemo(
    () => eligibleNightlife(decorated, filters, preferences, exclusions),
    [decorated, exclusions, filters, preferences],
  );

  function updateFilters(patch: Partial<NightlifeFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function toggleVenueType(id: NightlifeTypeId) {
    if (id === "anything") {
      updateFilters({ venueTypes: ["anything"] });
      return;
    }
    const current = filters.venueTypes.filter((item) => item !== "anything");
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    updateFilters({ venueTypes: next.length ? next : ["anything"] });
  }

  function roll(pool = eligible) {
    const chosen = weightedPick(pool, filters.energy, sessionShown);
    if (!chosen) return;
    markShown(chosen.id);
    setReelNames(pool.map((item) => item.name));
    setSkipSpin(false);
    setPick(chosen);
    if ("vibrate" in navigator) navigator.vibrate?.(18);
  }

  function dealOptions() {
    const next = pickOptions(eligible, filters.energy, sessionShown, 4);
    next.forEach((item) => markShown(item.id));
    setOptions(next.length ? next : null);
    if (next.length && "vibrate" in navigator) navigator.vibrate?.(12);
  }

  const radiusIndex = Math.max(0, DISTANCE_OPTIONS.indexOf(filters.radiusMiles));

  return (
    <main className="px-4 pb-48 pt-5">
      <header className="mb-6">
        <p className="text-kicker text-accent">Dinner roulette · Nightlife</p>
        <h1 className="font-display mt-1 text-4xl leading-tight text-fg">What's the Move?</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">Set the vibe. Let the app pick the place.</p>
      </header>

      <LocationControl />

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">How far?</h2>
          <p className="text-base text-fg tabular-nums">Within {filters.radiusMiles} miles</p>
        </div>
        <Slider min={0} max={DISTANCE_OPTIONS.length - 1} step={1} value={[radiusIndex]} onValueChange={([index]) => updateFilters({ radiusMiles: DISTANCE_OPTIONS[index ?? 0] ?? 10 })} aria-label="Travel distance" />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>1</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span></div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">Budget</h2>
          <p className="text-base text-fg">{formatPrice(filters.minPrice)} — {formatPrice(filters.maxPrice)}</p>
        </div>
        <Slider min={1} max={4} step={1} minStepsBetweenThumbs={0} value={[filters.minPrice, filters.maxPrice]} onValueChange={([min, max]) => updateFilters({ minPrice: (min ?? 1) as 1 | 2 | 3 | 4, maxPrice: (max ?? 4) as 1 | 2 | 3 | 4 })} aria-label="Price range" />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>$</span><span>$$</span><span>$$$</span><span>$$$$</span></div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-sm text-muted">What kind of place?</h2>
        <div className="flex flex-wrap gap-2">
          {NIGHTLIFE_TYPE_CHIPS.map((chip) => {
            const selected = chip.id === "anything" ? filters.venueTypes.includes("anything") : filters.venueTypes.includes(chip.id);
            const featured = Boolean(chip.iconSrc);
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleVenueType(chip.id)}
                className={cn(
                  "chip min-h-11 rounded-full text-sm shadow-border transition",
                  featured ? "flex items-center gap-2 py-1.5 pl-1.5 pr-3" : "px-3 py-2",
                  selected ? "bg-accent text-accent-fg" : "bg-surface text-muted",
                )}
              >
                {chip.iconSrc ? <img src={chip.iconSrc} alt="" className="size-9 rounded-lg object-cover" /> : null}
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">What's the vibe?</h2>
          <p className="text-base text-fg">{nightlifeEnergyLabel(filters.energy)}</p>
        </div>
        <Slider min={0} max={100} step={1} value={[filters.energy]} onValueChange={([value]) => updateFilters({ energy: value ?? 50 })} aria-label="Chill to lively" />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>Chill</span><span>Lively</span></div>
      </section>

      <section className="mt-7 space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Open now only</p><p className="text-xs text-subtle">Only places with confirmed open hours</p></div>
          <Switch checked={filters.openNowOnly} onCheckedChange={(checked) => updateFilters({ openNowOnly: checked })} aria-label="Open now only" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Favorites only</p><p className="text-xs text-subtle">Pick from nightlife spots you've saved</p></div>
          <Switch checked={filters.favoritesOnly} onCheckedChange={(checked) => updateFilters({ favoritesOnly: checked })} aria-label="Favorites only" />
        </div>
      </section>

      {loading ? <DiscoveryLoading label="Finding nightlife near you…" /> : null}
      {warning ? (
        <DiscoveryNotice
          tone="fallback"
          title="Live discovery is taking the night off"
          body="Dinner Roulette is using verified saved local nightlife instead, so you can keep picking without interruption."
        />
      ) : null}
      {error ? (
        <DiscoveryNotice
          tone="error"
          title="We couldn't refresh nightlife right now"
          body="Try again in a moment, change your location, or widen your search radius."
        />
      ) : null}
      {!loading && !error && eligible.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface p-4 text-sm text-muted shadow-border">Nothing matches those filters. Try increasing distance, allowing more venue types, or turning off Open now only.</div>
      ) : null}

      <div className="fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-lg px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="nightlife-theme rounded-xl bg-bg/95 p-3 shadow-border backdrop-blur-sm">
          <p className="mb-2 text-center text-xs text-subtle tabular-nums">{loading ? "Finding nightlife…" : `${eligible.length} venues match`}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="lg" className="pick-pulse h-14 gap-1.5 px-2 font-display" onClick={() => roll()} disabled={loading || eligible.length === 0}>
              <Shuffle className="size-4 shrink-0" /><span className="text-center text-xs font-medium tracking-wide uppercase">Pick for us</span>
            </Button>
            <Button size="lg" variant="secondary" className="h-14 gap-1.5 px-2 font-display" onClick={dealOptions} disabled={loading || eligible.length === 0}>
              <LayoutGrid className="size-4 shrink-0" /><span className="text-center text-xs font-medium tracking-wide uppercase">Give us options</span>
            </Button>
          </div>
        </div>
      </div>

      {options ? (
        <OptionsOverlay
          restaurants={options as DecoratedRestaurant[]}
          mode="nightlife"
          onClose={() => setOptions(null)}
          onSelect={(restaurant) => {
            setSkipSpin(true);
            setReelNames(options.map((item) => item.name));
            setPick(restaurant as DecoratedNightlifePlace);
          }}
          onShuffle={dealOptions}
          onNotTonight={(restaurant) => {
            excludeTonight(restaurant.id, restaurant.name);
            setOptions((current) => current?.filter((item) => item.id !== restaurant.id) ?? null);
          }}
        />
      ) : null}

      {pick ? (
        <ResultOverlay
          restaurant={pick}
          reelNames={reelNames}
          skipSpin={skipSpin}
          mode="nightlife"
          onClose={() => setPick(null)}
          onReroll={() => roll(eligible.filter((item) => item.id !== pick.id || eligible.length === 1))}
          onNotTonight={() => {
            excludeTonight(pick.id, pick.name);
            setPick(null);
          }}
        />
      ) : null}
    </main>
  );
}
