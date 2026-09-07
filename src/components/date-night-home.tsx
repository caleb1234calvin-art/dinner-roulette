import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Heart, LayoutGrid, LocateFixed, MapPin, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { OptionsOverlay } from "@/components/options-overlay";
import { ResultOverlay } from "@/components/result-overlay";
import { decorateAll } from "@/lib/restaurants/decorate";
import { lookupLocation, lookupReverseLocation } from "@/lib/restaurants/search";
import { DISTANCE_OPTIONS, type DecoratedRestaurant, type Restaurant } from "@/lib/restaurants/types";
import { RADIUS_OPTIONS, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { searchDateNight } from "@/lib/date-night/search";
import {
  DATE_NIGHT_TYPE_CHIPS,
  DEFAULT_DATE_NIGHT_FILTERS,
  dateNightMoodLabel,
  type DateNightFilters,
  type DateNightPlace,
  type DateNightTypeId,
  type DecoratedDateNightPlace,
} from "@/lib/date-night/types";

function weightedPick(items: DecoratedDateNightPlace[], mood: number, shown: string[]) {
  if (!items.length) return null;
  const target = 1 + (Math.min(Math.max(mood, 0), 100) / 100) * 2;
  const weights = items.map((item) => {
    const distancePenalty = 1 / (1 + item.distanceMiles * 0.04);
    const moodFit = 1 / (1 + Math.abs(item.moodLevel - target) * 0.8);
    const shownPenalty = shown.includes(item.id) ? 0.12 : 1;
    return Math.max(0.001, distancePenalty * moodFit * shownPenalty);
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    cursor -= weights[i] ?? 0;
    if (cursor <= 0) return items[i] ?? items[0];
  }
  return items[items.length - 1] ?? null;
}

function pickOptions(items: DecoratedDateNightPlace[], mood: number, shown: string[], count = 4) {
  const remaining = [...items];
  const result: DecoratedDateNightPlace[] = [];
  while (remaining.length && result.length < count) {
    const next = weightedPick(remaining, mood, shown);
    if (!next) break;
    result.push(next);
    remaining.splice(remaining.findIndex((item) => item.id === next.id), 1);
  }
  return result;
}

export function DateNightHome() {
  const location = useAppStore((s) => s.location);
  const preferences = useAppStore((s) => s.preferences);
  const exclusions = useAppStore((s) => s.exclusions);
  const sessionShown = useAppStore((s) => s.sessionShown);
  const setLocation = useAppStore((s) => s.setLocation);
  const markShown = useAppStore((s) => s.markShown);
  const excludeTonight = useAppStore((s) => s.excludeTonight);

  const [filters, setFilters] = useState<DateNightFilters>(DEFAULT_DATE_NIGHT_FILTERS);
  const [venues, setVenues] = useState<DateNightPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locOpen, setLocOpen] = useState(false);
  const [locQuery, setLocQuery] = useState("");
  const [locBusy, setLocBusy] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [pick, setPick] = useState<DecoratedDateNightPlace | null>(null);
  const [reelNames, setReelNames] = useState<string[]>([]);
  const [skipSpin, setSkipSpin] = useState(false);
  const [options, setOptions] = useState<DecoratedDateNightPlace[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchDateNight({ data: { lat: location.lat, lon: location.lon, radiusMiles: Math.max(filters.radiusMiles, 15) } })
      .then((result) => {
        if (!cancelled) setVenues(result.venues);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setVenues([]);
          setError(err instanceof Error ? err.message : "Could not load date-night activities");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lon, filters.radiusMiles]);

  const decorated = useMemo(
    () => decorateAll(venues as Restaurant[], location) as DecoratedDateNightPlace[],
    [venues, location],
  );

  const eligible = useMemo(() => {
    const anything = filters.activityTypes.includes("anything");
    return decorated.filter((venue) => {
      if (venue.distanceMiles > filters.radiusMiles + 0.05) return false;
      if (exclusions.some((item) => item.restaurantId === venue.id && item.expiresAt > Date.now())) return false;
      const pref = preferences[venue.id];
      if (pref?.neverRecommend) return false;
      if (filters.favoritesOnly && !pref?.favorite) return false;
      if (filters.openNowOnly && venue.hoursKnown && !venue.isOpen) return false;
      if (!anything && !venue.activityTypes.some((type) => filters.activityTypes.includes(type))) return false;
      return true;
    });
  }, [decorated, exclusions, filters, preferences]);

  function updateFilters(patch: Partial<DateNightFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function toggleActivityType(id: DateNightTypeId) {
    if (id === "anything") {
      updateFilters({ activityTypes: ["anything"] });
      return;
    }
    const current = filters.activityTypes.filter((item) => item !== "anything");
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    updateFilters({ activityTypes: next.length ? next : ["anything"] });
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
    const chosen = weightedPick(pool, filters.mood, sessionShown);
    if (!chosen) return;
    markShown(chosen.id);
    setReelNames(pool.map((item) => item.name));
    setSkipSpin(false);
    setPick(chosen);
    if ("vibrate" in navigator) navigator.vibrate?.(18);
  }

  function dealOptions() {
    const next = pickOptions(eligible, filters.mood, sessionShown, 4);
    next.forEach((item) => markShown(item.id));
    setOptions(next.length ? next : null);
    if (next.length && "vibrate" in navigator) navigator.vibrate?.(12);
  }

  const radiusIndex = Math.max(0, RADIUS_OPTIONS.indexOf(filters.radiusMiles));

  return (
    <main className="px-4 pb-48 pt-5">
      <header className="mb-6">
        <p className="text-kicker text-accent">Dinner roulette · Date Night</p>
        <h1 className="font-display mt-1 text-4xl leading-tight text-fg">What Should We Do?</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">Set the mood. Let the app pick the date.</p>
      </header>

      <section className="rounded-xl bg-surface p-4 shadow-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-subtle">Searching near</p>
            <p className="truncate text-base text-fg">{location.label}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" aria-label="Use current location" onClick={useDeviceLocation}><LocateFixed className="size-5" /></Button>
            <Button variant="ghost" size="icon" aria-label="Change location" onClick={() => setLocOpen((value) => !value)}><MapPin className="size-5" /></Button>
          </div>
        </div>
        {locOpen ? (
          <form className="mt-4 space-y-3" onSubmit={searchManualLocation}>
            <Input value={locQuery} onChange={(event) => setLocQuery(event.target.value)} placeholder="City or ZIP code" />
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
        <Slider min={0} max={DISTANCE_OPTIONS.length - 1} step={1} value={[radiusIndex]} onValueChange={([index]) => updateFilters({ radiusMiles: DISTANCE_OPTIONS[index ?? 0] ?? 15 })} />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>1</span><span>10</span><span>30</span></div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-sm text-muted">What sounds fun?</h2>
        <div className="flex flex-wrap gap-2">
          {DATE_NIGHT_TYPE_CHIPS.map((chip) => {
            const selected = chip.id === "anything" ? filters.activityTypes.includes("anything") : filters.activityTypes.includes(chip.id);
            return (
              <button key={chip.id} type="button" aria-pressed={selected} onClick={() => toggleActivityType(chip.id)} className={cn("chip min-h-10 rounded-full px-3 py-2 text-sm shadow-border", selected ? "bg-accent text-accent-fg" : "bg-surface text-muted")}>{chip.label}</button>
            );
          })}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">What's the mood?</h2>
          <p className="text-base text-fg">{dateNightMoodLabel(filters.mood)}</p>
        </div>
        <Slider min={0} max={100} step={1} value={[filters.mood]} onValueChange={([value]) => updateFilters({ mood: value ?? 50 })} />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>Cozy</span><span>Playful</span><span>Adventurous</span></div>
      </section>

      <section className="mt-7 space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Open now only</p><p className="text-xs text-subtle">Skip activities that have already closed</p></div>
          <Switch checked={filters.openNowOnly} onCheckedChange={(checked) => updateFilters({ openNowOnly: checked })} />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Favorites only</p><p className="text-xs text-subtle">Pick from date spots you've saved</p></div>
          <Switch checked={filters.favoritesOnly} onCheckedChange={(checked) => updateFilters({ favoritesOnly: checked })} />
        </div>
      </section>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {!loading && !error && eligible.length === 0 ? <div className="mt-5 rounded-xl bg-surface p-4 text-sm text-muted shadow-border">Nothing matches those filters. Try increasing distance or allowing more activity types.</div> : null}

      <div className="fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-lg px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="rounded-xl bg-bg/95 p-3 shadow-border backdrop-blur-sm">
          <p className="mb-2 text-center text-xs text-subtle tabular-nums">{loading ? "Finding date ideas…" : `${eligible.length} activities match`}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="lg" className="pick-pulse h-14 gap-1.5 px-2 font-display" onClick={() => roll()} disabled={!eligible.length || loading}><Heart className="size-4" />Pick our date</Button>
            <Button size="lg" variant="secondary" className="h-14 gap-1.5 px-2" onClick={dealOptions} disabled={!eligible.length || loading}><LayoutGrid className="size-4" />Give us options</Button>
          </div>
        </div>
      </div>

      {pick ? <ResultOverlay restaurant={pick as DecoratedRestaurant} reelNames={reelNames} onClose={() => setPick(null)} onReroll={() => roll()} onNotTonight={() => { excludeTonight({ restaurantId: pick.id, name: pick.name }); setPick(null); }} skipSpin={skipSpin} mode="date-night" /> : null}
      {options ? <OptionsOverlay restaurants={options as DecoratedRestaurant[]} onClose={() => setOptions(null)} onSelect={(restaurant) => { setOptions(null); setSkipSpin(true); setPick(restaurant as DecoratedDateNightPlace); }} onShuffle={dealOptions} onNotTonight={(restaurant) => excludeTonight({ restaurantId: restaurant.id, name: restaurant.name })} mode="date-night" /> : null}
    </main>
  );
}
