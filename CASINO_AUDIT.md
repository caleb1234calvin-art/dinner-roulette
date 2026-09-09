# National Casino Audit

Audit branch: `audit/national-casino-pass-1`

## Definition of complete

A jurisdiction is only marked complete when:

1. The current physical casino/gaming-establishment roster is reconciled against an authoritative regulator/government source.
2. Every active catalog record has a stable ID, physical address, plausible coordinates, jurisdiction, and verification date.
3. Missing facilities are added and retired/renamed facilities are reconciled rather than duplicated.
4. Duplicate IDs and same-property aliases are checked across all curated casino passes.
5. The resulting curated records remain supplemental to live OSM discovery and merge cleanly at runtime.

## Completed jurisdiction passes

| Jurisdiction | Expected physical facilities | Catalog coverage | Primary authority | Status |
| --- | ---: | ---: | --- | --- |
| New Jersey | 9 | 9 | NJ Casino Control Commission | Complete |
| Pennsylvania | 18 | 18 | Pennsylvania Gaming Control Board | Complete |
| Maryland | 6 | 6 | Maryland Lottery and Gaming | Complete |
| Massachusetts | 3 | 3 | Massachusetts Gaming Commission | Complete |
| Connecticut | 2 tribal casino resorts | 2 | Connecticut state/tribal gaming oversight references | Complete for currently operating casino resorts |

## Audit controls

- Identity/roster source should be governmental or regulator-backed wherever available.
- Venue/operator websites are secondary sources for addresses, branding, and current naming.
- Coordinate provenance is tracked separately when available.
- Records with uncertain identity, location, or operational status are not promoted into the curated catalog merely to inflate coverage.
- OSM remains the discovery/supplemental layer; curated data is the high-confidence backbone.

## Current reconciliation notes

### New Jersey
Reconciled to the state's nine Atlantic City casino licensees. Five properties absent from the original seed were added.

### Pennsylvania
Reconciled to the PGCB's 18-property retail casino reporting set. Fifteen properties absent from the original seed were added.

### Maryland
Maryland Lottery and Gaming identifies six casinos. MGM National Harbor and Horseshoe Baltimore were already in the seed; Live! Casino & Hotel Maryland, Ocean Downs Casino, Hollywood Casino Perryville, and Rocky Gap Casino Resort were added in pass 2.

### Massachusetts
The Massachusetts Gaming Commission lists Encore Boston Harbor, MGM Springfield, and Plainridge Park Casino as its three casino gaming licensees. All three were already present in the national seed, so this was a zero-add reconciliation pass.

### Connecticut
The national seed contains Foxwoods Resort Casino and Mohegan Sun, the two currently operating tribal casino resorts represented in Connecticut gaming oversight materials. No additions were required in this pass.

## Remaining work

Continue state-by-state and tribal-jurisdiction reconciliation across the United States. Priority should be given to jurisdictions with large physical casino inventories and/or substantial tribal gaming footprints. The national audit is **not complete** until the remaining applicable jurisdictions have been reconciled and the final cross-jurisdiction duplicate/alias/retirement pass is clean.
