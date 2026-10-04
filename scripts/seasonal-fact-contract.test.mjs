import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fixtureInput, fixtureSource, FIXTURE_TIME } from "../tools/seasonal-facts/fixtures.ts";
import { buildSnapshot, verifySnapshot, refreshSnapshot } from "../tools/seasonal-facts/builder.ts";
import { inputSchema, source, LIMITS, coordinates } from "../tools/seasonal-facts/schema.ts";
import { canonical, digest, occurrenceId, stableId } from "../tools/seasonal-facts/canonical.ts";
import { automaticCollectionAllowed, permissionApproved, validateUrl, assertPublicIp, validateDnsAndPeer,
  validateRedirectChain, validateResponseEnvelope, collectSource, EXECUTION_POLICY } from "../tools/seasonal-facts/policy.ts";
import { buildFile, writeSnapshot } from "../tools/seasonal-facts/io.ts";

const single = () => fixtureInput(1);
const getAssertion = (input, field, index = 0) => input.observations[index].assertions.find(a => a.field === field);
const mutate = (fn) => { const v = single(); fn(v); return v; };
const keyOccurrence = (v, key, year = 2026) => v.occurrences.find(o => o.occurrenceKey === key && o.year === year);
const record = (s, oid) => s.runtime.occurrences.find(r => r.occurrenceId === oid);
const addObservation = (input, field, value, suffix = "new") => {
  const o = structuredClone(input.observations[0]);
  o.evidenceId = `evidence:${suffix}`; o.contentHash = digest({ field, value });
  o.assertions = [{ assertionId: `assertion:${suffix}`, field, value }]; input.observations.push(o); return o;
};
const lifecycleRecord = (v, state, scope = "occurrence", subjectId = v.occurrences[0].id, effective = { start: "2026-01-01", end: null }) => {
  const obs = addObservation(v, "lifecycle", state, `lifecycle-${state}-${v.lifecycle.length}`);
  const l = { id: `lifecycle:${v.lifecycle.length}`, state, subject: { scope, id: subjectId }, effective,
    evidenceIds: [obs.evidenceId], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME };
  v.lifecycle.push(l); return l;
};

test("invented identity matrix produces seven eligible occurrences, four quarantines and closure tombstone", () => {
  const s = verifySnapshot(buildSnapshot(fixtureInput()));
  assert.equal(s.runtime.occurrences.length, 7); assert.equal(s.exclusions.length, 4); assert.equal(s.tombstones.length, 1);
  assert.equal(s.manifest.lastGoodCheckedAt, FIXTURE_TIME);
});
for (const where of ["root", "occurrence", "source", "assertion", "coordinate", "address"]) test(`strict unknown field rejection: ${where}`, () => {
  const v = single();
  const target = { root: v, occurrence: v.occurrences[0], source: v.sources[0], assertion: v.observations[0].assertions[0],
    coordinate: getAssertion(v, "coordinates").value, address: getAssertion(v, "address").value }[where];
  target.marketingDescription = "forbidden"; assert.throws(() => buildSnapshot(v));
});
for (const field of ["review", "description", "photos", "logos", "screenshots", "ranking", "popularity", "rating", "price", "articleText"])
  test(`fact-only rejection: ${field}`, () => { const v = single(); addObservation(v, field, "forbidden"); assert.throws(() => buildSnapshot(v)); });
test("malformed schema/version, nonfinite coordinate and invalid date are rejected", () => {
  for (const v of [null, { ...single(), schemaVersion: "v2" }, mutate(v => getAssertion(v, "coordinates").value.lat = NaN),
    mutate(v => getAssertion(v, "calendar").value.dates = ["2026-02-30"])]) assert.throws(() => buildSnapshot(v));
});
test("name/address/URL overflow fails explicitly", () => {
  for (const v of [mutate(v => getAssertion(v, "name").value = "n".repeat(201)),
    mutate(v => getAssertion(v, "address").value.street = "a".repeat(501)),
    mutate(v => v.observations[0].canonicalUrl = "https://seasonal.invalid/events/" + "a".repeat(2048))]) assert.throws(() => buildSnapshot(v));
});
test("exact 100 publication limit accepted, 101 rejected", () => {
  assert.equal(buildSnapshot(fixtureInput(100)).runtime.occurrences.length, 100);
  assert.throws(() => buildSnapshot(fixtureInput(101)), /Published occurrences/);
});
test("512 reviewed identities includes locations, quarantined and tombstone records", () => {
  const v = single();
  const n = v.identities.length + v.locations.length + v.occurrences.length;
  for (let i = n; i < 512; i++) v.identities.push({ id: `quarantine:${i}`, kind: "attraction", reviewState: i % 2 ? "quarantined" : "tombstone", reviewer: "reviewer", reviewedAt: FIXTURE_TIME });
  assert.equal(buildSnapshot(v).manifest.reviewedIdentityCount, 512);
  v.identities.push({ ...v.identities.at(-1), id: "overflow:identity" });
  assert.throws(() => buildSnapshot(v), /512/);
});
test("20 observations accepted, 21 rejected without provenance truncation", () => {
  const v = single(); for (let i = 1; i < 20; i++) addObservation(v, "name", getAssertion(v, "name").value, `duplicate-${i}`);
  const s = buildSnapshot(v); assert.equal(s.fieldSourceMap.find(f => f.field === "name").selectedAssertionIds.length, 20);
  addObservation(v, "name", getAssertion(v, "name").value, "overflow"); assert.throws(() => buildSnapshot(v), /exceed 20/);
});
test("runtime byte ceiling fails rather than truncating", () => {
  const v = fixtureInput(100);
  for (const o of [...v.observations]) for (let i = 1; i < 20; i++) {
    const copy = structuredClone(o); copy.evidenceId = stableId("evidence", [o.evidenceId, i]);
    copy.assertions = copy.assertions.map(a => ({ ...a, assertionId: stableId("assertion", [a.assertionId, i]) })); v.observations.push(copy);
  }
  assert.throws(() => buildSnapshot(v), /2 MiB/);
  assert.equal(LIMITS.runtimeBytes, 2097152);
});
test("Unicode NFC and whitespace normalize while display capitalization is preserved", () => {
  const v = single(); getAssertion(v, "name").value = "  Cafe\u0301\t Moon\nHaunt  ";
  assert.equal(buildSnapshot(v).runtime.occurrences[0].facts.name, "Café Moon Haunt");
});
test("conflicts quarantine, explicit review resolves and preserves all assertion/source IDs", () => {
  const v = single(); const old = getAssertion(v, "name"); const fresh = addObservation(v, "name", "Renamed Paper Haunt");
  assert.equal(buildSnapshot(v).runtime.occurrences.length, 0);
  v.resolutions.push({ occurrenceId: v.occurrences[0].id, field: "name", selectedAssertionIds: [fresh.assertions[0].assertionId],
    conflictingAssertionIds: [old.assertionId], rejectedAssertionIds: [], reason: "explicit-review", reviewer: "fixture-reviewer", resolvedAt: FIXTURE_TIME });
  const s = buildSnapshot(v); assert.equal(s.runtime.occurrences[0].facts.name, "Renamed Paper Haunt");
  const map = s.fieldSourceMap.find(f => f.field === "name"); assert.equal(map.evidenceIds.length, 2); assert.equal(map.conflictingAssertionIds.length, 1);
});
test("incomplete resolution, selected conflicts and overlapping sets are rejected", () => {
  const v = single(); const a = getAssertion(v, "name"); const b = addObservation(v, "name", "Other").assertions[0];
  const d = { occurrenceId: v.occurrences[0].id, field: "name", selectedAssertionIds: [a.assertionId], conflictingAssertionIds: [],
    rejectedAssertionIds: [], reason: "explicit-review", reviewer: "fixture-reviewer", resolvedAt: FIXTURE_TIME }; v.resolutions = [d];
  assert.throws(() => buildSnapshot(v), /every assertion/); d.selectedAssertionIds.push(b.assertionId);
  assert.throws(() => buildSnapshot(v), /disagree/); d.rejectedAssertionIds = [b.assertionId]; assert.throws(() => buildSnapshot(v), /Overlapping/);
});
for (const basis of ["footer-only", "absent"]) test(`current footer year is not season evidence: ${basis}`, () => {
  const v = single(); v.observations[0].seasonEvidence.basis = basis;
  assert.ok(buildSnapshot(v).exclusions[0].reasons.includes("historical/unconfirmed"));
});
test("historical/unconfirmed and mismatched season/year evidence quarantine", () => {
  const v = fixtureInput(); assert.ok(buildSnapshot(v).exclusions.some(e => e.reasons.includes("historical/unconfirmed")));
  const one = single(); one.observations[0].seasonEvidence.year = 2025; assert.equal(buildSnapshot(one).runtime.occurrences.length, 0);
});
test("all scoped negative lifecycle states survive in tombstones and exclude affected occurrences", () => {
  for (const state of ["season-not-operating", "event-cancelled", "moved", "disused", "permanently-closed"]) {
    const v = single(); lifecycleRecord(v, state); const s = buildSnapshot(v);
    assert.equal(s.runtime.occurrences.length, 0); assert.equal(s.tombstones[0].lifecycle.state, state);
  }
});
test("occurrence cancellation does not close other events at the venue", () => {
  const v = fixtureInput(2); lifecycleRecord(v, "event-cancelled"); const s = buildSnapshot(v);
  assert.equal(s.runtime.occurrences.length, 1); assert.equal(s.runtime.occurrences[0].occurrenceId, v.occurrences[1].id);
});
for (const [scope, id] of [["operator", "operator:lantern"], ["venue", "venue:paper-farm"]]) test(`${scope} lifecycle applies to its events`, () => {
  const v = fixtureInput(2); lifecycleRecord(v, "disused", scope, id); assert.equal(buildSnapshot(v).runtime.occurrences.length, 0);
});
test("past seasonal cancellation interval does not cancel this year's event", () => {
  const v = single(); lifecycleRecord(v, "event-cancelled", "occurrence", v.occurrences[0].id, { start: "2025-01-01", end: "2025-12-31" });
  const s = buildSnapshot(v); assert.equal(s.runtime.occurrences.length, 1); assert.equal(s.tombstones.length, 1);
});
test("unscoped negative, wrong scope and unsupported lifecycle evidence fail", () => {
  const v = single(); addObservation(v, "lifecycle", "permanently-closed"); assert.throws(() => buildSnapshot(v), /scoped/);
  const w = single(); lifecycleRecord(w, "disused", "attraction", "operator:lantern"); assert.throws(() => buildSnapshot(w), /wrong attraction/);
  const x = single(); const l = lifecycleRecord(x, "disused"); l.state = "permanently-closed"; assert.throws(() => buildSnapshot(x), /supporting assertion/);
});
test("closed attraction with active duplicate is excluded and terminal evidence retained", () => {
  const v = fixtureInput(); const s = buildSnapshot(v); assert.equal(record(s, keyOccurrence(v, "closed").id), undefined);
  assert.equal(s.tombstones[0].lifecycle.state, "permanently-closed");
});
test("moved venue uses the new location version and explicit moved-from relationship", () => {
  const v = fixtureInput(); const o = keyOccurrence(v, "moved"); const s = buildSnapshot(v);
  assert.equal(record(s, o.id).facts.address.street, "456 Imaginary Lantern Lane");
  assert.equal(s.ledger.relationships.find(r => r.kind === "moved-from").from, o.locationVersionId);
});
test("same address, category and generic farm preserve distinct event identity", () => {
  const v = fixtureInput(); const s = buildSnapshot(v); const a = record(s, keyOccurrence(v, "same-address-a").id), b = record(s, keyOccurrence(v, "same-address-b").id);
  assert.deepEqual(a.facts.coordinates.lat, b.facts.coordinates.lat); assert.notEqual(a.occurrenceId, b.occurrenceId);
  assert.ok(s.runtime.occurrences.filter(o => o.operatorId === "operator:lantern").length > 2);
});
test("missing OSM eligible; explicit OSM/web/catalog crosswalk has one event", () => {
  const v = fixtureInput(), s = buildSnapshot(v); assert.ok(record(s, keyOccurrence(v, "missing-osm").id));
  assert.equal(s.ledger.crosswalks.length, 3); assert.equal(s.runtime.occurrences.filter(o => o.occurrenceId === keyOccurrence(v, "osm-web").id).length, 1);
});
test("recurring next-year occurrences retain different IDs and prior-year relation", () => {
  const v = fixtureInput(), s = buildSnapshot(v); assert.notEqual(keyOccurrence(v, "recurring").id, keyOccurrence(v, "recurring", 2027).id);
  assert.ok(s.exclusions.find(e => e.occurrenceId === keyOccurrence(v, "recurring", 2027).id));
});
function aliased() {
  const v = single(), first = v.occurrences[0]; const second = { ...first, occurrenceKey: "alias" };
  second.id = occurrenceId(second.attractionId, second.season, second.year, second.occurrenceKey); v.occurrences.push(second);
  v.relationships.push({ id: "same:event", kind: "same-event", from: second.id, to: first.id, decision: "same",
    evidenceIds: [v.observations[0].evidenceId], reviewer: "fixture-reviewer", reviewedAt: FIXTURE_TIME }); return v;
}
test("explicit same-event and alias decisions combine evidence before any dedupe", () => {
  for (const kind of ["same-event", "alias-decision"]) { const v = aliased(); v.relationships.at(-1).kind = kind;
    const s = buildSnapshot(v); assert.equal(s.runtime.occurrences.length, 1); assert.equal(s.runtime.occurrences[0].memberOccurrenceIds.length, 2); }
});
test("do-not-merge overrides direct and transitive equivalence", () => {
  const v = aliased(), same = v.relationships.at(-1);
  v.relationships.push({ ...same, id: "distinct:alias", kind: "do-not-merge", decision: "distinct" }); assert.throws(() => buildSnapshot(v), /Do-not-merge/);
});
test("cyclic identity and unsupported crosswalk decisions reject", () => {
  const v = aliased(), r = v.relationships.at(-1); v.relationships.push({ ...r, id: "cycle", from: r.to, to: r.from }); assert.throws(() => buildSnapshot(v), /Cyclic/);
  const w = fixtureInput(); w.crosswalks[0].occurrenceId = "missing"; assert.throws(() => buildSnapshot(w), /Dangling crosswalk/);
});
test("stable IDs reject mutable name/address derivation and do not change with spelling", () => {
  const v = single(), before = v.occurrences[0].id; getAssertion(v, "name").value = "New Display Spelling";
  assert.equal(buildSnapshot(v).runtime.occurrences[0].occurrenceId, before); v.occurrences[0].id = "fake"; assert.throws(() => buildSnapshot(v), /Unstable/);
});
function reverseArrays(v) { return Array.isArray(v) ? v.map(reverseArrays).reverse() : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).reverse().map(([k, val]) => [k, reverseArrays(val)])) : v; }
test("entire output and content revision are deterministic independent of input ordering", () => {
  const v = fixtureInput(); assert.equal(canonical(buildSnapshot(v)), canonical(buildSnapshot(reverseArrays(v))));
  assert.equal(canonical(buildSnapshot(v)), canonical(buildSnapshot(v)));
});
test("candidate and unresolved coordinates never enter radius-ready facts", () => {
  for (const status of ["candidate", "unresolved"]) {
    const v = single(); v.locations[0].coordinates.status = status; getAssertion(v, "coordinates").value.status = status;
    assert.ok(buildSnapshot(v).exclusions[0].reasons.includes("unresolved-coordinates"));
  }
});
test("coordinate review and fingerprint are required; moved address cannot reuse old point", () => {
  const v = single(); v.locations[0].address.street = "Elsewhere"; assert.throws(() => buildSnapshot(v), /fingerprint/);
  const c = structuredClone(single().locations[0].coordinates); c.reviewer = null; assert.throws(() => coordinates.parse(c));
});
test("calendar/timezone remain explicit with local overnight closing semantics", () => {
  const f = buildSnapshot(single()).runtime.occurrences[0].facts;
  assert.equal(f.timezone, "America/Chicago"); assert.equal(f.hours[0].closesNextDay, true);
  for (const v of [mutate(v => getAssertion(v, "timezone").value = "Not/A_Timezone"),
    mutate(v => getAssertion(v, "calendar").value.dates = ["2025-10-17"]),
    mutate(v => getAssertion(v, "hours").value[0].date = "2026-10-18")]) assert.throws(() => buildSnapshot(v));
});
test("missing field/record is not deletion; previous facts retain their checkedAt", () => {
  const v = single(); addObservation(v, "phone", "+1 555 010 1234", "phone"); const before = buildSnapshot(v);
  const fresh = single(); fresh.observations = []; const after = buildSnapshot(fresh, before);
  assert.equal(after.runtime.occurrences[0].facts.phone, "+1 555 010 1234"); assert.equal(after.manifest.lastGoodCheckedAt, FIXTURE_TIME);
});
test("failed refresh preserves last-good bytes and freshness; immutable evidence cannot be replaced", () => {
  const v = single(), old = buildSnapshot(v); const invalid = structuredClone(v); invalid.extra = "rejected";
  const result = refreshSnapshot(old, invalid); assert.equal(result.ok, false); assert.equal(canonical(result.snapshot), canonical(old));
  getAssertion(v, "name").value = "Changed under same evidence ID"; assert.throws(() => buildSnapshot(v, old), /Immutable observations/);
});
test("terminal negatives survive omission in later refresh", () => {
  const v = single(); lifecycleRecord(v, "permanently-closed"); const before = buildSnapshot(v), fresh = single();
  const after = buildSnapshot(fresh, before); assert.equal(after.tombstones.length, 1); assert.equal(after.runtime.occurrences.length, 0);
});
test("schema/manifest mismatch fails atomically and leaves output bytes unchanged", () => {
  const dir = mkdtempSync(join(tmpdir(), "seasonal-facts-"));
  try {
    const output = join(dir, "bundle.json"), input = join(dir, "input.json"); const good = buildSnapshot(single());
    writeSnapshot(output, good); const old = readFileSync(output, "utf8"); const bad = structuredClone(good); bad.manifest.artifacts.runtime.sha256 = "0".repeat(64);
    assert.throws(() => writeSnapshot(output, bad), /Manifest mismatch/); assert.equal(readFileSync(output, "utf8"), old);
    writeFileSync(input, JSON.stringify({ ...single(), bogus: true })); assert.throws(() => buildFile(input, output, output));
    assert.equal(readFileSync(output, "utf8"), old); assert.deepEqual(readdirSync(dir).sort(), ["bundle.json", "input.json"]);
    writeFileSync(input, JSON.stringify(single())); buildFile(input, output); assert.equal(readFileSync(output, "utf8"), old);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test("tampered manifest freshness/count or runtime data is rejected", () => {
  for (const mutate of [s => s.manifest.lastGoodCheckedAt = "2026-10-02T12:00:00.000Z", s => s.manifest.publishedCount = 0,
    s => s.runtime.occurrences[0].facts.name = "Tampered"]) { const s = buildSnapshot(single()); mutate(s); assert.throws(() => verifySnapshot(s)); }
});
test("adapters are disabled by default; true cannot be parsed", () => {
  assert.equal(source.parse(fixtureSource()).enabled, false); assert.throws(() => source.parse({ ...fixtureSource(), enabled: true }));
  assert.equal(automaticCollectionAllowed(fixtureSource(), FIXTURE_TIME), false); assert.throws(() => collectSource(), /OFFLINE_ONLY/);
});
function approvedSource() {
  const s = fixtureSource(), review = { state: "approved", evidenceIds: ["permission:invented"], reviewer: "reviewer", reviewedAt: "2026-09-01T12:00:00.000Z" };
  s.robots = review; s.terms = review; s.permission = { ...review, reuse: "approved", expiresAt: "2026-12-01T12:00:00.000Z" }; s.mode = "automatic"; return s;
}
test("permission review cannot be bypassed by public reachability, approval flag, expiry or automatic mode", () => {
  const s = approvedSource(); assert.equal(permissionApproved(s, FIXTURE_TIME), true); assert.equal(automaticCollectionAllowed(s, FIXTURE_TIME), false);
  for (const change of [s => s.permission.state = "unknown", s => s.permission.state = "conflicting", s => s.permission.reuse = "denied",
    s => s.robots.state = "unknown", s => s.terms.state = "denied", s => s.permission.evidenceIds = [],
    s => s.permission.expiresAt = FIXTURE_TIME, s => s.permission.reviewer = null]) {
    const v = approvedSource(); change(v); assert.equal(permissionApproved(v, FIXTURE_TIME), false); assert.equal(automaticCollectionAllowed(v, FIXTURE_TIME), false);
  }
});
const allowed = "https://seasonal.invalid/events/invented?year=2026";
for (const hostile of ["http://seasonal.invalid/events/a", "https://seasonal.invalid:444/events/a", "https://u:p@seasonal.invalid/events/a",
  "https://@seasonal.invalid/events/a", "https://127.0.0.1/events/a", "https://2130706433/events/a", "https://0x7f000001/events/a",
  "https://[::ffff:127.0.0.1]/events/a", "https://seasonal.invalid.evil.invalid/events/a", "https://seasonal.invalid./events/a",
  "https://seasonal.invalid/other", "https://seasonal.invalid/events-other", "https://seasonal.invalid/events/../events/a",
  "https://seasonal.invalid/events/%2e%2e/a", "https://seasonal.invalid/events/%252f/a", "https://seasonal.invalid/events/a#x",
  "https://seasonal.invalid/events/a?redirect=https://bad.invalid", "https://seasonal.invalid/events/a?year=2026&year=2027",
  "https://seasonal.invalid/events/a?year=2025", "https://seasonal.invalid\\@bad.invalid/events/a", "file:///events/a"])
  test(`hostile URL rejected: ${hostile}`, () => assert.throws(() => validateUrl(hostile, fixtureSource())));
test("exact synthetic HTTPS host, port 443, path and allowed query pass pure policy", () => {
  assert.equal(validateUrl(allowed, fixtureSource()).hostname, "seasonal.invalid"); validateUrl("https://seasonal.invalid:443/events/a", fixtureSource());
});
for (const ip of ["0.0.0.0", "10.1.2.3", "100.100.100.200", "127.0.0.1", "169.254.169.254", "172.31.255.255", "192.168.1.1",
  "192.0.2.1", "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "255.255.255.255", "168.63.129.16", "::", "::1",
  "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:8.8.8.8", "64:ff9b::a00:1", "fc00::1", "fe80::1", "ff02::1", "2001:db8::1", "2002:7f00:1::", "3fff::1", "fe80::1%eth0"])
  test(`SSRF reserved/private/mapped address denied: ${ip}`, () => assert.throws(() => assertPublicIp(ip)));
test("DNS answers all validated, peer pinned; equivalent public IPv6 spellings compare equal", () => {
  validateDnsAndPeer(allowed, fixtureSource(), ["8.8.8.8"], "8.8.8.8");
  validateDnsAndPeer(allowed, fixtureSource(), ["2606:4700:4700::1111"], "2606:4700:4700:0:0:0:0:1111");
  for (const [answers, peer] of [[[], "8.8.8.8"], [["8.8.8.8", "127.0.0.1"], "8.8.8.8"], [["8.8.8.8"], "1.1.1.1"]])
    assert.throws(() => validateDnsAndPeer(allowed, fixtureSource(), answers, peer));
});
test("each redirect target revalidated, maximum two redirects", () => {
  validateRedirectChain([allowed, allowed, allowed], fixtureSource());
  assert.throws(() => validateRedirectChain([allowed, allowed, allowed, allowed], fixtureSource()));
  assert.throws(() => validateRedirectChain([allowed, "https://127.0.0.1/events/a"], fixtureSource()));
  assert.throws(() => validateRedirectChain([allowed, "https://seasonal.invalid/forbidden"], fixtureSource()));
});
test("bounded headers/wire/decompressed body/deadline/DOM/JSON-LD/request budget", () => {
  const s = fixtureSource(); s.budget.requests = 1;
  const metrics = { contentType: "text/html", headerBytes: 100, wireBytes: 100, decompressedBytes: 100, elapsedMs: 10, domNodes: 1, depth: 1, jsonLdBytes: 0, requests: 1 };
  validateResponseEnvelope(s, metrics);
  for (const [key, value] of Object.entries({ contentType: "image/png", headerBytes: 16385, wireBytes: 2097153, decompressedBytes: 2097153,
    elapsedMs: 10001, domNodes: 20001, depth: 65, jsonLdBytes: 262145, requests: 2 })) assert.throws(() => validateResponseEnvelope(s, { ...metrics, [key]: value }));
  assert.throws(() => validateResponseEnvelope(s, { ...metrics, elapsedMs: NaN }));
});
test("no executable extraction or fallback capability is exposed", () => {
  assert.equal(EXECUTION_POLICY.retries, 0); assert.equal(EXECUTION_POLICY.paidFallback, false);
  for (const k of ["scripts", "browser", "eval", "llmExtraction", "remoteCode", "subresources", "credentials", "accessBypass", "arbitraryUserUrls"])
    assert.equal(EXECUTION_POLICY[k], false);
});
test("unmocked network attempts remain zero when guard is preloaded", () => {
  if (globalThis.__seasonalNetworkAttempts) assert.equal(globalThis.__seasonalNetworkAttempts(), 0);
  assert.equal(inputSchema.parse(single()).sources[0].enabled, false);
});
test("reused verified coordinates cannot cite another physical location's evidence", () => {
  const v = fixtureInput(2); v.locations[0].coordinates.evidenceIds = [v.observations[1].evidenceId];
  getAssertion(v, "coordinates").value.evidenceIds = [v.observations[1].evidenceId];
  assert.throws(() => buildSnapshot(v), /another physical location/);
});
test("source IDs, URLs and checkedAt facts cannot misstate observation metadata", () => {
  for (const [field, value] of [["sourceId", "other"], ["sourceUrl", "https://seasonal.invalid/events/other"], ["checkedAt", "2026-10-03T12:00:00.000Z"]]) {
    const v = single(); addObservation(v, field, value); assert.throws(() => buildSnapshot(v), /metadata assertion mismatch/);
  }
});
test("core offline dependencies are existing Zod and Node builtins, without paid SDKs", () => {
  const names = ["schema.ts", "canonical.ts", "policy.ts", "builder.ts", "io.ts", "cli.ts"];
  for (const name of names) {
    const code = readFileSync(new URL(`../tools/seasonal-facts/${name}`, import.meta.url), "utf8");
    for (const [, specifier] of code.matchAll(/from\s+["']([^"']+)["']/g))
      assert.ok(specifier === "zod" || specifier.startsWith("node:") || specifier.startsWith("./"), specifier);
  }
});
