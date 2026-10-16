# Independent partial browser failure review

2026-10-16 07:20 UTC. Exact failed source parent `14316e745c08877079281ad07764f9318d69c582`.

Artifact 12030937468 independently verified: 9,467,584 bytes; SHA256 `43baaad5a177fd21ae38c11d9461fa2e553cad9f12415ffd0630539504f570dc`; complete ZIP CRC clean. Verdict records 25 PASS checks and terminal FAIL, not full browser acceptance.

Failure: material-notice fixture 390/dark/blocked-storage follows the history link, awaits URL then immediately calls heading.count(). The nonretrying count returned zero. Five earlier material-notice cases, including blocked-storage at 320px, completed the same route. This confirms a test synchronization gap: URL readiness alone does not guarantee the queried DOM is ready. A transient rendering race is supported, but failure evidence alone does not conclusively exclude an application defect.

Reviewed staged correction: exact Version history heading locator waits for visible state with a bounded 15-second timeout, then preserves count===1. No production or policy changes. This is assertion-preserving and adds visible readiness. If heading never appears, the test still fails. No unconditional sleep, skipped case or weakened expected count. Current-head rerun remains mandatory.

Directly inspected original screenshots notice-320-dark-storage-visible, notice-320-light-blocked-keyboard-focus and notice-390-dark-blocked-visible. Notice text, version/date, underlined links and explicit no-assent statement are readable; no horizontal clipping observed. Keyboard focus is visible in inspected light image. These are partial observed passes only; unexecuted remaining cases cannot be inferred PASS. Fixture omits fixed bottom navigation; actual document suite separately covers app shell.

Final correction binding: tree `aae357e15db5997ef9308623326443510217409a`, parent `14316e745c08877079281ad07764f9318d69c582`. Final harness SHA256 `84379125a8aff6ef4794424133dfd7bb7b2e0bcc5d74a3963dbd0d7ac27943ac`. It additionally calls the existing visibleHit helper after exact count, verifying scroll/hit visibility. Independently reviewed final diff; no expected assertion removed. Source review PASS; hosted execution pending.
