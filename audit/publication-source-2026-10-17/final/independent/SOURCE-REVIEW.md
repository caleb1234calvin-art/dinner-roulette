# Independent corrected publication-source review

Prefreeze review PASS — 2026-10-17 07:53 UTC. This is the narrow successor to the first PR82 head `9e84b3ef5c5870774e6f7dbfbe1c2c1afa03668a`, whose footer run failed on an inherited unpublished-copy assertion. The prior failure and all original evidence remain historical and unchanged.

Only scripts/unified-footer-browser.mjs and scripts/unified-footer.test.mjs change. The browser adds an explicit source tuple requirement for version 1.0 / published / 2026-10-19 / America/Chicago / null proposal, derives the exact label, requires that label twice on each policy, and rejects obsolete unpublished/prepared/proposed/draft wording. Its no-previous-history assertion remains. The added focused test prevents restoration of the old hard-coded assertion.

The complete diff preserves all 350 planned cases, viewports/themes, layout thresholds, contrast computation, keyboard/focus checks, hit testing, local-only URL and discovery-network isolation, artwork attribution checks, footer destinations, and binding/proof capture. No application code, legal text/metadata, operational guard, deployment configuration, native inputs, storage schema or security behavior changes.

Independent checks:

- 20/20 positive/negative tests execute the exact changed assertion block with synthetic page text on both routes. They accept the correct twice-present labels and reject one/three labels, wrong date, wrong zone, missing history and each obsolete state phrase. These are explicit unit fixtures, not browser acceptance.
- 91/91 independent source/API/CLI controls pass. The actual October 17 CLI still exits with the expected publication HOLD. Fixture date-boundary passes do not clear this gate.
- 25/25 focused legal/storage/content/notice/footer repository tests pass, no skips; diff whitespace check passes.
- Active scripts, src, server and workflows were searched for unpublished/prepared/draft/tentative/proposal/effective-date assumptions. The corrected browser assertion is the only remaining unconditional stale current-document expectation. Other matches are intentional unreleased or later-material fixtures, guarded state branches, exact current finalized metadata, or negative assertions and remain intact.

Frozen remote identity, independently reconstructed new fingerprint, and fresh exact-source CI/original rendered evidence are pending. Prior legal/Settings screenshot PASS does not transfer merely because application files are unchanged. No deployment, legal publication, merge, signing, device operation or Play action was performed.

## Frozen source binding — 2026-10-17 07:55 UTC

Source PASS now binds to PR82 head `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`, tree `6300c1061a790d84447bb92166f340aec895757b`, sole parent `9e84b3ef5c5870774e6f7dbfbe1c2c1afa03668a`. Independent GitHub Git-commit/full recursive-tree reads contain 1,582 untruncated entries. All 1,486 local file contents and modes match their remote objects after normal Git checkout normalization. The full new delta is exactly two test-harness paths, 25 additions and one deletion. Tracked status is clean. PR read independently confirms draft/open/unmerged with unchanged main base.

A pristine archive independently reproduces source fingerprint `1a52efaa3fa9dfca5e6f366f75079615836eb1e80d0914f53c76fd3401d98b54` over 542 inputs. The fingerprint-only receipt says BUILD_PENDING because the reviewer did not rebuild. Frozen reruns pass 91/91 independent source/guard controls and 25/25 focused repository tests. The actual October 17 operational CLI still fails for the correct real-day reason. New hosted web run 39015345296 and Android run 39015345242 are pending; prior first-head evidence remains separate.

## Affected-render completion — 2026-10-17 08:17 UTC

The corrected head's fresh legal/Settings and footer originals independently pass source binding, archive verification and affected rendered review. See BROWSER-REVIEW.md. All 33 legal and 350 footer harness checks pass; 39 fresh original screenshots actually viewed, 798 separately integrity-decoded. No old PASS is transferred. Overall workflow geometry/regional completion remains separately pending at this checkpoint.

Final PR read confirms unchanged cf18ff1c, draft/open/unmerged and main c3208d9f; tracked source is clean. Final genuine-clock publication CLI remains expected HOLD (actual October 17; authorized October 19 America/Chicago), with exit 1 preserved. This source review and rendered PASS do not close the actual-day, release-authorization, operational/rollback, physical-device or Play gates.
