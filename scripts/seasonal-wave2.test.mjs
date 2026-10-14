import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const frozen = JSON.parse(readFileSync("audit/halloween-wave2-2026-10-14/ADAPTED-TEN-FROZEN-INPUTS.json", "utf8"));
const load = appModuleLoader();
const { WAVE2_2026_LISTINGS: inputs, WAVE2_2026_CATALOG: rows } = load("src/lib/date-night/halloween-2026-wave2-catalog.ts");
const { getCuratedSeasonalPlace, applyCuratedSeasonalPolicy } = load("src/lib/date-night/curated-policy.ts");
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const plain = value => JSON.parse(JSON.stringify(value));
const date = new Date("2026-10-21T12:00:00-05:00");

test("Wave 2 exact ten preserve adapted researched source and explicit presentations", () => {
  assert.equal(frozen.releasedBase, "0344ccce79ce157196ff9e84b1aaf3e40802afc5");
  assert.equal(inputs.length, 10);
  assert.equal(rows.length, 10);
  assert.deepEqual(plain(inputs), frozen.records);
  assert.deepEqual(rows.map(row => row.id), frozen.identityOrder);
  assert.equal(new Set(rows.map(row => row.id)).size, 10);
  assert.equal(new Set(rows.map(row => row.seasonalListing.recordId)).size, 10);
  for (const row of rows) {
    assert.equal(row.openingHours, null);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.seasonalAvailability.seasonYear, 2026);
    assert.equal(row.seasonalListing.timeZone, "America/Chicago");
    assert.equal(row.seasonalListing.directionsTarget.address, row.address);
    assert.ok(Number.isFinite(row.lat) && Number.isFinite(row.lon));
    assert.equal(getCuratedSeasonalPlace(row.id), row);
    assert.equal(applyCuratedSeasonalPolicy({ ...row, openingHours: "24/7" }).openingHours, null);
    assert.deepEqual(plain(SEASONAL_PRESENTATIONS[row.seasonalListing.recordId]), frozen.presentations[row.seasonalListing.recordId]);
  }
});

test("Wave 2 never claims Open Now, revives expired/2027 entries or leaks in seasonal OFF", () => {
  for (const row of rows) {
    const eligible = (now, filters = {}, seasonal = true) =>
      eligibleDateNight(
        decorateDateNight([row], row, now),
        { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, openNowOnly: false, activityTypes: ["anything"], ...filters },
        seasonal, {}, [], now.getTime(),
      );
    assert.equal(eligible(date).length, 1, row.id);
    assert.equal(eligible(date, { openNowOnly: true }).length, 0, row.id);
    const cutoff = Date.parse(row.seasonalListing.listingExpiresAt);
    assert.ok(Number.isFinite(cutoff));
    assert.equal(eligible(new Date(cutoff - 1)).length, 1, row.id);
    assert.equal(eligible(new Date(cutoff)).length, 0, row.id);
    assert.equal(eligible(new Date(cutoff + 1)).length, 0, row.id);
    assert.equal(eligible(new Date("2027-10-21T12:00:00-05:00")).length, 0, row.id);
    const explicitlyScoped = row.seasonalListing.visibility === "listing-lifecycle";
    assert.equal(eligible(date, {}, false).length, explicitlyScoped ? 1 : 0,
      row.id + ": preserve source-backed listing-lifecycle visibility only when explicitly scoped");
    assert.equal(eligible(date, { openNowOnly: true }, false).length, 0, row.id);
  }
});
