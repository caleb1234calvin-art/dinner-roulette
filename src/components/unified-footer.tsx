import { SUPPORT_MAILTO } from "@/lib/legal/support";
import { hasAttestedArtwork } from "@/lib/artwork/attribution";

export function UnifiedFooter({ artworkSources = [] }: { artworkSources?: readonly (string | null | undefined)[] }) {
  return (
    <footer data-unified-footer className="mt-6 rounded-xl border border-white/10 bg-[#111113] px-4 py-5 text-[13px] leading-6 text-[#d4d4d8]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-display text-lg text-[#fafafa]">Pick For Us</p>
        <p>by Caustic Relay</p>
      </div>
      <p className="mt-4">Independent application. Not affiliated with or endorsed by listed venues, delivery services, rideshare providers, mapping services or other third parties unless expressly stated.</p>
      <p className="mt-3">External services maintain their own availability, transactions, terms and privacy practices.</p>
      <nav aria-label="Legal and support" className="mt-4 flex flex-wrap items-center justify-center gap-x-4 border-t border-white/15 pt-2">
        {/* Full-document navigation also safely leaves an open result portal. */}
        <a className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="/privacy">Privacy Policy</a>
        <a className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="/terms">Terms &amp; Conditions</a>
        <a className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href={SUPPORT_MAILTO}>Support</a>
      </nav>
      {hasAttestedArtwork(artworkSources) ? <div data-artwork-credit className="mt-2 border-t border-white/15 pt-4 text-center">
        <p>Visual artwork created with Grok</p>
        <p>Creative direction and final refinements by Caustic Relay.</p>
      </div> : null}
    </footer>
  );
}
