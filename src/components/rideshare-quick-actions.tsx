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
    <div className="w-[8.5rem] shrink-0">
      <p className="text-center text-[0.65rem] font-bold leading-[1.35] tracking-[0.1em] text-fg uppercase drop-shadow-[0_0_7px_rgba(255,255,255,0.24)]">
        <span className="block">Drive sober.</span>
        <span className="block">People care about you.</span>
      </p>

      <div className="mt-2.5 flex justify-center gap-2.5">
        <a
          href={uberRideUrl(restaurant)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open Uber with ${restaurant.name} as the destination`}
          title="Ride with Uber"
          className="flex size-12 items-center justify-center rounded-md bg-[#111111] text-white shadow-[0_0_10px_-5px_rgba(255,255,255,0.28)] ring-1 ring-white/10 transition duration-150 hover:scale-[1.03] hover:bg-[#171717] hover:shadow-[0_0_12px_-5px_rgba(255,255,255,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 active:scale-[0.98]"
        >
          <span className="text-[0.72rem] font-semibold tracking-[-0.03em]">Uber</span>
        </a>
        <a
          href={lyftRideUrl(restaurant)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open Lyft with ${restaurant.name} as the destination`}
          title="Ride with Lyft"
          className="flex size-12 items-center justify-center rounded-md bg-[#b50088] text-white shadow-[0_0_10px_-5px_rgba(181,0,136,0.36)] ring-1 ring-white/10 transition duration-150 hover:scale-[1.03] hover:bg-[#c20091] hover:shadow-[0_0_12px_-5px_rgba(194,0,145,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db64bd] active:scale-[0.98]"
        >
          <span className="text-[0.75rem] font-black tracking-[-0.05em]">Lyft</span>
        </a>
      </div>
    </div>
  );
}
