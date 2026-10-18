# Phase 2 — Offline OSM metadata proposal adapter (2026-10-18)

**Scope:** Isolated nonproduction successor to frozen PR #84 commit `9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4`. No new network access, operator-page crawling, schedule verification, runtime wiring or publication.

- `scripts/seasonal-osm-metadata.mjs`: consumes *supplied* Overpass element JSON and produces conservative unverified metadata leads only.
- `scripts/seasonal-osm-metadata.test.mjs`: synthetic fixture checks, with no API access.
- Dedicated offline GitHub Actions workflow checks tests and changed-file lint.

All proposals explicitly have `verified=false`, `publishable=false`, `openNowEligible=false`, `year2026Verified=false`, no dates or opening hours, and retained OSM object IDs and ODbL attribution. Coordinates describe mapped points/centers, never verified entrances. The adapter does not follow OSM website tags or import into Date Night.

**Limitations:** Discovery is limited to explicitly mapped seasonal attraction tags. No actual live network call is permitted in this phase. Existing app Overpass providers already supply some of this metadata; incremental coverage is unknown. True date/hour evidence, provenance conflict resolution, identity inventory refresh, durable negative lifecycle authority, complete ODbL/public attribution, privacy review, public-service rate limiting and exact live network acceptance remain future gates.

**Release boundaries:** PR #84 remains frozen draft. PR #82 conditional October 19 authority is separate. No merge, deploy, migration, app-store action or publication authorized. Evaluate CI against exact candidate commit before marking PASS. This phase is research-only and requires separate owner approval for any production promotion.
