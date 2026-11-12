import { clearSeasonalIdentityReceipts } from "./date-night/identity-receipts";
import {
  isChristmasEventPreferenceKey,
  sanitizeChristmasEventSnapshot,
  sanitizeChristmasSelections,
  sanitizeOrdinaryDateNightTypes,
  sanitizeSavedChristmasMetadata,
} from "./date-night/christmas-saved";
import type { ChristmasSelection } from "./date-night/christmas-picker";
import type { ChristmasEventSnapshot } from "./date-night/christmas-pilot-model";
import { create } from "zustand";
import { isGeographicLocation } from "./location/model";
import { persist } from "zustand/middleware";
import { DEFAULT_DATE_NIGHT_FILTERS, type DateNightFilters } from "./date-night/types";
import type { HomeMode } from "./nightlife/types";
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
  dateNightFilters: DateNightFilters;
  homeMode: HomeMode;
  preferences: Record<string, RestaurantPreference>;
  visits: VisitRecord[];
  exclusions: TemporaryExclusion[];
  sessionShown: string[];
  sessionDate: string;
  theme: ThemeId;
  spookySeasonEnabled: boolean;
  christmasEnabled: boolean;
  christmasCategories: ChristmasSelection[];
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setTheme: (theme: ThemeId) => void;
  setHomeMode: (mode: HomeMode) => void;
  setSpookySeasonEnabled: (value: boolean) => void;
  setChristmasEnabled: (value: boolean) => void;
  setChristmasCategories: (values: readonly ChristmasSelection[]) => void;
  setLocation: (location: SearchLocation) => void;
  setFilters: (patch: Partial<AppFilters>) => void;
  setDateNightFilters: (patch: Partial<DateNightFilters>) => void;
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
    dateNightEvent?: ChristmasEventSnapshot;
  }) => void;
  setRating: (restaurantId: string, rating: number | null) => void;
  recordVisit: (input: {
    restaurantId: string;
    restaurantName: string;
    cuisineLabel: string;
    personalRating: number | null;
    note?: string;
    dateNightEvent?: ChristmasEventSnapshot;
  }) => void;
  pruneExpired: () => void;
  resetFilters: () => void;
  resetAllData: () => void;
}

function pruneList(exclusions: TemporaryExclusion[], now = Date.now()): TemporaryExclusion[] {
  return exclusions.filter((item) => item.expiresAt > now);
}

function isHomeMode(value: unknown): value is HomeMode {
  return value === "dinner" || value === "nightlife" || value === "date-night";
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
    ...(patch.dateNightEvent ?? existing?.dateNightEvent ? { dateNightEvent: patch.dateNightEvent ?? existing?.dateNightEvent } : {}),
    ...(!patch.dateNightEvent && existing?.dateNightEventUnavailable ? { dateNightEventUnavailable: true as const } : {}),
  };
  return { ...map, [patch.restaurantId]: next };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      location: DEFAULT_LOCATION,
      filters: DEFAULT_FILTERS,
      dateNightFilters: DEFAULT_DATE_NIGHT_FILTERS,
      homeMode: "dinner",
      preferences: {},
      visits: [],
      exclusions: [],
      sessionShown: [],
      sessionDate: todayKey(),
      theme: "dark",
      spookySeasonEnabled: false,
      christmasEnabled: true,
      christmasCategories: ["anything"],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setHomeMode: (mode) => set({ homeMode: mode }),
      setSpookySeasonEnabled: (value) => set({ spookySeasonEnabled: value }),
      setChristmasEnabled: (value) => set({ christmasEnabled: value }),
      setChristmasCategories: (values) => set({ christmasCategories: sanitizeChristmasSelections(values) }),
      setLocation: (location) => set({ location, sessionShown: [] }),
      setFilters: (patch) => set({ filters: { ...DEFAULT_FILTERS, ...get().filters, ...patch } }),
      setDateNightFilters: (patch) =>
        set({
          dateNightFilters: {
            ...DEFAULT_DATE_NIGHT_FILTERS,
            ...get().dateNightFilters,
            ...patch,
            activityTypes: sanitizeOrdinaryDateNightTypes(patch.activityTypes ?? get().dateNightFilters.activityTypes, get().dateNightFilters.activityTypes),
          },
        }),
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
        const snapshot = sanitizeChristmasEventSnapshot(input.dateNightEvent, input.restaurantId);
        if (input.dateNightEvent !== undefined && !snapshot) return;
        if (isChristmasEventPreferenceKey(input.restaurantId) && !snapshot) {
          // A malformed saved event may still be removed, but cannot be newly
          // favorited or promoted to an ordinary place through a missing payload.
          if (existing?.favorite) set({ preferences: upsertPref(get().preferences, { ...existing, favorite: false }) });
          return;
        }
        const permanent = snapshot?.kind === "permanent-venue-display";
        set({
          preferences: upsertPref(get().preferences, {
            ...input,
            ...(snapshot ? { dateNightEvent: snapshot } : {}),
            ...(permanent ? {
              name: existing?.name ?? snapshot.host.name,
              cuisineLabel: existing?.cuisineLabel ?? "Park",
              address: existing?.address ?? snapshot.host.address,
              photoKey: existing?.photoKey ?? input.photoKey,
              lat: existing?.lat ?? input.lat,
              lon: existing?.lon ?? input.lon,
              priceLevel: existing?.priceLevel ?? input.priceLevel,
            } : {}),
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
        const snapshot = sanitizeChristmasEventSnapshot(input.dateNightEvent, input.restaurantId);
        if ((input.dateNightEvent !== undefined && !snapshot) || (isChristmasEventPreferenceKey(input.restaurantId) && !snapshot)) return;
        const visit: VisitRecord = {
          id: `${input.restaurantId}-${Date.now()}`,
          restaurantId: input.restaurantId,
          restaurantName: input.restaurantName,
          cuisineLabel: input.cuisineLabel,
          date: new Date().toISOString(),
          personalRating: input.personalRating,
          note: input.note ?? "",
          ...(snapshot ? { dateNightEvent: snapshot } : {}),
        };
        const existing = get().preferences[input.restaurantId];
        set({
          visits: [visit, ...get().visits].slice(0, 200),
          preferences: upsertPref(get().preferences, {
            restaurantId: input.restaurantId,
            name: snapshot?.kind === "permanent-venue-display" ? existing?.name ?? snapshot.host.name : input.restaurantName,
            cuisineLabel: snapshot?.kind === "permanent-venue-display" ? existing?.cuisineLabel ?? "Park" : input.cuisineLabel,
            timesVisited: (existing?.timesVisited ?? 0) + 1,
            lastVisited: visit.date,
            ourRating: input.personalRating ?? existing?.ourRating ?? null,
            neverRecommend: snapshot && input.personalRating === null ? existing?.neverRecommend ?? false : input.personalRating === 1,
            ...(snapshot ? { dateNightEvent: snapshot } : {}),
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
      resetFilters: () => set({ filters: DEFAULT_FILTERS, dateNightFilters: DEFAULT_DATE_NIGHT_FILTERS, christmasCategories: ["anything"] }),
      resetAllData: () => {
        clearSeasonalIdentityReceipts();
        set({
          filters: DEFAULT_FILTERS,
          dateNightFilters: DEFAULT_DATE_NIGHT_FILTERS,
          homeMode: "dinner",
          preferences: {},
          visits: [],
          exclusions: [],
          sessionShown: [],
          sessionDate: todayKey(),
          spookySeasonEnabled: false,
          christmasEnabled: true,
          christmasCategories: ["anything"],
        });
      },
    }),
    {
      name: "pick-for-us-v1",
      skipHydration: true,
      partialize: (state) => ({
        location: state.location,
        filters: state.filters,
        dateNightFilters: state.dateNightFilters,
        homeMode: state.homeMode,
        preferences: state.preferences,
        visits: state.visits,
        exclusions: state.exclusions,
        sessionShown: state.sessionShown,
        sessionDate: state.sessionDate,
        theme: state.theme,
        spookySeasonEnabled: state.spookySeasonEnabled,
        christmasEnabled: state.christmasEnabled,
        christmasCategories: state.christmasCategories,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...saved,
          location: isGeographicLocation(saved.location) && ["geo", "manual", "default"].includes(saved.location.source)
            ? saved.location : current.location,
          filters: { ...DEFAULT_FILTERS, ...saved.filters },
          dateNightFilters: { ...DEFAULT_DATE_NIGHT_FILTERS, ...saved.dateNightFilters,
            activityTypes: sanitizeOrdinaryDateNightTypes(saved.dateNightFilters?.activityTypes, current.dateNightFilters.activityTypes) },
          preferences: Object.fromEntries(Object.entries(saved.preferences ?? current.preferences).map(([key, preference]) =>
            [key, sanitizeSavedChristmasMetadata(preference, key)])),
          visits: (saved.visits ?? current.visits).map(visit => sanitizeSavedChristmasMetadata(visit)),
          homeMode: isHomeMode(saved.homeMode) ? saved.homeMode : current.homeMode,
          theme: isThemeId(saved.theme) ? saved.theme : current.theme,
          spookySeasonEnabled:
            typeof saved.spookySeasonEnabled === "boolean"
              ? saved.spookySeasonEnabled
              : current.spookySeasonEnabled,
          christmasEnabled: typeof saved.christmasEnabled === "boolean" ? saved.christmasEnabled : current.christmasEnabled,
          christmasCategories: sanitizeChristmasSelections(saved.christmasCategories),
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

export const RADIUS_OPTIONS: DistanceMiles[] = [1, 3, 5, 10, 15, 20, 30, 40, 50];
