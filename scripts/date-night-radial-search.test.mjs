import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, untilAbort } from "./test-support/discovery-clock.mjs";

const origin = { lat: 43, lon: -79, radiusMiles: 50, spookySeasonEnabled: true, activityTypes: ["movies"] };
const load = appModuleLoader();
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const patches = planDateNightPatches(origin, 50);
const movie = (id, location, tags = {}) => ({ type: "node", id, ...location, tags: { name: `Radial Cinema ${id}`, amenity: "cinema", ...tags } });

test("actual patch RPC derives bounded geometry on the server and clips overlapping positive rows", async t => {
  const clock = discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  const calls = [];
  const patch = patches[1];
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    calls.push(new URLSearchParams(init.body).get("data"));
    return Response.json({ elements: [movie(1, patch.center), movie(2, origin), movie(3, origin, { demolished: "yes" })] });
  });
  const result = await searchDateNight({ data: { ...origin, patchId: patch.id } });
  assert.deepEqual(result.patch, { id: patch.id, version: "radial-v1" });
  assert.equal(calls.length, 1);
  const geometries = [...calls[0].matchAll(/\(around:([^)]*)\)/g)].map(m => m[1].split(",").map(Number));
  assert.ok(geometries.length > 0);
  assert.ok(geometries.every(([radius, lat, lon]) => radius === patch.radiusMeters && lat === patch.center.lat && lon === patch.center.lon));
  assert.ok(geometries.every(([radius]) => radius < 15.1 * 1609.344));
  assert.deepEqual(result.venues.filter(p => !p.lifecycle).map(p => p.id), ["date-night-osm-node-1"]);
  const negative = result.venues.find(p => p.lifecycle);
  assert.equal(negative.lifecycle, "permanently-closed");
  assert.ok(negative.discoveryEvidence.some(e => e.id === "date-night-osm-node-3" && e.lifecycle === "permanently-closed"));
  assert.equal(clock.pending, 0);
});

test("patch RPC rejects geometry/query injection, unknown IDs, and unauthorized outer patches before fetch", async t => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; throw new Error("must not fetch"); });
  const base = { ...origin, patchId: patches[0].id };
  for (const data of [
    { ...base, bounds: [0, 0, 90, 180] }, { ...base, geometry: "anything" }, { ...base, query: "out;" },
    { ...base, patchId: "radial-v1:50:99" }, { ...base, patchId: {} },
    { ...base, radiusMiles: 15, patchId: patches[1].id }, { ...base, radiusMiles: 17 },
    { ...base, lat: "0);out;" }, { ...base, activityTypes: ['movies"];out;'] },
  ]) await assert.rejects(searchDateNight({ data }));
  assert.equal(calls, 0);
});

test("patch group valid-empty remains authoritative and is not saved fallback", async t => {
  discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => Response.json({ elements: [] }));
  const result = await searchDateNight({ data: { ...origin, patchId: patches.at(-1).id } });
  assert.equal(result.source, "live");
  assert.deepEqual(result.venues, []);
  assert.equal(result.discovery.groups[0].outcome, "succeeded-empty");
});

test("patch provider cancellation forwards request signal, aborts attempts and stops hedges", async t => {
  const clock = discoveryClock(t), controller = new AbortController();
  const { searchDateNight: search } = appModuleLoader({ requestSignal: controller.signal })("src/lib/date-night/search.ts");
  const signals = [];
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async (_url, { signal }) => { signals.push(signal); return untilAbort(signal); });
  const pending = search({ data: { ...origin, patchId: patches[0].id } });
  const rejected = assert.rejects(pending, { name: "AbortError" });
  await clock.tick(1500);
  controller.abort();
  await rejected;
  assert.equal(signals.length, 2);
  assert.ok(signals.every(s => s.aborted));
  await clock.tick(30_000);
  assert.equal(signals.length, 2);
  assert.equal(clock.pending, 0);
});
