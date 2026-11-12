// Real component render/action tests. Hooks, portal transport and Button are the
// only substitutes; event validation, clocks and every surface execute as shipped.
// Browser layout, hydration and persistence acceptance is a separate suite.
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const requirePackage = createRequire(import.meta.url);
const app = appModuleLoader();
const { CHRISTMAS_2026_PILOT } = app("src/lib/date-night/christmas-pilot-catalog.ts");
const { SPARKLE_VENUE_ID } = app("src/lib/date-night/christmas-pilot-model.ts");
const labels = { "christmas-lights": "Christmas Lights", "holiday-market": "Holiday Market", "holiday-craft-fair": "Holiday Craft Fair", "holiday-community-event": "Holiday Community Event" };

function fixture(researchId) {
  const attraction = CHRISTMAS_2026_PILOT.find(item => item.researchId === researchId);
  const sessions = attraction.sessions.flatMap(session => session.dates
    .filter(date => researchId !== "C26-001" || date === "2026-12-04")
    .map(date => ({ sessionKey: `${attraction.eventKey}/${session.id}/${date}`, date, label: session.label,
      opens: session.opens, closes: session.closes, admission: session.admission,
      scheduleNote: session.scheduleNote, location: attraction.locations[session.locationId],
      ...(session.announcedStarts ? { announcedStarts: session.announcedStarts } : {}),
    })));
  const dateNightEvent = {
    schemaVersion: 1, edition: attraction.edition, eventKey: attraction.eventKey,
    preferenceKey: attraction.permanentVenueId ?? attraction.eventKey, kind: attraction.kind,
    researchId, eventName: attraction.eventName, category: attraction.category,
    categoryLabel: labels[attraction.category],
    host: { name: attraction.venue.name, address: attraction.venue.address, sourceRefs: attraction.hostSourceRefs,
      ...(attraction.permanentVenueId ? { permanentVenueId: attraction.permanentVenueId } : {}) },
    sessions, recordedAt: "2026-12-04T23:45:00.000Z", status: "open-now", attendanceEligible: true,
    activeSessionKey: sessions[0].sessionKey,
    actions: { directions: null, ticketCheckout: null, parking: null, accessibility: null, inventory: null, lastAdmission: null },
  };
  // Poison the compatibility record with tempting ordinary host data. Event
  // renderers must take every public event fact and capability from the snapshot.
  return { id: dateNightEvent.preferenceKey, dateNightEvent,
    name: "UNRELATED HOST NAME", cuisineLabel: "Ordinary host category", address: "WRONG HOST ENTRANCE",
    website: "https://unrelated.example/tickets", phone: "1234567890", lat: 37.1, lon: -94.3,
    openingHours: "24/7", isOpen: true, hoursKnown: true, closesLabel: "HOST OPEN ALL NIGHT",
    distanceMiles: 1, activityTypes: ["park"], photoKey: "american", priceLevel: 4,
  };
}

function harness({ value = "2026-12-04T23:45:00Z", preferences = {}, visits = [] } = {}) {
  const modules = new Map(), frames = new Map(), calls = { favorites: [], visits: [], selected: [], closed: 0 };
  const now = { value: new Date(value) };
  const store = { theme: "dark", spookySeasonEnabled: false, preferences, visits,
    location: { lat: 37.1, lon: -94.3 },
    toggleFavorite(item) { calls.favorites.push(item); }, recordVisit(item) { calls.visits.push(item); },
  };
  let currentFrame;
  function load(file) {
    if (modules.has(file)) return modules.get(file);
    const module = { exports: {} };
    const out = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const require = specifier => {
      if (specifier === "react") return { ...React, useMemo: fn => fn(), useEffect: () => {},
        useState(initial) {
          const frame = currentFrame, index = frame.cursor++;
          if (!(index in frame.values)) frame.values[index] = index === 0 && typeof initial === "boolean"
            ? true : typeof initial === "function" ? initial() : initial;
          return [frame.values[index], value => { frame.values[index] = typeof value === "function" ? value(frame.values[index]) : value; }];
        },
      };
      if (specifier === "react-dom") return { createPortal: value => value };
      if (specifier === "@/lib/store") return { useAppStore: selector => selector(store) };
      if (specifier === "@/lib/date-night/use-clock") return { useDateNightClock: () => now.value };
      if (specifier === "@/components/ui/button") return { Button: ({ asChild, variant: _variant, size: _size, children, ...props }) => asChild
        ? React.cloneElement(React.Children.only(children), props) : React.createElement("button", props, children) };
      if (specifier.startsWith("@/components/")) return load(path.join("src", `${specifier.slice(2)}.tsx`));
      if (specifier.startsWith("@/")) return app(path.join("src", `${specifier.slice(2)}.ts`));
      return requirePackage(specifier);
    };
    new Function("require", "module", "exports", out)(require, module, module.exports);
    modules.set(file, module.exports);
    return module.exports;
  }
  function expand(node, key = "root") {
    if (Array.isArray(node)) return node.map((item, index) => {
      const child = expand(item, `${key}/${index}`);
      return React.isValidElement(child) ? React.cloneElement(child, { key: item?.key ?? `${key}/${index}` }) : child;
    });
    if (!React.isValidElement(node)) return node;
    if (typeof node.type === "function") {
      const name = `${key}/${node.type.name}`;
      const frame = frames.get(name) ?? { values: [], cursor: 0 };
      frames.set(name, frame); frame.cursor = 0;
      const previous = currentFrame; currentFrame = frame;
      const rendered = node.type(node.props); currentFrame = previous;
      return expand(rendered, name);
    }
    return React.cloneElement(node, {}, expand(node.props.children, `${key}/children`));
  }
  function render(file, name, props = {}) {
    const previousDocument = globalThis.document;
    if (previousDocument === undefined) globalThis.document = { body: {} };
    try {
      return expand(React.createElement(load(`src/components/${file}.tsx`)[name], props));
    } finally {
      if (previousDocument === undefined) delete globalThis.document;
    }
  }
  return { calls, now, store, render, html: tree => renderToStaticMarkup(tree) };
}
function all(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(item => all(item, predicate));
  if (!React.isValidElement(node)) return [];
  return [...(predicate(node) ? [node] : []), ...all(node.props.children, predicate)];
}
const text = node => Array.isArray(node) ? node.map(text).join("") : React.isValidElement(node) ? text(node.props.children) : typeof node === "string" || typeof node === "number" ? String(node) : "";
const button = (tree, label) => all(tree, node => node.type === "button" && text(node) === label)[0];
const resultProps = record => ({ restaurant: record, mode: "date-night", reelNames: [], skipSpin: true, onClose() {}, onReroll() {}, onNotTonight() {} });
function assertEventSafety(tree, h) {
  const html = h.html(tree);
  assert.doesNotMatch(html, /UNRELATED HOST NAME|WRONG HOST ENTRANCE|HOST OPEN ALL NIGHT|unrelated\.example|1234567890/);
  assert.equal(all(tree, node => node.type === "img").length, 0, "event must not manufacture category or host artwork");
  assert.equal(all(tree, node => node.type === "a" && /maps|uber|lyft|tickets|checkout/.test(node.props.href ?? "")).length, 0);
  const unavailable = all(tree, node => node.type === "button" && /Directions unavailable|Ticket checkout unavailable/.test(text(node)));
  assert.ok(unavailable.length >= 2);
  assert.ok(unavailable.every(node => node.props.disabled === true));
  return html;
}

test("Result uses event session price and verified host facts, preserves event favorite and visit identity", () => {
  const h = harness(), record = fixture("C26-005");
  const render = () => h.render("result-overlay", "ResultOverlay", resultProps(record));
  let tree = render();
  const html = assertEventSafety(tree, h);
  assert.match(html, /Olde World Christmas Market/);
  assert.match(html, /Grace Episcopal Church/);
  assert.match(html, /\$10 admission/);
  assert.match(html, /Free public admission/);
  assert.match(html, /Dec 4, 2026/);
  assert.match(html, /Dec 5, 2026/);
  assert.match(html, /5:30 p\.m\.–7 p\.m\./);
  assert.match(html, /9 a\.m\.–2 p\.m\./);
  assert.match(html, /Visitor entrance unconfirmed/);
  button(tree, "Save").props.onClick();
  assert.equal(h.calls.favorites[0].restaurantId, record.id);
  assert.equal(h.calls.favorites[0].dateNightEvent.preferenceKey, record.id);
  assert.equal(h.calls.favorites[0].lat, undefined);
  button(tree, "We did this").props.onClick(); tree = render();
  button(tree, "Save choice").props.onClick();
  assert.equal(h.calls.visits[0].restaurantName, "Olde World Christmas Market");
  assert.equal(h.calls.visits[0].restaurantId, record.id);
  assert.equal(h.calls.visits[0].dateNightEvent.sessions.length, 2);
});

test("Four Options deduplicates one event across sessions and refreshes closed interval eligibility", () => {
  const h = harness(), record = fixture("C26-005");
  const props = { restaurants: [record, structuredClone(record)], mode: "date-night", onClose() {}, onShuffle() {}, onNotTonight() {}, onSelect: item => h.calls.selected.push(item) };
  let tree = h.render("options-overlay", "OptionsOverlay", props);
  assertEventSafety(tree, h);
  assert.equal(all(tree, node => node.props["data-christmas-surface"] === "options").length, 1);
  button(tree, "Choose event").props.onClick(); assert.equal(h.calls.selected[0].id, record.id);
  h.now.value = new Date("2026-12-05T01:00:00Z"); // Gala closes, 7 p.m. Chicago.
  tree = h.render("options-overlay", "OptionsOverlay", props);
  assert.equal(button(tree, "Schedule only").props.disabled, true);
  assert.equal(button(tree, "Choose event"), undefined);
  assert.doesNotMatch(h.html(tree), /Open now according/);
});

test("Plan separates fixed square from route and becomes schedule-only after last announced start", () => {
  const h = harness({ value: "2026-12-08T01:01:00Z" });
  const parade = fixture("C26-007");
  const tree = h.render("date-night-plan-overlay", "DateNightPlanOverlay", { plan: [parade, parade], onClose() {}, onReplan() {} });
  const html = assertEventSafety(tree, h);
  assert.match(html, /Published schedules/);
  assert.match(html, /Fixed site:/);
  assert.match(html, /Parade route:/);
  assert.match(html, /Finishing time unconfirmed/);
  assert.match(html, /last announced start has passed/);
  assert.doesNotMatch(html, /Open now according|Your event plan|Scare|Settle/);
  assert.equal(all(tree, node => node.type === "article").length, 1);
});

test("Fair shows public event spaces without claiming general school access or host actions", () => {
  const h = harness({ value: "2026-12-05T17:00:00Z" });
  const tree = h.render("result-overlay", "ResultOverlay", resultProps(fixture("C26-010")));
  const html = assertEventSafety(tree, h);
  assert.match(html, /Neosho High School/);
  assert.match(html, /cafeteria/i); assert.match(html, /hallways/i); assert.match(html, /auxiliary gym/i);
  assert.match(html, /9 a\.m\.–3 p\.m\./);
});

test("Favorites and History retain expired event snapshots without restoring attendance or host navigation", () => {
  const market = fixture("C26-005"), fair = fixture("C26-010");
  const preference = { restaurantId: market.id, name: "UNRELATED HOST NAME", favorite: true, dateNightEvent: market.dateNightEvent, lat: 37.1, lon: -94.3 };
  const visit = { id: "visit-fair", restaurantId: fair.id, restaurantName: "UNRELATED HOST NAME", date: "2026-12-05T17:00:00Z", personalRating: 4, dateNightEvent: fair.dateNightEvent, note: "Our saved fair note" };
  const h = harness({ value: "2027-01-01T06:00:00Z", preferences: { [market.id]: preference }, visits: [visit] });
  const favorites = h.render("favorites-page", "FavoritesPage");
  const history = h.render("history-page", "HistoryPage");
  assert.match(assertEventSafety(favorites, h), /Olde World Christmas Market/);
  assert.match(assertEventSafety(history, h), /NEWcaps Holiday Craft Fair/);
  for (const tree of [favorites, history]) {
    assert.match(h.html(tree), /Saved event details — not a current attendance recommendation/);
    assert.doesNotMatch(h.html(tree), /Open now according|Choose event/);
  }
  all(favorites, node => node.type === "button" && node.props["aria-label"] === "Remove Olde World Christmas Market")[0].props.onClick();
  assert.equal(h.calls.favorites[0].restaurantId, market.id);
  assert.match(h.html(history), /Our saved fair note/);
});

test("Malformed and mismatched event markers cannot fall back to ordinary host fields on any surface", () => {
  const record = fixture("C26-001"); record.dateNightEvent = { ...record.dateNightEvent, preferenceKey: "unrelated" };
  const h = harness({ preferences: { bad: { restaurantId: SPARKLE_VENUE_ID, name: "UNRELATED HOST NAME", favorite: true, lat: 37.1, lon: -94.3, dateNightEvent: record.dateNightEvent } },
    visits: [{ id: "bad", restaurantId: SPARKLE_VENUE_ID, restaurantName: "UNRELATED HOST NAME", date: "2026-12-04T23:45:00Z", dateNightEvent: record.dateNightEvent }] });
  const trees = [h.render("result-overlay", "ResultOverlay", resultProps(record)),
    h.render("options-overlay", "OptionsOverlay", { restaurants: [record], mode: "date-night", onClose() {}, onSelect() {}, onShuffle() {}, onNotTonight() {} }),
    h.render("date-night-plan-overlay", "DateNightPlanOverlay", { plan: [record], onClose() {}, onReplan() {} }),
    h.render("favorites-page", "FavoritesPage"), h.render("history-page", "HistoryPage")];
  for (const tree of trees) {
    assert.match(h.html(tree), /details unavailable|information could not be verified/i);
    assert.doesNotMatch(h.html(tree), /UNRELATED HOST NAME|WRONG HOST ENTRANCE|unrelated\.example/);
    assert.equal(all(tree, node => node.type === "a" && /maps|uber|lyft|tickets/.test(node.props.href ?? "")).length, 0);
  }
});

test("Park saves the canonical permanent preference key while legacy venue-only records keep ordinary UI", () => {
  const record = fixture("C26-001"), h = harness();
  const tree = h.render("result-overlay", "ResultOverlay", resultProps(record));
  assert.match(assertEventSafety(tree, h), /5 p\.m\.–midnight/);
  button(tree, "Save").props.onClick();
  assert.equal(h.calls.favorites[0].restaurantId, SPARKLE_VENUE_ID);
  assert.equal(h.calls.favorites[0].dateNightEvent.host.permanentVenueId, SPARKLE_VENUE_ID);
  h.store.preferences["ordinary-cafe"] = { restaurantId: "ordinary-cafe", name: "Legacy café", favorite: true, cuisineLabel: "Coffee", lat: 37.1, lon: -94.3 };
  const saved = h.render("favorites-page", "FavoritesPage");
  assert.match(h.html(saved), /Legacy café/);
  assert.equal(all(saved, node => node.props["data-christmas-surface"]).length, 0);
  assert.ok(all(saved, node => node.type === "a" && text(node).includes("Directions")).length > 0);
});

test("Unavailable marker and bare edition ID remain event-safe on live surfaces", () => {
  for (const mode of ["marker", "namespace", "null"]) {
    const record = fixture("C26-005");
    if (mode === "marker") { delete record.dateNightEvent; record.dateNightEventUnavailable = true; record.id = "legacy-association"; }
    if (mode === "namespace") delete record.dateNightEvent;
    if (mode === "null") { record.dateNightEvent = null; record.id = SPARKLE_VENUE_ID; }
    const h = harness();
    const trees = [h.render("result-overlay", "ResultOverlay", resultProps(record)),
      h.render("options-overlay", "OptionsOverlay", { restaurants: [record], mode: "date-night", onClose() {}, onSelect() {}, onShuffle() {}, onNotTonight() {} }),
      h.render("date-night-plan-overlay", "DateNightPlanOverlay", { plan: [record], onClose() {}, onReplan() {} })];
    for (const tree of trees) {
      const html = h.html(tree);
      assert.match(html, /details unavailable/i, mode);
      assert.doesNotMatch(html, /UNRELATED HOST NAME|HOST OPEN ALL NIGHT|unrelated\.example|1234567890|WRONG HOST ENTRANCE/, mode);
      assert.equal(all(tree, node => node.type === "img").length, 0, mode);
    }
  }
});

test("Mixed Plan preserves ordinary navigation while event schedules do not claim a timed itinerary", () => {
  const h = harness({ value: "2026-12-05T17:00:00Z" });
  const ordinary = { id: "date-night-ordinary-cafe", name: "Ordinary café", cuisineLabel: "Coffee", address: "Ordinary address", lat: 37.2, lon: -94.4,
    hoursKnown: true, isOpen: true, activityTypes: ["coffee"], distanceMiles: 1 };
  const tree = h.render("date-night-plan-overlay", "DateNightPlanOverlay", { plan: [fixture("C26-010"), ordinary], onClose() {}, onReplan() {} });
  const html = h.html(tree);
  assert.match(html, /NEWcaps Holiday Craft Fair/); assert.match(html, /Ordinary café/);
  assert.match(html, /Travel time and a combined itinerary have not been verified/);
  const directions = all(tree, node => node.type === "a" && /google\.com\/maps/.test(node.props.href ?? ""));
  assert.equal(directions.length, 1);
  assert.match(directions[0].props.href, /37.2%2C-94.4/);
  assert.equal(button(tree, "Directions unavailable").props.disabled, true);
});

test("Compact event Options retain every announced square activity start", () => {
  const h = harness({ value: "2026-12-07T23:00:00Z" });
  const tree = h.render("options-overlay", "OptionsOverlay", { restaurants: [fixture("C26-007")], mode: "date-night", onClose() {}, onSelect() {}, onShuffle() {}, onNotTonight() {} });
  const html = assertEventSafety(tree, h);
  assert.match(html, /caroling/i); assert.match(html, /dance/i); assert.match(html, /lighting/i);
  assert.match(html, /6:15/); assert.match(html, /6:30/);
  assert.match(html, /Reviewed square address/); assert.match(html, /Parade route/);
});

test("Ordinary-only Christmas Plan uses explicit context and does not enter Halloween renderer", () => {
  const h = harness();
  const ordinary = { id: "date-night-ordinary-cafe", name: "Ordinary café", cuisineLabel: "Coffee", address: "Ordinary address", lat: 37.2, lon: -94.4,
    hoursKnown: true, isOpen: true, activityTypes: ["coffee"], distanceMiles: 1 };
  const tree = h.render("date-night-plan-overlay", "DateNightPlanOverlay", { plan: [ordinary], context: "christmas", onClose() {}, onReplan() {} });
  const html = h.html(tree);
  assert.match(html, /Ordinary café/); assert.match(html, /Date Night plan candidates/);
  assert.doesNotMatch(html, /October|Scare|Settle|Halloween/);
});

test("Expired park Favorite keeps canonical venue heading; market History identifies Friday paid occurrence", () => {
  const park = fixture("C26-001"), market = fixture("C26-005");
  const h = harness({ value: "2027-01-01T06:00:00Z", preferences: { [park.id]: {
    restaurantId: park.id, name: "Central Park", cuisineLabel: "Park", favorite: true, dateNightEvent: park.dateNightEvent,
  } }, visits: [{ id: "friday-gala", restaurantId: market.id, restaurantName: market.dateNightEvent.eventName, date: "2026-12-04T23:45:00Z", dateNightEvent: market.dateNightEvent }] });
  const favorites = h.render("favorites-page", "FavoritesPage");
  assert.equal(text(all(favorites, node => node.type === "h2")[0]), "Central Park");
  assert.match(h.html(favorites), /Saved Christmas event: Sparkle in the Park/);
  const history = h.render("history-page", "HistoryPage");
  assert.match(h.html(history), /Recorded occurrence: 2026-12-04/);
  assert.match(h.html(history), /gala/i);
  assert.match(h.html(history), /\$10 admission/); assert.match(h.html(history), /Free public admission/);
});
