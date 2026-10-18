import { createHash } from "node:crypto";

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
const LIFECYCLE_PREFIXES = ["disused:", "abandoned:", "demolished:", "removed:", "was:", "destroyed:", "razed:"];
const ATTRIBUTION = "© OpenStreetMap contributors";
const LICENSE = "ODbL-1.0";

// Canonical JSON snapshot rejects values JSON.stringify would silently drop or
// coerce. This fidelity check is not a sandbox for executable hostile objects.
function canonicalJson(value, ancestors = new Set(), depth = 0) {
  if (depth > 64) throw new Error("JSON nesting limit");
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (!value || typeof value !== "object" || ancestors.has(value)) throw new Error("Non-JSON value");
  const array = Array.isArray(value);
  if (!array && ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error("Non-JSON object");
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const keys = Reflect.ownKeys(descriptors).filter(key => !(array && key === "length"));
  if (keys.some(key => typeof key !== "string" || !descriptors[key].enumerable ||
    !Object.hasOwn(descriptors[key], "value"))) throw new Error("Non-JSON property");
  if (array && (keys.length !== value.length || keys.some((key, i) => key !== String(i)))) throw new Error("Non-JSON array");
  ancestors.add(value);
  const items = (array ? keys : keys.sort()).map(key =>
    (array ? "" : JSON.stringify(key) + ":") + canonicalJson(descriptors[key].value, ancestors, depth + 1));
  ancestors.delete(value);
  return array ? "[" + items.join(",") + "]" : "{" + items.join(",") + "}";
}
const sha256 = text => createHash("sha256").update(text, "utf8").digest("hex");
const positiveLifecycleValue = value => typeof value === "string" && Boolean(value) &&
  !["no", "false", "0"].includes(value.toLowerCase());
function lifecycleEvidence(tags) {
  return Object.fromEntries(Object.entries(tags).filter(([key, value]) => {
    if (!positiveLifecycleValue(value)) return false;
    if (key === "closed") return ["yes", "true"].includes(value.toLowerCase());
    return LIFECYCLE_PREFIXES.some(prefix => {
      if (key === prefix.slice(0, -1)) return true;
      if (!key.startsWith(prefix)) return false;
      return ["demolished:", "removed:", "razed:", "destroyed:"].includes(prefix) ||
        ["leisure", "tourism", "attraction", "amenity"].includes(key.slice(prefix.length));
    });
  }));
}

const RAW_TAG_KEYS = new Set([
  "name", "attraction", "leisure", "maze:type", "crop", "tourism", "amenity", "closed",
  "addr:full", "addr:housenumber", "addr:street", "addr:place", "addr:city", "addr:town",
  "addr:village", "addr:hamlet", "addr:state", "addr:province", "addr:region", "addr:postcode", "addr:country",
]);
function rawEvidenceTags(tags) {
  const entries = Object.entries(tags).filter(([key]) => RAW_TAG_KEYS.has(key) ||
    LIFECYCLE_PREFIXES.some(prefix => key === prefix.slice(0, -1) || key.startsWith(prefix)));
  // Preserve whitelisted values unchanged or reject the entire capture; never
  // present shortened/normalized evidence as an original provider tag.
  if (entries.length > 64 || entries.some(([key, value]) =>
    Buffer.byteLength(key, "utf8") > 160 || Buffer.byteLength(value, "utf8") > 4096)) return null;
  const result = Object.fromEntries(entries);
  return Buffer.byteLength(canonicalJson(result), "utf8") <= 16384 ? result : null;
}

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
    (maze && [tags["maze:type"], tags.crop].some(value => ["corn", "maize"].includes(value))))
    types.push("corn-maze");
  if (attraction === "pumpkin_patch") types.push("pumpkin-patch");
  return types;
}
function historicalTypeHints(tags) {
  const hints = new Set();
  for (const prefix of LIFECYCLE_PREFIXES) {
    // Lifecycle scopes describe separate states; never combine their fields.
    const historical = {};
    for (const field of ["attraction", "leisure", "maze:type", "crop"]) {
      if (typeof tags[prefix + field] === "string") historical[field] = tags[prefix + field];
    }
    for (const hint of typeHints(historical)) hints.add(hint);
  }
  return [...hints];
}
function lifecycleWarnings(tags) {
  const keys = Object.keys(lifecycleEvidence(tags));
  return [
    ...(keys.some(key => key.includes(":")) ? ["mapped-lifecycle-negative-tag"] : []),
    ...(keys.some(key => !key.includes(":")) ? ["mapped-lifecycle-negative-state"] : []),
  ];
}
function fullAddress(tags) {
  const full = cleanText(tags["addr:full"], 240);
  if (full) return full;
  const parts = [
    [tags["addr:housenumber"], tags["addr:street"] || tags["addr:place"]].filter(Boolean).join(" "),
    tags["addr:city"] || tags["addr:town"] || tags["addr:village"] || tags["addr:hamlet"],
    tags["addr:state"] || tags["addr:province"] || tags["addr:region"],
    tags["addr:postcode"], tags["addr:country"],
  ].map(part => cleanText(part, 240)).filter(Boolean);
  return [...new Set(parts)].join(", ").slice(0, 240) || null;
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
  let snapshot;
  let inputHashBasis;
  try {
    if (typeof input === "string") {
      if (Buffer.byteLength(input, "utf8") > MAX_BYTES) return { status: "bounded-input-rejected", proposals: [] };
      envelope = JSON.parse(input);
      canonicalJson(envelope);
      snapshot = input;
      inputHashBasis = "supplied-string-utf8-bytes";
    } else {
      snapshot = canonicalJson(input);
      if (Buffer.byteLength(snapshot, "utf8") > MAX_BYTES) return { status: "bounded-input-rejected", proposals: [] };
      envelope = JSON.parse(snapshot);
      inputHashBasis = "canonical-json-object-snapshot-utf8";
    }
  } catch {
    return { status: "malformed-response", proposals: [] };
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
  const provenance = { inputSha256: sha256(snapshot), inputHashBasis,
    recordHashBasis: "canonical-json-original-element-utf8", sourceRows: [] };
  const proposals = [];
  const names = new Map();
  const identifiers = new Map();
  // Index every valid record before category filtering, including nonseasonal
  // siblings whose negative state must not disappear from a seasonal identity.
  for (const [elementIndex, element] of envelope.elements.entries()) {
    if (!validElement(element) || !Object.values(element.tags).every(value => typeof value === "string")) {
      return { status: "coverage-incomplete", proposals: [], diagnostic: "invalid-elements",
        publicationEligible: false };
    }
    const idKey = element.type + "/" + element.id;
    const rawTags = rawEvidenceTags(element.tags);
    if (!rawTags) return { status: "coverage-incomplete", proposals: [],
      diagnostic: "evidence-tag-limit", publicationEligible: false };
    const recordSha256 = sha256(canonicalJson(element));
    const concerns = lifecycleWarnings(element.tags);
    const identity = identifiers.get(idKey) || { hashes: new Map(), concerns: new Set(), negativeIndices: [] };
    identity.hashes.set(recordSha256, (identity.hashes.get(recordSha256) || 0) + 1);
    for (const concern of concerns) identity.concerns.add(concern);
    if (concerns.length) identity.negativeIndices.push(elementIndex);
    provenance.sourceRows.push({ elementIndex, osmType: element.type, osmId: element.id,
      recordSha256, rawTags, mappedLifecycleConcerns: concerns, lifecycleTags: lifecycleEvidence(element.tags) });
    identifiers.set(idKey, identity);
  }
  for (const [elementIndex, element] of envelope.elements.entries()) {
    const tags = element.tags;
    const activeHints = typeHints(tags);
    const historicalHints = historicalTypeHints(tags);
    if (!activeHints.length && !historicalHints.length) continue;
    // Historical/disused attractions are identity warnings, never live category leads.
    const location = position(element);
    const name = cleanText(tags.name);
    const identity = identifiers.get(element.type + "/" + element.id);
    const lifecycle = [...identity.concerns];
    const reasons = ["2026-activity-not-verified", "operator-dates-and-hours-unverified"];
    if (!activeHints.length) reasons.push("historical-mapping-only");
    if (!name) reasons.push("missing-mapped-name");
    if (!location) reasons.push("missing-mapped-location");
    if (lifecycle.length) reasons.push("negative-lifecycle-evidence");
    if (identity.hashes.size > 1) reasons.push("conflicting-osm-identity");
    const recordSha256 = provenance.sourceRows[elementIndex].recordSha256;
    if (identity.hashes.get(recordSha256) > 1) reasons.push("duplicate-osm-record");
    const item = {
      sourceId: "openstreetmap-metadata",
      provenance: { elementIndex, recordSha256, negativeEvidenceIndices: [...identity.negativeIndices] },
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
    const key = norm(name);
    if (key) {
      const prior = names.get(key) || [];
      for (const old of prior) {
        if (!old.triage.reasons.includes("possible-mapped-identity-collision"))
          old.triage.reasons.push("possible-mapped-identity-collision");
        if (!item.triage.reasons.includes("possible-mapped-identity-collision"))
          item.triage.reasons.push("possible-mapped-identity-collision");
      }
      prior.push(item);
      names.set(key, prior);
    }
    proposals.push(item);
    if (proposals.length >= MAX_PROPOSALS) break;
  }
  return { status: "metadata-proposals-only", proposals, provenance,
    countedElements: envelope.elements.length,
    sourceScope: "OSM-place-metadata-not-event-operating-evidence",
    publicationEligible: false };
}
