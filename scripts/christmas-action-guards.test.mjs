import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const ordinary = { id: "ordinary-park", name: "Ordinary park", lat: 37.17, lon: -94.31, address: "305 West Chestnut Street" };

test("event markers and edition identities cannot inherit host navigation or rideshare dropoffs", () => {
  for (const guard of [
    { dateNightEvent: {} }, { dateNightEvent: null }, { dateNightEventUnavailable: true },
    { id: "date-night-event-christmas-2026-olde-world-market" },
    { id: undefined, restaurantId: "date-night-event-christmas-2026-newcaps-craft-fair" },
    { id: "legacy-visit-id", restaurantId: "date-night-event-christmas-2026-newcaps-craft-fair" },
  ]) {
    const place = { ...ordinary, ...guard, seasonalListing: { directionsTarget: { kind: "verified-point", lat: 37, lon: -94, description: "Unrelated host entrance" } } };
    assert.equal(directionsUrl(place), null);
    assert.equal(uberRideTarget(place).url, "https://m.uber.com/");
  }
});

test("ordinary and reviewed Halloween navigation remain unchanged", () => {
  assert.match(directionsUrl(ordinary), /destination=37.17%2C-94.31/);
  assert.equal(new URL(uberRideTarget(ordinary).url).searchParams.get("dropoff[latitude]"), "37.17");
  const halloween = { ...ordinary, seasonalListing: { directionsTarget: { kind: "visitor-address", address: "Reviewed Halloween visitor gate" } } };
  assert.match(directionsUrl(halloween), /Reviewed%20Halloween%20visitor%20gate/);
  assert.equal(uberRideTarget(halloween).url, "https://m.uber.com/");
});
