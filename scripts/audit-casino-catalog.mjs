import fs from "node:fs";

const files = [
  "src/lib/nightlife/casino-catalog.ts",
  "src/lib/nightlife/casino-catalog-pass-2.ts",
  "src/lib/nightlife/casino-catalog-pass-3.ts",
  "src/lib/nightlife/casino-catalog-pass-4.ts",
  "src/lib/nightlife/casino-catalog-pass-5.ts",
];

const records = [];
const pattern = /casino\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Casino catalog audit failed:\n- missing catalog file: ${file}`);
    process.exit(1);
  }
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(pattern)) {
    records.push({ file, id: match[1], name: match[2], lat: Number(match[3]), lon: Number(match[4]) });
  }
}

const failures = [];
const ids = new Map();
const names = new Map();
for (const record of records) {
  if (ids.has(record.id)) failures.push(`duplicate id: ${record.id} (${ids.get(record.id)} / ${record.file})`);
  else ids.set(record.id, record.file);

  const normalizedName = record.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (names.has(normalizedName)) failures.push(`duplicate normalized name: ${record.name}`);
  else names.set(normalizedName, record.file);

  if (!Number.isFinite(record.lat) || record.lat < 18 || record.lat > 72) failures.push(`implausible US latitude: ${record.name} ${record.lat}`);
  if (!Number.isFinite(record.lon) || record.lon < -180 || record.lon > -60) failures.push(`implausible US longitude: ${record.name} ${record.lon}`);
}

const expectedJurisdictionCounts = {
  "New Jersey": 9,
  Pennsylvania: 18,
  Maryland: 6,
  Massachusetts: 3,
  Connecticut: 2,
  Michigan: 27,
  Ohio: 11,
  Indiana: 14,
  Illinois: 17,
};

const allSource = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
for (const [jurisdiction, expected] of Object.entries(expectedJurisdictionCounts)) {
  const escaped = jurisdiction.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const actual = (allSource.match(new RegExp(`\\"${escaped}\\"`, "g")) ?? []).length;
  if (actual < expected) failures.push(`${jurisdiction}: expected at least ${expected} audited records, found ${actual}`);
}

if (failures.length) {
  console.error("Casino catalog audit failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Casino catalog audit passed for ${records.length} explicit curated records across ${files.length} catalog files.`);
