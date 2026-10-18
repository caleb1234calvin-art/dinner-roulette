# Seasonal source-driven discovery — bounded research handoff (2026-10-18)

Status: **RESEARCH-ONLY PREPARATION / NOT RUNTIME READY**.

## Scope and authority
Owner authorized moving ahead with currently available sources and adding more later. Owner explicitly ruled out contacting third-party directories to negotiate access and excluded FrightMaps. This is NOT permission to scrape restricted sites, publish venues, modify production, merge, or deploy. Preserve PR #82 exact-head October 19 legal publication path and Play audit as separate workstreams.

Baseline: main commit `c3208d9fdc9a21d698efa9254be1286f5d3d2836`, existing 92 production curated identities reported in Issue #71. Draft PR #82 is distinct and protected. Reference: https://github.com/caleb1234calvin-art/dinner-roulette/issues/71

## Files
- `source-registry.json` is a policy-blocked research index, NOT an automated crawler allowlist.
- `scripts/seasonal-source-registry.test.mjs` enforces default-deny and no accidental approval of sources or pilot candidates.

## Source findings
- FrightMaps excluded on owner's explicit decision; no outreach.
- FrightFind and Haunts.com excluded from automated integration owing to discovered terms restrictions.
- HauntWorld, The Scare Factor, America Haunts and Pumpkin Patches and More are manual-reference/link-only candidates, pending formal access-policy checks. Their visibility on the public web is NOT a permission grant.
- CornfieldMaze.org access cannot presently be verified.
- Haunted Attraction Association's finder refers into The Scare Factor; do not count as independent coverage.
- Do not copy directory descriptions, images, reviews or lists, do not bypass site restrictions, and do not run network-fetch code from the app client.

## Architecture for future authorized work
1. Register individually cleared first-party attraction sites, with policy review including robots directives, terms, rate limits, and a recorded attribution/reuse scope.
2. Perform server-side bounded, on-demand retrieval with timeouts, cache/TTL, request coalescing, source error handling and an explicit kill switch; never crawl automatically until policy-cleared.
3. Normalize discoveries to *proposals*, recording source URL, checked-at, factual quotation-free field provenance, operator/location identity and season/year.
4. Cross-check the 92 published identities and the 20 separately recovered pending seasonal records before proposing additions. Verify independent 2026 operation, address, exact dates and expiry; do not infer opening hours.
5. Reuse existing seasonal eligibility/identity/negative-lifecycle/Open Now rules. Discovery alone does not confer listing eligibility. Preserve conservative fail-closed Open Now.
6. Validate unit, browser, native/WebView and failure-mode behavior on an isolated candidate; independent acceptance and separate owner authority are prerequisites to any release.

## Candidate quality warning
Three official-operator URLs are stored as *pilot leads only*. URLs, site rights, publication duplicates, visit windows and current operating dates must be independently confirmed before ingestion. A claimed name-search miss in the current main catalog is NOT a full duplicate clearance. The indexed registry is not a plan to import any venue today.

## Verification status
Main tree and Issue #71 were read; relevant date-night code was inspected. A deterministic registry test was added, but its execution has NOT been independently observed in this tool session. No full tests, hosted CI or browser acceptance claimed. Only docs and isolated test source added. No production source, settings, migration, Android/Play action, or running crawler was changed.

## Next
Read back exact draft-branch files. Run `node --test scripts/seasonal-source-registry.test.mjs`, check permissions/robots for any intended source, then prototype one operator adapter on the branch and run independent acceptance. Avoid `npm run build`: it invokes migrations. Do not merge/deploy without separate explicit owner approval.


## 2026-10-18 pilot implementation follow-up

The branch now contains `scripts/seasonal-source-discovery.mjs` and `scripts/seasonal-source-discovery.test.mjs`.
This is an isolated Node research prototype, NOT imported by the app UI or backend. It:
- denies every source in the checked-in registry, unless future explicit source-specific clearance and global activation are recorded;
- allows only named operator source IDs (no caller-supplied URLs);
- fails closed on non-HTTPS/malformed URLs and on redirects, non-HTML responses, oversized response streams and upstream failures;
- uses a six-second request deadline, bounded HTML/JSON-LD parsing and six-hour in-memory caching;
- emits only unverified, nonpublishable candidate proposals with field-level structural provenance; never Open Now;
- includes tests for disabled behavior, duplicate in-flight requests, caching and invalid input using mock fixtures, **not live websites**.

**Limitations/hold:** No automated site access permissions have been established. Before any network use, perform independent source access/legal checks and secure URL/DNS/redirect/egress handling on the actual deployment environment (SSRF review); mock clearance in tests is not permission. Do not enable the registry or bind this prototype into production. `scripts/seasonal-source-discovery.test.mjs` was committed but execution is NOT independently verified. No CI/browser/device PASS is claimed. Owner release approval is still separate.

## Follow-up security hardening (2026-10-18)

A further candidate revision rejects explicitly non-2026 Event dates without replacing them with a title-only pseudo-event. It also requires an explicitly injected transport; there is **no global default network fetch** even if a future registry flips its global enable flag. Additional malformed/non-public hostnames fail URL screening. Tests were updated for the changed fail-closed contract.

**Security boundary:** Injecting an arbitrary fetch implementation or changing source clearance in memory does not mean an operator permits crawling. Prior to any real network integration the server-side adapter still requires resolved-IP/egress controls, redirect prohibition, robots/terms review and independent security checks. The mock-only fixture is not an access grant. No runtime wiring or production execution was added. Any running CI from an earlier candidate SHA is not evidence for this revised head.

## Research-only candidate triage follow-up

Added `scripts/seasonal-source-triage.mjs` and `scripts/seasonal-source-triage.test.mjs`, included in the dedicated GitHub Actions fixture workflow. The pure intake step labels potentially duplicated names or addresses against both published and pending identity inputs; applies conservative date-range checks against an explicitly supplied *destination-local calendar day*; quarantines incomplete/unstructured facts; and forces `verified=false`, `publishable=false`, `openNowEligible=false` regardless of provider flags. A complete structured candidate is still only *awaiting-independent-review*. No runtime import, crawl, production or store publication is introduced.

**Limitations:** Similar names, aliases, shared operator sites, partial addresses, venue moves, timezone-sensitive opening-hour claims, exact schedules and proximity matches need independent evidence and richer reconciliation before real ingestion. This intake does not verify a site or attraction. Test execution on the newest SHA awaits exact-head CI results; do not transfer an earlier PASS.

## Offline pipeline checkpoint (October 18)

Added `scripts/seasonal-source-pipeline.mjs` plus offline integration fixtures. This composes the existing parser and triage without performing any HTTP requests or importing app runtime. Missing published/pending identity inventories cause a research HOLD. Complete inventories only allow a candidate to await independent review, never publish or claim Open Now. Restricted directory IDs are not allowed as operator inputs. The source registry is still default-deny, and no real website has been crawled. New exact-head CI execution must be observed before marking this checkpoint PASS.

## Seasonal relevance guard (October 18)

The pure triage now requires an explicit recognized seasonal activity hint and a 2026 event-date window overlapping September 1–November 2 to advance to *awaiting-independent-review*. Unrelated concerts and other nonseasonal events remain HOLD even when their structured metadata is complete. A source-level category hint does not suffice. This is a conservative research filter, not a claim that an event is verified or open. Independent review must still reconcile scope, address, operating calendar, source permissions, and preexisting identities. Exact-head CI remains required for this revision; previous PASS does not transfer.

## Cache isolation / redirect guard (October 18)

Prototype responses are cloned at cache reads, concurrent response handoffs and final return, so caller mutation cannot corrupt later cached research facts. Custom transports reporting a redirected response or off-source final URL are rejected. Additional fixture tests cover both. This is not a complete SSRF control: any future real transport must enforce DNS resolution and public-IP egress checks, redirect refusal and deployment-level restrictions. Live crawl remains disabled. Exact-head tests for this amendment are not yet confirmed.

## CI lint remediation — October 18

Exact-head `dab607ff` mock-only suite and Android readiness passed, but full integration CI failed ESLint on `scripts/seasonal-source-triage.test.mjs` line 32: unnecessary apostrophe escape (`no-useless-escape`). The other six warnings were inherited/unchanged. Candidate commit `becf5c57` removes just that escape. Await new exact-head full CI and mock CI; earlier PASS does not transfer. No live crawler or production changes.

## Bounded candidate hardening — October 18, second work session

The preceding checkpoints are preserved history. The clean `422bf4f352987d5d450ca14b7ef5898e7f300a66` baseline passed its 26 existing mock fixtures. Separate adversarial review established six correctness gaps and a malformed-markup CPU-bound gap; these were not failures in production, where this prototype is not imported.

This source-only successor:
- Races the whole asynchronous fetch/body operation against six seconds, requests cancellation without awaiting untrusted cleanup, rejects late completion, and releases in-flight bookkeeping. It cannot stop arbitrary synchronously blocking injected JavaScript; the bounded parser now uses progressive tag scans rather than repeated remaining-document regular-expression scans.
- Snapshots source identity and clearance, rechecks them before returning/caching a response, and binds cache records to their policy/URL fingerprint. Clock rollback cannot reuse a cache capture from the future. Invalid or future policy-review calendar days are rejected.
- Keeps an omitted end date unknown and excludes it from source-evidence fields. Known non-scheduled/unknown event status is retained and held. Contradictory structured copies sharing name/address/start date are all held, including contradictions discovered after the output cap.
- Preserves exact MIME and UTF-8 byte limits, default-deny source registry, explicit injected transport only, immutable returned cache values, and `verified=false`, `publishable=false`, `openNowEligible=false` on every proposal.

Acceptance is still scoped to an offline research prototype. All three real operator sources remain policy HOLD; this date validation is not proof of terms, robots, reuse scope or clearance freshness. No live fixture, operator eligibility, production adapter or release acceptance is conferred. Missing destination-local day and source-capture freshness are not yet proven by the offline research pipeline; callers must not interpret its review queue as expiry, duplicate or source verification. Complete revision-bound published/pending inventories, capture hashes and block/node provenance, persistent negative-lifecycle evidence, richer identity conflicts and deployment-level egress controls remain future acceptance gates. Separate transport work, if added, requires its own review before integration; it must not silently become this pilot's default fetch.


The first local hardening proposal was rejected by independent review for an introduced Unicode case-folding offset bug and malformed concern-metadata handling; neither was published. The revised proposal preserves offsets with ASCII-only folding and fails closed on malformed concern inputs. That review also found two preexisting provenance gaps: attribute substrings masquerading as a script `type` and invalid timestamp suffixes being accepted as dates. The revised bounded attribute tokenizer requires one real quoted JSON-LD type attribute, and full date/time syntax must validate before its literal local date is retained. These are research-fidelity corrections, not operating-hours verification.
