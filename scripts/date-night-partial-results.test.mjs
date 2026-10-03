import { affirmativeClauses } from "./test-support/date-night-query-evaluator.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock, untilAbort } from "./test-support/discovery-clock.mjs";

const load = appModuleLoader();
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const local = { lat: 37.176447, lon: -94.310223, radiusMiles: 15, spookySeasonEnabled: true };
const remote = { lat: 43.65348, lon: -79.38393, radiusMiles: 15, spookySeasonEnabled: true };
const element = (id, tags, location = remote) => ({ type: "node", id, lat: location.lat, lon: location.lon, tags: { name: `Partial fixture ${id}`, ...tags } });
const queryGroup = (options) => {
  // Lifecycle companions are deliberately shared across every activity group.
  // Identify the requested group from affirmative clauses only.
  const query = affirmativeClauses(new URLSearchParams(options.body).get("data")).join("\n");
  if (/haunted_house|corn_maze|pumpkin_patch/.test(query)) return "seasonal";
  if (/bowling_alley|amusement_arcade|miniature_golf|escape_game|roller_skating/.test(query)) return "entertainment";
  if (/cinema|museum/.test(query)) return "culture";
  if (query.includes('["leisure"="park"]')) return "outdoor";
  throw new Error("Unexpected query plan in fixture");
};
const groupMap = (result) => new Map(result.discovery.groups.map((group) => [group.id, group]));
const stub = (t, clock, responses) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const group = queryGroup(options);
    calls.push({ group, url, signal: options.signal, at: clock.now });
    return responses[group](options, calls.filter((call) => call.group === group).length);
  });
  return calls;
};

test("seasonal live success survives stalled parks and merges saved coverage with honest partial metadata", async (t) => {
  const clock = discoveryClock(t);
  const log = t.mock.method(console, "warn", () => {});
  const calls = stub(t, clock, {
    seasonal: async () => Response.json({ elements: [element(9101, { attraction: "corn_maze", name: "Live harvest field" }, local)] }),
    outdoor: ({ signal }) => untilAbort(signal),
  });
  let result, settledAt;
  const pending = searchDateNight({ data: { ...local, activityTypes: ["corn-maze", "park"] } }).then((value) => { result = value; settledAt = clock.now; });
  await clock.tick(12_499);
  assert.equal(result, undefined);
  await clock.tick(1);
  await pending;
  assert.equal(settledAt, 12_500);
  assert.equal(result.source, "merged");
  assert.ok(result.venues.some((venue) => venue.id === "date-night-osm-node-9101"));
  assert.ok(result.venues.some((venue) => venue.source !== "osm"));
  assert.equal(result.discovery.partial, true);
  assert.match(result.warning, /partial|unavailable|some|could not/i);
  assert.doesNotMatch(result.warning, /saved places only|only saved/i);
  const groups = groupMap(result);
  assert.equal(groups.get("seasonal").outcome, "succeeded-nonempty");
  assert.deepEqual(groups.get("seasonal").activityTypes, ["corn-maze"]);
  assert.equal(groups.get("outdoor").outcome, "failed");
  assert.deepEqual(calls.map(({ group, at }) => [group, at]), [["seasonal", 0], ["outdoor", 0], ["outdoor", 1500], ["outdoor", 3000], ["outdoor", 4500]]);
  assert.ok(calls.every(({ signal }) => signal.aborted));
  assert.equal(clock.pending, 0);
  assert.equal(log.mock.callCount(), 1);
  const record = log.mock.calls[0].arguments[1];
  assert.equal(record.partial, true);
  assert.equal(record.successfulGroups, 1);
  assert.equal(record.failedGroups, 1);
  assert.doesNotMatch(JSON.stringify(record), /37\.176447|-94\.310223|Live harvest field|around:|https:/);
});

test("entertainment survives seasonal HTTP failure with selected failed coverage retained", async (t) => {
  const clock = discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  const calls = stub(t, clock, {
    seasonal: async () => new Response("", { status: 504 }),
    entertainment: async () => Response.json({ elements: [element(9102, { leisure: "bowling_alley" })] }),
  });
  const result = await searchDateNight({ data: { ...remote, activityTypes: ["haunted-house", "bowling"] } });
  assert.equal(result.source, "live");
  assert.deepEqual(result.venues.map((venue) => venue.id), ["date-night-osm-node-9102"]);
  assert.equal(result.discovery.partial, true);
  assert.equal(groupMap(result).get("entertainment").outcome, "succeeded-nonempty");
  assert.equal(groupMap(result).get("seasonal").outcome, "failed");
  assert.deepEqual(groupMap(result).get("seasonal").activityTypes, ["haunted-house"]);
  assert.equal(calls.filter(({ group }) => group === "seasonal").length, 4);
  assert.equal(calls.filter(({ group }) => group === "entertainment").length, 1);
  assert.equal(clock.now, 0);
  assert.equal(clock.pending, 0);
});

test("valid empty requested group is successful coverage, distinct from missing venues and failed acquisition", async (t) => {
  const clock = discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  const calls = stub(t, clock, {
    seasonal: async () => Response.json({ elements: [] }),
    culture: async () => Response.json({ elements: [element(9103, { amenity: "cinema" })] }),
  });
  const result = await searchDateNight({ data: { ...remote, activityTypes: ["pumpkin-patch", "movies"] } });
  assert.equal(result.source, "live");
  assert.equal(result.discovery.partial, false);
  assert.equal(result.warning, undefined);
  assert.equal(groupMap(result).get("seasonal").outcome, "succeeded-empty");
  assert.equal(groupMap(result).get("culture").outcome, "succeeded-nonempty");
  assert.equal(result.venues.length, 1);
  assert.equal(calls.length, 2);
  assert.equal(clock.pending, 0);
});

test("valid empty success with a failed sibling remains partial live, not fallback or terminal error", async (t) => {
  const clock = discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  stub(t, clock, {
    seasonal: async () => Response.json({ elements: [] }),
    culture: async () => new Response("", { status: 429 }),
  });
  const result = await searchDateNight({ data: { ...remote, activityTypes: ["corn-maze", "movies"] } });
  assert.equal(result.source, "live");
  assert.deepEqual(result.venues, []);
  assert.equal(result.discovery.partial, true);
  assert.equal(groupMap(result).get("seasonal").outcome, "succeeded-empty");
  assert.equal(groupMap(result).get("culture").outcome, "failed");
  assert.ok(result.warning);
  assert.equal(clock.pending, 0);
});

test("cross-group equal OSM identity unions disjoint classifications despite changed provider name", async (t) => {
  const clock = discoveryClock(t);
  const calls = stub(t, clock, {
    seasonal: async () => Response.json({ elements: [element(9104, { name: "Harvest Trail", attraction: "haunted_trail", opening_hours: "24/7" })] }),
    culture: async () => Response.json({ elements: [element(9104, { name: "Historic Collection", tourism: "museum", opening_hours: "closed" })] }),
  });
  const result = await searchDateNight({ data: { ...remote, activityTypes: ["haunted-house", "museum"] } });
  assert.equal(result.venues.length, 1);
  assert.equal(result.venues[0].id, "date-night-osm-node-9104");
  assert.deepEqual(result.venues[0].activityTypes, ["haunted-house", "museum"]);
  assert.equal(result.venues[0].discoveryEvidence.length, 2);
  assert.equal(result.venues[0].source, "osm");
  assert.equal(result.source, "live");
  assert.equal(result.discovery.partial, false);
  assert.equal(result.venues[0].openingHours, null, "conflicting group hours remain unknown");
  assert.equal(calls.length, 2);
  assert.equal(clock.pending, 0);
});

test("identical cross-group evidence is deduplicated and permanently closed evidence dominates active siblings", async (t) => {
  const clock = discoveryClock(t);
  let closed = false;
  stub(t, clock, {
    seasonal: async () => Response.json({ elements: [element(9105, { attraction: "corn_maze", leisure: "park", opening_hours: "24/7" })] }),
    outdoor: async () => Response.json({ elements: [element(9105, { attraction: "corn_maze", leisure: "park", opening_hours: "24/7", ...(closed ? { demolished: "yes" } : {}) })] }),
  });
  const data = { ...remote, activityTypes: ["corn-maze", "park"] };
  const duplicate = await searchDateNight({ data });
  assert.equal(duplicate.venues.length, 1);
  assert.equal(duplicate.venues[0].discoveryEvidence.length, 1);
  assert.deepEqual(duplicate.venues[0].activityTypes, ["corn-maze", "park"]);
  closed = true;
  const result = await searchDateNight({ data });
  assert.equal(result.venues.length, 1);
  assert.equal(result.venues[0].lifecycle, "permanently-closed");
  assert.equal(result.venues[0].discoveryEvidence.length, 2);
  const now = new Date("2026-10-03T20:00:00Z");
  const decorated = decorateDateNight(result.venues, remote, now);
  for (const openNowOnly of [false, true]) {
    assert.deepEqual(eligibleDateNight(decorated, { ...DEFAULT_DATE_NIGHT_FILTERS, activityTypes: ["anything"], radiusMiles: 15, openNowOnly }, true, {}, [], now.getTime()), []);
  }
  assert.equal(clock.pending, 0);
});

for (const malformed of ["missing-elements", "remark", "invalid-json"]) {
  test(`malformed ${malformed} sibling cannot erase valid seasonal live response`, async (t) => {
    const clock = discoveryClock(t);
    t.mock.method(console, "warn", () => {});
    stub(t, clock, {
      seasonal: async () => Response.json({ elements: [element(9106, { attraction: "pumpkin_patch" })] }),
      culture: async () => malformed === "invalid-json" ? new Response("invalid JSON")
        : Response.json(malformed === "remark" ? { elements: [], remark: "provider incomplete" } : { missing: [] }),
    });
    const result = await searchDateNight({ data: { ...remote, activityTypes: ["pumpkin-patch", "movies"] } });
    assert.equal(result.source, "live");
    assert.deepEqual(result.venues.map((venue) => venue.id), ["date-night-osm-node-9106"]);
    assert.equal(result.discovery.partial, true);
    assert.equal(groupMap(result).get("culture").outcome, "failed");
    assert.equal(groupMap(result).get("seasonal").outcome, "succeeded-nonempty");
    assert.equal(clock.pending, 0);
  });
}

for (const location of [local, remote]) {
  test(`all four groups/mirrors stalled settle ${location === local ? "honest saved fallback" : "terminal error"} at 12.5s`, async (t) => {
    const clock = discoveryClock(t);
    const log = t.mock.method(console, "warn", () => {});
    const stall = () => new Promise(() => {});
    const calls = stub(t, clock, { seasonal: stall, entertainment: stall, culture: stall, outdoor: stall });
    let result, error, settledAt;
    const pending = searchDateNight({ data: { ...location, activityTypes: ["anything"] } }).then(
      (value) => { result = value; }, (failure) => { error = failure; },
    ).finally(() => { settledAt = clock.now; });
    await clock.tick(12_499);
    assert.equal(settledAt, undefined);
    await clock.tick(1);
    await pending;
    assert.equal(settledAt, 12_500);
    assert.equal(calls.length, 16);
    assert.ok(calls.every(({ signal }) => signal.aborted));
    assert.equal(clock.pending, 0);
    assert.equal(log.mock.callCount(), 1);
    const record = log.mock.calls[0].arguments[1];
    assert.equal(record.requestedGroups, 4);
    assert.equal(record.successfulGroups, 0);
    assert.equal(record.failedGroups, 4);
    assert.equal(record.partial, false);
    if (location === local) {
      assert.equal(error, undefined);
      assert.equal(result.source, "fallback");
      assert.ok(result.venues.length > 0);
      assert.ok(result.venues.every((venue) => venue.source !== "osm"));
      assert.match(result.warning, /saved/i);
      assert.equal(result.discovery.partial, false);
      assert.ok(result.discovery.groups.every((group) => group.outcome === "failed"));
    } else {
      assert.equal(result, undefined);
      assert.ok(error instanceof Error);
      assert.match(error.message, /timed out/i);
    }
    await clock.tick(60_000);
    assert.equal(calls.length, 16);
  });
}

test("all valid-empty groups are live coverage rather than outage even with zero venues", async (t) => {
  const clock = discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  const empty = async () => Response.json({ elements: [] });
  const calls = stub(t, clock, { seasonal: empty, entertainment: empty, culture: empty, outdoor: empty });
  const result = await searchDateNight({ data: { ...remote, activityTypes: ["anything"] } });
  assert.equal(result.source, "live");
  assert.deepEqual(result.venues, []);
  assert.equal(result.warning, undefined);
  assert.equal(result.discovery.partial, false);
  assert.equal(result.discovery.groups.length, 4);
  assert.ok(result.discovery.groups.every((group) => group.outcome === "succeeded-empty"));
  assert.equal(calls.length, 4);
  assert.equal(clock.pending, 0);
});
