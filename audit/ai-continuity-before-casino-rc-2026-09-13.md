# Dinner Roulette / Pick For Me — AI Continuity

_Updated September 13, 2026 after validated integration promotions through PR #36._

## Current state and authority

- Repository: `caleb1234calvin-art/dinner-roulette`; active development/integration branch: `integration/active-work-pass-1`.
- Latest promoted implementation merge: `ea82bb1f2fe67cc9493eea190c7e82dc298c5276` (PR #36). Documentation checkpoints may follow without changing runtime.
- `main` baseline was repeatedly verified unchanged at `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`. Do not modify or merge to main unless Caleb explicitly authorizes it.
- No Vercel deployment is authorized. `vercel.json` disables automatic Git deployments for `integration/**`. Do not rely on the historical Vercel rate-limit condition. ChatGPT subscription upgrades do not change this deployment restriction.
- Continue research, source verification, code, tests, data structures, cleanup and development-build validation without hosted publication. Never call GitHub integration work deployed.
- Do not delegate to another agent/assistant unless Caleb explicitly requests it. Preserve unrelated user edits and historical evidence.

## Verified promotions

| Work | PR | Validated exact head | Run | Integration merge |
| --- | --- | --- | --- | --- |
| Pass 49 audit repair, Cadence correction and legacy-ID reconciliation | [#33](https://github.com/caleb1234calvin-art/dinner-roulette/pull/33) | `25b2e0cd53049a6066d613d5ccfe6a63ee57dcd0` | [286](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34732399513) | `6563c1eec00cc44a004f4a7cbbfbd18739b952fc` |
| Pass 50 four current-property coordinate holds | [#34](https://github.com/caleb1234calvin-art/dinner-roulette/pull/34) | `b8d4295c8b863a8193f63e51dea77d77e63000da` | [288](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34732655250) | `a7d894c9fde4391216378c49d6832097fc47fff8` |
| Required portable repository/application test gate | [#35](https://github.com/caleb1234calvin-art/dinner-roulette/pull/35) | `a76ffbe7975f667dd808886462571ec0ba79934b` | [290](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34732944855) | `376a97bfd3601110ea63f4af9bfd82b30fe242f5` |
| Complete manifest coverage for every active jurisdiction | [#36](https://github.com/caleb1234calvin-art/dinner-roulette/pull/36) | `e04a76475885093e54cb1e8a241bbf487cfb591a` | [292](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34733191269) | `ea82bb1f2fe67cc9493eea190c7e82dc298c5276` |

Run 292 passed the complete required workflow: dependency installation, typecheck, 21 casino regression tests, curated and national casino audits, repository/application tests, development bundle and all 30 Dinner icon assets.

- Repository suite: **219 passed, zero failed, four explicit skips**.
- Application suite: **51 passed, zero failed, zero skipped**.
- The 21 casino regressions are included in repository tests and are also run as a dedicated required step; do not double-count them as additional unique tests.
- The four skipped checks validate an external OG assistant documentation package. `.grok/` and AGENTS.md are intentionally gitignored and absent from a clean checkout. Existing assertions still execute when that external package is installed; `REQUIRE_WORKSPACE_DOCS=1` also makes absence fail closed.
- `npm test` now uses `scripts/test-runner.mjs`: both suites execute even if the first fails, and any failure makes the combined command fail. The workflow no longer treats the general test suite as report-only.
- Earlier Runs 286/288 passed their then-required gates but had four report-only documentation failures and did not reach application tests. Those limitations were resolved by PR #35; do not rewrite the historical results.

## Casino catalog accounting

| Scope | Current canonical destinations | Status |
| --- | ---: | --- |
| Nevada | 109 | Pending statewide scope/reconciliation |
| Oklahoma | 56 | Pending remaining operator/scope work |
| Colorado | 31 | Complete under current physical-destination scope |
| Texas | 4 | Complete under current physical-destination scope |
| Four-state focus | 200 | Not a claim of Nevada/Oklahoma completeness |
| National casino catalog | 731 | 744 serialized historical rows across 50 passes |

All 41 active jurisdictions are now represented in the manifests: 39 complete and two pending. Complete-state runtime counts are exact hard gates. Unknown statewide totals may be null only for pending jurisdictions; any supplied count must still be a positive integer. Every active jurisdiction must have a manifest record.

The old Oklahoma count of 51 omitted two already-active backbone properties, Indigo Sky and Buffalo Run. Those were not new additions. The prior 194/198 four-state projections are superseded by the exact exported counts above.

## Repairs that matter

1. `audit/casino-sources*.json` jurisdictions are keyed objects, not arrays. Merge base then integration overrides. Audit actual exported TypeScript catalog records, preserving factory-generated IDs and audit metadata; do not return to regex-only argument counting.
2. Canonicalization stays chronological and matches `src/lib/nightlife/search.ts`: same ID or exact normalized name within 0.35 miles, latest record wins. Same ID at a distinct location is a hard failure, compared against every prior occurrence. Same name at distant locations remains distinct.
3. Beau Rivage and MGM Grand were duplicated through changed IDs and names. Later Pass 16/22 records now retain their original backbone stable IDs. Dedicated real-export lineage tests protect this; historical rows and original coordinates were not deleted.
4. Cadence Crossing's handoff coordinate **36.08622,-115.03321 was unsupported**. The corrected current named MapQuest LocalBusiness point is **36.052633,-114.994834**, about 3.159 miles away. Its official directions page still points to legacy Jokers Wild; that old map link is not the current coordinate source.

Key repair evidence:

- `audit/cadence-crossing-coordinate-correction-2026-09-13.json`
- `audit/casino-legacy-lineage-reconciliation-2026-09-13.json`
- `audit/integration-test-gate-recovery-2026-09-13.json`
- `audit/national-manifest-coverage-reconciliation-2026-09-13.json`
- `audit/integration-validation-summary-2026-09-13.json`

## Pass 50: four former coordinate holds promoted

| Destination | Coordinate | Current-property evidence |
| --- | --- | --- |
| Red Dragon Casino, Elko | 40.82809,-115.75709 | Raw named MapQuest LocalBusiness geo at 404 S 5th St, corroborated current county/operation identity |
| Lakecrest Casino and Hotel | 34.1348459,-97.1167007 | Operator-published Google Maps current named property destination |
| Lake Eufaula Casino Hotel | 35.3000591,-95.5921671 | Operator-published 1045 Birkes Rd building destination explicitly listing the current casino |
| Creek Nation Casino Holdenville | 35.0912327,-96.4034396 | Operator-published 211 E Willow St building listing the casino; independent MapQuest point agrees closely |

Full links, source fields, conflicts, raw-source retrieval references and rejected points are in `audit/casino-frontier-coordinate-qa-2026-09-13.json`. `scripts/casino-frontier.test.mjs` guards serialization against those source fields.

- Red Dragon and co-located Dotty's #214 are one routable property, not two roulette destinations.
- Lakecrest's differing MapQuest point is retained as a discrepancy, not selected or misrepresented as operator-supplied.
- Lake Eufaula uses destination `!3d/!4d`, not the Google Maps viewport longitude. The old 806 W Forrest Ave casino stays excluded; use operator address 1045 Birkes Rd.
- Holdenville's earlier city centroid remains excluded. No predecessor, city centroid, nearby development or guessed coordinate may clear a hold.
- Cadence's quarantined Jokers Wild points remain excluded as coordinate sources.

## Remaining work, not deployment blockers

All four named coordinate holds from the handoff are cleared, but statewide Nevada/Oklahoma coverage is not complete.

- The Pass Casino, Whiskey Pete's and Buffalo Bill's remain closure/renovation holds without confirmed current daily-gaming reopening. Ownership sales or historical hours alone are not reopening evidence.
- Primm Valley is a separate active destination with July 22, 2026 reopening evidence. Do not infer that the other Primm casinos reopened.
- Oklahoma's current 56 is a partial verified runtime set, not a statewide inventory total. Continue the planned clusters in `audit/oklahoma-statewide-scope-2026-09-11.json`: Quapaw/northeast, Sac & Fox/Seminole/Shawnee, Comanche and remaining tribal/rural properties, after checking which existing ledgers already cover each.
- Nevada's 174 pending manifest figure is a provisional decision universe including exclusions/aliases, not a runtime target. Continue scope maintenance, closure checks and independent property QA.
- Colorado remains maintenance at 31 (13 Black Hawk, 6 Central City, 10 Cripple Creek, 2 tribal); Texas remains maintenance at four.
- Naskila Leggett's coordinate provenance is user-assisted map-pin verification, not first-party numerical publication. Preserve that distinction.

Use the connected research stack as relevant (TinyFish, Tavily/Parallel, Firecrawl; Exa only if meaningful gaps remain). The cadence is discover → verify → reconcile → implement → exact-head validate → promote → re-audit. Never reduce the evidence standard to increase counts.

## Execution and verification limits

The local execution environment failed its exec-server handshake. Repository work and full CI succeeded through GitHub, but no interactive local-browser smoke test or hosted acceptance test has been claimed.

Safe validation commands are `npm run typecheck`, `npm test`, `npm run audit:casinos`, and `npm run build:dev`. Do not casually use `npm run build`: its production command also runs database migrations.

When execution is restored, inspect the existing dirty local checkout before editing. Verify local browser routing, distance filtering, mobile layout and integrations without deploying. A green CI bundle does not prove those interactive behaviors or production readiness.

Before any promotion, inspect the current PR/base refs and exact-head workflow. Only `integration/active-work-pass-1` is the promotion target. Use expected head SHA, and revalidate if code or the validated head changes.

## Preserve app behavior and identity

- Dinner Roulette V.3 is moving toward Pick For Me: dinner, nightlife, date-night and seasonal discovery remain distinct app behaviors.
- Preserve curated casino passes, Jasper County/local catalogs, live Overpass mirrors and merge/fallback behavior. A broader dedupe refactor requires explicit regression protection.
- The app is an independent discovery/decision tool; preserve LEGAL.md and Settings disclosures. No wagers, gambling service, alcohol sales or guaranteed admission are offered.
- Preserve all 30 Dinner icons under `public/dinner-icons/{dark,light}/` and the semantic resolver.
- Caustic Relay/Mordax visual identity is immutable unless Caleb requests a redesign. Preserve `public/brand/CAUSTIC_RELAY_ident-2.mp4` and `src/components/startup-ident.tsx`.
- Future food-truck discovery must distinguish serving now, scheduled today and discovered nearby. A stale registered business address must not be treated as confirmed current truck location.
- The Jasper County audit remains useful provenance and discovery context, not permission to conflate separate app features or source standards.

## Historical handoff

The original pre-Astra continuity is preserved verbatim at `audit/ai-continuity-handoff-2026-09-12.md`. Its old coordinate/count/gate claims are superseded by this file and dated correction artifacts. Earlier session checkpoints remain available in Git history. Preserve historical audit artifacts as provenance.
