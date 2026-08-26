import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// common / Loader
// Suspense fallback for every lazy-loaded route in routes/AppRoutes.jsx.
// Because the Suspense boundary currently wraps the whole <Routes> tree
// (not just <Outlet />), this renders as the ENTIRE page during a route
// chunk load — so it fills the full viewport rather than sitting inside
// existing chrome. See note at the bottom of this file.
//
// Heuristics baked in:
//   - Delayed appearance: on fast connections/cached chunks, Suspense can
//     resolve in under 100ms. Showing a spinner for that split second reads
//     as a flicker, not feedback. This waits ~180ms before rendering
//     anything visible — genuinely slow loads still get instant-feeling
//     feedback, instant loads show nothing at all.
//   - aria-live region is always present regardless of the visual delay,
//     so screen readers get an honest "loading" announcement immediately
//     even while nothing is shown on screen yet.
//   - min-h-dvh (dynamic viewport height) instead of min-h-screen — on
//     mobile browsers, vh doesn't account for the address bar showing/
//     hiding, which causes the loader to visibly jump. dvh doesn't.
//   - Motion auto-disables under prefers-reduced-motion, falling back to
//     a static (non-pulsing) mark rather than nothing, so there's still
//     a visible loading cue.

const APPEAR_DELAY_MS = 180;

const Loader = () => {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="min-h-dvh w-full flex flex-col items-center justify-center gap-4 bg-(--jla-paper) px-6"
    >
      {visible && (
        <>
          <motion.span
            aria-hidden="true"
            className="block w-3 h-3 sm:w-3.5 sm:h-3.5 bg-(--jla-gold) rounded-xs rotate-45"
            animate={
              shouldReduceMotion
                ? { opacity: 0.7 }
                : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.05, 0.9] }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.15em] uppercase text-(--jla-slate)">
            Loading
          </span>
        </>
      )}
      <span className="sr-only">Loading Juris Leadership Alliance…</span>
    </div>
  );
};

export default Loader;

// ---------------------------------------------------------------------
// Follow-up worth doing: move the <Suspense> boundary in routes/AppRoutes.jsx
// so it wraps only <Outlet /> inside layouts/MainLayout.jsx, rather than
// wrapping the whole <Routes> tree. That keeps Navbar/Footer mounted and
// visible during in-app navigation — only first paint (or a hard refresh
// on a deep link) would show this full-screen version. Say the word and
// I'll make that change next.
// ---------------------------------------------------------------------