# HYB-IV-03: failed empty primary is labelled Ready

Exact a4f43e9b886764592053a53652dc91602749ba11, tree44929e3f3d0b6ba2e4dd366de847b952388f9cb3. Independently reproduced2026-10-09 22:46 UTC with actual DateNightHome component harness, no provider traffic or source edits.

At noncatalog43,-79 Movies50, reject primary transport. The primary settles without usable places. UI stops foreground loading (appropriate), but displays 'Ready · checking background coverage' while showing0activities and disabled Pick/Options. `settled || hasUsablePool` conflates terminal settlement and usable readiness; phase naming propagates directly into consumer copy. An error notice is also supplied. This is not missing cancellation or lifecycle protection, and the previously issued benchmark-safety-entry PASS remains narrowly valid. Overall candidate/UX acceptance remains HOLD.

Probe empty-primary-readiness.test.mjs and log independently demonstrate the exact user-visible contradiction. Terminal empty/error state may stop a spinner without asserting usable Ready. Benchmark must record primary usable readiness as absent, then separately record any later usable audit recovery. Do not compare failed-primary settlement time against baseline usable results, nor treat radial total completion as baseline first-usable latency.

No remediation performed. Candidate is frozen while bounded live comparison is underway; a later authorized narrow correction requires new immutable identity and affected validation. Hosted run38000254537 also separately failed the unmount browser fixture's SecurityError assertion, with later seasonal/geometry skipped. That separate issue is under browser-author diagnosis and is not silently waived.
