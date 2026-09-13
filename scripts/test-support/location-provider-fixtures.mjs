// Browser-only provider fixtures, loaded explicitly via Node --import by the smoke script.
// This module is never imported by the application or its production build.
import { appendFileSync } from "node:fs";
const cities = [
  {
    name: "Joplin",
    state: "Missouri",
    country: "United States",
    code: "us",
    lat: 37.084184,
    lon: -94.513339,
  },
  {
    name: "Toronto",
    state: "Ontario",
    country: "Canada",
    code: "ca",
    lat: 43.65348,
    lon: -79.38393,
  },
  {
    name: "Vancouver",
    state: "British Columbia",
    country: "Canada",
    code: "ca",
    lat: 49.26087,
    lon: -123.11395,
  },
  {
    name: "Montréal",
    state: "Québec",
    country: "Canada",
    code: "ca",
    lat: 45.50318,
    lon: -73.56981,
  },
  {
    name: "London",
    state: "England",
    country: "United Kingdom",
    code: "gb",
    lat: 51.5074,
    lon: -0.1278,
  },
];
const original = globalThis.fetch;
const nearest = (lat, lon) =>
  cities.reduce((best, city) =>
    Math.hypot(city.lat - lat, city.lon - lon) < Math.hypot(best.lat - lat, best.lon - lon)
      ? city
      : best,
  );
const geocode = (city) => ({
  lat: String(city.lat),
  lon: String(city.lon),
  address: { city: city.name, state: city.state, country: city.country, country_code: city.code },
});
const log = (data) => {
  if (process.env.LOCATION_BROWSER_REQUEST_LOG)
    appendFileSync(process.env.LOCATION_BROWSER_REQUEST_LOG, JSON.stringify(data) + "\n");
};
globalThis.fetch = async (input, options) => {
  const url = new URL(String(input));
  if (url.hostname === "nominatim.openstreetmap.org") {
    log({ kind: "geocode", url: String(url) });
    if (url.pathname === "/reverse")
      return Response.json(
        geocode(nearest(Number(url.searchParams.get("lat")), Number(url.searchParams.get("lon")))),
      );
    const query = url.searchParams.get("q");
    const city = cities.find((city) => query?.toLowerCase().includes(city.name.toLowerCase()));
    return Response.json(city ? [geocode(city)] : []);
  }
  if (
    [
      "overpass.openstreetmap.fr",
      "overpass.private.coffee",
      "maps.mail.ru",
      "overpass-api.de",
    ].includes(url.hostname)
  ) {
    const query = new URLSearchParams(options.body).get("data");
    const [, lat, lon] = query.match(/around:\d+,(-?[\d.]+),(-?[\d.]+)\)/);
    const city = nearest(Number(lat), Number(lon));
    const category = query.includes('["amenity"="casino"]')
      ? "casino"
      : query.includes('["tourism"="museum"]')
        ? "museum"
        : "restaurant";
    log({ kind: "discovery", lat: Number(lat), lon: Number(lon), category });
    const tags =
      category === "museum" ? { tourism: "museum" } : { amenity: category, cuisine: "pizza" };
    return Response.json({
      elements: [
        {
          type: "node",
          id: 12345,
          lat: Number(lat),
          lon: Number(lon),
          tags: {
            ...tags,
            name: `${city.name} test ${category}`,
            "addr:housenumber": "123",
            "addr:street": "Test Street",
            "addr:city": city.name,
            "addr:province": city.state,
            "addr:country": city.code.toUpperCase(),
          },
        },
      ],
    });
  }
  return original(input, options);
};
