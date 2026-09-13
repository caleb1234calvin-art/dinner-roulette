import { STATE_NAMES } from "./casino-audit.mjs";

const bounds = {
  NV: [35.00, 42.01, -120.01, -114.03],
  OK: [33.60, 37.01, -103.01, -94.42],
  CO: [36.99, 41.01, -109.06, -102.03],
  TX: [25.83, 36.51, -106.66, -93.50],
};
const webUrl = (value) => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
};

export function casinoSchemaFailures(records) {
  const failures = [];
  for (const record of records) {
    const label = record?.id || "(missing ID)";
    const bad = (field) => failures.push(label + ": invalid " + field);
    if (!record || typeof record !== "object") { bad("record"); continue; }
    for (const key of ["id", "name", "address", "cuisineLabel"]) {
      if (typeof record[key] !== "string" || !record[key].trim() || record[key] !== record[key].trim()) bad(key);
    }
    if (typeof record.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(record.id)) bad("ID format");
    if (record.source !== "catalog" || record.cuisineLabel !== "Casino"
      || !Array.isArray(record.venueTypes) || record.venueTypes.length !== 1 || record.venueTypes[0] !== "casino") bad("casino category/source");
    if (!Array.isArray(record.cuisines) || record.cuisines.length !== 1 || record.cuisines[0] !== "other") bad("casino cuisine");
    if (![1, 2, 3].includes(record.energyLevel) || typeof record.isChain !== "boolean"
      || !["american", "pizza", "mexican", "italian", "asian", "thai", "mediterranean", "steak", "bbq", "seafood", "cafe", "dessert"].includes(record.photoKey)) bad("presentation fields");
    for (const key of ["openingHours", "phone", "website"]) {
      if (record[key] !== null && (typeof record[key] !== "string" || !record[key].trim())) bad(key);
    }
    if (record.website !== null && !webUrl(record.website)) bad("website URL");
    if (record.priceLevel !== null && ![1, 2, 3, 4].includes(record.priceLevel)) bad("priceLevel");
    if (record.rating !== null && (!Number.isFinite(record.rating) || record.rating < 0 || record.rating > 5)) bad("rating");
    if (record.reviewCount !== null && (!Number.isSafeInteger(record.reviewCount) || record.reviewCount < 0)) bad("reviewCount");
    if (!Number.isFinite(record.lat) || record.lat < -90 || record.lat > 90
      || !Number.isFinite(record.lon) || record.lon < -180 || record.lon > 180) bad("coordinate");
    const state = typeof record.address === "string" ? record.address.match(/,\s*([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/)?.[1] : undefined;
    if (!state || !STATE_NAMES[state]) bad("address state");
    if (record.audit?.jurisdiction && record.audit.jurisdiction !== STATE_NAMES[state]) bad("jurisdiction/address disagreement");
    const box = bounds[state];
    if (box && (record.lat < box[0] || record.lat > box[1] || record.lon < box[2] || record.lon > box[3])) bad("state bounding box");
    // Source gaps in legacy passes are reported separately, not invented away.
    // All new RC passes require explicit current identity and point provenance.
    if (Number(record.file?.match(/-pass-(\d+)\.ts$/)?.[1] ?? 1) >= 51) {
      if (!webUrl(record.audit?.identitySource) || !webUrl(record.audit?.coordinateSource)) bad("new-record source evidence");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(record.audit?.verifiedOn ?? "")
        || Number.isNaN(Date.parse(record.audit?.verifiedOn))) bad("verification date");
    }
  }
  return failures;
}
