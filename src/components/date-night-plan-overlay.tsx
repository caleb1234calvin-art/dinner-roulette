import { directionsUrl } from "@/lib/location/maps";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ExternalLink, MapPinned, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDateNightIcon } from "@/lib/date-night/icons";
import { HALLOWEEN_SETTLE_TYPES, HALLOWEEN_THRILL_TYPES } from "@/lib/date-night/season";
import { dateNightTypeLabel, type DecoratedDateNightPlace } from "@/lib/date-night/types";
import { formatDistance } from "@/lib/restaurants/geo";

function mapsUrl(place: DecoratedDateNightPlace) {
  return directionsUrl(place) ?? undefined;
}

function isValidHalloweenPlan(plan: DecoratedDateNightPlace[]) {
  const first = plan[0];
  const second = plan[1];
  if (!first || !second || first.id === second.id) return false;
  const firstIsThrill = first.activityTypes.some((type) => HALLOWEEN_THRILL_TYPES.includes(type));
  const secondIsSettle = second.activityTypes.some((type) => HALLOWEEN_SETTLE_TYPES.includes(type));
  return firstIsThrill && secondIsSettle;
}

export function DateNightPlanOverlay({
  plan,
  onClose,
  onReplan,
}: {
  plan: DecoratedDateNightPlace[];
  onClose: () => void;
  onReplan: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || plan.length === 0) return null;

  const validPlan = isValidHalloweenPlan(plan);

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-accent">
              <Sparkles className="size-3.5" />
              October after dark
            </div>
            <h2 className="font-display mt-2 text-3xl leading-tight text-fg">
              {validPlan ? "Your night has an arc." : "No complete seasonal pair yet."}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {validPlan
                ? "Start with the sharper thrill, then land somewhere calmer. Both stops are the plan—not competing options."
                : "Dinner Roulette only labels a stop Scare or Settle when a real matching venue exists. Widen the radius or relax your filters and try again."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface text-fg shadow-border"
            aria-label="Close night plan"
          >
            <X className="size-5" />
          </button>
        </div>

        {validPlan ? (
          <div className="mt-6 flex flex-1 flex-col justify-center gap-3">
            {plan.slice(0, 2).map((place, index) => {
              const icon = getDateNightIcon({
                activityTypes: place.activityTypes,
                cuisineLabel: place.cuisineLabel,
              });
              const role = index === 0 ? "1 · Scare" : "2 · Settle";
              return (
                <div key={place.id}>
                  <article className="overflow-hidden rounded-2xl bg-surface shadow-border">
                    <div className="flex gap-4 p-4">
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-elevated p-1.5 outline outline-1 -outline-offset-1 outline-fg/10">
                        {icon ? (
                          <img src={icon} alt="" className="size-full rounded-xl object-cover" />
                        ) : (
                          <Sparkles className="size-8 text-accent" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">{role}</p>
                        <h3 className="font-display mt-1 text-xl leading-tight text-fg">{place.name}</h3>
                        <p className="mt-1 text-xs text-muted">
                          {dateNightTypeLabel(place.activityTypes)} · {formatDistance(place.distanceMiles)}
                        </p>
                        {!place.hoursKnown ? (
                          <p className="mt-1 text-xs text-subtle">Hours unconfirmed — check before going.</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-border/70 p-3">
                      <Button size="sm" asChild>
                        <a href={mapsUrl(place)} target="_blank" rel="noreferrer">
                          <MapPinned className="size-4" />
                          Maps
                        </a>
                      </Button>
                      {place.website ? (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={place.website} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" />
                            Info
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" disabled>
                          Info unavailable
                        </Button>
                      )}
                    </div>
                  </article>

                  {index === 0 ? (
                    <div className="flex h-10 items-center justify-center text-accent/70" aria-hidden="true">
                      <ArrowDown className="size-5" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 flex flex-1 items-center justify-center">
            <div className="w-full rounded-2xl bg-surface p-5 text-sm leading-relaxed text-muted shadow-border">
              A two-stop Halloween plan needs at least one genuine thrill and one different genuine settle stop within your current filters. Nothing ordinary will be relabeled just to fill the card.
            </div>
          </div>
        )}

        <div className="mt-6 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <Button size="lg" variant="secondary" className="w-full" onClick={onReplan}>
            <RotateCcw className="size-4" />
            {validPlan ? "Plan a different night" : "Try the plan again"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
