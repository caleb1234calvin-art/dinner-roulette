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
const { seasonalTypes, providerLifecycle } = load("src/lib/date-night/provider-evidence.ts");
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

import { acquisitionClauses, affirmativeClauses, acquired } from "./test-support/date-night-query-evaluator.mjs";

// Frozen pre-refinement predicate control from checkpoint 9f90f689. This is
// intentionally independent of the current builder: compare semantic reachability
// while changing regex keys into finite, exact-key alternatives and evaluating
// prose against a named, bounded set of the same supported contexts.
function previousSeasonalQuery(selected) {
  const selectors = {
    "haunted-house": { values: "haunted_house|haunted_trail|haunted_forest|haunted_attraction", words: "haunted[ _-]+(house|trail|forest|attraction)" },
    "corn-maze": { values: "corn_maze|maize_maze", words: "(corn|maize)[ _-]+maze" },
    "pumpkin-patch": { values: "pumpkin_patch", words: "pumpkin[ _-]+(patch|picking)" },
  };
  const contexts = [
    '["leisure"="maze"]', '["attraction"="maze"]', '["tourism"="theme_park"]',
    '["tourism"~"^(attraction|farm)$"]', '["leisure"="park"]', '["landuse"~"^(farmyard|farmland)$"]',
  ];
  const lifecycle = {
    "haunted-house": [["attraction", selectors["haunted-house"].values]],
    "corn-maze": [["attraction", "corn_maze|maize_maze|maze"], ["leisure", "maze"]],
    "pumpkin-patch": [["attraction", "pumpkin_patch"]],
  };
  const clauses = [
    `["attraction"~"^(${selected.map((type) => selectors[type].values).join("|")})$"]`,
    ...(selected.includes("corn-maze") ? ['["leisure"="maze"]', '["attraction"="maze"]'].flatMap((maze) =>
      [`${maze}["maze:type"~"^(corn|maize)$"]`, `${maze}["crop"~"^(corn|maize)$"]`]) : []),
    ...contexts.map((context) => `${context}[~"^(name|description|seasonal:description|seasonal:activities)$"~"${selected.map((type) => selectors[type].words).join("|")}",i]`),
    ...selected.flatMap((type) => lifecycle[type]).map(([key, values]) =>
      `[~"^(disused|abandoned|was|demolished|removed|razed|destroyed):${key}$"~"^(${values})$"]`),
  ];
  return `[out:json][timeout:20];\n(\n${clauses.map((clause) => `nwr${clause}(around:80467,37.176447,-94.310223);`).join("\n")}\n);\nout center tags;`;
}

function classifiedAcquisition(query, rawTags) {
  if (!acquired(query, rawTags)) return null;
  const tags = { ...rawTags };
  for (const [key, value] of Object.entries(rawTags)) {
    const match = key.match(/^(disused|abandoned|was|demolished|removed|razed|destroyed):(leisure|tourism|attraction|amenity)$/);
    if (match && !tags[match[2]]) tags[match[2]] = value;
  }
  return { activityTypes: seasonalTypes(tags), lifecycle: providerLifecycle(rawTags) };
}

test("all Date Night database selectors use exact keys; lifecycle regex keys are bounded to a named set", () => {
  const selections = [["anything"], ...ordinary.map((type) => [type])];
  for (let mask = 1; mask < 8; mask++) selections.push(seasonal.filter((_, index) => mask & (1 << index)));
  for (const selected of selections) {
    const query = queryFor(selected);
    assert.ok(acquisitionClauses(query).filter((line) => line.includes("[~")).every((line) => line.startsWith("nwr.lifecycle_context[")));
    assert.match(query, /\[timeout:20\]/);
    assert.ok(acquisitionClauses(query).every((line) => /^nwr\.(seasonal|lifecycle)_context\[/.test(line) || line.endsWith("(around:80467,37.176447,-94.310223);")));
  }
  assert.equal(acquisitionClauses(queryFor(["haunted-house"])).length, 49);
  assert.equal(acquisitionClauses(queryFor(seasonal)).length, 53);
});

test("all 6167 canonical fixtures preserve selected positive semantics and broad identity-negative lifecycle acquisition", () => {
  const contexts = [
    { leisure: "maze" }, { attraction: "maze" }, { tourism: "theme_park" },
    { tourism: "attraction" }, { tourism: "farm" }, { leisure: "park" },
    { landuse: "farmyard" }, { landuse: "farmland" },
  ];
  const words = ["haunted house", "HAUNTED___TRAIL", "Haunted--Forest", "haunted  attraction",
    "corn maze", "MAIZE___MAZE", "Corn--Maze", "maize  maze", "pumpkin patch", "PUMPKIN___PICKING", "Pumpkin--Patch", "pumpkin  picking"];
  const fixtures = contexts.flatMap((context) =>
    ["name", "description", "seasonal:description", "seasonal:activities"].flatMap((field) =>
      words.map((word) => ({ name: "Activity fixture", ...context, [field]: word }))));
  for (const attraction of ["haunted_house", "haunted_trail", "haunted_forest", "haunted_attraction", "corn_maze", "maize_maze", "pumpkin_patch"]) {
    fixtures.push({ name: "Activity fixture", attraction });
    for (const prefix of ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"]) {
      for (const context of contexts) fixtures.push({ name: "Activity fixture", ...context, [`${prefix}:attraction`]: attraction });
    }
  }
  for (const prefix of ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"]) {
    for (const key of ["leisure", "attraction"]) {
      for (const field of ["crop", "maze:type"]) {
        for (const value of ["corn", "maize"]) fixtures.push({ name: "Activity fixture", [`${prefix}:${key}`]: "maze", [field]: value });
      }
    }
  }
  for (const context of contexts) {
    for (const description of ["Former corn maze, no pumpkin patch", "Hedge corn maze", "No haunted house", "Unrelated attraction", ""]) {
      fixtures.push({ name: "Activity fixture", ...context, description });
    }
  }
  fixtures.push({ name: "Haunted House Pizza", amenity: "restaurant" }, { name: "Pumpkin Patch Shop", shop: "farm" });
  let compared = 0, expandedNegative = 0;
  for (let mask = 1; mask < 8; mask++) {
    const selected = seasonal.filter((_, index) => mask & (1 << index));
    const current = queryFor(selected), previous = previousSeasonalQuery(selected);
    for (const tags of fixtures) {
      const selectedControl = classifiedAcquisition(previous, tags);
      // V-DR-01 intentionally broadens negative reachability, not positives.
      // The frozen all-seasonal query is an independent oracle for companions;
      // every non-lifecycle fixture retains its exact selected-query expectation.
      const expected = providerLifecycle(tags)
        ? classifiedAcquisition(previousSeasonalQuery(seasonal), tags)
        : selectedControl;
      assert.deepEqual(classifiedAcquisition(current, tags), expected, `${selected}: ${JSON.stringify(tags)}`);
      if (!selectedControl && expected) expandedNegative++;
      compared++;
    }
  }
  assert.equal(compared, 6167, "Retain the complete frozen-control equivalence matrix");
  assert.ok(expandedNegative > 0, "The matrix must exercise newly reachable lifecycle evidence");
});

test("bounded context preselection never leaks generic places into seasonal output", () => {
  const contexts = [
    { leisure: "maze" }, { attraction: "maze" }, { tourism: "theme_park" },
    { tourism: "attraction" }, { tourism: "farm" }, { leisure: "park" },
    { landuse: "farmyard" }, { landuse: "farmland" },
  ];
  for (const selected of [["haunted-house"], ["corn-maze"], ["pumpkin-patch"], seasonal]) {
    const query = queryFor(selected);
    assert.equal(query.match(/\)->\.seasonal_context;/g)?.length, 1);
    assert.equal(acquisitionClauses(query).filter((line) => line.startsWith("nwr.seasonal_context[")).length, 4);
    assert.doesNotMatch(query, /nwr\(around:/, "Never materialize all map elements in the radius");
    for (const context of contexts) {
      assert.equal(acquired(query, { name: "Ordinary venue", ...context }), false);
      assert.equal(acquired(query, { name: "Ordinary venue", ...context, "name:en": "Haunted House Corn Maze Pumpkin Patch" }), false);
    }
    for (const context of [{ tourism: "museum" }, { amenity: "restaurant" }, { shop: "farm" }, {}]) {
      assert.equal(acquired(query, { ...context, name: "Haunted House Corn Maze Pumpkin Patch" }), false, "Prose still requires a supported context");
    }
  }
});

test("precise and lifecycle selectors stay independent of the active context set", () => {
  for (const [type, attraction] of [["haunted-house", "haunted_house"], ["corn-maze", "corn_maze"], ["pumpkin-patch", "pumpkin_patch"]]) {
    const query = queryFor([type]);
    assert.equal(acquired(query, { name: "Field activity", attraction }), true);
    for (const prefix of ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"]) {
      const tags = { name: "Field activity", [`${prefix}:attraction`]: attraction };
      assert.equal(acquired(query, tags), true);
      assert.deepEqual(classifiedAcquisition(query, tags), classifiedAcquisition(previousSeasonalQuery([type]), tags));
    }
  }
});

test("query fixture interpreter rejects missing/unknown sets, unbounded selectors and unexpected output grammar", () => {
  const query = queryFor(["haunted-house"]);
  const mutations = [
    query.replaceAll("nwr.seasonal_context", "nwr.untrusted"),
    query.replace(/\n\([\s\S]*?\)->\.seasonal_context;\n/, "\n"),
    query.replace('(around:80467,37.176447,-94.310223)', ""),
    query.replace("out center tags;", ".seasonal_context out center tags;"),
    query.replace("nwr.seasonal_context", "nwr"),
    query.replaceAll("nwr.lifecycle_context", "nwr.untrusted"),
    query.replace(/\n\([\s\S]*?\)->\.lifecycle_context;\n/, "\n"),
    query.replace("out center tags;", ".lifecycle_context out center tags;"),
    query.replace("out center tags;", "out center tags;\nout center tags;"),
  ];
  for (const mutation of mutations) assert.throws(() => acquired(mutation, { tourism: "farm", name: "Haunted House" }));
});

test("exact text keys preserve classifier key casing while still matching case-insensitive values", () => {
  for (const field of ["Name", "DESCRIPTION", "Seasonal:Description", "Seasonal:Activities"]) {
    const tags = { name: "Activity fixture", tourism: "farm", [field]: "HAUNTED HOUSE, CORN MAZE, PUMPKIN PATCH" };
    assert.equal(acquired(previousSeasonalQuery(seasonal), tags), true, "old key-regex also matched noncanonical uppercase keys");
    assert.equal(acquired(queryFor(seasonal), tags), false);
    assert.deepEqual(seasonalTypes(tags), [], "the unchanged classifier never accepted those noncanonical keys");
  }
  for (const field of ["name", "description", "seasonal:description", "seasonal:activities"]) {
    const tags = { name: "Activity fixture", tourism: "farm", [field]: "HAUNTED HOUSE, CORN MAZE, PUMPKIN PATCH" };
    assert.equal(acquired(queryFor(seasonal), tags), true);
    assert.deepEqual(seasonalTypes(tags), sorted(seasonal));
  }
});

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
  assert.doesNotMatch(affirmativeClauses(query).join("\n"), /haunted|pumpkin|corn|maize|theme_park|seasonal:/);
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

test("every ordinary category owns exact active clauses and shares supported identity-negative companions", () => {
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
    const activeClauses = affirmativeClauses(query);
    assert.deepEqual(sorted(activeClauses), sorted(clauses.map((clause) => `nwr${clause}(around:80467,37.176447,-94.310223);`)), type);
    assert.match(query, /\[out:json\]\[timeout:20\]/);
    assert.match(query, /out center tags;/);
    assert.doesNotMatch(activeClauses.join("\n"), /haunted|pumpkin|corn|maize|seasonal:|theme_park/);
    for (const candidateClauses of Object.values(expected)) {
      for (const clause of candidateClauses) {
        const [, key, value] = clause.match(/^\["([^"]+)"="([^"]+)"\]$/);
        for (const prefix of ["disused", "abandoned", "was", "demolished", "removed", "razed", "destroyed"]) {
          // The preserved normalizer reconstructs these four keys, not sport.
          const expectedAcquisition = key !== "sport";
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

// V-DR-01: fetch stubs must honor the actual requested predicates. Returning the
// whole fixture regardless of the query would hide omitted lifecycle evidence.
const lifecycleLocation = { lat: 43.65348, lon: -79.38393, label: "Toronto", source: "manual" };
for (const activityTypes of [["anything"], ["corn-maze", "pumpkin-patch"], ["pumpkin-patch"], ["corn-maze"]]) {
  test(`RV2 demolished=yes real acquisition parity: ${activityTypes.join(" + ")}`, async (t) => {
    const state = installLifecycleProvider(t);
    state.elements = [
      { type: "node", id: 9201, lat: lifecycleLocation.lat, lon: lifecycleLocation.lon,
        tags: { name: "RV2 Twinfield", attraction: "corn_maze" } },
      { type: "node", id: 9202, lat: lifecycleLocation.lat, lon: lifecycleLocation.lon,
        tags: { name: "RV2 Twinfield", attraction: "pumpkin_patch", demolished: "yes" } },
    ];
    const { result, pool } = await lifecycleSearch(activityTypes);
    t.diagnostic(JSON.stringify({ selection: activityTypes, source: result.source,
      partial: result.discovery.partial, eligible: pool.map((place) => place.id),
      acquired: result.venues.flatMap((place) => place.discoveryEvidence.map((item) => item.id)) }));
    assert.equal(result.source, "live");
    assert.equal(result.discovery.partial, false);
    assert.deepEqual(pool, [], "A narrowed category cannot omit a matching demolished=yes record");
  });
}
function lifecycleElement(id, tags, latitudeOffset = 0) {
  return { type: id % 2 ? "node" : "way", id,
    lat: lifecycleLocation.lat + latitudeOffset, lon: lifecycleLocation.lon, tags };
}
function installLifecycleProvider(t) {
  t.mock.timers.enable({ apis: ["Date"], now: now.getTime() });
  const state = { elements: [], reverse: false, firstMirrorFails: false, queries: [] };
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const query = new URLSearchParams(options.body).get("data");
    state.queries.push(query);
    if (state.firstMirrorFails && String(url).includes("overpass.openstreetmap.fr")) {
      return new Response("", { status: 503 });
    }
    const selected = state.elements.filter((element) => acquired(query, element.tags));
    return Response.json({ elements: state.reverse ? selected.reverse() : selected });
  });
  return state;
}
async function lifecycleSearch(activityTypes, halloweenActive = true) {
  const result = await searchDateNight({ data: { ...lifecycleLocation, radiusMiles: 50,
    spookySeasonEnabled: halloweenActive, activityTypes } });
  const pool = eligibleDateNight(decorateDateNight(result.venues, lifecycleLocation, now), {
    ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes, openNowOnly: false,
  }, halloweenActive);
  return { result, pool };
}

for (const activityTypes of [["corn-maze"], ["pumpkin-patch"], ["corn-maze", "pumpkin-patch"], ["anything"]]) {
  test(`V-DR-01 cross-tag demolition excludes active Corn identity for ${activityTypes.join(" + ")} in either provider/result order`, async (t) => {
    const state = installLifecycleProvider(t);
    state.elements = [
      lifecycleElement(101, { name: "Harvest Crossing", attraction: "corn_maze", tourism: "farm",
        "seasonal:activities": "Pumpkin picking" }),
      lifecycleElement(102, { name: "Harvest Crossing", "demolished:attraction": "pumpkin_patch" }),
    ];
    for (const reverse of [false, true]) {
      for (const firstMirrorFails of [false, true]) {
        Object.assign(state, { reverse, firstMirrorFails });
        const { result, pool } = await lifecycleSearch(activityTypes);
        assert.equal(result.source, "live");
        assert.equal(result.discovery.partial, false);
        assert.deepEqual(pool.map((place) => place.name), [], "Cross-category demolition must suppress the eligible identity");
        assert.equal(result.venues.length, 1);
        assert.equal(result.venues[0].lifecycle, "permanently-closed");
        assert.deepEqual(sorted(result.venues[0].discoveryEvidence.map((item) => item.id)),
          ["date-night-osm-node-101", "date-night-osm-way-102"]);
      }
    }
  });
}

for (const [prefix, negativeAttraction, lifecycle] of [
  ["demolished", "corn_maze", "permanently-closed"],
  ["disused", "haunted_house", "disused"],
]) {
  test(`V-DR-01 Pumpkin-only retains reverse ${prefix}:${negativeAttraction} lifecycle companion`, async (t) => {
    const state = installLifecycleProvider(t);
    state.elements = [
      lifecycleElement(111, { name: "Autumn Terrace", attraction: "pumpkin_patch" }),
      lifecycleElement(112, { name: "Autumn Terrace", [`${prefix}:attraction`]: negativeAttraction }),
    ];
    for (const reverse of [false, true]) {
      state.reverse = reverse;
      const { result, pool } = await lifecycleSearch(["pumpkin-patch"]);
      assert.deepEqual(pool, []);
      assert.equal(result.venues[0].lifecycle, lifecycle);
      assert.equal(result.venues[0].discoveryEvidence.length, 2);
    }
  });
}

test("V-DR-01 ordinary Movies narrowing retains matching Museum demolition with Halloween both OFF and ON", async (t) => {
  const state = installLifecycleProvider(t);
  state.elements = [
    lifecycleElement(121, { name: "Riverside Arts", amenity: "cinema" }),
    lifecycleElement(122, { name: "Riverside Arts", "demolished:tourism": "museum" }),
  ];
  for (const halloweenActive of [false, true]) {
    for (const reverse of [false, true]) {
      state.reverse = reverse;
      const { result, pool } = await lifecycleSearch(["movies"], halloweenActive);
      assert.deepEqual(pool, [], "Ordinary activity narrowing must also retain identity-negative evidence");
      assert.equal(result.venues[0].lifecycle, "permanently-closed");
      assert.equal(result.venues[0].discoveryEvidence.length, 2);
    }
  }
});

test("V-DR-01 Halloween OFF preserves the same seasonal-classification boundary for Anything and narrowed ordinary queries", async (t) => {
  const state = installLifecycleProvider(t);
  state.elements = [
    lifecycleElement(125, { name: "Current Screen", amenity: "cinema" }),
    lifecycleElement(126, { name: "Current Screen", "demolished:attraction": "pumpkin_patch" }),
    lifecycleElement(127, { name: "Active Harvest", attraction: "corn_maze" }, -0.02),
  ];
  const { result, pool } = await lifecycleSearch(["movies"], false);
  const broad = await lifecycleSearch(["anything"], false);
  // The unchanged OFF classifier cannot materialize a purely seasonal record,
  // including a negative one. Narrowing must match Anything at this boundary;
  // ordinary-to-ordinary negative protection is covered separately above.
  assert.deepEqual(result.venues, broad.result.venues);
  assert.deepEqual(pool, broad.pool);
  assert.deepEqual(result.venues.map((place) => place.name), ["Current Screen"]);
  assert.deepEqual(pool.map((place) => place.name), ["Current Screen"]);
  assert.ok(state.queries.every((query) => acquired(query, state.elements[1].tags)));
  assert.ok(state.queries.every((query) => !acquired(query, state.elements[2].tags)));
  assert.ok(state.queries.every((query) => !/haunted|pumpkin|corn|maize|seasonal:/.test(affirmativeClauses(query).join("\n"))));
});

test("V-DR-01 unrelated negatives cannot suppress an active identity or leak into eligible positive results", async (t) => {
  const state = installLifecycleProvider(t);
  state.elements = [
    lifecycleElement(131, { name: "Living Harvest", attraction: "corn_maze" }),
    lifecycleElement(132, { name: "Distant Orchard", "demolished:attraction": "pumpkin_patch" }, 0.02),
    lifecycleElement(133, { name: "Old Fairground", "disused:attraction": "haunted_house" }, -0.02),
    lifecycleElement(134, { name: "Unrelated Farm", tourism: "farm" }, 0.04),
    lifecycleElement(135, { name: "Unrelated Park", leisure: "park" }, -0.04),
    lifecycleElement(136, { name: "Unrelated Attraction", tourism: "attraction" }, 0.06),
    lifecycleElement(137, { name: "Hedge Labyrinth", leisure: "maze" }, -0.06),
    lifecycleElement(138, { name: "Neighbor Attraction", "demolished:attraction": "pumpkin_patch" }),
  ];
  const { result, pool } = await lifecycleSearch(["corn-maze"]);
  assert.deepEqual(pool.map((place) => place.name), ["Living Harvest"]);
  assert.deepEqual(pool[0].activityTypes, ["corn-maze"]);
  assert.equal(pool[0].lifecycle, undefined);
  assert.equal(pool[0].discoveryEvidence.length, 1);
  for (const place of result.venues) {
    assert.ok(place.name === "Living Harvest" || place.lifecycle, "No generic positive context may leak through companions");
  }
  assert.equal(acquired(state.queries[0], state.elements[1].tags), true, "The unrelated terminal record is acquired, then excluded by lifecycle eligibility");
});

test("V-DR-01 negative companions span supported categories while affirmative clauses remain narrow", () => {
  const negativeTags = [
    { "demolished:attraction": "pumpkin_patch" }, { "disused:attraction": "corn_maze" },
    { "abandoned:attraction": "haunted_trail" }, { "removed:amenity": "cinema" },
    { "razed:tourism": "museum" }, { "destroyed:leisure": "bowling_alley" },
  ];
  for (const type of [...seasonal, ...ordinary]) {
    const query = queryFor([type]);
    for (const tags of negativeTags) assert.equal(acquired(query, tags), true, `${type}: ${JSON.stringify(tags)}`);
    for (const other of [...seasonal, ...ordinary].filter((candidate) => candidate !== type)) {
      const positiveTags = {
        "corn-maze": { attraction: "corn_maze" }, "pumpkin-patch": { attraction: "pumpkin_patch" },
        "haunted-house": { attraction: "haunted_house" }, movies: { amenity: "cinema" }, museum: { tourism: "museum" },
        bowling: { leisure: "bowling_alley" }, arcade: { leisure: "amusement_arcade" }, "mini-golf": { leisure: "miniature_golf" },
        "escape-room": { leisure: "escape_game" }, skating: { leisure: "ice_rink" }, park: { leisure: "park" },
      }[other];
      assert.equal(acquired(query, positiveTags), false, `${type} must not affirmatively acquire ${other}`);
    }
  }
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
