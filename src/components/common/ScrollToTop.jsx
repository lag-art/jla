import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// useScrollToTop
// Scrolls to the top on route change. Consumed by common/ScrollToTop.jsx,
// mounted once in layouts/MainLayout.jsx.
//
// WHY THE HASH CHECK EXISTS
// A link like /resources#gender-policy changes the pathname AND carries an
// anchor. Without the guard below, both this hook and the target section's
// own scroll-into-view fire on the same navigation — and because child
// effects run before parent effects in React, the section scrolls first and
// this hook then yanks the page back to the top. The anchor would appear to
// work when clicked from the same page (pathname unchanged, so this never
// fires) and silently fail when clicked from another page, which is a
// miserable bug to track down.
// When a hash is present, whatever owns that anchor is responsible for
// positioning; this hook stays out of the way.

const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // anchor navigation — see note above
    window.scrollTo(0, 0);
  }, [pathname, hash]);
};

export default useScrollToTop;