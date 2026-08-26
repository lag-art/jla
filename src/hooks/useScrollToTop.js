import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// useScrollToTop
// Scrolls the window to the top on every route change.
// Consumed by components/common/ScrollToTop.jsx

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
