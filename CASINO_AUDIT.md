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

## Staged authoritative inventories

| Jurisdiction | Inventory | Activation status |
| --- | ---: | --- |
| California | 74 active tribal-casino licenses | Inventory captured; address/coordinate reconciliation in progress |

## Audit controls

- Identity/roster source should be governmental or regulator-backed wherever available.
- Venue/operator websites are secondary sources for addresses, branding, and current naming.
- Coordinate provenance is tracked separately only when a direct, property-specific source is known; generic or unrelated URLs are not recorded as coordinate provenance.
- Records with uncertain identity, location, or operational status are not promoted into the curated catalog merely to inflate coverage.
- OSM remains the discovery/supplemental layer; curated data is the high-confidence backbone.
- Audit snapshots may be committed before runtime activation, but a jurisdiction is not `complete` until its active records satisfy the definition above.

## Reconciliation notes

### New Jersey
Reconciled to the state's nine Atlantic City casino licensees. Five properties absent from the original seed were added.

### Pennsylvania
Reconciled to the PGCB's 18-property retail casino reporting set. Fifteen properties absent from the original seed were added. Coordinate provenance is being tightened independently where older pass records used generic or indirect references.

### Maryland
Maryland Lottery and Gaming identifies six casinos. MGM National Harbor and Horseshoe Baltimore were already in the seed; Live! Casino & Hotel Maryland, Ocean Downs Casino, Hollywood Casino Perryville, and Rocky Gap Casino Resort were added in pass 2. Weak indirect coordinate-source URLs were removed rather than represented as authoritative provenance.

### Massachusetts
The Massachusetts Gaming Commission lists Encore Boston Harbor, MGM Springfield, and Plainridge Park Casino as its three casino gaming licensees. All three were already present in the national seed.

### Connecticut
The national seed contains Foxwoods Resort Casino and Mohegan Sun, the two currently operating tribal casino resorts represented in Connecticut gaming oversight materials.

## Deployment discipline

Vercel deploys every pushed commit on this branch. Audit work should therefore be published as coherent atomic commits whenever multiple files must change together. Do not intentionally push half-wired imports, scripts, manifests, or catalog passes.

## Remaining work

Continue state-by-state and tribal-jurisdiction reconciliation across the United States. Priority should be given to jurisdictions with large physical casino inventories and/or substantial tribal gaming footprints. The national audit is **not complete** until every applicable jurisdiction has been reconciled, the final cross-jurisdiction duplicate/alias/retirement pass is clean, and the release candidate passes audit, typecheck, build, tests, and deployment smoke checks.
