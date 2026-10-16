# Package identity decision and change inventory

Recommendation: prefer app.pickforus.android only for a verified first registration with owner approval, domain/brand control and availability. Otherwise the current com.calebcalvin.pickforus remains technically coherent. No identity change was made.


[Android application-ID rules](https://developer.android.com/build/configure-app-module) allow app.pickforus.android: dot-separated letter-leading alphanumeric segments. Its reverse-domain shape suggests pickforus.app; ownership of that domain and brand was not established. Android syntax validity does not establish availability or trademark/domain rights.

[Play's package identity rule](https://support.google.com/googleplay/android-developer/answer/9859152) makes package names permanent and non-reusable. Decide before any first upload. If a package is already claimed/published, changing the ID creates a separate app rather than renaming that listing.

The launcher label already says Pick For Us, independent of application ID. Changing the ID changes installation identity and Play URL; existing side-loaded private state is not automatically migrated. Do not promise an in-place upgrade from either com.calebcalvin.pickforus or the older com.calebcalvin.dinnerroulette debug identity.

If later authorized, update and test these active inputs together:

1. capacitor.config.json appId.
2. android/app/build.gradle applicationId and, for consistent code organization, namespace.
3. MainActivity.java package declaration and its directory from com/calebcalvin/pickforus to app/pickforus/android. Its manifest name is relative (.MainActivity), so resolution must remain valid.
4. android/app/src/main/res/values/strings.xml package_name and custom_url_scheme. The latter is currently unused and is not itself a working deep-link registration.
5. scripts/check-android.mjs APP_ID and scripts/android-release.test.mjs expected identity.
6. scripts/verify-android-bundle.py expected package and package-local receiver name.
7. native-android/test_bundle_inspection.py expected receiver permission.
8. Current README/ANDROID_RELEASE instructions and new release receipts. Preserve historical audit evidence as historical; do not bulk rewrite old artifact claims.
9. Regenerate sync-produced Android assets/config, then prove tracked sync stability and inspect the final merged manifest, package, class, providers and receiver permission.

The FileProvider authority already uses the applicationId placeholder and should become app.pickforus.android.fileprovider. AndroidX startup authority and signature permission also derive from app identity. Check the generated results rather than hard-coding blind replacements.

Repository evidence shows no google-services.json, assetlinks.json, Android Maps/Firebase SDK registration, or Android VIEW/BROWSABLE app-link filter. The manifest has only the launcher filter, MainActivity is an empty BridgeActivity subclass, and extra plugin registration is empty. The privacy lane found hosted Better Auth/Grok auth scaffolding and ordinary external Maps URLs rather than native credentials. This does not prove no external registrations exist.

Before any switch, inspect applicable private service configuration: Android OAuth clients, Firebase registrations, package-restricted API keys, attribution/push/deep-link services and any external consumers of provider authorities. If future App Links are added, [website association](https://developer.android.com/training/app-links/configure-assetlinks) must name the final package and distribution certificate. API providers can require package plus certificate fingerprints; Play distribution and upload certificates serve different roles.

No change is automatically required to ordinary HTTPS Maps links or the hosted runtime URL solely because the Android ID changes. Domain/host migration is a separate task with its own callbacks, links and origin checks.

