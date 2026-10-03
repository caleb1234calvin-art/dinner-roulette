import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { appModuleLoader } from "../../scripts/test-support/load-app-module.mjs";
import { acquired } from "../../scripts/test-support/date-night-query-evaluator.mjs";
const load = appModuleLoader();
const { buildDateNightQueryPlan, buildDateNightQuery } = load("src/lib/date-night/query-plan.ts");
const { providerLifecycle, LIFECYCLE_POSITIVE_VALUE_PATTERN } = load("src/lib/date-night/lifecycle.ts");
const before = JSON.parse(fs.readFileSync(new URL("./parity-before.json", import.meta.url)));
const query = selection => buildDateNightQueryPlan(selection, true).map(group => buildDateNightQuery(group,43,-79,80467));
const rows = before.rows.map(row => ({ ...row, interpreted: providerLifecycle(row.tags) ?? null,
  acquisition: Object.fromEntries(Object.keys(row.acquisition).map(key => [key, query(key.split("+")).every(q => acquired(q, row.tags))])) }));
const measurements = before.measurements.map(({selection}) => {
  for(let i=0;i<100;i++) query(selection);
  const start=performance.now(); for(let i=0;i<1000;i++) query(selection);
  const elapsed=performance.now()-start;
  const groups=buildDateNightQueryPlan(selection,true).map(group=> {
    const q=buildDateNightQuery(group,43,-79,80467);
    return {id:group.id, bytes:Buffer.byteLength(q), selectors:q.split("\n").filter(line=>line.trim().startsWith("nwr")).length};
  });
  return {selection, groups, groupCount:groups.length, maxMirrorAttempts:groups.length*4, totalBytes:groups.reduce((n,g)=>n+g.bytes,0), meanConstructionMs:elapsed/1000};
});
const gaps=rows.filter(row=>row.interpreted&&Object.values(row.acquisition).some(value=>!value));
const result={method:"Same154 baseline fixtures; AFTER requires retrieval in EVERY group, stronger than baseline ANY group. Same synthetic coordinates;100warmups/1000construction iterations, not provider runtime.",rows,gaps,measurements,valuePattern:LIFECYCLE_POSITIVE_VALUE_PATTERN};
fs.writeFileSync(new URL("./parity-after.json",import.meta.url),JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({rows:rows.length,gaps:gaps.length,measurements},null,2));
if(gaps.length) process.exitCode=1;
