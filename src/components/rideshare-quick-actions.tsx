import type { DecoratedRestaurant } from "@/lib/restaurants/types";

function uberRideUrl(restaurant: DecoratedRestaurant) {
  const params = new URLSearchParams();
  params.set("pickup", "my_location");
  params.set("dropoff[latitude]", String(restaurant.lat));
  params.set("dropoff[longitude]", String(restaurant.lon));
  params.set("dropoff[nickname]", restaurant.name);
  if (restaurant.address && restaurant.address !== "Address unavailable") {
    params.set("dropoff[formatted_address]", restaurant.address);
  }

  // Uber recommends universal links for mobile web/PWA surfaces so the rider
  // app can open when installed and the web flow can remain available otherwise.
  return `https://m.uber.com/looking?${params.toString()}`;
}

function lyftRideUrl(restaurant: DecoratedRestaurant) {
  const params = new URLSearchParams();
  params.set("id", "lyft");
  params.set("destination[latitude]", String(restaurant.lat));
  params.set("destination[longitude]", String(restaurant.lon));

  // Lyft's web ride-request deep link accepts destination coordinates. Pickup
  // is intentionally left to the Lyft app/browser so it can use current GPS.
  return `https://ride.lyft.com/u?${params.toString()}`;
}

export function RideshareQuickActions({ restaurant }: { restaurant: DecoratedRestaurant }) {
  return (
    <div className="shrink-0">
      <p className="text-right text-[0.62rem] tracking-[0.16em] text-subtle uppercase">Need a ride?</p>
      <div className="mt-2 flex gap-2">
        <a
          href={uberRideUrl(restaurant)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open Uber with ${restaurant.name} as the destination`}
          title="Ride with Uber"
          className="flex size-12 items-center justify-center rounded-xl bg-[#050505] text-white shadow-[0_0_20px_-7px_rgba(255,255,255,0.72)] ring-1 ring-white/12 transition duration-150 hover:scale-[1.04] hover:shadow-[0_0_24px_-5px_rgba(255,255,255,0.82)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-[0.97]"
        >
          <span className="text-[0.72rem] font-semibold tracking-[-0.03em]">Uber</span>
        </a>
        <a
          href={lyftRideUrl(restaurant)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open Lyft with ${restaurant.name} as the destination`}
          title="Ride with Lyft"
          className="flex size-12 items-center justify-center rounded-xl bg-[#ff00bf] text-white shadow-[0_0_22px_-6px_rgba(255,0,191,0.78)] ring-1 ring-white/18 transition duration-150 hover:scale-[1.04] hover:shadow-[0_0_26px_-4px_rgba(255,0,191,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8ee3] active:scale-[0.97]"
        >
          <span className="text-[0.75rem] font-black tracking-[-0.05em]">Lyft</span>
        </a>
      </div>
    </div>
  );
}
