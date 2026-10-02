import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("live favicon metadata uses the approved PNG with MIME and size", () => {
  const root = read("src/routes/__root.tsx");
  assert.match(root, /rel: "icon", type: "image\/png", sizes: "64x64", href: "\/favicon\.png"/);
  assert.doesNotMatch(root, /favicon\.svg/);
});

test("public manifest has the exact unified PNG icon set", () => {
  const manifest = JSON.parse(read("public/manifest.webmanifest"));
  assert.deepEqual(manifest.icons, [
    { src: "/apple-touch-icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/pwa-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ]);
  assert.doesNotMatch(JSON.stringify(manifest), /favicon\.svg/);
});
