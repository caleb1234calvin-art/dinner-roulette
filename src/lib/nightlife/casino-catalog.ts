import type { NightlifePlace } from "./types";

/**
 * National casino audit backbone.
 *
 * This catalog is intentionally curated rather than populated from an unverified
 * bulk scrape. A casino is promoted into CASINO_CATALOG only after its identity,
 * location and coordinates are sufficiently trusted for distance calculations.
 * Live OSM discovery remains supplemental and is merged/deduplicated at runtime.
 *
 * Audit strategy:
 *   1. Work outward region-by-region, then complete national coverage.
 *   2. Prefer casino/operator/regulator sources for identity and address.
 *   3. Verify coordinates independently before activation.
 *   4. Keep uncertain records out of the active array until resolved.
 *   5. Re-audit incrementally for openings, closures and rebrands.
 */

export interface CasinoAuditRecord extends NightlifePlace {
  audit: {
    verifiedOn: string;
    jurisdiction: string;
    operator?: string;
    notes?: string;
  };
}

/**
 * Active verified records only. The first audit batch will be added here as
 * venues are verified. Keeping the array valid-but-empty means the integration
 * can ship independently of the national data collection effort without ever
 * presenting guessed casino data to users.
 */
export const CASINO_CATALOG: CasinoAuditRecord[] = [];

export const CASINO_CATALOG_META = {
  scope: "United States",
  strategy: "live-plus-curated",
  status: "audit-in-progress",
  startedOn: "2026-09-08",
  requirements: ["identity", "address", "coordinates"],
} as const;
