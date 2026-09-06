import { cuisinePhotoSrc } from "./cuisines";
import type { PhotoKey } from "./types";

export type RestaurantVisual = {
  src: string;
  isLogo: boolean;
};

type LogoOverride = {
  aliases: string[];
  slug: string;
};

const LOGO_OVERRIDES: LogoOverride[] = [
  { aliases: ["mcdonalds", "mcdonald s"], slug: "mcdonalds" },
  { aliases: ["burger king"], slug: "burgerking" },
  { aliases: ["taco bell"], slug: "tacobell" },
  { aliases: ["kfc", "kentucky fried chicken"], slug: "kfc" },
  { aliases: ["starbucks", "starbucks coffee"], slug: "starbucks" },
];

function normalizeRestaurantName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function restaurantVisual(name: string, photoKey: PhotoKey): RestaurantVisual {
  const normalized = normalizeRestaurantName(name);
  const override = LOGO_OVERRIDES.find((item) =>
    item.aliases.some(
      (alias) => normalized === alias || normalized.startsWith(`${alias} `),
    ),
  );

  if (override) {
    return {
      src: `https://cdn.simpleicons.org/${override.slug}`,
      isLogo: true,
    };
  }

  return {
    src: cuisinePhotoSrc(photoKey),
    isLogo: false,
  };
}
