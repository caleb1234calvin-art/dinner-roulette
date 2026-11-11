import type { AtmosphereEffect } from "./controller";

// Owner-reviewed V4: natural mixed snowfall at visual density 68/100, with
// gentle but slightly quicker drift than V3. This is a visual preset, not
// an uncapped particles-per-second setting.
export const CHRISTMAS_SNOW_DENSITY = 68;
const MAX_FLAKES = 190;
const MAX_BITMAP_PIXELS = 1_600_000;
const MAX_PIXEL_RATIO = 1.5;

type FlakeShape = "dot" | "cluster" | "crystal";
type Flake = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  depth: 0 | 1 | 2;
  phase: number;
  swing: number;
  rotation: number;
  angle: number;
  shape: FlakeShape;
};

export function snowflakeBudget(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 0;
  return Math.min(MAX_FLAKES, Math.max(65, Math.round((width * height / 4800) * (0.84 + CHRISTMAS_SNOW_DENSITY / 300))));
}

/** Limit backing bitmap cost on large and high-DPI screens. */
export function snowPixelRatio(width: number, height: number, deviceRatio: number) {
  const safeArea = Math.max(1, width * height);
  const requested = Number.isFinite(deviceRatio) && deviceRatio > 0 ? deviceRatio : 1;
  return Math.min(requested, MAX_PIXEL_RATIO, Math.sqrt(MAX_BITMAP_PIXELS / safeArea));
}

/** Canvas-only painting with no DOM elements or event listeners per flake. */
export function createSnowEffect(canvas: HTMLCanvasElement): AtmosphereEffect | null {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;
  const context = ctx;
  let width = 1;
  let height = 1;
  let flakes: Flake[] = [];
  const between = (a: number, b: number) => a + Math.random() * (b - a);

  function makeFlake(depth: 0 | 1 | 2, initial = false): Flake {
    const config = [
      { radius: [0.35, 1.0], speed: [10, 18.7], opacity: [0.29, 0.51] },
      { radius: [0.85, 2.05], speed: [15.4, 31.9], opacity: [0.48, 0.75] },
      { radius: [2.0, 3.6], speed: [20.9, 40.7], opacity: [0.45, 0.72] },
    ][depth];
    return {
      x: between(-3, width + 3),
      y: initial ? between(-3, height) : -between(5, 25),
      radius: between(config.radius[0], config.radius[1]),
      speed: between(config.speed[0], config.speed[1]),
      opacity: between(config.opacity[0], config.opacity[1]),
      depth,
      phase: between(0, Math.PI * 2),
      swing: between(0.7, 3.4),
      rotation: between(-0.22, 0.22),
      angle: between(0, Math.PI * 2),
      shape: depth === 2 && Math.random() < 0.18
        ? "crystal"
        : depth >= 1 && Math.random() < 0.27 ? "cluster" : "dot",
    };
  }

  function paint(flake: Flake, lightTheme: boolean) {
    context.globalAlpha = flake.opacity;
    context.fillStyle = lightTheme ? "#7796ac" : flake.depth === 0 ? "#e4f4ef" : "#f4f6ed";
    context.shadowColor = lightTheme ? "#86a8ba" : "#f2f7f4";
    context.shadowBlur = flake.depth === 2 ? 1.5 : 0;
    if (flake.shape === "crystal") {
      context.save();
      context.translate(flake.x, flake.y);
      context.rotate(flake.angle);
      context.strokeStyle = lightTheme ? "#6689a4" : "#f5faf7";
      context.lineWidth = 0.65;
      context.beginPath();
      for (let arm = 0; arm < 3; arm++) {
        const theta = arm * Math.PI / 3;
        const x = flake.radius * 1.5 * Math.cos(theta);
        const y = flake.radius * 1.5 * Math.sin(theta);
        context.moveTo(-x, -y);
        context.lineTo(x, y);
      }
      context.stroke();
      context.restore();
    } else if (flake.shape === "cluster") {
      context.beginPath();
      context.ellipse(flake.x, flake.y, flake.radius, flake.radius * 0.72, flake.angle, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = flake.opacity * 0.45;
      context.beginPath();
      context.arc(flake.x + flake.radius * 0.55, flake.y - flake.radius * 0.38, flake.radius * 0.38, 0, Math.PI * 2);
      context.fill();
    } else {
      context.beginPath();
      context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      context.fill();
    }
    context.shadowBlur = 0;
  }

  return {
    resize(nextWidth, nextHeight, deviceRatio) {
      width = Math.max(1, Math.floor(nextWidth));
      height = Math.max(1, Math.floor(nextHeight));
      const ratio = snowPixelRatio(width, height, deviceRatio);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = snowflakeBudget(width, height);
      flakes = Array.from({ length: count }, (_, i) => makeFlake(i < count * 0.53 ? 0 : i < count * 0.89 ? 1 : 2, true));
    },
    render(deltaMs, timestampMs) {
      context.clearRect(0, 0, width, height);
      const dt = deltaMs / 1000;
      const breeze = Math.sin(timestampMs / 5700) * 4.6 + Math.sin(timestampMs / 13700) * 2.0;
      const lightTheme = document.documentElement.dataset.theme === "light";
      for (const flake of flakes) {
        flake.x += (breeze * (0.38 + flake.depth * 0.31) + Math.sin(timestampMs / 1540 + flake.phase) * flake.swing) * dt;
        flake.y += flake.speed * dt;
        flake.angle += flake.rotation * dt;
        if (flake.y > height + 8 || flake.x > width + 16 || flake.x < -16) {
          Object.assign(flake, makeFlake(flake.depth));
        }
        paint(flake, lightTheme);
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
    },
    clear() { context.clearRect(0, 0, width, height); },
  };
}
