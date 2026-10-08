// Source-bound geometry/pixel comparison of real overlay components, using the
// production stylesheet. Native Details behavior is exercised here; the full
// existing application browser suites separately cover hydration/RPC/actions.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
const baseline = "2fe002e6bdc9c2c42ecfc0d61e4de08df20d0d81";
const proof = assertBrowserBuild();
const out = "audit/browser-results/seasonal-card-layout";
fs.mkdirSync(out, { recursive: true });
const req = createRequire(import.meta.url), pure = appModuleLoader();
const rows = [
  ...pure("src/lib/date-night/missouri-2026-cleared-catalog.ts").MISSOURI_2026_CLEARED_SEASONAL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-v1-catalog.ts").MISSOURI_2026_V1_SEASONAL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-v1-next-catalog.ts").MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG,
];
const cssDir = ".vercel/output/static/assets";
const css = fs.readdirSync(cssDir).filter(p => p.endsWith(".css")).map(p => fs.readFileSync(path.join(cssDir, p), "utf8")).join("\n");
const state = { theme: "dark", spookySeasonEnabled: true, preferences: {}, toggleFavorite() {}, recordVisit() {} };
function renderer(old = false) {
  const modules = new Map();
  function load(file) {
    if (modules.has(file)) return modules.get(file);
    const source = old && file.startsWith("src/components/")
      ? execFileSync("git", ["show", `${baseline}:${file}`], { encoding: "utf8" })
      : fs.readFileSync(file, "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    let hook = 0;
    const require = spec => {
      if (spec === "react") return { ...React, useEffect() {}, useMemo: fn => fn(), useState: init => {
        const index = hook++;
        // Mount effects have settled; no rating drawer is open.
        const mounted = file.endsWith("result-overlay.tsx") ? index === 4 : index === 0;
        return [mounted ? true : typeof init === "function" ? init() : init, () => {}];
      } };
      if (spec === "react-dom") return { createPortal: node => node };
      if (spec === "@/lib/store") return { useAppStore: selector => selector(state) };
      if (spec.startsWith("@/components/")) return load(`src/${spec.slice(2)}.tsx`);
      if (spec.startsWith("@/")) return pure(`src/${spec.slice(2)}.ts`);
      return req(spec);
    };
    const module = { exports: {} };
    new Function("require", "module", "exports", compiled)(require, module, module.exports);
    modules.set(file, module.exports);
    return module.exports;
  }
  return (kind, records) => {
    globalThis.document = { body: {} };
    const names = { options: ["options-overlay", "OptionsOverlay"], result: ["result-overlay", "ResultOverlay"] };
    const [file, name] = names[kind];
    const Component = load(`src/components/${file}.tsx`)[name];
    const props = kind === "options" ? { restaurants: records, onClose() {}, onSelect() {}, onShuffle() {}, onNotTonight() {}, mode: "date-night" }
      : { restaurant: records[0], reelNames: [], skipSpin: true, onClose() {}, onReroll() {}, onNotTonight() {}, mode: "date-night" };
    const html = renderToStaticMarkup(React.createElement(Component, props));
    delete globalThis.document;
    return html.replace(/src="(\/[^"]+)"/g, (_match, src) => `src="data:image/jpeg;base64,${fs.readFileSync(`public${src}`).toString("base64")}"`);
  };
}
const decorate = row => ({ ...row, cuisineLabel: row.activityTypes.join(" · "), distanceMiles: 2.5, hoursKnown: false, isOpen: false, closingSoon: false });
const ordinary = row => ({ ...decorate(row), id: "ordinary-layout-control", seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined, activityTypes: ["park"], name: row.name });
const verdict = { passed: false, baseline, proof, comparisons: [], errors: [] };
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const width of [320, 390, 512]) {
    for (const row of rows) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
      const page = await context.newPage();
      const measured = {};
      for (const variant of ["ordinary", "before", "after"]) {
        const render = renderer(variant === "before" || variant === "ordinary");
        const item = variant === "ordinary" ? ordinary(row) : decorate(row);
        await page.setContent(`<html class="dark"><head><style>${css}</style></head><body>${render("options", [item, { ...ordinary(row), id: "second-control", name: "Ordinary park" }])}</body></html>`);
        await page.locator("img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        const card = page.locator("article").first();
        const geometry = await card.evaluate(el => {
          const rect = el.getBoundingClientRect(), media = el.querySelector("img").parentElement.getBoundingClientRect();
          return { width: rect.width, height: rect.height, mediaHeight: media.height, cardClass: el.className,
            mediaClass: el.querySelector("img").parentElement.className, scrollWidth: el.scrollWidth,
            summary: el.querySelector("summary")?.getBoundingClientRect().toJSON() };
        });
        measured[variant] = geometry;
        if (variant === "after") {
          const details = card.locator("details");
          assert.equal(await details.getAttribute("open"), null);
          assert.equal(await card.locator("[data-seasonal-visit-notes] > p").innerText(), "Check current hours, admission, and weather before you go.");
          assert.ok(geometry.summary.height >= 24, "Details has at least a 24px target");
          assert.ok(geometry.scrollWidth <= geometry.width + 1, "No horizontal card overflow");
          await details.locator("summary").press("Enter");
          assert.notEqual(await details.getAttribute("open"), null);
          assert.ok(await details.locator("p").count());
          await details.locator("summary").press("Enter");
          assert.equal(await details.getAttribute("open"), null);
        }
        await page.screenshot({ path: `${out}/${row.seasonalListing?.recordId ?? row.id}-${width}-${variant}.png`, fullPage: true });
      }
      const delta = measured.after.height - measured.ordinary.height;
      verdict.comparisons.push({ id: row.id, width, ...measured, delta, percent: delta / measured.ordinary.height * 100 });
      assert.equal(measured.after.mediaHeight, measured.ordinary.mediaHeight);
      assert.equal(measured.after.mediaClass, measured.ordinary.mediaClass);
      assert.equal(measured.after.cardClass, measured.ordinary.cardClass);
      assert.ok(delta <= 16, `Collapsed seasonal card exceeds standard by ${delta}px at ${width}: ${row.name}`);
      assert.ok(measured.after.height <= measured.before.height);
      await context.close();
    }
  }
  verdict.passed = true;
} catch (error) { verdict.errors.push(error.stack); process.exitCode = 1; }
finally { await browser?.close(); fs.writeFileSync(`${out}/verdict.json`, JSON.stringify(verdict, null, 2)); }
