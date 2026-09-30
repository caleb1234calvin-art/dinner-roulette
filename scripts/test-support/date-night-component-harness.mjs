// Actual component/render/action harness. Only hooks, portals and leaf controls
// are stubbed. The real search validator/handler, policy and overlays execute.
// This is not browser/RPC, hydration, layout or physical-device acceptance.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { appModuleLoader } from "./load-app-module.mjs";
const requirePackage = createRequire(import.meta.url);
export const textOf = (node) =>
  Array.isArray(node)
    ? node.map(textOf).join("")
    : node && typeof node === "object"
      ? textOf(node.props?.children)
      : typeof node === "string" || typeof node === "number"
        ? String(node)
        : "";
export function findNode(node, predicate) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const result = findNode(child, predicate);
      if (result) return result;
    }
    return null;
  }
  if (!node || typeof node !== "object") return null;
  return predicate(node) ? node : findNode(node.props?.children, predicate);
}
export function dateNightComponentHarness({ store, now, search }) {
  const pure = appModuleLoader(),
    modules = new Map();
  let states = [],
    cursor = 0,
    effects = [],
    effectIndex = 0;
  const pending = [];
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const source = fs.readFileSync(relative, "utf8");
    const out = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    const module = { exports: {} };
    const isHome = relative.endsWith("date-night-home.tsx");
    const require = (specifier) => {
      if (specifier === "react")
        return {
          ...React,
          useMemo: (fn) => fn(),
          useState: (init) => {
            if (!isHome)
              return [
                typeof init === "boolean" ? true : typeof init === "function" ? init() : init,
                () => {},
              ];
            const index = cursor++;
            if (!(index in states)) states[index] = typeof init === "function" ? init() : init;
            return [
              states[index],
              (value) => {
                states[index] = typeof value === "function" ? value(states[index]) : value;
              },
            ];
          },
          useEffect: (fn, dependencies) => {
            if (!isHome) return;
            const index = effectIndex++;
            const previous = effects[index];
            if (previous && dependencies.every((value, i) => value === previous.dependencies[i]))
              return;
            previous?.cleanup?.();
            effects[index] = { dependencies, cleanup: fn() };
          },
        };
      if (specifier === "react-dom") return { createPortal: (node) => node };
      if (specifier === "@/lib/store") return { useAppStore: (selector) => selector(store) };
      if (specifier === "@/lib/date-night/use-clock") return { useDateNightClock: () => now.value };
      if (specifier === "@/lib/date-night/search")
        return {
          searchDateNight: (args) => {
            const promise = search(args);
            pending.push(promise);
            return promise;
          },
        };
      if (
        [
          "@/components/options-overlay",
          "@/components/result-overlay",
          "@/components/date-night-plan-overlay",
        ].includes(specifier)
      )
        return load(path.join("src", specifier.slice(2) + ".tsx"));
      if (specifier.startsWith("@/components/"))
        return new Proxy(
          {},
          {
            get: (_target, key) => {
              const Component = (props) =>
                React.createElement("div", { "data-control": key }, props.children);
              return Component;
            },
          },
        );
      if (specifier.startsWith("@/")) return pure(path.join("src", specifier.slice(2) + ".ts"));
      return requirePackage(specifier);
    };
    new Function("require", "module", "exports", out)(require, module, module.exports);
    modules.set(relative, module.exports);
    return module.exports;
  }
  const { DateNightHome } = load("src/components/date-night-home.tsx");
  const render = () => {
    cursor = 0;
    effectIndex = 0;
    return DateNightHome();
  };
  return {
    render,
    async settle() {
      await Promise.all(pending.splice(0));
      await new Promise((resolve) => setImmediate(resolve));
      return render();
    },
    button(tree, label) {
      return findNode(tree, (node) => node.props?.onClick && textOf(node) === label);
    },
    html: (tree) => renderToStaticMarkup(tree),
    overlay(tree, exportName) {
      return findNode(tree, (node) => node.type?.name === exportName);
    },
    dispose() {
      effects.forEach((effect) => effect.cleanup?.());
    },
  };
}
