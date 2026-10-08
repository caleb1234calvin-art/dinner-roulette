// Disposable local acceptance only: no public provider/network requests.
import { appendFileSync, readFileSync } from "node:fs";
if (process.env.CI !== "true" || !process.env.SEASONAL_TEN_CONTROL || !process.env.SEASONAL_TEN_EVENTS) {
  throw new Error("Disposable fixture and network evidence paths required");
}
const RealDate = Date;
const control = () => JSON.parse(readFileSync(process.env.SEASONAL_TEN_CONTROL, "utf8"));
const record = (state, event) => appendFileSync(process.env.SEASONAL_TEN_EVENTS,
  JSON.stringify({ scenario: state.scenario, at: state.at, ...event }) + "\n");
globalThis.Date = class extends RealDate {
  constructor(...args) { super(...(args.length ? args : [control().at])); }
  static now() { return new RealDate(control().at).getTime(); }
};
const originalFetch = globalThis.fetch;
const mirrors = new Set(["overpass.openstreetmap.fr", "overpass.private.coffee", "maps.mail.ru", "overpass-api.de"]);
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  // No external redirects can escape the local-fetch exception.
  if (["127.0.0.1", "localhost"].includes(url.hostname)) return originalFetch(input, { ...init, redirect: "error" });
  const state = control();
  if (!mirrors.has(url.hostname)) {
    record(state, { event: "blocked-external", host: url.hostname });
    throw new Error("External network disabled in V1 ten-record acceptance");
  }
  const body = init?.body ?? (input instanceof Request ? await input.clone().text() : "");
  const query = new URLSearchParams(String(body)).get("data") ?? "";
  // Both context preludes contain park acquisition hints. Only the final
  // positive-result union establishes that this request actually asks for parks.
  const resultUnion = query.slice(query.lastIndexOf("\n(\n"));
  const seasonal = resultUnion.includes("nwr.seasonal_context");
  const outdoor = resultUnion.includes('nwr["leisure"="park"](around:');
  const elements = [];
  if (state.fixture === "mixed" && (outdoor || seasonal)) {
    const row = state.row;
    const tags = { name: row.name, leisure: "park", opening_hours: "24/7",
      "seasonal:activities": row.activityTypes.includes("corn-maze") ? "corn maze and pumpkin patch" : "haunted house" };
    // Two actual Overpass representations of the same identity. Catalog merging,
    // conflicting/provider hours, category union and cache reuse stay app-owned.
    elements.push(
      { type: "node", id: 910001, lat: row.lat, lon: row.lon, tags },
      { type: "way", id: 910002, center: { lat: row.lat, lon: row.lon }, tags },
    );
    if (outdoor) elements.push({ type: "node", id: 910003, lat: row.lat + 0.005, lon: row.lon,
      tags: { name: "Ordinary park control", leisure: "park", opening_hours: "24/7" } });
  }
  const status = state.fixture === "provider-failure" ? 503 : 200;
  record(state, { event: "intercepted-provider", host: url.hostname,
    group: seasonal ? "seasonal" : outdoor ? "outdoor" : "other", status,
    elements: elements.map(({ type, id }) => `${type}-${id}`), forwarded: false });
  return Response.json({ elements }, { status });
};
