// Test-only captured geography. No network lookup or catalog modification.
import "./location-provider-fixtures.mjs";
import { appendFileSync } from "node:fs";
const fallback = globalThis.fetch;
const county = {
  osm_type: "relation", osm_id: 1818400, lat: "36.3456186", lon: "-94.2670404",
  addresstype: "county", name: "Benton County", display_name: "Benton County, Arkansas, United States",
  address: { county: "Benton County", state: "Arkansas", country: "United States", country_code: "us" },
};
const town = {
  osm_type: "relation", osm_id: 111083, lat: "34.5645372", lon: "-92.5868280",
  addresstype: "town", name: "Benton", display_name: "Benton, Saline County, Arkansas, 72015, United States",
  address: { town: "Benton", county: "Saline County", state: "Arkansas", postcode: "72015", country: "United States", country_code: "us" },
};
globalThis.fetch = async (input, options) => {
  const url = new URL(String(input));
  if (url.hostname === "nominatim.openstreetmap.org" && url.pathname === "/search" && url.searchParams.get("q")?.startsWith("Benton")) {
    const query = url.searchParams.get("q");
    if (process.env.LOCATION_BROWSER_REQUEST_LOG) appendFileSync(process.env.LOCATION_BROWSER_REQUEST_LOG,
      JSON.stringify({ kind: "geocode", url: String(url), fixture: "captured-benton" }) + "\n");
    if (query.includes("slow")) await new Promise(resolve => setTimeout(resolve, 1500));
    return Response.json(query.includes("County only") ? [county] : [county, town]);
  }
  return fallback(input, options);
};
