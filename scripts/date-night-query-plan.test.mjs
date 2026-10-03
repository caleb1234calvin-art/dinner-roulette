import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const {
  buildDateNightQueryPlan,
  buildDateNightQuery,
  normalizeDateNightActivityTypes,
  validateDateNightActivityTypes,
} = load("src/lib/date-night/query-plan.ts");
const { seasonalTypes } = load("src/lib/date-night/provider-evidence.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");

const seasonal = ["haunted-house", "corn-maze", "pumpkin-patch"];
const ordinary = ["bowling", "arcade", "movies", "mini-golf", "escape-room", "park", "museum", "skating"];
const origin = { lat: 37.176447, lon: -94.310223 };
const now = new Date(2026, 9, 10, 20);
const queryFor = (activityTypes, active = true) =>
  buildDateNightQuery({ activityTypes: normalizeDateNightActivityTypes(activityTypes, active) }, origin.lat, origin.lon, 80_467);
const sorted = (items) => [...items].sort();
const ids = (plan) => plan.map((group) => group.id);

// Interpret only the server-owned predicate grammar used by this query builder.
// This lets reachability tests prove that a real positive fixture is acquired,
// without relying on an Overpass service or merely searching query substrings.
function acquisitionClauses(query) {
  return query.split("\n").map((line) => line.trim()).filter((line) => line.startsWith("nwr"));
}

function acquired(query, tags) {
  return acquisitionClauses(query).some((line) => {
    const selectors = line.slice(3, line.indexOf("(around:"));
    const parsed = [...selectors.matchAll(/\[(~?"(?:\\.|[^"\\])*")(=|~)("(?:\\.|[^"\\])*")(,i)?\]/g)];
    assert.ok(parsed.length, `Expected whitelisted predicates: ${line}`);
    assert.equal(parsed.map((match) => match[0]).join(""), selectors, `Unrecognized predicate grammar: ${line}`);
    return parsed.every(([, rawKey, operation, rawValue, ignoreCase]) => {
      const keyPattern = rawKey.startsWith("~");
      const key = JSON.parse(keyPattern ? rawKey.slice(1) : rawKey);
      const value = JSON.parse(rawValue);
      const candidates = keyPattern
        ? Object.entries(tags).filter(([candidate]) => new RegExp(key).test(candidate)).map(([, candidate]) => candidate)
        : Object.hasOwn(tags, key) ? [tags[key]] : [];
      return candidates.some((candidate) => operation === "="
        ? candidate === value
        : new RegExp(value, ignoreCase ? "i" : "").test(candidate));
    });
  });
}

test("Anything, omitted and empty category input produce all and only active query groups", () => {
  for (const input of [undefined, [], ["anything"], ["movies", "anything"]]) {
    const active = buildDateNightQueryPlan(input, true);
    assert.deepEqual(ids(active), ["seasonal", "entertainment", "culture", "outdoor"]);
    assert.deepEqual(sorted(active.flatMap((group) => group.activityTypes)), sorted([...ordinary, ...seasonal]));
    const inactive = buildDateNightQueryPlan(input, false);
    assert.deepEqual(ids(inactive), ["entertainment", "culture", "outdoor"]);
    assert.deepEqual(sorted(inactive.flatMap((group) => group.activityTypes)), sorted(ordinary));
    assert.equal(new Set(active.flatMap((group) => group.activityTypes)).size, ordinary.length + seasonal.length);
  }
});

test("specific categories plan only required groups and combine selected siblings", () => {
  for (const type of seasonal) {
    const plan = buildDateNightQueryPlan([type], true);
    assert.deepEqual(ids(plan), ["seasonal"]);
    assert.deepEqual(plan[0].activityTypes, [type]);
  }
  assert.deepEqual(ids(buildDateNightQueryPlan(["movies"], true)), ["culture"]);
  const culture = buildDateNightQueryPlan(["museum", "movies"], true);
  assert.deepEqual(ids(culture), ["culture"]);
  assert.deepEqual(sorted(culture[0].activityTypes), ["movies", "museum"]);
  const mixed = buildDateNightQueryPlan(["movies", "haunted-house"], true);
  assert.deepEqual(ids(mixed), ["seasonal", "culture"]);
  assert.deepEqual(sorted(mixed.flatMap((group) => group.activityTypes)), ["haunted-house", "movies"]);
});

test("query plans and normalized coverage signatures are deterministic without mutating caller input", () => {
  const first = Object.freeze(["museum", "corn-maze", "movies", "corn-maze"]);
  const second = ["movies", "corn-maze", "museum"];
  assert.deepEqual(buildDateNightQueryPlan(first, true), buildDateNightQueryPlan(second, true));
  assert.deepEqual(normalizeDateNightActivityTypes(first, true), normalizeDateNightActivityTypes(second, true));
  assert.deepEqual(first, ["museum", "corn-maze", "movies", "corn-maze"]);
  assert.deepEqual(normalizeDateNightActivityTypes(["anything", "movies"], true), normalizeDateNightActivityTypes(undefined, true));
});

test("Halloween OFF strips stale seasonal selections and preserves existing Anything fallback", () => {
  assert.deepEqual(normalizeDateNightActivityTypes(["haunted-house", "movies"], false), ["movies"]);
  assert.deepEqual(ids(buildDateNightQueryPlan(["haunted-house", "movies"], false)), ["culture"]);
  assert.deepEqual(sorted(normalizeDateNightActivityTypes(seasonal, false)), sorted(ordinary));
  assert.deepEqual(ids(buildDateNightQueryPlan(seasonal, false)), ["entertainment", "culture", "outdoor"]);
  const query = queryFor(seasonal, false);
  assert.doesNotMatch(query, /haunted|pumpkin|corn|maize|theme_park|seasonal:/);
});

test("activity validation rejects malformed, inherited, unknown and query-injection inputs", () => {
  const inherited = new Array(1);
  Object.setPrototypeOf(inherited, { 0: "movies" });
  const invalid = [
    null, "movies", true, 1, {}, { 0: "movies", length: 1 },
    Object.create({ 0: "movies", length: 1 }), inherited, new Array(1),
    [undefined], [null], [1], [{}], [["movies"]],
    ["__proto__"], ["constructor"], ["toString"], ["MOVIES"], [" movies "],
    ["movies", '"];out;node(0,0,90,180);out;//'],
    Array(1_000).fill("movies"),
  ];
  for (const input of invalid) {
    assert.throws(() => validateDateNightActivityTypes(input));
    assert.throws(() => buildDateNightQueryPlan(input, true));
    assert.throws(() => buildDateNightQueryPlan(input, false));
  }
  assert.deepEqual(validateDateNightActivityTypes(undefined), ["anything"]);
  assert.deepEqual(validateDateNightActivityTypes([]), ["anything"]);
  assert.deepEqual(validateDateNightActivityTypes(["movies"]), ["movies"]);
});

test("every ordinary category owns its exact active clauses and only relevant lifecycle companions", () => {
  const expected = {
    bowling: ['["leisure"="bowling_alley"]'],
    arcade: ['["leisure"="amusement_arcade"]'],
    movies: ['["amenity"="cinema"]'],
    "mini-golf": ['["leisure"="miniature_golf"]'],
    "escape-room": ['["leisure"="escape_game"]'],
    park: ['["leisure"="park"]'],
    museum: ['["tourism"="museum"]'],
    skating: ['["leisure"="ice_rink"]', '["sport"="roller_skating"]'],
  };
  for (const [type, clauses] of Object.entries(expected)) {
    const query = queryFor([type]);
    const activeClauses = acquisitionClauses(query).filter((line) => !line.startsWith("nwr[~"));
    assert.deepEqual(sorted(activeClauses), sorted(clauses.map((clause) => `nwr${clause}(around:80467,37.176447,-94.310223);`)), type);
    assert.match(query, /\[out:json\]\[timeout:20\]/);
    assert.match(query, /out center tags;/);
    assert.doesNotMatch(query, /haunted|pumpkin|corn|maize|seasonal:|theme_park/);
    for (const [candidateType, candidateClauses] of Object.entries(expected)) {
      for (const clause of candidateClauses) {
        const [, key, value] = clause.match(/^\["([^"]+)"="([^"]+)"\]$/);
        for (const prefix of ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"]) {
          // The preserved normalizer reconstructs these four keys, not sport.
          const expectedAcquisition = candidateType === type && key !== "sport";
          assert.equal(acquired(query, { [`${prefix}:${key}`]: value }), expectedAcquisition, `${type}/${prefix}:${key}=${value}`);
        }
      }
    }
  }
});

test("query construction independently enforces concrete whitelist input, finite coordinates and capped radius", () => {
  const group = { activityTypes: ["movies"] };
  for (const [lat, lon] of [[NaN, 0], [Infinity, 0], [91, 0], [0, 181], ['0);out;node(0,0,90,180)', 0]]) {
    assert.throws(() => buildDateNightQuery(group, lat, lon, 80_467));
  }
  for (const radius of [0, -1, Infinity, NaN, "80467"]) {
    assert.throws(() => buildDateNightQuery(group, origin.lat, origin.lon, radius));
  }
  for (const activityTypes of [["anything"], [], ["constructor"], ['"];out;node(0,0,90,180);out;//']]) {
    assert.throws(() => buildDateNightQuery({ activityTypes }, origin.lat, origin.lon, 80_467));
  }
  assert.match(buildDateNightQuery(group, origin.lat, origin.lon, 999_999), /around:80467,/);
});

test("seasonal-only queries do not acquire unrelated ordinary or seasonal offerings", () => {
  const unrelatedOrdinary = [
    { leisure: "bowling_alley" }, { leisure: "amusement_arcade" }, { amenity: "cinema" },
    { leisure: "miniature_golf" }, { leisure: "escape_game" }, { tourism: "museum" },
    { leisure: "ice_rink" }, { sport: "roller_skating" }, { leisure: "park" },
  ];
  const offerings = {
    "haunted-house": { attraction: "haunted_house" },
    "corn-maze": { attraction: "corn_maze" },
    "pumpkin-patch": { attraction: "pumpkin_patch" },
  };
  for (const type of seasonal) {
    const query = queryFor([type]);
    for (const tags of unrelatedOrdinary) assert.equal(acquired(query, tags), false, `${type}: ${JSON.stringify(tags)}`);
    for (const [offering, tags] of Object.entries(offerings)) assert.equal(acquired(query, tags), offering === type, `${type}/${offering}`);
    assert.equal(acquired(query, { leisure: "park", description: `${type === "haunted-house" ? "haunted house" : type === "corn-maze" ? "corn maze" : "pumpkin patch"}` }), true);
  }
});

test("precise seasonal attraction and agricultural maze representations remain reachable", () => {
  const fixtures = [
    ["haunted-house", { attraction: "haunted_house" }],
    ["haunted-house", { attraction: "haunted_trail" }],
    ["haunted-house", { attraction: "haunted_forest" }],
    ["haunted-house", { attraction: "haunted_attraction" }],
    ["corn-maze", { attraction: "corn_maze" }],
    ["corn-maze", { attraction: "maize_maze" }],
    ["pumpkin-patch", { attraction: "pumpkin_patch" }],
  ];
  for (const context of [{ leisure: "maze" }, { attraction: "maze" }]) {
    for (const field of ["maze:type", "crop"]) {
      for (const value of ["corn", "maize"]) fixtures.push(["corn-maze", { ...context, [field]: value }]);
    }
  }
  for (const [type, tags] of fixtures) {
    assert.ok(seasonalTypes(tags).includes(type));
    assert.equal(acquired(queryFor([type]), tags), true, JSON.stringify(tags));
  }
});

test("selected seasonal metadata remains reachable across every supported context, field and separator", () => {
  const contexts = [
    { leisure: "maze" }, { attraction: "maze" }, { tourism: "theme_park" },
    { tourism: "attraction" }, { tourism: "farm" }, { leisure: "park" },
    { landuse: "farmyard" }, { landuse: "farmland" },
  ];
  const words = {
    "haunted-house": ["haunted house", "HAUNTED___TRAIL", "Haunted--Forest", "haunted  attraction"],
    "corn-maze": ["corn maze", "MAIZE___MAZE", "Corn--Maze", "maize  maze"],
    "pumpkin-patch": ["pumpkin patch", "PUMPKIN___PICKING", "Pumpkin--Patch", "pumpkin  picking"],
  };
  for (const [type, phrases] of Object.entries(words)) {
    const query = queryFor([type]);
    for (const context of contexts) {
      for (const field of ["name", "description", "seasonal:description", "seasonal:activities"]) {
        for (const phrase of phrases) {
          const tags = { ...context, [field]: phrase };
          assert.ok(seasonalTypes(tags).includes(type), JSON.stringify(tags));
          assert.equal(acquired(query, tags), true, `${type}: ${JSON.stringify(tags)}`);
        }
      }
    }
  }
});

test("retained Exeter theme-park record remains acquired by a Corn Maze-only plan", () => {
  const raw = JSON.parse(fs.readFileSync("audit/seasonal-discovery-coverage-audit-1-evidence/exeter-osm-node.json", "utf8")).response.elements[0];
  assert.equal(raw.tags.tourism, "theme_park");
  assert.equal(acquired(queryFor(["corn-maze"]), raw.tags), true);
  assert.deepEqual(seasonalTypes(raw.tags), ["corn-maze"]);
  assert.doesNotMatch(queryFor(["corn-maze"]), /Exeter/);
});

test("narrowed seasonal acquisition retains lifecycle-only evidence previously reached through broad contexts", () => {
  for (const prefix of ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"]) {
    for (const [type, attraction] of [["haunted-house", "haunted_house"], ["corn-maze", "corn_maze"], ["pumpkin-patch", "pumpkin_patch"]]) {
      for (const context of [{ tourism: "theme_park" }, { leisure: "maze" }]) {
        const tags = { name: "Harvest Activity", ...context, [`${prefix}:attraction`]: attraction };
        assert.equal(acquired(queryFor([type]), tags), true, `${type}: ${JSON.stringify(tags)}`);
      }
    }
    for (const key of ["leisure", "attraction"]) {
      const tags = { name: "Harvest Activity", tourism: "theme_park", [`${prefix}:${key}`]: "maze", crop: "corn" };
      assert.equal(acquired(queryFor(["corn-maze"]), tags), true, JSON.stringify(tags));
    }
  }
});

test("real selected query cannot resurrect an active duplicate by dropping its lifecycle-only theme-park record", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: now.getTime() });
  const location = { lat: 43.65348, lon: -79.38393, label: "Toronto", source: "manual" };
  const elements = [
    { type: "node", id: 1, lat: location.lat, lon: location.lon, tags: { name: "Harvest Activity", attraction: "haunted_house" } },
    { type: "way", id: 2, lat: location.lat, lon: location.lon, tags: { name: "Harvest Activity", tourism: "theme_park", "disused:attraction": "haunted_house" } },
  ];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const query = new URLSearchParams(options.body).get("data");
    return Response.json({ elements: elements.filter((element) => acquired(query, element.tags)) });
  });
  const result = await searchDateNight({ data: { ...location, radiusMiles: 50, spookySeasonEnabled: true, activityTypes: ["haunted-house"] } });
  assert.equal(result.venues.length, 1);
  assert.equal(result.venues[0].lifecycle, "disused");
  assert.equal(result.venues[0].discoveryEvidence.length, 2);
  const pool = eligibleDateNight(decorateDateNight(result.venues, location, now), {
    ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes: ["haunted-house"], openNowOnly: false,
  }, true);
  assert.deepEqual(pool, []);
});

test("narrowed acquisition never turns generic, negative or unrelated evidence into seasonal classification", () => {
  const negatives = [
    { name: "Turtle Moon Labyrinth", attraction: "maze" },
    { leisure: "maze", description: "Meditation labyrinth" },
    { leisure: "maze", name: "Hedge Maze" },
    { tourism: "theme_park" }, { landuse: "farmland", crop: "pumpkin" },
    { tourism: "farm", description: "Former corn maze, no pumpkin patch" },
    { tourism: "attraction", name: "Closed Haunted House" },
    { tourism: "farm", description: "Hedge corn maze" },
    { shop: "farm", name: "Pumpkin Patch Shop" },
    { amenity: "restaurant", name: "Haunted House Pizza" },
  ];
  for (const tags of negatives) {
    assert.deepEqual(seasonalTypes(tags), [], JSON.stringify(tags));
    // Some broad structural/context predicates may intentionally acquire a
    // negative fixture; the unchanged affirmative classifier remains decisive.
    for (const type of seasonal) {
      if (acquired(queryFor([type]), tags)) assert.equal(seasonalTypes(tags).includes(type), false);
    }
  }
});

test("real server validator rejects hostile category input before any provider request", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: now.getTime() });
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ elements: [] }));
  for (const activityTypes of [null, "movies", {}, ["constructor"], ["movies", '"];out;node(0,0,90,180);out;//']]) {
    await assert.rejects(searchDateNight({ data: { ...origin, radiusMiles: 15, spookySeasonEnabled: true, activityTypes } }));
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("real server request uses validated selected clauses, normalizes inactive seasonal input and preserves radius cap", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: now.getTime() });
  const queries = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    queries.push(new URLSearchParams(options.body).get("data"));
    return Response.json({ elements: [] });
  });
  for (const [activityTypes, spookySeasonEnabled, expectedTypes] of [
    [["movies"], true, ["movies"]],
    [["haunted-house"], true, ["haunted-house"]],
    [["haunted-house", "movies"], false, ["movies"]],
  ]) {
    queries.length = 0;
    await searchDateNight({ data: { ...origin, radiusMiles: 500, spookySeasonEnabled, activityTypes } });
    assert.ok(queries.length > 0);
    const expected = queryFor(expectedTypes, spookySeasonEnabled);
    for (const query of queries) {
      assert.deepEqual(acquisitionClauses(query), acquisitionClauses(expected));
      assert.match(query, /around:80467,37\.176447,-94\.310223/);
      assert.doesNotMatch(query, /around:804670/);
    }
  }
});
