import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { buildChristmasPilotCandidate } = load("src/lib/date-night/christmas-pilot.ts");
const { CHRISTMAS_2026_PILOT } = load("src/lib/date-night/christmas-pilot-catalog.ts");
const { christmasSessionAvailability, chicagoEventClock } = load("src/lib/date-night/christmas-pilot-model.ts");
const { isChristmasAppWindow, dateNightCategoryWeight } = load("src/lib/date-night/christmas-overlay.ts");
const { pickChristmasChoice, pickChristmasOptions } = load("src/lib/date-night/christmas-picker.ts");
const { decorateDateNight } = load("src/lib/date-night/eligibility.ts");
const { JASPER_COUNTY_DATE_NIGHT_CATALOG } = load("src/lib/date-night/jasper-county-catalog.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { DEFAULT_LOCATION } = load("src/lib/restaurants/types.ts");
const prototypePark = JASPER_COUNTY_DATE_NIGHT_CATALOG.find(place => place.id === "date-night-schifferdecker-park-joplin");
assert.ok(prototypePark);

// These IDs/coordinates are synthetic test bindings, never researched real IDs.
const fixtureIds = {
  "C26-001": "fixture-canonical-park",
  "C26-005": "fixture-canonical-church",
  "C26-010": "fixture-canonical-school",
  "C26-007": "fixture-canonical-square",
};
const bindings = Object.entries(fixtureIds).map(([researchId, canonicalVenueId]) => ({
  researchId, canonicalVenueId, reviewUrl: "https://example.invalid/test-only-identity-review",
}));
const fixtures = Object.entries(fixtureIds).map(([researchId, id]) => ({
  ...prototypePark, id, name: `Synthetic permanent host ${researchId}`,
  activityTypes: researchId === "C26-001" ? ["park"] : [],
  openingHours: "24/7", website: "https://example.invalid/test-only-host",
}));
const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, openNowOnly: false };
const at = iso => new Date(iso);
const event = id => CHRISTMAS_2026_PILOT.find(item => item.researchId === id);
const state = (id, iso) => christmasSessionAvailability(event(id), at(iso));
function candidate(iso = "2026-12-05T10:00:00-06:00", extra = {}) {
  return buildChristmasPilotCandidate({
    venues: decorateDateNight(fixtures, DEFAULT_LOCATION, at(iso)),
    bindings,
    filters: { ...filters, ...extra.filters },
    selectedCategories: ["anything"],
    homeMode: "date-night",
    ...extra,
    now: at(iso),
  });
}
const events = result => result.choices.filter(choice => choice.presentation.kind === "christmas-event");
const ids = result => events(result).map(choice => choice.presentation.eventId);
function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  }
  return value;
}

test("pilot includes only the four reviewed records with source-scoped provenance", () => {
  assert.deepEqual(CHRISTMAS_2026_PILOT.map(item => item.researchId).sort(), ["C26-001", "C26-005", "C26-007", "C26-010"]);
  for (const attraction of CHRISTMAS_2026_PILOT) {
    assert.equal(attraction.evidence.verdict, "VERIFIED");
    assert.equal(attraction.evidence.checkedOn, "2026-11-11");
    assert.match(attraction.evidence.reviewUrl, /issues\/93#issuecomment-/);
    assert.ok(attraction.evidence.sources.length >= 2);
    assert.ok(attraction.evidence.sources.every(source => source.url.startsWith("https://") && source.supports.length));
    assert.equal("canonicalVenueId" in attraction, false);
    assert.equal("lat" in attraction.venue, false);
    assert.equal("lon" in attraction.venue, false);
    assert.ok(attraction.unknowns.length);
  }
});

test("Chicago app calendar is independent of actual Sparkle dates and host timezone", () => {
  const previous = process.env.TZ;
  try {
    for (const tz of ["UTC", "America/Los_Angeles", "Asia/Tokyo"]) {
      process.env.TZ = tz;
      assert.equal(isChristmasAppWindow(at("2026-11-27T05:59:59.999Z")), false, tz);
      assert.equal(isChristmasAppWindow(at("2026-11-27T06:00:00Z")), true, tz);
      assert.equal(isChristmasAppWindow(at("2027-01-01T05:59:59.999Z")), true, tz);
      assert.equal(isChristmasAppWindow(at("2027-01-01T06:00:00Z")), false, tz);
      assert.deepEqual(chicagoEventClock(at("2026-12-05T05:59:59Z")), { day: "2026-12-04", time: "23:59" }, tz);
      assert.deepEqual(ids(candidate("2026-11-27T05:59:59.999Z")), [], tz);
      assert.deepEqual(ids(candidate("2026-11-27T06:00:00Z")), ["C26-001"], tz);
      assert.deepEqual(ids(candidate("2027-01-01T05:59:59.999Z")), ["C26-001"], tz);
      assert.deepEqual(ids(candidate("2027-01-01T06:00:00Z")), [], tz);
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
  assert.equal(state("C26-001", "2026-11-26T18:00:00-06:00").openNowEligible, true);
  assert.equal(state("C26-001", "2027-01-01T18:00:00-06:00").openNowEligible, true);
  assert.deepEqual(ids(candidate("2026-11-26T18:00:00-06:00")), []);
  assert.deepEqual(ids(candidate("2027-01-01T18:00:00-06:00")), []);
  assert.deepEqual(ids(candidate("2027-12-05T10:00:00-06:00")), []);
});

test("Sparkle uses its 17:00 to midnight hours without borrowing parent park hours", () => {
  for (const [iso, open] of [
    ["2026-11-27T16:59:59-06:00", false],
    ["2026-11-27T17:00:00-06:00", true],
    ["2026-11-27T23:59:59-06:00", true],
    ["2026-11-28T00:00:00-06:00", false],
    ["2026-12-31T23:59:59-06:00", true],
  ]) {
    assert.equal(state("C26-001", iso).openNowEligible, open, iso);
    assert.equal(ids(candidate(iso, { filters: { ...filters, openNowOnly: true }, selectedCategories: ["christmas-lights"] })).includes("C26-001"), open, iso);
  }
  const iso = "2026-12-05T17:00:00-06:00";
  const closedHosts = decorateDateNight(fixtures.map(place => ({ ...place, openingHours: "Mo-Su 00:00-00:01" })), DEFAULT_LOCATION, at(iso));
  assert.equal(ids(candidate(iso, { venues: closedHosts, filters: { ...filters, openNowOnly: true } })).includes("C26-001"), true);
  const beforeOpening = candidate("2026-12-05T16:59:59-06:00", { filters: { ...filters, openNowOnly: true } });
  assert.equal(beforeOpening.choices.some(choice => choice.venue.id === fixtureIds["C26-001"]), false);
});

test("Olde World retains separate gala and market prices with no overnight availability", () => {
  for (const [iso, open, browse, price] of [
    ["2026-12-04T17:29:59-06:00", false, true, null],
    ["2026-12-04T17:30:00-06:00", true, true, 10],
    ["2026-12-04T18:59:59-06:00", true, true, 10],
    ["2026-12-04T19:00:00-06:00", false, false, null],
    ["2026-12-04T23:59:59-06:00", false, false, null],
    ["2026-12-05T00:00:00-06:00", false, true, null],
    ["2026-12-05T08:59:59-06:00", false, true, null],
    ["2026-12-05T09:00:00-06:00", true, true, 0],
    ["2026-12-05T13:59:59-06:00", true, true, 0],
    ["2026-12-05T14:00:00-06:00", false, false, null],
    ["2026-12-06T10:00:00-06:00", false, false, null],
  ]) {
    const availability = state("C26-005", iso);
    assert.equal(availability.openNowEligible, open, iso);
    assert.equal(availability.browseEligible, browse, iso);
    assert.equal(availability.activeSession?.admission.priceUsd ?? null, price, iso);
    assert.equal(ids(candidate(iso, { selectedCategories: ["holiday-market"] })).includes("C26-005"), browse, iso);
  }
  const gala = events(candidate("2026-12-04T18:00:00-06:00", { selectedCategories: ["holiday-market"] }))[0];
  const market = events(candidate("2026-12-05T10:00:00-06:00", { selectedCategories: ["holiday-market"] }))[0];
  assert.equal(gala.venue.id, market.venue.id);
  assert.equal(gala.presentation.eventId, market.presentation.eventId);
  assert.equal(gala.presentation.eventAvailability.sessions.length, 1);
  assert.equal(market.presentation.eventAvailability.sessions.length, 1);
});

test("NEWcaps is a one-day public fair, not general access to the school", () => {
  assert.deepEqual(event("C26-010").venue.publicSpaces, ["Cafeteria", "Hallways", "Auxiliary gym"]);
  for (const [iso, open, browse] of [
    ["2026-12-04T10:00:00-06:00", false, false],
    ["2026-12-05T08:59:59-06:00", false, true],
    ["2026-12-05T09:00:00-06:00", true, true],
    ["2026-12-05T14:59:59-06:00", true, true],
    ["2026-12-05T15:00:00-06:00", false, false],
    ["2026-12-06T10:00:00-06:00", false, false],
  ]) {
    assert.equal(state("C26-010", iso).openNowEligible, open, iso);
    assert.equal(ids(candidate(iso, { selectedCategories: ["holiday-craft-fair"] })).includes("C26-010"), browse, iso);
    if (!browse) assert.equal(candidate(iso).choices.some(choice => choice.venue.id === fixtureIds["C26-010"]), false);
  }
  assert.equal(state("C26-010", "2026-12-05T10:00:00-06:00").activeSession.admission.priceUsd, 0);
});

test("December 7 square activities and parade are schedule-only with a separate route", () => {
  const parade = event("C26-007");
  assert.equal(parade.venue.address, "302 S Main St, Carthage, MO");
  assert.equal(parade.route.startLocation, "Chestnut and Main Streets, Carthage");
  assert.equal(parade.route.finishTime, null);
  assert.deepEqual(parade.sessions.map(session => [session.opens, session.closes]), [["17:30", null], ["19:00", null]]);
  assert.match(parade.sessions[0].scheduleNote, /6:15/);
  assert.match(parade.sessions[0].scheduleNote, /6:30/);
  for (const time of ["00:00:00", "17:29:59", "17:30:00", "18:15:00", "18:30:00", "19:00:00", "20:00:00", "23:59:59"]) {
    const iso = `2026-12-07T${time}-06:00`;
    const availability = state("C26-007", iso);
    assert.equal(availability.openNowEligible, false, iso);
    assert.equal(availability.activeSession, null, iso);
    assert.equal(availability.status, "end-time-unknown", iso);
    assert.equal(ids(candidate(iso, { selectedCategories: ["holiday-community-event"] })).length, 1, iso);
    assert.equal(ids(candidate(iso, { filters: { ...filters, openNowOnly: true }, selectedCategories: ["holiday-community-event"] })).length, 0, iso);
  }
  assert.equal(ids(candidate("2026-12-06T19:00:00-06:00")).includes("C26-007"), false);
  assert.equal(ids(candidate("2026-12-08T00:00:00-06:00")).includes("C26-007"), false);
  assert.equal(ids(candidate("2026-12-20T19:00:00-06:00")).includes("C26-007"), false);
});

test("category filters are explicit and Christmas never expands into other modes or opt-out", () => {
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["holiday-market"] })), ["C26-005"]);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["holiday-craft-fair"] })), ["C26-010"]);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["holiday-market", "holiday-craft-fair"] })), ["C26-005", "C26-010"]);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["park"] })), []);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["movies"] })), []);
  assert.deepEqual(ids(candidate(undefined, { christmasEnabled: false })), []);
  for (const homeMode of ["dinner", "nightlife"]) assert.deepEqual(candidate(undefined, { homeMode }).choices, []);
  assert.equal(dateNightCategoryWeight("park", true), 0.08);
  for (const category of CHRISTMAS_2026_PILOT.map(item => item.category)) assert.equal(dateNightCategoryWeight(category, true), 1);
});

test("temporary events and permanent display relationships keep canonical hosts unchanged", () => {
  const iso = "2026-12-05T10:00:00-06:00";
  const venues = decorateDateNight(fixtures, DEFAULT_LOCATION, at(iso));
  const before = structuredClone(venues);
  const result = candidate(iso, { venues: freeze(venues) });
  for (const choice of events(result)) {
    assert.equal(choice.venue, venues.find(venue => venue.id === choice.venue.id));
    assert.equal(choice.presentation.baseVenueId, choice.venue.id);
    assert.notEqual(choice.venue.id, choice.presentation.eventId);
    assert.equal(choice.presentation.overlayApplied, undefined);
    assert.match(choice.venue.name, /^Synthetic permanent host/);
    assert.equal(choice.presentation.relationship, event(choice.presentation.eventId).relationship);
    assert.equal(choice.presentation.directionsTarget, null);
    assert.equal(choice.presentation.ticketPurchaseUrl, null);
    assert.equal(choice.presentation.iconKey, null);
  }
  assert.deepEqual(venues, before);
  assert.equal(candidate("2027-01-01T00:00:00-06:00").choices[0].venue.id, fixtureIds["C26-001"]);
  assert.deepEqual(candidate("2027-01-01T00:00:00-06:00").choices[0].categories, ["park"]);
});

test("favorites, history identity, never-recommend and active exclusions retain their permanent IDs", () => {
  const iso = "2026-12-05T10:00:00-06:00";
  const id = fixtureIds["C26-005"];
  const preferences = freeze({ [id]: { favorite: true, neverRecommend: false, rating: 4 } });
  const history = freeze([{ restaurantId: id, pickedAt: "2026-11-01T12:00:00Z" }]);
  const before = structuredClone({ preferences, history });
  const favorite = candidate(iso, { filters: { ...filters, favoritesOnly: true }, preferences });
  assert.deepEqual(ids(favorite), ["C26-005"]);
  assert.equal(pickChristmasChoice(favorite.choices, filters, history.map(item => item.restaurantId), null, () => 0).venue.id, id);
  assert.deepEqual(ids(candidate(iso, { filters: { ...filters, favoritesOnly: true } })), []);
  assert.deepEqual(ids(candidate(iso, { selectedCategories: ["holiday-market"], preferences: { [id]: { favorite: true, neverRecommend: true } } })), []);
  assert.deepEqual(ids(candidate(iso, { selectedCategories: ["holiday-market"], exclusions: [{ restaurantId: id, expiresAt: at(iso).getTime() + 1 }] })), []);
  assert.deepEqual(ids(candidate(iso, { selectedCategories: ["holiday-market"], exclusions: [{ restaurantId: id, expiresAt: at(iso).getTime() }] })), ["C26-005"]);
  // A research ID is not silently promoted to a favorite/history alias.
  assert.deepEqual(ids(candidate(iso, { filters: { ...filters, favoritesOnly: true }, preferences: { "C26-005": { favorite: true } } })), []);
  assert.deepEqual({ preferences, history }, before);
});

test("radius, lifecycle, unavailable hosts and ordinary identity semantics still gate the pilot", () => {
  const iso = "2026-12-05T10:00:00-06:00";
  const venues = decorateDateNight(fixtures, DEFAULT_LOCATION, at(iso));
  for (const modify of [
    venue => ({ ...venue, distanceMiles: 51 }),
    venue => ({ ...venue, distanceMiles: NaN }),
    venue => ({ ...venue, lifecycle: "permanently-closed" }),
    venue => ({ ...venue, availability: { ...venue.availability, browseEligible: false } }),
    venue => ({ ...venue, availability: { ...venue.availability, season: "halloween" } }),
  ]) assert.deepEqual(ids(candidate(iso, { venues: venues.map(modify) })), []);
  const withUnmergedAlias = venues.map(venue => ({ ...venue, discoveryEvidence: [{ id: "not-an-affirmed-ordinary-alias", source: "osm", activityTypes: [], openingHours: null, website: null }] }));
  assert.deepEqual(ids(candidate(iso, { venues: withUnmergedAlias, filters: { ...filters, favoritesOnly: true }, preferences: { "not-an-affirmed-ordinary-alias": { favorite: true } } })), []);
});

test("missing, ambiguous and unsupported bindings cannot create a Christmas permanent venue", () => {
  const absent = candidate(undefined, { bindings: [] });
  assert.equal(absent.bindingBlockers.length, 4);
  assert.deepEqual(ids(absent), []);
  assert.deepEqual(absent.choices.map(choice => choice.venue.id), [fixtureIds["C26-001"]]);
  for (const invalid of [
    [...bindings, bindings[0]],
    bindings.map(binding => binding.researchId === "C26-001" ? { ...binding, canonicalVenueId: "unknown-host" } : binding),
    bindings.map(binding => binding.researchId === "C26-001" ? { ...binding, reviewUrl: "javascript:alert(1)" } : binding),
    bindings.map(binding => binding.researchId === "C26-005" ? { ...binding, canonicalVenueId: fixtureIds["C26-001"] } : binding),
  ]) {
    const result = candidate(undefined, { bindings: invalid });
    assert.ok(result.bindingBlockers.some(blocker => blocker.researchId === "C26-001"));
    assert.equal(ids(result).includes("C26-001"), false);
  }
});

test("merged live/saved copies and two market sessions never produce duplicate options", () => {
  const iso = "2026-12-05T10:00:00-06:00";
  const ordinary = { ...prototypePark, id: "fixture-ordinary-movies", name: "Synthetic movies", activityTypes: ["movies"], openingHours: "24/7" };
  const venues = decorateDateNight([...fixtures, ordinary], DEFAULT_LOCATION, at(iso));
  const result = candidate(iso, { venues: [...venues, ...venues] });
  assert.equal(result.choices.length, 4);
  assert.equal(new Set(result.choices.map(choice => choice.venue.id)).size, 4);
  const options = pickChristmasOptions(result.choices, filters, [], 4, () => 0.4);
  assert.equal(options.length, 4);
  assert.equal(new Set(options.map(choice => choice.venue.id)).size, 4);
  assert.equal(options.filter(choice => choice.venue.id === fixtureIds["C26-005"]).length, 1);
});

test("ordinary parks and Halloween choices retain existing off-season behavior", () => {
  const iso = "2026-09-30T15:00:00-05:00";
  const haunt = { ...prototypePark, id: "fixture-halloween", name: "Synthetic haunt", activityTypes: ["haunted-house"], openingHours: "24/7" };
  const venues = decorateDateNight([fixtures[0], haunt], DEFAULT_LOCATION, at(iso));
  const on = candidate(iso, { venues, halloweenActive: true, selectedCategories: ["haunted-house"] });
  assert.equal(on.choices.length, 1);
  assert.equal(on.choices[0].venue.id, "fixture-halloween");
  assert.equal(on.choices[0].presentation.overlayApplied, false);
  assert.deepEqual(ids(on), []);
  assert.equal(candidate(iso, { venues, halloweenActive: false, selectedCategories: ["haunted-house"] }).choices.length, 0);
  const park = candidate(iso, { venues, selectedCategories: ["park"] }).choices;
  assert.equal(park.length, 1);
  assert.equal(park[0].venue.id, fixtureIds["C26-001"]);
  assert.deepEqual(park[0].categories, ["park"]);
});

test("malformed or overlapping admission intervals fail closed instead of widening availability", () => {
  const market = event("C26-005");
  const gala = market.sessions[0];
  const now = at("2026-12-04T18:00:00-06:00");
  for (const sessions of [
    [{ ...gala, closes: "08:00" }],
    [{ ...gala, opens: "25:00" }],
    [gala, { ...gala, id: "overlap", opens: "18:00", closes: "20:00" }],
    [gala, gala],
  ]) {
    const availability = christmasSessionAvailability({ ...market, sessions }, now);
    assert.equal(availability.openNowEligible, false);
    assert.equal(availability.browseEligible, false);
  }
  assert.equal(christmasSessionAvailability(market, new Date("invalid")).openNowEligible, false);
});
