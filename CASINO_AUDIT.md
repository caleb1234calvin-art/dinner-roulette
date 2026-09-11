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
| Rhode Island | 2 | 2 | Rhode Island Department of Business Regulation | Complete: Lincoln and Tiverton casino facilities |
| Maine | 2 | 2 | Maine Gambling Control Unit | Complete: Hollywood Casino Bangor and Oxford Casino |
| Kansas | 10 | 10 | Kansas Racing and Gaming Commission / NIGC | Complete: 4 state lottery casinos + 6 tribal casino venues |
| North Carolina | 3 | 3 | NIGC / tribal operators | Complete: 2 EBCI casinos + Catawba Two Kings introductory casino |
| Virginia | 5 | 5 | Virginia Lottery | Complete: five current casino properties in the July 2026 reporting roster |
| Alabama | 3 | 3 | NIGC / Poarch Band of Creek Indians | Complete: Wind Creek Atmore, Montgomery, and Wetumpka |
| Iowa | 23 | 23 | Iowa Racing and Gaming Commission / NIGC | Complete: 19 state-licensed facilities + 4 tribal casinos |
| Kentucky | 14 | 14 | Kentucky Horse Racing & Gaming Corporation | Complete: 14 active casino-style HHR destinations |
| Louisiana | 24 | 24 | Louisiana State Police Gaming Operations / NIGC | Complete: 20 state-regulated properties + 4 tribal casino destinations |
| Mississippi | 28 | 28 | Mississippi Gaming Commission / Mississippi Band of Choctaw Indians | Complete: 25 state-regulated properties + 3 MBCI casino destinations |
| Arizona | 26 | 26 | Arizona Department of Gaming | Complete: 26 current Class III tribal casino facilities in the regulator directory |
| California | 69 curated destinations from 74 regulator license rows | 69 | California Gambling Control Commission | Complete: all 74 regulator IDs accounted; 69 current curated physical destinations active, 5 explicitly held/excluded/deduped |
| Oregon | 10 | 10 | Oregon State Police / NIGC | Complete: nine Class III-oriented destinations + Ko-Kwel Medford Class II; Old Camp closed and Plateau Travel Plaza out of destination scope |
| Washington | 30 | 30 | Washington State Gambling Commission / NIGC | Complete: 28 visible WSGC directory properties + Shoalwater reconciliation exception + Elwha River Class II destination |

## Staged authoritative inventories

No currently staged jurisdiction remains in this section after Washington activation.

## Audit controls

- Identity/roster source should be governmental or regulator-backed wherever available.
- Venue/operator websites are secondary sources for addresses, branding, and current naming.
- Coordinate provenance is tracked separately only when a direct, property-specific source is known; generic or unrelated URLs are not recorded as coordinate provenance.
- Records with uncertain identity, location, or operational status are not promoted into the curated catalog merely to inflate coverage.
- OSM remains the discovery/supplemental layer; curated data is the high-confidence backbone.
- Audit snapshots may be committed before runtime activation, but a jurisdiction is not `complete` until its active records satisfy the definition above.

## Reconciliation notes

### California
The California Gambling Control Commission snapshot contains 74 active tribal-casino license rows. Full all-ID accounting proved all 74 IDs are represented in the audit decision set with no overlap or omissions. The runtime catalog intentionally activates 69 current physical destinations in `casino-catalog-pass-19.ts`. Five regulator rows are held/excluded/deduped with explicit reasons, and the branch validation workflow completed successfully with TypeScript and development build gates passing.

### Oregon
Oregon is represented by ten current physical casino destinations in `casino-catalog-pass-20.ts`. Oregon State Police provides the Class III compact framework, while NIGC/operator evidence establishes Ko-Kwel Casino Resort Medford as an additional current Class II casino destination. Old Camp Casino remains excluded as closed and Plateau Travel Plaza remains outside the destination-casino scope. A post-implementation coordinate QA sweep corrected provisional map points before completion. The corrected combined head `fa6fd94a2a3959aece0a9a339f6a8d58c69abaf5` passed the branch validation workflow (`34566845887`).

### Washington
Washington is represented by thirty current physical tribal casino destinations in `casino-catalog-pass-21.ts`. WSGC states that 23 tribes operate 29 casinos under compact while its current directory surface exposes 28 properties. Current first-party evidence confirms Shoalwater Bay Casino as the compact-directory reconciliation exception. Elwha River Casino is separately retained as a current Class II physical casino destination, producing thirty destinations under Dinner Roulette's physical-destination scope without forcing it into the Class III compact count. Mistequa is reconciled as the current name of the former Chewelah Casino property. The Pass 21 runtime wiring head `5eeea6d56ab8eff958513215d489cbc0b7608498` passed branch validation (`34565739203`).

## Deployment discipline

Vercel deploys every pushed commit on this branch. Audit work should therefore be published as coherent atomic commits whenever multiple files must change together. Do not intentionally push half-wired imports, scripts, manifests, or catalog passes.

## Remaining work

Continue state-by-state and tribal-jurisdiction reconciliation across the United States. Twenty-seven jurisdiction passes are complete and active in the curated runtime. The national audit is **not complete** until every remaining applicable jurisdiction has been reconciled, the final cross-jurisdiction duplicate/alias/retirement pass is clean, and the release candidate passes audit, typecheck, build, tests, and deployment smoke checks.
