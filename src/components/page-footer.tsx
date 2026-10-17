import { UnifiedFooter } from "./unified-footer";
import { useAppStore } from "@/lib/store";
import { getDateNightIcon, isDateNightRecord } from "@/lib/date-night/icons";
import { resolveSavedSeasonalPlace } from "@/lib/date-night/identity-receipts";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";

// Route-to-renderer mapping: bare discovery, Settings, and legal pages have no
// attested content artwork. Result/Options/Plan portals provide their own exact
// rendered image URLs. Favorites and History mirror their current renderers.
export function PageFooter({ pathname }: { pathname: string }) {
  const preferences = useAppStore((s) => s.preferences);
  const visits = useAppStore((s) => s.visits);
  const seenIdentities = new Set<string>();
  const sources = pathname === "/favorites"
    ? Object.values(preferences).filter((item) => item.favorite)
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => {
        const id = resolveSavedSeasonalPlace(item)?.id ?? item.restaurantId;
        if (seenIdentities.has(id)) return false;
        seenIdentities.add(id);
        return true;
      }).map((item) => {
      const current = resolveSavedSeasonalPlace(item);
      const icon = isDateNightRecord(item.restaurantId) ? getDateNightIcon({ cuisineLabel: current?.cuisineLabel ?? item.cuisineLabel }) : null;
      return icon ?? restaurantVisual(current?.name ?? item.name, item.photoKey ?? "american").src;
    })
    : pathname === "/history"
      ? visits.map((visit) => isDateNightRecord(visit.restaurantId) ? getDateNightIcon({ cuisineLabel: visit.cuisineLabel }) : null)
      : [];
  return <UnifiedFooter artworkSources={sources} />;
}
