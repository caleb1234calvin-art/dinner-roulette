import assert from "node:assert/strict";
import test from "node:test";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { CHRISTMAS_2026_PILOT } = load("src/lib/date-night/christmas-pilot-catalog.ts");
const { CHRISTMAS_EVENT_KEYS, SPARKLE_VENUE_ID } = load("src/lib/date-night/christmas-pilot-model.ts");
const { sanitizeChristmasEventSnapshot, savedChristmasEventPresentation, hasSavedChristmasEvent } = load("src/lib/date-night/christmas-saved.ts");

function snapshot(researchId, day) {
  const event = CHRISTMAS_2026_PILOT.find(item => item.researchId === researchId);
  const sessions = event.sessions.flatMap(session => session.dates
    .filter(date => researchId === "C26-005" || date === day).map(date => ({
    sessionKey: `${event.eventKey}/${session.id}/${date}`,
    label: session.label, date, opens: session.opens, closes: session.closes,
    ...(session.announcedStarts ? { announcedStarts: [...session.announcedStarts] } : {}),
    admission: { ...session.admission }, scheduleNote: session.scheduleNote,
    location: structuredClone(event.locations[session.locationId]),
  })));
  assert.ok(sessions.length, "fixture must use an actual catalog occurrence");
  return {
    schemaVersion: 1, edition: "christmas-2026", researchId, eventKey: event.eventKey,
    preferenceKey: researchId === "C26-001" ? SPARKLE_VENUE_ID : event.eventKey,
    kind: event.kind, eventName: event.eventName, category: event.category,
    categoryLabel: researchId === "C26-005" ? "Holiday Market" : event.category,
    host: { name: event.venue.name, address: event.venue.address, sourceRefs: [...event.hostSourceRefs],
      ...(event.permanentVenueId ? { permanentVenueId: event.permanentVenueId } : {}) },
    sessions, recordedAt: `${day}T${day === "2026-12-05" ? "10" : "18"}:00:00-06:00`, status: "open-now", attendanceEligible: true,
    activeSessionKey: sessions.find(session => session.date === day).sessionKey,
    actions: { directions: null, ticketCheckout: null, parking: null, accessibility: null, inventory: null, lastAdmission: null },
  };
}

function browserStorage(t, at = "2026-12-04T18:00:00-06:00") {
  const previousWindow = globalThis.window;
  const previousStorage = globalThis.localStorage;
  const data = new Map();
  const localStorage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
  };
  globalThis.window = { localStorage };
  globalThis.localStorage = localStorage;
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse(at) });
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousStorage === undefined) delete globalThis.localStorage; else globalThis.localStorage = previousStorage;
  });
  const fresh = () => appModuleLoader()("src/lib/store.ts").useAppStore;
  return { data, fresh, store: fresh(), reload: async () => {
    const restored = fresh();
    await restored.persist.rehydrate();
    assert.equal(restored.getState().hydrated, true);
    return restored;
  } };
}
function favorite(store, event) {
  store.getState().toggleFavorite({ restaurantId: event.preferenceKey, name: event.eventName,
    cuisineLabel: event.categoryLabel, address: event.host.address, dateNightEvent: event });
}
function visit(store, event, personalRating = null) {
  store.getState().recordVisit({ restaurantId: event.preferenceKey, restaurantName: event.eventName,
    cuisineLabel: event.categoryLabel, personalRating, dateNightEvent: event });
}
function legacyPreference(id, overrides = {}) {
  return { restaurantId: id, name: "Existing place", favorite: true, ourRating: 4, timesVisited: 3,
    lastVisited: "2026-10-20T18:00:00Z", neverRecommend: false, cuisineLabel: "Park", lat: 37.1, lon: -94.3,
    address: "Existing address", priceLevel: null, photoKey: "cafe", ...overrides };
}

test("market sessions persist one event preference and separate immutable paid/free visit contexts", async t => {
  const storage = browserStorage(t);
  const friday = snapshot("C26-005", "2026-12-04");
  favorite(storage.store, friday);
  visit(storage.store, friday, 4);
  t.mock.timers.setTime(Date.parse("2026-12-05T10:00:00-06:00"));
  const saturday = snapshot("C26-005", "2026-12-05");
  visit(storage.store, saturday);
  const fridayViewedSaturday = savedChristmasEventPresentation(friday, new Date());
  assert.equal(fridayViewedSaturday.activeSessionKey, friday.activeSessionKey);
  assert.equal(fridayViewedSaturday.recordedAt, friday.recordedAt);
  assert.equal(fridayViewedSaturday.attendanceEligible, false);
  t.mock.timers.setTime(Date.parse("2027-01-01T00:00:00-06:00"));
  const restored = (await storage.reload()).getState();
  assert.deepEqual(Object.keys(restored.preferences), [friday.eventKey]);
  assert.equal(restored.preferences[friday.eventKey].favorite, true);
  assert.equal(restored.preferences[friday.eventKey].ourRating, 4);
  assert.equal(restored.preferences[friday.eventKey].timesVisited, 2);
  assert.deepEqual(restored.visits.map(record => record.restaurantId), [friday.eventKey, friday.eventKey]);
  const [free, paid] = restored.visits.map(record => savedChristmasEventPresentation(record.dateNightEvent, new Date()));
  const [savedSaturday, savedFriday] = restored.visits.map(record => record.dateNightEvent);
  assert.equal(savedSaturday.recordedAt, saturday.recordedAt);
  assert.equal(savedFriday.recordedAt, friday.recordedAt);
  const freeSession = savedSaturday.sessions.find(session => session.sessionKey === savedSaturday.activeSessionKey);
  const paidSession = savedFriday.sessions.find(session => session.sessionKey === savedFriday.activeSessionKey);
  assert.equal(freeSession.admission.priceUsd, 0);
  assert.equal(paidSession.admission.priceUsd, 10);
  assert.match(paidSession.sessionKey, /friday-gala\/2026-12-04$/);
  assert.match(freeSession.sessionKey, /saturday-market\/2026-12-05$/);
  assert.equal(paidSession.closes, "19:00");
  assert.equal(freeSession.closes, "14:00");
  for (const event of [paid, free]) {
    assert.equal(event.sessions.length, 2, "both dated admissions remain readable from Favorites and History");
    assert.equal(event.status, "expired");
    assert.equal(event.attendanceEligible, false);
    assert.ok(Object.values(event.actions).every(value => value === null));
  }
  assert.equal(restored.preferences["date-night-osm-way-437235888"], undefined);
  assert.match(storage.data.get("pick-for-us-v1"), /Friday gala/);
});

test("school fair and market favorites, ratings and exclusions never become host preferences", async t => {
  const storage = browserStorage(t, "2026-12-05T10:00:00-06:00");
  const fair = snapshot("C26-010", "2026-12-05");
  const market = snapshot("C26-005", "2026-12-05");
  for (const event of [fair, market]) {
    favorite(storage.store, event);
    storage.store.getState().setRating(event.preferenceKey, 1);
    visit(storage.store, event);
    storage.store.getState().excludeTonight(event.preferenceKey, event.eventName);
  }
  const restored = (await storage.reload()).getState();
  assert.deepEqual(Object.keys(restored.preferences).sort(), [fair.eventKey, market.eventKey].sort());
  for (const event of [fair, market]) {
    assert.equal(restored.preferences[event.eventKey].neverRecommend, true);
    assert.equal(restored.preferences[event.eventKey].ourRating, 1);
    assert.equal(restored.exclusions.filter(item => item.restaurantId === event.eventKey).length, 1);
  }
  assert.deepEqual(restored.preferences[fair.eventKey].dateNightEvent.sessions[0].location.publicSpaces,
    ["Cafeteria", "Hallways", "Auxiliary gym"]);
});

test("Sparkle keeps the permanent park key and legacy metadata, ratings, history and exclusions", async t => {
  const storage = browserStorage(t);
  const park = legacyPreference(SPARKLE_VENUE_ID, { name: "Central Park", ourRating: 1, neverRecommend: true });
  const unrelated = legacyPreference("ordinary-dinner", { cuisineLabel: "American" });
  const oldVisit = { id: "old-park-visit", restaurantId: park.restaurantId, restaurantName: park.name,
    cuisineLabel: "Park", date: park.lastVisited, personalRating: 1, note: "Before Christmas" };
  const oldExclusion = { restaurantId: park.restaurantId, name: park.name, expiresAt: Date.now() + 3600000, reason: "not-tonight" };
  storage.store.setState({ preferences: { [park.restaurantId]: park, [unrelated.restaurantId]: unrelated },
    visits: [oldVisit], exclusions: [oldExclusion] });
  const lights = snapshot("C26-001", "2026-12-04");
  visit(storage.store, lights);
  const restored = (await storage.reload()).getState();
  const savedPark = restored.preferences[park.restaurantId];
  for (const field of ["restaurantId", "name", "favorite", "ourRating", "neverRecommend", "cuisineLabel", "photoKey", "lat", "lon", "address", "priceLevel"]) {
    assert.deepEqual(savedPark[field], park[field], field);
  }
  assert.equal(savedPark.timesVisited, park.timesVisited + 1);
  assert.deepEqual(restored.preferences[unrelated.restaurantId], unrelated);
  assert.deepEqual(restored.visits[1], oldVisit);
  assert.deepEqual(restored.exclusions, [oldExclusion]);
  assert.equal(restored.visits[0].restaurantId, park.restaurantId);
  assert.equal(restored.visits[0].dateNightEvent.eventName, "Sparkle in the Park");
  assert.equal(restored.preferences[lights.eventKey], undefined);
  favorite(storage.store, lights);
  assert.equal(storage.store.getState().preferences[park.restaurantId].name, "Central Park");
});

test("temporary exclusions expire at their saved cutoff without deleting favorites or event history", async t => {
  const storage = browserStorage(t);
  const market = snapshot("C26-005", "2026-12-04");
  favorite(storage.store, market);
  visit(storage.store, market);
  storage.store.getState().excludeTonight(market.preferenceKey, market.eventName);
  storage.store.getState().excludeTonight("ordinary-dinner", "Ordinary dinner");
  const cutoff = storage.store.getState().exclusions[0].expiresAt;
  t.mock.timers.setTime(cutoff - 1);
  assert.equal((await storage.reload()).getState().exclusions.length, 2);
  t.mock.timers.setTime(cutoff);
  const restored = (await storage.reload()).getState();
  assert.deepEqual(restored.exclusions, []);
  assert.equal(restored.preferences[market.eventKey].favorite, true);
  assert.equal(restored.visits[0].dateNightEvent.sessions[0].admission.priceUsd, 10);
});

test("Christmas categories and opt-out persist separately from ordinary and Halloween selections", async t => {
  const storage = browserStorage(t);
  storage.store.getState().setDateNightFilters({ activityTypes: ["movies", "bowling"], mood: 71 });
  storage.store.getState().setChristmasCategories(["holiday-market"]);
  storage.store.getState().setChristmasEnabled(false);
  storage.store.getState().setSpookySeasonEnabled(true);
  storage.store.getState().setDateNightFilters({ activityTypes: ["holiday-market"] });
  t.mock.timers.setTime(Date.parse("2027-01-01T00:00:00-06:00"));
  const restored = (await storage.reload()).getState();
  assert.deepEqual(restored.dateNightFilters.activityTypes, ["movies", "bowling"]);
  assert.equal(restored.dateNightFilters.mood, 71);
  assert.deepEqual(restored.christmasCategories, ["holiday-market"]);
  assert.equal(restored.christmasEnabled, false);
  assert.equal(restored.spookySeasonEnabled, true);
  restored.setDateNightFilters({ activityTypes: ["haunted-house"] });
  restored.setChristmasEnabled(true);
  assert.deepEqual(storage.store.getState().dateNightFilters.activityTypes, ["movies", "bowling"]);
  const again = (await storage.reload()).getState();
  assert.deepEqual(again.dateNightFilters.activityTypes, ["haunted-house"]);
  assert.deepEqual(again.christmasCategories, ["holiday-market"]);
});

test("wrong-host or wrong-edition snapshot cannot rewrite a permanent preference or save a visit", t => {
  const { store } = browserStorage(t);
  const park = legacyPreference(SPARKLE_VENUE_ID);
  store.setState({ preferences: { [SPARKLE_VENUE_ID]: park } });
  const market = snapshot("C26-005", "2026-12-04");
  for (const forged of [
    { ...market, preferenceKey: SPARKLE_VENUE_ID },
    { ...market, edition: "christmas-2027" },
    { ...market, eventKey: CHRISTMAS_EVENT_KEYS["C26-001"] },
    { ...market, kind: "permanent-venue-display", host: { ...market.host, permanentVenueId: SPARKLE_VENUE_ID } },
  ]) {
    store.getState().toggleFavorite({ restaurantId: SPARKLE_VENUE_ID, name: market.eventName, dateNightEvent: forged });
    store.getState().recordVisit({ restaurantId: SPARKLE_VENUE_ID, restaurantName: market.eventName,
      cuisineLabel: market.categoryLabel, personalRating: null, dateNightEvent: forged });
  }
  assert.deepEqual(store.getState().preferences, { [SPARKLE_VENUE_ID]: park });
  assert.deepEqual(store.getState().visits, []);
});

test("reload strips saved action capabilities and isolates malformed event metadata from ordinary fallback", async t => {
  const storage = browserStorage(t);
  const market = snapshot("C26-005", "2026-12-04");
  const forged = { ...market, attendanceEligible: true, publicationEnabled: true,
    actions: { directions: "https://maps.invalid/unverified-door", ticketCheckout: "https://tickets.invalid/buy" } };
  const legacy = legacyPreference("ordinary-dinner");
  const missing = legacyPreference(CHRISTMAS_EVENT_KEYS["C26-010"]);
  storage.data.set("pick-for-us-v1", JSON.stringify({ version: 0, state: {
    preferences: {
      [market.eventKey]: { ...legacyPreference(market.eventKey), dateNightEvent: forged },
      [SPARKLE_VENUE_ID]: { ...legacyPreference(SPARKLE_VENUE_ID), dateNightEvent: market },
      [missing.restaurantId]: missing,
      [legacy.restaurantId]: legacy,
      "invalid-null-event": { ...legacyPreference("invalid-null-event"), dateNightEvent: null },
    },
    visits: [{ id: "invalid-visit", restaurantId: SPARKLE_VENUE_ID, restaurantName: market.eventName,
      cuisineLabel: market.categoryLabel, personalRating: null, date: new Date().toISOString(), note: "", dateNightEvent: market }],
    dateNightFilters: { activityTypes: ["holiday-market"] }, christmasCategories: ["holiday-market", "invalid"],
  } }));
  const store = await storage.reload();
  const { preferences, visits, dateNightFilters } = store.getState();
  const sanitized = preferences[market.eventKey].dateNightEvent;
  assert.equal(sanitized.attendanceEligible, false);
  assert.equal(sanitized.publicationEnabled, undefined);
  assert.ok(Object.values(sanitized.actions).every(value => value === null));
  for (const record of [preferences[SPARKLE_VENUE_ID], preferences[missing.restaurantId], preferences["invalid-null-event"], visits[0]]) {
    assert.equal(hasSavedChristmasEvent(record), true);
    assert.equal(record.dateNightEventUnavailable, true);
    assert.equal(record.dateNightEvent, undefined);
  }
  assert.deepEqual(preferences[legacy.restaurantId], legacy);
  assert.deepEqual(dateNightFilters.activityTypes, ["anything"]);
  assert.deepEqual(store.getState().christmasCategories, ["holiday-market"]);
  store.getState().toggleFavorite({ restaurantId: missing.restaurantId, name: missing.name });
  assert.equal(store.getState().preferences[missing.restaurantId].favorite, false);
  store.getState().toggleFavorite({ restaurantId: missing.restaurantId, name: missing.name });
  assert.equal(store.getState().preferences[missing.restaurantId].favorite, false);
});

test("saved parade retains fixed square and route sessions, announced starts and unknown finish", () => {
  const parade = snapshot("C26-007", "2026-12-07");
  const clean = sanitizeChristmasEventSnapshot(parade, parade.preferenceKey);
  assert.ok(clean);
  assert.deepEqual(clean.sessions.map(session => session.location.kind), ["fixed-site", "route"]);
  assert.ok(clean.sessions.every(session => session.closes === null));
  assert.deepEqual(clean.sessions[0].announcedStarts, ["17:30", "18:15", "18:30"]);
  const squareOnly = { ...parade, sessions: [parade.sessions[0]] };
  for (const [time, status] of [["18:00", "end-time-unknown"], ["18:30", "end-time-unknown"], ["18:31", "past-announced-start"]]) {
    const display = savedChristmasEventPresentation(squareOnly, new Date(`2026-12-07T${time}:00-06:00`));
    assert.equal(display.status, status);
    assert.equal(display.attendanceEligible, false);
    assert.equal(display.actions.directions, null);
  }
  assert.equal(savedChristmasEventPresentation(parade, new Date("2026-12-07T19:01:00-06:00")).status, "past-announced-start");
  assert.equal(savedChristmasEventPresentation(parade, new Date("2026-12-07T19:00:00.001-06:00")).status, "past-announced-start");
  assert.equal(savedChristmasEventPresentation(parade, new Date("2026-12-08T00:00:00-06:00")).status, "expired");
});

test("invalid saved schedules, duplicate sessions and source protocols fail closed", () => {
  const market = snapshot("C26-005", "2026-12-04");
  for (const invalid of [
    { ...market, sessions: [...market.sessions, ...market.sessions] },
    { ...market, sessions: [{ ...market.sessions[0], closes: "02:00" }] },
    { ...market, sessions: [{ ...market.sessions[0], date: "2026-02-30" }] },
    { ...market, sessions: [{ ...market.sessions[0], announcedStarts: ["25:00"] }] },
    { ...market, sessions: [{ ...market.sessions[0], announcedStarts: ["17:00"] }] },
    { ...market, host: { ...market.host, sourceRefs: ["javascript:alert(1)"] } },
  ]) assert.equal(sanitizeChristmasEventSnapshot(invalid), null);
});
