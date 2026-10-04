import { z } from "zod";
import { VERSION, LIMITS, inputSchema, factsSchema, resolution, lifecycle, hash, id, ids, instant,
  type Input, type Observation, type Field } from "./schema.ts";
import { canonical, digest, artifactDigest, occurrenceId, addressFingerprint } from "./canonical.ts";
import { validateUrl } from "./policy.ts";

function fail(message: string): never { throw new Error(message); }
function unique<T>(items: T[], key: (v: T) => string, label: string): Map<string, T> {
  const m = new Map<string, T>();
  for (const v of items) { const k = key(v); if (m.has(k)) fail(`Duplicate ${label}: ${k}`); m.set(k, v); }
  return m;
}
const sorted = <T>(v: T): T => JSON.parse(canonical(v));
const byteLength = (v: unknown) => Buffer.byteLength(canonical(v) + "\n", "utf8");

export const fieldResultSchema = z.strictObject({ occurrenceId: id, field: resolution.shape.field,
  selectedAssertionIds: ids, conflictingAssertionIds: ids, rejectedAssertionIds: ids,
  reason: z.enum(["corroborated", "operator-precedence", "explicit-review", "newer-explicit-evidence", "retain-prior-fact", "unresolved-conflict"]),
  reviewer: id.nullable(), resolvedAt: instant.nullable(), evidenceIds: ids, sourceIds: ids });
export type FieldResult = z.infer<typeof fieldResultSchema>;
const runtimeRecord = z.strictObject({ occurrenceId: id, memberOccurrenceIds: ids, attractionId: id, operatorId: id,
  locationVersionId: id, eligibility: z.literal("eligible"), facts: factsSchema, checkedAt: instant, fieldProvenance: z.array(fieldResultSchema) });
const runtimeSchema = z.strictObject({ schemaVersion: z.literal(VERSION), target: inputSchema.shape.target,
  occurrences: z.array(runtimeRecord).max(100) });
const exclusionSchema = z.strictObject({ occurrenceId: id, reasons: z.array(z.string().min(1).max(100)), evidenceIds: ids });
const tombstoneSchema = z.strictObject({ lifecycle: lifecycle, affectedOccurrenceIds: ids });
const artifactNames = ["runtime", "fieldSourceMap", "exclusions", "tombstones", "ledger", "diff"] as const;
const descriptor = z.strictObject({ sha256: hash, bytes: z.number().int().nonnegative() });
const manifestSchema = z.strictObject({ schemaVersion: z.literal(VERSION), contentRevision: hash,
  lastGoodCheckedAt: instant.nullable(), publishedCount: z.number().int().min(0).max(100),
  reviewedIdentityCount: z.number().int().min(0).max(512),
  artifacts: z.strictObject({ runtime: descriptor, fieldSourceMap: descriptor, exclusions: descriptor,
    tombstones: descriptor, ledger: descriptor, diff: descriptor }) });
export const snapshotSchema = z.strictObject({ manifest: manifestSchema, runtime: runtimeSchema,
  fieldSourceMap: z.array(fieldResultSchema), exclusions: z.array(exclusionSchema),
  tombstones: z.array(tombstoneSchema), ledger: inputSchema, diff: z.string().max(2097152) });
export type Snapshot = z.infer<typeof snapshotSchema>;

/** Immutable evidence/lifecycle/location rows accumulate; omission is never a
 * deletion. Changes require new IDs. Reviewed decisions/occurrences may evolve. */
function retainPrior(input: Input, prior?: Input): Input {
  if (!prior) return input;
  const result = structuredClone(input);
  for (const key of ["sources", "identities", "locations", "occurrences", "observations", "resolutions", "crosswalks", "relationships", "lifecycle"] as const) {
    const rowKey = (row: any): string => key === "sources" ? row.sourceId : key === "observations" ? row.evidenceId :
      key === "resolutions" ? `${row.occurrenceId}/${row.field}` : row.id;
    const old = unique(prior[key] as any[], rowKey, key);
    const fresh = unique(input[key] as any[], rowKey, key);
    for (const [k, v] of fresh) {
      if (["observations", "lifecycle", "locations", "crosswalks", "relationships"].includes(key) && old.has(k) && canonical(old.get(k)) !== canonical(v))
        fail(`Immutable ${key} changed: ${k}`);
      old.set(k, v);
    }
    (result[key] as any[]) = [...old.values()];
  }
  return inputSchema.parse(result);
}

function compile(input: Input) {
  const sources = unique(input.sources, s => s.sourceId, "source");
  const entities = unique(input.identities, e => e.id, "entity");
  const locations = unique(input.locations, l => l.id, "location");
  const occurrences = unique(input.occurrences, o => o.id, "occurrence");
  const observations = unique(input.observations, o => o.evidenceId, "evidence");
  unique(input.crosswalks, c => c.id, "crosswalk");
  unique(input.relationships, r => r.id, "relationship");
  unique(input.lifecycle, l => l.id, "lifecycle");
  const reviewedIdentityCount = input.identities.length + input.locations.length + input.occurrences.length + input.crosswalks.length;
  if (reviewedIdentityCount > LIMITS.identities) fail("Reviewed identities exceed 512 (including quarantine/tombstones/crosswalks)");
  const referenceIds = [...entities.keys(), ...locations.keys(), ...occurrences.keys(), ...input.crosswalks.map(c => c.id)];
  if (new Set(referenceIds).size !== referenceIds.length) fail("Identity namespace collision");
  const requireEntity = (key: string, kind: string) => {
    if (entities.get(key)?.kind !== kind) fail(`Missing/wrong ${kind}: ${key}`);
  };
  const requireEvidence = (refs: string[]) => refs.forEach(r => { if (!observations.has(r)) fail(`Dangling evidence: ${r}`); });
  for (const l of input.locations) {
    requireEntity(l.venueId, "venue");
    if (l.coordinates.addressFingerprint !== addressFingerprint(l.address)) fail("Coordinate address fingerprint mismatch");
    requireEvidence(l.coordinates.evidenceIds);
    for (const s of l.coordinates.sourceIds) if (!sources.has(s)) fail("Coordinate source missing");
    const actualSources = [...new Set(l.coordinates.evidenceIds.map(e => observations.get(e)!.sourceId))];
    if (canonical(actualSources) !== canonical(l.coordinates.sourceIds)) fail("Coordinate source/evidence mismatch");
  }
  unique(input.locations, l => `${l.venueId}/${l.version}`, "location version");
  for (const o of input.occurrences) {
    if (o.id !== occurrenceId(o.attractionId, o.season, o.year, o.occurrenceKey)) fail("Unstable occurrence ID");
    requireEntity(o.attractionId, "attraction"); requireEntity(o.operatorId, "operator");
    if (!locations.has(o.locationVersionId)) fail("Missing physical location version");
  }
  const parent = new Map(input.occurrences.map(o => [o.id, o.id]));
  const root = (start: string): string => {
    if (!parent.has(start)) fail(`Not an occurrence: ${start}`);
    let p = start;
    const seen = new Set<string>();
    while (parent.get(p) !== p) { if (seen.has(p)) fail("Cyclic same-event identity"); seen.add(p); p = parent.get(p)!; }
    return p;
  };
  // Only explicit reviewed same-event/alias decisions can join occurrences.
  for (const r of input.relationships) {
    if (!referenceIds.includes(r.from) || !referenceIds.includes(r.to) || r.from === r.to) fail("Invalid identity relationship");
    requireEvidence(r.evidenceIds);
    if (r.kind === "same-event" || (r.kind === "alias-decision" && r.decision === "same")) {
      if (r.decision !== "same") fail("Same-event requires same decision");
      const a = occurrences.get(r.from), b = occurrences.get(r.to);
      if (!a || !b || a.year !== b.year || a.season !== b.season || a.attractionId !== b.attractionId ||
        a.operatorId !== b.operatorId || a.locationVersionId !== b.locationVersionId) fail("Incompatible same-event decision");
      if (parent.get(r.from) !== r.from && parent.get(r.from) !== r.to) fail("Conflicting canonical identity decision");
      parent.set(r.from, r.to);
    } else if (r.kind === "hosted-at") {
      const o = occurrences.get(r.from);
      if (r.decision !== "related" || !o || locations.get(o.locationVersionId)!.venueId !== r.to) fail("Invalid hosted-at relation");
    } else if (r.kind === "moved-from") {
      if (r.decision !== "related" || !locations.has(r.from) || !locations.has(r.to)) fail("Moved-from requires location versions");
    } else if (r.kind === "successor/prior-year") {
      const a = occurrences.get(r.from), b = occurrences.get(r.to);
      if (r.decision !== "related" || !a || !b || a.attractionId !== b.attractionId || a.year <= b.year) fail("Invalid recurring relation");
    } else if (r.decision !== "distinct" || !occurrences.has(r.from) || !occurrences.has(r.to)) fail("Distinct occurrence decision required");
  }
  input.occurrences.forEach(o => root(o.id));
  for (const r of input.relationships) if (r.decision === "distinct" && root(r.from) === root(r.to)) fail("Do-not-merge identity violation");
  const seenCrosswalk = new Map<string, string>();
  for (const c of input.crosswalks) {
    if (!sources.has(c.sourceId) || !occurrences.has(c.occurrenceId)) fail("Dangling crosswalk");
    requireEvidence(c.evidenceIds);
    const o = occurrences.get(c.occurrenceId)!;
    const key = canonical([c.namespace, c.sourceId, c.nativeId, o.year, o.season]);
    const prior = seenCrosswalk.get(key);
    if (prior && root(prior) !== root(c.occurrenceId)) fail("Crosswalk maps to distinct events");
    seenCrosswalk.set(key, c.occurrenceId);
    if (c.evidenceIds.some(e => root(observations.get(e)!.occurrenceId) !== root(o.id))) fail("Crosswalk evidence belongs to another event");
  }
  const assertionMap = new Map<string, { assertion: Observation["assertions"][number]; observation: Observation }>();
  for (const obs of input.observations) {
    const s = sources.get(obs.sourceId);
    if (!s || !occurrences.has(obs.occurrenceId)) fail("Observation relation missing");
    validateUrl(obs.canonicalUrl, s);
    if (obs.adapterId !== s.adapterId || obs.adapterVersion !== s.adapterVersion) fail("Adapter version mismatch");
    if (obs.fetchedAt && obs.fetchedAt > obs.checkedAt) fail("Observation checked before fetched");
    for (const a of obs.assertions) {
      if (!s.factualFields.includes(a.field)) fail("Source factual field not allowed");
      if (assertionMap.has(a.assertionId)) fail("Duplicate assertion ID");
      if ((a.field === "sourceId" && a.value !== obs.sourceId) || (a.field === "sourceUrl" && a.value !== obs.canonicalUrl) ||
        (a.field === "checkedAt" && a.value !== obs.checkedAt)) fail("Source metadata assertion mismatch");
      assertionMap.set(a.assertionId, { assertion: a, observation: obs });
    }
    unique(obs.assertions, a => a.field, "observation field");
  }
  for (const l of input.locations.filter(l => l.coordinates.status === "verified")) {
    if (l.coordinates.evidenceIds.some(e => occurrences.get(observations.get(e)!.occurrenceId)!.locationVersionId !== l.id))
      fail("Coordinate evidence belongs to another physical location");
    if (!l.coordinates.evidenceIds.some(e => observations.get(e)!.assertions.some(a =>
      a.field === "coordinates" && canonical(a.value) === canonical(l.coordinates)))) fail("Verified point lacks matching coordinate assertion");
  }
  const decisions = unique(input.resolutions, r => `${root(r.occurrenceId)}/${r.field}`, "field resolution");
  for (const d of decisions.values()) {
    const refs = [...d.selectedAssertionIds, ...d.conflictingAssertionIds, ...d.rejectedAssertionIds];
    if (new Set(refs).size !== refs.length) fail("Overlapping resolution sets");
    for (const ref of refs) {
      const a = assertionMap.get(ref);
      if (!a || root(a.observation.occurrenceId) !== root(d.occurrenceId) || a.assertion.field !== d.field) fail("Invalid resolution assertion");
      if (d.resolvedAt < a.observation.checkedAt) fail("Resolution predates evidence");
    }
  }
  const applies = (l: Input["lifecycle"][number], o: Input["occurrences"][number]) => {
    const loc = locations.get(o.locationVersionId)!;
    return l.subject.scope === "occurrence" ? root(l.subject.id) === root(o.id) :
      l.subject.scope === "attraction" ? l.subject.id === o.attractionId :
        l.subject.scope === "operator" ? l.subject.id === o.operatorId : l.subject.id === loc.venueId;
  };
  for (const l of input.lifecycle) {
    if (l.subject.scope === "occurrence") root(l.subject.id); else requireEntity(l.subject.id, l.subject.scope);
    requireEvidence(l.evidenceIds);
    if (l.evidenceIds.some(e => !applies(l, occurrences.get(observations.get(e)!.occurrenceId)!))) fail("Lifecycle evidence scope mismatch");
    if (!l.evidenceIds.some(e => observations.get(e)!.assertions.some(a => a.field === "lifecycle" && a.value === l.state)))
      fail("Lifecycle state lacks supporting assertion");
    if (l.evidenceIds.some(e => observations.get(e)!.checkedAt > l.reviewedAt)) fail("Lifecycle review predates evidence");
  }
  // A negative observation cannot hide outside the scoped lifecycle ledger.
  for (const { assertion: a, observation: obs } of assertionMap.values()) if (a.field === "lifecycle" && a.value !== "active-assertion" &&
    !input.lifecycle.some(l => l.state === a.value && l.evidenceIds.includes(obs.evidenceId) && applies(l, occurrences.get(obs.occurrenceId)!)))
    fail("Negative fact requires scoped lifecycle evidence");
  const runtime: z.infer<typeof runtimeSchema> = { schemaVersion: VERSION, target: input.target, occurrences: [] };
  const fieldSourceMap: FieldResult[] = [];
  const exclusions: z.infer<typeof exclusionSchema>[] = [];
  const tombstones = input.lifecycle.filter(l => l.state !== "active-assertion").map(l => ({ lifecycle: l,
    affectedOccurrenceIds: input.occurrences.filter(o => applies(l, o)).map(o => o.id) }));
  for (const o of input.occurrences.filter(o => root(o.id) === o.id)) {
    const members = input.occurrences.filter(m => root(m.id) === o.id);
    const obs = input.observations.filter(v => root(v.occurrenceId) === o.id);
    if (obs.length > LIMITS.observations) fail("Observations per occurrence exceed 20");
    const reasons: string[] = [];
    const facts: Partial<Record<Field, unknown>> = {};
    const fieldMap: FieldResult[] = [];
    for (const f of [...new Set(obs.flatMap(v => v.assertions.map(a => a.field)))].sort()) {
      const candidates = obs.flatMap(v => v.assertions.filter(a => a.field === f).map(a => ({ a, obs: v })));
      const decision = decisions.get(`${o.id}/${f}`);
      let selected: string[] = [], conflicting: string[] = [], rejected: string[] = [];
      if (decision) {
        selected = decision.selectedAssertionIds; conflicting = decision.conflictingAssertionIds; rejected = decision.rejectedAssertionIds;
        if (canonical([...selected, ...conflicting, ...rejected]) !== canonical(candidates.map(c => c.a.assertionId)))
          fail("Resolution must account for every assertion; provenance cannot truncate");
      } else if (new Set(candidates.map(c => canonical(c.a.value))).size === 1) selected = candidates.map(c => c.a.assertionId);
      else { conflicting = candidates.map(c => c.a.assertionId); reasons.push(`conflicting:${f}`); }
      const selectedRows = candidates.filter(c => selected.includes(c.a.assertionId));
      if (new Set(selectedRows.map(c => canonical(c.a.value))).size > 1) fail("Selected assertions disagree");
      if (selectedRows.length) facts[f] = selectedRows[0].a.value;
      const allEvidence = candidates.map(c => c.obs.evidenceId);
      fieldMap.push({ occurrenceId: o.id, field: f, selectedAssertionIds: selected, conflictingAssertionIds: conflicting,
        rejectedAssertionIds: rejected, reason: decision?.reason ?? (selected.length ? "corroborated" : "unresolved-conflict"),
        reviewer: decision?.reviewer ?? (selected.length ? "offline-corroboration" : null),
        resolvedAt: decision?.resolvedAt ?? (selected.length ? candidates.map(c => c.obs.checkedAt).sort().at(-1)! : null),
        evidenceIds: [...new Set(allEvidence)], sourceIds: [...new Set(candidates.map(c => c.obs.sourceId))] });
    }
    fieldSourceMap.push(...fieldMap);
    const selectedEvidence = [...new Set(fieldMap.flatMap(f => f.selectedAssertionIds.map(a => assertionMap.get(a)!.observation.evidenceId)))];
    const selectedObs = selectedEvidence.map(e => observations.get(e)!);
    const explicit = (v: Observation) => v.seasonEvidence.year === o.year && v.seasonEvidence.season === o.season &&
      !["footer-only", "absent"].includes(v.seasonEvidence.basis) && v.verification !== "historical/unconfirmed";
    if (!selectedObs.length || !selectedObs.every(explicit) || members.some(m => m.verification === "historical/unconfirmed")) reasons.push("historical/unconfirmed");
    if (members.some(m => m.eligibility !== "reviewed")) reasons.push("review-required");
    if (o.year !== input.target.year || o.season !== input.target.season) reasons.push("outside-target-season");
    const loc = locations.get(o.locationVersionId)!;
    if ([entities.get(o.attractionId)!, entities.get(o.operatorId)!, entities.get(loc.venueId)!].some(e => e.reviewState !== "reviewed")) reasons.push("identity-not-reviewed");
    const parsed = factsSchema.safeParse(facts);
    if (!parsed.success) reasons.push("missing-or-invalid-facts");
    let checkedAt: string | undefined;
    if (parsed.success) {
      const f = parsed.data;
      if (f.coordinates.status !== "verified" || loc.coordinates.status !== "verified") reasons.push("unresolved-coordinates");
      if (canonical(f.address) !== canonical(loc.address) || canonical(f.coordinates) !== canonical(loc.coordinates)) fail("Facts disagree with physical location version");
      if (f.season.season !== o.season || f.season.year !== o.year || f.verification !== o.verification) fail("Occurrence fact envelope mismatch");
      if (!selectedObs.some(v => v.verification === o.verification)) reasons.push("unsupported-verification-state");
      const dates = [...f.calendar.dates, ...f.calendar.intervals.flatMap(i => [i.start, i.end!]), ...f.calendar.excludedDates];
      if (dates.some(d => !d.startsWith(`${o.year}-`))) fail("Calendar outside explicit occurrence year");
      const inCalendar = (d: string) => !f.calendar.excludedDates.includes(d) && (f.calendar.dates.includes(d) ||
        f.calendar.intervals.some(i => d >= i.start && d <= i.end!));
      if (f.hours?.some(h => !inCalendar(h.date) || (!h.closesNextDay && h.closes <= h.opens))) fail("Hours outside calendar/invalid interval");
      for (const v of selectedObs) {
        const s = sources.get(v.sourceId)!;
        if (!s.rules.years.includes(o.year) || !s.rules.seasons.includes(o.season) || f.activityTypes.some(t => !s.rules.categories.includes(t)))
          reasons.push("source-season-category-rule");
      }
      checkedAt = selectedObs.map(v => v.checkedAt).sort()[0];
      if (f.coordinates.verifiedAt && f.coordinates.verifiedAt > selectedObs.map(v => v.checkedAt).sort().at(-1)!) fail("Coordinate review after evidence check");
    }
    const calendarFacts = parsed.success ? parsed.data.calendar : null;
    const spans = calendarFacts ? [...calendarFacts.dates.filter(d => !calendarFacts.excludedDates.includes(d)).map(d => ({ start: d, end: d })),
      ...calendarFacts.intervals] : [{ start: `${o.year}-01-01`, end: `${o.year}-12-31` }];
    for (const l of input.lifecycle.filter(l => applies(l, o) && l.state !== "active-assertion")) {
      if (spans.some(s => s.end! >= l.effective.start && (l.effective.end === null || s.start <= l.effective.end))) reasons.push(`lifecycle:${l.state}`);
    }
    if (reasons.length) exclusions.push({ occurrenceId: o.id, reasons: [...new Set(reasons)], evidenceIds: obs.map(v => v.evidenceId) });
    else runtime.occurrences.push({ occurrenceId: o.id, memberOccurrenceIds: members.map(m => m.id), attractionId: o.attractionId,
      operatorId: o.operatorId, locationVersionId: o.locationVersionId, eligibility: "eligible", facts: parsed.success ? parsed.data : fail("Unreachable invalid facts"),
      checkedAt: checkedAt!, fieldProvenance: fieldMap });
  }
  if (runtime.occurrences.length > LIMITS.published) fail("Published occurrences exceed 100");
  if (byteLength(runtime) > LIMITS.runtimeBytes) fail("Runtime JSON exceeds 2 MiB");
  return { runtime, fieldSourceMap, exclusions, tombstones, ledger: input, reviewedIdentityCount };
}

const revisionFor = (v: Pick<Snapshot, "runtime" | "fieldSourceMap" | "exclusions" | "tombstones" | "ledger">) =>
  digest({ runtime: v.runtime, fieldSourceMap: v.fieldSourceMap, exclusions: v.exclusions, tombstones: v.tombstones, ledger: v.ledger });
function describeDiff(before: Snapshot | undefined, runtime: Snapshot["runtime"]): string {
  const old = new Map(before?.runtime.occurrences.map(o => [o.occurrenceId, o]) ?? []);
  const now = new Map(runtime.occurrences.map(o => [o.occurrenceId, o]));
  const lines: string[] = [];
  for (const [id, o] of now) lines.push(!old.has(id) ? `ADD ${id} ${o.facts.name}` : canonical(old.get(id)) !== canonical(o) ? `CHANGE ${id} ${o.facts.name}` : `UNCHANGED ${id} ${o.facts.name}`);
  for (const id of old.keys()) if (!now.has(id)) lines.push(`EXCLUDE ${id} (retained in review ledger)`);
  return ["Seasonal facts v1 — offline reviewed facts", ...lines.sort()].join("\n") + "\n";
}
export function buildSnapshot(raw: unknown, previous?: unknown): Snapshot {
  const before = previous === undefined ? undefined : verifySnapshot(previous);
  const input = sorted(retainPrior(inputSchema.parse(raw), before?.ledger));
  const { reviewedIdentityCount, ...core } = compile(input);
  const payload = { ...core, diff: describeDiff(before, core.runtime) };
  const artifacts = Object.fromEntries(artifactNames.map(k => [k, { sha256: artifactDigest(payload[k]), bytes: byteLength(payload[k]) }])) as Snapshot["manifest"]["artifacts"];
  return sorted(snapshotSchema.parse({ ...payload, manifest: { schemaVersion: VERSION,
    contentRevision: revisionFor(core), lastGoodCheckedAt: core.runtime.occurrences.map(o => o.checkedAt).sort()[0] ?? null,
    publishedCount: core.runtime.occurrences.length, reviewedIdentityCount, artifacts } }));
}
export function verifySnapshot(raw: unknown): Snapshot {
  const snapshot = snapshotSchema.parse(raw);
  if (byteLength(snapshot.runtime) > LIMITS.runtimeBytes) fail("Runtime JSON exceeds 2 MiB");
  for (const k of artifactNames) if (artifactDigest(snapshot[k]) !== snapshot.manifest.artifacts[k].sha256 ||
    byteLength(snapshot[k]) !== snapshot.manifest.artifacts[k].bytes) fail(`Manifest mismatch: ${k}`);
  if (revisionFor(snapshot) !== snapshot.manifest.contentRevision) fail("Content revision mismatch");
  const rebuilt = compile(snapshot.ledger);
  for (const k of ["runtime", "fieldSourceMap", "exclusions", "tombstones"] as const)
    if (canonical(rebuilt[k]) !== canonical(snapshot[k])) fail(`Schema/ledger mismatch: ${k}`);
  if (snapshot.manifest.publishedCount !== rebuilt.runtime.occurrences.length ||
    snapshot.manifest.reviewedIdentityCount !== rebuilt.reviewedIdentityCount ||
    snapshot.manifest.lastGoodCheckedAt !== (rebuilt.runtime.occurrences.map(o => o.checkedAt).sort()[0] ?? null)) fail("Manifest counts/freshness mismatch");
  return sorted(snapshot);
}
export function refreshSnapshot(previous: Snapshot, raw: unknown): { ok: true; snapshot: Snapshot } | { ok: false; snapshot: Snapshot; error: string } {
  const lastGood = verifySnapshot(previous);
  try { return { ok: true, snapshot: buildSnapshot(raw, lastGood) }; }
  catch (error) { return { ok: false, snapshot: lastGood, error: error instanceof Error ? error.message : String(error) }; }
}
