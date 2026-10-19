import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Clock3, Heart, Settings, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { applyTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store";

import { PageFooter } from "@/components/page-footer";
import { LegalChangeNotice } from "@/components/legal-change-notice";

const NAV = [
  { to: "/", label: "Pick", icon: UtensilsCrossed },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/history", label: "History", icon: Clock3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    // Zustand omits its persistence API when browser storage is unavailable.
    void useAppStore.persist?.rehydrate();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
        <div className="flex flex-1 flex-col" style={{ paddingBottom: `calc(${pathname === "/" ? "16rem" : "5rem"} + env(safe-area-inset-bottom, 0px))` }}>
          <LegalChangeNotice />
          {children}
          <div className="mt-auto px-4"><PageFooter pathname={pathname} /></div>
        </div>
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-bg/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
          aria-label="Main"
        >
          <div className="mx-auto grid max-w-lg grid-cols-4">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide",
                    active ? "text-fg" : "text-subtle",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
