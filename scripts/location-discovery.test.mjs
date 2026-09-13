import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { searchRestaurants } = load("src/lib/restaurants/search.ts");
const { searchNightlife } = load("src/lib/nightlife/search.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { applyHardFilters } = load("src/lib/restaurants/weighting.ts");
const { decorateAll } = load("src/lib/restaurants/decorate.ts");
const { DEFAULT_FILTERS, DEFAULT_LOCATION } = load("src/lib/restaurants/types.ts");
const searches = [
  {
    name: "restaurants",
    fn: searchRestaurants,
    key: "restaurants",
    tags: { amenity: "restaurant", cuisine: "pizza" },
    queryTag: '["amenity"="restaurant"]',
  },
  {
    name: "nightlife and casinos",
    fn: searchNightlife,
    key: "venues",
    tags: { amenity: "casino" },
    queryTag: '["amenity"="casino"]',
  },
  {
    name: "date night",
    fn: searchDateNight,
    key: "venues",
    tags: { tourism: "museum" },
    queryTag: '["tourism"="museum"]',
  },
];
const places = [
  { label: "Toronto", lat: 43.65348, lon: -79.38393, region: "Ontario", country: "CA" },
  { label: "Vancouver", lat: 49.26087, lon: -123.11395, region: "British Columbia", country: "CA" },
  { label: "Montréal", lat: 45.50318, lon: -73.56981, region: "Québec", country: "CA" },
  { label: "London", lat: 51.5074, lon: -0.1278, region: "England", country: "GB" },
  { label: "Joplin", lat: 37.084184, lon: -94.513339, region: "Missouri", country: "US" },
  { label: "Portland", lat: 45.52025, lon: -122.6742, region: "Oregon", country: "US" },
];
for (const search of searches) {
  test(`${search.name}: six locations reach the real coordinate query and normalize local results`, async (t) => {
    let current;
    t.mock.method(globalThis, "fetch", async (_url, options) => {
      const query = new URLSearchParams(options.body).get("data");
      assert.ok(query.includes(`,${current.lat},${current.lon})`), query);
      assert.ok(query.includes(search.queryTag));
      assert.ok(!query.includes("countrycodes") && !query.includes('area["ISO3166-1"="US"]'));
      return Response.json({
        elements: [
          {
            id: 900000001,
            type: "node",
            lat: current.lat,
            lon: current.lon,
            tags: {
              name: "International test venue",
              ...search.tags,
              "addr:street": "Main Street",
              "addr:housenumber": "123",
              "addr:city": current.label,
              "addr:province": current.region,
              "addr:country": current.country,
            },
          },
        ],
      });
    });
    for (const place of places) {
      current = place;
      const response = await search.fn({ data: { ...place, radiusMiles: 10 } });
      const actual = response[search.key].find(
        (venue) => venue.name === "International test venue",
      );
      assert.ok(actual, place.label);
      assert.equal(actual.lat, place.lat);
      assert.ok(actual.address.includes(place.region));
      assert.ok(actual.address.endsWith(place.country));
      if (place.country !== "US")
        assert.equal(
          response[search.key].length,
          1,
          "U.S. curated records cannot leak into foreign searches",
        );
      if (search.name === "nightlife and casinos") assert.ok(actual.venueTypes.includes("casino"));
    }
  });
  test(`${search.name}: valid empty areas, all-mirror outage, and coordinate validation remain distinct`, async (t) => {
    const response = t.mock.method(globalThis, "fetch", async () =>
      Response.json({ elements: [] }),
    );
    const data = { lat: 43.65348, lon: -79.38393, radiusMiles: 10 };
    const empty = await search.fn({ data });
    assert.deepEqual(empty[search.key], []);
    assert.equal(empty.source, "live");
    response.mock.mockImplementation(async () =>
      Response.json({ elements: [], remark: "runtime error: query timed out" }),
    );
    await assert.rejects(search.fn({ data }), search.name === "restaurants" ? /Could not load restaurants/ : /incomplete response|Malformed nightlife provider response/);
    response.mock.mockImplementation(async () => Response.json({ unexpected: true }));
    await assert.rejects(search.fn({ data }), search.name === "restaurants" ? /Could not load restaurants/ : /incomplete response|Malformed nightlife provider response/);
    response.mock.mockImplementation(async () => {
      throw new Error("provider offline");
    });
    await assert.rejects(search.fn({ data }));
    const count = response.mock.callCount();
    await assert.rejects(
      search.fn({ data: { lat: 91, lon: 0, radiusMiles: 10 } }),
      /valid location/,
    );
    assert.equal(response.mock.callCount(), count);
    const joplin = await search.fn({ data: { ...DEFAULT_LOCATION, radiusMiles: 15 } });
    assert.equal(joplin.source, "fallback");
    assert.ok(joplin[search.key].length > 0);
    assert.ok(joplin.warning);
  });
}

test("restaurant distance, cuisine and price filters behave with Canadian results", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      elements: [
        {
          type: "node",
          id: 71,
          lat: places[0].lat,
          lon: places[0].lon,
          tags: { name: "Toronto Test Pizza", amenity: "restaurant", cuisine: "pizza" },
        },
        {
          type: "node",
          id: 72,
          lat: places[0].lat + 1,
          lon: places[0].lon,
          tags: { name: "Distant Test Pizza", amenity: "restaurant", cuisine: "pizza" },
        },
      ],
    }),
  );
  const result = await searchRestaurants({ data: { ...places[0], radiusMiles: 10 } });
  const decorated = decorateAll(result.restaurants, { ...places[0], source: "manual" });
  const ctx = {
    filters: { ...DEFAULT_FILTERS, cuisines: ["pizza"], openNowOnly: false },
    preferences: {},
    visits: [],
    exclusions: [],
    sessionShown: [],
    now: Date.now(),
  };
  assert.deepEqual(
    applyHardFilters(decorated, ctx).map((x) => x.name),
    ["Toronto Test Pizza"],
  );
  assert.equal(
    applyHardFilters(decorated, { ...ctx, filters: { ...ctx.filters, cuisines: ["sushi"] } })
      .length,
    0,
  );
  assert.equal(
    applyHardFilters(decorated, {
      ...ctx,
      filters: { ...ctx.filters, minPrice: 4, maxPrice: 4, includeUnknownPrice: false },
    }).length,
    0,
  );
});

test("local closure exclusions do not hide same-named international businesses", async (t) => {
  const names = ["Dead Cow Saloon", "Dead Cow Saloon", "Powers Museum"];
  let index = 0,
    position = places[0];
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      elements: [
        {
          type: "node",
          id: 77,
          ...position,
          tags: { name: names[index], ...searches[index].tags },
        },
      ],
    }),
  );
  for (index = 0; index < searches.length; index++) {
    const search = searches[index];
    position = places[0];
    const canada = await search.fn({ data: { ...position, radiusMiles: 10 } });
    assert.ok(canada[search.key].some((x) => x.name === names[index]));
    position = DEFAULT_LOCATION;
    const local = await search.fn({ data: { ...position, radiusMiles: 10 } });
    assert.ok(!local[search.key].some((x) => x.name === names[index]));
  }
});

test("Maps destinations preserve exact Canadian/U.S. points and encode legacy international addresses", () => {
  for (const place of places) {
    const url = new URL(directionsUrl({ ...place, address: "123 Ambiguous Street" }));
    assert.equal(url.origin, "https://www.google.com");
    assert.equal(url.searchParams.get("destination"), `${place.lat},${place.lon}`);
  }
  const url = new URL(directionsUrl({ name: "Café & Bar", address: "Montréal, Québec, Canada" }));
  assert.equal(url.searchParams.get("destination"), "Café & Bar, Montréal, Québec, Canada");
  assert.equal(directionsUrl({}), null);
});

test("stored legacy U.S. locations and country metadata survive hydration; corrupt coordinates fall back", async (t) => {
  const storage = new Map();
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  });
  const oldWindow = globalThis.window;
  globalThis.window = { localStorage: globalThis.localStorage };
  t.after(() => {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
  });
  const { useAppStore } = appModuleLoader()("src/lib/store.ts");
  const legacy = { lat: 37.084184, lon: -94.513339, label: "Joplin, Missouri", source: "manual" };
  for (const location of [
    legacy,
    {
      ...places[0],
      label: "Toronto, Ontario, Canada",
      country: "Canada",
      countryCode: "CA",
      locality: "Toronto",
      source: "manual",
    },
  ]) {
    storage.set(
      "pick-for-us-v1",
      JSON.stringify({ state: { location, filters: { radiusMiles: 20 } }, version: 0 }),
    );
    await useAppStore.persist.rehydrate();
    assert.deepEqual(useAppStore.getState().location, location);
    assert.equal(useAppStore.getState().filters.radiusMiles, 20);
  }
  const before = useAppStore.getState().location;
  storage.set(
    "pick-for-us-v1",
    JSON.stringify({
      state: { location: { lat: 999, lon: 0, label: "Invalid", source: "geo" } },
      version: 0,
    }),
  );
  await useAppStore.persist.rehydrate();
  assert.deepEqual(useAppStore.getState().location, before);
  useAppStore.getState().markShown("example");
  useAppStore.getState().setLocation(legacy);
  assert.deepEqual(useAppStore.getState().sessionShown, []);
  assert.deepEqual(JSON.parse(storage.get("pick-for-us-v1")).state.location, legacy);
});
