# Pick For Us — TanStack Start Security Remediation 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `fix/pickforus-tanstack-security-1`

Exact verified base candidate:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Expected base tree:
`2c5bbc7a24f83f5f88bca6a935dde9512863e89d`

Frozen production main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Source audit final state:
`PICK FOR US TANSTACK SECURITY AUDIT — REMEDIATION READY`

## Authorization

Perform the bounded dependency/security remediation specified here.

This authorization includes:
- editing the two direct TanStack dependency requests
- regenerating the lockfile under the exact constrained process below
- adding the focused TanStack security/RPC regression test harness
- committing and pushing the remediation candidate
- allowing the normal Vercel Preview deployment attempt caused by the branch push
- observing the Preview read-only

This authorization does NOT include:
- production deployment
- merge to main
- DNS changes
- attaching `pickforus.app`
- Vercel settings/environment changes
- use of any vulnerable-package bypass
- Android retargeting/signing/publication
- database migrations
- auth-provider changes
- broad dependency refreshes
- source changes outside the explicitly allowed test-only scope

## Required reading

Read IN FULL:

- this handoff
- `docs/handoffs/active/pickforus-tanstack-security-audit-1.md`
- `docs/handoffs/active/pickforus-domain-readiness-remediation-1.md`
- `docs/handoffs/active/pickforus-domain-readiness-verification-1.md`

If the TanStack audit report/JSON/evidence are available in the workspace, read them in full and treat them as supporting evidence. Reproduce all critical gates independently during remediation.

## Starting gates

Before modification:

1. Fetch fresh refs.
2. Verify `origin/main` is exactly:
   `9337f6ede14b314f10d6b79720aef62ee94fad7d`
3. Verify `origin/fix/pickforus-domain-readiness-1` is exactly:
   `195fc422c3cde6bcae305296ae016ecae4bfd562`
4. Verify this remediation branch starts directly from `195fc422...`.
5. Verify base tree:
   `2c5bbc7a24f83f5f88bca6a935dde9512863e89d`
6. Establish a clean isolated checkout.
7. Record Node and npm versions.
8. Required toolchain:
   - Node `v24.19.0`
   - npm `11.9.0`

If the exact toolchain differs, stop and report rather than silently resolving with a different npm version.

If immutable state fails, end:

`PICK FOR US TANSTACK SECURITY REMEDIATION — BLOCKED`

## Security target

Known vulnerable candidate resolutions:
- `@tanstack/react-start@1.168.49`
- `@tanstack/start-server-core@1.169.31`

Required patched minimums:
- `@tanstack/react-start >=1.168.60`
- `@tanstack/start-server-core >=1.169.39`

Selected direct manifest requests:

`@tanstack/react-start: 1.168.60`

`@tanstack/react-router: 1.170.41`

These must be exact versions, not caret ranges.

Do not add a top-level `@tanstack/start-server-core` dependency.

Do not add blanket `@tanstack/*` overrides.

## Final manifest policy

The final `package.json` may differ from the base only in:

- `dependencies.@tanstack/react-start`
- `dependencies.@tanstack/react-router`

Final expected values:

`"@tanstack/react-start": "1.168.60"`

`"@tanstack/react-router": "1.170.41"`

Final `overrides` must return to exactly the original effective state:

`"nf3": "0.3.17"`

Temporary Seroval overrides are permitted ONLY during deterministic lock generation and must not remain in the final manifest:

- `overrides.seroval=1.6.7`
- `overrides.seroval-plugins=1.6.7`

## Required target dependency graph

The final effective runtime graph must contain these selected versions:

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

Expected unchanged:
- `@tanstack/start-fn-stubs 1.162.0`
- `@tanstack/virtual-file-routes 1.162.0`
- React Query packages
- React Table packages
- `vite 8.2.2`
- `nitro 3.0.260610-beta`
- `react 19.2.8`
- `react-dom 19.2.8`
- `typescript 5.9.3`
- `@vitejs/plugin-react 5.2.0`

Expected removal:
- nested `node_modules/@tanstack/start-plugin-core/node_modules/@babel/code-frame@7.27.1`

No new runtime package names are expected.

## Allowed files

The final committed remediation may change only:

- `package.json`
- `package-lock.json`
- `scripts/tanstack-security.test.mjs`
- bounded test-only fixtures outside production routes, only if strictly required
- remediation report/JSON/evidence if explicitly committed as documentation

Do not modify:
- application source
- `src/routes/**`
- domain-readiness implementation
- Android files
- Vercel config
- auth config
- database/migrations
- provider code
- deadline code
- catalog data

If application source changes appear necessary for compatibility, STOP and report the concrete incompatibility. Do not broaden this task.

## Deterministic lock generation

Start from the existing candidate lockfile. Do not delete/regenerate it wholesale.

Run exactly this process in the remediation checkout:

```bash
test "$(node --version)" = v24.19.0
test "$(npm --version)" = 11.9.0

audit_npm_cache="$(mktemp -d)"

npm pkg set 'overrides.seroval=1.6.7' 'overrides.seroval-plugins=1.6.7'

npm install --package-lock-only --ignore-scripts --no-audit --no-fund \
  --save-exact --cache "$audit_npm_cache" \
  @tanstack/react-start@1.168.60 @tanstack/react-router@1.170.41

npm pkg delete overrides.seroval overrides.seroval-plugins

npm install --package-lock-only --ignore-scripts --no-audit --no-fund \
  --offline --cache "$audit_npm_cache"

git diff --check
git diff -- package.json package-lock.json
```

Then perform a deterministic replay in a SECOND pristine checkout of the exact same base using:
- same Node/npm
- same captured npm cache
- offline mode
- same temporary Seroval constraints

Compare final `package.json` and `package-lock.json` byte-for-byte with `cmp`.

If replay differs, stop.

If removal of the temporary Seroval constraints changes the graph outside the approved envelope, stop.

Do not use:
- `--force`
- `--legacy-peer-deps`
- `npm audit fix`
- blanket `npm update`
- lockfile deletion/regeneration
- floating npm upgrade

## Lockfile scope gate

Expected lock impact:
- root dependency requests
- 18 selected package-version records
- dependency metadata/integrity for those records
- explained nested Babel code-frame removal

Reject:
- unrelated package version movement
- registry URL changes
- extra optional bundler peers
- old duplicate Start/Router graphs
- residual vulnerable versions
- persistent Seroval overrides
- unrelated React/Query/Table/Vite/Nitro/TS changes

Every extra changed lock path must be explicitly explained by the selected graph.

## Install and graph verification

After the deterministic lock is accepted:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm ls --all --json > /tmp/pickforus-tanstack-remediation-npm-ls.json
```

Requirements:
- `npm ci` leaves manifest and lock unchanged
- no invalid peers
- no extraneous runtime packages
- one coherent root Router graph
- Start resolves the selected Router/core modules
- no affected-range copy of React Start or Start server core anywhere in the effective runtime graph

Explicitly assert:
- React Start == 1.168.60
- Start server core == 1.169.39
- root Router == 1.170.41
- Router core == 1.171.34

## Required security/RPC regression test

Add:

`scripts/tanstack-security.test.mjs`

It must exercise real compiled TanStack Start transport rather than mocking `createServerFn`.

At minimum verify:

1. Actual application POST success for all five compiled server functions using deterministic fixtures:
   - searchRestaurants
   - lookupLocation
   - lookupReverseLocation
   - searchDateNight
   - searchNightlife
2. Stub outbound provider responses, not Start transport.
3. Include Date Night seasonal on/off.
4. Isolated test-only GET and POST transport fixture.
5. Legitimate serialization/deserialization.
6. Invalid coordinate/query validation.
7. thrown Error handling.
8. falsy return handling.
9. inert internal-field markers cannot become an HTML document response.
10. response-shaped unexpected objects fail closed or serialize safely.
11. legitimate real `Response` handling remains correct.
12. CSRF/method checks remain correct.
13. cancellation/deadline behavior remains bounded.

Do not add a production GET route merely for testing.

Do not attack production with exploit payloads.

## Existing regression suite

Re-run all existing 178 independently verified tests:

```bash
node --test scripts/domain-readiness.test.mjs scripts/grok-pwa-plugin.test.mjs

node --test \
  scripts/android-release.test.mjs \
  scripts/discovery-provider-deadlines.test.mjs \
  scripts/discovery-client-lifecycle.test.mjs \
  scripts/with-app-env.test.mjs
```

Require 178 passed, 0 failed, 0 skipped.

Run new security test:

`node --test scripts/tanstack-security.test.mjs`

## Typecheck and lint

Run:

`node node_modules/typescript/bin/tsc --noEmit`

Run bounded lint on:
- existing domain-readiness changed source/test files
- `scripts/tanstack-security.test.mjs`
- any authorized test-only fixture

No warnings/errors accepted unless explicitly pre-existing and demonstrated.

## Migration-free build

Run ONLY:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build` because it invokes `db:migrate`.

No migration may run.

## Built-output verification

Re-check actual built output for:

- `pickforus.app` metadata
- legacy `dinner-roulette-chi.vercel.app` metadata
- preview/system metadata
- manifests
- install tutorial
- final middleware/injector idempotence
- no legacy redirect
- no `Grok App` install identity

Preserve the independently verified domain-readiness behavior exactly.

## Browser/runtime verification

If browser execution is available:
- hydrate and navigate `/`, `/settings`, `/history`, `/favorites`
- verify links, error boundaries, scroll/root context and client/server RPC compatibility

If environment prevents browser execution, report:
`BROWSER VERIFICATION ENVIRONMENT-BLOCKED`

Do not count that alone as remediation failure if all other required gates pass; independent verification will carry it forward.

## Vercel Preview authorization

Pushing this remediation branch is authorized even though Git integration will trigger a Preview.

Expected successful security-gate behavior:
- new Preview is sourced from the exact remediation candidate
- no `BLOCKED_PACKAGE` for GHSA-qx66-fv34-fjm8
- build reaches normal framework/build execution

Overall Preview acceptance requires:
- state `READY`
- correct source SHA
- runtime smoke where possible

If Preview fails for a DIFFERENT reason:
- record exact error
- do not hide it
- do not broaden dependency scope automatically

Prohibited:
- `DANGEROUSLY_DEPLOY_VULNERABLE_TANSTACK_START_XSS=1`
- any Vercel package-security bypass
- Vercel settings changes

## Candidate commit

If all local gates pass:

1. Commit the bounded remediation.
2. Record candidate SHA/tree/parent.
3. Sole parent must be:
   `195fc422c3cde6bcae305296ae016ecae4bfd562`
4. Push normally, non-forced, to:
   `fix/pickforus-tanstack-security-1`
5. Observe the resulting Preview.
6. Do not merge.

## Required output

Produce:

`audit/pickforus-tanstack-security-remediation-1-2026-10-01.md`

`audit/pickforus-tanstack-security-remediation-1-2026-10-01.json`

plus bounded evidence.

Report:

1. starting immutable state
2. exact package.json delta
3. exact lockfile delta classification
4. deterministic replay result
5. final effective dependency graph
6. proof vulnerable versions are absent
7. new security/RPC test design/results
8. existing 178-test result
9. typecheck/lint
10. migration-free build
11. built-output preservation
12. browser verification status
13. candidate SHA/tree/parent
14. push result
15. Vercel Preview ID/source/state
16. whether `BLOCKED_PACKAGE` cleared
17. any new deployment error
18. no-bypass confirmation
19. final repository state
20. exact next step

## Final state

End with exactly one:

`PICK FOR US TANSTACK SECURITY REMEDIATION — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

or

`PICK FOR US TANSTACK SECURITY REMEDIATION — FAILED`

or

`PICK FOR US TANSTACK SECURITY REMEDIATION — BLOCKED`

Do not merge.
Do not touch DNS.
Do not attach the domain.
Stop after report/evidence/Preview observation.
