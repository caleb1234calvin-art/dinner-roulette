import { Ghost, MoonStar, Sparkles, Trees } from "lucide-react";
import {
  HALLOWEEN_DATE_NIGHT_CHIPS,
  HALLOWEEN_DATE_NIGHT_PRESETS,
} from "@/lib/date-night/season";
import type { DateNightTypeId } from "@/lib/date-night/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRESET_ICONS = [Ghost, Trees, MoonStar] as const;

const OCTOBER_STYLES = `
html.halloween-date-night-active {
  color-scheme: dark;
  --app-bg: #110e0f;
  --app-surface: #1c1617;
  --app-elevated: #2a2020;
  --app-fg: #f5eadb;
  --app-muted: #c6b5a4;
  --app-subtle: #8f7d71;
  --app-accent: #d56a2f;
  --app-accent-fg: #fff3e5;
  --app-border: #49342f;
  --app-open: #748e68;
  --app-danger: #bd5158;
  --app-heart: #a94450;
  --app-shadow-border:
    0 0 0 1px color-mix(in oklab, #f5eadb 8%, transparent),
    0 18px 45px -38px rgba(0, 0, 0, 0.95);
  --app-shadow-border-hover:
    0 0 0 1px color-mix(in oklab, #d56a2f 34%, transparent),
    0 18px 45px -34px rgba(213, 106, 47, 0.22);
}

.halloween-date-night-theme {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 84% 10%, rgba(213, 106, 47, 0.10), transparent 24rem),
    radial-gradient(circle at 15% 34%, rgba(117, 39, 48, 0.10), transparent 21rem),
    linear-gradient(180deg, #110e0f 0%, #151011 42%, #110e0f 100%);
}

.halloween-date-night-theme > header {
  position: relative;
}

.halloween-date-night-theme > header::after {
  content: "";
  display: block;
  width: 4.5rem;
  height: 1px;
  margin-top: 1rem;
  background: linear-gradient(90deg, rgba(213, 106, 47, 0.8), rgba(213, 106, 47, 0));
}

.october-panel {
  position: relative;
  background: linear-gradient(145deg, rgba(42, 29, 28, 0.98), rgba(22, 17, 18, 0.98));
  box-shadow:
    inset 0 0 0 1px rgba(245, 234, 219, 0.08),
    0 26px 55px -42px rgba(213, 106, 47, 0.62);
}

.october-panel-idle {
  background: linear-gradient(145deg, color-mix(in oklab, var(--app-surface) 96%, #2b1a16), var(--app-surface));
}

.october-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.38;
  background-image:
    linear-gradient(115deg, transparent 0 48%, rgba(245, 234, 219, 0.035) 49% 50%, transparent 51%),
    radial-gradient(circle at 18% 20%, rgba(213, 106, 47, 0.12), transparent 16rem);
}

.october-panel-glow {
  position: relative;
  isolation: isolate;
}

.october-moon {
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 999px;
  background:
    radial-gradient(circle at 34% 34%, #fff0d8 0 13%, #e6b474 28%, #b96832 66%, #5a281e 100%);
  box-shadow:
    0 0 0 1px rgba(255, 233, 201, 0.10),
    0 0 34px rgba(213, 106, 47, 0.20);
  opacity: 0.88;
}

.spooky-toggle {
  position: relative;
  width: 3.25rem;
  height: 1.8rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--app-elevated) 88%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--app-fg) 12%, transparent);
  transition: background 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
}

.spooky-toggle::after {
  content: "";
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  background: var(--app-fg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 180ms var(--ease-out), background 180ms var(--ease-out);
}

.spooky-toggle-on {
  background: linear-gradient(135deg, #d56a2f, #8a3039);
  box-shadow:
    inset 0 0 0 1px rgba(255, 230, 200, 0.18),
    0 0 22px -10px rgba(213, 106, 47, 0.85);
}

.spooky-toggle-on::after {
  transform: translateX(1.45rem);
  background: #fff0d8;
}

.october-decor {
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.86;
}

.october-decor-bats {
  position: absolute;
  right: 4.4rem;
  top: 1.05rem;
  width: 5.6rem;
  height: 3.4rem;
  color: rgba(245, 234, 219, 0.44);
}

.october-decor-pumpkin {
  position: absolute;
  right: 0.75rem;
  bottom: 0.2rem;
  width: 4.8rem;
  height: 4.8rem;
  color: rgba(213, 106, 47, 0.46);
}

.october-decor-scarecrow {
  position: absolute;
  left: -0.35rem;
  bottom: -0.4rem;
  width: 5.2rem;
  height: 6.8rem;
  color: rgba(198, 181, 164, 0.18);
}

.october-chip {
  color: #cbb9a8;
  background: rgba(245, 234, 219, 0.035);
  box-shadow: inset 0 0 0 1px rgba(245, 234, 219, 0.10);
  transition:
    transform 150ms var(--ease-out),
    color 150ms var(--ease-out),
    background 150ms var(--ease-out),
    box-shadow 150ms var(--ease-out);
}

.october-chip:active {
  transform: scale(0.96);
}

.october-chip-selected {
  color: #fff3e5;
  background: linear-gradient(135deg, rgba(213, 106, 47, 0.52), rgba(135, 52, 55, 0.52));
  box-shadow:
    inset 0 0 0 1px rgba(255, 221, 186, 0.20),
    0 8px 24px -16px rgba(213, 106, 47, 0.9);
}

.october-preset {
  background: rgba(245, 234, 219, 0.025);
  box-shadow: inset 0 0 0 1px rgba(245, 234, 219, 0.07);
  transition:
    transform 150ms var(--ease-out),
    background 150ms var(--ease-out),
    box-shadow 150ms var(--ease-out);
}

.october-preset:active {
  transform: scale(0.985);
}

.october-preset-selected {
  background: linear-gradient(135deg, rgba(213, 106, 47, 0.12), rgba(128, 46, 55, 0.12));
  box-shadow:
    inset 0 0 0 1px rgba(213, 106, 47, 0.25),
    0 12px 30px -24px rgba(213, 106, 47, 0.65);
}

.october-preset-icon {
  color: #f4c092;
  background: rgba(213, 106, 47, 0.10);
  box-shadow: inset 0 0 0 1px rgba(213, 106, 47, 0.16);
}

html.halloween-date-night-active .shortlist-brand-stage {
  background: linear-gradient(
    145deg,
    color-mix(in oklab, #d56a2f 34%, #24191a),
    color-mix(in oklab, #8a3039 20%, #171314)
  );
  box-shadow:
    inset 0 0 0 1px rgba(245, 234, 219, 0.10),
    0 16px 34px -22px rgba(213, 106, 47, 0.55);
}

@media (prefers-reduced-motion: reduce) {
  .october-chip,
  .october-preset,
  .spooky-toggle,
  .spooky-toggle::after {
    transition: none;
  }
}
`;

function OctoberDecor() {
  return (
    <div className="october-decor" aria-hidden="true">
      <svg className="october-decor-bats" viewBox="0 0 120 70" fill="currentColor">
        <path d="M6 30c9-8 17-9 25-2 7-10 14-10 22 0 8-7 16-6 25 2-9 1-14 5-17 12-4-7-9-10-15-10-6 0-11 3-15 10-3-7-8-11-17-12Z" />
        <path d="M66 9c6-5 11-5 16 0 5-7 10-7 15 0 5-5 10-5 17 0-6 1-10 4-12 9-3-5-6-7-11-7s-8 2-11 7c-2-5-6-8-14-9Z" opacity=".7" />
      </svg>
      <svg className="october-decor-pumpkin" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5">
        <path d="M50 24c-22 0-38 14-38 34s16 30 38 30 38-10 38-30S72 24 50 24Z" />
        <path d="M50 25c-13 7-16 50 0 62M50 25c13 7 16 50 0 62M35 30c-9 13-8 40 0 52M65 30c9 13 8 40 0 52" />
        <path d="M49 25c-1-9 6-13 14-13-4 3-5 7-4 12" />
      </svg>
      <svg className="october-decor-scarecrow" viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M14 50h72M50 44v72M28 115h44" />
        <circle cx="50" cy="35" r="14" />
        <path d="M29 23h42M37 23l7-13h20l8 13M42 36l5 3 5-3M57 36l5 3 5-3M45 47h12" />
        <path d="M18 51l-11-8M82 51l11-8M50 62l-18 18M50 62l18 18" />
      </svg>
    </div>
  );
}

export function HalloweenDateNightPanel() {
  const filters = useAppStore((state) => state.dateNightFilters);
  const setDateNightFilters = useAppStore((state) => state.setDateNightFilters);
  const spookySeasonEnabled = useAppStore((state) => state.spookySeasonEnabled);
  const setSpookySeasonEnabled = useAppStore((state) => state.setSpookySeasonEnabled);

  function toggleSeasonalType(id: DateNightTypeId) {
    const current = filters.activityTypes.filter((type) => type !== "anything");
    const next = current.includes(id)
      ? current.filter((type) => type !== id)
      : [...current, id];
    setDateNightFilters({ activityTypes: next.length ? next : ["anything"] });
  }

  function toggleSpookySeason() {
    const next = !spookySeasonEnabled;
    if (!next) {
      const seasonal = new Set<DateNightTypeId>(["haunted-house", "corn-maze", "pumpkin-patch"]);
      const remaining = filters.activityTypes.filter((type) => !seasonal.has(type));
      setDateNightFilters({ activityTypes: remaining.length ? remaining : ["anything"] });
    }
    setSpookySeasonEnabled(next);
  }

  return (
    <>
      <style>{OCTOBER_STYLES}</style>
      <section
        className={cn(
          "october-panel mx-4 mt-5 overflow-hidden rounded-[1.35rem] shadow-border",
          !spookySeasonEnabled && "october-panel-idle",
        )}
      >
        {spookySeasonEnabled ? <OctoberDecor /> : null}
        <div className="october-panel-glow px-4 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-accent">
                <Sparkles className="size-3.5" />
                Spooky Season
              </div>
              <h2 className="font-display mt-2 text-[1.7rem] leading-none text-fg">
                {spookySeasonEnabled ? "October after dark." : "Dress Date Night for Halloween."}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                {spookySeasonEnabled
                  ? "Haunts, harvest nights, and stranger doors are in the roulette now."
                  : "Turn on the seasonal skin for Halloween styling, spooky picks, and October presets."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={spookySeasonEnabled}
              aria-label="Spooky Season"
              onClick={toggleSpookySeason}
              className={cn("spooky-toggle mt-1 shrink-0", spookySeasonEnabled && "spooky-toggle-on")}
            />
          </div>

          {spookySeasonEnabled ? (
            <>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-subtle">Choose your kind of strange</p>
                <div className="october-moon shrink-0" aria-hidden="true" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
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
            </>
          ) : null}
        </div>

        {spookySeasonEnabled ? (
          <div className="relative border-t border-border/70 bg-bg/35 p-3 backdrop-blur-sm">
            <p className="px-1 pb-2 text-[0.68rem] uppercase tracking-[0.2em] text-subtle">Or set the whole night</p>
            <div className="grid gap-2">
              {HALLOWEEN_DATE_NIGHT_PRESETS.map((preset, index) => {
                const Icon = PRESET_ICONS[index] ?? Sparkles;
                const selected =
                  filters.mood === preset.mood &&
                  filters.activityTypes.length === preset.activityTypes.length &&
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
        ) : null}
      </section>
    </>
  );
}
