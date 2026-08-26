import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
import Button from "../common/Button";
import ImagePlaceholder from "../common/ImagePlaceholder";
import { ctaLink } from "../../data/navLinks";
import ROUTES from "../../routes/routePaths";

// home / HeroSection
// The homepage's above-the-fold section — renders the page's single <h1>.
//
// Heuristics baked in:
//   - Fills exactly the viewport height remaining below the sticky Navbar,
//     using min-h-[calc(100dvh-var(--sticky-nav-offset))] — that CSS
//     variable is measured live by layouts/MainLayout.jsx, so this stays
//     correct across breakpoints without hardcoding a guessed nav height.
//   - Background image always renders with `priority` — this is the one
//     placeholder image on the entire site where lazy-loading would be
//     actively wrong (it's the very first thing a visitor sees).
//   - A permanent gradient overlay sits between the background image and
//     the text regardless of what image ends up there — so swapping in
//     real photography later can't accidentally make the headline
//     illegible; legibility isn't dependent on the photo being dark enough.
//   - "Scroll to next section" heuristic: the down-chevron doesn't jump a
//     hardcoded pixel amount — it scrolls to whatever DOM element is
//     actually rendered right after Hero (nextElementSibling), so it stays
//     correct even if HomePage.jsx's section order changes later.
//   - Secondary CTA is a locally-styled link, not <Button variant="secondary">
//     — that variant assumes a light background (navy text/border) and
//     would be nearly invisible on this dark hero. Flagging here rather
//     than shipping it broken; Button.jsx should gain a dark-tone variant.
//   - Entrance animation staggers headline -> subhead -> CTAs, respects
//     prefers-reduced-motion (renders instantly, no motion, if set).

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling;
    next?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const container = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        animate: "visible",
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        },
      };

  const item = shouldReduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
        },
      };

  return (
    <section
      ref={sectionRef}
      id="home-hero"
      className="relative isolate flex items-center overflow-hidden bg-(--jla-navy-950) text-white min-h-[calc(100dvh-var(--sticky-nav-offset,5rem))]"
    >
      {/* Background layer — always priority-loaded, always overlaid */}
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          variant={2}
          ratio="16/9"
          rounded="none"
          priority
          alt="Juris Leadership Alliance"
          className="w-full h-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/85 to-(--jla-navy-950)/50"
        />
      </div>

      <motion.div
        {...container}
        className="relative max-w-(--container-max) mx-auto px-(--container-padding) py-28 sm:py-32 flex flex-col items-start gap-6 sm:gap-7"
      >
        <motion.span
          {...item}
          className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) border border-(--jla-gold) rounded-sm px-3 py-1"
        >
          Juris Leadership Alliance
        </motion.span>

        <motion.h1
          {...item}
          className="font-(family-name:--font-display) font-semibold leading-[1.1] text-[clamp(2.25rem,1.3rem+4vw,4.5rem)] max-w-3xl"
        >
          Principled Leadership,{" "}
          <span className="text-(--jla-gold)">Grounded in Law.</span>
        </motion.h1>

        <motion.p
          {...item}
          className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl"
        >
          We equip a new generation of leaders with the integrity, discipline, and
          legal literacy to serve justly — and to hold power accountable.
        </motion.p>

        <motion.div {...item} className="flex flex-wrap items-center gap-4 pt-2">
          <Button to={ctaLink.path} variant="primary" size="lg" iconRight={FaArrowRight}>
            {ctaLink.label}
          </Button>

          {/* Locally styled — see file header note on Button's secondary variant */}
          <Link
            to={ROUTES.ABOUT}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white border border-white/40 rounded-sm px-7 py-3.5 hover:bg-white hover:text-(--jla-navy-950) hover:border-white transition-colors duration-200"
          >
            Our Mission
          </Link>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: [0, 8, 0] }}
        transition={shouldReduceMotion ? {} : { opacity: { delay: 0.8 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white/80 hover:text-(--jla-gold) hover:border-(--jla-gold) transition-colors duration-200"
      >
        <FaChevronDown aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default HeroSection;