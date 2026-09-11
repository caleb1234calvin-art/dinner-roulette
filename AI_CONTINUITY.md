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

Nevada's original candidate discovery is no longer treated as complete. The audit correctly reopened its rural/balance-of-state completeness gate after current-source review surfaced credible casino destinations absent from the original discovery ledgers. **Do not create or activate `casino-catalog-pass-22.ts` yet.**

Primary authority remains the Nevada Gaming Control Board. NGCB public reporting exposes Location Detail, Name and Address, Restricted/Nonrestricted and Nonrestricted Count reports through `https://publicreports-gcb.nv.gov/`. The June 30, 2026 nonrestricted-count workbook is the current count checkpoint found during this audit. NIGC/current tribal evidence is the separate tribal/Class II cross-check.

Key scope rule: nonrestricted status is regulatory identity evidence, not automatic Dinner Roulette destination eligibility. Small retail/route gaming can remain outside the curated backbone even when legal gaming exists.

### Nevada accounting

- Original discovery universe: **153 candidate/scope-review rows**.
- Tribal reconciliation added Avi Resort & Casino and Moapa Paiute Travel Plaza, producing the prior **155-row** decision universe.
- Rural completeness recovery has now surfaced **8 additional credible candidates**, producing a **provisional 163-row decision universe**.
- 163 is not a final casino count and must not be represented as one. Active NGCB roster extraction may still add/remove rows.

Newly recovered rural candidates requiring regulator reconciliation: Cactus Pete's Resort Casino (Jackpot), Horseshu Hotel & Casino (Jackpot), Fernley Nugget Casino, Stockmen's Gambling Hall (Fallon), Dini's Lucky Club (Yerington), C Punch Inn & Casino (Lovelock), El Capitan Casino (Hawthorne), and Stagecoach Hotel & Casino (Beatty).

### Nevada audit artifacts

Core ledgers remain the Strip/Downtown, outer Clark, Laughlin, northern-markets and balance-state ledgers plus tribal cross-check and statewide accounting. Reconciliation artifacts now also include:

- `audit/nevada-reconciliation-pass-1-2026-09-11.json`
- `audit/nevada-ambiguity-resolution-pass-2-2026-09-11.json`
- `audit/nevada-ambiguity-resolution-pass-3-2026-09-11.json`
- `audit/nevada-scope-address-pass-4-2026-09-11.json`
- `audit/nevada-rural-completeness-recovery-2026-09-11.json`
- `audit/nevada-statewide-candidate-accounting-2026-09-11.json`

### Major resolved Nevada decisions

Current includes/retained identities include Casino Royale; Caesars Republic Lake Tahoe (Harveys alias retired); Harrah's Lake Tahoe separately; Venetian and Palazzo separately; Wynn and Encore separately; Avi; Moapa Paiute Travel Plaza; Alamo Casino at Sparks Petro; and the established major-market candidates subject to final NGCB accounting.

Current exclusions/retirements include Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho, Harrah's Reno, Eastside Cannery (closed/demolished), Wa She Shu unless reopening is authoritatively proven, Moulin Rouge current-destination claim, Bayshore Inn from the curated backbone, the erroneous town-of-Eureka `Eureka Casino` row, and erroneous `Gold Dust West Winnemucca` row. Cromwell is alias-only under The Vanderpump Hotel. Palms remains one physical destination regardless of tribal ownership.

Red Drag Casino is retained as a current Elko candidate based on the current Explore Elko visitor guide but still needs exact NGCB identity matching.

### Address QA progress

Pass 4 normalized/currently corroborated rural addresses for Stockman's Casino Fallon, Bonanza Casino Fallon, Winnemucca Inn & Casino, Model T Casino, Winners Inn & Casino, Tonopah Station, Hotel Nevada & Gambling Hall, and Prospector Hotel & Gambling Hall. Coordinate QA remains pending.

### Nevada activation gates

1. Run a regulator-backed statewide completeness sweep against active NGCB nonrestricted locations, with special attention to balance-of-state/rural communities.
2. Reconcile the 8 newly recovered rural candidates and any further omissions against active NGCB identity and Dinner Roulette destination scope.
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
