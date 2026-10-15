# PR #74 published-head validation supplement

Authoring worker result: local technical checks PASS on the published head. Release remains HOLD for outstanding hosted/browser/live acceptance and separate owner approval.

- Published head: `e25594063bc0de09aeb4e08c4912845f9f08fffa`.
- Tree: `9c4ec8780bdddff51335f523823e1ec40dee001f`.
- Parent: `991978fe24ec165eeacd5500a26d66f35d86c560`.
- Draft PR: #74; branch `integration/kc-curated-radius-2026-10-15`.
- Fresh fetch, exact identity and clean worktree were verified before and after this run.

The published commit has the same tree and parent as prior local candidate `b683f7979845d32b909cf4f195bc8bf42305e101`, but no candidate PASS was transferred. All requested checks below were freshly executed after detaching the worktree at the published commit. The old local commit, logs, failures and original evidence ZIP remain preserved.

| Fresh published-head check | Result |
| --- | --- |
| Migration-free auth-enabled direct-Vite production build | PASS, exit 0 |
| Typecheck | PASS, exit 0 |
| Changed-file ESLint | PASS, exit 0; no diagnostics |
| Focused D2 regression | 9 PASS, 0 failures |
| Full repository suite | 1,253 PASS, 4 inherited skips, 0 failures |
| Full application suite | 71 PASS, 0 failures |
| Diff whitespace check | PASS |

Exact build command: `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. Ordinary `npm run build` was not used. The full suite ran after the fresh safe build; its compiled transport tests had the required output.

The final focused regression has SHA-256 `65d0b870a3e39c900bbe4bb0df5de44e3ded69dfa61d6e8a95bc3da7f6d62ae0`. The same bytes previously executed against released main yielded seven failures and two passing controls. That original main log is copied unchanged into this supplement for the failing-before relationship; `focused-nine.log` is the fresh published-head passing-after run. The original naive negative-eviction failure and first full-run failures remain in the prior authoring archive, identified by its hash in `prior-artifact-relationship.json`.

This supplement does not claim hosted CI, rendered-browser, physical Android or fresh live Kansas City acceptance. The separate independent reviewer is producing its own published-head supplement. This worker made no source changes, push, merge, deployment, rollback, migration or production settings change. PR #73 remains separate.

Next: inspect complete exact-head hosted CI and preserved browser outputs, close any findings, then prepare the separate PR #74 release decision. No merge or production action is authorized by this report.
