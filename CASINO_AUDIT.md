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
| Connecticut | 2 tribal casino resorts | 2 | Connecticut Department of Consumer Protection | Complete for currently operating casino resorts |
| Michigan | 27 | 27 | Michigan Gaming Control Board | Complete: 24 tribal Class III facilities + 3 Detroit commercial casinos |
| Ohio | 11 | 11 | Ohio Casino Control Commission / Ohio Lottery | Complete: 4 casinos + 7 VLT racinos |
| Indiana | 14 | 14 | Indiana Gaming Commission / National Indian Gaming Commission | Complete: 13 state-regulated venues + Four Winds South Bend |
| Illinois | 17 | 17 | Illinois Gaming Board | Complete: all 17 current IGB casino venues, including Fairmount Park racino |
| Delaware | 3 | 3 | Delaware Lottery | Complete: all 3 racetrack casinos with table games |
| West Virginia | 5 | 5 | West Virginia Lottery | Complete: 4 racetrack casinos + Greenbrier historic-resort casino |
| Missouri | 13 | 13 | Missouri Gaming Commission | Complete: all 13 current licensed riverboat casino properties |
| Arkansas | 3 | 3 | Arkansas DFA / Arkansas Racing Commission | Complete: Oaklawn, Southland, and Saracen |

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

### Michigan
The Michigan Gaming Control Board's 2025 Tribal Gaming Annual Report lists 24 Class III tribal casino facilities. Eight tribal properties were already represented in the seed and 16 tribal facilities were added in pass 3. Together with the state's three separately regulated Detroit commercial casinos, this brings the Michigan runtime catalog to 27 physical casino facilities under the app's current scope. Small/secondary tribal properties are retained because the app scope includes physical casino venues rather than only destination resorts.

### Ohio
Ohio's physical casino-venue scope consists of four casinos regulated by the Ohio Casino Control Commission and seven video-lottery racinos overseen by the Ohio Lottery. All eleven were added in pass 4. Racinos are included because the national audit scope explicitly includes physical racino casino venues while excluding distributed retail gaming terminals.

### Indiana
The Indiana Gaming Commission's casino-locations roster identifies thirteen state-regulated casino/racino properties, including the Terre Haute Casino Resort that opened in 2024. The Pokagon Band's Four Winds Casino South Bend is tribal gaming rather than an IGC-regulated casino and is reconciled separately against NIGC material. Together these produce fourteen physical casino venues under the app's national scope.

### Illinois
The Illinois Gaming Board identifies seventeen casinos in the state as of the 2026 audit. The pass includes established riverboat/land-based properties, newer venues, and Fairmount Park Casino & Racing, Illinois' first racino.

### Delaware
The Delaware Lottery identifies three racetrack casinos with table games: Delaware Park Casino, Bally's Dover Casino Resort, and Harrington Raceway & Casino. All three are activated in pass 6.

### West Virginia
West Virginia Lottery oversight covers four racetrack casinos offering video lottery/table games plus the historic-resort casino at The Greenbrier. These five destination casino properties are activated in pass 7. Distributed limited-video-lottery retail locations are excluded because the app scope is physical casino-style venues rather than bar/retail gaming terminals.

### Missouri
The Missouri Gaming Commission's current Class A operator-license and casino-contact records reconcile 13 licensed riverboat casino properties. All 13 are activated in pass 8, including Kansas City/St. Louis metro properties and the regional casinos in Cape Girardeau, Caruthersville, Boonville, LaGrange, and St. Joseph. Missouri's regulatory framework restricts licensed gambling games to excursion gambling boats and floating facilities, so the pass follows the MGC's physical casino-license roster rather than distributed gaming locations.

### Arkansas
Arkansas Department of Finance and Administration / Racing Commission materials identify three active casino licensees under Amendment 100: Oaklawn Racing Casino Resort in Hot Springs, Southland Casino Hotel in West Memphis, and Saracen Casino Resort in Pine Bluff. All three are activated in pass 9. The Pope County casino license remains outside the active roster because the Arkansas Supreme Court voided the prior license and state materials list only the three operating licensees.

## Deployment discipline

Vercel deploys every pushed commit on this branch. Audit work should therefore be published as coherent atomic commits whenever multiple files must change together. Do not intentionally push half-wired imports, scripts, manifests, or catalog passes.

## Remaining work

Continue state-by-state and tribal-jurisdiction reconciliation across the United States. Priority should be given to jurisdictions with large physical casino inventories and/or substantial tribal gaming footprints. The national audit is **not complete** until every applicable jurisdiction has been reconciled, the final cross-jurisdiction duplicate/alias/retirement pass is clean, and the release candidate passes audit, typecheck, build, tests, and deployment smoke checks.
