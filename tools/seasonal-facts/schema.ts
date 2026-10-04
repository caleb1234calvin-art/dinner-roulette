import { z } from "zod";

export const VERSION = "seasonal-facts-v1" as const;
export const LIMITS = Object.freeze({ published: 100, identities: 512, observations: 20,
  url: 2048, name: 200, address: 500, runtimeBytes: 2 * 1024 * 1024 });
export const normalizeDisplay = (s: string) => s.normalize("NFC").replace(/\s+/gu, " ").trim();
const text = (max: number) => z.string().max(max).transform(normalizeDisplay).pipe(z.string().min(1).max(max));
export const id = z.string().min(1).max(160).regex(/^[a-zA-Z0-9][a-zA-Z0-9:._-]*$/);
export const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const instant = z.iso.datetime({ precision: 3 });
export const date = z.iso.date();
export const year = z.number().int().min(2000).max(2200);
export const season = z.enum(["spring", "summer", "autumn", "winter", "halloween", "holiday"]);
export const activity = z.enum(["haunted-house", "corn-maze", "pumpkin-patch"]);
export const verification = z.enum(["operator-confirmed", "current-season-directory", "current-season-secondary", "historical/unconfirmed"]);
export const lifecycleState = z.enum(["active-assertion", "season-not-operating", "event-cancelled", "moved", "disused", "permanently-closed"]);
export const url = z.string().max(LIMITS.url).refine(s => {
  try { const u = new URL(s); return u.protocol === "https:" && !u.username && !u.password && !/[\s\\]/u.test(s); }
  catch { return false; }
}, "Expected an HTTPS URL without userinfo or whitespace");
export const ids = z.array(id).max(10240).refine(a => new Set(a).size === a.length, "Duplicate reference");
const evidenceIds = ids.refine(a => a.length > 0, "Evidence required");
export const address = z.strictObject({ street: text(500), city: text(100), state: text(100),
  postal: text(30), country: z.string().regex(/^[A-Z]{2}$/) }).refine(a =>
  Object.values(a).join(", ").length <= LIMITS.address, "Address exceeds 500 characters");
export const interval = z.strictObject({ start: date, end: date.nullable() })
  .refine(v => v.end === null || v.end >= v.start, "Reversed interval");
export const calendar = z.strictObject({ dates: z.array(date).max(366), intervals: z.array(interval).max(32),
  excludedDates: z.array(date).max(366) }).refine(v => v.dates.length + v.intervals.length > 0, "Explicit calendar required")
  .refine(v => v.intervals.every(i => i.end !== null), "Calendar intervals require an end");
export const timezone = text(80).refine(s => {
  try { new Intl.DateTimeFormat("en", { timeZone: s }); return s === "UTC" || s.includes("/"); }
  catch { return false; }
}, "Expected IANA timezone");
export const hours = z.array(z.strictObject({ date, opens: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  closes: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/), closesNextDay: z.boolean() })).max(366);
export const coordinates = z.strictObject({ status: z.enum(["unresolved", "candidate", "verified"]),
  crs: z.literal("WGS84"), lat: z.number().min(-90).max(90).nullable(), lon: z.number().min(-180).max(180).nullable(),
  method: z.enum(["unresolved", "operator-published", "reviewed-map", "manual-survey", "reviewed-geocode"]),
  uncertaintyMeters: z.number().finite().nonnegative().max(100000).nullable(),
  addressFingerprint: hash, evidenceIds: ids, sourceIds: ids, verifiedAt: instant.nullable(), reviewer: id.nullable(),
  pointMeaning: z.enum(["entrance", "venue", "parcel-centroid", "unknown"]),
}).superRefine((v, ctx) => {
  if ((v.lat === null) !== (v.lon === null)) ctx.addIssue({ code: "custom", message: "Coordinate pair required" });
  if (v.status !== "unresolved" && (v.lat === null || v.method === "unresolved"))
    ctx.addIssue({ code: "custom", message: "Resolved point required" });
  if (v.status === "verified" && (!v.verifiedAt || !v.reviewer || v.uncertaintyMeters === null ||
    !v.evidenceIds.length || !v.sourceIds.length || v.pointMeaning === "unknown"))
    ctx.addIssue({ code: "custom", message: "Verified coordinates require review, precision, point meaning and provenance" });
});
export const factSchemas = { name: text(200), address, phone: text(60), operatorWebsite: url,
  activityTypes: z.array(activity).min(1).max(3), calendar, hours, timezone, coordinates,
  season: z.strictObject({ season, year }), verification, lifecycle: lifecycleState,
  sourceUrl: url, sourceId: id, checkedAt: instant };
export const field = z.enum(Object.keys(factSchemas) as [keyof typeof factSchemas, ...(keyof typeof factSchemas)[]]);
export const assertion = z.strictObject({ assertionId: id, field, value: z.unknown() })
  .transform((v, ctx) => {
    const parsed = factSchemas[v.field].safeParse(v.value);
    if (!parsed.success) { ctx.addIssue({ code: "custom", message: `Invalid ${v.field}: ${parsed.error.message}` }); return z.NEVER; }
    return { ...v, value: parsed.data };
  });
export const observation = z.strictObject({ evidenceId: id, occurrenceId: id, sourceId: id,
  sourceNativeRecordId: text(160).nullable(), canonicalUrl: url, adapterId: id, adapterVersion: id,
  fetchedAt: instant.nullable(), checkedAt: instant, contentHash: hash,
  seasonEvidence: z.strictObject({ season: season.nullable(), year: year.nullable(),
    basis: z.enum(["explicit-event-dates", "explicit-season-statement", "operator-attestation", "footer-only", "absent"]) }),
  verification, verificationBasis: z.enum(["reviewed-operator-facts", "reviewed-directory-facts", "reviewed-secondary-facts", "historical-record", "synthetic-fixture"]),
  reviewer: id, assertions: z.array(assertion).min(1).max(32),
});
export const resolution = z.strictObject({ occurrenceId: id, field, selectedAssertionIds: evidenceIds,
  conflictingAssertionIds: ids, rejectedAssertionIds: ids,
  reason: z.enum(["corroborated", "operator-precedence", "explicit-review", "newer-explicit-evidence", "retain-prior-fact"]),
  reviewer: id, resolvedAt: instant });
export const entity = z.strictObject({ id, kind: z.enum(["operator", "venue", "attraction"]),
  reviewState: z.enum(["reviewed", "quarantined", "tombstone"]), reviewer: id, reviewedAt: instant });
export const location = z.strictObject({ id, venueId: id, version: z.number().int().positive(), address, coordinates });
export const occurrence = z.strictObject({ id, occurrenceKey: id, attractionId: id, operatorId: id,
  locationVersionId: id, season, year, eligibility: z.enum(["reviewed", "quarantine"]), verification });
export const lifecycle = z.strictObject({ id, state: lifecycleState,
  subject: z.strictObject({ scope: z.enum(["operator", "venue", "attraction", "occurrence"]), id }),
  effective: interval, evidenceIds, reviewer: id, reviewedAt: instant });
export const crosswalk = z.strictObject({ id, namespace: z.enum(["source", "osm", "catalog"]),
  sourceId: id, nativeId: text(160), occurrenceId: id, evidenceIds, reviewer: id, reviewedAt: instant });
export const relationship = z.strictObject({ id, kind: z.enum(["alias-decision", "same-event", "hosted-at", "moved-from", "successor/prior-year", "do-not-merge"]),
  from: id, to: id, decision: z.enum(["same", "distinct", "related"]), evidenceIds, reviewer: id, reviewedAt: instant });
// Patterns are literal prefixes/exact values, not remotely supplied regular expressions.
export const pathRule = z.strictObject({ kind: z.enum(["exact", "prefix"]), value: z.string().min(1).max(500)
  .regex(/^\/[a-zA-Z0-9/_\-.]*$/).refine(s => !s.includes("..") && !s.includes("//")) });
export const review = z.strictObject({ state: z.enum(["unknown", "approved", "denied", "conflicting"]),
  evidenceIds: ids, reviewer: id.nullable(), reviewedAt: instant.nullable() });
export const source = z.strictObject({ sourceId: id, name: text(200),
  sourceClass: z.enum(["operator", "tourism", "municipal", "directory", "manual", "synthetic"]),
  enabled: z.literal(false).default(false), mode: z.enum(["manual", "automatic"]).default("manual"),
  allowedHosts: z.array(z.string().max(253).regex(/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/)).min(1).max(8),
  allowedPaths: z.array(pathRule).min(1).max(32),
  allowedQuery: z.array(z.strictObject({ name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/), values: z.array(text(100)).min(1).max(32) })).max(16),
  contentTypes: z.array(z.enum(["text/html", "text/plain", "application/ld+json"])).min(1).max(3),
  adapterId: id, adapterVersion: id, parser: z.strictObject({ id, version: id, mode: z.literal("inert-facts-only") }),
  factualFields: z.array(field).min(1).max(15),
  rules: z.strictObject({ seasons: z.array(season).min(1).max(6), years: z.array(year).min(1).max(10), categories: z.array(activity).min(1).max(3) }),
  attribution: z.strictObject({ required: z.boolean(), text: text(500).nullable(), license: text(200).nullable() }),
  robots: review, terms: review,
  permission: review.extend({ reuse: z.enum(["unknown", "approved", "denied", "conflicting"]), expiresAt: instant.nullable() }),
  budget: z.strictObject({ requests: z.number().int().min(0).max(20), concurrency: z.literal(1), redirects: z.number().int().min(0).max(2),
    deadlineMs: z.number().int().min(1).max(10000), maxHeaderBytes: z.number().int().min(1).max(16384),
    maxBodyBytes: z.number().int().min(1).max(2097152), maxDomNodes: z.number().int().min(1).max(20000),
    maxDepth: z.number().int().min(1).max(64), maxJsonLdBytes: z.number().int().min(1).max(262144) }),
  cadence: z.strictObject({ mode: z.enum(["manual", "scheduled"]), minimumIntervalHours: z.number().int().min(1).max(8760) }),
  lastAttempt: instant.nullable(), lastSuccess: instant.nullable(),
  failure: z.enum(["none", "permission", "policy", "parse", "network", "budget"]).default("none"),
});
export const inputSchema = z.strictObject({ schemaVersion: z.literal(VERSION), target: z.strictObject({ season, year }),
  sources: z.array(source).max(64), identities: z.array(entity).max(512), locations: z.array(location).max(512),
  occurrences: z.array(occurrence).max(512), observations: z.array(observation).max(10240),
  resolutions: z.array(resolution).max(8192), crosswalks: z.array(crosswalk).max(512),
  relationships: z.array(relationship).max(2048), lifecycle: z.array(lifecycle).max(2048) });
export const factsSchema = z.strictObject({ name: factSchemas.name, address, activityTypes: factSchemas.activityTypes,
  calendar, timezone, coordinates, season: factSchemas.season, verification,
  phone: factSchemas.phone.optional(), operatorWebsite: url.optional(), hours: hours.optional(),
  lifecycle: lifecycleState.optional(), sourceUrl: url.optional(), sourceId: id.optional(), checkedAt: instant.optional() });
export type Input = z.infer<typeof inputSchema>;
export type Source = z.infer<typeof source>;
export type Observation = z.infer<typeof observation>;
export type Occurrence = z.infer<typeof occurrence>;
export type Field = z.infer<typeof field>;
export type Facts = z.infer<typeof factsSchema>;
