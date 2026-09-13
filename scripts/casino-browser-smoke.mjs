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
  "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "8080",
], { env: { ...process.env, CASINO_BROWSER_SMOKE: "1" }, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
server.stdout.on("data", (data) => { serverLog += data; });
server.stderr.on("data", (data) => { serverLog += data; });
const { records } = await loadCasinoCatalogs();
const { canonical } = auditCasinoRecords(records, {});
async function assertDirections(page, expectedState) {
  const link = page.getByRole("link", { name: /Directions.*Google Maps/ });
  await link.waitFor({ state: "visible", timeout: 20000 });
  const headings = await page.locator("h2").allTextContents();
  const record = canonical.find((row) => headings.includes(row.name));
  assert.ok(record, "The displayed result must belong to the canonical casino catalog");
  assert.equal(record.jurisdiction, expectedState);
  const url = new URL(await link.getAttribute("href"));
  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.pathname, "/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  const expected = record.address && record.address !== "Address unavailable"
    ? record.address : `${record.lat},${record.lon}`;
  assert.equal(url.searchParams.get("destination"), expected, "Directions must target the displayed canonical property");
  assert.equal(await link.getAttribute("target"), "_blank");
  assert.match(await link.getAttribute("rel"), /noopener/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  return record;
}
const verdict = { origin, fixtures: "Server-side Overpass outage; Nominatim deterministic locations. Production-mode local preview, actual server functions and catalog.", checks: [], errors: [] };
let browser;
let currentPage;
const browserConsole = [];
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
    currentPage = page;
    page.on('console', (message) => { if (message.type() === 'error') browserConsole.push(message.text()); });
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
    // Visible SSR buttons can precede React event attachment on a cold dev server.
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) =>
      button.textContent?.trim() === "Nightlife" && Object.keys(button).some((key) =>
        key.startsWith("__reactProps$") && typeof button[key]?.onClick === "function")));
    await page.getByRole("heading", { name: "Dinner Roulette in 30 seconds", exact: true }).waitFor();
    for (let step = 0; step < 3; step += 1) await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Got it", exact: true }).click();
    verdict.checks.push(label + ": completed the four-step first-run tour");
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
    const expectedState = label === "mobile" ? "Oklahoma" : "Nevada";
    const matched = (await page.locator("body").innerText()).match(/(\d+) venues? match/);
    assert.ok(matched, "Show the actual eligible destination count");
    const expectedOptions = Math.min(4, Number(matched[1]));
    await page.getByRole("button", { name: "Give us options", exact: true }).click();
    await page.getByRole("heading", { name: "Tonight's options", exact: true }).waitFor();
    const optionNames = await page.locator("article h3").allTextContents();
    assert.equal(optionNames.length, expectedOptions);
    assert.equal(new Set(optionNames).size, optionNames.length);
    assert.ok(optionNames.every((name) => canonical.some((r) => r.name === name && r.jurisdiction === expectedState)));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.screenshot({ path: output + "/" + label + "-options.png", fullPage: true });
    await page.locator("article").first().getByRole("button").last().click();
    const optionResult = await assertDirections(page, expectedState);
    assert.equal(optionResult.name, optionNames[0]);
    await page.getByRole("button", { name: "Close result", exact: true }).click();
    await page.getByRole("button", { name: "Close options", exact: true }).click();
    await pick.click();
    const firstPick = await assertDirections(page, expectedState);
    await page.getByText("Hours unconfirmed — verify before going.", { exact: true }).waitFor();
    await page.screenshot({ path: output + "/" + label + "-result.png", fullPage: true });
    await page.getByRole("button", { name: "Reroll", exact: true }).click();
    const secondPick = await assertDirections(page, expectedState);
    if (Number(matched[1]) > 1) assert.notEqual(secondPick.id, firstPick.id);
    await page.getByRole("button", { name: "Not tonight", exact: true }).click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state);
    assert.ok(saved.exclusions.some((entry) => entry.restaurantId === secondPick.id));
    verdict.checks.push(label + ": unique canonical options, option selection, map destination, reroll and persisted exclusion");
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
  verdict.browserConsole = browserConsole;
  verdict.failureBody = await currentPage?.locator("body").innerText().catch(() => "");
  await currentPage?.screenshot({ path: output + "/failure.png", fullPage: true }).catch(() => {});
  console.log("CASINO_SMOKE_SERVER_LOG " + serverLog);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  writeFileSync(output + "/server.log", serverLog);
  writeFileSync(output + "/verdict.json", JSON.stringify(verdict, null, 2) + "\n");
  console.log("CASINO_BROWSER_VERDICT " + JSON.stringify(verdict));
}
