# PR #74 / D2 published-head independent supplement

Verdict: **QUALIFIED PASS for the focused source/regression review of published head `e25594063bc0de09aeb4e08c4912845f9f08fffa`. Full hosted/browser acceptance remains pending.** No merge/deployment approval.

GitHub PR #74 is freshly verified DRAFT, open and unmerged, targeting released main `991978fe24ec165eeacd5500a26d66f35d86c560`. GitHub Git commit object and an independently fetched detached local worktree confirm:

- Published candidate SHA: `e25594063bc0de09aeb4e08c4912845f9f08fffa`.
- Tree: `9c4ec8780bdddff51335f523823e1ec40dee001f`.
- Parent: `991978fe24ec165eeacd5500a26d66f35d86c560`.
- Prepublication review SHA remains `b683f7979845d32b909cf4f195bc8bf42305e101` and remains historical. It is not the published commit.

The reviewer freshly fetched and inspected the complete published nine-file PR patch, fetched the published Git object through ordinary Git, created a separate detached worktree, and compared its native complete main-to-head diff with the prepublication reviewed diff. They are byte-identical, and the tree matches; the different commit metadata yields a different SHA. **The verdict is not transferred solely from tree equality:** all focused tests below were freshly rerun with the published head as working directory/source.

| Fresh published-head execution | Result |
|---|---|
| Candidate nine regression tests | 9 PASS / 0 failures |
| Four modified existing test files | 101 PASS / 0 failures |
| Reviewer-only TTL/category/radius/negative/fallback/patch probes | 6 PASS / 0 failures |

The reviewer-only suite was copied to this supplemental packet with imports pointed at the independently fetched published worktree's test helpers. It uses that worktree's actual source through the repository module loader. Dependencies were reused through a temporary local symlink because the package lock is unchanged; the symlink was removed after testing. Final worktree status is clean. No candidate source changes were made.

The earlier full review's findings remain applicable after this fresh check: no blocking source/regression finding; curated additions never create provider proof; actual radius, operating dates, expiry and Open Now behavior remain enforced downstream; negative retirement is conservative within the existing location/Halloween/semantic namespace. The original baseline run with seven failures/two passing controls is preserved in the predecessor packet. No new baseline failure is claimed for the publication-only identity change.

Fresh exact-head hosted executions were independently discovered and inspected:

- Web run `38812681149`: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38812681149
- Unsigned Android run `38812681178`: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38812681178

At the captured job inspection, casino browser had succeeded; checks, Android validation and most browser lanes were running, while geometry and regional lanes were queued. No failure had completed. The remaining lanes are not PASS and no predecessor browser result is substituted. The coordinator must capture the eventual exact-head conclusions and inspect any failures/original artifacts before release acceptance.

Keep PR #74 separate from PR #73 and unmerged. This supplement adds fresh published-head evidence; it does not overwrite the prepublication review or its test logs. A future source/head change requires applicable fresh review and validation again.
