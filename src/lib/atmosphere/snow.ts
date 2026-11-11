import type { AtmosphereEffect } from "./controller";

const MAX_FLAKES = 72;
const MAX_BITMAP_PIXELS = 1_600_000;
const MAX_PIXEL_RATIO = 1.5;

type Flake = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  depth: number;
  phase: number;
};

/** A fixed budget makes low-end mobile/WebView behavior predictable. */
export function snowflakeBudget(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 0;
  return Math.min(MAX_FLAKES, Math.max(12, Math.floor((width * height) / 11_500)));
}

/** Limit backing bitmap size even on large/high-DPI displays. */
export function snowPixelRatio(width: number, height: number, deviceRatio: number) {
  const safeArea = Math.max(1, width * height);
  const requested = Number.isFinite(deviceRatio) && deviceRatio > 0 ? deviceRatio : 1;
  return Math.min(requested, MAX_PIXEL_RATIO, Math.sqrt(MAX_BITMAP_PIXELS / safeArea));
}

/** Canvas-only renderer: no DOM nodes per particle, layout, or input listeners. */
export function createSnowEffect(canvas: HTMLCanvasElement): AtmosphereEffect | null {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;
  let width = 1;
  let height = 1;
  let flakes: Flake[] = [];

  function makeFlake(y = Math.random() * height): Flake {
    const depth = 0.35 + Math.random() * 0.65;
    return {
      x: Math.random() * width,
      y,
      radius: 0.55 + depth * 1.8,
      speed: 11 + depth * 31,
      opacity: 0.23 + depth * 0.43,
      depth,
      phase: Math.random() * Math.PI * 2,
    };
  }

  return {
    resize(nextWidth, nextHeight, deviceRatio) {
      width = Math.max(1, Math.floor(nextWidth));
      height = Math.max(1, Math.floor(nextHeight));
      const ratio = snowPixelRatio(width, height, deviceRatio);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = snowflakeBudget(width, height);
      flakes = Array.from({ length: count }, () => makeFlake());
    },
    render(deltaMs, timestampMs) {
      ctx.clearRect(0, 0, width, height);
      const dt = deltaMs / 1000;
      const gust = Math.sin(timestampMs / 3700) * 6 + Math.sin(timestampMs / 11300) * 4;
      ctx.fillStyle = document.documentElement.dataset.theme === "light" ? "#7393aa" : "#eef7ff";
      for (const flake of flakes) {
        flake.y += flake.speed * dt;
        flake.x += (gust * flake.depth + Math.sin(timestampMs / 1150 + flake.phase) * 5) * dt;
        if (flake.y > height + 4 || flake.x < -10 || flake.x > width + 10) {
          const replacement = makeFlake(-4);
          Object.assign(flake, replacement);
        }
        ctx.globalAlpha = flake.opacity;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    clear() {
      ctx.clearRect(0, 0, width, height);
    },
  };
}
