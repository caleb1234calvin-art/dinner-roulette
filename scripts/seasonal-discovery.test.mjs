import { affirmativeClauses } from "./test-support/date-night-query-evaluator.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { dateNightComponentHarness, findNode, textOf } from "./test-support/date-night-component-harness.mjs";
import { discoveryComponentHarness, discoveryModes, discoveryPayload } from "./test-support/discovery-component-harness.mjs";
const load = appModuleLoader();
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { seasonalCoverage } = load("src/lib/date-night/coverage.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const selected = ["haunted-house", "corn-maze", "pumpkin-patch"];
const origin = { lat: 37.176447, lon: -94.310223, label: "Carthage", source: "manual" };
const international = { lat: 43.65348, lon: -79.38393, label: "Toronto", source: "manual" };
const filters = {
  ...DEFAULT_DATE_NIGHT_FILTERS,
  radiusMiles: 50,
  activityTypes: selected,
  openNowOnly: false,
};
const now = new Date(2026, 9, 10, 20);
const element = (id, tags, miles = id, location = international) => ({
  type: "node",
  id,
  lat: location.lat + ((miles / 3958.8) * 180) / Math.PI,
  lon: location.lon,
  tags: { name: `Fixture ${id}`, ...tags },
});
function freeze(t, at = now) {
  t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
}
async function search(t, elements, location = international, inspect = () => {}) {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    const query = new URLSearchParams(options.body).get("data");
    if (query.includes(")->.seasonal_context;")) inspect(query);
    return Response.json({ elements });
  });
  return searchDateNight({ data: { ...location, radiusMiles: 50, spookySeasonEnabled: true } });
}
const eligible = (venues, patch = {}, location = international, at = now) =>
  eligibleDateNight(
    decorateDateNight(venues, location, at),
    { ...filters, ...patch },
    true,
    {},
    [],
    at.getTime(),
  );
const record = {
  status: "confirmed",
  activeFrom: "2026-10-02",
  activeUntil: "2026-10-31",
  checkedAt: "2026-09-29",
  revalidateAfter: "2026-10-31",
};

test("Exeter's actual theme-park record is acquired by the real seasonal query and reaches the eligible pool", async (t) => {
  freeze(t);
  const raw = JSON.parse(
    fs.readFileSync(
      "audit/seasonal-discovery-coverage-audit-1-evidence/exeter-osm-node.json",
      "utf8",
    ),
  ).response.elements[0];
  const result = await search(t, [raw], origin, (query) => {
    assert.ok(query.includes('["tourism"="theme_park"]'));
    assert.ok(query.includes("around:80467,37.176447,-94.310223"));
    assert.ok(!query.includes("Exeter"));
  });
  const found = eligible(result.venues, {}, origin).find((place) =>
    place.id.endsWith(String(raw.id)),
  );
  assert.deepEqual(found.activityTypes, ["corn-maze"]);
  assert.ok(found.distanceMiles > 42 && found.distanceMiles < 43);
  assert.equal(found.availability.status, "schedule-unconfirmed");
  assert.ok(
    !eligible(result.venues, { openNowOnly: true }, origin).some((place) => place.id === found.id),
  );
});

test("precise activity evidence admits corn, pumpkin and haunted trail without admitting generic places", async (t) => {
  freeze(t);
  const good = [
    element(1, { attraction: "corn_maze" }),
    element(2, { attraction: "pumpkin_patch" }),
    element(3, { attraction: "haunted_trail" }),
    element(4, { leisure: "maze", crop: "maize" }),
    element(5, { tourism: "farm", description: "Corn maze and pumpkin picking" }),
    element(6, { tourism: "attraction", "seasonal:activities": "haunted_forest" }),
  ];
  const bad = [
    element(10, { name: "Turtle Moon Labyrinth", attraction: "maze" }),
    element(11, { leisure: "maze", name: "Hedge Maze" }),
    element(12, { attraction: "maze" }),
    element(13, { tourism: "theme_park", name: "Generic Theme Park" }),
    element(14, { landuse: "farmland", crop: "pumpkin" }),
    element(15, { shop: "farm", name: "Pumpkin Patch Shop" }),
    element(16, { tourism: "attraction", description: "Former corn maze, no pumpkin patch" }),
    element(17, { amenity: "restaurant", name: "Haunted House Pizza" }),
    element(18, { leisure: "maze", description: "Meditation labyrinth" }),
  ];
  const result = await search(t, [...good, ...bad], international, (query) => {
    assert.match(query, /haunted_trail/);
    assert.match(query, /seasonal:activities/);
    assert.match(query, /farmyard/);
  });
  assert.deepEqual(
    result.venues.map((place) => Number(place.id.split("-").at(-1))).sort((a, b) => a - b),
    [1, 2, 3, 4, 5, 6],
  );
  assert.deepEqual(result.venues.find((place) => place.id.endsWith("-5")).activityTypes, [
    "corn-maze",
    "pumpkin-patch",
  ]);
});

test("same identity preserves C/P, provenance, stable ID and representative metadata in either provider order", async (t) => {
  freeze(t);
  const corn = element(
    22,
    { name: "Harvest Activity", attraction: "corn_maze", opening_hours: "24/7", phone: "111" },
    1,
  );
  const pumpkin = element(
    21,
    { name: "Harvest Activity", attraction: "pumpkin_patch", website: "https://example.org" },
    1,
  );
  const a = await search(t, [corn, pumpkin]);
  const b = await search(t, [pumpkin, corn]);
  assert.deepEqual(a, b);
  assert.equal(a.venues.length, 1);
  assert.equal(a.venues[0].id, "date-night-osm-node-21");
  assert.deepEqual(a.venues[0].activityTypes, ["corn-maze", "pumpkin-patch"]);
  assert.equal(a.venues[0].discoveryEvidence.length, 2);
  assert.equal(a.venues[0].openingHours, "24/7");
  assert.equal(a.venues[0].phone, "111");
  const conflicting = await search(t, [
    corn,
    { ...pumpkin, tags: { ...pumpkin.tags, opening_hours: "closed" } },
  ]);
  assert.equal(conflicting.venues[0].openingHours, null);
});

test("structured lifecycle cannot survive eligibility or be resurrected by an active duplicate", async (t) => {
  freeze(t);
  const result = await search(t, [
    element(1, { attraction: "corn_maze", disused: "yes" }),
    element(2, { attraction: "pumpkin_patch", "abandoned:attraction": "pumpkin_patch" }),
    element(3, { attraction: "haunted_house", demolished: "yes" }),
    element(4, { "disused:attraction": "haunted_house" }),
    element(5, { name: "Duplicate", attraction: "corn_maze" }, 10),
    element(6, { name: "Duplicate", attraction: "corn_maze", disused: "yes" }, 10),
  ]);
  assert.equal(result.venues.length, 5);
  assert.equal(eligible(result.venues).length, 0);
  assert.equal(eligible(result.venues, { openNowOnly: true }).length, 0);
});

test("all availability states share one OFF/ON policy, including expiry and next-year revalidation", async (t) => {
  freeze(t);
  const result = await search(t, [element(1, { attraction: "corn_maze", opening_hours: "24/7" })]);
  const base = result.venues[0];
  const cases = [
    [undefined, "24/7", now, "schedule-unconfirmed", true, false],
    [record, null, now, "hours-unknown", true, false],
    [record, "closed", now, "closed-now", true, false],
    [record, "24/7", now, "open-now", true, true],
    [record, "24/7", new Date(2026, 8, 30, 20), "upcoming-season", true, false],
    [record, "24/7", new Date(2026, 10, 1, 20), "finished-season", false, false],
    [{ ...record, status: "not-operating" }, "24/7", now, "not-operating-season", false, false],
    [
      { ...record, revalidateAfter: "2026-10-09" },
      "24/7",
      now,
      "schedule-unconfirmed",
      true,
      false,
    ],
    [record, "24/7", new Date(2027, 9, 10, 20), "finished-season", false, false],
    [
      { ...record, activeDates: ["2026-10-09", "2026-10-16"] },
      "24/7",
      now,
      "closed-now",
      true,
      false,
    ],
  ];
  for (const [seasonalAvailability, openingHours, at, status, off, on] of cases) {
    const place = { ...base, seasonalAvailability, openingHours };
    assert.equal(decorateDateNight([place], international, at)[0].availability.status, status);
    assert.equal(eligible([place], {}, international, at).length === 1, off, status);
    assert.equal(
      eligible([place], { openNowOnly: true }, international, at).length === 1,
      on,
      status,
    );
  }
});

test("all seven seasonal selections preserve union and the radius boundary", async (t) => {
  freeze(t);
  const result = await search(t, [
    element(1, { attraction: "haunted_house" }),
    element(2, { attraction: "corn_maze" }),
    element(3, { attraction: "pumpkin_patch" }),
    element(4, { tourism: "farm", description: "Corn maze and pumpkin patch" }),
  ]);
  for (let mask = 1; mask < 8; mask++) {
    const activityTypes = selected.filter((_, i) => mask & (1 << i));
    const expected = result.venues.filter((venue) =>
      venue.activityTypes.some((type) => activityTypes.includes(type)),
    );
    assert.deepEqual(
      eligible(result.venues, { activityTypes })
        .map((x) => x.id)
        .sort(),
      expected.map((x) => x.id).sort(),
    );
  }
  for (const miles of [0, 49.9, 50, 50.049, 50.051, 51, 60]) {
    const raw = element(10, { attraction: "corn_maze" }, miles);
    const [place] = (await search(t, [raw])).venues;
    assert.equal(eligible([place]).length === 1, miles <= 50.049, String(miles));
  }
});

test("saved-only successful sparse coverage, missing categories and provider outage remain distinct", async (t) => {
  freeze(t);
  const result = await search(t, [], origin);
  assert.equal(result.source, "merged");
  assert.equal(result.warning, undefined);
  const coverage = seasonalCoverage(
    decorateDateNight(result.venues, origin, now),
    filters,
    result.source,
    true,
  );
  assert.deepEqual(coverage.savedOnly, ["haunted-house"]);
  assert.deepEqual(coverage.missing, ["corn-maze", "pumpkin-patch"]);
  assert.equal(coverage.sparse, true);
  assert.equal(coverage.outage, false);
  assert.doesNotMatch(coverage.text, /unavailable/);
  const failed = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("offline");
  });
  const fallback = await searchDateNight({
    data: { ...origin, radiusMiles: 50, spookySeasonEnabled: true, activityTypes: selected },
  });
  assert.equal(failed.mock.callCount(), 4);
  assert.equal(fallback.source, "fallback");
  assert.equal(
    seasonalCoverage(
      decorateDateNight(fallback.venues, origin, now),
      filters,
      fallback.source,
      true,
    ).outage,
    true,
  );
});

test("per-category provenance never labels a saved haunt as live because its ordinary park duplicate is live", async (t) => {
  freeze(t);
  const result = await search(
    t,
    [
      {
        type: "node",
        id: 77,
        lat: 37.0694258,
        lon: -94.4688601,
        tags: { name: "The Werehouse", leisure: "park" },
      },
    ],
    origin,
  );
  const coverage = seasonalCoverage(
    decorateDateNight(result.venues, origin, now),
    filters,
    result.source,
    true,
  );
  assert.deepEqual(coverage.live, []);
  assert.deepEqual(coverage.savedOnly, ["haunted-house"]);
});

test("ordinary Date Night and seasonal toggle still work internationally; unknown hours fail strict ON", async (t) => {
  freeze(t);
  const result = await search(t, [
    element(1, { tourism: "museum", opening_hours: "24/7" }),
    element(2, { leisure: "bowling_alley" }),
  ]);
  assert.equal(
    eligible(result.venues, { activityTypes: ["anything"], openNowOnly: true }).length,
    1,
  );
  assert.equal(eligible(result.venues, { activityTypes: ["anything"] }).length, 2);
  const queries = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    queries.push(new URLSearchParams(options.body).get("data"));
    return Response.json({ elements: [element(3, { attraction: "corn_maze" })] });
  });
  const inactive = await searchDateNight({
    data: { ...international, radiusMiles: 50, spookySeasonEnabled: false },
  });
  assert.deepEqual(inactive.venues, []);
  for (const query of queries) {
    const affirmative = affirmativeClauses(query).join("\n");
    assert.doesNotMatch(affirmative, /theme_park|haunted_trail/);
  }
});

function storeFor(location = origin) {
  return {
    location,
    preferences: {},
    exclusions: [],
    sessionShown: [],
    dateNightFilters: { ...filters },
    spookySeasonEnabled: true,
    theme: "dark",
    markShown() {},
    excludeTonight() {},
    setDateNightFilters(patch) {
      this.dateNightFilters = { ...this.dateNightFilters, ...patch };
    },
  };
}
function browserGlobals(t) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { body: {}, documentElement: { classList: { contains: () => true } } },
  });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "document", previous);
    else delete globalThis.document;
  });
}

const halloweenCaution =
  "Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.";
const fallbackDisclosure =
  "Pick For Us is using saved local date ideas. Check each stop before you leave.";

function assertHalloweenActionCard(harness, tree, disabled) {
  const card = findNode(tree, (node) => node.props?.className?.includes("fixed inset-x-0"));
  assert.ok(card, "sticky action card remains");
  const note = findNode(card, (node) => node.props?.role === "note");
  assert.equal(textOf(note), halloweenCaution);
  assert.match(harness.html(note), /role="note"/);
  assert.equal(findNode(note, (node) => node.props?.onClick || node.props?.role === "alert"), null);
  assert.ok(textOf(card).indexOf(halloweenCaution) < textOf(card).indexOf("Pick our date"));
  for (const label of ["Pick our date", "Give us options", "Plan the night"]) {
    assert.equal(harness.button(card, label)?.props.disabled, disabled, label);
  }
}

for (const source of ["live", "merged", "fallback"]) {
  test(`Halloween caution: ${source} loading/settlement retains controls, counts and selections`, async (t) => {
    freeze(t);
    browserGlobals(t);
    const result = await search(t, [
      element(801, { attraction: "haunted_house" }, 1),
      element(802, { attraction: "pumpkin_patch" }, 2),
      element(803, { amenity: "cinema" }, 3),
    ]);
    const store = storeFor(international);
    let resolveSearch;
    const pending = new Promise((resolve) => { resolveSearch = resolve; });
    const harness = dateNightComponentHarness({ store, now: { value: now }, search: () => pending });
    t.after(() => harness.dispose());
    let tree = harness.render();
    assert.match(textOf(tree), /Finding date ideas/);
    assertHalloweenActionCard(harness, tree, true);
    resolveSearch({ ...result, source, warning: source === "fallback" ? "Provider unavailable" : undefined });
    tree = await harness.settle();
    assertHalloweenActionCard(harness, tree, false);
    assert.match(textOf(tree), /2 activities match/);
    t.mock.method(Math, "random", () => 0);
    const expected = eligible(result.venues).map((venue) => venue.id);
    harness.button(tree, "Give us options").props.onClick();
    tree = harness.render();
    assert.deepEqual(harness.overlay(tree, "OptionsOverlay").props.restaurants.map((venue) => venue.id), expected);
    harness.button(tree, "Pick our date").props.onClick();
    tree = harness.render();
    assert.equal(harness.overlay(tree, "ResultOverlay").props.restaurant.id, expected[0]);
    harness.button(tree, "Plan the night").props.onClick();
    tree = harness.render();
    assert.deepEqual(harness.overlay(tree, "DateNightPlanOverlay").props.plan.map((venue) => venue.id), expected);
    assert.match(textOf(tree), /2 activities match/);
    assertHalloweenActionCard(harness, tree, false);
    if (source === "fallback") {
      assert.match(textOf(tree), /Live map unavailable; using saved places/);
      // The existing generic fallback disclosure is used when no seasonal
      // categories are selected; category-specific coverage otherwise stays.
      store.dateNightFilters.activityTypes = ["movies"];
      tree = harness.render();
      assert.equal(findNode(tree, (node) => node.props?.body === fallbackDisclosure)?.props.body, fallbackDisclosure);
      assertHalloweenActionCard(harness, tree, false);
      assert.match(textOf(tree), /1 activities match/);
    }
  });
}

for (const [label, spookySeasonEnabled, at] of [
  ["seasonal toggle off", false, now],
  ["outside Halloween season", true, new Date(2026, 6, 10, 20)],
]) {
  test(`ordinary Date Night caution absent: ${label}; controls/count/selection remain`, async (t) => {
    freeze(t);
    browserGlobals(t);
    const result = await search(t, [element(804, { amenity: "cinema" }, 1)]);
    const store = storeFor(international);
    store.spookySeasonEnabled = spookySeasonEnabled;
    store.dateNightFilters.activityTypes = ["movies"];
    const harness = dateNightComponentHarness({ store, now: { value: at }, search: async () => result });
    t.after(() => harness.dispose());
    assert.equal(textOf(harness.render()).includes(halloweenCaution), false);
    let tree = await harness.settle();
    assert.equal(harness.html(tree).includes(halloweenCaution), false);
    assert.equal(harness.button(tree, "Plan the night"), null);
    assert.match(textOf(tree), /1 activities match/);
    for (const action of ["Pick our date", "Give us options"]) {
      assert.equal(harness.button(tree, action)?.props.disabled, false);
      harness.button(tree, action).props.onClick();
      tree = harness.render();
    }
    assert.equal(harness.overlay(tree, "ResultOverlay").props.restaurant.id, result.venues[0].id);
    assert.deepEqual(harness.overlay(tree, "OptionsOverlay").props.restaurants.map((venue) => venue.id), [result.venues[0].id]);
  });
}

for (const config of discoveryModes.filter(({ mode }) => mode !== "date-night")) {
  test(`${config.mode}: Halloween caution remains absent during loading and after settlement`, async (t) => {
    const harness = discoveryComponentHarness(config);
    t.after(() => harness.dispose());
    harness.store.spookySeasonEnabled = true;
    assert.equal(textOf(harness.render()).includes(halloweenCaution), false);
    harness.requests[0].resolve(discoveryPayload(config));
    assert.equal(textOf((await harness.settle()).tree).includes(halloweenCaution), false);
  });
}

test("actual component: handler → count/options/pick/plan and all seven category combinations", async (t) => {
  freeze(t);
  browserGlobals(t);
  const elements = [
    element(1, { attraction: "haunted_house" }),
    element(2, { tourism: "farm", description: "Corn maze and pumpkin patch" }),
    element(3, { tourism: "farm", description: "Corn maze and pumpkin patch" }, 2),
  ];
  // 2/3 are duplicate identity representations, not separate option slots.
  elements[2].tags.name = elements[1].tags.name;
  const result = await search(t, elements);
  const store = storeFor(international),
    clock = { value: now };
  const harness = dateNightComponentHarness({ store, now: clock, search: searchDateNight });
  t.after(() => harness.dispose());
  harness.render();
  let tree = await harness.settle();
  for (let mask = 1; mask < 8; mask++) {
    store.dateNightFilters.activityTypes = selected.filter((_, i) => mask & (1 << i));
    harness.render();
    tree = await harness.settle();
    const pool = eligible(result.venues, store.dateNightFilters);
    assert.match(textOf(tree), new RegExp(`${pool.length} activities match`));
    harness.button(tree, "Give us options").props.onClick();
    tree = harness.render();
    const optionNode = harness.overlay(tree, "OptionsOverlay");
    assert.equal(optionNode.props.restaurants.length, pool.length);
    assert.equal(new Set(optionNode.props.restaurants.map((place) => place.id)).size, pool.length);
    const multi = optionNode.props.restaurants.find((place) => place.activityTypes.length === 2);
    if (multi) assert.deepEqual(multi.activityTypes, ["corn-maze", "pumpkin-patch"]);
    harness.button(tree, "Pick our date").props.onClick();
    tree = harness.render();
    assert.ok(
      pool.some((place) => place.id === harness.overlay(tree, "ResultOverlay").props.restaurant.id),
    );
  }
  store.dateNightFilters.activityTypes = selected;
  harness.render();
  tree = await harness.settle();
  t.mock.method(Math, "random", () => 0.99); // Previously consumed the only settle venue as the thrill.
  harness.button(tree, "Plan the night").props.onClick();
  tree = harness.render();
  assert.match(harness.html(tree), /Your night has an arc/);
  store.dateNightFilters.activityTypes = ["haunted-house"];
  harness.render();
  tree = await harness.settle();
  harness.button(tree, "Plan the night").props.onClick();
  tree = harness.render();
  assert.match(harness.html(tree), /No complete seasonal pair yet/);
});

test("actual component: OFF/ON/OFF, labels, saved-only disclosure, and clock-dependent pool/overlay refresh", async (t) => {
  freeze(t);
  browserGlobals(t);
  await search(t, [], origin);
  const store = storeFor(),
    clock = { value: new Date(2026, 8, 29, 20) };
  // Isolate the legacy Werehouse clock regression; new V1 browseable additions
  // are covered separately and must not alter this fixture's one-venue intent.
  store.dateNightFilters.favoritesOnly = true;
  store.preferences["date-night-werehouse-joplin"] = { favorite: true };
  const harness = dateNightComponentHarness({ store, now: clock, search: searchDateNight });
  t.after(() => harness.dispose());
  harness.render();
  let tree = await harness.settle();
  assert.match(textOf(tree), /1 activities match/);
  assert.match(textOf(tree), /Saved places only: Haunted House/);
  assert.doesNotMatch(textOf(tree), /Live map unavailable/);
  harness.button(tree, "Give us options").props.onClick();
  tree = harness.render();
  assert.match(harness.html(tree), /Closed now/);
  store.dateNightFilters.openNowOnly = true;
  tree = harness.render();
  assert.match(textOf(tree), /0 activities match/);
  assert.equal(harness.button(tree, "Pick our date").props.disabled, true);
  store.dateNightFilters.openNowOnly = false;
  tree = harness.render();
  assert.match(textOf(tree), /1 activities match/);
  clock.value = new Date(2026, 9, 10, 20);
  store.dateNightFilters.openNowOnly = true;
  tree = harness.render();
  assert.match(textOf(tree), /1 activities match/);
  clock.value = new Date(2026, 9, 11, 0);
  tree = harness.render();
  assert.match(textOf(tree), /0 activities match/);
  assert.equal(harness.overlay(tree, "OptionsOverlay"), null);
  clock.value = new Date(2026, 10, 1, 20);
  store.dateNightFilters.openNowOnly = false;
  tree = harness.render();
  assert.match(textOf(tree), /0 activities match/);
});

test("actual component displays schedule uncertainty distinctly for live weekly-hours-only venues", async (t) => {
  freeze(t);
  browserGlobals(t);
  await search(t, [element(1, { attraction: "corn_maze", opening_hours: "24/7" })]);
  const store = storeFor(international),
    clock = { value: now };
  const harness = dateNightComponentHarness({ store, now: clock, search: searchDateNight });
  t.after(() => harness.dispose());
  harness.render();
  let tree = await harness.settle();
  harness.button(tree, "Give us options").props.onClick();
  tree = harness.render();
  assert.match(harness.html(tree), /Schedule unconfirmed/);
  assert.match(textOf(tree), /Seasonal map listings included; current-season schedules may be unconfirmed/);
  store.dateNightFilters.openNowOnly = true;
  tree = harness.render();
  assert.match(textOf(tree), /0 activities match/);
});

test("V-F03-01 actual component: not-operating stays excluded before and after revalidation expiry", async (t) => {
  freeze(t);
  browserGlobals(t);
  const result = await search(t, [
    element(700, { attraction: "pumpkin_patch", opening_hours: "24/7" }, 1),
  ]);
  result.venues[0].seasonalAvailability = {
    ...record,
    status: "not-operating",
    revalidateAfter: "2026-10-09",
  };
  const store = storeFor(international),
    clock = { value: new Date(2026, 9, 9, 20) };
  const harness = dateNightComponentHarness({ store, now: clock, search: async () => result });
  t.after(() => harness.dispose());
  harness.render();
  await harness.settle();
  for (const at of [
    new Date(2026, 9, 9, 20),
    new Date(2026, 9, 9, 23, 59),
    new Date(2026, 9, 10, 0),
    now,
  ]) {
    clock.value = at;
    const availability = decorateDateNight(result.venues, international, at)[0].availability;
    assert.equal(availability.status, "not-operating-season");
    assert.equal(availability.season, "not-operating");
    assert.equal(availability.browseEligible, false);
    assert.equal(availability.openNowEligible, false);
    assert.equal(availability.revalidationDue, at.getDate() === 10);
    for (const openNowOnly of [false, true, false]) {
      store.dateNightFilters.openNowOnly = openNowOnly;
      let tree = harness.render();
      assert.match(textOf(tree), /0 activities match/);
      for (const label of ["Give us options", "Pick our date", "Plan the night"]) {
        const button = harness.button(tree, label);
        assert.equal(button.props.disabled, true, label);
        // Even direct callback execution cannot bypass the empty eligible pool.
        button.props.onClick();
        tree = harness.render();
      }
      for (const overlay of ["OptionsOverlay", "ResultOverlay", "DateNightPlanOverlay"])
        assert.equal(harness.overlay(tree, overlay), null, overlay);
    }
  }
});

test("V-F03-01 actual component: an expired negative cannot fill a plan until stored positive evidence replaces it", async (t) => {
  freeze(t);
  browserGlobals(t);
  const result = await search(t, [
    element(701, { attraction: "haunted_house", opening_hours: "24/7" }, 1),
    element(702, { attraction: "pumpkin_patch", opening_hours: "24/7" }, 2),
  ]);
  for (const [at, positive] of [
    [new Date(2026, 9, 9, 20), false],
    [now, false],
    [now, true],
  ]) {
    const venues = result.venues.map((venue, index) => ({
      ...venue,
      seasonalAvailability:
        index === 0
          ? record
          : positive
            ? { ...record, checkedAt: "2026-10-10" }
            : { ...record, status: "not-operating", revalidateAfter: "2026-10-09" },
    }));
    const store = storeFor(international),
      clock = { value: at };
    const harness = dateNightComponentHarness({
      store,
      now: clock,
      search: async () => ({ ...result, venues }),
    });
    t.after(() => harness.dispose());
    harness.render();
    await harness.settle();
    for (const openNowOnly of [false, true]) {
      store.dateNightFilters.openNowOnly = openNowOnly;
      let tree = harness.render();
      const expected = positive ? venues.map((venue) => venue.id) : [venues[0].id];
      assert.match(textOf(tree), new RegExp(`${expected.length} activities match`));
      harness.button(tree, "Give us options").props.onClick();
      tree = harness.render();
      assert.deepEqual(
        harness
          .overlay(tree, "OptionsOverlay")
          .props.restaurants.map((venue) => venue.id)
          .sort(),
        [...expected].sort(),
      );
      harness.button(tree, "Pick our date").props.onClick();
      tree = harness.render();
      assert.ok(expected.includes(harness.overlay(tree, "ResultOverlay").props.restaurant.id));
      harness.button(tree, "Plan the night").props.onClick();
      tree = harness.render();
      assert.deepEqual(
        harness
          .overlay(tree, "DateNightPlanOverlay")
          .props.plan.map((venue) => venue.id)
          .sort(),
        [...expected].sort(),
      );
      assert.match(
        harness.html(tree),
        positive ? /Your night has an arc/ : /No complete seasonal pair yet/,
      );
    }
  }
});

test("V-F03-01 control: positive calendar expiry remains uncertain OFF and refreshes ON result/options/plan", async (t) => {
  freeze(t);
  browserGlobals(t);
  const result = await search(t, [
    element(703, { attraction: "haunted_house", opening_hours: "24/7" }, 1),
    element(704, { attraction: "pumpkin_patch", opening_hours: "24/7" }, 2),
  ]);
  result.venues[0].seasonalAvailability = { ...record, revalidateAfter: "2026-10-09" };
  result.venues[1].seasonalAvailability = record;
  const store = storeFor(international),
    clock = { value: new Date(2026, 9, 9, 23, 59) };
  store.dateNightFilters.openNowOnly = true;
  t.mock.method(Math, "random", () => 0);
  const harness = dateNightComponentHarness({ store, now: clock, search: async () => result });
  t.after(() => harness.dispose());
  harness.render();
  let tree = await harness.settle();
  assert.match(textOf(tree), /2 activities match/);
  for (const label of ["Give us options", "Pick our date", "Plan the night"]) {
    harness.button(tree, label).props.onClick();
    tree = harness.render();
  }
  assert.equal(harness.overlay(tree, "ResultOverlay").props.restaurant.id, result.venues[0].id);
  assert.match(harness.html(tree), /Your night has an arc/);
  clock.value = new Date(2026, 9, 10, 0);
  tree = harness.render();
  assert.match(textOf(tree), /1 activities match/);
  assert.equal(harness.overlay(tree, "ResultOverlay"), null);
  assert.deepEqual(
    harness.overlay(tree, "OptionsOverlay").props.restaurants.map((venue) => venue.id),
    [result.venues[1].id],
  );
  assert.deepEqual(
    harness.overlay(tree, "DateNightPlanOverlay").props.plan.map((venue) => venue.id),
    [result.venues[1].id],
  );
  assert.match(harness.html(tree), /No complete seasonal pair yet/);
  store.dateNightFilters.openNowOnly = false;
  tree = harness.render();
  assert.match(textOf(tree), /2 activities match/);
  assert.match(harness.html(tree), /Schedule unconfirmed/);
  const availability = decorateDateNight(result.venues, international, clock.value)[0].availability;
  assert.equal(availability.status, "schedule-unconfirmed");
  assert.equal(availability.browseEligible, true);
  assert.equal(availability.openNowEligible, false);
  assert.equal(availability.revalidationDue, true);
});

test("real clock hook refreshes at minute boundaries and focus/visibility resume, then cleans up", async (t) => {
  const ts = await import("typescript");
  const listeners = new Map();
  const events = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  };
  const saved = ["window", "document"].map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ]);
  for (const [key] of saved)
    Object.defineProperty(globalThis, key, { configurable: true, value: events });
  t.after(() => {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  t.mock.timers.enable({
    apis: ["Date", "setTimeout"],
    now: new Date(2026, 9, 10, 19, 59, 45).getTime(),
  });
  let state,
    cleanup,
    updates = 0;
  const react = {
    useState: (init) => {
      state = init();
      return [
        state,
        (value) => {
          state = value;
          updates++;
        },
      ];
    },
    useEffect: (fn) => {
      cleanup = fn();
    },
  };
  const module = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync("src/lib/date-night/use-clock.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function("require", "module", "exports", compiled)(() => react, module, module.exports);
  module.exports.useDateNightClock();
  t.mock.timers.tick(14_999);
  assert.equal(state.getMinutes(), 59);
  t.mock.timers.tick(1);
  assert.equal(state.getMinutes(), 0);
  assert.equal(state.getHours(), 20);
  const count = updates;
  listeners.get("focus")();
  listeners.get("visibilitychange")();
  assert.equal(updates, count + 2);
  cleanup();
  assert.equal(listeners.size, 0);
  const stopped = updates;
  t.mock.timers.tick(60_000);
  assert.equal(updates, stopped);
});

test("retained regional provider captures replay through the new handler without generic-maze false positives", async (t) => {
  freeze(t);
  const capture = JSON.parse(
    fs.readFileSync(
      "audit/seasonal-discovery-coverage-audit-1-evidence/live-provider-observations.json",
      "utf8",
    ),
  );
  for (const run of capture.runs) {
    const raw = JSON.parse(run.calls.find((call) => call.status === 200).body).elements;
    const result = await search(t, raw, run.origin);
    const pool = eligible(result.venues, {}, run.origin);
    assert.ok(!pool.some((place) => place.name === "Turtle Moon Labyrinth"), run.origin.label);
    assert.equal(new Set(pool.map((place) => place.id)).size, pool.length);
    assert.ok(pool.every((place) => place.distanceMiles <= 50.05));
    const coverage = seasonalCoverage(
      decorateDateNight(result.venues, run.origin, now),
      filters,
      result.source,
      true,
    );
    assert.equal(coverage.outage, false);
    assert.ok(
      result.venues.some((place) => place.activityTypes.some((type) => !selected.includes(type))),
      "ordinary Date Night retained",
    );
  }
});
