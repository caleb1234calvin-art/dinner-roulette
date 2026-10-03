import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { acquisitionClauses, affirmativeClauses, acquired } from "./test-support/date-night-query-evaluator.mjs";

const load = appModuleLoader();
const { buildDateNightQuery, buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { providerLifecycle } = load("src/lib/date-night/lifecycle.ts");
const { DATE_NIGHT_MIRRORS } = load("src/lib/discovery/hedged-provider.ts");
const evidence = "audit/date-night-live-discovery-resilience-live-timeout-remediation-1-evidence/";
const before = JSON.parse(fs.readFileSync(evidence + "cost-before.json", "utf8"));
const audit = JSON.parse(fs.readFileSync(evidence + "parity-before.json", "utf8"));
// Frozen independently of the runtime registry: semantic deletion must not make
// the structural regression pass by silently dropping a carrier value.
const expected = {
  leisure: ["bowling_alley", "amusement_arcade", "miniature_golf", "escape_game", "ice_rink", "park", "maze"],
  amenity: ["cinema"],
  tourism: ["museum", "theme_park", "attraction", "farm"],
  attraction: ["haunted_house", "haunted_trail", "haunted_forest", "haunted_attraction", "corn_maze", "maize_maze", "maze", "pumpkin_patch"],
  sport: ["roller_skating"],
  landuse: ["farmyard", "farmland"],
};
const query = group => buildDateNightQuery(group, 43, -79, 80467);
const plan = buildDateNightQueryPlan(["anything"], true);
function carrierClauses(q) {
  const matches = [...q.matchAll(/^\(\n[\s\S]*?\)->\.lifecycle_context;\n/gm)];
  assert.equal(matches.length, 1, "Each query owns exactly one independent lifecycle carrier");
  return acquisitionClauses(matches[0][0]);
}
function exactActive(q) {
  const active = carrierClauses(q).filter(line => /^nwr\["[^":]+"/.test(line));
  return active.map(line => {
    const match = line.match(/^nwr\["([^":]+)"="([a-z_]+)"\]\(around:80467,43,-79\);$/);
    assert.ok(match, `Finite active carrier must use exact key/value index acquisition: ${line}`);
    return { key: match[1], value: match[2] };
  });
}

for (const [key, values] of Object.entries(expected)) {
  test(`query cost: ${key} uses the complete finite exact-value carrier in every independent group`, () => {
    for (const group of plan) {
      const q = query(group);
      const actual = exactActive(q).filter(item => item.key === key).map(item => item.value);
      assert.deepEqual(actual.sort(), [...values].sort(), group.id);
      assert.ok(!carrierClauses(q).some(line => line.startsWith(`nwr["${key}"~`)), "No common-key regex enumeration");
    }
  });
}

test("query cost: exact acquisition has no extra keys, duplicate clauses or unbounded selectors", () => {
  for (const group of plan) {
    const active = exactActive(query(group));
    assert.equal(active.length, 23);
    assert.deepEqual([...new Set(active.map(item => item.key))].sort(), Object.keys(expected).sort());
    const clauses = carrierClauses(query(group));
    assert.equal(new Set(clauses).size, clauses.length);
    assert.ok(clauses.every(line => line.endsWith("(around:80467,43,-79);")));
    assert.doesNotMatch(query(group), /nwr\[~/);
  }
});

test("query cost: the structure guard rejects the diagnosed cinema regex even when shorter", () => {
  const q = query(plan[0]);
  exactActive(q);
  const regression = q.replace('nwr["amenity"="cinema"]', 'nwr["amenity"~"^(cinema)$"]');
  assert.notEqual(regression, q);
  assert.throws(() => exactActive(regression), /exact key\/value/);
  assert.throws(() => exactActive(fs.readFileSync(evidence + "before-seasonal.overpassql", "utf8")), /exact key\/value/);
});

test("query cost: positive query statements and prefixed carrier statements remain unchanged for every measured plan", () => {
  for (const measure of before.measures) {
    const current = buildDateNightQueryPlan(measure.selection, true);
    assert.deepEqual(current.map(group => group.id), measure.groups.map(group => group.id));
    current.forEach((group, index) => {
      const q = query(group);
      assert.deepEqual(affirmativeClauses(q), measure.groups[index].positive);
      assert.deepEqual(carrierClauses(q).filter(line => /^nwr\["[^":]+:/.test(line)), measure.groups[index].prefixed);
    });
  }
});

test("query cost: all 154 audited interpretations and all 111 negative acquisitions survive every requested group", () => {
  assert.equal(audit.matrix.length, 154);
  assert.equal(audit.matrix.filter(row => row.interpreted).length, 111);
  for (const row of audit.matrix) {
    assert.equal(providerLifecycle(row.tags) ?? null, row.interpreted, row.id);
    for (const selection of Object.keys(row.acquisition)) {
      for (const group of buildDateNightQueryPlan(selection.split("+"), true)) {
        if (row.interpreted) assert.equal(acquired(query(group), row.tags), true, `${row.id}/${selection}/${group.id}`);
      }
    }
  }
});

test("query cost: arbitrary permanent suffixes and non-finite lifecycle values remain set-bounded and reachable", () => {
  for (const group of plan) {
    const q = query(group);
    assert.equal(acquisitionClauses(q).filter(line => line.startsWith("nwr.lifecycle_context[")).length, 2);
    assert.doesNotMatch(q, /nwr\.lifecycle_context;/);
    for (const prefix of ["demolished", "removed", "razed", "destroyed"]) {
      for (const suffix of ["", "building", "custom:unseen:suffix", "未来", "name:en"]) {
        const tags = { sport: "roller_skating", [`${prefix}:${suffix}`]: "arbitrary positive value" };
        assert.equal(providerLifecycle(tags), "permanently-closed");
        assert.equal(acquired(q, tags), true);
      }
    }
  }
});

test("query cost: equality preserves old acquisition for finite values and near misses, with and without lifecycle flags", () => {
  for (const group of plan) {
    const q = query(group), old = fs.readFileSync(evidence + `before-${group.id}.overpassql`, "utf8");
    for (const [key, values] of Object.entries(expected)) {
      for (const value of values.flatMap(value => [value, value.toUpperCase(), ` ${value}`, `${value} `, `${value}_extra`, ""])) {
        for (const negative of [{}, { demolished: "yes" }, { "removed:custom:suffix": "yes" }, { disused: "false" }]) {
          const tags = { [key]: value, ...negative };
          assert.equal(acquired(q, tags), acquired(old, tags), JSON.stringify({ group:group.id, tags }));
        }
      }
    }
  }
});

test("query cost: four independent groups and the four fixed mirrors remain unchanged", () => {
  assert.deepEqual(plan.map(group => group.id), ["seasonal", "entertainment", "culture", "outdoor"]);
  assert.deepEqual(DATE_NIGHT_MIRRORS, [
    "https://overpass.openstreetmap.fr/api/interpreter", "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass-api.de/api/interpreter",
  ]);
  assert.equal(plan.length * DATE_NIGHT_MIRRORS.length, 16);
  const carriers = plan.map(group => carrierClauses(query(group)));
  carriers.forEach(clauses => assert.deepEqual(clauses, carriers[0]));
});
