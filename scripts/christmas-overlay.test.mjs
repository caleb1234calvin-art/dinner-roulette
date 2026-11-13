import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { resolveDateNightPresentation, dateNightCategoryWeight } = load(
  "src/lib/date-night/christmas-overlay.ts",
);
const { JASPER_COUNTY_DATE_NIGHT_CATALOG } = load("src/lib/date-night/jasper-county-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { mergeDateNight } = load("src/lib/date-night/identity.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { DEFAULT_LOCATION } = load("src/lib/restaurants/types.ts");
const canonical = JASPER_COUNTY_DATE_NIGHT_CATALOG.find(
  (p) => p.id === "date-night-schifferdecker-park-joplin",
);
assert.ok(canonical);
const during = "2026-12-20T19:00:00-06:00";
const [park] = decorateDateNight([canonical], DEFAULT_LOCATION, new Date(during));

// Synthetic schedule and reserved URL exercise a real canonical ID. No operator claim or catalog entry.
const hours = [
  { opens: "18:00", closes: "20:00" },
  { opens: "21:00", closes: "22:00" },
];
const event = {
  overlayId: "christmas-2026/test-display",
  parentVenueId: canonical.id,
  association: "venue-wide",
  eventName: "Fixture Lights",
  evidence: {
    status: "confirmed",
    operatorSources: ["https://operator.invalid/fixture"],
    checkedOn: "2026-11-10",
    validThrough: "2027-01-01",
    reviewRevision: "fixture-v1",
  },
  timeZone: "America/Chicago",
  occurrences: ["2026-11-23", "2026-11-26", "2026-11-27", "2026-12-20"].map((date) => ({ date, hours })),
};

function resolve(iso = during, overlays = [event], venue = park, context = {}) {
  return resolveDateNightPresentation(
    venue,
    { homeMode: "date-night", now: new Date(iso), ...context },
    overlays,
  );
}

function assertPark(view) {
  assert.equal(view.overlayApplied, false);
  assert.equal(view.baseVenueId, canonical.id);
  assert.equal(view.displayName, canonical.name);
  assert.equal(view.categoryLabel, canonical.cuisineLabel);
  assert.equal(view.iconKey, "park");
  assert.equal(view.effectiveCategory, "park");
  assert.equal(view.eventAvailability, null);
}

test("one canonical park can acquire a dated label and icon without mutating the source or venue availability", () => {
  const original = structuredClone(canonical);
  const live = { ...canonical, source: "osm", id: "date-night-osm-fixture" };
  const merged = mergeDateNight([live], [canonical]);
  const views = decorateDateNight(merged, DEFAULT_LOCATION, new Date(during)).map((venue) =>
    resolve(during, [event], venue),
  );
  assert.equal(views.length, 1);
  const [active] = views;
  assert.equal(active.baseVenueId, canonical.id);
  assert.equal(active.displayName, "Fixture Lights");
  assert.equal(active.categoryLabel, "Christmas Lights");
  assert.equal(active.effectiveCategory, "christmas-lights");
  assert.equal(active.iconKey, "christmas-lights");
  assert.equal(active.evidence, event.evidence);
  assert.equal(active.directionsTarget, null);
  assert.deepEqual(active.eventAvailability, { status: "open-now", openNowEligible: true });
  assert.deepEqual(active.venueAvailability, park.availability);
  assert.deepEqual(canonical, original);
  assert.deepEqual(merged[0].activityTypes, ["park"]);
  assertPark(resolve(during, []));
  assertPark(resolve(during, [{ ...event, parentVenueId: live.id }]));
});

test("automatic Chicago product boundaries intersect the operator's dates and never recur", () => {
  const late = {
    ...event,
    occurrences: [
      ...event.occurrences,
      { date: "2026-12-31", hours: null },
      { date: "2027-01-01", hours: null },
    ],
  };
  assertPark(resolve("2026-11-23T19:00:00-06:00"));
  assertPark(resolve("2026-11-27T05:59:59.999Z"));
  assert.equal(resolve("2026-11-27T06:00:00Z").eventAvailability.status, "closed-now");
  assert.equal(resolve("2027-01-01T05:59:59.999Z", [late]).overlayApplied, true);
  assertPark(resolve("2027-01-01T06:00:00Z", [late]));
  assertPark(resolve("2027-12-20T19:00:00-06:00"));
  for (const mode of ["dinner", "nightlife"]) assertPark(resolve(during, [event], park, { homeMode: mode }));
  assertPark(resolve(during, [event], park, { christmasEnabled: false }));
  assertPark(resolve("invalid"));
});

test("evaluate the event date and hours in its own zone, independent of the app or device clock", () => {
  const west = {
    ...event,
    timeZone: "America/Los_Angeles",
    occurrences: [{ date: "2026-11-26", hours: [{ opens: "22:00", closes: "24:00" }] }],
  };
  // Chicago midnight on opening day is still 22:00 on the prior operator date.
  assert.equal(resolve("2026-11-27T06:00:00Z", [west]).eventAvailability.status, "open-now");
  assertPark(resolve("2026-11-27T08:00:00Z", [west]));
});

test("confirmed same-day admission begins inclusively and ends exclusively; gaps and off-days cannot be Open Now", () => {
  for (const [time, status] of [
    ["17:59", "closed-now"],
    ["18:00", "open-now"],
    ["19:59", "open-now"],
    ["20:00", "closed-now"],
    ["21:00", "open-now"],
  ]) {
    assert.deepEqual(resolve(`2026-12-20T${time}:00-06:00`).eventAvailability, {
      status,
      openNowEligible: status === "open-now",
    });
  }
  assertPark(resolve("2026-12-20T22:00:00-06:00"));
  assertPark(resolve("2026-12-21T19:00:00-06:00"));
  assertPark(resolve("2026-12-19T19:00:00-06:00")); // upcoming dates stay ordinary
});

test("unknown, partial, invalid and unsplit overnight hours never borrow 24/7 park hours", () => {
  const [alwaysOpen] = decorateDateNight(
    [{ ...canonical, openingHours: "24/7" }],
    DEFAULT_LOCATION,
    new Date(during),
  );
  assert.equal(alwaysOpen.availability.openNowEligible, true);
  for (const schedule of [
    null,
    [],
    [{ opens: "18:00", closes: "25:00" }],
    [{ opens: "18:00", closes: "02:00" }],
    [...hours, { opens: "18:00", closes: "TBD" }],
  ]) {
    const view = resolve(
      during,
      [{ ...event, occurrences: [{ date: "2026-12-20", hours: schedule }] }],
      alwaysOpen,
    );
    assert.equal(view.venueAvailability.openNowEligible, true);
    assert.deepEqual(view.eventAvailability, { status: "hours-unknown", openNowEligible: false });
  }
  const [closedPark] = decorateDateNight(
    [{ ...canonical, openingHours: "00:00-00:01" }],
    DEFAULT_LOCATION,
    new Date(during),
  );
  assert.equal(closedPark.availability.openNowEligible, false);
  assert.equal(resolve(during, [event], closedPark).eventAvailability.openNowEligible, true);
});

test("review, exact parent, negative lifecycle and distinct-entry gates fail closed", () => {
  for (const patch of [
    { status: "partial" },
    { status: "unconfirmed" },
    { status: "not-operating" },
    { reviewRevision: "" },
    { operatorSources: [] },
    { operatorSources: ["no URL"] },
    { validThrough: "2026-12-19" },
    { checkedOn: "2026-12-21" },
    { checkedOn: "2025-11-10" },
    { validThrough: "2026-02-30" },
  ]) {
    assertPark(resolve(during, [{ ...event, evidence: { ...event.evidence, ...patch } }]));
  }
  for (const patch of [
    { association: "linked-event" },
    { timeZone: "Unknown/Zone" },
    { timeZone: "" },
    { parentVenueId: "date-night-nearby-park" },
    { eventName: " " },
    { overlayId: "test-display" },
  ]) {
    assertPark(resolve(during, [{ ...event, ...patch }]));
  }
  for (const lifecycle of ["disused", "permanently-closed"]) {
    const [closed] = decorateDateNight([{ ...canonical, lifecycle }], DEFAULT_LOCATION, new Date(during));
    assertPark(resolve(during, [event], closed));
  }
});

test("ambiguous revisions, duplicate days and concurrent venue identities cannot overwrite one another", () => {
  const second = { ...event, overlayId: "christmas-2026/other" };
  for (const records of [
    [event, second],
    [second, event],
    [event, { ...event, evidence: { ...event.evidence, status: "not-operating" } }],
  ]) {
    assertPark(resolve(during, records));
  }
  assertPark(resolve(during, [{ ...event, occurrences: [...event.occurrences, event.occurrences.at(-1)] }]));
  const otherDay = { ...second, occurrences: [{ date: "2026-12-21", hours }] };
  assert.equal(resolve(during, [event, otherDay]).overlayId, event.overlayId);
  assert.equal(resolve("2026-12-21T19:00:00-06:00", [event, otherDay]).overlayId, otherDay.overlayId);
});

test("Reduce Parks preserves ordinary weighting and gives verified lights their own category weight", () => {
  assert.equal(dateNightCategoryWeight(resolve().effectiveCategory, true), 1);
  const usual = resolve(during, []).effectiveCategory;
  assert.equal(dateNightCategoryWeight(usual, true), 0.08);
  assert.equal(dateNightCategoryWeight(usual, false), 1);
  assert.equal(dateNightCategoryWeight("haunted-house", true), 1);
});

test("existing favorite, visit and exclusion keys survive resolve, opt-out and January expiry", async (t) => {
  const saved = new Map();
  globalThis.window = {
    localStorage: {
      setItem: (key, value) => saved.set(key, value),
      getItem: (key) => saved.get(key) ?? null,
      removeItem: (key) => saved.delete(key),
    },
  };
  t.after(() => {
    delete globalThis.window;
  });
  const { useAppStore } = load("src/lib/store.ts");
  const active = resolve();
  const actions = useAppStore.getState();
  actions.toggleFavorite({
    restaurantId: active.baseVenueId,
    name: canonical.name,
    cuisineLabel: canonical.cuisineLabel,
  });
  actions.recordVisit({
    restaurantId: active.baseVenueId,
    restaurantName: canonical.name,
    cuisineLabel: canonical.cuisineLabel,
    personalRating: null,
  });
  actions.excludeTonight(active.baseVenueId, canonical.name);
  const serialized = saved.get("pick-for-us-v1");
  const { useAppStore: restored } = appModuleLoader()("src/lib/store.ts");
  await restored.persist.rehydrate();
  const { preferences, visits, exclusions, dateNightFilters } = restored.getState();
  const filters = { ...DEFAULT_DATE_NIGHT_FILTERS, favoritesOnly: true, openNowOnly: false };
  for (const view of [
    active,
    resolve(during, [event], park, { christmasEnabled: false }),
    resolve("2027-01-01T06:00:00Z"),
  ]) {
    assert.deepEqual(Object.keys(preferences), [view.baseVenueId]);
    assert.deepEqual(
      visits.map((visit) => visit.restaurantId),
      [view.baseVenueId],
    );
    assert.deepEqual(
      exclusions.map((exclusion) => exclusion.restaurantId),
      [view.baseVenueId],
    );
    assert.deepEqual(
      eligibleDateNight([park], filters, false, preferences).map((p) => p.id),
      [view.baseVenueId],
    );
    assert.deepEqual(
      eligibleDateNight([park], filters, false, preferences, exclusions, exclusions[0].expiresAt - 1),
      [],
    );
    assert.deepEqual(
      eligibleDateNight([park], filters, false, {
        [view.baseVenueId]: { favorite: true, neverRecommend: true },
      }),
      [],
    );
  }
  assert.deepEqual(dateNightFilters.activityTypes, ["anything"]);
  assert.equal(preferences[active.baseVenueId].cuisineLabel, "Park");
  assert.equal(saved.get("pick-for-us-v1"), serialized);
  assert.doesNotMatch(serialized, /Fixture Lights|christmas-2026|christmas-lights/);
});
