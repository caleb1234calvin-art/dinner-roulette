import { useEffect, useState } from "react";
import { MoonStar, UtensilsCrossed } from "lucide-react";
import { PickHome } from "@/components/pick-home";
import { NightlifeHome } from "@/components/nightlife-home";
import { cn } from "@/lib/utils";
import type { HomeMode } from "@/lib/nightlife/types";

export function ModeHome() {
  const [mode, setMode] = useState<HomeMode>("dinner");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("nightlife-active", mode === "nightlife");
    return () => root.classList.remove("nightlife-active");
  }, [mode]);

  return (
    <div className={cn(mode === "nightlife" && "nightlife-theme min-h-dvh")}>
      <div className="sticky top-0 z-20 mx-auto max-w-lg px-4 pt-3">
        <div className="grid grid-cols-2 rounded-xl bg-surface/95 p-1 shadow-border backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMode("dinner")}
            className={cn(
              "flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm transition",
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
              "flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm transition",
              mode === "nightlife" ? "bg-accent text-accent-fg" : "text-muted",
            )}
            aria-pressed={mode === "nightlife"}
          >
            <MoonStar className="size-4" />
            Nightlife
          </button>
        </div>
      </div>

      {mode === "dinner" ? <PickHome /> : <NightlifeHome />}
    </div>
  );
}
