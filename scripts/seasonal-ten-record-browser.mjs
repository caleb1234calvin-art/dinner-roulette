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
const output = resolve("audit/browser-results/seasonal-ten-record");
await mkdir(output, { recursive: true });
const control = resolve(output, "control.json"), events = resolve(output, "events.jsonl");
const origin = "http://127.0.0.1:8099", defaultAt = "2026-10-07T18:00:00Z";
const setControl = async state => {
  await writeFile(`${control}.next`, JSON.stringify(state));
  await rename(`${control}.next`, control);
};
await writeFile(events, "");
await setControl({ at: defaultAt, scenario: "startup" });
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath, "--import",
  resolve("scripts/test-support/seasonal-ten-record-preload.mjs"), "node_modules/vite/bin/vite.js", "preview",
  "--host", "127.0.0.1", "--port", "8099", "--strictPort"], {
  env: { ...process.env, DATABASE_URL: "", SEASONAL_TEN_CONTROL: control, SEASONAL_TEN_EVENTS: events },
  detached: true, stdio: ["ignore", "pipe", "pipe"],
});
let logs = "", browser;
server.stdout.on("data", d => { logs += d; });
server.stderr.on("data", d => { logs += d; });
const verdict = { passed: false, proof, publicProviderCalls: 0, scenarios: [], errors: [] };
const load = appModuleLoader();
const { MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG: rows } = load("src/lib/date-night/missouri-2026-v1-next-catalog.ts");
const { seasonalPresentation, SEASONAL_VISITOR_NOTICE, SEASONAL_CONFIDENCE_LABELS } = appModuleLoader()("src/lib/date-night/seasonal-presentation.ts");
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
const assertNoRpc = async (test, count, label) => {
  await settleLocal(test);
  assert.equal(test.rpc.length, count, label);
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
  assert.match(await (kind === "options" ? rowCard(page, row) : overlay).innerText(), /Approx\./);
  const scope = kind === "options" ? rowCard(page, row) : overlay;
  const section = scope.locator("[data-seasonal-visit-notes]");
  assert.equal(await section.locator(":scope > p").count(), 1, "Exactly one compact notice");
  assert.equal(await section.locator(":scope > p").innerText(), SEASONAL_VISITOR_NOTICE);
  const presentation = seasonalPresentation(row);
  assert.ok(materialFacts[row.seasonalListing.recordId], "Each new row has an independent visitor-fact checklist");
  assert.equal(await section.locator("[data-seasonal-confidence]").innerText(), SEASONAL_CONFIDENCE_LABELS[presentation.confidence]);
  assert.ok(presentation.details.length > 0, "Reviewed consumer details are required");
  const details = section.locator("details");
  assert.equal(await details.getAttribute("open"), null, "Details initially collapsed");
  await details.locator("summary").click();
  const notes = details.locator("p");
  assert.equal(await notes.count(), presentation.details.length, `${kind}: every concise consumer fact is present`);
  await assertConsumerOnly(scope, row);
  for (const fact of materialFacts[row.seasonalListing.recordId]) assert.match(await details.innerText(), fact, `${kind}: retained material visitor fact ${fact}`);

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
    await page.screenshot({ path: resolve(output, `${state.scenario}-${kind}-note-${row.id}-${index}.png`), animations: "disabled" });
  }
  const controls = kind === "options" ? [
    ["Shuffle options", overlay.getByRole("button", { name: "Shuffle options", exact: true })],
    ["Close options", overlay.getByRole("button", { name: "Close options", exact: true })],
  ] : [
    ["Directions", overlay.getByRole("link", { name: /Directions · Google Maps/ })],
    ["Website", overlay.getByRole("link", { name: /Website & info/ })],
    ...(row.phone ? [["Call venue", overlay.getByRole("link", { name: "Call venue", exact: true })]] : []),
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
    const href = await overlay.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href");
    assert.equal(new URL(href).searchParams.get("destination"), row.seasonalListing.visitorAddress);
    const uber = overlay.getByRole("link", { name: "Open Uber; choose your destination in the external service", exact: true });
    assert.equal(await uber.getAttribute("href"), "https://m.uber.com/");
    reachability.navigation = { directions: href, uber: await uber.getAttribute("href") };
  }
  assert.doesNotMatch(await scope.innerText(), /Open now/);
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
    await context.addInitScript(({ row, scenario, at, filters, preferences, exclusions, identityReceipts }) => {
      globalThis.__geolocationCalls = [];
      for (const method of ["getCurrentPosition", "watchPosition"]) {
        Object.defineProperty(navigator.geolocation, method, { value: () => {
          globalThis.__geolocationCalls.push(method);
          throw new Error("Geolocation must not be requested in manual-location acceptance");
        } });
      }
      const OriginalDate = Date;
      globalThis.__missouriNow = sessionStorage.getItem("seasonal-ten-clock") ?? at;
      globalThis.Date = class extends OriginalDate {
        constructor(...args) { super(...(args.length ? args : [globalThis.__missouriNow])); }
        static now() { return new OriginalDate(globalThis.__missouriNow).getTime(); }
      };
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      if (identityReceipts && !localStorage.getItem("pick-for-us-seasonal-identity-v1")) {
        localStorage.setItem("pick-for-us-seasonal-identity-v1", JSON.stringify(identityReceipts));
      }
      if (!localStorage.getItem("pick-for-us-v1")) localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        location: { lat: row.lat + (scenario === "radius-exclusion" ? 0.06 : 0), lon: row.lon, label: row.name, source: "manual" }, homeMode: "date-night",
        spookySeasonEnabled: scenario !== "season-off", preferences: preferences ?? {}, exclusions: exclusions ?? [], dateNightFilters: {
          radiusMiles: 1, activityTypes: scenario === "category" ? row.activityTypes : ["anything"],
          mood: 50, openNowOnly: scenario === "open-now", favoritesOnly: false, reduceParks: false, ...filters,
        },
      } }));
    }, { row, scenario, at: state.at, filters: overrides.filters, preferences: overrides.preferences, exclusions: overrides.exclusions, identityReceipts: overrides.identityReceipts });
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
      if (request.url().includes("/_serverFn/") && request.postData()?.includes("patchId")) {
        result.rpc.push({ request, method: request.method(), body: request.postData() });
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
    await page.goto(`${origin}${overrides.pathname ?? "/"}`, { waitUntil: "domcontentloaded" });
    if (!overrides.pathname || overrides.pathname === "/") await ready(page);
    const test = { page, state, result, rpc: result.rpc, pending };
    await callback(test);
    await settleLocal(test);
    assert.deepEqual(result.pageErrors, []);
    result.evidence.geolocationCalls = await page.evaluate(() => globalThis.__geolocationCalls);
    assert.deepEqual(result.evidence.geolocationCalls, [], "No device geolocation requested");
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
    console.log(`SEASONAL_TEN_BROWSER_${result.passed ? "PASS" : "FAIL"} ${state.scenario}`);
  }
}

// These assertions intentionally use visitor facts independently of the exact
// copy projection: matching a changed registry alone cannot erase a restriction.
const materialFacts = {
  "MO26-019": [/October 31/, /1–5 p\.m\./, /infants through fifth grade/, /kid-friendly costumes/],
  "MO26-031": [/selected park days/i, /5:30 p\.m\./, /ticket.*passport/i, /No guest costumes/, /Indian Point Road/, /tram or bus/],
  "MO26-034": [/October 17/, /lantern hikes 7–8 p\.m\./, /picnic shelter/, /cancel(?:ed|led) or postponed/],
  "MO26-054": [/Closed Tuesdays/, /last tractor/, /one hour before closing/, /Ages 2\+/, /Jacks.*separate admission/, /No smoking or vaping/, /no dogs except service animals/],
  "MO26-067": [/last-ticket and maze-clearing/, /Children 12 and under.*adult/, /groups and campfires need reservations/, /No alcohol/, /No smoking or vaping/, /no pets/],
  "MO26-100": [/daily 10 a\.m\.–6 p\.m\./, /weather permitting/, /No pets, smoking, vaping or tobacco/, /field trips need appointments/, /Saloon opens Friday–Sunday/],
  "MO26-114": [/October 31/, /Flashlight nights/, /bring a flashlight/, /weekday group rides need an appointment/, /farm pass/],
  "MO26-115": [/October 23/, /4–7 p\.m\./, /flashlight and candy container/, /four mill floors/, /first floor only/, /upper floors.*stairs/],
  "MO26-124": [/Selected dates/, /doors open 7 p\.m\./, /Closing time varies/, /waiver with fingerprint signature required/, /strobes/, /wet conditions/],
  "MO26-125": [/Selected dates/, /doors open 7 p\.m\./, /Closing time varies/, /waiver with fingerprint signature required/, /strobes/, /wet conditions/],
};
const expectedConfidence = {
  "MO26-019": "high", "MO26-031": "good", "MO26-034": "high", "MO26-054": "high", "MO26-067": "good",
  "MO26-100": "good", "MO26-114": "good", "MO26-115": "high", "MO26-124": "good", "MO26-125": "good",
};
const oldRows = [
  ...load("src/lib/date-night/missouri-2026-cleared-catalog.ts").MISSOURI_2026_CLEARED_SEASONAL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-v1-catalog.ts").MISSOURI_2026_V1_SEASONAL_CATALOG,
];
const ordinaryRows = load("src/lib/date-night/jasper-county-catalog.ts").JASPER_COUNTY_DATE_NIGHT_CATALOG;
const anchors = load("src/lib/date-night/seasonal-catalog.ts").JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG;
const catalog = [...ordinaryRows, ...anchors, ...oldRows, ...rows];
const { haversineMiles } = load("src/lib/restaurants/geo.ts");
const { getOpenStatus } = load("src/lib/restaurants/hours.ts");
const { getDateNightAvailability } = load("src/lib/date-night/availability.ts");
const categoryLabel = row => row.activityTypes.includes("other-halloween-fall") ? "Other Halloween / Fall" : row.activityTypes.includes("corn-maze") ? "Corn Maze" : "Haunted House";
const categoryButton = (page, row) => page.getByRole("button", { name: categoryLabel(row), exact: true });
const categoryTypes = row => [row.activityTypes.includes("other-halloween-fall") ? "other-halloween-fall" : row.activityTypes.includes("corn-maze") ? "corn-maze" : "haunted-house"];
const seasonalTypes = new Set(["other-halloween-fall", "corn-maze", "pumpkin-patch", "haunted-house"]);
// Counts include real existing city venues and colocated records. Radius uses
// the app's documented 0.05-mile boundary tolerance; it is not a record count.
const nearby = (row, { at = defaultAt, category, season = true, open = false, offset = 0 } = {}) => catalog.filter(other => {
  if (haversineMiles(row.lat + offset, row.lon, other.lat, other.lon) > 1.05) return false;
  if (!season && (other.seasonalListing || other.activityTypes.every(type => seasonalTypes.has(type)))) return false;
  if (category && !other.activityTypes.some(type => category.includes(type))) return false;
  const now = new Date(at), availability = getDateNightAvailability({ ...other, ...getOpenStatus(other.openingHours, now) }, now);
  return availability.browseEligible && (!open || availability.openNowEligible);
});
const selectTarget = async (page, row) => {
  await rowHeading(page, row).waitFor();
  await rowCard(page, row).getByRole("button").filter({ has: rowHeading(page, row) }).click();
  await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
};
const advance = async (test, at) => {
  await setControl({ ...test.state, at });
  await test.page.evaluate(at => {
    globalThis.__missouriNow = at;
    sessionStorage.setItem("seasonal-ten-clock", at);
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
  }, at);
};
const preference = (row, id, patch = {}) => ({ restaurantId: id, name: row.name,
  favorite: false, neverRecommend: false, ourRating: null, timesVisited: 0, lastVisited: null,
  cuisineLabel: row.cuisineLabel, photoKey: row.photoKey, lat: row.lat, lon: row.lon,
  address: row.address, priceLevel: null, ...patch });
const stored = page => page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state);
const visitNav = async (page, name, pathname) => {
  await press(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name, exact: true }));
  await page.waitForURL(`${origin}${pathname}`);
};
const savedItem = (page, row) => page.locator("main li").filter({ has: page.getByText(row.name, { exact: true }) });
const inspectSaved = async (test, row, label, ended = false) => {
  const { page, result, state } = test, item = savedItem(page, row);
  await item.waitFor(); assert.equal(await item.count(), 1);
  const text = await item.innerText();
  assert.match(text, /Approx\./); assert.ok(text.includes(row.address));
  if (ended) assert.match(text, /Season ended/);
  await assertConsumerOnly(item, row);
  const link = item.getByRole("link", { name: "Directions", exact: true });
  const href = await link.getAttribute("href");
  assert.equal(new URL(href).searchParams.get("destination"), row.address);
  await link.click({ trial: true });
  assert.equal(await item.locator("img").evaluate(async img => { await img.decode(); return img.naturalWidth > 0 && img.naturalHeight > 0; }), true);
  result.evidence.saved ??= []; result.evidence.saved.push({ label, text, href });
  await page.screenshot({ path: resolve(output, `${state.scenario}-${label}.png`), fullPage: true });
  await noOverflow(page);
};

try {
  await waitFor(async () => { try { return (await fetch(origin)).ok; } catch { return false; } }, "Preview startup failed");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId).sort(), Object.keys(materialFacts).sort(), "Exactly the independently cleared ten-record batch");
  assert.equal(new Set(rows.map(row => row.id)).size, 10);
  for (const row of rows) {
    assert.equal(seasonalPresentation(row).confidence, expectedConfidence[row.seasonalListing.recordId]);
    assert.equal(row.openingHours, null); assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.seasonalListing.directionsTarget.kind, "visitor-address");
    assert.ok(nearby(row).length <= 3, "The scoped neighborhood must fit in the real four-card shortlist with one ordinary fixture");
  }
  for (const [index, row] of rows.entries()) {
    const n = nearby(row).length, category = nearby(row, { category: categoryTypes(row) }).length;
    const ordinary = nearby(row, { season: false }).length, openOrdinary = nearby(row, { open: true }).length;
    const node = "date-night-osm-node-910001", way = "date-night-osm-way-910002";
    for (const width of [320, 390]) {
      await runScenario(row, index, `consumer-anything-category-${width}`, async test => {
        const { page, result } = test;
        await activityCount(page, n); await settleLocal(test);
        assert.equal(test.rpc.length, 1, "Real initial core RPC completed");
        for (const value of [row.id, "ListingCompletenessV1", row.seasonalListing.recordId,
          row.seasonalListing.listingExpiresAt, row.seasonalListing.reviewRevision, row.address]) {
          assert.ok(test.rpc[0].response.includes(value), `Built RPC retains factual value ${value}`);
        }
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        assert.equal(await rowHeading(page, row).count(), 1);
        assert.equal(await page.locator("article").count(), n);
        if (["MO26-124", "MO26-125"].includes(row.seasonalListing.recordId)) {
          for (const recordId of ["MO26-124", "MO26-125"]) {
            const distinct = rows.find(candidate => candidate.seasonalListing.recordId === recordId);
            assert.equal(await rowHeading(page, distinct).count(), 1, "Nearby Hotel and Dungeons keep distinct catalog identities");
          }
          result.evidence.distinctColocatedIds = rows.filter(candidate => ["MO26-124", "MO26-125"].includes(candidate.seasonalListing.recordId)).map(candidate => candidate.id);
        }
        await inspectQualifiedOverlay(test, row, "options");
        await selectTarget(page, row); await inspectQualifiedOverlay(test, row, "result"); await closeResult(page);
        const before = test.rpc.length;
        await press(categoryButton(page, row)); await activityCount(page, category);
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        assert.equal(await rowHeading(page, row).count(), 1);
        assert.equal(await page.locator("article").count(), category);
        await assertConsumerOnly(rowCard(page, row), row); await closeOptions(page);
        await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, n);
        await assertNoRpc(test, before, "Anything and category use actual acquired data locally");
        await pickButton(page).click();
        await page.getByRole("button", { name: "Close result", exact: true }).waitFor({ timeout: 20000 });
        const selected = await overlayRoot(page, "result").getByRole("heading").last().innerText();
        assert.ok(nearby(row).some(candidate => candidate.name === selected), "Pick uses only eligible neighborhood records");
        await inspectIcons(test, "result", "pick-result"); await closeResult(page);
        // Exercise ordinary app navigation with the selected seasonal filters persisted.
        await visitNav(page, "Settings", "/settings");
        await page.goBack(); await page.waitForURL(`${origin}/`); await ready(page); await activityCount(page, n);
        await page.goForward(); await page.waitForURL(`${origin}/settings`);
        await page.goBack(); await page.waitForURL(`${origin}/`); await ready(page); await activityCount(page, n);
      }, { width });
    }
    for (const scenario of ["open-now", "ended", "next-year", "season-off", "radius-exclusion"]) {
      const at = scenario === "ended" ? row.seasonalListing.listingExpiresAt : scenario === "next-year" ? "2027-10-07T18:00:00Z" : defaultAt;
      const expected = nearby(row, { at, season: scenario !== "season-off", open: scenario === "open-now", offset: scenario === "radius-exclusion" ? 0.06 : 0 });
      await runScenario(row, index, scenario, async test => {
        const { page } = test;
        await activityCount(page, expected.length);
        assert.equal(await pickButton(page).isDisabled(), expected.length === 0);
        assert.ok(!expected.some(candidate => candidate.id === row.id), "The target is ineligible in each policy-negative scenario");
        if (expected.length) {
          await optionsButton(page).click();
          assert.equal(await rowHeading(page, row).count(), 0, "Ineligible target cannot appear beside valid ordinary or other seasonal places");
          await closeOptions(page);
        }
        await settleLocal(test); assert.equal(test.rpc.length, 1);
        if (scenario === "season-off") assert.ok(!test.rpc[0].response.includes(row.id), "Season-off RPC excludes new curated identities");
      }, { at });
    }
    await runScenario(row, index, "mixed-alias-toggle-cache", async test => {
      const { page, result } = test;
      await activityCount(page, n + 1); await settleLocal(test); assert.equal(test.rpc.length, 1);
      for (const value of [row.id, node, way, "ListingCompletenessV1", row.seasonalListing.listingExpiresAt]) assert.ok(test.rpc[0].response.includes(value), `Merged RPC carries ${value}`);
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowHeading(page, row).count(), 1, "Two live provider representations merge once");
      assert.equal(await page.locator("article").count(), n + 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/); await closeOptions(page);
      const before = test.rpc.length;
      await press(categoryButton(page, row)); await activityCount(page, category);
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, n + 1);
      await assertNoRpc(test, before, "Anything/category reuse superset cache");
      const openNow = page.getByRole("switch", { name: "Open now only", exact: true });
      await press(openNow, "Space"); await activityCount(page, openOrdinary + 1);
      await optionsButton(page).click();
      await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
      assert.equal(await rowHeading(page, row).count(), 0, "24/7 provider aliases cannot promote any new V1 listing to Open now");
      await closeOptions(page); await press(openNow, "Space"); await activityCount(page, n + 1);
      await assertNoRpc(test, before, "Open now is local");
      const season = page.getByRole("switch", { name: "Spooky Season", exact: true });
      await press(season, "Space");
      await waitFor(async () => test.rpc.length === before + 1 && test.rpc.at(-1).response, "Season-off RPC missing");
      await ready(page); await activityCount(page, ordinary + 2);
      assert.ok(!test.rpc.at(-1).response.includes(row.id)); assert.ok(!test.rpc.at(-1).response.includes("seasonalListing"));
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowCard(page, row).locator("[data-seasonal-visit-notes]").count(), 0);
      assert.match(await rowCard(page, row).innerText(), /Park/i);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Haunted House|Corn Maze|Other Halloween/i);
      await closeOptions(page); const afterOff = test.rpc.length;
      await press(season, "Space"); await activityCount(page, n + 1);
      await assertNoRpc(test, afterOff, "Season-on restores its isolated superset");
      const refreshedAt = new Date(Date.parse(defaultAt) + 10 * 60000 + 1).toISOString();
      await advance(test, refreshedAt); await press(categoryButton(page, row));
      await waitFor(async () => test.rpc.length === afterOff + 1 && test.rpc.at(-1).response, "Expired category cache did not reacquire");
      await ready(page); await activityCount(page, category); assert.ok(test.rpc.at(-1).response.includes(row.id));
      await press(page.getByRole("button", { name: "Anything", exact: true }));
      await waitFor(async () => test.rpc.length === afterOff + 2 && test.rpc.at(-1).response, "Expired Anything cache did not reacquire missing categories");
      await ready(page); await activityCount(page, n + 1); const afterRefresh = test.rpc.length;
      await press(openNow, "Space"); await activityCount(page, openOrdinary + 1);
      await optionsButton(page).click(); assert.equal(await rowHeading(page, row).count(), 0); await closeOptions(page);
      await assertNoRpc(test, afterRefresh, "Fresh merged aliases stay fail-closed");
      result.evidence.cache = { before, afterOff, afterRefresh, refreshedAt };
    }, { fixture: "mixed" });
    for (const kind of ["options", "result"]) {
      const expiresAt = row.seasonalListing.listingExpiresAt, beforeAt = new Date(Date.parse(expiresAt) - 60000).toISOString();
      await runScenario(row, index, `resume-expiry-${kind}`, async test => {
        const { page, result } = test;
        await activityCount(page, nearby(row, { at: beforeAt }).length + 1);
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        if (kind === "result") await selectTarget(page, row);
        await settleLocal(test); const before = test.rpc.length;
        await advance(test, expiresAt); await rowHeading(page, row).waitFor({ state: "hidden" });
        const remaining = nearby(row, { at: expiresAt }).length + 1;
        await activityCount(page, remaining);
        if (kind === "options") {
          assert.equal(await page.locator("article").count(), remaining); await closeOptions(page);
        } else assert.equal(await page.getByRole("button", { name: "Close result", exact: true }).count(), 0);
        await assertNoRpc(test, before, "Final expiry recomputes cached eligibility without provider traffic");
        await optionsButton(page).click(); await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
        assert.equal(await rowHeading(page, row).count(), 0); await closeOptions(page);
        await advance(test, "2027-10-07T18:00:00Z"); await activityCount(page, ordinary + 1);
        await assertNoRpc(test, before, "Cached identity cannot roll forward into 2027");
        result.evidence.expiry = { expiresAt, basis: row.seasonalListing.expiryBasis, rpcDelta: test.rpc.length - before };
      }, { fixture: "mixed", at: beforeAt });
    }
    await runScenario(row, index, "provider-failure", async test => {
      const { page } = test;
      await activityCount(page, n); await settleLocal(test); assert.equal(test.rpc.length, 1);
      assert.match(test.rpc[0].response, /fallback/); assert.ok(test.rpc[0].response.includes(row.id));
      await optionsButton(page).click(); await selectTarget(page, row);
      const href = await page.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href");
      assert.equal(new URL(href).searchParams.get("destination"), row.address);
      assert.equal(await page.getByRole("link", { name: "Open Uber; choose your destination in the external service", exact: true }).getAttribute("href"), "https://m.uber.com/");
      await closeResult(page); await press(page.getByRole("switch", { name: "Open now only", exact: true }), "Space");
      await activityCount(page, openOrdinary);
    }, { fixture: "provider-failure" });
    await runScenario(row, index, "favorite-alias-cache-resume-unsave", async test => {
      const { page } = test;
      await activityCount(page, 1); await settleLocal(test); const before = test.rpc.length;
      assert.ok(test.rpc[0].response.includes(node) && test.rpc[0].response.includes(way));
      await press(categoryButton(page, row)); await activityCount(page, 1);
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, 1);
      await advance(test, new Date(Date.parse(defaultAt) + 60000).toISOString()); await activityCount(page, 1);
      await assertNoRpc(test, before, "Affirmed provider favorite survives cache and resume");
      await optionsButton(page).click(); await selectTarget(page, row); await page.getByRole("button", { name: "Saved", exact: true }).waitFor(); await closeResult(page);
      await press(page.getByRole("switch", { name: "Favorites only", exact: true }), "Space"); await activityCount(page, n + 1);
      await optionsButton(page).click(); await selectTarget(page, row);
      await page.getByRole("button", { name: "Saved", exact: true }).click(); await page.getByRole("button", { name: "Save", exact: true }).waitFor();
      let state = await stored(page);
      assert.equal(state.preferences[node].favorite, false); assert.equal(state.preferences[way].favorite, false);
      assert.equal(state.preferences[node].ourRating, 4); assert.equal(state.preferences[way].timesVisited, 2);
      await page.getByRole("button", { name: "Save", exact: true }).click(); state = await stored(page);
      assert.deepEqual(Object.values(state.preferences).filter(item => item.favorite).map(item => item.restaurantId), [row.id]);
      await closeResult(page); await press(page.getByRole("switch", { name: "Favorites only", exact: true }), "Space"); await activityCount(page, 1);
      await advance(test, row.seasonalListing.listingExpiresAt); await activityCount(page, 0);
      await assertNoRpc(test, before, "Canonical and provider favorites cannot resurrect expired listings");
    }, { fixture: "mixed", filters: { favoritesOnly: true }, preferences: {
      [node]: preference(row, node, { favorite: true, ourRating: 4 }), [way]: preference(row, way, { favorite: true, timesVisited: 2 }),
    } });
    await runScenario(row, index, "negative-alias-beats-canonical-favorite", async test => {
      const { page } = test;
      await activityCount(page, 0); await settleLocal(test); const before = test.rpc.length;
      assert.ok(test.rpc[0].response.includes(row.id)); assert.equal(await pickButton(page).isDisabled(), true);
      await press(categoryButton(page, row)); await activityCount(page, 0);
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, 0);
      await advance(test, new Date(Date.parse(defaultAt) + 60000).toISOString()); await activityCount(page, 0);
      await press(page.getByRole("switch", { name: "Favorites only", exact: true }), "Space"); await activityCount(page, n);
      await optionsButton(page).click(); assert.equal(await rowHeading(page, row).count(), 0); await closeOptions(page);
      await assertNoRpc(test, before, "Never-recommend alias remains effective through cache/resume");
    }, { fixture: "mixed", filters: { favoritesOnly: true }, preferences: {
      [row.id]: preference(row, row.id, { favorite: true }), [node]: preference(row, node, { neverRecommend: true }),
    } });
    const exclusionEnd = Date.parse(defaultAt) + 120000;
    await runScenario(row, index, "alias-exclusion-expiry-and-not-tonight", async test => {
      const { page } = test;
      await activityCount(page, 0); await settleLocal(test); const before = test.rpc.length;
      assert.ok(test.rpc[0].response.includes(way));
      await press(categoryButton(page, row)); await activityCount(page, 0);
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, 0);
      await advance(test, new Date(exclusionEnd - 1).toISOString()); await activityCount(page, 0);
      await advance(test, new Date(exclusionEnd).toISOString()); await activityCount(page, 1);
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      await rowCard(page, row).getByRole("button", { name: `Not tonight: ${row.name}`, exact: true }).click();
      await rowHeading(page, row).waitFor({ state: "hidden" }); await activityCount(page, 0);
      await assertNoRpc(test, before, "Alias exclusion expiry and Not tonight remain local");
    }, { fixture: "mixed", filters: { favoritesOnly: true }, preferences: { [row.id]: preference(row, row.id, { favorite: true }) },
      exclusions: [{ restaurantId: way, name: row.name, expiresAt: exclusionEnd, reason: "not-tonight" }] });
    await runScenario(row, index, "affirmed-favorites-direct-reload-expiry", async test => {
      const { page, result } = test;
      await activityCount(page, 1); await settleLocal(test);
      assert.ok(test.rpc[0].response.includes(node) && test.rpc[0].response.includes(way));
      await visitNav(page, "Favorites", "/favorites"); await inspectSaved(test, row, "aliases-grouped");
      assert.equal(await page.locator("main li").count(), 1);
      const before = test.rpc.length;
      await page.reload({ waitUntil: "domcontentloaded" }); await inspectSaved(test, row, "aliases-direct-reload");
      await assertNoRpc(test, before, "Direct Favorites reload uses persisted identity receipt without discovery");
      let state = await stored(page);
      assert.equal(state.preferences[node].favorite, true); assert.equal(state.preferences[way].favorite, true);
      assert.notEqual(state.preferences[row.id]?.favorite, true);
      await savedItem(page, row).getByRole("button", { name: `Remove ${row.name}`, exact: true }).click();
      await page.getByText("No favorites yet", { exact: true }).waitFor(); state = await stored(page);
      assert.equal(state.preferences[node].favorite, false); assert.equal(state.preferences[way].favorite, false);
      assert.equal(state.preferences[node].ourRating, 4);
      await visitNav(page, "Pick", "/"); await ready(page); await activityCount(page, 0);
      await press(page.getByRole("switch", { name: "Favorites only", exact: true }), "Space"); await activityCount(page, n + 1);
      await optionsButton(page).click(); await selectTarget(page, row);
      await page.getByRole("button", { name: "Save", exact: true }).click(); await closeResult(page);
      state = await stored(page); assert.deepEqual(Object.values(state.preferences).filter(item => item.favorite).map(item => item.restaurantId), [row.id]);
      await visitNav(page, "Favorites", "/favorites"); await inspectSaved(test, row, "canonical-resaved");
      await advance(test, row.seasonalListing.listingExpiresAt);
      await page.reload({ waitUntil: "domcontentloaded" }); await inspectSaved(test, row, "ended-history-reload", true);
      result.evidence.identityReceipt = await page.evaluate(() => localStorage.getItem("pick-for-us-seasonal-identity-v1")); assert.ok(result.evidence.identityReceipt);
      await savedItem(page, row).getByRole("button", { name: `Remove ${row.name}`, exact: true }).click();
      await page.getByText("No favorites yet", { exact: true }).waitFor();
    }, { fixture: "mixed", filters: { favoritesOnly: true }, preferences: {
      [node]: preference(row, node, { favorite: true, ourRating: 4 }), [way]: preference(row, way, { favorite: true }),
    } });
  }
  // These receipts were written against the seven already-shipped reviews.
  // Keep their literal old revisions: deriving from new rows would miss an
  // accidental data-review revision bump caused solely by presentation copy.
  const oldRevision = row => ["MO26-068", "MO26-116"].includes(row.seasonalListing.recordId)
    ? "Shipped-two-record-corrected-projections-2026-10-07" : "MO2026-Phase2-R2-76896ea4";
  for (const [index, row] of oldRows.entries()) {
    const providerId = `date-night-osm-node-${920000 + index}`;
    await runScenario(row, `legacy-${index}`, "old-receipt-survives-batch", async test => {
      const { page, result } = test, item = savedItem(page, row);
      await item.waitFor(); assert.equal(await item.count(), 1);
      const href = await item.getByRole("link", { name: "Directions", exact: true }).getAttribute("href");
      const destination = new URL(href).searchParams.get("destination");
      assert.equal(destination, row.seasonalListing.directionsTarget.kind === "verified-point" ? `${row.lat},${row.lon}` : row.address);
      if (row.seasonalListing.recordId === "MO26-116") assert.doesNotMatch(await item.innerText(), /Approx\./);
      else assert.match(await item.innerText(), /Approx\./);
      await assertConsumerOnly(item, row);
      await page.reload({ waitUntil: "domcontentloaded" }); await item.waitFor();
      assert.equal(new URL(await item.getByRole("link", { name: "Directions", exact: true }).getAttribute("href")).searchParams.get("destination"), destination);
      await assertNoRpc(test, 0, "Pre-batch receipt hydrates direct Favorites without discovery");
      assert.equal((await stored(page)).preferences[providerId].ourRating, 4);
      result.evidence.preservedReceipt = { providerId, canonicalId: row.id, revision: oldRevision(row), destination };
    }, { pathname: "/favorites", preferences: { [providerId]: preference(row, providerId, { favorite: true, ourRating: 4 }) },
      identityReceipts: { [providerId]: { canonicalId: row.id, canonicalName: row.name, reviewRevision: oldRevision(row) } } });
  }
  assert.equal(verdict.scenarios.length, rows.length * 15 + oldRows.length);
  assert.equal(verdict.errors.length, 0);
  verdict.passed = true;
} catch (error) {
  verdict.errors.push({ message: error.message, stack: error.stack }); process.exitCode = 1;
} finally {
  await browser?.close();
  try { process.kill(-server.pid, "SIGTERM"); } catch (error) {
    if (error.code !== "ESRCH") { verdict.errors.push({ message: "Owned preview cleanup failed" }); verdict.passed = false; process.exitCode = 1; }
  }
  const network = (await readFile(events, "utf8")).split("\n").filter(Boolean).map(JSON.parse);
  verdict.network = { interceptedProviderCalls: network.filter(event => event.event === "intercepted-provider").length,
    blockedServerRequests: network.filter(event => event.event === "blocked-external"), forwardedExternalCalls: 0 };
  if (network.some(event => event.forwarded === true)) { verdict.passed = false; process.exitCode = 1; verdict.errors.push({ message: "Fixture forwarded an external provider request" }); }
  await writeFile(resolve(output, "server.log"), logs);
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2));
  console.log(JSON.stringify(verdict, null, 2));
}
