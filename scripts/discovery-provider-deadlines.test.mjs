import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, flush, untilAbort } from "./test-support/discovery-clock.mjs";

const load = appModuleLoader();
const local = { lat: 37.176447, lon: -94.310223, radiusMiles: 15, spookySeasonEnabled: false };
const remote = { lat: 43.65348, lon: -79.38393, radiusMiles: 15, spookySeasonEnabled: false };
const mirrors = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
const modes = [
  [
    "dinner",
    load("src/lib/restaurants/search.ts").searchRestaurants,
    "restaurants",
    { amenity: "restaurant" },
  ],
  [
    "date-night",
    load("src/lib/date-night/search.ts").searchDateNight,
    "venues",
    { amenity: "cinema" },
  ],
  ["nightlife", load("src/lib/nightlife/search.ts").searchNightlife, "venues", { amenity: "bar" }],
];
const fixture = (data, tags) => ({
  elements: [
    {
      type: "node",
      id: 987654321,
      lat: data.lat,
      lon: data.lon,
      tags: { name: "Deadline test venue", ...tags },
    },
  ],
});

for (const [mode, search, key, tags] of modes) {
  for (const bodyStall of [false, true]) {
    for (const data of [local, remote]) {
      test(`${mode}: ${bodyStall ? "body" : "headers"} stalls settle ${data === local ? "fallback" : "error"} at 20s; no fourth mirror`, async (t) => {
        const clock = discoveryClock(t),
          calls = [];
        const log = t.mock.method(console, "warn", () => {});
        t.mock.method(globalThis, "fetch", async (url, options) => {
          calls.push({ url, at: clock.now, signal: options.signal });
          return bodyStall
            ? { ok: true, json: () => untilAbort(options.signal) }
            : untilAbort(options.signal);
        });
        let result, failure, settledAt;
        const pending = search({ data })
          .then(
            (value) => {
              result = value;
            },
            (error) => {
              failure = error;
            },
          )
          .finally(() => {
            settledAt = clock.now;
          });
        await clock.tick(19_999);
        assert.equal(settledAt, undefined);
        await clock.tick(1);
        assert.equal(settledAt, 20_000, "active chain must settle by aggregate budget");
        await pending;
        assert.deepEqual(
          calls.map((x) => [x.url, x.at]),
          mirrors.slice(0, 3).map((url, i) => [url, i * 8000]),
        );
        assert.ok(calls.every((x) => x.signal.aborted));
        assert.equal(clock.pending, 0);
        if (data === local) {
          assert.equal(failure, undefined);
          assert.equal(result.source, "fallback");
          assert.ok(result[key].length > 0 && result.warning);
        } else {
          assert.equal(result, undefined);
          assert.ok(failure instanceof Error);
          assert.match(
            failure.message,
            mode === "dinner" ? /Could not load restaurants/ : /timed out/i,
          );
        }
        assert.equal(log.mock.callCount(), 1, "one bounded summary per degraded search");
        const record = log.mock.calls[0].arguments[1];
        assert.equal(record.mode, mode);
        assert.equal(record.source, data === local ? "fallback" : "error");
        assert.equal(record.budgetExhausted, true);
        assert.deepEqual(
          record.attempts.map((x) => [x.mirror, x.durationMs, x.outcome]),
          [
            [1, 8000, "timeout"],
            [2, 8000, "timeout"],
            [3, 4000, "timeout"],
          ],
        );
        assert.doesNotMatch(
          JSON.stringify(record),
          /37\.176447|-94\.310223|43\.65348|-79\.38393|around:|https:|Deadline test venue/,
        );
        await clock.tick(60_000);
        assert.equal(calls.length, 3);
      });
    }
  }

  test(`${mode}: first timeout then second success returns at 8s and clears timers`, async (t) => {
    const clock = discoveryClock(t),
      calls = [];
    t.mock.method(console, "warn", () => {});
    t.mock.method(globalThis, "fetch", (url, options) => {
      calls.push(url);
      return calls.length === 1
        ? untilAbort(options.signal)
        : Promise.resolve(Response.json(fixture(local, tags)));
    });
    let result;
    const pending = search({ data: local }).then((value) => {
      result = value;
    });
    await clock.tick(7999);
    assert.equal(result, undefined);
    await clock.tick(1);
    assert.ok(result?.[key].some((x) => x.name === "Deadline test venue"));
    await pending;
    assert.equal(result.source, mode === "dinner" ? "live" : "merged");
    assert.deepEqual(calls, mirrors.slice(0, 2));
    assert.equal(clock.pending, 0);
    await clock.tick(25_000);
    assert.equal(calls.length, 2);
  });

  for (const scenario of [429, 500, 504, "missing-elements", "remark", "invalid-json"]) {
    test(`${mode}: immediate ${scenario} advances without delay; saved coverage and terminal error preserved`, async (t) => {
      const clock = discoveryClock(t),
        calls = [];
      const log = t.mock.method(console, "warn", () => {});
      t.mock.method(globalThis, "fetch", async (url) => {
        calls.push(url);
        if (typeof scenario === "number") return new Response("", { status: scenario });
        if (scenario === "invalid-json") return new Response("invalid JSON", { status: 200 });
        return Response.json(
          scenario === "remark"
            ? { elements: [], remark: "incomplete provider response" }
            : { wrong: [] },
        );
      });
      const result = await search({ data: local });
      assert.equal(result.source, "fallback");
      assert.ok(result[key].length && result.warning);
      assert.deepEqual(calls, mirrors);
      assert.equal(clock.now, 0);
      assert.equal(clock.pending, 0);
      const record = log.mock.calls[0].arguments[1];
      assert.ok(
        record.attempts.every(
          (x) => x.outcome === (typeof scenario === "number" ? "http-error" : "malformed"),
        ),
      );
      if (typeof scenario === "number")
        assert.ok(record.attempts.every((x) => x.status === scenario));
      await assert.rejects(search({ data: remote }), (error) => {
        assert.ok(error instanceof Error);
        if (mode === "dinner") assert.match(error.message, /Could not load restaurants/);
        else if (typeof scenario === "number") assert.equal(error.message, `Overpass ${scenario}`);
        else if (scenario === "invalid-json") assert.ok(error instanceof SyntaxError);
        else
          assert.match(error.message, /incomplete response|Malformed nightlife provider response/);
        return true;
      });
      assert.equal(clock.pending, 0);
    });
  }

  test(`${mode}: valid empty results retain mode-specific mirror and source semantics`, async (t) => {
    const clock = discoveryClock(t);
    t.mock.method(console, "warn", () => {});
    const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ elements: [] }));
    const result = await search({ data: remote });
    assert.deepEqual(result[key], []);
    assert.equal(result.source, "live");
    assert.equal(fetch.mock.callCount(), mode === "dinner" ? 4 : 1);
    const nearby = await search({ data: local });
    assert.equal(nearby.source, mode === "dinner" ? "live" : "merged");
    assert.ok(nearby[key].length);
    assert.equal(nearby.warning, undefined);
    assert.equal(clock.pending, 0);
  });

  test(`${mode}: normal first success is quiet, abort errors categorized, raw exceptions never logged`, async (t) => {
    const clock = discoveryClock(t);
    const log = t.mock.method(console, "warn", () => {});
    let completedSignal;
    const fetch = t.mock.method(globalThis, "fetch", async (_url, { signal }) => {
      completedSignal = signal;
      return Response.json(fixture(remote, tags));
    });
    const result = await search({ data: remote });
    assert.equal(result.source, "live");
    assert.equal(result[key].length, 1);
    assert.equal(log.mock.callCount(), 0);
    assert.equal(completedSignal.aborted, true, "completed attempts release their controller");
    fetch.mock.mockImplementation(async () => {
      throw new DOMException("secret / address / coordinate", "AbortError");
    });
    await search({ data: local });
    const record = log.mock.calls[0].arguments[1];
    assert.ok(record.attempts.every((x) => x.outcome === "abort"));
    assert.doesNotMatch(JSON.stringify(record), /secret|address|coordinate/);
    assert.equal(clock.pending, 0);
  });
}

test("Dinner retains successful-empty precedence when subsequent mirrors exhaust the budget", async (t) => {
  const clock = discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  let count = 0,
    result;
  t.mock.method(globalThis, "fetch", async (_url, { signal }) =>
    ++count === 1 ? Response.json({ elements: [] }) : untilAbort(signal),
  );
  const pending = modes[0][1]({ data: remote }).then((value) => {
    result = value;
  });
  await clock.tick(20_000);
  assert.ok(result);
  await pending;
  assert.equal(result.source, "live");
  assert.deepEqual(result.restaurants, []);
  assert.equal(count, 4);
  assert.equal(clock.pending, 0);
});

test("shared provider attempt uses native timer and real fetch body abort", async (t) => {
  // A selected short native-clock integration, with the *real* 8s timer reduced
  // only at the scheduling boundary. Full 20s accounting is established above.
  const { createServer } = await import("node:http");
  const { createProviderChain } = load("src/lib/discovery/provider-chain.ts");
  const server = createServer((_req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.write('{"elements":[');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const nativeTimeout = globalThis.setTimeout;
  const budgets = [];
  t.mock.method(globalThis, "setTimeout", (fn, ms, ...args) => {
    if (ms === 8000) {
      budgets.push(ms);
      return nativeTimeout(fn, 100, ...args);
    }
    return nativeTimeout(fn, ms, ...args);
  });
  const chain = createProviderChain("dinner"),
    started = performance.now();
  await assert.rejects(
    chain.run([`http://127.0.0.1:${server.address().port}`], async (url, signal) => {
      const response = await fetch(url, { signal });
      await response.json();
      return [];
    }),
    /abort|timed out/i,
  );
  assert.deepEqual(budgets, [8000]);
  assert.ok(performance.now() - started < 2000);
  await flush();
});
