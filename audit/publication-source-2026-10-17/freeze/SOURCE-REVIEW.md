# Independent final publication-source review

2026-10-17 07:28 UTC. Prefreeze source review PASS, subject to frozen remote identity and fresh exact-source CI/rendered evidence. This review does not establish actual publication, deployment readiness on the real release day, or physical-device acceptance.

## Baseline and scope

Predecessor PR81: `7098b4cbf0e27761fdbb9a9cc1e64f3aef963c94`, tree `ae48488aefb4a19881a4b895f0bf758709efecc4`. Read the documented publication procedure, canonical continuity at `e5d0dc7fa2b45f65f9b97f1159c6c698a8ff4de6`, and prior independent dated-source and affected-browser reports. Reviewed the complete successor diff, including the later narrow eleventh-path test correction.

The eleven changed paths are the two current policy/history JSON records, shared legal metadata types/label, Settings copy, publication validator, legal release/label/support tests, legal browser checks, one footer test expectation, and publication procedure. Full Privacy Policy and Terms text, version 1.0, initial-publication summaries and consent/agreement flags are unchanged. The initial review-draft archive, empty previous-published history, public routes, legal document component, material notice component and notice storage behavior, footer destinations/artwork, Android configuration/workflow, app environment and deployment exclusions are byte-preserved.

## Findings

- Both documents and current history now consistently describe the intended finalized source state: published, effective 2026-10-19, publication time zone America/Chicago, and null proposal. That is a nonproduction source state, not evidence that the policies are already live. The documentation states that distinction and preserves prior tentative preparation as historical context.
- Settings uses the same metadata-driven label as policy headers/history. The finalized label explicitly includes the bound time zone. There is no new hard-coded draft wording in the current presentation and no clock-based activation.
- The guard validates real dates and explicit IANA zones, synchronizes source dates/zones across all current documents, rejects retained proposals, and requires exact source-to-CLI date and zone agreement. Ambiguous bare abbreviations, offsets, duplicate/unscoped/unknown arguments and CLI clock overrides remain rejected.
- The real operational CLI was actually run on October 17 with `--publication --authorized-date=2026-10-19 --publication-time-zone=America/Chicago`. It exits nonzero because this is not the authorized calendar day. This is the correct HOLD. It must remain a pending release gate until October 19 05:00 UTC inclusive through October 20 05:00 UTC exclusive, plus separate release authorization and current readiness. Fixture boundary successes are unit tests only.
- Initial publication still produces no material-change interruption. Existing future material notices remain informational, their dismissal records visibility only, and requirements for separate agreement/consent still block operational publication. No forced agreement or implied assent was added.
- Complete prior published snapshots remain separate from current documents and survive current-text changes in tests. No previously published snapshot exists in this source, so no archive compatibility migration or fabricated previous publication was introduced.
- Fresh browser assertions require two exact effective-date/zone labels on each policy, published history wording, no obsolete proposal/draft labels, and an actual Settings legal viewport image at every existing width/theme. Existing route, anchor, keyboard, mailto fallback, local-reset scope, disabled-JavaScript, notice and contrast checks remain intact.

## Independent tests

- 91/91 independent source/API/CLI controls PASS, repeated after the footer-test correction. Boundaries cover Chicago's intended publication day, 23-hour spring DST and 25-hour autumn DST days, UTC, both sides of the date line and a half-hour zone; each tests one millisecond before, exact start, last millisecond and following midnight. Additional controls cover missing/malformed/mismatched dates/zones, metadata synchronization, unmodified complete policy content, archive/notice semantics and no source writes.
- 24/24 focused repository checks PASS independently: 20 legal/release/storage/content/notice tests plus four footer tests. No skips. `git diff --check` passes.
- The first author's aggregate failure was an inherited footer assertion for unreleased/null metadata. Its exact test-name/tuple correction is independently reviewed; all footer behavior assertions are unchanged. The original failure is preserved by the author. The author's initial standalone auth probe lacked a running dev server and was indeterminate, not a proven sign-in disagreement; its later explicit auth-on running-server check is separately attributed.

## Pending and limits

The source review will be bound to the frozen remote commit/tree and independently reconstructed source fingerprint. Fresh hosted CI and original legal/footer screenshot review are pending. No prior candidate PASS transfers. The reviewer has not rebuilt the application or exercised a physical device. No merge, deployment, production setting, migration, signing, package registration, installed-app change, legal publication or Play action was performed.

Evidence: `PREFREEZE-CONTROLS.json`, `PREFREEZE-R2-CONTROLS.json`, `prefreeze-focused-node.log`, `prefreeze-footer-node.log`, and the independent executable controls retained alongside this report.
