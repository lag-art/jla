import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
import Button from "../common/Button";
import ImagePlaceholder from "../common/ImagePlaceholder";
import heroImage from "../../assets/images/image1.jpg";
import { ctaLink } from "../../data/navLinks";
import ROUTES from "../../routes/routePaths";

// home / HeroSection
// The homepage's above-the-fold section — renders the page's single <h1>.
//
// TWO IMPORTS, TWO NAMES — don't collapse them
// `ImagePlaceholder` is a COMPONENT; `heroImage` is a STRING URL produced
// by Vite. Naming the image import `ImagePlaceholder` shadows the
// component, and since JSX treats any capitalised tag as a component,
// <ImagePlaceholder /> then calls
// document.createElement("/src/assets/images/image1.jpg") and throws
// InvalidCharacterError. If this section crashes on load, check these
// two lines first.
//
// VIEWPORT HEIGHT — svh, not dvh, and this matters
// `dvh` tracks the viewport as a mobile browser's URL bar hides and
// reappears, which means a dvh-sized hero RESIZES while you scroll it —
// the headline shifts under your eyes on the first swipe. `svh` is the
// small (bar-visible) height: slightly shorter, but stable. For a hero
// that's the first thing on screen, stability beats reclaiming 60px.
//
// SHORT VIEWPORTS — the case most heroes get wrong
// A phone in landscape is roughly 375px tall. Full height minus the nav,
// plus 7rem of vertical padding, plus an absolutely-positioned scroll
// chevron, and the content overflows into the chevron. So below 640px of
// height the padding collapses, the section stops forcing full height,
// and the chevron hides entirely — it's a cue to scroll, and on a screen
// this short the content already visibly overflows, which is the same cue.
//
// Other heuristics:
//   - Height is measured live from --sticky-nav-offset (published by
//     MainLayout), so this stays correct across breakpoints without
//     hardcoding a guessed nav height.
//   - The image is `priority` — the one image on the site where
//     lazy-loading would be actively wrong.
//   - object-position: top, because a 16:9 photo cropped into a tall
//     portrait viewport centre-crops by default, which is how heroes end
//     up cutting off the heads of the people in them.
//   - Gradient + vignette sit between image and text permanently, so
//     legibility never depends on the photo being dark enough. Swapping
//     photography later can't break the headline.
//   - The chevron scrolls to whatever element actually follows this one
//     (nextElementSibling), not a hardcoded offset — correct even if
//     HomePage's section order changes.
//   - Secondary CTA is styled locally rather than <Button
//     variant="secondary">, which assumes a light background and would be
//     nearly invisible here. Flagged rather than shipped broken.
//   - Entrance animation staggers eyebrow -> headline -> subhead -> CTAs,
//     and respects prefers-reduced-motion.

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
      className="relative isolate flex items-center overflow-hidden bg-(--jla-navy-950) text-white
                 min-h-[calc(100svh-var(--sticky-nav-offset,5rem))]
                 [@media(max-height:640px)]:min-h-0"
    >
      {/* Background — priority-loaded, top-anchored, permanently overlaid */}
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          src={heroImage}
          ratio="16/9"
          rounded="none"
          fit="cover"
          position="top"
          priority
          alt=""
          className="w-full h-full"
        />
        {/* Vertical gradient carries the headline */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/85 to-(--jla-navy-950)/50"
        />
        {/* Horizontal wash — keeps the left-aligned text legible on wide
            screens where the vertical gradient alone thins out */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-(--jla-navy-950)/80 via-(--jla-navy-950)/30 to-transparent"
        />
      </div>

      <motion.div
        {...container}
        className="relative w-full max-w-(--container-max) mx-auto px-(--container-padding)
                   py-20 sm:py-28 lg:py-32 pb-28 sm:pb-32
                   [@media(max-height:640px)]:py-12 [@media(max-height:640px)]:pb-12
                   flex flex-col items-start gap-5 sm:gap-7"
      >
        <motion.span
          {...item}
          className="inline-flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) border border-(--jla-gold)/60 rounded-full px-3.5 py-1.5"
        >
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-(--jla-gold) motion-safe:animate-pulse"
          />
          Juris Leadership Alliance
        </motion.span>

        <motion.h1
          {...item}
          className="font-(family-name:--font-display) font-semibold leading-[1.08] text-balance
                     text-[clamp(2rem,1.2rem+3.6vw,4.5rem)] max-w-3xl"
        >
          Principled Leadership,{" "}
          <span className="text-(--jla-gold)">Grounded in Law.</span>
        </motion.h1>

        <motion.p
          {...item}
          className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl text-pretty"
        >
          We equip a new generation of leaders with the integrity, discipline, and
          legal literacy to serve justly — and to hold power accountable.
        </motion.p>

        {/* Buttons go full-width on the narrowest phones — two half-width
            controls side by side leaves neither a comfortable tap target */}
        <motion.div
          {...item}
          className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto"
        >
          <Button
            to={ctaLink.path}
            variant="primary"
            size="lg"
            iconRight={FaArrowRight}
            className="justify-center w-full sm:w-auto"
          >
            {ctaLink.label}
          </Button>

          {/* Locally styled — see file header note on Button's variants */}
          <Link
            to={ROUTES.ABOUT}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-semibold uppercase tracking-wide text-white border border-white/40 rounded-sm px-7 py-3.5 hover:bg-white hover:text-(--jla-navy-950) hover:border-white transition-colors duration-200"
          >
            Our Mission
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue — hidden on short viewports, where it would collide
          with the content it's meant to sit below */}
      <motion.button
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: [0, 8, 0] }}
        transition={
          shouldReduceMotion
            ? {}
            : { opacity: { delay: 0.8 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }
        }
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2
                   flex items-center justify-center w-11 h-11 rounded-full
                   border border-white/30 text-white/80
                   hover:text-(--jla-gold) hover:border-(--jla-gold)
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold)
                   transition-colors duration-200
                   [@media(max-height:640px)]:hidden"
      >
        <FaChevronDown aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default HeroSection;