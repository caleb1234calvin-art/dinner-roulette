import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { deferred, discoveryClock, flush, untilAbort } from "./test-support/discovery-clock.mjs";

const load = appModuleLoader();
const { createDateNightProvider, DATE_NIGHT_MIRRORS } = load("src/lib/discovery/hedged-provider.ts");
const { ProviderResponseError, PROVIDER_BUDGET_MS, PROVIDER_ATTEMPT_MS } = load("src/lib/discovery/provider-chain.ts");

for (const winner of [2, 3, 4]) {
  test(`Date Night hedge mirror ${winner} wins at ${(winner - 1) * 1500}ms and cancels losing attempts`, async (t) => {
    const clock = discoveryClock(t);
    const calls = [];
    const log = t.mock.method(console, "warn", () => {});
    const provider = createDateNightProvider();
    let result;
    const pending = provider.run("seasonal", async (url, signal) => {
      calls.push({ url, signal, at: clock.now });
      return calls.length === winner ? ["live seasonal venue"] : untilAbort(signal);
    }).then((value) => { result = value; });
    await clock.tick((winner - 1) * 1500 - 1);
    assert.equal(result, undefined);
    await clock.tick(1);
    await pending;
    assert.deepEqual(result, ["live seasonal venue"]);
    assert.deepEqual(calls.map(({ url, at }) => [url, at]), DATE_NIGHT_MIRRORS.slice(0, winner).map((url, i) => [url, i * 1500]));
    assert.ok(calls.every(({ signal }) => signal.aborted));
    assert.equal(clock.pending, 0);
    assert.deepEqual(provider.outcomes(), [{ group: "seasonal", outcome: "success", durationMs: (winner - 1) * 1500, winnerMirror: winner }]);
    provider.finish("live");
    provider.finish("live");
    assert.equal(log.mock.callCount(), 1);
    assert.deepEqual(log.mock.calls[0].arguments[1].attempts.map(({ outcome }) => outcome), [...Array(winner - 1).fill("cancelled"), "success"]);
    await clock.tick(60_000);
    assert.equal(calls.length, winner);
  });
}

for (const stage of ["fetch", "body"]) {
  for (const ignoresAbort of [false, true]) {
    test(`Date Night all ${stage} stalls settle by 12.5s even when abort ${ignoresAbort ? "is ignored" : "is honored"}`, async (t) => {
      const clock = discoveryClock(t);
      const calls = [];
      const provider = createDateNightProvider();
      const log = t.mock.method(console, "warn", () => {});
      t.mock.method(globalThis, "fetch", async (url, { signal }) => {
        calls.push({ url, signal, at: clock.now });
        const stall = () => ignoresAbort ? new Promise(() => {}) : untilAbort(signal);
        return stage === "body" ? { json: stall } : stall();
      });
      let error, settledAt;
      const pending = provider.run("culture", async (url, signal) => {
        const response = await fetch(url, { signal });
        return response.json();
      }).catch((value) => { error = value; settledAt = clock.now; });
      await clock.tick(12_499);
      assert.equal(error, undefined);
      await clock.tick(1);
      await pending;
      assert.equal(settledAt, 12_500);
      assert.match(error.message, /timed out/i);
      assert.deepEqual(calls.map(({ at }) => at), [0, 1500, 3000, 4500]);
      assert.ok(calls.every(({ signal }) => signal.aborted));
      assert.equal(clock.pending, 0);
      provider.finish("fallback");
      const record = log.mock.calls[0].arguments[1];
      assert.equal(record.budgetExhausted, false);
      assert.deepEqual(record.attempts.map(({ durationMs, outcome }) => [durationMs, outcome]), Array(4).fill([8000, "timeout"]));
      await clock.tick(60_000);
      assert.equal(calls.length, 4);
    });
  }
}

test("Date Night groups share the unchanged absolute 20s deadline, including abort-ignoring work", async (t) => {
  const clock = discoveryClock(t);
  const provider = createDateNightProvider();
  assert.equal(PROVIDER_BUDGET_MS, 20_000);
  assert.equal(PROVIDER_ATTEMPT_MS, 8000);
  await provider.run("seasonal", async () => ["earlier success"]);
  await clock.tick(19_000);
  let error, settledAt;
  const signals = [];
  const pending = provider.run("outdoor", async (_url, signal) => {
    signals.push(signal);
    return new Promise(() => {});
  }).catch((value) => { error = value; settledAt = clock.now; });
  await clock.tick(999);
  assert.equal(error, undefined);
  await clock.tick(1);
  await pending;
  assert.equal(settledAt, 20_000);
  assert.equal(signals.length, 1);
  assert.ok(signals[0].aborted);
  assert.equal(clock.pending, 0);
  const log = t.mock.method(console, "warn", () => {});
  provider.finish("merged");
  const record = log.mock.calls[0].arguments[1];
  assert.equal(record.budgetExhausted, true);
  assert.equal(record.partial, true);
  assert.equal(record.successfulGroups, 1);
  assert.equal(record.failedGroups, 1);
});

for (const scenario of [429, 500, 504, "malformed", "invalid-json", "abort", "network-error"]) {
  test(`Date Night immediate ${scenario} advances immediately and preserves normalized failure`, async (t) => {
    const clock = discoveryClock(t);
    const provider = createDateNightProvider();
    const calls = [];
    const failure = typeof scenario === "number" ? new ProviderResponseError(`Overpass ${scenario}`, "http-error", scenario)
      : scenario === "malformed" ? new ProviderResponseError("incomplete provider response", "malformed")
        : scenario === "invalid-json" ? new SyntaxError("secret raw provider JSON")
          : scenario === "abort" ? new DOMException("secret address", "AbortError") : new Error("secret coordinates");
    await assert.rejects(provider.run("seasonal", async (url, signal) => {
      calls.push({ url, signal, at: clock.now });
      throw failure;
    }), (error) => error === failure);
    assert.deepEqual(calls.map(({ url, at }) => [url, at]), DATE_NIGHT_MIRRORS.map((url) => [url, 0]));
    assert.ok(calls.every(({ signal }) => signal.aborted));
    assert.equal(clock.pending, 0);
    const log = t.mock.method(console, "warn", () => {});
    provider.finish("fallback");
    const record = log.mock.calls[0].arguments[1];
    assert.ok(record.attempts.every(({ outcome }) => outcome === (typeof scenario === "number" ? "http-error" : scenario === "invalid-json" ? "malformed" : scenario)));
    if (typeof scenario === "number") assert.ok(record.attempts.every(({ status }) => status === scenario));
    assert.doesNotMatch(JSON.stringify(record), /secret|address|coordinates|https:|around:/);
  });
}

test("Date Night valid empty wins and differs from failure", async (t) => {
  const clock = discoveryClock(t);
  const provider = createDateNightProvider();
  let calls = 0;
  assert.deepEqual(await provider.run("culture", async () => { calls++; return []; }), []);
  assert.equal(calls, 1);
  assert.deepEqual(provider.outcomes(), [{ group: "culture", outcome: "empty", durationMs: 0, winnerMirror: 1 }]);
  assert.equal(clock.pending, 0);
});

test("Date Night late loser success/rejection cannot replace winner or mutate recorded outcome", async (t) => {
  const clock = discoveryClock(t);
  const provider = createDateNightProvider();
  const success = deferred(), failure = deferred();
  let count = 0;
  const pending = provider.run("seasonal", async () => {
    count++;
    if (count === 1) return success.promise;
    if (count === 2) return failure.promise;
    return ["winner"];
  });
  await clock.tick(3000);
  const result = await pending;
  const snapshot = provider.outcomes();
  success.resolve(["late loser"]);
  failure.reject(new Error("late loser error"));
  await flush();
  assert.deepEqual(result, ["winner"]);
  assert.deepEqual(provider.outcomes(), snapshot);
  assert.equal(count, 3);
  assert.equal(clock.pending, 0);
});

test("Date Night cancellation aborts active attempts, stops scheduled hedges and records cancelled group", async (t) => {
  const clock = discoveryClock(t);
  const controller = new AbortController();
  const provider = createDateNightProvider(controller.signal);
  const signals = [];
  const pending = provider.run("outdoor", async (_url, signal) => {
    signals.push(signal);
    return new Promise(() => {});
  });
  const rejected = assert.rejects(pending, { name: "AbortError" });
  await clock.tick(1500);
  controller.abort();
  await rejected;
  assert.equal(signals.length, 2);
  assert.ok(signals.every((signal) => signal.aborted));
  assert.equal(provider.outcomes()[0].outcome, "cancelled");
  assert.equal(clock.pending, 0);
  await clock.tick(30_000);
  assert.equal(signals.length, 2);
});

test("Date Night four groups never exceed sixteen fixed-mirror attempts and reject duplicate/untrusted group IDs", async (t) => {
  const clock = discoveryClock(t);
  const provider = createDateNightProvider();
  const calls = [];
  const pending = Promise.allSettled(["seasonal", "entertainment", "culture", "outdoor"].map((group) => provider.run(group, async (url, signal) => {
    calls.push({ url, signal, at: clock.now });
    return untilAbort(signal);
  })));
  await assert.rejects(provider.run("all", async () => []), /Invalid/);
  await assert.rejects(provider.run("seasonal", async () => []), /Invalid/);
  await assert.rejects(provider.run('untrusted [out:json]', async () => []), /Invalid/);
  await clock.tick(12_500);
  assert.ok((await pending).every(({ status }) => status === "rejected"));
  assert.equal(calls.length, 16);
  for (const at of [0, 1500, 3000, 4500]) assert.equal(calls.filter((call) => call.at === at).length, 4);
  assert.ok(calls.every(({ url, signal }) => DATE_NIGHT_MIRRORS.includes(url) && signal.aborted));
  assert.equal(clock.pending, 0);
});
