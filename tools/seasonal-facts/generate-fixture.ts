import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fixtureInput } from "./fixtures.ts";
import { buildSnapshot } from "./builder.ts";
import { writeSnapshot } from "./io.ts";
import { canonical } from "./canonical.ts";

// Review exports only. bundle.json is the sole atomic consumption unit.
const directory = new URL("./generated/", import.meta.url);
mkdirSync(directory, { recursive: true });
const input = fixtureInput(), snapshot = buildSnapshot(input);
writeSnapshot(fileURLToPath(new URL("bundle.json", directory)), snapshot);
const artifacts = { "input.synthetic": input, manifest: snapshot.manifest, runtime: snapshot.runtime,
  "field-source-map": snapshot.fieldSourceMap, exclusions: snapshot.exclusions,
  tombstones: snapshot.tombstones, ledger: snapshot.ledger, diff: snapshot.diff };
for (const [name, data] of Object.entries(artifacts)) writeFileSync(new URL(`${name}.json`, directory), canonical(data) + "\n");
writeFileSync(new URL("diff.txt", directory), snapshot.diff);
console.log(JSON.stringify({ contentRevision: snapshot.manifest.contentRevision, published: snapshot.manifest.publishedCount,
  reviewedIdentities: snapshot.manifest.reviewedIdentityCount, quarantine: snapshot.exclusions.length, network: "disabled" }));
