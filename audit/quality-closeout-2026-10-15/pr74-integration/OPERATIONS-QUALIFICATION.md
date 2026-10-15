# PR #74 read-only release-safety checkpoint

Observed October 15, 2026, approximately 23:29–23:32 UTC. No release action occurred. Structured API receipt: READ-ONLY-OPERATIONS.json.

Current main remains `ead2319c4869478f4cd121e2370db4d9734d83ed`, tree `7c12c5327af906348992e9b7d3282a11f830a202`. Current Vercel production `dpl_8DBJFLQwkBGckTxM5RYPM63dLqS5` remains READY, with 92 unchanged curated identities. All five individual alias lookups resolve to that deployment: pickforus.app, www.pickforus.app, dinner-roulette-chi.vercel.app, dinner-roulette-minions-9e2c.vercel.app and dinner-roulette-git-main-minions-9e2c.vercel.app. The www alias retains its 308 redirect to the apex. This check verified configured alias ownership, not a fresh end-to-end application run through each hostname.

The project Build and Deployment settings were explicitly reloaded and the visible Build Command value and checked Override control read:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Override is enabled. No Save, checkbox or text edit was performed. Ordinary `npm run build` invokes database migration and remains an unsafe substitute. Integration branch deployment exclusion is unchanged. A later approved release must recheck these settings and exact main/candidate identities before merging; this checkpoint does not authorize it.

The production overview was reloaded. The owner-accessible Instant Rollback selector shows current `dpl_8DBJFLQwkBGckTxM5RYPM63dLqS5` and immediately previous `dpl_72on94mDyDhNBbmN356bdXBsMqtY`, the latter independently READY via the connector and bound to `991978fe24ec165eeacd5500a26d66f35d86c560`. The Hobby selector explicitly requires Pro for earlier targets. The selector was canceled; Continue and Confirm were never selected. One first click timed out while the refreshed view was loading; a fresh DOM snapshot then showed the control and the subsequent selector opened normally.

Rollback remains a qualified contingency, never an executed test. The prior review screen listed three domains; generated-alias recovery and exact consequences for all five aliases remain unproven. The earlier permission-denied rollback API was not retried or bypassed. Operator would be the owner using the supported dashboard after separate explicit rollback authorization. After any future PR #74 release, the intended preceding recovery deployment would be the current accepted PR #73 deployment `dpl_8DBJFLQwkBGckTxM5RYPM63dLqS5`; its post-release eligibility and alias state must be checked then. Do not assume the current predecessor remains the Hobby rollback target after another release.

No merge, deployment, rollback, database migration, production configuration change, Android signing or Play publication was performed. PR #74 remains DRAFT / UNMERGED / RELEASE HOLD pending exact-head hosted acceptance and a separate owner release decision.
