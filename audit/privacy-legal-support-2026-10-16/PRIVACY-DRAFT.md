# Privacy Policy

Version: 0.1 draft — October 16, 2026

Draft for review. Not yet effective. Operational details identified below must be confirmed before publication.

Effective: Not yet effective

## Who we are and how to contact us

Pick For Us helps you discover and choose restaurants, activities and seasonal destinations. Caustic Relay / Pick For Us is the support identity. For privacy questions, support or a deletion request, email causticrelay@gmail.com. You do not need an app account to email us.

This draft covers the Pick For Us website and its Android experience, which loads the hosted website. Caustic Relay is the owner’s personal brand, not a confirmed registered company. Legal operator details and applicable jurisdiction must be finalized before this draft takes effect.

[Email privacy and support](mailto:causticrelay@gmail.com?subject=Pick%20For%20Us%20privacy%20request)

## Location and place searches

You can enter a place manually or request your device’s location. Device location requires your browser or Android permission. The returned coordinates can be precise or approximate depending on your device, permission and conditions. Pick For Us does not deliberately round them before the location and nearby-place requests. The app requests device location when you choose that action; the current discovery feature does not request background location tracking.

Search text and coordinates are sent to Pick For Us servers to find and rank nearby places. The servers send entered search text or coordinates to OpenStreetMap Foundation’s Nominatim service for place lookup, and coordinate/radius/category queries to Overpass services for venue discovery. The configured Overpass hosts are overpass.openstreetmap.fr, overpass.private.coffee, maps.mail.ru and overpass-api.de; retries or fallback can use more than one host. These are separate service operators, not all covered by the OpenStreetMap Foundation privacy policy.

A manually entered place may be somewhere you want to visit rather than your current location. Avoid entering private information that is unnecessary for a place search. You can revoke device-location permission in your browser or Android settings and use manual search instead. Revocation does not erase a location already saved on this device.

[OpenStreetMap Foundation privacy policy](https://osmfoundation.org/wiki/Privacy_Policy)

## Data saved on your device

Pick For Us saves your selected search location, filters, favorites, ratings, visit history and notes, temporary exclusions, appearance, selected mode and seasonal preferences in browser or WebView storage. Venue identity records help apply current seasonal information to saved places. Tour status also uses session storage. This supports preferences and continuity between visits.

The main local store has no automatic time-based deletion for a saved location, favorites or preferences. Visit history keeps up to the latest 200 entries. Temporary exclusions stop applying after their expiry and are pruned when the app checks them. In-memory discovery caches have reuse limits; a cache reuse limit is not a promise that every copy is erased at that time.

The reviewed preference and history features use local storage rather than an account-based cloud synchronization feature. That does not mean all app data stays on the device: searches, hosting, analytics, external resources and email have the separate flows described here. Browser, operating-system backup or device-transfer behavior can also affect local data.

## Your local data controls

Reset filters restores the Dinner and Date Night filter defaults. Clear all exclusions removes the current exclusion list. Show hint again resets the tour’s session flag.

The existing Clear favorites and history action also clears ratings, visits, exclusions, shown-result history and seasonal identity records, and resets filters, mode and the seasonal switch. It keeps your selected location and appearance. It does not delete support email, provider records, hosting logs or every item of browser storage.

You can use your browser’s site-data controls or Android’s app-storage controls to remove local data. These controls may sign you out of services and remove saved preferences, and cannot erase copies held by other providers. Web and Android storage can be separate; clear each relevant app or browser. For information held by the operator, contact causticrelay@gmail.com. A request does not automatically erase data from unrelated services.

## Hosting, diagnostics and analytics

The service is hosted on Vercel. Requests to load pages, resources and server functions expose technical request information to the hosting infrastructure, such as IP address, request path, time and browser or device information. Application diagnostics record request/provider outcomes. The reviewed diagnostic calls avoid raw search coordinates and query payloads, but that is not a guarantee about all hosting logs.

The website includes Vercel Web Analytics and a custom mode-selection event. Vercel documents page and event statistics including URL/referrer information, approximate geographic information and device/browser details. Its documentation describes a request-derived visitor hash and no third-party cookies for that analytics product. The documented 24-hour visitor-session lifetime is not a promise that all analytics or hosting records are deleted within 24 hours.

Project-specific logging, analytics intake, retention settings, log exports and any additional processors still require operational verification before this draft becomes final.

[Vercel Analytics privacy information](https://vercel.com/docs/analytics/privacy-policy)

[Vercel privacy notice](https://vercel.com/legal/privacy-notice)

## Fonts and other external resources

The reviewed website requests Google Fonts. Loading an external resource exposes connection information such as IP address and request headers to that provider. Google describes its Fonts service separately from Google advertising products.

The reviewed build also references a Grok app-builder extension script. Its actual production behavior, data recipients and retention must be verified or the dependency deliberately removed and tested before final publication. This website integration is separate from any AI access to the support mailbox.

[Google Fonts privacy explanation](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html)

## Directions and other external services

If you open directions, rideshare, a venue website or another external service, that service receives the destination or link information needed for the action and handles further interactions under its own privacy policy. The reviewed directions helper sends the destination, not your device’s starting GPS point. The external app may independently request your location or use information it already holds.

Pick For Us does not control an external service’s account, booking, purchase, payment or deletion process. Check that service’s terms and privacy information before proceeding.

## Support correspondence

Contact Support opens your email application with causticrelay@gmail.com as the recipient and an optional subject. Pick For Us does not send the message for you. If an email application is unavailable, copy or type the displayed address into an email service you use.

If you send email, the operator and Gmail receive your email address, message, attachments and associated email information so your request can be handled. Send only information needed for your request; do not send passwords, payment-card details or unnecessary sensitive information.

The owner manages support directly through Gmail. Support correspondence is kept until the request is resolved, then manually deleted from Gmail. Google’s deletion process can retain messages in Trash and retain residual copies for its documented processing, backup or legal purposes. This is not a promise of immediate erasure from every system. Deleting local app data does not delete support correspondence. You can contact the same address with a deletion request.

[Google privacy policy](https://policies.google.com/privacy)

[Google retention information](https://policies.google.com/technologies/retention)

## Accounts

The reviewed discovery interface does not require a visible sign-up or sign-in step, and local email/password sign-up is disabled in source. Authentication infrastructure exists on the server. Its reachable production features and any stored account records still need verification. This draft does not promise that no account data exists or that an account-deletion obligation is inapplicable.

## Retention, deletion and security

Device-storage behavior is described above. Support-email retention is described above. Server, analytics and provider records have separate retention and deletion processes. Those operator-specific settings and criteria are still being verified; no across-the-board deletion deadline is promised in this draft.

The reviewed app uses HTTPS for its configured external data requests. Android cleartext traffic and mixed content are disabled in the inspected configuration. No online service or device can guarantee absolute security. Infrastructure access controls, backups and processing locations require further operational confirmation.

You may ask privacy questions or request access, correction or deletion at causticrelay@gmail.com. Applicable rights and any identity-verification or lawful-retention requirements depend on the operator and your jurisdiction. A request to the operator does not itself delete information independently held by an external service.

## Items still awaiting confirmation

This is a development draft, not a completed privacy-compliance declaration. Before it becomes effective, confirm the operator, audience and geographic scope; provider processing and transfers; account behavior; support-mail access; retention and deletion practices; and any consent or other lawful basis required for the intended distribution. No unsupported claim of anonymous-only data, no third-party sharing, no AI processing or immediate complete deletion is made.

## Versions and changes

This draft has not taken effect. The intended permanent policy path is /privacy on pickforus.app after an approved release. Final publication must include an effective date and preserve prior versions.

Proposed change process: publish a dated summary of material changes, make a clear in-app notice available, and request fresh consent when required before the new processing begins. This process requires implementation and owner/legal review; continued use must not be treated as blanket consent to optional processing.
