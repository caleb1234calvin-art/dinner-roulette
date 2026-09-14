import { existsSync } from "node:fs";
import { join } from "node:path";

// This external assistant package and AGENTS.md are deliberately gitignored.
// Installed contracts still run unchanged. REQUIRE_WORKSPACE_DOCS=1 also
// requires the external package to be present.
export function workspaceDocsTestOptions(root, {
  exists = existsSync,
  required = process.env.REQUIRE_WORKSPACE_DOCS === "1",
} = {}) {
  return {
    skip: !required && !exists(join(root, ".grok/skills/og"))
      ? "External workspace OG documentation package is not installed in this checkout"
      : false,
  };
}
