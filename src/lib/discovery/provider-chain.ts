export const PROVIDER_BUDGET_MS = 20_000;
export const PROVIDER_ATTEMPT_MS = 8_000;
export type DiscoveryMode = "dinner" | "date-night" | "nightlife";

type Outcome =
  "success" | "empty" | "timeout" | "http-error" | "malformed" | "abort" | "network-error";

/** Keep provider error messages for existing normalization, never for logging. */
export class ProviderResponseError extends Error {
  constructor(
    message: string,
    readonly outcome: "http-error" | "malformed",
    readonly status?: number,
  ) {
    super(message);
  }
}

export function createProviderChain(mode: DiscoveryMode) {
  const started = performance.now();
  const deadline = started + PROVIDER_BUDGET_MS;
  const attempts: { mirror: number; durationMs: number; outcome: Outcome; status?: number }[] = [];
  let budgetExhausted = false;
  let reported = false;

  return {
    async run<T>(
      mirrors: readonly string[],
      query: (url: string, signal: AbortSignal) => Promise<T[]>,
      continueOnEmpty = false,
    ): Promise<T[]> {
      let lastError: unknown;
      let hadSuccessfulResponse = false;
      for (const [index, mirror] of mirrors.entries()) {
        const remaining = deadline - performance.now();
        if (remaining <= 0) {
          budgetExhausted = true;
          break;
        }
        const attemptStarted = performance.now();
        const controller = new AbortController();
        // Remains armed through response.json(), not just response headers.
        const timer = setTimeout(
          () => controller.abort(new DOMException("Provider request timed out", "TimeoutError")),
          Math.min(PROVIDER_ATTEMPT_MS, remaining),
        );
        let outcome: Outcome = "success";
        let status: number | undefined;
        try {
          const places = await query(mirror, controller.signal);
          hadSuccessfulResponse = true;
          outcome = places.length ? "success" : "empty";
          if (places.length || !continueOnEmpty) return places;
        } catch (error) {
          lastError = error;
          outcome = controller.signal.aborted
            ? "timeout"
            : error instanceof ProviderResponseError
              ? error.outcome
              : error instanceof SyntaxError
                ? "malformed"
                : error instanceof Error && error.name === "AbortError"
                  ? "abort"
                  : "network-error";
          if (error instanceof ProviderResponseError) status = error.status;
        } finally {
          clearTimeout(timer);
          // Also release an unread HTTP-error body before advancing mirrors.
          controller.abort();
          attempts.push({
            mirror: index + 1,
            durationMs: Math.round(performance.now() - attemptStarted),
            outcome,
            ...(status === undefined ? {} : { status }),
          });
        }
      }
      budgetExhausted ||= performance.now() >= deadline;
      if (hadSuccessfulResponse) return [];
      throw lastError instanceof Error
        ? lastError
        : new Error(
            {
              dinner: "Restaurant search failed",
              "date-night": "Could not load date-night activities for that area.",
              nightlife: "Could not load nightlife venues for that area.",
            }[mode],
          );
    },
    finish(source: "live" | "merged" | "fallback" | "error") {
      if (reported) return;
      reported = true;
      // One bounded record per degraded request; normal first-mirror success is quiet.
      // Mirror ordinal identifies the unchanged ordered provider list. No URLs,
      // query bodies, coordinates, addresses, payloads or raw exceptions are logged.
      if (
        attempts.length > 1 ||
        attempts[0]?.outcome !== "success" ||
        source === "fallback" ||
        source === "error"
      ) {
        console.warn("[discovery] provider-chain", {
          mode,
          source,
          durationMs: Math.round(performance.now() - started),
          budgetExhausted,
          attempts,
        });
      }
    },
  };
}
