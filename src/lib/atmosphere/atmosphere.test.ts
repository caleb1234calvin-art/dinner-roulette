import assert from "node:assert/strict";
import { test } from "node:test";
import { createAtmosphereController, type AtmosphereEffect } from "./controller.ts";
import { CHRISTMAS_ATMOSPHERE_END, CHRISTMAS_ATMOSPHERE_START, isChristmasAtmosphereEnabled } from "./season.ts";
import { createSnowEffect, snowflakeBudget, snowPixelRatio } from "./snow.ts";

test("Christmas begins at Chicago midnight on Nov 27 and ends at Jan 1 midnight", () => {
  assert.equal(CHRISTMAS_ATMOSPHERE_START, Date.parse("2026-11-27T06:00:00Z"));
  assert.equal(CHRISTMAS_ATMOSPHERE_END, Date.parse("2027-01-01T06:00:00Z"));
  assert.equal(isChristmasAtmosphereEnabled("date-night", new Date(CHRISTMAS_ATMOSPHERE_START - 1)), false);
  assert.equal(isChristmasAtmosphereEnabled("date-night", new Date(CHRISTMAS_ATMOSPHERE_START)), true);
  assert.equal(isChristmasAtmosphereEnabled("date-night", new Date(CHRISTMAS_ATMOSPHERE_END - 1)), true);
  assert.equal(isChristmasAtmosphereEnabled("date-night", new Date(CHRISTMAS_ATMOSPHERE_END)), false);
});

test("Christmas snow stays out of Dinner, Nightlife, other years and disabled modes", () => {
  const christmas = new Date("2026-12-14T20:00:00-06:00");
  for (const mode of ["dinner", "nightlife"] as const) assert.equal(isChristmasAtmosphereEnabled(mode, christmas), false);
  assert.equal(isChristmasAtmosphereEnabled("date-night", christmas, false), false);
  assert.equal(isChristmasAtmosphereEnabled("date-night", christmas, true), true);
  assert.equal(isChristmasAtmosphereEnabled("date-night", new Date("2025-12-14T20:00:00-06:00")), false);
  assert.equal(isChristmasAtmosphereEnabled("date-night", new Date("invalid")), false);
});

test("controller enforces one RAF, cancels on visibility/motion changes, resumes and destroys", () => {
  const scheduled = new Map<number, (t: number) => void>();
  const cancelled: number[] = [];
  const frames: [number, number][] = [];
  let next = 0;
  let visible = true;
  let motion = true;
  let clears = 0;
  let resizes = 0;
  const effect: AtmosphereEffect = {
    resize: () => { resizes++; },
    render: (delta, timestamp) => { frames.push([delta, timestamp]); },
    clear: () => { clears++; },
  };
  const controller = createAtmosphereController(effect, {
    requestFrame: (cb) => { const id = ++next; scheduled.set(id, cb); return id; },
    cancelFrame: (id) => { cancelled.push(id); scheduled.delete(id); },
    canAnimate: () => visible && motion,
  });
  const fire = (ts: number) => { const [id, cb] = scheduled.entries().next().value!; scheduled.delete(id); cb(ts); };
  controller.resize(320, 640, 2);
  controller.setActive(true);
  controller.sync();
  assert.equal(resizes, 1);
  assert.equal(scheduled.size, 1);
  fire(1000);
  fire(1200);
  assert.equal(frames.length, 2);
  assert.equal(frames[1][0], 50); // Clamp return from throttling.
  assert.equal(scheduled.size, 1);
  visible = false;
  controller.sync();
  assert.equal(scheduled.size, 0);
  assert.equal(cancelled.length, 1);
  assert.equal(clears, 1);
  motion = false;
  visible = true;
  controller.sync();
  assert.equal(scheduled.size, 0);
  motion = true;
  controller.sync();
  assert.equal(scheduled.size, 1);
  fire(4000);
  assert.equal(frames.at(-1)?.[0], 16.67);
  controller.destroy();
  controller.destroy();
  assert.equal(scheduled.size, 0);
  assert.equal(clears, 3); // Pause + destroy stop/clear; no work on second destroy.
  controller.setActive(true);
  assert.equal(scheduled.size, 0);
});

test("deactivation cancels RAF and does not revive until explicitly reactivated", () => {
  const queue = new Map<number, (t: number) => void>();
  let serial = 0;
  let rendered = 0;
  const controller = createAtmosphereController(
    { resize: () => {}, render: () => { rendered++; }, clear: () => {} },
    { requestFrame: (cb) => { queue.set(++serial, cb); return serial; }, cancelFrame: (id) => { queue.delete(id); }, canAnimate: () => true },
  );
  controller.setActive(true);
  assert.equal(queue.size, 1);
  controller.setActive(false);
  assert.equal(queue.size, 0);
  controller.sync();
  assert.equal(queue.size, 0);
  assert.equal(rendered, 0);
  controller.destroy();
});

test("snowflake and backing bitmap budgets are capped at mobile and 4K widths", () => {
  assert.ok(snowflakeBudget(320, 640) >= 12);
  assert.ok(snowflakeBudget(3840, 2160) <= 72);
  assert.equal(snowflakeBudget(0, 640), 0);
  assert.ok(snowPixelRatio(390, 844, 4) <= 1.5);
  const ratio = snowPixelRatio(3840, 2160, 4);
  assert.ok(3840 * 2160 * ratio * ratio <= 1_600_001);
});

test("snow renderer handles resize, draws within budget and clears", () => {
  const calls = { transform: 0, clear: 0, particles: 0 };
  const context = {
    setTransform: () => { calls.transform++; },
    clearRect: () => { calls.clear++; },
    beginPath: () => {},
    arc: () => { calls.particles++; },
    fill: () => {},
    fillStyle: "",
    globalAlpha: 1,
  };
  const canvas = { width: 0, height: 0, getContext: () => context } as unknown as HTMLCanvasElement;
  const originalDocument = globalThis.document;
  Object.defineProperty(globalThis, "document", { configurable: true, value: { documentElement: { dataset: { theme: "dark" } } } });
  try {
    const effect = createSnowEffect(canvas)!;
    effect.resize(390, 844, 3);
    assert.equal(calls.transform, 1);
    assert.ok(canvas.width * canvas.height <= 1_600_001);
    effect.render(16.67, 1000);
    assert.equal(calls.particles, snowflakeBudget(390, 844));
    effect.clear();
    assert.equal(calls.clear, 2);
  } finally {
    if (originalDocument === undefined) Reflect.deleteProperty(globalThis, "document");
    else Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
  }
});

test("snow renderer fails closed when canvas 2D is unavailable", () => {
  const canvas = { getContext: () => null } as unknown as HTMLCanvasElement;
  assert.equal(createSnowEffect(canvas), null);
});
