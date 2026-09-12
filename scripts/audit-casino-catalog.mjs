import fs from "node:fs";

const catalogFiles = [
  "src/lib/nightlife/casino-catalog.ts",
  ...Array.from({ length: 33 }, (_, index) => `src/lib/nightlife/casino-catalog-pass-${index + 2}.ts`),
];
const manifestFiles = ["audit/casino-sources.json", "audit/casino-sources-integration.json"];
const SAME_PROPERTY_MILES = 0.35;

const records = [];
const casinoPattern = /casino\(\s*(["'])(.*?)\1\s*,\s*(["'])(.*?)\3\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g;
const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const haversineMiles = (aLat, aLon, bLat, bLon) => {
  const toRad = (degrees) => degrees * Math.PI / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 3958.7613 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
};

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
function reconcileId(record, previous) {
  const distance = haversineMiles(previous.lat, previous.lon, record.lat, record.lon);
  if (distance < SAME_PROPERTY_MILES) {
    duplicateWarnings.push(`duplicate id: ${record.name} (${previous.file} / ${record.file}, ${distance.toFixed(3)} mi; latest pass wins at runtime)`);
    return;
  }
  failures.push(`duplicate id at distinct locations: ${record.id} (${previous.name} / ${record.name}, ${distance.toFixed(2)} mi; ${previous.file} / ${record.file})`);
}
function reconcileName(record, previous) {
  const distance = haversineMiles(previous.lat, previous.lon, record.lat, record.lon);
  if (distance < SAME_PROPERTY_MILES) {
    duplicateWarnings.push(`duplicate normalized name: ${record.name} (${previous.file} / ${record.file}, ${distance.toFixed(3)} mi; latest pass wins at runtime)`);
    return;
  }
  duplicateWarnings.push(`shared normalized name at distinct properties: ${record.name} (${previous.file} / ${record.file}, ${distance.toFixed(2)} mi; retained as separate runtime destinations)`);
}
for (const record of records) {
  const previousId = ids.get(record.id);
  if (previousId) reconcileId(record, previousId); else ids.set(record.id, record);
  const normalizedName = normalizeName(record.name);
  const previousName = names.get(normalizedName);
  if (previousName) reconcileName(record, previousName); else names.set(normalizedName, record);
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

function countJurisdictionRecords(source, jurisdiction) {
  const escaped = jurisdiction.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const helperJurisdiction = new RegExp(`jurisdiction:\\s*["']${escaped}["']`);
  const helperConstant = source.match(/const\s+JURISDICTION\s*=\s*["']([^"']+)["']/)?.[1];
  if (helperJurisdiction.test(source) || helperConstant === jurisdiction) return [...source.matchAll(casinoPattern)].length;
  const argumentJurisdiction = new RegExp(`["']${escaped}["']`, "g");
  return (source.match(argumentJurisdiction) ?? []).length;
}

for (const [jurisdiction, value] of Object.entries(jurisdictions).filter(([, value]) => value?.status === "complete")) {
  const expected = Number(value.expectedCount);
  if (!Number.isInteger(expected) || expected < 1) {
    failures.push(`${jurisdiction}: invalid expectedCount in manifest`);
    continue;
  }
  const actual = catalogFiles.reduce((sum, file) => sum + countJurisdictionRecords(fs.readFileSync(file, "utf8"), jurisdiction), 0);
  if (actual < expected) failures.push(`${jurisdiction}: expected at least ${expected} audited records, found ${actual}`);
}

if (duplicateWarnings.length) {
  console.warn("Casino catalog reconciliation warnings:\n" + duplicateWarnings.map((warning) => `- ${warning}`).join("\n"));
}
if (failures.length) {
  console.error("Casino catalog audit failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Casino catalog audit passed for ${records.length} explicit curated records across ${catalogFiles.length} catalog files (${duplicateWarnings.length} reconciliation warnings).`);
