import { recordSeasonalIdentityReceipts } from "@/lib/date-night/identity-receipts";
import { DISCOVERY_TIMEOUT_MESSAGE } from "@/lib/discovery/client-request";
import { useEffect, useMemo, useState } from "react";
import { Heart, LayoutGrid } from "lucide-react";
import { DateNightPlanOverlay } from "@/components/date-night-plan-overlay";
import { DiscoveryLoading, DiscoveryNotice } from "@/components/discovery-status";
import { OptionsOverlay } from "@/components/options-overlay";
import { ResultOverlay } from "@/components/result-overlay";
import { Button } from "@/components/ui/button";
import { LocationControl } from "@/components/location-control";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { searchDateNight } from "@/lib/date-night/search";
import { normalizeDateNightClientActivityTypes, sanitizeDateNightClientActivityTypes } from "@/lib/date-night/cache";
import { createDateNightHybridSession, dateNightHybridProgress, type DateNightLoadPhase } from "@/lib/date-night/hybrid-session";
import type { DateNightCoverageState } from "@/lib/date-night/radial-plan";
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
  type DateNightSearchResponse,
  type DateNightTypeId,
  type DecoratedDateNightPlace,
} from "@/lib/date-night/types";
import { decorateDateNight, eligibleDateNight } from "@/lib/date-night/eligibility";
import { seasonalCoverage } from "@/lib/date-night/coverage";
import { useDateNightClock } from "@/lib/date-night/use-clock";
import { DISTANCE_OPTIONS, type DecoratedRestaurant } from "@/lib/restaurants/types";
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
  const savedFilters = useAppStore((s) => s.dateNightFilters);
  const filters = { ...savedFilters, activityTypes: sanitizeDateNightClientActivityTypes(savedFilters.activityTypes) };
  const spookySeasonEnabled = useAppStore((s) => s.spookySeasonEnabled);
  const setDateNightFilters = useAppStore((s) => s.setDateNightFilters);
  const markShown = useAppStore((s) => s.markShown);
  const excludeTonight = useAppStore((s) => s.excludeTonight);

  const [venues, setVenues] = useState<DateNightPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const [pick, setPick] = useState<DecoratedDateNightPlace | null>(null);
  const [reelNames, setReelNames] = useState<string[]>([]);
  const [skipSpin, setSkipSpin] = useState(false);
  const [options, setOptions] = useState<DecoratedDateNightPlace[] | null>(null);
  const [nightPlan, setNightPlan] = useState<DecoratedDateNightPlace[] | null>(null);
  const [lastCategory, setLastCategory] = useState<ConcreteDateNightType | null>(null);
  const now = useDateNightClock();
  const [source, setSource] = useState<"live" | "merged" | "fallback">("live");
  const [discovery, setDiscovery] = useState<DateNightSearchResponse["discovery"]>();
  const [radialSession] = useState(createDateNightHybridSession);
  const [radialCoverage, setRadialCoverage] = useState<DateNightCoverageState>();
  const [expanding, setExpanding] = useState(false);
  const [loadPhase, setLoadPhase] = useState<DateNightLoadPhase>("initial-loading");
  const [primaryPending, setPrimaryPending] = useState(true);
  const halloweenActive = isHalloweenDateNightActive(spookySeasonEnabled, now);
  const activityChips = dateNightChipsForNow(spookySeasonEnabled, now);
  const acquisitionSignature = normalizeDateNightClientActivityTypes(filters.activityTypes, halloweenActive).join(",");

  useEffect(() => {
    radialSession.update({
      lat: location.lat, lon: location.lon, radiusMiles: filters.radiusMiles,
      halloweenActive, activityTypes: acquisitionSignature.split(",") as ConcreteDateNightType[],
    }, {
      retryVersion: requestVersion,
      request: (acquisition, signal) => searchDateNight({
        data: {
          lat: acquisition.lat, lon: acquisition.lon, radiusMiles: acquisition.radiusMiles,
          spookySeasonEnabled, activityTypes: acquisition.activityTypes, patchId: acquisition.patchId,
        },
        signal,
      }),
      onChange: ({ response, coverage: nextCoverage, loading: foreground, expanding: background, phase, primaryPending: pending, error: failure }) => {
        setVenues(response?.venues ?? []);
        setSource(response?.source ?? "live");
        setWarning(response?.warning ?? null);
        setDiscovery(response?.discovery);
        setError(failure);
        setLoading(foreground);
        setLoadPhase(phase);
        setPrimaryPending(pending);
        setExpanding(background);
        setRadialCoverage(nextCoverage);
      },
    });
  }, [location.lat, location.lon, filters.radiusMiles, spookySeasonEnabled, halloweenActive, acquisitionSignature, radialSession, requestVersion]);
  useEffect(() => () => radialSession.dispose(), [radialSession]);

  const decorated = useMemo(() => decorateDateNight(venues, location, now), [venues, location, now]);
  useEffect(() => recordSeasonalIdentityReceipts(decorated), [decorated]);
  const eligible = useMemo(
    () => eligibleDateNight(decorated, filters, halloweenActive, preferences, exclusions, now.getTime()),
    [decorated, exclusions, filters, halloweenActive, preferences, now],
  );
  const coverage = seasonalCoverage(decorated, filters, source, halloweenActive);
  // Open overlays receive refreshed status/eligibility, too, including on resume.
  // Background duplicate evidence may choose a new canonical representative.
  // Follow affirmed identity receipts, never select a replacement from the pool.
  // Lookup stays inside current eligibility so expiry/negative evidence still
  // invalidates an unsafe decision instead of freezing stale presentation.
  const currentDecision = (item: DecoratedDateNightPlace) => {
    const ids = new Set([item.id, ...(item.discoveryEvidence?.map(record => record.id) ?? [])]);
    return eligible.find(venue => ids.has(venue.id) || venue.discoveryEvidence?.some(record => ids.has(record.id)));
  };
  const currentPick = pick ? currentDecision(pick) : null;
  const currentOptions = options?.map(currentDecision).filter((item): item is DecoratedDateNightPlace => Boolean(item));
  const currentPlan = nightPlan?.map(currentDecision).filter((item): item is DecoratedDateNightPlace => Boolean(item));
  const decisionKeys = (items: DecoratedDateNightPlace[] | null) => items?.filter(item => currentDecision(item)).map(item => item.id);

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
    const pairableThrills = thrillPool.filter((thrill) => settlePool.some((settle) => settle.id !== thrill.id));
    const first = venueWeightedPick(
      pairableThrills.length ? pairableThrills : thrillPool.length ? thrillPool : eligible,
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
    <main className={cn("px-4 pt-5", halloweenActive ? "pb-56" : "pb-48")}>
      {halloweenActive ? null : (
        <header className="mb-6">
          <p className="text-kicker text-accent">Dinner roulette · Date Night</p>
          <h1 className="font-display mt-1 text-4xl leading-tight text-fg">What Should We Do?</h1>
          <p className="mt-2 max-w-sm text-sm text-muted">Set the mood. Let the app pick the date.</p>
        </header>
      )}

      <LocationControl />

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
          <div><p className="text-sm text-fg">Open now only</p><p className="text-xs text-subtle">Only activities with confirmed open hours</p></div>
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
      {!loading ? (
        <div className="mt-5 rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted shadow-border">
          <p role="status" data-radial-progress data-date-night-phase={loadPhase}>{dateNightHybridProgress(loadPhase)}</p>
          {!primaryPending && !expanding && !radialCoverage?.complete && !error && !discovery?.partial ? (
            <button type="button" className="mt-2 min-h-11 text-accent underline" onClick={() => setRequestVersion(version => version + 1)}>Retry missing areas</button>
          ) : null}
        </div>
      ) : null}
      {warning && (!coverage || discovery?.partial) ? (
        <DiscoveryNotice
          tone="fallback"
          title={discovery?.partial ? "Some live searches are unavailable" : "Live discovery is temporarily unavailable"}
          body={discovery?.partial ? warning : halloweenActive
            ? "Pick For Us is using saved local date ideas. Check each stop before you leave."
            : "Pick For Us is using verified saved local date ideas so the roulette can keep working."}
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
      ) : null}
      {!loading && !error && coverage ? (
        <p role="status" className="mt-5 rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted shadow-border">{primaryPending ? "Available saved places are ready. Live discovery is continuing." : coverage.text}</p>
      ) : null}
      {error ? (
        <DiscoveryNotice
          tone="error"
          title={error === DISCOVERY_TIMEOUT_MESSAGE ? "Date idea search timed out" : "We couldn't refresh date ideas right now"}
          body={error === DISCOVERY_TIMEOUT_MESSAGE
            ? "The search took too long. Check your connection and try again."
            : "Try again in a moment, change your location, or widen your search radius."}
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
      ) : null}
      {!loading && !error && eligible.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface p-4 text-sm text-muted shadow-border">
          {halloweenActive
            ? filters.openNowOnly
              ? "No activities match these filters. Turn off Open now to browse upcoming or unconfirmed schedules, or try other activities."
              : "No activities match these filters. Try a wider radius or mix in another activity."
            : "Nothing matches those filters. Try increasing distance or allowing more activity types."}
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-lg px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="rounded-xl bg-bg/95 p-3 shadow-border backdrop-blur-sm">
          <p className="mb-2 text-center text-xs text-subtle tabular-nums">{loading ? "Finding date ideas…" : `${eligible.length} activities match`}</p>
          {halloweenActive ? (
            <p role="note" className="mb-2 text-center text-xs leading-relaxed text-muted">
              Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.
            </p>
          ) : null}
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

      {currentPick ? <ResultOverlay decisionIdentity={pick ? { id: pick.id, name: pick.name } : undefined} restaurant={currentPick as DecoratedRestaurant} reelNames={reelNames} onClose={() => setPick(null)} onReroll={() => roll()} onNotTonight={() => { excludeTonight(currentPick.id, currentPick.name); setPick(null); }} skipSpin={skipSpin} mode="date-night" /> : null}
      {currentOptions?.length ? <OptionsOverlay decisionKeys={decisionKeys(options)} restaurants={currentOptions as DecoratedRestaurant[]} onClose={() => setOptions(null)} onSelect={(restaurant) => { setOptions(null); setSkipSpin(true); setPick(restaurant as DecoratedDateNightPlace); }} onShuffle={dealOptions} onNotTonight={(restaurant) => excludeTonight(restaurant.id, restaurant.name)} mode="date-night" /> : null}
      {currentPlan?.length ? <DateNightPlanOverlay decisionKeys={decisionKeys(nightPlan)} plan={currentPlan} onClose={() => setNightPlan(null)} onReplan={planNight} /> : null}
    </main>
  );
}
