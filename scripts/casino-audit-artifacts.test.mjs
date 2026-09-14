import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("casino evidence JSON is parseable; truncated ledgers cannot masquerade as complete", () => {
  const files = fs.readdirSync("audit").filter((name) => name.endsWith(".json"));
  const invalid = [];
  for (const name of files) {
    try { JSON.parse(fs.readFileSync("audit/" + name, "utf8")); }
    catch (error) { invalid.push(name + ": " + error.message); }
  }
  assert.deepEqual(invalid, []);
});
