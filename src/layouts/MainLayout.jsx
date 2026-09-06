import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import NoticeBanner from "../components/common/NoticeBanner";
import ScrollToTop from "../components/common/ScrollToTop";

// layouts / MainLayout
// Persistent shell rendered around every route via <Outlet />
// (see routes/AppRoutes.jsx). Deliberately does NOT wrap Outlet in its
// own <main> — every page in src/pages/*.jsx already renders its own
// top-level <main>, and two <main> landmarks on one page is invalid HTML
// and confuses screen-reader landmark navigation. The #main-content div
// below is a plain scroll/focus target, not a semantic landmark.
//
// Heuristics baked in:
//   - Sticky footer: min-h-dvh + flex-col + flex-1 on the content wrapper
//     means Footer is pinned to the bottom of the viewport on short pages
//     (JoinPage, NotFoundPage) instead of floating mid-screen, while still
//     being pushed down normally on pages with enough content to scroll.
//   - Skip-to-content link: visually hidden until focused (keyboard-only),
//     jumps straight past Navbar's full tab sequence (logo, 7 links,
//     Resources dropdown, CTA) to the actual page content — without this,
//     every single page forces a keyboard user through the entire nav
//     before reaching anything else, on every navigation.
//   - Measures Navbar's real rendered height via ResizeObserver and
//     publishes it as --sticky-nav-offset on the document root. Any
//     component that needs to clear the sticky Navbar (anchor scroll
//     targets, a future "jump to section" nav) reads that one variable
//     instead of every component guessing/hardcoding its own offset that
//     may not match Navbar's actual height on a given breakpoint.

const MainLayout = () => {
  const navWrapperRef = useRef(null);

  useEffect(() => {
    const navEl = navWrapperRef.current;
    if (!navEl) return;

    const setOffset = () => {
      document.documentElement.style.setProperty(
        "--sticky-nav-offset",
        `${navEl.offsetHeight}px`
      );
    };

    setOffset();

    // ResizeObserver catches height changes from responsive breakpoints,
    // font loading, or the mobile menu toggling — not just window resize.
    const observer = new ResizeObserver(setOffset);
    observer.observe(navEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-modal) focus:bg-(--jla-gold) focus:text-(--jla-navy-950) focus:px-4 focus:py-2 focus:rounded-sm focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <NoticeBanner />

      <div ref={navWrapperRef} className="sticky top-0 z-(--z-sticky-nav)">
        <Navbar />
      </div>

      <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;