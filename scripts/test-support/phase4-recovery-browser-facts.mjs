// Independent visitor-fact checklists from Accepted-Seven-Record-Subset-R1.json.
// Never derive these expectations from the mutable presentation catalog.
export const PHASE4_MATERIAL_FACTS = {
  "MO26-006": [/October 3, 9–10, 16–17, 23–24 and 30–31/, /7 p\.m\./, /closing time.*unconfirmed/i, /approximate/i],
  "MO26-004": [/Fridays and Saturdays/, /September 25–October 31/, /7 p\.m\.(?: to |–)midnight/, /approximate/i],
  "DELTA3-FEARSTONE": [/October 17.*18\+/, /photo ID/, /waiver/i, /(?:recommends ages 12\+|ages 12\+ recommended)/, /under 12.*parent or guardian/, /walk independently/, /not.*handicap accessible/i, /access needs/, /lightning.*delay or cancel/i, /October 31.*(?:no-scare|Kids Night)|(?:no-scare|Kids Night).*October 31/i, /no-scare/i, /4–6 p\.m\./, /(?:not included|separate)/i],
  "DELTA3-FUN-TIME": [/2026 season/, /dates and hours.*(?:unverified|unconfirmed)/, /approximate/i],
  "MO26-055": [/September 19–October 31/, /Thursday–Monday/, /daily hours/i, /one.hour check.in windows/i, /one hour before closing/, /no outside food.*alcohol/i, /medical.*dietary/i, /no pets/i, /service animals/i, /Liberty Corn Maze.*(?:distinct|separate)/i, /text 816-781-9196/],
  "DELTA2-TERROR66": [/November 1/, /(?:nights|dates).*hours.*(?:unconfirmed|unverified|unknown)/i, /(?:all participants|Everyone).*waiver/i, /general admission.*no.touch/i, /Interactive Touch.*10\+/, /(?:minors|under[ -]18).*adult.*valid ID/i, /valid ID.*check.in.*(?:Interactive Touch|Rated R)|(?:Interactive Touch|Rated R).*valid ID.*check.in/i, /Rated R.*18\+/, /full contact/, /adult language.*dark humor/, /Rated R.*cannot.*(?:guests|pass)/, /General.*Interactive.*(?:together|mix)/i],
  "DELTA6-BRANSON-FIELD": [/October nights: 10–11, 15–18, 22–25 and 29–31|October 10–November 14/, /Ballparks of America/, /(?:distinct|separate) from Field of Screams Nixa/, /November 6–7 and 13–14/, /Halloween\/Christmas crossover/, /crossover hours.*(?:unverified|unconfirmed)/i, /intense audio, live actors, fog and strobes/i],
};

export const PHASE4_FORBIDDEN_COPY = /\$\s*\d|\bUSD\b|priced by weight|ticket fee|checkout total|refund|nonrefundable|audit|provenance|retention|Census|reviewRevision|survey-grade|periodic review|Schedule checked|listingExpiresAt|ListingCompletenessV1|machine opening|\b20\d{2}-\d{2}-\d{2}\b/i;

// A pre-amendment exact-ID favorite must hydrate from the current review, not
// the saved old coordinate, display address, or historic weekly opening rule.
export const STALE_WEREHOUSE_FAVORITE = {
  restaurantId: "date-night-werehouse-joplin", name: "The Werehouse", favorite: true,
  neverRecommend: false, ourRating: 4, timesVisited: 2, lastVisited: null,
  cuisineLabel: "Haunted House", photoKey: "cafe", lat: 37.0694258, lon: -94.4688601,
  address: "3819 E 20th St, Joplin, MO 64801", priceLevel: null,
};
