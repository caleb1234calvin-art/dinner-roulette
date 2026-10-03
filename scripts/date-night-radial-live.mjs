// Exact Preview only, after deterministic/build/controlled gates. At most three
// public patch RPCs (48 theoretical physical attempts); never a giant disk.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { runWithStartContext } from "@tanstack/start-storage-context";
import { serverFnFetcher } from "../node_modules/@tanstack/start-client-core/dist/esm/client-rpc/serverFnFetcher.js";
import { checkedOutputPath, checkedUrl } from "./browser-guard.mjs";
import { assertBrowserBuild } from "./browser-build-proof.mjs";

const target = checkedUrl(process.argv[2] ?? ""), host = new URL(target);
assert.ok(host.hostname.endsWith(".vercel.app") && !host.hostname.includes("git-main") && !host.hostname.endsWith("dinner-roulette-chi.vercel.app"));
assert.equal(host.username + host.password, "");
assert.equal(process.env.PFU_RADIAL_PREVIEW_VERIFIED, "1", "Verify exact READY non-production deployment identity before invoking");
const output = checkedOutputPath(process.argv[3] ?? "/tmp/pfu-radial-live", ["/tmp", resolve("audit")], "radial live evidence");
mkdirSync(output, { recursive: true });
const proof = assertBrowserBuild();
const manifest = readFileSync(".vercel/output/functions/__server.func/_ssr/ssr.mjs", "utf8");
const id = [...manifest.matchAll(/"([a-f0-9]{64})": \{\s*functionName: "([^"]+)"/g)].find(m => m[2] === "searchDateNight_createServerFn_handler")?.[1];
assert.ok(id);
const allowed = ["radial-v1:core", "radial-v1:20:0", "radial-v1:20:1"];
const events = [], errors = [], pageErrors = [], decodes = new Set();
let forwarded = 0, blocked = 0, allowNext = false, browser, page;
let releaseCore;
const coreGate = new Promise(resolveGate => { releaseCore = resolveGate; });
const verdict = { passed: false, proof, publicRpcCap: 3, theoreticalPhysicalAttemptCap: 48,
  productUsability: false, completeMaximumCoverage: false,
  partialCoverageMeaning: "Live traffic deliberately capped. Blocked outer transport failures are controlled, not observed provider failures.",
  events, errors, pageErrors };
async function decode(response, event) {
  try {
    const bytes = await response.body(), headers = response.headers();
    const codec = Object.fromEntries(["content-type", "x-tss-serialized", "x-tss-raw"].filter(k => headers[k]).map(k => [k, headers[k]]));
    const decoded = await runWithStartContext({ startOptions: {} }, () => serverFnFetcher(response.url(), [{ method: "POST", data: {} }],
      async () => new Response(bytes, { status: response.status(), headers: codec })));
    if (decoded instanceof Response || decoded.error) throw new Error("RPC error");
    const result = decoded.result;
    event.patch = result.patch;
    event.source = result.source;
    event.groups = result.discovery?.groups;
    event.venues = result.venues.length;
    event.liveVenues = result.venues.filter(p => p.source === "osm" || p.discoveryEvidence?.some(e => e.source === "osm")).length;
    event.lifecycleVenues = result.venues.filter(p => p.lifecycle).length;
    event.success = result.discovery?.groups.every(g => ["succeeded-empty", "succeeded-nonempty"].includes(g.outcome));
    event.elapsedMs = Date.now() - event.startedAt;
    delete event.startedAt;
  } catch { event.success = false; event.decodeError = true; }
}
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", serviceWorkers: "block",
    ignoreHTTPSErrors: process.env.PFU_BROWSER_IGNORE_HTTPS_ERRORS === "1" });
  await context.route("**/*", async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin !== host.origin) return route.abort();
    if (!url.pathname.includes("/_serverFn/")) return route.continue();
    if (url.pathname !== `/_serverFn/${id}`) return route.abort();
    if (forwarded > 0 && !allowNext) await coreGate;
    if (forwarded >= allowed.length || forwarded > 0 && !allowNext) { blocked++; return route.abort(); }
    const patch = allowed[forwarded];
    if (!request.postData()?.includes(patch)) { errors.push({ message: "Unexpected patch sequence blocked" }); return route.abort(); }
    const event = { patchId: patch, startedAt: Date.now() };
    events.push(event); forwarded++;
    return route.continue();
  });
  await context.addInitScript(() => {
    sessionStorage.setItem("dinner-roulette-hint-seen", "1");
    localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
      location: { lat: 37.176447, lon: -94.310223, label: "Carthage, Missouri", source: "manual" },
      homeMode: "date-night", spookySeasonEnabled: true,
      dateNightFilters: { radiusMiles: 50, activityTypes: ["anything"], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: true },
    } }));
  });
  page = await context.newPage();
  page.on("pageerror", e => pageErrors.push(e.name));
  page.on("response", response => {
    if (!response.url().endsWith(`/_serverFn/${id}`)) return;
    const event = events.find(e => response.request().postData()?.includes(e.patchId));
    if (!event) return;
    const pending = decode(response, event);
    decodes.add(pending); pending.finally(() => decodes.delete(pending));
  });
  const startedAt = Date.now();
  await page.goto(target, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("[data-radial-progress]")?.textContent?.includes("Loaded through 15 miles") || /timed out|Live map unavailable|couldn't refresh/.test(document.body.innerText), undefined, { timeout: 28000 });
  await Promise.allSettled([...decodes]);
  assert.equal(events[0]?.success, true, "Core must succeed before any further public request");
  const pick = page.getByRole("button", { name: "Pick our date", exact: true });
  assert.equal(await pick.isDisabled(), false);
  verdict.coreUsableMs = Date.now() - startedAt;
  verdict.initialProgress = await page.locator("[data-radial-progress]").innerText();
  verdict.coreEligibleCount = Number((await page.locator("body").innerText()).match(/(\d+) activities match/)?.[1]);
  // Open the bound for the next two scheduled patches only after core acceptance.
  allowNext = true;
  releaseCore();
  await page.waitForFunction(() => document.querySelector("[data-radial-progress]")?.textContent?.includes("could not be loaded"), undefined, { timeout: 65000 });
  await Promise.allSettled([...decodes]);
  const outerEvents = events.slice(1, 3);
  assert.equal(outerEvents.length, 2, "Both permitted outer patches must be observed");
  assert.ok(outerEvents.every(event => event.success), "Both permitted outer patches must complete successfully");
  verdict.outerReturnedVenues = outerEvents.reduce((sum, event) => sum + (event.venues ?? 0), 0);
  verdict.outerReturnedLiveVenues = outerEvents.reduce((sum, event) => sum + (event.liveVenues ?? 0), 0);
  verdict.outerMergeObserved = verdict.outerReturnedVenues > 0;
  assert.equal(await pick.isDisabled(), false, "Blocked/failed outer work must preserve core usability");
  verdict.finalProgress = await page.locator("[data-radial-progress]").innerText();
  assert.match(verdict.finalProgress, /Loaded through 15 miles/);
  assert.doesNotMatch(verdict.finalProgress, /Loaded through 50/);
  verdict.finalEligibleCount = Number((await page.locator("body").innerText()).match(/(\d+) activities match/)?.[1]);
  if (verdict.outerMergeObserved) {
    assert.ok(verdict.finalEligibleCount > verdict.coreEligibleCount, "Visible pool must gain outer venues when accepted outer patches return venues");
  } else {
    assert.equal(verdict.finalEligibleCount, verdict.coreEligibleCount, "Successful zero-venue outer patches must preserve the usable core pool");
  }
  const before = forwarded + blocked;
  for (const label of ["Open now only", "Favorites only", "Fewer parks"]) {
    const toggle = page.getByRole("switch", { name: label, exact: true }); await toggle.click(); await toggle.click();
  }
  const mood = page.getByRole("slider", { name: "Cozy to adventurous", exact: true }); await mood.focus(); await mood.press("End");
  assert.equal(forwarded + blocked, before);
  assert.deepEqual(pageErrors, []);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  verdict.noLocalFilterRefetch = true;
  verdict.productUsability = true;
  verdict.passed = errors.length === 0;
  await page.screenshot({ path: resolve(output, "partial-radial.png"), fullPage: true, mask: [page.getByRole("region", { name: "Search location" })] });
} catch (error) {
  errors.push({ name: error.name, message: error.message }); process.exitCode = 1;
  await page?.screenshot({ path: resolve(output, "failure.png"), fullPage: true }).catch(() => {});
} finally {
  releaseCore();
  await browser?.close();
  verdict.forwardedPublicRpcs = forwarded; verdict.blockedOuterRpcs = blocked;
  writeFileSync(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify(verdict));
}
