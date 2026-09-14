// Read-only transport observation for the explicitly invoked local browser check.
if (process.env.CASINO_BROWSER_LOCAL !== "1") throw new Error("Local browser check only");
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  const watched = /overpass|nominatim|maps\.mail\.ru/.test(url.hostname);
  const start = Date.now();
  try {
    const response = await originalFetch(input, init);
    if (watched) console.log("CASINO_LIVE_PROVIDER " + JSON.stringify({
      host: url.hostname, status: response.status, elapsedMs: Date.now() - start,
    }));
    if (response.ok && /overpass|maps\.mail\.ru/.test(url.hostname)) {
      // Public casino entities only; retain the response consumed by the app.
      const body = await response.clone().json().catch(() => null);
      const casinos = body?.elements?.filter(row => row.tags?.amenity === "casino" || row.tags?.gambling === "casino") ?? [];
      if (casinos.length) console.log("CASINO_LIVE_ENTITIES " + JSON.stringify(casinos.map(row => ({
        type: row.type, id: row.id, lat: row.lat ?? row.center?.lat, lon: row.lon ?? row.center?.lon,
        tags: Object.fromEntries(Object.entries(row.tags).filter(([key]) => ["name", "amenity", "gambling"].includes(key) || key.startsWith("addr:"))),
      }))));
    }
    return response;
  } catch (error) {
    if (watched) console.log("CASINO_LIVE_PROVIDER " + JSON.stringify({
      host: url.hostname, elapsedMs: Date.now() - start,
      error: error.name, code: error.cause?.code ?? error.code ?? null,
    }));
    throw error;
  }
};
