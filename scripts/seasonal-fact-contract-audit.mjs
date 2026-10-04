import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import ts from "typescript";

const base = "908510ac25fe5c24335126a0f34ff42fe4d80632";
const git = (...args) => {
  try { return execFileSync("git", args, { encoding: "utf8" }).trim(); }
  catch (error) { if (args[0] === "grep" && error.status === 1) return ""; throw error; }
};
const root = "tools/seasonal-facts/";
const collectorFiles = ["schema.ts", "canonical.ts", "policy.ts", "builder.ts", "io.ts", "cli.ts"];
const imports = [];
const allowedImports = new Set(["zod", "node:crypto", "node:net", "node:fs", "node:path", "node:url",
  "./schema.ts", "./canonical.ts", "./policy.ts", "./builder.ts", "./io.ts"]);
const forbidden = new Set(["fetch", "WebSocket", "XMLHttpRequest", "eval", "Function", "require"]);
for (const path of collectorFiles) {
  const text = readFileSync(root + path, "utf8"), ast = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  const visit = node => {
    if (ts.isImportDeclaration(node)) {
      const specifier = node.moduleSpecifier.text;
      assert.ok(allowedImports.has(specifier), `Unapproved dependency: ${specifier}`);
      imports.push({ file: path, module: specifier });
      if (specifier === "node:net") assert.equal(node.importClause.namedBindings.getText(ast), "{ isIP }");
    }
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      assert.notEqual(node.expression.kind, ts.SyntaxKind.ImportKeyword, "Dynamic import forbidden");
      assert.ok(!forbidden.has(node.expression.getText(ast)), "Executable/network extraction primitive forbidden");
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
}
const existingChanges = git("diff", "--name-only", "--diff-filter=MDRT", base).split("\n").filter(Boolean);
assert.deepEqual(existingChanges, [], "Existing tracked product/repository files changed");
for (const file of ["package.json", "package-lock.json"]) assert.equal(git("hash-object", file), git("rev-parse", `${base}:${file}`));
const runtimeImports = git("grep", "-n", "-E", "seasonal-facts|seasonal-fact-contract", "--", "src", "server", "vite.config.ts", "package.json");
assert.equal(runtimeImports, "");
const changed = git("diff", "--name-only", base).split("\n").filter(Boolean);
const untracked = git("ls-files", "--others", "--exclude-standard").split("\n").filter(Boolean);
const allowedPaths = [root, "scripts/seasonal-fact-contract", "audit/date-night-seasonal-fact-contract-1", "docs/handoffs/active/date-night-seasonal-fact-contract-1"];
assert.ok([...changed, ...untracked].every(p => allowedPaths.some(prefix => p.startsWith(prefix))), "Unexpected changed path");
const registry = JSON.parse(readFileSync(root + "generated/input.synthetic.json", "utf8")).sources;
assert.ok(registry.every(s => s.enabled === false && s.sourceClass === "synthetic" && s.allowedHosts.every(h => h.endsWith(".invalid"))));
console.log(JSON.stringify({ base, baseTree: git("rev-parse", `${base}^{tree}`), existingTrackedFilesChanged: 0,
  packageAndLockIdentical: true, newBillingDependencies: 0, runtimeIntegration: false,
  realSourceAdapters: 0, networkTransportImplementations: 0, collectorImports: imports,
  generatedArtifacts: readdirSync(root + "generated").sort() }, null, 2));
