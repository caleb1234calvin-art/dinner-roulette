import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";

const file = "src/lib/nightlife/casino-catalog-pass-50.ts";
const { outputText } = ts.transpileModule(fs.readFileSync(file, "utf8"), {
  fileName: file,
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { CASINO_CATALOG_PASS_50: places } = await import(
  "data:text/javascript;base64," + Buffer.from(outputText).toString("base64")
);
const qa = JSON.parse(fs.readFileSync("audit/casino-frontier-coordinate-qa-2026-09-13.json", "utf8"));

test("Pass 50 has exactly four distinct evidence-backed physical destinations", () => {
  assert.equal(places.length, 4);
  assert.equal(new Set(places.map((place) => place.id)).size, 4);
  assert.equal(places.filter((place) => place.audit.jurisdiction === "Nevada").length, 1);
  assert.equal(places.filter((place) => place.audit.jurisdiction === "Oklahoma").length, 3);
  assert.equal(places.some((place) => /dotty/i.test(place.name)), false);
  for (const place of places) {
    const evidence = qa.records.find((record) => record.id === place.id);
    assert.ok(evidence, place.id + " needs current-property evidence");
    for (const field of ["name", "lat", "lon", "address"]) assert.equal(place[field], evidence[field]);
    assert.equal(place.audit.coordinateSource, evidence.coordinateSource);
  }
});

test("runtime points use source destination fields, never map viewport centres", () => {
  for (const record of qa.records) {
    const evidence = record.coordinateEvidence;
    if (evidence.fields?.geo) {
      assert.equal(record.lat, evidence.fields.geo.latitude);
      assert.equal(record.lon, evidence.fields.geo.longitude);
      assert.equal(record.name, evidence.fields.name);
    } else {
      const destination = evidence.finalUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
      assert.ok(destination, record.id + " needs numerical destination fields");
      assert.equal(record.lat, Number(destination[1]));
      assert.equal(record.lon, Number(destination[2]));
      assert.equal(record.coordinateSource, evidence.publishedLink);
    }
    for (const rejected of record.excluded ?? []) {
      if (rejected.lat != null) {
        assert.notDeepEqual([record.lat, record.lon], [rejected.lat, rejected.lon]);
      }
    }
  }
  const eufaula = places.find((place) => place.id === "casino-catalog-ok-lake-eufaula");
  assert.equal(eufaula.lon, -95.5921671);
  assert.notEqual(eufaula.lon, -95.594742);
});

test("Cadence Crossing remains tied to corrected named-property evidence", async () => {
  const path = "src/lib/nightlife/casino-catalog-pass-49.ts";
  const { outputText } = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    fileName: path,
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const module = await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));
  const place = module.CASINO_CATALOG_PASS_49[0];
  const correction = JSON.parse(fs.readFileSync("audit/cadence-crossing-coordinate-correction-2026-09-13.json", "utf8"));
  const source = correction.evidence.find((entry) => entry.fields?.geo);
  assert.deepEqual([place.lat, place.lon], [source.fields.geo.latitude, source.fields.geo.longitude]);
  assert.notDeepEqual([place.lat, place.lon], [36.08622, -115.03321]);
});
