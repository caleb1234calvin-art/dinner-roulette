export const SEASONAL_FEATURES = {
  halloweenDateNight: true,
} as const;

export type SeasonalFeature = keyof typeof SEASONAL_FEATURES;

export function isSeasonalFeatureEnabled(feature: SeasonalFeature) {
  return SEASONAL_FEATURES[feature];
}
