import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";
import { auditCasinoRecords } from "./casino-audit.mjs";

async function loadCatalog(file, exportName) {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const module = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
  return module[exportName].map((place) => ({ ...place, file }));
}

for (const { label, stableId, pass, jurisdiction, lat, lon } of [
  { label: "Beau Rivage", stableId: "casino-catalog-beau-rivage", pass: 16,
    jurisdiction: "Mississippi", lat: 30.3924332, lon: -88.8914837 },
  { label: "MGM Grand Las Vegas", stableId: "casino-catalog-mgm-grand-las-vegas", pass: 22,
    jurisdiction: "Nevada", lat: 36.10271, lon: -115.16985 },
]) {
  test(label + " keeps its original stable ID and one latest-property destination", async () => {
    const backbone = await loadCatalog("src/lib/nightlife/casino-catalog.ts", "CASINO_CATALOG");
    const newer = await loadCatalog("src/lib/nightlife/casino-catalog-pass-" + pass + ".ts", "CASINO_CATALOG_PASS_" + pass);
    const olderRecord = backbone.find((record) => record.id === stableId);
    const newerRecord = newer.find((record) => record.id === stableId);
    assert.ok(olderRecord);
    assert.ok(newerRecord, "The later alias must preserve the original stable ID");
    const result = auditCasinoRecords([olderRecord, newerRecord], {
      [jurisdiction]: { status: "complete", expectedCount: 1 },
    });
    assert.deepEqual(result.failures, []);
    assert.equal(result.canonical.length, 1);
    assert.equal(result.canonical[0].lat, lat);
    assert.equal(result.canonical[0].lon, lon);
    assert.equal(result.canonical[0].name, newerRecord.name);
  });
}
