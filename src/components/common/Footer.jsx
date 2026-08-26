import React from "react";
import { NavLink } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa6";
import { footerColumns, contactInfo } from "../../data/footerLinks";
import SocialLinks from "./SocialLinks";

// common / Footer
// Renders on every page via MainLayout. Sourced entirely from
// data/footerLinks.js — adding/renaming a link, column, or contact detail
// never requires touching this component.
//
// Heuristics baked in:
//   - Columns are generated from footerColumns, not hardcoded per-column
//     JSX — a 4th column or a renamed link is a data-file edit, not a
//     component edit.
//   - Link items use NavLink (not Link) so a footer link to the page the
//     visitor is already on gets the same gold active-state treatment the
//     Navbar uses — one visual language for "you are here" site-wide.
//   - Copyright year is computed at render (`new Date().getFullYear()`),
//     never hardcoded — this file will never need an annual edit.
//   - "Back to top" only makes sense once you've actually scrolled the
//     page, so it appears with a scroll-position check rather than always
//     being present and mostly useless near the top of a page.
//   - Scroll-reveal on first view respects prefers-reduced-motion.

const Footer = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <motion.footer className="bg-(--jla-navy-950) text-white" {...reveal}>
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) pt-14 sm:pt-16 pb-8">
        {/* Brand + columns + contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <NavLink to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/brand/logo-juris.jpeg"
                alt="Juris Leadership Alliance seal"
                className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-(--jla-gold) bg-white shrink-0"
              />
              <span className="font-(family-name:--font-display) font-semibold text-lg leading-tight">
                Juris Leadership Alliance
              </span>
            </NavLink>
            <p className="text-sm text-(--jla-navy-100)/75 leading-relaxed max-w-xs mb-6">
              Advancing principled, accountable leadership grounded in the rule of law.
            </p>
            <SocialLinks tone="dark" />
          </div>

          {/* Data-driven link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs tracking-widest uppercase text-(--jla-gold) mb-4 pb-2 border-b border-white/10">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((item) => (
                  <li key={`${col.title}-${item.label}`}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `text-sm transition-colors duration-150 ${
                          isActive
                            ? "text-(--jla-gold)"
                            : "text-(--jla-navy-100)/75 hover:text-(--jla-gold)"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-(--jla-gold) mb-4 pb-2 border-b border-white/10">
              Find Us
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-(--jla-navy-100)/75">
              <li>{contactInfo.addressLine1}</li>
              <li>{contactInfo.addressLine2}</li>
              <li>
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:text-(--jla-gold) transition-colors duration-150">
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-(--jla-gold) transition-colors duration-150 break-all">
                  {contactInfo.email}
                </a>
              </li>
              <li className="pt-1 text-xs text-(--jla-navy-100)/50">{contactInfo.hours}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 sm:mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-(--jla-navy-100)/60 order-2 sm:order-1 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {contactInfo.orgName}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="order-1 sm:order-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--jla-navy-100)/75 hover:text-(--jla-gold) transition-colors duration-150"
            aria-label="Back to top"
          >
            Back to top
            <span className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20">
              <FaArrowUp aria-hidden="true" className="text-[11px]" />
            </span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;