import { affirmativeClauses } from "./date-night-query-evaluator.mjs";
// Disposable acceptance-server fixture only; never imported by application code.
import { appendFileSync, readFileSync } from "node:fs";

if (process.env.CI !== "true" || process.env.DATE_NIGHT_RESILIENCE_BROWSER !== "1") {
  throw new Error("Date Night provider fixtures require a disposable CI process");
}
const controlPath = process.env.DATE_NIGHT_RESILIENCE_CONTROL;
const eventPath = process.env.DATE_NIGHT_RESILIENCE_EVENTS;
if (!controlPath || !eventPath) throw new Error("Date Night fixture paths are required");
const mirrors = ["overpass.openstreetmap.fr", "overpass.private.coffee", "maps.mail.ru", "overpass-api.de"];
const scenarios = new Set(["second-mirror", "third-mirror", "partial-groups", "all-stall"]);
const config = () => {
  const value = JSON.parse(readFileSync(controlPath, "utf8"));
  if (!scenarios.has(value.scenario) || !Number.isFinite(value.startedAt)) throw new Error("Invalid Date Night fixture scenario");
  return value;
};
const record = (state, event) => appendFileSync(eventPath, JSON.stringify({ scenario: state.scenario, atMs: Date.now() - state.startedAt, ...event }) + "\n");
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] === "[discovery] provider-chain" && args[1]?.mode === "date-night") {
    // Application summaries already exclude provider payloads, locations and raw
    // exceptions. Copy only the bounded diagnostic fields used by this harness.
    const value = args[1];
    record(config(), { event: "summary", source: value.source, partial: value.partial,
      durationMs: value.durationMs, budgetExhausted: value.budgetExhausted,
      requestedGroups: value.requestedGroups, successfulGroups: value.successfulGroups,
      failedGroups: value.failedGroups, attempts: value.attempts,
    });
  }
  originalWarn(...args);
};

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return originalFetch(input, init);
  const index = mirrors.indexOf(url.hostname);
  if (index < 0) throw new Error("External network disabled in Date Night acceptance fixture");
  // Shared lifecycle-negative companions do not identify the positive group.
  const query = affirmativeClauses(new URLSearchParams(init?.body).get("data") ?? "").join("\n");
  const group = /haunted_house|corn_maze|pumpkin_patch/.test(query) ? "seasonal"
    : /bowling_alley|amusement_arcade|miniature_golf|escape_game|roller_skating/.test(query) ? "entertainment"
      : /cinema|museum/.test(query) ? "culture"
        : query.includes('["leisure"="park"]') ? "outdoor" : undefined;
  // An SSR-to-persisted-mode transition may briefly request another mode. It
  // receives an empty fixture and never reaches a public provider.
  if (!group) return Response.json({ elements: [] });
  const state = config();
  const mirror = index + 1;
  const signal = init?.signal;
  record(state, { event: "start", group, mirror });
  const stall = state.scenario === "all-stall" ||
    (state.scenario === "partial-groups" && group === "outdoor") ||
    (state.scenario === "second-mirror" && mirror < 2) ||
    (state.scenario === "third-mirror" && mirror < 3);
  if (stall) {
    return new Promise((_resolve, reject) => {
      const abort = () => {
        record(state, { event: "abort", group, mirror, reason: signal?.reason?.name === "TimeoutError" ? "timeout" : "cancelled" });
        reject(signal?.reason ?? new DOMException("Fixture cancelled", "AbortError"));
      };
      if (signal?.aborted) abort();
      else signal?.addEventListener("abort", abort, { once: true });
    });
  }
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { signal?.removeEventListener("abort", abort); resolve(); }, 75);
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
  record(state, { event: "response", group, mirror });
  return Response.json({ elements: group === "seasonal" ? [{
    type: "node", id: 981234567, lat: 37.176447, lon: -94.310223,
    tags: { name: "Resilience Browser Harvest", attraction: "corn_maze", opening_hours: "24/7" },
  }] : [] });
};
