// Run from repo root. Actual handlers/controllers/timers; only provider fetch is
// mocked to remain pending until native abort. No external provider requests.
import fs from "node:fs";
import assert from "node:assert/strict";
import { appModuleLoader } from "../../scripts/test-support/load-app-module.mjs";
const load = appModuleLoader();
const modes = [
  ["dinner", load("src/lib/restaurants/search.ts").searchRestaurants],
  ["date-night", load("src/lib/date-night/search.ts").searchDateNight],
  ["nightlife", load("src/lib/nightlife/search.ts").searchNightlife],
];
const data = { lat: 37.176447, lon: -94.310223, radiusMiles: 15, spookySeasonEnabled: false };
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });
  const records = await Promise.all(modes.map(async ([mode, search]) => {
    const start = performance.now();
    const result = await search({ data });
    const elapsedMs = performance.now() - start;
    return { mode, elapsedMs, source: result.source, withinTolerance: elapsedMs <= 20_500 };
  }));
  fs.writeFileSync(new URL("./native-provider-timing.json", import.meta.url), JSON.stringify(records, null, 2) + "\n");
  console.log(JSON.stringify(records, null, 2));
  assert.ok(records.every((row) => row.withinTolerance && row.source === "fallback"));
} finally {
  globalThis.fetch = originalFetch;
}
