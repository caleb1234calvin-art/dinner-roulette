import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_DEFERRED_BATCH_3_CATALOG: batch } = load("src/lib/date-night/missouri-2026-deferred-batch-3-catalog.ts");
const { MISSOURI_2026_CLEARED_SEASONAL_CATALOG: prior } = load("src/lib/date-night/missouri-2026-cleared-catalog.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { applyCuratedSeasonalPolicy } = load("src/lib/date-night/curated-policy.ts");
const pomme = batch.find(row => row.seasonalListing.recordId === "MO26-071");
const sam = prior.find(row => row.seasonalListing.recordId === "MO26-116");

test("Pomme's official event point supports Directions, never a precise ride dropoff", () => {
  assert.equal(pomme.seasonalListing.ridesharePolicy, "external-picker");
  assert.equal(new URL(directionsUrl(pomme)).searchParams.get("destination"), "37.883074,-93.303521");
  assert.deepEqual(uberRideTarget(pomme), { url: "https://m.uber.com/", ariaLabel: "Open Uber; choose your destination in the external service" });
});

test("stale Pomme snapshots regain the conservative current rideshare policy", () => {
  const stale = structuredClone(pomme);
  delete stale.seasonalListing.ridesharePolicy;
  stale.lat = 0; stale.lon = 0;
  const restored = applyCuratedSeasonalPolicy(stale);
  assert.equal(uberRideTarget(restored).url, "https://m.uber.com/");
  assert.equal(new URL(directionsUrl(restored)).searchParams.get("destination"), "37.883074,-93.303521");
});

test("Sam retains its independently reviewed parking point navigation behavior", () => {
  const target = sam.seasonalListing.directionsTarget;
  assert.equal(target.kind, "verified-point");
  const url = new URL(uberRideTarget(sam).url);
  assert.equal(url.pathname, "/looking");
  assert.equal(url.searchParams.get("dropoff[latitude]"), String(target.lat));
  assert.equal(url.searchParams.get("dropoff[longitude]"), String(target.lon));
  assert.equal(new URL(directionsUrl(sam)).searchParams.get("destination"), `${target.lat},${target.lon}`);
});
