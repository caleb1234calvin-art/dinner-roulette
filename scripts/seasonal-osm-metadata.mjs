/**
 * Offline-only OpenStreetMap/Overpass metadata adapter.
 * This module never fetches any URL, follows an operator website, or joins app runtime.
 * OSM metadata provides discovery leads, NOT confirmation of 2026 operations.
 * OSM attribution/ODbL obligations must be reviewed before public integration.
 */
const MAX_BYTES = 512_000;
const MAX_ELEMENTS = 100;
const MAX_PROPOSALS = 100;
const MAX_TEXT = 160;
const TYPES = new Set(["node", "way", "relation"]);
const LIFECYCLE_PREFIXES = ["disused:", "abandoned:", "demolished:", "removed:", "was:"];
const ATTRIBUTION = "© OpenStreetMap contributors";
const LICENSE = "ODbL-1.0";

function cleanText(input, max = MAX_TEXT) {
  return typeof input === "string" ? Array.from(input, ch => ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 ? " " : ch).join("").replace(/\s+/g, " ").trim().slice(0, max) : "";
}
function norm(value) {
  return cleanText(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}
function typeHints(tags) {
  const types = [];
  const attraction = tags.attraction;
  const maze = tags.leisure === "maze" || attraction === "maze";
  if (["haunted_house", "haunted_trail", "haunted_forest", "haunted_attraction"].includes(attraction))
    types.push("haunted-house");
  if (["corn_maze", "maize_maze"].includes(attraction) ||
    (maze && ["corn", "maize"].includes(tags["maze:type"] || tags.crop)))
    types.push("corn-maze");
  if (attraction === "pumpkin_patch") types.push("pumpkin-patch");
  return types;
}
function historicalTypeHints(tags) {
  const historical = {};
  for (const prefix of LIFECYCLE_PREFIXES) {
    for (const [key, value] of Object.entries(tags)) {
      if (!key.startsWith(prefix)) continue;
      const field = key.slice(prefix.length);
      if (["attraction", "leisure", "maze:type", "crop"].includes(field) &&
          typeof value === "string" && !Object.hasOwn(historical, field)) historical[field] = value;
    }
  }
  return typeHints(historical);
}
function lifecycleWarnings(tags) {
  const concerns = [];
  if (Object.keys(tags).some(k => LIFECYCLE_PREFIXES.some(prefix => k.startsWith(prefix))))
    concerns.push("mapped-lifecycle-negative-tag");
  if (["yes", "true", "permanently_closed"].includes(tags.disused) ||
    ["yes", "true"].includes(tags.abandoned) || ["yes", "true"].includes(tags.demolished) ||
    ["yes", "true"].includes(tags.closed))
    concerns.push("mapped-lifecycle-negative-state");
  return concerns;
}
function fullAddress(tags) {
  const street = cleanText(tags["addr:street"], 100);
  const house = cleanText(tags["addr:housenumber"], 30);
  const city = cleanText(tags["addr:city"], 100);
  const state = cleanText(tags["addr:state"], 60);
  const postcode = cleanText(tags["addr:postcode"], 16);
  return [ [house, street].filter(Boolean).join(" "), city, [state, postcode].filter(Boolean).join(" ") ]
    .filter(Boolean).join(", ").slice(0, 240) || null;
}
function position(element) {
  const candidate = element.type === "node" ? element : element.center;
  const lat = candidate?.lat;
  const lon = candidate?.lon;
  if (typeof lat !== "number" || typeof lon !== "number" ||
      !Number.isFinite(lat) || !Number.isFinite(lon) ||
      lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon, precision: "mapped-center-not-verified-entrance" };
}
function validElement(element) {
  return element && typeof element === "object" && TYPES.has(element.type) &&
    Number.isSafeInteger(element.id) && element.id > 0 &&
    element.tags && typeof element.tags === "object" && !Array.isArray(element.tags);
}

/**
 * @param {string|object} input - existing OFFLINE Overpass response or synthetic fixture
 * @returns research-only result; no result has a positive eligibility assertion
 */
export function adaptOsmSeasonalMetadata(input) {
  let envelope;
  if (typeof input === "string") {
    if (Buffer.byteLength(input, "utf8") > MAX_BYTES) return { status: "bounded-input-rejected", proposals: [] };
    try { envelope = JSON.parse(input); } catch { return { status: "malformed-response", proposals: [] }; }
  } else {
    // Offline object fixtures must obey the same byte cap as parsed network JSON.
    // This is an input-fidelity guard, not a CPU/memory sandbox for hostile objects.
    try {
      const snapshot = JSON.stringify(input);
      if (typeof snapshot !== "string") return { status: "malformed-response", proposals: [] };
      if (Buffer.byteLength(snapshot, "utf8") > MAX_BYTES)
        return { status: "bounded-input-rejected", proposals: [] };
      envelope = JSON.parse(snapshot);
    } catch {
      return { status: "malformed-response", proposals: [] };
    }
  }
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope) ||
    !Array.isArray(envelope.elements) || envelope.remark) {
    return { status: "malformed-response", proposals: [] };
  }
  // The limit is a hard safety bound, not permission to silently accept a positive subset.
  if (envelope.elements.length > MAX_ELEMENTS) {
    return { status: "coverage-incomplete", proposals: [],
      diagnostic: "element-count-limit", publicationEligible: false };
  }
  const proposals = [];
  const names = new Map();
  const identifiers = new Map();
  let discarded = 0;
  for (const element of envelope.elements) {
    if (!validElement(element)) { discarded++; continue; }
    const tags = element.tags;
    if (!Object.entries(tags).every(([key, value]) =>
      typeof key === "string" && typeof value === "string")) {
      discarded++;
      continue;
    }
    const activeHints = typeHints(tags);
    const historicalHints = historicalTypeHints(tags);
    if (!activeHints.length && !historicalHints.length) continue;
    // Historical/disused attractions are identity warnings, never live category leads.
    const location = position(element);
    const name = cleanText(tags.name);
    const lifecycle = lifecycleWarnings(tags);
    const reasons = ["2026-activity-not-verified", "operator-dates-and-hours-unverified"];
    if (!activeHints.length) reasons.push("historical-mapping-only");
    if (!name) reasons.push("missing-mapped-name");
    if (!location) reasons.push("missing-mapped-location");
    if (lifecycle.length) reasons.push("negative-lifecycle-evidence");
    const item = {
      sourceId: "openstreetmap-metadata",
      osm: { type: element.type, id: element.id,
        elementUrl: "https://www.openstreetmap.org/" + element.type + "/" + element.id },
      proposedName: name || null,
      proposedAddress: fullAddress(tags),
      approximateLocation: location,
      activityHints: activeHints,
      historicalCategoryHints: historicalHints,
      mappedLifecycleConcerns: lifecycle,
      sourceWebsite: null, // OSM website tags are NOT crawl permission.
      startDate: null, endDate: null, openingHours: null,
      year2026Verified: false,
      verified: false, publishable: false, openNowEligible: false,
      triage: { status: "hold-for-research", reasons, independentOperatorReview: true },
      license: { attribution: ATTRIBUTION, identifier: LICENSE,
        copyrightUrl: "https://www.openstreetmap.org/copyright" },
    };
    const idKey = element.type + "/" + element.id;
    if (identifiers.has(idKey)) {
      const previous = identifiers.get(idKey);
      if (!previous.triage.reasons.includes("conflicting-osm-identity"))
        previous.triage.reasons.push("conflicting-osm-identity");
      item.triage.reasons.push("conflicting-osm-identity");
    } else {
      identifiers.set(idKey, item);
    }
    const key = norm(name);
    if (key) {
      const prior = names.get(key) || [];
      for (const old of prior) {
        if (!old.triage.reasons.includes("possible-mapped-identity-collision"))
          old.triage.reasons.push("possible-mapped-identity-collision");
        item.triage.reasons.push("possible-mapped-identity-collision");
      }
      prior.push(item);
      names.set(key, prior);
    }
    proposals.push(item);
    if (proposals.length >= MAX_PROPOSALS) break;
  }
  if (discarded) return { status: "coverage-incomplete", proposals: [], diagnostic: "invalid-elements",
    publicationEligible: false };
  return { status: "metadata-proposals-only", proposals,
    countedElements: envelope.elements.length,
    sourceScope: "OSM-place-metadata-not-event-operating-evidence",
    publicationEligible: false };
}
