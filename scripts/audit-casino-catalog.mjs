import fs from "node:fs";

const catalogFiles = [
  "src/lib/nightlife/casino-catalog.ts",
  ...Array.from({ length: 48 }, (_, index) => `src/lib/nightlife/casino-catalog-pass-${index + 2}.ts`),
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

for (const record of records) {
  if (!Number.isFinite(record.lat) || record.lat < 24 || record.lat > 50 || !Number.isFinite(record.lon) || record.lon < -125 || record.lon > -66) {
    failures.push(`implausible coordinate: ${record.name} (${record.lat}, ${record.lon}) in ${record.file}`);
  }
  const previousId = ids.get(record.id);
  if (previousId) reconcileId(record, previousId);
  ids.set(record.id, record);

  const key = normalizeName(record.name);
  const previousNames = names.get(key) ?? [];
  for (const previousName of previousNames) {
    const distance = haversineMiles(previousName.lat, previousName.lon, record.lat, record.lon);
    if (distance < SAME_PROPERTY_MILES) duplicateWarnings.push(`duplicate name: ${record.name} (${previousName.file} / ${record.file}, ${distance.toFixed(3)} mi; latest pass wins at runtime)`);
    else duplicateWarnings.push(`same name at distinct locations retained: ${record.name} (${previousName.file} / ${record.file}, ${distance.toFixed(2)} mi)`);
  }
  previousNames.push(record);
  names.set(key, previousNames);
}

for (const manifestFile of manifestFiles) {
  if (!fs.existsSync(manifestFile)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  for (const jurisdiction of manifest.jurisdictions ?? []) {
    if (jurisdiction.status !== "complete" || jurisdiction.expectedCount == null) continue;
    const state = jurisdiction.state;
    const prefix = `casino-catalog-${String(state).toLowerCase()}-`;
    const canonical = new Map();
    for (const record of records.filter((candidate) => candidate.id.startsWith(prefix))) canonical.set(record.id, record);
    if (canonical.size !== jurisdiction.expectedCount) failures.push(`complete jurisdiction count mismatch: ${state} expected ${jurisdiction.expectedCount}, found ${canonical.size}`);
  }
}

if (duplicateWarnings.length) {
  console.warn("Casino catalog reconciliation warnings:");
  for (const warning of duplicateWarnings) console.warn(`- ${warning}`);
}
if (failures.length) {
  console.error("Casino catalog audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Casino catalog audit passed: ${records.length} serialized records across ${catalogFiles.length} catalog files.`);
