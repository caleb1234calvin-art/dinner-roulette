import test from "node:test";
import assert from "node:assert/strict";
import { catalogImports, loadCasinoCatalogs } from "./casino-catalog-loader.mjs";

const source = (array = "A, B", extra = "") => `
import { CASINO_CATALOG as A } from "./casino-catalog";
import { CASINO_CATALOG_PASS_2 as B } from "./casino-catalog-pass-2";
${extra}
const CASINO_PASSES = [${array}] as const;`;

test("audit follows runtime registration, including renamed imports", () => {
  assert.deepEqual(catalogImports(source()), [
    { file: "src/lib/nightlife/casino-catalog.ts", exportName: "CASINO_CATALOG" },
    { file: "src/lib/nightlife/casino-catalog-pass-2.ts", exportName: "CASINO_CATALOG_PASS_2" },
  ]);
});
test("unregistered imports and unknown runtime arrays fail closed", () => {
  assert.throws(() => catalogImports(source("A")), /not registered/);
  assert.throws(() => catalogImports(source("A, unknown")), /Unresolved/);
  assert.throws(() => catalogImports(source("...A, B")), /Unresolved/);
  assert.throws(() => catalogImports("const CASINO_PASSES = getCatalogs();"), /static array/);
});
test("duplicate, skipped and out-of-order passes cannot change audit precedence", () => {
  assert.throws(() => catalogImports(source("A, A")), /Duplicate catalog/);
  assert.throws(() => catalogImports(source("B, A")), /chronological/);
  assert.throws(() => catalogImports(source("A, C", 'import { C } from "./casino-catalog-pass-3";')), /chronological/);
});
test("empty or missing runtime registration cannot pass validation", () => {
  assert.throws(() => catalogImports(source("")), /nonempty/);
  assert.throws(() => catalogImports(""), /nonempty/);
});
test("real exported factory IDs and metadata survive loading", async () => {
  const files = {
    "src/lib/nightlife/search.ts": 'import { CASINO_CATALOG } from "./casino-catalog"; const CASINO_PASSES = [CASINO_CATALOG];',
    "src/lib/nightlife/casino-catalog.ts": 'const make = (id: string) => ({id: "casino-" + id, audit: {jurisdiction: "Nevada"}}); export const CASINO_CATALOG = [make("actual")];',
  };
  const { records } = await loadCasinoCatalogs({ read: (path) => files[path] });
  assert.equal(records[0].id, "casino-actual");
  assert.equal(records[0].audit.jurisdiction, "Nevada");
});
test("missing or empty module exports fail instead of undercounting", async () => {
  for (const content of ["export const WRONG = [];", "export const CASINO_CATALOG = [];"]) {
    await assert.rejects(loadCasinoCatalogs({ read: (path) => path.endsWith("search.ts")
      ? 'import { CASINO_CATALOG } from "./casino-catalog"; const CASINO_PASSES = [CASINO_CATALOG];'
      : content }), /missing or empty/);
  }
});
