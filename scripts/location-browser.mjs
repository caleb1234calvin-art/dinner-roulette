import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

// Runs the real app, RPC transport and native browser geolocation with synthetic
// coordinates/permissions and deterministic provider responses. No production URL.
const output =
  process.env.LOCATION_BROWSER_OUTPUT ??
  (await mkdtemp(resolve(tmpdir(), "pick-for-me-location-")));
await mkdir(output, { recursive: true });
const requestLog = resolve(output, "requests.jsonl");
await writeFile(requestLog, "");
const useBuiltPreview = process.env.CI === "true" || process.env.LOCATION_BROWSER_PREVIEW === "1";
const server = spawn(
  process.execPath,
  [
    "--import",
    resolve("scripts/test-support/location-provider-fixtures.mjs"),
    "node_modules/vite/bin/vite.js",
    useBuiltPreview ? "preview" : "dev",
    "--host",
    "127.0.0.1",
    "--port",
    "8080",
  ],
  {
    env: { ...process.env, DATABASE_URL: "", LOCATION_BROWSER_REQUEST_LOG: requestLog },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let serverLog = "";
server.stdout.on("data", (data) => (serverLog += data));
server.stderr.on("data", (data) => (serverLog += data));
const results = [];
let browser;
async function waitFor(check, message, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await check()) return;
    await delay(100);
  }
  throw new Error(message);
}
const inputName = "City, region and country, or postal code";
try {
  await waitFor(async () => {
    try {
      return (await fetch("http://127.0.0.1:8080")).ok;
    } catch {
      return false;
    }
  }, "Local test server did not start");
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    geolocation: { latitude: 43.65348, longitude: -79.38393 },
    permissions: ["geolocation"],
    reducedMotion: "reduce",
  });
  await context.route("**/_vercel/insights/**", (route) =>
    route.fulfill({ status: 200, body: "" }),
  );
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort());
  await context.addInitScript(() => {
    window.__locationCalls = 0;
    const original = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
    navigator.geolocation.getCurrentPosition = (...args) => {
      window.__locationCalls++;
      return original(...args);
    };
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("http://127.0.0.1:8080", { waitUntil: "domcontentloaded" });
  // A dev connection or an external font must not define app readiness.
  await page.waitForFunction(() =>
    Object.keys(document.querySelector('[aria-label="Use my location"]') ?? {}).some((key) =>
      key.startsWith("__reactProps"),
    ),
  );
  await page.getByRole("button", { name: "Close hints", exact: true }).click();
  const section = page.getByRole("region", { name: "Search location" });
  await section.getByRole("button", { name: "Use my location", exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.__locationCalls), 0);
  results.push("No geolocation access on initial load");
  await section.getByRole("button", { name: "Use my location", exact: true }).click();
  await waitFor(
    () => section.getByText("Toronto, Ontario, Canada", { exact: true }).isVisible(),
    "GPS did not set Toronto",
  );
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state);
  const acquired = await state();
  assert.equal(acquired.location.source, "geo");
  assert.equal(acquired.location.countryCode, "CA");
  assert.equal(acquired.location.lat, 43.65348);
  assert.equal(await page.evaluate(() => window.__locationCalls), 1);
  results.push(
    "Native Chromium geolocation with granted permission sets and persists simulated Toronto coordinates",
  );
  await page.getByRole("button", { name: "Pick for us", exact: true }).click();
  const directions = page.getByRole("link", { name: /Directions.*Google Maps/ });
  await directions.waitFor();
  assert.equal(
    new URL(await directions.getAttribute("href")).searchParams.get("destination"),
    "43.65348,-79.38393",
  );
  assert.ok(await page.getByText("Toronto test restaurant", { exact: true }).first().isVisible());
  await page.getByRole("button", { name: "Close result" }).click();
  results.push("GPS coordinates reach restaurant discovery and exact Google Maps destination");
  async function manual(label) {
    await section.getByRole("button", { name: "Change location" }).click();
    await page.getByRole("textbox", { name: inputName }).fill(label);
    await page.getByRole("button", { name: "Set location", exact: true }).click();
    await waitFor(
      () => section.getByText(label, { exact: true }).isVisible(),
      `Manual location did not set ${label}`,
    );
  }
  await manual("Vancouver, British Columbia, Canada");
  const manualState = await state();
  assert.equal(manualState.location.source, "manual");
  assert.equal(manualState.location.region, "British Columbia");
  assert.deepEqual(manualState.filters, acquired.filters);
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal((await state()).location.countryCode, "CA");
  assert.equal(await page.evaluate(() => window.__locationCalls), 0);
  await section.getByText("Vancouver, British Columbia, Canada", { exact: true }).waitFor();
  results.push(
    "Manual international choice overrides GPS, preserves filters and survives reload without GPS access",
  );
  await page.getByRole("button", { name: "Nightlife", exact: true }).click();
  await section.getByText("Vancouver, British Columbia, Canada", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Date Night", exact: true }).click();
  await section.getByText("Vancouver, British Columbia, Canada", { exact: true }).waitFor();
  await manual("London, England, United Kingdom");
  results.push(
    "Location is shared across Dinner, Nightlife/casino and Date Night; manual U.K. choice works",
  );
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.screenshot({ path: resolve(output, "mobile-location.png"), fullPage: true });
  results.push("390px mobile layout fits without horizontal overflow");
  await section.getByRole("button", { name: "Change location" }).click();
  await page.getByRole("textbox", { name: inputName }).fill("Invalid location fixture");
  await page.getByRole("button", { name: "Set location", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: /Couldn't find/ })
    .waitFor();
  assert.equal((await state()).location.countryCode, "GB");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  results.push(
    "No-result feedback leaves the last valid location active and manual entry available",
  );
  for (const [code, expected] of [
    [1, /permission was denied/],
    [2, /location is unavailable/],
    [3, /timed out/],
  ]) {
    await page.evaluate((code) => {
      navigator.geolocation.getCurrentPosition = (_success, failure) => failure({ code });
    }, code);
    await section.getByRole("button", { name: "Use my location", exact: true }).click();
    await section.getByRole("alert").filter({ hasText: expected }).waitFor();
    assert.equal((await state()).location.countryCode, "GB");
  }
  results.push(
    "Simulated permission denied, unavailable and timeout errors are visible with the manual form closed",
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
  });
  await section.getByRole("button", { name: "Use my location", exact: true }).click();
  await section
    .getByRole("alert")
    .filter({ hasText: /isn't available in this browser/ })
    .waitFor();
  await manual("Montréal, Québec, Canada");
  results.push("Unsupported geolocation still permits manual Montréal entry");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) => {
          window.__latePosition = success;
        },
      },
    });
  });
  await section.getByRole("button", { name: "Use my location", exact: true }).click();
  await manual("Toronto, Ontario, Canada");
  await page.evaluate(() =>
    window.__latePosition({ coords: { latitude: 49.26087, longitude: -123.11395 } }),
  );
  await delay(150);
  assert.equal((await state()).location.locality, "Toronto");
  assert.equal((await state()).location.source, "manual");
  results.push("Late browser position callback cannot replace a newer manual choice");
  assert.deepEqual(pageErrors, []);
  results.push("No uncaught browser page errors");
  const requests = (await readFile(requestLog, "utf8"))
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  assert.ok(
    requests.some(
      (row) => row.kind === "discovery" && row.category === "restaurant" && row.lat === 43.65348,
    ),
  );
  assert.ok(
    requests.some(
      (row) => row.kind === "discovery" && row.category === "casino" && row.lat === 49.26087,
    ),
  );
  assert.ok(
    requests.some(
      (row) => row.kind === "discovery" && row.category === "museum" && row.lat === 49.26087,
    ),
  );
  results.push(
    "Actual server requests use the selected coordinates for all three discovery categories",
  );
  await page.screenshot({ path: resolve(output, "mobile-toronto.png"), fullPage: true });
  await context.close();
  await writeFile(
    resolve(output, "result.json"),
    JSON.stringify(
      {
        testedAt: new Date().toISOString(),
        browser: "Chromium",
        mode: "Real local app/RPC; simulated native geolocation coordinates and provider fixtures; error callbacks explicitly mocked",
        serverMode: useBuiltPreview ? "built preview" : "development",
        passed: true,
        checks: results,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ output, passed: true, checks: results }, null, 2));
} catch (error) {
  await writeFile(
    resolve(output, "result.json"),
    JSON.stringify({ passed: false, checks: results, error: error.stack }, null, 2),
  );
  if (browser) {
    const current = browser
      .contexts()
      .flatMap((context) => context.pages())
      .at(-1);
    if (current) {
      await current
        .screenshot({ path: resolve(output, "failure.png"), fullPage: true })
        .catch(() => {});
      await writeFile(
        resolve(output, "failure.html"),
        await current.content().catch(() => "Page unavailable"),
      );
    }
  }
  console.error(serverLog);
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await writeFile(resolve(output, "server.log"), serverLog);
}
