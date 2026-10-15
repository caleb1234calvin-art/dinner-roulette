# Result Directions wrapping — bounded UI candidate

Prepared October 15, 2026. Parent production is `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73` (92 identities). This is a proposal, not a release.

## Defect and correction

At 320px, open a Result in any mode. The inherited full-label Directions control combines nowrap, 48px horizontal padding, wide letter spacing, icon and gap. PR72 original geometry measured 280px client width /315px scroll width (35px overflow), with card scrollWidth335 at viewport320. Severity: moderate usability/accessibility defect; the destination link still exists. The source is shared by Dinner, Nightlife and Date Night.

The correction preserves the full visible label and URL behavior, permits natural text wrapping, keeps the icon unshrunk, and lets the control grow while retaining a56px minimum touch target. No catalog, provider, dates, placement, Directions destination, credentials, dependency, workflow or deployment-setting change.

## Verification contract

- Existing geometry keeps all92 identities,320/390/512 widths and six historical/current variants. Historical source variants remain intact. Current Result variants additionally require zero Directions/label horizontal overflow, a56px minimum height and viewport containment. The old comparison gate is retained; it no longer excuses the current Directions control.
- Historical Phase4 whole-file hash test initially failed as expected because Result source intentionally changed. Its original receipt is unchanged. A narrowly pinned amendment checks the complete new file hash and reverses only the literal reviewed Directions classes; every original byte must then match the old receipt. This does not exempt the rest of the component.
- Local TypeScript PASS; ESLint PASS with six inherited warnings; repository1244PASS/4SKIP, application71PASS after the receipt amendment; authenticated direct Vite production compilation PASS without migrations. Android static configuration/icon checks PASS; no signing.
- Original local test failure and missing-browser failure are preserved outside this candidate in takeover evidence. Local browser geometry did not execute: Playwright Chromium was absent and its standard installer returned invalid/truncated ZIP downloads. This is an environment verification HOLD, not a geometry PASS.
- Exact-head hosted CI, original artifact review, live mobile visuals and a reviewer independent of authoring remain required. Existing full PR workflows should run normally on draft creation; no thresholds or lanes are removed.

## Release safeguards

`integration/**` deployment exclusion remains unchanged. Ordinary `npm run build` still chains migrations and must not be used. A release needs separate exact-head owner approval, fresh migration-free hosted-route confirmation and qualified rollback plan. Prior production remains READY, with J7T as the retained preceding deployment. Physical Android/WebView/GPS/PWA and original source/provider qualifications remain unresolved.

Kansas City failed-core radial gating is a separately reproduced defect and is not repaired by this patch. Research queue and source revisions remain on the continuity branch. No merge, production deployment, rollback, migration, settings change or Play operation is authorized by this candidate.
