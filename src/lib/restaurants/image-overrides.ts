import type { PhotoKey } from "./types";

export type RestaurantVisual = {
  src: string;
  isLogo: boolean;
};

type LogoOverride = {
  aliases: string[];
  slug?: string;
  domain?: string;
  src?: string;
  label?: string;
};

const LOGO_OVERRIDES: LogoOverride[] = [
  { aliases: ["mcdonalds", "mcdonald s"], slug: "mcdonalds" },
  { aliases: ["burger king"], slug: "burgerking" },
  { aliases: ["taco bell"], slug: "tacobell" },
  { aliases: ["kfc", "kentucky fried chicken"], slug: "kfc" },
  { aliases: ["starbucks", "starbucks coffee"], slug: "starbucks" },

  { aliases: ["wendys", "wendy s"], domain: "wendys.com" },
  {
    aliases: ["subway"],
    src: "https://cdn.worldvectorlogo.com/logos/subway-2016-logo.svg",
  },
  { aliases: ["pizza hut"], domain: "pizzahut.com" },
  { aliases: ["dominos", "domino s"], domain: "dominos.com" },
  { aliases: ["chick fil a"], domain: "chick-fil-a.com" },
  { aliases: ["chipotle", "chipotle mexican grill"], domain: "chipotle.com" },
  { aliases: ["applebees", "applebee s"], domain: "applebees.com" },
  {
    aliases: ["olive garden"],
    src: "https://cdn.worldvectorlogo.com/logos/olive-garden.svg",
  },
  {
    aliases: ["cracker barrel"],
    src: "https://cdn.worldvectorlogo.com/logos/cracker-barrel.svg",
  },
  { aliases: ["texas roadhouse"], domain: "texasroadhouse.com" },
  { aliases: ["outback", "outback steakhouse"], domain: "outback.com" },
  {
    aliases: ["cheddars", "cheddar s", "cheddar s scratch kitchen"],
    src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cheddar%27s_Scratch_Kitchen.jpg",
  },
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

  {
    aliases: ["andys frozen custard", "andy s frozen custard"],
    src: "https://static1.squarespace.com/static/53b0a785e4b044d9476f4eac/t/60b0096094a18801700045f3/1622149472225/AFC+Logo.png",
  },
  { aliases: ["auntie annes", "auntie anne s"], domain: "auntieannes.com" },
  { aliases: ["the big biscuit", "big biscuit"], domain: "bigbiscuit.com" },
  { aliases: ["black bear diner", "the black bear diner"], domain: "blackbeardiner.com" },
  { aliases: ["blimpie"], domain: "blimpie.com" },
  { aliases: ["bricktown brewery"], domain: "bricktownbrewery.com" },
  {
    aliases: ["caribou coffee", "caribou cafe"],
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Caribou_coffee_logo_detail.gif",
  },
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
  { aliases: ["steak and shake", "steak n shake"], domain: "steaknshake.com" },
  { aliases: ["tropical smoothie cafe", "tropical smoothie caf"], domain: "tropicalsmoothiecafe.com" },
  { aliases: ["wingstop", "wing stop"], domain: "wingstop.com" },
  { aliases: ["sirloin stockade"], domain: "sirloinstockade.com" },
  { aliases: ["ziggis coffee", "ziggi s coffee", "ziggis", "ziggi s"], domain: "ziggiscoffee.com" },
  { aliases: ["scooters coffee", "scooter s coffee", "scooters", "scooter s"], domain: "scooterscoffee.com" },
  { aliases: ["dunkin", "dunkin donuts"], domain: "dunkin.com" },

  { aliases: ["red onion cafe", "red onion espressoria", "red onion"], domain: "redonionrestaurants.com" },
  { aliases: ["crazy llama coffee"], domain: "crazyllamacoffee.com" },
  { aliases: ["orient express", "orient express joplin"], domain: "orientexpress888.com" },
  { aliases: ["chaos brewing", "chaos brewing company", "chaos brewing co"], domain: "chaosbrewing.beer" },
  { aliases: ["hackett hot wings", "hackett s hot wings", "hacketts hot wings"], domain: "hacketthotwings.com" },
  { aliases: ["gambinos pizza", "gambino s pizza"], domain: "gambinospizza.com" },
  { aliases: ["maple leaf coffeehouse", "maple leaf coffeehouse and smootherie", "maple leaf coffeehouse smootherie", "maple leaf coffee co"], domain: "mapleleafcoffeehouse.com" },
  { aliases: ["new york pizza and deli", "new york pizza deli", "nypd jomo"], domain: "nypdjomo.com" },
  { aliases: ["beef a roo", "beefaroo"], domain: "beefaroo.com" },
  { aliases: ["craves coffee"], domain: "cravescoffee.com" },
  { aliases: ["iggys diner", "iggy s diner"], domain: "iggysdiner.website" },
  { aliases: ["gringos", "gringos joplin", "gringos webb city"], domain: "webbcitygringos.com" },
  { aliases: ["lucys mexican restaurant", "lucy s mexican restaurant"], domain: "lucysmexicanrestaurantmo.com" },
  { aliases: ["pineapple bliss"], domain: "pineappleblissyourself.com" },
  { aliases: ["undercliff bar and grill", "undercliff bar grill", "undercliff grill"], domain: "theundercliffgrill.com" },
  { aliases: ["flat creek webb city", "flat creek restaurant", "flat creek"], domain: "flatcreekrestaurants.com" },
  { aliases: ["habaneros mexican grill", "habanero s mexican grill", "habaneros mexican cantina", "habaneros"], domain: "habanerosmexicancantina.com" },
  { aliases: ["joplin avenue coffee company", "joplin avenue coffee co"], label: "JACC" },
  { aliases: ["famos grill", "famos on 66", "famos"], label: "FAMOS\nON 66" },
  { aliases: ["angels on the route", "angel s on the route"], domain: "angelsontheroute.com" },
  { aliases: ["old riverton store", "eisler bros old riverton store", "eisler brothers old riverton store"], domain: "eislerbros.com" },

  { aliases: ["randy s drive in", "randys drive in"], label: "RANDY'S\nDRIVE-IN" },
  { aliases: ["coffee shop"], label: "COFFEE\nSHOP" },
  { aliases: ["downtown burgers"], label: "DOWNTOWN\nBURGERS" },
  { aliases: ["bamboo garden"], label: "BAMBOO\nGARDEN" },
  { aliases: ["bamboo"], label: "BAMBOO" },
  {
    aliases: ["iron skillet"],
    src: "https://images.seeklogo.com/logo-png/34/1/iron-skillet-restaurant-logo-png_seeklogo-340157.png",
  },
  { aliases: ["1988"], label: "1988" },
  {
    aliases: ["carterville superman museum and ice cream parlor", "supertam on 66"],
    label: "SUPERTAM\nON 66",
  },
  { aliases: ["broadway burgers"], label: "BROADWAY\nBURGERS" },
  {
    aliases: ["wa na bee dea snack bar", "wa na be dea snack bar"],
    label: "WA-NA-BEÉ-DÉA\nSNACK BAR",
  },
];

function normalizeRestaurantName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeBadgeLabel(name: string): string {
  const cleaned = name.replace(/\s+/g, " ").trim().toUpperCase();
  if (cleaned.length <= 13) return cleaned;

  const words = cleaned.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= 13 || !current) {
      current = next;
      continue;
    }

    if (lines.length < 2) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3).join("\n");
}

function textBadgeSrc(label: string): string {
  const lines = label.split("\n").map(escapeXml);
  const longest = Math.max(...lines.map((line) => line.length));
  const fontSize = lines.length >= 3
    ? longest > 18
      ? 44
      : longest > 13
        ? 52
        : 60
    : lines.length === 2
      ? longest > 15
        ? 58
        : longest > 11
          ? 70
          : 82
      : longest > 18
        ? 66
        : longest > 12
          ? 82
          : 118;
  const lineGap = fontSize * 1.08;
  const startY = 160 - ((lines.length - 1) * lineGap) / 2;
  const text = lines
    .map(
      (line, index) =>
        `<text x="320" y="${startY + index * lineGap}" text-anchor="middle" dominant-baseline="middle" fill="#26231f" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="3">${line}</text>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">${text}</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function restaurantVisual(name: string, _photoKey: PhotoKey): RestaurantVisual {
  const normalized = normalizeRestaurantName(name);
  const override = LOGO_OVERRIDES.find((item) =>
    item.aliases.some(
      (alias) => normalized === alias || normalized.startsWith(`${alias} `),
    ),
  );

  if (override?.src) {
    return {
      src: override.src,
      isLogo: true,
    };
  }

  if (override?.label) {
    return {
      src: textBadgeSrc(override.label),
      isLogo: true,
    };
  }

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
    src: textBadgeSrc(makeBadgeLabel(name)),
    isLogo: true,
  };
}
