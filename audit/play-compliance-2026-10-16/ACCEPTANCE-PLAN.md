# Independent acceptance plan

This is an audit assurance plan; the exact proposed device matrix and architecture sign-off are risk-management controls rather than individually mandated Google tests.

A different reviewer should verify each corrected or newly evidenced requirement against the exact candidate. A prior pass cannot be transferred across changed inputs without an explicit comparison.

## Before a submission recommendation can change

1. **Freeze identities:** record source commit/tree, native inputs, final package/version, AAB SHA-256, intended upload public certificate and hosted deployment. Keep artifact source and hosted source separate.
2. **Close privacy defect:** inspect full policy text/link inside the installed app; verify contact, retention/deletion, provider/data/purpose accuracy and publicly accessible Console URL evidence.
3. **Observe real flows:** use an authorized test device/account and safe data. Capture network behavior for first launch, mode selection, manual location, GPS precise/approximate/deny/retry, favorites/history and external navigation. Match payload categories and destinations to declarations; determine hosting/logging/retention separately.
4. **Check conditional features:** establish whether account creation, ads, payment, gambling facilitation or age-restricted sales are reachable. Apply their rules only where the actual trigger exists. Review every final store asset and rating/audience answer.
5. **Run native matrix:** install/update, cold launch, offline/retry, Back, process restart, state, keyboard/insets, core modes and external links. Include supported low/high Android versions and a 16 KB/64-bit environment as applicable. No packaged native .so finding is not a substitute for runtime tests.
6. **Verify signing and identity:** when separately authorized, cryptographically verify the final signed artifact and its public certificate against the intended Console record. Check version history and applicable fingerprint-bound integrations. Key generation/use and upload are outside this investigation.
7. **Owner legal/Console review:** owner supplies account authority, actual enrollment and accepted agreements/notices, unresolved export assessment and truthful declaration evidence. Any Play upload or acceptance is a later authorized action, not an audit test to run now.
8. **Independent closeout:** mark every applicable P0/P1 requirement closed with exact evidence or retain HOLD. Record accepted P2 risks and residual qualifications. Root and owner review still govern any next action; a technical pass is not release authorization.

## Separate existing work

PR #75's chooser-heading/help viewport probe remains NOT RUN/HOLD. Do not turn this audit into a broad re-run or claim it clears that gap. Its source is unchanged and remains draft/unmerged. Halloween additions remain optional and parked.
