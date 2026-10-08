import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = p => readFileSync(`src/components/${p}.tsx`, "utf8");
test("seasonal options retain standard shell, original media and accessible full title", () => {
  const source = read("options-overlay");
  assert.match(source, /min-h-\[17rem\]/);
  assert.match(source, /h-28 w-full/);
  assert.match(source, /size-24 rounded-2xl/);
  assert.match(source, /title=\{restaurant.name\}/);
  assert.match(source, /seasonal \? "w-full truncate/);
  assert.match(source, /: "px-3 py-3"/);
});
test("seasonal uncertainty stays visible and native Details stays collapsed", () => {
  const source = read("seasonal-visit-notes");
  assert.match(source, /\{SEASONAL_VISITOR_NOTICE\}/);
  assert.match(source, /data-seasonal-confidence/);
  assert.match(source, /<details>/);
  assert.doesNotMatch(source, /<details[^>]*\bopen/);
  assert.match(source, /min-h-6/);
  assert.match(source, /presentation.details.map/);
  assert.doesNotMatch(source, /line-clamp|overflow-hidden|truncate/);
});
test("original full-result and plan media are unchanged", () => {
  assert.match(read("result-overlay"), /relative h-56 overflow-hidden/);
  assert.match(read("result-overlay"), /size-44 rounded-\[2rem\]/);
  assert.match(read("date-night-plan-overlay"), /size-20 shrink-0/);
});
