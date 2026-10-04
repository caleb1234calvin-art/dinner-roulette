import { pathToFileURL } from "node:url";
import { buildFile } from "./io.ts";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output, previous, ...extra] = process.argv.slice(2);
  if (!input || !output || extra.length) throw new Error("Usage: node tools/seasonal-facts/cli.ts input.json output-bundle.json [last-good-bundle.json]");
  const result = buildFile(input, output, previous);
  console.log(JSON.stringify({ contentRevision: result.manifest.contentRevision, published: result.manifest.publishedCount,
    quarantined: result.exclusions.length, networkEnabled: false }));
}
