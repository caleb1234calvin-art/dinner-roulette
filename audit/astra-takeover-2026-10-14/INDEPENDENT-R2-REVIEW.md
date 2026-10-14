# Independent adversarial review — PR #72

Reviewed October 14, 2026. Read-only review of exact candidate `0336b55a2a059423c8d5c0dc4f52f79b71bdcacc`, tree `f316c81634a9735a742baa635c44b4c92984c03a`; direct parent `328f30a482034f9f9eccd46da6d1995c4faf7be0`; released comparison base `0344ccce79ce157196ff9e84b1aaf3e40802afc5`, tree `c7c49796abc809c4a00690cd282f69920e325bbc`.

## Verdict

**HOLD for complete release acceptance. Static candidate integrity PASS, with no demonstrated application behavior regression in this reviewer’s scope.** The exact-head tests do not exercise the ten new identities through the built application’s discovery and stateful browser journeys. The missing coverage is a concrete acceptance gap against the takeover’s section V browser gate. The green inherited regional suite and expanded geometry suite cannot establish that gate for the ten additions.

**Coordination addendum:** Parent subsequently reported a separately verified source/copy defect from the source-copy reviewer: Sonny Acres’ current operator terms require paid festival admission on Friday/Saturday/Sunday, conflicting with the candidate’s unqualified sentence “Fall Festival admission is free.” The parent assigned a bounded correction of that defect and missing browser acceptance in the same draft candidate. This review’s static parity PASS does not clear that factual defect; it demonstrates why parity against a mutable adapted fixture is insufficient. The revised candidate will require a new exact-head review.

This review did not merge, deploy, dispatch workflows, alter source, install dependencies, alter settings, run migrations, or run the ordinary build command. It did not retrieve or inspect original CI artifacts. Parent coordinator owns infrastructure, artifact preservation and current remote-state reconciliation.

## Independently established PASS

- Read the complete takeover at `d08962ea1e07c66f7374b18ee3e5741612f254c2` and the accompanying source-triage R0, without truncation. Inspected the complete candidate file diff and relevant integration, availability and test paths.
- All existing catalog files other than the presentation registry are byte-identical to released main. The only new runtime catalog is `src/lib/date-night/halloween-2026-wave2-catalog.ts`.
- Parsed the ten runtime TypeScript record objects as JSON and independently compared them to `ADAPTED-TEN-FROZEN-INPUTS.json`: exact equality. The frozen input file SHA256 is `6ba010aced6367e52b7f0e1b269801b5e6605d2e44dd5275219bbcc08b6d20af`.
- Parsed released and candidate presentation registries: all 82 preexisting values are exactly preserved; exactly ten new values equal the frozen presentations; total 92.
- The baseline 70 plus independently frozen regional 12 plus candidate ten have 92 unique canonical IDs and 92 unique record IDs. No replacement or collision appeared in this scope.
- Exactly two candidate records have `visibility: listing-lifecycle`: `date-night-ks26-walters` and `date-night-ks26-nightmare`. The other eight have no broadened lifecycle visibility. `search.ts` filters the Wave 2 OFF path to that explicit field. Global window, category/chip policy and availability implementation are unchanged.
- Every new active-date list is sorted, duplicate-free, entirely in 2026, and matches its `activeFrom`/`activeUntil` bounds. Listing and availability cutoffs agree. All ten machine `openingHours` are null and `openNowPolicy` is `never`. Directions target equals visitor address; rideshare remains `external-picker`; placement is explicitly approximate.
- Candidate visitor notes equal the frozen presentation details. Static copy preserves the handoff’s sensitive distinctions: Boo Crew excludes Halloween; Sonny Acres ends October 30; Hayride October 29 is Bayou-only and final sale is distinguished from exit; Spook Hollow start is not called closing; Walters gates differ from wagon/exit; Nightmare free entry differs from paid tokens; paintball waiver/minor and weather qualifications; Royal/Chittyville mobility and safety restrictions.
- Existing twelve-region frozen object and baseline SHA checks remain intact. The changed regional helper still compares all 82 objects exactly and all 82 old presentation values exactly, while allowing only the added ten.
- Geometry retains all six variants, three widths, existing thresholds and the explicit inherited result Directions-label allowance. All ten new records are thrill-eligible, so the source mandates 90 Wave 2 comparisons: ten × three widths × Options/Result/Plan, with six measured variants each. Native Details, every paragraph’s expanded visibility, confidence, approximate label and address Directions are checked for the current `after` variant. This is code-path review, not an independent assertion that original geometry pixels/verdict were inspected.
- `git diff --check` passed. Working tree remained clean after review.

## Blocking acceptance gap

`scripts/seasonal-ten-record-browser.mjs:20–32,89–92` selects earlier content batches only. In regional mode `rows` is the twelve Wave 1 rows. `curatedRows` at line 484 omits Wave 2, and the frozen 317-scenario assertion at lines 1748–1752 refers to those twelve plus inherited controls. `.github/workflows/validate-icon-pack.yml` has a regional-wave1 invocation and geometry invocation, but no mode that selects Wave 2 for the full application browser harness.

The only Wave 2-specific tests are two Node tests and the geometry extension. The Node tests import curated policy and eligibility but never call the discovery handler. Consequently an accidental omission of Wave 2 from `search.ts` would not be caught by those Wave 2 tests. The legacy regional lane does not require any of the ten new IDs.

Geometry uses `renderToStaticMarkup`, stubs hooks/store and event handlers, decorates every object with `isOpen:false`, calls `page.setContent`, and aborts network requests (`seasonal-card-layout-browser.mjs:77–125,144–156`). It meaningfully verifies layout and native Details, but not authenticated hydration, actual RPC acquisition, favorite/history/cache normalization, negative lifecycle precedence, pending-response expiry, category filtering, Plan assembly or radius ownership for the new ten. Its no-Open-Now assertion cannot establish actual application opening-status behavior because that state is hard-coded in its fixture.

Therefore the candidate may be correct, but the completed jobs do not yet establish the ten-record integrated runtime PASS required by the handoff. This is an untested path, not an observed failing live journey, and should be described that way.

## Oracle qualifications

- Wave 2’s frozen JSON is part of the same candidate and its hash is not pinned in the new test/helper. Equality between that fixture and source is useful parity, not independent proof of underlying operator facts. A coordinated erroneous edit to both could pass. Independent archive/receipt and current-source review remain necessary.
- The OFF unit-test expectation is derived from each candidate record’s own visibility (`seasonal-wave2.test.mjs:53–55`). Add an independent literal allowlist of the two permitted lifecycle IDs when completing coverage; otherwise an accidental visibility edit mirrored into the mutable fixture can validate itself.
- `expectedComparisons` in the geometry receipt is assigned the measured length, but an earlier assertion separately compares that length with the formula. The current exact source still enforces 90 Wave 2 scenarios. Prefer a literal or independently enumerated manifest in the receipt for easier artifact review; this is not a failing geometry check.
- Wording that exact Details survive every geometry variant overstates the assertion: paragraph checks are inside `variant === "after"`. All six variants measure layout, while the current candidate’s `after` variant validates current copy. That scope is appropriate if reported accurately.
- The general browser `nearby` oracle reuses application availability and distance helpers. The legacy regional radius oracle provides independent membership/patch checks; preserve those exact bytes and add a distinct independent Wave 2 oracle rather than extrapolating independence from the general helper.

## Source and execution limitations

The historical 10/10, 305-field source-parity receipt is a separate evidence layer. Parent reports retrieving it; this reviewer has not read its original bytes. Per parent’s report it excludes final TypeScript/renderer and fresh public-source/browser acceptance. It must not be promoted to fresh consumer-copy or integrated runtime PASS. This review confirms static consistency and handoff-sensitive copy, not live operator ticket inventory, placement accuracy, or current field-by-field source truth.

An attempted local `node --test scripts/seasonal-wave2.test.mjs scripts/seasonal-regional-wave1.test.mjs` did not execute either suite: `ERR_MODULE_NOT_FOUND` for `typescript`. No dependency installation was attempted. Treat this as local environment unavailable, not a candidate test failure; parent has the original exact-head CI logs.

The source data has revalidate-after dates October 15 (Walters, Nightmare, Royal) and October 16 (Illinois). Any later release proposal must carry fresh source disposition; these fields do not renew listings automatically. All candidate cutoffs occur by midnight after October 31 in Chicago, with no November 6–7 extension.

## Minimal bounded remediation proposal

No application, content, dependency, workflow matrix, timeout, deploy, auth, migration or provider policy change is required to close this gap. A test-only correction in the existing draft candidate can reuse the established browser harness and its existing regional runner:

1. Keep the current twelve-region pass, 317-scenario accounting, independent radius fixtures, negative controls and historical receipt controls intact. Preserve their original verdict as a separately identifiable result.
2. Add a distinct Wave 2 mode or bounded subpass in `seasonal-ten-record-browser.mjs` selected only by the existing regional invocation. It may run sequentially in that same runner after the old pass cleans up its owned preview, using a separate output subdirectory and a recursion guard if implemented as a child invocation. Do not alter `.github/workflows` to add jobs, weaken gates, or increase timeouts. A shared helper refactor is possible, but avoid broad harness rewrites.
3. Bind its ten source objects, exact IDs, categories, cutoff values, confidence and consumer paragraphs to independently reviewed frozen evidence. Assert the literal two-ID lifecycle allowlist. Include all 92 records in neighborhood expectations while retaining the exact 82-record baseline assertions separately; do not simply change the old 82 assertion to 92.
4. Run the existing real built-app RPC/browser scenarios for all ten: Options/Pick/Result/Details, ON/OFF and all supported/unsupported chips, conservative Open Now against conflicting 24/7 aliases, deduplication, favorites and receipts, history reload, negative lifecycle, valid distinct Plan, cached expiry at -1/0/+1 ms, delayed pre-expiry RPC delivered at cutoff, 2027 and post-global-window exclusion. Run consumer journeys at 320/390/512 or explicitly bind the separate 512 geometry coverage without claiming a 512 hydrated journey that did not occur.
5. Add a compact independent Wave 2 origin/membership/patch-ownership fixture across KS, AR and IL at supported UI distances 1/15/30/50. Preserve 25 miles only as an independently measured non-UI check if included. Expected membership must be literal/frozen and not calculated by the application helper under test. Exercise manual relocation and completed-pool reuse. This does not change or claim to fix the separate Kansas City provider outage.
6. Define explicit new scenario IDs and exact expected counts before execution. Keep legacy and new accounting separate; neither may be satisfied by an empty iteration or self-derived runtime count. Preserve both verdicts and original evidence under the existing artifact upload path.
7. Freeze the new SHA/tree after that test-only edit, rerun the normal exact-head web/Android gates and independently inspect original artifacts. Source identity/copy must remain byte-identical unless a separately evidenced defect is found.

The handoff authorizes test runs and completion of this browser acceptance matrix and prohibits asking the owner to reauthorize routine execution. It also calls nonproduction source corrections “narrowly scoped” and describes fixes following concrete failures. This is a concrete **test coverage omission**, so a test-only completion of the already required matrix, without deployment infrastructure changes, is a reasonable bounded interpretation of the delegated work. It is not grounds for changing runtime behavior or expanding content. If the coordinator interprets those correction limits as permitting only reproduced runtime failures, record an owner decision specifically for this test-only coverage completion; do not request broad new scope or imply a release decision is ready.

## Next coordinator action

Preserve this gap in Issue #71/continuity. Complete the bounded ten-record integrated browser acceptance, maintain fresh source/copy evidence, then determine release readiness against the new exact head. No merge/deploy decision is yet justified by this review alone.
