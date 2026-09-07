import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HINTS_RESET_EVENT,
  hasSeenModeHint,
  markModeHintSeen,
  type MainMode,
} from "@/lib/session-hints";

const COPY: Record<MainMode, { title: string; steps: { title: string; body: string }[] }> = {
  dinner: {
    title: "Dinner in 20 seconds",
    steps: [
      { title: "Set the rules", body: "Choose distance, budget, cuisine, and how adventurous tonight should feel." },
      { title: "Pick or browse", body: "Pick For Us chooses one place. Give Us Options gives you a shortlist instead." },
      { title: "Teach the app", body: "Favorite good picks, reject bad ones for tonight, and rate places after you go." },
    ],
  },
  nightlife: {
    title: "Nightlife in 20 seconds",
    steps: [
      { title: "Set the vibe", body: "Choose your radius, budget, venue type, and whether tonight should be chill or lively." },
      { title: "Let it decide", body: "Pick the move for one answer, or ask for options if you want a few good choices." },
      { title: "Keep what works", body: "Favorites and your past choices help future nightlife picks feel more like you." },
    ],
  },
  "date-night": {
    title: "Date Night in 20 seconds",
    steps: [
      { title: "Choose the mood", body: "Set distance, activity types, and whether the date should feel cozy, playful, or adventurous." },
      { title: "Parks stay balanced", body: "Fewer Parks keeps parks available without letting them dominate the roulette." },
      { title: "Pick a date", body: "Pick Our Date chooses one plan. Give Us Options tries to give you a varied shortlist." },
    ],
  },
};

export function ModeHint({ mode }: { mode: MainMode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const copy = useMemo(() => COPY[mode], [mode]);

  useEffect(() => {
    if (!hasSeenModeHint(mode)) {
      setStep(0);
      setOpen(true);
    }
    const reset = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener(HINTS_RESET_EVENT, reset);
    return () => window.removeEventListener(HINTS_RESET_EVENT, reset);
  }, [mode]);

  if (!open) return null;

  const current = copy.steps[step] ?? copy.steps[0];
  const last = step >= copy.steps.length - 1;

  function finish() {
    markModeHintSeen(mode);
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-2xl ring-1 ring-fg/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-kicker text-accent">Quick tour</p>
            <h2 className="font-display mt-1 text-2xl text-fg">{copy.title}</h2>
          </div>
          <button type="button" onClick={finish} className="flex size-10 items-center justify-center rounded-lg bg-elevated text-muted" aria-label="Close hints">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-elevated p-4 shadow-border">
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">Step {step + 1} of {copy.steps.length}</p>
          <h3 className="mt-2 text-lg font-medium text-fg">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{current.body}</p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Button variant="secondary" className="flex-1" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            <ChevronLeft className="size-4" /> Back
          </Button>
          <Button className="flex-1" onClick={() => (last ? finish() : setStep((value) => value + 1))}>
            {last ? "Got it" : "Next"}
            {!last ? <ChevronRight className="size-4" /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
}
