import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { deferred, discoveryClock, flush } from "./test-support/discovery-clock.mjs";

// Run this same file with cwd set to the reviewed checkout to reproduce the
// pre-correction failure. The loader resolves real source imports from cwd.
const recorded = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8"));
const reviewed = recorded.element;
const parkId = "date-night-osm-way-987588580";
const origin = { ...reviewed.center, radiusMiles: 15 };
const conflictingSchool = {
  ...structuredClone(reviewed), version: 3, changeset: 189037688,
  tags: { ...reviewed.tags, leisure: undefined, amenity: "school" },
};
delete conflictingSchool.tags.leisure;

function replay(t, elements) {
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => Response.json({ elements }));
  const load = appModuleLoader();
  const { searchDateNight } = load("src/lib/date-night/search.ts");
  const { decorateDateNight } = load("src/lib/date-night/eligibility.ts");
  const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load("src/lib/date-night/christmas-binding.ts");
  return {
    load,
    search: (extra = {}) => searchDateNight({ data: { ...origin, spookySeasonEnabled: false, activityTypes: ["park"], ...extra } }),
    bind: response => resolveChristmasParkBinding(decorateDateNight(response.venues, origin), REVIEWED_CHRISTMAS_BINDINGS),
  };
}

for (const [name, elements] of [
  ["reviewed v2 then contradictory v3 school", [reviewed, conflictingSchool]],
  ["contradictory v3 school then reviewed v2", [conflictingSchool, reviewed]],
]) test(`provider boundary rejects ${name} before binding`, async t => {
  const h = replay(t, elements);
  const response = await h.search();
  const rows = response.venues.filter(place => place.id === parkId);
  assert.equal(rows.length, 1, "the original eligible park remains one identity, never a synthetic host");
  assert.equal(rows[0].discoveryEvidence.some(item => item.sourceIdentity?.version === 3 && item.sourceIdentity?.classification.amenity === "school"), true,
    "raw rejected classification/revision must reach the validator");
  assert.equal(h.bind(response).state, "conflicting-source");
  assert.deepEqual(rows[0].activityTypes, ["park"], "contradictory school is evidence, not a newly eligible school row");
  assert.equal(response.venues.some(place => place.activityTypes.includes("school")), false);
});

test("provider boundary keeps correct, missing and changed park packets fail-closed", async t => {
  const withoutRevision = structuredClone(reviewed);
  delete withoutRevision.version; delete withoutRevision.changeset;
  for (const [elements, expected, expectedRows] of [
    [[reviewed], "bound", 1],
    [[withoutRevision], "missing-source-evidence", 1],
    [[], "absent-from-query", 0],
    [[{ ...reviewed, version: 3, changeset: 189037688 }], "stale-source", 1],
    [[conflictingSchool], "absent-from-query", 0],
  ]) {
    const h = replay(t, elements);
    const response = await h.search();
    assert.equal(h.bind(response).state, expected);
    assert.equal(response.venues.filter(place => place.id === parkId).length, expectedRows);
  }
});

test("school-only observation stays evidence without a school venue or nonempty coverage", async t => {
  const h = replay(t, [conflictingSchool]);
  const response = await h.search();
  assert.equal(response.identityObservations.length, 1);
  const observation = response.identityObservations[0];
  assert.equal(observation.id, parkId);
  assert.equal(observation.sourceIdentity.version, 3);
  assert.equal(observation.sourceIdentity.classification.amenity, "school");
  assert.deepEqual(observation.activityTypes, []);
  assert.equal(response.venues.some(place => place.id === parkId), false);
  assert.deepEqual(response.discovery.groups.map(group => group.outcome), ["succeeded-empty"]);
});

test("contradictory source survives separate winning query groups", async t => {
  const h = replay(t, []);
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    const query = new URLSearchParams(init.body).get("data");
    const selected = query.split(")->.lifecycle_context;\n").at(-1);
    return Response.json({ elements: selected.includes('nwr["amenity"="cinema"](around:') ? [conflictingSchool] : [reviewed] });
  });
  const response = await h.search({ activityTypes: ["movies", "park"] });
  assert.equal(response.identityObservations.length, 2);
  assert.equal(h.bind(response).state, "conflicting-source");
  assert.equal(response.venues.filter(place => place.id === parkId).length, 1);
  assert.equal(response.discovery.groups.find(group => group.id === "culture").outcome, "succeeded-empty");
});

test("losing mirror completion cannot inject observations into the winning request", async t => {
  const clock = discoveryClock(t);
  const late = deferred();
  const h = replay(t, []);
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => ++calls === 1
    ? { ok: true, json: () => late.promise }
    : Response.json({ elements: [reviewed] }));
  const pending = h.search();
  await clock.tick(1500);
  const response = await pending;
  const original = structuredClone(response);
  assert.equal(h.bind(response).state, "bound");
  late.resolve({ elements: [conflictingSchool] });
  await flush();
  assert.deepEqual(response, original);
  assert.equal(h.bind(response).state, "bound");
  assert.equal(clock.pending, 0);
});

test("over-budget raw evidence is rejected rather than truncating a final contradiction", async t => {
  const h = replay(t, []);
  const elements = [...Array(20_000).fill(reviewed), conflictingSchool];
  t.mock.method(globalThis, "fetch", async () => ({ ok: true, json: async () => ({ elements }) }));
  const response = await h.search();
  assert.equal(response.source, "fallback");
  assert.equal(response.venues.some(place => place.id === parkId), false);
  assert.equal(response.identityObservations, undefined);
  assert.ok(response.discovery.groups.every(group => group.outcome === "failed"));
});

test("combined winning query groups cannot exceed the response observation budget", async t => {
  const h = replay(t, []);
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    const first = ++calls === 1;
    const elements = Array.from({ length: 10_000 }, (_, index) => ({
      type: "way", id: (first ? 10_000_000 : 20_000_000) + index,
      tags: { name: "Synthetic noneligible budget control", amenity: "school" },
    }));
    elements.push(first ? reviewed : conflictingSchool);
    return { ok: true, json: async () => ({ elements }) };
  });
  await assert.rejects(h.search({ activityTypes: ["movies", "park"] }), /Combined discovery exceeded its bounded identity evidence budget/);
  assert.equal(calls, 2);
});
