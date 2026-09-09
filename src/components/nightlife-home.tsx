import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LayoutGrid, LocateFixed, MapPin, Shuffle } from "lucide-react";
import { DiscoveryLoading, DiscoveryNotice } from "@/components/discovery-status";
import { OptionsOverlay } from "@/components/options-overlay";
import { ResultOverlay } from "@/components/result-overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
import { lookupLocation, lookupReverseLocation } from "@/lib/restaurants/search";
import { DISTANCE_OPTIONS, type DecoratedRestaurant, type Restaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function weightedPick(items: DecoratedNightlifePlace[], energy: number, shown: string[]) {
  if (!items.length) return null;
  const target = 1 + (Math.min(Math.max(energy, 0), 100) / 100) * 2;
  const weights = items.map((item) => {
    const distancePenalty = 1 / (1 + item.distanceMiles * 0.04);
    const energyFit = 1 / (1 + Math.abs(item.energyLevel - target) * 0.8);
    const shownPenalty = shown.includes(item.id) ? 0.12 : 1;
    return Math.max(0.001, distancePenalty * energyFit * shownPenalty);
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    cursor -= weights[i] ?? 0;
    if (cursor <= 0) return items[i] ?? items[0];
  }
  return items[items.length - 1] ?? null;
}

function pickOptions(items: DecoratedNightlifePlace[], energy: number, shown: string[], count = 4) {
  const remaining = [...items];
  const result: DecoratedNightlifePlace[] = [];
  while (remaining.length && result.length < count) {
    const next = weightedPick(remaining, energy, shown);
    if (!next) break;
    result.push(next);
    remaining.splice(remaining.findIndex((item) => item.id === next.id), 1);
  }
  return result;
}

export function NightlifeHome() {
  const location = useAppStore((s) => s.location);
  const preferences = useAppStore((s) => s.preferences);
  const exclusions = useAppStore((s) => s.exclusions);
  const sessionShown = useAppStore((s) => s.sessionShown);
  const setLocation = useAppStore((s) => s.setLocation);
  const markShown = useAppStore((s) => s.markShown);
  const excludeTonight = useAppStore((s) => s.excludeTonight);

  const [filters, setFilters] = useState<NightlifeFilters>(DEFAULT_NIGHTLIFE_FILTERS);
  const [venues, setVenues] = useState<NightlifePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [locOpen, setLocOpen] = useState(false);
  const [locQuery, setLocQuery] = useState("");
  const [locBusy, setLocBusy] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
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

  const eligible = useMemo(() => {
    const anything = filters.venueTypes.includes("anything");
    return decorated.filter((venue) => {
      if (venue.distanceMiles > filters.radiusMiles + 0.05) return false;
      if (exclusions.some((item) => item.restaurantId === venue.id && item.expiresAt > Date.now())) return false;
      const pref = preferences[venue.id];
      if (pref?.neverRecommend) return false;
      if (filters.favoritesOnly && !pref?.favorite) return false;
      if (filters.openNowOnly && venue.hoursKnown && !venue.isOpen) return false;
      if (venue.priceLevel == null) {
        if (!filters.includeUnknownPrice) return false;
      } else if (venue.priceLevel < filters.minPrice || venue.priceLevel > filters.maxPrice) return false;
      if (!anything && !venue.venueTypes.some((type) => filters.venueTypes.includes(type))) return false;
      return true;
    });
  }, [decorated, exclusions, filters, preferences]);

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

  async function useDeviceLocation() {
    setLocBusy(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Location isn't available in this browser.");
      setLocBusy(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await lookupReverseLocation({ data: { lat: pos.coords.latitude, lon: pos.coords.longitude } });
          setLocation({ ...result, source: "geo" });
          setLocOpen(false);
        } catch {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Current location", source: "geo" });
          setLocOpen(false);
        } finally {
          setLocBusy(false);
        }
      },
      () => {
        setLocError("Location permission denied. Enter a city or ZIP instead.");
        setLocBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function searchManualLocation(event: FormEvent) {
    event.preventDefault();
    if (!locQuery.trim()) return;
    setLocBusy(true);
    setLocError(null);
    try {
      const result = await lookupLocation({ data: { query: locQuery } });
      setLocation({ ...result, source: "manual" });
      setLocOpen(false);
      setLocQuery("");
    } catch (err) {
      setLocError(err instanceof Error ? err.message : "Couldn't find that place");
    } finally {
      setLocBusy(false);
    }
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

      <section className="rounded-xl bg-surface p-4 shadow-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-subtle">Searching near</p>
            <p className="truncate text-base text-fg">{location.label}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" aria-label="Use current location" onClick={useDeviceLocation}>
              <LocateFixed className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Change location" onClick={() => setLocOpen((value) => !value)}>
              <MapPin className="size-5" />
            </Button>
          </div>
        </div>
        {locOpen ? (
          <form className="mt-4 space-y-3" onSubmit={searchManualLocation}>
            <Input value={locQuery} onChange={(event) => setLocQuery(event.target.value)} placeholder="City or ZIP code" aria-label="City or ZIP code" />
            {locError ? <p className="text-sm text-danger">{locError}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={locBusy}>{locBusy ? "Finding…" : "Set location"}</Button>
              <Button type="button" variant="secondary" onClick={() => setLocOpen(false)}>Cancel</Button>
            </div>
          </form>
        ) : null}
      </section>

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
          <div><p className="text-sm text-fg">Open now only</p><p className="text-xs text-subtle">Skip places that have already closed</p></div>
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
