import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { createRequire } from "node:module";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { chromium } from "playwright";
import { checkedOutputPath } from "./browser-guard.mjs";
import { buildChristmasProviderLossReplay } from "./test-support/christmas-provider-loss-replay.mjs";

// This harness may exercise an immutable parent checkout with current controls.
// Application and harness fingerprints are deliberately separate; local and CI
// bundle fingerprints are evidence of their own build, never interchangeable.
const harnessRoot = resolve(".");
const appRoot = resolve(process.env.CHRISTMAS_APP_ROOT ?? harnessRoot);
const reproduction = process.env.CHRISTMAS_REPRODUCTION === "1";
const optionsReproduction = process.env.CHRISTMAS_OPTIONS_REPRODUCTION === "1";
const providerReproduction = process.env.CHRISTMAS_PROVIDER_REPRODUCTION === "1";
const output = checkedOutputPath(process.env.CHRISTMAS_FINAL_BROWSER_OUTPUT ?? "/tmp/pfu-christmas-final-browser", ["/tmp", resolve("audit")], "Christmas final evidence");
await mkdir(output, { recursive: true });
const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const sourceSha = git(appRoot, "rev-parse", "HEAD");
const sourceTree = git(appRoot, "rev-parse", "HEAD^{tree}");
const sourceState = git(appRoot, "status", "--porcelain=v1");
const appInputs = git(appRoot, "ls-files", "--cached", "--others", "--exclude-standard", "src").split("\n").filter(Boolean);
const harnessInputs = ["scripts/christmas-final-browser.mjs", "scripts/test-support/christmas-event-fixture.tsx", "scripts/test-support/christmas-event-search-fixture.ts", "scripts/test-support/christmas-provider-loss-replay.mjs", "scripts/test-support/christmas-park-source.json", "scripts/test-support/load-app-module.mjs", "package.json", "package-lock.json",
  "scripts/christmas-cross-origin-browser.mjs", "scripts/test-support/christmas-cross-origin-fixture.tsx", "scripts/test-support/christmas-cross-origin-transport.ts",
  "scripts/test-support/christmas-cross-origin-observer.ts", "scripts/test-support/christmas-cross-origin-provider.mjs"];
async function fingerprint(root, inputs) {
  const hash = createHash("sha256");
  for (const path of [...new Set(inputs)].sort()) hash.update(path + "\0").update(await readFile(resolve(root, path)));
  return hash.digest("hex");
}

const appFingerprint = await fingerprint(appRoot, appInputs);
const harnessFingerprint = await fingerprint(harnessRoot, harnessInputs);
const providerReplay = await buildChristmasProviderLossReplay(appRoot);
const result = await build({
  root: appRoot, configFile: false, publicDir: false, mode: "production",
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom", "zustand"], alias: [
    { find: "@/lib/date-night/search", replacement: resolve(harnessRoot, "scripts/test-support/christmas-event-search-fixture.ts") },
    { find: "@/lib/restaurants/search", replacement: resolve(harnessRoot, "scripts/test-support/christmas-event-search-fixture.ts") },
    { find: "@", replacement: resolve(appRoot, "src") },
  ] },
  define: { "process.env.NODE_ENV": '"production"' },
  build: { write: false, minify: false, lib: { entry: resolve(harnessRoot, "scripts/test-support/christmas-event-fixture.tsx"), formats: ["iife"], name: "ChristmasFinalFixture" } },
});
const chunks = [result].flat().flatMap(bundle => bundle.output);
const code = chunks.filter(item => item.type === "chunk").map(item => item.code).join("\n");
const css = chunks.filter(item => item.type === "asset" && item.fileName.endsWith(".css")).map(item => item.source).join("\n");
const replayJson = JSON.stringify(providerReplay.responses).replace(/</g, "\\u003c");
const html = `<!doctype html><html lang="en" data-theme="dark"><head><title>Isolated Christmas acceptance</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><div id="root"></div><script>window.__christmasProviderLossReplay=${replayJson};</script><script src="/fixture.js"></script></body></html>`;
const server = createServer(async (request, response) => {
  if (request.url === "/fixture.js") { response.setHeader("Content-Type", "application/javascript"); response.end(code); return; }
  if (request.url === "/") { response.setHeader("Content-Type", "text/html"); response.end(html); return; }
  if (/^\/(?:date-night-icons|brand)\/[a-zA-Z0-9/_\-.]+$/.test(request.url ?? "")) {
    try {
      const path = resolve(appRoot, "public", request.url.slice(1));
      response.setHeader("Content-Type", ({ ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" })[extname(path)] ?? "application/octet-stream");
      response.end(await readFile(path)); return;
    } catch { /* Missing fixture assets never turn into external requests. */ }
  }
  response.writeHead(404); response.end("Not a fixture endpoint");
});
await new Promise(ready => server.listen(0, "127.0.0.1", ready));
const origin = `http://127.0.0.1:${server.address().port}`;
const axeSource = await readFile(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const verdict = {
  passed: false, reproduction, optionsReproduction, providerReproduction, provenance: process.env.CI ? "hosted CI" : "local", appRoot, sourceSha, sourceTree, sourceState,
  providerReplay: providerReplay.provenance,
  appFingerprint, harnessFingerprint, harnessHead: git(harnessRoot, "rev-parse", "HEAD"),
  bundleFingerprint: createHash("sha256").update(code).update(css).digest("hex"),
  axeVersion: "4.14.0", cases: [], contrast: [], keyboard: [], accessibility: [], optionActions: [], providerTransitions: [], observations: [], pageErrors: [], externalRequests: [],
  limitations: ["Actual application components/store with substituted discovery transport and synthetic temporary placements.", "Not public placement clearance, combined V4 acceptance, physical Android/WebView or real assistive-technology acceptance."],
};
let browser;
const fixtures = (page, action, ...args) => page.evaluate(({ action, args }) => window.christmasFixture[action](...args), { action, args });
const frame = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
const check = async (name, test) => {
  try { await test(); verdict.cases.push({ name, passed: true }); console.log(`CHRISTMAS_FINAL_PASS ${name}`); }
  catch (error) { verdict.cases.push({ name, passed: false, error: error.message }); console.log(`CHRISTMAS_FINAL_FAIL ${name}: ${error.message}`); }
};
const filters = { radiusMiles: 15, activityTypes: ["anything"], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: false };
const controls = {
  result: { open: "Pick our date", close: "Close result" },
  options: { open: "Give us options", close: "Close options" },
  plan: { open: "Plan our outing", close: "Close night plan" },
};
const shell = page => page.locator('[data-christmas-dialog], body > .fixed').first();
async function createPage({ width = 390, theme = "dark", motion = "reduce", iso = "2026-12-05T10:00:00-06:00", modeScope = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: "America/Chicago", reducedMotion: motion, serviceWorkers: "block" });
  await context.route("**/*", route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    verdict.externalRequests.push(route.request().url()); return route.abort();
  });
  const page = await context.newPage(); page.setDefaultTimeout(5000);
  page.on("pageerror", error => verdict.pageErrors.push({ width, theme, motion, message: error.message }));
  await page.clock.setFixedTime(new Date(iso));
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForFunction(() => Boolean(window.christmasFixture?.ready));
  await fixtures(page, "setTheme", theme);
  if (modeScope) await page.evaluate(() => document.documentElement.classList.add("date-night-active"));
  await page.getByRole("button", { name: "Pick our date", exact: true }).waitFor();
  await frame(page);
  return { context, page };
}
async function setTime(page, iso) { await page.clock.setFixedTime(new Date(iso)); await fixtures(page, "refreshClock"); await frame(page); }
async function openHome(page, surface, category = "christmas-lights") {
  await fixtures(page, "configure", { christmasEnabled: true, christmasCategories: [category], dateNightFilters: filters });
  const trigger = page.getByRole("button", { name: controls[surface].open, exact: true });
  await trigger.focus(); await page.keyboard.press("Enter");
  await page.getByRole("button", { name: controls[surface].close, exact: true }).waitFor();
  await frame(page);
  return trigger;
}
async function noOpenSelection(page, reason) {
  assert.equal(await page.getByRole("button", { name: /^(Close result|Close options|Close night plan)$/ }).count(), 0, `${reason}: original selection must be retired`);
  assert.equal(await page.locator('body > .fixed a[href*="maps"], [data-christmas-dialog] a[href*="maps"]').count(), 0, `${reason}: no ordinary park Directions substitution`);
}
async function assertLayout(page) {
  const overflow = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll('[data-christmas-surface], [data-christmas-dialog], main')].filter(el => el.scrollWidth > el.clientWidth + 1).map(el => ({ tag: el.tagName, surface: el.getAttribute("data-christmas-surface"), width: el.clientWidth, scroll: el.scrollWidth })) }));
  assert.ok(overflow.document <= overflow.width + 1, `Horizontal page overflow: ${JSON.stringify(overflow)}`);
  assert.deepEqual(overflow.elements, [], `Horizontal event overflow: ${JSON.stringify(overflow.elements)}`);
}
async function keyboardCase(page, surface, category = "holiday-market") {
  const trigger = await openHome(page, surface, category);
  const issues = [];
  const dialog = shell(page);
  const role = await page.getByRole("dialog").count();
  if (role !== 1) issues.push(`expected one dialog, received ${role}`);
  const semantics = await dialog.evaluate(el => ({ modal: el.matches(":modal") || el.getAttribute("aria-modal") === "true",
    named: !!(el.getAttribute("aria-label")?.trim() || el.getAttribute("aria-labelledby")?.split(/\s+/).map(id => document.getElementById(id)?.textContent).join(" ").trim()),
    focused: el.contains(document.activeElement),
  }));
  if (!semantics.modal || !semantics.named) issues.push(`modal/name semantics: ${JSON.stringify(semantics)}`);
  if (!semantics.focused) issues.push("keyboard opening left focus outside overlay");
  // Test containment independently even when the parent's initial focus is bad.
  await page.getByRole("button", { name: controls[surface].close, exact: true }).focus();
  const count = await dialog.locator('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]').count();
  for (const key of ["Tab", "Shift+Tab"]) {
    for (let i = 0; i < count + 2; i++) {
      await page.keyboard.press(key);
      if (!await dialog.evaluate(el => el.contains(document.activeElement))) { issues.push(`${key} escaped modal`); break; }
    }
  }
  const focusPaint = await dialog.evaluate(el => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !el.contains(active)) return null;
    const style = getComputedStyle(active), box = active.getBoundingClientRect();
    return { visible: active.matches(":focus-visible"), outlineWidth: parseFloat(style.outlineWidth), outlineStyle: style.outlineStyle,
      width: box.width, height: box.height, viewportVisible: box.bottom > 0 && box.top < innerHeight };
  });
  if (!focusPaint?.visible || focusPaint.outlineWidth < 2 || focusPaint.outlineStyle === "none" || !focusPaint.viewportVisible) issues.push(`missing visible keyboard focus: ${JSON.stringify(focusPaint)}`);
  await trigger.evaluate(el => el.focus());
  if (!await dialog.evaluate(el => el.contains(document.activeElement))) issues.push("underlying Home accepted focus while modal open");
  const shielded = await trigger.evaluate(el => {
    const box = el.getBoundingClientRect();
    const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return !!top?.closest('[data-christmas-dialog], body > .fixed');
  });
  if (!shielded) issues.push("underlying Home remains a pointer hit target");
  await page.keyboard.press("Escape"); await frame(page);
  const stillOpen = await page.getByRole("button", { name: controls[surface].close, exact: true }).count();
  if (stillOpen) issues.push("Escape did not close overlay");
  if (!await trigger.evaluate(el => document.activeElement === el)) issues.push("focus did not return to original Home trigger");
  if (stillOpen) await page.getByRole("button", { name: controls[surface].close, exact: true }).click();
  await frame(page);
  assert.deepEqual(issues, []);
}

// Measured text colors/ratios supplement axe. Disabled labels are reported but
// remain subject to the same readable-text threshold in this event candidate.
async function measureText(page, selector) {
  return page.evaluate(selector => {
    const roots = [...document.querySelectorAll(selector)];
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const rgba = color => { context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); const values = [...context.getImageData(0, 0, 1, 1).data]; return [values[0], values[1], values[2], values[3] / 255]; };
    const blend = (foreground, background) => foreground.slice(0, 3).map((value, i) => value * foreground[3] + background[i] * (1 - foreground[3]));
    const luminance = channels => channels.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
    const output = [], seen = new Set();
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode, el = text.parentElement;
        if (!text.textContent.trim() || !el || seen.has(el) || ["SCRIPT", "STYLE", "TITLE"].includes(el.tagName)) continue;
        if (!el.getClientRects().length || getComputedStyle(el).visibility === "hidden") continue;
        seen.add(el);
        const style = getComputedStyle(el), ancestry = [];
        for (let current = el; current; current = current.parentElement) ancestry.unshift(current);
        let background = [255, 255, 255], opacity = 1;
        for (const ancestor of ancestry) { const s = getComputedStyle(ancestor); opacity *= Number(s.opacity); const color = rgba(s.backgroundColor); color[3] *= opacity; background = blend(color, background); }
        const fg = rgba(style.color); fg[3] *= opacity;
        const foreground = blend(fg, background), a = luminance(foreground), b = luminance(background);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.6667 && parseInt(style.fontWeight) >= 700);
        output.push({ text: el.textContent.trim().slice(0, 140), tag: el.tagName, classes: el.className,
          foreground: style.color, background: background.map(Math.round), opacity,
          fontSize: style.fontSize, fontWeight: style.fontWeight, threshold: large ? 3 : 4.5, ratio: Math.round(ratio * 1000) / 1000,
          disabled: !!el.closest(":disabled") });
      }
    }
    return output;
  }, selector);
}
async function contrastCase(page, surface, label) {
  const selector = ["favorites", "history"].includes(surface) ? "main" : '[data-christmas-dialog], body > .fixed';
  const measurements = await measureText(page, selector);
  const axe = await page.evaluate(async selector => {
    const result = await window.axe.run({ include: [...document.querySelectorAll(selector)] }, { runOnly: { type: "rule", values: ["color-contrast"] } });
    return { violations: result.violations, incomplete: result.incomplete,
      measured: [...result.passes, ...result.violations].flatMap(rule => rule.nodes.map(node => ({ target: node.target, checks: [...node.any, ...node.all].map(check => ({ id: check.id, data: check.data })) }))) };
  }, selector);
  verdict.contrast.push({ label, surface, measurements, axe });
  await assertLayout(page);
  assert.ok(measurements.length > 0, "No rendered text measured");
  assert.deepEqual(axe.violations, [], `${surface}: axe color contrast violations`);
  const failed = measurements.filter(item => item.ratio + 0.001 < item.threshold);
  assert.deepEqual(failed, [], `${surface}: text below WCAG AA: ${JSON.stringify(failed)}`);
}
// Broad WCAG A/AA scans include button-name; contrast-only scans cannot
// establish that an actionable image has an accessible name.
async function broadAxe(page, surface, label, selector = '[data-christmas-dialog], body > .fixed') {
  const audit = await page.evaluate(async selector => {
    const result = await window.axe.run({ include: [...document.querySelectorAll(selector)] }, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
    return { violations: result.violations, incomplete: result.incomplete,
      passedRules: result.passes.map(rule => rule.id) };
  }, selector);
  // axe can report an ambiguous background stack for native top-layer dialog
  // text even when its opaque card/footer covers every underlying element.
  // Keep the original incomplete finding. Resolve only that specific ambiguity
  // with independent visible-text hit tests and solid-background contrast;
  // unsupported paint/overlap or any other incomplete rule still fails.
  audit.contrastReview = [];
  for (const rule of audit.incomplete) for (const node of rule.nodes) {
    const checks = [...node.any, ...node.all, ...node.none];
    if (rule.id !== "color-contrast" || !checks.length || checks.some(check => check.data?.messageKey !== "elmPartiallyObscuring") || node.target.length !== 1) continue;
    const target = node.target[0];
    const paint = await page.evaluate(target => {
      const elements = [...document.querySelectorAll(target)];
      if (elements.length !== 1) return { supported: false, reason: "Ambiguous target" };
      const el = elements[0], ancestors = [];
      let opaque = false;
      for (let current = el; current; current = current.parentElement) {
        const style = getComputedStyle(current);
        ancestors.push({ tag: current.tagName, background: style.backgroundColor });
        if (style.backgroundImage !== "none" || Number(style.opacity) !== 1 || style.filter !== "none" || style.mixBlendMode !== "normal") return { supported: false, reason: "Complex paint", ancestors };
        const rgba = style.backgroundColor.match(/^rgba?\(([^)]+)\)$/)?.[1].split(",").map(Number);
        if (rgba && (rgba.length === 3 || rgba[3] === 1)) opaque = true;
      }
      const ranges = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        const range = document.createRange(); range.selectNodeContents(walker.currentNode);
        for (const rect of range.getClientRects()) {
          if (rect.width === 0 || rect.height === 0) continue;
          const visible = rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight;
          const hits = [0.1, 0.5, 0.9].flatMap(x => [0.1, 0.5, 0.9].map(y => {
            const hit = document.elementFromPoint(rect.left + rect.width * x, rect.top + rect.height * y);
            return hit === el || el.contains(hit);
          }));
          ranges.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height, visible, unoccluded: hits.every(Boolean) });
        }
      }
      return { supported: opaque && ranges.length > 0 && ranges.every(range => range.visible && range.unoccluded), opaque, ancestors, ranges };
    }, target);
    const measurements = await measureText(page, target);
    audit.contrastReview.push({ target, paint, measurements,
      resolved: paint.supported && measurements.length > 0 && measurements.every(item => item.ratio + 0.001 >= item.threshold),
      method: "Independent solid-background color ratio and text-range visibility/hit tests; original axe incomplete retained." });
  }
  audit.unresolvedIncomplete = audit.incomplete.flatMap(rule => rule.nodes.filter(node =>
    !(rule.id === "color-contrast" && audit.contrastReview.some(review => review.resolved && node.target.length === 1 && review.target === node.target[0])))
    .map(node => ({ rule: rule.id, node })));
  verdict.accessibility.push({ label, surface, ...audit });
  return audit;
}
function assertBroadAxe(audit, surface) {
  assert.deepEqual(audit.violations, [], `${surface}: WCAG A/AA axe violations`);
  assert.deepEqual(audit.unresolvedIncomplete, [], `${surface}: WCAG A/AA axe needs unresolved review`);
}
async function optionActionCase(page, label, category, christmas = true) {
  const open = async () => {
    if (christmas) return openHome(page, "options", category);
    await fixtures(page, "configure", { christmasEnabled: false, dateNightFilters: { ...filters, activityTypes: ["movies"] } });
    const trigger = page.getByRole("button", { name: "Give us options", exact: true });
    await trigger.focus(); await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Close options", exact: true }).waitFor(); await frame(page);
    return trigger;
  };
  const trigger = await open();
  const mode = christmas ? category === "anything" ? "mixed" : "ordinary-only Christmas" : "ordinary Date Night";
  const cinema = shell(page).locator("article").filter({ hasText: "Fixture ordinary cinema" });
  const selected = cinema.locator('button:not([aria-label^="Not tonight:"])');
  const issues = [];
  await assertLayout(page);
  const audit = christmas ? await broadAxe(page, `${mode} Options`, label) : null;
  if (audit?.violations.length) issues.push(`WCAG A/AA rules: ${audit.violations.map(rule => rule.id).join(", ")}`);
  if (audit?.unresolvedIncomplete.length) issues.push(`WCAG A/AA needs review: ${audit.unresolvedIncomplete.map(item => item.rule).join(", ")}`);
  const selectionCount = await selected.count();
  const namedCount = await cinema.getByRole("button", { name: /^Choose Fixture ordinary cinema(?: |$)/ }).count();
  if (selectionCount !== 1) issues.push(`expected one selection control; found ${selectionCount}`);
  if (namedCount !== 1) issues.push(`expected one meaningful Choose Fixture ordinary cinema action; found ${namedCount}`);
  const accessibleTree = await cinema.ariaSnapshot();
  const tabStops = new Set();
  await page.getByRole("button", { name: "Close options", exact: true }).focus();
  const allControls = await shell(page).locator('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]').count();
  for (let i = 0; i < allControls + 2; i++) {
    await page.keyboard.press("Tab");
    const index = await selected.evaluateAll(elements => elements.indexOf(document.activeElement));
    if (index >= 0) tabStops.add(index);
  }
  if (tabStops.size !== 1) issues.push(`expected one selection Tab stop; found ${tabStops.size}`);
  // Exercise the image action even in the immutable parent, where it is unnamed.
  // A name/count failure must not prevent the before receipt from recording
  // that the defective control really opens the cinema on Enter.
  await selected.first().focus();
  const selectionFocus = await selected.first().evaluate(el => {
    const style = getComputedStyle(el), rect = el.getBoundingClientRect(), card = el.closest("article").getBoundingClientRect();
    const width = parseFloat(style.outlineWidth), expansion = width + parseFloat(style.outlineOffset);
    return { visible: el.matches(":focus-visible"), width, outlineStyle: style.outlineStyle, offset: parseFloat(style.outlineOffset),
      insideClip: rect.left - expansion >= card.left && rect.right + expansion <= card.right && rect.top - expansion >= card.top && rect.bottom + expansion <= card.bottom,
      viewportVisible: rect.bottom > 0 && rect.top < innerHeight };
  });
  if (!selectionFocus.visible || selectionFocus.width < (christmas ? 2 : 1) || selectionFocus.outlineStyle === "none" || !selectionFocus.insideClip || !selectionFocus.viewportVisible) issues.push(`selection focus is not visibly painted within its clipped card: ${JSON.stringify(selectionFocus)}`);
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Close result", exact: true }).waitFor(); await frame(page);
  assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
  if (christmas) {
    assert.equal(await page.getByRole("dialog").count(), 1);
    assert.equal(await shell(page).evaluate(el => el.contains(document.activeElement)), true);
    await page.keyboard.press("Escape"); await frame(page);
    assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
  } else await page.getByRole("button", { name: "Close result", exact: true }).click();
  for (const pointerTarget of ["image", "summary"]) {
    await open();
    const card = shell(page).locator("article").filter({ hasText: "Fixture ordinary cinema" });
    if (pointerTarget === "image") await card.locator("img").click();
    else await card.getByRole("heading", { name: "Fixture ordinary cinema", exact: true }).click();
    await page.getByRole("button", { name: "Close result", exact: true }).waitFor(); await frame(page);
    assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
    await page.getByRole("button", { name: "Close result", exact: true }).click(); await frame(page);
  }
  await assertLayout(page);
  verdict.optionActions.push({ label, mode, selectionCount, namedCount, selectionTabStops: tabStops.size,
    accessibleTree, selectionFocus, keyboardSelection: true, imagePointerSelection: true, summaryPointerSelection: true,
    broadAxe: christmas ? "WCAG A/AA on complete Options overlay" : "Not run: this control-only ordinary-mode regression does not claim broader ordinary-page accessibility." });
  assert.deepEqual(issues, []);
}
async function savedPageKeyboard(page, surface, label) {
  const actions = page.locator('main button:not([disabled]), main a[href], main input:not([disabled]), main [tabindex="0"]');
  const count = await actions.count();
  await page.keyboard.press("Tab");
  for (let i = 0; i < count; i++) {
    const action = actions.nth(i);
    await action.focus();
    const focus = await action.evaluate(el => {
      const style = getComputedStyle(el), box = el.getBoundingClientRect();
      return { name: el.getAttribute("aria-label") ?? el.textContent, active: document.activeElement === el,
        visible: el.matches(":focus-visible"), outlineWidth: parseFloat(style.outlineWidth), outlineStyle: style.outlineStyle,
        viewportVisible: box.bottom > 0 && box.top < innerHeight };
    });
    assert.ok(focus.active && focus.visible && focus.outlineWidth >= 2 && focus.outlineStyle !== "none" && focus.viewportVisible,
      `${surface}: missing visible keyboard focus: ${JSON.stringify(focus)}`);
  }
  const disabled = page.locator("main button:disabled");
  for (let i = 0; i < await disabled.count(); i++) {
    assert.equal(await disabled.nth(i).evaluate(el => { el.focus(); return document.activeElement === el; }), false,
      `${surface}: unavailable event action accepted keyboard focus`);
  }
  // History currently contains only unavailable travel/ticket actions. Record
  // that explicit noninteractive state instead of inventing a focus target.
  assert.ok(count > 0 || await disabled.count() > 0, `${surface}: expected saved event controls`);
  verdict.keyboard.push({ label, surface, enabledActionsWithVisibleFocus: count, unavailableActionsRejectingFocus: await disabled.count() });
}

try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  if (!optionsReproduction) for (const surface of Object.keys(controls)) {
    for (const mode of ["oversized-first", "oversized-last", "exhausted"]) {
      await check(`${surface}: retained reviewed park survives pending ${mode} refresh, retires on delivered uncertainty and requires explicit recovery selection`, async () => {
        const { context, page } = await createPage({ iso: "2026-12-05T18:00:00-06:00" });
        try {
          await openHome(page, surface);
          assert.match(await shell(page).innerText(), /Sparkle in the Park/);
          const requests = (await fixtures(page, "discovery")).length;
          const completions = (await fixtures(page, "discoveryCompletions")).length;
          await fixtures(page, "holdDiscovery");
          await fixtures(page, "refreshDiscoveryInPlace", `provider-${mode}`);
          await page.waitForFunction(count => window.christmasFixture.discovery().length > count, requests);
          await frame(page);
          assert.equal((await fixtures(page, "discoveryCompletions")).length, completions, "Controlled response must remain pending");
          assert.match(await shell(page).innerText(), /Sparkle in the Park/, "Same-query pending refresh must retain the valid selected event");
          await fixtures(page, "releaseDiscovery");
          await page.waitForFunction(count => window.christmasFixture.discoveryCompletions().length > count, completions);
          await frame(page);
          const delivery = (await fixtures(page, "discoveryCompletions")).at(-1);
          assert.equal(delivery.mode, `provider-${mode}`);
          assert.equal(delivery.retainedPark, true, "The delivered actual search response retains reviewed v2, avoiding empty-pool retirement");
          const closedAfterDelivery = await page.getByRole("button", { name: controls[surface].close, exact: true }).count() === 0;
          verdict.providerTransitions.push({ surface, mode, pendingSelectionRetained: true, delivery, closedAfterDelivery });
          await noOpenSelection(page, `delivered ${mode} source uncertainty`);
          const recovered = (await fixtures(page, "discoveryCompletions")).length;
          await fixtures(page, "refreshDiscoveryInPlace", "provider-complete");
          await page.waitForFunction(count => window.christmasFixture.discoveryCompletions().length > count, recovered);
          await frame(page);
          await noOpenSelection(page, "fresh sufficient evidence without explicit selection");
          await openHome(page, surface);
          assert.match(await shell(page).innerText(), /Sparkle in the Park/);
          await page.getByRole("button", { name: controls[surface].close, exact: true }).click();
          // Independent ordinary discovery/replanning remains usable after the
          // source uncertainty and recovery cycle.
          await openHome(page, surface, "movies");
          assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
          if (surface === "plan") {
            await page.getByRole("button", { name: /^(Plan a different night|Try the plan again)$/ }).click();
            assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
          }
          await page.getByRole("button", { name: controls[surface].close, exact: true }).click();
        } catch (error) {
          verdict.observations.push({ surface, transition: `provider-${mode}`, text: await page.locator("body").innerText(),
            requests: await fixtures(page, "discovery"), completions: await fixtures(page, "discoveryCompletions") });
          throw error;
        } finally { await context.close(); }
      });
    }
  }
  if (!optionsReproduction && !providerReproduction) for (const surface of Object.keys(controls)) {
    for (const transition of ["midnight", "missing-revision", "opt-out", "unavailable", "gala-to-market"]) {
      await check(`${surface}: Home selection retires through ${transition} and cannot resurrect`, async () => {
        const isMarket = transition === "gala-to-market";
        const { context, page } = await createPage({ iso: isMarket ? "2026-12-04T18:59:59-06:00" : transition === "midnight" ? "2026-12-31T23:59:59-06:00" : "2026-12-05T18:00:00-06:00" });
        try {
          await openHome(page, surface, isMarket ? "holiday-market" : "christmas-lights");
          assert.match(await shell(page).innerText(), isMarket ? /\$10 admission/ : /Sparkle in the Park/);
          if (transition === "midnight") await setTime(page, "2027-01-01T00:00:00-06:00");
          else if (transition === "gala-to-market") await setTime(page, "2026-12-04T19:00:00-06:00");
          else if (transition === "opt-out") { await fixtures(page, "configure", { christmasEnabled: false }); await frame(page); }
          else {
            const count = (await fixtures(page, "discovery")).length;
            await fixtures(page, "refreshDiscovery", transition === "missing-revision" ? "missing-revision" : "closed");
            await page.waitForFunction(count => window.christmasFixture.discovery().length > count, count);
            await frame(page);
          }
          await noOpenSelection(page, transition);
          if (isMarket) await setTime(page, "2026-12-05T09:00:00-06:00");
          else if (transition === "midnight") await setTime(page, "2026-12-31T23:59:59-06:00");
          else if (transition === "opt-out") { await fixtures(page, "configure", { christmasEnabled: true }); await frame(page); }
          else {
            const count = (await fixtures(page, "discovery")).length; await fixtures(page, "refreshDiscovery", "reviewed");
            await page.waitForFunction(count => window.christmasFixture.discovery().length > count, count); await frame(page);
          }
          await noOpenSelection(page, `${transition} recovery without new click`);
          // A new explicit selection remains possible and uses the new session.
          await openHome(page, surface, isMarket ? "holiday-market" : "christmas-lights");
          if (isMarket) assert.match(await shell(page).innerText(), /Saturday market/);
          await page.getByRole("button", { name: controls[surface].close, exact: true }).click();
        } catch (error) {
          verdict.observations.push({ surface, transition, text: await page.locator("body").innerText(),
            links: await page.locator('a[href]').evaluateAll(items => items.map(item => ({ text: item.textContent, href: item.getAttribute("href") }))) });
          throw error;
        } finally { await context.close(); }
      });
    }
  }
  if (!optionsReproduction && !providerReproduction) for (const surface of Object.keys(controls)) {
    await check(`${surface}: Anything selection rejects park substitution while retaining independently chosen cinema`, async () => {
      const { context, page } = await createPage({ iso: "2026-12-05T18:00:00-06:00" });
      try {
        await page.evaluate(() => { Math.random = () => 0; });
        await openHome(page, surface, "anything");
        assert.match(await shell(page).innerText(), /Sparkle in the Park/);
        if (surface === "options") await shell(page).getByRole("button", { name: "Choose event", exact: true }).focus();
        const count = (await fixtures(page, "discovery")).length;
        await fixtures(page, "refreshDiscovery", "missing-revision");
        await page.waitForFunction(count => window.christmasFixture.discovery().length > count, count); await frame(page);
        if (surface === "result") await noOpenSelection(page, "Anything missing revision");
        else {
          assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
          assert.doesNotMatch(await shell(page).innerText(), /Sparkle|Central Park/);
          assert.equal(await page.getByRole("dialog").count(), 1, "mixed modal must remain a dialog when an event retires");
          assert.equal(await shell(page).evaluate(el => el.contains(document.activeElement)), true, "retiring focused event keeps focus in surviving dialog");
        }
        const next = (await fixtures(page, "discovery")).length;
        await fixtures(page, "refreshDiscovery", "reviewed");
        await page.waitForFunction(count => window.christmasFixture.discovery().length > count, next); await frame(page);
        if (surface === "result") await noOpenSelection(page, "Anything recovery without click");
        else {
          assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
          assert.doesNotMatch(await shell(page).innerText(), /Sparkle|Central Park/);
          await page.keyboard.press("Escape"); await frame(page);
          await noOpenSelection(page, "mixed modal Escape");
        }
      } catch (error) {
        verdict.observations.push({ surface, transition: "Anything missing-revision", text: await page.locator("body").innerText(),
          links: await page.locator('a[href]').evaluateAll(items => items.map(item => ({ text: item.textContent, href: item.getAttribute("href") }))) });
        throw error;
      } finally { await context.close(); }
    });
  }
  const widths = reproduction ? [320] : [320, 390, 512];
  const motions = reproduction ? ["no-preference"] : ["no-preference", "reduce"];
  const matrix = widths.flatMap(width => ["light", "dark"].flatMap(theme => motions.map(motion => ({ width, theme, motion, modeScope: !reproduction }))));
  if (!reproduction && !optionsReproduction) for (const theme of ["light", "dark"]) matrix.push({ width: 390, theme, motion: "no-preference", modeScope: false });
  if (!providerReproduction) for (const { width, theme, motion, modeScope } of matrix) {
    const label = `${width}px ${theme} ${motion}${modeScope ? " date-night-active" : ""}`;
    const { context, page } = await createPage({ width, theme, motion, modeScope });
    try {
      await page.addScriptTag({ content: axeSource });
      await fixtures(page, "seedAllEvents");
      if (!optionsReproduction) for (const surface of Object.keys(controls)) {
        await check(`${label} ${surface}: keyboard dialog entry, containment, return and Escape`, () => keyboardCase(page, surface));
        await check(`${label} ${surface}: AA contrast and layout`, async () => {
          await openHome(page, surface, "holiday-market");
          await page.screenshot({ path: resolve(output, `${width}-${theme}-${motion}${modeScope ? "-date-night" : ""}-${surface}.png`), fullPage: false });
          await contrastCase(page, surface, label);
          assertBroadAxe(await broadAxe(page, surface, label), surface);
        });
        if (await page.getByRole("button", { name: controls[surface].close, exact: true }).count()) await page.getByRole("button", { name: controls[surface].close, exact: true }).click();
      }
      if (!optionsReproduction) for (const surface of ["result", "options"]) {
        await check(`${label} ordinary-only Christmas ${surface}: keyboard dialog continuity`, () => keyboardCase(page, surface, "movies"));
      }
      if (!optionsReproduction) await check(`${label} mixed Options to ordinary Result preserves modality and Home focus return`, async () => {
        const trigger = await openHome(page, "options", "anything");
        const cinema = shell(page).locator("article").filter({ hasText: "Fixture ordinary cinema" });
        const choose = cinema.locator("button").filter({ hasText: "Fixture ordinary cinema" });
        await choose.focus(); await page.keyboard.press("Enter");
        await page.getByRole("button", { name: "Close result", exact: true }).waitFor(); await frame(page);
        assert.match(await shell(page).innerText(), /Fixture ordinary cinema/);
        assert.equal(await page.getByRole("dialog").count(), 1);
        assert.equal(await shell(page).evaluate(el => el.contains(document.activeElement)), true);
        await page.keyboard.press("Escape"); await frame(page);
        assert.equal(await page.getByRole("button", { name: "Close result", exact: true }).count(), 0);
        assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
      });
      if (await page.getByRole("button", { name: "Close result", exact: true }).count()) await page.getByRole("button", { name: "Close result", exact: true }).click();
      if (await page.getByRole("button", { name: "Close options", exact: true }).count()) await page.getByRole("button", { name: "Close options", exact: true }).click();
      if (!optionsReproduction) for (const surface of ["favorites", "history"]) {
        await check(`${label} ${surface}: AA contrast, keyboard focus and layout`, async () => {
          await fixtures(page, "show", surface); await page.locator(`[data-christmas-surface="${surface}"]`).first().waitFor();
          await page.screenshot({ path: resolve(output, `${width}-${theme}-${motion}${modeScope ? "-date-night" : ""}-${surface}.png`), fullPage: true });
          await contrastCase(page, surface, label);
          await savedPageKeyboard(page, surface, label);
          assertBroadAxe(await broadAxe(page, surface, label, "main"), surface);
        });
      }
      // Return from saved pages to the actual Home before exercising mixed and
      // ordinary-only options. Every original acceptance control remains above.
      await fixtures(page, "show", "home"); await frame(page);
      for (const category of ["anything", "movies"]) {
        await check(`${label} ${category === "anything" ? "mixed" : "ordinary-only Christmas"} Options: one named selection action, Tab, Enter and pointer paths`,
          () => optionActionCase(page, label, category));
      }
      if (!optionsReproduction) {
        await check(`${label} ordinary Date Night Options: one named selection action and existing input paths`,
          () => optionActionCase(page, label, "movies", false));
        await check(`${label} event rating panel: broad WCAG A/AA audit and keyboard controls`, async () => {
          await openHome(page, "result", "holiday-market");
          await page.getByRole("button", { name: "We did this", exact: true }).click();
          await page.getByRole("button", { name: "Save choice", exact: true }).waitFor(); await frame(page);
          assertBroadAxe(await broadAxe(page, "rating", label), "rating");
          await assertLayout(page);
          const rating = page.getByRole("button", { name: "5 Favorite", exact: true });
          await rating.focus(); await page.keyboard.press("Enter");
          assert.equal(await rating.getAttribute("aria-pressed"), "true");
          await page.keyboard.press("Escape"); await frame(page);
          assert.equal(await page.getByRole("button", { name: "Close result", exact: true }).count(), 0);
        });
      }
    } finally { await context.close(); }
  }
  await check("no page errors or external requests", () => { assert.deepEqual(verdict.pageErrors, []); assert.deepEqual(verdict.externalRequests, []); });
  await check("source and harness remained stable during acceptance", async () => {
    assert.equal(await fingerprint(appRoot, appInputs), appFingerprint);
    assert.equal(await fingerprint(harnessRoot, harnessInputs), harnessFingerprint);
    assert.equal(git(appRoot, "rev-parse", "HEAD"), sourceSha);
  });
  verdict.passed = verdict.cases.every(item => item.passed);
  if (!verdict.passed) process.exitCode = 1;
} catch (error) {
  verdict.failure = { name: error.name, message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  await browser?.close(); await new Promise(done => server.close(done));
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify({ passed: verdict.passed, reproduction, optionsReproduction, providerReproduction, sourceSha, sourceTree, cases: verdict.cases.length, failures: verdict.cases.filter(item => !item.passed).length, output, failure: verdict.failure }));
}

// Keep the accepted 239 controls and their historical reproduction modes intact.
// The additional real-search/mounted-cache regression has its own downloadable
// byte receipt within this existing CI artifact; no workflow change is needed.
if (!reproduction && !optionsReproduction && !providerReproduction) {
  const childOutput = resolve(output, "cross-origin");
  process.env.CHRISTMAS_CROSS_ORIGIN_APP_ROOT = appRoot;
  process.env.CHRISTMAS_CROSS_ORIGIN_OUTPUT = childOutput;
  try {
    await import("./christmas-cross-origin-browser.mjs");
    const bytes = await readFile(resolve(childOutput, "verdict.json"));
    const child = JSON.parse(bytes.toString("utf8"));
    verdict.crossOrigin = { path: "cross-origin/verdict.json", sha256: createHash("sha256").update(bytes).digest("hex"),
      passed: child.passed, cases: child.cases.length, sourceSha: child.sourceSha, sourceTree: child.sourceTree,
      appFingerprint: child.appFingerprint, harnessFingerprint: child.harnessFingerprint, bundleFingerprint: child.bundleFingerprint };
    verdict.passed = verdict.passed && child.passed;
  } catch (error) { verdict.passed = false; verdict.crossOrigin = { passed: false, failure: error.message }; }
  if (!verdict.passed) process.exitCode = 1;
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify({ passed: verdict.passed, sourceSha, crossOrigin: verdict.crossOrigin, output }));
}
