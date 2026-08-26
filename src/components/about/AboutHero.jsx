import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa6";
import ImagePlaceholder from "../common/ImagePlaceholder";
import ROUTES from "../../routes/routePaths";

// about / AboutHero
// The About page's own hero — renders this page's single <h1>.
//
// Heuristics baked in:
//   - Deliberately NOT a full 100dvh hero like home/HeroSection.jsx. Every
//     interior page opening with a full-viewport immersive hero would
//     make the whole site feel like a chain of homepages rather than one
//     site with a clear landing page. A shorter, banner-style hero
//     (min-height, not min-viewport-height) signals "you're now inside
//     the site" instead of "you just landed."
//   - No scroll-cue arrow (unlike the home hero) — that affordance exists
//     specifically because HeroSection fills the whole screen and a
//     visitor might not realize there's more below. A banner hero already
//     shows page content peeking below it, so the same affordance here
//     would be redundant.
//   - Breadcrumb (Home / About) is built inline rather than as a shared
//     component yet — this is the first interior-page hero built. Once a
//     second one (LeadershipHero, ResourcesHero, etc.) needs the same
//     pattern, it should be extracted into common/Breadcrumb.jsx rather
//     than copy-pasted a second time.
//   - Headline reuses the exact tagline already established in
//     AboutPreview.jsx ("Where Law Meets Leadership") rather than
//     inventing new wording — repeating a brand tagline verbatim across
//     touchpoints (nav preview -> full page) reinforces recognition;
//     paraphrasing it differently in each place would dilute it.
//   - Lead paragraph is a real excerpt from the org's own provided
//     "Our Movement" copy, not newly invented text.

const AboutHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white min-h-80 sm:min-h-95 lg:min-h-110 flex items-end">
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          variant={4}
          ratio="21/9"
          rounded="none"
          priority
          alt="Juris Leadership Alliance — About"
          className="w-full h-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/80 to-(--jla-navy-950)/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[22px_22px]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative max-w-(--container-max) mx-auto px-(--container-padding) pt-20 pb-10 sm:pb-12 lg:pb-14 w-full"
      >
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs font-medium text-white/60">
            <li>
              <Link to={ROUTES.HOME} className="hover:text-(--jla-gold) transition-colors duration-150">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <FaChevronRight className="text-[9px]" />
            </li>
            <li aria-current="page" className="text-(--jla-gold)">
              About
            </li>
          </ol>
        </nav>

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          About Juris Leadership Alliance
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          Where Law Meets Leadership
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl">
          A dynamic movement dedicated to shaping a new generation of
          principled legal minds — rooted in justice, integrity, and
          transformative leadership.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutHero;