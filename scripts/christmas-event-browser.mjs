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

// Real application components + store + event resolver in a production-mode
// browser bundle. Only discovery transport and the private fixture entry differ.
// This fixture is not a production route, an event publication flag or device acceptance.
const output = checkedOutputPath(process.env.CHRISTMAS_EVENT_BROWSER_OUTPUT ?? "/tmp/pfu-christmas-event-browser", ["/tmp", resolve("audit")], "Christmas UI evidence");
await mkdir(output, { recursive: true });
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const sourceSha = git("rev-parse", "HEAD");
const sourceTree = git("rev-parse", "HEAD^{tree}");
const sourceState = git("status", "--porcelain=v1");
const inputs = git("ls-files", "--cached", "--others", "--exclude-standard", "src", "scripts", "package.json", "package-lock.json", "vite.config.ts", "tsconfig.json").split("\n").filter(Boolean);
for (const file of ["scripts/christmas-event-browser.mjs", "scripts/test-support/christmas-event-fixture.tsx", "scripts/test-support/christmas-event-search-fixture.ts"]) if (!inputs.includes(file)) inputs.push(file);
async function fingerprint() {
  const hash = createHash("sha256");
  for (const path of [...new Set(inputs)].sort()) hash.update(path + "\0").update(await readFile(path));
  return hash.digest("hex");
}
const sourceFingerprint = await fingerprint();
const result = await build({
  configFile: false, publicDir: false, mode: "production",
  plugins: [react(), tailwindcss()],
  resolve: { alias: [
    { find: "@/lib/date-night/search", replacement: resolve("scripts/test-support/christmas-event-search-fixture.ts") },
    { find: "@/lib/restaurants/search", replacement: resolve("scripts/test-support/christmas-event-search-fixture.ts") },
    { find: "@", replacement: resolve("src") },
  ] },
  define: { "process.env.NODE_ENV": '"production"' },
  build: { write: false, minify: false, lib: { entry: resolve("scripts/test-support/christmas-event-fixture.tsx"), formats: ["iife"], name: "ChristmasReviewFixture" } },
});
const chunks = [result].flat().flatMap(bundle => bundle.output);
const code = chunks.filter(item => item.type === "chunk").map(item => item.code).join("\n");
const css = chunks.filter(item => item.type === "asset" && item.fileName.endsWith(".css")).map(item => item.source).join("\n");
const html = `<!doctype html><html data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>`;
const server = createServer(async (request, response) => {
  if (request.url === "/fixture.js") { response.setHeader("Content-Type", "application/javascript"); response.end(code); return; }
  if (request.url === "/") { response.setHeader("Content-Type", "text/html"); response.end(html); return; }
  // Real ordinary category artwork is served unchanged. No Christmas artwork is introduced.
  if (/^\/(?:date-night-icons|brand)\/[a-zA-Z0-9/_\-.]+$/.test(request.url ?? "")) {
    try {
      const path = resolve("public", request.url.slice(1));
      response.setHeader("Content-Type", ({ ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml" })[extname(path)] ?? "application/octet-stream");
      response.end(await readFile(path)); return;
    } catch { /* A missing ordinary fixture image must not become a remote request. */ }
  }
  response.writeHead(404); response.end("Not a fixture endpoint");
});
await new Promise(resolveReady => server.listen(0, "127.0.0.1", resolveReady));
const origin = `http://127.0.0.1:${server.address().port}`;
const verdict = { passed: false, sourceSha, sourceTree, sourceState, sourceFingerprint, bundleFingerprint: createHash("sha256").update(code).update(css).digest("hex"), cases: [], pageErrors: [], externalRequests: [], limitations: ["Isolated real-component/store fixture with replaced discovery transport; not a production route or physical Android/WebView acceptance.", "Temporary distance placements are synthetic controls and do not establish public placement clearance."] };
let browser, currentPage;
const check = async (name, fn) => {
  try { await fn(); verdict.cases.push({ name, passed: true }); console.log(`CHRISTMAS_BROWSER_PASS ${name}`); }
  catch (error) { verdict.cases.push({ name, passed: false, error: error.message }); throw error; }
};
const fixture = async (page, action, ...args) => page.evaluate(({ action, args }) => window.christmasFixture[action](...args), { action, args });
const setTime = async (page, iso) => { await page.clock.setFixedTime(new Date(iso)); await fixture(page, "refreshClock"); };
const show = async (page, surface, researchId) => { await fixture(page, "show", surface, researchId); await page.locator(`[data-christmas-surface="${surface}"]`).first().waitFor(); };
const assertSafeActions = async (page, surface) => {
  const scopes = page.locator(`[data-christmas-surface="${surface}"]`);
  for (const scope of await scopes.all()) {
    const links = await scope.locator("a[href]").evaluateAll(items => items.map(item => item.getAttribute("href")));
    assert.ok(links.every(href => !/maps|google\.com|apple\.com|uber|lyft|ticket|checkout/i.test(href ?? "")), `unsupported action leaked on ${surface}: ${links}`);
    const actions = scope.locator("[data-christmas-event-actions]");
    assert.ok(await actions.count() > 0);
    for (const container of await actions.all()) {
      assert.equal(await container.getByRole("button", { name: "Directions unavailable", exact: true }).isDisabled(), true);
      assert.equal(await container.getByRole("button", { name: "Ticket checkout unavailable", exact: true }).isDisabled(), true);
      assert.equal(await container.locator("a, button:not([disabled])").count(), 0);
    }
  }
};
const assertLayout = async page => {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "horizontal overflow");
  const tinyControls = await page.locator('[data-christmas-surface] button:not([disabled])').evaluateAll(buttons => buttons.filter(button => {
    const box = button.getBoundingClientRect(); return box.width > 0 && box.height > 0 && (box.width < 43 || box.height < 43);
  }).map(button => ({ text: button.textContent, label: button.getAttribute("aria-label"), width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })));
  assert.deepEqual(tinyControls, [], "event controls retain 44px touch targets");
};
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  for (const width of [320, 390, 512]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: "America/Chicago", reducedMotion: "reduce", serviceWorkers: "block" });
    await context.route("**/*", route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      verdict.externalRequests.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage(); currentPage = page; page.setDefaultTimeout(10000);
    page.on("pageerror", error => verdict.pageErrors.push({ width, message: error.message }));
    await page.clock.setFixedTime(new Date("2026-12-05T10:00:00-06:00"));
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.waitForFunction(() => Boolean(window.christmasFixture?.ready));
    await page.getByRole("button", { name: "Pick our date", exact: true }).waitFor();
    await check(`${width}px real Home keeps holiday categories out of discovery`, async () => {
      const requests = await fixture(page, "discovery");
      assert.ok(requests.length > 0);
      for (const request of requests) assert.ok(request.activityTypes.every(type => !type.startsWith("holiday-") && type !== "christmas-lights"));
      assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
      await assertLayout(page);
    });
    await check(`${width}px Home category-first Pick, Four Options and Plan use event identities`, async () => {
      await page.getByRole("button", { name: "Holiday Markets", exact: true }).click();
      await page.getByRole("button", { name: "Pick our date", exact: true }).click();
      await page.getByRole("heading", { name: "Olde World Christmas Market", exact: true }).waitFor();
      await assertSafeActions(page, "result");
      await page.getByRole("button", { name: "Close result", exact: true }).click();
      await page.getByRole("button", { name: "Anything", exact: true }).click();
      await page.getByRole("button", { name: "Give us options", exact: true }).click();
      await page.getByRole("button", { name: "Close options", exact: true }).waitFor();
      const keys = await page.locator('[data-christmas-surface="options"] [data-christmas-event-details]').evaluateAll(items => items.map(item => item.getAttribute("data-christmas-event-details")));
      assert.equal(keys.length, 3); assert.equal(new Set(keys).size, 3);
      assert.match(await page.locator("body").innerText(), /Fixture ordinary cinema/);
      assert.doesNotMatch(await page.locator("body").innerText(), /No complete seasonal pair/);
      await assertSafeActions(page, "options"); await assertLayout(page);
      await page.getByRole("button", { name: "Close options", exact: true }).click();
      await page.getByRole("button", { name: "Holiday Craft Fairs", exact: true }).click();
      await page.getByRole("button", { name: "Plan our outing", exact: true }).click();
      await page.locator('[data-christmas-surface="plan"]').waitFor();
      assert.match(await page.locator('[data-christmas-surface="plan"]').innerText(), /NEWcaps Holiday Craft Fair/);
      await assertSafeActions(page, "plan"); await assertLayout(page);
      await page.getByRole("button", { name: "Close night plan", exact: true }).click();
      await page.getByRole("button", { name: "Anything", exact: true }).click();
    });
    await check(`${width}px ordinary-only Christmas plan keeps its context through opt-out`, async () => {
      await page.getByRole("button", { name: "Movies", exact: true }).click();
      await page.getByRole("button", { name: "Plan our outing", exact: true }).click();
      const plan = page.locator('[data-christmas-surface="plan"]');
      await plan.waitFor();
      assert.match(await plan.innerText(), /Fixture ordinary cinema/);
      assert.doesNotMatch(await plan.innerText(), /October after dark|No complete seasonal pair|Scare|Settle/);
      await fixture(page, "configure", { christmasEnabled: false });
      await page.getByRole("heading", { name: "Date Night plan candidates", exact: true }).waitFor();
      assert.doesNotMatch(await plan.innerText(), /October after dark|No complete seasonal pair|Scare|Settle/);
      await page.getByRole("button", { name: "Close night plan", exact: true }).click();
      await fixture(page, "configure", { christmasEnabled: true });
      await page.getByRole("button", { name: "Anything", exact: true }).click();
    });
    await check(`${width}px Result uses market session data and unavailable actions`, async () => {
      await show(page, "result", "C26-005");
      const scope = page.locator('[data-christmas-surface="result"]');
      await scope.getByRole("heading", { name: "Olde World Christmas Market", exact: true }).waitFor();
      assert.match(await scope.innerText(), /Grace Episcopal Church/);
      assert.match(await scope.innerText(), /820 Howard/);
      assert.match(await scope.innerText(), /free/i);
      assert.doesNotMatch(await scope.innerText(), /Synthetic test address|Fixture ordinary cinema/);
      await assertSafeActions(page, "result"); await assertLayout(page);
      assert.equal(await scope.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === "running").length), 0);
      await page.screenshot({ path: resolve(output, `${width}-result-market.png`), fullPage: true });
      await scope.getByRole("button", { name: "Save", exact: true }).click();
      await scope.getByRole("button", { name: "We did this", exact: true }).click();
      await scope.getByRole("button", { name: "Save choice", exact: true }).click();
      const state = await fixture(page, "state");
      const saved = Object.values(state.preferences).find(item => item.dateNightEvent?.researchId === "C26-005");
      assert.equal(saved.favorite, true); assert.ok(saved.restaurantId.startsWith("date-night-event-christmas-2026-"));
      assert.equal(state.preferences["date-night-osm-way-437235888"], undefined, "market favorite cannot favorite the church");
      assert.equal(state.visits[0].dateNightEvent.activeSessionKey?.includes("saturday"), true);
    });
    await check(`${width}px Favorites and History persist through reload and expiry`, async () => {
      await page.reload({ waitUntil: "networkidle" }); await page.waitForFunction(() => Boolean(window.christmasFixture?.ready));
      await show(page, "favorites"); await assertSafeActions(page, "favorites"); await assertLayout(page);
      assert.match(await page.locator('[data-christmas-surface="favorites"]').innerText(), /Olde World Christmas Market/);
      await setTime(page, "2027-01-01T00:00:00-06:00");
      await show(page, "history"); await assertSafeActions(page, "history"); await assertLayout(page);
      const text = await page.locator('[data-christmas-surface="history"]').innerText();
      assert.match(text, /Olde World Christmas Market/); assert.match(text, /not a current attendance recommendation/i);
      await page.screenshot({ path: resolve(output, `${width}-history-expired.png`), fullPage: true });
      const state = await fixture(page, "state"); assert.equal(state.visits.length, 1);
    });
    await check(`${width}px Options and Plan show event sessions without host actions`, async () => {
      await setTime(page, "2026-12-05T10:00:00-06:00");
      await show(page, "options");
      const cards = page.locator('[data-christmas-surface="options"]');
      assert.equal(await cards.count(), 3);
      const keys = await cards.locator("[data-christmas-event-details]").evaluateAll(items => items.map(item => item.getAttribute("data-christmas-event-details")));
      assert.equal(new Set(keys).size, keys.length);
      assert.match(await cards.allTextContents().then(parts => parts.join(" ")), /NEWcaps Holiday Craft Fair/);
      await assertSafeActions(page, "options"); await assertLayout(page);
      await page.screenshot({ path: resolve(output, `${width}-options.png`), fullPage: true });
      await show(page, "plan"); await assertSafeActions(page, "plan"); await assertLayout(page);
      assert.match(await page.locator('[data-christmas-surface="plan"]').innerText(), /Cafeteria|cafeteria/);
      await page.screenshot({ path: resolve(output, `${width}-plan.png`), fullPage: true });
    });
    await check(`${width}px gala price, fixed site/route and last announced start`, async () => {
      await setTime(page, "2026-12-04T18:00:00-06:00"); await show(page, "result", "C26-005");
      assert.match(await page.locator('[data-christmas-surface="result"]').innerText(), /\$10/);
      assert.equal(await page.getByRole("button", { name: "Saved", exact: true }).count(), 1, "gala and market share one preference identity");
      await setTime(page, "2026-12-07T17:00:00-06:00"); await show(page, "result", "C26-007");
      const scope = page.locator('[data-christmas-surface="result"]');
      assert.match(await scope.innerText(), /302 S Main/); assert.match(await scope.innerText(), /Chestnut.*Main/);
      assert.match(await scope.innerText(), /finish.*unknown|end.*unknown|finish.*unconfirmed/i);
      assert.doesNotMatch(await scope.innerText(), /Open now/);
      await page.screenshot({ path: resolve(output, `${width}-square-and-route.png`), fullPage: true });
      await fixture(page, "preserveCurrent", "C26-007");
      await setTime(page, "2026-12-07T19:01:00-06:00");
      await scope.getByText("The last announced start has passed. Current attendance is unconfirmed.", { exact: true }).waitFor();
      assert.match(await scope.innerText(), /past.*start|already.*start|announced.*passed|schedule.only|attendance.*unconfirmed/i);
      await assertSafeActions(page, "result"); await assertLayout(page);
    });
    await check(`${width}px Sparkle keeps the park identity and independent display hours`, async () => {
      await setTime(page, "2026-12-05T18:00:00-06:00"); await show(page, "result", "C26-001");
      const scope = page.locator('[data-christmas-surface="result"]');
      assert.match(await scope.innerText(), /Sparkle in the Park/);
      assert.match(await scope.innerText(), /5 p\.m\.–midnight/);
      assert.match(await scope.innerText(), /Open now according to the published event hours/);
      assert.doesNotMatch(await scope.innerText(), /08:00|12:00|8 a\.m\./);
      await assertSafeActions(page, "result"); await assertLayout(page);
      await scope.getByRole("button", { name: "Save", exact: true }).click();
      const state = await fixture(page, "state");
      assert.equal(state.preferences["date-night-osm-way-987588580"].favorite, true);
      assert.equal(Object.keys(state.preferences).some(key => key.includes("event-christmas-2026-sparkle")), false);
      await page.screenshot({ path: resolve(output, `${width}-sparkle.png`), fullPage: true });
    });
    await check(`${width}px temporary park exclusion survives reload and expires without losing its favorite`, async () => {
      await page.getByRole("button", { name: "Not tonight", exact: true }).click();
      await page.getByRole("button", { name: "Christmas Lights", exact: true }).click();
      const pick = page.getByRole("button", { name: "Pick our date", exact: true });
      await pick.waitFor(); assert.equal(await pick.isDisabled(), true);
      let state = await fixture(page, "state");
      assert.equal(state.exclusions.some(item => item.restaurantId === "date-night-osm-way-987588580"), true);
      await page.reload({ waitUntil: "networkidle" }); await page.waitForFunction(() => Boolean(window.christmasFixture?.ready));
      await pick.waitFor(); assert.equal(await pick.isDisabled(), true);
      await setTime(page, "2026-12-06T18:00:00-06:00");
      await page.waitForFunction(() => ![...document.querySelectorAll("button")].find(button => button.textContent === "Pick our date")?.disabled);
      assert.equal(await pick.isDisabled(), false);
      state = await fixture(page, "state"); assert.equal(state.preferences["date-night-osm-way-987588580"].favorite, true);
    });
    await check(`${width}px public gate and retained holiday filter preserve ordinary Home`, async () => {
      await fixture(page, "configure", { dateNightFilters: { ...filtersForBrowser(), activityTypes: ["movies"] }, christmasCategories: ["holiday-market"], christmasEnabled: true });
      await setTime(page, "2026-12-05T10:00:00-06:00"); await fixture(page, "show", "home");
      await page.getByRole("switch", { name: "Christmas date ideas", exact: true }).click();
      await page.getByRole("button", { name: "Pick our date", exact: true }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Pick our date", exact: true }).isDisabled(), false);
      assert.equal(await page.getByRole("button", { name: "Holiday Markets", exact: true }).count(), 0);
      assert.equal(await page.getByRole("button", { name: "Movies", exact: true }).getAttribute("aria-pressed"), "true");
      await page.reload({ waitUntil: "networkidle" }); await page.waitForFunction(() => Boolean(window.christmasFixture?.ready));
      assert.equal((await fixture(page, "state")).christmasEnabled, false);
      assert.deepEqual((await fixture(page, "state")).dateNightFilters.activityTypes, ["movies"]);
      await fixture(page, "configure", { christmasEnabled: true });
      await setTime(page, "2027-01-01T00:00:00-06:00");
      await page.getByRole("switch", { name: "Christmas date ideas", exact: true }).waitFor({ state: "hidden" });
      assert.equal(await page.getByRole("button", { name: "Pick our date", exact: true }).isDisabled(), false);
      await setTime(page, "2026-12-05T10:00:00-06:00"); await fixture(page, "setPublic", true);
      await page.getByRole("switch", { name: "Christmas date ideas", exact: true }).waitFor({ state: "hidden" });
      assert.equal(await page.getByRole("button", { name: "Pick our date", exact: true }).isDisabled(), false);
      await page.getByRole("button", { name: "Give us options", exact: true }).click();
      await page.getByRole("button", { name: "Close options", exact: true }).waitFor();
      assert.equal(await page.locator("[data-christmas-surface]").count(), 0, "all four HOLD events remain disabled in public Home");
      assert.match(await page.locator("body").innerText(), /Fixture ordinary cinema/);
      const state = await fixture(page, "state"); assert.deepEqual(state.dateNightFilters.activityTypes, ["movies"]);
      assert.deepEqual(state.christmasCategories, ["holiday-market"]);
      const requests = await fixture(page, "discovery");
      for (const request of requests) assert.ok(request.activityTypes.every(type => !type.startsWith("holiday-") && type !== "christmas-lights"));
    });
    await context.close();
  }
  await check("live Chicago final-start cutoff withdraws the Home recommendation without focus", async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, timezoneId: "America/Chicago", reducedMotion: "reduce", serviceWorkers: "block" });
    await context.route("**/*", route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      verdict.externalRequests.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage(); currentPage = page; page.setDefaultTimeout(10000);
    page.on("pageerror", error => verdict.pageErrors.push({ width: 390, message: error.message }));
    await page.clock.install({ time: new Date("2026-12-07T18:59:58-06:00") });
    await page.clock.pauseAt(new Date("2026-12-07T18:59:59-06:00"));
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.waitForFunction(() => Boolean(window.christmasFixture?.ready));
    await page.getByRole("button", { name: "Holiday Events", exact: true }).click();
    await page.getByRole("button", { name: "Pick our date", exact: true }).click();
    await page.locator('[data-christmas-surface="result"]').waitFor();
    // No focus event, reload or fixture recomputation: exercise the actual
    // clock subscription while the recommendation is already displayed.
    await page.clock.runFor(1002);
    await page.locator('[data-christmas-surface="result"]').waitFor({ state: "hidden" });
    assert.equal(await page.getByRole("button", { name: "Pick our date", exact: true }).isDisabled(), true);
    await page.getByRole("region", { name: "Published event schedules", exact: true }).waitFor();
    assert.match(await page.getByRole("region", { name: "Published event schedules", exact: true }).innerText(), /last announced start has passed/i);
    await context.close();
  });
  assert.deepEqual(verdict.pageErrors, []);
  assert.deepEqual(verdict.externalRequests, []);
  assert.equal(await fingerprint(), sourceFingerprint, "Source changed while browser acceptance ran");
  assert.equal(git("rev-parse", "HEAD"), sourceSha, "Candidate head changed during acceptance");
  verdict.passed = true;
} catch (error) {
  verdict.failure = { name: error.name, message: error.message, stack: error.stack };
  verdict.failureContext = await currentPage?.evaluate(() => ({
    events: window.christmasFixture?.events(),
    discovery: window.christmasFixture?.discovery(),
    surfaces: [...document.querySelectorAll("[data-christmas-surface]")].map(element => ({
      surface: element.getAttribute("data-christmas-surface"),
      position: getComputedStyle(element).position, rect: element.getBoundingClientRect().toJSON(),
    })),
  })).catch(() => null);
  await currentPage?.screenshot({ path: resolve(output, "failure.png"), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolveClose => server.close(resolveClose));
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify({ passed: verdict.passed, cases: verdict.cases.length, sourceSha, sourceTree, output, failure: verdict.failure }));
}
function filtersForBrowser() { return { radiusMiles: 15, activityTypes: ["anything"], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: false }; }
