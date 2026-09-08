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
html.halloween-date-night-active[data-theme="light"] {
  --app-bg: #ececec !important;
}

.halloween-accent-splatter {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.2;
  background:
    radial-gradient(circle at 6% 4%, var(--app-accent) 0 0.38rem, transparent 0.44rem),
    radial-gradient(circle at 11% 7%, var(--app-accent) 0 0.18rem, transparent 0.23rem),
    radial-gradient(circle at 2.5% 10%, var(--app-accent) 0 0.24rem, transparent 0.3rem),
    radial-gradient(ellipse at 7% 8%, var(--app-accent) 0 1.1rem, transparent 1.18rem),
    radial-gradient(circle at 92% 5%, var(--app-accent) 0 0.3rem, transparent 0.36rem),
    radial-gradient(circle at 96% 9%, var(--app-accent) 0 0.17rem, transparent 0.22rem),
    radial-gradient(circle at 89% 12%, var(--app-accent) 0 0.22rem, transparent 0.28rem),
    radial-gradient(ellipse at 94% 8%, var(--app-accent) 0 1rem, transparent 1.08rem),
    radial-gradient(ellipse at 1% 32%, var(--app-accent) 0 0.72rem, transparent 0.8rem),
    radial-gradient(circle at 4% 35%, var(--app-accent) 0 0.16rem, transparent 0.22rem),
    radial-gradient(ellipse at 99% 44%, var(--app-accent) 0 0.64rem, transparent 0.72rem),
    radial-gradient(circle at 96.5% 48%, var(--app-accent) 0 0.14rem, transparent 0.2rem);
}

html.halloween-date-night-active[data-theme="light"] .halloween-accent-splatter {
  opacity: 0.28;
  mix-blend-mode: multiply;
  filter: saturate(1.08) contrast(1.03);
}

html.halloween-date-night-active:not([data-theme="light"]) .halloween-accent-splatter {
  opacity: 0.3;
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--app-accent) 36%, transparent));
}

.halloween-accent-splatter::before,
.halloween-accent-splatter::after {
  content: "";
  position: absolute;
  top: -0.25rem;
  width: 0.28rem;
  border-radius: 999px 999px 70% 70%;
  background: var(--app-accent);
}

.halloween-accent-splatter::before {
  left: 7.4%;
  height: 3.7rem;
  transform: rotate(-4deg);
  box-shadow:
    1.2rem 1rem 0 -0.07rem var(--app-accent),
    2.1rem 0.35rem 0 -0.1rem var(--app-accent);
}

.halloween-accent-splatter::after {
  right: 6.5%;
  height: 2.8rem;
  transform: rotate(5deg);
  box-shadow:
    -1.15rem 0.6rem 0 -0.09rem var(--app-accent),
    -2rem 1.4rem 0 -0.11rem var(--app-accent);
}

html.date-night-active[data-theme="light"]:not(.halloween-date-night-active) img[src*="date-night-icons"],
html.date-night-active[data-theme="light"]:not(.halloween-date-night-active) img[src^="data:image/svg+xml"] {
  filter:
    brightness(1.04)
    contrast(1.02)
    drop-shadow(0 0 4px rgba(216, 91, 159, 0.32))
    drop-shadow(0 0 12px rgba(216, 91, 159, 0.42));
}

html.date-night-active:not([data-theme="light"]):not(.halloween-date-night-active) img[src*="date-night-icons"],
html.date-night-active:not([data-theme="light"]):not(.halloween-date-night-active) img[src^="data:image/svg+xml"] {
  filter:
    brightness(1.06)
    contrast(1.04)
    drop-shadow(0 0 5px rgba(201, 167, 255, 0.34))
    drop-shadow(0 0 14px rgba(201, 167, 255, 0.46));
}

/* Halloween icon system: one design for normal Date Night icons and the
   seasonal icons. The art keeps its luminance detail while a color layer gives
   it the exact wine-red / blue-green Halloween palette. */
html.halloween-date-night-active div:has(> img[src*="date-night-icons"]),
html.halloween-date-night-active div:has(> img[src^="data:image/svg+xml"]) {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 50%, rgba(167, 52, 62, 0.46), transparent 44%),
    radial-gradient(circle at 82% 50%, rgba(69, 166, 111, 0.46), transparent 44%),
    linear-gradient(135deg, #171011 0%, #101513 100%) !important;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    -9px 0 24px -14px rgba(167, 52, 62, 0.72),
    9px 0 24px -14px rgba(69, 166, 111, 0.72),
    0 12px 24px -20px rgba(0, 0, 0, 0.92) !important;
}

html.halloween-date-night-active div:has(> img[src*="date-night-icons"])::after,
html.halloween-date-night-active div:has(> img[src^="data:image/svg+xml"])::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(90deg, rgba(167, 52, 62, 0.96) 0%, rgba(167, 52, 62, 0.68) 38%, rgba(69, 166, 111, 0.68) 62%, rgba(69, 166, 111, 0.96) 100%);
  mix-blend-mode: color;
  opacity: 0.92;
}

html.halloween-date-night-active img[src*="date-night-icons"],
html.halloween-date-night-active img[src^="data:image/svg+xml"] {
  position: relative;
  z-index: 1;
  filter:
    grayscale(1)
    contrast(1.12)
    brightness(1.08)
    drop-shadow(-6px 0 10px rgba(167, 52, 62, 0.34))
    drop-shadow(6px 0 10px rgba(69, 166, 111, 0.34));
  mix-blend-mode: normal;
}

html.halloween-date-night-active div:has(> img[src*="date-night-icons"])::before,
html.halloween-date-night-active div:has(> img[src^="data:image/svg+xml"])::before {
  content: "";
  position: absolute;
  inset: 8%;
  z-index: 3;
  pointer-events: none;
  border-radius: 24%;
  box-shadow:
    -18px 0 28px -20px rgba(167, 52, 62, 0.95),
    18px 0 28px -20px rgba(69, 166, 111, 0.95);
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
      {halloweenDateNight ? <div className="halloween-accent-splatter" aria-hidden="true" /> : null}
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
