# Pick For Us — TanStack Security Remediation Continuation

Instruction branch:
`fix/pickforus-tanstack-security-1`

Implementation branch:
`fix/pickforus-tanstack-security-candidate-1`

Exact implementation base:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Expected base tree:
`2c5bbc7a24f83f5f88bca6a935dde9512863e89d`

Frozen main:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

## Why this continuation exists

The original remediation handoff was committed onto
`fix/pickforus-tanstack-security-1` as commit
`9fe7f7f3921576df22fe7e5692af938828791652`.

That branch therefore cannot also produce a remediation candidate whose sole parent is the exact verified base candidate `195fc422...` without either rewriting history or changing the sole-parent requirement.

No force push, rewrite, or relaxation is authorized.

The corrected workflow is:

1. Preserve `fix/pickforus-tanstack-security-1` as the instruction/history branch.
2. Perform implementation on `fix/pickforus-tanstack-security-candidate-1`.
3. The implementation branch starts exactly at `195fc422...`.
4. Read the authoritative remediation handoff from the instruction branch.
5. If successful, the remediation candidate commit on the implementation branch must have sole parent exactly `195fc422...`.

## Required reading

From the instruction branch, read IN FULL:

`docs/handoffs/active/pickforus-tanstack-security-remediation-1.md`

Also read the TanStack security audit and prior domain-readiness handoffs as required by that remediation handoff.

Treat the original remediation handoff as authoritative except for its branch name.

The implementation branch named in this continuation supersedes only the branch-location assumption.

## Candidate-parent rule

The successful remediation candidate must satisfy:

Sole parent:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Do not create a documentation/handoff commit on the implementation branch before the remediation candidate.

Do not rewrite the instruction branch.

Do not force push.

## Push / Preview

A normal non-forced push of the successful candidate to:

`fix/pickforus-tanstack-security-candidate-1`

is authorized.

The resulting Vercel Preview side effect is authorized.

All original prohibitions remain:
- no production merge/deploy
- no DNS/domain attachment
- no Vercel settings change
- no vulnerable-package bypass
- no Android/auth/database changes
- no broad dependency refresh

## Final behavior

If local remediation succeeds:
- commit the bounded remediation on the implementation branch
- require sole parent `195fc422...`
- push normally, non-forced
- observe Preview
- produce the originally requested remediation report/evidence
- stop

If any other immutable or dependency gate fails, stop according to the original handoff.
