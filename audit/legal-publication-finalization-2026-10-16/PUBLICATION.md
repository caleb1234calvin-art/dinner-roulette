# Legal publication and version maintenance

## Prepared 1.0 is not effective

The current source deliberately records version 1.0 as `unreleased` with a null effective date. It is suitable for review and testing, not release as an effective policy. No build clock, visit time, test date, PR date or automatic deployment may assign a legal effective date. Initial publication is informational, with no forced acceptance modal.

## Authorized publication finalization

1. Obtain owner authorization for the exact publication and its actual calendar date (ISO YYYY-MM-DD). A draft PR or source approval alone is not deployment authorization. Keep publication evidence in the release record. If publication is delayed to another day, stop and update the date before proceeding.
2. In `src/lib/legal/history.json`, set current.status to `published` and current.effectiveDate to that authorized actual publication date. Set both documents' matching status/date in `src/lib/legal/documents.json`. Leave version 1.0 unchanged for this first publication. Never guess or predate publication. These are source changes: prior test results do not apply automatically.
3. Run `node scripts/check-legal-release.mjs --publication`, typecheck, auth invariant, aggregate tests, scoped lint, and the migration-free production build/browser acceptance on the exact new source. Record commit/tree and build fingerprint. Independently compare rendered wording and owner operations to that source. Do not mark the unreleased source as effective or its old checks as covering the finalized source.
4. Only after separate merge/deployment authorization, release the exact validated source. Verify public `/privacy` and `/terms` return full 1.0 text, actual effective date, history and support contact without login, including a fresh browser and disabled JavaScript. Record actual publication date and deployed commit. If a date cannot be known and validated before release, hold release and resolve it with the owner; do not silently choose a date.

## Later versions

Before editing a published version, copy its exact current metadata plus complete privacy and terms documents into a new `previous` entry in history.json. Previous entries are immutable snapshots. Never change their text or dates to match new source. Check the snapshot against the previously published commit. The initial review draft is preserved in docs/legal/review-draft-v0.2.json and is not a prior effective policy.

Increment the shared version for each update. Reset current status/date to unreleased/null and both documents accordingly. Use `material` for material changes or `clarification` for nonmaterial corrections; write specific plain-language summary items about what actually changed. Mark requiresPrivacyConsent/requiresTermsAgreement according to the proposed change and applicable obligations, not convenience. Recheck actual collection before finalizing disclosures.

Published material changes trigger the nonblocking Legal updates notice throughout the app. Its links lead to permanent version history on both public documents. Dismissal saves only a local version marker; blocked storage means it may reappear on a later visit. A newer material version shows again. Initial 1.0 does not interrupt users. Version history and summaries stay available after dismissal and without JavaScript. No notice, browser storage marker, document reading or continued use is evidence of assent.

If renewed agreement or consent is applicable, do not introduce the relevant change until a separate explicit mechanism and its refusal/withdrawal behavior are implemented and reviewed. The publication check intentionally fails while either requirement flag is true: changing it to false is not a workaround. Document the lawful requirement decision and add properly scoped enforcement/tests through a reviewed source change. Optional-processing consent, service agreement and device permissions remain distinct.

## Privacy requests: owner-operated workflow

- Public contact is causticrelay@gmail.com. No account or sign-in is required. The owner personally reviews requests in Gmail; this code does not install an inbox monitor or send email.
- On receipt identify request type, relevant jurisdiction and applicable legal deadline. Record receipt and due dates in the Gmail case/thread; do not assume a universal deadline. Assess whether any extension is legally allowed and notify the requester within the applicable time if required.
- Ask only for information reasonably needed to verify identity and locate records. Do not request passwords or unnecessary sensitive information. Distinguish local device storage, information controlled by the operator, and records controlled by independent providers.
- Review access/correction/deletion requests, take applicable authorized action, respond within applicable legal deadlines, and explain any lawful reason for retaining information or inability to act. Local reset is not provider-wide deletion.
- Keep correspondence until resolved, then manually delete it from Gmail unless a legitimate legal or security obligation requires retention. If retaining it, record the specific reason, limited scope and review/deletion criterion. Gmail Trash/recovery, provider backups and legal/security copies are not instant permanent erasure.
- The owner has stated there are no separate support/log/analytics exports outside Gmail/Vercel. If that changes, assess and update retention practices and policy before the change. Never store case contents in this repository.

Native-device acceptance, Data safety, Play listing, signing, package identity and distribution remain separate gates. This procedure grants no permission to merge, deploy, change credentials/settings or submit Play declarations.
