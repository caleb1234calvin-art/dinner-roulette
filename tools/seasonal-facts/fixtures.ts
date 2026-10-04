import { VERSION, factSchemas, inputSchema, type Input } from "./schema.ts";
import { addressFingerprint, digest, occurrenceId, stableId } from "./canonical.ts";

export const FIXTURE_TIME = "2026-10-01T12:00:00.000Z";
export function fixtureSource() {
  const unknownReview = { state: "unknown", evidenceIds: [], reviewer: null, reviewedAt: null };
  return { sourceId: "synthetic-directory", name: "Invented Amber County Facts", sourceClass: "synthetic",
    mode: "manual", allowedHosts: ["seasonal.invalid"], allowedPaths: [{ kind: "prefix", value: "/events" }],
    allowedQuery: [{ name: "year", values: ["2026", "2027"] }], contentTypes: ["text/html", "text/plain", "application/ld+json"],
    adapterId: "synthetic-manual", adapterVersion: "1", parser: { id: "reviewed-facts", version: "1", mode: "inert-facts-only" },
    factualFields: Object.keys(factSchemas), rules: { seasons: ["halloween"], years: [2026, 2027], categories: ["haunted-house", "corn-maze", "pumpkin-patch"] },
    attribution: { required: false, text: null, license: null }, robots: unknownReview, terms: unknownReview,
    permission: { ...unknownReview, reuse: "unknown", expiresAt: null },
    budget: { requests: 0, concurrency: 1, redirects: 2, deadlineMs: 10000, maxHeaderBytes: 16384,
      maxBodyBytes: 2097152, maxDomNodes: 20000, maxDepth: 64, maxJsonLdBytes: 262144 },
    cadence: { mode: "manual", minimumIntervalHours: 168 }, lastAttempt: null, lastSuccess: null, failure: "none" };
}

/** Every name, address, point, source identifier and review is invented. */
export function fixtureInput(count?: number): Input {
  const raw: any = { schemaVersion: VERSION, target: { season: "halloween", year: 2026 }, sources: [fixtureSource()],
    identities: [], locations: [], occurrences: [], observations: [], resolutions: [], crosswalks: [], relationships: [], lifecycle: [] };
  const entity = (id: string, kind: string) => { if (!raw.identities.some((e: any) => e.id === id)) raw.identities.push({ id, kind, reviewState: "reviewed", reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME }); };
  entity("operator:lantern", "operator"); entity("venue:paper-farm", "venue");
  const sharedAddress = { street: "123 Imaginary Lantern Lane", city: "Invented Amber", state: "ZZ", postal: "00000", country: "US" };
  const add = (key: string, name: string, options: { year?: number; attraction?: string; unresolved?: boolean; historical?: boolean; moved?: boolean } = {}) => {
    const year = options.year ?? 2026;
    const attractionId = options.attraction ?? `attraction:${key}`;
    entity(attractionId, "attraction");
    const oid = occurrenceId(attractionId, "halloween", year, key);
    const eid = stableId("evidence", { source: "synthetic-directory", key, year, revision: 1 });
    const address = options.moved ? { ...sharedAddress, street: "456 Imaginary Lantern Lane" } : sharedAddress;
    const point = { status: options.unresolved ? "unresolved" : "verified", crs: "WGS84", lat: options.unresolved ? null : 38.25,
      lon: options.unresolved ? null : -93.25, method: options.unresolved ? "unresolved" : "manual-survey", uncertaintyMeters: options.unresolved ? null : 5,
      addressFingerprint: addressFingerprint(address), evidenceIds: options.unresolved ? [] : [eid],
      sourceIds: options.unresolved ? [] : ["synthetic-directory"], verifiedAt: options.unresolved ? null : FIXTURE_TIME,
      reviewer: options.unresolved ? null : "fixture-reviewer", pointMeaning: options.unresolved ? "unknown" : "entrance" };
    const locationId = `location:${key}-${year}`;
    raw.locations.push({ id: locationId, venueId: "venue:paper-farm", version: raw.locations.length + 1, address, coordinates: point });
    const verification = options.historical ? "historical/unconfirmed" : "operator-confirmed";
    raw.occurrences.push({ id: oid, occurrenceKey: key, attractionId, operatorId: "operator:lantern", locationVersionId: locationId,
      season: "halloween", year, eligibility: "reviewed", verification });
    const facts = { name, address, activityTypes: ["haunted-house"],
      calendar: { dates: [`${year}-10-17`, `${year}-10-24`], intervals: [], excludedDates: [] }, timezone: "America/Chicago",
      hours: [{ date: `${year}-10-17`, opens: "19:00", closes: "01:00", closesNextDay: true }], coordinates: point,
      season: { season: "halloween", year }, verification };
    raw.observations.push({ evidenceId: eid, occurrenceId: oid, sourceId: "synthetic-directory", sourceNativeRecordId: key,
      canonicalUrl: `https://seasonal.invalid/events/${key}?year=${year}`, adapterId: "synthetic-manual", adapterVersion: "1",
      fetchedAt: null, checkedAt: FIXTURE_TIME, contentHash: digest(facts), seasonEvidence: { season: "halloween", year,
        basis: options.historical ? "footer-only" : "explicit-event-dates" }, verification, verificationBasis: "synthetic-fixture",
      reviewer: "fixture-reviewer", assertions: Object.entries(facts).map(([field, value]) => ({ assertionId: stableId("assertion", [eid, field]), field, value })) });
    raw.relationships.push({ id: `hosted:${key}-${year}`, kind: "hosted-at", from: oid, to: "venue:paper-farm", decision: "related",
      evidenceIds: [eid], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME });
    return { oid, eid, locationId };
  };
  if (count !== undefined) {
    for (let i = 0; i < count; i++) add(`bounded-${i}`, `Invented Event ${i}`);
    return inputSchema.parse(raw);
  }
  add("missing-osm", "Phantom Paper Lanterns");
  const duplicate = add("osm-web", "Velvet Clock Haunt");
  for (const namespace of ["osm", "source", "catalog"]) raw.crosswalks.push({ id: `crosswalk:${namespace}`, namespace,
    sourceId: "synthetic-directory", nativeId: `invented-${namespace}-17`, occurrenceId: duplicate.oid,
    evidenceIds: [duplicate.eid], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME });
  add("operator-second-event", "Silver Thimble Frights");
  const a = add("same-address-a", "Paper Farm Night Walk");
  const b = add("same-address-b", "Paper Farm Lantern Maze");
  raw.relationships.push({ id: "distinct:pair", kind: "do-not-merge", from: a.oid, to: b.oid, decision: "distinct",
    evidenceIds: [a.eid, b.eid], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME });
  const recurring = add("recurring", "Blue Acorn Shadows");
  const next = add("recurring", "Blue Acorn Shadows", { year: 2027, attraction: "attraction:recurring" });
  raw.relationships.push({ id: "prior:recurring", kind: "successor/prior-year", from: next.oid, to: recurring.oid, decision: "related",
    evidenceIds: [recurring.eid, next.eid], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME });
  const moved = add("moved", "Wandering Glass Haunt", { moved: true });
  const priorLoc = structuredClone(raw.locations.find((l: any) => l.id === moved.locationId));
  priorLoc.id = "location:moved-prior"; priorLoc.version = raw.locations.length + 1;
  priorLoc.address = sharedAddress; priorLoc.coordinates = { ...priorLoc.coordinates, status: "unresolved", lat: null, lon: null,
    method: "unresolved", uncertaintyMeters: null, verifiedAt: null, reviewer: null, evidenceIds: [], sourceIds: [],
    addressFingerprint: addressFingerprint(sharedAddress), pointMeaning: "unknown" };
  raw.locations.push(priorLoc);
  raw.relationships.push({ id: "moved:venue", kind: "moved-from", from: moved.locationId, to: priorLoc.id, decision: "related",
    evidenceIds: [moved.eid], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME });
  const closed = add("closed", "Retired Tin Moon Haunt");
  raw.observations.find((o: any) => o.evidenceId === closed.eid).assertions.push({ assertionId: "assertion:closed-negative", field: "lifecycle", value: "permanently-closed" });
  raw.lifecycle.push({ id: "lifecycle:closed", state: "permanently-closed", subject: { scope: "attraction", id: "attraction:closed" },
    effective: { start: "2026-01-01", end: null }, evidenceIds: [closed.eid], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME });
  // An active directory duplicate does not erase the attraction closure.
  const activeDuplicate = structuredClone(raw.observations.find((o: any) => o.evidenceId === closed.eid));
  activeDuplicate.evidenceId = "evidence:closed-active-duplicate";
  activeDuplicate.assertions = [{ assertionId: "assertion:closed-active", field: "lifecycle", value: "active-assertion" }];
  activeDuplicate.contentHash = digest(activeDuplicate.assertions);
  raw.observations.push(activeDuplicate);
  add("historical", "Yesterday's Wax Orchard", { historical: true });
  add("unresolved", "Unmapped Ribbon Maze", { unresolved: true });
  return inputSchema.parse(raw);
}
