import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { MISSOURI_2026_LATE_FALL_CATALOG } =
  load("src/lib/date-night/missouri-2026-late-fall-catalog.ts");
const { decorateDateNight, eligibleDateNight } =
  load("src/lib/date-night/eligibility.ts");
const { isHalloweenDateNightSeason, dateNightChipsForNow } =
  load("src/lib/date-night/season.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } =
  load("src/lib/date-night/types.ts");
const { getCuratedSeasonalPlace } =
  load("src/lib/date-night/curated-policy.ts");

const brookdale = MISSOURI_2026_LATE_FALL_CATALOG[0];
const origin = { lat: 38.465355, lon: -90.616517, label: "Eureka, MO", source: "manual" };

test("Brookdale is the sole lifecycle-visible late-fall record", () => {
  assert.equal(MISSOURI_2026_LATE_FALL_CATALOG.length, 1);
  assert.equal(brookdale.seasonalListing.recordId, "MO26-085");
  assert.equal(brookdale.seasonalListing.visibility, "listing-lifecycle");
  assert.deepEqual(brookdale.activityTypes, ["corn-maze", "pumpkin-patch"]);
  assert.equal(getCuratedSeasonalPlace(brookdale.id)?.id, brookdale.id);
});

test("Halloween UI and live-provider season still end November 2", () => {
  const nov5 = new Date("2026-11-05T12:00:00-06:00");
  assert.equal(isHalloweenDateNightSeason(nov5), false);
  const chips = dateNightChipsForNow(true, nov5).map((chip) => chip.id);
  assert.equal(chips.includes("haunted-house"), false);
  assert.equal(chips.includes("corn-maze"), false);
  assert.equal(chips.includes("pumpkin-patch"), false);
  assert.equal(chips.includes("other-halloween-fall"), false);
});

test("Brookdale remains browseable through Anything after Halloween UI ends", () => {
  const nov5 = new Date("2026-11-05T12:00:00-06:00");
  const decorated = decorateDateNight([brookdale], origin, nov5);
  const eligible = eligibleDateNight(
    decorated,
    { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15, activityTypes: ["anything"], openNowOnly: false },
    false,
    {},
    [],
    nov5.getTime(),
  );
  assert.deepEqual(eligible.map((place) => place.id), [brookdale.id]);
  assert.equal(eligible[0].availability.openNowEligible, false);
});

test("ordinary seasonal records do not inherit Brookdale's post-window visibility", () => {
  const nov5 = new Date("2026-11-05T12:00:00-06:00");
  const ordinarySeasonal = {
    ...brookdale,
    id: "control-seasonal",
    seasonalListing: { ...brookdale.seasonalListing, recordId: "CONTROL", visibility: undefined },
  };
  const decorated = decorateDateNight([ordinarySeasonal], origin, nov5);
  const eligible = eligibleDateNight(
    decorated,
    { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15, activityTypes: ["anything"], openNowOnly: false },
    false,
    {},
    [],
    nov5.getTime(),
  );
  assert.equal(eligible.length, 0);
});

test("Brookdale expires after its verified 2026 lifecycle", () => {
  const nov9 = new Date("2026-11-09T06:00:01-06:00");
  const decorated = decorateDateNight([brookdale], origin, nov9);
  const eligible = eligibleDateNight(
    decorated,
    { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15, activityTypes: ["anything"], openNowOnly: false },
    false,
    {},
    [],
    nov9.getTime(),
  );
  assert.equal(eligible.length, 0);
  assert.equal(decorated[0].availability.status, "finished-season");
});
