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
    globalThis.document = { body: {}, documentElement: { classList: { contains: () => true } } };
    const names = { options: ["options-overlay", "OptionsOverlay"], result: ["result-overlay", "ResultOverlay"], plan: ["date-night-plan-overlay", "DateNightPlanOverlay"] };
    const [file, name] = names[kind];
    const Component = load(`src/components/${file}.tsx`)[name];
    const props = kind === "plan" ? { plan: records, onClose() {}, onReplan() {} } : kind === "options" ? { restaurants: records, onClose() {}, onSelect() {}, onShuffle() {}, onNotTonight() {}, mode: "date-night" }
      : { restaurant: records[0], reelNames: [], skipSpin: true, onClose() {}, onReroll() {}, onNotTonight() {}, mode: "date-night" };
    const html = renderToStaticMarkup(React.createElement(Component, props));
    delete globalThis.document;
    return html.replace(/src="(\/[^"]+)"/g, (_match, src) => `src="data:image/jpeg;base64,${fs.readFileSync(`public${src}`).toString("base64")}"`);
  };
}
const decorate = row => ({ ...row, cuisineLabel: row.activityTypes.join(" · "), distanceMiles: 2.5, hoursKnown: false, isOpen: false, closingSoon: false });
const ordinary = row => ({ ...decorate(row), id: "ordinary-layout-control", seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined, activityTypes: row.activityTypes, name: row.name });
const verdict = { passed: false, baseline, proof, comparisons: [], errors: [] };
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const width of [320, 390, 512]) {
    for (const row of rows) {
    for (const kind of ["options", "result", ...(row.activityTypes.includes("haunted-house") ? ["plan"] : [])]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
      const page = await context.newPage();
      const measured = {};
      await context.route("**/*", route => route.abort());
      for (const variant of ["standard", "ordinary", "before", "after"]) {
        const render = renderer(variant !== "after");
        const item = ["ordinary", "standard"].includes(variant) ? ordinary(row) : decorate(row);
        if (variant === "standard") { item.name = "Ordinary park"; item.activityTypes = ["park"]; }
        if (kind === "plan") item.activityTypes = ["haunted-house"];
        await page.setContent(`<html class="dark"><head><style>${css}</style></head><body>${render(kind, [item, { ...ordinary(row), id: "second-control", name: "Ordinary park", activityTypes: ["park"] }])}</body></html>`);
        await page.locator("img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        const card = kind === "result" ? page.locator(".result-in") : page.locator("article").first();
        const geometry = await card.evaluate((el, kind) => {
          const rect = el.getBoundingClientRect(), image = kind === "result" ? document.querySelector("img") : el.querySelector("img"), media = image.parentElement.getBoundingClientRect();
          return { width: rect.width, height: rect.height, mediaHeight: media.height, cardClass: el.className,
            mediaClass: image.parentElement.className, scrollWidth: el.scrollWidth,
            summary: el.querySelector("summary")?.getBoundingClientRect().toJSON() };
        }, kind);
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
        await page.screenshot({ path: `${out}/${row.seasonalListing?.recordId ?? row.id}-${width}-${kind}-${variant}.png`, fullPage: true });
      }
      const delta = measured.after.height - measured.ordinary.height;
      verdict.comparisons.push({ id: row.id, kind, width, ...measured, delta, standardDelta: measured.after.height - measured.standard.height, percent: delta / measured.ordinary.height * 100 });
      assert.equal(measured.after.mediaHeight, measured.ordinary.mediaHeight);
      assert.equal(measured.after.mediaClass, measured.ordinary.mediaClass);
      assert.equal(measured.after.cardClass, measured.ordinary.cardClass);
      if (delta > 16) verdict.errors.push(`Collapsed ${kind} seasonal card exceeds matched ordinary by ${delta}px at ${width}: ${row.name}`);
      if (kind === "options" && measured.after.height - measured.standard.height > 16) verdict.errors.push(`Collapsed option exceeds short standard by ${measured.after.height - measured.standard.height}px at ${width}: ${row.name}`);
      assert.ok(measured.after.height <= measured.before.height);
      await context.close();
    }
    }
  }
  verdict.passed = verdict.errors.length === 0;
  if (!verdict.passed) process.exitCode = 1;
} catch (error) { verdict.errors.push(error.stack); process.exitCode = 1; }
finally { await browser?.close(); fs.writeFileSync(`${out}/verdict.json`, JSON.stringify(verdict, null, 2)); }
