import useScrollToTop from "../../hooks/useScrollToTop";

// common / ScrollToTop
// Renders nothing — just resets scroll position on every route change.
// Mounted once inside layouts/MainLayout.jsx.

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export default ScrollToTop;
