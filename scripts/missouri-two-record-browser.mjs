import { dateNightRpcEvidence, assertBoundedSeasonalAudit } from "./test-support/hybrid-rpc-evidence.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
assert.equal(process.env.CI, "true");
const proof = assertBrowserBuild();
const output = resolve("audit/browser-results/missouri-two-records");
await mkdir(output, { recursive: true });
const control = resolve(output, "control.json"), events = resolve(output, "events.jsonl");
const origin = "http://127.0.0.1:8097", defaultAt = "2026-10-07T18:00:00Z";
const setControl = async state => {
  await writeFile(`${control}.next`, JSON.stringify(state));
  await rename(`${control}.next`, control);
};
await writeFile(events, "");
await setControl({ at: defaultAt, scenario: "startup" });
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath, "--import",
  resolve("scripts/test-support/missouri-two-record-preload.mjs"), "node_modules/vite/bin/vite.js", "preview",
  "--host", "127.0.0.1", "--port", "8097", "--strictPort"], {
  env: { ...process.env, DATABASE_URL: "", MISSOURI_TWO_CONTROL: control, MISSOURI_TWO_EVENTS: events },
  detached: true, stdio: ["ignore", "pipe", "pipe"],
});
let logs = "", browser;
server.stdout.on("data", d => { logs += d; });
server.stderr.on("data", d => { logs += d; });
const verdict = { passed: false, proof, publicProviderCalls: 0, scenarios: [], errors: [] };
const { MISSOURI_2026_CLEARED_SEASONAL_CATALOG: rows } = appModuleLoader()("src/lib/date-night/missouri-2026-cleared-catalog.ts");
const load = appModuleLoader();
const nearbyCatalog = [
  ...load("src/lib/date-night/jasper-county-catalog.ts").JASPER_COUNTY_DATE_NIGHT_CATALOG,
  ...load("src/lib/date-night/seasonal-catalog.ts").JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG,
  ...rows,
  ...load("src/lib/date-night/missouri-2026-v1-catalog.ts").MISSOURI_2026_V1_SEASONAL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-v1-next-catalog.ts").MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-deferred-batch-3-catalog.ts").MISSOURI_2026_DEFERRED_BATCH_3_CATALOG,
  ...load("src/lib/date-night/missouri-2026-final-four-catalog.ts").MISSOURI_2026_FINAL_FOUR_CATALOG,
  ...load("src/lib/date-night/missouri-2026-late-fall-catalog.ts").MISSOURI_2026_LATE_FALL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts").MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG,
  ...load("src/lib/date-night/missouri-2026-astra-eleven-catalog.ts").MISSOURI_2026_ASTRA_ELEVEN_CATALOG,
  ...load("src/lib/date-night/missouri-2026-astra-commercial-catalog.ts").MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-astra-delta-catalog.ts").MISSOURI_2026_ASTRA_DELTA_CATALOG,
];
const { haversineMiles } = load("src/lib/restaurants/geo.ts");
const { getDateNightAvailability } = load("src/lib/date-night/availability.ts");
const { getOpenStatus } = load("src/lib/restaurants/hours.ts");
const seasonalTypes = new Set(["haunted-house", "corn-maze", "pumpkin-patch", "other-halloween-fall"]);
// Preserve the original 15-mile acceptance radius. New reviewed nearby venues
// change the inventory, not the original target's behavior or coverage.
const nearby = (row, { at = defaultAt, category, season = true, open = false } = {}) => nearbyCatalog.filter(other => {
  if (haversineMiles(row.lat, row.lon, other.lat, other.lon) > 15.05) return false;
  if (!season && other.seasonalListing?.visibility !== "listing-lifecycle" && (other.seasonalListing || other.activityTypes.every(type => seasonalTypes.has(type)))) return false;
  if (category && !other.activityTypes.some(type => category.includes(type))) return false;
  const now = new Date(at), availability = getDateNightAvailability({ ...other, ...getOpenStatus(other.openingHours, now) }, now);
  return availability.browseEligible && (!open || availability.openNowEligible);
});
const { seasonalPresentation, SEASONAL_VISITOR_NOTICE, SEASONAL_CONFIDENCE_LABELS } = appModuleLoader()("src/lib/date-night/seasonal-presentation.ts");
const legacyMaterialFacts = {
  "MO26-003": [/doors open 7 p\.m\./, /final tickets at midnight/, /Closing time is unconfirmed/],
  "MO26-010": [/last walk 12:30 a\.m\. the next day/, /Carrying babies or infants is prohibited/, /Not wheelchair accessible/, /No costumes/, /strobes/, /epilepsy, pregnancy, heart issues/],
  "MO26-011": [/last walk 12:30 a\.m\. the next day/, /Carrying babies or infants is prohibited/, /Not wheelchair accessible/, /No costumes/, /strobes/, /epilepsy, pregnancy, heart issues/],
  "MO26-029": [/after dark/, /Last admission varies/, /Every visitor must sign a waiver/, /Weekday groups need reservations/, /no weekday public walk-ins/],
  "MO26-030": [/closed Mondays/, /Children 4 and under need an adult/, /Farm Road 146/, /roundabout/, /opposite Stonehinge/],
  "MO26-068": [/October 31 closes early at 4 p\.m\./, /Children under 18 require supervision/, /Weather may close activities/, /within 24 hours/],
  "MO26-116": [/trick-or-treating 2–4 p\.m\./, /trunk-or-treat 2–5 p\.m\./, /games and activities 3–6 p\.m\./, /Parking is next to Shelter 1/, /within 48 hours/],
};
const legacyConfidence = { "MO26-003": "good", "MO26-010": "good", "MO26-011": "good", "MO26-029": "good", "MO26-030": "high", "MO26-068": "high", "MO26-116": "high" };
const forbiddenConsumerCopy = /\$\s*\d|\bUSD\b|priced by weight|ticket fee|checkout total|audit|provenance|retention|Census|reviewRevision|survey-grade|periodic review|Schedule checked|listingExpiresAt|ListingCompletenessV1|machine opening|\b20\d{2}-\d{2}-\d{2}\b/i;
const assertConsumerOnly = async (scope, row) => {
  const text = await scope.innerText();
  assert.doesNotMatch(text, forbiddenConsumerCopy, "Consumer UI must not expose prices, audit or retention prose");
  const projected = seasonalPresentation(row);
  for (const raw of row.seasonalVisitNotes ?? []) {
    if (!projected.details.includes(raw)) assert.ok(!text.includes(raw), "Full factual audit notes remain data-only");
  }
};
const waitFor = async (predicate, message, timeout = 30000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await predicate()) return;
    await delay(50);
  }
  throw new Error(message);
};
const activityCount = (page, count) => page.getByText(`${count} activities match`, { exact: true }).waitFor();
const pickButton = page => page.getByRole("button", { name: "Pick our date", exact: true });
const optionsButton = page => page.getByRole("button", { name: "Give us options", exact: true });
const closeOptions = page => page.getByRole("button", { name: "Close options", exact: true }).click();
const closeResult = page => page.getByRole("button", { name: "Close result", exact: true }).click();
const rowHeading = (page, row) => page.getByRole("heading", { name: row.name, exact: true });
const rowCard = (page, row) => page.locator("article").filter({ has: rowHeading(page, row) });
const openOptionsContaining = async (test, targets) => {
  const { page, result } = test;
  const sequence = { targets: targets.map(row => row.id), attempts: [] };
  result.evidence.shortlistSequences ??= [];
  result.evidence.shortlistSequences.push(sequence);
  // A recorded, fixed seed for each real UI shuffle makes larger legitimate
  // neighborhoods reproducible; an unsuccessful sequence still fails normally
  // and runScenario preserves its failure-state screenshot.
  for (let attempt = 0; attempt < 32; attempt++) {
    const seed = 0x504655 + attempt * 104729;
    await page.evaluate(initial => {
      let state = initial >>> 0;
      Math.random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
    }, seed);
    if (attempt === 0) {
      await optionsButton(page).click();
      await page.getByRole("button", { name: "Close options", exact: true }).waitFor();
    } else await page.getByRole("button", { name: "Shuffle options", exact: true }).click();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    sequence.attempts.push({ seed, names: await page.locator("article h3").allTextContents() });
    if ((await Promise.all(targets.map(row => rowHeading(page, row).count()))).every(count => count === 1)) return;
  }
  assert.fail(`Reviewed targets must remain reachable in the four-card shortlist: ${targets.map(row => row.name).join(", ")}`);
};
const selectTarget = async (page, row) => {
  await rowCard(page, row).getByRole("button").filter({ has: rowHeading(page, row) }).click();
  await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
};
const ready = async page => {
  await page.locator("[data-radial-progress]").waitFor({ timeout: 30000 });
  await page.getByText("Finding date ideas near you…", { exact: true }).waitFor({ state: "hidden", timeout: 30000 });
  await pickButton(page).waitFor();
};
const noOverflow = async page => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No horizontal overflow");
const press = async (locator, key = "Enter") => { await locator.focus(); await locator.press(key); };
const settleLocal = async test => {
  // A rendered state change plus a short quiet interval catches deferred effects;
  // network-driven transitions additionally wait for actual RPC completion.
  await test.page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await delay(350);
  await Promise.all([...test.pending]);
};
const assertNoRpc = async (test, count, label, total = count) => {
  await settleLocal(test);
  assert.equal(test.primaryRpc.length, count, label);
  assertBoundedSeasonalAudit(test.result.rpc);
  if (!/category|Anything|Season-on/i.test(label)) assert.equal(test.result.rpc.length, total, `${label}: no extra primary or audit RPC`);
};
const overlayRoot = (page, kind) => page.locator(".fixed.inset-0.z-50").filter({
  has: page.getByRole("button", { name: `Close ${kind}`, exact: true }),
});
async function inspectIcons(test, kind, label) {
  const { page, result, state } = test;
  const images = overlayRoot(page, kind).locator("img");
  const count = await images.count();
  assert.ok(count > 0, `${label}: overlay must contain its activity artwork`);
  result.evidence.images ??= [];
  for (let index = 0; index < count; index++) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    const evidence = await image.evaluate(async element => {
      let timer, decoded = false, decodeError = null;
      try {
        await Promise.race([
          element.decode(),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Image decode timed out after 5000ms")), 5000); }),
        ]);
        decoded = true;
      } catch (error) { decodeError = error.message; }
      finally { clearTimeout(timer); }
      const bounds = element.getBoundingClientRect();
      const ancestry = [];
      for (let node = element; node && ancestry.length < 6; node = node.parentElement) {
        const style = getComputedStyle(node);
        ancestry.push({ tag: node.tagName, className: node.className, display: style.display,
          visibility: style.visibility, opacity: style.opacity, filter: style.filter, overflow: style.overflow });
      }
      return { src: element.getAttribute("src"), currentSrc: element.currentSrc, complete: element.complete,
        naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight, decoded, decodeError,
        bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }, ancestry };
    });
    result.evidence.images.push({ label, index, ...evidence });
    // Retain the actual viewport even on decode failure; do not substitute a
    // fetched asset or an off-page rendering for application presentation proof.
    await page.screenshot({ path: resolve(output, `${state.scenario}-${label}-image-${index}-viewport.png`), animations: "disabled" });
    assert.equal(evidence.decoded, true, `${label}: ${evidence.decodeError ?? "image must decode"}`);
    assert.ok(evidence.naturalWidth > 0 && evidence.naturalHeight > 0, `${label}: image has no decoded pixels`);
    assert.ok(evidence.bounds.width > 0 && evidence.bounds.height > 0, `${label}: image has no rendered area`);
    await image.screenshot({ path: resolve(output, `${state.scenario}-${label}-image-${index}.png`), animations: "disabled", timeout: 5000 });
  }
}
async function inspectQualifiedOverlay(test, row, kind) {
  const { page, result, state } = test;
  const overlay = overlayRoot(page, kind);
  await inspectIcons(test, kind, kind);
  if (kind === "options") {
    const cards = overlay.locator("article");
    const notices = [];
    for (let index = 0; index < await cards.count(); index++) {
      const card = cards.nth(index);
      const name = await card.getByRole("heading").innerText();
      const identity = nearbyCatalog.find(item => item.name === name);
      assert.ok(identity, `Options card ${name} must retain a reviewed neighborhood identity`);
      const cardSection = card.locator("[data-seasonal-visit-notes]");
      const expected = identity.seasonalListing ? 1 : 0;
      assert.equal(await cardSection.count(), expected, `${name}: exactly one visit-notes section per seasonal card`);
      if (expected) {
        assert.equal(await cardSection.locator(":scope > p").count(), 1, `${name}: exactly one compact notice`);
        assert.equal(await cardSection.locator(":scope > p").innerText(), SEASONAL_VISITOR_NOTICE);
      }
      notices.push({ id: identity.id, sections: expected });
    }
    assert.equal(await overlay.locator("[data-seasonal-visit-notes]").count(), notices.reduce((sum, item) => sum + item.sections, 0),
      "Overlay notice count matches all rendered seasonal cards");
    result.evidence.optionCardNotices ??= [];
    result.evidence.optionCardNotices.push(notices);
  }
  const target = kind === "options" ? rowCard(page, row) : overlay;
  assert.equal(await target.count(), 1, "Exactly one target card or result overlay");
  const section = target.locator("[data-seasonal-visit-notes]");
  assert.equal(await section.count(), 1, "Target owns exactly one visit-notes section");
  assert.equal(await section.locator(":scope > p").count(), 1, "Exactly one compact notice");
  assert.equal(await section.locator(":scope > p").innerText(), SEASONAL_VISITOR_NOTICE);
  const presentation = seasonalPresentation(row);
  assert.equal(presentation.confidence, legacyConfidence[row.seasonalListing.recordId], "Completeness confidence matches independently reviewed tier");
  assert.equal(await section.locator("[data-seasonal-confidence]").innerText(), SEASONAL_CONFIDENCE_LABELS[presentation.confidence]);
  assert.ok(presentation.details.length > 0, "Reviewed consumer details are required");
  const details = section.locator("details");
  assert.equal(await details.getAttribute("open"), null, "Details initially collapsed");
  await details.locator("summary").click();
  const notes = details.locator("p");
  for (const fact of legacyMaterialFacts[row.seasonalListing.recordId]) assert.match(await details.innerText(), fact, `${kind}: retained material visitor fact ${fact}`);
  assert.equal(await notes.count(), presentation.details.length, `${kind}: every concise consumer fact is present`);
  await assertConsumerOnly(overlay, row);
  const reachability = { overlay: kind, notes: [], controls: [] };
  result.evidence.overlayReachability ??= [];
  result.evidence.overlayReachability.push(reachability);
  for (const [index, expected] of presentation.details.entries()) {
    const note = notes.nth(index);
    assert.equal(await note.innerText(), expected);
    await note.scrollIntoViewIfNeeded({ timeout: 5000 });
    const visible = await note.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right,
        viewportWidth: innerWidth, viewportHeight: innerHeight,
        contentWidth: element.scrollWidth, availableWidth: element.clientWidth,
        unobscured: Boolean(hit && (hit === element || element.contains(hit))) };
    });
    reachability.notes.push({ index, text: expected, ...visible });
    assert.ok(visible.contentWidth <= visible.availableWidth + 1,
      `${kind}: qualified note ${index + 1} must not clip inline text horizontally`);
    assert.ok(visible.top >= -1 && visible.bottom <= visible.viewportHeight + 1 &&
      visible.left >= -1 && visible.right <= visible.viewportWidth + 1 && visible.unobscured,
    `${kind}: qualified note ${index + 1} must be readable after scrolling`);
    await page.screenshot({ path: resolve(output, `${state.scenario}-${kind}-note-${index}.png`), animations: "disabled" });
  }
  const controls = kind === "options" ? [
    ["Shuffle options", overlay.getByRole("button", { name: "Shuffle options", exact: true })],
    ["Close options", overlay.getByRole("button", { name: "Close options", exact: true })],
  ] : [
    ["Directions", overlay.getByRole("link", { name: /Directions · Google Maps/ })],
    ["Website", overlay.getByRole("link", { name: /Website & info/ })],
    ["Call venue", overlay.getByRole("link", { name: "Call venue", exact: true })],
    ["Close result", overlay.getByRole("button", { name: "Close result", exact: true })],
  ];
  for (const [label, control] of controls) {
    await control.scrollIntoViewIfNeeded({ timeout: 5000 });
    // Trial checks visibility, stability and obstruction without following an
    // external link, placing a call or changing the selected result.
    await control.click({ trial: true, timeout: 5000 });
    const href = await control.getAttribute("href");
    if (label === "Website") assert.equal(href, row.website);
    if (label === "Call venue") assert.equal(href, `tel:${row.phone}`);
    reachability.controls.push({ label, href, reachable: true });
    await page.screenshot({ path: resolve(output, `${state.scenario}-${kind}-control-${label.replaceAll(" ", "-")}.png`), animations: "disabled" });
  }
  if (kind === "result") {
    const destination = new URL(await overlay.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href")).searchParams.get("destination");
    if (row.seasonalListing.directionsTarget.kind === "verified-point") {
      assert.equal(destination, `${row.lat},${row.lon}`, "Sam Baker retains the reviewed Shelter 1 parking point");
      const ride = overlay.getByRole("link", { name: `Open Uber with ${row.name} as the destination; external service`, exact: true });
      const params = new URL(await ride.getAttribute("href")).searchParams;
      assert.equal(params.get("dropoff[latitude]"), String(row.lat));
      assert.equal(params.get("dropoff[longitude]"), String(row.lon));
    } else {
      assert.equal(destination, row.address);
      assert.equal(await overlay.getByRole("link", { name: "Open Uber; choose your destination in the external service", exact: true }).getAttribute("href"), "https://m.uber.com/");
    }
  }
  await noOverflow(page);
}
async function runScenario(row, index, scenario, callback, overrides = {}) {
  const state = { at: defaultAt, scenario: `${index}-${scenario}`, fixture: "empty", row, ...overrides };
  await setControl(state);
  const result = { id: row.id, scenario, width: overrides.width ?? (index ? 320 : 390), passed: false, evidence: {}, rpc: [], blockedBrowserRequests: [],
    imageResponses: [], imageRequestFailures: [], consoleMessages: [], pageErrors: [] };
  verdict.scenarios.push(result);
  const context = await browser.newContext({ viewport: { width: overrides.width ?? (index ? 320 : 390), height: 844 },
    timezoneId: "UTC", reducedMotion: "reduce", serviceWorkers: "block" });
  let page;
  const pending = new Set();
  try {
    await context.route("**/*", route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      result.blockedBrowserRequests.push(route.request().url());
      return route.abort();
    });
    await context.addInitScript(({ row, scenario, at, filters }) => {
      const OriginalDate = Date;
      globalThis.__missouriNow = at;
      globalThis.Date = class extends OriginalDate {
        constructor(...args) { super(...(args.length ? args : [globalThis.__missouriNow])); }
        static now() { return new OriginalDate(globalThis.__missouriNow).getTime(); }
      };
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      if (!localStorage.getItem("pick-for-us-v1")) localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        location: { lat: row.lat, lon: row.lon, label: row.name, source: "manual" }, homeMode: "date-night",
        spookySeasonEnabled: scenario !== "season-off", dateNightFilters: {
          radiusMiles: 15, activityTypes: scenario === "category" ? row.activityTypes : ["anything"],
          mood: 50, openNowOnly: scenario === "open-now", favoritesOnly: false, reduceParks: false, ...filters,
        },
      } }));
    }, { row, scenario, at: state.at, filters: overrides.filters });
    page = await context.newPage();
    page.on("pageerror", error => result.pageErrors.push(error.message));
    page.on("console", message => {
      if (["warning", "error"].includes(message.type())) result.consoleMessages.push({
        type: message.type(), text: message.text(), location: message.location(),
      });
    });
    page.on("requestfailed", request => {
      if (request.resourceType() === "image") result.imageRequestFailures.push({ url: request.url(), error: request.failure()?.errorText });
    });
    page.on("request", request => {
      if (request.url().includes("/_serverFn/") && request.postData()?.includes("activityTypes")) {
        result.rpc.push({ acquisition: dateNightRpcEvidence(request.postData()), request, method: request.method(), body: request.postData() });
      }
    });
    page.on("response", response => {
      if (response.request().resourceType() === "image") result.imageResponses.push({
        url: response.url(), status: response.status(), mimeType: response.headers()["content-type"] ?? null,
      });
      const entry = result.rpc.find(item => item.request === response.request());
      if (!entry) return;
      const task = response.text().then(body => { entry.status = response.status(); entry.response = body; })
        .catch(error => { entry.responseError = error.message; });
      pending.add(task);
      void task.finally(() => pending.delete(task));
    });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await ready(page);
    const test = { page, state, result, get primaryRpc() { return result.rpc.filter(r => r.acquisition.kind === "primary"); }, get auditRpc() { return result.rpc.filter(r => r.acquisition.kind === "audit"); }, pending };
    await callback(test);
    await settleLocal(test);
    assertBoundedSeasonalAudit(result.rpc);
    result.evidence.acquisitionCounts = { primary: test.primaryRpc.length, audit: test.auditRpc.length, total: result.rpc.length };
    assert.deepEqual(result.pageErrors, []);
    await noOverflow(page);
    result.passed = true;
  } catch (error) {
    result.error = error.stack;
    verdict.errors.push({ id: row.id, scenario, message: error.message });
    process.exitCode = 1;
    if (page) await page.screenshot({ path: resolve(output, `${state.scenario}-failure.png`), fullPage: true }).catch(() => {});
  } finally {
    await Promise.all([...pending]);
    for (const entry of result.rpc) delete entry.request;
    if (page) {
      result.evidence.finalText = await page.locator("body").innerText().catch(() => "Page unavailable");
      await page.screenshot({ path: resolve(output, `${state.scenario}-final.png`), fullPage: true }).catch(() => {});
    }
    await context.close();
    console.log(`MISSOURI_BROWSER_${result.passed ? "PASS" : "FAIL"} ${state.scenario}`);
  }
}
try {
  await waitFor(async () => { try { return (await fetch(origin)).ok; } catch { return false; } }, "Preview startup failed");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  // Preserve all 12 original PR48 scenarios and target assertions, while
  // accounting for independently cleared additions inside the same radius.
  for (const [index, row] of rows.entries()) for (const scenario of ["anything", "category", "open-now", "ended", "next-year", "season-off"]) {
    const at = scenario === "ended" ? row.seasonalAvailability.endsAt : scenario === "next-year" ? "2027-10-07T18:00:00Z" : defaultAt;
    await runScenario(row, index, scenario, async test => {
      const { page } = test;
      const pick = pickButton(page), visible = ["anything", "category"].includes(scenario);
      const expected = nearby(row, { at, category: scenario === "category" ? row.activityTypes : undefined,
        season: scenario !== "season-off", open: scenario === "open-now" });
      await activityCount(page, expected.length);
      assert.equal(await pick.isDisabled(), expected.length === 0, `${row.id}:${scenario}`);
      assert.equal(expected.some(item => item.id === row.id), visible, "Original target policy is unchanged");
      test.result.evidence.expectedNeighborhoodIds = expected.map(item => item.id);
      if (visible) {
        await openOptionsContaining(test, [row]);
        const text = await rowCard(page, row).locator("[data-seasonal-visit-notes]").textContent();
        assert.ok(text.includes(index ? "Shelter 1" : seasonalPresentation(row).details[0]));
        if (index) {
          assert.equal(await rowCard(page, row).locator("img").getAttribute("src"), "/date-night-icons/grok_1788905199846.jpg");
          assert.match(await rowCard(page, row).innerText(), /Other Halloween \/ Fall/i);
        }
        await inspectQualifiedOverlay(test, row, "options");
        await closeOptions(page);
        await pick.click(); await page.getByRole("button", { name: "Close result", exact: true }).waitFor({ timeout: 20000 });
        const selectedName = await overlayRoot(page, "result").getByRole("heading").last().innerText();
        assert.ok(expected.some(item => item.name === selectedName), "Random Pick must stay inside the eligible 15-mile neighborhood");
        await closeResult(page);
        await openOptionsContaining(test, [row]); await selectTarget(page, row);
        const resultText = await page.locator("[data-seasonal-visit-notes]").textContent();
        assert.ok(resultText.includes(seasonalPresentation(row).details[0]));
        const href = await page.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href");
        assert.equal(new URL(href).searchParams.get("destination"), index ? `${row.lat},${row.lon}` : row.address);
        await inspectQualifiedOverlay(test, row, "result");
        await page.screenshot({ path: resolve(output, `${index}-${scenario}.png`), fullPage: true });
        await noOverflow(page);
        await closeResult(page);
        await pick.click(); await page.getByRole("button", { name: "Close result", exact: true }).waitFor({ timeout: 20000 });
        const secondSelectedName = await overlayRoot(page, "result").getByRole("heading").last().innerText();
        assert.ok(expected.some(item => item.name === secondSelectedName), "Repeated Pick remains eligible");
        await closeResult(page);
      } else if (expected.length) {
        await optionsButton(page).click();
        await page.getByRole("button", { name: "Close options", exact: true }).waitFor();
        assert.equal(await rowHeading(page, row).count(), 0, "Other valid nearby records never revive the original ineligible target");
        await closeOptions(page);
      }
    }, { at });
  }
  for (const [index, row] of rows.entries()) {
    const n = nearby(row).length;
    const categoryCount = nearby(row, { category: row.activityTypes }).length;
    assert.equal(nearby(row, { season: false }).length, 0, "Original neighborhoods retain no ordinary curated fixture");
    assert.equal(nearby(row, { open: true }).length, 0, "Every curated seasonal neighbor stays fail-closed");
    await runScenario(row, index, "mixed-toggle-cache", async test => {
      const { page, result } = test;
      await activityCount(page, n + 1);
      await settleLocal(test);
      assert.equal(test.primaryRpc.length, 1, "One real selected-radius primary RPC");
      const initialRpc = test.primaryRpc[0].response;
      for (const value of [row.id, "date-night-osm-node-910001", "date-night-osm-way-910002", "park", "seasonalAvailability", row.seasonalAvailability.endsAt]) {
        assert.ok(initialRpc.includes(value), `Real RPC retains merged evidence: ${value}`);
      }
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowHeading(page, row).count(), 1, "Duplicate identities render once");
      assert.equal(await page.locator("article").count(), n + 1);
      assert.equal(await rowCard(page, row).locator("[data-seasonal-visit-notes]").count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      result.evidence.seasonOn = await page.locator("article").allTextContents();
      await inspectIcons(test, "options", "mixed-season-on");
      await page.screenshot({ path: resolve(output, `${index}-mixed-season-on.png`), fullPage: true });
      await noOverflow(page); await closeOptions(page);
      await settleLocal(test); const initialCount = test.primaryRpc.length; const initialCountTotal = test.result.rpc.length;
      const category = page.getByRole("button", { name: index ? "Other Halloween / Fall" : "Corn Maze", exact: true });
      await press(category); await activityCount(page, categoryCount);
      assert.equal(await category.getAttribute("aria-pressed"), "true");
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, n + 1);
      await assertNoRpc(test, initialCount, "Anything/category uses the acquired superset cache", initialCountTotal);
      const openNow = page.getByRole("switch", { name: "Open now only", exact: true });
      await press(openNow, "Space"); await activityCount(page, 1);
      await optionsButton(page).click(); await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
      assert.equal(await rowHeading(page, row).count(), 0, "Provider 24/7 hours cannot promote the curated event to Open now");
      await closeOptions(page); await press(openNow, "Space"); await activityCount(page, n + 1);
      await assertNoRpc(test, initialCount, "Open now is a local filter", initialCountTotal);
      const toggle = page.getByRole("switch", { name: "Spooky Season", exact: true });
      await press(toggle, "Space");
      await waitFor(async () => test.primaryRpc.length === initialCount + 1 && test.primaryRpc.at(-1).response, "Season-off RPC did not settle");
      await ready(page); await activityCount(page, 2);
      assert.equal(await toggle.getAttribute("aria-checked"), "false");
      assert.equal(await category.count(), 0);
      assert.ok(!test.primaryRpc.at(-1).response.includes(row.id), "Season-off RPC excludes curated event identity");
      assert.ok(!test.primaryRpc.at(-1).response.includes("seasonalVisitNotes"), "Season-off RPC excludes curated details");
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), 0);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Corn Maze|Pumpkin Patch|Other Halloween \/ Fall/i);
      assert.match(await rowCard(page, row).innerText(), /Park/i);
      // The same-name provider park is deliberately recorded, not confused with
      // the absent curated event or silently treated as a disappearing venue.
      result.evidence.seasonOffOrdinarySameNamePark = await rowCard(page, row).innerText();
      await inspectIcons(test, "options", "mixed-season-off");
      await page.screenshot({ path: resolve(output, `${index}-mixed-season-off.png`), fullPage: true });
      await noOverflow(page); await closeOptions(page);
      await settleLocal(test); const afterOff = test.primaryRpc.length; const afterOffTotal = test.result.rpc.length;
      await press(toggle, "Space"); await activityCount(page, n + 1);
      assert.equal(await toggle.getAttribute("aria-checked"), "true");
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowCard(page, row).locator("[data-seasonal-visit-notes]").count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      await closeOptions(page);
      await assertNoRpc(test, afterOff, "Season-on restores its isolated cache without another RPC", afterOffTotal);
      await press(openNow, "Space"); await activityCount(page, 1);
      await assertNoRpc(test, afterOff, "Cached merged event remains fail-closed for Open now", afterOffTotal);
      await press(openNow, "Space"); await activityCount(page, n + 1);
      result.evidence.cacheRpcCount = afterOff;
      // Advance past the real ten-minute acquisition TTL, then use actual
      // category controls to request fresh evidence. Resume alone refreshes
      // eligibility; it does not claim to refresh the discovery cache.
      const refreshedAt = new Date(Date.parse(defaultAt) + 10 * 60000 + 1).toISOString();
      await setControl({ ...test.state, at: refreshedAt });
      await page.evaluate(at => {
        globalThis.__missouriNow = at;
        document.dispatchEvent(new Event("visibilitychange"));
        window.dispatchEvent(new Event("focus"));
      }, refreshedAt);
      await press(category);
      await waitFor(async () => test.primaryRpc.length >= afterOff + 1 && test.primaryRpc.at(-1).response,
        "Expired category cache did not reacquire through the real RPC");
      await ready(page); await activityCount(page, categoryCount);
      assert.equal(test.primaryRpc.length, afterOff + 1, "Expired category requires exactly one primary RPC");
      assert.ok(test.primaryRpc.at(-1).response.includes(row.id));
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowCard(page, row).locator("[data-seasonal-visit-notes]").count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      await closeOptions(page);
      await press(page.getByRole("button", { name: "Anything", exact: true }));
      await waitFor(async () => test.primaryRpc.length >= afterOff + 2 && test.primaryRpc.at(-1).response,
        "Anything did not reacquire the expired missing categories");
      await ready(page); await activityCount(page, n + 1);
      assert.equal(test.primaryRpc.length, afterOff + 2, "Anything refreshes missing categories in one primary RPC");
      await settleLocal(test); const afterRefresh = test.primaryRpc.length; const afterRefreshTotal = test.result.rpc.length;
      await press(openNow, "Space"); await activityCount(page, 1);
      await optionsButton(page).click();
      await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
      assert.equal(await rowHeading(page, row).count(), 0, "Fresh merged evidence still cannot promote the event to Open now");
      await closeOptions(page); await press(openNow, "Space"); await activityCount(page, n + 1);
      await assertNoRpc(test, afterRefresh, "Fresh-cache Open now remains a local filter", afterRefreshTotal);
      result.evidence.expiredCacheRefresh = { at: refreshedAt, additionalPrimaryRpcCount: afterRefresh - afterOff, additionalTotalRpcCount: afterRefreshTotal - afterOffTotal };
      // Exercise real keyboard controls and application Back/Forward navigation.
      await press(page.getByRole("slider", { name: "Cozy to adventurous", exact: true }), "End");
      await assertNoRpc(test, afterRefresh, "Keyboard mood change is local", afterRefreshTotal);
      await press(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Settings", exact: true }));
      await page.waitForURL(`${origin}/settings`);
      await page.goBack(); await page.waitForURL(`${origin}/`); await ready(page); await activityCount(page, n + 1);
      assert.equal(await toggle.getAttribute("aria-checked"), "true");
      await page.goForward(); await page.waitForURL(`${origin}/settings`);
      await page.goBack(); await page.waitForURL(`${origin}/`); await ready(page); await activityCount(page, n + 1);
      result.evidence.navigation = "Keyboard Settings, Back, Forward, Back preserved stored filters; remount RPCs are recorded separately.";
    }, { fixture: "mixed" });
    for (const overlay of ["options", "result"]) {
      const endsAt = row.seasonalAvailability.endsAt;
      const beforeAt = new Date(Date.parse(endsAt) - 60000).toISOString();
      const beforeRows = nearby(row, { at: beforeAt }), remainingRows = nearby(row, { at: endsAt });
      await runScenario(row, index, `mixed-resume-${overlay}`, async test => {
        const { page, state, result } = test;
        await activityCount(page, beforeRows.length + 1);
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        if (overlay === "result") {
          await rowCard(page, row).getByRole("button").filter({ has: rowHeading(page, row) }).click();
          await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
        }
        assert.equal(await (overlay === "options" ? rowCard(page, row) : overlayRoot(page, "result")).locator("[data-seasonal-visit-notes]").count(), 1);
        await settleLocal(test);
        await settleLocal(test); const before = test.primaryRpc.length; const beforeTotal = test.result.rpc.length;
        result.evidence.beforeEnd = await rowHeading(page, row).innerText();
        await inspectIcons(test, overlay, `resume-${overlay}-before`);
        await page.screenshot({ path: resolve(output, `${index}-resume-${overlay}-before.png`), fullPage: true });
        await setControl({ ...state, at: endsAt });
        await page.evaluate(at => {
          globalThis.__missouriNow = at;
          document.dispatchEvent(new Event("visibilitychange"));
          window.dispatchEvent(new Event("focus"));
        }, endsAt);
        await rowHeading(page, row).waitFor({ state: "hidden" });
        await activityCount(page, remainingRows.length + 1);
        assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), overlay === "options" ? remainingRows.filter(item => item.seasonalListing).length : 0);
        if (overlay === "options") {
          await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
          assert.equal(await page.locator("article").count(), remainingRows.length + 1, "Open options drops only the expired identity");
          await closeOptions(page);
        } else assert.equal(await page.getByRole("button", { name: "Close result", exact: true }).count(), 0, "Expired result overlay is dismissed");
        await assertNoRpc(test, before, "Resume at final end recomputes eligibility without provider traffic", beforeTotal);
        await optionsButton(page).click();
        await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
        assert.equal(await rowHeading(page, row).count(), 0, "Future selections cannot resurrect the ended duplicate");
        await noOverflow(page); await closeOptions(page);
        result.evidence.finalEnd = endsAt;
        result.evidence.resumePrimaryRpcDelta = test.primaryRpc.length - before;
        result.evidence.resumeTotalRpcDelta = test.result.rpc.length - beforeTotal;
      }, { fixture: "mixed", at: beforeAt });
    }
  }
  // Intentional V1 change: the approved address-geocoded listing now survives
  // provider outage. It must never revive the removed trusted arrival point.
  const { MISSOURI_2026_V1_SEASONAL_CATALOG: v1 } = appModuleLoader()("src/lib/date-night/missouri-2026-v1-catalog.ts");
  const myer = v1.find(row => row.id === "date-night-myers-inn-carthage");
  const carthage = { ...myer, name: "Carthage, Missouri", lat: 37.176447, lon: -94.310223 };
  const fallbackRows = nearby(carthage, { category: ["haunted-house"] });
  const werehouse = nearbyCatalog.find(row => row.id === "date-night-werehouse-joplin");
  await runScenario(carthage, 0,
    "myer-reviewed-v1-fallback-only", async test => {
      const { page, result } = test;
      await activityCount(page, fallbackRows.length);
      await settleLocal(test);
      assert.equal(test.primaryRpc.length, 1);
      assert.match(test.primaryRpc[0].response, /fallback/);
      for (const value of [myer.id, "ListingCompletenessV1", "address-geocode", String(myer.lat), String(myer.lon), myer.address]) {
        assert.ok(test.primaryRpc[0].response.includes(value), `Reviewed fallback carries ${value}`);
      }
      for (const row of fallbackRows) assert.ok(test.primaryRpc[0].response.includes(row.id), `Fallback includes the eligible reviewed neighborhood identity ${row.id}`);
      await openOptionsContaining(test, [myer, werehouse]);
      await page.getByRole("heading", { name: "The Werehouse", exact: true }).waitFor();
      assert.equal(await rowHeading(page, myer).count(), 1);
      assert.doesNotMatch(await rowCard(page, myer).innerText(), /Open now/);
      result.evidence.fallbackNames = await page.locator("article h3").allTextContents();
      result.evidence.fullFallbackIds = fallbackRows.map(row => row.id);
      await rowCard(page, myer).getByRole("button").filter({ has: rowHeading(page, myer) }).click();
      const href = await page.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href");
      assert.equal(new URL(href).searchParams.get("destination"), myer.address);
      assert.equal(await page.getByRole("link", { name: "Open Uber; choose your destination in the external service", exact: true }).getAttribute("href"), "https://m.uber.com/");
      await closeResult(page);
    }, { fixture: "provider-failure", filters: { activityTypes: ["haunted-house"] } });
  // Each of the seven shipped records must be readable at both supported widths.
  for (const [index, row] of rows.entries()) for (const width of [320, 390]) {
    await runScenario(row, index, `consumer-details-${width}`, async test => {
      const { page } = test;
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      await inspectQualifiedOverlay(test, row, "options");
      await rowCard(page, row).getByRole("button").filter({ has: rowHeading(page, row) }).click();
      await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
      await inspectQualifiedOverlay(test, row, "result");
      await closeResult(page);
    }, { width });
  }
  assert.equal(verdict.scenarios.length, 19 + rows.length * 2);
  assert.equal(verdict.errors.length, 0);
  verdict.passed = true;
} catch (error) {
  verdict.errors.push({ message: error.message, stack: error.stack });
  process.exitCode = 1;
} finally {
  await browser?.close();
  try { process.kill(-server.pid, "SIGTERM"); } catch (error) {
    if (error.code !== "ESRCH") { verdict.errors.push({ message: "Owned preview cleanup failed" }); verdict.passed = false; process.exitCode = 1; }
  }
  const network = (await readFile(events, "utf8")).split("\n").filter(Boolean).map(JSON.parse);
  verdict.network = { interceptedProviderCalls: network.filter(event => event.event === "intercepted-provider").length,
    blockedServerRequests: network.filter(event => event.event === "blocked-external"), forwardedExternalCalls: 0 };
  await writeFile(resolve(output, "server.log"), logs);
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2));
  console.log(JSON.stringify(verdict, null, 2));
}
