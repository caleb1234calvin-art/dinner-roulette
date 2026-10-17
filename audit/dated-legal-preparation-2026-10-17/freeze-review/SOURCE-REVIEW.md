# Independent dated legal preparation source review

2026-10-17 06:27 UTC. PASS for prefreeze source at tree `ae48488aefb4a19881a4b895f0bf758709efecc4`, pending frozen remote identity and new hosted browser evidence. Predecessor `29bec315b919535c9aeb3f7e8b1c9e3fa638e80d`, tree `de43c3ee90ad31e5de678737be1eed61b6eb6d01`. This is not effective publication or release approval.

## Scope and exact source

Read documented finalization procedure, canonical continuity `47bb767fd1c2e9c369bb1e6b9c3a89a7bb296cb0`, prior policy/operational/publication reviews and prior consolidated browser methodology. Reviewed the complete new eight-file diff independently. All 1,486 staged path/mode/blob entries equal the stated tree; no unstaged drift. Reconstructed pristine tracked source with `git archive`; independently recomputed build-input fingerprint `10d55b73ddefb45e885a525fc6726ed409aef3d9febfaaf311868df730f883e8`, 542 files. The local source fingerprint receipt has BUILD_PENDING status because the reviewer did not rebuild the app.

- Both full policy JSON documents and complete history JSON differ only by adding `proposedPublicationDate: 2026-10-19`. Version remains 1.0, status unreleased, effectiveDate null; previous published versions remain empty. All policy titles, sections, paragraphs, bullets, links, summaries, consent/agreement flags and metadata other than the proposal are unchanged.
- The publication label retains an explicit not-published/not-effective statement and appends the tentative date, subject to readiness and separate release approval. Header and history use that same label. No browser/build clock changes source or publication status. Source is still prepared if October 19 passes.
- Prior v0.2 review archive, public legal routes, LegalDocumentPage, material notice component, footer components, Android workflow and deployment exclusions are byte-identical to the predecessor. There is no new forced agreement, implied assent, account gate, processor, collection, retention commitment, store claim or current-publication claim.
- Eventual publication CLI requires an explicitly supplied authorized date and Area/Location IANA zone (or explicit UTC), source/date agreement, and the real current calendar date in that zone. It rejects earlier/later days, missing/invalid date/zone, bare ambiguous timezone abbreviations, retained proposal on published source and required consent/agreement flags. It has no clock override and performs no source write. Injectable time exists only for API unit tests.
- Documentation truthfully says the proposal has no implied timezone, America/Chicago is only a possible choice pending owner confirmation, and the guard is an operator check rather than an automatic deployment lock. A later published-metadata source mutation, exact-source revalidation and separate merge/deployment approval remain mandatory. Passing this preparation candidate does not close those gates.
- The legal browser harness preserves old checks and adds exact conditional-date verification in header/history and disabled-JavaScript routes, plus dedicated native-resolution history viewport screenshots. Current initial version still does not show a material-change notice. Populated archived-history browser behavior remains outside this initial-release case.

## Independent checks

82/82 independent API/CLI/source controls pass. Boundary coverage includes Chicago October 19, 23-hour spring-forward and 25-hour fall-back days, UTC, both sides of the international date line and a half-hour zone. Each checks one millisecond before local midnight, exact start, last millisecond and next midnight. Additional tests cover real leap day, malformed/nonexistent/mismatched dates, unavailable/ambiguous/invalid zones, empty/duplicate/unknown/clock-override CLI options, proposal synchronization, unchanged full policy contents, archive snapshots, material notice semantics and consent/agreement holds.

17/17 focused repository legal release/storage/content/notice tests pass independently, no skips. Initial focused invocation used the parent working directory and the storage test loader failed to resolve its relative source path. The unchanged tests pass from the documented repository cwd; original failed log is preserved as `focused-node-wrong-working-directory.log`, not relabeled.

Two first-draft defects were caught before freeze and fixed by the implementer: Intl accepted ambiguous bare timezone aliases, and empty date/zone options without --publication were mistaken for absent options. `PREFREEZE-GUARD-FINDINGS.json` preserves original observations. Fresh retests confirm both fixes without weakening controls. `BASELINE-DATE-GUARD.json` preserves the older validator's acceptance of past/future dates as historical diagnostic evidence.

## Pending evidence and boundaries

Frozen remote commit/tree binding and fresh original CI legal/footer evidence are pending. No previous PASS is transferred to this source. The implementer's local browser attempt failed before opening pages due a socket permission error; hosted originals are the permitted next route. No browser, production, physical Android/WebView, legal publication or Play acceptance is claimed here.

Separate Android qualification: an independent parser of original PR78/PR80 ZIP members confirms different APK v2 certificates/public keys. Preserve installed-app data; do not uninstall or bypass certificate checks. After separately approved website publication, the existing PR78 wrapper could support bounded new web-runtime observations, but that would not certify exact PR80 native installation. The comparison is in `INDEPENDENT-APK-CERTIFICATE-COMPARISON.json`; the planner's cryptographic verification remains separately attributed.

No candidate source, remote branch, deployment, signing material, installed app or user data was changed by this reviewer. Only separate review evidence was written.
