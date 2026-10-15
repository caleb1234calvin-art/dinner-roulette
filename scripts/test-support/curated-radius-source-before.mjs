import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const bytes = readFileSync(new URL("./curated-radius-source-baseline.json", import.meta.url));
assert.equal(hash(bytes), "552cc61c35a4614dcd5db0a60d498704bec18fac0b3abcdb9456c78fdcbd4ad4");
const amendment = JSON.parse(bytes);
assert.equal(amendment.path, "src/lib/date-night/radial-session.ts");
assert.equal(amendment.baseCommit, "991978fe24ec165eeacd5500a26d66f35d86c560");

/** Preserve every historical byte receipt. Only the fully pinned D2 session
 * source maps to its fully pinned original; all other input bytes pass through. */
export function curatedRadiusSourceBefore(path, source) {
  if (path !== amendment.path) return source;
  assert.equal(hash(source), amendment.afterSha256, "Exact D2 session source");
  assert.equal(hash(amendment.beforeSource), amendment.beforeSha256, "Exact pre-D2 session source");
  return Buffer.from(amendment.beforeSource);
}
