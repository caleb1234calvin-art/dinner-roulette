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
const output = resolve("audit/browser-results/seasonal-completeness-v1");
await mkdir(output, { recursive: true });
const control = resolve(output, "control.json"), events = resolve(output, "events.jsonl");
const origin = "http://127.0.0.1:8098", defaultAt = "2026-10-07T18:00:00Z";
const setControl = async state => {
  await writeFile(`${control}.next`, JSON.stringify(state));
  await rename(`${control}.next`, control);
};
await writeFile(events, "");
await setControl({ at: defaultAt, scenario: "startup" });
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath, "--import",
  resolve("scripts/test-support/seasonal-completeness-v1-preload.mjs"), "node_modules/vite/bin/vite.js", "preview",
  "--host", "127.0.0.1", "--port", "8098", "--strictPort"], {
  env: { ...process.env, DATABASE_URL: "", SEASONAL_V1_CONTROL: control, SEASONAL_V1_EVENTS: events },
  detached: true, stdio: ["ignore", "pipe", "pipe"],
});
let logs = "", browser;
server.stdout.on("data", d => { logs += d; });
server.stderr.on("data", d => { logs += d; });
const verdict = { passed: false, proof, publicProviderCalls: 0, scenarios: [], errors: [] };
const { MISSOURI_2026_V1_SEASONAL_CATALOG: rows } = appModuleLoader()("src/lib/date-night/missouri-2026-v1-catalog.ts");
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
  assert.equal(await section.locator(":scope > p").innerText(), "Check the venue for current hours, admission, and weather updates.");
  const details = section.locator("details");
  assert.equal(await details.getAttribute("open"), null, "Details initially collapsed");
  await details.locator("summary").click();
  const notes = details.locator("p");
  assert.equal(await notes.count(), row.seasonalVisitNotes.length, `${kind}: every qualified note is present`);
  const materialFacts = {
    "MO26-003": [/19:00/, /last ticket.*00:00/i, /closing.*unspecified/i, /\$20/, /retention boundary.*not a closing-time/i],
    "MO26-010": [/last walk-through 00:30/, /not wheelchair accessible/, /Carrying babies or infants is prohibited/, /all sales final\/no refunds/, /No costumes/, /strobes/, /heavy rain or lightning/, /separate addresses/],
    "MO26-011": [/last walk-through 00:30/, /not wheelchair accessible/, /Carrying babies or infants is prohibited/, /all sales final\/no refunds/, /No costumes/, /strobes/, /heavy rain or lightning/, /separate addresses/],
    "MO26-029": [/liability waiver/, /Last-admission conflict/, /Weekday public entry unavailable/, /after dark/, /free mini pumpkin/, /while supplies last/],
    "MO26-030": [/Festival entry is free/, /separate fees/, /pumpkins are priced by weight/, /accompanying adult/, /closed Mondays/, /never Park Board headquarters/, /roundabout/],
  };
  const fullDetails = await details.innerText();
  for (const expected of materialFacts[row.seasonalListing.recordId]) assert.match(fullDetails, expected, `${kind}: material fact ${expected}`);
  assert.doesNotMatch(await section.innerText(), /Hours unknown|Schedule checked|periodic review|does not establish Open Now/i);

  const reachability = { overlay: kind, notes: [], controls: [] };
  result.evidence.overlayReachability ??= [];
  result.evidence.overlayReachability.push(reachability);
  for (const [index, expected] of row.seasonalVisitNotes.entries()) {
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
  const result = { id: row.id, scenario, passed: false, evidence: {}, rpc: [], blockedBrowserRequests: [],
    imageResponses: [], imageRequestFailures: [], consoleMessages: [], pageErrors: [] };
  verdict.scenarios.push(result);
  const context = await browser.newContext({ viewport: { width: index ? 320 : 390, height: 844 },
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
      globalThis.__geolocationCalls = [];
      for (const method of ["getCurrentPosition", "watchPosition"]) {
        Object.defineProperty(navigator.geolocation, method, { value: () => {
          globalThis.__geolocationCalls.push(method);
          throw new Error("Geolocation must not be requested in manual-location acceptance");
        } });
      }
      const OriginalDate = Date;
      globalThis.__missouriNow = at;
      globalThis.Date = class extends OriginalDate {
        constructor(...args) { super(...(args.length ? args : [globalThis.__missouriNow])); }
        static now() { return new OriginalDate(globalThis.__missouriNow).getTime(); }
      };
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      if (!localStorage.getItem("pick-for-us-v1")) localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        location: { lat: row.lat + (scenario === "radius-exclusion" ? 0.06 : 0), lon: row.lon, label: row.name, source: "manual" }, homeMode: "date-night",
        spookySeasonEnabled: scenario !== "season-off", dateNightFilters: {
          radiusMiles: 1, activityTypes: scenario === "category" ? row.activityTypes : ["anything"],
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
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await ready(page);
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
    console.log(`SEASONAL_V1_BROWSER_${result.passed ? "PASS" : "FAIL"} ${state.scenario}`);
  }
}

try {
  await waitFor(async () => { try { return (await fetch(origin)).ok; } catch { return false; } }, "Preview startup failed");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  assert.equal(rows.length, 5, "This acceptance is exactly the five approved V1 records");
  const { haversineMiles } = appModuleLoader()("src/lib/restaurants/geo.ts");
  const nearbyCount = row => rows.filter(other => haversineMiles(row.lat, row.lon, other.lat, other.lon) <= 1).length;
  const categoryLabel = row => row.activityTypes.includes("corn-maze") ? "Corn Maze" : "Haunted House";
  const categoryButton = (page, row) => page.getByRole("button", { name: categoryLabel(row), exact: true });
  const selectTarget = async (page, row) => {
    await rowCard(page, row).getByRole("button").filter({ has: rowHeading(page, row) }).click();
    await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
  };
  const advance = async (test, at) => {
    await setControl({ ...test.state, at });
    await test.page.evaluate(at => {
      globalThis.__missouriNow = at;
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
    }, at);
  };
  for (const [index, row] of rows.entries()) {
    const n = nearbyCount(row);
    for (const scenario of ["anything", "category", "open-now", "ended", "next-year", "season-off", "radius-exclusion"]) {
      const visible = ["anything", "category"].includes(scenario);
      const at = scenario === "ended" ? row.seasonalListing.listingExpiresAt : scenario === "next-year" ? "2027-10-07T18:00:00Z" : defaultAt;
      await runScenario(row, index, scenario, async test => {
        const { page, result } = test;
        await activityCount(page, visible ? n : 0);
        assert.equal(await pickButton(page).isDisabled(), !visible);
        if (!visible) return;
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        assert.equal(await rowHeading(page, row).count(), 1);
        assert.equal(await page.locator("article").count(), n);
        await inspectQualifiedOverlay(test, row, "options");
        await selectTarget(page, row);
        await inspectQualifiedOverlay(test, row, "result");
        await closeResult(page);
        // Exercise the actual Pick path as well as selecting an options card.
        await pickButton(page).click();
        await page.getByRole("button", { name: "Close result", exact: true }).waitFor({ timeout: 20000 });
        const selectedName = await overlayRoot(page, "result").getByRole("heading").last().innerText();
        result.evidence.pickSelectedName = selectedName;
        assert.ok(rows.some(candidate => candidate.name === selectedName), "Pick selects a reviewed listing");
        await inspectIcons(test, "result", "pick-result");
        assert.equal(await overlayRoot(page, "result").locator("[data-seasonal-visit-notes] details[open]").count(), 0);
        await closeResult(page);
      }, { at });
    }
    await runScenario(row, index, "mixed-toggle-cache", async test => {
      const { page, result } = test;
      await activityCount(page, n + 1); await settleLocal(test);
      assert.equal(test.rpc.length, 1);
      for (const value of [row.id, "date-night-osm-node-910001", "date-night-osm-way-910002", "ListingCompletenessV1", row.seasonalListing.listingExpiresAt]) {
        assert.ok(test.rpc[0].response.includes(value), `RPC retains merged qualification ${value}`);
      }
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowHeading(page, row).count(), 1, "Two provider representations merge into one reviewed listing");
      assert.equal(await page.locator("article").count(), n + 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      await closeOptions(page);
      const before = test.rpc.length;
      const category = categoryButton(page, row);
      await press(category); await activityCount(page, n);
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, n + 1);
      await assertNoRpc(test, before, "Category/Anything reuse acquired superset");
      const openNow = page.getByRole("switch", { name: "Open now only", exact: true });
      await press(openNow, "Space"); await activityCount(page, 1);
      await optionsButton(page).click();
      await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
      assert.equal(await rowHeading(page, row).count(), 0, "24/7 provider hours cannot promote V1 listing");
      await closeOptions(page); await press(openNow, "Space"); await activityCount(page, n + 1);
      await assertNoRpc(test, before, "Open now filters locally");
      const season = page.getByRole("switch", { name: "Spooky Season", exact: true });
      await press(season, "Space");
      await waitFor(async () => test.rpc.length === before + 1 && test.rpc.at(-1).response, "Season-off RPC missing");
      await ready(page); await activityCount(page, 2);
      assert.ok(!test.rpc.at(-1).response.includes(row.id));
      assert.ok(!test.rpc.at(-1).response.includes("seasonalListing"));
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), 0);
      assert.match(await rowCard(page, row).innerText(), /Park/i);
      result.evidence.seasonOffSameNameProvider = await rowCard(page, row).innerText();
      await closeOptions(page);
      const afterOff = test.rpc.length;
      await press(season, "Space"); await activityCount(page, n + 1);
      await assertNoRpc(test, afterOff, "Season-on restores isolated cache");
      await press(openNow, "Space"); await activityCount(page, 1);
      await press(openNow, "Space"); await activityCount(page, n + 1);
      const refreshedAt = new Date(Date.parse(defaultAt) + 10 * 60000 + 1).toISOString();
      await advance(test, refreshedAt);
      await press(category);
      await waitFor(async () => test.rpc.length === afterOff + 1 && test.rpc.at(-1).response, "Expired category did not reacquire");
      await ready(page); await activityCount(page, n);
      assert.ok(test.rpc.at(-1).response.includes(row.id));
      await press(page.getByRole("button", { name: "Anything", exact: true }));
      await waitFor(async () => test.rpc.length === afterOff + 2 && test.rpc.at(-1).response, "Expired Anything did not reacquire");
      await ready(page); await activityCount(page, n + 1);
      const afterRefresh = test.rpc.length;
      await press(openNow, "Space"); await activityCount(page, 1);
      await assertNoRpc(test, afterRefresh, "Fresh cache remains fail-closed for Open now");
      result.evidence.cache = { before, afterOff, afterRefresh, refreshedAt };
    }, { fixture: "mixed" });
    for (const kind of ["options", "result"]) {
      const expiresAt = row.seasonalListing.listingExpiresAt;
      await runScenario(row, index, `resume-${kind}`, async test => {
        const { page, result } = test;
        await activityCount(page, n + 1);
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        if (kind === "result") await selectTarget(page, row);
        await settleLocal(test); const before = test.rpc.length;
        await advance(test, expiresAt);
        await rowHeading(page, row).waitFor({ state: "hidden" });
        await activityCount(page, 1);
        assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), 0);
        if (kind === "options") {
          assert.equal(await page.locator("article").count(), 1);
          await closeOptions(page);
        } else assert.equal(await page.getByRole("button", { name: "Close result", exact: true }).count(), 0);
        await assertNoRpc(test, before, "Resume at expiry removes cached listing without provider traffic");
        await optionsButton(page).click();
        await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
        assert.equal(await rowHeading(page, row).count(), 0);
        await closeOptions(page);
        result.evidence.expiry = { expiresAt, basis: row.seasonalListing.expiryBasis, rpcDelta: test.rpc.length - before };
      }, { fixture: "mixed", at: new Date(Date.parse(expiresAt) - 60000).toISOString() });
    }
    await runScenario(row, index, "provider-failure", async test => {
      const { page, result } = test;
      await activityCount(page, n); await settleLocal(test);
      assert.equal(test.rpc.length, 1); assert.match(test.rpc[0].response, /fallback/);
      assert.ok(test.rpc[0].response.includes(row.id));
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowHeading(page, row).count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      await selectTarget(page, row);
      const href = await page.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href");
      assert.equal(new URL(href).searchParams.get("destination"), row.address);
      result.evidence.fallbackDirections = href;
      await closeResult(page);
      await press(page.getByRole("switch", { name: "Open now only", exact: true }), "Space");
      await activityCount(page, 0); assert.equal(await pickButton(page).isDisabled(), true);
    }, { fixture: "provider-failure" });
    await runScenario(row, index, "favorites-exclusion", async test => {
      const { page } = test;
      await activityCount(page, n); await settleLocal(test); const before = test.rpc.length;
      const favorites = page.getByRole("switch", { name: "Favorites only", exact: true });
      await press(favorites, "Space"); await activityCount(page, 0);
      assert.equal(await pickButton(page).isDisabled(), true);
      await press(favorites, "Space"); await activityCount(page, n);
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      await rowCard(page, row).getByRole("button", { name: `Not tonight: ${row.name}`, exact: true }).click();
      await rowHeading(page, row).waitFor({ state: "hidden" });
      const close = page.getByRole("button", { name: "Close options", exact: true });
      if (await close.count()) await close.click();
      await activityCount(page, n - 1);
      await assertNoRpc(test, before, "Favorites/exclusion do not reacquire providers");
    });
  }
  assert.equal(verdict.scenarios.length, 60);
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
