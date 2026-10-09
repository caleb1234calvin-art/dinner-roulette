import { dateNightRpcEvidence } from "./test-support/hybrid-rpc-evidence.mjs";
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
const output = checkedOutputPath(process.env.DATE_NIGHT_RADIAL_OUTPUT ?? "/tmp/pfu-hybrid-browser", ["/tmp", resolve("audit")], "hybrid evidence");
await mkdir(output, { recursive: true });
const control = resolve(output, "control.json"), events = resolve(output, "events.jsonl");
await writeFile(events, "");
await writeFile(control, JSON.stringify({ scenario: "startup" }));
const origin = checkedUrl("http://127.0.0.1:8087");
const server = spawn(process.execPath, ["scripts/with-app-env.mjs", process.execPath, "--import", resolve("scripts/test-support/date-night-hybrid-preload.mjs"),
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
const scenarios = ["progressive-success", "middle-failure", "outermost-failure", "options-stable", "pick-stable", "plan-stable", "plan-no-pair", "future-pick",
  "radius-increase", "radius-decrease", "local-filters", "mobile-progress", "category-cancel", "location-cancel", "unmount-cancel", "primary-category-cancel", "primary-location-cancel", "all-stall"];
try {
  await waitFor(async () => { try { return (await fetch(origin)).ok; } catch { return false; } }, "Preview startup failed");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  for (const scenario of scenarios) {
    const held = ["options-stable", "pick-stable", "plan-stable", "future-pick", "radius-increase", "radius-decrease", "local-filters", "mobile-progress", "category-cancel", "location-cancel", "unmount-cancel"].includes(scenario);
    const state = { scenario, holdPatch: scenario.startsWith("primary-") ? "primary" : held ? "radial-v1:20:0" : undefined };
    await writeFile(control, JSON.stringify(state));
    const context = await browser.newContext({ viewport: { width: scenario === "mobile-progress" ? 320 : 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block" });
    await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const radiusMiles = scenario === "radius-increase" ? 15 : ["outermost-failure", "radius-decrease", "all-stall"].includes(scenario) ? 50 : 20;
    await context.addInitScript(({ radiusMiles, scenario, fixtureOrigin }) => {
      // Fixture setup belongs only to our application origin, never opaque about:blank.
      if (location.origin !== fixtureOrigin || sessionStorage.getItem("hybrid-fixture-seeded")) return;
      sessionStorage.setItem("hybrid-fixture-seeded", "1");
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        location: { lat: 37.176447, lon: -94.310223, label: "Carthage, Missouri", source: "manual" },
        homeMode: "date-night", spookySeasonEnabled: true,
        dateNightFilters: { radiusMiles, activityTypes: ["all-stall", "plan-stable"].includes(scenario) ? ["anything"] : ["movies"], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: false },
      } }));
    }, { radiusMiles, scenario, fixtureOrigin: origin });
    const page = await context.newPage(); currentPage = page;
    const pageErrors = [], rpcRequests = [], cancelled = [];
    page.on("pageerror", e => pageErrors.push({ name: e.name, message: e.message, stack: e.stack, url: page.url() }));
    page.on("request", r => { if (r.url().includes("/_serverFn/") && r.postData()?.includes("activityTypes")) rpcRequests.push(r); });
    page.on("requestfailed", r => { if (rpcRequests.includes(r)) cancelled.push(r.url()); });
    const navigationStarted = Date.now();
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.getByText("Finding date ideas near you…", { exact: true }).waitFor({ state: "hidden", timeout: 27000 });
    const pick = page.getByRole("button", { name: "Pick our date", exact: true });
    await waitFor(async () => await pick.count() && !(await pick.isDisabled()), "Core did not become usable");
    const progress = page.locator("[data-radial-progress]");
    await progress.waitFor();
    const coreMs = Date.now();
    const coreText = await progress.innerText();
    assert.match(coreText, /Ready/);
    const readyMs = Date.now() - navigationStarted;
    assert.equal(await page.getByRole("button", { name: "Give us options", exact: true }).isDisabled(), false);
    assert.equal(await page.getByRole("button", { name: "Plan the night", exact: true }).isDisabled(), false);
    if (scenario === "progressive-success") {
      await waitFor(async () => (await progress.innerText()) === "Ready · background coverage checked", "Full20 did not complete");
      assert.ok(Date.now() > coreMs + 1000);
    } else if (scenario === "middle-failure" || scenario === "outermost-failure") {

      await waitFor(async () => (await progress.innerText()) === "Ready · some background coverage checks are unavailable", "Failed outer area lost inner completeness", 60000);
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
    } else if (scenario === "plan-no-pair") {
      await page.getByRole("button", { name: "Plan the night", exact: true }).click();
      await page.getByRole("heading", { name: "No complete seasonal pair yet.", exact: true }).waitFor();
      assert.equal(await page.locator(".fixed.inset-0.z-50 h3").count(), 0, "Movies-only must not fabricate thrill/settle stops");
      await page.getByRole("button", { name: "Close night plan", exact: true }).click();
    } else if (scenario === "pick-stable" || scenario === "plan-stable") {
      const planMode = scenario === "plan-stable";
      await page.getByRole("button", { name: planMode ? "Plan the night" : "Pick our date", exact: true }).click();
      const heading = page.locator(planMode ? ".fixed.inset-0.z-50 h3" : ".result-in h2");
      await heading.first().waitFor();
      const before = await heading.allTextContents();
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === "radial-v1:20:0"), "Held audit did not begin");
      await writeFile(control, JSON.stringify({ scenario }));
      await waitFor(async () => (await records(scenario)).some(r => r.event === "response" && r.patchId === "radial-v1:20:0"), "Audit did not resolve");
      await delay(200);
      assert.deepEqual(await heading.allTextContents(), before, "Already-open decision must remain stable");
    } else if (scenario === "radius-increase" || scenario === "radius-decrease") {
      const slider = page.getByRole("slider", { name: "Travel distance", exact: true });
      if (scenario === "radius-increase") { await slider.focus(); await slider.press("End"); }
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === "radial-v1:20:0"), "Outer work not scheduled");
      const count = rpcRequests.length;
      const primaryCount = rpcRequests.filter(r => dateNightRpcEvidence(r.postData()).kind === "primary").length;
      const radiusStarted = Date.now();
      await slider.focus(); await slider.press("Home");
      await waitFor(async () => (await progress.innerText()).startsWith("Ready"), "Shrink did not reuse core");
      await delay(250);
      assert.ok(rpcRequests.length >= count);
      assert.equal(rpcRequests.filter(r => dateNightRpcEvidence(r.postData()).kind === "primary").length, primaryCount, "Covered decrease must not launch primary refetch");
      assert.ok(Date.now() - radiusStarted < 1500, "Covered radius decrease is local and promptly usable");
      assert.ok(cancelled.length >= 1, "Obsolete outer transport must abort");
      assert.equal(await pick.isDisabled(), false);
    } else if (scenario === "local-filters") {
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === "radial-v1:20:0"), "Outer work not scheduled");
      const count = rpcRequests.length;
      for (const label of ["Open now only", "Favorites only", "Fewer parks"]) {
        const toggle = page.getByRole("switch", { name: label, exact: true }); await toggle.click(); await toggle.click();
      }
      const mood = page.getByRole("slider", { name: "Cozy to adventurous", exact: true }); await mood.focus(); await mood.press("End");
      assert.equal(rpcRequests.length, count);
      assert.equal(cancelled.length, 0);
    } else if (["category-cancel", "location-cancel", "unmount-cancel", "primary-category-cancel", "primary-location-cancel"].includes(scenario)) {
      const cancellationTarget = scenario.startsWith("primary-") ? "primary" : "radial-v1:20:0";
      await waitFor(async () => (await records(scenario)).some(r => r.event === "start" && r.patchId === cancellationTarget), "Provider request must be pending before cancellation");
      const heldStart = (await records(scenario)).find(r => r.event === "start" && r.patchId === cancellationTarget);
      if (scenario.endsWith("category-cancel")) {
        await page.getByRole("button", { name: "Museum", exact: true }).click();
      } else if (scenario.endsWith("location-cancel")) {
        await page.evaluate(() => { window.__sameMountedDocument = "preserved"; });
        const section = page.getByRole("region", { name: "Search location" });
        await section.getByRole("button", { name: "Change location", exact: true }).click();
        await page.getByRole("textbox", { name: "City, region and country, or postal code", exact: true }).fill("Columbia, Missouri, United States");
        await page.getByRole("button", { name: "Set location", exact: true }).click();
      } else {
        await page.goto("about:blank");
      }
      await waitFor(async () => (await records(scenario)).some(r => r.event === "abort" && r.patchId === cancellationTarget && r.lat === heldStart.lat && r.lon === heldStart.lon), "Obsolete upstream provider work must abort");
      if (scenario.endsWith("location-cancel")) {
        await waitFor(async () => (await records(scenario)).some(r => r.event === "response" && r.patchId === "primary" && r.lat === 38.9517 && r.lon === -92.3341), "New Columbia primary must complete");
        assert.equal(await page.evaluate(() => window.__sameMountedDocument), "preserved", "Normal location change must not reload");
        const location = await page.evaluate(() => JSON.parse(localStorage.getItem("pick-for-us-v1")).state.location);
        assert.equal(location.lat, 38.9517); assert.equal(location.lon, -92.3341);
        await page.getByRole("button", { name: "Give us options", exact: true }).click();
        await waitFor(async () => (await page.locator("article h3").allTextContents()).some(n => n.startsWith("Columbia replacement cinema")), "New-origin venue must be selectable");
        const before = await page.locator("article h3").allTextContents();
        assert.ok(before.every(n => !n.startsWith("Radial nearby") && !n.startsWith("Radial outer")));
        await writeFile(control, JSON.stringify({ scenario })); await delay(300);
        assert.deepEqual(await page.locator("article h3").allTextContents(), before, "Late old-origin work cannot replace open decision");
        await page.getByRole("button", { name: "Close options", exact: true }).click();
      }
      await writeFile(control, JSON.stringify({ scenario }));
      if (scenario === "unmount-cancel") await page.goto(origin, { waitUntil: "domcontentloaded" });
      await waitFor(async () => await page.locator("[data-radial-progress]").count() > 0, "Replacement session settles");
    } else if (scenario === "all-stall") {
      await waitFor(async () => /Live map unavailable|Live discovery is temporarily unavailable/.test(await page.locator("body").innerText()), "Provider timeout qualification absent", 27000);
      assert.doesNotMatch(await progress.innerText(), /Loaded through/);
      assert.match(await page.locator("body").innerText(), /Live map unavailable|Live discovery is temporarily unavailable/);
      assert.ok((await records(scenario)).filter(r => r.event === "start").length > 0);
      assert.equal(await pick.isDisabled(), false, "curated pool stays usable during provider stall");
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "No horizontal mobile overflow");
    assert.equal(await page.locator(".vite-error-overlay, [data-nextjs-dialog]").count(), 0);
    assert.deepEqual(pageErrors, []);
    assert.doesNotMatch(await page.locator("body").innerText(), /Radial permanently closed fixture/);
    await page.screenshot({ path: resolve(output, `${scenario}.png`), fullPage: true });
    const eventRows = await records(scenario);
    const starts = eventRows.filter(r => r.event === "start");
    const responses = eventRows.filter(r => r.event === "response");
    verdict.scenarios.push({ scenario, passed: true, providerRequests: starts.length, providerFailures: eventRows.filter(r => r.event === "http-error").length, providerAborts: eventRows.filter(r => r.event === "abort").length, firstProviderResponseMs: responses[0] ? responses[0].at - navigationStarted : null, finalProviderResponseMs: responses.at(-1) ? responses.at(-1).at - navigationStarted : null, rpcRequests: rpcRequests.length, cancelledTransports: cancelled.length,
      readyMs, initialProgress: coreText, finalProgress: await progress.innerText(), pageErrors, horizontalOverflow: false });
    console.log(`HYBRID_BROWSER_PASS ${scenario}`);
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
