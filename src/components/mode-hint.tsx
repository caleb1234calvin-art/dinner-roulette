import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HINTS_RESET_EVENT, hasSeenHint, markHintSeen } from "@/lib/session-hints";

const STEPS = [
  {
    title: "Choose the kind of night",
    body: "Use Dinner, Nightlife, or Date Night at the top. Each mode has its own filters and personality.",
  },
  {
    title: "Set the rules",
    body: "Choose things like distance, budget, cuisine, venue type, activity, and mood. The app only picks from places that fit.",
  },
  {
    title: "Pick or browse",
    body: "The main pick button gives you one answer. Give Us Options gives you a shortlist when you want a little more control.",
  },
  {
    title: "Make it yours",
    body: "Favorite good choices, use Not Tonight when something does not fit, and check Why This Pick to see what matched your settings.",
  },
] as const;

export function ModeHint() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hasSeenHint()) {
      setStep(0);
      setOpen(true);
    }

    const reset = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener(HINTS_RESET_EVENT, reset);
    return () => window.removeEventListener(HINTS_RESET_EVENT, reset);
  }, []);

  if (!open) return null;

  const current = STEPS[step] ?? STEPS[0];
  const last = step >= STEPS.length - 1;

  function finish() {
    markHintSeen();
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-2xl ring-1 ring-fg/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-kicker text-accent">Quick tour</p>
            <h2 className="font-display mt-1 text-2xl text-fg">Dinner Roulette in 30 seconds</h2>
          </div>
          <button
            type="button"
            onClick={finish}
            className="flex size-10 items-center justify-center rounded-lg bg-elevated text-muted"
            aria-label="Close hints"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-elevated p-4 shadow-border">
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">Step {step + 1} of {STEPS.length}</p>
          <h3 className="mt-2 text-lg font-medium text-fg">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{current.body}</p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
          >
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
