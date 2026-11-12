import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

// The same executable regression runs against the detached reviewed parent by
// setting CHRISTMAS_SELECTION_SOURCE_ROOT. No parent source file is modified.
const root = path.resolve(process.env.CHRISTMAS_SELECTION_SOURCE_ROOT ?? process.cwd());
process.chdir(root);
const pure = appModuleLoader();
const requirePackage = createRequire(import.meta.url);
const { DEFAULT_DATE_NIGHT_FILTERS } = pure(path.join(root, "src/lib/date-night/types.ts"));
const { CHRISTMAS_2026_PILOT } = pure(path.join(root, "src/lib/date-night/christmas-pilot-catalog.ts"));
const { ordinaryFixtureVenues } = pure(path.join(root, "scripts/test-support/christmas-event-search-fixture.ts"));
const location = { lat: 37.1734644, lon: -94.3130247, label: "Synthetic continuity control", source: "manual" };
const placements = CHRISTMAS_2026_PILOT.filter(event => event.kind === "temporary-event").map(event => ({
  eventKey: event.eventKey, hostReference: event.hostReference,
  scope: event.relationship === "fixed-site-and-route" ? "spectator-distance" : "venue-distance",
  ...location, sourceRefs: event.hostSourceRefs,
  review: { status: "reviewed", revision: "synthetic-continuity-only", reviewUrl: "https://example.invalid/continuity-placement", checkedOn: "2026-11-11" },
}));
const textOf = node => Array.isArray(node) ? node.map(textOf).join("") :
  node && typeof node === "object" ? textOf(node.props?.children) : typeof node === "string" ? node : "";
function find(node, predicate) {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  if (!node || typeof node !== "object") return null;
  return predicate(node) ? node : find(node.props?.children, predicate);
}

// Execute real Home, resolver, eligibility and identity code. Only leaf UI,
// React scheduling and the discovery transport are replaced. Browser tests
// independently exercise the real overlays, focus and time transitions.
function home(iso, categories = ["anything"], attractions = CHRISTMAS_2026_PILOT) {
  const modules = new Map();
  const states = [], effects = [];
  let cursor = 0, effectCursor = 0, dirty = false, tree;
  let now = new Date(iso), venues = structuredClone(ordinaryFixtureVenues), receive;
  const store = {
    location, preferences: {}, exclusions: [], sessionShown: [], spookySeasonEnabled: false,
    dateNightFilters: { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15, openNowOnly: false },
    christmasEnabled: true, christmasCategories: categories,
    setDateNightFilters(patch) { store.dateNightFilters = { ...store.dateNightFilters, ...patch }; },
    setChristmasEnabled(value) { store.christmasEnabled = value; },
    setChristmasCategories(value) { store.christmasCategories = value; },
    markShown(id) { store.sessionShown = [...store.sessionShown, id]; },
    excludeTonight(id) { store.exclusions = [...store.exclusions, { restaurantId: id, expiresAt: now.getTime() + 3_600_000 }]; },
  };
  const session = {
    update(_request, handlers) { receive = handlers.onChange; receive({ response: { venues, source: "live" }, loading: false, expanding: false }); },
    dispose() {},
  };
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const source = fs.readFileSync(path.join(root, relative), "utf8");
    const { outputText } = ts.transpileModule(source, { compilerOptions: {
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    } });
    const module = { exports: {} };
    const require = specifier => {
      if (specifier === "react") return {
        ...React, useMemo: fn => fn(),
        useState(initial) {
          const index = cursor++;
          if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
          return [states[index], value => {
            const next = typeof value === "function" ? value(states[index]) : value;
            if (!Object.is(next, states[index])) { states[index] = next; dirty = true; }
          }];
        },
        useEffect(fn, dependencies) {
          const index = effectCursor++, previous = effects[index];
          if (previous && dependencies.every((value, i) => Object.is(value, previous.dependencies[i]))) return;
          previous?.cleanup?.();
          effects[index] = { dependencies, cleanup: fn() };
        },
      };
      if (specifier === "@/lib/store") return { useAppStore: selector => selector(store) };
      if (specifier === "@/lib/date-night/use-clock") return { useDateNightClock: () => now };
      if (specifier === "@/lib/date-night/radial-session") return {
        createDateNightRadialSession: () => session, dateNightRadialProgress: () => "Synthetic discovery complete",
      };
      if (specifier.startsWith("@/components/")) return new Proxy({}, { get: (_target, name) => {
        const Component = props => React.createElement("div", props, props.children);
        Object.defineProperty(Component, "name", { value: name }); return Component;
      } });
      if (specifier.startsWith("@/")) return pure(path.join(root, "src", specifier.slice(2) + ".ts"));
      return requirePackage(specifier);
    };
    new Function("require", "module", "exports", outputText)(require, module, module.exports);
    modules.set(relative, module.exports); return module.exports;
  }
  const { DateNightHome } = load("src/components/date-night-home.tsx");
  const render = () => {
    let renders = 0;
    do {
      dirty = false; cursor = 0; effectCursor = 0;
      tree = DateNightHome({ christmasReview: { placements, attractions } });
      assert.ok(++renders < 20, "Home settles without a render loop");
    } while (dirty);
    return tree;
  };
  const click = label => {
    const node = find(render(), item => typeof item.props?.onClick === "function" && textOf(item) === label);
    assert.ok(node, `Home control exists: ${label}`);
    const random = Math.random;
    try { Math.random = () => 0; node.props.onClick(); } finally { Math.random = random; }
    return render();
  };
  const current = surface => {
    const name = { result: "ResultOverlay", options: "OptionsOverlay", plan: "DateNightPlanOverlay" }[surface];
    const overlay = find(render(), node => node.type?.name === name);
    if (!overlay) return [];
    return surface === "result" ? [overlay.props.restaurant] : overlay.props[surface === "options" ? "restaurants" : "plan"];
  };
  render();
  return {
    store, render, click, current,
    time(value) { now = new Date(value); return render(); },
    discovery(value) { venues = structuredClone(value); receive({ response: { venues, source: "live" }, loading: false, expanding: false }); return render(); },
    dispose() { effects.forEach(effect => effect.cleanup?.()); },
  };
}

const labels = { result: "Pick our date", options: "Give us options", plan: "Plan our outing" };
for (const surface of Object.keys(labels)) {
  test(`${surface}: ordinary selections retain their existing transient discovery recovery`, () => {
    const h = home("2026-12-20T18:00:00-06:00", ["movies"]);
    try {
      h.click(labels[surface]);
      const selected = h.current(surface)[0];
      assert.equal(selected.id, "fixture-ordinary-cinema");
      assert.equal(selected.dateNightEvent, undefined);
      h.discovery([]);
      assert.deepEqual(h.current(surface), []);
      h.discovery(ordinaryFixtureVenues);
      assert.equal(h.current(surface)[0].id, selected.id);
      assert.equal(h.current(surface)[0].dateNightEvent, undefined);
    } finally { h.dispose(); }
  });

  test(`${surface}: a Dec 31 Sparkle selection retires at midnight and never becomes the ordinary park`, () => {
    const h = home("2026-12-31T23:59:59-06:00");
    try {
      h.click(labels[surface]);
      const selected = h.current(surface).find(record => record.dateNightEvent?.researchId === "C26-001");
      assert.ok(selected);
      h.time("2027-01-01T00:00:00-06:00");
      assert.ok(!h.current(surface).some(record => record.id === selected.id), "No event-to-ordinary park substitution");
      h.time("2026-12-31T23:59:59-06:00");
      assert.ok(!h.current(surface).some(record => record.id === selected.id), "Retired selection cannot reopen after eligibility returns");
    } finally { h.dispose(); }
  });

  test(`${surface}: missing provider revision evidence retires Sparkle and recovery requires an explicit new selection`, () => {
    const h = home("2026-12-20T18:00:00-06:00");
    try {
      h.click(labels[surface]);
      const selected = h.current(surface).find(record => record.dateNightEvent?.researchId === "C26-001");
      assert.ok(selected);
      const missing = structuredClone(ordinaryFixtureVenues);
      delete missing[0].discoveryEvidence[0].sourceIdentity.version;
      delete missing[0].discoveryEvidence[0].sourceIdentity.changeset;
      h.discovery(missing);
      assert.ok(!h.current(surface).some(record => record.id === selected.id), "No ordinary park fallback after binding loss");
      h.discovery(ordinaryFixtureVenues);
      assert.ok(!h.current(surface).some(record => record.id === selected.id), "Binding recovery is not a new user choice");
      h.click(labels[surface]);
      assert.ok(h.current(surface).some(record => record.dateNightEvent?.researchId === "C26-001"));
    } finally { h.dispose(); }
  });

  test(`${surface}: Friday gala retires at closing and does not reopen as Saturday's free session`, () => {
    const h = home("2026-12-04T18:59:59-06:00", ["holiday-market"]);
    try {
      h.click(labels[surface]);
      const selected = h.current(surface)[0];
      assert.ok(selected?.dateNightEvent?.activeSessionKey.includes("friday-gala"));
      assert.equal(selected.dateNightEvent.sessions.find(session => session.sessionKey === selected.dateNightEvent.activeSessionKey).admission.priceUsd, 10);
      h.time("2026-12-04T19:00:00-06:00");
      assert.deepEqual(h.current(surface), []);
      h.time("2026-12-05T09:00:00-06:00");
      assert.deepEqual(h.current(surface), [], "Saturday is a different occurrence and needs a new selection");
      h.click(labels[surface]);
      const saturday = h.current(surface)[0].dateNightEvent;
      assert.ok(saturday.activeSessionKey.includes("saturday-market"));
      assert.equal(saturday.sessions.find(session => session.sessionKey === saturday.activeSessionKey).admission.priceUsd, 0);
    } finally { h.dispose(); }
  });

  test(`${surface}: a direct Friday-to-Saturday resume cannot silently replace the selected admission`, () => {
    const h = home("2026-12-04T18:00:00-06:00", ["holiday-market"]);
    try {
      h.click(labels[surface]);
      assert.ok(h.current(surface)[0]?.dateNightEvent?.activeSessionKey.includes("friday-gala"));
      h.time("2026-12-05T10:00:00-06:00");
      assert.deepEqual(h.current(surface), []);
    } finally { h.dispose(); }
  });

  test(`${surface}: a valid same-occurrence refresh preserves the selected gala through opening`, () => {
    const h = home("2026-12-04T17:29:59-06:00", ["holiday-market"]);
    try {
      h.click(labels[surface]);
      const before = h.current(surface)[0].dateNightEvent;
      assert.equal(before.activeSessionKey, null);
      h.time("2026-12-04T17:30:00-06:00");
      const after = h.current(surface)[0].dateNightEvent;
      assert.equal(after.eventKey, before.eventKey);
      assert.deepEqual(after.sessions, before.sessions);
      assert.ok(after.activeSessionKey.includes("friday-gala"));
      assert.equal(after.status, "open-now");
    } finally { h.dispose(); }
  });

  test(`${surface}: two synthetic same-day admissions cannot silently replace one another when the clock skips the gap`, () => {
    // This is a continuity adversary only, not an amendment to real market facts.
    const attractions = CHRISTMAS_2026_PILOT.map(event => event.researchId !== "C26-005" ? event : {
      ...event, sessions: event.sessions.map((session, index) => ({
        ...session, dates: ["2026-12-04"], opens: index ? "18:00" : "09:00", closes: index ? "20:00" : "10:00",
      })),
    });
    const h = home("2026-12-04T09:30:00-06:00", ["holiday-market"], attractions);
    try {
      h.click(labels[surface]);
      assert.ok(h.current(surface)[0]?.dateNightEvent?.activeSessionKey.includes("friday-gala"));
      h.time("2026-12-04T18:30:00-06:00");
      assert.deepEqual(h.current(surface), [], "Same event/date/preference is insufficient for a different admission");
      h.click(labels[surface]);
      assert.ok(h.current(surface)[0]?.dateNightEvent?.activeSessionKey.includes("saturday-market"));
    } finally { h.dispose(); }
  });

  test(`${surface}: opting out retires the event without reviving it on opt-in`, () => {
    const h = home("2026-12-20T18:00:00-06:00");
    try {
      h.click(labels[surface]);
      const selected = h.current(surface).find(record => record.dateNightEvent?.researchId === "C26-001");
      assert.ok(selected);
      h.store.christmasEnabled = false; h.render();
      assert.ok(!h.current(surface).some(record => record.id === selected.id));
      h.store.christmasEnabled = true; h.render();
      assert.ok(!h.current(surface).some(record => record.id === selected.id));
    } finally { h.dispose(); }
  });

  test(`${surface}: an exclusion retires the selected event, and expiration does not reopen it`, () => {
    const h = home("2026-12-20T18:00:00-06:00");
    try {
      h.click(labels[surface]);
      const selected = h.current(surface).find(record => record.dateNightEvent?.researchId === "C26-001");
      assert.ok(selected);
      h.store.excludeTonight(selected.id); h.render();
      assert.ok(!h.current(surface).some(record => record.id === selected.id));
      h.store.exclusions = []; h.render();
      assert.ok(!h.current(surface).some(record => record.id === selected.id));
    } finally { h.dispose(); }
  });
}

test("ordinary-only Christmas plans retain the ordinary selection and working Replan after opt-out and January 1", () => {
  const h = home("2026-12-20T18:00:00-06:00", ["movies"]);
  try {
    h.click("Plan our outing");
    const original = h.current("plan")[0];
    assert.equal(original.id, "fixture-ordinary-cinema");
    h.store.christmasEnabled = false; h.render();
    assert.equal(h.current("plan")[0].id, original.id);
    h.time("2027-01-01T00:00:00-06:00");
    const plan = find(h.render(), node => node.type?.name === "DateNightPlanOverlay");
    assert.equal(plan.props.context, "christmas");
    const random = Math.random;
    try { Math.random = () => 0; plan.props.onReplan(); } finally { Math.random = random; }
    assert.ok(h.current("plan").some(record => record.id === original.id));
  } finally { h.dispose(); }
});
