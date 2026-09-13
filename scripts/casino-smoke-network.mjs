// Loaded only by the disposable CI smoke server. Never imported by application code.
if (process.env.CASINO_BROWSER_SMOKE !== "1" || process.env.CI !== "true") {
  throw new Error("Casino smoke network fixtures require a disposable CI process");
}
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (/overpass|maps\.mail\.ru/.test(url.hostname)) {
    // Deterministic outage exercises the actual server's saved-catalog fallback.
    throw new Error("CI fixture: live discovery unavailable");
  }
  if (/nominatim/.test(url.hostname)) {
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const point = q.includes("empty") ? [0, 0, "Empty Test"]
      : q.includes("ardmore") ? [34.1743, -97.1436, "Ardmore, Oklahoma"]
      : [36.1164, -115.174, "Las Vegas, Nevada"];
    return Response.json([{ lat: String(point[0]), lon: String(point[1]), display_name: point[2], type: "city", class: "place", importance: 1 }]);
  }
  if (["127.0.0.1", "localhost"].includes(url.hostname)) return originalFetch(input, init);
  throw new Error("CI fixture: unexpected external request to " + url.hostname);
};
