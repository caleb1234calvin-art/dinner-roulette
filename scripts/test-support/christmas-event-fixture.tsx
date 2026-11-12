import { useState } from "react";
import { createRoot } from "react-dom/client";
import { DateNightHome } from "../../src/components/date-night-home";
import { ResultOverlay } from "../../src/components/result-overlay";
import { OptionsOverlay } from "../../src/components/options-overlay";
import { DateNightPlanOverlay } from "../../src/components/date-night-plan-overlay";
import { FavoritesPage } from "../../src/components/favorites-page";
import { HistoryPage } from "../../src/components/history-page";
import { useAppStore } from "../../src/lib/store";
import { buildIsolatedChristmasPilotCandidate, isChristmasPilotChoice } from "../../src/lib/date-night/christmas-pilot";
import { CHRISTMAS_2026_PILOT } from "../../src/lib/date-night/christmas-pilot-catalog";
import { toChristmasEventRecord } from "../../src/lib/date-night/christmas-event-record";
import { decorateDateNight } from "../../src/lib/date-night/eligibility";
import { DEFAULT_DATE_NIGHT_FILTERS } from "../../src/lib/date-night/types";
import type { DecoratedDateNightPlace } from "../../src/lib/date-night/types";
import type { ChristmasEventPlacement } from "../../src/lib/date-night/christmas-pilot-model";
import { ordinaryFixtureVenues, discoveryRequests, clearDiscoveryRequests } from "./christmas-event-search-fixture";
import "../../src/styles.css";
import "../../src/date-night-base-polish.css";
import "../../src/halloween-date-night-overrides.css";

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

function records() {
  const now = new Date();
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
    clearDiscovery() { clearDiscoveryRequests(); },
    configure(patch: Record<string, unknown>) { useAppStore.setState(patch); },
    refreshClock() { window.dispatchEvent(new Event("focus")); },
    events() { return records().map(item => item.dateNightEvent); },
    preserveCurrent(researchId: string) { setSnapshot(selectRecord(researchId)); },
  };
}
Promise.resolve(useAppStore.persist.rehydrate()).then(init);
