import assert from "node:assert/strict";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { appModuleLoader } from "../../scripts/test-support/load-app-module.mjs";
const load = appModuleLoader();
const {buildDateNightQueryPlan, buildDateNightQuery}=load("src/lib/date-night/query-plan.ts");
const {providerLifecycle}=load("src/lib/date-night/provider-evidence.ts");
function acquired(query, tags) {
  const lines = query.split("\n").map((line) => line.trim()).filter(Boolean);
  assert.equal(lines.shift(), "[out:json][timeout:20];", "Expected bounded JSON query header");
  const sets = new Map();
  let block = null, result, printed = false;
  for (const [index, line] of lines.entries()) {
    if (line === "(") {
      assert.equal(block, null, "Nested unions are outside the fixture grammar");
      block = [];
      continue;
    }
    if (line === ");" || line === ")->.seasonal_context;") {
      assert.ok(block?.length, "Only a populated query union may be closed");
      if (line === ");") {
        assert.equal(result, undefined, "The fixture expects exactly one final output union");
        result = block.some(Boolean);
      } else {
        assert.equal(result, undefined, "Context preselection must precede the output union");
        assert.equal(sets.has("seasonal_context"), false, "Do not overwrite a named context set");
        sets.set("seasonal_context", block.some(Boolean));
      }
      block = null;
      continue;
    }
    if (line === "out center tags;") {
      assert.equal(block, null);
      assert.equal(typeof result, "boolean", "Output must come from the final union");
      assert.equal(index, lines.length - 1, "Output must be the final statement");
      printed = true;
      continue;
    }
    assert.ok(block, `Query selectors must be inside a union: ${line}`);
    const statement = line.match(/^nwr(?:\.([a-z_]+))?(.+);$/);
    assert.ok(statement, `Unrecognized query statement: ${line}`);
    const [, inputSet, filters] = statement;
    let selectors = filters;
    let member = true;
    if (inputSet) {
      assert.equal(inputSet, "seasonal_context", "Only the server-owned context set is supported");
      assert.ok(sets.has(inputSet), "A named input set must be declared before use");
      member = sets.get(inputSet);
    } else {
      const geographic = filters.match(/\(around:([0-9]+),(-?[0-9.]+(?:e[+-]?[0-9]+)?),(-?[0-9.]+(?:e[+-]?[0-9]+)?)\)$/i);
      assert.ok(geographic, `Every database selection must be spatially bounded: ${line}`);
      const [, radius, lat, lon] = geographic;
      assert.ok(Number(radius) > 0 && Number(radius) <= 80467);
      assert.ok(Number.isFinite(Number(lat)) && Math.abs(Number(lat)) <= 90);
      assert.ok(Number.isFinite(Number(lon)) && Math.abs(Number(lon)) <= 180);
      selectors = filters.slice(0, -geographic[0].length);
    }
    const parsed = [...selectors.matchAll(/\[(~?"(?:\\.|[^"\\])*")(=|~)("(?:\\.|[^"\\])*")(,i)?\]/g)];
    assert.ok(parsed.length, `Expected whitelisted predicates: ${line}`);
    assert.equal(parsed.map((match) => match[0]).join(""), selectors, `Unrecognized predicate grammar: ${line}`);
    const predicatesMatch = parsed.every(([, rawKey, operation, rawValue, ignoreCase]) => {
      const keyPattern = rawKey.startsWith("~");
      const key = JSON.parse(keyPattern ? rawKey.slice(1) : rawKey);
      const value = JSON.parse(rawValue);
      const candidates = keyPattern
        ? Object.entries(tags).filter(([candidate]) => new RegExp(key, ignoreCase ? "i" : "").test(candidate)).map(([, candidate]) => candidate)
        : Object.hasOwn(tags, key) ? [tags[key]] : [];
      return candidates.some((candidate) => operation === "="
        ? candidate === value
        : new RegExp(value, ignoreCase ? "i" : "").test(candidate));
    });
    block.push(member && predicatesMatch);
  }
  assert.equal(printed, true, "The fixture must evaluate an explicit output statement");
  return result;
}


const selections=[["anything"],["corn-maze"],["pumpkin-patch"],["corn-maze","pumpkin-patch"],["movies"],["museum"],["skating"]];
const query=(s)=>buildDateNightQueryPlan(s,true).map(g=>buildDateNightQuery(g,43,-79,80467));
const rows=[];
function row(id,tags,notes){ rows.push({id,tags,interpreted:providerLifecycle(tags)??null,notes,acquisition:Object.fromEntries(selections.map(s=>[s.join("+"),query(s).some(q=>acquired(q,tags))]))}); }
for(const prefix of ["demolished","removed","razed","destroyed","disused","abandoned","was"]){
 for(const value of ["yes","1","true","2020","unknown","no","FALSE","0",""])
  row(`simple:${prefix}=${value}`,{attraction:"pumpkin_patch",[prefix]:value},"Simple flag: active Pumpkin carrier; Corn and ordinary selection require independent negatives");
 for(const [key,value] of Object.entries({leisure:"bowling_alley",tourism:"museum",attraction:"pumpkin_patch",amenity:"cinema"}))
  row(`prefix:${prefix}:${key}`,{[`${prefix}:${key}`]:value},"Four reconstructable tag namespaces");
 for(const [key,value] of Object.entries({tourism:"farm",leisure:"maze",attraction:"maze"}))
  row(`context:${prefix}:${key}=${value}`,{[`${prefix}:${key}`]:value,description:"Pumpkin picking"},"Seasonal prose requires reconstructed supported context; current direct values can omit farm/theme_park/attraction");
 for(const key of ["building","sport","name","custom:nested",""])
  row(`arbitrary:${prefix}:${key}`,{tourism:"museum",[`${prefix}:${key}`]:"yes"},"Permanent prefixes recognize ANY suffix; disused-family only four exact suffixes");
 row(`other-value:${prefix}:amenity`,{sport:"roller_skating",[`${prefix}:amenity`]:"parking"},"Any positive value can carry lifecycle with independent active classification");
}
const measuredSelections=[["anything"],...["haunted-house","corn-maze","pumpkin-patch","bowling","arcade","mini-golf","escape-room","skating","movies","museum","park"].map(t=>[t]),["haunted-house","corn-maze","pumpkin-patch"]];
const measurements=measuredSelections.map(selection=>{ for(let i=0;i<100;i++)query(selection);const start=performance.now(); for(let i=0;i<1000;i++)query(selection);const elapsed=performance.now()-start; const plan=buildDateNightQueryPlan(selection,true);const groups=plan.map(g=>{const q=buildDateNightQuery(g,43,-79,80467);return {id:g.id,bytes:Buffer.byteLength(q),selectors:q.split("\n").filter(l=>l.trim().startsWith("nwr")).length};});return {selection,groups,groupCount:groups.length,maxMirrorAttempts:groups.length*4,totalBytes:groups.reduce((n,g)=>n+g.bytes,0),meanConstructionMs:elapsed/1000};});
fs.writeFileSync(new URL("./parity-before.json",import.meta.url),JSON.stringify({candidate:"4e6ff124960d77be0c454ccfa0401c8a1ced35a1",method:"Frozen preimplementation grammar evaluator; source-level class matrix. Real handler RED retained separately. Construction:100 warmups/1000 iterations, synthetic coordinates, not provider runtime.",rows,measurements},null,2)+"\n");
console.log(JSON.stringify({rows:rows.length,recognized:rows.filter(r=>r.interpreted).length,gaps:rows.filter(r=>r.interpreted&&Object.values(r.acquisition).some(v=>!v)).length,measurements}));
