import fs from "node:fs";
import { casinoSchemaFailures } from "./casino-schema.mjs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords, auditManifestCoverage, mergeJurisdictions } from "./casino-audit.mjs";

const manifestFiles = ["audit/casino-sources.json", "audit/casino-sources-integration.json"];

try {
  const { records, catalogs } = await loadCasinoCatalogs();

  const jurisdictions = mergeJurisdictions(manifestFiles.map((path) => ({
    path, data: JSON.parse(fs.readFileSync(path, "utf8")),
  })));
  const { failures, warnings, canonical, counts } = auditCasinoRecords(records, jurisdictions);
  failures.push(...auditManifestCoverage(counts, jurisdictions), ...casinoSchemaFailures(records));
  if (warnings.length) {
    console.warn("Casino catalog reconciliation warnings:\n" + warnings.map((warning) => "- " + warning).join("\n"));
  }
  console.log("Canonical jurisdiction counts: " + JSON.stringify(counts));
  if (process.argv.includes("--inventory")) {
    for (const record of canonical) {
      console.log("CASINO_INVENTORY " + JSON.stringify(record));
    }
  }
  if (failures.length) throw new Error(failures.map((failure) => "- " + failure).join("\n"));
  console.log("Casino catalog audit passed: " + records.length + " serialized records, "
    + canonical.length + " canonical destinations across " + catalogs.length + " catalog files.");
} catch (error) {
  console.error("Casino catalog audit failed:\n" + error.message);
  process.exitCode = 1;
}
