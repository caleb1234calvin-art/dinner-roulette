# Independent successor legal-browser acceptance

2026-10-16 05:30 UTC. Exact reviewed source: 4dab2cd77d3d35559394be10bd14b0568026e5f1, tree e98c22a1f26e8b06f282334a257e8094292b20b1.

**PASS for bounded legal/support browser acceptance; no full WCAG, physical Android, production-policy or Play approval claim.**

Independently recomputed original ZIP artifact12027470929: 8,556,214 bytes, SHA256 2d39d9d7a3dd33dbf5e68defe6f86ddb3af11c2d0a81c5e6e3dd89f155efa294;39members; allCRC clean;36PNG screenshots. Verdict20/20PASS. Recomputed source fingerprint using deterministic repository build-input ordering without writing source/build files:527 files, SHA256 bb37e38e8fecf9d625d69f5da464a7cafc1211282c6a225cb7f6abba25d9a711, equal archive build proof. Build proof authFlag true, output202 files hash a5f06f037db662692dcf2ff218f82781291d508f8e54b75fc10db4783bdf77cf. Compiled output bytes were not independently reconstructed here; receipt is source-bound CI proof plus original archive validation.

Directly inspected original images:
-320-dark-support-viewport
-320-light-privacy-focused-viewport
-390-dark-terms-focused-viewport
-390-light-support-viewport
-512-dark-privacy-focused-viewport
-512-light-terms-focused-viewport

Also inspected native-resolution crops from full320dark privacy (local-controls and support paragraphs),390light terms (privacy, availability, changes/review),512light privacy (retention, review, changes and footer). Crop cutoffs are inspection boundaries, not app clipping. Visible text is readable and wraps within width; underline/focus differentiation is present; no new horizontal clipping observed. Fixed bottom navigation covers below-fold content normally; harness anchor scroll/hit-test checks address the scrolled target rather than declaring every full-page screenshot pixel simultaneously visible.

Verdicts cover dark/light320/390/512 routes, anchors, keyboard return, Settings links, simulated no-handler support fallback, reset persistence/switch names, and no-JavaScript legal rendering. Recorded normal text minima: darkprivacy/terms8.1888, darkSettings7.6039, light5.422676. Hover and combinedhover/focus assertions executed but separate ratios are not serialized. These are scoped text contrast checks, not all interactive/nontext/focus-appearance WCAG criteria.

Qualifications preserved: external fonts/analytics/Grok mocked; no email sent or native missing-mail-client test; public productionURL remains unreleased; policy documents remain non-effective drafts; other CI lanes and Android independent verification owned separately. Original3d388 automatedPASS omitted contrast and is not erased or upgraded.
