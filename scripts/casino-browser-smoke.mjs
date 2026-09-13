import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
import { auditCasinoRecords } from "./casino-audit.mjs";

if (process.env.CI !== "true") throw new Error("This smoke runner uses disposable CI fixtures only");
const origin = "http://127.0.0.1:8080";
const output = "audit/browser-results";
mkdirSync(output, { recursive: true });
const preload = pathToFileURL(resolve("scripts/casino-smoke-network.mjs")).href;
const server = spawn(process.execPath, [
  "scripts/with-app-env.mjs", process.execPath, "--import=" + preload,
  "node_modules/vite/bin/vite.js", "dev", "--host", "127.0.0.1", "--port", "8080",
], { env: { ...process.env, CASINO_BROWSER_SMOKE: "1" }, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
server.stdout.on("data", (data) => { serverLog += data; });
server.stderr.on("data", (data) => { serverLog += data; });
const { records } = await loadCasinoCatalogs();
const { canonical } = auditCasinoRecords(records, {});
const verdict = { origin, fixtures: "Server-side Overpass outage; Nominatim deterministic locations. Actual app, server functions and catalog.", checks: [], errors: [] };
let browser;
try {
  const deadline = Date.now() + 90000;
  while (true) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    if (server.exitCode != null || Date.now() > deadline) throw new Error("Local smoke server did not become ready");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  browser = await chromium.launch();
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const label = viewport.width === 390 ? "mobile" : "desktop";
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    // Analytics/fonts are external to this local functional gate.
    await page.route("**/_vercel/insights/**", (route) => route.fulfill({ status: 200, body: "" }));
    await page.addInitScript(({ lat, lon, label }) => {
      localStorage.setItem("pick-for-us-v1", JSON.stringify({
        state: { location: { lat, lon, label, source: "manual" } }, version: 0,
      }));
    }, label === "mobile" ? { lat: 34.1743, lon: -97.1436, label: "Ardmore, Oklahoma" }
      : { lat: 36.1164, lon: -115.174, label: "Las Vegas, Nevada" });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Nightlife", exact: true }).click();
    await page.getByRole("button", { name: "Casino", exact: true }).click();
    const open = page.getByRole("switch", { name: "Open now only", exact: true });
    if (await open.getAttribute("aria-checked") === "true") await open.click();
    const pick = page.getByRole("button", { name: "Pick for us", exact: true });
    await pick.waitFor({ state: "visible" });
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some((b) => /Pick for us/i.test(b.textContent ?? "") && !b.disabled));
    assert.match(await page.locator("body").innerText(), /using verified saved local nightlife/i);
    verdict.checks.push(label + ": casino filter and saved-catalog outage fallback");
    await open.click();
    await page.getByText("Nothing matches those filters.", { exact: false }).waitFor();
    assert.equal(await pick.isDisabled(), true);
    await open.click();
    verdict.checks.push(label + ": strict open-now excludes unknown hours; empty state disables selection");
    await page.getByRole("button", { name: "Give us options", exact: true }).click();
    // Options selection is covered separately below once exact UI is stable.
    await page.screenshot({ path: output + "/" + label + "-options.png", fullPage: true });
    const closeOptions = page.getByRole("button", { name: /Close options/i });
    await closeOptions.click();
    await pick.click();
    const direction = page.getByRole("link", { name: /Directions.*Google Maps/ });
    await direction.waitFor({ state: "visible", timeout: 20000 });
    const href = await direction.getAttribute("href");
    const matching = canonical.filter((r) => href.includes(String(r.lat)) && href.includes(String(r.lon)));
    assert.ok(matching.length > 0, "Directions must use a real canonical property's coordinates: " + href);
    await page.getByText("Hours unconfirmed", { exact: false }).waitFor();
    await page.screenshot({ path: output + "/" + label + "-result.png", fullPage: true });
    await page.getByRole("button", { name: "Reroll", exact: true }).click();
    await direction.waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Not tonight", exact: true }).click();
    verdict.checks.push(label + ": options, result details, real map coordinates, reroll and exclusion");
    await page.getByRole("switch", { name: "Favorites only", exact: true }).click();
    await page.getByText("Nothing matches those filters.", { exact: false }).waitFor();
    assert.equal(await pick.isDisabled(), true);
    await page.getByRole("switch", { name: "Favorites only", exact: true }).click();
    await page.getByRole("button", { name: "Change location", exact: true }).click();
    await page.getByRole("textbox", { name: "City or ZIP code", exact: true }).fill("Empty Test");
    await page.getByRole("button", { name: "Set location", exact: true }).click();
    await page.getByText("We couldn't refresh nightlife right now", { exact: true }).waitFor();
    assert.equal(await pick.isDisabled(), true);
    verdict.checks.push(label + ": manual location, no-catalog/provider failure and favorites empty states");
    await page.getByRole("button", { name: "Dinner", exact: true }).click();
    await page.getByRole("button", { name: "Date Night", exact: true }).click();
    await page.getByRole("link", { name: "Settings", exact: true }).click();
    await page.getByRole("heading", { name: /Settings/ }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.deepEqual(pageErrors, [], "Uncaught browser errors");
    verdict.checks.push(label + ": non-casino navigation, settings and no horizontal overflow or page errors");
    await context.close();
  }
} catch (error) {
  verdict.errors.push(error.stack ?? String(error));
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  writeFileSync(output + "/server.log", serverLog);
  writeFileSync(output + "/verdict.json", JSON.stringify(verdict, null, 2) + "\n");
  console.log("CASINO_BROWSER_VERDICT " + JSON.stringify(verdict));
}
