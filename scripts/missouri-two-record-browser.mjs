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
  const notes = overlay.locator("[data-seasonal-visit-notes] p");
  assert.equal(await notes.count(), row.seasonalVisitNotes.length, `${kind}: every qualified note is present`);
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
        unobscured: Boolean(hit && (hit === element || element.contains(hit))) };
    });
    reachability.notes.push({ index, text: expected, ...visible });
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
  // Preserve all 12 original PR48 scenarios and their assertions.
  for (const [index, row] of rows.entries()) for (const scenario of ["anything", "category", "open-now", "ended", "next-year", "season-off"]) {
    const at = scenario === "ended" ? row.seasonalAvailability.endsAt : scenario === "next-year" ? "2027-10-07T18:00:00Z" : defaultAt;
    await runScenario(row, index, scenario, async test => {
      const { page } = test;
      const pick = pickButton(page), visible = ["anything", "category"].includes(scenario);
      await activityCount(page, visible ? 1 : 0);
      assert.equal(await pick.isDisabled(), !visible, `${row.id}:${scenario}`);
      if (visible) {
        await optionsButton(page).click();
        await rowHeading(page, row).waitFor();
        const text = await page.locator("[data-seasonal-visit-notes]").innerText();
        assert.ok(text.includes(index ? "Shelter 1" : "Approximate operator navigation"));
        if (index) {
          assert.equal(await rowCard(page, row).locator("img").getAttribute("src"), "/date-night-icons/grok_1788905199846.jpg");
          assert.match(await rowCard(page, row).innerText(), /Other Halloween \/ Fall/i);
        }
        await inspectQualifiedOverlay(test, row, "options");
        await closeOptions(page);
        await pick.click(); await rowHeading(page, row).waitFor({ timeout: 20000 });
        const resultText = await page.locator("[data-seasonal-visit-notes]").innerText();
        assert.ok(resultText.includes(index ? "14:00–16:00" : "younger than 18"));
        const href = await page.getByRole("link", { name: /Directions · Google Maps/ }).getAttribute("href");
        assert.equal(new URL(href).searchParams.get("destination"), `${row.lat},${row.lon}`);
        await inspectQualifiedOverlay(test, row, "result");
        await page.screenshot({ path: resolve(output, `${index}-${scenario}.png`), fullPage: true });
        await noOverflow(page);
        await closeResult(page);
        await pick.click(); await rowHeading(page, row).waitFor({ timeout: 20000 });
        await closeResult(page);
      }
    }, { at });
  }
  for (const [index, row] of rows.entries()) {
    await runScenario(row, index, "mixed-toggle-cache", async test => {
      const { page, result } = test;
      await activityCount(page, 2);
      await settleLocal(test);
      assert.equal(test.rpc.length, 1, "One real initial patch RPC");
      const initialRpc = test.rpc[0].response;
      for (const value of [row.id, "date-night-osm-node-910001", "date-night-osm-way-910002", "park", "seasonalAvailability", row.seasonalAvailability.endsAt]) {
        assert.ok(initialRpc.includes(value), `Real RPC retains merged evidence: ${value}`);
      }
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowHeading(page, row).count(), 1, "Duplicate identities render once");
      assert.equal(await page.locator("article").count(), 2);
      assert.equal(await rowCard(page, row).locator("[data-seasonal-visit-notes]").count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      result.evidence.seasonOn = await page.locator("article").allTextContents();
      await inspectIcons(test, "options", "mixed-season-on");
      await page.screenshot({ path: resolve(output, `${index}-mixed-season-on.png`), fullPage: true });
      await noOverflow(page); await closeOptions(page);
      const initialCount = test.rpc.length;
      const category = page.getByRole("button", { name: index ? "Other Halloween / Fall" : "Corn Maze", exact: true });
      await press(category); await activityCount(page, 1);
      assert.equal(await category.getAttribute("aria-pressed"), "true");
      await press(page.getByRole("button", { name: "Anything", exact: true })); await activityCount(page, 2);
      await assertNoRpc(test, initialCount, "Anything/category uses the acquired superset cache");
      const openNow = page.getByRole("switch", { name: "Open now only", exact: true });
      await press(openNow, "Space"); await activityCount(page, 1);
      await optionsButton(page).click(); await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
      assert.equal(await rowHeading(page, row).count(), 0, "Provider 24/7 hours cannot promote the curated event to Open now");
      await closeOptions(page); await press(openNow, "Space"); await activityCount(page, 2);
      await assertNoRpc(test, initialCount, "Open now is a local filter");
      const toggle = page.getByRole("switch", { name: "Spooky Season", exact: true });
      await press(toggle, "Space");
      await waitFor(async () => test.rpc.length === initialCount + 1 && test.rpc.at(-1).response, "Season-off RPC did not settle");
      await ready(page); await activityCount(page, 2);
      assert.equal(await toggle.getAttribute("aria-checked"), "false");
      assert.equal(await category.count(), 0);
      assert.ok(!test.rpc.at(-1).response.includes(row.id), "Season-off RPC excludes curated event identity");
      assert.ok(!test.rpc.at(-1).response.includes("seasonalVisitNotes"), "Season-off RPC excludes curated details");
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
      const afterOff = test.rpc.length;
      await press(toggle, "Space"); await activityCount(page, 2);
      assert.equal(await toggle.getAttribute("aria-checked"), "true");
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await rowCard(page, row).locator("[data-seasonal-visit-notes]").count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      await closeOptions(page);
      await assertNoRpc(test, afterOff, "Season-on restores its isolated cache without another RPC");
      await press(openNow, "Space"); await activityCount(page, 1);
      await assertNoRpc(test, afterOff, "Cached merged event remains fail-closed for Open now");
      await press(openNow, "Space"); await activityCount(page, 2);
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
      await waitFor(async () => test.rpc.length >= afterOff + 1 && test.rpc.at(-1).response,
        "Expired category cache did not reacquire through the real RPC");
      await ready(page); await activityCount(page, 1);
      assert.equal(test.rpc.length, afterOff + 1, "Expired category requires exactly one core RPC");
      assert.ok(test.rpc.at(-1).response.includes(row.id));
      await optionsButton(page).click(); await rowHeading(page, row).waitFor();
      assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), 1);
      assert.doesNotMatch(await rowCard(page, row).innerText(), /Open now/);
      await closeOptions(page);
      await press(page.getByRole("button", { name: "Anything", exact: true }));
      await waitFor(async () => test.rpc.length >= afterOff + 2 && test.rpc.at(-1).response,
        "Anything did not reacquire the expired missing categories");
      await ready(page); await activityCount(page, 2);
      assert.equal(test.rpc.length, afterOff + 2, "Anything refreshes missing categories in one core RPC");
      const afterRefresh = test.rpc.length;
      await press(openNow, "Space"); await activityCount(page, 1);
      await optionsButton(page).click();
      await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
      assert.equal(await rowHeading(page, row).count(), 0, "Fresh merged evidence still cannot promote the event to Open now");
      await closeOptions(page); await press(openNow, "Space"); await activityCount(page, 2);
      await assertNoRpc(test, afterRefresh, "Fresh-cache Open now remains a local filter");
      result.evidence.expiredCacheRefresh = { at: refreshedAt, additionalRpcCount: afterRefresh - afterOff };
      // Exercise real keyboard controls and application Back/Forward navigation.
      await press(page.getByRole("slider", { name: "Cozy to adventurous", exact: true }), "End");
      await assertNoRpc(test, afterRefresh, "Keyboard mood change is local");
      await press(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Settings", exact: true }));
      await page.waitForURL(`${origin}/settings`);
      await page.goBack(); await page.waitForURL(`${origin}/`); await ready(page); await activityCount(page, 2);
      assert.equal(await toggle.getAttribute("aria-checked"), "true");
      await page.goForward(); await page.waitForURL(`${origin}/settings`);
      await page.goBack(); await page.waitForURL(`${origin}/`); await ready(page); await activityCount(page, 2);
      result.evidence.navigation = "Keyboard Settings, Back, Forward, Back preserved stored filters; remount RPCs are recorded separately.";
    }, { fixture: "mixed" });
    for (const overlay of ["options", "result"]) {
      const endsAt = row.seasonalAvailability.endsAt;
      await runScenario(row, index, `mixed-resume-${overlay}`, async test => {
        const { page, state, result } = test;
        await activityCount(page, 2);
        await optionsButton(page).click(); await rowHeading(page, row).waitFor();
        if (overlay === "result") {
          await rowCard(page, row).getByRole("button").filter({ has: rowHeading(page, row) }).click();
          await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
        }
        assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), 1);
        await settleLocal(test);
        const before = test.rpc.length;
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
        await activityCount(page, 1);
        assert.equal(await page.locator("[data-seasonal-visit-notes]").count(), 0);
        if (overlay === "options") {
          await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
          assert.equal(await page.locator("article").count(), 1, "Open options drops only the expired identity");
          await closeOptions(page);
        } else assert.equal(await page.getByRole("button", { name: "Close result", exact: true }).count(), 0, "Expired result overlay is dismissed");
        await assertNoRpc(test, before, "Resume at final end recomputes eligibility without provider traffic");
        await optionsButton(page).click();
        await page.getByRole("heading", { name: "Ordinary park control", exact: true }).waitFor();
        assert.equal(await rowHeading(page, row).count(), 0, "Future selections cannot resurrect the ended duplicate");
        await noOverflow(page); await closeOptions(page);
        result.evidence.finalEnd = endsAt;
        result.evidence.resumeRpcDelta = test.rpc.length - before;
      }, { fixture: "mixed", at: new Date(Date.parse(endsAt) - 60000).toISOString() });
    }
  }
  await runScenario({ id: "myer-trusted-fallback", name: "Carthage, Missouri", lat: 37.176447, lon: -94.310223 }, 0,
    "myer-trusted-fallback-removed", async test => {
      const { page, result } = test;
      await activityCount(page, 1);
      await settleLocal(test);
      assert.equal(test.rpc.length, 1);
      assert.match(test.rpc[0].response, /fallback/);
      assert.doesNotMatch(test.rpc[0].response, /myer/i, "Failed providers cannot restore Myer's trusted fallback");
      await optionsButton(page).click();
      await page.getByRole("heading", { name: "The Werehouse", exact: true }).waitFor();
      assert.doesNotMatch(await page.locator("article").innerText(), /myer/i);
      result.evidence.fallbackNames = await page.locator("article h3").allTextContents();
      await closeOptions(page);
    }, { fixture: "provider-failure", filters: { activityTypes: ["haunted-house"] } });
  assert.equal(verdict.scenarios.length, 19);
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
