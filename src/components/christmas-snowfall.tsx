import { useEffect, useRef } from "react";
import { createAtmosphereController } from "@/lib/atmosphere/controller";
import { createSnowEffect } from "@/lib/atmosphere/snow";
import "./christmas-snowfall.css";

/** Presentation only: a single noninteractive canvas behind Date Night content. */
export function ChristmasSnowfall({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    const effect = createSnowEffect(canvas);
    if (!effect) return; // Canvas unavailable: the ordinary interface still works.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controller = createAtmosphereController(effect, {
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (handle) => window.cancelAnimationFrame(handle),
      canAnimate: () => document.visibilityState === "visible" && !reducedMotion.matches,
    });
    const resize = () => controller.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
    const sync = () => controller.sync();

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    resize();
    controller.setActive(true);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      controller.destroy();
    };
  }, [enabled]);

  return enabled ? <canvas ref={canvasRef} className="christmas-snow-canvas" aria-hidden="true" /> : null;
}
