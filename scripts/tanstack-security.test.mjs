import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { toJSONAsync } from "seroval";
import { runWithStartContext } from "@tanstack/start-storage-context";
import { serverFnFetcher } from "../node_modules/@tanstack/start-client-core/dist/esm/client-rpc/serverFnFetcher.js";
import { discoveryClock, untilAbort } from "./test-support/discovery-clock.mjs";

// Run the migration-free application build before this test. The fixture below
// compiles real Start GET/POST functions in a temporary app, never production routes.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const nativeFetch = globalThis.fetch;
const location = { lat: 43.65348, lon: -79.38393, radiusMiles: 15 };
const marker = "INERT_TANSTACK_SECURITY_MARKER";
let app, fixture, fixtureDir;

async function loadBuilt(project) {
  const output = join(project, ".vercel/output/functions/__server.func");
  const manifest = readFileSync(join(output, "_ssr/ssr.mjs"), "utf8");
  const ids = Object.fromEntries([...manifest.matchAll(/"([a-f0-9]{64})": \{\s*functionName: "([^"]+)"/g)]
    .map((match) => [match[2].replace(/_createServerFn_handler$/, ""), match[1]]));
  const built = (await import(pathToFileURL(join(output, "index.mjs")).href)).default;
  return { built, ids };
}

function compileFixture() {
  fixtureDir = mkdtempSync(join(tmpdir(), "pickforus-start-security-"));
  symlinkSync(join(root, "node_modules"), join(fixtureDir, "node_modules"), "dir");
  const files = {
    "package.json": JSON.stringify({ name: "isolated-start-security-fixture", private: true, type: "module" }),
    "vite.config.mjs": `import {defineConfig} from 'vite';
import {tanstackStart} from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react'; import {nitro} from 'nitro/vite';
export default defineConfig({plugins:[tanstackStart(),nitro({preset:'vercel'}),react()]});`,
    "src/router.tsx": `import {createRouter} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen'; export function getRouter(){return createRouter({routeTree})}`,
    "src/routes/__root.tsx": `import {createRootRoute,HeadContent,Outlet,Scripts} from '@tanstack/react-router';
export const Route=createRootRoute({component:()=> <html><head><HeadContent/></head><body><Outlet/><Scripts/></body></html>});`,
    "src/routes/index.tsx": `import {createFileRoute} from '@tanstack/react-router';
import {fixtureGet,fixturePost} from '../functions';
export const Route=createFileRoute('/')({loader:()=>fixtureGet({data:{op:'echo',value:'ready'}}),
component:()=> <button onClick={()=>fixturePost({data:{op:'echo',value:'ready'}})}>Fixture</button>});`,
    "src/functions.ts": `import {createServerFn} from '@tanstack/react-start';
async function respond(data){
  if(data.op==='throw') throw new Error('Fixture error');
  if(data.op==='response') return new Response('legitimate response',{status:202,headers:{'content-type':'text/plain','x-fixture':'real-response'}});
  if(data.op==='shape') return {status:200,headers:{'content-type':'text/html'},body:'INERT_TANSTACK_SECURITY_MARKER'};
  if(data.op==='delay') await new Promise(resolve=>setTimeout(resolve,200));
  return data.value;
}
const validate=data=>{if(!data||data.op==='invalid')throw new Error('Fixture validation');return data};
export const fixtureGet=createServerFn({method:'GET'}).validator(validate).handler(({data})=>respond(data));
export const fixturePost=createServerFn({method:'POST'}).validator(validate).handler(({data})=>respond(data));`,
  };
  for (const [name, source] of Object.entries(files)) {
    mkdirSync(dirname(join(fixtureDir, name)), { recursive: true });
    writeFileSync(join(fixtureDir, name), source);
  }
  try {
    execFileSync(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "build", "--mode", "production"],
      { cwd: fixtureDir, env: { ...process.env, NODE_ENV: "production" }, timeout: 60_000, maxBuffer: 4_000_000 });
  } catch (error) {
    throw new Error(`Isolated Start fixture compilation failed: ${error.stdout}\n${error.stderr}`, { cause: error });
  }
}

before(async () => {
  app = await loadBuilt(root);
  assert.deepEqual(Object.keys(app.ids).sort(), ["lookupLocation", "lookupReverseLocation", "searchDateNight", "searchNightlife", "searchRestaurants"].sort());
  compileFixture();
  fixture = await loadBuilt(fixtureDir);
  assert.deepEqual(Object.keys(fixture.ids).sort(), ["fixtureGet", "fixturePost"]);
});
after(() => rmSync(fixtureDir, { recursive: true, force: true }));

// This adapter invokes the actual Nitro/Start fetch entry, not a mocked RPC.
async function rpc(target, name, data, { method = "POST", signal, fetch: customFetch } = {}) {
  const adapter = customFetch ?? ((url, init) => target.built.fetch(new Request(url, init)));
  return runWithStartContext({ startOptions: {} }, async () => {
    const result = await serverFnFetcher(`https://security-fixture.invalid/_serverFn/${target.ids[name]}`,
      [{ method, data, signal, headers: { "sec-fetch-site": "same-origin" } }], adapter);
    if (result instanceof Response) return result;
    if (result.error !== undefined) throw result.error;
    return result.result;
  });
}

function providers(t) {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input);
    calls.push({ url: url.href, body: String(init?.body ?? "") });
    if (url.hostname === "nominatim.openstreetmap.org") {
      const place = { lat: String(location.lat), lon: String(location.lon), address: { city: "Toronto", state: "Ontario", country: "Canada", country_code: "ca" } };
      return Response.json(url.pathname === "/search" ? [place] : place);
    }
    assert.ok(["overpass.openstreetmap.fr", "overpass.private.coffee", "maps.mail.ru", "overpass-api.de"].includes(url.hostname), `Unexpected outbound provider ${url.hostname}`);
    return Response.json({ elements: [
      { type: "node", id: 910001, lat: location.lat, lon: location.lon, tags: { name: "Transport Fixture Restaurant", amenity: "restaurant", cuisine: "pizza" } },
      { type: "node", id: 910002, lat: location.lat + 0.01, lon: location.lon, tags: { name: "Transport Fixture Museum", tourism: "museum" } },
      { type: "node", id: 910003, lat: location.lat + 0.02, lon: location.lon, tags: { name: "Transport Fixture Bar", amenity: "bar" } },
      { type: "node", id: 910004, lat: location.lat + 0.03, lon: location.lon, tags: { name: "Transport Fixture Haunted House", attraction: "haunted_house" } },
    ] });
  });
  return calls;
}

test("all five actual compiled application POST functions succeed through the client codec", async (t) => {
  const calls = providers(t);
  const restaurants = await rpc(app, "searchRestaurants", location);
  assert.equal(restaurants.source, "live");
  assert.ok(restaurants.restaurants.some((place) => place.name === "Transport Fixture Restaurant"));
  for (const [name, data] of [["lookupLocation", { query: "Toronto, Ontario" }], ["lookupReverseLocation", location]]) {
    const result = await rpc(app, name, data);
    assert.equal(result.lat, location.lat);
    assert.equal(result.lon, location.lon);
    assert.equal(result.label, "Toronto, Ontario, Canada");
  }
  const dateNight = await rpc(app, "searchDateNight", { ...location, spookySeasonEnabled: false, activityTypes: ["museum"] });
  assert.equal(dateNight.source, "live");
  assert.ok(dateNight.venues.some((place) => place.activityTypes.includes("museum")));
  const nightlife = await rpc(app, "searchNightlife", location);
  assert.equal(nightlife.source, "live");
  assert.ok(nightlife.venues.some((place) => place.name === "Transport Fixture Bar"));
  assert.equal(calls.length, 5);
});

test("Date Night seasonal on/off survives real transport with a fixed October date", async (t) => {
  const calls = providers(t);
  const OriginalDate = Date;
  t.mock.method(globalThis, "Date", class extends OriginalDate {
    constructor(...args) { super(...(args.length ? args : ["2026-10-15T12:00:00Z"])); }
  });
  const off = await rpc(app, "searchDateNight", { ...location, spookySeasonEnabled: false });
  const offCalls = calls.length;
  const on = await rpc(app, "searchDateNight", { ...location, spookySeasonEnabled: true });
  assert.ok(!off.venues.some((place) => place.activityTypes.includes("haunted-house")));
  assert.ok(on.venues.some((place) => place.activityTypes.includes("haunted-house")));
  const affirmativeQuery = (call) => new URLSearchParams(call.body).get("data").split("\n")
    .filter((line) => !/^\s*nwr\["(disused|abandoned|was|demolished|removed|razed|destroyed):/.test(line)).join("\n");
  assert.ok(calls.slice(0, offCalls).every((call) => !affirmativeQuery(call).includes("haunted_house")));
  assert.ok(calls.slice(offCalls).some((call) => affirmativeQuery(call).includes("haunted_house")));
  assert.equal(off.discovery.groups.length, 3);
  assert.equal(on.discovery.groups.length, 4);
});

test("invalid application coordinates and queries produce decoded Errors without providers", async (t) => {
  const calls = providers(t);
  for (const name of ["searchRestaurants", "lookupReverseLocation", "searchDateNight", "searchNightlife"]) {
    for (const data of [{ ...location, lat: 91 }, { ...location, lon: Infinity }, { ...location, lat: "43" }]) {
      await assert.rejects(rpc(app, name, data), (error) => error instanceof Error);
    }
  }
  for (const query of ["", "bad\u0000query", "x".repeat(301), 12]) {
    await assert.rejects(rpc(app, "lookupLocation", { query }), (error) => error instanceof Error);
  }
  for (const activityTypes of [null, "movies", ["__proto__"], ["movies);out;"], [{ type: "movies" }]]) {
    await assert.rejects(rpc(app, "searchDateNight", { ...location, activityTypes }), (error) => error instanceof Error);
  }
  assert.equal(calls.length, 0);
});

for (const [name, method] of [["fixtureGet", "GET"], ["fixturePost", "POST"]]) {
  test(`${method} legitimate Seroval values, thrown Errors and falsy returns`, async () => {
    const value = { date: new Date("2026-10-01T12:00:00Z"), map: new Map([["key", 42]]), set: new Set([1, 2]), bigint: 12n, missing: undefined };
    assert.deepEqual(await rpc(fixture, name, { op: "echo", value }, { method }), value);
    for (const value of [false, 0, "", null, undefined]) {
      assert.equal(await rpc(fixture, name, { op: "echo", value }, { method }), value);
    }
    await assert.rejects(rpc(fixture, name, { op: "throw" }, { method }), { name: "Error", message: "Fixture error" });
  });

  test(`${method} ignores inert internal result/error fields, including failed validation`, async () => {
    for (const [op, isRpc] of [["echo", true], ["invalid", true], ["echo", false], ["invalid", false]]) {
      const payload = await toJSONAsync({ data: { op, value: { message: "legitimate" } },
        result: { status: 200, headers: { "content-type": "text/html" }, body: marker },
        error: { status: 200, headers: { "content-type": "text/html" }, body: marker },
        context: { result: marker, error: marker }, method: "GET" });
      const url = new URL(`https://security-fixture.invalid/_serverFn/${fixture.ids[name]}`);
      if (method === "GET") url.searchParams.set("payload", JSON.stringify(payload));
      const response = await fixture.built.fetch(new Request(url, { method,
        headers: { "sec-fetch-site": "same-origin", ...(isRpc ? { "x-tsr-serverfn": "true" } : {}), "content-type": "application/json", accept: isRpc ? "application/json" : "text/html" },
        ...(method === "POST" ? { body: JSON.stringify(payload) } : {}) }));
      assert.doesNotMatch(response.headers.get("content-type") ?? "", /text\/html/i);
      assert.notEqual(response.headers.get("x-tss-raw"), "true");
      const text = await response.text();
      assert.ok(!text.includes(marker), "Internal fields escaped the public input boundary");
      assert.equal(response.status, 200);
      assert.match(text, op === "echo" ? /legitimate/ : /Fixture validation/);
    }
  });

  test(`${method} safely serializes response-shaped data and preserves real Response`, async () => {
    const shaped = await rpc(fixture, name, { op: "shape" }, { method });
    assert.ok(!(shaped instanceof Response));
    assert.deepEqual(shaped, { status: 200, headers: { "content-type": "text/html" }, body: marker });
    const response = await rpc(fixture, name, { op: "response" }, { method });
    assert.ok(response instanceof Response);
    assert.equal(response.status, 202);
    assert.equal(response.headers.get("x-fixture"), "real-response");
    assert.equal(response.headers.get("content-type"), "text/plain");
    assert.equal(await response.text(), "legitimate response");
  });
}

test("compiled application and fixture enforce CSRF and methods before providers", async (t) => {
  const calls = providers(t);
  for (const [target, entries] of [[app, Object.keys(app.ids).map((name) => [name, "POST"])], [fixture, [["fixtureGet", "GET"], ["fixturePost", "POST"]]]]) {
    for (const [name, method] of entries) {
      const url = `https://security-fixture.invalid/_serverFn/${target.ids[name]}`;
      for (const headers of [{}, { origin: "https://cross-site.invalid" }, { "sec-fetch-site": "cross-site" }]) {
        const response = await target.built.fetch(new Request(url, { method, headers }));
        assert.equal(response.status, 403, `${name} CSRF`);
      }
      const wrong = method === "POST" ? "GET" : "POST";
      const response = await target.built.fetch(new Request(url, { method: wrong, headers: { "sec-fetch-site": "same-origin" } }));
      assert.equal(response.status, 405, `${name} method`);
      assert.equal(response.headers.get("allow"), method);
    }
  }
  assert.equal(calls.length, 0);
});

for (const name of ["searchRestaurants", "searchDateNight", "searchNightlife"]) {
test(`${name} compiled provider chain terminates at its total deadline with aborted attempts`, async (t) => {
  const clock = discoveryClock(t);
  const signals = [];
  t.mock.method(globalThis, "fetch", (_url, init) => {
    signals.push(init.signal);
    return untilAbort(init.signal);
  });
  const result = rpc(app, name, name === "searchDateNight" ? { ...location, activityTypes: ["movies"] } : location).then(() => null, (error) => error);
  await clock.tick(20_001);
  assert.ok(await result instanceof Error);
  assert.equal(signals.length, name === "searchDateNight" ? 4 : 3);
  assert.ok(signals.every((signal) => signal.aborted));
  assert.equal(clock.pending, 0);
});
}

test("real client transport cancels an in-flight HTTP request within a bounded deadline", async (t) => {
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const response = await fixture.built.fetch(new Request(`http://localhost${req.url}`, {
      method: req.method, headers: req.headers,
      ...(chunks.length ? { body: Buffer.concat(chunks) } : {}),
    }));
    if (res.destroyed) return;
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => { server.closeAllConnections(); server.close(); });
  const port = server.address().port;
  let entered = false;
  const transport = (url, init) => {
    entered = true;
    return nativeFetch(`http://127.0.0.1:${port}${new URL(url).pathname}`, init);
  };
  const start = performance.now();
  await assert.rejects(rpc(fixture, "fixturePost", { op: "delay", value: "late" },
    { signal: AbortSignal.timeout(30), fetch: transport }), (error) => error.name === "TimeoutError");
  assert.ok(entered);
  assert.ok(performance.now() - start < 1_000);
  const abort = new AbortController();
  abort.abort();
  entered = false;
  await assert.rejects(rpc(fixture, "fixturePost", { op: "echo", value: 1 },
    { signal: abort.signal, fetch: transport }), { name: "AbortError" });
  assert.equal(entered, false);
});
