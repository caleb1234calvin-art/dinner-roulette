import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";
import * as shared from "./grok-pwa-shared.mjs";
import { grokPwaPlugin } from "./grok-pwa-plugin.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const snapshot = shared.snapshotOgIdentity(ROOT);
const hosts = ["pickforus.app", "dinner-roulette-chi.vercel.app", "dinner-roulette-candidate-minions.vercel.app"];
const paths = ["/", "/settings", "/history", "/favorites"];
const description = "Can't decide what to do? Set the rules. Pick For Us helps choose food, date nights, and nightlife.";
// Deliberately conflicting input from earlier producers, including varied
// attribute order/case/quotes. The real final middleware must replace it.
const input = `<!doctype html><html><head><title>Pick For Us</title>
<link href='/old-manifest' rel='manifest'><link rel="manifest" href="/manifest.webmanifest">
<link href='/old-touch' REL='apple-touch-icon'><link rel="apple-touch-icon" href="/favicon.svg">
<link href='https://preview.invalid/?utm_source=x' rel='canonical'>
<link rel="canonical" href="https://old.invalid/">
<meta content='index,follow' name='robots'><meta name="description" content="old description">
<meta property="og:url" content="https://preview.invalid/"><meta property="og:site_name" content="Wrong">
<meta name="twitter:title" content="Wrong"><meta name="twitter:image" content="http://wrong.invalid/image">
</head><body>Pick For Us — café 🧭</body></html>`;

function tags(html, element) {
  return [...html.matchAll(new RegExp(`<${element}\\b[^>]*>`, "gi"))].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)]
      .map(([, key, value]) => [key.toLowerCase(), value.replaceAll("&#39;", "'").replaceAll("&amp;", "&")])));
}

function assertHead(html, host, path) {
  const meta = tags(html, "meta");
  const links = tags(html, "link");
  const value = (key) => {
    const found = meta.filter((tag) => (tag.name ?? tag.property) === key);
    assert.equal(found.length, 1, `exactly one ${key}`);
    return found[0].content;
  };
  const link = (rel) => {
    const found = links.filter((tag) => tag.rel.toLowerCase() === rel);
    assert.equal(found.length, 1, `exactly one ${rel}`);
    return found[0].href;
  };
  assert.deepEqual([...html.matchAll(/<title[^>]*>([^<]*)<\/title>/gi)].map((m) => m[1]), ["Pick For Us"]);
  assert.equal(link("canonical"), `https://pickforus.app${path}`);
  assert.equal(value("og:url"), `https://pickforus.app${path}`);
  assert.equal(value("robots"), !host.includes("candidate") && path === "/" ? "index,follow" : "noindex,follow");
  assert.equal(value("og:type"), "website");
  assert.equal(value("og:site_name"), "Pick For Us");
  assert.equal(value("og:title"), "Pick For Us");
  assert.equal(value("description"), description);
  assert.equal(value("og:description"), description);
  assert.equal(value("og:image"), "https://pickforus.app/og.jpg");
  assert.equal(value("twitter:card"), "summary_large_image");
  assert.equal(value("twitter:title"), "Pick For Us");
  assert.equal(value("twitter:description"), description);
  assert.equal(value("twitter:image"), "https://pickforus.app/og.jpg");
  assert.equal(link("manifest"), "/manifest.webmanifest");
  assert.equal(link("apple-touch-icon"), "/apple-touch-icon.png");
  assert.doesNotMatch(html, /preview\.invalid|old\.invalid|wrong\.invalid|utm_source|Grok App/);
  assert.match(html, /café 🧭/);
}

// Execute the actual deployed middleware. Only Vite's raw/virtual import
// resolution is supplied; no middleware or head-transform logic is mocked.
const source = readFileSync(join(ROOT, "server/middleware/grok-pwa.ts"), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
const module = { exports: {} };
new Function("require", "module", "exports", outputText)((id) => {
  if (id.endsWith("install-page.html?raw")) return { default: readFileSync(join(ROOT, "scripts/install-page.html"), "utf8") };
  if (id === "virtual:grok-og-identity") return { grokOgIdentity: snapshot };
  if (id.endsWith("grok-pwa-shared.mjs")) return shared;
  throw new Error(`Unexpected middleware dependency: ${id}`);
}, module, module.exports);
const middleware = module.exports.default;

function event(host, path, method = "GET") {
  return { url: new URL(path, `https://${host}`), req: { method, headers: new Headers({ host, accept: "text/html" }) } };
}
function ssrResponse() {
  const bytes = Buffer.from(input);
  return new Response(new ReadableStream({ start(controller) {
    for (let i = 0; i < bytes.length; i += 7) controller.enqueue(bytes.subarray(i, i + 7));
    controller.close();
  } }), { headers: { "content-type": "text/html", "content-length": String(bytes.length), "x-test-preserved": "yes" } });
}

for (const host of hosts) {
  for (const path of paths) {
    test(`Nitro final streaming head: ${host}${path}`, async () => {
      const response = await middleware(event(host, `${path}?utm_source=test`), ssrResponse);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("location"), null, "legacy must keep serving");
      assert.equal(response.headers.get("content-length"), null);
      assert.equal(response.headers.get("x-test-preserved"), "yes");
      const html = await response.text();
      assertHead(html, host, path);
      assert.equal(shared.injectGrokPwaHead(html, { host, url: path, site: snapshot.site }), html);
    });
  }
}

test("canonical authority ignores stale public-host env and strips query/hash/trailing slash", () => {
  const old = process.env.VITE_PUBLIC_HOSTNAME;
  process.env.VITE_PUBLIC_HOSTNAME = "stale.grok.me";
  try {
    for (const host of hosts) {
      const html = shared.injectGrokPwaHead(input, { host, url: "/settings/?install=1&platform=ios&utm_source=x#fragment", site: snapshot.site });
      assertHead(html, host, "/settings");
      assert.doesNotMatch(html, /stale\.grok\.me|fragment|platform=|install=/);
    }
  } finally {
    if (old === undefined) delete process.env.VITE_PUBLIC_HOSTNAME;
    else process.env.VITE_PUBLIC_HOSTNAME = old;
  }
});

test("unknown/system/local hosts cannot become indexable canonical origins", () => {
  for (const host of ["evil.example", "localhost:8080", "pickforus.app.evil.example", "www.pickforus.app", "vercel.com", ""]) {
    const html = shared.injectGrokPwaHead(input, { host, site: snapshot.site });
    assert.match(html, /name="robots" content="noindex,follow"/);
    assert.match(html, /rel="canonical" href="https:\/\/pickforus\.app\/"/);
  }
});

test("Nitro compatibility manifests match static public manifest without a workspace filesystem", async () => {
  const cwd = process.cwd();
  const empty = mkdtempSync(join(tmpdir(), "domain-readiness-"));
  try {
    process.chdir(empty);
    for (const host of hosts) for (const path of ["/__grok/manifest.webmanifest", "/__grok/manifest.json"]) {
      const response = await middleware(event(host, path), () => { throw new Error("manifest fell through"); });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /application\/manifest\+json/);
      assert.deepEqual(await response.json(), snapshot.manifest);
    }
  } finally { process.chdir(cwd); rmSync(empty, { recursive: true }); }
  assert.equal(snapshot.manifest.name, "Pick For Us");
  assert.equal(snapshot.manifest.short_name, "Pick For Us");
  assert.equal(snapshot.manifest.start_url, "/");
  assert.equal(snapshot.manifest.scope, "/");
  assert.equal(snapshot.manifest.description, description);
  assert.equal(snapshot.manifest.icons[0].src, "/apple-touch-icon.png");
  assert.deepEqual(readFileSync(join(ROOT, "public/apple-touch-icon.png")), readFileSync(join(ROOT, "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png")));
});

test("Nitro install tutorial has coherent identity, relative app link and noindex", async () => {
  for (const host of hosts) {
    const response = await middleware(event(host, "/settings?install=1&platform=ios&tab=2"), () => { throw new Error("install fell through"); });
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /<title>Add Pick For Us to your Home Screen<\/title>/);
    assert.match(html, /name="robots" content="noindex,follow"/);
    assert.match(html, /href="\/settings\?tab=2"/);
    assert.doesNotMatch(html, /Grok App|{{APP_NAME}}/);
    assert.equal(tags(html, "link").filter((x) => x.rel === "manifest").length, 1);
    assert.equal(tags(html, "link").filter((x) => x.rel === "apple-touch-icon").length, 1);
  }
});

test("Nitro preserves non-document, non-GET and encoded responses", async () => {
  const untouched = new Response("asset");
  for (const [path, method] of [["/api/search", "GET"], ["/asset.js", "GET"], ["/", "POST"]]) {
    assert.equal(await middleware(event(hosts[1], path, method), () => untouched), untouched);
  }
  const encoded = new Response("opaque", { headers: { "content-type": "text/html", "content-encoding": "gzip" } });
  assert.equal(await middleware(event(hosts[1], "/"), () => encoded), encoded);
});

// Exercise Vite's real response wrapper over HTTP, not only its head helper.
for (const mode of ["dev", "preview"]) {
  test(`Vite ${mode} final response and installation endpoints`, async () => {
    const stack = [];
    const server = createServer((req, res) => {
      let i = 0;
      const next = () => {
        if (stack[i]) return stack[i++](req, res, next);
        if (req.url === "/manifest.webmanifest") {
          res.setHeader("content-type", "application/manifest+json");
          return res.end(readFileSync(join(ROOT, "public/manifest.webmanifest")));
        }
        res.setHeader("content-type", "text/html; charset=utf-8");
        const bytes = Buffer.from(input);
        for (let k = 0; k < bytes.length; k += 7) res.write(bytes.subarray(k, k + 7));
        res.end();
      };
      next();
    });
    const plugin = grokPwaPlugin();
    plugin.configResolved({ root: ROOT });
    const viteServer = { middlewares: { use(fn) { stack.push(fn); } } };
    if (mode === "dev") plugin.configureServer(viteServer);
    else plugin.configurePreviewServer(viteServer)();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const base = `http://127.0.0.1:${server.address().port}`;
      for (const host of hosts) {
        for (const path of paths) {
          const response = await fetch(`${base}${path}?utm_source=test`, { headers: { "x-forwarded-host": host, accept: "text/html" }, redirect: "manual" });
          assert.equal(response.status, 200);
          assert.equal(response.headers.get("location"), null);
          assertHead(await response.text(), host, path);
        }
        for (const path of ["/manifest.webmanifest", "/__grok/manifest.webmanifest", "/__grok/manifest.json"]) {
          const response = await fetch(`${base}${path}`, { headers: { "x-forwarded-host": host } });
          assert.deepEqual(await response.json(), snapshot.manifest);
        }
        const install = await fetch(`${base}/?install=1&platform=ios`, { headers: { "x-forwarded-host": host, accept: "text/html" } });
        const html = await install.text();
        assert.match(html, /<title>Add Pick For Us to your Home Screen<\/title>/);
        assert.doesNotMatch(html, /Grok App/);
      }
    } finally { await new Promise((resolve) => server.close(resolve)); }
  });
}
