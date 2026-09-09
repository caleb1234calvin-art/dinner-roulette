# National casino catalog audit

Started: 2026-09-08

## Objective

Build a conservative U.S. casino catalog for Dinner Roulette. A curated venue is activated only after its identity, physical address, and coordinates are sufficiently trusted for distance calculations. Live OpenStreetMap discovery remains supplemental.

## Audit method

1. Reconcile each jurisdiction against a regulator or other authoritative gaming-facility list.
2. Verify current operating identity and physical address.
3. Confirm coordinates before activating the record.
4. Normalize renamed properties and reject duplicate aliases.
5. Preserve source provenance on audited records where practical.
6. Mark a jurisdiction complete only after omissions and duplicates have been reconciled.

## National benchmarks

These are audit benchmarks, not direct import sources. Commercial and tribal gaming overlap in some reporting contexts and must not simply be added together.

- American Gaming Association, State of the States / U.S. commercial gaming locations: https://www.americangaming.org/resources/state-of-the-states-2025/
- National Indian Gaming Commission, gaming operation and tribal gaming oversight resources: https://www.nigc.gov/

## Jurisdiction ledger

| Jurisdiction | Status | Primary authority/source | Notes |
| --- | --- | --- | --- |
| New Jersey | COMPLETE | NJ Casino Control Commission — https://www.nj.gov/casinos/home/info/ | Reconciled to 9 current Atlantic City casino licensees. Added Bally's, Golden Nugget, Harrah's, Resorts and Tropicana to the pass-1 seed. |
| Connecticut | IN PROGRESS | State/tribal sources | Seed contains Foxwoods and Mohegan Sun; needs formal reconciliation. |
| Massachusetts | IN PROGRESS | Massachusetts Gaming Commission | Seed contains Encore Boston Harbor, MGM Springfield and Plainridge Park; needs formal reconciliation. |
| Pennsylvania | IN PROGRESS | Pennsylvania Gaming Control Board | Seed is incomplete; full facility reconciliation required. |
| Maryland | IN PROGRESS | Maryland gaming regulator | Seed is incomplete; full facility reconciliation required. |
| Michigan | IN PROGRESS | Michigan Gaming Control Board + tribal sources | Seed has Detroit commercial casinos plus selected tribal facilities; full reconciliation required. |
| Mississippi | IN PROGRESS | Mississippi Gaming Commission | Seed is incomplete. |
| Louisiana | IN PROGRESS | Louisiana Gaming Control Board | Seed is incomplete. |
| Oklahoma | IN PROGRESS | Tribal/NIGC sources | Seed contains selected facilities only; large reconciliation pass required. |
| Arizona | IN PROGRESS | Arizona Department of Gaming + tribal sources | Seed is incomplete. |
| Nevada | IN PROGRESS | Nevada Gaming Control Board | Seed is intentionally only a handful of anchors; full reconciliation required. |
| California | IN PROGRESS | California Gambling Control Commission + tribal/NIGC sources | Seed is incomplete. |
| Remaining U.S. gaming jurisdictions | QUEUED | State regulators + NIGC/tribal sources | To be processed state by state. |

## Completed findings

### New Jersey

The NJ Casino Control Commission's current casino-information page identifies nine Atlantic City casino licensees. The original national seed contained four of them: Borgata, Caesars, Hard Rock, and Ocean. The audit added the five omitted current properties:

- Bally's Atlantic City
- Golden Nugget Atlantic City
- Harrah's Resort Atlantic City
- Resorts Casino Hotel
- Tropicana Atlantic City

The curated New Jersey set is therefore 9/9 against the regulator list as of this audit pass.

## Rules for declaring the national audit complete

The audit is not complete merely because the catalog is large. Completion requires every applicable U.S. gaming jurisdiction to be marked COMPLETE in this ledger, every activated record to satisfy identity/address/coordinate requirements, and known duplicate/renamed properties to be reconciled.
