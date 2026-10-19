import { assertBrowserBuild } from "./browser-build-proof.mjs";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { stripVTControlCharacters } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

execFileSync("git", ["diff", "--exit-code", "HEAD", "--"], { stdio: "pipe" });
const [head, tree, parent] = execFileSync("git", ["rev-parse", "HEAD", "HEAD^{tree}", "HEAD^"], { encoding: "utf8" }).trim().split("\n");
const buildProof = assertBrowserBuild();
const output = resolve(process.env.LOCATION_BROWSER_OUTPUT ?? "audit/browser-results/location-disambiguation");
await mkdir(output, { recursive: true });
const requestLog = resolve(output, "requests.jsonl");
await writeFile(requestLog, "");
const origin = "http://127.0.0.1:8096";
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath, "--import",
  resolve("scripts/test-support/location-disambiguation-fixtures.mjs"), "node_modules/vite/bin/vite.js", "preview",
  "--host", "127.0.0.1", "--port", "8096", "--strictPort"], {
  env: { ...process.env, DATABASE_URL: "", LOCATION_BROWSER_REQUEST_LOG: requestLog },
  detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", data => serverLog += data);
server.stderr.on("data", data => serverLog += data);
const report = { identity: { head, tree, parent }, buildProof, mode: "Real built app/RPC with captured Benton provider geography and simulated GPS; no live-provider claim", checks: [], geometry: [], pageErrors: [] };
let browser, page;
async function ready(check, message) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error("Owned preview exited");
    if (await check()) return;
    await delay(100);
  }
  throw new Error(message);
}
const countyName = "Use Benton County, Arkansas, United States Place type: county";
const townName = "Use Benton, Saline County, Arkansas, 72015, United States Place type: town";
try {
  await ready(async () => {
    try { return stripVTControlCharacters(serverLog).includes(origin) && (await fetch(origin)).ok; } catch { return false; }
  }, "Preview did not start");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  report.browser = await browser.version();
  for (const width of [320, 390, 512]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce",
      permissions: ["geolocation"], geolocation: { latitude: 43.65348, longitude: -79.38393 } });
    await context.route("**/_vercel/insights/**", route => route.fulfill({ status: 200, body: "" }));
    await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
    page = await context.newPage();
    page.on("pageerror", error => report.pageErrors.push(error.message));
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Object.keys(document.querySelector('[aria-label="Use my location"]') ?? {}).some(key => key.startsWith("__reactProps")));
    await page.getByRole("button", { name: "Close hints", exact: true }).click();
    const section = page.getByRole("region", { name: "Search location" });
    const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state);
    const before = await state();
    const toggle = section.getByRole("button", { name: "Change location", exact: true });
    const input = section.getByRole("textbox", { name: "City, region and country, or postal code", exact: true });
    async function find(query) {
      if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
      await input.fill(query);
      await section.getByRole("button", { name: "Find location", exact: true }).click();
      await section.getByRole("heading", { name: "Choose a location", exact: true }).waitFor();
    }
    await toggle.click();
    assert.equal(await input.evaluate(el => el === document.activeElement), true);
    await find("Benton, Arkansas, United States");
    assert.deepEqual((await state()).location, before.location);
    assert.equal(await section.getByRole("heading", { name: "Choose a location" }).evaluate(el => el === document.activeElement), true);
    const county = section.getByRole("button", { name: countyName, exact: true });
    const town = section.getByRole("button", { name: townName, exact: true });
    for (const choice of [county, town]) {
      const measure = await choice.evaluate(el => {
        const r = el.getBoundingClientRect(), card = el.closest("section").getBoundingClientRect();
        return { text: el.innerText, x: r.x, right: r.right, width: r.width, height: r.height, cardX: card.x, cardRight: card.right,
          containedText: el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight, whiteSpace: getComputedStyle(el).whiteSpace };
      });
      report.geometry.push({ viewport: width, ...measure });
      assert.ok(measure.height >= 44 && measure.width >= 44);
      assert.ok(measure.x >= measure.cardX && measure.right <= measure.cardRight);
      assert.equal(measure.containedText, true);
      assert.equal(measure.whiteSpace, "normal");
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: resolve(output, `choices-${width}.png`), fullPage: true });
    await page.keyboard.press("Tab");
    assert.equal(await county.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press("Tab");
    assert.equal(await town.evaluate(el => el === document.activeElement), true);
    const focusedVisibility = await town.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, viewportHeight: innerHeight,
        unobscured: [0.1, 0.5, 0.9].every(fraction => el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height * fraction))) };
    });
    assert.ok(focusedVisibility.top >= 0 && focusedVisibility.bottom <= focusedVisibility.viewportHeight);
    assert.equal(focusedVisibility.unobscured, true, "Keyboard choice must be visible above fixed app controls");
    report.geometry.push({ viewport: width, focusedVisibility });
    await page.screenshot({ path: resolve(output, `focus-${width}.png`), fullPage: true });
    await page.keyboard.press("Enter");
    await ready(async () => (await state()).location.lat === 34.5645372, "Town selection did not commit");
    assert.equal((await state()).location.label, "Benton, Saline County, Arkansas, 72015, United States");
    assert.deepEqual((await state()).filters, before.filters);
    assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    const chosen = (await state()).location;
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Object.keys(document.querySelector('[aria-label="Use my location"]') ?? {}).some(key => key.startsWith("__reactProps")));
    assert.deepEqual((await state()).location, chosen);
    for (const mode of ["Nightlife", "Date Night", "Dinner"]) {
      await page.getByRole("button", { name: mode, exact: true }).click();
      assert.deepEqual((await state()).location, chosen);
    }
    await find("Benton County only");
    assert.deepEqual((await state()).location, chosen);
    assert.equal(await section.getByRole("button", { name: townName, exact: true }).count(), 0);
    await section.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual((await state()).location, chosen);
    await find("Benton, Arkansas, United States");
    await input.fill("Changed query");
    assert.equal(await county.count(), 0);
    assert.deepEqual((await state()).location, chosen);
    await find("Benton County only");
    await county.click();
    await ready(async () => (await state()).location.lat === 36.3456186, "Explicit county selection did not commit");
    await find("Benton, Arkansas, United States");
    await section.getByRole("button", { name: "Use my location", exact: true }).click();
    await ready(async () => (await state()).location.source === "geo", "GPS did not supersede candidates");
    assert.equal(await county.count(), 0);
    await ready(async () => (await state()).location.label === "Toronto, Ontario, Canada", "Reverse label not complete");
    await toggle.click();
    await input.fill("Benton slow");
    await section.getByRole("button", { name: "Find location", exact: true }).click();
    await section.getByRole("button", { name: "Use my location", exact: true }).click();
    await delay(1800); // Explicit delayed fixture ownership: old manual completion must stay inert.
    assert.equal((await state()).location.source, "geo");
    assert.equal((await state()).location.lat, 43.65348);
    assert.equal(await county.count(), 0);
    await toggle.click();
    await input.fill("Unknown fixture");
    await section.getByRole("button", { name: "Find location", exact: true }).click();
    await section.getByRole("alert").filter({ hasText: /Couldn't find/ }).waitFor();
    assert.equal((await state()).location.lat, 43.65348);
    report.checks.push({ viewport: width, passed: true, checks: ["full county/town geography", "old area retained", "44px targets, containment and wrapping", "keyboard choice and focus return", "reload and all-mode persistence", "lone county confirmation", "cancel and edit", "GPS supersession and late manual result", "no-result preserves area"] });
    await context.close();
  }
  const requests = (await readFile(requestLog, "utf8")).trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
  assert.ok(requests.some(row => row.kind === "discovery" && row.lat === 34.5645372 && row.lon === -92.586828));
  assert.ok(requests.filter(row => row.fixture === "captured-benton").every(row => new URL(row.url).searchParams.get("limit") === "5"));
  assert.deepEqual(report.pageErrors, []);
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.error = error.stack;
  await page?.screenshot({ path: resolve(output, "failure.png"), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser?.close();
  try { if (process.platform === "win32") server.kill("SIGTERM"); else process.kill(-server.pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") { report.cleanupError = error.message; report.passed = false; process.exitCode = 1; } }
  await writeFile(resolve(output, "server.log"), serverLog);
  await writeFile(resolve(output, "result.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
