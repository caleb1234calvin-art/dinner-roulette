# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current working branch: `feature/dinner-icon-pack-1`.
- Branch stack: `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`.
- Current branch contains casino audit work, legal/compliance, Dinner icon implementation, California/Oregon/Washington runtime work, and Nevada Pass 22 reconciliation.
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.
- Compliance review surface: PR #28. Restaurant icon work: Issue #29. Startup ident remains isolated on draft PR #30.

## National casino audit

**27 jurisdiction passes are complete and active. Nevada Pass 22 is in reconciliation and is not active.**

Recent completed runtime passes: California Pass 19 (69 curated destinations from 74 regulator IDs), Oregon Pass 20 (10 destinations), Washington Pass 21 (30 destinations). California workflow `34558916921`, Washington `34565739203`, and corrected Oregon + inherited Washington `34566845887` passed blocking TypeScript/build/icon gates. Inherited npm tests remain report-only.

## Nevada — Pass 22 reconciliation / completeness correction

Nevada's original candidate discovery is no longer treated as complete. Rural/balance-of-state recovery continues to surface valid destination casinos absent from the initial market ledgers. **Do not create or activate `casino-catalog-pass-22.ts` yet.**

Primary authority remains the Nevada Gaming Control Board. NGCB public reporting exposes Location Detail, Name and Address, Restricted/Nonrestricted and Nonrestricted Count reports through `https://publicreports-gcb.nv.gov/`. The June 30, 2026 nonrestricted-count workbook is the current count checkpoint found during this audit. NIGC/current tribal evidence is the separate tribal/Class II cross-check.

Key scope rule: nonrestricted status is regulatory identity evidence, not automatic Dinner Roulette destination eligibility. Small retail/route gaming can remain outside the curated backbone even when legal gaming exists.

### Nevada accounting

- Original discovery universe: **153 candidate/scope-review rows**.
- Tribal reconciliation added Avi Resort & Casino and Moapa Paiute Travel Plaza, producing the prior **155-row** decision universe.
- Initial rural recovery surfaced 8 additional credible candidates.
- Rural recovery Pass 5 then found two more previously unaccounted Jackpot destination casinos: **Barton's Club 93** and **Four Jacks Hotel & Casino**.
- Current **provisional decision universe is 165 rows**.
- 165 is not a final casino count. It is an audit accounting universe and may still change during active-NGCB completeness reconciliation.

Recovered rural set now includes Cactus Pete's Resort Casino, Horseshu Hotel & Casino, Barton's Club 93 and Four Jacks in Jackpot; Fernley Nugget; Stockmen's Gambling Hall Fallon; Dini's Lucky Club Yerington; C Punch Inn Lovelock; El Capitan Hawthorne; and Stagecoach Beatty.

### Nevada audit artifacts

Core ledgers remain the Strip/Downtown, outer Clark, Laughlin, northern-markets and balance-state ledgers plus tribal cross-check and statewide accounting. Reconciliation artifacts now include:

- `audit/nevada-reconciliation-pass-1-2026-09-11.json`
- `audit/nevada-ambiguity-resolution-pass-2-2026-09-11.json`
- `audit/nevada-ambiguity-resolution-pass-3-2026-09-11.json`
- `audit/nevada-scope-address-pass-4-2026-09-11.json`
- `audit/nevada-rural-completeness-recovery-2026-09-11.json`
- `audit/nevada-rural-recovery-pass-5-2026-09-11.json`
- `audit/nevada-statewide-candidate-accounting-2026-09-11.json`

### Major resolved Nevada decisions

Current includes/retained identities include Casino Royale; Caesars Republic Lake Tahoe (Harveys alias retired); Harrah's Lake Tahoe separately; Venetian and Palazzo separately; Wynn and Encore separately; Avi; Moapa Paiute Travel Plaza; Alamo Casino at Sparks Petro; and the established major-market candidates subject to final NGCB accounting.

Rural Pass 5 materially advanced the recovered set. Cactus Pete's and Horseshu are current separate Jackpot destinations. Barton's Club 93 is current and has recent Nevada Gaming Commission identity corroboration. Four Jacks is current and appears in June 2026 Commission nonrestricted material. Fernley Nugget is reconciled to the current 1190 E Main St identity rather than stale 190 E Main tourism data. Dini's Lucky Club, C Punch Inn, Stagecoach Beatty and El Capitan Hawthorne are retained as current destination casinos with regulator/first-party corroboration. El Capitan still needs final postal/address normalization and coordinate QA.

Current exclusions/retirements include Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho, Harrah's Reno, Eastside Cannery, Wa She Shu unless reopening is authoritatively proven, Moulin Rouge current-destination claim, Bayshore Inn from the curated backbone, erroneous town-of-Eureka `Eureka Casino`, erroneous `Gold Dust West Winnemucca`, and Dotty's/ordinary retail-style gaming by default. Dotty's Jackpot was discovered but remains outside the curated backbone under that scope rule. Cromwell is alias-only under The Vanderpump Hotel. Palms remains one physical destination regardless of tribal ownership.

Red Drag Casino remains a current Elko candidate needing exact NGCB matching. Stockmen's Gambling Hall Fallon also still needs exact current identity/scope disposition.

### Address QA progress

Pass 4 normalized/currently corroborated rural addresses for Stockman's Casino Fallon, Bonanza Casino Fallon, Winnemucca Inn & Casino, Model T Casino, Winners Inn & Casino, Tonopah Station, Hotel Nevada & Gambling Hall, and Prospector Hotel & Gambling Hall. Pass 5 added current/reconciled addresses for Cactus Pete's, Horseshu, Barton's Club 93, Four Jacks, Fernley Nugget, Dini's Lucky Club, C Punch Inn and Stagecoach, with El Capitan retained pending final postal normalization. Coordinate QA remains pending.

### Nevada activation gates

1. Continue regulator-backed statewide completeness sweep against active NGCB nonrestricted locations, with special attention to balance-of-state/rural communities.
2. Resolve Stockmen's Fallon, Red Drag Elko and any further recovered rows against current NGCB identity and Dinner Roulette destination scope.
3. Account every surviving candidate against current NGCB identity or an explicit tribal/federal exception.
4. Normalize all retained physical addresses.
5. Complete property-specific coordinate QA.
6. Produce final all-row accounting with no unexplained candidates, aliases, duplicates or omissions.
7. Only then generate the Nevada runtime dataset and `casino-catalog-pass-22.ts`, wire search, run blocking validation and mark Nevada jurisdiction #28 complete.

## Casino audit operating rules

Government/regulator sources are preferred for roster/identity truth; operator/property sources are secondary for current branding/address. Nonrestricted gaming status alone is insufficient for destination scope. Restricted slot-only, route/distributed retail, online-only and ordinary retail gaming stay outside the curated backbone unless a distinct destination-casino justification exists. Explicit exclusions, dedupes, holds and uncertainty are preferable to invented certainty. Curated records supplement live OSM discovery rather than replacing it. National completion still requires all applicable jurisdictions and a final cross-jurisdiction duplicate/alias/retirement sweep.

## Legal/compliance continuity

Goal is risk reduction, not a guarantee of legal compliance. Dinner Roulette is an independent discovery/decision tool; third-party names identify destinations/services without implying affiliation. External links are third-party destinations. Changing facts are verify-first. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` exists and legal/privacy/third-party information is surfaced in Settings.

Rideshare remains neutral Dinner Roulette treatment with no copied Uber/Lyft trade dress and visible `Drive sober`. Delivery shortcuts open independent DoorDash/Grubhub/Uber Eats home experiences; do not claim marketplace availability or scrape marketplace content.

## Restaurant icon system

Issue #29. Active Dinner presentation replaces third-party restaurant artwork with Dinner Roulette-owned generic cuisine/category icons while factual restaurant names remain text. There are 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Validation / maintenance

Workflow `.github/workflows/validate-icon-pack.yml` runs on `feature/dinner-icon-pack-1`. Blocking gates: dependency install, `tsc --noEmit`, development build and 30-icon verification. `npm test` remains report-only due inherited template debt. Do not fabricate `.grok/skills/og` documentation merely to green inherited documentation-contract tests.

## Merge discipline

Dependency/load order: `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`.

Preferred ship path remains a dedicated integration/compatibility branch with combined validation. Merge to `main` only after Caleb explicitly requests it.

`main` remains untouched.
