# Prepared legal 1.0 candidate: validation record

Source parent: `3097fe21827723ac0828e65982237573e32fee9a` (tree `fbc0bb05b72dfd21a11f30223cf1d02ba560c5fa`). Work is isolated on `integration/legal-publication-v1-2026-10-16`. This report does not authorize or claim publication, merge, deployment or Play submission.

## Reviewed scope

- Version 1.0 remains explicitly unreleased with null effective dates. Publication date is an explicit authorized source finalization followed by revalidation, not a build/visit clock.
- Personal review of privacy requests, applicable legal deadlines and manual Gmail deletion after resolution subject to legitimate legal/security retention are stated in the policy and operator workflow.
- Existing verified location/provider/storage/analytics/external-resource disclosures remain. The notice-dismissal local marker is newly disclosed.
- Complete prior published-version snapshots, change summaries and public expandable history are supported. No prior effective policy is invented; v0.2 remains a preserved review draft.
- Material notices are informational, nonblocking and version-specific. Initial publication does not interrupt users. Reading or dismissing is not agreement/consent. Applicable consent/agreement needs a separately reviewed mechanism before the relevant change.
- Public document routes retain no authentication gate and expose version history without JavaScript. Browser acceptance must verify rendered behavior on the exact published candidate.

## Local checks

Passed: scoped ESLint across all changed JS/TS/TSX sources; TypeScript; deterministic legal tests (8); application legal notice-state tests; migration-free auth-enabled production build. Auth dev/build invariant was separately observed with sign-in on. The final exact-source aggregate rerun passed: repository suite 1265 tests, 1261 passed and 4 skipped; application suite 73 passed. Root also ran full repository ESLint: zero errors and six inherited warnings.

Final build source fingerprint: `ff23dcfeb183582e519fc258fe37c0c9d1406d03ac1640cd9b1bd0a923c2b0db` (534 files). Output fingerprint: `06a8c72ec3f3bcd4c3d99012d96b0213b2f4eff440c58a60230e8382803ab05a` (202 files). The command was only `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`; no npm build/migration command was run.

The actual React material-notice test harness bundles successfully with Rolldown. It owns its synthetic release data and does not add production fixture flags/routes. Coverage is coded for 320px keyboard dismissal, blocked storage, reload/new-version behavior, exact effective-date text, and navigation to public history. The standard suite also covers public pages at 320/390/512px, light/dark themes, no JavaScript, anchors, support fallback and reset boundaries.

Local browser runtime acceptance is NOT passed: Chromium failed before any page assertion with `socket() failed: Operation not permitted`. A reviewed escalated retry also failed. Hosted exact-head browser CI is required; do not transfer earlier PR76 browser results to this source. Public production and physical Android acceptance remain unrun.

`node scripts/check-legal-release.mjs` validates prepared metadata. `--publication` intentionally fails for this unreleased source. That command is a required operational publication check; it is not automatically wired to block all deployments. Policy/design review found no required text corrections before freeze; the final tree must be bound by independent review.
