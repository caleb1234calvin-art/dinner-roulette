import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { stripVTControlCharacters } from "node:util";
import { chromium } from "playwright";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
import { checkedOutputPath, checkedUrl } from "./browser-guard.mjs";

if (process.env.CI !== "true") throw new Error("Controlled Date Night browser acceptance requires CI=true");
const buildProof = assertBrowserBuild();
const output = process.env.DATE_NIGHT_BROWSER_OUTPUT
  ? checkedOutputPath(process.env.DATE_NIGHT_BROWSER_OUTPUT, [resolve("audit"), tmpdir()], "browser output")
  : await mkdtemp(resolve(tmpdir(), "pfu-date-night-resilience-"));
await mkdir(output, { recursive: true });
const eventPath = resolve(output, "provider-events.jsonl");
const controlPath = resolve(output, "fixture-control.json");
await writeFile(eventPath, "");
await writeFile(controlPath, JSON.stringify({ scenario: "second-mirror", startedAt: Date.now() }));
const port = 8086;
const origin = checkedUrl(`http://127.0.0.1:${port}`);
const server = spawn(process.execPath, [
  "scripts/with-app-env.mjs", process.execPath, "--import", resolve("scripts/test-support/date-night-resilience-preload.mjs"),
  "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort",
], { env: { ...process.env, DATABASE_URL: "", DATE_NIGHT_RESILIENCE_BROWSER: "1",
  DATE_NIGHT_RESILIENCE_EVENTS: eventPath, DATE_NIGHT_RESILIENCE_CONTROL: controlPath },
  detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
const capture = (chunk) => { serverLog = (serverLog + chunk).slice(-100_000); };
server.stdout.on("data", capture);
server.stderr.on("data", capture);
const verdict = { passed: false, testedAt: new Date().toISOString(), buildProof,
  mode: "Production-built local Preview; real browser and TanStack RPC; disposable synthetic provider failures. No live public-provider calls.",
  checks: [], scenarios: [], errors: [] };
let browser, currentPage;
async function waitFor(check, label, timeout = 25_000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (server.exitCode !== null) throw new Error("Owned Date Night preview exited");
    if (await check()) return;
    await delay(100);
  }
  throw new Error(label);
}
const events = async (scenario) => (await readFile(eventPath, "utf8")).split("\n").filter(Boolean).map((line) => JSON.parse(line)).filter((event) => event.scenario === scenario);

try {
  await waitFor(async () => {
    try { return stripVTControlCharacters(serverLog).includes(origin) && (await fetch(origin)).ok; }
    catch { return false; }
  }, "Owned built Preview did not become ready");
  browser = await chromium.launch({ headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? "/tmp/pfu-halloween-browser/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  for (const scenario of ["second-mirror", "third-mirror", "partial-groups", "all-stall"]) {
    await writeFile(controlPath, JSON.stringify({ scenario, startedAt: Date.now() }));
    const activityTypes = scenario === "all-stall" ? ["anything"] : scenario === "partial-groups" ? ["corn-maze", "park"] : ["corn-maze"];
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
    await context.route("**/*", (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await context.addInitScript(({ activityTypes }) => {
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        location: { lat: 37.176447, lon: -94.310223, label: "Carthage, Missouri", source: "manual" },
        homeMode: "date-night", spookySeasonEnabled: true,
        dateNightFilters: { radiusMiles: 15, activityTypes, mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: false },
      } }));
    }, { activityTypes });
    const page = await context.newPage();
    currentPage = page;
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.name));
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) =>
      button.textContent?.trim() === "Date Night" && button.getAttribute("aria-pressed") === "true" &&
      Object.keys(button).some((key) => key.startsWith("__reactProps"))));
    const loading = page.getByText("Finding date ideas near you…", { exact: true });
    await loading.waitFor({ state: "visible", timeout: 5000 });
    const loadingObservedAt = Date.now();
    await loading.waitFor({ state: "hidden", timeout: 25_000 });
    const visibleLoadingMs = Date.now() - loadingObservedAt;
    const body = await page.locator("body").innerText();
    assert.match(body, /\d+ activities match/);
    assert.doesNotMatch(body, /Date idea search timed out|couldn't refresh date ideas/i);
    const pick = page.getByRole("button", { name: "Pick our date", exact: true });
    assert.equal(await pick.isDisabled(), false);
    const records = await events(scenario);
    const starts = records.filter((record) => record.event === "start");
    const summary = records.findLast((record) => record.event === "summary");
    assert.ok(summary, "Server returned one bounded provider summary");
    assert.equal(records.filter((record) => record.event === "summary").length, 1);
    const seasonalStarts = starts.filter((record) => record.group === "seasonal");
    assert.ok(seasonalStarts.length > 0);
    const offsets = seasonalStarts.map((record) => ({ mirror: record.mirror, offsetMs: record.atMs - seasonalStarts[0].atMs }));
    if (scenario === "second-mirror" || scenario === "third-mirror") {
      const winner = scenario === "second-mirror" ? 2 : 3;
      assert.deepEqual(seasonalStarts.map((record) => record.mirror), Array.from({ length: winner }, (_, i) => i + 1));
      assert.ok(offsets.at(-1).offsetMs >= (winner - 1) * 1500 - 200);
      assert.ok(offsets.at(-1).offsetMs < (winner - 1) * 1500 + 1500, "Hedge begins promptly before the old serial 8s attempt expires");
      assert.ok(summary.durationMs < 7000, "A slow first mirror does not consume the old 8s serial wait");
      assert.equal(records.filter((record) => record.event === "abort" && record.reason === "cancelled").length, winner - 1);
      assert.equal(summary.source, "merged");
      assert.equal(summary.partial, false);
      assert.match(body, /Live seasonal results included/);
      assert.doesNotMatch(body, /Live map unavailable|Some live searches are unavailable/);
      await pick.click();
      await page.getByText("Resilience Browser Harvest", { exact: true }).first().waitFor();
      await page.getByRole("button", { name: "Close result", exact: true }).click();
    } else if (scenario === "partial-groups") {
      assert.equal(summary.source, "merged");
      assert.equal(summary.partial, true);
      assert.equal(summary.successfulGroups, 1);
      assert.equal(summary.failedGroups, 1);
      assert.match(body, /Some live searches are unavailable/);
      assert.match(body, /Live seasonal results included/);
      assert.doesNotMatch(body, /Live map unavailable; using saved places/);
      assert.equal(starts.filter((record) => record.group === "outdoor").length, 4);
      await page.getByRole("button", { name: "Give us options", exact: true }).click();
      await page.getByText("Resilience Browser Harvest", { exact: true }).first().waitFor();
      await page.getByRole("button", { name: "Close options", exact: true }).click();
    } else {
      assert.equal(summary.source, "fallback");
      assert.equal(summary.requestedGroups, 4);
      assert.equal(summary.successfulGroups, 0);
      assert.equal(summary.failedGroups, 4);
      assert.equal(summary.partial, false);
      assert.equal(starts.length, 16);
      assert.equal(seasonalStarts.length, 4);
      assert.match(body, /Live map unavailable; using saved places/);
      assert.doesNotMatch(body, /Live seasonal results included/);
      assert.equal(records.filter((record) => record.event === "abort" && record.reason === "timeout").length, 16);
    }
    assert.ok(summary.durationMs < 20_000, "Provider settlement preserves its aggregate hard bound");
    assert.ok(visibleLoadingMs < 25_000, "Visible spinner preserves its watchdog bound");
    const countBefore = starts.length;
    const openNow = page.getByRole("switch", { name: "Open now only", exact: true });
    await openNow.click();
    await delay(150);
    assert.equal((await events(scenario)).filter((record) => record.event === "start").length, countBefore, "Open Now is local and must not refetch");
    await openNow.click();
    await delay(150);
    assert.equal((await events(scenario)).filter((record) => record.event === "start").length, countBefore);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.deepEqual(pageErrors, [], "No uncaught browser page errors");
    await page.screenshot({ path: resolve(output, `${scenario}.png`), fullPage: true });
    verdict.scenarios.push({ scenario, passed: true, visibleLoadingMs, providerDurationMs: summary.durationMs,
      source: summary.source, partial: summary.partial, attempts: starts.length, seasonalOffsets: offsets,
      noOpenNowRefetch: true, cancelledLosers: records.filter((record) => record.event === "abort" && record.reason === "cancelled").length });
    verdict.checks.push(`${scenario}: actual browser/RPC, bounded spinner, truthful source, expected provider timing/cancellation, local Open Now reuse, mobile layout`);
    await context.close();
  }
  verdict.passed = true;
} catch (error) {
  verdict.errors.push({ name: error.name, message: error.message });
  await currentPage?.screenshot({ path: resolve(output, "failure.png"), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser?.close();
  try {
    if (process.platform === "win32") server.kill("SIGTERM");
    else process.kill(-server.pid, "SIGTERM");
  } catch (error) {
    if (error.code !== "ESRCH") { verdict.errors.push({ name: "CleanupError", message: "Owned Preview cleanup failed" }); process.exitCode = 1; }
  }
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify({ output, ...verdict }, null, 2));
}
