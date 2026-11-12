import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const base = readFileSync("src/styles.css", "utf8");
const scoped = readFileSync("src/christmas-event-accessibility.css", "utf8");
function declarations(css, selector) {
  const start = css.indexOf(selector);
  assert.ok(start >= 0, `Missing CSS rule ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1).split("}")[0];
  return Object.fromEntries([...body.matchAll(/(--[a-z-]+):\s*(#[a-f0-9]{6})\s*;/g)].map(([, key, value]) => [key, value]));
}
function rgb(hex) { return hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255); }
function luminance(channels) {
  const linear = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const values = [luminance(typeof a === "string" ? rgb(a) : a), luminance(typeof b === "string" ? rgb(b) : b)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}
const palettes = [
  ["dark", 'html[data-theme="dark"]', ".christmas-event-surface,"],
  ["light", 'html[data-theme="light"] {', 'html[data-theme="light"] :is'],
  ["Nightlife inherited dark", "html.nightlife-active,", "html.nightlife-active :is"],
  ["Date Night dark", 'html.date-night-active:not([data-theme="light"]) {', 'html.date-night-active:not([data-theme="light"]) :is'],
  ["Date Night light", 'html.date-night-active[data-theme="light"] {', 'html.date-night-active[data-theme="light"] :is'],
];

for (const [name, baseSelector, eventSelector] of palettes) {
  test(`${name}: every event text token meets AA on all existing panel backgrounds and button states`, () => {
    const tokens = { ...declarations(base, baseSelector), ...declarations(scoped, eventSelector) };
    const backgrounds = ["--app-bg", "--app-surface", "--app-elevated"].map(key => tokens[key]);
    for (const key of ["--app-fg", "--app-muted", "--app-subtle", "--app-accent", "--app-danger", "--app-heart", "--app-open"]) {
      for (const background of backgrounds) {
        assert.ok(contrast(tokens[key], background) >= 4.5, `${name}: ${key} ${tokens[key]} on ${background}`);
      }
    }
    assert.ok(contrast(tokens["--app-accent-fg"], tokens["--app-accent"]) >= 4.5, `${name}: primary button text`);
    for (const background of backgrounds) {
      const hover = rgb(tokens["--app-accent"]).map((channel, index) => channel * 0.9 + rgb(background)[index] * 0.1);
      assert.ok(contrast(tokens["--app-accent-fg"], hover) >= 4.5, `${name}: primary button hover text`);
      assert.ok(contrast(tokens["--event-focus"], background) >= 3, `${name}: focus outline`);
    }
  });
}

test("contrast overrides stay event-scoped and unavailable controls retain legible text", () => {
  const selectorGroups = [...scoped.matchAll(/([^{}]+)\{/g)].map(match => match[1].replace(/\/\*[\s\S]*?\*\//g, "").trim());
  assert.ok(selectorGroups.every(selector => /christmas-event-surface|data-christmas/.test(selector)));
  assert.match(base, /@import "\.\/christmas-event-accessibility\.css";/);
  assert.match(scoped, /button:disabled\s*\{\s*opacity: 1;/);
  assert.match(scoped, /:focus-visible\s*\{\s*outline: 3px solid var\(--event-focus\);\s*outline-offset: 3px;/);
  assert.ok(contrast("#ffffff", "#111113") >= 3, "fixed footer focus outline");
});
