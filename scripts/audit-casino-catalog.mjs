import fs from "node:fs";
import ts from "typescript";
import { auditCasinoRecords, mergeJurisdictions } from "./casino-audit.mjs";

const catalogFiles = [
  "src/lib/nightlife/casino-catalog.ts",
  ...Array.from({ length: 48 }, (_, index) => `src/lib/nightlife/casino-catalog-pass-${index + 2}.ts`),
];
const manifestFiles = ["audit/casino-sources.json", "audit/casino-sources-integration.json"];

try {
  const records = [];
  for (const file of catalogFiles) {
    const source = fs.readFileSync(file, "utf8");
    // Catalog modules are self-contained except for type-only imports. Execute
    // their transpiled exports so factory-added IDs and audit metadata survive.
    const { outputText } = ts.transpileModule(source, {
      fileName: file,
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    const catalog = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
    const exportName = file.endsWith("/casino-catalog.ts")
      ? "CASINO_CATALOG"
      : "CASINO_CATALOG_PASS_" + file.match(/-pass-(\d+)\.ts$/)[1];
    const places = catalog[exportName];
    if (!Array.isArray(places) || places.length === 0) {
      throw new Error(file + ": missing or empty " + exportName);
    }
    records.push(...places.map((place) => ({ ...place, file })));
  }

  const jurisdictions = mergeJurisdictions(manifestFiles.map((path) => ({
    path, data: JSON.parse(fs.readFileSync(path, "utf8")),
  })));
  const { failures, warnings, canonical, counts } = auditCasinoRecords(records, jurisdictions);
  if (warnings.length) {
    console.warn("Casino catalog reconciliation warnings:\n" + warnings.map((warning) => "- " + warning).join("\n"));
  }
  console.log("Canonical jurisdiction counts: " + JSON.stringify(counts));
  if (failures.length) throw new Error(failures.map((failure) => "- " + failure).join("\n"));
  console.log("Casino catalog audit passed: " + records.length + " serialized records, "
    + canonical.length + " canonical destinations across " + catalogFiles.length + " catalog files.");
} catch (error) {
  console.error("Casino catalog audit failed:\n" + error.message);
  process.exitCode = 1;
}
