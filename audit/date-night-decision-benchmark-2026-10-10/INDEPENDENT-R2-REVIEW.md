# Independent hosted R2 preflight review

Verdict: PASS for entry to the bounded live benchmark, conditional on final manifest and unique-run approval verification. No live performance/adoption conclusion follows from fixtures.

Reviewed run: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38033469837
Published commit: fdc67197cc505713b31929e2580fd1c573917d4b
Tree: c843927b162ee1ec5086c84b2518a45e44dff1f3
Frozen harness manifest: 74c4394a568dedcea9a17038647b85ab0f97e66d12a4efa08520521905cf8dfd
Artifact ZIP: 927226 bytes; SHA256 cb4959648abb831131cce995a307ecba82a64826fcabcaaf8240ab8e1807a555; 84 members, CRC verified.

## Integrity and accounting

- Public provider traffic: zero. Fixture reservations/outcomes: 28/28, no pending requests, no stop, no unrun cases.
- Independently verified 79-row chain; final hash 43a3e5962eeedb184210231aff0e736d1e286c40318d0fc4be42077ffbb5bb55.
- Independently checked all 28 provider bodies against byte length and SHA: 20 success, 8 failure. Checked all 22 cold RPC raw bodies against byte length and SHA.
- Both source/build proofs report authentic exact pinned source and final source checks passed.
- Exact request-bound timing now has distinct primary/patch start and response-end attribution. Warm controlled-block has no server dispatch or physical attempt.

## Actual browser observations

Four cold cases, respectively: complete; complete; quiescent-partial after failed outer acquisition; complete after failed primary and audit recovery. All have four eligible Movies, actual rendered Pick, four distinct Options and truthful no-pair Plan. Screenshots inspected for Pick, Options and no-pair output.

| Case | First eligible live pool ms | Pick enabled-to-attempt ms | Actual Pick render ms | Cold outcome | Warm outcome |
|---|---:|---:|---:|---|---|
| A success | 1480.0 | 87.7 | 3346.9 | complete | zero-refetch pass |
| B success | 1466.6 | 90.0 | 3342.5 | complete | zero-refetch pass |
| A failed outer | 1461.0 | 91.2 | 3327.6 | quiescent-partial | skipped |
| B failed primary | 1563.9 | 38.1 | 3385.3 | complete | refetch-required HOLD |

- Every trusted first Pick attempt meets the preregistered 250 ms driver gate. Render follows the actual animation; it is not backdated to enabled controls.
- Every cold observer p95 scan is at most 2.2 ms and max at most 40.5 ms, inside the 10/50 ms diagnostic gates. Warm scans also pass. No evidence here of a confounded fixture.
- Pick identity remains stable through two later audit patches in every case. Options were opened after audit; this does not newly establish Options or Plan stability during live updates. Existing functional proof remains separate.
- Failed-primary cold recovery is real and retains its own cold completion. Same-radius warm succeeds. Radius 20 to 15 emits a new primary request intent, blocked before dispatch, so warm no-refetch stays HOLD. It must remain in the final report and must not become a provider failure, zero-latency success, or discarded cold case.
- External images are blocked in the harness; screenshots prove usable venue/title/controls, not complete image loading.

## Minimal post-fixture offline correction

Author identified duplicated code in the missing-browser-result catch. Independently inspected the diff: it only removes references to undefined b/primary/audit before the existing explicit missing-result row. No browser, ledger, source or runtime behavior changes. Corrected analyze.mjs SHA256 17b46579a4ee84a1ab5521aea9627067109444fad62a2e7c281bdf73468dc185. Added missing-result regression SHA256 ed40914841e4720d6dbf136e1b8d10375f377ab652e782c9a11be1b218e5bcff. Independently reran all 48 offline tests using exact baseline/candidate roots: 48 pass, zero failures/skips. A new manifest is required before live entry.

## Remaining live gate and interpretation

Final live approval must bind the exact reviewed manifest, exact repository/workflow/run number and attempt 1, plus the fixed 1280-physical-attempt/45-minute budget. Cases remain sequential with native app request concurrency/pacing unchanged. All partial, censored and stopped rows remain evidence. R1 failed hosted preflight and older counter-reset/exit-13 live failures remain preserved.

Only real provider/browser live evidence can choose ADOPT HYBRID, KEEP RADIAL-V1 PRIMARY, or MORE EVIDENCE REQUIRED. Fixture timing, successful recovery and fixed harness bugs do not establish live speed, recall, failure rate, or successful-primary marginal audit yield.
