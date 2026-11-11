/** A tiny reusable animation lifecycle. Effects own their pixels, not the clock. */
export interface AtmosphereEffect {
  resize(width: number, height: number, pixelRatio: number): void;
  render(deltaMs: number, timestampMs: number): void;
  clear(): void;
}

export interface AtmosphereRuntime {
  requestFrame(callback: (timestampMs: number) => void): number;
  cancelFrame(handle: number): void;
  canAnimate(): boolean;
}

/** Reconciles a single RAF loop with visibility, motion settings, and app mode.
 * The host calls sync() after changes to runtime.canAnimate(). */
export function createAtmosphereController(effect: AtmosphereEffect, runtime: AtmosphereRuntime) {
  let active = false;
  let destroyed = false;
  let pendingFrame: number | null = null;
  let lastTimestamp: number | null = null;
  let painted = false;

  function stop() {
    if (pendingFrame !== null) {
      runtime.cancelFrame(pendingFrame);
      pendingFrame = null;
    }
    lastTimestamp = null;
    if (painted) {
      effect.clear();
      painted = false;
    }
  }

  function schedule() {
    if (!destroyed && active && runtime.canAnimate() && pendingFrame === null) {
      pendingFrame = runtime.requestFrame(frame);
    }
  }

  function frame(timestampMs: number) {
    pendingFrame = null;
    if (destroyed || !active || !runtime.canAnimate()) {
      stop();
      return;
    }
    const deltaMs = lastTimestamp === null ? 16.67 : Math.min(50, Math.max(0, timestampMs - lastTimestamp));
    lastTimestamp = timestampMs;
    effect.render(deltaMs, timestampMs);
    painted = true;
    schedule();
  }

  function sync() {
    if (destroyed || !active || !runtime.canAnimate()) stop();
    else schedule();
  }

  return {
    setActive(nextActive: boolean) {
      if (destroyed) return;
      active = nextActive;
      sync();
    },
    sync,
    resize(width: number, height: number, pixelRatio: number) {
      if (destroyed) return;
      effect.resize(width, height, pixelRatio);
      // A resize resets the canvas bitmap; the next scheduled frame repaints.
      sync();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stop();
      effect.clear();
    },
  };
}
