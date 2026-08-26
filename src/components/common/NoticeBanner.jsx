import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaBullhorn, FaXmark, FaArrowRight } from "react-icons/fa6";
import { notices } from "../../data/notices";
import CountdownTimer from "./CountdownTimer";

// common / NoticeBanner
// Site-wide announcement strip, mounted once in layouts/MainLayout.jsx
// above the Navbar. Renders null when there's nothing to say — MainLayout
// never needs to know whether a notice exists.
//
// Heuristics, kept deliberately minimal:
//   - Picks the first notice from data/notices.js inside its
//     startsAt/endsAt window that hasn't been dismissed. Publishing or
//     retiring a notice is a data-file edit, not a component edit.
//   - Dismissal is remembered per-notice `id` in localStorage, read
//     defensively so a locked-down browser (Safari private mode, etc.)
//     degrades to "just doesn't persist" instead of crashing the banner.
//   - Message WRAPS on mobile rather than truncating. An announcement
//     whose text is cut off mid-sentence on the most common screen size
//     has failed at the one job it has — better a two-line banner than a
//     half-read one.
//   - Countdown shows on every breakpoint, not just desktop: "how long
//     do I have" is the most actionable part of a deadline notice, so
//     hiding it on mobile removes the reason to act.
//   - All decorative motion (sheen sweep, icon tilt, CTA arrow nudge) is
//     gated behind prefers-reduced-motion and is purely visual — no
//     information is conveyed by movement alone.

const STORAGE_KEY = "jla-dismissed-notices";

const getDismissed = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const findActiveNotice = (dismissedIds) => {
  const now = Date.now();
  return (
    notices.find((n) => {
      if (dismissedIds.includes(n.id)) return false;
      if (n.startsAt && new Date(n.startsAt).getTime() > now) return false;
      if (n.endsAt && new Date(n.endsAt).getTime() < now) return false;
      return true;
    }) || null
  );
};

const NoticeBanner = () => {
  const shouldReduceMotion = useReducedMotion();
  const [notice, setNotice] = useState(() => findActiveNotice(getDismissed()));

  const handleDismiss = () => {
    if (!notice) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...getDismissed(), notice.id])
      );
    } catch {
      // no persistence available — dismissal just won't survive a refresh
    }
    setNotice(null);
  };

  return (
    <AnimatePresence initial={false}>
      {notice && (
        <motion.div
          role="region"
          aria-label="Site announcement"
          initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-linear-to-r from-(--jla-gold-600) via-(--jla-gold) to-(--jla-gold-600) text-(--jla-navy-950)"
        >
          {/* Light sweep across the strip — pure decoration */}
          {!shouldReduceMotion && (
            <motion.span
              aria-hidden="true"
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-white/25 blur-md"
            />
          )}

          {/* Hairline definition against the navy Navbar below */}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-(--jla-navy-950)/15" />

          <div className="relative max-w-(--container-max) mx-auto px-(--container-padding) py-2.5 flex items-center gap-2.5 sm:gap-3.5">
            <motion.span
              aria-hidden="true"
              animate={shouldReduceMotion ? {} : { rotate: [0, -12, 10, -6, 0] }}
              transition={
                shouldReduceMotion
                  ? {}
                  : { duration: 1, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }
              }
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-(--jla-navy-950)/10"
            >
              <FaBullhorn className="text-[11px]" />
            </motion.span>

            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-3">
              {/* Wraps on mobile — never truncated, see header note */}
              <p className="text-[13px] sm:text-sm font-semibold leading-snug">
                {notice.message}
              </p>

              {notice.deadline && (
                <span className="mt-1 sm:mt-0 shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-(--jla-navy-950)/10 px-2.5 py-1">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-(--jla-navy-950)/60 motion-safe:animate-pulse"
                  />
                  <CountdownTimer targetDate={notice.deadline} />
                  <span className="text-[10px] uppercase tracking-wide opacity-70">left</span>
                </span>
              )}
            </div>

            {notice.ctaLabel && notice.ctaPath && (
              <Link
                to={notice.ctaPath}
                className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--jla-navy-950) text-white text-[11px] font-bold uppercase tracking-wide px-4 py-1.5 hover:bg-(--jla-navy-800) transition-colors duration-200"
              >
                {notice.ctaLabel}
                <FaArrowRight
                  aria-hidden="true"
                  className="text-[9px] transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            )}

            <button
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full hover:bg-(--jla-navy-950)/15 hover:rotate-90 transition-all duration-200"
            >
              <FaXmark aria-hidden="true" className="text-xs" />
            </button>
          </div>

          {/* Mobile CTA: full-width tap target under the message */}
          {notice.ctaLabel && notice.ctaPath && (
            <Link
              to={notice.ctaPath}
              className="sm:hidden flex items-center justify-center gap-1.5 bg-(--jla-navy-950)/10 py-2 text-[11px] font-bold uppercase tracking-wide border-t border-(--jla-navy-950)/10"
            >
              {notice.ctaLabel}
              <FaArrowRight aria-hidden="true" className="text-[9px]" />
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoticeBanner;