import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { chromium } from "playwright";

// Real shared Slider + real Radix + real browser accessibility queries, no mocks.
const output = process.env.SLIDER_ACCESSIBILITY_OUTPUT ?? "/tmp/pfu-slider-accessibility";
await mkdir(output, { recursive: true });
const bundle = await build({ configFile: false, publicDir: false, plugins: [react()],
  resolve: { alias: { "@": resolve("src") } }, define: { "process.env.NODE_ENV": '"production"' },
  build: { write: false, minify: false, lib: { entry: resolve("scripts/test-support/slider-accessibility-fixture.tsx"), formats: ["iife"], name: "SliderFixture" } },
});
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
const page = await browser.newPage();
page.setDefaultTimeout(3000);
const verdict = { passed: false, cases: [], pageErrors: [], networkRequests: 0 };
page.on("pageerror", error => verdict.pageErrors.push(error.message));
await page.route("**/*", route => { verdict.networkRequests++; return route.abort(); });
const check = async (name, fn) => {
  try { await fn(); verdict.cases.push({ name, passed: true }); }
  catch (error) { verdict.cases.push({ name, passed: false, error: error.message }); }
};
const slider = name => page.getByRole("slider", { name, exact: true });
try {
  await page.setContent('<div id="root"></div>');
  const chunks = [bundle].flat().flatMap(result => result.output);
  await page.addScriptTag({ content: chunks.find(item => item.type === "chunk").code });
  await page.getByTestId("distance").waitFor();
  for (const name of ["Travel distance", "Cozy to adventurous", "Familiar to adventurous", "Chill to lively"]) {
    await check(`role=slider named ${name}`, async () => assert.equal(await slider(name).count(), 1));
  }
  await check("aria-labelledby names the single thumb and takes precedence", async () => {
    assert.equal(await slider("External distance").count(), 1);
    assert.equal(await slider("Ignored fallback").count(), 0);
  });
  await check("multiple thumbs have distinct contextual names", async () => {
    for (const name of ["Price range minimum", "Price range maximum", "External range minimum", "External range maximum",
      "Three values value 1", "Three values value 2", "Three values value 3"]) assert.equal(await slider(name).count(), 1, name);
  });
  await check("named controlled slider preserves Home End arrows and onValueChange", async () => {
    const control = slider("Travel distance");
    for (const [key, value] of [["End", "8"], ["Home", "0"], ["ArrowRight", "1"], ["ArrowLeft", "0"]]) {
      await control.press(key);
      assert.equal(await control.getAttribute("aria-valuenow"), value);
      assert.equal(await page.getByTestId("distance").locator("output").innerText(), value);
    }
  });
  await check("price thumbs preserve controlled range behavior", async () => {
    await slider("Price range minimum").press("ArrowRight");
    await slider("Price range maximum").press("ArrowLeft");
    assert.equal(await page.getByTestId("price").innerText(), "2,3");
  });
  await check("distance ticks and root props are retained", async () => {
    assert.deepEqual(await page.getByTestId("distance").locator(".grid > span").allTextContents(), ["1", "3", "5", "10", "15", "20", "30", "40", "50"]);
    assert.equal(await page.locator('[data-root="distance"]').count(), 1);
  });
  verdict.dom = await page.locator("#root").innerHTML();
  verdict.accessibility = await page.locator("#root").ariaSnapshot();
  verdict.passed = verdict.cases.every(item => item.passed) && verdict.pageErrors.length === 0 && verdict.networkRequests === 0;
} finally {
  await browser.close();
  await writeFile(resolve(output, "verdict.json"), JSON.stringify(verdict, null, 2) + "\n");
  console.log(JSON.stringify(verdict));
  if (!verdict.passed) process.exitCode = 1;
}
