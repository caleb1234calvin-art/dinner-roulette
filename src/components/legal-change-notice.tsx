import { useEffect, useState } from "react";
import history from "@/lib/legal/history.json";
import {
  LEGAL_NOTICE_STORAGE_KEY,
  materialNotice,
  publicationLabel,
  type LegalRelease,
} from "@/lib/legal/releases";

export function LegalChangeNotice({ release = history.current }: { release?: LegalRelease } = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let dismissed = null;
    try {
      dismissed = localStorage.getItem(LEGAL_NOTICE_STORAGE_KEY);
    } catch {
      /* Notice remains available when storage is blocked. */
    }
    setVisible(materialNotice(release, dismissed));
  }, [release]);
  if (!visible) return null;
  return (
    <aside
      aria-label="Legal updates"
      className="m-4 rounded-xl border border-border bg-surface p-4 text-sm text-fg"
    >
      <h2 className="font-medium">Privacy and terms updated: version {release.version}</h2>
      <p className="mt-2">{publicationLabel(release)}</p>
      <ul className="mt-2 list-disc pl-5">
        {release.summary.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2">
        <a className="underline inline-flex min-h-11 items-center" href="/privacy#version-history">
          Privacy policy and history
        </a>
        {" · "}
        <a className="underline inline-flex min-h-11 items-center" href="/terms#version-history">
          Terms and history
        </a>
      </p>
      <p className="mt-2">
        This notice is informational. Dismissing it does not give agreement or consent.
      </p>
      <button
        type="button"
        className="mt-2 min-h-11 rounded-md border border-border px-3"
        onClick={() => {
          try {
            localStorage.setItem(LEGAL_NOTICE_STORAGE_KEY, release.version);
          } catch {
            /* Dismiss for this visit; try again on a later visit. */
          }
          setVisible(false);
        }}
      >
        Dismiss notice
      </button>
    </aside>
  );
}
