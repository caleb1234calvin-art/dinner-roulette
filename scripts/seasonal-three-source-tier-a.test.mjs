import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG } =
  load("src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts");
const { SEASONAL_PRESENTATIONS } =
  load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { getCuratedSeasonalPlace } =
  load("src/lib/date-night/curated-policy.ts");
const { decorateDateNight, eligibleDateNight } =
  load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } =
  load("src/lib/date-night/types.ts");

const ids = MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG.map((place) => place.id);

test("Tier A runtime catalog contains exactly five placement-ready records", () => {
  assert.equal(MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG.length, 5);
  assert.equal(ids.some((id) => id.includes("hell-harvest")), false);
  assert.equal(ids.some((id) => id.includes("labyrinth")), false);
  assert.equal(ids.some((id) => id.includes("rising")), false);
});

test("all Tier A records are current curated cache policy", () => {
  for (const place of MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG)
    assert.equal(getCuratedSeasonalPlace(place.id)?.id, place.id);
});

test("Edge of Hell uses waiver-station Directions, not attraction placement", () => {
  const edge = MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG.find((p) => p.name.startsWith("Edge of Hell"));
  assert.equal(edge.seasonalListing.placement.basis, "address-geocode");
  assert.deepEqual(edge.seasonalListing.directionsTarget,
    { kind: "visitor-address", address: "1300 W 13th St, Kansas City, MO 64102" });
  assert.notEqual(edge.seasonalListing.visitorAddress, edge.seasonalListing.directionsTarget.address);
});

test("late-season Tier A records alone carry listing-lifecycle visibility", () => {
  const late = MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG
    .filter((p) => p.seasonalListing.visibility === "listing-lifecycle")
    .map((p) => p.name)
    .sort();
  assert.deepEqual(late, ["Creepyworld", "The Darkness"]);
});

test("all five remain never-OpenNow and 2026-only", () => {
  for (const place of MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG) {
    assert.equal(place.openingHours, null);
    assert.equal(place.seasonalAvailability.openNowPolicy, "never");
    assert.equal(place.seasonalAvailability.seasonYear, 2026);
    assert.equal(place.seasonalListing.seasonYear, 2026);
    assert.ok(SEASONAL_PRESENTATIONS[place.seasonalListing.recordId]);
  }
});

test("explicit-date subset records do not infer unverified recurrence", () => {
  const river = MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG.find((p) => p.name.includes("Haunted River Float"));
  assert.deepEqual(river.seasonalAvailability.activeDates,
    ["2026-09-19","2026-10-03","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24","2026-10-30","2026-10-31"]);
  const timber = MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG.find((p) => p.name.startsWith("Fear the Bloody Timber"));
  assert.deepEqual(timber.seasonalAvailability.activeDates,
    ["2026-10-09","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24"]);
});

test("Open Now excludes all Tier A curated records", () => {
  const origin = { lat: 38.5, lon: -92.5, label: "Missouri", source: "manual" };
  const at = new Date("2026-10-16T20:00:00-05:00");
  const decorated = decorateDateNight(MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG, origin, at);
  const open = eligibleDateNight(
    decorated,
    { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes: ["anything"], openNowOnly: true },
    true, {}, [], at.getTime(),
  );
  assert.equal(open.length, 0);
});
