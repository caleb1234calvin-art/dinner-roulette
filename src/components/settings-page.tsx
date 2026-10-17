import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import history from "@/lib/legal/history.json";
import { publicationLabel } from "@/lib/legal/releases";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/legal/support";
import { Check, Moon, Smartphone, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { resetHints } from "@/lib/session-hints";
import { useAppStore } from "@/lib/store";
import type { ThemeId } from "@/lib/theme";
import { cn } from "@/lib/utils";

type CapacitorWindow = Window & { Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string; }; };

function isRunningInNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const capacitor = (window as CapacitorWindow).Capacitor;
  if (!capacitor) return false;
  if (typeof capacitor.isNativePlatform === "function") return capacitor.isNativePlatform();
  if (typeof capacitor.getPlatform === "function") return capacitor.getPlatform() !== "web";
  return false;
}

export function SettingsPage() {
  const filters = useAppStore((s) => s.filters); const setFilters = useAppStore((s) => s.setFilters);
  const theme = useAppStore((s) => s.theme); const setTheme = useAppStore((s) => s.setTheme);
  const exclusions = useAppStore((s) => s.exclusions); const clearExclusion = useAppStore((s) => s.clearExclusion); const clearExclusions = useAppStore((s) => s.clearExclusions);
  const resetFilters = useAppStore((s) => s.resetFilters); const resetAllData = useAppStore((s) => s.resetAllData);
  const activeExclusions = exclusions.filter((item) => item.expiresAt > Date.now());
  const [showAndroidDownload, setShowAndroidDownload] = useState(false); const [hintsReset, setHintsReset] = useState(false);
  useEffect(() => { setShowAndroidDownload(!isRunningInNativeApp()); }, []);
  function showHintsAgain() { resetHints(); setHintsReset(true); window.setTimeout(() => setHintsReset(false), 1800); }

  return <main className="px-4 pt-6 pb-8">
    <p className="text-xs tracking-kicker text-subtle uppercase">Your usual</p><h1 className="font-display mt-1 text-4xl text-fg">Settings</h1><p className="mt-2 text-sm text-muted">Preferences, favorites, exclusions, and history are saved locally on this device unless a feature clearly says otherwise.</p>
    <section className="mt-6"><h2 className="text-sm text-muted">Appearance</h2><div className="mt-3 grid grid-cols-2 gap-3"><ThemeChoice id="dark" label="Dark" hint="Charcoal and burnt orange" icon={Moon} active={theme === "dark"} onSelect={setTheme}/><ThemeChoice id="light" label="Light" hint="Paper white and cyan" icon={Sun} active={theme === "light"} onSelect={setTheme}/></div></section>
    <section className="mt-8"><h2 className="text-sm text-muted">Hints</h2><div className="mt-3 rounded-xl bg-surface p-4 shadow-border"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Sparkles className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium text-fg">Quick app tour</p><p className="mt-1 text-xs leading-relaxed text-subtle">The quick tour appears once when Pick For Us opens, not every time you switch tabs. Reset it whenever you want to see it again.</p></div></div><Button type="button" className="mt-4 w-full ring-2 ring-accent/35 shadow-lg shadow-accent/30 transition hover:shadow-xl hover:shadow-accent/40" onClick={showHintsAgain}><Sparkles className="size-4" />{hintsReset ? "Hint ready" : "Show hint again"}</Button></div></section>
    {showAndroidDownload ? <section className="mt-8"><h2 className="text-sm text-muted">Pick For Us app</h2><div className="mt-3 rounded-xl bg-surface p-4 shadow-border"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Smartphone className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium text-fg">Get the Android app</p><p className="mt-1 text-xs leading-relaxed text-subtle">Pick For Us for Android connects to the same live discovery experience.</p></div></div><p className="mt-4 text-sm text-muted">The Google Play release is being prepared. A download will appear here when it is ready.</p></div></section> : null}
    <section className="mt-8 space-y-3"><ToggleRow title="Include unknown prices" description="Keep restaurants that don't publish a price range" checked={filters.includeUnknownPrice} onCheckedChange={(checked) => setFilters({ includeUnknownPrice: checked })}/><ToggleRow title="Never recommend 1-star places" description="Skip anywhere we rated never again" checked={filters.neverRecommendOneStar} onCheckedChange={(checked) => setFilters({ neverRecommendOneStar: checked })}/><ToggleRow title="Stretch radius if needed" description="If nothing matches, look a little farther" checked={filters.stretchRadius} onCheckedChange={(checked) => setFilters({ stretchRadius: checked })}/></section>
    <section className="mt-8"><h2 className="text-sm text-muted">Not tonight</h2>{activeExclusions.length === 0 ? <p className="mt-2 text-sm text-subtle">Nothing is parked for later. Rejected picks clear tomorrow.</p> : <ul className="mt-3 space-y-2">{activeExclusions.map((item) => <li key={item.restaurantId} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 shadow-border"><span className="text-sm text-fg">{item.name}</span><Button size="sm" variant="ghost" onClick={() => clearExclusion(item.restaurantId)}>Restore</Button></li>)}</ul>}{activeExclusions.length > 0 ? <Button className="mt-3" variant="outline" onClick={clearExclusions}>Clear all exclusions</Button> : null}</section>
    <section className="mt-8" aria-labelledby="legal-heading">
      <h2 id="legal-heading" className="text-sm text-muted">Legal &amp; Privacy</h2>
      <div className="mt-3 space-y-2 rounded-xl bg-surface p-4 shadow-border">
        <Link to="/privacy" className="flex min-h-11 items-center rounded-md text-sm font-medium text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Privacy Policy</Link>
        <Link to="/terms" className="flex min-h-11 items-center rounded-md text-sm font-medium text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Terms &amp; Conditions</Link>
        <p className="text-xs leading-relaxed text-muted">Read how discovery works, how information is handled, and the choices available to you. {publicationLabel(history.current)}</p>
      </div>
    </section>
    <section className="mt-8" aria-labelledby="support-heading">
      <h2 id="support-heading" className="text-sm text-muted">Support</h2>
      <div className="mt-3 space-y-3 rounded-xl bg-surface p-4 shadow-border">
        <p className="text-sm text-fg">Caustic Relay / Pick For Us</p>
        <Button asChild variant="secondary" className="w-full"><a href={SUPPORT_MAILTO}>Contact Support</a></Button>
        <p className="text-xs leading-relaxed text-muted">Opens your email app. If nothing opens, copy the address below into your email service. No Pick For Us account is needed.</p>
        <p className="select-text break-all text-sm text-fg">{SUPPORT_EMAIL}</p>
        <p className="text-xs leading-relaxed text-muted">For support or privacy requests. Please do not email passwords, payment details, or other sensitive information.</p>
      </div>
    </section>
    <section className="mt-8 space-y-3" aria-labelledby="data-heading">
      <h2 id="data-heading" className="text-sm text-muted">Data on this device</h2>
      <p className="text-xs leading-relaxed text-muted">Reset filters restores Dinner and Date Night filters. Clear favorites and history also removes ratings, visits, exclusions and shown-pick history, and resets filters, the selected mode and the seasonal toggle.</p>
      <Button variant="secondary" className="w-full" onClick={resetFilters}>Reset filters</Button>
      <Button variant="danger" className="w-full" onClick={resetAllData}>Clear favorites and history</Button>
      <p className="text-xs leading-relaxed text-muted">Your saved search location, appearance and tour preference stay on this device. These controls do not delete support emails or information held by hosting, analytics or other services. See the Privacy Policy for storage and deletion details.</p>
    </section>
    <section className="mt-8 border-t border-border pt-4" aria-label="About Pick For Us"><p className="text-xs text-muted">Pick For Us · By Caustic Relay</p></section>
  </main>;
}

function ThemeChoice({ id, label, hint, icon: Icon, active, onSelect }: { id: ThemeId; label: string; hint: string; icon: typeof Moon; active: boolean; onSelect: (theme: ThemeId) => void; }) {
  return <button type="button" aria-pressed={active} onClick={() => onSelect(id)} className={cn("rounded-xl p-1 text-left transition-[box-shadow,transform] duration-150 ease-out active:scale-[0.98]", active ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : "")}><span className="theme-swatch flex h-20 items-end justify-between rounded-lg px-3 py-3" data-swatch={id}>{active ? <Check className="size-4" strokeWidth={2.5} /> : <Icon className="size-4 opacity-80" />}<span className="theme-swatch-accent size-6 rounded-full" /></span><span className="mt-2 block px-1 text-sm text-fg">{label}</span><span className="mt-0.5 block px-1 text-xs text-subtle">{hint}</span></button>;
}
function ToggleRow({ title, description, checked, onCheckedChange }: { title: string; description: string; checked: boolean; onCheckedChange: (checked: boolean) => void; }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl bg-surface px-4 py-3 shadow-border"><div><p className="text-sm text-fg">{title}</p><p className="text-xs text-subtle">{description}</p></div><Switch aria-label={title} checked={checked} onCheckedChange={onCheckedChange} /></div>;
}
