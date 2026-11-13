import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appModuleLoader } from "./load-app-module.mjs";

/** Produce browser transport fixtures by executing the selected checkout's real
 * provider search. The only replacement is the deterministic Overpass network
 * response; no uncertainty field or definitive negative is manufactured here.
 * Call before starting browser servers: the temporary fetch override is local
 * to this sequential setup and is restored before the helper returns. */
export async function buildChristmasProviderLossReplay(appRoot) {
  const previousCwd = process.cwd(), originalFetch = globalThis.fetch, originalWarn = console.warn;
  const root = resolve(appRoot);
  const recorded = JSON.parse(readFileSync(new URL("./christmas-park-source.json", import.meta.url), "utf8"));
  const reviewed = recorded.element, parkId = "date-night-osm-way-987588580";
  const school = { ...structuredClone(reviewed), version: 3, changeset: 189037688,
    tags: { ...reviewed.tags, amenity: "school" } };
  delete school.tags.leisure;
  const fillers = Array.from({ length: 19_998 }, (_, index) => ({
    type: "node", id: 10_000_000 + index, tags: { amenity: "school" },
  }));
  const full = [...fillers, fillers[0], school];
  const oversized = [...fillers, fillers[0], fillers[0]];
  assert.equal(full.length, 20_000);
  assert.equal(oversized.length + 1, 20_001);
  const query = { lat: reviewed.center.lat, lon: reviewed.center.lon, radiusMiles: 15,
    activityTypes: ["anything"], spookySeasonEnabled: false, patchId: "radial-v1:core" };
  const responses = {}, replays = [];
  try {
    process.chdir(root);
    const load = appModuleLoader();
    const { searchDateNight } = load(resolve(root, "src/lib/date-night/search.ts"));
    const { decorateDateNight } = load(resolve(root, "src/lib/date-night/eligibility.ts"));
    const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load(resolve(root, "src/lib/date-night/christmas-binding.ts"));
    console.warn = () => {};
    for (const mode of ["complete", "exact-limit", "oversized-first", "oversized-last", "exhausted", "complete-culture"]) {
      // A same-query radial retry asks only for categories still uncovered.
      // Execute that exact smaller acquisition for recovery, with the reviewed
      // v2 object as fresh context evidence in the successful culture packet.
      const acquisition = mode === "complete-culture" ? { ...query, activityTypes: ["movies", "museum"] } : query;
      const calls = { culture: 0, outdoor: 0, entertainment: 0 };
      globalThis.fetch = async (_url, init) => {
        const selected = new URLSearchParams(init.body).get("data").split(")->.lifecycle_context;\n").at(-1);
        const culture = selected.includes('nwr["amenity"="cinema"](around:');
        const outdoor = selected.includes('nwr["leisure"="park"](around:');
        calls[culture ? "culture" : outdoor ? "outdoor" : "entertainment"] += 1;
        if (culture && mode === "exhausted") throw new Error("Controlled exhausted culture mirrors");
        const elements = !culture ? outdoor ? [reviewed] : [] : mode === "complete-culture" ? [reviewed] : mode === "complete" ? [] : mode === "exact-limit" ? full :
          mode === "oversized-first" ? [school, ...oversized] : [...oversized, school];
        return { ok: true, json: async () => ({ elements }) };
      };
      const response = await searchDateNight({ data: acquisition });
      assert.equal(calls.outdoor, mode === "complete-culture" ? 0 : 1, "Only requested provider groups run");
      assert.equal(calls.entertainment, mode === "complete-culture" ? 0 : 1, "Only requested provider groups run");
      assert.equal(calls.culture, ["complete", "exact-limit", "complete-culture"].includes(mode) ? 1 : 4);
      const park = response.venues.filter(venue => venue.id === parkId);
      assert.equal(park.length, 1, "Each replay retains reviewed v2 park evidence; there is no empty-pool retirement");
      assert.equal(response.venues.some(venue => venue.activityTypes.includes("school")), false);
      const binding = resolveChristmasParkBinding(decorateDateNight(response.venues, reviewed.center), REVIEWED_CHRISTMAS_BINDINGS);
      if (mode === "complete" || mode === "complete-culture") assert.equal(binding.state, "bound");
      if (mode === "exact-limit") assert.equal(binding.state, "conflicting-source");
      replays.push({ mode, query: acquisition, calls, culturePacketElements: mode === "complete-culture" ? 1 : mode === "complete" ? 0 : mode === "exact-limit" ? 20_000 : mode === "exhausted" ? null : 20_001,
        binding: binding.state, retainedParkCount: park.length, schoolSelectable: false });
      // Exact-limit is a setup control, not a large browser payload. Only the
      // reviewed park is needed on screen; its source facts remain unmodified.
      if (mode !== "exact-limit") responses[mode] = { ...response, venues: park };
    }
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    process.chdir(previousCwd);
  }
  return { responses, provenance: { appRoot: root, query, replays,
    scope: "Real selected-checkout search and binding. Synthetic provider packets; no live request. Browser fixtures add a separately identified ordinary cinema control." } };
}
