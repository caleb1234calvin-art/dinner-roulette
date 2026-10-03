import assert from "node:assert/strict";

// Interpret only the server-owned predicate grammar used by this query builder.
// This lets reachability tests prove that a real positive fixture is acquired,
// without relying on an Overpass service or merely searching query substrings.
export function acquisitionClauses(query) {
  return query.split("\n").map((line) => line.trim()).filter((line) => line.startsWith("nwr"));
}

export function affirmativeClauses(query) {
  return acquisitionClauses(query.replace(/\(\n[\s\S]*?\)->\.lifecycle_context;\n/, ""))
    .filter((line) => !line.startsWith("nwr.lifecycle_context["));
}

export function acquired(query, tags) {
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
    const setClose = line.match(/^\)->\.(seasonal_context|lifecycle_context);$/);
    if (line === ");" || setClose) {
      assert.ok(block?.length, "Only a populated query union may be closed");
      if (line === ");") {
        assert.equal(result, undefined, "The fixture expects exactly one final output union");
        result = block.some(Boolean);
      } else {
        assert.equal(result, undefined, "Context preselection must precede the output union");
        assert.equal(sets.has(setClose[1]), false, "Do not overwrite a named context set");
        sets.set(setClose[1], block.some(Boolean));
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
      assert.ok(["seasonal_context", "lifecycle_context"].includes(inputSet), "Only server-owned context sets are supported");
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
