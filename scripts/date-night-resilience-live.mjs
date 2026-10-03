// Real Preview acceptance. Run only after deterministic gates, a fresh safe
// production build, and independent confirmation that the URL is a Preview.
// Usage: VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1 node
// scripts/date-night-resilience-live.mjs <preview-url> [output-directory]
// A low-load pilot can set PFU_LIVE_RADII=15 PFU_LIVE_SELECTIONS=anything.
// Pilot verdicts explicitly identify their smaller matrix; they are not full acceptance.
// Captured RPC bytes are decoded in memory; the decoder never sends a request.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { runWithStartContext } from "@tanstack/start-storage-context";
import { serverFnFetcher } from "../node_modules/@tanstack/start-client-core/dist/esm/client-rpc/serverFnFetcher.js";
import { checkedOutputPath, checkedUrl } from "./browser-guard.mjs";
import { assertBrowserBuild } from "./browser-build-proof.mjs";

const target = checkedUrl(process.argv[2] ?? "");
const targetUrl = new URL(target);
const productionHost = new URL(JSON.parse(readFileSync("capacitor.config.json", "utf8")).server.url).hostname;
assert.notEqual(targetUrl.hostname, productionHost, "Production browsing is not authorized by this acceptance script");
assert.equal(targetUrl.username + targetUrl.password, "", "Credentials must not be embedded in the Preview URL");
const output = checkedOutputPath(process.argv[3] ?? "audit/browser-results/date-night-resilience-live",
  [resolve("audit/browser-results"), "/tmp"], "acceptance output");
const buildProof = assertBrowserBuild();
// Disposable browser only: some verification containers terminate HTTPS through
// a CA that Chromium does not trust. Never change application/platform TLS.
const ignoreHTTPSErrors = process.env.PFU_BROWSER_IGNORE_HTTPS_ERRORS === "1";
const manifest = readFileSync(".vercel/output/functions/__server.func/_ssr/ssr.mjs", "utf8");
const rpcId = [...manifest.matchAll(/"([a-f0-9]{64})": \{\s*functionName: "([^"]+)"/g)]
  .find((match) => match[2] === "searchDateNight_createServerFn_handler")?.[1];
assert.ok(rpcId, "Fresh build must identify the Date Night RPC");
const rpcPath = `/_serverFn/${rpcId}`;
const MAX_RPC_REQUESTS = 24;
const selectionById = {
  anything: ["anything"],
  "haunted-house": ["haunted-house"],
  "corn-maze": ["corn-maze"],
  "pumpkin-patch": ["pumpkin-patch"],
  mixed: ["haunted-house", "corn-maze", "pumpkin-patch"],
};
const defaultSelectionIds = Object.keys(selectionById);
const radii = (process.env.PFU_LIVE_RADII ?? "15,50").split(",").map((value) => Number(value.trim()));
assert.ok(radii.length > 0 && new Set(radii).size === radii.length && radii.every((radius) => [15, 50].includes(radius)), "PFU_LIVE_RADII must contain distinct 15 and/or 50 values");
const selectionIds = (process.env.PFU_LIVE_SELECTIONS ?? defaultSelectionIds.join(",")).split(",").map((value) => value.trim());
assert.ok(selectionIds[0] === "anything" && new Set(selectionIds).size === selectionIds.length && selectionIds.every((id) => Object.hasOwn(selectionById, id)), "PFU_LIVE_SELECTIONS must start with anything and contain only distinct approved selection IDs");
const expectedRows = radii.length * (selectionIds.length + 1);
const verdictMode = radii.join(",") === "15,50" && selectionIds.join(",") === defaultSelectionIds.join(",") ? "full-matrix" : "pilot";
const rows = [];
const rpc = [];
const errors = [];
const pageErrors = [];
const pendingDecodes = new Set();
const allCategories = ["haunted-house", "corn-maze", "pumpkin-patch", "bowling", "arcade", "mini-golf", "escape-room", "skating", "movies", "museum", "park"];
const labels = { anything: "Anything", "haunted-house": "Haunted House", "corn-maze": "Corn Maze", "pumpkin-patch": "Pumpkin Patch" };
let browser;
let currentPhase = "startup";
let checkPhase = "startup";

function summaryOf(result) {
  assert.ok(result && ["live", "merged", "fallback"].includes(result.source) && Array.isArray(result.venues), "RPC response shape must be recognized");
  const byType = {};
  const liveByType = {};
  for (const type of allCategories) {
    byType[type] = result.venues.filter((venue) => venue.activityTypes?.includes(type)).length;
    liveByType[type] = result.venues.filter((venue) => venue.discoveryEvidence
      ? venue.discoveryEvidence.some((evidence) => evidence.source === "osm" && evidence.activityTypes?.includes(type))
      : venue.source === "osm" && venue.activityTypes?.includes(type)).length;
  }
  return {
    source: result.source, venues: result.venues.length,
    liveVenues: result.venues.filter((venue) => venue.discoveryEvidence?.some((evidence) => evidence.source === "osm") || venue.source === "osm").length,
    byType, liveByType, partial: result.discovery?.partial ?? null,
    groups: result.discovery?.groups.map((group) => ({ id: group.id, activityTypes: group.activityTypes, outcome: group.outcome })) ?? [],
    warningPresent: Boolean(result.warning),
  };
}

async function decodeCaptured(response, event) {
  try {
    const bytes = await response.body();
    const capturedHeaders = response.headers();
    const codecHeaders = Object.fromEntries(["content-type", "x-tss-serialized", "x-tss-raw"]
      .filter((key) => capturedHeaders[key]).map((key) => [key, capturedHeaders[key]]));
    const decoded = await runWithStartContext({ startOptions: {} }, () => serverFnFetcher(response.url(),
      [{ method: "POST", data: {} }],
      async () => new Response(bytes, { status: response.status(), headers: codecHeaders })));
    if (decoded instanceof Response || decoded?.error !== undefined) {
      event.outcome = "rpc-error";
      return;
    }
    event.response = summaryOf(decoded.result);
    event.outcome = "decoded";
  } catch {
    // Raw exceptions, response bodies and provider/user details are not evidence.
    event.outcome = "decode-or-transport-error";
  } finally {
    event.durationMs = Date.now() - event.started;
    delete event.started;
  }
}

async function flushDecodes() {
  if (!pendingDecodes.size) return;
  let timer;
  try {
    await Promise.race([
      Promise.allSettled([...pendingDecodes]),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Captured response decoding exceeded its bound")), 5_000); }),
    ]);
  } finally { clearTimeout(timer); }
}

async function settled(page) {
  await page.waitForFunction(() => {
    const text = document.body.innerText;
    return !text.includes("Finding date ideas") &&
      (/\d+ activities match/.test(text) || text.includes("Date idea search timed out") || text.includes("We couldn't refresh date ideas right now"));
  }, undefined, { timeout: 28_000 });
  await flushDecodes();
}

async function selectCategories(page, desired) {
  const relevant = Object.keys(labels);
  const selected = [];
  for (const type of relevant) {
    if (await page.getByRole("button", { name: labels[type], exact: true }).getAttribute("aria-pressed") === "true") selected.push(type);
  }
  // Add before removing, avoiding an accidental empty selection/Anything query.
  for (const type of desired.filter((type) => !selected.includes(type))) {
    await page.getByRole("button", { name: labels[type], exact: true }).click();
  }
  if (!desired.includes("anything")) {
    for (const type of selected.filter((type) => type !== "anything" && !desired.includes(type))) {
      await page.getByRole("button", { name: labels[type], exact: true }).click();
    }
  }
  for (const type of desired) assert.equal(await page.getByRole("button", { name: labels[type], exact: true }).getAttribute("aria-pressed"), "true");
}

async function recordRow(page, radius, activityTypes, openNow, before, started, coverageComplete) {
  checkPhase = "ui-settlement";
  await settled(page);
  const text = await page.locator("body").innerText();
  const count = Number(text.match(/(\d+) activities match/)?.[1] ?? 0);
  const requestCount = rpc.length - before;
  const row = {
    radiusMiles: radius, activityTypes, openNow, elapsedMs: Date.now() - started,
    eligibleCount: count, requestCount,
    responses: rpc.slice(before).map((event) => ({ outcome: event.outcome, durationMs: event.durationMs, response: event.response })),
    liveSeasonalDisclosure: text.includes("Live seasonal results included."),
    savedOnlyDisclosure: text.includes("Saved places only:"),
    missingCategoryDisclosure: text.includes("No places found:"),
    completeOutageDisclosure: text.includes("Live map unavailable; using saved places.") || text.includes("Live discovery is temporarily unavailable"),
    partialDisclosure: text.includes("Some live searches are unavailable"),
    terminalError: text.includes("Date idea search timed out") || text.includes("We couldn't refresh date ideas right now"),
    spinnerSettled: !text.includes("Finding date ideas"),
    noRefetchExpectedFromSuccessfulSuperset: coverageComplete && !activityTypes.includes("anything"),
  };
  checkPhase = "bounded-client-settlement";
  assert.ok(row.elapsedMs < 30_000, "Client settlement must remain bounded");
  checkPhase = "captured-response-decoding";
  if (requestCount && !row.terminalError) assert.ok(rpc.slice(before).some((event) => event.outcome === "decoded"), "Settled successful UI requires decoded acquisition evidence");
  checkPhase = "covered-subset-no-refetch";
  if (row.noRefetchExpectedFromSuccessfulSuperset) assert.equal(requestCount, 0, "A covered category subset must reuse acquisition");
  const lastDecoded = [...rpc].reverse().find((event) => event.response)?.response;
  row.lastNetworkSource = lastDecoded?.source ?? null;
  row.lastNetworkSourceMeaning = requestCount ? "network response; UI may also merge prior cached coverage" : "prior acquisition reused; source disclosure checked separately";
  checkPhase = "mobile-overflow";
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "No mobile horizontal overflow");
  const screenshot = `${radius}-${activityTypes.join("_")}-${openNow ? "on" : "off"}.png`;
  await page.screenshot({ path: resolve(output, screenshot), fullPage: true,
    mask: [page.getByRole("region", { name: "Search location" })] });
  row.screenshot = screenshot;
  rows.push(row);
  console.log("DATE_NIGHT_LIVE_ROW " + JSON.stringify(row));
}

async function localOnlyChecks(page, radius) {
  const before = rpc.length;
  for (const name of ["Favorites only", "Fewer parks"]) {
    checkPhase = name === "Favorites only" ? "local-favorites-on" : "local-fewer-parks-toggle";
    await page.getByRole("switch", { name, exact: true }).click();
    checkPhase = name === "Favorites only" ? "local-favorites-off" : "local-fewer-parks-restore";
    await page.getByRole("switch", { name, exact: true }).click();
  }
  checkPhase = "local-mood-focus";
  const mood = page.locator('[aria-label="Cozy to adventurous"]').getByRole("slider");
  await mood.focus();
  checkPhase = "local-mood-adjust";
  await mood.press("End");
  await page.waitForTimeout(150);
  checkPhase = "local-controls-no-refetch";
  assert.equal(rpc.length, before, "Mood, favorites and fewer-parks changes must not refetch");
  return { radiusMiles: radius, moodFavoritesFewerParksNoRefetch: true };
}

const localOnly = [];
try {
  mkdirSync(output, { recursive: true });
  browser = await chromium.launch({ headless: true,
    executablePath: process.env.PFU_BROWSER_EXECUTABLE_PATH ?? "/tmp/pfu-halloween-browser/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"] });
  for (const radius of radii) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", timezoneId: "America/Chicago", ignoreHTTPSErrors });
    context.setDefaultTimeout(10_000);
    context.setDefaultNavigationTimeout(30_000);
    await context.route("**/*", (route) => {
      if (new URL(route.request().url()).hostname === productionHost) return route.abort("blockedbyclient");
      return route.continue();
    });
    await context.addInitScript((radiusMiles) => {
      sessionStorage.setItem("dinner-roulette-hint-seen", "1");
      localStorage.setItem("pick-for-us-v1", JSON.stringify({ version: 0, state: {
        homeMode: "date-night", spookySeasonEnabled: true, theme: "dark",
        location: { lat: 37.176447, lon: -94.310223, label: "Carthage, Missouri", source: "manual" },
        dateNightFilters: { radiusMiles, activityTypes: ["anything"], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: true },
      } }));
    }, radius);
    const page = await context.newPage();
    page.on("pageerror", () => pageErrors.push({ phase: currentPhase, kind: "pageerror" }));
    const events = new Map();
    page.on("request", (request) => {
      if (new URL(request.url()).pathname !== rpcPath) return;
      const event = { phase: currentPhase, started: Date.now(), outcome: "pending" };
      events.set(request, event);
      rpc.push(event);
    });
    page.on("requestfailed", (request) => {
      const event = events.get(request);
      if (event && event.outcome === "pending") {
        event.outcome = "transport-failed-or-cancelled";
        event.durationMs = Date.now() - event.started;
        delete event.started;
      }
    });
    page.on("response", (response) => {
      const event = events.get(response.request());
      if (!event) return;
      const work = decodeCaptured(response, event).finally(() => pendingDecodes.delete(work));
      pendingDecodes.add(work);
    });
    currentPhase = `${radius}:anything:off`;
    const initialBefore = rpc.length;
    const initialStarted = Date.now();
    await page.goto(target, { waitUntil: "domcontentloaded" });
    assert.equal(new URL(page.url()).origin, targetUrl.origin, "Preview must not redirect to another environment");
    await page.waitForFunction(() => Object.keys(document.querySelector('[aria-label="Use my location"]') ?? {}).some((key) => key.startsWith("__reactProps")));
    await page.getByRole("button", { name: "Haunted House", exact: true }).waitFor();
    await recordRow(page, radius, ["anything"], false, initialBefore, initialStarted, false);
    const initialResponse = [...rpc.slice(initialBefore)].reverse().find((event) => event.response)?.response;
    checkPhase = "initial-acquisition-evidence";
    assert.ok(rpc.length > initialBefore && initialResponse, "Initial Preview load must capture a decoded Date Night acquisition");
    assert.equal(initialResponse.groups.length, 4, "Initial Anything must report all four acquisition groups");
    const initialRow = rows.at(-1);
    checkPhase = "initial-source-disclosure";
    if (initialResponse.source === "fallback") assert.equal(initialRow.completeOutageDisclosure, true, "Complete fallback requires outage disclosure");
    else assert.equal(initialRow.completeOutageDisclosure, false, "Successful acquisition must not claim complete outage");
    if (initialResponse.partial) assert.equal(initialRow.partialDisclosure, true, "Partial acquisition requires visible partial disclosure");
    const complete = initialResponse?.groups.length === 4 && initialResponse.groups.every((group) => group.outcome.startsWith("succeeded"));
    for (const selectionId of selectionIds.slice(1)) {
      const selection = selectionById[selectionId];
      currentPhase = `${radius}:${selection.join("+")}:off`;
      assert.ok(rpc.length < MAX_RPC_REQUESTS, "Bounded live acceptance request limit reached; preserve observations without retrying providers");
      const before = rpc.length;
      const started = Date.now();
      await selectCategories(page, selection);
      await recordRow(page, radius, selection, false, before, started, complete);
    }
    const finalSelection = selectionById[selectionIds.at(-1)];
    currentPhase = `${radius}:${finalSelection.join("+")}:on`;
    const before = rpc.length;
    const started = Date.now();
    await page.getByRole("switch", { name: "Open now only", exact: true }).click();
    await page.waitForTimeout(150);
    checkPhase = "open-now-no-refetch";
    assert.equal(rpc.length, before, "Open Now must not refetch");
    const mixedOffCount = rows.at(-1).eligibleCount;
    await recordRow(page, radius, finalSelection, true, before, started, complete);
    checkPhase = "open-now-eligibility-subset";
    assert.ok(rows.at(-1).eligibleCount <= mixedOffCount, "Open Now must not add browse-ineligible candidates");
    localOnly.push(await localOnlyChecks(page, radius));
    await context.close();
  }
  assert.deepEqual(pageErrors, [], "No fatal page errors");
  checkPhase = "expected-matrix-row-count";
  assert.equal(rows.length, expectedRows);
} catch (error) {
  // Error text can include DOM/provider details; only a bounded type/phase is saved.
  errors.push({ phase: currentPhase, check: checkPhase, kind: error?.name === "AssertionError" ? "acceptance-assertion" : "environment-or-browser-error",
    networkCode: error?.message?.match(/net::ERR_[A-Z_]+/)?.[0] ?? null });
  console.error("DATE_NIGHT_LIVE_FAILURE " + JSON.stringify(errors.at(-1)));
  process.exitCode = 1;
} finally {
  await browser?.close();
  const verdict = { testedAt: new Date().toISOString(), previewOrigin: targetUrl.origin,
    previewDeploymentId: process.env.PFU_PREVIEW_DEPLOYMENT_ID ?? null,
    candidate: process.env.PFU_CANDIDATE_SHA ?? null,
    buildProof, browserTlsVerificationBypassed: ignoreHTTPSErrors, mode: verdictMode, expectedRows, requestedRadii: radii, requestedSelections: selectionIds,
    rows, rpc, localOnly, pageErrors, errors,
    passed: errors.length === 0 && rows.length === expectedRows,
    fullMatrixPassed: verdictMode === "full-matrix" && errors.length === 0 && rows.length === 12,
    liveContributionObserved: rpc.some((event) => event.response?.liveVenues > 0),
    limitations: ["Venue counts are observations, not invariants.", "No duplicate real request is made to decode captured RPC data.", "Source summaries describe transport responses; UI may combine cached coverage.", "Successful provider recall cannot be established when every live attempt fails."] };
  mkdirSync(output, { recursive: true });
  writeFileSync(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log("DATE_NIGHT_LIVE_VERDICT " + JSON.stringify({ mode: verdict.mode, expectedRows, passed: verdict.passed, fullMatrixPassed: verdict.fullMatrixPassed, rows: rows.length, requests: rpc.length, liveContributionObserved: verdict.liveContributionObserved, errors }));
}
