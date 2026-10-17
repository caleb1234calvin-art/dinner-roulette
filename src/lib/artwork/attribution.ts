import manifest from "./owner-attested-assets.json";

// Exact reviewed local assets only. No filename heuristics, remote URLs, SVG,
// audiovisual assets, platform icons, or unreviewed future files receive credit.
const attested = new Set(manifest.assets.map((asset) => asset.src));
export function hasAttestedArtwork(sources: readonly (string | null | undefined)[]): boolean {
  return sources.some((src) => typeof src === "string" && attested.has(src));
}
