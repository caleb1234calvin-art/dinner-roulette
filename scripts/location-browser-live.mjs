import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { chromium } from "playwright";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
import { createTsTestLoader } from "./ts-test-loader.mjs";
const { haversineMiles } = createTsTestLoader()("src/lib/restaurants/geo.ts");

if (process.env.CASINO_BROWSER_LOCAL !== "1") throw new Error("Explicit local real-provider validation only");
const buildProof = assertBrowserBuild();
const origin = "http://127.0.0.1:8093";
const output = "audit/browser-results/location-live";
mkdirSync(output, { recursive: true });
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath,
  "--import=" + pathToFileURL(resolve("scripts/casino-live-network-log.mjs")).href,
  "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "8093", "--strictPort"],
{ env: process.env, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
server.stdout.on("data", x => serverLog += x);
server.stderr.on("data", x => serverLog += x);
const verdict = { testedAt: new Date().toISOString(), origin, buildProof,
  mode: "Actual manual Nominatim and restaurant Overpass through the combined local app/RPC; no provider mocks; no GPS request", cities: [], pageErrors: [], errors: [] };
let browser, page;
try {
  const deadline = Date.now() + 60000;
  for (;;) {
    if (server.exitCode !== null || Date.now() > deadline) throw new Error("Owned international preview failed to start");
    try { if (stripVTControlCharacters(serverLog).includes(origin) && (await fetch(origin)).ok) break; } catch { /* Starting. */ }
    await new Promise(r => setTimeout(r, 250));
  }
  const launch = { headless: true };
  if (process.env.CASINO_BROWSER_EXECUTABLE_PATH) {
    launch.executablePath = process.env.CASINO_BROWSER_EXECUTABLE_PATH;
    launch.args = ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
  }
  browser = await chromium.launch(launch);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  context.setDefaultTimeout(20000);
  context.setDefaultNavigationTimeout(30000);
  page = await context.newPage();
  page.on("pageerror", error => verdict.pageErrors.push(error.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem("pick-for-us-v1")) localStorage.setItem("pick-for-us-v1", JSON.stringify({
      state: { location: { lat: 43.65348, lon: -79.38393, label: "Toronto initial saved origin", source: "manual" },
        filters: { radiusMiles: 1, openNowOnly: false, minPrice: 1, maxPrice: 4, includeUnknownPrice: true, cuisines: ["anything"] } }, version: 0,
    }));
    window.__liveGpsCalls = 0;
    const getPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
    navigator.geolocation.getCurrentPosition = (...args) => { window.__liveGpsCalls++; return getPosition(...args); };
  });
  console.log("LOCATION_LIVE_STAGE opening app");
  await page.goto(origin, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Object.keys(document.querySelector('[aria-label="Use my location"]') ?? {}).some(key => key.startsWith("__reactProps")));
  console.log("LOCATION_LIVE_STAGE hydrated controls");
  await page.getByRole("button", { name: "Close hints", exact: true }).click();
  const section = page.getByRole("region", { name: "Search location" });
  for (const [query, country, locality] of [
    ["Toronto, Ontario, Canada", "CA", "Toronto"],
    ["Vancouver, British Columbia, Canada", "CA", "Vancouver"],
    ["Montréal, Québec, Canada", "CA", "Montréal"],
    ["London, United Kingdom", "GB", "London"],
  ]) {
    try {
      console.log("LOCATION_LIVE_STAGE manual " + query);
      const toggle = section.getByRole("button", { name: "Change location" });
      if (await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
      await section.getByRole("textbox", { name: "City, region and country, or postal code", exact: true }).fill(query);
      await section.getByRole("button", { name: "Set location", exact: true }).click();
      await section.getByRole("status").filter({ hasText: "Location set to" }).waitFor({ timeout: 20000 });
      console.log("LOCATION_LIVE_STAGE resolved " + query);
      const location = await page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location);
      assert.equal(location.countryCode, country); assert.match(location.label, new RegExp(locality, "i"));
      assert.equal(location.source, "manual");
      await page.getByRole("status").filter({ hasText: "Finding restaurants near you" }).waitFor({ state: "hidden", timeout: 110000 });
      const body = await page.locator("body").innerText();
      assert.ok(!body.includes("We couldn't refresh restaurants right now"), "Real discovery failed; do not treat unavailable as empty/pass");
      assert.ok(!/Using saved|verified saved/i.test(body), "No U.S. saved pool may substitute for international discovery");
      const count = Number(body.match(/(\d+) restaurants? match/)?.[1] ?? (body.includes("Only one restaurant matches") ? 1 : 0));
      assert.ok(count > 0, "Expect an actual eligible live restaurant pool in this city");
      await page.getByRole("button", { name: "Pick for us", exact: true }).click();
      const maps = page.getByRole("link", { name: /Directions.*Google Maps/ }); await maps.waitFor();
      const directions = await maps.getAttribute("href"); const url = new URL(directions);
      assert.equal(url.origin, "https://www.google.com");
      const destination = url.searchParams.get("destination"); assert.match(destination, /^-?[\d.]+,-?[\d.]+$/);
      const [lat, lon] = destination.split(",").map(Number);
      assert.ok(haversineMiles(location.lat, location.lon, lat, lon) <= 1.1, "Maps points to the selected nearby international venue");
      const selectedName = await page.locator("h2").last().innerText();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: output + "/" + locality.toLowerCase().replace("é", "e") + ".png", fullPage: true });
      await page.getByRole("button", { name: "Close result", exact: true }).click();
      const row = { query, location, eligible: count, selectedName, directions, source: "live", passed: true };
      verdict.cities.push(row); console.log("LOCATION_LIVE_CITY " + JSON.stringify(row));
    } catch (error) {
      verdict.cities.push({ query, passed: false, error: error.message });
      verdict.errors.push(query + ": " + error.message);
      console.log("LOCATION_LIVE_CITY " + JSON.stringify({ query, passed: false, error: error.message }));
      await page.screenshot({ path: output + "/failure-" + country + ".png", fullPage: true }).catch(() => {});
      const close = page.getByRole("button", { name: "Close result", exact: true });
      if (await close.isVisible()) await close.click();
    }
  }
  assert.equal(await page.evaluate(() => window.__liveGpsCalls), 0);
  await page.reload({ waitUntil: "domcontentloaded" });
  await section.getByText(/London/).first().waitFor();
  assert.equal(await page.evaluate(() => window.__liveGpsCalls), 0);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location.countryCode), "GB");
  assert.deepEqual(verdict.pageErrors, []);
  verdict.reloadWithoutGps = true;
} catch (error) { verdict.errors.push(error.stack ?? String(error)); }
finally {
  await browser?.close();
  try { if (process.platform === "win32") server.kill("SIGTERM"); else process.kill(-server.pid, "SIGTERM"); }
  catch (error) { if (error.code !== "ESRCH") verdict.errors.push("Preview cleanup: " + error.message); }
  verdict.providers = serverLog.split("\n").filter(row => row.startsWith("CASINO_LIVE_PROVIDER ")).map(row => JSON.parse(row.slice("CASINO_LIVE_PROVIDER ".length)));
  verdict.passed = verdict.errors.length === 0 && verdict.cities.length === 4 && verdict.cities.every(row => row.passed);
  if (!verdict.passed) process.exitCode = 1;
  writeFileSync(output + "/verdict.json", JSON.stringify(verdict, null, 2) + "\n");
  console.log("LOCATION_LIVE_VERDICT " + JSON.stringify(verdict));
}
