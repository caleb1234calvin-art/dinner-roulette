import type { DecoratedRestaurant } from "@/lib/restaurants/types";

import { uberRideTarget } from "@/lib/location/ride-target";

// Lyft's public launch URL is treated conservatively: open the independent service rather
// than depending on undocumented destination parameters.
const LYFT_RIDE_URL = "https://ride.lyft.com/";

export function RideshareQuickActions({ restaurant }: { restaurant: DecoratedRestaurant }) {
  const uber = uberRideTarget(restaurant);
  return (
    <div className="w-[8.5rem] shrink-0 text-center">
      <p className="text-[0.68rem] font-extrabold tracking-[0.12em] text-fg uppercase drop-shadow-[0_0_7px_rgba(255,255,255,0.26)]">Drive sober.</p>
      <div className="mt-1 flex justify-center gap-2.5">
        <a href={uber.url} target="_blank" rel="noopener noreferrer external" aria-label={uber.ariaLabel} title="Open Uber" className="flex size-12 items-center justify-center rounded-md bg-elevated text-fg shadow-border transition duration-150 hover:scale-[1.03] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]">
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
