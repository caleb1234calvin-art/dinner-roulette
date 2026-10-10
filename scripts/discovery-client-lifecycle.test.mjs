import assert from "node:assert/strict";
import test from "node:test";
import { discoveryClock, flush, untilAbort } from "./test-support/discovery-clock.mjs";
import {
  discoveryComponentHarness,
  discoveryModes,
  discoveryPayload,
  textOf,
} from "./test-support/discovery-component-harness.mjs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

for (const config of discoveryModes) {
  const { mode } = config;
  // Test primary request lifecycle with a separately recorded successful-empty
  // background audit. Hybrid-specific tests exercise stalled/failed audit work.
  const payload = (...args) => {
    const value = discoveryPayload(...args);
    if (mode === "date-night") value.venues = value.venues.map(v => ({ ...v, lat: 43, lon: -79 }));
    return value;
  };
  function setup(t) {
    const clock = discoveryClock(t),
      h = discoveryComponentHarness(config, { emptyBackgroundAudit: mode === "date-night" });
    if (mode === "date-night") h.store.location = { ...h.store.location, lat: 43, lon: -79 };
    const log = t.mock.method(console, "warn", () => {});
    t.after(() => h.dispose());
    assert.equal(h.status().loading, true);
    return { clock, h, log };
  }
  for (const scenario of ["success", "fallback", "error", "AbortError"]) {
    test(`${mode}: ${scenario} settles active UI and clears watchdog before deadline`, async (t) => {
      const { clock, h, log } = setup(t);
      await clock.tick(20_000);
      const request = h.requests[0];
      assert.ok(request.args.signal instanceof AbortSignal);
      if (scenario === "error" || scenario === "AbortError")
        request.reject(new DOMException("Transport failed", scenario));
      else request.resolve(payload(config, scenario === "fallback" ? "fallback" : "live"));
      const status = await h.settle();
      assert.equal(status.loading, false);
      assert.equal(
        status.notices[0]?.tone,
        scenario === "fallback" ? "fallback" : scenario === "success" ? undefined : "error",
      );
      assert.equal(clock.pending, 0);
      const writes = h.writes;
      await clock.tick(30_000);
      assert.equal(h.writes, writes);
      assert.equal(log.mock.callCount(), 0);
      assert.equal(request.args.signal.aborted, false);
    });
  }

  for (const cooperative of [false, true]) {
    test(`${mode}: ${cooperative ? "abort-compliant" : "never-settling/abort-ignoring"} RPC exits loading at 25s`, async (t) => {
      const { clock, h, log } = setup(t),
        req = h.requests[0];
      if (cooperative) {
        assert.ok(req.args.signal instanceof AbortSignal);
        req.args.signal.addEventListener(
          "abort",
          () => req.reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      }
      await clock.tick(24_999);
      assert.equal(h.status().loading, true);
      await clock.tick(1);
      const after = h.status();
      assert.equal(after.loading, false);
      assert.equal(req.args.signal.aborted, true);
      assert.equal(after.notices.length, 1);
      assert.equal(after.notices[0].tone, "error");
      assert.match(after.notices[0].title, /timed out/);
      assert.match(after.notices[0].body, /try again/i);
      assert.equal(typeof after.notices[0].onRetry, "function");
      assert.equal(clock.pending, 0);
      assert.equal(log.mock.callCount(), 1);
      assert.deepEqual(log.mock.calls[0].arguments, [
        "[discovery] client-timeout",
        { mode, deadlineMs: 25_000 },
      ]);
      const writes = h.writes;
      await clock.tick(600_000);
      assert.equal(h.writes, writes);
      assert.equal(log.mock.callCount(), 1);
    });
  }

  for (const late of ["success", "rejection"]) {
    test(`${mode}: late post-timeout ${late} cannot overwrite timeout or a successful retry`, async (t) => {
      const { clock, h } = setup(t),
        old = h.requests[0];
      await clock.tick(25_000);
      const status = h.status();
      assert.equal(status.loading, false);
      const writes = h.writes;
      if (late === "success") old.resolve(payload(config, "fallback", "old"));
      else old.reject(new Error("old error"));
      await flush();
      assert.equal(h.writes, writes);
      status.notices[0].onRetry();
      h.render();
      assert.equal(h.status().loading, true);
      assert.equal(h.requests.length, 2);
      assert.notEqual(h.requests[1].args.signal, old.args.signal);
      assert.equal(h.requests[1].args.signal.aborted, false);
      h.requests[1].resolve(payload(config, "live", "retry"));
      const after = await h.settle();
      assert.equal(after.loading, false);
      assert.deepEqual(after.notices, []);
      assert.match(textOf(after.tree), /Only one place matches|1 (activities|venues)/);
      assert.equal(clock.pending, 0);
    });
  }

  for (const late of ["success", "rejection"]) {
    for (const oldFirst of [true, false]) {
      test(`${mode}: replacement aborts old ${late}; ${oldFirst ? "old" : "new"} settles first`, async (t) => {
        const { clock, h } = setup(t),
          old = h.requests[0];
        await clock.tick(10_000);
        h.store.location = { ...h.store.location, lat: mode === "date-night" ? 43.001 : 37.18 };
        h.render();
        assert.equal(h.requests.length, 2);
        assert.equal(old.args.signal.aborted, true);
        assert.equal(clock.pending, 1);
        const settleOld = () =>
          late === "success"
            ? old.resolve(payload(config, "fallback", "stale"))
            : old.reject(new Error("stale rejection"));
        if (!oldFirst) {
          h.requests[1].resolve(payload(config));
          await flush();
        }
        const writes = h.writes;
        settleOld();
        await flush();
        assert.equal(h.writes, writes);
        assert.equal(h.status().loading, oldFirst);
        if (oldFirst) {
          await clock.tick(15_000); // The old watchdog cannot clear the newer spinner.
          assert.equal(h.status().loading, true);
          h.requests[1].resolve(payload(config));
          await flush();
        }
        assert.equal(h.status().loading, false);
        assert.deepEqual(h.status().notices, []);
        assert.equal(clock.pending, 0);
      });
    }
  }

  for (const late of ["success", "rejection", "pending"]) {
    test(`${mode}: unmount aborts/cleans up; ${late} cannot write after unmount`, async (t) => {
      const { clock, h } = setup(t),
        old = h.requests[0];
      h.dispose();
      assert.equal(old.args.signal.aborted, true);
      assert.equal(clock.pending, 0);
      const writes = h.writes;
      if (late === "success") old.resolve(payload(config));
      if (late === "rejection") old.reject(new Error("late unmount error"));
      await clock.tick(60_000);
      assert.equal(h.writes, writes);
      const next = discoveryComponentHarness(config, { emptyBackgroundAudit: mode === "date-night" });
      if (mode === "date-night") next.store.location = { ...next.store.location, lat: 43, lon: -79 };
      t.after(() => next.dispose());
      next.render();
      next.requests[0].resolve(payload(config));
      assert.equal((await next.settle()).loading, false);
    });
  }

  test(`${mode}: radius update cancels obsolete transport or retains still-needed core; normal selection works`, async (t) => {
    const { clock, h } = setup(t),
      old = h.requests[0];
    const slider = h.control(h.render(), "Travel distance");
    slider.props.onValueChange([0]);
    h.render();
    const expectedRequests = 2;
    assert.equal(old.args.signal.aborted, true, "selected-radius primary changes cancel obsolete transport");
    assert.equal(h.requests.length, expectedRequests);
    h.requests.at(-1).resolve(payload(config));
    let status = await h.settle();
    h.button(status.tree, "Give us options").props.onClick();
    let tree = h.render();
    assert.equal(h.overlay(tree, "OptionsOverlay").props.restaurants[0].id, "current");
    h.button(tree, mode === "date-night" ? "Pick our date" : "Pick for us").props.onClick();
    tree = h.render();
    assert.equal(h.overlay(tree, "ResultOverlay").props.restaurant.id, "current");
    h.control(tree, "Favorites only").props.onCheckedChange(true);
    status = h.status();
    assert.match(textOf(status.tree), /0 (places|activities|venues)/);
    assert.equal(h.requests.length, expectedRequests, "local filters must not restart discovery");
    assert.equal(clock.pending, 0);
  });

  test(`${mode}: timeout then retry success remains current when the first RPC finally resolves`, async (t) => {
    const { clock, h } = setup(t),
      old = h.requests[0];
    await clock.tick(25_000);
    h.status().notices[0].onRetry();
    h.render();
    h.requests[1].resolve(payload(config));
    await flush();
    const writes = h.writes;
    old.resolve(payload(config, "fallback", "late"));
    await flush();
    assert.equal(h.writes, writes);
    assert.deepEqual(h.status().notices, []);
    assert.equal(clock.pending, 0);
  });
}

test("Date Night: seasonal dependency replacement aborts the previous request", async (t) => {
  const clock = discoveryClock(t),
    h = discoveryComponentHarness(discoveryModes[1], { emptyBackgroundAudit: true });
  h.store.location = { ...h.store.location, lat: 43, lon: -79 };
  t.after(() => h.dispose());
  h.render();
  h.store.spookySeasonEnabled = true;
  h.render();
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[0].args.signal.aborted, true);
  assert.equal(h.requests[1].args.data.spookySeasonEnabled, true);
  h.requests[1].resolve(discoveryPayload(discoveryModes[1], "fallback"));
  assert.equal((await h.settle()).loading, false);
  assert.equal(clock.pending, 0);
});

test("pinned TanStack RPC forwards the exact controller signal to fetch and settles on abort", async (t) => {
  const { serverFnFetcher } =
    await import("../node_modules/@tanstack/start-client-core/dist/esm/client-rpc/serverFnFetcher.js");
  const { runWithStartContext } = await import("@tanstack/start-storage-context");
  const controller = new AbortController();
  t.mock.method(console, "log", () => {}); // Upstream transport prints caught aborts.
  let observed;
  const pending = runWithStartContext({ startOptions: {} }, () =>
    serverFnFetcher(
      "http://localhost/_serverFn/test",
      [{ method: "POST", signal: controller.signal }],
      async (_url, options) => {
        observed = options.signal;
        return untilAbort(options.signal);
      },
    ),
  );
  await flush();
  assert.equal(observed, controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});

test("shared lifecycle also settles synchronous RPC throws without leaving a watchdog", (t) => {
  const clock = discoveryClock(t);
  const { startDiscoveryRequest } = appModuleLoader()("src/lib/discovery/client-request.ts");
  let failures = 0,
    settlements = 0;
  const cleanup = startDiscoveryRequest({
    mode: "dinner",
    request: () => {
      throw new Error("synchronous");
    },
    onSuccess: () => assert.fail(),
    onError: () => failures++,
    onSettled: () => settlements++,
  });
  assert.equal(failures, 1);
  assert.equal(settlements, 1);
  assert.equal(clock.pending, 0);
  cleanup();
});
