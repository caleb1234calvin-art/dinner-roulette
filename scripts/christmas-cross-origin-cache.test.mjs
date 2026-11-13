import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { flush } from "./test-support/discovery-clock.mjs";

// Run this same executable with cwd set to the unchanged reviewed checkout for
// before evidence. Only network transport is replaced; source facts, search,
// cache, mounted radial session, decoration and binding are application code.
const load = appModuleLoader();
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load("src/lib/date-night/christmas-binding.ts");
const reviewed = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8")).element;
const parkId = "date-night-osm-way-987588580";
const origins = { A: { lat: 37.1734644, lon: -94.3130247 }, B: { lat: 37.1744644, lon: -94.3130247 } };
const query = origin => ({ ...origins[origin], radiusMiles: 15, halloweenActive: false, activityTypes: ["movies", "park"] });
const stale = { ...structuredClone(reviewed), version: 3, changeset: 189037688 };
const school = { ...structuredClone(stale), tags: { ...reviewed.tags, amenity: "school" } };
delete school.tags.leisure;
const fillers = Array.from({ length: 19_998 }, (_, i) => ({ type: "node", id: 10_000_000 + i, tags: { amenity: "school" } }));
const overflow = [...fillers, fillers[0], fillers[0], school];
assert.equal(overflow.length, 20_001);
const recoveryPackets = { stale: [stale], conflict: [reviewed, school], valid: [reviewed] };
const expected = { stale: "stale-source", conflict: "conflicting-source", valid: "bound" };
const receipt = { applicationRoot: resolve("."), time: "2026-12-05T18:00:00-06:00", scope: "radial-v1:core", origins,
  source: { id: parkId, version: reviewed.version, changeset: reviewed.changeset },
  syntheticControls: "v3/v4 revisions, school classifications, filler nodes and unrelated park are adversarial fixtures, not live OSM findings.", cases: [] };

const binding = (response, origin = "A") => resolveChristmasParkBinding(decorateDateNight(response?.venues ?? [], origins[origin]), REVIEWED_CHRISTMAS_BINDINGS).state;
const settle = async () => { for (let i = 0; i < 6; i++) await flush(); };
function transport(t) {
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse(receipt.time) });
  t.mock.method(console, "warn", () => {});
  const calls = [];
  let mode = "complete";
  let outdoor = [reviewed], culture;
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    const selected = new URLSearchParams(init.body).get("data").split(")->.lifecycle_context;\n").at(-1);
    const group = selected.includes('nwr["amenity"="cinema"](around:') ? "movies" : "park";
    calls.push({ mode, group });
    if (group === "movies" && mode === "timeout") throw new Error("Controlled provider timeout");
    const elements = group === "park" ? outdoor : mode === "overflow" ? overflow : culture ?? recoveryPackets[mode] ?? [];
    return { ok: true, json: async () => ({ elements }) };
  });
  return { calls, setMode(value) { mode = value; culture = undefined; }, setOutdoor(value) { outdoor = value; }, setCulture(value) { mode = "custom"; culture = value; }, async search(q) {
    return searchDateNight({ data: { lat: q.lat, lon: q.lon, radiusMiles: q.radiusMiles,
      spookySeasonEnabled: false, activityTypes: q.activityTypes, patchId: q.patchId ?? "radial-v1:core" } });
  } };
}

for (const phase of ["first partial", "later partial", "before first loss", "school-only completion"]) {
  for (const recovery of phase === "school-only completion" ? ["conflict"] : ["stale", "conflict"]) {
    test(`${phase} ${recovery} facts survive a subsequent complete-v2 recovery across origins`, async t => {
      const source = transport(t), cache = createDateNightRadialCache();
      const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
      const oldB = await source.search(b); cache.store(b, oldB);
      const contrary = recoveryPackets[recovery];
      if (phase === "before first loss") {
        source.setOutdoor(contrary); cache.store(a, await source.search(a));
        assert.equal(binding(cache.read(b).response), "bound", "Existing no-loss origin isolation remains unchanged");
      }
      source.setOutdoor(phase === "first partial" ? contrary : [reviewed]);
      source.setMode("overflow"); cache.store(a, await source.search(a));
      assert.equal(binding(cache.read(b).response), "incomplete-source-evidence");
      if (phase === "later partial") { source.setOutdoor(contrary); cache.store(a, await source.search(a)); }
      const movies = { ...a, activityTypes: ["movies"] };
      if (phase === "school-only completion") {
        source.setCulture([school]); cache.store(movies, await source.search(movies));
        assert.equal(binding(cache.read(b).response), "incomplete-source-evidence", "An ineligible-only packet supplies no fresh eligible park identity");
      }
      source.setMode("valid"); cache.store(movies, await source.search(movies));
      assert.equal(binding(cache.read(a).response), expected[recovery]);
      assert.equal(binding(cache.read(b).response), expected[recovery], "Complete scope recovery cannot erase a received canonical contradiction");
      assert.equal(binding({ venues: cache.annotateIdentityEvidence(oldB.venues) }), expected[recovery]);
    });
  }
}

for (const kind of ["cache-hit", "opaque", "wrong origin", "wrong category", "unrelated canonical ID", "missing revision"]) {
  test(`${kind} response cannot discharge another origin's canonical proof`, async t => {
    const source = transport(t), cache = createDateNightRadialCache();
    const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
    const oldB = await source.search(b); cache.store(b, oldB);
    source.setMode("overflow"); cache.store(a, await source.search(a));
    source.setMode("valid");
    const movies = { ...a, activityTypes: ["movies"] }, candidate = await source.search(movies);
    if (kind === "cache-hit") candidate.discovery.groups = candidate.discovery.groups.map(group => ({ ...group, outcome: "cache-hit", originOutcome: group.outcome }));
    if (kind === "opaque") { delete candidate.identityEvidenceCoverage; delete candidate.discovery; }
    if (kind === "wrong origin") candidate.identityEvidenceCoverage.scope.lat += 1;
    if (kind === "wrong category") candidate.identityEvidenceCoverage.activityTypes = ["museum"];
    if (kind === "unrelated canonical ID") {
      const foreign = { ...structuredClone(reviewed), id: 987588581, tags: { ...reviewed.tags, name: "Synthetic unrelated park" } };
      source.setCulture([foreign]); Object.assign(candidate, await source.search(movies));
    }
    if (kind === "missing revision") {
      for (const item of [...candidate.identityObservations, ...candidate.venues.flatMap(venue => venue.discoveryEvidence ?? [])]) delete item.sourceIdentity.version;
    }
    cache.store(movies, candidate);
    assert.equal(binding(cache.read(b).response), "incomplete-source-evidence");
    source.setMode("valid"); cache.store(movies, await source.search(movies));
    assert.equal(binding(cache.read(b).response), "bound", "A fresh complete matching v2 packet resolves missing proof");
  });
}

test("recovery ledger deduplicates actual facts and bounds total revisions without fabricated negatives", async t => {
  const source = transport(t);
  const cache = createDateNightRadialCache({ maxVenues: 2 });
  // Keep only this real provider identity, excluding unrelated local catalog
  // rows, so the two-item budget tests proof accumulation rather than packets.
  const store = (q, response) => cache.store(q, { ...response, venues: response.venues.filter(row => row.id === parkId) });
  const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
  const oldB = await source.search(b); store(b, oldB);
  source.setMode("overflow"); store(a, await source.search(a));
  const movies = { ...a, activityTypes: ["movies"] };
  source.setMode("valid");
  for (let i = 0; i < 4; i++) store(movies, await source.search(movies));
  assert.equal(binding({ venues: cache.annotateIdentityEvidence(oldB.venues) }), "bound", "Duplicate proof facts do not consume new observation slots");
  source.setMode("stale"); store(movies, await source.search(movies));
  assert.equal(binding({ venues: cache.annotateIdentityEvidence(oldB.venues) }), "stale-source");
  source.setCulture([{ ...structuredClone(stale), version: 4, changeset: 189037689 }]);
  store(movies, await source.search(movies));
  const retained = cache.annotateIdentityEvidence(oldB.venues).filter(row => row.id === parkId);
  assert.equal(binding({ venues: retained }), "incomplete-source-evidence");
  assert.equal(retained[0].identityUncertainty.overflow, true);
  assert.equal(retained[0].lifecycle, undefined);
  assert.deepEqual(retained[0].discoveryEvidence.map(item => item.sourceIdentity.version).sort(), [2, 3], "Overflow preserves recorded facts and separately reports omitted evidence");
  source.setMode("valid"); store(movies, await source.search(movies));
  assert.equal(binding({ venues: cache.annotateIdentityEvidence(oldB.venues) }), "incomplete-source-evidence", "Capacity loss is sticky for this mounted cache");
});

for (const kind of ["missing revision", "wrong source object", "embedded foreign identity"]) {
  test(`mixed complete-v2 plus ${kind} recovery retains uncertainty across origins`, async t => {
    const source = transport(t), cache = createDateNightRadialCache();
    const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
    const oldB = await source.search(b); cache.store(b, oldB);
    source.setMode("overflow"); cache.store(a, await source.search(a));
    source.setMode("valid");
    const movies = { ...a, activityTypes: ["movies"] }, fresh = await source.search(movies);
    const bad = structuredClone(fresh.identityObservations.find(item => item.id === parkId));
    if (kind === "missing revision") delete bad.sourceIdentity.version;
    if (kind === "wrong source object") bad.sourceIdentity.objectId++;
    if (kind === "embedded foreign identity") {
      bad.sourceIdentity.objectId++;
      bad.id = `date-night-osm-way-${bad.sourceIdentity.objectId}`;
      fresh.venues.find(row => row.id === parkId).discoveryEvidence.push(bad);
    } else fresh.identityObservations.push(bad);
    cache.store(movies, fresh);
    assert.equal(binding(cache.read(b).response), "incomplete-source-evidence");
    const retained = cache.annotateIdentityEvidence(oldB.venues).find(row => row.id === parkId);
    assert.deepEqual(retained.discoveryEvidence.map(item => item.sourceIdentity.version), [2], "Unknown or unrelated source facts cannot become a fabricated canonical revision");
    cache.store(movies, await source.search(movies));
    assert.equal(binding(cache.read(b).response), "bound", "Clean own-ID proof can resolve uncertainty without overriding other active origin-scoped gates");
  });
}

test("resolved canonical-proof identities still count toward the bounded slot budget", async t => {
  const source = transport(t), cache = createDateNightRadialCache({ maxVenues: 1 });
  const a = { ...query("A"), patchId: "radial-v1:core" };
  const store = (q, response, id = parkId) => cache.store(q, { ...response, venues: response.venues.filter(row => row.id === id) });
  const old = await source.search(a); store(a, old);
  source.setMode("overflow"); store(a, await source.search(a));
  const movies = { ...a, activityTypes: ["movies"] };
  source.setMode("valid"); store(movies, await source.search(movies));
  assert.equal(binding({ venues: cache.annotateIdentityEvidence(old.venues) }), "bound");
  const foreign = { ...structuredClone(reviewed), id: 987588581, tags: { ...reviewed.tags, name: "Synthetic unrelated park" } };
  source.setOutdoor([foreign]); source.setMode("overflow");
  store(a, await source.search(a), "date-night-osm-way-987588581");
  const retained = cache.annotateIdentityEvidence(old.venues).find(row => row.id === parkId);
  assert.equal(retained.identityUncertainty.overflow, true, "Completed proof facts cannot be forgotten to admit an unbounded number of identities");
  assert.equal(retained.lifecycle, undefined);
  assert.deepEqual(retained.discoveryEvidence.map(item => item.id), [parkId]);
});

test("shared loss and canonical recovery never attach park revisions to an unrelated ordinary identity", async t => {
  const source = transport(t), cache = createDateNightRadialCache();
  const foreign = { ...structuredClone(reviewed), id: 987588581, center: { ...reviewed.center, lat: reviewed.center.lat + 0.002 },
    tags: { ...reviewed.tags, name: "Synthetic unrelated park" } };
  const foreignId = "date-night-osm-way-987588581";
  source.setOutdoor([reviewed, foreign]);
  const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
  const oldB = await source.search(b); cache.store(b, oldB);
  source.setMode("overflow"); cache.store(a, await source.search(a));
  source.setMode("stale"); cache.store({ ...a, activityTypes: ["movies"] }, await source.search({ ...a, activityTypes: ["movies"] }));
  assert.equal(binding(cache.read(b).response), "stale-source");
  const other = cache.read(b).response.venues.find(row => row.id === foreignId);
  assert.equal(other.name, "Synthetic unrelated park");
  assert.deepEqual(other.discoveryEvidence.map(item => item.id), [foreignId]);
  assert.deepEqual(other.discoveryEvidence.map(item => item.sourceIdentity.version), [2]);
  const ordinary = eligibleDateNight(decorateDateNight([other], origins.B), { ...DEFAULT_DATE_NIGHT_FILTERS, openNowOnly: false }, false);
  assert.equal(ordinary.length, 1, "Binding uncertainty does not make an eligible ordinary venue unavailable");
});

for (const [cached, failed] of [["B", "A"], ["A", "B"]]) for (const recovery of ["stale", "conflict", "valid"]) {
  test(`mounted real search ${cached} → ${failed} → ${cached}: ${recovery} recovery stays canonical on zero-request hits`, async t => {
    const source = transport(t), states = [], requests = [];
    const cache = createDateNightRadialCache(), session = createDateNightRadialSession({ cache });
    t.after(() => session.dispose());
    const callbacks = { request: async q => { requests.push(structuredClone(q)); return source.search(q); }, onChange: value => states.push(value) };
    const record = { cached, failed, recovery, states: [], providerCalls: source.calls, requests };
    receipt.cases.push(record);
    t.after(() => { if (process.env.CHRISTMAS_CROSS_ORIGIN_RECEIPT) writeFileSync(process.env.CHRISTMAS_CROSS_ORIGIN_RECEIPT, JSON.stringify(receipt, null, 2) + "\n"); });
    const observe = label => {
      const response = states.at(-1).response, state = binding(response, label);
      const canonicalEvidence = (response?.venues ?? []).filter(row => row.id === parkId).flatMap(row => row.discoveryEvidence ?? [])
        .map(item => ({ id: item.id, sourceIdentity: item.sourceIdentity }));
      record.states.push({ origin: label, binding: state, providerRequests: source.calls.length, canonicalEvidence });
      return state;
    };
    session.update(query(cached), callbacks); await settle();
    assert.equal(observe(cached), "bound");
    source.setMode("overflow"); session.update(query(failed), callbacks); await settle();
    assert.equal(observe(failed), "incomplete-source-evidence");
    assert.equal(source.calls.filter(call => call.mode === "overflow" && call.group === "movies").length, 4);
    assert.equal(source.calls.filter(call => call.mode === "overflow" && call.group === "park").length, 1);
    let count = source.calls.length;
    session.update(query(cached), callbacks); await settle();
    assert.equal(source.calls.length, count, "Returning to the previously complete core makes no provider request");
    assert.equal(observe(cached), "incomplete-source-evidence");
    source.setMode(recovery); session.update(query(failed), callbacks); await settle();
    assert.deepEqual(requests.at(-1).activityTypes, ["movies"], "Only the failed Movies group is reacquired");
    assert.equal(observe(failed), expected[recovery]);
    count = source.calls.length;
    session.update(query(cached), callbacks); await settle();
    assert.equal(source.calls.length, count, "Recovery evidence must follow a canonical ID without invalidating category coverage");
    assert.equal(observe(cached), expected[recovery], "Another cached origin cannot discard the disqualifying recovery packet");
    session.update(query(failed), callbacks); await settle();
    assert.equal(source.calls.length, count, "Both origin-switch directions remain zero-request cache hits");
    assert.equal(observe(failed), expected[recovery]);
    const ordinary = eligibleDateNight(decorateDateNight(states.at(-1).response.venues, origins[failed]),
      { ...DEFAULT_DATE_NIGHT_FILTERS, activityTypes: ["park"], openNowOnly: false }, false, {}, [], Date.parse(receipt.time));
    assert.ok(ordinary.some(row => row.id === parkId), "Canonical binding restrictions must preserve ordinary park discovery");
    assert.equal(states.at(-1).response.venues.some(row => row.activityTypes.includes("school")), false);
    assert.equal(states.at(-1).response.venues.some(row => row.id.startsWith("date-night-osm-node-1000")), false);
  });
}

for (const loss of ["overflow", "timeout"]) for (const recovery of ["stale", "conflict", "valid"]) {
  test(`cache ${loss} partial success carries ${recovery} proof through source-entry eviction and presentation rows`, async t => {
    const source = transport(t);
    let now = 0;
    const cache = createDateNightRadialCache({ now: () => now, ttlMs: 100, maxEntries: 3 });
    const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
    const oldB = await source.search(b); cache.store(b, oldB);
    now = 1; source.setMode(loss); cache.store(a, await source.search(a));
    assert.equal(binding(cache.read(b).response), "incomplete-source-evidence");
    now = 2; source.setMode(recovery);
    const movies = { ...a, activityTypes: ["movies"] }, fresh = await source.search(movies);
    cache.store(movies, fresh);
    assert.equal(binding(cache.read(b).response), expected[recovery]);
    assert.equal(binding({ venues: cache.annotateIdentityEvidence(oldB.venues) }), expected[recovery], "Session-owned rows receive the same canonical recovery proof");
    // Touch B, then push three unrelated empty entries; no retained place may
    // be rehabilitated because the source-owning entry leaves the LRU.
    for (let i = 0; i < 3; i++) {
      cache.read(b);
      const distant = { ...a, lat: a.lat + 1 + i, activityTypes: ["movies"] };
      source.setMode("complete"); cache.store(distant, await source.search(distant));
    }
    assert.equal(binding(cache.read(b).response), expected[recovery]);
    const retained = cache.annotateIdentityEvidence(oldB.venues);
    now = 103;
    assert.equal(cache.read(b).response, null, "Identity proof must not rejuvenate ordinary coverage TTL");
    assert.equal(binding({ venues: cache.annotateIdentityEvidence(retained) }), expected[recovery], "Expiration cannot rehabilitate session-retained identity facts");
  });
}

for (const recovery of ["stale", "conflict", "valid"]) for (const embeddedOnly of [false, true]) {
  test(`expired pre-loss copy returns after ${recovery} recovery (${embeddedOnly ? "embedded" : "full"} evidence)`, async t => {
    const source = transport(t);
    let now = 0;
    const cache = createDateNightRadialCache({ now: () => now, ttlMs: 100 });
    const a = { ...query("A"), patchId: "radial-v1:core" }, b = { ...query("B"), patchId: "radial-v1:core" };
    const oldB = await source.search(b); cache.store(b, oldB);
    source.setMode("overflow"); cache.store(a, await source.search(a));
    assert.equal(binding(cache.read(b).response), "incomplete-source-evidence");
    now = 101; assert.equal(cache.read(b).response, null);
    source.setMode(recovery);
    const movies = { ...a, activityTypes: ["movies"] }, fresh = await source.search(movies);
    if (embeddedOnly) delete fresh.identityObservations;
    cache.store(movies, fresh);
    const opaque = structuredClone(oldB); delete opaque.identityEvidenceCoverage;
    cache.store(b, opaque);
    assert.equal(binding(cache.read(b).response), expected[recovery], "An opaque pre-loss row cannot outlive the canonical proof that replaced its obligation");
    assert.equal(binding({ venues: cache.annotateIdentityEvidence(oldB.venues) }), expected[recovery]);
  });
}
