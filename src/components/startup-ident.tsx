import { useEffect, useState } from "react";

const STARTUP_IDENT_SRC = "/brand/CAUSTIC_RELAY_ident-2.mp4";

const BROADCAST_BARS =
  "linear-gradient(to right, #f4f4f4 0 14.285%, #e8e800 14.285% 28.57%, #00caca 28.57% 42.855%, #00c900 42.855% 57.14%, #cf00aa 57.14% 71.425%, #d80000 71.425% 85.71%, #0808cf 85.71% 100%)";

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-75"
        style={{ backgroundImage: BROADCAST_BARS }}
      />
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        src={STARTUP_IDENT_SRC}
        onEnded={() => setVisible(false)}
        onError={() => setVisible(false)}
        className="relative z-10 h-full w-full object-contain"
      />
    </div>
  );
}
