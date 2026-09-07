import { AlertTriangle, CloudOff, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DiscoveryNotice({
  tone,
  title,
  body,
}: {
  tone: "fallback" | "error";
  title: string;
  body: string;
}) {
  const Icon = tone === "fallback" ? CloudOff : AlertTriangle;
  return (
    <div
      className={cn(
        "mt-5 flex items-start gap-3 rounded-xl border p-4",
        tone === "fallback"
          ? "border-accent/20 bg-accent/5 text-muted"
          : "border-danger/25 bg-danger/5 text-muted",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", tone === "fallback" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger")}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-fg">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-subtle">{body}</p>
      </div>
    </div>
  );
}

export function DiscoveryLoading({ label }: { label: string }) {
  return (
    <div className="mt-5 rounded-xl bg-surface p-4 shadow-border" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated text-accent">
          <LoaderCircle className="size-4 animate-spin" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-fg">{label}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
            <div className="h-full w-2/5 animate-pulse rounded-full bg-accent/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
