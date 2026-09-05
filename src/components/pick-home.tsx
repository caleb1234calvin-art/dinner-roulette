import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ChevronDown, LayoutGrid, LocateFixed, MapPin, Shuffle, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { OptionsOverlay } from "@/components/options-overlay";
import { ResultOverlay } from "@/components/result-overlay";
import { lookupLocation, lookupReverseLocation, searchRestaurants } from "@/lib/restaurants/search";
import { decorateAll } from "@/lib/restaurants/decorate";
import { CUISINE_CHIPS, PRIMARY_CUISINES, isAnythingSelected } from "@/lib/restaurants/cuisines";
import { formatPrice } from "@/lib/restaurants/hours";
import {
  applyHardFilters,
  diagnoseEmptyPool,
  selectOptions,
  selectRestaurant,
  type EmptyCause,
  type WeightContext,
} from "@/lib/restaurants/weighting";
import { DISTANCE_OPTIONS, type CuisineId, type DecoratedRestaurant, type Restaurant } from "@/lib/restaurants/types";
import { PRESETS } from "@/lib/presets";
import { RADIUS_OPTIONS, useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function moodLabel(value: number): string {
  if (value < 34) return "Familiar";
  if (value < 67) return "Balanced";
  return "Adventurous";
}

export function PickHome() {
  const location = useAppStore((s) => s.location);
  const filters = useAppStore((s) => s.filters);
  const preferences = useAppStore((s) => s.preferences);
  const visits = useAppStore((s) => s.visits);
  const exclusions = useAppStore((s) => s.exclusions);
  const sessionShown = useAppStore((s) => s.sessionShown);
  const setLocation = useAppStore((s) => s.setLocation);
  const setFilters = useAppStore((s) => s.setFilters);
  const toggleCuisine = useAppStore((s) => s.toggleCuisine);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const markShown = useAppStore((s) => s.markShown);
  const pruneExpired = useAppStore((s) => s.pruneExpired);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const excludeTonight = useAppStore((s) => s.excludeTonight);
  const clearExclusions = useAppStore((s) => s.clearExclusions);

  const [places, setPlaces] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [locOpen, setLocOpen] = useState(false);
  const [locQuery, setLocQuery] = useState("");
  const [locBusy, setLocBusy] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [pick, setPick] = useState<DecoratedRestaurant | null>(null);
  const [reelNames, setReelNames] = useState<string[]>([]);
  const [skipSpin, setSkipSpin] = useState(false);
  const [options, setOptions] = useState<DecoratedRestaurant[] | null>(null);
  const [optionHistory, setOptionHistory] = useState<string[]>([]);
  const [emptyCauses, setEmptyCauses] = useState<EmptyCause[] | null>(null);
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  useEffect(() => {
    pruneExpired();
  }, [pruneExpired]);

  useEffect(() => {
    setOptionHistory([]);
  }, [location.lat, location.lon, filters]);

  useEffect(() => {
    if (location.source !== "default") return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await lookupReverseLocation({
            data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          setLocation({ ...result, source: "geo" });
        } catch {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            label: "Current location",
            source: "geo",
          });
        }
      },
      () => {
        // Keep Joplin default when permission is denied.
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, [location.source, setLocation]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchRestaurants({
      data: {
        lat: location.lat,
        lon: location.lon,
        radiusMiles: Math.max(filters.radiusMiles, 15),
      },
    })
      .then((result) => {
        if (cancelled) return;
        setPlaces(result.restaurants);
        setWarning(result.warning ?? null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setPlaces([]);
        setError(err instanceof Error ? err.message : "Could not load restaurants");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lon, filters.radiusMiles]);

  const decorated = useMemo(() => decorateAll(places, location), [places, location]);

  const ctx: WeightContext = useMemo(
    () => ({
      filters,
      preferences,
      visits,
      exclusions,
      sessionShown,
      now: Date.now(),
    }),
    [filters, preferences, visits, exclusions, sessionShown],
  );

  const eligible = useMemo(() => applyHardFilters(decorated, ctx), [decorated, ctx]);

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
          const result = await lookupReverseLocation({
            data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          setLocation({ ...result, source: "geo" });
          setLocOpen(false);
        } catch {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            label: "Current location",
            source: "geo",
          });
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

  function eligiblePool(): DecoratedRestaurant[] {
    if (eligible.length > 0) return eligible;
    if (filters.stretchRadius) return applyHardFilters(decorated, ctx, 30);
    return eligible;
  }

  function roll(from?: DecoratedRestaurant[]) {
    setEmptyCauses(null);
    const pool = from ?? eligiblePool();
    if (pool.length === 0) {
      setEmptyCauses(diagnoseEmptyPool(decorated, ctx));
      return;
    }
    const chosen = selectRestaurant(pool, ctx);
    if (!chosen) return;
    markShown(chosen.id);
    setReelNames(pool.map((item) => item.name));
    setSkipSpin(false);
    setPick(chosen);
    if ("vibrate" in navigator) navigator.vibrate?.(18);
  }

  function dealOptions(avoidIds: string[] = optionHistory) {
    setEmptyCauses(null);
    const pool = eligiblePool();
    if (pool.length === 0) {
      setEmptyCauses(diagnoseEmptyPool(decorated, ctx));
      return;
    }
    const next = selectOptions(pool, ctx, 4, avoidIds);
    if (next.length === 0) {
      setEmptyCauses(diagnoseEmptyPool(decorated, ctx));
      return;
    }
    next.forEach((item) => markShown(item.id));
    setOptionHistory((history) => {
      const seen = new Set(history);
      const merged = [...history];
      for (const item of next) {
        if (!seen.has(item.id)) merged.push(item.id);
      }
      return merged.length >= pool.length ? next.map((item) => item.id) : merged;
    });
    setOptions(next);
    if ("vibrate" in navigator) navigator.vibrate?.(12);
  }

  function rejectOption(restaurant: DecoratedRestaurant) {
    excludeTonight(restaurant.id, restaurant.name);
    const current = options ?? [];
    const remaining = current.filter((item) => item.id !== restaurant.id);
    const pool = eligiblePool().filter(
      (item) => item.id !== restaurant.id && !remaining.some((kept) => kept.id === item.id),
    );
    const replacement = selectOptions(pool, ctx, 1, optionHistory)[0];
    if (replacement) {
      markShown(replacement.id);
      setOptionHistory((history) =>
        history.includes(replacement.id) ? history : [...history, replacement.id],
      );
      setOptions([...remaining, replacement]);
      return;
    }
    if (remaining.length === 0) {
      setOptions(null);
      setEmptyCauses(diagnoseEmptyPool(decorated, ctx));
      return;
    }
    setOptions(remaining);
  }

  const radiusIndex = Math.max(0, RADIUS_OPTIONS.indexOf(filters.radiusMiles));
  const anything = isAnythingSelected(filters.cuisines);
  const visibleChips = showAllCuisines
    ? CUISINE_CHIPS
    : CUISINE_CHIPS.filter(
        (chip) => PRIMARY_CUISINES.includes(chip.id) || filters.cuisines.includes(chip.id),
      );
  const hiddenCount = CUISINE_CHIPS.length - PRIMARY_CUISINES.length;

  return (
    <main className="px-4 pb-48 pt-6">
      <header className="mb-6">
        <p className="text-kicker text-subtle">Dinner roulette</p>
        <h1 className="font-display mt-1 text-4xl leading-tight text-fg">What's for Dinner?</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">You set the rules. The app helps decide.</p>
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Change location"
              onClick={() => setLocOpen((value) => !value)}
            >
              <MapPin className="size-5" />
            </Button>
          </div>
        </div>
        {locOpen ? (
          <form className="mt-4 space-y-3" onSubmit={searchManualLocation}>
            <Input
              value={locQuery}
              onChange={(event) => setLocQuery(event.target.value)}
              placeholder="City or ZIP code"
              aria-label="City or ZIP code"
            />
            {locError ? <p className="text-sm text-danger">{locError}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={locBusy}>
                {locBusy ? "Finding…" : "Set location"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setLocOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : null}
      </section>

      <section className="mt-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PRESETS.map((preset) => {
            const active = preset.id === "favorites" ? filters.favoritesOnly : false;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.filters)}
                className={cn(
                  "chip min-w-32 shrink-0 rounded-lg px-4 py-3 text-left shadow-border",
                  active ? "bg-fg text-bg" : "bg-surface text-fg",
                )}
              >
                <div className="text-sm">{preset.label}</div>
                <div className={cn("text-xs", active ? "text-bg/70" : "text-subtle")}>{preset.blurb}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">How far?</h2>
          <p className="text-base text-fg tabular-nums">Within {filters.radiusMiles} miles</p>
        </div>
        <Slider
          min={0}
          max={DISTANCE_OPTIONS.length - 1}
          step={1}
          value={[radiusIndex]}
          onValueChange={([index]) => {
            const next = DISTANCE_OPTIONS[index ?? 0] ?? 10;
            setFilters({ radiusMiles: next });
          }}
          aria-label="Travel distance"
        />
        <div className="mt-2 flex justify-between text-2xs text-subtle">
          <span>1</span>
          <span>10</span>
          <span>30</span>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">Budget</h2>
          <p className="text-base text-fg">
            {formatPrice(filters.minPrice)} — {formatPrice(filters.maxPrice)}
          </p>
        </div>
        <Slider
          min={1}
          max={4}
          step={1}
          minStepsBetweenThumbs={0}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={([min, max]) => {
            setFilters({
              minPrice: (min ?? 1) as 1 | 2 | 3 | 4,
              maxPrice: (max ?? 4) as 1 | 2 | 3 | 4,
            });
          }}
          aria-label="Price range"
        />
        <div className="mt-2 flex justify-between text-2xs text-subtle">
          <span>$</span>
          <span>$$</span>
          <span>$$$</span>
          <span>$$$$</span>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-sm text-muted">What sounds good?</h2>
        <div className="flex flex-wrap gap-2">
          {visibleChips.map((chip) => {
            const selected = chip.id === "anything" ? anything : filters.cuisines.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleCuisine(chip.id as CuisineId)}
                className={cn(
                  "chip min-h-10 rounded-full px-3 py-2 text-sm shadow-border",
                  selected ? "bg-fg text-bg" : "bg-surface text-muted",
                  chip.id === "anything" ? "font-medium" : "",
                )}
              >
                {chip.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowAllCuisines((value) => !value)}
            className="chip inline-flex min-h-10 items-center gap-1 rounded-full bg-elevated px-3 py-2 text-sm text-muted shadow-border"
          >
            {showAllCuisines ? "Fewer" : `More (${hiddenCount})`}
            <ChevronDown className={cn("size-4 transition-transform duration-150", showAllCuisines && "rotate-180")} />
          </button>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">Tonight's mood</h2>
          <p className="text-base text-fg">{moodLabel(filters.adventure)}</p>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[filters.adventure]}
          onValueChange={([value]) => setFilters({ adventure: value ?? 50 })}
          aria-label="Familiar to adventurous"
        />
        <div className="mt-2 flex justify-between text-2xs text-subtle">
          <span>Familiar</span>
          <span>Adventurous</span>
        </div>
      </section>

      <section className="mt-7 space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div>
            <p className="text-sm text-fg">Open now only</p>
            <p className="text-xs text-subtle">Skip places that have already closed</p>
          </div>
          <Switch
            checked={filters.openNowOnly}
            onCheckedChange={(checked) => setFilters({ openNowOnly: checked })}
            aria-label="Open now only"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div>
            <p className="text-sm text-fg">Favorites only</p>
            <p className="text-xs text-subtle">Pick from places we already like</p>
          </div>
          <Switch
            checked={filters.favoritesOnly}
            onCheckedChange={(checked) => setFilters({ favoritesOnly: checked })}
            aria-label="Favorites only"
          />
        </div>
      </section>

      {warning ? <p className="mt-4 text-sm text-muted">{warning}</p> : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      {emptyCauses ? (
        <EmptyPool
          causes={emptyCauses}
          count={eligible.length}
          onDistance={() => {
            setFilters({ radiusMiles: 30 });
            setEmptyCauses(null);
          }}
          onPrice={() => {
            setFilters({ minPrice: 1, maxPrice: 4, includeUnknownPrice: true });
            setEmptyCauses(null);
          }}
          onCuisine={() => {
            setFilters({ cuisines: ["anything"] });
            setEmptyCauses(null);
          }}
          onOpen={() => {
            setFilters({ openNowOnly: false });
            setEmptyCauses(null);
          }}
          onExclusions={() => {
            clearExclusions();
            setEmptyCauses(null);
          }}
          onFavorites={() => {
            setFilters({ favoritesOnly: false });
            setEmptyCauses(null);
          }}
          onChains={() => {
            setFilters({ chainPreference: "both" });
            setEmptyCauses(null);
          }}
          onReset={() => {
            resetFilters();
            setEmptyCauses(null);
          }}
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-lg px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="rounded-xl bg-bg/95 p-3 shadow-border backdrop-blur-sm">
          <p className="mb-2 text-center text-xs text-subtle tabular-nums">
            {loading
              ? "Finding restaurants…"
              : eligible.length === 1
                ? "Only one restaurant matches"
                : `${eligible.length} restaurants match`}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="lg"
              className="pick-pulse h-14 gap-1.5 whitespace-normal px-2 font-display"
              onClick={() => roll()}
              disabled={loading}
            >
              <Shuffle className="size-4 shrink-0" />
              <span className="text-center text-xs font-medium tracking-wide uppercase leading-tight">
                Pick for us
              </span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 gap-1.5 whitespace-normal px-2 font-display"
              onClick={() => dealOptions()}
              disabled={loading}
            >
              <LayoutGrid className="size-4 shrink-0" />
              <span className="text-center text-xs font-medium tracking-wide uppercase leading-tight">
                Give us options
              </span>
            </Button>
          </div>
        </div>
      </div>

      {options ? (
        <OptionsOverlay
          restaurants={options}
          onClose={() => setOptions(null)}
          onSelect={(restaurant) => {
            setSkipSpin(true);
            setReelNames(options.map((item) => item.name));
            setPick(restaurant);
            if ("vibrate" in navigator) navigator.vibrate?.(14);
          }}
          onShuffle={() =>
            dealOptions([...new Set([...optionHistory, ...options.map((item) => item.id)])])
          }
          onNotTonight={rejectOption}
        />
      ) : null}

      {pick ? (
        <ResultOverlay
          restaurant={pick}
          reelNames={reelNames}
          skipSpin={skipSpin}
          onClose={() => setPick(null)}
          onReroll={() =>
            roll(eligible.filter((item) => item.id !== pick.id || eligible.length === 1))
          }
          onNotTonight={() => {
            setPick(null);
            if (options) rejectOption(pick);
            else excludeTonight(pick.id, pick.name);
          }}
        />
      ) : null}
    </main>
  );
}

function EmptyPool({
  causes,
  count,
  onDistance,
  onPrice,
  onCuisine,
  onOpen,
  onExclusions,
  onFavorites,
  onChains,
  onReset,
}: {
  causes: EmptyCause[];
  count: number;
  onDistance: () => void;
  onPrice: () => void;
  onCuisine: () => void;
  onOpen: () => void;
  onExclusions: () => void;
  onFavorites: () => void;
  onChains: () => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-5 rounded-xl bg-surface p-4 shadow-border">
      <div className="flex items-start gap-2">
        <SlidersHorizontal className="mt-0.5 size-4 text-muted" />
        <div>
          <p className="text-sm text-fg">Nothing matches those filters.</p>
          <p className="mt-1 text-sm text-muted">
            {count === 0 ? "Try loosening one of these:" : `${count} restaurants match now.`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {causes.includes("favorites") ? (
          <Button size="sm" variant="secondary" onClick={onFavorites}>
            Include more than favorites
          </Button>
        ) : null}
        {causes.includes("chains") ? (
          <Button size="sm" variant="secondary" onClick={onChains}>
            Include all restaurants
          </Button>
        ) : null}
        {causes.includes("distance") ? (
          <Button size="sm" variant="secondary" onClick={onDistance}>
            Increase distance
          </Button>
        ) : null}
        {causes.includes("price") ? (
          <Button size="sm" variant="secondary" onClick={onPrice}>
            Expand price range
          </Button>
        ) : null}
        {causes.includes("cuisine") ? (
          <Button size="sm" variant="secondary" onClick={onCuisine}>
            Allow more cuisines
          </Button>
        ) : null}
        {causes.includes("open") ? (
          <Button size="sm" variant="secondary" onClick={onOpen}>
            Include closed restaurants
          </Button>
        ) : null}
        {causes.includes("exclusions") ? (
          <Button size="sm" variant="secondary" onClick={onExclusions}>
            Clear not-tonight list
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
