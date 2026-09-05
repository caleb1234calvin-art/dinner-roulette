const CHAIN_NAMES = [
  "mcdonalds",
  "mcdonald's",
  "wendys",
  "wendy's",
  "burger king",
  "taco bell",
  "subway",
  "pizza hut",
  "dominos",
  "domino's",
  "kfc",
  "chick fil a",
  "chick-fil-a",
  "chipotle",
  "applebees",
  "applebee's",
  "olive garden",
  "cracker barrel",
  "outback",
  "texas roadhouse",
  "cheddars",
  "cheddar's",
  "logans roadhouse",
  "logan's roadhouse",
  "golden corral",
  "sonic",
  "dairy queen",
  "dq grill",
  "arbys",
  "arby's",
  "culvers",
  "culver's",
  "freddys",
  "freddy's",
  "steak n shake",
  "steak 'n shake",
  "waffle house",
  "dennys",
  "denny's",
  "starbucks",
  "7 brew",
  "braums",
  "braum's",
  "schlotzskys",
  "schlotzsky's",
  "cicis",
  "cici's",
  "old chicago",
  "raising canes",
  "raising cane's",
  "long john silver",
  "jimmys egg",
  "jimmy's egg",
  "first watch",
  "panera",
  "buffalo wild wings",
  "chilis",
  "chili's",
  "ihop",
  "popeyes",
  "whataburger",
  "five guys",
  "jersey mikes",
  "firehouse subs",
  "papa johns",
  "little caesars",
  "hardees",
  "hardee's",
  "carls jr",
  "orange julius",
  "iron skillet",
  "pizza ranch",
];

export function isLikelyChain(name: string, brand?: string | null): boolean {
  const haystack = `${brand ?? ""} ${name}`.toLowerCase();
  const compact = haystack.replace(/[^a-z0-9]+/g, " ").trim();
  return CHAIN_NAMES.some((chain) => compact.includes(chain));
}

export function inferPriceLevel(input: {
  amenity?: string;
  cuisine?: string;
  name: string;
  isChain: boolean;
}): 1 | 2 | 3 | 4 | null {
  const blob = `${input.name} ${input.cuisine ?? ""} ${input.amenity ?? ""}`.toLowerCase();
  if (input.amenity === "fast_food" || input.amenity === "ice_cream") return 1;
  if (/\b(steakhouse|fine dining|prime|upscale)\b/.test(blob)) return 3;
  if (input.amenity === "cafe") return 1;
  if (input.isChain) {
    if (/\b(olive garden|texas roadhouse|outback|logan's|cheddar)\b/.test(blob)) return 2;
    if (input.amenity === "restaurant") return 2;
    return 1;
  }
  if (input.amenity === "restaurant") return 2;
  return null;
}
