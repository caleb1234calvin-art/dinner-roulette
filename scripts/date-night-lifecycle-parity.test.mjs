import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { acquired, affirmativeClauses } from "./test-support/date-night-query-evaluator.mjs";

const load = appModuleLoader();
const { providerLifecycle, normalizeLifecycleTags, LIFECYCLE_FAMILIES, LIFECYCLE_POSITIVE_VALUE_PATTERN } = load("src/lib/date-night/lifecycle.ts");
const { buildDateNightQuery, buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const at = new Date("2026-10-10T20:00:00Z");
const location = { lat: 43, lon: -79, label: "Synthetic fixture", source: "manual" };
const categories = ["haunted-house", "corn-maze", "pumpkin-patch", "bowling", "arcade", "mini-golf", "escape-room", "skating", "movies", "museum", "park"];
const selections = [["anything"], ...categories.map(type => [type]), ["corn-maze", "pumpkin-patch"], ["movies", "corn-maze"]];
const queries = (selection, active = true) => buildDateNightQueryPlan(selection, active).map(group => buildDateNightQuery(group, location.lat, location.lon, 80467));
const plans = selections.map(selection => [selection, queries(selection)]);
const prefixes = ["demolished", "removed", "razed", "destroyed", "disused", "abandoned", "was"];

// Independent frozen interpretation oracle. Changes in interpretation must not
// silently make the acquisition parity check pass by dropping supported evidence.
function previousLifecycle(tags) {
  const positive = value => Boolean(value && !/^(no|false|0)$/i.test(value));
  if (["demolished", "removed", "razed", "destroyed"].some(key => positive(tags[key])) ||
    Object.keys(tags).some(key => /^(demolished|removed|razed|destroyed):/.test(key) && positive(tags[key]))) return "permanently-closed";
  if (["disused", "abandoned", "was"].some(key => positive(tags[key])) ||
    Object.keys(tags).some(key => /^(disused|abandoned|was):(leisure|tourism|attraction|amenity)$/.test(key) && positive(tags[key]))) return "disused";
}
function previousNormalize(raw) {
  const tags = { ...raw };
  for (const [key, value] of Object.entries(raw)) {
    const match = key.match(/^(disused|abandoned|was|demolished|removed|razed|destroyed):(leisure|tourism|attraction|amenity)$/);
    if (match && !tags[match[2]]) tags[match[2]] = value;
  }
  return tags;
}
const values = ["", "no", "NO", "nO", "false", "FALSE", "FaLsE", "0", "yes", "true", "1", "2020", "unknown", " ", "no ", " false", "00", "n", "f", "fa", "fal", "fals", "falsey", "no\n", "\n", "\r", "é", "否", "no\u2028"];

test("canonical lifecycle interpretation preserves the full frozen key/value semantics and precedence", () => {
  const keys = prefixes.flatMap(prefix => [prefix, ...["leisure", "tourism", "attraction", "amenity", "sport", "landuse", "building", "custom:nested", "", "amenity:extra"].map(suffix => `${prefix}:${suffix}`)]);
  keys.push(...keys.map(key => key.toUpperCase()), "closed", "inactive", "permanently_closed", "status", "end_date");
  for (const key of keys) for (const value of values) {
    const tags = { [key]: value };
    assert.equal(providerLifecycle(tags), previousLifecycle(tags), JSON.stringify(tags));
  }
  for (const reverse of [false, true]) {
    const entries = [["disused", "yes"], ["destroyed:building", "yes"], ["demolished", "no"]];
    assert.equal(providerLifecycle(Object.fromEntries(reverse ? entries.reverse() : entries)), "permanently-closed");
  }
});

test("generated POSIX value matcher has exact truth semantics, including false prefixes/extensions and case", () => {
  const matcher = new RegExp(LIFECYCLE_POSITIVE_VALUE_PATTERN);
  assert.doesNotMatch(LIFECYCLE_POSITIVE_VALUE_PATTERN, /\(\?|\\[sdw]/, "No JS-only lookahead or character escapes in provider ERE");
  const corpus = new Set(values);
  for (const word of ["no", "false", "0"]) {
    for (let mask = 0; mask < 1 << word.length; mask++) {
      const variant = [...word].map((letter, index) => mask & 1 << index ? letter.toUpperCase() : letter).join("");
      corpus.add(variant);
      for (let n = 0; n <= variant.length; n++) {
        corpus.add(variant.slice(0, n));
        for (const extra of ["x", "0", " ", "\n", "\r", "é"]) corpus.add(variant.slice(0, n) + extra + variant.slice(n));
      }
    }
  }
  for (const value of corpus) assert.equal(matcher.test(value), Boolean(value && !/^(no|false|0)$/i.test(value)), JSON.stringify(value));
});

test("canonical normalization preserves fill-only, input ordering, active tags and supported suffix boundaries", () => {
  for (const prefix of prefixes) for (const key of ["leisure", "tourism", "attraction", "amenity", "sport", "landuse", "building"]) {
    for (const active of [undefined, "", "museum"]) {
      const raw = { [`${prefix}:${key}`]: "farm", [`disused:${key}`]: "museum", ...(active !== undefined ? { [key]: active } : {}) };
      for (const entries of [Object.entries(raw), Object.entries(raw).reverse()]) {
        const tags = Object.fromEntries(entries), before = { ...tags };
        assert.deepEqual(normalizeLifecycleTags(tags), previousNormalize(tags));
        assert.deepEqual(tags, before);
      }
    }
  }
});

for (const family of LIFECYCLE_FAMILIES) for (const prefix of family.prefixes) {
  test(`registry parity ${prefix}: simple flags and every recognized namespace across every supported category`, () => {
    const keys = [prefix, ...["leisure", "tourism", "attraction", "amenity", ...(family.anySuffix ? ["building", "sport", "custom:nested", ""] : [])].map(key => `${prefix}:${key}`)];
    for (const key of keys) for (const value of values) {
      const tags = { tourism: "museum", [key]: value };
      const negative = Boolean(previousLifecycle(tags));
      for (const [selection, groupQueries] of plans) {
        // The Museum affirmative group can independently retrieve a false flag.
        if (selection.includes("anything") || selection.includes("museum")) continue;
        assert.ok(groupQueries.every(query => acquired(query, tags) === negative), `${selection}/${key}=${JSON.stringify(value)}`);
      }
    }
  });
}

function fixture(t) {
  t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
  t.mock.method(console, "info", () => {});
  const state = { elements: [], reverse: false, mirrorFailure: false, reverseGroups: false, calls: [] };
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const query = new URLSearchParams(options.body).get("data");
    state.calls.push({ url: String(url), query });
    if (state.mirrorFailure && String(url).includes("overpass.openstreetmap.fr")) return new Response("", { status: 503 });
    if (state.reverseGroups === affirmativeClauses(query).join("\n").includes("cinema")) await new Promise(resolve => setImmediate(resolve));
    const selected = state.elements.filter(element => acquired(query, element.tags));
    return Response.json({ elements: state.reverse ? selected.reverse() : selected });
  });
  return state;
}
const element = (id, tags, offset = 0) => ({ type: "node", id, lat: location.lat + offset, lon: location.lon, tags: { name: "Parity identity", ...tags } });
async function search(selection, active = true) {
  const result = await searchDateNight({ data: { ...location, radiusMiles: 50, spookySeasonEnabled: active, activityTypes: selection } });
  const pool = eligibleDateNight(decorateDateNight(result.venues, location, at), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes: selection, openNowOnly: false }, active);
  assert.equal(result.source, "live");
  assert.equal(result.discovery.partial, false);
  return { result, pool };
}

for (const prefix of prefixes) {
  test(`real handler ${prefix}: forward/reverse seasonal and ordinary flags, result order, later mirror`, async t => {
    const state = fixture(t);
    const pairs = [
      ["corn-maze", { attraction: "corn_maze" }, "pumpkin-patch", { attraction: "pumpkin_patch" }],
      ["pumpkin-patch", { attraction: "pumpkin_patch" }, "corn-maze", { attraction: "corn_maze" }],
      ["movies", { amenity: "cinema" }, "museum", { tourism: "museum" }],
      ["museum", { tourism: "museum" }, "movies", { amenity: "cinema" }],
      ["movies", { amenity: "cinema" }, "skating", { sport: "roller_skating" }],
    ];
    for (const [positiveType, positive, negativeType, carrier] of pairs) {
      for (const reverse of [false, true]) {
        Object.assign(state, { reverse, mirrorFailure: reverse });
        state.elements = [element(reverse ? 2 : 1, positive), element(reverse ? 1 : 2, { ...carrier, [prefix]: "yes" })];
        for (const selection of [[positiveType], [positiveType, negativeType], ["anything"]]) {
          const { result, pool } = await search(selection);
          assert.deepEqual(pool, [], `${prefix}/${selection}/${reverse}`);
          assert.equal(result.venues[0].lifecycle, previousLifecycle({ [prefix]: "yes" }));
          assert.equal(result.venues[0].discoveryEvidence.length, 2);
        }
      }
    }
    assert.ok(state.calls.some(call => call.url.includes("overpass.private.coffee")));
  });

  test(`real handler ${prefix}: reconstructed contextual seasonal evidence and ordinary namespace parity`, async t => {
    const state = fixture(t);
    for (const [key, value, extra] of [
      ["tourism", "farm", { description: "Pumpkin picking" }],
      ["tourism", "theme_park", { "seasonal:activities": "pumpkin patch" }],
      ["tourism", "attraction", { "seasonal:description": "Pumpkin patch" }],
      ["leisure", "maze", { crop: "maize" }],
      ["attraction", "maze", { "maze:type": "corn" }],
      ["amenity", "cinema", {}],
    ]) {
      state.elements = [element(1, { attraction: "corn_maze" }), element(2, { [`${prefix}:${key}`]: value, ...extra })];
      const { result, pool } = await search(["corn-maze"]);
      assert.deepEqual(pool, [], `${prefix}:${key}=${value}`);
      assert.equal(result.venues[0].lifecycle, previousLifecycle(state.elements[1].tags));
      assert.equal(result.venues[0].discoveryEvidence.length, 2);
    }
    for (const active of [false, true]) {
      state.elements = [element(1, { amenity: "cinema" }), element(2, { [`${prefix}:tourism`]: "museum" })];
      assert.deepEqual((await search(["movies"], active)).pool, []);
    }
  });
}

test("all supported active seasonal contexts carry simple lifecycle flags independent of category", async t => {
  const state = fixture(t);
  for (const context of [{ leisure: "maze" }, { attraction: "maze" }, { tourism: "theme_park" }, { tourism: "attraction" }, { tourism: "farm" }, { leisure: "park" }, { landuse: "farmyard" }, { landuse: "farmland" }]) {
    state.elements = [element(1, { amenity: "cinema" }), element(2, { ...context, "seasonal:activities": "Pumpkin picking", demolished: "yes" })];
    assert.deepEqual((await search(["movies"])).pool, [], JSON.stringify(context));
  }
});

test("different groups, completion order, duplicate identities and disused/permanent conflicts remain deterministic", async t => {
  const state = fixture(t);
  const positive = element(100, { amenity: "cinema", attraction: "corn_maze" });
  state.elements = [positive, element(101, { attraction: "pumpkin_patch", disused: "yes" }), element(102, { tourism: "museum", "destroyed:custom:state": "yes" }), positive];
  let baseline;
  for (const reverse of [false, true]) for (const reverseGroups of [false, true]) {
    Object.assign(state, { reverse, reverseGroups });
    const { result, pool } = await search(["corn-maze", "movies"]);
    assert.deepEqual(pool, []);
    assert.equal(result.venues.length, 1);
    assert.equal(result.venues[0].lifecycle, "permanently-closed");
    assert.equal(result.venues[0].discoveryEvidence.length, 3);
    if (baseline) assert.deepEqual(result, baseline);
    baseline = result;
  }
});

test("lifecycle-only, false flags, generic contexts and unsupported status tags never create eligible seasonal leakage", async t => {
  const state = fixture(t);
  state.elements = [element(1, { attraction: "corn_maze", name: "Current field" })];
  for (const [index, context] of [{ tourism: "farm" }, { leisure: "park" }, { attraction: "maze" }, { leisure: "maze" }, { landuse: "farmland" }, { tourism: "museum" }, { sport: "roller_skating" }].entries()) {
    for (const [n, flag] of ["yes", "no", "false", "0", ""].entries()) state.elements.push(element(10 + index * 10 + n, { ...context, name: `Unrelated ${index} ${n}`, demolished: flag }, 0.1 + index * 0.01));
  }
  const { result, pool } = await search(["corn-maze"]);
  assert.deepEqual(pool.map(place => place.name), ["Current field"]);
  assert.ok(result.venues.every(place => place.name === "Current field" || place.lifecycle));
  for (const tag of ["closed", "inactive", "permanently_closed", "status", "end_date"]) {
    const tags = { tourism: "museum", [tag]: "yes" };
    assert.equal(providerLifecycle(tags), undefined);
    assert.ok(queries(["corn-maze"]).every(query => !acquired(query, tags)));
  }
});

test("negative-key search is exclusively set-bounded, positive queries stay narrow and hostile input never interpolates", () => {
  for (const [, groupQueries] of plans) for (const query of groupQueries) {
    assert.doesNotMatch(query, /nwr\[~/, "No spatial regex-key scan");
    assert.doesNotMatch(query, /nwr\(around:/, "No all-elements preselection");
    assert.doesNotMatch(query, /(?:^|\n)\s*nwr\.lifecycle_context;/, "No unfiltered context passthrough");
  }
  for (const query of queries(["movies"])) assert.deepEqual(affirmativeClauses(query), ['nwr["amenity"="cinema"](around:80467,43,-79);']);
  for (const activityTypes of [['movies"];out;'], ["__proto__"], ["demolished"], ["inactive"], [null], "movies"]) assert.throws(() => buildDateNightQueryPlan(activityTypes, true));
});
