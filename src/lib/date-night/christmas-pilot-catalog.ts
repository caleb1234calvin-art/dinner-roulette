import type { ChristmasPilotAttraction } from "./christmas-pilot-model";

const firstReview = "https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6808848226";
const secondReview = "https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6809219778";

/** Advertised nights after both opening dates. The conditional November 24
 * backup has no unconditional admission interval; the app window is separate. */
const sparkleNights = [
  "2026-11-25", "2026-11-26", "2026-11-27", "2026-11-28", "2026-11-29", "2026-11-30",
  "2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04", "2026-12-05", "2026-12-06", "2026-12-07",
  "2026-12-08", "2026-12-09", "2026-12-10", "2026-12-11", "2026-12-12", "2026-12-13", "2026-12-14",
  "2026-12-15", "2026-12-16", "2026-12-17", "2026-12-18", "2026-12-19", "2026-12-20", "2026-12-21",
  "2026-12-22", "2026-12-23", "2026-12-24", "2026-12-25", "2026-12-26", "2026-12-27", "2026-12-28",
  "2026-12-29", "2026-12-30", "2026-12-31", "2027-01-01",
] as const;

/** Evidence-only pilot. Research IDs are not permanent venue IDs or navigation targets.
 * VERIFIED describes the reviewed claims, not gate access, live inventory or release clearance.
 * No other reviewed attraction or HOLD record is included in this bounded candidate.
 */
export const CHRISTMAS_2026_PILOT: readonly ChristmasPilotAttraction[] = [
  {
    researchId: "C26-001",
    eventName: "Sparkle in the Park",
    category: "christmas-lights",
    relationship: "permanent-venue-display",
    venue: {
      name: "Central Park, Carthage",
      address: "305 W Chestnut St, Carthage, MO",
      publicSpaces: ["Walk-through light display at Central Park"],
    },
    evidence: {
      verdict: "VERIFIED",
      reviewUrl: firstReview,
      checkedOn: "2026-11-11",
      sources: [
        {
          url: "https://www.cwep.com/about-cwep/community/sparkle-in-the-park/",
          supports: ["2026 display", "CWEP operator relationship", "walk-through format", "nightly hours", "January 1 closing date"],
        },
        {
          url: "https://www.cwep.com/calendar-events/sparkle-in-the-park-lighting-ceremony/",
          supports: ["November 23 opening ceremony", "November 24 inclement-weather backup", "free public admission"],
        },
        {
          url: "https://www.carthagemo.gov/o/parksandrec/page/central-park",
          supports: ["permanent Central Park relationship"],
        },
        {
          url: "https://www.carthagemo.gov/events?id=67898747",
          supports: ["305 W Chestnut St venue address; not a visitor gate"],
        },
        {
          url: secondReview,
          supports: ["independent venue-address review", "four-attraction shortlist", "gate navigation remains unverified"],
        },
      ],
    },
    sessions: [
      {
        id: "opening-ceremony",
        label: "Opening ceremony",
        dates: ["2026-11-23"],
        opens: "18:00",
        closes: null,
        admission: { kind: "free", priceUsd: 0, note: "Free public admission." },
        scheduleNote: "Opening ceremony starts at 6 p.m.; November 24 at 6 p.m. is the advertised inclement-weather backup. A ceremony finish was not established. Both dates precede the app Christmas window.",
      },
      {
        id: "nightly-display",
        label: "Nightly walk-through lights",
        dates: sparkleNights,
        opens: "17:00",
        closes: "24:00",
        admission: { kind: "free", priceUsd: 0, note: "Free public admission." },
        scheduleNote: "After opening, the advertised display runs nightly 5 p.m.–midnight through January 1, 2027. The app permits Christmas eligibility only November 27–December 31. November 24 has no machine admission interval here because its conditional weather-backup opening is at 6 p.m.; the evidence does not resolve that opening-night interval.",
      },
    ],
    route: null,
    unknowns: [
      "Canonical permanent venue ID has not been established by the research.",
      "Event-specific visitor gate and approach; the city address identifies the venue only.",
      "Last admission, reservation requirements, accessibility and additional holiday exceptions were not published in the reviewed evidence.",
      "Organizer clock times are local; the review did not identify an explicit source timezone for this display.",
    ],
  },
  {
    researchId: "C26-005",
    eventName: "Olde World Christmas Market",
    category: "holiday-market",
    relationship: "linked-event",
    venue: {
      name: "Grace Episcopal Church",
      address: "820 Howard St, Carthage, MO",
      publicSpaces: ["Church-hosted gala and market; specific event rooms not established"],
    },
    evidence: {
      verdict: "VERIFIED",
      reviewUrl: firstReview,
      checkedOn: "2026-11-11",
      sources: [
        {
          url: "https://diowestmo.org/event/olde-world-christmas-market/",
          supports: ["2026 event", "Grace Episcopal Church host", "distinct gala and market sessions", "America/Chicago timezone", "gala admission and ticket terms", "free public market admission"],
        },
        {
          url: "https://gracecarthage.com/contact/",
          supports: ["820 Howard St venue address"],
        },
      ],
    },
    sessions: [
      {
        id: "friday-gala",
        label: "Friday gala",
        dates: ["2026-12-04"],
        opens: "17:30",
        closes: "19:00",
        admission: {
          kind: "paid",
          priceUsd: 10,
          note: "$10 gala admission; tickets at the door or in advance through the church office. Live ticket availability is not verified.",
        },
        scheduleNote: "Friday, December 4, 5:30–7 p.m., America/Chicago. Gala includes wine and hors d’oeuvres. This session does not continue overnight.",
      },
      {
        id: "saturday-market",
        label: "Saturday market",
        dates: ["2026-12-05"],
        opens: "09:00",
        closes: "14:00",
        admission: { kind: "free", priceUsd: 0, note: "Free public market admission." },
        scheduleNote: "Saturday, December 5, 9 a.m.–2 p.m., America/Chicago. A separate session under the same event and church host.",
      },
    ],
    route: null,
    unknowns: [
      "Canonical permanent church venue ID has not been established by the research.",
      "Specific visitor door, parking, separate last entry and accessibility were not published.",
      "Live gala ticket inventory and Saturday reservation instructions were not established.",
    ],
  },
  {
    researchId: "C26-010",
    eventName: "NEWcaps Holiday Craft Fair",
    category: "holiday-craft-fair",
    relationship: "linked-event",
    venue: {
      name: "Neosho High School",
      address: "511 S Neosho Blvd, Neosho, MO",
      publicSpaces: ["Cafeteria", "Hallways", "Auxiliary gym"],
    },
    evidence: {
      verdict: "VERIFIED",
      reviewUrl: firstReview,
      checkedOn: "2026-11-11",
      sources: [
        {
          url: "https://neoshocc.com/events/details/newcaps-holiday-craft-fair-20752?memberSlug=neosho-school-district",
          supports: ["2026 event date", "9 a.m.–3 p.m. CST", "free public admission", "school venue address", "public event spaces"],
        },
        {
          url: "https://neoshocc.com/list/member/neosho-school-district-2321",
          supports: ["school district member attribution"],
        },
        {
          url: "https://chambermaster.blob.core.windows.net/userfiles/UserFiles/chambers/2144/Image/2026/NEWCAPSHOLIDAYCRAFTFAIR2026.png",
          supports: ["NEWcaps branded 2026 flyer", "event schedule", "free visitor admission", "cafeteria, hallways and auxiliary gym"],
        },
      ],
    },
    sessions: [
      {
        id: "public-craft-fair",
        label: "Public craft fair",
        dates: ["2026-12-05"],
        opens: "09:00",
        closes: "15:00",
        admission: { kind: "free", priceUsd: 0, note: "Free public visitor admission. Vendor registration and booth fees are separate." },
        scheduleNote: "Saturday, December 5, 9 a.m.–3 p.m. CST. Public access is limited to the advertised fair spaces and event hours; it does not establish ordinary public access to the school.",
      },
    ],
    route: null,
    unknowns: [
      "Canonical permanent school venue ID has not been established by the research.",
      "Specific exterior entrance, parking, last admission and accessibility were not published.",
      "Public access outside the advertised fair spaces and hours is not established.",
    ],
  },
  {
    researchId: "C26-007",
    eventName: "Carthage Downtown Lighting / Christmas Parade",
    category: "holiday-community-event",
    relationship: "fixed-site-and-route",
    venue: {
      name: "Carthage Square — downtown lighting site",
      address: "302 S Main St, Carthage, MO",
      publicSpaces: ["Carthage Square, the fixed lighting and documented spectator location"],
    },
    evidence: {
      verdict: "VERIFIED",
      reviewUrl: secondReview,
      checkedOn: "2026-11-11",
      sources: [
        {
          url: "https://www.visioncarthage.org/hometown-holidays",
          supports: ["Vision Carthage program context; current flyer and city entries establish the schedule"],
        },
        {
          url: "https://assets.cdn.filesafe.space/ftXHXN2qrw95U6FMIFMO/media/6aea32e4015a18a89dc522b5.png",
          supports: ["2026 organizer schedule", "caroling, dance and lighting start times", "parade start"],
        },
        {
          url: "https://www.carthagemo.gov/events?id=67826198",
          supports: ["December 7 lighting", "302 S Main St fixed square location", "free public activity"],
        },
        {
          url: "https://www.carthagemo.gov/events?id=64839108",
          supports: ["December 7 parade", "7 p.m. start", "parade route", "free public activity; commercial entry fee is separate"],
        },
      ],
    },
    sessions: [
      {
        id: "square-lighting-program",
        label: "Square caroling, dance and lighting",
        dates: ["2026-12-07"],
        opens: "17:30",
        closes: null,
        admission: { kind: "free", priceUsd: 0, note: "Free public square activities." },
        scheduleNote: "Monday, December 7: caroling at 5:30 p.m., dance at 6:15 p.m., downtown lighting at 6:30 p.m. These starts do not establish a finishing time or recurring nightly lights schedule.",
      },
      {
        id: "christmas-parade",
        label: "Christmas parade",
        dates: ["2026-12-07"],
        opens: "19:00",
        closes: null,
        admission: { kind: "free", priceUsd: 0, note: "Free public parade activities. The commercial parade-entry fee is not spectator admission." },
        scheduleNote: "Parade begins at 7 p.m. The city calendar's 7–8 p.m. envelope is not a verified finishing time for the last float. Keep the route separate from the square lighting site.",
      },
    ],
    route: {
      description: "Starts at Chestnut and Main, heads north on Main, circles Carthage Square and returns south to Chestnut and Grant. This is a route description, not a gate or turn-by-turn visitor approach.",
      startLocation: "Chestnut and Main Streets, Carthage",
      finishTime: null,
    },
    unknowns: [
      "Canonical permanent square identity has not been established by the research; the route is not a permanent venue.",
      "Exact activity and parade finish times, last entry and continuing nightly lights hours were not established.",
      "Specific gate, spectator reservation, reserved viewing area and accessibility or parking plan were not established.",
      "Organizer clock times are local; the review did not identify an explicit source timezone for the program.",
    ],
  },
];
