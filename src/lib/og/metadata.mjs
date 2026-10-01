import site from "./site.json" with { type: "json" };

export const CANONICAL_ORIGIN = "https://pickforus.app";
export const LEGACY_HOST = "dinner-roulette-chi.vercel.app";
export const MANIFEST_PATH = "/manifest.webmanifest";
export const TOUCH_ICON_PATH = "/apple-touch-icon.png";

/** Shared by React navigation and the final Vite/Nitro head injector.
 * This candidate is activated only by a later authorized deployment after
 * apex HTTPS is ready; hostname/env discovery never changes its identity.
 * @param {string} host
 * @param {string} url
 */
export function pickForUsHead(host = "", url = "/") {
  const hostname = host.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
  const servingProduction = hostname === "pickforus.app" || hostname === LEGACY_HOST;
  // All current routes are path-only. No tracking, install, or local-state
  // query parameters define independently indexable product content.
  const pathname = new URL(url, CANONICAL_ORIGIN).pathname;
  const path = pathname.replace(/\/+$/, "") || "/";
  const canonical = `${CANONICAL_ORIGIN}${path}`;
  const image = `${CANONICAL_ORIGIN}/og.jpg`;
  return {
    meta: [
      { title: site.title },
      { name: "description", content: site.description },
      {
        name: "robots",
        content: servingProduction && path === "/" ? "index,follow" : "noindex,follow",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: site.title },
      { property: "og:description", content: site.description },
      { property: "og:site_name", content: site.title },
      { property: "og:url", content: canonical },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: site.title },
      { name: "twitter:description", content: site.description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
