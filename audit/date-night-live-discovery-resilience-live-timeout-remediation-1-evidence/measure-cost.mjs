import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { appModuleLoader } from "../../scripts/test-support/load-app-module.mjs";
import { acquisitionClauses, affirmativeClauses, acquired } from "../../scripts/test-support/date-night-query-evaluator.mjs";

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase));
const load = appModuleLoader();
const { buildDateNightQuery, buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const { providerLifecycle } = load("src/lib/date-night/lifecycle.ts");
const { DATE_NIGHT_MIRRORS } = load("src/lib/discovery/hedged-provider.ts");
const hash = value => createHash("sha256").update(value).digest("hex");
const previous = JSON.parse(fs.readFileSync("audit/date-night-live-discovery-resilience-reverification-remediation-2-evidence/parity-before.json"));
const query = group => buildDateNightQuery(group, 43, -79, 80467);
const measures = previous.measurements.map(({ selection }) => {
  const plan = buildDateNightQueryPlan(selection, true);
  for (let i = 0; i < 100; i++) plan.map(query);
  const start = performance.now();
  for (let i = 0; i < 1000; i++) plan.map(query);
  const meanConstructionMs = (performance.now() - start) / 1000;
  const groups = plan.map(group => {
    const q = query(group);
    const carrier = q.match(/^\(\n[\s\S]*?\)->\.lifecycle_context;\n/m)[0];
    const clauses = acquisitionClauses(carrier);
    const active = clauses.filter(line => /^nwr\["[^":]+"/.test(line));
    const prefixed = clauses.filter(line => /^nwr\["[^":]+:/.test(line));
    if (selection[0] === "anything") fs.writeFileSync(new URL(`./${phase}-${group.id}.overpassql`, import.meta.url), q + "\n");
    return { id: group.id, bytes: Buffer.byteLength(q), selectors: acquisitionClauses(q).length,
      carrierBytes: Buffer.byteLength(carrier), carrierSelectors: clauses.length, carrierSha256: hash(carrier),
      activeCarrierSelectors: active.length, activeRegexSelectors: active.filter(line => line.includes('"~')).length,
      prefixedCarrierSelectors: prefixed.length, lifecyclePredicates: acquisitionClauses(q).filter(line => line.startsWith("nwr.lifecycle_context[")).length,
      active, prefixed, positive: affirmativeClauses(q), remainingRegex: acquisitionClauses(q).filter(line => line.includes("~")) };
  });
  return { selection, groups, meanConstructionMs, totalBytes: groups.reduce((n, g) => n + g.bytes, 0) };
});
const rows = previous.rows.map(row => ({ ...row, interpreted: providerLifecycle(row.tags) ?? null,
  acquisition: Object.fromEntries(Object.keys(row.acquisition).map(key => [key,
    buildDateNightQueryPlan(key.split("+"), true).every(group => acquired(query(group), row.tags))])) }));
assert.equal(rows.length, 154);
assert.equal(rows.filter(row => row.interpreted).length, 111);
assert.equal(rows.filter(row => row.interpreted && Object.values(row.acquisition).some(value => !value)).length, 0);
const groups = measures[0].groups;
const result = { phase, method: "Actual builder; synthetic 43,-79,80467m; 100 warmups and 1000 iterations; construction only, no public traffic.",
  measures, parity: { rows: rows.length, authoritativeNegatives: 111, gaps: 0 },
  groupCount: groups.length, mirrorCount: DATE_NIGHT_MIRRORS.length, mirrors: DATE_NIGHT_MIRRORS,
  identicalCarrierAcrossGroups: new Set(groups.map(g => g.carrierSha256)).size === 1,
  carrierSelectorsAcrossGroups: groups.reduce((n,g) => n + g.carrierSelectors, 0),
  theoreticalCarrierSelectorsAllMirrors: groups.reduce((n,g) => n + g.carrierSelectors, 0) * DATE_NIGHT_MIRRORS.length,
  theoreticalActiveRegexSelectorsAllMirrors: groups.reduce((n,g) => n + g.activeRegexSelectors, 0) * DATE_NIGHT_MIRRORS.length,
  theoreticalLifecyclePredicatesAllMirrors: groups.reduce((n,g) => n + g.lifecyclePredicates, 0) * DATE_NIGHT_MIRRORS.length };
fs.writeFileSync(new URL(`./cost-${phase}.json`, import.meta.url), JSON.stringify(result, null, 2) + "\n");
fs.writeFileSync(new URL(`./parity-${phase}.json`, import.meta.url), JSON.stringify({ ...result.parity, matrix: rows }, null, 2) + "\n");
console.log(JSON.stringify({ ...result, measures: measures.map(m => ({ selection:m.selection, totalBytes:m.totalBytes, meanConstructionMs:m.meanConstructionMs,
  groups:m.groups.map(({id,bytes,selectors,carrierSelectors,activeCarrierSelectors,activeRegexSelectors,prefixedCarrierSelectors,lifecyclePredicates}) => ({id,bytes,selectors,carrierSelectors,activeCarrierSelectors,activeRegexSelectors,prefixedCarrierSelectors,lifecyclePredicates})) })) }, null, 2));
