import { Heart, MapPinned, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cuisinePhotoSrc } from "@/lib/restaurants/cuisines";
import { formatDistance, haversineMiles } from "@/lib/restaurants/geo";
import { formatPrice } from "@/lib/restaurants/hours";
import { useAppStore } from "@/lib/store";

export function FavoritesPage() {
  const preferences = useAppStore((s) => s.preferences);
  const location = useAppStore((s) => s.location);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favorites = Object.values(preferences)
    .filter((item) => item.favorite)
    .sort((a, b) => a.name.localeCompare(b.name));

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
            const distance =
              item.lat != null && item.lon != null
                ? haversineMiles(location.lat, location.lon, item.lat, item.lon)
                : null;
            const mapsUrl =
              item.lat != null && item.lon != null
                ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`
                : null;
            return (
              <li key={item.restaurantId} className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
                <div className="flex gap-3 p-3">
                  <img
                    src={cuisinePhotoSrc(item.photoKey ?? "american")}
                    alt=""
                    className="size-20 shrink-0 rounded-md object-cover outline outline-1 -outline-offset-1 outline-fg/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base text-fg">{item.name}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {item.cuisineLabel ?? "Restaurant"}
                      {item.priceLevel ? ` · ${formatPrice(item.priceLevel)}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-subtle">
                      {distance != null ? formatDistance(distance) : "Distance unknown"}
                      {item.ourRating ? ` · Our rating ${item.ourRating}/5` : ""}
                      {item.lastVisited
                        ? ` · Last chose ${new Date(item.lastVisited).toLocaleDateString()}`
                        : ""}
                    </p>
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
                    aria-label={`Remove ${item.name}`}
                    onClick={() =>
                      toggleFavorite({
                        restaurantId: item.restaurantId,
                        name: item.name,
                      })
                    }
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
