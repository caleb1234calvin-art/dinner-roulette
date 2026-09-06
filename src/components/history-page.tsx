import { Clock3 } from "lucide-react";
import { useAppStore } from "@/lib/store";

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

export function HistoryPage() {
  const visits = useAppStore((s) => s.visits);
  const grouped = visits.reduce<Record<string, typeof visits>>((acc, visit) => {
    const key = formatDay(visit.date);
    acc[key] = acc[key] ?? [];
    acc[key].push(visit);
    return acc;
  }, {});

  return (
    <main className="px-4 pt-6 pb-8">
      <p className="text-xs tracking-[0.22em] text-subtle uppercase">Places we chose</p>
      <h1 className="font-display mt-1 text-4xl text-fg">History</h1>
      <p className="mt-2 text-sm text-muted">Recent choices get a quieter chance next time.</p>

      {visits.length === 0 ? (
        <div className="mt-10 rounded-xl bg-surface p-6 text-center shadow-[var(--shadow-border)]">
          <Clock3 className="mx-auto size-8 text-subtle" />
          <p className="mt-3 text-sm text-fg">No choices logged yet</p>
          <p className="mt-1 text-sm text-muted">
            When you settle on a pick, mark We chose this. That keeps the same place from winning every night.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {Object.entries(grouped).map(([day, items]) => (
            <section key={day}>
              <h2 className="text-xs tracking-wide text-subtle uppercase">{day}</h2>
              <ul className="mt-2 space-y-2">
                {items.map((visit) => (
                  <li
                    key={visit.id}
                    className="rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
                  >
                    <p className="text-base text-fg">{visit.restaurantName}</p>
                    <p className="text-sm text-muted">
                      {visit.cuisineLabel}
                      {visit.personalRating ? ` · ${visit.personalRating}/5` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
