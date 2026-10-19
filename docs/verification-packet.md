# Local verification and continuity packet

`scripts/verification-packet.mjs` removes repeated manual joining of Git identities, existing browser-build fingerprints, check receipts, artifact hashes and continuity preservation receipts. It is read-only against the target checkout and writes a new output directory. It executes only read-only Git inspection and local file reads/writes. It does not build, run tests, access credentials or the network, change workflows/settings, merge, deploy, migrate, roll back or publish continuity.

It reuses `browser-build-proof.mjs` to verify the auth-enabled build's current source/output bytes. Keep using the existing evidence assembler for ZIP packaging, member CRC/hash checks and original-archive preservation; this tool does not replace it. A manifest is neither the original artifact nor evidence that someone inspected every screenshot.

## Prepare

Run from any working directory with Node. The target checkout must be clean and already have a valid build proof from the safe migration-free build route. Do not use ordinary `npm run build`, which invokes migrations.

```sh
node /path/to/tooling/scripts/verification-packet.mjs \
  --repo /path/to/verified-checkout \
  --receipt /path/to/check-receipt.json \
  --out /path/to/new-packet \
  --previous /path/to/earlier-packet/manifest.json \
  --continuity-base /path/to/exact-remote-continuity.md \
  --continuity-entry /path/to/reviewed-new-entry.md
```

`--previous` is optional. Both continuity options are optional together. The output parent directory must exist; the output directory must not exist and must be outside the checkout. No prior evidence is overwritten. Continuity is appended after all original bytes, even if the prior file lacks a final newline. Review the proposal, compare the fresh remote base hash with `priorSha256`, and follow the separate authorized publication process. This tool never applies its proposal.

The receipt schema is:

```json
{
  "schemaVersion": 1,
  "subject": {
    "sha": "exact full commit SHA",
    "tree": "exact tree SHA",
    "parents": ["all parent SHAs in Git order"],
    "source": {"sha256": "existing build-proof source hash", "files": 520},
    "output": {"sha256": "existing build-proof output hash", "files": 193}
  },
  "environment": {
    "node": "observed runtime version",
    "platform": "observed runner/platform",
    "fixture": "exact harness/fixture identity or artifact hash"
  },
  "artifacts": [
    {"id": "test-log", "path": "relative-to-receipt/or/absolute.log", "sha256": "expected SHA-256"}
  ],
  "checks": [
    {
      "id": "focused-tests",
      "status": "PASS",
      "required": true,
      "timeSensitive": false,
      "runReference": "exact run ID or command-log reference",
      "observedAt": "2026-10-16T00:00:00Z",
      "artifacts": ["test-log"]
    }
  ]
}
```

`PASS`, `QUALIFIED_PASS`, `FAIL`, `SKIP` and `NOT_RUN` are recorded statuses, supplied after inspection by the operator. Every check needs an artifact reference and explicit time sensitivity. The tool hashes the referenced files and rejects mismatches. It does not interpret log contents or prove that a human-supplied receipt is truthful. Required statuses other than `PASS` produce `REVIEW_REQUIRED`, without suppressing the original result. Independent review, actual screenshot inspection and acceptance are separate decisions; the output always says `NOT_DETERMINED` for acceptance.

## Unchanged-input reuse

Recorded evidence is eligible for reuse only if the full commit SHA, tree, ordered parents, source fingerprint, compiled output fingerprint, environment, packet/proof implementation, complete check receipt and referenced artifact bytes all match the prior manifest. All artifacts are freshly hashed. A same-tree new commit is a new identity and is ineligible; no predecessor PASS is transferred. Changed inputs require the applicable exact-head verification before a new receipt is authored.

Time-sensitive checks (production aliases/state, hosted configuration, rollback eligibility, live providers, current source authority) are never eligible for automatic reuse. Unchanged-input eligibility does not rerun a test, renew an observation time, change a check's recorded status or approve release. Record all relevant runtime, browser, fixture, dependency and flag inputs in `environment`; the tool cannot discover omitted inputs. Preserve the check harness itself as a referenced artifact when it lives outside the source fingerprint.

The output contains `manifest.json`, the original `check-receipt.json`, optional `continuity-proposal.md`, and `packet-hashes.json`. External artifacts are referenced and hashed, not copied. Save originals separately using the established evidence-preservation process. Historical failures belong in the receipt/packet as failed checks or artifact references; never replace them with later successful results.

## Focused verification

```sh
node --test scripts/verification-packet.test.mjs scripts/browser-build-proof.test.mjs
```

The tests use temporary, explicitly simulated build outputs. They cover identity/source/output/artifact drift, unchanged-input reuse, time-sensitive refusal, failure/skip retention, append-only binary history preservation, duplicate/missing bindings and output overwrite protection. They are tooling tests, not application acceptance.
