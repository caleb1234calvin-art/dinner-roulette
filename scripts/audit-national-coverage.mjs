import fs from "node:fs";

const manifestPath = "audit/casino-sources.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const failures = [];

for (const [jurisdiction, info] of Object.entries(manifest.jurisdictions)) {
  if (!info.source) failures.push(`${jurisdiction}: missing authoritative source`);
  if (!Number.isInteger(info.expectedCount) || info.expectedCount < 1) failures.push(`${jurisdiction}: invalid expectedCount`);
  if (!["complete", "inventory", "pending"].includes(info.status)) failures.push(`${jurisdiction}: invalid status ${info.status}`);

  if (info.snapshot) {
    if (!fs.existsSync(info.snapshot)) {
      failures.push(`${jurisdiction}: missing snapshot ${info.snapshot}`);
      continue;
    }
    const snapshot = JSON.parse(fs.readFileSync(info.snapshot, "utf8"));
    if (snapshot.count !== info.expectedCount) failures.push(`${jurisdiction}: snapshot count ${snapshot.count} != expected ${info.expectedCount}`);
    if (Array.isArray(snapshot.records) && snapshot.records.length !== snapshot.count) {
      failures.push(`${jurisdiction}: snapshot declares ${snapshot.count}, contains ${snapshot.records.length} records`);
    }
    if (Array.isArray(snapshot.records)) {
      const ids = new Set();
      const names = new Set();
      for (const row of snapshot.records) {
        const [id, name] = row;
        if (!id || !name) failures.push(`${jurisdiction}: malformed inventory row`);
        if (ids.has(id)) failures.push(`${jurisdiction}: duplicate authority ID ${id}`);
        ids.add(id);
        const key = String(name).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        if (names.has(key)) failures.push(`${jurisdiction}: duplicate normalized authority name ${name}`);
        names.add(key);
      }
    }
  }
}

const benchmark = manifest.nationalBenchmarks?.agaCurrentCasinoLocations;
if (!benchmark || benchmark.count < 900 || benchmark.states < 40) failures.push("National AGA completeness benchmark is missing or implausible");
const tribal = manifest.nationalBenchmarks?.nigcFy2025GamingEstablishments;
if (!tribal || tribal.count < 500 || tribal.states < 20) failures.push("National NIGC tribal benchmark is missing or implausible");

if (failures.length) {
  console.error("National casino coverage audit failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

const complete = Object.values(manifest.jurisdictions).filter((x) => x.status === "complete").length;
const inventory = Object.values(manifest.jurisdictions).filter((x) => x.status === "inventory").length;
console.log(`National coverage audit passed: ${complete} complete jurisdictions, ${inventory} authoritative inventories staged.`);
