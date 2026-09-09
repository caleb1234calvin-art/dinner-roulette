import type { CasinoAuditRecord } from "./casino-catalog";

const MAINE_GCU_SOURCE = "https://www.maine.gov/dps/gcu/casino-gaming";
const VERIFIED_ON = "2026-09-09";

const casino = (
  id: string,
  name: string,
  lat: number,
  lon: number,
  address: string,
  operator: string,
  website: string,
  coordinateSource?: string,
): CasinoAuditRecord => ({
  id: `casino-catalog-${id}`,
  name,
  lat,
  lon,
  address,
  cuisines: ["other"],
  cuisineLabel: "Casino",
  priceLevel: null,
  rating: null,
  reviewCount: null,
  openingHours: null,
  phone: null,
  website,
  isChain: false,
  photoKey: "cafe",
  source: "catalog",
  venueTypes: ["casino"],
  energyLevel: 2,
  audit: {
    verifiedOn: VERIFIED_ON,
    jurisdiction: "Maine",
    operator,
    identitySource: MAINE_GCU_SOURCE,
    coordinateSource,
    notes: "Maine Gambling Control Unit identifies exactly two current casino facilities: Hollywood Casino Bangor and Oxford Casino.",
  },
});

export const CASINO_CATALOG_PASS_10: CasinoAuditRecord[] = [
  casino("hollywood-bangor", "Hollywood Casino Bangor", 44.78855, -68.77708, "500 Main St, Bangor, ME 04401", "PENN Entertainment", "https://www.hollywoodcasinobangor.com/", "https://www.openstreetmap.org/way/698223484"),
  casino("oxford-maine", "Oxford Casino Hotel & Sportsbook", 44.11505, -70.44592, "777 Casino Way, Oxford, ME 04270", "Churchill Downs Incorporated", "https://www.oxfordcasino.com/", "https://www.openstreetmap.org/way/583799433"),
];
