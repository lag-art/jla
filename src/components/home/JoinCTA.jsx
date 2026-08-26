import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { ctaLink } from "../../data/navLinks";
import ROUTES from "../../routes/routePaths";

// home / JoinCTA
// Eighth homepage section — the page's single conversion moment, sitting
// between PartnersLogos and ContactPreview.
//
// Heuristics baked in:
//   - Reuses `ctaLink` from data/navLinks.js for both the destination AND
//     the label — the same "Join JLA" text/path used in Navbar and Hero.
//     A conversion CTA that says something different from the nav button
//     that leads to the same place creates a moment of doubt ("wait, is
//     this the same thing?") right when doubt is most costly.
//   - Two CTAs, not one: a bold primary ("Join JLA") and a low-commitment
//     secondary ("Have Questions?" -> Contact). Not every visitor who
//     scrolls this far is ready to commit — funneling the undecided ones
//     to Contact instead of only offering an all-or-nothing button keeps
//     them in the site rather than losing them entirely.
//   - Deliberately NO fabricated urgency or unverifiable claims — no fake
//     countdown, no invented "limited spots," no "free membership" claim
//     that isn't actually confirmed. The copy is aspirational without
//     asserting facts that aren't established.
//   - Primary/secondary buttons are locally styled here, not
//     <Button variant="primary/secondary">, because this section sits on
//     a solid gold background — Button's variants were designed against
//     a white/paper background and this is the THIRD section (after
//     Hero's navy bg) to hit that mismatch. See note at file bottom.
//   - Decorative dot-grid texture is pure CSS (radial-gradient trick, no
//     image asset) at low opacity — adds visual richness to a large flat
//     color block without costing an HTTP request.

const JoinCTA = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-(--jla-gold) to-(--jla-gold-600) text-(--jla-navy-950)">
      {/* Subtle dot-grid texture — pure CSS, no image asset */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[22px_22px]"
      />

      <motion.div
        {...reveal}
        className="relative max-w-2xl mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-24 flex flex-col items-center text-center gap-5"
      >
        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-navy-950)/70">
          Join The Movement
        </span>

        <h2 className="font-(family-name:--font-display) font-semibold leading-tight text-[clamp(1.75rem,1.2rem+2.5vw,3rem)]">
          Every law student has a place here.
        </h2>

        <p className="text-base sm:text-lg leading-relaxed text-(--jla-navy-950)/80 max-w-md">
          Add your voice to a community shaping justice, leadership, and
          academic excellence — one member at a time.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3">
          <Link
            to={ctaLink.path}
            className="inline-flex items-center gap-2 bg-(--jla-navy-950) text-white text-sm font-semibold uppercase tracking-wide rounded-sm px-8 py-4 hover:bg-(--jla-navy-800) transition-colors duration-200"
          >
            {ctaLink.label}
            <FaArrowRight aria-hidden="true" />
          </Link>

          <Link
            to={ROUTES.CONTACT}
            className="text-sm font-semibold text-(--jla-navy-950) border-b border-(--jla-navy-950)/50 hover:border-(--jla-navy-950) transition-colors duration-200"
          >
            Have questions? Contact us
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default JoinCTA;