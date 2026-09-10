import fs from "node:fs";

const catalogFiles = [
  "src/lib/nightlife/casino-catalog.ts",
  "src/lib/nightlife/casino-catalog-pass-2.ts",
  "src/lib/nightlife/casino-catalog-pass-3.ts",
  "src/lib/nightlife/casino-catalog-pass-4.ts",
  "src/lib/nightlife/casino-catalog-pass-5.ts",
  "src/lib/nightlife/casino-catalog-pass-6.ts",
  "src/lib/nightlife/casino-catalog-pass-7.ts",
  "src/lib/nightlife/casino-catalog-pass-8.ts",
  "src/lib/nightlife/casino-catalog-pass-9.ts",
  "src/lib/nightlife/casino-catalog-pass-10.ts",
  "src/lib/nightlife/casino-catalog-pass-11.ts",
  "src/lib/nightlife/casino-catalog-pass-12.ts",
  "src/lib/nightlife/casino-catalog-pass-13.ts",
  "src/lib/nightlife/casino-catalog-pass-14.ts",
  "src/lib/nightlife/casino-catalog-pass-15.ts",
  "src/lib/nightlife/casino-catalog-pass-16.ts",
  "src/lib/nightlife/casino-catalog-pass-17.ts",
  "src/lib/nightlife/casino-catalog-pass-18.ts",
  "src/lib/nightlife/casino-catalog-pass-19.ts",
  "src/lib/nightlife/casino-catalog-pass-20.ts",
  "src/lib/nightlife/casino-catalog-pass-21.ts",
  "src/lib/nightlife/casino-catalog-pass-22.ts",
  "src/lib/nightlife/casino-catalog-pass-23.ts",
  "src/lib/nightlife/casino-catalog-pass-24.ts",
];
const manifestFiles = ["audit/casino-sources.json", "audit/casino-sources-pass-21.json", "audit/casino-sources-pass-22.json", "audit/casino-sources-pass-23.json", "audit/casino-sources-pass-24.json"];

const records = [];
const pattern = /casino\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g;
for (const file of catalogFiles) {
  if (!fs.existsSync(file)) { console.error(`Casino catalog audit failed:\n- missing catalog file: ${file}`); process.exit(1); }
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(pattern)) records.push({ file, id: match[1], name: match[2], lat: Number(match[3]), lon: Number(match[4]) });
}
const failures = [];
const ids = new Map(); const names = new Map();
for (const record of records) {
  if (ids.has(record.id)) failures.push(`duplicate id: ${record.id} (${ids.get(record.id)} / ${record.file})`); else ids.set(record.id, record.file);
  const normalizedName = record.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (names.has(normalizedName)) failures.push(`duplicate normalized name: ${record.name}`); else names.set(normalizedName, record.file);
  if (!Number.isFinite(record.lat) || record.lat < 18 || record.lat > 72) failures.push(`implausible US latitude: ${record.name} ${record.lat}`);
  if (!Number.isFinite(record.lon) || record.lon < -180 || record.lon > -60) failures.push(`implausible US longitude: ${record.name} ${record.lon}`);
}
const jurisdictions = {};
for (const manifestFile of manifestFiles) {
  if (!fs.existsSync(manifestFile)) { failures.push(`missing manifest file: ${manifestFile}`); continue; }
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  Object.assign(jurisdictions, manifest.jurisdictions ?? {});
}
for (const [jurisdiction, value] of Object.entries(jurisdictions).filter(([, value]) => value?.status === "complete")) {
  const expected = Number(value.expectedCount);
  if (!Number.isInteger(expected) || expected < 1) { failures.push(`${jurisdiction}: invalid expectedCount in manifest`); continue; }
  const actual = catalogFiles.reduce((sum, file) => {
    const source = fs.readFileSync(file, "utf8");
    const escaped = jurisdiction.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const helperJurisdiction = new RegExp(`jurisdiction:\\s*["']${escaped}["']`);
    const argumentJurisdiction = new RegExp(`["']${escaped}["']`, "g");
    if (helperJurisdiction.test(source)) return sum + [...source.matchAll(pattern)].length;
    return sum + (source.match(argumentJurisdiction) ?? []).length;
  }, 0);
  if (actual < expected) failures.push(`${jurisdiction}: expected at least ${expected} audited records, found ${actual}`);
}
if (failures.length) { console.error("Casino catalog audit failed:\n" + failures.map((failure) => `- ${failure}`).join("\n")); process.exit(1); }
console.log(`Casino catalog audit passed for ${records.length} explicit curated records across ${catalogFiles.length} catalog files.`);
