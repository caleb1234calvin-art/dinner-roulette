import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import React from "react";
import ts from "typescript";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryModes, discoveryPayload } from "./test-support/discovery-component-harness.mjs";
const pkg = createRequire(import.meta.url), pure = appModuleLoader();
function overlayModule(file) {
  let effects = [];
  const require = specifier => {
    if (specifier === "react") return { ...React, useMemo: fn => fn(),
      useState: initial => [typeof initial === "boolean" ? true : initial, () => {}],
      useEffect: (_fn, deps) => effects.push(deps) };
    if (specifier === "react-dom") return { createPortal: node => node };
    if (specifier === "@/lib/store") return { useAppStore: fn => fn({ preferences: {}, spookySeasonEnabled: true,
      theme: "dark", toggleFavorite() {}, recordVisit() {} }) };
    if (specifier.startsWith("@/components/")) return new Proxy({}, { get: () => props => React.createElement("div", props) });
    if (specifier.startsWith("@/")) return pure(resolve("src", specifier.slice(2) + ".ts"));
    return pkg(specifier);
  };
  const module = { exports: {} };
  const out = ts.transpileModule(readFileSync(`src/components/${file}.tsx`, "utf8"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function("require", "module", "exports", out)(require, module, module.exports);
  return { exports: module.exports, render(fn, props) { effects = []; const tree = fn(props); return { tree, effects }; } };
}
const row = (id, activityTypes = ["haunted-house"]) => ({ ...discoveryPayload(discoveryModes[1]).venues[0],
  id, name: "Same visitor place", activityTypes, distanceMiles: 1, hoursKnown: false, isOpen: false,
  availability: { label: "Hours unknown", status: "hours-unknown", browseEligible: true } });
const keys = tree => Array.isArray(tree) ? tree.flatMap(keys) : tree && typeof tree === "object"
  ? [...(tree.key != null ? [tree.key] : []), ...keys(tree.props?.children)] : [];
function documentFixture(t) {
  const old = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", { configurable: true, value: { body: {}, documentElement: { classList: { contains: () => false } } } });
  t.after(() => old ? Object.defineProperty(globalThis, "document", old) : delete globalThis.document);
}

test("actual ResultOverlay spin dependencies stay stable on affirmed rekey; ordinary default identity still changes", t => {
  documentFixture(t); const h = overlayModule("result-overlay"), fn = h.exports.ResultOverlay;
  const props = { restaurant: row("old"), decisionIdentity: { id: "old", name: "Same visitor place" },
    reelNames: ["Same visitor place"], mode: "date-night", onClose() {}, onReroll() {}, onNotTonight() {} };
  const before = h.render(fn, props), after = h.render(fn, { ...props, restaurant: { ...row("new"), name: "Current supported canonical name" } });
  assert.deepEqual(after.effects, before.effects, "rekey does not restart spin, clear rating, or replace the chosen animation");
  const ordinaryBefore = h.render(fn, { ...props, decisionIdentity: undefined, mode: "dinner" });
  const ordinaryAfter = h.render(fn, { ...props, decisionIdentity: undefined, mode: "dinner", restaurant: row("new") });
  assert.notDeepEqual(ordinaryBefore.effects, ordinaryAfter.effects, "other modes retain existing restaurant identity behavior");
});

test("actual OptionsOverlay keeps card keys so expanded Details do not remount on canonical rekey", t => {
  documentFixture(t); const h = overlayModule("options-overlay"), fn = h.exports.OptionsOverlay;
  const props = { restaurants: [row("old")], decisionKeys: ["chosen-option"], mode: "date-night" };
  assert.deepEqual(keys(h.render(fn, props).tree), keys(h.render(fn, { ...props, restaurants: [row("new")] }).tree));
  assert.ok(keys(h.render(fn, props).tree).includes("chosen-option"));
});

test("actual PlanOverlay keeps stop keys while receiving current eligible data", t => {
  documentFixture(t); const h = overlayModule("date-night-plan-overlay"), fn = h.exports.DateNightPlanOverlay;
  const props = { plan: [row("old-thrill"), row("old-settle", ["pumpkin-patch"])], decisionKeys: ["chosen-thrill", "chosen-settle"] };
  const before = keys(h.render(fn, props).tree);
  const after = keys(h.render(fn, { ...props, plan: [row("new-thrill"), row("new-settle", ["pumpkin-patch"])] }).tree);
  assert.deepEqual(after, before); assert.ok(before.includes("chosen-thrill")); assert.ok(before.includes("chosen-settle"));
});
