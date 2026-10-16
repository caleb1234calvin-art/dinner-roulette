# Reproducing the integrated candidate checks

Use an isolated checkout of `caleb1234calvin-art/dinner-roulette` at `e5e1682f6c82c9a7d972e28bf9b9f94973a3d158`, Node 24 and locked dependencies. First confirm `git rev-parse HEAD HEAD^{tree}` yields that head and `c36112156cd11baefb6671194f0d59b9c181c2a3`. Do not modify main or the published candidate.

Run each command sequentially and stop on failure:

```bash
npm ci --ignore-scripts
export VITE_AUTH_ENABLED=true
node scripts/browser-build-proof.mjs capture
node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
node scripts/browser-build-proof.mjs complete
node scripts/browser-build-proof.mjs verify
npm run typecheck
npm run lint
npm test
```

The direct Vite build must complete before the full suite because compiled security-hook tests inspect its SSR output. Ordinary `npm run build` invokes a database migration and is not part of this procedure. A failed compilation must never be followed by `complete` or treated as valid browser proof.

Expected exact-source fingerprint: `18d6724e402478ded889815535bad3ba1fe48992716e258864099931c8232ba8`, 520 files. Full tests on this head yielded 1,253 repository PASS / four inherited skips and 71 application PASS; lint zero errors / six inherited warnings. Output fingerprints vary between build worktree paths and Nitro timestamp; the included independent output comparison explains observed differences. Do not assume byte-reproducible build outputs.

The full hosted web matrix is defined by the unchanged `.github/workflows/validate-icon-pack.yml`. It checks out the PR head explicitly, performs a fresh migration-free build in each browser job, and requires all 15 lanes plus aggregate validation. Run `38822722705` belongs only to the new head; original run `38812681149` belongs to `e255940…` and cannot be substituted. Unsigned Android run `38822722711` is separate; signing is intentionally skipped.

Independent KC/Directions browser scripts, HTTP preload, final and early capture outputs, source/output proofs and before/after results are preserved in the separately saved browser packet. Read its report for fixture paths and invocation. The KC provider/geocoder/clock behavior is controlled and makes zero live provider requests; it is not field testing. Current-main controls record the expected defect. The true same-requirement failing-before evidence is in `independent-review/released-main-before.log`, seven failures/two passing controls; new-head focused logs record the passing correction and independent edge probes.

Original hosted ZIP receipts record full archive SHA-256/size/CRC and source proof. Verify ordered saved parts before extraction. Archive names containing a synthetic pull-request merge SHA do not alone establish checkout identity; inspect `source-revision.txt`, original job checkout and build-source proof together. Android's remote-URL wrapper can remain byte-identical while the web candidate changes.
