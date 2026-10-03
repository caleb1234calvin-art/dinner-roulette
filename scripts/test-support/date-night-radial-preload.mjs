// Disposable controlled server only. Every external fetch is intercepted.
import { appendFileSync, readFileSync } from "node:fs";
import { appModuleLoader } from "./load-app-module.mjs";
if (process.env.CI !== "true" || process.env.DATE_NIGHT_RADIAL_BROWSER !== "1") throw new Error("Radial fixture requires disposable CI");
const control = process.env.DATE_NIGHT_RADIAL_CONTROL, events = process.env.DATE_NIGHT_RADIAL_EVENTS;
if (!control || !events) throw new Error("Radial fixture paths required");
const { planDateNightPatches } = appModuleLoader()("src/lib/date-night/radial-plan.ts");
const origin = { lat: 37.176447, lon: -94.310223 };
const plan = planDateNightPatches(origin, 50);
const config = () => JSON.parse(readFileSync(control, "utf8"));
const record = (state, data) => appendFileSync(events, JSON.stringify({ scenario: state.scenario, at: Date.now(), ...data }) + "\n");
const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return nativeFetch(input, init);
  if (!["overpass.openstreetmap.fr", "overpass.private.coffee", "maps.mail.ru", "overpass-api.de"].includes(url.hostname)) {
    throw new Error("External network disabled in radial fixture");
  }
  const query = new URLSearchParams(init?.body).get("data") ?? "";
  const values = query.match(/\(around:([^)]*)\)/)?.[1].split(",").map(Number);
  if (!query.includes(".lifecycle_context") || !values) return Response.json({ elements: [] });
  const [radius, lat, lon] = values;
  const patch = plan.find(p => Math.abs(p.center.lat - lat) < 1e-8 && Math.abs(p.center.lon - lon) < 1e-8 && p.radiusMeters === radius);
  if (!patch) throw new Error("Unrecognized or unbounded radial query in fixture");
  const state = config(), signal = init?.signal;
  record(state, { event: "start", patchId: patch.id, radiusMeters: radius });
  if (state.scenario === "middle-failure" && patch.id === "radial-v1:20:1" ||
      state.scenario === "outermost-failure" && patch.id === "radial-v1:50:10") {
    record(state, { event: "http-error", patchId: patch.id });
    return new Response("fixture failure", { status: 504 });
  }
  await new Promise((resolve, reject) => {
    let timer;
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener("abort", abort); };
    const abort = () => { cleanup(); record(state, { event: "abort", patchId: patch.id }); reject(signal.reason); };
    const poll = () => {
      const current = config();
      if (state.scenario === "all-stall" || current.scenario === state.scenario && current.holdPatch === patch.id) {
        timer = setTimeout(poll, 50);
      } else { cleanup(); resolve(); }
    };
    if (signal?.aborted) return abort();
    signal?.addEventListener("abort", abort, { once: true });
    timer = setTimeout(poll, patch.innerMiles ? 100 : 250);
  });
  record(state, { event: "response", patchId: patch.id });
  const index = plan.findIndex(p => p.id === patch.id);
  return Response.json({ elements: [
    ...Array.from({ length: patch.innerMiles ? 1 : 4 }, (_, i) => ({ type: "node", id: 980000000 + index * 10 + i,
      lat: patch.center.lat + i * 0.015, lon: patch.center.lon,
      tags: { name: patch.innerMiles ? `Radial outer cinema ${index}` : `Radial nearby cinema ${i + 1}`, amenity: "cinema", opening_hours: "24/7" } })),
    { type: "node", id: 989999999, ...origin, tags: { name: "Radial permanently closed fixture", amenity: "cinema", demolished: "yes", opening_hours: "24/7" } },
  ] });
};
