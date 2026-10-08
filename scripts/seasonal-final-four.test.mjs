import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_FINAL_FOUR_CATALOG } =
  load("src/lib/date-night/missouri-2026-final-four-catalog.ts");
const { SEASONAL_PRESENTATIONS } =
  load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { getCuratedSeasonalPlace } =
  load("src/lib/date-night/curated-policy.ts");

const expected = ["MO26-012","MO26-028","MO26-074","MO26-084"];

test("final four contains only the independently cleared immediate subset", () => {
  assert.deepEqual(
    MISSOURI_2026_FINAL_FOUR_CATALOG.map((x) => x.seasonalListing.recordId).sort(),
    [...expected].sort(),
  );
  assert.equal(MISSOURI_2026_FINAL_FOUR_CATALOG.some((x) => x.seasonalListing.recordId === "MO26-013"), false);
  assert.equal(MISSOURI_2026_FINAL_FOUR_CATALOG.some((x) => x.seasonalListing.recordId === "MO26-085"), false);
});

test("final four are current policy for cached/saved identities", () => {
  for (const place of MISSOURI_2026_FINAL_FOUR_CATALOG)
    assert.equal(getCuratedSeasonalPlace(place.id)?.id, place.id);
});

test("all final-four records use Other only and fail closed for Open Now", () => {
  for (const place of MISSOURI_2026_FINAL_FOUR_CATALOG) {
    assert.deepEqual(place.activityTypes, ["other-halloween-fall"]);
    assert.equal(place.openingHours, null);
    assert.equal(place.seasonalAvailability.openNowPolicy, "never");
    assert.equal(place.seasonalAvailability.seasonYear, 2026);
    assert.equal(place.seasonalListing.seasonYear, 2026);
    assert.equal(place.seasonalListing.directionsTarget.kind, "visitor-address");
    assert.equal(place.seasonalListing.placement.basis, "address-geocode");
    assert.match(place.seasonalListing.reviewRevision, /final-four/);
  }
});

test("uncertain admission and McWilliams category limits remain explicit", () => {
  assert.match(SEASONAL_PRESENTATIONS["MO26-012"].details.join(" "), /not fully confirmed/i);
  assert.match(SEASONAL_PRESENTATIONS["MO26-028"].details.join(" "), /not confirmed/i);
  assert.match(SEASONAL_PRESENTATIONS["MO26-074"].details.join(" "), /does not state an admission price/i);
  assert.match(SEASONAL_PRESENTATIONS["MO26-084"].details.join(" "), /Other Halloween \/ Fall/i);
  assert.match(SEASONAL_PRESENTATIONS["MO26-084"].details.join(" "), /not presented as guaranteed current features/i);
});

test("short-lived October 10 records expire at their sourced event ends", () => {
  const by = Object.fromEntries(MISSOURI_2026_FINAL_FOUR_CATALOG.map((x) => [x.seasonalListing.recordId, x]));
  assert.equal(by["MO26-012"].seasonalListing.listingExpiresAt, "2026-10-10T22:00:00-05:00");
  assert.equal(by["MO26-028"].seasonalListing.listingExpiresAt, "2026-10-10T14:00:00-05:00");
  assert.equal(by["MO26-074"].seasonalListing.listingExpiresAt, "2026-10-10T17:00:00-05:00");
  assert.equal(by["MO26-084"].seasonalListing.listingExpiresAt, "2026-10-31T17:00:00-05:00");
});
