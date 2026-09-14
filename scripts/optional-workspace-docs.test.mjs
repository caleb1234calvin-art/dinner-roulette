import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import { workspaceDocsTestOptions } from "./optional-workspace-docs.mjs";

test("absent external workspace package gets an explicit skip reason", () => {
  let checked;
  const options = workspaceDocsTestOptions("/repo", {
    required: false, exists: (path) => { checked = path; return false; },
  });
  assert.equal(checked, join("/repo", ".grok/skills/og"));
  assert.match(options.skip, /not installed/);
});

test("installed documentation contracts are not skipped", () => {
  assert.equal(workspaceDocsTestOptions("/repo", {
    required: false, exists: () => true,
  }).skip, false);
});

test("required documentation cannot be skipped even when absent", () => {
  assert.equal(workspaceDocsTestOptions("/repo", {
    required: true, exists: () => false,
  }).skip, false);
});
