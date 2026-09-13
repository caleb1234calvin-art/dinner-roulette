import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const inputs = ["src", "server", "public", "scripts", "package.json", "package-lock.json", "vite.config.ts", "tsconfig.json", "vercel.json"];
const proofPath = root => join(root, "audit/browser-results/build-proof.json");
function digest(root, paths) {
  const hash = createHash("sha256");
  let count = 0;
  function walk(path) {
    const absolute = join(root, path);
    if (!existsSync(absolute)) return;
    for (const entry of readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = join(path, entry.name);
      if (entry.isDirectory()) walk(relative);
      else if (entry.isFile()) file(relative);
    }
  }
  function file(path) {
    const bytes = readFileSync(join(root, path));
    hash.update(path.replaceAll("\\", "/") + "\0" + bytes.length + "\0");
    hash.update(bytes); count++;
  }
  for (const path of paths) {
    if (!existsSync(join(root, path))) continue;
    if (statSync(join(root, path)).isFile()) file(path);
    else walk(path);
  }
  assert.ok(count, "Build fingerprint cannot be empty");
  return { sha256: hash.digest("hex"), files: count };
}
export function captureBuildInputs(root = process.cwd(), authFlag = process.env.VITE_AUTH_ENABLED) {
  assert.equal(authFlag, "true", "Browser acceptance requires sign-in-enabled production rendering");
  const proof = { schemaVersion: 1, status: "BUILD_PENDING", authFlag, source: digest(root, inputs), startedAt: new Date().toISOString() };
  mkdirSync(dirname(proofPath(root)), { recursive: true });
  writeFileSync(proofPath(root), JSON.stringify(proof, null, 2) + "\n");
  return proof;
}
// Call only after the direct migration-free Vite command exits successfully.
export function completeBuildProof(root = process.cwd(), authFlag = process.env.VITE_AUTH_ENABLED) {
  const proof = JSON.parse(readFileSync(proofPath(root), "utf8"));
  assert.equal(proof.status, "BUILD_PENDING");
  assert.equal(authFlag, "true");
  assert.equal(proof.authFlag, authFlag);
  assert.deepEqual(digest(root, inputs), proof.source, "Source changed during the build; rebuild before browser validation");
  const completed = { ...proof, status: "BUILT", output: digest(root, [".vercel/output"]), completedAt: new Date().toISOString() };
  writeFileSync(proofPath(root), JSON.stringify(completed, null, 2) + "\n");
  return completed;
}
export function assertBrowserBuild(root = process.cwd(), authFlag = process.env.VITE_AUTH_ENABLED) {
  const proof = JSON.parse(readFileSync(proofPath(root), "utf8"));
  assert.equal(authFlag, "true", "Browser acceptance must retain auth-enabled server rendering");
  assert.equal(proof.authFlag, "true");
  assert.equal(proof.status, "BUILT", "A successful fresh production build is required");
  assert.deepEqual(digest(root, inputs), proof.source, "Stale build: source changed after compilation");
  assert.deepEqual(digest(root, [".vercel/output"]), proof.output, "Stale build: compiled output changed");
  return proof;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const action = { capture: captureBuildInputs, complete: completeBuildProof, verify: assertBrowserBuild }[process.argv[2]];
  assert.ok(action, "Use capture before, and complete only after, a successful safe production build; verify before browsers");
  console.log("BROWSER_BUILD_PROOF " + JSON.stringify(action()));
}
