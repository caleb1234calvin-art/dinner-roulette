import type { DecoratedRestaurant } from "@/lib/restaurants/types";

// Uber documents destination-aware ride deep links. Keep the integration limited to
// opening Uber with a destination; Dinner Roulette does not request, price, or provide rides.
function uberRideUrl(restaurant: DecoratedRestaurant) {
  const params = new URLSearchParams();
  params.set("pickup", "my_location");
  params.set("dropoff[latitude]", String(restaurant.lat));
  params.set("dropoff[longitude]", String(restaurant.lon));
  params.set("dropoff[nickname]", restaurant.name);
  if (restaurant.address && restaurant.address !== "Address unavailable") {
    params.set("dropoff[formatted_address]", restaurant.address);
  }
  return `https://m.uber.com/looking?${params.toString()}`;
}

// Lyft's public launch URL is treated conservatively: open the independent service rather
// than depending on undocumented destination parameters.
const LYFT_RIDE_URL = "https://ride.lyft.com/";

export function RideshareQuickActions({ restaurant }: { restaurant: DecoratedRestaurant }) {
  return (
    <div className="w-[8.5rem] shrink-0 text-center">
      <p className="text-[0.68rem] font-extrabold tracking-[0.12em] text-fg uppercase drop-shadow-[0_0_7px_rgba(255,255,255,0.26)]">Drive sober.</p>
      <div className="mt-1 flex justify-center gap-2.5">
        <a href={uberRideUrl(restaurant)} target="_blank" rel="noopener noreferrer external" aria-label={`Open Uber with ${restaurant.name} as the destination; external service`} title="Open Uber" className="flex size-12 items-center justify-center rounded-md bg-elevated text-fg shadow-border transition duration-150 hover:scale-[1.03] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]">
          <span className="text-[0.72rem] font-semibold tracking-[-0.03em]">Uber ↗</span>
        </a>
        <a href={LYFT_RIDE_URL} target="_blank" rel="noopener noreferrer external" aria-label="Open Lyft; external service" title="Open Lyft" className="flex size-12 items-center justify-center rounded-md bg-elevated text-fg shadow-border transition duration-150 hover:scale-[1.03] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]">
          <span className="text-[0.75rem] font-semibold tracking-[-0.03em]">Lyft ↗</span>
        </a>
      </div>
      <p className="mt-1.5 text-[0.58rem] font-bold leading-[1.25] tracking-[0.08em] text-fg/90 uppercase drop-shadow-[0_0_6px_rgba(255,255,255,0.18)]">People care about you.</p>
      <p className="mt-1 text-[0.52rem] leading-tight text-subtle">Independent third-party services · ride availability and pricing vary.</p>
    </div>
  );
}
