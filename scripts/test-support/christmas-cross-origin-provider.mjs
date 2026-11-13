import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appModuleLoader } from "./load-app-module.mjs";

export const CHRISTMAS_CROSS_ORIGIN_PARK_ID = "date-night-osm-way-987588580";
export const CHRISTMAS_CROSS_ORIGIN_CINEMA_ID = "date-night-osm-node-9988776655";
export const CHRISTMAS_CROSS_ORIGIN_ORIGINS = {
  A: { lat: 37.1734644, lon: -94.3130247 },
  B: { lat: 37.1744644, lon: -94.3130247 },
};
const modes = new Set(["complete", "overflow-first", "overflow-last", "timeout", "stale-v3", "conflict-v3", "reviewed-v2"]);
const at = new Date("2026-12-05T18:00:00-06:00");

/** Execute the selected checkout's real search for every browser RPC. Only the
 * Overpass transport is synthetic. No search envelope, identity observation,
 * uncertainty, cache state or binding result is constructed by this helper.
 * Calls are serialized because the application's fetch dependency is global. */
export function createChristmasCrossOriginProvider(appRoot) {
  const root = resolve(appRoot), priorCwd = process.cwd();
  let searchDateNight, decorateDateNight, resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS;
  let buildChristmasPilotCandidate, isChristmasPilotChoice, DEFAULT_DATE_NIGHT_FILTERS;
  try {
    process.chdir(root);
    const load = appModuleLoader();
    ({ searchDateNight } = load(resolve(root, "src/lib/date-night/search.ts")));
    ({ decorateDateNight } = load(resolve(root, "src/lib/date-night/eligibility.ts")));
    ({ resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load(resolve(root, "src/lib/date-night/christmas-binding.ts")));
    ({ buildChristmasPilotCandidate, isChristmasPilotChoice } = load(resolve(root, "src/lib/date-night/christmas-pilot.ts")));
    ({ DEFAULT_DATE_NIGHT_FILTERS } = load(resolve(root, "src/lib/date-night/types.ts")));
  } finally { process.chdir(priorCwd); }

  const source = JSON.parse(readFileSync(new URL("./christmas-park-source.json", import.meta.url), "utf8"));
  const reviewed = source.element;
  assert.equal(reviewed.id, 987588580);
  assert.equal(reviewed.version, 2);
  assert.equal(reviewed.changeset, 189037687);
  const stale = { ...structuredClone(reviewed), version: 3, changeset: 189037688 };
  const school = { ...structuredClone(stale), tags: { ...stale.tags, amenity: "school" } };
  delete school.tags.leisure;
  const cinema = {
    type: "node", id: 9988776655, version: 1, changeset: 1,
    ...reviewed.center,
    tags: { name: "Fixture ordinary cinema", amenity: "cinema", opening_hours: "24/7",
      "addr:housenumber": "123", "addr:street": "Synthetic Test Street" },
  };
  const fillers = Array.from({ length: 19_998 }, (_, index) => ({
    type: "node", id: 10_000_000 + index, tags: { amenity: "school" },
  }));
  const duplicateOnlyBase = [...fillers, fillers[0], fillers[0]];
  assert.equal(duplicateOnlyBase.length + 1, 20_001);
  const records = [];
  let queue = Promise.resolve();

  async function execute({ data, mode }) {
    assert.ok(modes.has(mode), `Unsupported controlled provider mode: ${mode}`);
    assert.ok(Object.values(CHRISTMAS_CROSS_ORIGIN_ORIGINS).some(origin => origin.lat === data.lat && origin.lon === data.lon), "Use exact reviewed cross-origin controls");
    assert.equal(data.patchId, "radial-v1:core");
    assert.equal(data.radiusMiles, 15);
    assert.equal(data.spookySeasonEnabled, false);
    assert.ok(Array.isArray(data.activityTypes) && data.activityTypes.length > 0 &&
      data.activityTypes.every(type => type === "movies" || type === "park"), "Only Movies/Park ordinary provider categories are requested");
    assert.ok(records.length < 256, "Bounded browser provider receipt capacity exceeded");
    const calls = { culture: 0, outdoor: 0, unexpected: 0 };
    const attempts = [];
    const originalFetch = globalThis.fetch, originalWarn = console.warn;
    let response;
    try {
      // Expected controlled mirror failures are receipt data, not noisy logs.
      console.warn = () => {};
      globalThis.fetch = async (_url, init) => {
        const text = new URLSearchParams(init?.body).get("data");
        assert.ok(text, "The actual search supplies an Overpass query");
        const selected = text.split(")->.lifecycle_context;\n").at(-1);
        const culture = selected.includes('nwr["amenity"="cinema"](around:');
        const outdoor = selected.includes('nwr["leisure"="park"](around:');
        const group = culture ? "culture" : outdoor ? "outdoor" : "unexpected";
        calls[group] += 1;
        assert.notEqual(group, "unexpected", "The fixture must not silently succeed for an unexpected provider group");
        if (culture && mode === "timeout") {
          attempts.push({ group, result: "synthetic-timeout", elements: null });
          const error = new Error("Controlled provider timeout; no response source facts acquired");
          error.name = "TimeoutError";
          throw error;
        }
        const elements = outdoor ? [reviewed] : mode === "overflow-first" ? [school, ...duplicateOnlyBase]
          : mode === "overflow-last" ? [...duplicateOnlyBase, school]
          // Recovery packets are exactly Astra's one/two/one park observations.
          // The ordinary cinema exists only in the complete seed response.
          : mode === "stale-v3" ? [stale]
          : mode === "conflict-v3" ? [reviewed, school]
          : mode === "reviewed-v2" ? [reviewed] : [cinema];
        attempts.push({ group, result: "packet", elements: elements.length });
        return { ok: true, json: async () => ({ elements: structuredClone(elements) }) };
      };
      response = await searchDateNight({ data: structuredClone(data) });
    } finally {
      globalThis.fetch = originalFetch;
      console.warn = originalWarn;
    }
    const expectedCulture = data.activityTypes.includes("movies") ? ["overflow-first", "overflow-last", "timeout"].includes(mode) ? 4 : 1 : 0;
    assert.equal(calls.culture, expectedCulture, "Winning/failed culture mirrors remain isolated");
    assert.equal(calls.outdoor, data.activityTypes.includes("park") ? 1 : 0, "Recovery requests only missing provider categories");
    assert.equal(calls.unexpected, 0);
    const venues = decorateDateNight(response.venues, data, at);
    const binding = resolveChristmasParkBinding(venues, REVIEWED_CHRISTMAS_BINDINGS);
    const publicCandidate = buildChristmasPilotCandidate({
      venues, location: { lat: data.lat, lon: data.lon, label: "Synthetic provider browser origin", source: "manual" },
      filters: { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15, activityTypes: ["movies", "park"], openNowOnly: false, reduceParks: false },
      selectedCategories: ["christmas-lights"], now: at, homeMode: "date-night", christmasEnabled: true, halloweenActive: false,
    });
    const eligibleSchools = response.venues.filter(venue => venue.activityTypes.includes("school") || venue.id.startsWith("date-night-osm-node-10"));
    const publicEventCount = publicCandidate.choices.filter(isChristmasPilotChoice).length;
    assert.equal(eligibleSchools.length, 0, "Synthetic school observations never become ordinary choices");
    assert.equal(publicEventCount, 0, "All public attraction HOLD flags remain effective");
    const record = {
      mode, query: structuredClone(data), calls, attempts, at: at.toISOString(),
      responseBinding: binding.state, retainedParkCount: response.venues.filter(venue => venue.id === CHRISTMAS_CROSS_ORIGIN_PARK_ID).length,
      cinemaCount: response.venues.filter(venue => venue.id === CHRISTMAS_CROSS_ORIGIN_CINEMA_ID).length,
      parkObservations: response.identityObservations?.filter(item => item.id === CHRISTMAS_CROSS_ORIGIN_PARK_ID).map(item => ({
        id: item.id, version: item.sourceIdentity?.version, changeset: item.sourceIdentity?.changeset, classification: item.sourceIdentity?.classification,
      })) ?? [],
      discovery: structuredClone(response.discovery), eligibleSchoolCount: eligibleSchools.length, publicEventCount,
    };
    records.push(record);
    return { response, record: structuredClone(record) };
  }

  return {
    appRoot: root,
    sourceProvenance: source.provenance,
    get records() { return structuredClone(records); },
    run(input) {
      const next = queue.then(() => execute(input));
      queue = next.then(() => undefined, () => undefined);
      return next;
    },
  };
}
