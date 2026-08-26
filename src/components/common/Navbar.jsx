import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaBars, FaXmark, FaChevronDown } from "react-icons/fa6";
import navLinks, { ctaLink } from "../../data/navLinks";
import Button from "./Button";

// common / Navbar
// Fully routed primary navigation — renders on every page via MainLayout.
//
// Heuristics baked in:
//   - Auto-closes the mobile menu and any open dropdown on every route
//     change, via useLocation — without this, navigating from a mobile
//     menu link leaves the overlay open behind the new page.
//   - Auto-closes the Resources dropdown on outside click AND Escape,
//     tracked with a single ref rather than one listener per interaction.
//   - Scroll-aware shadow: a flat 0-to-1 toggle would look identical to a
//     static navbar; this fades a border/shadow in past a small threshold
//     so the bar visibly "lifts" off the page content once you scroll,
//     without needing every page to coordinate a transparent hero behind it.
//   - Body scroll lock while the mobile panel is open, matching the same
//     pattern used in Modal.jsx, so the page doesn't scroll behind it.
//   - Logo image is object-position: top so the seal's mark stays visible
//     even when cropped into a small circular badge — the wordmark text
//     baked into the bottom of the source image is intentionally cropped
//     out here since the adjacent text label already carries that role.
//   - All motion respects prefers-reduced-motion.

const Navbar = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll-aware shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Escape closes dropdown + mobile panel
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Body scroll lock while mobile menu is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const linkBase =
    "text-sm font-semibold uppercase tracking-wide transition-colors duration-200";
  const linkClasses = ({ isActive }) =>
    `${linkBase} ${isActive ? "text-(--jla-gold)" : "text-white/85 hover:text-(--jla-gold)"}`;

  return (
    <header
      className={`sticky top-0 z-(--z-sticky-nav) bg-(--jla-navy-950) transition-shadow duration-300 ${
        isScrolled ? "shadow-(--shadow-md)" : "shadow-none"
      }`}
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) flex items-center justify-between h-16 sm:h-20">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <img
            src="/brand/logo-juris.jpeg"
            alt="Juris Leadership Alliance seal"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover object-top ring-2 ring-(--jla-gold) bg-white"
          />
          <span className="font-(family-name:--font-display) font-semibold text-white leading-tight">
            <span className="hidden sm:inline text-base lg:text-lg">
              Juris Leadership Alliance
            </span>
            <span className="sm:hidden text-lg">JLA</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.children ? (
              <div className="relative" ref={dropdownRef} key={link.path}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  className={`flex items-center gap-1.5 ${linkBase} ${
                    location.pathname.startsWith(link.path)
                      ? "text-(--jla-gold)"
                      : "text-white/85 hover:text-(--jla-gold)"
                  }`}
                >
                  {link.label}
                  <FaChevronDown
                    aria-hidden="true"
                    className={`text-[10px] transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full mt-3 w-64 bg-white rounded-md shadow-(--shadow-lg) border border-(--jla-line) py-2 z-(--z-dropdown)"
                    >
                      {link.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors duration-150 ${
                                isActive
                                  ? "text-(--jla-gold-600) bg-(--jla-navy-100)"
                                  : "text-(--jla-ink) hover:bg-(--jla-navy-100) hover:text-(--jla-gold-600)"
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink key={link.path} to={link.path} end={link.path === "/"} className={linkClasses}>
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button to={ctaLink.path} variant="primary" size="sm">
            {ctaLink.label}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-white"
        >
          {mobileOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-(--jla-navy-950) border-t border-white/10"
          >
            <ul className="flex flex-col px-(--container-padding) py-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  {link.children ? (
                    <details className="group">
                      <summary
                        className={`flex items-center justify-between py-3 cursor-pointer list-none ${linkBase} ${
                          location.pathname.startsWith(link.path)
                            ? "text-(--jla-gold)"
                            : "text-white/85"
                        }`}
                      >
                        {link.label}
                        <FaChevronDown
                          aria-hidden="true"
                          className="text-[10px] transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <ul className="pl-4 pb-2 flex flex-col gap-1">
                        {link.children.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `block py-2 text-sm ${
                                  isActive ? "text-(--jla-gold)" : "text-white/70"
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <NavLink
                      to={link.path}
                      end={link.path === "/"}
                      className={({ isActive }) =>
                        `block py-3 ${linkBase} ${isActive ? "text-(--jla-gold)" : "text-white/85"}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            <div className="px-(--container-padding) pb-6 pt-2">
              <Button to={ctaLink.path} variant="primary" fullWidth>
                {ctaLink.label}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;