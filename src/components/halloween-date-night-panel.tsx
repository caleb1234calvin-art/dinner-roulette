import { Ghost, MoonStar, Sparkles, Trees } from "lucide-react";
import {
  HALLOWEEN_DATE_NIGHT_CHIPS,
  HALLOWEEN_DATE_NIGHT_PRESETS,
} from "@/lib/date-night/season";
import type { DateNightTypeId } from "@/lib/date-night/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRESET_ICONS = [Ghost, Trees, MoonStar] as const;

export function HalloweenDateNightPanel() {
  const filters = useAppStore((state) => state.dateNightFilters);
  const setDateNightFilters = useAppStore((state) => state.setDateNightFilters);

  function toggleSeasonalType(id: DateNightTypeId) {
    const current = filters.activityTypes.filter((type) => type !== "anything");
    const next = current.includes(id)
      ? current.filter((type) => type !== id)
      : [...current, id];
    setDateNightFilters({ activityTypes: next.length ? next : ["anything"] });
  }

  return (
    <section className="october-panel mx-4 mt-5 overflow-hidden rounded-[1.35rem] shadow-border">
      <div className="october-panel-glow px-4 pb-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-accent">
              <Sparkles className="size-3.5" />
              October after dark
            </div>
            <h2 className="font-display mt-2 text-[1.7rem] leading-none text-fg">Choose your kind of strange.</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              The usual Date Night rules still apply. October just gives the roulette a few more doors to open.
            </p>
          </div>
          <div className="october-moon shrink-0" aria-hidden="true" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {HALLOWEEN_DATE_NIGHT_CHIPS.map((chip) => {
            const selected = filters.activityTypes.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleSeasonalType(chip.id)}
                className={cn(
                  "october-chip min-h-10 rounded-full px-3.5 py-2 text-sm",
                  selected && "october-chip-selected",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border/70 bg-bg/35 p-3 backdrop-blur-sm">
        <p className="px-1 pb-2 text-[0.68rem] uppercase tracking-[0.2em] text-subtle">Or set the whole night</p>
        <div className="grid gap-2">
          {HALLOWEEN_DATE_NIGHT_PRESETS.map((preset, index) => {
            const Icon = PRESET_ICONS[index] ?? Sparkles;
            const selected =
              filters.mood === preset.mood &&
              preset.activityTypes.every((type) => filters.activityTypes.includes(type));
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  setDateNightFilters({
                    activityTypes: [...preset.activityTypes],
                    mood: preset.mood,
                    favoritesOnly: false,
                  })
                }
                className={cn(
                  "october-preset flex min-h-16 items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                  selected && "october-preset-selected",
                )}
              >
                <span className="october-preset-icon flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base text-fg">{preset.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{preset.note}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
