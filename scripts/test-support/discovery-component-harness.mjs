import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { appModuleLoader } from "./load-app-module.mjs";
import { deferred, flush } from "./discovery-clock.mjs";
import { textOf, findNode } from "./date-night-component-harness.mjs";
export { textOf, findNode };
const pkg = createRequire(import.meta.url),
  load = appModuleLoader(),
  compiled = new Map();

export const discoveryModes = [
  {
    mode: "dinner",
    file: "pick-home",
    name: "PickHome",
    searchName: "searchRestaurants",
    key: "restaurants",
  },
  {
    mode: "date-night",
    file: "date-night-home",
    name: "DateNightHome",
    searchName: "searchDateNight",
    key: "venues",
  },
  {
    mode: "nightlife",
    file: "nightlife-home",
    name: "NightlifeHome",
    searchName: "searchNightlife",
    key: "venues",
  },
];

// Executes actual home components, shared lifecycle, decoration and selection.
// Hooks/store/RPC and leaf components are modeled; no browser acceptance implied.
export function discoveryComponentHarness(config) {
  let states = [],
    cursor = 0,
    effects = [],
    effectIndex = 0,
    writes = 0;
  const requests = [];
  const store = {
    location: { lat: 37.176447, lon: -94.310223, label: "Carthage", source: "manual" },
    filters: { ...load("src/lib/restaurants/types.ts").DEFAULT_FILTERS, openNowOnly: false },
    dateNightFilters: {
      ...load("src/lib/date-night/types.ts").DEFAULT_DATE_NIGHT_FILTERS,
      openNowOnly: false,
    },
    preferences: {},
    visits: [],
    exclusions: [],
    sessionShown: [],
    spookySeasonEnabled: false,
    pruneExpired() {},
    markShown() {},
    setFilters(patch) {
      store.filters = { ...store.filters, ...patch };
    },
    setDateNightFilters(patch) {
      store.dateNightFilters = { ...store.dateNightFilters, ...patch };
    },
  };
  const require = (specifier) => {
    if (specifier === "react")
      return {
        ...React,
        useMemo: (fn) => fn(),
        useState(init) {
          const i = cursor++;
          if (!(i in states)) states[i] = typeof init === "function" ? init() : init;
          return [
            states[i],
            (value) => {
              writes++;
              states[i] = typeof value === "function" ? value(states[i]) : value;
            },
          ];
        },
        useEffect(fn, deps) {
          const i = effectIndex++,
            old = effects[i];
          if (old && deps.every((v, n) => Object.is(v, old.deps[n]))) return;
          old?.cleanup?.();
          effects[i] = { deps, cleanup: fn() };
        },
      };
    if (specifier === "@/lib/store") return { useAppStore: (s) => s(store) };
    if (specifier === "@/lib/date-night/use-clock")
      return { useDateNightClock: () => new Date("2026-09-30T20:00:00Z") };
    if (specifier.endsWith("/search"))
      return {
        [config.searchName]: (args) => {
          const d = deferred();
          requests.push({ ...d, args });
          return d.promise;
        },
      };
    if (specifier.startsWith("@/components/"))
      return new Proxy(
        {},
        {
          get: (_t, key) => {
            const leaf = (props) => React.createElement("div", props, props.children);
            Object.defineProperty(leaf, "name", { value: String(key) });
            return leaf;
          },
        },
      );
    if (specifier.startsWith("@/")) return load(path.join("src", specifier.slice(2) + ".ts"));
    return pkg(specifier);
  };
  if (!compiled.has(config.file))
    compiled.set(
      config.file,
      ts.transpileModule(fs.readFileSync(`src/components/${config.file}.tsx`, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
        },
      }).outputText,
    );
  const mod = { exports: {} };
  new Function("require", "module", "exports", compiled.get(config.file))(
    require,
    mod,
    mod.exports,
  );
  const render = () => {
    cursor = 0;
    effectIndex = 0;
    return mod.exports[config.name]();
  };
  const collect = (node, kind) =>
    Array.isArray(node)
      ? node.flatMap((n) => collect(n, kind))
      : node && typeof node === "object"
        ? [
            ...(node.type?.name === kind ? [node.props] : []),
            ...collect(node.props?.children, kind),
          ]
        : [];
  return {
    render,
    store,
    requests,
    get writes() {
      return writes;
    },
    status() {
      const tree = render();
      return {
        loading: collect(tree, "DiscoveryLoading").length > 0,
        notices: collect(tree, "DiscoveryNotice"),
        tree,
      };
    },
    async settle() {
      await flush();
      return this.status();
    },
    dispose() {
      effects.forEach((e) => e.cleanup?.());
    },
    button(tree, label) {
      return findNode(
        tree,
        (n) => n.props?.onClick && textOf(n).toLowerCase() === label.toLowerCase(),
      );
    },
    control(tree, label) {
      return findNode(tree, (n) => n.props?.["aria-label"] === label);
    },
    overlay(tree, name) {
      return findNode(tree, (n) => n.type?.name === name);
    },
  };
}

export function discoveryPayload(config, source = "live", id = "current") {
  const restaurant = {
    id,
    name: id,
    lat: 37.176447,
    lon: -94.310223,
    address: "Test fixture",
    cuisines: ["pizza"],
    cuisineLabel: "Pizza",
    priceLevel: 2,
    rating: null,
    reviewCount: null,
    openingHours: "24/7",
    phone: null,
    website: null,
    isChain: false,
    photoKey: "cafe",
    source: "osm",
    activityTypes: ["movies"],
    moodLevel: 1,
    venueTypes: ["bar"],
    energyLevel: 2,
  };
  return {
    [config.key]: [restaurant],
    source,
    warning: source === "fallback" ? "Saved fixture fallback" : undefined,
  };
}
