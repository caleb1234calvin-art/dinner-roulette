import { useEffect, useState } from "react";
import { Heart, MoonStar, UtensilsCrossed } from "lucide-react";
import { PickHome } from "@/components/pick-home";
import { NightlifeHome } from "@/components/nightlife-home";
import { DateNightHome } from "@/components/date-night-home";
import { cn } from "@/lib/utils";
import type { HomeMode } from "@/lib/nightlife/types";

export function ModeHome() {
  const [mode, setMode] = useState<HomeMode>("dinner");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("nightlife-active", mode === "nightlife");
    root.classList.toggle("date-night-active", mode === "date-night");
    return () => {
      root.classList.remove("nightlife-active");
      root.classList.remove("date-night-active");
    };
  }, [mode]);

  const nightlife = mode === "nightlife";
  const dateNight = mode === "date-night";

  return (
    <div className={cn("mode-home min-h-dvh", nightlife && "nightlife-theme", dateNight && "date-night-theme")}>
      <header className="px-4 pt-8 pb-5">
        <p className="text-kicker text-subtle">
          {nightlife ? "Dinner roulette · Nightlife" : dateNight ? "Dinner roulette · Date Night" : "Dinner roulette"}
        </p>
        <h1 className="font-display mt-2 text-4xl leading-tight text-fg">
          {nightlife ? "What's the Move?" : dateNight ? "What Should We Do?" : "What's for Dinner?"}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          {nightlife
            ? "Set the vibe. Let the app pick the place."
            : dateNight
              ? "Set the mood. Let the app pick the date."
              : "You set the rules. The app helps decide."}
        </p>
      </header>

      <div className="sticky top-0 z-20 mx-auto max-w-lg px-4 py-2 bg-bg/95 backdrop-blur-sm">
        <div className="grid grid-cols-3 rounded-xl bg-surface/95 p-1 shadow-border">
          <button
            type="button"
            onClick={() => setMode("dinner")}
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
            onClick={() => setMode("nightlife")}
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
            onClick={() => setMode("date-night")}
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

      {mode === "dinner" ? <PickHome /> : mode === "nightlife" ? <NightlifeHome /> : <DateNightHome />}
    </div>
  );
}
