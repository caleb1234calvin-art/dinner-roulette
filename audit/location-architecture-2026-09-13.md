# Location architecture before changes

Inspected September 13, 2026, before runtime edits. Base: integration/active-work-pass-1 at `877ff08c300a9d149aa174e9c47471d57bc98ccd`. Isolated candidate: `integration/location-international-2026-09-13`. Main baseline: `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

## Actual flow

- Dinner, Nightlife (including casinos), and Date Night each duplicate a location section, manual form, and geolocation callbacks. The target icon really calls `navigator.geolocation.getCurrentPosition`; the adjacent pin toggles manual entry. The field is not decorative.
- All modes share persisted Zustand `location` (`pick-for-us-v1`): `{lat, lon, label, source}`. `setLocation` clears session-shown choices. Search effects depend on coordinates and radius, not the manual text or label.
- Dinner additionally calls geolocation automatically while the source is `default`. This violates the new explicit-action requirement and permits a late callback to replace a manual choice.
- The target button has no visible busy feedback. Every position error is mislabeled permission denial. Errors render only inside the initially closed manual form, so clicking the icon can appear to do nothing.
- Success waits for `lookupReverseLocation` (up to 12 seconds) before committing coordinates. Reverse failures eventually retain the GPS coordinates. Coordinates are consumed by subsequent searches; they are not discarded, but the delayed/hidden feedback and duplicated asynchronous flows need correction.
- `lookupLocation` forwards trimmed free text to Nominatim. `geocodeQuery` explicitly sets `countrycodes=us`, takes the first hit and retains only coordinates and a city/state label. This is the direct U.S. restriction. No Canada failure is established in Overpass.
- Reverse lookup is already worldwide but returns only a label; it discards country/province/locality data. Coordinate bounds and provider response shapes are not fully validated.
- All three business searches use Overpass `around:radius,lat,lon` against four existing mirrors. They do not append USA terms or restrict countries. Manual text is not sent to Overpass. Restaurant, nightlife/casino, date and seasonal query tags are already geographic rather than country-specific.
- Curated restaurants/date places are concentrated around Jasper County; casino catalog is U.S. coverage. Catalog overlays are distance-bounded. Restaurant outage fallback is explicitly bounded to 40 miles from Joplin. Preserve this geography; never use Joplin as an international fallback.
- Provider address builders retain only house/street/city, dropping region, postcode and country. No input parser requires a U.S. state pair, but UI copy only offers city/ZIP and display omits country.
- Google Maps directions use destination coordinates or URL-encoded business/address text; rideshare destinations use coordinates. No U.S. restriction exists in these URL builders. Rideshare availability is external.
- Existing pricing uses relative dollar tiers; distance is in miles. Opening hours are evaluated in the viewer's browser timezone, not the searched destination timezone. These are existing limitations, not country bans; defer currency/unit/timezone projects unless needed to correct this flow.

## Focused implementation boundary

Introduce optional country/code, region and locality metadata while preserving legacy coordinates, labels and source. Resolve free text globally through the existing provider, without a Canada-specific parser. Share the location control, request GPS only on click, commit usable coordinates immediately, show errors outside the form, and protect a newer manual choice from old callbacks. Preserve categories, catalogs, filters and brand styling. Add meaningful provider/controller/state/discovery tests and document actual browser/live-provider evidence separately from mocks.

## Provider references

- https://nominatim.org/release-docs/latest/api/Search/ — free text and country filter semantics.
- https://nominatim.org/release-docs/latest/api/Reverse/ — reverse address lookup; returned feature points must not replace device coordinates.
- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition — secure context, permission and error behavior.
- https://operations.osmfoundation.org/policies/nominatim/ — public-service operational limits; no autocomplete introduced.

No deployment or production migration is part of this work. `npm run build` also runs database migrations; use `npm run build:dev` only.
