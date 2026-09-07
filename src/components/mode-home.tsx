import { useEffect, useState } from "react";
import { Heart, MoonStar, UtensilsCrossed } from "lucide-react";
import { DateNightHome } from "@/components/date-night-home";
import { HalloweenDateNightPanel } from "@/components/halloween-date-night-panel";
import { ModeHint } from "@/components/mode-hint";
import { NightlifeHome } from "@/components/nightlife-home";
import { PickHome } from "@/components/pick-home";
import { trackAppEvent } from "@/lib/analytics";
import {
  isHalloweenDateNightSeason,
  normalizeSeasonalDateNightFilters,
} from "@/lib/date-night/season";
import type { HomeMode } from "@/lib/nightlife/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DATE_NIGHT_ICON_THEME_STYLES = `
html.date-night-active[data-theme="light"]:not(.halloween-date-night-active) img[src*="date-night-icons"] {
  filter:
    saturate(0.82)
    hue-rotate(-8deg)
    brightness(1.03)
    contrast(0.98)
    drop-shadow(0 4px 12px rgba(216, 91, 159, 0.12));
}

html.date-night-active:not([data-theme="light"]):not(.halloween-date-night-active) img[src*="date-night-icons"] {
  filter:
    saturate(0.94)
    hue-rotate(-34deg)
    brightness(1.1)
    contrast(1.02)
    drop-shadow(0 0 10px rgba(201, 167, 255, 0.22));
}

html.halloween-date-night-active[data-theme="light"] img[src*="date-night-icons"] {
  filter:
    sepia(0.12)
    saturate(1.18)
    hue-rotate(44deg)
    brightness(1.02)
    contrast(0.98)
    drop-shadow(0 4px 12px rgba(197, 106, 50, 0.14));
}

html.halloween-date-night-active:not([data-theme="light"]) img[src*="date-night-icons"] {
  filter:
    sepia(0.18)
    saturate(1.42)
    hue-rotate(48deg)
    brightness(0.98)
    contrast(1.06)
    drop-shadow(0 0 10px rgba(197, 106, 50, 0.28));
}
`;

export function ModeHome() {
  const [mode, setMode] = useState<HomeMode>("dinner");
  const dateNightFilters = useAppStore((state) => state.dateNightFilters);
  const setDateNightFilters = useAppStore((state) => state.setDateNightFilters);
  const spookySeasonEnabled = useAppStore((state) => state.spookySeasonEnabled);
  const setSpookySeasonEnabled = useAppStore((state) => state.setSpookySeasonEnabled);
  const halloweenSeason = isHalloweenDateNightSeason();

  const nightlife = mode === "nightlife";
  const dateNight = mode === "date-night";
  const halloweenDateNight = dateNight && halloweenSeason && spookySeasonEnabled;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("nightlife-active", nightlife);
    root.classList.toggle("date-night-active", dateNight);
    root.classList.toggle("halloween-date-night-active", halloweenDateNight);
    return () => {
      root.classList.remove("nightlife-active");
      root.classList.remove("date-night-active");
      root.classList.remove("halloween-date-night-active");
    };
  }, [dateNight, halloweenDateNight, nightlife]);

  useEffect(() => {
    if (halloweenSeason) return;
    if (spookySeasonEnabled) setSpookySeasonEnabled(false);
  }, [halloweenSeason, setSpookySeasonEnabled, spookySeasonEnabled]);

  useEffect(() => {
    if (halloweenDateNight) return;
    const normalized = normalizeSeasonalDateNightFilters(dateNightFilters, false);
    if (
      normalized.activityTypes.length !== dateNightFilters.activityTypes.length ||
      normalized.activityTypes.some((type, index) => type !== dateNightFilters.activityTypes[index])
    ) {
      setDateNightFilters({ activityTypes: normalized.activityTypes });
    }
  }, [dateNightFilters, halloweenDateNight, setDateNightFilters]);

  function selectMode(next: HomeMode) {
    if (next !== mode) trackAppEvent("Mode Selected", { mode: next });
    setMode(next);
  }

  return (
    <div
      className={cn(
        "mode-home min-h-dvh",
        nightlife && "nightlife-theme",
        dateNight && "date-night-theme",
        halloweenDateNight && "halloween-date-night-theme",
      )}
    >
      <style>{DATE_NIGHT_ICON_THEME_STYLES}</style>
      <ModeHint />

      <header className="px-4 pt-8 pb-5">
        <p className="text-kicker text-subtle">
          {nightlife
            ? "Dinner roulette · Nightlife"
            : halloweenDateNight
              ? "Dinner roulette · October after dark"
              : dateNight
                ? "Dinner roulette · Date Night"
                : "Dinner roulette"}
        </p>
        <h1 className="font-display mt-2 text-4xl leading-tight text-fg">
          {nightlife
            ? "What's the Move?"
            : halloweenDateNight
              ? "Where Should the Night Take Us?"
              : dateNight
                ? "What Should We Do?"
                : "What's for Dinner?"}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          {nightlife
            ? "Set the vibe. Let the app pick the place."
            : halloweenDateNight
              ? "Pick your poison. Set the mood. Let October decide the rest."
              : dateNight
                ? "Set the mood. Let the app pick the date."
                : "You set the rules. The app helps decide."}
        </p>
      </header>

      <div className="sticky top-0 z-20 mx-auto max-w-lg bg-bg/95 px-4 py-2 backdrop-blur-sm">
        <div className="grid grid-cols-3 rounded-xl bg-surface/95 p-1 shadow-border">
          <button
            type="button"
            onClick={() => selectMode("dinner")}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-xs transition sm:text-sm",
              mode === "dinner" ? "bg-fg text-bg" : "text-muted",
            )}
            aria-pressed={mode === "dinner"}
          >
            <UtensilsCrossed className="size-4" />
            Dinner
          </button>
          <button
            type="button"
            onClick={() => selectMode("nightlife")}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-xs transition sm:text-sm",
              nightlife ? "bg-accent text-accent-fg" : "text-muted",
            )}
            aria-pressed={nightlife}
          >
            <MoonStar className="size-4" />
            Nightlife
          </button>
          <button
            type="button"
            onClick={() => selectMode("date-night")}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-xs transition sm:text-sm",
              dateNight ? "bg-accent text-accent-fg" : "text-muted",
            )}
            aria-pressed={dateNight}
          >
            <Heart className="size-4" />
            Date Night
          </button>
        </div>
      </div>

      {dateNight && halloweenSeason ? <HalloweenDateNightPanel /> : null}
      {mode === "dinner" ? <PickHome /> : nightlife ? <NightlifeHome /> : <DateNightHome />}
    </div>
  );
}
