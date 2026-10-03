import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
import { checkedOutputPath, checkedUrl } from "./browser-guard.mjs";

assert.equal(process.env.CI, "true");
const proof = assertBrowserBuild();
const output = checkedOutputPath(process.env.DATE_NIGHT_RADIAL_OUTPUT ?? "/tmp/pfu-radial-browser", ["/tmp", resolve("audit")], "radial evidence");
await mkdir(output, { recursive: true });
const control = resolve(output, "control.json"), events = resolve(output, "events.jsonl");
await writeFile(events, "");
await writeFile(control, JSON.stringify({ scenario: "startup" }));
const origin = checkedUrl("http://127.0.0.1:8087");
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath, "--import", resolve("scripts/test-support/date-night-radial-preload.mjs"),
  "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "8087", "--strictPort"], {
  env: { ...process.env, DATABASE_URL: "", DATE_NIGHT_RADIAL_BROWSER: "1", DATE_NIGHT_RADIAL_CONTROL: control, DATE_NIGHT_RADIAL_EVENTS: events },
  detached: true, stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "", browser, currentPage;
server.stdout.on("data", d => { serverLog = (serverLog + d).slice(-100000); });
server.stderr.on("data", d => { serverLog = (serverLog + d).slice(-100000); });
const verdict = { passed: false, proof, publicProviderCalls: 0, scenarios: [], errors: [] };
const records = async scenario => (await readFile(events, "utf8")).split("\n").filter(Boolean).map(JSON.parse).filter(r => r.scenario === scenario);
const waitFor = async (fn, label, timeout = 25000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) { if (await fn()) return; await delay(50); }
  throw new Error(label);
};
const scenarios = ["progressive-success", "middle-failure", "outermost-failure", "options-stable", "future-pick",
  "radius-increase", "radius-decrease", "local-filters", "mobile-progress", "all-stall"];
try {
  await waitFor(async () => { try { return (await fetch(origin)).ok; } catch { return false; } }, "Preview startup failed");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  for (const scenario of scenarios) {
    const held = ["options-stable", "future-pick", "radius-increase", "radius-decrease", "local-filters", "mobile-progress"].includes(scenario);
    const state = { scenario, holdPatch: held ? "radial-v1:20:0" : undefined };
    await writeFile(control, JSON.stringify(state));
    const context = await browser.newContext({ viewport: { width: scenario === "mobile-progress" ? 320 : 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
    await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const radiusMiles = scenario === "radius-increase" ? 15 : ["outermost-failure", "radius-decrease", "all-stall"].includes(scenario) ? 50 : 20;
    await context.addInitScript(({ radiusMiles, scenario }) => {
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        location: { lat: 37.176447, lon: -94.310223, label: "Carthage, Missouri", source: "manual" },
        homeMode: "date-night", spookySeasonEnabled: true,
        dateNightFilters: { radiusMiles, activityTypes: scenario === "all-stall" ? ["anything"] : ["movies"], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: false },
      } }));
    }, { radiusMiles, scenario });
    const page = await context.newPage(); currentPage = page;
    const pageErrors = [], rpcRequests = [], cancelled = [];
    page.on("pageerror", e => pageErrors.push(e.name));
    page.on("request", r => { if (r.url().includes("/_serverFn/") && r.postData()?.includes("patchId")) rpcRequests.push(r); });
    page.on("requestfailed", r => { if (rpcRequests.includes(r)) cancelled.push(r.url()); });
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.getByText("Finding date ideas near you…", { exact: true }).waitFor({ state: "hidden", timeout: 27000 });
    const pick = page.getByRole("button", { name: "Pick our date", exact: true });
    await waitFor(async () => await pick.count() && !(await pick.isDisabled()), "Core did not become usable");
    const progress = page.locator("[data-radial-progress]");
    await progress.waitFor();
    const coreMs = Date.now();
    const coreText = await progress.innerText();
    if (scenario !== "all-stall") assert.match(coreText, /Loaded through 15 miles/);
    assert.equal(await page.getByRole("button", { name: "Give us options", exact: true }).isDisabled(), false);
    assert.equal(await page.getByRole("button", { name: "Plan the night", exact: true }).isDisabled(), false);
    if (scenario === "progressive-success") {
      await waitFor(async () => (await progress.innerText()) === "Loaded through 20 miles", "Full20 did not complete");
      assert.ok(Date.now() > coreMs + 1000);
    } else if (scenario === "middle-failure" || scenario === "outermost-failure") {
      const expected = scenario === "middle-failure" ? 15 : 40;
      await waitFor(async () => (await progress.innerText()) === `Loaded through ${expected} miles · some outer areas could not be loaded`, "Failed outer area lost inner completeness", 60000);
      assert.equal(await pick.isDisabled(), false);
    } else if (scenario === "options-stable" || scenario === "future-pick") {
      await page.getByRole("button", { name: "Give us options", exact: true }).click();
      const options = page.locator("article h3");
      await options.first().waitFor();
      const before = await options.allTextContents();
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === "radial-v1:20:0"), "Outer patch not started");
      await writeFile(control, JSON.stringify({ scenario }));
      await waitFor(async () => (await records(scenario)).some(r => r.event === "response" && r.patchId === "radial-v1:20:0"), "Outer patch not completed");
      await delay(200);
      assert.deepEqual(await options.allTextContents(), before);
      if (scenario === "future-pick") {
        await page.evaluate(() => { Math.random = () => 0.9999999; });
        await page.getByRole("button", { name: "Shuffle options", exact: true }).click();
        await waitFor(async () => (await options.allTextContents()).some(name => name.includes("Radial outer cinema")), "New venue absent from future selection");
      }
      await page.getByRole("button", { name: "Close options", exact: true }).click();
    } else if (scenario === "radius-increase" || scenario === "radius-decrease") {
      const slider = page.getByRole("slider", { name: "Travel distance", exact: true });
      if (scenario === "radius-increase") { await slider.focus(); await slider.press("End"); }
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === "radial-v1:20:0"), "Outer work not scheduled");
      const count = rpcRequests.length;
      await slider.focus(); await slider.press("Home");
      await waitFor(async () => (await progress.innerText()) === "Loaded through 1 miles", "Shrink did not reuse core");
      await delay(250);
      assert.equal(rpcRequests.length, count);
      assert.ok(cancelled.length >= 1, "Obsolete outer transport must abort");
      assert.equal((await records(scenario)).filter(r => r.event === "start" && r.patchId === "radial-v1:core").length, 1);
    } else if (scenario === "local-filters") {
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === "radial-v1:20:0"), "Outer work not scheduled");
      const count = rpcRequests.length;
      for (const label of ["Open now only", "Favorites only", "Fewer parks"]) {
        const toggle = page.getByRole("switch", { name: label, exact: true }); await toggle.click(); await toggle.click();
      }
      const mood = page.getByRole("slider", { name: "Cozy to adventurous", exact: true }); await mood.focus(); await mood.press("End");
      assert.equal(rpcRequests.length, count);
      assert.equal(cancelled.length, 0);
    } else if (scenario === "all-stall") {
      assert.doesNotMatch(await progress.innerText(), /Loaded through/);
      assert.match(await page.locator("body").innerText(), /Live map unavailable|Live discovery is temporarily unavailable/);
      assert.equal((await records(scenario)).filter(r => r.event === "start").length, 16);
      assert.equal(rpcRequests.length, 1);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "No horizontal mobile overflow");
    assert.equal(await page.locator(".vite-error-overlay, [data-nextjs-dialog]").count(), 0);
    assert.deepEqual(pageErrors, []);
    assert.doesNotMatch(await page.locator("body").innerText(), /Radial permanently closed fixture/);
    await page.screenshot({ path: resolve(output, `${scenario}.png`), fullPage: true });
    verdict.scenarios.push({ scenario, passed: true, rpcRequests: rpcRequests.length, cancelledTransports: cancelled.length,
      initialProgress: coreText, finalProgress: await progress.innerText(), pageErrors, horizontalOverflow: false });
    console.log(`RADIAL_BROWSER_PASS ${scenario}`);
    await context.close();
    // Release any fixture whose transport disconnect is not propagated by host.
    await writeFile(control, JSON.stringify({ scenario: "between-scenarios" }));
    await delay(100);
  }
  verdict.passed = true;
} catch (error) {
  verdict.errors.push({ name: error.name, message: error.message });
  await currentPage?.screenshot({ path: resolve(output, "failure.png"), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser?.close();
  try { process.kill(-server.pid, "SIGTERM"); } catch (e) {
    if (e.code !== "ESRCH") { verdict.errors.push({ name: "CleanupError", message: "Owned preview cleanup failed" }); process.exitCode = 1; }
  }
  await writeFile(resolve(output, "server.log"), serverLog);
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify(verdict));
}
