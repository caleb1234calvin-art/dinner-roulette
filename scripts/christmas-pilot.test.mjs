import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { buildChristmasPilotCandidate, buildIsolatedChristmasPilotCandidate } = load("src/lib/date-night/christmas-pilot.ts");
const { CHRISTMAS_2026_PILOT } = load("src/lib/date-night/christmas-pilot-catalog.ts");
const { REVIEWED_CHRISTMAS_BINDINGS, resolveChristmasParkBinding } = load("src/lib/date-night/christmas-binding.ts");
const { christmasSessionAvailability, chicagoEventClock, CHRISTMAS_EVENT_KEYS, SPARKLE_VENUE_ID } = load("src/lib/date-night/christmas-pilot-model.ts");
const { isChristmasAppWindow, dateNightCategoryWeight } = load("src/lib/date-night/christmas-overlay.ts");
const { pickChristmasChoice, pickChristmasOptions } = load("src/lib/date-night/christmas-picker.ts");
const { decorateDateNight } = load("src/lib/date-night/eligibility.ts");
const { JASPER_COUNTY_DATE_NIGHT_CATALOG } = load("src/lib/date-night/jasper-county-catalog.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const prototypePark = JASPER_COUNTY_DATE_NIGHT_CATALOG.find(place => place.id === "date-night-schifferdecker-park-joplin");
assert.ok(prototypePark);
const recordedPark = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8"));
const location = { ...recordedPark.element.center, label: "Recorded park geometry; distance only" };
const reviewed = REVIEWED_CHRISTMAS_BINDINGS[0];
const park = {
  ...prototypePark, id: SPARKLE_VENUE_ID, name: "Central Park", address: reviewed.expected.address,
  ...recordedPark.element.center, source: "osm", activityTypes: ["park"], openingHours: null,
  website: null, discoveryEvidence: [{
    id: SPARKLE_VENUE_ID, source: "osm", activityTypes: ["park"], openingHours: null, website: null,
    sourceIdentity: {
      objectType: "way", objectId: recordedPark.element.id, version: recordedPark.element.version,
      changeset: recordedPark.element.changeset, name: "Central Park", address: reviewed.expected.address,
      classification: { leisure: "park" }, observedAt: recordedPark.element.timestamp,
    },
  }],
};
const ordinaryMovie = {
  ...prototypePark, id: "fixture-ordinary-movies", name: "Synthetic movies", ...location,
  activityTypes: ["movies"], openingHours: "24/7", website: "https://fixture.invalid/movies",
};
const fixtures = [park, ordinaryMovie];
const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 50, openNowOnly: false };
const at = iso => new Date(iso);
const event = id => CHRISTMAS_2026_PILOT.find(item => item.researchId === id);
const state = (id, iso) => christmasSessionAvailability(event(id), at(iso));
const placementEvidence = "https://fixture.invalid/placement-evidence";
const testAttraction = attraction => ({ ...attraction, hostSourceRefs: [...attraction.hostSourceRefs, placementEvidence] });
const fixtureAttractions = CHRISTMAS_2026_PILOT.map(testAttraction);
// Controlled test geometry, not evidence for the real church, school or parade.
// Explicit injection is confined to the isolated builder; it cannot publish data.
function testPlacement(attraction, extra = {}) {
  return {
    eventKey: attraction.eventKey, hostReference: attraction.hostReference,
    scope: attraction.relationship === "fixed-site-and-route" ? "spectator-distance" : "venue-distance",
    ...location, review: { status: "reviewed", revision: "synthetic-test-only",
      reviewUrl: "https://fixture.invalid/placement-review", checkedOn: "2026-11-11" },
    sourceRefs: [placementEvidence], ...extra,
  };
}
const placements = fixtureAttractions.filter(item => item.kind === "temporary-event").map(item => testPlacement(item));
function input(iso = "2026-12-05T10:00:00-06:00", extra = {}) {
  return {
    venues: decorateDateNight(fixtures, location, at(iso)), location, placements, attractions: fixtureAttractions,
    selectedCategories: ["anything"], homeMode: "date-night", ...extra,
    filters: { ...filters, ...extra.filters }, now: at(iso),
  };
}
const candidate = (iso, extra) => buildIsolatedChristmasPilotCandidate(input(iso, extra));
const events = result => result.choices.filter(choice => choice.presentation?.schemaVersion === 1);
const ids = result => events(result).map(choice => choice.presentation.researchId);
const choice = (result, id) => events(result).find(item => item.presentation.researchId === id);
const blocker = (result, id, code) => result.bindingBlockers.some(item => item.researchId === id && item.code === code);
function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  }
  return value;
}

test("public catalog contains exactly four reviewed but unpublished records and cannot be unlocked by injected placements", () => {
  assert.deepEqual(CHRISTMAS_2026_PILOT.map(item => item.researchId).sort(), ["C26-001", "C26-005", "C26-007", "C26-010"]);
  for (const attraction of CHRISTMAS_2026_PILOT) {
    assert.equal(attraction.edition, "christmas-2026");
    assert.equal(attraction.publicationStatus, "hold");
    assert.equal(attraction.evidence.verdict, "VERIFIED");
    assert.equal(attraction.evidence.checkedOn, "2026-11-11");
    assert.match(attraction.eventKey, /^date-night-event-christmas-2026-/);
    assert.match(attraction.evidence.reviewUrl, /issues\/93#issuecomment-/);
    assert.ok(attraction.evidence.sources.length >= 2);
    assert.ok(attraction.evidence.sources.every(source => source.url.startsWith("https://") && source.supports.length));
    assert.equal("lat" in attraction.venue, false);
    assert.equal("lon" in attraction.venue, false);
    assert.ok(attraction.unknowns.length);
  }
  assert.equal(event("C26-001").permanentVenueId, SPARKLE_VENUE_ID);
  for (const attraction of CHRISTMAS_2026_PILOT.filter(item => item.kind === "temporary-event"))
    assert.equal(attraction.permanentVenueId, undefined);
  for (const iso of ["2026-12-04T18:00:00-06:00", "2026-12-05T10:00:00-06:00", "2026-12-07T18:00:00-06:00"])
    assert.deepEqual(ids(buildChristmasPilotCandidate(input(iso, {
      attractions: CHRISTMAS_2026_PILOT.map(item => ({ ...item, publicationStatus: "accepted" })),
    }))), []);
});

test("Chicago app boundaries are independent of actual Sparkle dates and host timezone", () => {
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

test("Sparkle uses 17:00 to midnight independently of ordinary park hours", () => {
  assert.equal(state("C26-001", "2026-11-24T17:30:00-06:00").openNowEligible, false);
  assert.equal(state("C26-001", "2026-11-24T18:30:00-06:00").browseEligible, false);
  for (const [iso, open] of [
    ["2026-11-27T16:59:59-06:00", false], ["2026-11-27T17:00:00-06:00", true],
    ["2026-11-27T23:59:59-06:00", true], ["2026-11-28T00:00:00-06:00", false],
    ["2026-12-31T23:59:59-06:00", true],
  ]) {
    assert.equal(state("C26-001", iso).openNowEligible, open, iso);
    assert.equal(ids(candidate(iso, { filters: { openNowOnly: true }, selectedCategories: ["christmas-lights"] })).includes("C26-001"), open, iso);
  }
  const iso = "2026-12-05T17:00:00-06:00";
  const closedPark = decorateDateNight([{ ...park, openingHours: "Mo-Su 00:00-00:01" }], location, at(iso));
  assert.equal(ids(candidate(iso, { venues: closedPark, filters: { openNowOnly: true } })).includes("C26-001"), true);
  const beforeOpening = candidate("2026-12-05T16:59:59-06:00", { filters: { openNowOnly: true } });
  assert.equal(beforeOpening.choices.some(item => item.selectionKey === SPARKLE_VENUE_ID), false);
});

test("Olde World has two sessions with one event preference identity, distinct prices and no overnight Open Now", () => {
  for (const [iso, open, browse, price] of [
    ["2026-12-04T17:29:59-06:00", false, true, null], ["2026-12-04T17:30:00-06:00", true, true, 10],
    ["2026-12-04T18:59:59-06:00", true, true, 10], ["2026-12-04T19:00:00-06:00", false, false, null],
    ["2026-12-04T23:59:59-06:00", false, false, null], ["2026-12-05T00:00:00-06:00", false, true, null],
    ["2026-12-05T08:59:59-06:00", false, true, null], ["2026-12-05T09:00:00-06:00", true, true, 0],
    ["2026-12-05T13:59:59-06:00", true, true, 0], ["2026-12-05T14:00:00-06:00", false, false, null],
    ["2026-12-06T10:00:00-06:00", false, false, null],
  ]) {
    const availability = state("C26-005", iso);
    assert.equal(availability.openNowEligible, open, iso);
    assert.equal(availability.browseEligible, browse, iso);
    assert.equal(availability.activeSession?.admission.priceUsd ?? null, price, iso);
    assert.equal(ids(candidate(iso, { selectedCategories: ["holiday-market"] })).includes("C26-005"), browse, iso);
    assert.equal(ids(candidate(iso, { selectedCategories: ["holiday-market"], filters: { openNowOnly: true } })).includes("C26-005"), open, iso);
  }
  const gala = choice(candidate("2026-12-04T18:00:00-06:00"), "C26-005");
  const market = choice(candidate(), "C26-005");
  assert.equal(gala.selectionKey, market.selectionKey);
  assert.equal(gala.preferenceKey, CHRISTMAS_EVENT_KEYS["C26-005"]);
  assert.equal(gala.preferenceKey, market.preferenceKey);
  assert.equal(gala.presentation.sessions.length, 2, "a saved Friday event retains its Saturday session");
  assert.equal(market.presentation.sessions.length, 2);
  assert.deepEqual(gala.presentation.sessions.map(item => item.sessionKey), market.presentation.sessions.map(item => item.sessionKey));
  assert.notEqual(gala.presentation.activeSessionKey, market.presentation.activeSessionKey);
  assert.equal(gala.presentation.sessions.find(item => item.sessionKey === gala.presentation.activeSessionKey).admission.priceUsd, 10);
  assert.equal(market.presentation.sessions.find(item => item.sessionKey === market.presentation.activeSessionKey).admission.priceUsd, 0);
  assert.equal(gala.presentation.actions.inventory, null);
  assert.equal(gala.presentation.actions.ticketCheckout, null);
  assert.equal("venue" in gala, false);
});

test("NEWcaps admits only the one-day public fair without adding an ordinary school", () => {
  assert.deepEqual(event("C26-010").venue.publicSpaces, ["Cafeteria", "Hallways", "Auxiliary gym"]);
  for (const [iso, open, browse] of [
    ["2026-12-04T10:00:00-06:00", false, false], ["2026-12-05T08:59:59-06:00", false, true],
    ["2026-12-05T09:00:00-06:00", true, true], ["2026-12-05T14:59:59-06:00", true, true],
    ["2026-12-05T15:00:00-06:00", false, false], ["2026-12-06T10:00:00-06:00", false, false],
  ]) {
    assert.equal(state("C26-010", iso).openNowEligible, open, iso);
    assert.equal(ids(candidate(iso, { venues: [], selectedCategories: ["holiday-craft-fair"] })).includes("C26-010"), browse, iso);
  }
  assert.equal(state("C26-010", "2026-12-05T10:00:00-06:00").activeSession.admission.priceUsd, 0);
  const fair = choice(candidate(undefined, { venues: [] }), "C26-010");
  assert.equal(fair.preferenceKey, CHRISTMAS_EVENT_KEYS["C26-010"]);
  assert.equal(fair.presentation.host.permanentVenueId, undefined);
  assert.equal("venue" in fair, false);
});

test("square and route remain explicit start-only locations and lose attendance eligibility after the final announced start", () => {
  const parade = event("C26-007");
  assert.equal(parade.route.startLocation, "Chestnut and Main Streets, Carthage");
  assert.equal(parade.route.finishTime, null);
  assert.deepEqual(parade.sessions.map(session => [session.opens, session.closes]), [["17:30", null], ["19:00", null]]);
  assert.match(parade.sessions[0].scheduleNote, /6:15/);
  assert.match(parade.sessions[0].scheduleNote, /6:30/);
  assert.equal(parade.locations[parade.sessions[0].locationId].kind, "fixed-site");
  assert.equal(parade.locations[parade.sessions[1].locationId].kind, "route");
  assert.notEqual(parade.locations[parade.sessions[1].locationId].name, "Jasper County Courthouse");
  for (const time of ["00:00:00", "17:29:59", "17:30:00", "18:15:00", "18:30:00", "19:00:00", "19:00:00.001", "19:00:59", "19:01:00", "20:00:00", "23:59:59"]) {
    const iso = `2026-12-07T${time}-06:00`;
    const availability = state("C26-007", iso);
    const attending = time <= "19:00:00";
    assert.equal(availability.openNowEligible, false, iso);
    assert.equal(availability.activeSession, null, iso);
    assert.equal(availability.attendanceEligible, attending, iso);
    assert.equal(availability.status, attending ? "end-time-unknown" : "past-announced-start", iso);
    assert.equal(ids(candidate(iso, { selectedCategories: ["holiday-community-event"] })).includes("C26-007"), attending, iso);
    assert.equal(ids(candidate(iso, { filters: { openNowOnly: true }, selectedCategories: ["holiday-community-event"] })).length, 0, iso);
    if (!attending) assert.equal(candidate(iso).scheduleOnlyChoices.some(item => item.presentation.researchId === "C26-007"), true);
  }
  for (const iso of ["2026-12-06T19:00:00-06:00", "2026-12-08T00:00:00-06:00", "2026-12-20T19:00:00-06:00"])
    assert.equal(ids(candidate(iso)).includes("C26-007"), false);
});

test("category filtering, distinct event identities and category-first roulette work with absent ordinary hosts", () => {
  assert.deepEqual(ids(candidate(undefined, { venues: [], selectedCategories: ["holiday-market"] })), ["C26-005"]);
  assert.deepEqual(ids(candidate(undefined, { venues: [], selectedCategories: ["holiday-craft-fair"] })), ["C26-010"]);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["holiday-market", "holiday-craft-fair"] })), ["C26-005", "C26-010"]);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["park"] })), []);
  assert.deepEqual(ids(candidate(undefined, { selectedCategories: ["movies"] })), []);
  for (const homeMode of ["dinner", "nightlife"]) assert.deepEqual(candidate(undefined, { homeMode }).choices, []);
  assert.equal(dateNightCategoryWeight("park", true), 0.08);
  for (const category of CHRISTMAS_2026_PILOT.map(item => item.category)) assert.equal(dateNightCategoryWeight(category, true), 1);
  const available = candidate().choices;
  const draw = samples => { let index = 0; return () => samples[index++] ?? 0; };
  assert.equal(pickChristmasChoice(available, { ...filters, reduceParks: false }, [], null, draw([0.3, 0])).presentation.researchId, "C26-005");
});

test("opt-out and January 1 restore the saved ordinary filter despite a retained Christmas chip", () => {
  const savedFilters = freeze({ ...filters, activityTypes: ["movies"] });
  const snapshot = structuredClone(savedFilters);
  for (const [iso, christmasEnabled] of [["2026-12-05T10:00:00-06:00", false], ["2027-01-01T00:00:00-06:00", true]]) {
    const result = candidate(iso, { filters: savedFilters, selectedCategories: ["holiday-market"], christmasEnabled });
    assert.deepEqual(ids(result), []);
    assert.deepEqual(result.choices.map(item => item.venue.id), [ordinaryMovie.id]);
    assert.deepEqual(result.choices[0].categories, ["movies"]);
  }
  assert.deepEqual(savedFilters, snapshot);
});

test("reviewed park association requires the exact source object, identity fields and provenance", () => {
  const venues = decorateDateNight([park], location, at("2026-12-05T10:00:00-06:00"));
  assert.equal(resolveChristmasParkBinding(venues, REVIEWED_CHRISTMAS_BINDINGS).state, "bound");
  assert.equal(resolveChristmasParkBinding([], REVIEWED_CHRISTMAS_BINDINGS).state, "absent-from-query");
  assert.equal(resolveChristmasParkBinding(venues, []).state, "missing-review");
  const mutate = change => venues.map(value => change(structuredClone(value)));
  assert.equal(resolveChristmasParkBinding(mutate(value => ({ ...value, discoveryEvidence: [] })), REVIEWED_CHRISTMAS_BINDINGS).state, "missing-source-evidence");
  for (const invalid of [
    { ...reviewed, reviewUrl: "https://unrelated.invalid/review" },
    { ...reviewed, canonicalVenueId: "date-night-arbitrary-park" },
    { ...reviewed, sourceObject: { ...reviewed.sourceObject, id: 437235888 } },
    { ...reviewed, supportingSources: ["https://unrelated.invalid/evidence"] },
  ]) assert.equal(resolveChristmasParkBinding(venues, [invalid]).state, "conflicting-review");
  assert.equal(resolveChristmasParkBinding(venues, [reviewed, reviewed]).state, "conflicting-review");
  for (const change of [
    value => ({ ...value, name: "Unrelated park" }), value => ({ ...value, address: "820 Howard Street, Carthage" }),
    value => ({ ...value, activityTypes: ["park", "movies"] }),
    value => ({ ...value, discoveryEvidence: value.discoveryEvidence.map(item => ({ ...item, sourceIdentity: { ...item.sourceIdentity, objectId: 437235888 } })) }),
    value => ({ ...value, discoveryEvidence: value.discoveryEvidence.map(item => ({ ...item, sourceIdentity: { ...item.sourceIdentity, classification: { amenity: "place_of_worship" } } })) }),
  ]) assert.equal(resolveChristmasParkBinding(mutate(change), REVIEWED_CHRISTMAS_BINDINGS).state, "conflicting-source");
  for (const revision of [{ version: 1 }, { version: 3 }, { changeset: 189037686 }]) {
    const changed = mutate(value => ({ ...value, discoveryEvidence: value.discoveryEvidence.map(item => ({ ...item, sourceIdentity: { ...item.sourceIdentity, ...revision } })) }));
    assert.equal(resolveChristmasParkBinding(changed, REVIEWED_CHRISTMAS_BINDINGS).state, "stale-source");
  }
  // Source last-modified time is not a freshness TTL: the reviewed v2 remains v2.
  assert.equal(venues[0].discoveryEvidence[0].sourceIdentity.observedAt, "2026-09-15T01:38:46Z");
});

test("wrong-host market binding is rejected even with a valid-looking HTTPS review URL", () => {
  const malicious = { ...reviewed, researchId: "C26-005", eventKey: CHRISTMAS_EVENT_KEYS["C26-005"],
    canonicalVenueId: SPARKLE_VENUE_ID, reviewUrl: "https://unrelated.invalid/a-review" };
  const result = candidate(undefined, { bindings: [...REVIEWED_CHRISTMAS_BINDINGS, malicious] });
  assert.equal(blocker(result, "C26-005", "binding-not-applicable"), true);
  assert.equal(ids(result).includes("C26-005"), false);
  assert.equal(ids(result).includes("C26-001"), true, "a bad temporary host binding does not invalidate the independently reviewed park");
});

test("missing review, missing query result and missing placement remain distinct diagnostics", () => {
  assert.equal(candidate(undefined, { bindings: [] }).bindings.find(item => item.researchId === "C26-001").state, "missing-review");
  assert.equal(candidate(undefined, { venues: [] }).bindings.find(item => item.researchId === "C26-001").state, "absent-from-query");
  const noPlacements = candidate(undefined, { placements: [] });
  assert.equal(blocker(noPlacements, "C26-005", "missing-placement"), true);
  assert.equal(blocker(noPlacements, "C26-010", "missing-placement"), true);
  assert.deepEqual(ids(noPlacements), ["C26-001"]);
});

test("distance placement is fail-closed for missing origin, invalid geometry, incorrect host and radius", () => {
  for (const location of [undefined, null, { ...recordedPark.element.center, lat: NaN }, { ...recordedPark.element.center, lon: 181 }])
    assert.deepEqual(ids(candidate(undefined, { location })), [], "a missing or invalid search origin cannot admit any event");
  for (const radiusMiles of [undefined, NaN, Infinity, -1])
    assert.deepEqual(ids(candidate(undefined, { filters: { radiusMiles } })), [], "an invalid radius cannot admit any event");
  for (const extra of [
    { placements: placements.map(item => ({ ...item, lat: NaN })) },
    { placements: placements.map(item => ({ ...item, lat: 91 })) },
    { placements: placements.map(item => ({ ...item, hostReference: "unrelated:host" })) },
    { placements: placements.map(item => ({ ...item, review: { ...item.review, status: "pending" } })) },
    { placements: placements.map(item => ({ ...item, review: undefined })) },
    { placements: placements.map(item => ({ ...item, sourceRefs: [] })) },
    { placements: placements.map(item => ({ ...item, sourceRefs: undefined })) },
    { placements: placements.map(item => ({ ...item, lat: location.lat + 2 })), filters: { radiusMiles: 5 } },
  ]) assert.equal(events(candidate(undefined, extra)).some(item => item.kind === "temporary-event"), false);
});

test("distinct verified events may share one host without sharing selection or preference identity", () => {
  const market = event("C26-005");
  const other = { ...event("C26-010"), hostReference: market.hostReference, hostSourceRefs: market.hostSourceRefs,
    venue: market.venue, locations: { school: market.locations.church } };
  const attractions = [market, other].map(testAttraction);
  const result = candidate(undefined, { venues: [], attractions, placements: attractions.map(item => testPlacement(item)) });
  assert.deepEqual(ids(result), ["C26-005", "C26-010"]);
  assert.equal(result.bindingBlockers.length, 0);
  assert.equal(new Set(result.choices.map(item => item.selectionKey)).size, 2);
  assert.equal(new Set(result.choices.map(item => item.preferenceKey)).size, 2);
});

test("edition, cancellation, unresolved research and missing session locations cannot create temporary eligibility", () => {
  const market = fixtureAttractions.find(item => item.researchId === "C26-005");
  for (const changed of [
    { ...market, edition: "christmas-2027" },
    { ...market, lifecycle: "cancelled" },
    { ...market, evidence: { ...market.evidence, verdict: "HOLD" } },
    { ...market, locations: {} },
    { ...market, eventKey: "C26-005" },
  ]) assert.deepEqual(ids(candidate(undefined, { attractions: [changed] })), []);
  const duplicate = candidate(undefined, { attractions: [market, market] });
  assert.deepEqual(ids(duplicate), []);
  assert.equal(blocker(duplicate, "C26-005", "conflicting-event"), true);
  const masquerade = { ...market, kind: "permanent-venue-display", permanentVenueId: SPARKLE_VENUE_ID,
    hostReference: "osm:way:987588580", venue: { ...market.venue, name: "Central Park" } };
  assert.deepEqual(ids(candidate(undefined, { attractions: [masquerade] })), []);
});

test("permanent and temporary preferences, exclusions and immutable inputs stay in their intended namespaces", () => {
  const iso = "2026-12-05T10:00:00-06:00";
  const venues = freeze(decorateDateNight(fixtures, location, at(iso)));
  const before = structuredClone(venues);
  const result = candidate(iso, { venues });
  const sparkle = choice(result, "C26-001");
  assert.equal(sparkle.venue, venues.find(item => item.id === SPARKLE_VENUE_ID));
  assert.equal(sparkle.preferenceKey, SPARKLE_VENUE_ID);
  assert.equal(sparkle.selectionKey, SPARKLE_VENUE_ID);
  assert.equal(sparkle.presentation.host.permanentVenueId, SPARKLE_VENUE_ID);
  for (const item of events(result)) {
    assert.ok(Object.values(item.presentation.actions).every(value => value === null));
    assert.equal(item.presentation.actions.directions, null);
  }
  assert.deepEqual(venues, before);
  const marketId = CHRISTMAS_EVENT_KEYS["C26-005"];
  const preferences = freeze({ [marketId]: { favorite: true, neverRecommend: false, rating: 4 } });
  assert.deepEqual(ids(candidate(iso, { filters: { favoritesOnly: true }, preferences })), ["C26-005"]);
  assert.deepEqual(ids(candidate(iso, { filters: { favoritesOnly: true }, preferences: { [SPARKLE_VENUE_ID]: { favorite: true } } })), ["C26-001"]);
  for (const id of ["date-night-osm-way-437235888", "operator:neosho-school-district/nhs", "C26-005"])
    assert.deepEqual(ids(candidate(iso, { filters: { favoritesOnly: true }, preferences: { [id]: { favorite: true } } })), []);
  assert.deepEqual(ids(candidate(iso, { selectedCategories: ["holiday-market"], preferences: { [marketId]: { favorite: true, neverRecommend: true } } })), []);
  assert.deepEqual(ids(candidate(iso, { selectedCategories: ["holiday-market"], exclusions: [{ restaurantId: marketId, expiresAt: at(iso).getTime() + 1 }] })), []);
  assert.deepEqual(ids(candidate(iso, { selectedCategories: ["holiday-market"], exclusions: [{ restaurantId: marketId, expiresAt: at(iso).getTime() }] })), ["C26-005"]);
  assert.equal(ids(candidate(iso, { preferences: { [SPARKLE_VENUE_ID]: { neverRecommend: true } } })).includes("C26-001"), false);
  assert.equal(ids(candidate(iso, { exclusions: [{ restaurantId: SPARKLE_VENUE_ID, expiresAt: at(iso).getTime() + 1 }] })).includes("C26-001"), false);
});

test("duplicate merged rows and sessions cannot duplicate Four Options, and repeat penalties use selection identity", () => {
  const request = input();
  const result = candidate(undefined, { venues: [...request.venues, ...request.venues] });
  assert.equal(result.choices.length, 4);
  const options = pickChristmasOptions([...result.choices, ...result.choices], filters, [], 4, () => 0.4);
  assert.equal(options.length, 4);
  assert.equal(new Set(options.map(item => item.selectionKey ?? item.venue.id)).size, 4);
  assert.equal(options.filter(item => item.preferenceKey === CHRISTMAS_EVENT_KEYS["C26-005"]).length, 1);
  const market = choice(result, "C26-005");
  const sibling = { ...market, selectionKey: "fixture-second-independent-market", preferenceKey: "fixture-second-independent-market" };
  const samples = () => { let n = 0; return () => n++ === 0 ? 0 : 0.2; };
  assert.equal(pickChristmasChoice([market, sibling], filters, [], null, samples()).selectionKey, market.selectionKey);
  assert.equal(pickChristmasChoice([market, sibling], filters, [market.selectionKey], null, samples()).selectionKey, sibling.selectionKey);
});

test("park lifecycle and identity conflicts cannot be overridden by Christmas hours", () => {
  const iso = "2026-12-05T18:00:00-06:00";
  const venues = decorateDateNight([park], location, at(iso));
  for (const modify of [
    value => ({ ...value, distanceMiles: 51 }), value => ({ ...value, distanceMiles: NaN }),
    value => ({ ...value, lifecycle: "permanently-closed" }),
    value => ({ ...value, availability: { ...value.availability, browseEligible: false } }),
    value => ({ ...value, availability: { ...value.availability, season: "halloween" } }),
  ]) assert.equal(ids(candidate(iso, { venues: venues.map(modify) })).includes("C26-001"), false);
});

test("ordinary Date Night and Halloween keep their ordinary filter and category behavior", () => {
  const iso = "2026-09-30T15:00:00-05:00";
  const haunt = { ...ordinaryMovie, id: "fixture-halloween", name: "Synthetic haunt", activityTypes: ["haunted-house"] };
  const venues = decorateDateNight([park, haunt], location, at(iso));
  const on = candidate(iso, { venues, halloweenActive: true, filters: { activityTypes: ["haunted-house"] }, selectedCategories: ["holiday-market"] });
  assert.equal(on.choices.length, 1);
  assert.equal(on.choices[0].venue.id, "fixture-halloween");
  assert.equal(on.choices[0].presentation.overlayApplied, false);
  assert.deepEqual(ids(on), []);
  assert.equal(candidate(iso, { venues, halloweenActive: false, filters: { activityTypes: ["haunted-house"] } }).choices.some(item => item.venue.id === "fixture-halloween"), false);
  const ordinary = candidate(iso, { venues, filters: { activityTypes: ["park"] } }).choices;
  assert.equal(ordinary.length, 1);
  assert.equal(ordinary[0].venue.id, SPARKLE_VENUE_ID);
  assert.deepEqual(ordinary[0].categories, ["park"]);
});

test("malformed, duplicate and overlapping admission intervals fail closed", () => {
  const market = event("C26-005");
  const gala = market.sessions[0];
  const now = at("2026-12-04T18:00:00-06:00");
  for (const sessions of [
    [{ ...gala, closes: "08:00" }], [{ ...gala, opens: "25:00" }],
    [gala, { ...gala, id: "overlap", opens: "18:00", closes: "20:00" }], [gala, gala],
  ]) {
    const availability = christmasSessionAvailability({ ...market, sessions }, now);
    assert.equal(availability.openNowEligible, false);
    assert.equal(availability.browseEligible, false);
    assert.equal(availability.attendanceEligible, false);
  }
  assert.equal(christmasSessionAvailability(market, new Date("invalid")).openNowEligible, false);
});
