// Real provider observations, separate from deterministic fixture assertions.
import fs from "node:fs";
import crypto from "node:crypto";
import { appModuleLoader } from "../../scripts/test-support/load-app-module.mjs";
const load = appModuleLoader();
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { seasonalCoverage } = load("src/lib/date-night/coverage.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const dir = "audit/seasonal-discovery-remediation-1-evidence";
const origins = [{ label: "Carthage", lat: 37.176447, lon: -94.310223 }, { label: "Joplin", lat: 37.084184, lon: -94.513339 }, { label: "Springfield", lat: 37.208957, lon: -93.292299 }, { label: "Lockwood rural", lat: 37.3856, lon: -93.953 }, { label: "Aurora", lat: 36.970891, lon: -93.717979 }];
const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes: ["haunted-house", "corn-maze", "pumpkin-patch"], openNowOnly: false };
const nativeFetch = globalThis.fetch;
const runs = [];
for (const origin of origins) {
  const run = { origin, startedAt: new Date().toISOString(), calls: [] };
  globalThis.fetch = async (url, options) => {
    const call = { url, startedAt: new Date().toISOString(), query: new URLSearchParams(options.body).get("data") }; run.calls.push(call);
    try {
      const response = await nativeFetch(url, options);
      const body = await response.clone().text();
      call.status = response.status; call.sha256 = crypto.createHash("sha256").update(body).digest("hex");
      call.body = body;
      try { call.rawCount = JSON.parse(body).elements?.length ?? null; } catch { call.rawCount = null; }
      call.finishedAt = new Date().toISOString();
      return response;
    } catch (error) { call.error = error.message; call.finishedAt = new Date().toISOString(); throw error; }
  };
  try {
    const result = await searchDateNight({ data: { ...origin, radiusMiles: 50, spookySeasonEnabled: true } });
    run.source = result.source; run.warning = result.warning ?? null;
    run.venues = result.venues;
    const now = new Date(); run.evaluatedAt = now.toISOString();
    const decorated = decorateDateNight(result.venues, origin, now);
    const brief = (v) => ({ id: v.id, name: v.name, activityTypes: v.activityTypes, distanceMiles: v.distanceMiles, status: v.availability.status, source: v.source });
    run.off = eligibleDateNight(decorated, filters, true, {}, [], now.getTime()).map(brief);
    run.on = eligibleDateNight(decorated, { ...filters, openNowOnly: true }, true, {}, [], now.getTime()).map(brief);
    run.coverage = seasonalCoverage(decorated, filters, result.source, true);
  } catch (error) { run.error = error.message; }
  run.finishedAt = new Date().toISOString(); runs.push(run);
  fs.writeFileSync(`${dir}/live-controls.json`, JSON.stringify({ timezone: process.env.TZ, completeInventory: false, deterministic: false, runs }, null, 2) + "\n");
  console.log(JSON.stringify({ origin: origin.label, calls: run.calls.map(({ status, rawCount, error }) => ({ status, rawCount, error })), source: run.source, off: run.off, coverage: run.coverage, error: run.error }));
}
globalThis.fetch = nativeFetch;
