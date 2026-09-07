import { Ghost, MoonStar, Sparkles, Trees } from "lucide-react";
import { HALLOWEEN_DATE_NIGHT_PRESETS } from "@/lib/date-night/season";
import type { DateNightTypeId } from "@/lib/date-night/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRESET_ICONS = [Ghost, Trees, MoonStar] as const;

const OCTOBER_STYLES = `
html.halloween-date-night-active[data-theme="light"] {
  color-scheme: light;
  --app-bg: #f1eff0;
  --app-surface: #fbfafb;
  --app-elevated: #e7e2e4;
  --app-fg: #342c2f;
  --app-muted: #6f6266;
  --app-subtle: #91858a;
  --app-accent: #a7343e;
  --app-accent-fg: #fff8f8;
  --app-border: #d9cfd2;
  --app-open: #438a70;
  --app-danger: #b74756;
  --app-heart: #a7343e;
  --app-shadow-border:
    0 0 0 1px color-mix(in oklab, #342c2f 9%, transparent),
    0 1px 2px -1px color-mix(in oklab, #342c2f 7%, transparent);
  --app-shadow-border-hover:
    0 0 0 1px color-mix(in oklab, #a7343e 34%, transparent),
    0 8px 24px -18px color-mix(in oklab, #a7343e 48%, transparent);
  --october-ember: #c56a32;
  --october-ember-fg: #6b3518;
}

html.halloween-date-night-active:not([data-theme="light"]) {
  color-scheme: dark;
  --app-bg: #14110e;
  --app-surface: #1d1915;
  --app-elevated: #26211c;
  --app-fg: #f1f4f2;
  --app-muted: #b8c1bc;
  --app-subtle: #89938e;
  --app-accent: #45a66f;
  --app-accent-fg: #071d12;
  --app-border: #353a37;
  --app-open: #76a88e;
  --app-danger: #d16b72;
  --app-heart: #45a66f;
  --app-shadow-border:
    0 0 0 1px color-mix(in oklab, #f1f4f2 8%, transparent),
    0 18px 45px -38px rgba(0, 0, 0, 0.95);
  --app-shadow-border-hover:
    0 0 0 1px color-mix(in oklab, #45a66f 34%, transparent),
    0 18px 45px -34px color-mix(in oklab, #45a66f 24%, transparent);
  --october-ember: #c56a32;
  --october-ember-fg: #ffd9bd;
}

.halloween-date-night-theme {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 84% 10%, color-mix(in oklab, var(--app-accent) 11%, transparent), transparent 24rem),
    radial-gradient(circle at 15% 34%, color-mix(in oklab, var(--october-ember) 8%, transparent), transparent 21rem),
    linear-gradient(
      180deg,
      var(--app-bg) 0%,
      color-mix(in oklab, var(--app-bg) 90%, var(--app-surface)) 42%,
      var(--app-bg) 100%
    );
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
  background: linear-gradient(
    90deg,
    color-mix(in oklab, var(--app-accent) 82%, transparent),
    color-mix(in oklab, var(--october-ember) 34%, transparent),
    transparent
  );
}

.october-panel {
  position: relative;
  background: linear-gradient(
    145deg,
    color-mix(in oklab, var(--app-surface) 92%, var(--app-accent)),
    color-mix(in oklab, var(--app-surface) 96%, var(--app-bg))
  );
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--app-fg) 8%, transparent),
    0 26px 55px -42px color-mix(in oklab, var(--app-accent) 62%, transparent);
}

.october-panel-idle {
  background: linear-gradient(
    145deg,
    color-mix(in oklab, var(--app-surface) 96%, var(--october-ember)),
    var(--app-surface)
  );
}

.october-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.38;
  background-image:
    linear-gradient(
      115deg,
      transparent 0 48%,
      color-mix(in oklab, var(--app-fg) 3.5%, transparent) 49% 50%,
      transparent 51%
    ),
    radial-gradient(
      circle at 18% 20%,
      color-mix(in oklab, var(--october-ember) 12%, transparent),
      transparent 16rem
    );
}

.october-panel-glow {
  position: relative;
  isolation: isolate;
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
  background: linear-gradient(135deg, var(--app-accent), var(--october-ember));
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--app-accent-fg) 18%, transparent),
    0 0 22px -10px color-mix(in oklab, var(--app-accent) 85%, transparent);
}

.spooky-toggle-on::after {
  transform: translateX(1.45rem);
  background: var(--app-accent-fg);
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
  color: color-mix(in oklab, var(--app-fg) 44%, transparent);
}

.october-decor-pumpkin {
  position: absolute;
  right: 0.75rem;
  bottom: 0.2rem;
  width: 4.8rem;
  height: 4.8rem;
  color: color-mix(in oklab, var(--october-ember) 48%, transparent);
}

.october-decor-scarecrow {
  position: absolute;
  left: -0.35rem;
  bottom: -0.4rem;
  width: 5.2rem;
  height: 6.8rem;
  color: color-mix(in oklab, var(--app-muted) 20%, transparent);
}

.october-preset {
  background: color-mix(in oklab, var(--app-fg) 2.5%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--app-fg) 7%, transparent);
  transition:
    transform 150ms var(--ease-out),
    background 150ms var(--ease-out),
    box-shadow 150ms var(--ease-out);
}

.october-preset:active {
  transform: scale(0.985);
}

.october-preset-selected {
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--app-accent) 13%, transparent),
    color-mix(in oklab, var(--october-ember) 10%, transparent)
  );
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--app-accent) 28%, transparent),
    0 12px 30px -24px color-mix(in oklab, var(--app-accent) 62%, transparent);
}

.october-preset-icon {
  color: var(--october-ember-fg);
  background: color-mix(in oklab, var(--october-ember) 12%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--october-ember) 20%, transparent);
}

html.halloween-date-night-active .shortlist-brand-stage {
  background: linear-gradient(
    145deg,
    color-mix(in oklab, var(--app-accent) 34%, var(--app-surface)),
    color-mix(in oklab, var(--october-ember) 15%, var(--app-elevated))
  );
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--app-fg) 10%, transparent),
    0 16px 34px -22px color-mix(in oklab, var(--app-accent) 58%, transparent);
}

html.halloween-date-night-active .chip:is(
  [class*="ring-[#d56a2f]"],
  [class*="ring-[#f4c092]"]
) {
  color: #17110d !important;
  font-weight: 700;
}

html.halloween-date-night-active[data-theme="light"] .chip:is(
  [class*="ring-[#d56a2f]"],
  [class*="ring-[#f4c092]"]
)[aria-pressed="false"] {
  background: #f5c184 !important;
  box-shadow:
    inset 0 0 0 1px rgba(177, 92, 34, 0.28),
    0 3px 10px -7px rgba(197, 106, 50, 0.4) !important;
}

html.halloween-date-night-active[data-theme="light"] .chip:is(
  [class*="ring-[#d56a2f]"],
  [class*="ring-[#f4c092]"]
)[aria-pressed="true"] {
  background: linear-gradient(135deg, #f8ca91, #ec964b) !important;
  box-shadow:
    inset 0 0 0 1px rgba(138, 61, 20, 0.2),
    0 0 0 1px rgba(232, 132, 48, 0.34),
    0 0 24px -5px rgba(232, 132, 48, 0.78),
    0 10px 28px -16px rgba(197, 106, 50, 0.75) !important;
}

html.halloween-date-night-active:not([data-theme="light"]) .chip:is(
  [class*="ring-[#d56a2f]"],
  [class*="ring-[#f4c092]"]
)[aria-pressed="false"] {
  background: #d98445 !important;
  box-shadow:
    inset 0 0 0 1px rgba(255, 215, 171, 0.18),
    0 5px 14px -9px rgba(229, 126, 50, 0.58) !important;
}

html.halloween-date-night-active:not([data-theme="light"]) .chip:is(
  [class*="ring-[#d56a2f]"],
  [class*="ring-[#f4c092]"]
)[aria-pressed="true"] {
  background: linear-gradient(135deg, #f0a35e, #dc742f) !important;
  box-shadow:
    inset 0 0 0 1px rgba(255, 228, 195, 0.22),
    0 0 0 1px rgba(240, 139, 55, 0.38),
    0 0 26px -4px rgba(240, 139, 55, 0.82),
    0 12px 30px -17px rgba(197, 106, 50, 0.88) !important;
}

html.halloween-date-night-active img[src*="date-night-icons"] {
  filter: saturate(0.76) contrast(1.07) brightness(0.95);
}

@media (prefers-reduced-motion: reduce) {
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
