import { dinnerIconKeyFromVisual, dinnerIconPath } from "./dinner-icons";
import type { PhotoKey } from "./types";
import type { ThemeId } from "../theme";

export type RestaurantVisual = {
  src: string;
  isLogo: boolean;
};

/**
 * Dinner mode intentionally uses Dinner Roulette-owned category artwork instead
 * of third-party restaurant logos, favicons, mascots, packaging, or trade dress.
 * The restaurant name remains the factual identity; the icon is our cuisine
 * classification of that restaurant.
 */
export function restaurantVisual(
  name: string,
  photoKey: PhotoKey,
  theme: ThemeId = "dark",
  cuisineLabel = "",
): RestaurantVisual {
  const key = dinnerIconKeyFromVisual(name, photoKey, cuisineLabel);
  return {
    src: dinnerIconPath(key, theme),
    isLogo: false,
  };
}
