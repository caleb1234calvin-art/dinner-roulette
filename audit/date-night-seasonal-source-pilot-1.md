# Pick For Us — Seasonal Source Pilot #1

**SEASONAL SOURCE PILOT #1 BLOCKED — SOURCE NOT AUTHORIZED / UNSUITABLE**

Cadaver Zone was the only candidate. One unauthenticated HTTPS access-review request to `https://cadaverzone.com/robots.txt` returned gateway HTTP 502 on 2026-10-04. No robots directives or operator page were received. The source was stopped before collector implementation. This does not establish an operator prohibition, site-wide outage, or attraction closure.

## Exact base and branch

- Starting SHA: `e097f949d2871054a47ab55869396d7ce1baca86`
- Starting tree: `174b0efc91532029a7d6a989346579871e246de7`
- Starting sole parent: `f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`
- Starting branch: `fix/date-night-seasonal-fact-contract-remediation-1`
- New branch: `feature/date-night-seasonal-source-pilot-1`, directly from the exact base.
- Implementation commit: none. The unique commit introducing this report is documentation/evidence only and has the exact base as its sole parent. Resolve its SHA/tree from Git; the external full report records both.

The implementation, original/remediation reports, continuations, tests and independent reverification report were reviewed before source review. All 91 manifest-covered retained evidence payloads passed hash/size checks. All preexisting tracked files remain unchanged. No source policy/schema, adapter, registry, runtime, package, lockfile or production configuration was changed.

## Source review: NO-GO

| Item | Finding |
| --- | --- |
| Candidate | Cadaver Zone, Webb City / Joplin-area Missouri |
| Operator-linked domain | `cadaverzone.com` |
| Canonical operator domain | Unconfirmed from live operator response; apex versus www unresolved |
| Operator control | Plausible lead: indexed profile at `https://www.facebook.com/cadaverzone/` links the domain; live ownership unverified |
| robots.txt | Unknown: gateway HTTP 502 instead of directives |
| Terms / reuse | Unknown; no further page fetched after the stop condition; absence of terms is not asserted |
| Ordinary unauthenticated access | Not established by the unsuccessful HTTPS review |
| CAPTCHA / login / paywall / bot challenge | Unknown; no operator page received and no bypass attempted |
| Expected factual URLs | Candidate home page `https://cadaverzone.com/` only, not fetched or approved; no factual subpaths discovered |
| Request budget | Zero approved collector requests; one direct review attempt |
| Static HTML / structured data | Unknown; the received HTML was a gateway diagnostic |
| JavaScript requirement | Unknown; browser/script execution prohibited and unused |
| Contract fit | Cannot establish affirmative robots, terms, permission/reuse, evidence and expiry requirements; no source enabled |
| Verdict | **NO-GO** |

No retry, alternate host, HTTP downgrade, alternate scraper, proxy rotation, browser, bypass or replacement followed. Search snippets identified only a domain lead and did not populate the fact contract. No LLM-based source extraction was implemented.

## Network, facts and artifacts

Exact direct attempt: `GET https://cadaverzone.com/robots.txt`. HTTPS only; no credentials, redirect following or retries; 10-second total timeout; 5-second connect timeout; 16,384-byte response bound. The gateway returned 502 and 218 bytes. An operator-origin response was not verified. Exact diagnostics/bytes are retained in the separately delivered full evidence package.

Collector attempts, unauthorized collector hosts, unrelated public-provider collector calls, geocoder calls, paid API calls and new billing dependencies: **all zero**. Three built-in search calls contained four domain-discovery queries; zero explicit result-page opens. Search-service upstream request counts are not exposed. Administrative GitHub/Vercel reads, branch publication and locked dependency setup are separate from collection.

Real observations, extracted contract fields, normalized occurrences and pilot fact artifacts: **none**. Halloween 2026 is only the target; operator season evidence is absent. Coordinates remain unresolved without invented latitude/longitude. Lifecycle is unknown, not closed or cancelled. Access review excludes this candidate before collection. No placeholder occurrence or empty replacement runtime snapshot was published.

Access provenance is in the public review summary; full request provenance is in the private evidence package. Pilot artifact hashes are not applicable. Existing synthetic artifacts are unchanged; revision `0b4823ffd0460646a0c6dc40e9cd30661c54a6ec9151cbf84e37a11fa1c06bcd`, bundle SHA-256 `eda32ef8263212b585e6e13fe708ffc53fb803264c665cff501947995b7d9708`. Those are regression fixtures, not real pilot output.

## Fresh validation

| Gate | Result |
| --- | --- |
| Pilot-specific tests | Not applicable after pre-implementation NO-GO |
| Contract + remediation | 112 + 196 = 308 passed, zero failures |
| Retained independent security matrix | 468 passed, zero failures |
| Full repository suite | 1,037 passed, zero failures, four inherited skips; 1,041 total |
| Contract / product typechecks | Both passed |
| Changed executable lint | Not applicable: no executable delta |
| Existing contract surface lint | Passed, no diagnostics |
| Migration-free build | Passed; server/config output checked; compiled regressions passed |
| Existing synthetic regeneration | Two guarded runs; all ten files byte-identical to base |
| Guarded collector attempts | Zero |

Counts overlap. Source-specific parser/live-transport tests cannot be claimed passed because no collector exists. Full lint was not rerun for the documentation-only delta; the known three inherited errors and six warnings are not called clean. The offline dependency install lacked cache; a locked install then succeeded without lifecycle scripts or package changes. Build command: `node scripts/with-app-env.mjs ./node_modules/.bin/vite build`. No `npm run build` or migrations.

## Evidence publication and preservation

This public branch contains only reduced documentation, public-source metadata, aggregate test results and hashes. Detailed administrative snapshots and logs remain in the separately delivered full report/evidence package. Automatic approval review rejected publication of the larger tree because it contained detailed Vercel metadata/logs; those payloads are excluded from this materially reduced publication. Do not republish the full package without authorization.

Before/after checks retain main `078f65c5d194435452ca14569ea00e57f52a20f3`, READY production at that SHA, and unchanged production aliases and exposed project settings. No main merge/movement, production promotion, manual deployment, Vercel/alias mutation, migration or runtime source activation occurred. An automatic non-production Preview from branch publication does not enable collection.

Changed paths are listed in `audit/date-night-seasonal-source-pilot-1-evidence/changed-paths.json`; payload hashes are in its artifact manifest. The full report includes exact final Git identities, full evidence hashes and all limitations.

## Independent review recommendation

Independently verify this blocked access review and documentation-only commit: exact parent, single direct request, zero collector/geocoder/paid calls, unchanged executable files and production preservation. A successful real-source pilot is not ready for verification.

Resume only after a new bounded source-access decision establishes ordinary access and robots/terms/reuse evidence. Do not retry or route around this session's failure under the current decision. Replacement selection needs a new documented bounded decision. Do not integrate into Date Night runtime.
