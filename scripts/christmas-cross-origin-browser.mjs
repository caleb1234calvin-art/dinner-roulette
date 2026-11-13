import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { chromium } from "playwright";
import { checkedOutputPath } from "./browser-guard.mjs";
import { createChristmasCrossOriginProvider, CHRISTMAS_CROSS_ORIGIN_ORIGINS as origins,
  CHRISTMAS_CROSS_ORIGIN_PARK_ID as parkId, CHRISTMAS_CROSS_ORIGIN_CINEMA_ID as cinemaId } from "./test-support/christmas-cross-origin-provider.mjs";

const harnessRoot = resolve(".");
const appRoot = resolve(process.env.CHRISTMAS_CROSS_ORIGIN_APP_ROOT ?? process.env.CHRISTMAS_APP_ROOT ?? harnessRoot);
const output = checkedOutputPath(process.env.CHRISTMAS_CROSS_ORIGIN_OUTPUT ?? "/tmp/pfu-christmas-cross-origin-browser",
  ["/tmp", resolve("audit")], "Cross-origin browser evidence");
await mkdir(output, { recursive: true });
const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const sourceSha = git(appRoot, "rev-parse", "HEAD"), sourceTree = git(appRoot, "rev-parse", "HEAD^{tree}");
const sourceState = git(appRoot, "status", "--porcelain=v1");
const appInputs = git(appRoot, "ls-files", "--cached", "--others", "--exclude-standard", "src").split("\n").filter(Boolean);
const harnessInputs = ["scripts/christmas-cross-origin-browser.mjs", "scripts/test-support/christmas-cross-origin-fixture.tsx",
  "scripts/test-support/christmas-cross-origin-transport.ts", "scripts/test-support/christmas-cross-origin-observer.ts",
  "scripts/test-support/christmas-cross-origin-provider.mjs", "scripts/test-support/christmas-park-source.json",
  "scripts/test-support/load-app-module.mjs", "package.json", "package-lock.json"];
const sha256 = content => createHash("sha256").update(content).digest("hex");
async function fingerprint(root, inputs) {
  const hash = createHash("sha256");
  for (const path of [...new Set(inputs)].sort()) hash.update(path + "\0").update(await readFile(resolve(root, path)));
  return hash.digest("hex");
}
const appFingerprint = await fingerprint(appRoot, appInputs), harnessFingerprint = await fingerprint(harnessRoot, harnessInputs);
const provider = createChristmasCrossOriginProvider(appRoot);
const actualSessionPath = resolve(appRoot, "src/lib/date-night/radial-session.ts");
const result = await build({ root: appRoot, configFile: false, publicDir: false, mode: "production",
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom", "zustand"], alias: [
    { find: "@/lib/date-night/search", replacement: resolve(harnessRoot, "scripts/test-support/christmas-cross-origin-transport.ts") },
    { find: "@/lib/restaurants/search", replacement: resolve(harnessRoot, "scripts/test-support/christmas-cross-origin-transport.ts") },
    { find: "@/lib/date-night/radial-session", replacement: resolve(harnessRoot, "scripts/test-support/christmas-cross-origin-observer.ts") },
    { find: "@cross-origin/actual-radial-session", replacement: actualSessionPath },
    { find: "@", replacement: resolve(appRoot, "src") },
  ] },
  define: { "process.env.NODE_ENV": '"production"' },
  build: { write: false, minify: false, lib: { entry: resolve(harnessRoot, "scripts/test-support/christmas-cross-origin-fixture.tsx"), formats: ["iife"], name: "CrossOriginFixture" } },
});
const chunks = [result].flat().flatMap(bundle => bundle.output);
const code = chunks.filter(item => item.type === "chunk").map(item => item.code).join("\n");
const css = chunks.filter(item => item.type === "asset" && item.fileName.endsWith(".css")).map(item => item.source).join("\n");
const verdict = { passed: false, provenance: process.env.CI ? "hosted CI" : "local", appRoot, sourceSha, sourceTree, sourceState,
  appFingerprint, harnessFingerprint, harnessHead: git(harnessRoot, "rev-parse", "HEAD"), bundleFingerprint: sha256(code + css),
  actualSessionModule: { path: actualSessionPath, sha256: sha256(await readFile(actualSessionPath)) },
  actualSearchModule: { path: resolve(appRoot, "src/lib/date-night/search.ts"), sha256: sha256(await readFile(resolve(appRoot, "src/lib/date-night/search.ts"))) },
  controls: { at: "2026-12-05T18:00:00-06:00", origins, parkId, radiusMiles: 15, patchId: "radial-v1:core",
    providerCategories: ["movies", "park"], christmasCategories: ["christmas-lights"] },
  cases: [], providerRequests: [], pageErrors: [], externalRequests: [], integrity: [],
  limitations: ["Real Home/Result and mounted radial session/cache; read-only callback observer forwards every real result unchanged.",
    "Only RPC/Overpass transport and private review mode are fixtures. All four public attractions remain HOLD.",
    "Inherited Christmas-off light-theme contrast findings remain separately tracked in review comment 6865398821; no theme changes or new contrast acceptance claim.",
    "Not geographic integration, combined V4, physical Android/WebView or real assistive-technology acceptance."],
};
const server = createServer(async (request, response) => {
  try {
    if (request.url === "/cross-origin-search" && request.method === "POST") {
      let body = "";
      for await (const chunk of request) { body += chunk; if (body.length > 4096) throw new Error("Oversized fixture RPC request"); }
      const result = await provider.run(JSON.parse(body));
      response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify(result)); return;
    }
    if (request.url === "/fixture.js") { response.setHeader("Content-Type", "application/javascript"); response.end(code); return; }
    if (request.url?.startsWith("/?")) {
      const query = new URL(request.url, "http://127.0.0.1").searchParams;
      const start = query.get("start") === "A" ? "A" : "B", theme = query.get("theme") === "light" ? "light" : "dark";
      response.setHeader("Content-Type", "text/html");
      response.end(`<!doctype html><html lang="en" data-theme="${theme}"><head><title>Isolated cross-origin recovery</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><div id="root"></div><script>window.__crossOriginConfig=${JSON.stringify({ start, theme })};</script><script src="/fixture.js"></script></body></html>`); return;
    }
    if (/^\/(?:date-night-icons|brand)\/[a-zA-Z0-9/_\-.]+$/.test(request.url ?? "")) {
      const path = resolve(appRoot, "public", request.url.slice(1));
      response.setHeader("Content-Type", ({ ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" })[extname(path)] ?? "application/octet-stream");
      try { response.end(await readFile(path)); return; } catch { /* Missing fixture images do not call external hosts. */ }
    }
    response.writeHead(404); response.end("Not a fixture endpoint");
  } catch (error) { response.writeHead(500, { "Content-Type": "application/json" }); response.end(JSON.stringify({ error: error.message })); }
});
await new Promise(ready => server.listen(0, "127.0.0.1", ready));
const origin = `http://127.0.0.1:${server.address().port}`;
const fixture = (page, action, ...args) => page.evaluate(({ action, args }) => window.crossOriginFixture[action](...args), { action, args });
const frame = page => page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
const closeButtons = page => page.getByRole("button", { name: /^(Close result|Close options|Close night plan)$/ });
const controls = { result: { open: "Pick our date", close: "Close result" }, options: { open: "Give us options", close: "Close options" },
  plan: { open: "Plan our outing", close: "Close night plan" } };
async function settled(page, key) {
  await page.waitForFunction(lat => { const f = window.crossOriginFixture, latest = f?.latest(); return latest?.acquisition.lat === lat &&
    !latest.loading && !latest.expanding && f.requests().every(item => item.completed); }, origins[key].lat);
  await frame(page);
}
async function snapshot(page, stage) {
  return { stage, latest: await fixture(page, "latest"), requests: await fixture(page, "requests"),
    pickDisabled: await page.getByRole("button", { name: "Pick our date", exact: true }).isDisabled(),
    overlays: await closeButtons(page).count(), directions: await page.locator('[data-christmas-dialog] a[href*="maps"], body > .fixed a[href*="maps"]').count() };
}
function verify(record, name, action) {
  try { action(); record.assertions.push({ name, passed: true }); }
  catch (error) { record.assertions.push({ name, passed: false, error: error.message }); }
}
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  for (const start of ["B", "A"]) for (const recovery of ["stale-v3", "conflict-v3", "reviewed-v2"]) for (const surface of Object.keys(controls)) {
    const lost = start === "A" ? "B" : "A";
    const loss = surface === "result" ? "overflow-first" : surface === "options" ? "overflow-last" : "timeout";
    const width = surface === "result" ? 320 : surface === "options" ? 390 : 512;
    const theme = start === "B" ? "light" : "dark", motion = surface === "options" ? "no-preference" : "reduce";
    const name = `${start}→${lost}→${start} ${recovery} after ${loss}; ${surface}`;
    const record = { name, start, lost, recovery, loss, surface, width, theme, motion, passed: false, assertions: [], stages: [] };
    verdict.cases.push(record);
    const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: "America/Chicago", reducedMotion: motion, serviceWorkers: "block" });
    await context.route("**/*", route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      verdict.externalRequests.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage(); page.setDefaultTimeout(10000);
    page.on("pageerror", error => verdict.pageErrors.push({ case: name, error: error.message }));
    try {
      await page.clock.setFixedTime(new Date(verdict.controls.at));
      await page.goto(`${origin}/?start=${start}&theme=${theme}`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => Boolean(window.crossOriginFixture?.ready));
      await settled(page, start);
      const initial = await snapshot(page, "complete seed"); record.stages.push(initial);
      verify(record, "initial reviewed v2 binds with complete Movies + Park", () => {
        assert.equal(initial.latest.binding, "bound"); assert.equal(initial.pickDisabled, false);
        assert.equal(initial.requests.length, 1); assert.deepEqual(initial.requests[0].data.activityTypes, ["movies", "park"]);
      });
      await page.getByRole("button", { name: controls[surface].open, exact: true }).click();
      await page.getByRole("button", { name: controls[surface].close, exact: true }).waitFor();
      await page.locator('[data-christmas-event-details]').first().waitFor();
      const originalEvent = initial.latest.isolatedEvents[0];
      const originalDirections = await page.locator('[data-christmas-dialog] a[href*="maps"]').count();
      verify(record, "selected event has an exact dated occurrence and no gate Directions", () => {
        assert.match(originalEvent.activeSessionKey, /2026-12-05$/);
        assert.equal(originalEvent.eventKey, "date-night-event-christmas-2026-sparkle-in-the-park");
        assert.equal(originalDirections, 0);
      });
      await fixture(page, "origin", lost, loss); await settled(page, lost);
      const failed = await snapshot(page, "loss at second origin"); record.stages.push(failed);
      verify(record, "all four failed culture mirrors preserve outdoor v2 and retire the selection", () => {
        assert.equal(failed.latest.binding, "incomplete-source-evidence"); assert.equal(failed.latest.parkPresent, true);
        assert.equal(failed.pickDisabled, true); assert.equal(failed.overlays, 0); assert.equal(failed.directions, 0);
        assert.equal(failed.requests.at(-1).record.calls.culture, 4); assert.equal(failed.requests.at(-1).record.calls.outdoor, 1);
      });
      await fixture(page, "origin", start, "complete"); await settled(page, start);
      const cachedBlocked = await snapshot(page, "first origin retains loss"); record.stages.push(cachedBlocked);
      verify(record, "already-cached first origin remains blocked without provider requests", () => {
        assert.equal(cachedBlocked.latest.binding, "incomplete-source-evidence"); assert.equal(cachedBlocked.pickDisabled, true);
        assert.equal(cachedBlocked.requests.length, failed.requests.length); assert.equal(cachedBlocked.overlays, 0);
      });
      await fixture(page, "origin", lost, recovery); await settled(page, lost);
      const recovered = await snapshot(page, "complete Movies recovery at second origin"); record.stages.push(recovered);
      const expected = recovery === "reviewed-v2" ? "bound" : recovery === "stale-v3" ? "stale-source" : "conflicting-source";
      verify(record, "recovery requests only missing Movies and uses its actual source verdict", () => {
        assert.equal(recovered.requests.length, failed.requests.length + 1);
        assert.deepEqual(recovered.requests.at(-1).data.activityTypes, ["movies"]);
        assert.equal(recovered.requests.at(-1).record.calls.culture, 1); assert.equal(recovered.requests.at(-1).record.calls.outdoor, 0);
        assert.equal(recovered.latest.binding, expected); assert.equal(recovered.overlays, 0);
        assert.equal(recovered.pickDisabled, recovery !== "reviewed-v2");
      });
      await fixture(page, "origin", start, "complete"); await settled(page, start);
      const returned = await snapshot(page, "cached origin after recovery"); record.stages.push(returned);
      record.explicitPick = { attempted: !returned.pickDisabled, resultOpened: false };
      if (!returned.pickDisabled) {
        await page.getByRole("button", { name: "Pick our date", exact: true }).click();
        await page.getByRole("button", { name: "Close result", exact: true }).waitFor();
        record.explicitPick.resultOpened = await page.getByRole("heading", { name: "Sparkle in the Park", exact: true }).count() === 1;
        record.explicitPick.eventKey = await page.locator('[data-christmas-event-details]').getAttribute("data-christmas-event-details");
        record.explicitPick.directions = await page.locator('[data-christmas-dialog] a[href*="maps"]').count();
        if (recovery === "reviewed-v2") {
          await page.getByRole("button", { name: "Save", exact: true }).click();
          const state = await fixture(page, "state");
          record.explicitPick.savedEvent = state.preferences[parkId]?.dateNightEvent;
        }
      }
      await page.screenshot({ path: resolve(output, `${start}-${recovery}-${surface}.png`), fullPage: false });
      verify(record, "zero-request return cannot ignore disqualifying canonical evidence", () => {
        assert.equal(returned.requests.length, recovered.requests.length);
        assert.equal(returned.overlays, 0, "retired selection never reopens automatically");
        if (recovery === "reviewed-v2") {
          assert.equal(returned.latest.binding, "bound"); assert.equal(returned.pickDisabled, false);
          assert.equal(record.explicitPick.resultOpened, true);
          assert.equal(record.explicitPick.eventKey, originalEvent.eventKey);
          assert.equal(record.explicitPick.savedEvent.activeSessionKey, originalEvent.activeSessionKey);
          assert.equal(record.explicitPick.savedEvent.preferenceKey, parkId);
          assert.equal(record.explicitPick.directions, 0);
        } else {
          assert.notEqual(returned.latest.binding, "bound"); assert.equal(returned.pickDisabled, true);
          assert.equal(record.explicitPick.resultOpened, false, "an explicit click must not open an invalid Sparkle Result");
        }
      });
      if (await closeButtons(page).count()) await closeButtons(page).first().click();
      for (const key of [lost, start]) {
        await fixture(page, "origin", key, "complete"); await settled(page, key);
        const again = await snapshot(page, `repeat cache-only return ${key}`); record.stages.push(again);
        verify(record, `second cache-only return ${key} retains canonical authority`, () => {
          assert.equal(again.requests.length, recovered.requests.length);
          assert.equal(again.latest.binding === "bound", recovery === "reviewed-v2");
          assert.equal(again.overlays, 0); assert.equal(again.directions, 0);
        });
      }
      // Opting out restores a separately valid ordinary cinema from the same
      // cache. Constrain the known control with the ordinary Favorites filter:
      // real search also retains catalog cinemas, which must not be removed
      // from the transport just to force a deterministic test selection.
      const preferences = (await fixture(page, "state")).preferences;
      await fixture(page, "configure", { christmasEnabled: false, dateNightFilters: { radiusMiles: 15,
        activityTypes: ["movies"], mood: 50, openNowOnly: false, favoritesOnly: true, reduceParks: false },
        preferences: { ...preferences, [cinemaId]: { restaurantId: cinemaId, name: "Fixture ordinary cinema", cuisineLabel: "Movies", favorite: true } } });
      await settled(page, start);
      await page.getByRole("button", { name: "Pick our date", exact: true }).click();
      await page.getByRole("heading", { name: "Fixture ordinary cinema", exact: true }).waitFor();
      await page.getByRole("button", { name: "Reroll", exact: true }).click();
      await page.getByRole("heading", { name: "Fixture ordinary cinema", exact: true }).waitFor();
      const ordinaryRequests = await fixture(page, "requests");
      verify(record, "ordinary Pick and Reroll remain functional without additional provider requests", () => assert.equal(ordinaryRequests.length, recovered.requests.length));
      const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
      verify(record, "narrow ordinary Result remains within viewport", () => assert.ok(dimensions.document <= dimensions.width + 1));
    } catch (error) { record.assertions.push({ name: "browser scenario completed", passed: false, error: error.message, stack: error.stack }); }
    finally {
      record.updates = await fixture(page, "updates").catch(() => []);
      record.actualSessionFactoryCalls = await fixture(page, "actualSessionFactoryCalls").catch(() => 0);
      verify(record, "one real mounted session, public HOLD and no eligible synthetic schools", () => {
        assert.equal(record.actualSessionFactoryCalls, 1);
        assert.ok(record.updates.length > 0); assert.ok(record.updates.every(update => update.publicEvents === 0 && !update.schoolSelectable));
      });
      record.passed = record.assertions.every(item => item.passed); await context.close();
    }
    console.log(`CHRISTMAS_CROSS_ORIGIN_${record.passed ? "PASS" : "FAIL"} ${name}`);
    if (!record.passed) console.log(JSON.stringify(record.assertions.filter(item => !item.passed)));
  }
  for (const [name, action] of [
    ["no page errors or external requests", async () => { assert.deepEqual(verdict.pageErrors, []); assert.deepEqual(verdict.externalRequests, []); }],
    ["source and harness stable", async () => { assert.equal(await fingerprint(appRoot, appInputs), appFingerprint);
      assert.equal(await fingerprint(harnessRoot, harnessInputs), harnessFingerprint); assert.equal(git(appRoot, "rev-parse", "HEAD"), sourceSha);
      assert.equal(git(appRoot, "status", "--porcelain=v1"), sourceState); }],
  ]) {
    try { await action(); verdict.integrity.push({ name, passed: true }); }
    catch (error) { verdict.integrity.push({ name, passed: false, error: error.message }); }
  }
  verdict.passed = verdict.cases.length === 18 && verdict.cases.every(item => item.passed) && verdict.integrity.every(item => item.passed);
  if (!verdict.passed) process.exitCode = 1;
} catch (error) { verdict.failure = { message: error.message, stack: error.stack }; process.exitCode = 1; }
finally {
  verdict.providerRequests = provider.records;
  await browser?.close(); await new Promise(done => server.close(done));
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify({ passed: verdict.passed, sourceSha, sourceTree, cases: verdict.cases.length,
    failures: verdict.cases.filter(item => !item.passed).length, output, failure: verdict.failure }));
}
