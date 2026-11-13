import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Keep an Options → Result handoff attached to the original Home trigger,
// rather than to the Choose button that disappears with the old dialog.
const origins = new WeakMap<HTMLElement, HTMLElement>();
const scrollLocks = new WeakMap<HTMLElement, { count: number; overflow: string }>();

function captureOrigin() {
  if (typeof document === "undefined" || typeof HTMLElement === "undefined") return null;
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return null;
  const parent = active.closest<HTMLElement>("[data-christmas-dialog]");
  return parent ? origins.get(parent) ?? active : active;
}

function canFocus(element: HTMLElement) {
  return element.isConnected && !element.matches(":disabled") &&
    !element.closest("[inert], [hidden]") && element.getClientRects().length > 0;
}

function focusableElements(dialog: HTMLDialogElement) {
  return [...dialog.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter(canFocus);
}

/** Native showModal supplies the top layer and makes the rest of the document
 * inert. Keep the existing full-screen, internally scrolling event layout. */
export function ChristmasEventDialog({ children, labelledBy, label, onClose, surface, className }: {
  children: ReactNode;
  onClose: () => void;
  surface?: "result" | "plan";
  className?: string;
} & ({ labelledBy: string; label?: never } | { label: string; labelledBy?: never })) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [origin] = useState(captureOrigin);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (origin) origins.set(dialog, origin);
    const body = document.body;
    const lock = scrollLocks.get(body) ?? { count: 0, overflow: body.style.overflow };
    lock.count += 1;
    scrollLocks.set(body, lock);
    body.style.overflow = "hidden";
    dialog.showModal();
    // Focus the visible close control. Its position is stable even when the
    // event's content changes between a detailed and unavailable presentation.
    (focusableElements(dialog)[0] ?? dialog).focus({ preventScroll: true });
    return () => {
      dialog.close();
      lock.count -= 1;
      if (lock.count === 0) {
        body.style.overflow = lock.overflow;
        scrollLocks.delete(body);
      }
      // A successor dialog owns focus during Options → Result and any nested
      // modal handoff. Do not send it back underneath the active modal.
      if (document.querySelector("dialog[data-christmas-dialog][open]")) return;
      if (origin && canFocus(origin)) {
        origin.focus({ preventScroll: true });
      } else {
        // Eligibility may disable/remove the trigger. Return to the surviving
        // Home region, without re-enabling a control or reviving a selection.
        const home = origin?.closest<HTMLElement>("main") ?? document.querySelector<HTMLElement>("main");
        if (home?.isConnected) {
          const previous = home.getAttribute("tabindex");
          home.setAttribute("tabindex", "-1");
          home.focus({ preventScroll: true });
          if (previous === null) home.removeAttribute("tabindex");
          else home.setAttribute("tabindex", previous);
        }
      }
    };
  }, [origin]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    // A retired option or changed rating panel can remove the focused control.
    // Preserve valid focus; only recover it when the active modal has lost it.
    if (dialog?.open && !dialog.contains(document.activeElement)) {
      (focusableElements(dialog)[0] ?? dialog).focus({ preventScroll: true });
    }
  });

  function containTab(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const items = focusableElements(dialog);
    const first = items[0], last = items.at(-1);
    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
      event.preventDefault();
      first.focus();
    }
  }

  if (typeof document === "undefined") return null;
  return createPortal(<dialog ref={dialogRef} tabIndex={-1} aria-labelledby={labelledBy} aria-label={label} aria-modal="true"
    data-christmas-dialog data-christmas-surface={surface}
    className={cn("christmas-event-surface fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-bg", className)}
    style={{ margin: 0, maxWidth: "none", maxHeight: "none", width: "100%", height: "100dvh", border: 0, padding: 0 }}
    onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={containTab}>
    {children}
  </dialog>, document.body);
}
