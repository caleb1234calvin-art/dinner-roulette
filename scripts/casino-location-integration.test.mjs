import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { lookupLocation, lookupReverseLocation } = load("src/lib/restaurants/search.ts");
const { searchNightlife } = load("src/lib/nightlife/search.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { haversineMiles } = load("src/lib/restaurants/geo.ts");
const evidence = JSON.parse(fs.readFileSync("audit/casino-freeze-live-provider-findings-2026-09-13.json", "utf8"));

// Exercise the combined geocoder -> current server handler -> exact Maps path,
// including the captured live aliases that predate the location source branch.
test("global manual origins retain final-pass casino identities and routing through actual discovery handlers", async (t) => {
  let origin;
  t.mock.method(globalThis, "fetch", async (input) => {
    if (String(input).includes("nominatim")) return Response.json([{
      lat: String(origin.lat), lon: String(origin.lon),
      address: { city: origin.name, state: origin.state, country: "United States", country_code: "us" },
    }]);
    return Response.json({ elements: evidence.providerCasinos.filter(row => haversineMiles(origin.lat, origin.lon, row.lat, row.lon) <= 16) });
  });
  for (origin of [
    { name: "Pahrump", state: "Nevada", lat: 36.208, lon: -115.983, count: 5, target: "casino-catalog-nv-terribles-pahrump" },
    { name: "Pawnee", state: "Oklahoma", lat: 36.338, lon: -96.804, count: 2, target: "casino-catalog-ok-pawnee-trading-post" },
  ]) {
    const location = await lookupLocation({ data: { query: `${origin.name}, ${origin.state}, USA` } });
    assert.equal(location.countryCode, "US");
    const result = await searchNightlife({ data: { ...location, radiusMiles: 10 } });
    assert.equal(result.venues.length, origin.count);
    assert.equal(new Set(result.venues.map(row => row.id)).size, origin.count);
    const target = result.venues.find(row => row.id === origin.target);
    assert.ok(target, "Pass 59/60 destination must be registered in the compiled search");
    assert.equal(target.source, "merged", "Captured provider alias must reconcile into its canonical identity");
    assert.equal(new URL(directionsUrl(target)).searchParams.get("destination"), `${target.lat},${target.lon}`);
    assert.ok(!result.venues.some(row => /Gold Town|Kaw Southwind/.test(row.name)));
  }
});

test("switching a casino origin internationally keeps bounded closures local and preserves exact GPS coordinates", async (t) => {
  const point = { lat: 43.65348, lon: -79.38393 };
  t.mock.method(globalThis, "fetch", async (input) => {
    if (String(input).includes("nominatim")) return Response.json({
      lat: "44", lon: "-80", address: { city: "Toronto", state: "Ontario", country: "Canada", country_code: "ca" },
    });
    return Response.json({ elements: [{ type: "node", id: 900000777, ...point, tags: {
      name: "Gold Town Casino", amenity: "casino", "addr:province": "Ontario", "addr:country": "CA",
    } }] });
  });
  const location = await lookupReverseLocation({ data: point });
  assert.equal(location.lat, point.lat);
  assert.equal(location.lon, point.lon);
  assert.equal(location.countryCode, "CA");
  const result = await searchNightlife({ data: { ...location, radiusMiles: 10 } });
  assert.equal(result.source, "live");
  assert.equal(result.venues.length, 1, "U.S. frozen catalog cannot become the international fallback");
  assert.equal(result.venues[0].name, "Gold Town Casino", "The Pahrump closure must remain geographically bounded");
  assert.equal(result.venues[0].address, "Ontario, CA");
  assert.equal(new URL(directionsUrl(result.venues[0])).searchParams.get("destination"), `${point.lat},${point.lon}`);
});

test("incomplete provider replies retain honest casino fallback and international errors while valid empty replies stay empty", async (t) => {
  const response = t.mock.method(globalThis, "fetch", async () => Response.json({ elements: [], remark: "runtime error: timeout" }));
  const us = { lat: 36.338, lon: -96.804, radiusMiles: 10 };
  const canada = { lat: 43.65348, lon: -79.38393, radiusMiles: 10 };
  const fallback = await searchNightlife({ data: us });
  assert.equal(fallback.source, "fallback");
  assert.equal(fallback.venues.length, 2, "Pawnee final-pass pool survives provider failure");
  assert.ok(fallback.warning);
  await assert.rejects(searchNightlife({ data: canada }), /incomplete response/);
  response.mock.mockImplementation(async () => Response.json({ elements: [] }));
  const empty = await searchNightlife({ data: canada });
  assert.equal(empty.source, "live");
  assert.deepEqual(empty.venues, []);
  assert.equal(empty.warning, undefined);
});
