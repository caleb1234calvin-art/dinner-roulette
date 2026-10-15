import { REGIONAL_ROWS, REGIONAL_PRESENTATIONS, REGIONAL_MATERIAL_FACTS, REGIONAL_CONFIDENCE, assertRegionalCatalog, WAVE2_EXPECTED_PRESENTATIONS } from "./test-support/regional-wave1.mjs";
import { THREE_CLEARED_PRESENTATIONS, THREE_CLEARED_MATERIAL_FACTS, THREE_CLEARED_CONFIDENCE, assertThreeClearedCatalog } from "./test-support/three-cleared.mjs";
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
import { assertAdmissionConsumerCopy } from "./test-support/admission-amendments.mjs";
import { OCCURRENCE_AMENDMENTS, occurrencePresentationAfter, assertOccurrenceConsumerCopy } from "./test-support/occurrence-amendments.mjs";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
import { OWNER_EVIDENCE_MATERIAL_FACTS, OWNER_EVIDENCE_CONFIDENCE } from "./test-support/owner-evidence-browser-facts.mjs";
import { RANKED_HOLDS_MATERIAL_FACTS, RANKED_HOLDS_CONFIDENCE } from "./test-support/ranked-holds-browser-facts.mjs";
import { HOLD_CLEANUP_MATERIAL_FACTS, HOLD_CLEANUP_CONFIDENCE, assertCleanupConsumerCopy } from "./test-support/hold-cleanup-browser-facts.mjs";
import { NEXT_MISSOURI_MATERIAL_FACTS, NEXT_MISSOURI_CONFIDENCE } from "./test-support/next-missouri-browser-facts.mjs";
import { PHASE4_MATERIAL_FACTS, PHASE4_FORBIDDEN_COPY } from "./test-support/phase4-recovery-browser-facts.mjs";
const baseline = "2fe002e6bdc9c2c42ecfc0d61e4de08df20d0d81";
const proof = assertBrowserBuild();
const occurrenceBase = "8353e60056fb0568360c5c13878d102880395d9f";
const occurrenceBaselineSource = execFileSync("git", ["show", `${occurrenceBase}:src/lib/date-night/seasonal-presentation-catalog.ts`], { encoding: "utf8" });
const occurrenceBaseline = JSON.parse(occurrenceBaselineSource.slice(occurrenceBaselineSource.indexOf(" = {") + 3, occurrenceBaselineSource.lastIndexOf(";")));
assert.equal(Object.keys(occurrenceBaseline).length, 67);
const occurrencePresentations = Object.fromEntries(OCCURRENCE_AMENDMENTS.map(({ recordId }) =>
  [recordId, occurrencePresentationAfter(recordId, occurrenceBaseline[recordId])]));
const out = "audit/browser-results/seasonal-card-layout";
fs.mkdirSync(out, { recursive: true });
const req = createRequire(import.meta.url), pure = appModuleLoader();
const ownerLaneFacts = { ...RANKED_HOLDS_MATERIAL_FACTS, ...OWNER_EVIDENCE_MATERIAL_FACTS, ...THREE_CLEARED_MATERIAL_FACTS };
const ownerLaneConfidence = { ...RANKED_HOLDS_CONFIDENCE, ...OWNER_EVIDENCE_CONFIDENCE, ...THREE_CLEARED_CONFIDENCE };
const rows = [
  ...pure("src/lib/date-night/regional-2026-wave1-catalog.ts").REGIONAL_2026_WAVE1_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-three-cleared-catalog.ts").MISSOURI_2026_THREE_CLEARED_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-owner-evidence-catalog.ts").MISSOURI_2026_OWNER_EVIDENCE_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-ranked-holds-catalog.ts").MISSOURI_2026_RANKED_HOLDS_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-hold-cleanup-catalog.ts").MISSOURI_2026_HOLD_CLEANUP_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-next-catalog.ts").MISSOURI_2026_NEXT_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-cleared-catalog.ts").MISSOURI_2026_CLEARED_SEASONAL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-v1-catalog.ts").MISSOURI_2026_V1_SEASONAL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-v1-next-catalog.ts").MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts").MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-late-fall-catalog.ts").MISSOURI_2026_LATE_FALL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-final-four-catalog.ts").MISSOURI_2026_FINAL_FOUR_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-deferred-batch-3-catalog.ts").MISSOURI_2026_DEFERRED_BATCH_3_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-astra-eleven-catalog.ts").MISSOURI_2026_ASTRA_ELEVEN_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-astra-commercial-catalog.ts").MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-astra-delta-catalog.ts").MISSOURI_2026_ASTRA_DELTA_CATALOG,
  ...pure("src/lib/date-night/missouri-2026-phase4-recovery-catalog.ts").MISSOURI_2026_PHASE4_RECOVERY_CATALOG,
];
assertThreeClearedCatalog(rows, pure("src/lib/date-night/seasonal-presentation-catalog.ts").SEASONAL_PRESENTATIONS);
assertRegionalCatalog(rows, pure("src/lib/date-night/seasonal-presentation-catalog.ts").SEASONAL_PRESENTATIONS);
assert.deepEqual(rows.filter(row => REGIONAL_PRESENTATIONS[row.seasonalListing.recordId]), REGIONAL_ROWS,
  "Geometry subjects are bound to all twelve independently accepted records");

const wave2Fixture = JSON.parse(fs.readFileSync("audit/halloween-wave2-2026-10-14/ADAPTED-TEN-FROZEN-INPUTS.json", "utf8"));
const wave2Rows = pure("src/lib/date-night/halloween-2026-wave2-catalog.ts").WAVE2_2026_CATALOG;
assert.equal(wave2Rows.length, 10, "All ten candidate attractions require strict geometry");
assert.deepEqual(wave2Rows.map(row => row.id), wave2Fixture.identityOrder,
  "Geometry candidates bound to frozen independently researched identities");
const wave2Ids = new Set(wave2Rows.map(row => row.id));
const geometryRows = [...rows, ...wave2Rows];
assert.equal(geometryRows.length, 92, "All 82 existing and ten proposed listings receive geometry coverage");
assert.equal(new Set(geometryRows.map(row => row.id)).size, 92);

const { HALLOWEEN_THRILL_TYPES, HALLOWEEN_SETTLE_TYPES } = pure("src/lib/date-night/season.ts");
const isThrill = row => row.activityTypes.some(type => HALLOWEEN_THRILL_TYPES.includes(type));
const isSettle = row => row.activityTypes.some(type => HALLOWEEN_SETTLE_TYPES.includes(type));
const geometryKinds = row => ["options", "result", ...(isThrill(row) ? ["plan"] : isSettle(row) ? ["plan-settle"] : [])];
const geometryWidths = [320, 390, 512];
const comparisonVariants = ["standard", "ordinary", "current-standard", "current-ordinary", "before", "after"];
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
    const random = Math.random;
    Math.random = () => 0; // Identical non-seasonal tagline across comparisons.
    let html;
    try { html = renderToStaticMarkup(React.createElement(Component, props)); }
    finally { Math.random = random; }
    delete globalThis.document;
    return html.replace(/src="(\/[^"]+)"/g, (_match, src) => `src="data:image/jpeg;base64,${fs.readFileSync(`public${src}`).toString("base64")}"`);
  };
}
const decorate = row => ({ ...row, cuisineLabel: row.activityTypes.join(" · "), distanceMiles: 2.5, hoursKnown: false, isOpen: false, closingSoon: false });
const ordinary = row => ({ ...decorate(row), id: "ordinary-layout-control", seasonalListing: undefined, seasonalAvailability: undefined, seasonalVisitNotes: undefined, activityTypes: row.activityTypes, name: row.name });
const verdict = { passed: false, baseline, proof, occurrenceIdentityBaseline: { commit: occurrenceBase, retainedIds: geometryRows.map(row => row.id).sort() }, comparisons: [], errors: [] };
let browser;
try {
  browser = await chromium.launch({ headless: true });
  verdict.ineligiblePlanControls = [];
  for (const row of geometryRows.filter(row => !isThrill(row))) {
    const html = renderer()("plan", [decorate(row), { ...ordinary(row), id: "second-control", name: "Ordinary park", activityTypes: ["park"] }]);
    assert.ok(!html.includes("<article"), "Non-thrill first stops must not fabricate Scare plan cards");
    assert.ok(html.includes("No complete seasonal pair yet."));
    verdict.ineligiblePlanControls.push(row.id);
  }
  for (const width of geometryWidths) {
    for (const row of geometryRows) {
    for (const kind of geometryKinds(row)) {
      const isPlan = kind === "plan" || kind === "plan-settle", componentKind = isPlan ? "plan" : kind;
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
      const page = await context.newPage();
      const measured = {};
      await context.route("**/*", route => route.abort());
      try {
      for (const variant of comparisonVariants) {
        const render = renderer(variant !== "after" && !variant.startsWith("current-"));
        const item = ["ordinary", "standard", "current-standard", "current-ordinary"].includes(variant) ? ordinary(row) : decorate(row);
        if (variant.endsWith("standard")) { item.name = "Ordinary park"; item.activityTypes = ["park"]; }
        // Both sides require the same valid Scare/Settle fixture.
        if (isPlan) item.activityTypes = row.activityTypes;
        const records = kind === "plan-settle"
          ? [{ ...ordinary(row), id: "first-control", name: "Ordinary escape room", activityTypes: ["escape-room"] }, item]
          : [item, { ...ordinary(row), id: "second-control", name: "Ordinary park", activityTypes: ["park"] }];
        await page.setContent(`<html class="dark"><head><style>${css}</style></head><body>${render(componentKind, records)}</body></html>`);
        await page.locator("img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        const card = kind === "result" ? page.locator(".result-in") : page.locator("article").nth(kind === "plan-settle" ? 1 : 0);
        assert.equal(await card.count(), 1, "A valid geometry fixture must render its card");
        const geometry = await card.evaluate((el, kind) => {
          const rect = el.getBoundingClientRect(), image = kind === "result" ? document.querySelector("img") : el.querySelector("img"), media = image.parentElement.getBoundingClientRect();
          return { width: rect.width, height: rect.height, mediaHeight: media.height, cardClass: el.className,
            mediaClass: image.parentElement.className, scrollWidth: el.scrollWidth,
            overflowElements: [...el.querySelectorAll("*")].filter(child => child.clientWidth > 0 && child.scrollWidth > child.clientWidth + 1).map(child => ({ tag: child.tagName, text: child.textContent, className: child.className, width: child.clientWidth, scrollWidth: child.scrollWidth, overflow: child.scrollWidth - child.clientWidth })),
            summary: el.querySelector("summary")?.getBoundingClientRect().toJSON() };
        }, kind);
        measured[variant] = geometry;
        // Current controls must fit at every accepted viewport. The old-source
        // variants remain measured evidence of the original 320px defect.
        if (kind === "result" && (variant === "after" || variant.startsWith("current-"))) {
          const directions = await card.getByRole("link", { name: /Directions · Google Maps/ }).evaluate(el => {
            const box = el.getBoundingClientRect();
            return { width: el.clientWidth, scrollWidth: el.scrollWidth, height: box.height,
              left: box.left, right: box.right,
              label: [...el.querySelectorAll("span")].map(label => ({ width: label.clientWidth, scrollWidth: label.scrollWidth })) };
          });
          geometry.directions = directions;
          assert.ok(directions.scrollWidth <= directions.width, "Directions fits without horizontal overflow");
          assert.ok(directions.label.every(label => label.scrollWidth <= label.width), "Full Directions label remains readable");
          assert.ok(directions.height >= 56, "Directions retains its 56px minimum touch target");
          assert.ok(directions.left >= 0 && directions.right <= width, "Directions stays within the viewport");
          assert.ok(geometry.scrollWidth <= geometry.width + 1, "Current result card fits the viewport");
        }
        await page.screenshot({ path: `${out}/${row.seasonalListing?.recordId ?? row.id}-${width}-${kind}-${variant}.png`, fullPage: true });
        fs.writeFileSync(`${out}/current-measurement.json`, JSON.stringify({ id: row.id, kind, width, variant, measured }, null, 2));
        if (variant === "after") {
          const details = card.locator("details");
          assert.equal(await details.getAttribute("open"), null);
          assert.equal(await card.locator("[data-seasonal-visit-notes] > p").innerText(), "Check current hours, admission, and weather before you go.");
          assert.ok(geometry.summary.height >= 24, "Details has at least a 24px target");
          // The full result has a separately accepted inherited Directions-label
          // overflow at 320px. Do not confuse that unchanged control with a new
          // seasonal-content overflow, or erase its measured baseline.
          const priorOverflow = kind === "result" ? Math.max(measured.before.scrollWidth, measured.ordinary.scrollWidth) : geometry.width;
          assert.ok(geometry.scrollWidth <= Math.max(geometry.width, priorOverflow) + 1, "No new horizontal card overflow");
          if (kind === "result") for (const child of geometry.overflowElements) {
            const prior = measured.before.overflowElements.find(old => old.tag === child.tag && old.text === child.text);
            assert.ok(prior && child.overflow <= prior.overflow + 1, `No newly overflowing result element: ${child.text}`);
          }
          const noteGeometry = await card.locator("[data-seasonal-visit-notes]").evaluate(el => {
            const box = el.getBoundingClientRect();
            return { width: box.width, scrollWidth: el.scrollWidth, descendants: [...el.querySelectorAll("p, summary, summary span")].map(child => ({ text: child.textContent, width: child.getBoundingClientRect().width, scrollWidth: child.scrollWidth })) };
          });
          geometry.notes = noteGeometry;
          assert.ok(noteGeometry.scrollWidth <= noteGeometry.width + 1, "Seasonal notice and summary never overflow");
          for (const child of noteGeometry.descendants) assert.ok(child.scrollWidth <= child.width + 1, "Seasonal text is not clipped");
          await details.locator("summary").focus();
          await details.locator("summary").press("Enter");
          assert.notEqual(await details.getAttribute("open"), null);
          assert.ok(await details.locator("p").count());
          const paragraphs = await details.locator("p").allTextContents();
          assertAdmissionConsumerCopy(row.seasonalListing.recordId, paragraphs);
          assertOccurrenceConsumerCopy(row.seasonalListing.recordId, paragraphs);
          if (WAVE2_EXPECTED_PRESENTATIONS[row.seasonalListing.recordId]) {
            const expected = WAVE2_EXPECTED_PRESENTATIONS[row.seasonalListing.recordId];
            assert.deepEqual(paragraphs, expected.details,
              "Wave 2 exact frozen visitor Details survive every width, overlay and geometry variant");
            assert.equal(await card.locator("[data-seasonal-confidence]").innerText(),
              expected.confidence === "high" ? "High confidence" : expected.confidence === "good" ? "Good confidence" : "Limited details");
            assert.match(await card.innerText(), /Approx\./);
            assert.doesNotMatch(await card.innerText(), /Open now|reviewRevision|listingExpiresAt|ListingCompletenessV1/);
            assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
            if (kind !== "options") {
              const maps = card.getByRole("link", { name: isPlan ? "Maps" : /Directions · Google Maps/, exact: isPlan });
              assert.equal(new URL(await maps.getAttribute("href")).searchParams.get("destination"), row.address);
            }
          }
          if (REGIONAL_PRESENTATIONS[row.seasonalListing.recordId]) {
            const recordId = row.seasonalListing.recordId, expected = REGIONAL_PRESENTATIONS[recordId];
            assert.deepEqual(paragraphs, expected.details, "Every exact independently accepted regional Detail survives every width and qualified overlay");
            assert.equal(await card.locator("[data-seasonal-confidence]").innerText(), REGIONAL_CONFIDENCE[recordId] === "high" ? "High confidence" : REGIONAL_CONFIDENCE[recordId] === "good" ? "Good confidence" : "Limited details");
            assert.match(await card.innerText(), /Approx\./);
            assert.doesNotMatch(await card.innerText(), /Open now|audit|provenance|retention|Census|reviewRevision|listingExpiresAt|ListingCompletenessV1/);
            for (const fact of REGIONAL_MATERIAL_FACTS[recordId]) assert.match(await details.innerText(), fact);
            assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
            const controls = [page.getByRole("button", { name: isPlan ? "Close night plan" : `Close ${kind}`, exact: true })];
            if (kind === "options") controls.push(page.getByRole("button", { name: "Shuffle options", exact: true }));
            else {
              const maps = card.getByRole("link", { name: isPlan ? "Maps" : /Directions · Google Maps/, exact: isPlan });
              assert.equal(new URL(await maps.getAttribute("href")).searchParams.get("destination"), row.seasonalListing.visitorAddress);
              controls.push(maps);
              const website = card.getByRole("link", { name: isPlan ? "Info" : /Website & info/, exact: isPlan });
              assert.equal(await website.getAttribute("href"), row.website);
              controls.push(website);
              if (kind === "result") {
                const uber = card.getByRole("link", { name: "Open Uber; choose your destination in the external service", exact: true });
                assert.equal(await uber.getAttribute("href"), "https://m.uber.com/");
                controls.push(uber);
              }
            }
            geometry.regional = { details: paragraphs, confidence: REGIONAL_CONFIDENCE[recordId], controls: [] };
            for (const control of controls) {
              await control.scrollIntoViewIfNeeded();
              await control.click({ trial: true });
              geometry.regional.controls.push({ label: await control.innerText(), href: await control.getAttribute("href"), reachable: true });
            }
          }
          if (THREE_CLEARED_PRESENTATIONS[row.seasonalListing.recordId]) {
            assert.deepEqual(paragraphs, THREE_CLEARED_PRESENTATIONS[row.seasonalListing.recordId].details, "All exact independently cleared new Details survive geometry rendering");
          }
          if (occurrencePresentations[row.seasonalListing.recordId]) {
            assert.deepEqual(paragraphs, occurrencePresentations[row.seasonalListing.recordId].details,
              "Exact independently cleared occurrence Details in every geometry variant");
            geometry.occurrenceDetails = paragraphs;
          }
          if (PHASE4_MATERIAL_FACTS[row.seasonalListing.recordId]) {
            const text = await card.innerText();
            assert.match(text, /Approx\./, "Phase 4 never implies precise distance");
            assert.doesNotMatch(text, PHASE4_FORBIDDEN_COPY, "No prices, refund boilerplate or audit prose in Phase 4 cards");
            assert.equal(await card.locator("[data-seasonal-confidence]").innerText(), "Limited details");
            for (const fact of PHASE4_MATERIAL_FACTS[row.seasonalListing.recordId]) assert.match(await details.innerText(), fact);
            assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
            const maps = card.getByRole("link", { name: isPlan ? "Maps" : /Directions · Google Maps/, exact: isPlan });
            if (kind !== "options") assert.equal(new URL(await maps.getAttribute("href")).searchParams.get("destination"), row.address);
          }
          if (HOLD_CLEANUP_MATERIAL_FACTS[row.seasonalListing.recordId]) {
            const recordId = row.seasonalListing.recordId;
            const text = await card.innerText();
            assert.match(text, /Approx\./);
            assertCleanupConsumerCopy(text, recordId, PHASE4_FORBIDDEN_COPY);
            assert.equal(await card.locator("[data-seasonal-confidence]").innerText(), HOLD_CLEANUP_CONFIDENCE[recordId] === "good" ? "Good confidence" : "Limited details");
            for (const fact of HOLD_CLEANUP_MATERIAL_FACTS[recordId]) assert.match(await details.innerText(), fact);
            assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
            if (kind !== "options") {
              const maps = card.getByRole("link", { name: isPlan ? "Maps" : /Directions · Google Maps/, exact: isPlan });
              assert.equal(new URL(await maps.getAttribute("href")).searchParams.get("destination"), row.address);
            }
          }
          if (ownerLaneFacts[row.seasonalListing.recordId]) {
            assert.match(await card.innerText(), /Approx\./);
            assert.doesNotMatch(await card.innerText(), PHASE4_FORBIDDEN_COPY);
            const confidence = ownerLaneConfidence[row.seasonalListing.recordId];
            assert.equal(await card.locator("[data-seasonal-confidence]").innerText(), confidence === "high" ? "High confidence" : confidence === "good" ? "Good confidence" : "Limited details");
            for (const fact of ownerLaneFacts[row.seasonalListing.recordId]) assert.match(await details.innerText(), fact);
            assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
            if (kind !== "options") {
              const maps = card.getByRole("link", { name: isPlan ? "Maps" : /Directions · Google Maps/, exact: isPlan });
              assert.equal(new URL(await maps.getAttribute("href")).searchParams.get("destination"), row.address);
            }
          }
          if (NEXT_MISSOURI_MATERIAL_FACTS[row.seasonalListing.recordId]) {
            assert.match(await card.innerText(), /Approx\./);
            assert.doesNotMatch(await card.innerText(), PHASE4_FORBIDDEN_COPY);
            const confidence = NEXT_MISSOURI_CONFIDENCE[row.seasonalListing.recordId];
            assert.equal(await card.locator("[data-seasonal-confidence]").innerText(), confidence === "high" ? "High confidence" : confidence === "good" ? "Good confidence" : "Limited details");
            for (const fact of NEXT_MISSOURI_MATERIAL_FACTS[row.seasonalListing.recordId]) assert.match(await details.innerText(), fact);
            assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
            if (kind !== "options") {
              const maps = card.getByRole("link", { name: isPlan ? "Maps" : /Directions · Google Maps/, exact: isPlan });
              assert.equal(new URL(await maps.getAttribute("href")).searchParams.get("destination"), row.address);
            }
          }
          if (isPlan || occurrencePresentations[row.seasonalListing.recordId] || REGIONAL_PRESENTATIONS[row.seasonalListing.recordId] || WAVE2_EXPECTED_PRESENTATIONS[row.seasonalListing.recordId]) {
            const paragraphs = details.locator("p");
            geometry.expandedNotes = [];
            for (let index = 0; index < await paragraphs.count(); index++) {
              const paragraph = paragraphs.nth(index);
              await paragraph.scrollIntoViewIfNeeded();
              await paragraph.evaluate(el => el.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }));
              const metric = await paragraph.evaluate(el => {
                const box = el.getBoundingClientRect();
                const x = Math.max(0, Math.min(innerWidth - 1, box.x + box.width / 2));
                const y = Math.max(0, Math.min(innerHeight - 1, box.y + box.height / 2));
                const hit = document.elementFromPoint(x, y);
                return { text: el.textContent, x: box.x, y: box.y, width: box.width, height: box.height,
                  bottom: box.bottom, scrollWidth: el.scrollWidth, viewportWidth: innerWidth, viewportHeight: innerHeight,
                  fontSize: getComputedStyle(el).fontSize, unobscured: Boolean(hit && (el.contains(hit) || hit.contains(el))) };
              });
              geometry.expandedNotes.push(metric);
              await page.screenshot({ path: `${out}/${row.seasonalListing?.recordId ?? row.id}-${width}-${isPlan ? "plan" : kind}-expanded-${index}.png` });
              assert.ok(metric.scrollWidth <= metric.width + 1, "Expanded material fact is not clipped horizontally");
              assert.ok(metric.y >= 0 && metric.bottom <= metric.viewportHeight + 1 && metric.height > 0 && metric.unobscured, "Expanded material fact is readable after scrolling");
              assert.ok(parseFloat(metric.fontSize) >= 12, "Expanded material facts retain readable text size");
            }
          }
          await details.locator("summary").press("Enter");
          assert.equal(await details.getAttribute("open"), null);
        }
        await page.screenshot({ path: `${out}/${row.seasonalListing?.recordId ?? row.id}-${width}-${kind}-${variant}.png`, fullPage: true });
      }
      const delta = measured.after.height - measured.ordinary.height;
      verdict.comparisons.push({ id: row.id, kind, width, ...measured, delta, standardDelta: measured.after.height - measured.standard.height, percent: delta / measured.ordinary.height * 100 });
      assert.equal(measured["current-ordinary"].height, measured.ordinary.height, "Ordinary matched card height is unchanged");
      assert.equal(measured["current-standard"].height, measured.standard.height, "Short ordinary card height is unchanged");
      assert.equal(measured.after.mediaHeight, measured.ordinary.mediaHeight);
      assert.equal(measured.after.mediaClass, measured.ordinary.mediaClass);
      assert.equal(measured.after.cardClass, measured.ordinary.cardClass);
      if (delta > (kind === "options" ? 0.5 : 5)) verdict.errors.push(`Collapsed ${kind} seasonal card exceeds matched ordinary by ${delta}px at ${width}: ${row.name}`);
      if (["options", "plan", "plan-settle"].includes(kind) && measured.after.height - measured.standard.height > (kind === "options" ? 0.5 : 5)) verdict.errors.push(`Collapsed ${kind} exceeds short standard by ${measured.after.height - measured.standard.height}px at ${width}: ${row.name}`);
      assert.ok(measured.after.height <= measured.before.height);
      } catch (error) {
        verdict.errors.push({ id: row.id, kind, width, message: error.stack });
        if (!verdict.comparisons.some(item => item.id === row.id && item.kind === kind && item.width === width)) verdict.comparisons.push({ id: row.id, kind, width, ...measured, incomplete: true });
      } finally { await context.close(); }
      fs.writeFileSync(`${out}/verdict.json`, JSON.stringify(verdict, null, 2));
    }
    }
  }
  assert.equal(verdict.comparisons.length, geometryRows.reduce((count, row) => count + geometryKinds(row).length * geometryWidths.length, 0),
    "Exact geometry scenario accounting retains every historical and regional width/overlay comparison");
  const regionalComparisons = verdict.comparisons.filter(item => REGIONAL_ROWS.some(row => row.id === item.id));
  assert.equal(regionalComparisons.length, 12 * 3 * 3, "All twelve regional records have Options, Result and valid Scare Plan at three widths");
  for (const comparison of regionalComparisons) {
    assert.deepEqual(comparisonVariants.filter(variant => comparison[variant]), comparisonVariants, "All six regional comparison variants ran");
  }
  const wave2Comparisons = verdict.comparisons.filter(item => wave2Ids.has(item.id));
  assert.equal(wave2Comparisons.length,
    wave2Rows.reduce((sum, row) => sum + geometryKinds(row).length * geometryWidths.length, 0),
    "Every Wave 2 venue must run all applicable overlay/width comparisons");
  for (const comparison of wave2Comparisons) {
    assert.deepEqual(comparisonVariants.filter(variant => comparison[variant]), comparisonVariants,
      "Wave 2 all six geometry variants executed for every overlay and width");
    assert.equal(comparison.incomplete, undefined, "Wave 2 may not silently pass incomplete geometry");
  }
  verdict.wave2Geometry = { acceptedIds: wave2Rows.map(row => row.id), widths: geometryWidths,
    variants: comparisonVariants, expectedComparisons: wave2Comparisons.length,
    completedComparisons: wave2Comparisons.length };
  verdict.regionalGeometry = { acceptedIds: REGIONAL_ROWS.map(row => row.id), widths: geometryWidths,
    variants: comparisonVariants, expectedComparisons: 108, completedComparisons: regionalComparisons.length };
  verdict.passed = verdict.errors.length === 0;
  if (!verdict.passed) process.exitCode = 1;
} catch (error) { verdict.errors.push(error.stack); process.exitCode = 1; }
finally { await browser?.close(); fs.writeFileSync(`${out}/verdict.json`, JSON.stringify(verdict, null, 2)); }
