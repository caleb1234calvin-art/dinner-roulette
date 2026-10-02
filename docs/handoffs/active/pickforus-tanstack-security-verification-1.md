# Pick For Us — TanStack Security Independent Verification 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Branch:
`verify/pickforus-tanstack-security-1`

Exact remediation candidate:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Expected tree:
`c2ee34d097974f7a4fd5013abfaf29fc0319fcc8`

Expected sole parent:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Frozen production main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Known candidate Preview:
`dpl_CccJC5M4kJTv7P4x4KUGeGefspn6`

Known Preview state:
`READY`

Known Preview source SHA:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

## Purpose

Perform an independent verification of the exact published TanStack security remediation candidate.

This task is verification only.

Do not modify dependencies, lockfiles, tests, application source, Vercel settings, DNS, auth, Android, database, or production.

Do not merge.
Do not deploy production.
Do not attach `pickforus.app`.

## Required reading

Read IN FULL:

- `docs/handoffs/active/pickforus-tanstack-security-audit-1.md`
- `docs/handoffs/active/pickforus-tanstack-security-remediation-1.md`
- `docs/handoffs/active/pickforus-tanstack-security-remediation-1-continuation.md`
- `docs/handoffs/active/pickforus-tanstack-security-remediation-1-continuation-2.md`
- `docs/handoffs/active/pickforus-domain-readiness-remediation-1.md`
- `docs/handoffs/active/pickforus-domain-readiness-verification-1.md`

If the remediation Markdown/JSON/evidence bundle is available in the workspace, read it as supporting evidence but independently reproduce all critical checks.

## Starting gates

Before verification:

1. Fetch fresh refs.
2. Verify `origin/main` remains exactly:
   `9337f6ede14b314f10d6b79720aef62ee94fad7d`
3. Verify `origin/fix/pickforus-domain-readiness-1` remains exactly:
   `195fc422c3cde6bcae305296ae016ecae4bfd562`
4. Verify `origin/fix/pickforus-tanstack-security-candidate-1` is exactly:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
5. Verify candidate tree exactly equals:
   `c2ee34d097974f7a4fd5013abfaf29fc0319fcc8`
6. Verify candidate sole parent exactly equals:
   `195fc422c3cde6bcae305296ae016ecae4bfd562`
7. Verify the candidate is exactly one commit ahead of the verified domain-readiness base.
8. Establish a clean isolated checkout pinned to the candidate.
9. Do not modify tracked files.

If any immutable identity check fails, stop:

`PICK FOR US TANSTACK SECURITY VERIFICATION — BLOCKED`

## Exact candidate scope

The remediation candidate is expected to change exactly:

- `package.json`
- `package-lock.json`
- `scripts/tanstack-security.test.mjs`

No other tracked file may differ from `195fc422...`.

Verify there are no application source, Vercel config, Android, auth, database, provider, deadline, catalog, DNS, or migration changes.

## Manifest verification

Verify the only manifest dependency-request changes are:

- `@tanstack/react-start: "1.168.60"`
- `@tanstack/react-router: "1.170.41"`

Verify all temporary resolver constraints are absent.

Final overrides must be exactly equivalent to:

```json
{
  "nf3": "0.3.17"
}
```

Reject:
- persistent Seroval override
- persistent ansis override
- persistent unplugin override
- blanket TanStack override
- direct `@tanstack/start-server-core` request
- unrelated request changes

## Lockfile verification

Independently classify the lockfile delta from `195fc422...`.

Require exactly the authorized dependency movement:

### Selected runtime graph

- `@tanstack/react-start 1.168.60`
- `@tanstack/react-router 1.170.41`
- `@tanstack/router-utils 1.162.3`
- `@tanstack/react-start-rsc 0.1.59`
- `@tanstack/start-client-core 1.170.34`
- `@tanstack/start-plugin-core 1.171.49`
- `@tanstack/start-server-core 1.169.39`
- `@tanstack/react-start-client 1.168.39`
- `@tanstack/react-start-server 1.167.46`
- `@tanstack/history 1.162.4`
- `@tanstack/router-core 1.171.34`
- `@tanstack/start-storage-context 1.167.36`
- `@tanstack/router-plugin 1.168.42`
- `@tanstack/router-generator 1.167.40`
- `@tanstack/react-store 0.11.2`
- `@tanstack/store 0.11.2`
- `seroval 1.6.7`
- `seroval-plugins 1.6.7`

### Required unchanged versions

At minimum verify unchanged:
- `ansis 4.3.1`
- `unplugin 3.3.0`
- `@tanstack/start-fn-stubs 1.162.0`
- `@tanstack/virtual-file-routes 1.162.0`
- React Query packages
- React Table packages
- React/DOM `19.2.8`
- Vite `8.2.2`
- Nitro `3.0.260610-beta`
- TypeScript `5.9.3`
- `@vitejs/plugin-react 5.2.0`
- `@tailwindcss/oxide-wasm32-wasi 4.3.3`

### Expected removal

Require removal of:

`node_modules/@tanstack/start-plugin-core/node_modules/@babel/code-frame@7.27.1`

### Conditionally authorized npm normalization records

Require exactly these six nested records and versions:

- `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@emnapi/core 1.11.1`
- `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@emnapi/runtime 1.11.1`
- `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@emnapi/wasi-threads 1.2.2`
- `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@napi-rs/wasm-runtime 1.1.4`
- `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@tybys/wasm-util 0.10.2`
- `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/tslib 2.8.1`

Verify:
- all six remain nested under the exact unchanged oxide WASM parent
- each is bundled/inBundle and optional as appropriate
- no root request was added
- no additional WASM/bundled path was added
- no Tailwind package version moved

Reject any unexplained lockfile movement outside the authorized envelope.

## Vulnerability/version gate

Independently assert:

- no effective `@tanstack/react-start` copy falls below `1.168.60`
- no effective `@tanstack/start-server-core` copy falls below `1.169.39`
- vulnerable exact versions `1.168.49` and `1.169.31` are absent from the effective runtime graph
- no old duplicate Start/Router graph remains

Require one coherent Router graph.

## Toolchain and deterministic lock verification

Use:

- Node `v24.19.0`
- npm `11.9.0`

Independently verify the final lock is reproducible.

Do NOT mutate the candidate checkout.

Instead use pristine temporary checkouts/worktrees from `195fc422...` and reproduce the documented Resolver Revision 2 process with the same exact temporary constraints:

- seroval 1.6.7
- seroval-plugins 1.6.7
- ansis 4.3.1
- unplugin 3.3.0

Require the independently regenerated final:
- `package.json`
- `package-lock.json`

to compare byte-for-byte to the candidate versions.

If registry/input conditions prevent deterministic replay, report the limitation rather than rewriting the candidate.

Do not hand-edit the lock.

## Install graph verification

In a verification worktree pinned to the exact candidate:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm ls --all --json
```

Require:
- `npm ci` succeeds
- manifest/lock remain byte-identical
- `npm ls` exits 0
- no invalid peers
- no dependency problems
- no extraneous runtime packages
- one physical copy of each selected runtime package where the remediation requires uniqueness
- Start resolves the same root Router/core modules

Do not run install lifecycle scripts merely to force a pass.

## Security/RPC test verification

Read and review:

`scripts/tanstack-security.test.mjs`

Confirm it exercises real compiled TanStack Start transport rather than mocking `createServerFn`.

Run:

`node --test scripts/tanstack-security.test.mjs`

Expected remediation result:
- 14 passed
- 0 failed
- 0 skipped
- 0 cancelled

Independently confirm coverage includes:
- all five actual application POST server functions
- Date Night seasonal on/off
- provider fixtures below Start transport
- GET and POST transport fixture
- legitimate serialization
- invalid validator paths
- thrown Errors
- falsy returns
- inert internal result/error/context markers
- response-shaped unexpected objects
- legitimate real Response behavior
- CSRF/method checks
- cancellation/deadline behavior

Do not send exploit payloads to production.

## Existing regression suite

Re-run:

```bash
node --test scripts/domain-readiness.test.mjs scripts/grok-pwa-plugin.test.mjs

node --test \
  scripts/android-release.test.mjs \
  scripts/discovery-provider-deadlines.test.mjs \
  scripts/discovery-client-lifecycle.test.mjs \
  scripts/with-app-env.test.mjs
```

Require:
- 66 domain/PWA tests passed
- 112 preservation tests passed
- total 178 passed
- 0 failed/skipped/cancelled

## Typecheck and lint

Run:

`node node_modules/typescript/bin/tsc --noEmit`

Run bounded lint covering:
- candidate test
- prior domain-readiness changed source/test files

Require zero errors and zero new warnings.

## Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do not run ordinary `npm run build`.

Do not run `db:migrate`.

Require successful Nitro/Vercel output.

## Built-output verification

Independently exercise actual fresh built output for:

- `pickforus.app`
- `dinner-roulette-chi.vercel.app`
- Preview host
- system/unknown host
- `/`
- `/settings`
- `/history`
- `/favorites`
- compatibility manifests
- install tutorial

Verify preserved domain-readiness behavior:
- correct canonical/OG/Twitter/title/robots identity
- preview/system noindex policy
- legacy HTTP 200 serving
- no Location redirect on legacy
- Pick For Us install identity
- no user-facing `Grok App`
- head injection remains idempotent

## Browser verification

Independently verify the exact candidate Preview in a real browser if tooling permits.

At minimum:
- hydrate `/`
- navigate to `/settings`
- navigate to `/history`
- navigate to `/favorites`
- verify normal root context/navigation
- exercise at least one real discovery RPC
- check for app console errors
- verify a missing route renders Not Found and normal navigation recovers

Distinguish browser-extension console noise from application errors.

If local browser is environment-blocked but cloud browser is available, use cloud browser.

If all browser routes are unavailable, report:

`BROWSER VERIFICATION ENVIRONMENT-BLOCKED`

## Vercel Preview verification

Read-only verify exact deployment:

`dpl_CccJC5M4kJTv7P4x4KUGeGefspn6`

Require:
- source branch `fix/pickforus-tanstack-security-candidate-1`
- source SHA `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
- state READY
- no `BLOCKED_PACKAGE`
- alias error absent
- real runtime HTTP works

If raw build logs are unavailable through tooling, record that limitation.

Do not redeploy.
Do not change Vercel settings.
Do not use the vulnerable-package bypass.

## Preservation

Verify no changes to:
- production main
- Android/runtime/signing
- auth settings/providers
- database/migrations
- provider code
- discovery deadlines
- catalog data
- domain/DNS state

The candidate must remain exactly three changed files over `195fc422...`.

## Reports

Produce:

`audit/pickforus-tanstack-security-verification-1-2026-10-01.md`

and:

`audit/pickforus-tanstack-security-verification-1-2026-10-01.json`

plus bounded evidence if useful.

Report:

1. immutable candidate identity
2. exact candidate scope
3. manifest verification
4. lockfile classification
5. deterministic replay
6. effective graph
7. vulnerability-copy absence
8. npm ci/npm ls results
9. security/RPC test review and results
10. existing 178-test results
11. typecheck/lint
12. migration-free build
13. built-output preservation
14. browser verification
15. Preview ID/source/state
16. package-gate clearance
17. no-bypass proof/limitation
18. preservation boundaries
19. warnings/limitations
20. exact final repository state
21. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US TANSTACK SECURITY CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

or

`PICK FOR US TANSTACK SECURITY VERIFICATION — FAILED`

or

`PICK FOR US TANSTACK SECURITY VERIFICATION — BLOCKED`

Do not merge.
Do not deploy production.
Do not touch DNS.
Do not attach the domain.
Stop after independent verification.
