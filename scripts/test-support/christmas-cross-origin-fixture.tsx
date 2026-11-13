import { createRoot } from "react-dom/client";
import { DateNightHome } from "@/components/date-night-home";
import { useAppStore } from "@/lib/store";
import { DEFAULT_DATE_NIGHT_FILTERS } from "@/lib/date-night/types";
import { requests, setCrossOriginPacketMode } from "./christmas-cross-origin-transport";
import { updates, actualSessionFactoryCalls } from "./christmas-cross-origin-observer";
import "@/styles.css";
import "@/date-night-base-polish.css";
import "@/halloween-date-night-overrides.css";

const origins = { A: { lat: 37.1734644, lon: -94.3130247 }, B: { lat: 37.1744644, lon: -94.3130247 } };
const config = (window as unknown as { __crossOriginConfig: { start: keyof typeof origins; theme: "light" | "dark" } }).__crossOriginConfig;
const location = (key: keyof typeof origins) => ({ ...origins[key], label: `Synthetic review origin ${key}`, source: "manual" as const });
const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15 as const, activityTypes: ["movies", "park"] as const,
  openNowOnly: false, reduceParks: false };

Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
  useAppStore.setState({ location: location(config.start), dateNightFilters: filters, homeMode: "date-night", hydrated: true,
    christmasEnabled: true, christmasCategories: ["christmas-lights"], spookySeasonEnabled: false });
  useAppStore.getState().setTheme(config.theme);
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.classList.add("date-night-active");
  createRoot(document.getElementById("root")!).render(<DateNightHome christmasReview={{ placements: [] }} />);
  (window as unknown as { crossOriginFixture: unknown }).crossOriginFixture = {
    ready: true,
    origin(key: keyof typeof origins, mode: string) { setCrossOriginPacketMode(mode); useAppStore.setState({ location: location(key) }); },
    mode(mode: string) { setCrossOriginPacketMode(mode); },
    configure(patch: Record<string, unknown>) { useAppStore.setState(patch); },
    requests() { return structuredClone(requests); },
    updates() { return structuredClone(updates); },
    latest() { return structuredClone(updates.at(-1)); },
    actualSessionFactoryCalls() { return actualSessionFactoryCalls; },
    state() { return JSON.parse(JSON.stringify(useAppStore.getState())); },
  };
});
