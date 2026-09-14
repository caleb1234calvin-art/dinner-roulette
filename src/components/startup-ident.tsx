import { useEffect, useState } from "react";

const STARTUP_IDENT_SRC = "/brand/CAUSTIC_RELAY_ident-2.mp4";

export function StartupIdent() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white pointer-events-none"
    >
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        src={STARTUP_IDENT_SRC}
        onEnded={() => setVisible(false)}
        onError={() => setVisible(false)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
