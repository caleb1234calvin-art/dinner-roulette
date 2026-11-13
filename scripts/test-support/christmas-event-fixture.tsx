import { useState } from "react";
import { createRoot } from "react-dom/client";
import { DateNightHome } from "@/components/date-night-home";
import { ResultOverlay } from "@/components/result-overlay";
import { OptionsOverlay } from "@/components/options-overlay";
import { DateNightPlanOverlay } from "@/components/date-night-plan-overlay";
import { FavoritesPage } from "@/components/favorites-page";
import { HistoryPage } from "@/components/history-page";
import { useAppStore } from "@/lib/store";
import { buildIsolatedChristmasPilotCandidate, isChristmasPilotChoice } from "@/lib/date-night/christmas-pilot";
import { CHRISTMAS_2026_PILOT } from "@/lib/date-night/christmas-pilot-catalog";
import { toChristmasEventRecord } from "@/lib/date-night/christmas-event-record";
import { decorateDateNight } from "@/lib/date-night/eligibility";
import { DEFAULT_DATE_NIGHT_FILTERS } from "@/lib/date-night/types";
import type { DecoratedDateNightPlace } from "@/lib/date-night/types";
import type { ChristmasEventPlacement } from "@/lib/date-night/christmas-pilot-model";
import { ordinaryFixtureVenues, discoveryRequests, discoveryCompletions, clearDiscoveryRequests, setDiscoveryFixtureMode, holdNextDiscoveryResponse, releaseDiscoveryResponse } from "./christmas-event-search-fixture";
import "@/styles.css";
import "@/date-night-base-polish.css";
import "@/halloween-date-night-overrides.css";

type Surface = "home" | "result" | "options" | "plan" | "favorites" | "history";
const location = { lat: 37.1734644, lon: -94.3130247, label: "Synthetic review location", source: "manual" as const };
const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15 as const, openNowOnly: false, reduceParks: false };
// All three temporary placements below are deliberately synthetic browser
// controls. They do not establish real distance placement or public eligibility.
const placements: readonly ChristmasEventPlacement[] = CHRISTMAS_2026_PILOT
  .filter(event => event.relationship !== "permanent-venue-display")
  .map(event => ({
    eventKey: event.eventKey,
    hostReference: event.hostReference,
    scope: event.relationship === "fixed-site-and-route" ? "spectator-distance" as const : "venue-distance" as const,
    lat: location.lat, lon: location.lon,
    review: { status: "reviewed" as const, revision: "synthetic-browser-only", reviewUrl: "https://example.invalid/browser-placement", checkedOn: "2026-11-11" },
    sourceRefs: event.hostSourceRefs,
  }));

function records(now = new Date()) {
  return buildIsolatedChristmasPilotCandidate({
    venues: decorateDateNight(ordinaryFixtureVenues, location, now), filters,
    selectedCategories: ["anything"], homeMode: "date-night", location, now, placements,
  }).choices.filter(isChristmasPilotChoice).map(toChristmasEventRecord);
}

let setSurface: (surface: Surface) => void = () => {};
let setReview: (review: boolean) => void = () => {};
let setSelected: (id: string | null) => void = () => {};
let setSnapshot: (record: DecoratedDateNightPlace | null) => void = () => {};
function selectRecord(researchId: string) {
  const record = records().find(record => record.dateNightEvent?.researchId === researchId);
  if (!record) throw new Error(`Fixture event unavailable at this date: ${researchId}`);
  return record;
}
export function App() {
  const [surface, changeSurface] = useState<Surface>("home");
  const [review, changeReview] = useState(true);
  const [selected, changeSelected] = useState<string | null>(null);
  const [snapshot, changeSnapshot] = useState<DecoratedDateNightPlace | null>(null);
  setSurface = changeSurface; setReview = changeReview; setSelected = changeSelected; setSnapshot = changeSnapshot;
  const currentRecords = records();
  const record = snapshot ?? (selected ? currentRecords.find(item => item.dateNightEvent?.researchId === selected) : currentRecords[0]);
  return <div className="mx-auto min-h-dvh max-w-lg bg-bg text-fg">
    {surface === "home" ? <DateNightHome christmasReview={review ? { placements } : undefined} /> : null}
    {surface === "result" && record ? <ResultOverlay restaurant={record} reelNames={[]} skipSpin mode="date-night" onClose={() => changeSurface("home")} onReroll={() => {}} onNotTonight={() => { useAppStore.getState().excludeTonight(record.id, record.name); changeSurface("home"); }} /> : null}
    {surface === "options" ? <OptionsOverlay restaurants={currentRecords} mode="date-night" onClose={() => changeSurface("home")} onSelect={item => { changeSnapshot(item as DecoratedDateNightPlace); changeSurface("result"); }} onShuffle={() => {}} onNotTonight={item => useAppStore.getState().excludeTonight(item.id, item.name)} /> : null}
    {surface === "plan" ? <DateNightPlanOverlay plan={snapshot ? [snapshot] : currentRecords} onClose={() => changeSurface("home")} onReplan={() => {}} /> : null}
    {surface === "favorites" ? <FavoritesPage /> : null}
    {surface === "history" ? <HistoryPage /> : null}
  </div>;
}

function init() {
  // Seed only a new private fixture session. Reload must use the real persisted
  // filters/preferences/history instead of silently replacing them with defaults.
  const firstLoad = sessionStorage.getItem("private-christmas-fixture-initialized") !== "true";
  useAppStore.setState({ location, ...(firstLoad ? { dateNightFilters: filters } : {}), homeMode: "date-night", hydrated: true });
  sessionStorage.setItem("private-christmas-fixture-initialized", "true");
  createRoot(document.getElementById("root")!).render(<App />);
  (window as unknown as { christmasFixture: unknown }).christmasFixture = {
    ready: true,
    show(surface: Surface, researchId?: string) { setSnapshot(null); setSelected(researchId ?? null); setSurface(surface); },
    showSnapshot(surface: Surface, researchId: string) { setSnapshot(selectRecord(researchId)); setSurface(surface); },
    setPublic(value: boolean) { setReview(!value); setSurface("home"); setSnapshot(null); },
    state() { return JSON.parse(JSON.stringify(useAppStore.getState())); },
    discovery() { return structuredClone(discoveryRequests); },
    discoveryCompletions() { return structuredClone(discoveryCompletions); },
    clearDiscovery() { clearDiscoveryRequests(); },
    holdDiscovery() { holdNextDiscoveryResponse(); },
    releaseDiscovery() { releaseDiscoveryResponse(); },
    configure(patch: Record<string, unknown>) { useAppStore.setState(patch); },
    refreshDiscovery(mode: Parameters<typeof setDiscoveryFixtureMode>[0]) {
      setDiscoveryFixtureMode(mode);
      const current = useAppStore.getState().location;
      useAppStore.setState({ location: { ...current, lat: current.lat + 0.000001 } });
    },
    refreshDiscoveryInPlace(mode: Parameters<typeof setDiscoveryFixtureMode>[0]) {
      setDiscoveryFixtureMode(mode);
      const retry = [...document.querySelectorAll<HTMLButtonElement>("button")].find(button => button.textContent === "Retry missing areas" || button.textContent === "Try again");
      if (!retry || retry.disabled) throw new Error("Same-query provider retry is unavailable");
      // This is a controlled background refresh, not a user interaction claim:
      // the visible modal intentionally prevents pointer access to Home.
      retry.click();
    },
    setTheme(theme: "light" | "dark") {
      useAppStore.getState().setTheme(theme);
      document.documentElement.dataset.theme = theme;
    },
    seedAllEvents() {
      const at: Record<string, string> = { "C26-001": "2026-12-05T18:00:00-06:00", "C26-005": "2026-12-05T10:00:00-06:00", "C26-010": "2026-12-05T10:00:00-06:00", "C26-007": "2026-12-07T17:00:00-06:00" };
      for (const [id, iso] of Object.entries(at)) {
        const event = records(new Date(iso)).find(item => item.dateNightEvent?.researchId === id)!.dateNightEvent!;
        const store = useAppStore.getState();
        if (!store.preferences[event.preferenceKey]?.favorite) store.toggleFavorite({ restaurantId: event.preferenceKey, name: event.eventName, cuisineLabel: event.categoryLabel, dateNightEvent: event });
        store.recordVisit({ restaurantId: event.preferenceKey, restaurantName: event.eventName, cuisineLabel: event.categoryLabel, personalRating: 4, dateNightEvent: event });
      }
    },
    refreshClock() { window.dispatchEvent(new Event("focus")); },
    events() { return records().map(item => item.dateNightEvent); },
    preserveCurrent(researchId: string) { setSnapshot(selectRecord(researchId)); },
  };
}
Promise.resolve(useAppStore.persist.rehydrate()).then(init);
