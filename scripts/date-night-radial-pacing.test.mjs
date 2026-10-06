import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, deferred, flush } from "./test-support/discovery-clock.mjs";
import { discoveryModes, discoveryPayload } from "./test-support/discovery-component-harness.mjs";

const load = appModuleLoader();
const { createDateNightRadialSession } = load("src/lib/date-night/radial-session.ts");
const { createDateNightRadialCache } = load("src/lib/date-night/radial-cache.ts");
const { planDateNightPatches } = load("src/lib/date-night/radial-plan.ts");
const { buildDateNightQueryPlan } = load("src/lib/date-night/query-plan.ts");
const base = { lat: 37.176447, lon: -94.310223, radiusMiles: 50, halloweenActive: true, activityTypes: ["movies"] };

function setup(t, changes = {}) {
  const clock = discoveryClock(t), cache = createDateNightRadialCache();
  const session = createDateNightRadialSession({ cache });
  const calls = [], states = [];
  let query = { ...base, ...changes }, retryVersion = 0;
  const callbacks = { request(q, signal) {
    const pending = deferred();
    calls.push({ q, signal, at: clock.now, ...pending });
    return pending.promise;
  }, onChange: state => states.push(state) };
  const update = (changes = {}, retry = false) => {
    query = { ...query, ...changes };
    if (retry) retryVersion++;
    session.update(query, { ...callbacks, retryVersion });
  };
  async function reply({ index = calls.length - 1, outcome = "succeeded-nonempty", failedTypes = [] } = {}) {
    const call = calls[index], q = call.q;
    if (outcome === "throw") call.reject(new Error("controlled failure"));
    else {
      const patch = planDateNightPatches(q, q.radiusMiles).find(p => p.id === q.patchId);
      const venues = outcome === "succeeded-nonempty" ? [{ ...discoveryPayload(discoveryModes[1]).venues[0],
        ...patch.center, id: `${patch.id}-${index}`, name: `${patch.id}-${index}`, activityTypes: [...q.activityTypes] }] : [];
      call.resolve({ venues, source: "live", patch: { id: patch.id, version: patch.version }, discovery: {
        groups: buildDateNightQueryPlan(q.activityTypes, q.halloweenActive).map(group => ({ ...group,
          outcome: group.activityTypes.some(type => failedTypes.includes(type)) ? "failed" : outcome })),
        partial: failedTypes.length > 0,
      } });
    }
    await flush();
  }
  t.mock.method(console, "warn", () => {});
  t.after(() => session.dispose());
  update();
  return { clock, cache, calls, states, session, update, reply, get state() { return states.at(-1); } };
}

for (const outcome of ["succeeded-nonempty", "succeeded-empty"]) {
  test(`${outcome}: core first, then exactly 250ms after a slow successful outer settlement`, async t => {
    const h = setup(t);
    assert.equal(h.calls[0].q.patchId, "radial-v1:core");
    await h.reply({ outcome });
    await h.clock.tick(249); assert.equal(h.calls.length, 1);
    await h.clock.tick(1); assert.equal(h.calls.length, 2);
    await h.clock.tick(6000); assert.equal(h.calls.length, 2, "only one active RPC");
    await h.reply({ outcome });
    await h.clock.tick(249); assert.equal(h.calls.length, 2);
    await h.clock.tick(1); assert.equal(h.calls.length, 3);
    assert.equal(h.calls[2].at - h.calls[1].at, 6250);
    assert.equal(h.state.coverage.continuousRadiusMiles, 15, "one outer success is not a complete band");
  });
}

for (const latency of [0, 100, 749, 750, 900]) {
  test(`outer start floor with ${latency}ms latency survives repeated compatible updates`, async t => {
    const h = setup(t);
    await h.reply(); await h.clock.tick(250);
    await h.clock.tick(latency); await h.reply();
    const wait = Math.max(250, 1000 - latency);
    for (let i = 0; i < 3; i++) h.update();
    await h.clock.tick(wait - 1);
    h.update({ radiusMiles: 40 }); h.update({ radiusMiles: 50 });
    assert.equal(h.calls.length, 2);
    assert.equal(h.clock.pending, 1, "one pending pacing timer");
    await h.clock.tick(1);
    assert.equal(h.calls.length, 3);
    assert.equal(h.calls[2].at - h.calls[1].at, Math.max(1000, latency + 250));
  });
}

for (const outcome of ["failed", "throw", "partial"]) {
  test(`${outcome}: outer degradation retains 1000ms settlement delay, even on explicit retry`, async t => {
    const h = setup(t, { activityTypes: ["movies", "park"] });
    await h.reply(); await h.clock.tick(250); await h.clock.tick(1500);
    await h.reply(outcome === "partial" ? { failedTypes: ["park"] } : { outcome });
    const settledAt = h.clock.now;
    h.update({}, true);
    await h.clock.tick(999); h.update();
    assert.equal(h.calls.length, 2);
    await h.clock.tick(1);
    assert.equal(h.calls.length, 3);
    assert.equal(h.calls[2].at - settledAt, 1000);
    assert.equal(h.calls[2].q.patchId, h.calls[1].q.patchId, "explicit retry targets missing patch");
    assert.deepEqual(h.calls[2].q.activityTypes, outcome === "partial" ? ["park"] : ["movies", "park"]);
  });
}

test("explicit retry of older missing work honors the most recent successful outer start", async t => {
  const h = setup(t);
  await h.reply(); await h.clock.tick(250); await h.reply({ outcome: "failed" });
  await h.clock.tick(1000); await h.reply();
  h.update({}, true);
  await h.clock.tick(999); assert.equal(h.calls.length, 3);
  await h.clock.tick(1); assert.equal(h.calls.length, 4);
  assert.equal(h.calls[3].q.patchId, h.calls[1].q.patchId);
  assert.equal(h.calls[3].at - h.calls[2].at, 1000);
});

for (const action of ["dispose", "shrink"]) {
  test(`${action} clears a pending success timer`, async t => {
    const h = setup(t);
    await h.reply(); await h.clock.tick(250); await h.reply();
    assert.equal(h.clock.pending, 1);
    if (action === "dispose") h.session.dispose();
    else h.update({ radiusMiles: 15 });
    assert.equal(h.clock.pending, 0);
    await h.clock.tick(10000); assert.equal(h.calls.length, 2);
  });
}

test("radius shrink cancels outer work; immediate re-expansion is spaced and ignores late settlement", async t => {
  const h = setup(t, { radiusMiles: 15 });
  await h.reply(); h.update({ radiusMiles: 50 });
  await h.clock.tick(250);
  assert.equal(h.calls.length, 2);
  h.update({ radiusMiles: 15 });
  assert.equal(h.calls[1].signal.aborted, true);
  assert.equal(h.clock.pending, 0);
  await h.reply(); // Deliberately ignores the abort signal.
  assert.equal(h.cache.read(base).coverage.completePatchIds.length, 1);
  h.update({ radiusMiles: 50 });
  await h.clock.tick(999); assert.equal(h.calls.length, 2);
  await h.clock.tick(1); assert.equal(h.calls.length, 3);
  assert.equal(h.calls[2].q.patchId, h.calls[1].q.patchId);
  assert.equal(h.calls[2].at - h.calls[1].at, 1000);
});

test("generation replacement rejects late abort-ignoring outer response and remains serial", async t => {
  const h = setup(t);
  await h.reply(); await h.clock.tick(250);
  h.update({ lat: 38 });
  assert.equal(h.calls[1].signal.aborted, true);
  assert.equal(h.calls[2].q.patchId, "radial-v1:core");
  const writes = h.states.length;
  await h.reply({ index: 1 });
  assert.equal(h.states.length, writes);
  assert.equal(h.cache.read(base).coverage.completePatchIds.length, 1);
  await h.reply(); await h.clock.tick(999);
  assert.equal(h.calls.length, 3);
  await h.clock.tick(1); assert.equal(h.calls.length, 4);
  assert.equal(h.calls[3].at - h.calls[1].at, 1000);
});

test("incomplete core blocks expansion with no automatic retry loop", async t => {
  const h = setup(t, { activityTypes: ["movies", "park"] });
  await h.reply({ failedTypes: ["park"] });
  h.update({ radiusMiles: 40 });
  await h.clock.tick(100000);
  assert.equal(h.calls.length, 1);
  assert.equal(h.state.paused, true);
  assert.equal(h.clock.pending, 0);
  h.update({}, true);
  assert.equal(h.calls[1].q.patchId, "radial-v1:core");
  assert.deepEqual(h.calls[1].q.activityTypes, ["park"]);
});

test("three consecutive degraded outer patches pause without retrying attempted work", async t => {
  const h = setup(t);
  await h.reply(); await h.clock.tick(250);
  for (let i = 0; i < 3; i++) {
    await h.reply({ outcome: "failed" });
    await h.clock.tick(1000);
  }
  assert.equal(h.calls.length, 4);
  assert.equal(h.state.paused, true);
  assert.equal(h.state.coverage.continuousRadiusMiles, 15);
  assert.equal(h.clock.pending, 0);
  h.update(); await h.clock.tick(100000);
  assert.equal(h.calls.length, 4);
});

test("32-start cap also blocks newly requested categories after a complete successful-empty pass", async t => {
  const h = setup(t);
  for (let i = 0; i < 32; i++) {
    assert.equal(h.calls.length, i + 1);
    await h.reply({ outcome: "succeeded-empty" });
    await h.clock.tick(i === 0 ? 250 : 1000);
  }
  assert.equal(h.state.coverage.continuousRadiusMiles, 50);
  assert.equal(h.state.coverage.complete, true);
  h.update({ activityTypes: ["movies", "park"] });
  await h.clock.tick(100000);
  assert.equal(h.calls.length, 32);
  assert.equal(h.state.paused, true);
  assert.equal(h.clock.pending, 0);
});

test("synthetic 6-second cold pass measures 199750ms; baseline model is 223000ms", async t => {
  const h = setup(t);
  for (let i = 0; i < 32; i++) {
    assert.equal(h.calls.length, i + 1, "each patch must start before its synthetic latency begins");
    await h.clock.tick(6000); await h.reply({ outcome: "succeeded-empty" });
    assert.equal(h.clock.now - h.calls[i].at, 6000, "every synthetic patch takes exactly six seconds");
    if (i < 31) await h.clock.tick(250);
  }
  assert.equal(h.calls.length, 32);
  assert.equal(h.state.coverage.complete, true);
  assert.equal(h.clock.now, 199750);
  assert.equal(32 * 6000 + 31 * 1000 - h.clock.now, 23250);
  assert.ok(h.calls.slice(2).every((call, i) => call.at - h.calls[i + 1].at >= 1000));
  assert.equal(h.clock.pending, 0);
});
