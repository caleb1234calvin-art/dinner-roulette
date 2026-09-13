import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { captureBuildInputs, completeBuildProof, assertBrowserBuild } from "./browser-build-proof.mjs";
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "browser-proof-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "src")); mkdirSync(join(root, ".vercel/output"), { recursive: true });
  writeFileSync(join(root, "src/control.ts"), "current control");
  writeFileSync(join(root, ".vercel/output/app.js"), "compiled control");
  return root;
}
test("browser acceptance rejects source/output drift and auth-disabled previews", t => {
  const root = fixture(t);
  assert.throws(() => captureBuildInputs(root, "false"), /sign-in-enabled/);
  captureBuildInputs(root, "true"); completeBuildProof(root, "true");
  assert.equal(assertBrowserBuild(root, "true").status, "BUILT");
  assert.throws(() => assertBrowserBuild(root, "false"), /auth-enabled/);
  writeFileSync(join(root, "src/control.ts"), "new control");
  assert.throws(() => assertBrowserBuild(root, "true"), /source changed/);
  writeFileSync(join(root, "src/control.ts"), "current control");
  writeFileSync(join(root, ".vercel/output/app.js"), "other build");
  assert.throws(() => assertBrowserBuild(root, "true"), /compiled output changed/);
});
test("unfinished builds and sources changed during compilation cannot be blessed", t => {
  const root = fixture(t);
  captureBuildInputs(root, "true");
  assert.throws(() => assertBrowserBuild(root, "true"), /successful fresh/);
  writeFileSync(join(root, "src/new.ts"), "new input");
  assert.throws(() => completeBuildProof(root, "true"), /Source changed during/);
});
