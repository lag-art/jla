import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaBars, FaXmark, FaChevronDown, FaArrowRight } from "react-icons/fa6";
import navLinks, { ctaLink } from "../../data/navLinks";
import Button from "./Button";

// common / Navbar
// Fully routed primary navigation — renders on every page via MainLayout.
//
// BREAKPOINT: the desktop nav appears at xl (1280px), not lg (1024px).
// With seven items plus a long brand name, lg was too early — the brand
// ran into the first nav item and "Contact Us" overlapped the CTA button.
// The hamburger now stays until there is genuinely room for the full row.
//
// Heuristics baked in:
//   - Auto-closes the mobile menu and any open dropdown on route change,
//     via useLocation — without this, navigating from the mobile menu
//     leaves the overlay open behind the new page.
//   - Dropdown closes on outside click AND Escape.
//   - Scroll-aware shadow so the bar visibly lifts off the page content.
//   - Body scroll lock while the mobile panel is open, matching Modal.jsx.
//   - The Resources dropdown renders `childGroups` (grouped, with status
//     and length per document) when present, falling back to the flat
//     `children` otherwise — so a nav item without groups is unaffected.
//     Both shapes come from data/navLinks.js, which derives them from the
//     document registry rather than hardcoding them here.
//   - Document length is shown in the menu so nobody opens a 7-minute
//     read expecting a summary, and unpublished documents say so up front
//     rather than making someone click through to find out.
//   - All motion respects prefers-reduced-motion.

const Navbar = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) flex items-center justify-between gap-6 h-16 sm:h-20">
        {/* Brand — shrink-0 so nav items can never overlap it */}
        <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <img
            src="/brand/logo-juris.jpeg"
            alt="Juris Leadership Alliance seal"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover object-top ring-2 ring-(--jla-gold) bg-white"
          />
          <span className="font-(family-name:--font-display) font-semibold text-white leading-tight">
            <span className="hidden sm:inline xl:hidden 2xl:inline text-base lg:text-lg">
              Juris Leadership Alliance
            </span>
            {/* At xl the full row is tight, so the brand abbreviates rather
                than pushing nav items into the CTA */}
            <span className="hidden xl:inline 2xl:hidden text-lg">JLA</span>
            <span className="sm:hidden text-lg">JLA</span>
          </span>
        </NavLink>

        {/* Desktop nav — xl and up, see breakpoint note */}
        <nav className="hidden xl:flex items-center gap-6 min-w-0">
          {navLinks.map((link) =>
            link.children || link.childGroups ? (
              <div className="relative" ref={dropdownRef} key={link.path}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  className={`flex items-center gap-1.5 whitespace-nowrap ${linkBase} ${
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
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full mt-3 w-88 bg-white rounded-md shadow-(--shadow-lg) border border-(--jla-line) overflow-hidden z-(--z-dropdown)"
                    >
                      {(link.childGroups || [{ label: null, items: link.children }]).map(
                        (group, gi) => (
                          <div
                            key={group.label || gi}
                            className={gi > 0 ? "border-t border-(--jla-line)" : ""}
                          >
                            {group.label && (
                              <p className="px-4 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/60">
                                {group.label}
                              </p>
                            )}

                            <ul className="pb-2">
                              {group.items.map((child) => {
                                const isPending = child.status === "pending";

                                return (
                                  <li key={child.path}>
                                    <NavLink
                                      to={child.path}
                                      className={({ isActive }) =>
                                        `group/item flex items-start justify-between gap-3 px-4 py-2.5 transition-colors duration-150 ${
                                          isActive
                                            ? "bg-(--jla-navy-100) text-(--jla-gold-600)"
                                            : "text-(--jla-ink) hover:bg-(--jla-navy-100)"
                                        }`
                                      }
                                    >
                                      <span className="min-w-0">
                                        <span
                                          className={`block text-sm leading-snug ${
                                            isPending ? "text-(--jla-slate)" : "font-medium"
                                          }`}
                                        >
                                          {child.label}
                                        </span>

                                        {child.meta && (
                                          <span className="block mt-0.5 font-mono text-[10px] text-(--jla-slate)/70">
                                            {child.meta.sections}{" "}
                                            {(child.sectionLabel || "section").toLowerCase()}s
                                            {" · "}~{child.meta.readMinutes} min
                                          </span>
                                        )}

                                        {isPending && (
                                          <span className="block mt-0.5 font-mono text-[10px] uppercase tracking-wide text-(--jla-slate)/60">
                                            Not yet published
                                          </span>
                                        )}
                                      </span>

                                      <FaArrowRight
                                        aria-hidden="true"
                                        className="mt-1 shrink-0 text-[9px] text-(--jla-gold-600) opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                                      />
                                    </NavLink>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )
                      )}

                      <NavLink
                        to={link.path}
                        className="flex items-center justify-between gap-2 px-4 py-3 bg-(--jla-paper) border-t border-(--jla-line) text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
                      >
                        All resources
                        <FaArrowRight aria-hidden="true" className="text-[9px]" />
                      </NavLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) => `${linkClasses({ isActive })} whitespace-nowrap`}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden xl:block shrink-0">
          <Button to={ctaLink.path} variant="primary" size="sm">
            {ctaLink.label}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="xl:hidden flex items-center justify-center w-10 h-10 text-white shrink-0"
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
            className="xl:hidden overflow-hidden bg-(--jla-navy-950) border-t border-white/10 max-h-[75dvh] overflow-y-auto"
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
                              {child.status === "pending" && (
                                <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-white/40">
                                  Not yet published
                                </span>
                              )}
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