import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { eligibleChristmasChoices, pickChristmasChoice, pickChristmasOptions } =
  load("src/lib/date-night/christmas-picker.ts");
const { decorateDateNight } = load("src/lib/date-night/eligibility.ts");
const { JASPER_COUNTY_DATE_NIGHT_CATALOG } = load("src/lib/date-night/jasper-county-catalog.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { DEFAULT_LOCATION } = load("src/lib/restaurants/types.ts");
const park = JASPER_COUNTY_DATE_NIGHT_CATALOG.find(p => p.id === "date-night-schifferdecker-park-joplin");
assert.ok(park);
const clock = "2026-12-20T19:00:00-06:00";
const event = {
  overlayId: "christmas-2026/test-display",
  parentVenueId: park.id,
  association: "venue-wide",
  eventName: "Fixture Lights (NOT a real listing)",
  evidence: { status: "confirmed", operatorSources: ["https://example.invalid/fixture"],
    reviewRevision: "fixture-1", checkedOn: "2026-11-10", validThrough: "2026-12-31" },
  timeZone: "America/Chicago",
  occurrences: [{ date: "2026-12-20", hours: [{ opens: "18:00", closes: "20:00" }] }],
};
const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, openNowOnly: false };
const decorated = (venues = [park], iso = clock) =>
  decorateDateNight(venues, DEFAULT_LOCATION, new Date(iso));
const choices = (opts = {}) => {
  const iso = opts.iso ?? clock;
  return eligibleChristmasChoices(
    opts.venues ?? decorated([park], iso),
    { ...filters, ...opts.filters },
    opts.selected ?? ["anything"],
    opts.overlays ?? [event],
    new Date(iso),
    opts.preferences ?? {},
    opts.exclusions ?? [],
    opts.enabled ?? true,
  );
};

test("reviewed venue-wide display is one canonical Christmas choice without mutating the park", () => {
  const original = structuredClone(park);
  const items = choices();
  assert.equal(items.length, 1);
  const [item] = items;
  assert.equal(item.venue.id, park.id);
  assert.equal(item.venue.name, park.name);
  assert.deepEqual(item.venue.activityTypes, ["park"]);
  assert.equal(item.presentation.overlayApplied, true);
  assert.equal(item.presentation.displayName, event.eventName);
  assert.deepEqual(item.categories, ["christmas-lights"]);
  assert.deepEqual(park, original);
  const duplicate = choices({ venues: [item.venue, item.venue] });
  assert.equal(duplicate.length, 1);
});

test("off-season, unverified and opted-out Christmas return ordinary Park category", () => {
  for (const opts of [
    { iso: "2026-11-26T19:00:00-06:00" },
    { iso: "2027-01-01T00:00:00-06:00" },
    { enabled: false },
    { overlays: [{ ...event, evidence: { ...event.evidence, status: "unconfirmed" } }] },
    { overlays: [{ ...event, association: "linked-event" }] },
    { overlays: [event, { ...event, overlayId: "christmas-2026/conflict" }] },
  ]) {
    const [item] = choices(opts);
    assert.deepEqual(item.categories, ["park"]);
    assert.equal(item.presentation.overlayApplied, false);
    assert.equal(item.venue.id, park.id);
  }
});

test("effective category filter never leaks parent Park category into active Lights result", () => {
  assert.equal(choices({ selected: ["park"] }).length, 0);
  assert.equal(choices({ selected: ["christmas-lights"] }).length, 1);
  assert.equal(choices({ selected: ["christmas-lights"], enabled: false }).length, 0);
  assert.equal(choices({ selected: ["park"], enabled: false }).length, 1);
  assert.equal(choices({ selected: ["movies"] }).length, 0);
});

test("Open now applies verified event admission, never ordinary park hours", () => {
  const fullDay = decorated([{ ...park, openingHours: "24/7" }]);
  assert.equal(choices({ venues: fullDay, filters: { openNowOnly: true } }).length, 1);
  assert.equal(choices({ venues: fullDay, iso: "2026-12-20T17:00:00-06:00",
    filters: { openNowOnly: true } }).length, 0);
  assert.equal(choices({ venues: fullDay, overlays: [{ ...event, occurrences: [
    { date: "2026-12-20", hours: null },
  ] }], filters: { openNowOnly: true } }).length, 0);
  const closedPark = decorated([{ ...park, openingHours: "Mo-Su 00:00-00:01" }]);
  assert.equal(choices({ venues: closedPark, filters: { openNowOnly: true } }).length, 1);
});

test("ordinary eligibility still honors canonical favorite, exclusion, radius and never-recommend", () => {
  const pref = { [park.id]: { favorite: true, neverRecommend: false } };
  assert.equal(choices({ filters: { favoritesOnly: true }, preferences: pref }).length, 1);
  assert.equal(choices({ filters: { favoritesOnly: true } }).length, 0);
  assert.equal(choices({ preferences: { [park.id]: { ...pref[park.id], neverRecommend: true } } }).length, 0);
  assert.equal(choices({ exclusions: [{ restaurantId: park.id, expiresAt: new Date(clock).getTime() + 60000 }] }).length, 0);
  assert.equal(choices({ filters: { radiusMiles: 1 } }).length, 0);
  assert.deepEqual(Object.keys(pref), [park.id]);
});

test("category-first picker preserves Fewer Parks while giving verified lights full weight", () => {
  const parkChoice = choices({ enabled: false })[0];
  const lightsChoice = choices()[0];
  const other = { ...lightsChoice, venue: { ...lightsChoice.venue, id: "date-night-other-fixture" },
    presentation: { ...lightsChoice.presentation, baseVenueId: "date-night-other-fixture" } };
  const exact = [parkChoice, other];
  const none = () => 0;
  assert.equal(pickChristmasChoice(exact, { mood: 50, reduceParks: true }, [], null, none).venue.id, park.id);
  const nearOne = () => 0.9;
  assert.equal(pickChristmasChoice(exact, { mood: 50, reduceParks: true }, [], null, nearOne).venue.id, other.venue.id);
  assert.equal(pickChristmasChoice([], filters), null);
  assert.equal(pickChristmasChoice([lightsChoice], filters).venue.id, park.id);
});

test("Four Options maintains unique IDs, effective categories and stable inputs", () => {
  const originals = choices();
  const make = (id, category) => ({
    venue: { ...originals[0].venue, id },
    presentation: { ...originals[0].presentation, baseVenueId: id },
    categories: [category],
  });
  const input = [make("a", "christmas-lights"), make("b", "movies"), make("c", "park"),
    make("d", "arcade"), make("e", "park")];
  const output = pickChristmasOptions(input, filters, [], 4, () => 0.4);
  assert.equal(output.length, 4);
  assert.equal(new Set(output.map(x => x.venue.id)).size, 4);
  assert.equal(new Set(output.flatMap(x => x.categories)).size, 4);
  assert.deepEqual(input.map(x => x.venue.id), ["a", "b", "c", "d", "e"]);
  assert.deepEqual(pickChristmasOptions([], filters), []);
  assert.deepEqual(pickChristmasOptions(input, filters, [], 0), []);
});
