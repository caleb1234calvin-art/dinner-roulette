import { cuisinePhotoSrc } from "./cuisines";
import type { PhotoKey } from "./types";

export type RestaurantVisual = {
  src: string;
  isLogo: boolean;
};

type LogoOverride = {
  aliases: string[];
  slug?: string;
  domain?: string;
};

const LOGO_OVERRIDES: LogoOverride[] = [
  { aliases: ["mcdonalds", "mcdonald s"], slug: "mcdonalds" },
  { aliases: ["burger king"], slug: "burgerking" },
  { aliases: ["taco bell"], slug: "tacobell" },
  { aliases: ["kfc", "kentucky fried chicken"], slug: "kfc" },
  { aliases: ["starbucks", "starbucks coffee"], slug: "starbucks" },

  { aliases: ["wendys", "wendy s"], domain: "wendys.com" },
  { aliases: ["subway"], domain: "subway.com" },
  { aliases: ["pizza hut"], domain: "pizzahut.com" },
  { aliases: ["dominos", "domino s"], domain: "dominos.com" },
  { aliases: ["chick fil a"], domain: "chick-fil-a.com" },
  { aliases: ["chipotle", "chipotle mexican grill"], domain: "chipotle.com" },
  { aliases: ["applebees", "applebee s"], domain: "applebees.com" },
  { aliases: ["olive garden"], domain: "olivegarden.com" },
  { aliases: ["cracker barrel"], domain: "crackerbarrel.com" },
  { aliases: ["texas roadhouse"], domain: "texasroadhouse.com" },
  { aliases: ["outback", "outback steakhouse"], domain: "outback.com" },
  { aliases: ["cheddars", "cheddar s", "cheddar s scratch kitchen"], domain: "cheddars.com" },
  { aliases: ["sonic", "sonic drive in"], domain: "sonicdrivein.com" },
  { aliases: ["dairy queen", "dq grill", "dq grill and chill"], domain: "dairyqueen.com" },
  { aliases: ["arbys", "arby s"], domain: "arbys.com" },
  { aliases: ["culvers", "culver s"], domain: "culvers.com" },
  { aliases: ["freddys", "freddy s", "freddy s frozen custard and steakburgers"], domain: "freddys.com" },
  { aliases: ["waffle house"], domain: "wafflehouse.com" },
  { aliases: ["dennys", "denny s"], domain: "dennys.com" },
  { aliases: ["ihop"], domain: "ihop.com" },
  { aliases: ["popeyes", "popeyes louisiana kitchen"], domain: "popeyes.com" },
  { aliases: ["whataburger"], domain: "whataburger.com" },
  { aliases: ["five guys", "five guys burgers and fries"], domain: "fiveguys.com" },
  { aliases: ["jersey mikes", "jersey mike s"], domain: "jerseymikes.com" },
  { aliases: ["firehouse subs"], domain: "firehousesubs.com" },
  { aliases: ["papa johns", "papa john s"], domain: "papajohns.com" },
  { aliases: ["little caesars"], domain: "littlecaesars.com" },
  { aliases: ["panera", "panera bread"], domain: "panerabread.com" },
  { aliases: ["buffalo wild wings", "bdubs", "b dubs"], domain: "buffalowildwings.com" },
  { aliases: ["chilis", "chili s", "chili s grill and bar"], domain: "chilis.com" },
  { aliases: ["raising canes", "raising cane s"], domain: "raisingcanes.com" },
  { aliases: ["hardees", "hardee s"], domain: "hardees.com" },
  { aliases: ["carls jr", "carl s jr"], domain: "carlsjr.com" },
  { aliases: ["braums", "braum s"], domain: "braums.com" },
  { aliases: ["7 brew", "7 brew coffee"], domain: "7brew.com" },

  { aliases: ["andys frozen custard", "andy s frozen custard"], domain: "eatandys.com" },
  { aliases: ["auntie annes", "auntie anne s"], domain: "auntieannes.com" },
  { aliases: ["the big biscuit", "big biscuit"], domain: "bigbiscuit.com" },
  { aliases: ["black bear diner", "the black bear diner"], domain: "blackbeardiner.com" },
  { aliases: ["blimpie"], domain: "blimpie.com" },
  { aliases: ["bricktown brewery"], domain: "bricktownbrewery.com" },
  { aliases: ["caribou coffee"], domain: "cariboucoffee.com" },
  { aliases: ["caseys", "casey s", "caseys carryout pizza", "casey s carryout pizza"], domain: "caseys.com" },
  { aliases: ["charleys", "charley s", "charleys philly steaks", "charleys cheesesteaks"], domain: "charleys.com" },
  { aliases: ["charlies chicken", "charlie s chicken"], domain: "charlieschicken.com" },
  { aliases: ["cicis", "cici s", "cicis pizza", "cici s pizza"], domain: "cicis.com" },
  { aliases: ["cinnabon"], domain: "cinnabon.com" },
  { aliases: ["crumbl", "crumbl cookies"], domain: "crumblcookies.com" },
  { aliases: ["daylight donuts", "daylight donut"], domain: "daylightdonuts.com" },
  { aliases: ["first watch"], domain: "firstwatch.com" },
  { aliases: ["golden corral"], domain: "goldencorral.com" },
  { aliases: ["great american cookie company", "great american cookies"], domain: "greatamericancookies.com" },
  { aliases: ["gusanos", "gusano s", "gusanos pizza", "gusano s pizza"], domain: "gusanos.pizza" },
  { aliases: ["jimmy johns", "jimmy john s"], domain: "jimmyjohns.com" },
  { aliases: ["jimmys egg", "jimmy s egg"], domain: "jimmysegg.com" },
  { aliases: ["logans roadhouse", "logan s roadhouse"], domain: "logansroadhouse.com" },
  { aliases: ["long john silvers", "long john silver s"], domain: "ljsilvers.com" },
  { aliases: ["longhorn steakhouse", "long horn steakhouse"], domain: "longhornsteakhouse.com" },
  { aliases: ["mcalisters deli", "mcalister s deli", "mcalisters", "mcalister s"], domain: "mcalistersdeli.com" },
  { aliases: ["moes southwest grill", "moe s southwest grill", "moes", "moe s"], domain: "moes.com" },
  { aliases: ["old chicago", "old chicago pizza", "old chicago pizza and taproom"], domain: "oldchicago.com" },
  { aliases: ["panda express"], domain: "pandaexpress.com" },
  { aliases: ["pizza ranch", "pizza ranch and fun zone arcade", "pizza ranch fun zone arcade"], domain: "pizzaranch.com" },
  { aliases: ["qdoba", "qdoba mexican grill", "qdoba mexican eats"], domain: "qdoba.com" },
  { aliases: ["red lobster"], domain: "redlobster.com" },
  { aliases: ["ribcrib", "rib crib", "rib crib joplin"], domain: "ribcrib.com" },
  { aliases: ["schlotzskys", "schlotzsky s", "schlotzskys deli", "schlotzsky s deli"], domain: "schlotzskys.com" },
  { aliases: ["shakes frozen custard", "shake s frozen custard"], domain: "shakesholdingcompany.com" },
  { aliases: ["steak and shake", "steak n shake", "steak n shake"], domain: "steaknshake.com" },
  { aliases: ["tropical smoothie cafe", "tropical smoothie caf"], domain: "tropicalsmoothiecafe.com" },
  { aliases: ["wingstop", "wing stop"], domain: "wingstop.com" },
  { aliases: ["sirloin stockade"], domain: "sirloinstockade.com" },
  { aliases: ["ziggis coffee", "ziggi s coffee", "ziggis", "ziggi s"], domain: "ziggiscoffee.com" },
  { aliases: ["scooters coffee", "scooter s coffee", "scooters", "scooter s"], domain: "scooterscoffee.com" },
  { aliases: ["dunkin", "dunkin donuts"], domain: "dunkin.com" },
];

function normalizeRestaurantName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function faviconUrl(domain: string): string {
  const url = new URL("https://www.google.com/s2/favicons");
  url.searchParams.set("domain_url", `https://${domain}`);
  url.searchParams.set("sz", "256");
  return url.toString();
}

export function restaurantVisual(name: string, photoKey: PhotoKey): RestaurantVisual {
  const normalized = normalizeRestaurantName(name);
  const override = LOGO_OVERRIDES.find((item) =>
    item.aliases.some(
      (alias) => normalized === alias || normalized.startsWith(`${alias} `),
    ),
  );

  if (override?.slug) {
    return {
      src: `https://cdn.simpleicons.org/${override.slug}`,
      isLogo: true,
    };
  }

  if (override?.domain) {
    return {
      src: faviconUrl(override.domain),
      isLogo: true,
    };
  }

  return {
    src: cuisinePhotoSrc(photoKey),
    isLogo: false,
  };
}
