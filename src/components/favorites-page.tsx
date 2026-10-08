import { resolveSavedSeasonalPlace } from "@/lib/date-night/identity-receipts";
import { seasonalFavoriteToggleIds } from "@/lib/date-night/identity-preferences";
import { seasonalDistancePrefix } from "@/lib/date-night/listing";
import { getDateNightAvailability } from "@/lib/date-night/availability";
import { useDateNightClock } from "@/lib/date-night/use-clock";
import { directionsUrl } from "@/lib/location/maps";
import { Heart, MapPinned, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDateNightIcon, isDateNightRecord } from "@/lib/date-night/icons";
import { restaurantVisual } from "@/lib/restaurants/image-overrides";
import { formatDistance, haversineMiles } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import { useAppStore } from "@/lib/store";

export function FavoritesPage() {
  const now = useDateNightClock();
  const preferences = useAppStore((s) => s.preferences);
  const location = useAppStore((s) => s.location);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const seenIdentities = new Set<string>();
  const favorites = Object.values(preferences)
    .filter((item) => item.favorite)
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(item => {
      const id = resolveSavedSeasonalPlace(item)?.id ?? item.restaurantId;
      if (seenIdentities.has(id)) return false;
      seenIdentities.add(id);
      return true;
    });

  return (
    <main className="px-4 pt-6 pb-8">
      <p className="text-xs tracking-[0.22em] text-subtle uppercase">Saved for later</p>
      <h1 className="font-display mt-1 text-4xl text-fg">Favorites</h1>
      <p className="mt-2 text-sm text-muted">Places you already know you like.</p>

      {favorites.length === 0 ? (
        <div className="mt-10 rounded-xl bg-surface p-6 text-center shadow-[var(--shadow-border)]">
          <Heart className="mx-auto size-8 text-subtle" />
          <p className="mt-3 text-sm text-fg">No favorites yet</p>
          <p className="mt-1 text-sm text-muted">
            When a pick feels right, save it. Familiar nights will lean this way.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {favorites.map((item) => {
            // Saved coordinates are a snapshot, never current seasonal arrival evidence.
            // Historical favorites remain manageable after expiry with an explicit status.
            const current = resolveSavedSeasonalPlace(item);
            const destination = current ?? item;
            const displayName = current?.name ?? item.name;
            const cuisineLabel = current?.cuisineLabel ?? item.cuisineLabel;
            const priceLevel = current ? current.priceLevel : item.priceLevel;
            const distance = destination.lat != null && destination.lon != null
              ? haversineMiles(location.lat, location.lon, destination.lat, destination.lon) : null;
            const mapsUrl = current ? directionsUrl(current)
              : item.lat != null && item.lon != null ? directionsUrl(item) : null;
            const availability = current ? getDateNightAvailability({ ...current, hoursKnown: false, isOpen: false }, now) : null;
            const visual = restaurantVisual(displayName, item.photoKey ?? "american");
            const dateNightIcon = isDateNightRecord(item.restaurantId)
              ? getDateNightIcon({ cuisineLabel })
              : null;
            return (
              <li key={item.restaurantId} className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
                <div className="flex gap-3 p-3">
                  {dateNightIcon ? (
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-md bg-elevated p-1 outline outline-1 -outline-offset-1 outline-fg/10">
                      <img src={dateNightIcon} alt="" className="size-full rounded-lg object-cover" />
                    </div>
                  ) : visual.isLogo ? (
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-md bg-surface outline outline-1 -outline-offset-1 outline-fg/10">
                      <div className="flex size-16 items-center justify-center rounded-lg bg-[#d8d8d4] p-2">
                        <img src={visual.src} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={visual.src}
                      alt=""
                      className="size-20 shrink-0 rounded-md object-cover outline outline-1 -outline-offset-1 outline-fg/10"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base text-fg">{displayName}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {cuisineLabel ?? "Restaurant"}
                      {priceLevel ? ` · ${formatPrice(priceLevel)}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-subtle">
                      {distance != null ? `${seasonalDistancePrefix(destination)}${formatDistance(distance)}` : "Distance unknown"}
                      {item.ourRating ? ` · Our rating ${item.ourRating}/5` : ""}
                      {item.lastVisited
                        ? ` · Last chose ${new Date(item.lastVisited).toLocaleDateString()}`
                        : ""}
                    </p>
                    {current ? <p className="mt-1 text-xs text-subtle">{current.address} · {availability?.label}</p> : null}
                  </div>
                </div>
                <div className="flex gap-2 px-3 pb-3">
                  {mapsUrl ? (
                    <Button size="sm" className="flex-1" asChild>
                      <a href={mapsUrl} target="_blank" rel="noreferrer">
                        <MapPinned className="size-4" />
                        Directions
                      </a>
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Remove ${displayName}`}
                    onClick={() => {
                      const ids = current ? seasonalFavoriteToggleIds(current, preferences) : [item.restaurantId];
                      for (const restaurantId of ids) {
                        const saved = preferences[restaurantId];
                        if (saved?.favorite) toggleFavorite(saved);
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
