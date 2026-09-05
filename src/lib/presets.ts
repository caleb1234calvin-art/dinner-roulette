import type { AppFilters } from "./restaurants/types";

export const PRESETS: Array<{
  id: string;
  label: string;
  blurb: string;
  filters: Partial<AppFilters>;
}> = [
  {
    id: "cheap",
    label: "Cheap Night",
    blurb: "Keep it easy",
    filters: {
      radiusMiles: 10,
      minPrice: 1,
      maxPrice: 1,
      cuisines: ["anything"],
      adventure: 40,
      openNowOnly: true,
      favoritesOnly: false,
    },
  },
  {
    id: "date",
    label: "Date Night",
    blurb: "A little nicer",
    filters: {
      radiusMiles: 20,
      minPrice: 2,
      maxPrice: 3,
      cuisines: ["italian", "steakhouse", "japanese", "mediterranean"],
      adventure: 55,
      openNowOnly: true,
      favoritesOnly: false,
    },
  },
  {
    id: "fast",
    label: "Fast Food Run",
    blurb: "In and out",
    filters: {
      radiusMiles: 5,
      minPrice: 1,
      maxPrice: 1,
      cuisines: ["fast_food", "burgers", "pizza", "chicken", "tex-mex"],
      adventure: 20,
      openNowOnly: true,
      favoritesOnly: false,
    },
  },
  {
    id: "new",
    label: "Try Something New",
    blurb: "Adventure on",
    filters: {
      radiusMiles: 15,
      minPrice: 1,
      maxPrice: 4,
      cuisines: ["anything"],
      adventure: 100,
      openNowOnly: true,
      favoritesOnly: false,
    },
  },
  {
    id: "favorites",
    label: "Favorites Only",
    blurb: "Places we love",
    filters: {
      radiusMiles: 15,
      minPrice: 1,
      maxPrice: 4,
      cuisines: ["anything"],
      adventure: 10,
      openNowOnly: true,
      favoritesOnly: true,
    },
  },
];
