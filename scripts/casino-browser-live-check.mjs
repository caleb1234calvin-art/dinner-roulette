import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { chromium } from "playwright";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";
import { createTsTestLoader } from "./ts-test-loader.mjs";
const { haversineMiles } = createTsTestLoader()("src/lib/restaurants/geo.ts");

// Explicit manual/local validation. Never accepts a hosted or production URL.
if (process.env.CASINO_BROWSER_LOCAL !== "1") throw new Error("Set CASINO_BROWSER_LOCAL=1 in a disposable checkout");
const { records } = await loadCasinoCatalogs();
const { canonical } = auditCasinoRecords(records, {});
const origin = "http://127.0.0.1:8092";
const output = "audit/browser-results/live-local";
mkdirSync(output, { recursive: true });
const preload = pathToFileURL(resolve("scripts/casino-live-network-log.mjs")).href;
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath,
  "--import=" + preload, "node_modules/vite/bin/vite.js", "preview",
  "--host", "127.0.0.1", "--port", "8092", "--strictPort"],
{ env: process.env, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
server.stdout.on("data", x => { serverLog += x; });
server.stderr.on("data", x => { serverLog += x; });
const verdict = { capturedAt: new Date().toISOString(), origin,
  network: "Actual provider requests; no mocked provider responses or geocoder results",
  geolocation: "Chromium permission and coordinate emulation; not a physical-device GPS test",
  canonicalDestinations: canonical.length, requestedAuthFlag: process.env.VITE_AUTH_ENABLED ?? "unspecified", regions: [], findings: [], errors: [], providers: [] };
let browser;
let activePage;
async function settled(page) {
  await page.waitForFunction(() => [...document.querySelectorAll("button")]
    .some(b => b.textContent?.trim() === "Pick for us" && !b.disabled), null, { timeout: 45000 });
}
try {
  const deadline = Date.now() + 60000;
  for (;;) {
    try { if (server.exitCode === null && stripVTControlCharacters(serverLog).includes(origin) && (await fetch(origin)).ok) break; } catch { /* The owned preview may still be starting. */ }
    if (server.exitCode !== null || Date.now() > deadline) throw new Error("Local preview failed to start");
    await new Promise(r => setTimeout(r, 500));
  }
  const launch = { headless: true };
  if (process.env.CASINO_BROWSER_EXECUTABLE_PATH) {
    launch.executablePath = process.env.CASINO_BROWSER_EXECUTABLE_PATH;
    launch.args = ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
  }
  browser = await chromium.launch(launch);
  for (const location of [
    { name: "Reno", lat: 39.529, lon: -119.816, width: 1280, height: 800 },
    { name: "Newkirk", lat: 36.977, lon: -97.045, width: 390, height: 844 },
    { name: "Ardmore", lat: 34.174, lon: -97.143, width: 1280, height: 800 },
    { name: "Chandler", lat: 35.702, lon: -96.881, width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport: { width: location.width, height: location.height }, reducedMotion: "reduce" });
    const page = await context.newPage(); activePage = page;
    const errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.addInitScript(loc => localStorage.setItem("pick-for-us-v1", JSON.stringify({
      state: { location: { lat: loc.lat, lon: loc.lon, label: loc.name, source: "manual" } }, version: 0,
    })), location);
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some(b =>
      b.textContent?.trim() === "Nightlife" && Object.keys(b).some(k => k.startsWith("__reactProps$") && typeof b[k]?.onClick === "function")));
    await page.getByRole("heading", { name: "Dinner Roulette in 30 seconds", exact: true }).waitFor();
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Got it", exact: true }).click();
    await page.getByRole("button", { name: "Nightlife", exact: true }).click();
    await page.getByRole("button", { name: "Casino", exact: true }).click();
    await settled(page);
    const body = await page.locator("body").innerText();
    const fallback = /using verified saved local nightlife/i.test(body);
    const count = Number(body.match(/(\d+) venues? match/)?.[1]); assert.ok(count > 0);
    const expectedSavedCount = canonical.filter(row => haversineMiles(location.lat, location.lon, row.lat, row.lon) <= 10.05).length;
    assert.ok(count >= expectedSavedCount, "Built results must retain every eligible current canonical casino");
    if (fallback) assert.equal(count, expectedSavedCount);
    await page.getByRole("button", { name: "Give us options", exact: true }).click();
    await page.getByRole("heading", { name: "Tonight's options", exact: true }).waitFor();
    const names = await page.locator("article h3").allTextContents();
    assert.equal(names.length, Math.min(4, count)); assert.equal(new Set(names).size, names.length);
    await page.screenshot({ path: `${output}/${location.name.toLowerCase()}-options.png`, fullPage: true });
    await page.locator("article").first().getByRole("button").last().click();
    const maps = page.getByRole("link", { name: /Directions.*Google Maps/ }); await maps.waitFor();
    const directions = await maps.getAttribute("href");
    assert.equal(new URL(directions).origin, "https://www.google.com");
    assert.ok(new URL(directions).searchParams.get("destination"));
    await page.screenshot({ path: `${output}/${location.name.toLowerCase()}-result.png`, fullPage: true });
    await page.getByRole("button", { name: "Close result", exact: true }).click();
    await page.getByRole("button", { name: "Close options", exact: true }).click();
    await page.getByRole("switch", { name: "Favorites only", exact: true }).click();
    await page.getByText("Nothing matches those filters.", { exact: false }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Pick for us", exact: true }).isDisabled(), true);
    await page.getByRole("switch", { name: "Favorites only", exact: true }).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    if (location.name === "Reno") {
      await context.setGeolocation({ latitude: location.lat, longitude: location.lon });
      await context.grantPermissions(["geolocation"]);
      await page.getByRole("button", { name: "Use current location", exact: true }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location.source === "geo", null, { timeout: 25000 });
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location);
      assert.equal(saved.lat, location.lat); assert.equal(saved.lon, location.lon);
      await context.clearPermissions();
      await page.getByRole("button", { name: "Use current location", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "Location permission denied. Enter a city or ZIP instead." }).waitFor({ timeout: 15000 });
      await page.getByRole("textbox", { name: "City or ZIP code", exact: true }).fill("Reno, Nevada");
      await page.getByRole("button", { name: "Set location", exact: true }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location.source === "manual", null, { timeout: 25000 }).catch(() => {});
      const after = await page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location);
      if (after.source !== "manual") verdict.findings.push("Real manual Nominatim lookup did not complete successfully; previous location is preserved. See provider transport evidence.");
    }
    await page.getByRole("button", { name: "Dinner", exact: true }).click();
    await page.getByRole("button", { name: "Date Night", exact: true }).click();
    await page.getByRole("link", { name: "Settings", exact: true }).click();
    await page.getByRole("heading", { name: /Settings/ }).waitFor();
    assert.deepEqual(errors, []);
    const result = { name: location.name, viewport: { width: location.width, height: location.height }, eligible: count, expectedSavedCount, source: fallback ? "fallback" : "live-or-merged", names, directions, pageErrors: errors };
    verdict.regions.push(result); console.log("CASINO_LIVE_REGION " + JSON.stringify(result));
    await context.close();
  }
} catch (error) {
  verdict.errors.push(error.stack ?? String(error)); process.exitCode = 1;
  verdict.failureBody = await activePage?.locator("body").innerText().catch(() => "");
  await activePage?.screenshot({ path: output + "/failure.png", fullPage: true }).catch(() => {});
} finally {
  await browser?.close(); try {
    if (process.platform === "win32") server.kill("SIGTERM");
    else process.kill(-server.pid, "SIGTERM");
  } catch (error) {
    if (error.code !== "ESRCH") { verdict.errors.push("Preview cleanup: " + error.message); process.exitCode = 1; }
  }
  verdict.providers = serverLog.split("\n").filter(x => x.startsWith("CASINO_LIVE_PROVIDER ")).map(x => JSON.parse(x.slice("CASINO_LIVE_PROVIDER ".length)));
  writeFileSync(output + "/verdict.json", JSON.stringify(verdict, null, 2) + "\n");
  console.log("CASINO_LIVE_VERDICT " + JSON.stringify(verdict));
}
