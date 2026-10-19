# Retention gate narrowing — 2026-10-16 05:26 UTC

## Finding
Requiring inaccessible proof of every SaaS backup erasure deadline would be an unnecessary completeness gate. Google's full User Data Privacy Policy provision requires the developer's retention/deletion policy and accurate handling/recipient/security disclosures. It does not prescribe a numeric deadline for each provider or demand forensic verification of provider internals. This is a bounded policy interpretation, not assurance that every jurisdiction has identical requirements.

Official source: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en , full Privacy Policy section (not summary). Relevant required item: developer retention/deletion policy. Account deletion is conditional on in-app account creation; do not generalize its trigger.

## Safely draftable now
1. Local state persists until changed/cleared; history cap200, exact reset scope, expiry pruning and lack of time-based local preference deletion are known from source. Say what the controls actually do; do not imply cloud erasure.
2. Owner retains support mail until resolution and manually deletes. Explain Gmail Trash and provider deletion/backups can persist beyond operator deletion. No audit of internal Google disks is necessary to explain the documented process honestly. Do not claim historical Grok copies erased.
3. Vercel hosts requests and actual aggregate analytics. Give the purposes/categories and provider links. Hobby runtime-log availability is1hour per product docs; label it dashboard availability, not an all-record deletion deadline. Vercel's documented visitor-session lifetime24h is likewise not all-analytics erasure.
4. Nominatim/Overpass process query/location data; providers can maintain operational records under their own practices. Name recipients and link applicable documentation. OSMF's180day Piwik statement is not universal Nominatim/Overpass retention. No need to invent an exact provider period absent documentation.
5. A general caveat that provider backups/security/legal records follow provider processes can be accurate when tied to actual documented facts; it cannot replace the operator's own policy or excuse undocumented additional uses.

## Exact proposed consumer replacement (for a later authorized revision, NOT applied)
“Your saved preferences, favorites and selected location remain in local app or browser storage until changed or cleared, subject to the specific controls described above. Visit history keeps up to200entries. We keep support correspondence until the request is resolved, then manually delete it from Gmail. Provider recovery and backup processes can retain copies after that action; deleting app data does not delete support email.

Our hosting, analytics and location-service providers process requests and may retain technical or security records under their applicable service practices. Vercel provides our hosting and aggregate analytics; Nominatim and the listed Overpass operators provide location and venue lookup. Their retention processes differ from local app storage and from each other. We do not promise an across-the-board provider deletion deadline. Contact causticrelay@gmail.com with questions or a deletion request relating to information we control.”

This wording still needs the final request-deletion procedure and any operator-created exports/incident copies disclosed if they exist. It should link provider notices, not represent those notices as a guarantee of universal processor status or complete deletion.

## Genuine remaining facts, narrowly scoped
- Are logs/analytics exported, copied, downloaded or sent through additional drains/integrations under operator control? If none, verify available dashboard/source and/or obtain owner attestation. If yes, name destination/purpose and retention/deletion criterion. Do not require inaccessible SaaS backup proof.
- What process handles a privacy deletion request for operator-controlled email or exported records, including retained unresolved/security/legal matters? The owner has already selected manual deletion after support resolution; do not ask again merely to obtain a numeric deadline.
- What actual data does the active Grok website extension process? This is a separate substantive collection/use/recipient uncertainty, not a retention-only paperwork gap or evidence that the support bot remains active. Do not retry the cancelled capture without the root's authorization workflow.
- Confirm intended distribution/audience sufficiently to assess specifically applicable privacy obligations. There is no blanket Play requirement for an LLC, a public personal name, governing-law clause or paid lawyer review. Pick For Us naming plus truthful support identity/contact satisfies the relevant naming criterion in isolation.
- Final effective text, rendered links and public availability require final review/approved release. No need to delay all implementation pending unknowable internal erasure details. Native/Data safety/signing/store acceptance remain separate.

## Vercel scope qualification
Official https://vercel.com/legal/privacy-notice excludes processing performed for customers under the DPA from its controller notice. Official https://vercel.com/legal/dpa (updated2026-03-17/effective2026-03-31) sections1/4 expressly describe Enterprise/Pro. Current dashboardHobby means do not claim this project's data is covered by those processor-contract terms without further evidence. This is not by itself a demonstrated Play violation, forced-upgrade conclusion or blanket block on factual policy publication. Use accurate service attribution and assess any applicable legal processor requirement separately.

## Provider sources inspected
- Google User Data full policy: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Vercel Analytics: https://vercel.com/docs/analytics/privacy-policy
- Vercel runtime logs: https://vercel.com/docs/logs/runtime
- Vercel privacy notice: https://vercel.com/legal/privacy-notice
- Vercel DPA: https://vercel.com/legal/dpa
- OSMF privacy policy: https://osmfoundation.org/wiki/Privacy_Policy
- Google retention: https://policies.google.com/technologies/retention
- Gmail deletion: https://support.google.com/mail/answer/7401?hl=en

All current official pages checked2026-10-16. Existing frozen PR source untouched. Earlier overly broad operator/legal/retention gates remain historical, superseded by this narrowing for final reporting.
