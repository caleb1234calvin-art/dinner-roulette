# Seasonal Fact Contract #1 — implementation evidence

**SEASONAL FACT CONTRACT IMPLEMENTED — AWAITING SOURCE PILOT / VERIFICATION**

Implemented an isolated, strict v1 offline contract and deterministic builder on `feature/date-night-seasonal-fact-contract-1`, directly from `908510ac25fe5c24335126a0f34ff42fe4d80632`. No existing tracked file was modified. No source was activated and no runtime index was integrated.

## Delivered surface

| Paths | Purpose |
| --- | --- |
| `tools/seasonal-facts/schema.ts`, `canonical.ts` | Strict field allowlist, evidence, occurrence/location identity, scoped lifecycle, source metadata and deterministic IDs/canonicalization |
| `tools/seasonal-facts/policy.ts` | Disabled collector; permission, URL, SSRF, DNS/peer, redirect and resource-limit policy |
| `tools/seasonal-facts/builder.ts`, `io.ts`, `cli.ts` | Provenance-preserving resolution, quarantine/tombstones, retained history/freshness, schema/manifest verification and atomic local publication |
| `tools/seasonal-facts/fixtures.ts`, `generate-fixture.ts`, `generated/` | Invented scenario matrix and reproducible review exports |
| `tools/seasonal-facts/network-guard.mjs`, `tsconfig.json`, `README.md` | Offline execution tripwire, dedicated typecheck and contract documentation |
| `scripts/seasonal-fact-contract.test.mjs`, `seasonal-fact-contract-audit.mjs` | Behavioral/hostile-input tests and protected-scope/dependency inspection |
| `audit/date-night-seasonal-fact-contract-1-evidence/` | Logs, machine-readable result, artifact digests and production readback |
| `docs/handoffs/active/date-night-seasonal-fact-contract-1-continuation.md` | Freeze identity rule and next-task boundaries |

## Results

112 new tests passed with zero unmocked collector network attempts. Full suite: 841 passed, zero failed, four existing skips (845 total). Dedicated contract and product typechecks passed; changed-file lint passed; local build without migrations passed. Clean locked offline dependency install and dependency-tree checks passed. Offline npm audit reports zero vulnerabilities, with no fresh online advisory claim. No package or lockfile changed.

Full lint retains three existing `no-empty` errors in `audit/seasonal-discovery-coverage-audit-1-evidence/live-probe.mjs`, `audit/seasonal-discovery-coverage-audit-1-evidence/source-probe.mjs`, and `src/lib/app-data/client.server.ts`, plus six existing warnings. Those files are byte-identical to the immutable base. This implementation adds zero lint findings.

The synthetic builder output has seven published occurrences, four quarantines and one closure tombstone. Its content revision is `0b4823ffd0460646a0c6dc40e9cd30661c54a6ec9151cbf84e37a11fa1c06bcd`. All exported manifest hashes/byte counts match their physical files. The runtime artifact is 40,102 bytes. `bundle.json` is the atomic publication unit; sidecars are review exports.

All historical product/audit/workflow files are unchanged. The source registry contains only a disabled invented `.invalid` source. New collector imports are Node builtins and the existing Zod dependency. No network transport is implemented. Runtime compilation has no references to this offline surface. No public sources, paid APIs, geocoders, images, marketing/review content, user crawler URL interface, retries, or fallback billing were introduced.

## Freeze and next step

The unique commit introducing this report is the immutable implementation; resolve SHA/tree/sole parent as documented in the continuation and final delivery. Its sole parent must be `908510ac25fe5c24335126a0f34ff42fe4d80632`. `main` stays at `4d937e58d2a65567b54ac5271915bc85b498898b`; approved candidate stays at the base. READY production remains `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at the frozen main SHA.

Next: independently verify this exact implementation, then create `feature/date-night-seasonal-source-pilot-1` from the verified SHA for one permission-reviewed operator source. Unknown/conflicting permission stays disabled. Future live transport needs its own DNS pinning/streaming limit/parser verification. This task does not authorize source activation, runtime integration, merging main or production promotion.
