import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const manifestPath = "src/lib/artwork/owner-attested-assets.json";

test("application loader reads and caches JSON data with default and named fields", () => {
  const load = appModuleLoader();
  const expected = JSON.parse(readFileSync(manifestPath, "utf8"));
  const namespace = load(manifestPath);
  assert.equal(namespace.__esModule, true);
  assert.deepEqual(namespace.default, expected);
  assert.equal(namespace.assets, namespace.default.assets);
  assert.equal(load(manifestPath), namespace);
  for (const esModuleInterop of [false, true]) {
    const { outputText } = ts.transpileModule('import manifest from "./manifest.json"; export const assets = manifest.assets;', {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop },
    });
    const module = { exports: {} };
    new Function("require", "module", "exports", outputText)(() => namespace, module, module.exports);
    assert.equal(module.exports.assets, namespace.default.assets);
  }
});

test("application loader executes the real artwork attribution module against its JSON manifest", () => {
  const load = appModuleLoader();
  const { hasAttestedArtwork } = load("src/lib/artwork/attribution.ts");
  const manifest = load(manifestPath).default;
  assert.ok(manifest.assets.length > 0);
  for (const asset of manifest.assets) assert.equal(hasAttestedArtwork([asset.src]), true, asset.src);
  assert.equal(hasAttestedArtwork([]), false);
  assert.equal(hasAttestedArtwork([null, undefined, "data:image/svg+xml,abc", "/__grok/icon-180.png", "/unreviewed.jpg"]), false);
});
