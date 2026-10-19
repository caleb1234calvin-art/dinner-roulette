# Independent signing-instruction review

October 19, 2026, 18:44 UTC. PASS for an owner-operated signed-candidate preparation procedure. This is not signed-artifact acceptance or upload approval.

Reviewed LOCAL-SIGNING.md SHA256 377c1774647ac2e0c21235354eb8231ee6533a41da921a2f6c5308704662475b and matching owner-local-sign.sh SHA256 92e7bc38ba9dabdbd6ca5d6925981809712f1fcbc51de0b79f4ed183dbc73625. Both bash blocks independently extracted and checked with bash -n: exit0. Companion script exactly matches second block.

Verified guards: exact current artifact ZIP/AAB sizes and hashes; exact source receipt; root ZIP member name; quoted paths and fresh private working directories; unchanged read-only unsigned copy; no existing-key mutation or generation; interactive tool-owned password prompts without secret arguments/environment/logging; independent prior-record public certificate pin via DER SHA256 before signing; human confirmation of intended RSA4096 key; separate output; signed-file certificate matching; full strict signature report and preserved exit status; ambiguous code4 not accepted automatically; no automatic upload or Play readiness claim. Signed payload-by-payload comparison is explicitly deferred until an actual candidate exists and remains required before upload.

NEXT-CONSOLE.md sequencing also passes: signing strategy and applicable terms before automatic-enrollment-triggering upload; separate exact-candidate upload and rollout authorization; versionCode1 availability check; physical/runtime QA gaps retained. This review addresses operational safety and consistency, not legal certification or an independent recheck of its externally cited policy facts.

Author added the suggested fail-closed JDK21 gate before freeze. Independently reviewed that exact delta, re-extracted both blocks, repeated bash -n (both exit0), and confirmed companion script exact-match. The hashes above bind this final revision. The version regex accepts stable 21.x or bare21 and rejects other major versions; this remains static review, not actual Termux execution.

No signing commands, key-generation commands, private-key operations or production mutations were executed during review. Only text reads and bash syntax parsing were performed.
