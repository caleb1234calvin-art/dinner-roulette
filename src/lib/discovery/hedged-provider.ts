import { PROVIDER_ATTEMPT_MS, PROVIDER_BUDGET_MS, ProviderResponseError } from "./provider-chain";

export const DATE_NIGHT_MIRRORS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
] as const;
export const DATE_NIGHT_HEDGE_MS = 1_500;
const GROUPS = ["all", "seasonal", "entertainment", "culture", "outdoor"] as const;
export type DateNightProviderGroup = typeof GROUPS[number];
type AttemptOutcome = "success" | "empty" | "timeout" | "http-error" | "malformed" | "abort" | "network-error" | "cancelled";
type AttemptRecord = {
  group: DateNightProviderGroup;
  mirror: number;
  hedgeOffsetMs: number;
  durationMs: number;
  outcome: AttemptOutcome;
  status?: number;
};
export type DateNightProviderOutcome = {
  group: DateNightProviderGroup;
  outcome: "pending" | "success" | "empty" | "failed" | "cancelled";
  winnerMirror?: number;
  durationMs: number;
};

const timeoutError = () => new DOMException("Provider request timed out", "TimeoutError");
const abortError = () => new DOMException("Provider request cancelled", "AbortError");

/** Date Night only. All groups share one absolute budget and the fixed mirror set. */
export function createDateNightProvider(requestSignal?: AbortSignal) {
  const started = performance.now();
  const deadline = started + PROVIDER_BUDGET_MS;
  const groups = new Map<DateNightProviderGroup, DateNightProviderOutcome>();
  const attempts: AttemptRecord[] = [];
  let budgetExhausted = false;
  let reported = false;

  return {
    run<T>(group: DateNightProviderGroup, query: (url: string, signal: AbortSignal) => Promise<T[]>): Promise<T[]> {
      // These are internal IDs, but enforce the fan-out bound at the executor too.
      if (!GROUPS.includes(group) || groups.has(group) || groups.size >= 4 || reported) {
        return Promise.reject(new Error("Invalid Date Night provider group"));
      }
      const groupStarted = performance.now();
      const state: DateNightProviderOutcome = { group, outcome: "pending", durationMs: 0 };
      groups.set(group, state);
      return new Promise<T[]>((resolve, reject) => {
        let complete = false;
        let nextMirror = 0;
        let lastError: unknown;
        let hedgeTimer: ReturnType<typeof setTimeout> | undefined;
        const active = new Map<number, (outcome: AttemptOutcome, status?: number) => void>();

        const finish = (outcome: "success" | "empty" | "failed" | "cancelled", places?: T[], winnerMirror?: number) => {
          if (complete) return;
          complete = true;
          clearTimeout(hedgeTimer);
          clearTimeout(deadlineTimer);
          requestSignal?.removeEventListener("abort", cancel);
          state.outcome = outcome;
          state.durationMs = Math.round(performance.now() - groupStarted);
          if (winnerMirror !== undefined) state.winnerMirror = winnerMirror;
          for (const settle of [...active.values()]) {
            settle(outcome === "failed" && performance.now() >= deadline ? "timeout" : "cancelled");
          }
          if (places !== undefined) resolve(places);
          else reject(lastError instanceof Error ? lastError : new Error("Could not load date-night activities for that area."));
        };
        const expire = () => {
          budgetExhausted = true;
          lastError = timeoutError();
          finish("failed");
        };
        const cancel = () => {
          lastError = abortError();
          finish("cancelled");
        };
        const launch = () => {
          clearTimeout(hedgeTimer);
          if (complete) return;
          const remaining = deadline - performance.now();
          if (remaining <= 0) return expire();
          if (nextMirror >= DATE_NIGHT_MIRRORS.length) return;
          const index = nextMirror++;
          const attemptStarted = performance.now();
          const controller = new AbortController();
          const attemptDeadline = Math.min(deadline, attemptStarted + PROVIDER_ATTEMPT_MS);
          let attemptComplete = false;
          // The timer settles our own promise, rather than depending on fetch or
          // response.json() to honor abort. It remains armed through body parsing.
          const attemptTimer = setTimeout(() => failed(timeoutError(), "timeout"), attemptDeadline - attemptStarted);
          const settle = (outcome: AttemptOutcome, status?: number) => {
            if (attemptComplete) return;
            attemptComplete = true;
            clearTimeout(attemptTimer);
            active.delete(index);
            attempts.push({
              group, mirror: index + 1,
              hedgeOffsetMs: Math.round(attemptStarted - groupStarted),
              durationMs: Math.round(performance.now() - attemptStarted), outcome,
              ...(status === undefined ? {} : { status }),
            });
            controller.abort(outcome === "timeout" ? timeoutError() : abortError());
          };
          const failed = (error: unknown, forcedOutcome?: AttemptOutcome) => {
            if (complete || attemptComplete) return;
            lastError = error;
            const outcome = forcedOutcome ?? (
              error instanceof ProviderResponseError ? error.outcome
                : error instanceof SyntaxError ? "malformed"
                  : error instanceof Error && error.name === "AbortError" ? "abort" : "network-error"
            );
            settle(outcome, error instanceof ProviderResponseError ? error.status : undefined);
            if (performance.now() >= deadline) return expire();
            // A hard failure immediately gives the next known mirror a chance.
            if (nextMirror < DATE_NIGHT_MIRRORS.length) launch();
            else if (!active.size) finish("failed");
          };
          active.set(index, settle);
          if (nextMirror < DATE_NIGHT_MIRRORS.length) {
            hedgeTimer = setTimeout(launch, Math.max(0, groupStarted + nextMirror * DATE_NIGHT_HEDGE_MS - performance.now()));
          }
          void Promise.resolve().then(() => complete || attemptComplete ? [] : query(DATE_NIGHT_MIRRORS[index]!, controller.signal)).then((places) => {
            if (complete || attemptComplete) return;
            if (performance.now() >= attemptDeadline) return failed(timeoutError(), "timeout");
            if (!Array.isArray(places)) return failed(new ProviderResponseError("Malformed Date Night provider response", "malformed"));
            const outcome = places.length ? "success" : "empty";
            settle(outcome);
            finish(outcome, places, index + 1);
          }, failed);
        };
        const deadlineTimer = setTimeout(expire, Math.max(0, deadline - performance.now()));
        if (requestSignal?.aborted) return cancel();
        requestSignal?.addEventListener("abort", cancel, { once: true });
        if (deadline <= performance.now()) return expire();
        launch();
      });
    },
    outcomes(): DateNightProviderOutcome[] {
      return [...groups.values()].map((group) => ({ ...group }));
    },
    finish(source: "live" | "merged" | "fallback" | "error") {
      if (reported) return;
      reported = true;
      const states = [...groups.values()];
      const successfulGroups = states.filter((group) => group.outcome === "success" || group.outcome === "empty").length;
      const failedGroups = states.filter((group) => group.outcome === "failed" || group.outcome === "cancelled").length;
      if (attempts.length > states.length || states.some((group) => group.outcome !== "success") || source === "fallback" || source === "error") {
        // Exactly one bounded summary. No coordinates, URLs, query text, raw
        // exceptions, user identifiers or provider payloads enter this record.
        console.warn("[discovery] provider-chain", {
          mode: "date-night", strategy: "hedged", source,
          durationMs: Math.round(performance.now() - started), budgetExhausted,
          requestedGroups: states.length, successfulGroups, failedGroups,
          partial: successfulGroups > 0 && failedGroups > 0,
          groups: states.map((group) => ({ ...group })),
          attempts: attempts.slice().sort((a, b) => a.group.localeCompare(b.group) || a.mirror - b.mirror),
        });
      }
    },
  };
}
