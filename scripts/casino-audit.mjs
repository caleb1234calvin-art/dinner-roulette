// Keep canonicalization aligned with src/lib/nightlife/search.ts.
const SAME_PROPERTY_MILES = 0.35;
const STATE_NAMES = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
  WI: "Wisconsin", WY: "Wyoming",
};
const normalizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const milesBetween = (a, b) => {
  const toRad = (degrees) => degrees * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  // Use the same radius and formula as the runtime haversineMiles helper.
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export function mergeJurisdictions(manifests) {
  const jurisdictions = Object.create(null);
  for (const { path, data } of manifests) {
    const entries = data?.jurisdictions;
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
      throw new Error(path + ": jurisdictions must be an object keyed by jurisdiction name");
    }
    for (const [name, info] of Object.entries(entries)) {
      if (!info || typeof info !== "object" || Array.isArray(info)) {
        throw new Error(path + ": invalid jurisdiction record for " + name);
      }
      // Integration overrides supersede base inventory records.
      jurisdictions[name] = info;
    }
  }
  return jurisdictions;
}

export function auditCasinoRecords(records, jurisdictions) {
  const failures = [];
  const warnings = [];
  const canonical = [];
  const previousById = new Map();
  const previousByName = new Map();

  for (const original of records) {
    const label = String(original.name || original.id || "(unnamed)") + " in " + original.file;
    if (typeof original.id !== "string" || !original.id.trim()
      || typeof original.name !== "string" || !original.name.trim()) {
      failures.push("invalid casino identity: " + label);
      continue;
    }
    if (!Number.isFinite(original.lat) || original.lat < 24 || original.lat > 50
      || !Number.isFinite(original.lon) || original.lon < -125 || original.lon > -66) {
      failures.push("implausible coordinate: " + label + " (" + original.lat + ", " + original.lon + ")");
      continue;
    }
    const stateCode = typeof original.address === "string"
      ? original.address.match(/,\s*([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/)?.[1]
      : undefined;
    const jurisdiction = original.audit?.jurisdiction || STATE_NAMES[stateCode];
    if (!jurisdiction || !Object.values(STATE_NAMES).includes(jurisdiction)) {
      failures.push("missing or invalid jurisdiction: " + label);
    }
    const record = { ...original, jurisdiction };
    const key = normalizeName(record.name);
    for (const previous of previousById.get(record.id) ?? []) {
      const distance = milesBetween(previous, record);
      const context = record.id + " (" + previous.file + " / " + record.file + ", " + distance.toFixed(3) + " mi)";
      if (distance < SAME_PROPERTY_MILES) {
        warnings.push("duplicate id: " + context + "; latest pass wins at runtime");
      } else {
        failures.push("duplicate id at distinct locations: " + context);
      }
    }
    for (const previous of previousByName.get(key) ?? []) {
      const distance = milesBetween(previous, record);
      warnings.push((distance < SAME_PROPERTY_MILES
        ? "duplicate name, latest pass wins: "
        : "same name at distinct locations retained: ")
        + record.name + " (" + previous.file + " / " + record.file + ", " + distance.toFixed(3) + " mi)");
    }
    previousById.set(record.id, [...(previousById.get(record.id) ?? []), record]);
    previousByName.set(key, [...(previousByName.get(key) ?? []), record]);
    // Do not count raw rows or ID prefixes: match actual chronological runtime behavior.
    const matchIndex = canonical.findIndex((candidate) =>
      (candidate.id === record.id || normalizeName(candidate.name) === key)
      && milesBetween(candidate, record) < SAME_PROPERTY_MILES);
    if (matchIndex >= 0) canonical[matchIndex] = record;
    else canonical.push(record);
  }

  const counts = Object.create(null);
  for (const record of canonical) {
    if (record.jurisdiction) counts[record.jurisdiction] = (counts[record.jurisdiction] ?? 0) + 1;
  }
  for (const [jurisdiction, info] of Object.entries(jurisdictions)) {
    if (info.status !== "complete") continue;
    if (!Number.isInteger(info.expectedCount) || info.expectedCount < 1) {
      failures.push("invalid expectedCount for complete jurisdiction: " + jurisdiction);
      continue;
    }
    const actual = counts[jurisdiction] ?? 0;
    if (actual !== info.expectedCount) {
      failures.push("complete jurisdiction count mismatch: " + jurisdiction
        + " expected " + info.expectedCount + ", found " + actual);
    }
  }
  return { failures, warnings, canonical, counts };
}

export function auditManifestCoverage(counts, jurisdictions) {
  return Object.keys(counts)
    .filter((jurisdiction) => !Object.hasOwn(jurisdictions, jurisdiction))
    .map((jurisdiction) => "runtime jurisdiction missing from manifest: " + jurisdiction);
}

export function validateJurisdictionMetadata(jurisdictions) {
  const failures = [];
  for (const [jurisdiction, info] of Object.entries(jurisdictions)) {
    if (typeof info.source !== "string" || !info.source.trim()) {
      failures.push(jurisdiction + ": missing authoritative source");
    }
    if (!["complete", "inventory", "pending"].includes(info.status)) {
      failures.push(jurisdiction + ": invalid status " + info.status);
    }
    // Pending scope may genuinely have no known statewide total. A supplied
    // count must still be valid; complete/inventory records always need one.
    if (info.status !== "pending" || info.expectedCount != null) {
      if (!Number.isInteger(info.expectedCount) || info.expectedCount < 1) {
        failures.push(jurisdiction + ": invalid expectedCount");
      }
    }
  }
  return failures;
}
