import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_DEFERRED_BATCH_3_CATALOG } =
  load("src/lib/date-night/missouri-2026-deferred-batch-3-catalog.ts");
const { SEASONAL_PRESENTATIONS } =
  load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { decorateDateNight, eligibleDateNight } =
  load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } =
  load("src/lib/date-night/types.ts");

const ids = [
  "date-night-mo26-036-monster-corn-maze",
  "date-night-mo26-058-beast",
  "date-night-mo26-069-dead-factory",
  "date-night-mo26-071-pomme-de-terror",
  "date-night-mo26-118-haunted-hall-horror",
];

test("deferred batch 3 contains exactly the five independently cleared records", () => {
  assert.equal(MISSOURI_2026_DEFERRED_BATCH_3_CATALOG.length, 5);
  assert.deepEqual(MISSOURI_2026_DEFERRED_BATCH_3_CATALOG.map((x) => x.id).sort(), [...ids].sort());
  assert.ok(!MISSOURI_2026_DEFERRED_BATCH_3_CATALOG.some((x) => x.seasonalListing?.recordId === "MO26-084"));
});

test("batch 3 preserves routing and precision contracts", () => {
  const by = Object.fromEntries(MISSOURI_2026_DEFERRED_BATCH_3_CATALOG.map((x) => [x.seasonalListing.recordId, x]));
  assert.deepEqual(by["MO26-036"].seasonalListing.directionsTarget,
    { kind: "visitor-address", address: "711 State Route AM, Cabool, MO 65689" });
  assert.deepEqual(by["MO26-058"].seasonalListing.directionsTarget,
    { kind: "visitor-address", address: "1300 W 13th St, Kansas City, MO 64102" });
  assert.equal(by["MO26-058"].seasonalListing.placement.basis, "address-geocode");
  assert.equal(by["MO26-071"].seasonalListing.placement.basis, "verified-arrival");
  assert.deepEqual(by["MO26-071"].seasonalListing.directionsTarget,
    { kind: "verified-point", lat: 37.883074, lon: -93.303521,
      description: "Hermitage Area Campground event location" });
  assert.equal(by["MO26-069"].seasonalListing.placement.basis, "address-geocode");
  assert.equal(by["MO26-118"].seasonalListing.placement.basis, "address-geocode");
});

test("batch 3 remains never-OpenNow and 2026-only", () => {
  for (const place of MISSOURI_2026_DEFERRED_BATCH_3_CATALOG) {
    assert.equal(place.seasonalAvailability.openNowPolicy, "never");
    assert.equal(place.seasonalAvailability.seasonYear, 2026);
    assert.equal(place.openingHours, null);
    assert.equal(place.seasonalListing.seasonYear, 2026);
    assert.match(place.seasonalListing.reviewRevision, /batch3/);
  }
});

test("all five have explicit reviewed presentation and material warnings", () => {
  for (const place of MISSOURI_2026_DEFERRED_BATCH_3_CATALOG) {
    const record = place.seasonalListing.recordId;
    const presentation = SEASONAL_PRESENTATIONS[record];
    assert.ok(presentation, record);
    assert.equal(presentation.canonicalId, place.id);
    assert.ok(presentation.details.length >= 4, record);
  }
  assert.match(SEASONAL_PRESENTATIONS["MO26-058"].details.join(" "), /Waiver Station/);
  assert.match(SEASONAL_PRESENTATIONS["MO26-118"].details.join(" "), /ages 4 and under/i);
});

test("Open Now excludes every new curated record while ordinary browse retains active-season records", () => {
  const origin = { lat: 38.2, lon: -92.8, label: "Missouri", source: "manual" };
  const at = new Date("2026-10-16T20:00:00-05:00");
  const decorated = decorateDateNight(MISSOURI_2026_DEFERRED_BATCH_3_CATALOG, origin, at);
  const broad = eligibleDateNight(decorated,
    { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes: ["anything"], openNowOnly: false },
    true, {}, [], at.getTime());
  const open = eligibleDateNight(decorated,
    { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, activityTypes: ["anything"], openNowOnly: true },
    true, {}, [], at.getTime());
  assert.equal(open.length, 0);
  assert.ok(broad.every((place) => place.availability.openNowEligible === false));
});
