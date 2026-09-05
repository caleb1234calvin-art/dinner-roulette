import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyTheme, isThemeId, type ThemeId } from "./theme";
import { startOfTomorrow, todayKey } from "./utils";
import {
  DEFAULT_FILTERS,
  DEFAULT_LOCATION,
  type AppFilters,
  type CuisineId,
  type DistanceMiles,
  type RestaurantPreference,
  type SearchLocation,
  type TemporaryExclusion,
  type VisitRecord,
} from "./restaurants/types";

interface AppState {
  location: SearchLocation;
  filters: AppFilters;
  preferences: Record<string, RestaurantPreference>;
  visits: VisitRecord[];
  exclusions: TemporaryExclusion[];
  sessionShown: string[];
  sessionDate: string;
  theme: ThemeId;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setTheme: (theme: ThemeId) => void;
  setLocation: (location: SearchLocation) => void;
  setFilters: (patch: Partial<AppFilters>) => void;
  toggleCuisine: (id: CuisineId) => void;
  applyPreset: (patch: Partial<AppFilters>) => void;
  markShown: (restaurantId: string) => void;
  excludeTonight: (restaurantId: string, name: string) => void;
  clearExclusion: (restaurantId: string) => void;
  clearExclusions: () => void;
  toggleFavorite: (input: {
    restaurantId: string;
    name: string;
    cuisineLabel?: string;
    photoKey?: RestaurantPreference["photoKey"];
    lat?: number;
    lon?: number;
    address?: string;
    priceLevel?: RestaurantPreference["priceLevel"];
  }) => void;
  setRating: (restaurantId: string, rating: number | null) => void;
  recordVisit: (input: {
    restaurantId: string;
    restaurantName: string;
    cuisineLabel: string;
    personalRating: number | null;
    note?: string;
  }) => void;
  pruneExpired: () => void;
  resetFilters: () => void;
  resetAllData: () => void;
}

function pruneList(exclusions: TemporaryExclusion[], now = Date.now()): TemporaryExclusion[] {
  return exclusions.filter((item) => item.expiresAt > now);
}

function upsertPref(
  map: Record<string, RestaurantPreference>,
  patch: Partial<RestaurantPreference> & { restaurantId: string; name: string },
): Record<string, RestaurantPreference> {
  const existing = map[patch.restaurantId];
  const next: RestaurantPreference = {
    restaurantId: patch.restaurantId,
    name: patch.name,
    favorite: patch.favorite ?? existing?.favorite ?? false,
    ourRating: patch.ourRating !== undefined ? patch.ourRating : (existing?.ourRating ?? null),
    timesVisited: patch.timesVisited ?? existing?.timesVisited ?? 0,
    lastVisited: patch.lastVisited !== undefined ? patch.lastVisited : (existing?.lastVisited ?? null),
    neverRecommend: patch.neverRecommend ?? existing?.neverRecommend ?? false,
    cuisineLabel: patch.cuisineLabel ?? existing?.cuisineLabel,
    photoKey: patch.photoKey ?? existing?.photoKey,
    lat: patch.lat ?? existing?.lat,
    lon: patch.lon ?? existing?.lon,
    address: patch.address ?? existing?.address,
    priceLevel: patch.priceLevel !== undefined ? patch.priceLevel : existing?.priceLevel,
  };
  return { ...map, [patch.restaurantId]: next };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      location: DEFAULT_LOCATION,
      filters: DEFAULT_FILTERS,
      preferences: {},
      visits: [],
      exclusions: [],
      sessionShown: [],
      sessionDate: todayKey(),
      theme: "dark",
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setLocation: (location) => set({ location, sessionShown: [] }),
      setFilters: (patch) => set({ filters: { ...DEFAULT_FILTERS, ...get().filters, ...patch } }),
      toggleCuisine: (id) => {
        const current = get().filters.cuisines;
        if (id === "anything") {
          set({ filters: { ...get().filters, cuisines: ["anything"] } });
          return;
        }
        const withoutAnything = current.filter((item) => item !== "anything");
        const next = withoutAnything.includes(id)
          ? withoutAnything.filter((item) => item !== id)
          : [...withoutAnything, id];
        set({
          filters: {
            ...get().filters,
            cuisines: next.length === 0 ? ["anything"] : next,
          },
        });
      },
      applyPreset: (patch) =>
        set({
          filters: {
            ...get().filters,
            favoritesOnly: false,
            ...patch,
          },
        }),
      markShown: (restaurantId) => {
        const shown = get().sessionShown;
        if (shown.includes(restaurantId)) return;
        set({ sessionShown: [...shown, restaurantId] });
      },
      excludeTonight: (restaurantId, name) => {
        const exclusions = pruneList(get().exclusions).filter((item) => item.restaurantId !== restaurantId);
        exclusions.push({
          restaurantId,
          name,
          expiresAt: startOfTomorrow(),
          reason: "not-tonight",
        });
        set({ exclusions });
      },
      clearExclusion: (restaurantId) =>
        set({
          exclusions: get().exclusions.filter((item) => item.restaurantId !== restaurantId),
        }),
      clearExclusions: () => set({ exclusions: [] }),
      toggleFavorite: (input) => {
        const existing = get().preferences[input.restaurantId];
        set({
          preferences: upsertPref(get().preferences, {
            ...input,
            favorite: !existing?.favorite,
          }),
        });
      },
      setRating: (restaurantId, rating) => {
        const existing = get().preferences[restaurantId];
        if (!existing) return;
        set({
          preferences: upsertPref(get().preferences, {
            ...existing,
            ourRating: rating,
            neverRecommend: rating === 1,
          }),
        });
      },
      recordVisit: (input) => {
        const visit: VisitRecord = {
          id: `${input.restaurantId}-${Date.now()}`,
          restaurantId: input.restaurantId,
          restaurantName: input.restaurantName,
          cuisineLabel: input.cuisineLabel,
          date: new Date().toISOString(),
          personalRating: input.personalRating,
          note: input.note ?? "",
        };
        const existing = get().preferences[input.restaurantId];
        set({
          visits: [visit, ...get().visits].slice(0, 200),
          preferences: upsertPref(get().preferences, {
            restaurantId: input.restaurantId,
            name: input.restaurantName,
            cuisineLabel: input.cuisineLabel,
            timesVisited: (existing?.timesVisited ?? 0) + 1,
            lastVisited: visit.date,
            ourRating: input.personalRating ?? existing?.ourRating ?? null,
            neverRecommend: input.personalRating === 1,
          }),
        });
      },
      pruneExpired: () => {
        const today = todayKey();
        const exclusions = pruneList(get().exclusions);
        const sessionDate = get().sessionDate;
        set({
          exclusions,
          sessionDate: today,
          sessionShown: sessionDate === today ? get().sessionShown : [],
        });
      },
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
      resetAllData: () =>
        set({
          filters: DEFAULT_FILTERS,
          preferences: {},
          visits: [],
          exclusions: [],
          sessionShown: [],
          sessionDate: todayKey(),
        }),
    }),
    {
      name: "pick-for-us-v1",
      skipHydration: true,
      partialize: (state) => ({
        location: state.location,
        filters: state.filters,
        preferences: state.preferences,
        visits: state.visits,
        exclusions: state.exclusions,
        sessionShown: state.sessionShown,
        sessionDate: state.sessionDate,
        theme: state.theme,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...saved,
          filters: { ...DEFAULT_FILTERS, ...saved.filters },
          theme: isThemeId(saved.theme) ? saved.theme : current.theme,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.pruneExpired();
        if (state?.theme) applyTheme(state.theme);
        state?.setHydrated(true);
      },
    },
  ),
);

export function useFavoriteIds(): string[] {
  return useAppStore((state) =>
    Object.values(state.preferences)
      .filter((item) => item.favorite)
      .map((item) => item.restaurantId),
  );
}

export const RADIUS_OPTIONS: DistanceMiles[] = [1, 3, 5, 10, 15, 20, 30];
