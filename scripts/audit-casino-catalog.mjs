import fs from "node:fs";

const catalogFiles = [
  "src/lib/nightlife/casino-catalog.ts",
  ...Array.from({ length: 26 }, (_, index) => `src/lib/nightlife/casino-catalog-pass-${index + 2}.ts`),
];
const manifestFiles = ["audit/casino-sources.json", "audit/casino-sources-integration.json"];

const records = [];
const casinoPattern = /casino\(\s*(["'])(.*?)\1\s*,\s*(["'])(.*?)\3\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g;
const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

for (const file of catalogFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Casino catalog audit failed:\n- missing catalog file: ${file}`);
    process.exit(1);
  }
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(casinoPattern)) {
    records.push({ file, id: match[2], name: match[4], lat: Number(match[5]), lon: Number(match[6]) });
  }
}

const failures = [];
const duplicateWarnings = [];
const ids = new Map();
const names = new Map();
for (const record of records) {
  if (ids.has(record.id)) duplicateWarnings.push(`duplicate id: ${record.id} (${ids.get(record.id)} / ${record.file})`); else ids.set(record.id, record.file);
  const normalizedName = normalizeName(record.name);
  if (names.has(normalizedName)) duplicateWarnings.push(`duplicate normalized name: ${record.name}`); else names.set(normalizedName, record.file);
  if (!Number.isFinite(record.lat) || record.lat < 18 || record.lat > 72) failures.push(`implausible US latitude: ${record.name} ${record.lat}`);
  if (!Number.isFinite(record.lon) || record.lon < -180 || record.lon > -60) failures.push(`implausible US longitude: ${record.name} ${record.lon}`);
}

const jurisdictions = {};
for (const manifestFile of manifestFiles) {
  if (!fs.existsSync(manifestFile)) {
    failures.push(`missing manifest file: ${manifestFile}`);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  Object.assign(jurisdictions, manifest.jurisdictions ?? {});
}

for (const [jurisdiction, value] of Object.entries(jurisdictions).filter(([, value]) => value?.status === "complete")) {
  const expected = Number(value.expectedCount);
  if (!Number.isInteger(expected) || expected < 1) {
    failures.push(`${jurisdiction}: invalid expectedCount in manifest`);
    continue;
  }
  const actual = catalogFiles.reduce((sum, file) => {
    const source = fs.readFileSync(file, "utf8");
    const escaped = jurisdiction.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const helperJurisdiction = new RegExp(`jurisdiction:\\s*["']${escaped}["']`);
    const argumentJurisdiction = new RegExp(`["']${escaped}["']`, "g");
    if (helperJurisdiction.test(source)) return sum + [...source.matchAll(casinoPattern)].length;
    return sum + (source.match(argumentJurisdiction) ?? []).length;
  }, 0);
  if (actual < expected) failures.push(`${jurisdiction}: expected at least ${expected} audited records, found ${actual}`);
}

if (duplicateWarnings.length) {
  console.warn("Casino catalog duplicate reconciliation warnings:\n" + duplicateWarnings.map((warning) => `- ${warning}`).join("\n"));
}
if (failures.length) {
  console.error("Casino catalog audit failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Casino catalog audit passed for ${records.length} explicit curated records across ${catalogFiles.length} catalog files (${duplicateWarnings.length} duplicate reconciliation warnings).`);
