# Observed data flows and retention

Source commit c3208d9fdc9a21d698efa9254be1286f5d3d2836. These are source and limited public-browser observations, not a captured Android network trace. Provider contractual roles, actual logging and retention remain unknown.

| Flow | Data and destination | Source and limit |
|---|---|---|
| GPS discovery | Returned latitude/longitude → first-party server functions → Nominatim reverse lookup and Overpass queries | location-control.tsx:31–40,74–81; location/controller.ts:26–51; restaurants/search.ts:17–31,55–67. A single user-triggered request was identified; low-accuracy preference does not coarsen the returned value. |
| Manual search | Entered search text → first-party lookup → nominatim.openstreetmap.org/search | restaurants/geocode.ts:54–65. A destination search is not necessarily the user's home address or physical location. |
| Reverse lookup | Unrounded coordinates → nominatim.openstreetmap.org/reverse | restaurants/geocode.ts:73–85. zoom=10 changes the returned label, not transmitted precision. |
| Venue providers | Coordinate/radius queries → overpass.openstreetmap.fr, overpass.private.coffee, maps.mail.ru or overpass-api.de | restaurants/overpass.ts:5–20,57–67; Nightlife and Date Night provider paths also exist. These are implementation destinations, not proof of processor agreements. |
| Local state | Search location, preferences, visits, exclusions, filters, theme, session and seasonal state persist under pick-for-us-v1 | store.ts:101–123,250–278. Saved location has no source expiry. Clear favorites/history does not clear location or theme and is not labeled delete everything. |
| Memory caches | Date Night acquisition cache uses ten-minute reuse TTL; other radial caches are bounded | date-night/cache.ts:13,104–113,130–138. TTL checked on acquisition is not guaranteed timer-triggered deletion. |
| Analytics and external resources | Vercel Insights bootstrap/Mode Selected event; Google Fonts; Grok extension script references | routes/__root.tsx:18–19,41–45,64–65; analytics.ts:9–11; mode-home.tsx:53; scripts/grok-pwa-shared.mjs:189,216–230. Source/DOM presence is established; successful intake, payloads, tracking or sale are not. |
| External navigation | Maps and rideshare links send venue destination information on user action | maps.ts:17–30 and result/ride controls. The directions helper does not encode source GPS; actual final-app handoff still needs testing. |
| Auth infrastructure | Hosted OAuth/database/session/cryptography scaffolding exists | auth/server.ts; auth/provider.tsx:1–15 is a passthrough and visible routes have no account controls. Account creation applicability remains conditional. |
| Logging and transit | Source logs omit raw coordinates/query/payloads; explicit provider requests use HTTPS; native cleartext and mixed content are disabled | provider-chain.ts:90–108; hedged-provider.ts:144–160; capacitor.config.json. This does not establish platform access-log settings, all production traffic or retention. |

All exact file URLs and hashes are in EVIDENCE-INDEX.json; the requirement matrix provides linked anchors. Before policy drafting, document each provider's purpose, actual data, role, retention/deletion, security and applicable user control. No guessed Data Safety category or sharing exemption is certified here.
