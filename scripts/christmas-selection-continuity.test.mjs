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
const reviewedPark = JSON.parse(fs.readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8")).element;
const parkId = "date-night-osm-way-987588580";
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

// Feed real search output into Home's discovery callback. This reproduces the
// group-loss defect without manufacturing the uncertainty field in the test.
// The extra cinema is a controlled ordinary choice, not another provider fact.
async function providerRefresh(t, mode) {
  const school = { ...structuredClone(reviewedPark), version: 3, changeset: 189037688,
    tags: { ...reviewedPark.tags, amenity: "school" } };
  delete school.tags.leisure;
  const fillers = Array.from({ length: 19_998 }, (_, index) => ({
    type: "node", id: 10_000_000 + index, tags: { amenity: "school" },
  }));
  const oversized = [...fillers, fillers[0], fillers[0]];
  if (mode === "oversized-first") oversized.unshift(school);
  else oversized.push(school);
  assert.equal(oversized.length, 20_001);
  const calls = { culture: 0, outdoor: 0 };
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    const query = new URLSearchParams(init.body).get("data");
    const selected = query.split(")->.lifecycle_context;\n").at(-1);
    const culture = selected.includes('nwr["amenity"="cinema"](around:');
    calls[culture ? "culture" : "outdoor"] += 1;
    if (culture && mode === "exhausted") throw new Error("Controlled exhausted culture mirrors");
    return { ok: true, json: async () => ({ elements: culture ? mode === "complete" ? [] : oversized : [reviewedPark] }) };
  });
  const { searchDateNight } = pure(path.join(root, "src/lib/date-night/search.ts"));
  const response = await searchDateNight({ data: {
    lat: location.lat, lon: location.lon, radiusMiles: 15, activityTypes: ["movies", "park"], spookySeasonEnabled: false, patchId: "radial-v1:core",
  } });
  assert.equal(calls.outdoor, 1, "Reviewed outdoor source succeeds independently");
  assert.equal(calls.culture, mode === "complete" ? 1 : 4, "The failed culture group exhausts all four attempts");
  const park = response.venues.filter(place => place.id === parkId);
  assert.equal(park.length, 1, "The valid reviewed outdoor row remains present; retirement cannot be caused by an empty discovery pool");
  assert.equal(response.venues.some(place => place.activityTypes.includes("school")), false);
  return [...park, structuredClone(ordinaryFixtureVenues[1])];
}

for (const surface of Object.keys(labels)) {
  for (const mode of ["oversized-first", "oversized-last", "exhausted"]) {
    test(`${surface}: provider uncertainty ${mode} retires Sparkle without ordinary substitution or automatic revival`, async t => {
      const h = home("2026-12-20T18:00:00-06:00");
      try {
        h.discovery(await providerRefresh(t, "complete"));
        h.click(labels[surface]);
        const before = h.current(surface);
        assert.ok(before.some(record => record.dateNightEvent?.researchId === "C26-001"));
        const ordinary = before.filter(record => !record.dateNightEvent).map(record => record.id);
        h.discovery(await providerRefresh(t, mode));
        assert.ok(!h.current(surface).some(record => record.id === parkId), "Incomplete provider evidence cannot keep Sparkle or substitute ordinary park Directions");
        assert.deepEqual(h.current(surface).map(record => record.id), ordinary, "Independently selected ordinary choices remain functional");
        h.discovery(await providerRefresh(t, "complete"));
        assert.ok(!h.current(surface).some(record => record.id === parkId), "Fresh source evidence cannot reopen a retired event without a new user selection");
        h.click(labels[surface]);
        assert.ok(h.current(surface).some(record => record.dateNightEvent?.researchId === "C26-001"), "Complete fresh reviewed source supports an explicit new event selection");
      } finally { h.dispose(); }
    });
  }

  test(`${surface}: provider uncertainty preserves ordinary cinema selection and explicit ordinary replanning`, async t => {
    const h = home("2026-12-20T18:00:00-06:00", ["movies"]);
    try {
      h.click(labels[surface]);
      assert.deepEqual(h.current(surface).map(record => record.id), ["fixture-ordinary-cinema"]);
      h.discovery(await providerRefresh(t, "oversized-last"));
      assert.deepEqual(h.current(surface).map(record => record.id), ["fixture-ordinary-cinema"]);
      assert.ok(h.current(surface).every(record => !record.dateNightEvent));
      const component = { result: "ResultOverlay", options: "OptionsOverlay", plan: "DateNightPlanOverlay" }[surface];
      const action = { result: "onReroll", options: "onShuffle", plan: "onReplan" }[surface];
      const overlay = find(h.render(), node => node.type?.name === component);
      overlay.props[action]();
      assert.deepEqual(h.current(surface).map(record => record.id), ["fixture-ordinary-cinema"]);
    } finally { h.dispose(); }
  });

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
