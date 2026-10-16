import assert from "node:assert/strict";
import test from "node:test";
import {
  coordinateLocation,
  formatOsmAddress,
  isCoordinates,
  normalizeLocationQuery,
} from "./model.ts";
import { geocodeQuery, locationFromNominatim, reverseGeocode } from "../restaurants/geocode.ts";
import { createLocationController, getDeviceCoordinates } from "./controller.ts";
import type { GeographicLocation, LocationCandidate } from "./model.ts";
import type { SearchLocation } from "../restaurants/types.ts";
import type { LocationStatus } from "./controller.ts";

const toronto = {
  lat: 43.65348,
  lon: -79.38393,
  label: "Toronto, Ontario, Canada",
  locality: "Toronto",
  region: "Ontario",
  country: "Canada",
  countryCode: "CA",
};
const torontoCandidate = { ...toronto, id: "toronto", placeType: "city" };
const cities = [
  {
    query: "Joplin, Missouri, USA",
    lat: 37.084,
    lon: -94.513,
    city: "Joplin",
    region: "Missouri",
    country: "United States",
    code: "US",
  },
  {
    query: "Toronto, Ontario, Canada",
    lat: 43.653,
    lon: -79.383,
    city: "Toronto",
    region: "Ontario",
    country: "Canada",
    code: "CA",
  },
  {
    query: "Vancouver, British Columbia, Canada",
    lat: 49.261,
    lon: -123.114,
    city: "Vancouver",
    region: "British Columbia",
    country: "Canada",
    code: "CA",
  },
  {
    query: "Montréal, Québec, Canada",
    lat: 45.503,
    lon: -73.569,
    city: "Montréal",
    region: "Québec",
    country: "Canada",
    code: "CA",
  },
  {
    query: "London, United Kingdom",
    lat: 51.507,
    lon: -0.128,
    city: "London",
    region: "England",
    country: "United Kingdom",
    code: "GB",
  },
];
for (const city of cities) {
  test(`global manual resolution preserves ${city.query}`, async (t) => {
    t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
      const url = new URL(String(input));
      assert.equal(url.searchParams.get("q"), city.query);
      assert.equal(url.searchParams.has("countrycodes"), false);
      assert.equal(url.searchParams.get("addressdetails"), "1");
      return Response.json([
        {
          lat: String(city.lat),
          lon: String(city.lon),
          address: {
            city: city.city,
            state: city.region,
            country: city.country,
            country_code: city.code.toLowerCase(),
          },
        },
      ]);
    });
    const candidates = await geocodeQuery(`  ${city.query}  `);
    assert.equal(candidates.length, 1);
    const { id, placeType, county, postalCode, ...resolved } = candidates[0];
    assert.ok(id);
    assert.equal(placeType, "place");
    assert.equal(county, undefined);
    assert.equal(postalCode, undefined);
    assert.deepEqual(resolved, {
      lat: city.lat,
      lon: city.lon,
      label: `${city.city}, ${city.region}, ${city.country}`,
      locality: city.city,
      region: city.region,
      country: city.country,
      countryCode: city.code,
    });
  });
}

test("countries without regions and provider province/locality variants remain valid", () => {
  const singapore = locationFromNominatim({
    lat: 1.35,
    lon: 103.8,
    address: { city: "Singapore", country: "Singapore", country_code: "sg" },
  })!;
  assert.equal(singapore.label, "Singapore");
  assert.equal(singapore.region, undefined);
  const province = locationFromNominatim({
    lat: 45.4,
    lon: -75.7,
    address: { municipality: "Ottawa", province: "Ontario", country: "Canada", country_code: "ca" },
  })!;
  assert.equal(province.region, "Ontario");
  assert.equal(province.locality, "Ottawa");
  assert.equal(
    locationFromNominatim({ lat: 0, lon: 0, display_name: "Equatorial location" })?.label,
    "Equatorial location",
  );
});

test("invalid coordinates and malformed geocoder hits cannot become active locations", () => {
  for (const value of [
    null,
    {},
    { lat: 91, lon: 0 },
    { lat: 0, lon: -181 },
    { lat: NaN, lon: 0 },
    { lat: "", lon: 0 },
    { lat: null, lon: 0 },
    { lat: "invalid", lon: 0 },
  ]) {
    assert.equal(isCoordinates(value), false);
    assert.equal(locationFromNominatim({ ...(value as object), display_name: "Invalid" }), null);
  }
  assert.equal(isCoordinates({ lat: 0, lon: 0 }), true);
  assert.equal(locationFromNominatim({ lat: 10, lon: 20, error: "No result" }), null);
});

test("manual input preserves international addresses and postal codes without a U.S. parser", () => {
  for (const query of [
    "64801",
    "M5V 3A8, Canada",
    "V6B 1A1, Canada",
    "10 Downing Street, London SW1A 2AA, UK",
    "東京都, 日本",
  ])
    assert.equal(normalizeLocationQuery(query), query);
  for (const bad of [undefined, null, "", "   ", 123, "x".repeat(301), "city\u0000country"])
    assert.throws(() => normalizeLocationQuery(bad));
});

test("no-result, provider errors and malformed payloads are distinct from valid places", async (t) => {
  const response = t.mock.method(globalThis, "fetch", async () => Response.json([]));
  assert.deepEqual(await geocodeQuery("No such place"), []);
  response.mock.mockImplementation(async () => new Response("unavailable", { status: 503 }));
  await assert.rejects(geocodeQuery("Toronto, Canada"), /unavailable/);
  response.mock.mockImplementation(async () => Response.json({ unexpected: true }));
  await assert.rejects(geocodeQuery("Toronto, Canada"), /invalid response/);
});

test("reverse lookup enriches metadata while preserving the original GPS coordinates", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      lat: 40,
      lon: -80,
      address: { city: "Toronto", state: "Ontario", country: "Canada", country_code: "ca" },
    }),
  );
  const result = await reverseGeocode(toronto.lat, toronto.lon);
  assert.deepEqual(result, toronto);
});

test("all reverse failures retain a usable coordinate location; invalid input never fetches", async (t) => {
  const response = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("no", { status: 503 }),
  );
  assert.deepEqual(await reverseGeocode(0, 0), coordinateLocation({ lat: 0, lon: 0 }));
  response.mock.mockImplementation(async () => {
    throw new Error("network");
  });
  assert.deepEqual(await reverseGeocode(0, 0), coordinateLocation({ lat: 0, lon: 0 }));
  response.mock.mockImplementation(async () => Response.json({ error: "Unable to geocode" }));
  assert.deepEqual(await reverseGeocode(0, 0), coordinateLocation({ lat: 0, lon: 0 }));
  const count = response.mock.callCount();
  await assert.rejects(reverseGeocode(95, 0), /valid location/);
  assert.equal(response.mock.callCount(), count);
});

test("international business addresses retain province, postcode, country and full-address tags", () => {
  assert.equal(
    formatOsmAddress({
      "addr:housenumber": "123",
      "addr:street": "Queen St W",
      "addr:city": "Toronto",
      "addr:province": "Ontario",
      "addr:postcode": "M5V 2B7",
      "addr:country": "CA",
    }),
    "123 Queen St W, Toronto, Ontario, M5V 2B7, CA",
  );
  assert.equal(formatOsmAddress({ "addr:full": "東京都千代田区 1-1" }), "東京都千代田区 1-1");
  assert.equal(
    formatOsmAddress({ "addr:place": "Village square", "addr:village": "Example" }),
    "Village square, Example",
  );
  assert.equal(formatOsmAddress({}), "");
});

test("native geolocation is opt-in, bounded, and reports each failure accurately", async () => {
  let calls = 0;
  const geo: Pick<Geolocation, "getCurrentPosition"> = {
    getCurrentPosition(success, _failure, options) {
      calls++;
      assert.equal(options?.enableHighAccuracy, false);
      assert.equal(options?.timeout, 10000);
      success({ coords: { latitude: toronto.lat, longitude: toronto.lon } } as GeolocationPosition);
    },
  };
  assert.equal(calls, 0);
  assert.deepEqual(await getDeviceCoordinates(geo), { lat: toronto.lat, lon: toronto.lon });
  assert.equal(calls, 1);
  await assert.rejects(getDeviceCoordinates(), /isn't available in this browser/);
  for (const [code, message] of [
    [1, /permission was denied/],
    [2, /location is unavailable/],
    [3, /timed out/],
    [99, /Couldn't get/],
  ] as const) {
    await assert.rejects(
      getDeviceCoordinates({
        getCurrentPosition(_success, failure) {
          failure?.({ code } as GeolocationPositionError);
        },
      }),
      message,
    );
  }
  await assert.rejects(
    getDeviceCoordinates({
      getCurrentPosition() {
        throw new Error("blocked");
      },
    }),
    /Couldn't get/,
  );
  await assert.rejects(
    getDeviceCoordinates({
      getCurrentPosition(success) {
        success({ coords: { latitude: NaN, longitude: 0 } } as GeolocationPosition);
      },
    }),
    /unavailable/,
  );
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function harness(overrides: Partial<Parameters<typeof createLocationController>[0]> = {}) {
  const locations: SearchLocation[] = [];
  const statuses: LocationStatus[] = [];
  const choices: LocationCandidate[][] = [];
  const controller = createLocationController({
    getCoordinates: async () => toronto,
    reverse: async () => toronto,
    lookup: async () => [torontoCandidate],
    onCandidates: (next) => choices.push(next),
    onLocation: (next) => locations.push(next),
    onStatus: (next) => statuses.push(next),
    ...overrides,
  });
  return { controller, locations, statuses, choices };
}

test("GPS commits before reverse resolves and preserves exact coordinates even if the label point differs", async () => {
  const reverse = deferred<GeographicLocation>();
  const h = harness({ reverse: () => reverse.promise });
  assert.equal(h.locations.length, 0);
  const pending = h.controller.device();
  await Promise.resolve();
  assert.equal(h.locations.length, 1);
  assert.equal(h.locations[0].lat, toronto.lat);
  assert.equal(h.statuses.at(-1)?.busy, "geo");
  reverse.resolve({ ...toronto, lat: 44, lon: -80 });
  await pending;
  assert.equal(h.locations.at(-1)?.label, toronto.label);
  assert.equal(h.locations.at(-1)?.lat, toronto.lat);
  assert.equal(h.statuses.at(-1)?.busy, null);
});

test("reverse failure retains coordinates and reports success; GPS failure leaves the old location alone", async () => {
  const h = harness({
    reverse: async () => {
      throw new Error("offline");
    },
  });
  await h.controller.device();
  assert.equal(h.locations.length, 1);
  assert.match(h.statuses.at(-1)?.message ?? "", /acquired/);
  const failed = harness({
    getCoordinates: async () => {
      throw new Error("Location request timed out");
    },
  });
  await failed.controller.device();
  assert.equal(failed.locations.length, 0);
  assert.match(failed.statuses.at(-1)?.error ?? "", /timed out/);
});

test("a newer manual choice wins over a delayed GPS callback", async () => {
  const gps = deferred<GeographicLocation>();
  const h = harness({ getCoordinates: () => gps.promise });
  const pending = h.controller.device();
  await h.controller.manual("Toronto, Ontario, Canada");
  h.controller.choose(torontoCandidate);
  gps.resolve({ ...toronto, lat: 49 });
  await pending;
  assert.equal(h.locations.length, 1);
  assert.equal(h.locations[0].source, "manual");
});

test("manual editing and unmount invalidate stale reverse and manual completions", async () => {
  const reverse = deferred<GeographicLocation>();
  const h = harness({ reverse: () => reverse.promise });
  const pending = h.controller.device();
  await Promise.resolve();
  h.controller.cancel();
  await h.controller.manual("Toronto, Canada");
  h.controller.choose(torontoCandidate);
  reverse.resolve({ ...toronto, label: "Stale GPS" });
  await pending;
  assert.equal(h.locations.at(-1)?.source, "manual");
  assert.notEqual(h.locations.at(-1)?.label, "Stale GPS");
  const lookup = deferred<LocationCandidate[]>();
  const unmounted = harness({ lookup: () => lookup.promise });
  const late = unmounted.controller.manual("Toronto");
  unmounted.controller.invalidate();
  lookup.resolve([torontoCandidate]);
  await late;
  assert.equal(unmounted.locations.length, 0);
  assert.equal(unmounted.statuses.length, 1);
});

test("manual no-result and invalid input retain active location and allow retry", async () => {
  let attempts = 0;
  const h = harness({
    lookup: async () => {
      if (++attempts === 1) throw new Error("Couldn't find that place");
      return [torontoCandidate];
    },
  });
  await h.controller.manual(" ");
  assert.equal(attempts, 0);
  assert.equal(h.locations.length, 0);
  await h.controller.manual("unknown");
  assert.equal(h.locations.length, 0);
  assert.match(h.statuses.at(-1)?.error ?? "", /Couldn't find/);
  await h.controller.manual("Toronto, Canada");
  h.controller.choose(torontoCandidate);
  assert.equal(h.locations[0].countryCode, "CA");
  assert.equal(h.statuses.at(-1)?.error, null);
});

test("combined control suppresses repeated GPS calls through reverse enrichment", async () => {
  const gps = deferred<GeographicLocation>();
  const reverse = deferred<GeographicLocation>();
  let calls = 0;
  const h = harness({
    getCoordinates: () => {
      calls++;
      return gps.promise;
    },
    reverse: () => reverse.promise,
  });
  const first = h.controller.device();
  await h.controller.device();
  assert.equal(calls, 1);
  gps.resolve(toronto);
  await Promise.resolve();
  await h.controller.device();
  assert.equal(calls, 1);
  assert.equal(h.locations[0].lat, toronto.lat);
  reverse.resolve(toronto);
  await first;
  await h.controller.device();
  assert.equal(calls, 2);
});

test("cancelling a pending GPS request permits retry without reviving stale callbacks", async () => {
  const old = deferred<GeographicLocation>();
  let calls = 0;
  const h = harness({ getCoordinates: async () => (++calls === 1 ? old.promise : toronto) });
  const pending = h.controller.device();
  h.controller.cancel();
  await h.controller.device();
  old.resolve({ ...toronto, lat: 49, label: "Stale" });
  await pending;
  assert.equal(calls, 2);
  assert.equal(h.locations.at(-1)?.lat, toronto.lat);
  assert.equal(h.locations.at(-1)?.label, toronto.label);
});


// D3: captured public Nominatim geography. County and municipality are distinct
// legitimate destinations; provider ranking must not decide the user's intent.
const bentonCounty = {
  osm_type: "relation", osm_id: 1818400, lat: "36.3456186", lon: "-94.2670404",
  addresstype: "county", name: "Benton County",
  display_name: "Benton County, Arkansas, United States",
  address: { county: "Benton County", state: "Arkansas", country: "United States", country_code: "us" },
};
const bentonTown = {
  osm_type: "relation", osm_id: 111083, lat: "34.5645372", lon: "-92.5868280",
  addresstype: "town", name: "Benton",
  display_name: "Benton, Saline County, Arkansas, 72015, United States",
  address: { town: "Benton", county: "Saline County", state: "Arkansas", postcode: "72015", country: "United States", country_code: "us" },
};

test("D3 county-first provider response preserves both full geographic choices", async (t) => {
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get("q"), "Benton, Arkansas, United States");
    assert.equal(url.searchParams.get("limit"), "5", "Request alternatives instead of silently accepting the first county");
    assert.equal(url.searchParams.has("countrycodes"), false);
    return Response.json([bentonCounty, bentonTown]);
  });
  const choices = await geocodeQuery("Benton, Arkansas, United States");
  assert.ok(Array.isArray(choices), "Manual lookup returns candidates, not an automatically chosen point");
  assert.equal(choices.length, 2);
  assert.equal(choices[0].label, bentonCounty.display_name);
  assert.equal(choices[0].placeType, "county");
  assert.equal(choices[1].label, bentonTown.display_name);
  assert.equal(choices[1].county, "Saline County");
  assert.equal(choices[1].postalCode, "72015");
  assert.equal(choices[1].placeType, "town");
  assert.equal(choices[1].id, "osm:relation:111083");
  assert.equal(choices[1].lat, 34.5645372);
});

test("D3 manual result cannot silently replace the active location", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json([bentonCounty, bentonTown]));
  const h = harness({ lookup: geocodeQuery });
  await h.controller.manual("Benton, Arkansas, United States");
  assert.equal(h.locations.length, 0, "Even one result is a proposed location until explicitly chosen");
});


test("D3 ranking, same-name geography and duplicate provider identities never auto-select", async (t) => {
  const response = t.mock.method(globalThis, "fetch", async () => Response.json([bentonTown, bentonCounty, bentonTown]));
  let candidates = await geocodeQuery("Benton, Arkansas, United States");
  assert.equal(candidates.length, 2, "Only duplicate OSM identity is removed");
  assert.equal(candidates[0].id, "osm:relation:111083");
  const h = harness({ lookup: async () => candidates });
  await h.controller.manual("Benton, Arkansas, United States");
  assert.equal(h.locations.length, 0);
  assert.deepEqual(h.choices.at(-1), candidates);
  h.controller.choose({ ...torontoCandidate, id: "not-a-returned-candidate" });
  assert.equal(h.locations.length, 0);
  h.controller.choose(candidates[0]);
  assert.equal(h.locations.length, 1);
  assert.equal(h.locations[0].lat, 34.5645372);
  assert.equal(h.locations[0].label, bentonTown.display_name);
  h.controller.choose(candidates[1]);
  assert.equal(h.locations.length, 1, "Old buttons cannot recommit after selection");
  response.mock.mockImplementation(async () => Response.json([bentonCounty]));
  candidates = await geocodeQuery("Benton County, Arkansas, United States");
  const county = harness({ lookup: async () => candidates });
  await county.controller.manual("Benton County, Arkansas, United States");
  assert.equal(county.locations.length, 0);
  county.controller.choose(candidates[0]);
  assert.equal(county.locations[0].lat, 36.3456186, "Explicit county intent remains usable");
});

test("D3 address, postcode, non-Latin geography and invalid hits remain distinct", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json([
    { lat: "34.5632068", lon: "-92.5882549", addresstype: "house", display_name: "111, South Market Street, Benton, Saline County, Arkansas, 72015, United States" },
    { lat: "34.5738199", lon: "-92.5981433", addresstype: "postcode", display_name: "72015, Benton, Saline County, Arkansas, United States" },
    { lat: "35.68", lon: "139.76", addresstype: "city", display_name: "東京都, 日本", address: { city: "東京都", country: "日本", country_code: "jp" } },
    { ...bentonTown, lat: "NaN" },
    { ...bentonCounty, lat: "91" },
  ]));
  const candidates = await geocodeQuery("東京都, 日本");
  assert.equal(candidates.length, 3);
  assert.match(candidates[0].label, /^111, South Market Street/);
  assert.equal(candidates[0].placeType, "house");
  assert.match(candidates[1].label, /^72015/);
  assert.notEqual(candidates[0].id, candidates[1].id);
  assert.equal(candidates[2].countryCode, "JP");
  assert.equal(candidates[2].label, "東京都, 日本");
});

test("D3 cancel, query editing, unmount and newer lookup invalidate every pending choice", async () => {
  for (const action of ["cancel", "invalidate"] as const) {
    const h = harness();
    await h.controller.manual("Toronto");
    h.controller[action]();
    h.controller.choose(torontoCandidate);
    assert.equal(h.locations.length, 0);
  }
  const old = deferred<LocationCandidate[]>();
  let calls = 0;
  const newer = { ...torontoCandidate, id: "newer", label: "Newer place", lat: 49 };
  const h = harness({ lookup: async () => ++calls === 1 ? old.promise : [newer] });
  const pending = h.controller.manual("Old query");
  await h.controller.manual("New query");
  old.resolve([torontoCandidate]);
  await pending;
  assert.deepEqual(h.choices.at(-1), [newer]);
  h.controller.choose(torontoCandidate);
  assert.equal(h.locations.length, 0);
  h.controller.choose(newer);
  assert.equal(h.locations[0].lat, 49);
});

test("D3 GPS supersedes a pending choice and late manual results; failed GPS retains old area", async () => {
  const h = harness();
  await h.controller.manual("Toronto");
  await h.controller.device();
  h.controller.choose(torontoCandidate);
  assert.equal(h.locations.length, 2);
  assert.ok(h.locations.every((item) => item.source === "geo"));
  assert.deepEqual(h.choices.at(-1), []);
  const late = deferred<LocationCandidate[]>();
  const inflight = harness({ lookup: () => late.promise });
  const pending = inflight.controller.manual("Toronto");
  await inflight.controller.device();
  late.resolve([torontoCandidate]);
  await pending;
  assert.deepEqual(inflight.choices.at(-1), []);
  assert.equal(inflight.locations.at(-1)?.source, "geo");
  const failed = harness({ getCoordinates: async () => { throw new Error("denied"); } });
  await failed.controller.manual("Toronto");
  await failed.controller.device();
  failed.controller.choose(torontoCandidate);
  assert.equal(failed.locations.length, 0);
  assert.deepEqual(failed.choices.at(-1), []);
});

test("D3 malformed, empty and failed lookups retain old location without selectable stale results", async () => {
  for (const results of [[], [{ ...torontoCandidate, lat: NaN }], [{ ...torontoCandidate, id: "" }]]) {
    const h = harness({ lookup: async () => results });
    await h.controller.manual("query");
    assert.equal(h.locations.length, 0);
    assert.deepEqual(h.choices.at(-1), []);
    assert.match(h.statuses.at(-1)?.error ?? "", /Couldn't find/);
  }
  const h = harness({ lookup: async () => { throw new Error("Location lookup timed out"); } });
  await h.controller.manual("query");
  assert.equal(h.locations.length, 0);
  assert.match(h.statuses.at(-1)?.error ?? "", /timed out/);
});


test("D3 an old displayed choice cannot select a newer result with the same OSM identity", async () => {
  const newer = { ...torontoCandidate, lat: 49, label: "Updated provider point" };
  let calls = 0;
  const h = harness({ lookup: async () => [++calls === 1 ? torontoCandidate : newer] });
  await h.controller.manual("first");
  await h.controller.manual("second");
  h.controller.choose(torontoCandidate);
  assert.equal(h.locations.length, 0);
  h.controller.choose(newer);
  assert.equal(h.locations[0].lat, 49);
});
