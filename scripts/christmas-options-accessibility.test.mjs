// Actual ordinary-card actions across all shared modes. Browser acceptance
// separately verifies the accessibility tree, Tab order, layout and axe rules.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import ts from "typescript";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
if (process.env.CHRISTMAS_OPTIONS_SOURCE_ROOT) process.chdir(process.env.CHRISTMAS_OPTIONS_SOURCE_ROOT);
const requirePackage = createRequire(import.meta.url);

function renderOptions(mode, seasonal = false) {
  const load = appModuleLoader();
  const store = { theme: "dark", spookySeasonEnabled: seasonal };
  let cursor = 0;
  const react = { ...React, useEffect: () => {}, useState: initial => [cursor++ === 0 ? true : typeof initial === "function" ? initial() : initial, () => {}] };
  const require = specifier => {
    if (specifier === "react") return react;
    if (specifier === "react-dom") return { createPortal: child => child };
    if (specifier === "@/lib/store") return { useAppStore: select => select(store) };
    if (specifier === "@/components/ui/button") return { Button: ({ variant: _variant, size: _size, ...props }) => React.createElement("button", props) };
    if (specifier === "@/components/unified-footer") return { UnifiedFooter: () => null };
    if (specifier === "@/components/seasonal-visit-notes") return { SeasonalVisitNotes: () => React.createElement("details", {}, React.createElement("summary", {}, "Visitor details")) };
    if (specifier === "@/components/christmas-event-dialog") return { ChristmasEventDialog: ({ children }) => React.createElement("dialog", {}, children) };
    if (specifier === "@/components/christmas-event-details") return {};
    if (specifier.startsWith("@/")) return load(`src/${specifier.slice(2)}.ts`);
    return requirePackage(specifier);
  };
  const module = { exports: {} };
  const source = readFileSync("src/components/options-overlay.tsx", "utf8");
  const out = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function("require", "module", "exports", out)(require, module, module.exports);
  const place = { id: `ordinary-${mode}`, name: mode === "date-night" ? "Fixture cinema" : mode === "nightlife" ? "Fixture lounge" : "Fixture restaurant",
    cuisineLabel: "Fixture", cuisines: [], activityTypes: [seasonal ? "haunted-house" : "movies"], venueTypes: ["bar"],
    openingHours: "24/7", isOpen: true, hoursKnown: true, distanceMiles: 1, photoKey: "american", priceLevel: null,
    ...(seasonal ? { seasonalVisitNotes: ["Reviewed visitor notes"] } : {}) };
  const calls = { selected: [], excluded: [] };
  function expand(node) {
    if (Array.isArray(node)) return node.map(expand);
    if (!React.isValidElement(node)) return node;
    if (typeof node.type === "function") return expand(node.type(node.props));
    return React.cloneElement(node, {}, expand(node.props.children));
  }
  const previousDocument = globalThis.document;
  globalThis.document = { body: {} };
  try {
    const tree = expand(React.createElement(module.exports.OptionsOverlay, { mode, restaurants: [place], onSelect: item => calls.selected.push(item.id),
      onNotTonight: item => calls.excluded.push(item.id), onClose() {}, onShuffle() {} }));
    return { tree, place, calls };
  } finally { if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument; }
}
const text = node => Array.isArray(node) ? node.map(text).join("") : React.isValidElement(node) ? text(node.props.children) : typeof node === "string" || typeof node === "number" ? String(node) : "";
function all(node, predicate) {
  if (Array.isArray(node)) return node.flatMap(item => all(item, predicate));
  if (!React.isValidElement(node)) return [];
  return [...(predicate(node) ? [node] : []), ...all(node.props.children, predicate)];
}
for (const [mode, seasonal] of [["dinner", false], ["nightlife", false], ["date-night", false], ["date-night", true]]) {
  test(`${mode}${seasonal ? " Halloween" : ""}: one named selection action retains both media and summary, exclusion stays separate`, t => {
    t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-10-10T20:00:00Z").getTime() });
    const { tree, place, calls } = renderOptions(mode, seasonal);
    const article = all(tree, node => node.type === "article")[0];
    const controls = all(article, node => node.type === "button");
    const selection = controls.filter(node => !String(node.props["aria-label"] ?? "").startsWith("Not tonight:"));
    assert.equal(selection.length, 1, "One selection action per option; image and summary must not add duplicate focus stops");
    assert.ok(text(selection[0]).startsWith(`Choose ${place.name}`), "Accessible name includes the action, option name and its visible supporting text");
    assert.equal(selection[0].props["aria-label"], undefined, "A partial ARIA override must not omit visible label content");
    assert.ok((selection[0].props.tabIndex ?? 0) >= 0);
    assert.equal(selection[0].props.style?.outlineOffset, -3, "Keyboard focus is drawn inside the overflow-hidden card");
    assert.equal(all(selection[0], node => node.type === "img").length, 1, "The existing image remains part of the action");
    assert.equal(all(selection[0], node => node.type === "h3" && node.props.children === place.name).length, 1, "The visible option name remains part of the action");
    assert.equal(all(selection[0].props.children, node => node.type === "button" || node.type === "details").length, 0, "No nested exclusion or disclosure controls");
    selection[0].props.onClick();
    assert.deepEqual(calls.selected, [place.id]);
    const excluded = controls.find(node => node.props["aria-label"] === `Not tonight: ${place.name}`);
    assert.ok(excluded); excluded.props.onClick();
    assert.deepEqual(calls.excluded, [place.id]); assert.deepEqual(calls.selected, [place.id]);
    assert.equal(all(article, node => node.type === "details").length, seasonal ? 1 : 0);
  });
}
