import type { DiscoveryMode } from "./provider-chain";

export const DISCOVERY_DEADLINE_MS = 25_000;
export const DISCOVERY_TIMEOUT_MESSAGE = "The search took too long. Please try again.";

/** One effect-owned request. Cleanup and timeout invalidate callbacks before aborting. */
export function startDiscoveryRequest<T>({ mode, request, onSuccess, onError, onSettled }: {
  mode: DiscoveryMode;
  request: (signal: AbortSignal) => Promise<T>;
  onSuccess: (result: T) => void;
  onError: (error: unknown) => void;
  onSettled: () => void;
}): () => void {
  const controller = new AbortController();
  let active = true;
  const settle = (apply: () => void) => {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    try { apply(); } finally { onSettled(); }
  };
  const timer = setTimeout(() => {
    settle(() => {
      controller.abort();
      console.warn("[discovery] client-timeout", { mode, deadlineMs: DISCOVERY_DEADLINE_MS });
      onError(new Error(DISCOVERY_TIMEOUT_MESSAGE));
    });
  }, DISCOVERY_DEADLINE_MS);

  try {
    void request(controller.signal)
      .then((result) => settle(() => {
        try { onSuccess(result); } catch (error) { onError(error); }
      }))
      .catch((error: unknown) => settle(() => onError(error)));
  } catch (error) {
    settle(() => onError(error));
  }

  return () => {
    active = false;
    clearTimeout(timer);
    controller.abort();
  };
}
