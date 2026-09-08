import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Heart, LayoutGrid, LocateFixed, MapPin } from "lucide-react";
import { DateNightPlanOverlay } from "@/components/date-night-plan-overlay";
import { DiscoveryLoading, DiscoveryNotice } from "@/components/discovery-status";
import { OptionsOverlay } from "@/components/options-overlay";
import { ResultOverlay } from "@/components/result-overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { searchDateNight } from "@/lib/date-night/search";
import {
  dateNightChipsForNow,
  HALLOWEEN_DATE_NIGHT_TYPES,
  HALLOWEEN_SETTLE_TYPES,
  HALLOWEEN_THRILL_TYPES,
  isHalloweenDateNightActive,
  isSeasonalDateNightType,
} from "@/lib/date-night/season";
import {
  dateNightMoodLabel,
  type ConcreteDateNightType,
  type DateNightFilters,
  type DateNightPlace,
  type DateNightTypeId,
  type DecoratedDateNightPlace,
} from "@/lib/date-night/types";
import { decorateAll } from "@/lib/restaurants/decorate";
import { lookupLocation, lookupReverseLocation } from "@/lib/restaurants/search";
import { DISTANCE_OPTIONS, type DecoratedRestaurant, type Restaurant } from "@/lib/restaurants/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function venueWeightedPick(
  items: DecoratedDateNightPlace[],
  mood: number,
  shown: string[],
  preferSeasonal = false,
) {
  if (!items.length) return null;
  const target = 1 + (Math.min(Math.max(mood, 0), 100) / 100) * 2;
  const weights = items.map((item) => {
    const distancePenalty = 1 / (1 + item.distanceMiles * 0.04);
    const moodFit = 1 / (1 + Math.abs(item.moodLevel - target) * 0.8);
    const shownPenalty = shown.includes(item.id) ? 0.12 : 1;
    const seasonalBoost =
      preferSeasonal && item.activityTypes.some((type) => HALLOWEEN_DATE_NIGHT_TYPES.includes(type)) ? 1.45 : 1;
    return Math.max(0.001, distancePenalty * moodFit * shownPenalty * seasonalBoost);
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    cursor -= weights[i] ?? 0;
    if (cursor <= 0) return items[i] ?? items[0];
  }
  return items[items.length - 1] ?? null;
}

function availableCategories(items: DecoratedDateNightPlace[], filters: DateNightFilters): ConcreteDateNightType[] {
  const present = new Set(items.flatMap((item) => item.activityTypes));
  if (filters.activityTypes.includes("anything")) return [...present];
  return filters.activityTypes.filter(
    (type): type is ConcreteDateNightType => type !== "anything" && present.has(type),
  );
}

function pickCategory(
  categories: ConcreteDateNightType[],
  reduceParks: boolean,
  avoidCategory: ConcreteDateNightType | null = null,
) {
  if (!categories.length) return null;
  const hasAlternative = Boolean(avoidCategory && categories.some((type) => type !== avoidCategory));
  const weights = categories.map((type) => {
    const parkWeight = type === "park" && reduceParks ? 0.08 : 1;
    const repeatWeight = hasAlternative && type === avoidCategory ? 0.18 : 1;
    return parkWeight * repeatWeight;
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = Math.random() * total;
  for (let i = 0; i < categories.length; i += 1) {
    cursor -= weights[i] ?? 0;
    if (cursor <= 0) return categories[i] ?? categories[0];
  }
  return categories[categories.length - 1] ?? null;
}

function balancedPick(
  items: DecoratedDateNightPlace[],
  filters: DateNightFilters,
  shown: string[],
  allowedCategories?: ConcreteDateNightType[],
  avoidCategory: ConcreteDateNightType | null = null,
  preferSeasonal = false,
) {
  if (!items.length) return null;
  const categories = allowedCategories ?? availableCategories(items, filters);
  const category = pickCategory(categories, filters.reduceParks, avoidCategory);
  if (!category) return venueWeightedPick(items, filters.mood, shown, preferSeasonal);
  const pool = items.filter((item) => item.activityTypes.includes(category));
  return venueWeightedPick(pool.length ? pool : items, filters.mood, shown, preferSeasonal);
}

function pickDiverseOptions(
  items: DecoratedDateNightPlace[],
  filters: DateNightFilters,
  shown: string[],
  count = 4,
) {
  const result: DecoratedDateNightPlace[] = [];
  const usedIds = new Set<string>();
  const remainingCategories = availableCategories(items, filters);

  while (remainingCategories.length && result.length < count) {
    const category = pickCategory(remainingCategories, filters.reduceParks);
    if (!category) break;
    const categoryPool = items.filter(
      (item) => !usedIds.has(item.id) && item.activityTypes.includes(category),
    );
    const next = venueWeightedPick(categoryPool, filters.mood, shown, false);
    remainingCategories.splice(remainingCategories.indexOf(category), 1);
    if (!next) continue;
    result.push(next);
    usedIds.add(next.id);
  }

  while (result.length < count) {
    const remaining = items.filter((item) => !usedIds.has(item.id));
    if (!remaining.length) break;
    const next = balancedPick(remaining, filters, shown);
    if (!next) break;
    result.push(next);
    usedIds.add(next.id);
  }

  return result;
}

export function DateNightHome() {
  const location = useAppStore((s) => s.location);
  const preferences = useAppStore((s) => s.preferences);
  const exclusions = useAppStore((s) => s.exclusions);
  const sessionShown = useAppStore((s) => s.sessionShown);
  const filters = useAppStore((s) => s.dateNightFilters);
  const spookySeasonEnabled = useAppStore((s) => s.spookySeasonEnabled);
  const setDateNightFilters = useAppStore((s) => s.setDateNightFilters);
  const setLocation = useAppStore((s) => s.setLocation);
  const markShown = useAppStore((s) => s.markShown);
  const excludeTonight = useAppStore((s) => s.excludeTonight);

  const [venues, setVenues] = useState<DateNightPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [locOpen, setLocOpen] = useState(false);
  const [locQuery, setLocQuery] = useState("");
  const [locBusy, setLocBusy] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [pick, setPick] = useState<DecoratedDateNightPlace | null>(null);
  const [reelNames, setReelNames] = useState<string[]>([]);
  const [skipSpin, setSkipSpin] = useState(false);
  const [options, setOptions] = useState<DecoratedDateNightPlace[] | null>(null);
  const [nightPlan, setNightPlan] = useState<DecoratedDateNightPlace[] | null>(null);
  const [lastCategory, setLastCategory] = useState<ConcreteDateNightType | null>(null);
  const halloweenActive = isHalloweenDateNightActive(spookySeasonEnabled);
  const activityChips = dateNightChipsForNow(spookySeasonEnabled);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setWarning(null);
    searchDateNight({
      data: {
        lat: location.lat,
        lon: location.lon,
        radiusMiles: Math.max(filters.radiusMiles, 15),
        spookySeasonEnabled,
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
        setError(err instanceof Error ? err.message : "Could not load date-night activities");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lon, filters.radiusMiles, spookySeasonEnabled]);

  const decorated = useMemo(
    () => decorateAll(venues as Restaurant[], location) as DecoratedDateNightPlace[],
    [venues, location],
  );

  const eligible = useMemo(() => {
    const anything = filters.activityTypes.includes("anything");
    return decorated.filter((venue) => {
      if (
        !halloweenActive &&
        venue.activityTypes.length > 0 &&
        venue.activityTypes.every((type) => HALLOWEEN_DATE_NIGHT_TYPES.includes(type))
      ) {
        return false;
      }
      if (venue.distanceMiles > filters.radiusMiles + 0.05) return false;
      if (exclusions.some((item) => item.restaurantId === venue.id && item.expiresAt > Date.now())) return false;
      const pref = preferences[venue.id];
      if (pref?.neverRecommend) return false;
      if (filters.favoritesOnly && !pref?.favorite) return false;
      if (filters.openNowOnly && venue.hoursKnown && !venue.isOpen) return false;
      if (!anything && !venue.activityTypes.some((type) => filters.activityTypes.includes(type))) return false;
      return true;
    });
  }, [decorated, exclusions, filters, halloweenActive, preferences]);

  function updateFilters(patch: Partial<DateNightFilters>) {
    setDateNightFilters(patch);
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
    const chosen = balancedPick(pool, filters, sessionShown, undefined, lastCategory, halloweenActive);
    if (!chosen) return;
    markShown(chosen.id);
    setLastCategory(chosen.activityTypes[0] ?? null);
    setReelNames(pool.map((item) => item.name));
    setSkipSpin(false);
    setPick(chosen);
    if ("vibrate" in navigator) navigator.vibrate?.(18);
  }

  function dealOptions() {
    const next = pickDiverseOptions(eligible, filters, sessionShown, 4);
    next.forEach((item) => markShown(item.id));
    setOptions(next.length ? next : null);
    if (next.length && "vibrate" in navigator) navigator.vibrate?.(12);
  }

  function planNight() {
    const thrillPool = eligible.filter((item) =>
      item.activityTypes.some((type) => HALLOWEEN_THRILL_TYPES.includes(type)),
    );
    const settlePool = eligible.filter((item) =>
      item.activityTypes.some((type) => HALLOWEEN_SETTLE_TYPES.includes(type)),
    );
    const first = venueWeightedPick(
      thrillPool.length ? thrillPool : eligible,
      Math.max(filters.mood, 70),
      sessionShown,
      true,
    );
    if (!first) return;
    const secondPool = (settlePool.length ? settlePool : eligible).filter((item) => item.id !== first.id);
    const second = venueWeightedPick(secondPool, Math.min(filters.mood, 42), sessionShown, false);
    const next = [first, second].filter((item): item is DecoratedDateNightPlace => Boolean(item));
    next.forEach((item) => markShown(item.id));
    setNightPlan(next.length ? next : null);
    if (next.length && "vibrate" in navigator) navigator.vibrate?.(12);
  }

  const radiusIndex = Math.max(0, DISTANCE_OPTIONS.indexOf(filters.radiusMiles));

  return (
    <main className="px-4 pb-48 pt-5">
      {halloweenActive ? null : (
        <header className="mb-6">
          <p className="text-kicker text-accent">Dinner roulette · Date Night</p>
          <h1 className="font-display mt-1 text-4xl leading-tight text-fg">What Should We Do?</h1>
          <p className="mt-2 max-w-sm text-sm text-muted">Set the mood. Let the app pick the date.</p>
        </header>
      )}

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
        <Slider min={0} max={DISTANCE_OPTIONS.length - 1} step={1} value={[radiusIndex]} onValueChange={([index]) => updateFilters({ radiusMiles: DISTANCE_OPTIONS[index ?? 0] ?? 15 })} aria-label="Travel distance" />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>1</span><span>10</span><span>30</span></div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-sm text-muted">What sounds fun?</h2>
        <div className="flex flex-wrap gap-2">
          {activityChips.map((chip) => {
            const selected = chip.id === "anything" ? filters.activityTypes.includes("anything") : filters.activityTypes.includes(chip.id);
            const seasonal = isSeasonalDateNightType(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleActivityType(chip.id)}
                className={cn(
                  "chip min-h-11 rounded-full px-3 py-2 text-sm shadow-border transition",
                  seasonal
                    ? selected
                      ? "bg-[#d56a2f] text-[#fff3e5] shadow-[0_0_20px_-8px_rgba(213,106,47,0.95)] ring-1 ring-[#f4c092]/35"
                      : "bg-[#2a2020] text-[#f4c092] shadow-[0_0_16px_-10px_rgba(213,106,47,0.8)] ring-1 ring-[#d56a2f]/30"
                    : selected
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm text-muted">What's the mood?</h2>
          <p className="text-base text-fg">{dateNightMoodLabel(filters.mood)}</p>
        </div>
        <Slider min={0} max={100} step={1} value={[filters.mood]} onValueChange={([value]) => updateFilters({ mood: value ?? 50 })} aria-label="Cozy to adventurous" />
        <div className="mt-2 flex justify-between text-2xs text-subtle"><span>Cozy</span><span>Playful</span><span>Adventurous</span></div>
      </section>

      <section className="mt-7 space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Open now only</p><p className="text-xs text-subtle">Skip activities that have already closed</p></div>
          <Switch checked={filters.openNowOnly} onCheckedChange={(checked) => updateFilters({ openNowOnly: checked })} aria-label="Open now only" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Favorites only</p><p className="text-xs text-subtle">Pick from date spots you've saved</p></div>
          <Switch checked={filters.favoritesOnly} onCheckedChange={(checked) => updateFilters({ favoritesOnly: checked })} aria-label="Favorites only" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-border">
          <div><p className="text-sm text-fg">Fewer parks</p><p className="text-xs text-subtle">Keep parks available, but make the park category much less likely</p></div>
          <Switch checked={filters.reduceParks} onCheckedChange={(checked) => updateFilters({ reduceParks: checked })} aria-label="Fewer parks" />
        </div>
      </section>

      {loading ? <DiscoveryLoading label="Finding date ideas near you…" /> : null}
      {warning ? (
        <DiscoveryNotice
          tone="fallback"
          title="Live discovery is temporarily unavailable"
          body={halloweenActive
            ? "Dinner Roulette is using saved seasonal anchors with unconfirmed hours. Check each stop before you leave."
            : "Dinner Roulette is using verified saved local date ideas so the roulette can keep working."}
        />
      ) : null}
      {error ? (
        <DiscoveryNotice
          tone="error"
          title="We couldn't refresh date ideas right now"
          body="Try again in a moment, change your location, or widen your search radius."
        />
      ) : null}
      {!loading && !error && eligible.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface p-4 text-sm text-muted shadow-border">
          {halloweenActive
            ? "Seasonal spots are still thin this early, and hours are unconfirmed. Widen the radius, keep Anything on, or mix in a regular date idea."
            : "Nothing matches those filters. Try increasing distance or allowing more activity types."}
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-lg px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="rounded-xl bg-bg/95 p-3 shadow-border backdrop-blur-sm">
          <p className="mb-2 text-center text-xs text-subtle tabular-nums">{loading ? "Finding date ideas…" : `${eligible.length} activities match`}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="lg" className="pick-pulse h-14 gap-1.5 px-2 font-display" onClick={() => roll()} disabled={!eligible.length || loading}><Heart className="size-4" />Pick our date</Button>
            <Button size="lg" variant="secondary" className="h-14 gap-1.5 px-2" onClick={dealOptions} disabled={!eligible.length || loading}><LayoutGrid className="size-4" />Give us options</Button>
          </div>
          {halloweenActive ? (
            <Button size="lg" variant="secondary" className="mt-2 h-12 w-full" onClick={planNight} disabled={!eligible.length || loading}>
              Plan the night
            </Button>
          ) : null}
        </div>
      </div>

      {pick ? <ResultOverlay restaurant={pick as DecoratedRestaurant} reelNames={reelNames} onClose={() => setPick(null)} onReroll={() => roll()} onNotTonight={() => { excludeTonight(pick.id, pick.name); setPick(null); }} skipSpin={skipSpin} mode="date-night" /> : null}
      {options ? <OptionsOverlay restaurants={options as DecoratedRestaurant[]} onClose={() => setOptions(null)} onSelect={(restaurant) => { setOptions(null); setSkipSpin(true); setPick(restaurant as DecoratedDateNightPlace); }} onShuffle={dealOptions} onNotTonight={(restaurant) => excludeTonight(restaurant.id, restaurant.name)} mode="date-night" /> : null}
      {nightPlan ? <DateNightPlanOverlay plan={nightPlan} onClose={() => setNightPlan(null)} onReplan={planNight} /> : null}
    </main>
  );
}
