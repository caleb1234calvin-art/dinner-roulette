/** Benchmark only. No source mutations; no provider requests outside the real app. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { terminalState } from './runner-lifecycle.mjs';

const hash = x => createHash('sha256').update(x).digest('hex');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const realUTC = () => new Date().toISOString();
function durableWrite(file, data) { const fd = fs.openSync(file, 'w'); try { fs.writeFileSync(fd, data); fs.fsyncSync(fd); } finally { fs.closeSync(fd); } }
export function extractPatchId(request, expectedPatches = []) {
  const input = `${request.url()} ${request.postData() || ''}`;
  let decoded = input;
  try { decoded = decodeURIComponent(input); } catch {}
  // Match complete serialized string tokens, never a sector prefix (50:1 vs 50:10).
  const tokens = new Set(decoded.match(/[A-Za-z0-9_:-]+/g) || []);
  const matches = expectedPatches.map(p => typeof p === 'string' ? p : p.id).filter(id => tokens.has(id));
  if (matches.length > 1) throw new Error('Ambiguous RPC patch attribution');
  return matches[0] || null;
}
export async function readDecodedRPC(root, response, body) {
  const modulePath = path.join(root, 'node_modules/@tanstack/start-client-core/dist/esm/client-rpc/serverFnFetcher.js');
  const { serverFnFetcher } = await import(pathToFileURL(modulePath));
  // Exact installed transport decoder. The supplied fetch returns retained bytes only.
  const { runWithStartContext } = await import(pathToFileURL(path.join(root, 'node_modules/@tanstack/start-storage-context/dist/esm/index.js')));
  // Node-only decoding context; never enters or replaces the actual application's handler.
  return runWithStartContext({ startOptions: {} }, () => serverFnFetcher(response.url(), [{ method: 'POST', data: {} }], async () =>
    new Response(body, { status: response.status(), headers: await response.allHeaders() })));
}
export async function decodeRPCEnvelope(root, response, body) {
  try { return await readDecodedRPC(root, response, body); }
  catch (transportError) {
    // Only a successfully deserialized Error at the exact JSON error-envelope root
    // can explain a transport decoder throw. Invalid JSON/framing remains integrity failure.
    const headers = new Headers(await response.allHeaders());
    if (headers.get('x-tss-serialized') !== 'true' || !headers.get('content-type')?.includes('application/json')) throw transportError;
    const require = createRequire(path.join(root, 'package.json'));
    let decoded;
    try { decoded = require('seroval').fromCrossJSON(JSON.parse(body.toString()), { refs: new Map() }); }
    catch { throw transportError; }
    if (!(decoded instanceof Error) || decoded.name !== transportError.name || decoded.message !== transportError.message) throw transportError;
    return { error: decoded };
  }
}
export function recognizedAcquisitionFailure(decoded, physicalOutcomes) {
  const error = decoded instanceof Error ? decoded : decoded?.error;
  if (!(error instanceof Error) || !physicalOutcomes.length || physicalOutcomes.some(p => !['failure', 'timeout', 'rate-limited'].includes(p.outcome))) return null;
  const http = error.message.match(/^Overpass (\d{3})$/);
  const known = http ? Number(http[1]) >= 400 && physicalOutcomes.some(p => p.metadata?.status === Number(http[1]))
    : error.message === 'Could not load date-night activities for that area.'
      || error.message === 'Provider request timed out' && physicalOutcomes.some(p => p.outcome === 'timeout')
      || error.message === 'Live discovery returned an incomplete response. Please try again.' && physicalOutcomes.some(p => p.metadata?.validProviderPayload === false)
      || physicalOutcomes.some(p => p.metadata?.error?.message === error.message && p.metadata?.error?.name === error.name);
  return known ? { name: error.name, message: error.message, alignedPhysicalAttempts: physicalOutcomes.map(p => p.attempt) } : null;
}

function findAcquisition(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value.venues) && value.discovery?.groups) return value;
  for (const child of Object.values(value)) { const found = findAcquisition(child, seen); if (found) return found; }
  return null;
}

/** Runs in page: observe committed DOM and React props, never call app internals. */
function installObserver({ epoch, state }) {
  const NativeDate = Date, anchor = NativeDate.now();
  const advancingEpoch = () => epoch + NativeDate.now() - anchor;
  class PolicyDate extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [advancingEpoch()])); }
    static now() { return advancingEpoch(); }
  }
  Object.defineProperty(window, 'Date', { value: PolicyDate });
  localStorage.setItem('pick-for-us-v1', JSON.stringify({ state, version: 0 }));
  sessionStorage.setItem('dinner-roulette-hint-seen', '1');
  const controls = { pick: 'Pick our date', options: 'Give us options', plan: 'Plan the night' };
  const visible = el => {
    if (!el || !el.getClientRects().length) return false;
    const style = getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity) > 0;
  };
  const json = value => { try { return JSON.parse(JSON.stringify(value)); } catch { return null; } };
  function fibers() {
    const element = document.getElementById('root') || document.body;
    let root;
    for (const el of [element, ...document.querySelectorAll('body > *')]) {
      const key = Object.keys(el).find(k => k.startsWith('__reactContainer$'));
      if (key) { root = el[key]?.stateNode?.current || el[key]?.current || el[key]; break; }
    }
    if (!root) {
      const el = document.querySelector('main');
      const key = el && Object.keys(el).find(k => k.startsWith('__reactFiber$'));
      root = key && el[key];
      while (root?.return) root = root.return;
      root = root?.stateNode?.current || root;
    }
    const result = [], stack = root ? [root] : [], seen = new Set();
    while (stack.length) {
      const f = stack.pop(); if (!f || seen.has(f)) continue; seen.add(f); result.push(f);
      if (f.child) stack.push(f.child); if (f.sibling) stack.push(f.sibling);
    }
    return result;
  }
  let last = '', scheduled = false;
  const history = [];
  function read() {
    const body = document.body;
    if (!body) return null;
    const text = body.innerText;
    const count = text.match(/(\d+) activities match/);
    const enabled = Object.fromEntries(Object.entries(controls).map(([key, title]) => {
      const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === title);
      return [key, button ? !button.disabled : null];
    }));
    const all = fibers(); let coverage = null, overlay = null, eligiblePool = null;
    for (const f of all) {
      let hook = f.memoizedState, cap = 0;
      while (hook && typeof hook === 'object' && cap++ < 100) {
        const v = hook.memoizedState;
        if (count && Array.isArray(v) && Array.isArray(v[0]) && v[0].length === Number(count[1]) && v[0].every(item => item && typeof item.id === 'string' && Number.isFinite(item.distanceMiles))) eligiblePool = json(v[0]);
        if (v?.patches && Array.isArray(v.failedPatchIds) && 'continuousRadiusMiles' in v) coverage = json(v);
        hook = hook.next;
      }
      const p = f.memoizedProps;
      if (typeof f.type === 'string' || !p) continue;
      if (p.restaurant && p.onReroll && p.mode === 'date-night') {
        const close = document.querySelector('[aria-label="Close result"]');
        const h = [...document.querySelectorAll('h2')].find(el => el.textContent === p.restaurant.name);
        if (visible(close) && visible(h)) overlay = { control: 'pick', venues: json([p.restaurant]), decisionKeys: [p.decisionIdentity?.id || p.restaurant.id], titles: [h.textContent] };
      }
      if (p.restaurants && p.onShuffle && p.onClose) {
        const close = document.querySelector('[aria-label="Close options"]');
        const titles = [...document.querySelectorAll('article h3')].filter(visible).map(el => el.textContent);
        if (visible(close) && titles.length === p.restaurants.length) overlay = { control: 'options', venues: json(p.restaurants), decisionKeys: json(p.decisionKeys), titles };
      }
      if (p.plan && p.onReplan && p.onClose) {
        const close = document.querySelector('[aria-label="Close night plan"]');
        const valid = text.includes('Your night has an arc.');
        if (visible(close)) overlay = { control: 'plan', venues: json(p.plan), decisionKeys: json(p.decisionKeys), validPair: valid, noPairText: text.includes('No complete seasonal pair yet.'), titles: [...document.querySelectorAll('h3')].filter(visible).map(el => el.textContent) };
      }
    }
    return { browserMs: performance.now(), selectedRadius: Number(text.match(/Within (\d+) miles/)?.[1]) || null, eligibleCount: count ? Number(count[1]) : null, enabled, coverage,
      phase: document.querySelector('[data-date-night-phase]')?.getAttribute('data-date-night-phase') || null,
      progress: document.querySelector('[data-radial-progress]')?.textContent || null,
      readyLabel: /\bReady\b/i.test(document.querySelector('[data-radial-progress]')?.textContent || ''),
      loading: text.includes('Finding date ideas'), eligiblePool, overlay };
  }
  function capture() {
    scheduled = false;
    const snapshot = read(); if (!snapshot) return;
    const signature = JSON.stringify({ ...snapshot, browserMs: 0 });
    if (signature !== last) {
      last = signature; history.push(snapshot);
      window.__benchEmit?.(snapshot).catch(() => {});
    }
  }
  window.__benchmark = { read, history };
  new MutationObserver(() => { if (!scheduled) { scheduled = true; requestAnimationFrame(capture); } }).observe(document, { childList: true, subtree: true, attributes: true, characterData: true });
  // Catch animation visibility changes and React commits without observable text changes.
  setInterval(capture, 50);
  try { new PerformanceObserver(list => {
    for (const entry of list.getEntries()) window.__benchLongTask?.({ browserMs: entry.startTime, duration: entry.duration }).catch(() => {});
  }).observe({ entryTypes: ['longtask'] }); } catch {}
}

export function usable(overlay, job) {
  if (!overlay?.venues?.length || !overlay.titles?.length) return false;
  const categories = job.activityTypes || ['movies'];
  const ids = new Set();
  for (const v of overlay.venues) {
    if (!v.id || !v.name || ids.has(v.id) || !overlay.titles.includes(v.name)) return false;
    ids.add(v.id);
    if (!Number.isFinite(v.distanceMiles) || v.distanceMiles > job.radiusMiles + 1e-6) return false;
    if (![v.lat, v.lon, job.lat, job.lon].every(Number.isFinite)) return false;
    const radians = degrees => degrees * Math.PI / 180;
    const a = Math.sin(radians(v.lat - job.lat) / 2) ** 2 + Math.cos(radians(job.lat)) * Math.cos(radians(v.lat)) * Math.sin(radians(v.lon - job.lon) / 2) ** 2;
    const originDistance = 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
    if (originDistance > job.radiusMiles + 0.01) return false;
    if (!v.activityTypes?.some(t => categories.includes(t))) return false;
  }
  return overlay.control !== 'plan' || (overlay.validPair && ids.size === 2);
}

/** Same terminal predicate used by the real browser loop and offline tests. */
export function browserTerminal({ snapshot, rpc, expected, activeRpc, activePhysical, idleMs, interactionsDone }) {
  if (!snapshot || idleMs < 1500 || !interactionsDone) return { terminal: false };
  const patches = rpc.filter(r => r.patchId && r.end);
  const attempted = new Set(patches.map(r => r.patchId));
  const expectedIds = expected.map(p => typeof p === 'string' ? p : p.id);
  const degraded = r => Boolean(snapshot.coverage?.patches.find(p => p.id === r.patchId)?.missingActivityTypes?.length);
  const failedCore = patches.some(r => degraded(r) && expected.find(p => p.id === r.patchId)?.innerMiles === 0);
  const lastThreeFailed = patches.length >= 3 && patches.slice(-3).every(degraded);
  const paused = failedCore || lastThreeFailed;
  // Exact receipts must account for all planned work unless exact source pause rules apply.
  if (!paused && !expectedIds.every(id => attempted.has(id))) return { terminal: false };
  const result = terminalState({ activeRpc, activePhysical, expectedIds, attemptedIds: [...attempted], settledIds: [...attempted],
    loading: snapshot.loading, expanding: /expanding|checking background coverage/i.test(snapshot.progress || ''),
    paused, complete: Boolean(snapshot.coverage?.complete), elapsedMs: 0, stopped: false });
  return result.terminal ? { ...result, outcome: result.outcome === 'partial' ? 'quiescent-partial' : result.outcome } : result;
}

export async function runBrowserCase({ root, job, output, ledger, server, origin, policyClock }) {
  job = { ...job, id: job.id || job.caseId, city: job.city || job.location };
  fs.mkdirSync(output, { recursive: true });
  const journalFd = fs.openSync(path.join(output, 'browser-events.jsonl'), 'a');
  const emit = (type, detail = {}) => {
    const event = { type, caseId: job.id, monotonicMs: performance.now(), utc: realUTC(), ...detail };
    fs.writeSync(journalFd, JSON.stringify(event) + '\n'); fs.fsyncSync(journalFd);
    return event;
  };
  const require = createRequire(path.join(root, 'package.json'));
  let playwright;
  try { playwright = require('playwright'); } catch { playwright = require('@playwright/test'); }
  const expected = job.expectedPatches || [];
  if (!expected.length) throw new Error('Exact expectedPatches required');
  const epoch = typeof policyClock === 'number' ? policyClock : Date.parse(policyClock);
  if (!Number.isFinite(epoch)) throw new Error('Frozen policy clock required');
  const order = job.controlOrder || ['pick', 'options', 'plan'];
  const metrics = { eligibilityFirstSeen: {}, openDecisionSettlements: [], controlOrder: order, reducedMotion: job.reducedMotion || 'no-preference', controls: {}, snapshots: [], longTasks: [], warm: [] };
  const rpc = [], active = new Set(), handlers = new Set();
  let handlerCursor = 0;
  const flushHandlers = () => {
    while (rpc[handlerCursor]?.handlerReady) {
      const record = rpc[handlerCursor++];
      ledger.handler({ caseId: job.id, rpcId: record.id, patchId: record.patchId, phase: record.phase, successfulProviderGroup: Boolean(record.success), whollyFailed: Boolean(record.whollyFailed), groups: record.groups || [], canceled: Boolean(record.canceled), ...record });
    }
  };
  let coldFinished = false;
  let browser, context, page, finalState, terminal = 'deadline', lastRPC = performance.now(), integrityError;
  const stopped = () => Boolean(ledger.snapshot().stop || ledger.snapshot().stopped || ledger.snapshot().stopReason);
  const start = performance.now();
  const state = job.state || { homeMode: 'date-night', spookySeasonEnabled: true,
    location: { lat: job.lat, lon: job.lon, label: job.city, source: 'manual' },
    dateNightFilters: { radiusMiles: job.radiusMiles, activityTypes: job.activityTypes || ['movies'], mood: 50, openNowOnly: false, favoritesOnly: false, reduceParks: false },
    preferences: {}, visits: [], exclusions: [], sessionShown: [], sessionDate: new Date(epoch).toISOString().slice(0, 10), theme: 'dark' };
  const closeOverlay = async () => {
    const button = page.locator('[aria-label="Close result"], [aria-label="Close options"], [aria-label="Close night plan"]').first();
    if (await button.count()) await button.click({ timeout: 3000 });
  };
  const absorb = snapshot => {
    if (coldFinished) { emit('warm-dom', snapshot); return; }
    finalState = snapshot; metrics.snapshots.push(snapshot); emit('dom', snapshot);
    for (const venue of snapshot.eligiblePool || []) if (!metrics.eligibilityFirstSeen[venue.id]) metrics.eligibilityFirstSeen[venue.id] = { browserMs: snapshot.browserMs, venue };
    if (snapshot.eligibleCount > 0 && metrics.firstEligibleMs === undefined) metrics.firstEligibleMs = snapshot.browserMs;
    if (snapshot.eligibleCount !== null && metrics.domEligibleMs === undefined) metrics.domEligibleMs = snapshot.browserMs;
    if (snapshot.readyLabel && metrics.readyLabelMs === undefined) metrics.readyLabelMs = snapshot.browserMs;
    for (const name of ['pick', 'options', 'plan']) {
      const c = metrics.controls[name] ||= {};
      if (snapshot.enabled[name] && c.enabledMs === undefined) c.enabledMs = snapshot.browserMs;
    }
    const overlay = snapshot.overlay;
    if (usable(overlay, job)) {
      const c = metrics.controls[overlay.control];
      if (c.renderedMs === undefined && c.clickMs !== undefined) {
        c.renderedMs = snapshot.browserMs; c.clickToRenderMs = snapshot.browserMs - c.clickMs;
        c.identities = overlay.venues; c.uniqueCount = overlay.venues.length;
        c.fullFour = overlay.control === 'options' ? overlay.venues.length === 4 : undefined;
      }
    }
  };
  try {
    if (stopped()) throw new Error('Global stop already latched');
    browser = await playwright.chromium.launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: metrics.reducedMotion, serviceWorkers: 'block' });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort('blockedbyclient'));
    await context.addInitScript(installObserver, { epoch, state });
    page = await context.newPage();
    await page.exposeBinding('__benchEmit', (_, snapshot) => absorb(snapshot));
    await page.exposeBinding('__benchLongTask', (_, entry) => { metrics.longTasks.push(entry); emit('longtask', entry); });
    page.on('pageerror', error => emit('page-error', { error: String(error) }));
    page.on('request', request => {
      if (!request.url().includes('/_serverFn/') && !request.headers()['x-tsr-serverfn']) return;
      const payload = request.postData() || decodeURIComponent(request.url());
      if (!payload.includes('activityTypes')) { emit('other-local-rpc-start', { url: request.url(), method: request.method(), requestBody: request.postData() }); return; }
      const record = { id: `${job.id}-rpc-${rpc.length + 1}`, url: request.url(), method: request.method(), requestBody: request.postData(), patchId: extractPatchId(request, expected), start: performance.now() };
      record.phase = record.patchId ? (job.strategy === 'A' ? 'radial-primary' : 'audit') : 'primary'; rpc.push(record); active.add(request); request.__benchRecord = record;
      lastRPC = performance.now(); emit('rpc-start', record);
    });
    async function settle(request, response, failure) {
      const record = request.__benchRecord; if (!record || record.settled) return;
      record.settled = true;
      try {
        if (response) {
          record.status = response.status();
          const body = await response.body(); record.bytes = body.length; record.sha256 = hash(body);
          durableWrite(path.join(output, `${record.id}.rpc-body`), body);
          record.decoded = await decodeRPCEnvelope(root, response, body);
          record.acquisition = findAcquisition(record.decoded);
          if (!record.acquisition) {
            const outcomes = ledger.outcomesFor?.({ caseId: job.id, phase: record.phase, patchId: record.patchId }) || [];
            record.applicationError = recognizedAcquisitionFailure(record.decoded, outcomes);
            if (!record.applicationError) throw new Error('RPC response lacks acquisition receipts or verified application failure');
            record.success = false; record.whollyFailed = true; record.groups = [];
          } else {
          if (record.acquisition.patch?.id && record.acquisition.patch.id !== record.patchId) throw new Error('Patch response attribution mismatch');
          record.groups = record.acquisition.discovery.groups;
          record.success = record.groups.some(g => ['succeeded-nonempty', 'succeeded-empty'].includes(g.outcome));
          record.whollyFailed = record.groups.length > 0 && record.groups.every(g => g.outcome === 'failed');
          }
        } else { record.success = false; record.failure = failure; record.canceled = /abort|cancel/i.test(failure || ''); record.whollyFailed = !record.canceled; }
      } catch (error) { record.decodeError = String(error); integrityError = String(error); await ledger.stop('browser-rpc-integrity'); }
      finally {
        record.end = performance.now(); active.delete(request); lastRPC = performance.now();
        emit('rpc-settle', record);
        record.handlerReady = true; flushHandlers();
        if (page && !page.isClosed()) {
          const receipt = await page.evaluate(url => ({ snapshot: window.__benchmark?.read(), resource: performance.getEntriesByName(url, 'resource').at(-1)?.toJSON() ?? null }), record.url).catch(() => null);
          const open = receipt?.snapshot; record.responseEndBrowserMs = receipt?.resource?.responseEnd; record.startBrowserMs = receipt?.resource?.startTime;
          if (open?.overlay) { const observation = { rpcId: record.id, phase: record.phase, patchId: record.patchId, snapshot: open }; metrics.openDecisionSettlements.push(observation); emit('open-at-rpc-settlement', observation); }
        }
      }
    }
    const track = promise => { handlers.add(promise); promise.catch(error => { integrityError = String(error); }).finally(() => handlers.delete(promise)); };
    page.on('requestfinished', request => track(request.response().then(response => settle(request, response))));
    page.on('requestfailed', request => track(settle(request, null, request.failure()?.errorText || 'failed')));
    emit('navigate', { origin, policyClock, state, expected, controlOrder: order });
    await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 30000 });
    let controlIndex = 0, shownAt = 0;
    while (performance.now() - start < 180000 && !stopped()) {
      const snapshot = await page.evaluate(() => window.__benchmark?.read());
      if (snapshot) absorbIfChanged(snapshot);
      const next = order[controlIndex];
      if (next && finalState?.enabled[next] && (!shownAt || performance.now() - shownAt > 1500)) {
        await closeOverlay();
        const label = { pick: 'Pick our date', options: 'Give us options', plan: 'Plan the night' }[next];
        // Actual trusted Playwright click; timestamp from capture-phase DOM click listener.
        await page.evaluate(({ label, name }) => {
          document.addEventListener('click', function clicked(event) {
            if (event.target.closest('button')?.textContent.trim() !== label) return;
            window.__benchClick = { name, browserMs: performance.now() }; document.removeEventListener('click', clicked, true);
          }, true);
        }, { label, name: next });
        await page.getByRole('button', { name: label, exact: true }).click({ timeout: 3000 });
        const click = await page.evaluate(() => window.__benchClick);
        metrics.controls[next].clickMs = click.browserMs; emit('control-click', click);
        const first = metrics.snapshots.find(s => s.browserMs >= click.browserMs && s.overlay?.control === next && usable(s.overlay, job));
        if (first) Object.assign(metrics.controls[next], { renderedMs: first.browserMs, clickToRenderMs: first.browserMs - click.browserMs, identities: first.overlay.venues, uniqueCount: first.overlay.venues.length, fullFour: next === 'options' ? first.overlay.venues.length === 4 : undefined });
        const until = performance.now() + 10000;
        while (performance.now() < until && !stopped()) {
          const s = await page.evaluate(() => window.__benchmark.read()); absorbIfChanged(s);
          if (usable(s.overlay, job) || (next === 'plan' && s.overlay?.control === 'plan')) {
            absorb(s);
            if (next === 'plan' && s.overlay.noPairText && !s.overlay.validPair) Object.assign(metrics.controls.plan, { status: 'not-applicable-no-seasonal-pair', noPairUXMs: s.browserMs, clickToNoPairUXMs: s.browserMs - click.browserMs, truthfulNoPair: true });
            break;
          }
          await delay(50);
        }
        await page.screenshot({ path: path.join(output, `${next}-first-render.png`) });
        shownAt = performance.now(); controlIndex++;
      }
      const termination = browserTerminal({ snapshot: finalState, rpc, expected,
        activeRpc: active.size + handlers.size, activePhysical: ledger.snapshot().pending.length,
        idleMs: performance.now() - lastRPC, interactionsDone: controlIndex >= order.length || !finalState?.eligibleCount });
      if (termination.terminal) { terminal = termination.outcome; break; }
      await delay(50);
    }
    if (stopped()) terminal = 'global-stop';
    if (integrityError) terminal = 'integrity-hold';
    if (terminal === 'deadline') await ledger.stop('case-deadline');
    coldFinished = true;
    emit('cold-terminal', { terminal, finalState });
    await page.screenshot({ path: path.join(output, 'cold-final.png') });
    // Warm controls use the same browser/session; only proven complete authority permits radius switches.
    if (terminal === 'complete' && !stopped()) {
      const radii = job.radiusMiles === 50 ? [50, 20, 1, 20, 50] : [20, 15, 1, 15, 20];
      for (const radius of radii) {
        if (performance.now() - start > 165000 || stopped()) { metrics.warm.push({ skipped: 'Case observation limit approaching' }); break; }
        await closeOverlay(); const priorRPC = rpc.length;
        const slider = page.getByRole('slider', { name: 'Travel distance' });
        const options = [1, 3, 5, 10, 15, 20, 30, 40, 50];
        const track = slider.locator('xpath=ancestor::*[contains(@class,"touch-none")][1]');
        await track.scrollIntoViewIfNeeded();
        await page.evaluate(() => {
          window.__benchRadiusClick = null;
          document.addEventListener('pointerdown', function down() { window.__benchRadiusClick = performance.now(); document.removeEventListener('pointerdown', down, true); }, true);
        });
        const box = await track.boundingBox();
        if (!box) throw new Error('Radius slider missing');
        await track.click({ position: { x: Math.max(1, Math.min(box.width - 1, box.width * options.indexOf(radius) / 8)), y: box.height / 2 } });
        const before = await page.evaluate(() => window.__benchRadiusClick);
        const warmDOM = await page.evaluate(async ({ radius, before }) => {
          for (let i = 0; i < 120; i++) {
            await new Promise(requestAnimationFrame);
            const s = window.__benchmark.read();
            if (s.selectedRadius === radius && !s.loading && s.eligibleCount !== null) return s;
          }
          return null;
        }, { radius, before });
        const decisionStart = await page.evaluate(() => performance.now());
        if (warmDOM?.enabled.pick) await page.getByRole('button', { name: 'Pick our date', exact: true }).click({ timeout: 3000 });
        const deadline = performance.now() + 10000; let rendered;
        while (warmDOM?.enabled.pick && performance.now() < deadline) {
          const s = await page.evaluate(() => window.__benchmark.read());
          if (usable(s.overlay, { ...job, radiusMiles: radius })) { rendered = s; break; }
          await delay(25);
        }
        const warm = { radius, startBrowserMs: before, eligibleDOMMs: warmDOM?.browserMs,
          radiusToEligibleDOMMs: warmDOM ? warmDOM.browserMs - before : null,
          observedDecisionRenderMs: rendered?.browserMs, decisionInteractionToRenderMs: rendered ? rendered.browserMs - decisionStart : null,
          newRPCs: rpc.length - priorRPC, overlay: rendered?.overlay,
          note: 'Radius pointerdown to next eligible DOM animation-frame observation; actual Pick render separately includes ordinary animation and trusted click overhead.' };
        metrics.warm.push(warm); emit('warm', warm);
        if (warm.newRPCs) { await ledger.stop('unexpected-warm-network'); terminal = 'integrity-hold'; break; }
      }
    } else metrics.warm.push({ skipped: 'No complete acquisition authority' });
    emit('case-final', { terminal, finalState, metrics });
  } catch (error) {
    integrityError = String(error); terminal = 'integrity-hold'; emit('case-error', { error: integrityError }); await ledger.stop('browser-case-error');
  } finally {
    await context?.close().catch(() => {});
    await browser?.close().catch(() => {});
    await Promise.race([Promise.allSettled([...handlers]), delay(10000)]);
    if (active.size || handlers.size) { terminal = 'integrity-hold'; await ledger.stop('unsettled-browser-rpc'); }
    fs.closeSync(journalFd);
  }
  metrics.eligibilityProvenance = Object.values(metrics.eligibilityFirstSeen).map(({ browserMs, venue }) => ({
    id: venue.id, browserMs, curated: venue.id.startsWith('date-night-curated') || venue.discoveryEvidence?.some(e => e.source === 'catalog') || false,
    receipts: rpc.filter(r => r.acquisition?.venues.some(v => v.id === venue.id || v.discoveryEvidence?.some(e => e.id === venue.id) || venue.discoveryEvidence?.some(e => e.id === v.id))).map(r => ({ rpcId: r.id, phase: r.phase, patchId: r.patchId, settledMonotonicMs: r.end, responseEndBrowserMs: r.responseEndBrowserMs, availableAtFirstEligibility: Number.isFinite(r.responseEndBrowserMs) && r.responseEndBrowserMs <= browserMs }))
  }));
  const acquisitionStarts = rpc.map(r => r.startBrowserMs).filter(Number.isFinite);
  metrics.firstAcquisitionDispatchMs = acquisitionStarts.length ? Math.min(...acquisitionStarts) : null;
  metrics.primarySettlement = rpc.filter(r => r.phase === 'primary').map(r => ({ start: r.start, end: r.end, browserResponseEndMs: r.responseEndBrowserMs, success: r.success }));
  metrics.lastAuditSettlementMonotonicMs = rpc.filter(r => r.patchId).reduce((max, r) => Math.max(max, r.end || 0), 0) || null;
  metrics.auditCompletionMonotonicMs = terminal === 'complete' ? metrics.lastAuditSettlementMonotonicMs : null;
  const receiptMatches = (r, v) => r.acquisition?.venues.some(item => item.id === v.id || item.discoveryEvidence?.some(e => e.id === v.id) || v.discoveryEvidence?.some(e => e.id === item.id));
  const liveFirst = metrics.snapshots.filter(s => s.eligiblePool?.some(v =>
    (v.source === 'osm' || v.discoveryEvidence?.some(e => e.source === 'osm')) && rpc.some(r => Number.isFinite(r.responseEndBrowserMs) && r.responseEndBrowserMs <= s.browserMs && receiptMatches(r, v)))).map(s => s.browserMs);
  metrics.firstUsefulLiveEligibleMs = liveFirst.length ? Math.min(...liveFirst) : null;
  const failedPrimary = rpc.find(r => r.phase === 'primary' && r.whollyFailed);
  const recovery = failedPrimary ? metrics.snapshots.filter(s => s.eligiblePool?.some(v =>
    (v.source === 'osm' || v.discoveryEvidence?.some(e => e.source === 'osm')) && rpc.some(r => r.phase === 'audit' && r.success && Number.isFinite(r.responseEndBrowserMs) && r.responseEndBrowserMs <= s.browserMs && receiptMatches(r, v)))).map(s => s.browserMs) : [];
  metrics.firstAuditRecoveryEligibleMs = recovery.length ? Math.min(...recovery) : null;
  const result = { caseId: job.id, terminal, censorReason: terminal === 'deadline' ? '180-second-case-observation-limit' : null, finalState, metrics, rpc, integrityError, activeRPCs: active.size, serverManagedExternally: Boolean(server), navigationOrigin: 'performance.timeOrigin; DOM and clicks use performance.now()', timingResolutionMs: 50 };
  durableWrite(path.join(output, 'browser-result.json'), JSON.stringify(result, null, 2));
  return result;
  function absorbIfChanged(snapshot) {
    const previous = finalState && JSON.stringify({ ...finalState, browserMs: 0 });
    if (JSON.stringify({ ...snapshot, browserMs: 0 }) !== previous) absorb(snapshot);
  }
}
