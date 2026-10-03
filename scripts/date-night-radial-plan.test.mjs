import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const path = "src/lib/date-night/radial-plan.ts";
const api = existsSync(path) ? appModuleLoader()(path) : {};
function planner() {
  assert.equal(typeof api.planDateNightPatches, "function", "RED: bounded radial planner must exist before replacing monolithic acquisition");
  return api;
}
const earth = 3958.8, rad = Math.PI / 180;
// Independent spherical test oracle; do not import the implementation's geometry.
function point(origin, miles, degrees) {
  const d = miles / earth, b = degrees * rad, p = origin.lat * rad, l = origin.lon * rad;
  const lat = Math.asin(Math.sin(p) * Math.cos(d) + Math.cos(p) * Math.sin(d) * Math.cos(b));
  const lon = l + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p), Math.cos(d) - Math.sin(p) * Math.sin(lat));
  return { lat: lat / rad, lon: ((lon / rad + 540) % 360) - 180 };
}
function distance(a, b) {
  const v = Math.sin((b.lat - a.lat) * rad / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin((b.lon - a.lon) * rad / 2) ** 2;
  return 2 * earth * Math.atan2(Math.sqrt(Math.min(1, v)), Math.sqrt(Math.max(0, 1 - v)));
}
const origin = { lat: 37.176447, lon: -94.310223 };

test("radial IDs and geometry are deterministic; larger plans preserve the exact inner prefix", () => {
  const { planDateNightPatches } = planner();
  const full = planDateNightPatches(origin, 50);
  assert.deepEqual(full, planDateNightPatches({ ...origin }, 50));
  assert.equal(full.length, 32);
  assert.equal(new Set(full.map(p => p.id)).size, full.length);
  assert.equal(full[0].id, "radial-v1:core");
  for (const radius of [1, 3, 5, 10, 15, 20, 30, 40, 50]) {
    const partial = planDateNightPatches(origin, radius);
    assert.deepEqual(partial, full.slice(0, partial.length));
  }
});

for (const center of [origin, { lat: 0, lon: 179.99 }, { lat: 80, lon: -179.99 }, { lat: -80, lon: 30 }]) {
  test(`radial partition has no sampled holes or double owners at ${center.lat},${center.lon}`, () => {
    const { planDateNightPatches, dateNightPatchOwns } = planner();
    const patches = planDateNightPatches(center, 50);
    const radii = [0, 0.01, ...Array.from({ length: 100 }, (_, i) => (i + 1) / 2), 15 - 1e-6, 15 + 1e-6, 20 - 1e-6, 20 + 1e-6, 30 + 1e-6, 40 + 1e-6];
    for (const miles of radii) for (let bearing = 0; bearing < 360; bearing += 1.25) {
      const p = point(center, miles, bearing);
      const owners = patches.filter(patch => dateNightPatchOwns(center, patch, p));
      assert.equal(owners.length, 1, `ownership r=${miles}, bearing=${bearing}`);
      assert.ok(distance(owners[0].center, p) * 1609.344 <= owners[0].radiusMeters + 1, "query circle must contain its logical sector");
    }
  });
}

test("every sector corner fits its bounded circle; no patch approaches a 50-mile monolith", () => {
  const { planDateNightPatches } = planner();
  for (const p of planDateNightPatches(origin, 50)) {
    assert.ok(Number.isFinite(p.radiusMeters) && p.radiusMeters > 0);
    assert.ok(p.radiusMeters <= 15.1 * 1609.344);
    if (p.id.endsWith(":core")) continue;
    for (const radius of [p.innerMiles, p.outerMiles]) for (const angle of [p.startBearing, p.endBearing]) {
      assert.ok(distance(p.center, point(origin, radius, angle)) * 1609.344 < p.radiusMeters);
    }
  }
});

test("exact poles have a deterministic bearing frame and complete bounded coverage", () => {
  const { planDateNightPatches, dateNightPatchOwns } = planner();
  for (const lat of [-90, 90]) {
    const pole = { lat, lon: 20 }, patches = planDateNightPatches(pole, 50);
    for (const miles of [1, 15, 15.001, 20, 25, 30, 35, 40, 45, 50]) {
      for (let lon = -180; lon < 180; lon += 7) {
        const p = { lat: Math.sign(lat) * (90 - miles / earth / rad), lon };
        const owners = patches.filter(patch => dateNightPatchOwns(pole, patch, p));
        assert.equal(owners.length, 1);
        assert.ok(distance(owners[0].center, p) * 1609.344 <= owners[0].radiusMeters + 1);
      }
    }
  }
});

test("out-of-radius points have no logical owner and overlap maps to only one patch", () => {
  const { planDateNightPatches, dateNightPatchOwns } = planner();
  for (const max of [15, 20, 30, 40, 50]) {
    const patches = planDateNightPatches(origin, max);
    for (const bearing of [0, 45, 90, 135, 225, 359.9]) {
      assert.equal(patches.filter(p => dateNightPatchOwns(origin, p, point(origin, max + 0.001, bearing))).length, 0);
    }
  }
});

test("server resolves only enumerated patch IDs and rejects arbitrary geometry and hostile inputs", () => {
  const { resolveDateNightPatch, planDateNightPatches } = planner();
  for (const id of ["arbitrary", "radial-v1:20:4", "radial-v1:50:0", "radial-v1:core);out;", {}, null]) {
    assert.throws(() => resolveDateNightPatch(origin, 20, id));
  }
  for (const radius of [NaN, Infinity, -1, 0, 51, "50"]) assert.throws(() => planDateNightPatches(origin, radius));
  assert.throws(() => planDateNightPatches({ lat: NaN, lon: 0 }, 50));
  assert.throws(() => planDateNightPatches({ lat: 0, lon: "0);out;" }, 50));
});

test("continuous coverage requires every inner patch and requested category; outer success cannot fill a gap", () => {
  const { planDateNightPatches, summarizeDateNightCoverage } = planner();
  assert.equal(typeof summarizeDateNightCoverage, "function", "RED: geographic coverage must be first-class");
  const patches = planDateNightPatches(origin, 50);
  const requested = ["movies", "corn-maze"];
  const complete = patches.map(p => ({ id: p.id, completeActivityTypes: requested, loadingActivityTypes: [], failedActivityTypes: [], acquiredAt: 1 }));
  assert.equal(summarizeDateNightCoverage(patches, 50, requested, complete).continuousRadiusMiles, 50);
  for (const gapRadius of [15, 20, 30, 40, 50]) {
    const gap = patches.find(p => p.outerMiles === gapRadius);
    const expected = { 15: 0, 20: 15, 30: 20, 40: 30, 50: 40 }[gapRadius];
    for (const outcome of ["missing", "failed", "loading"]) {
      const records = complete.map(r => r.id !== gap.id ? r : { ...r, completeActivityTypes: ["movies"], failedActivityTypes: outcome === "failed" ? ["corn-maze"] : [], loadingActivityTypes: outcome === "loading" ? ["corn-maze"] : [] });
      const state = summarizeDateNightCoverage(patches, 50, requested, records);
      assert.equal(state.continuousRadiusMiles, expected);
      assert.equal(state.complete, false);
      assert.ok(state.missingPatchIds.includes(gap.id));
      assert.equal(summarizeDateNightCoverage(patches, 50, ["movies"], records).continuousRadiusMiles, 50);
    }
  }
});

test("eviction/removal of a required proof makes continuous coverage incomplete; smaller maximum clips the claim", () => {
  const { planDateNightPatches, summarizeDateNightCoverage } = planner();
  const patches = planDateNightPatches(origin, 50);
  const complete = patches.map(p => ({ id: p.id, completeActivityTypes: ["movies"], acquiredAt: 1 }));
  assert.equal(summarizeDateNightCoverage(patches, 50, ["movies"], complete.slice(1)).continuousRadiusMiles, 0);
  assert.equal(summarizeDateNightCoverage(patches.slice(0, 1), 5, ["movies"], complete).continuousRadiusMiles, 5);
});
