import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import aboutHeroImage from "../../assets/images/abouthero.jpg";

// about / AboutHero
// The About page's own hero — renders this page's single <h1>.
//
// TWO IMPORTS, TWO NAMES
// `aboutHeroImage` is a STRING URL from Vite; ImagePlaceholder is a
// COMPONENT. Naming the image import after the component shadows it, and
// since JSX treats any capitalised tag as a component, the render then
// calls document.createElement("/src/assets/images/abouthero.jpg") and
// throws InvalidCharacterError. This has bitten HeroSection and
// AboutPreview already — keep the two names distinct.
//
// BREADCRUMB IS NOW SHARED
// This file used to build its breadcrumb inline, with a note saying to
// extract it once a second interior hero needed the same pattern. Four do
// now (Leadership, Resources, Media, and this one), so it lives in
// common/Breadcrumb.jsx and this renders that. Home is prepended
// automatically and the last item is marked aria-current="page".
//
// BANNER, NOT FULL-VIEWPORT — deliberate
// home/HeroSection fills the screen. If every interior page did too, the
// site would read as a chain of homepages rather than one site with a
// landing page. A fixed banner height signals "you're inside the site
// now". For the same reason there's no scroll-cue arrow here: that
// affordance exists because a full-height hero hides what follows, and a
// banner already shows page content peeking below it.
//
// Other heuristics:
//   - object-position: top. A 21:9 photo cropped into a 320px banner
//     centre-crops by default, which is how banner images end up showing
//     torsos. The text sits at the bottom under the heaviest gradient, so
//     the legible part of the image is its upper band — that's where the
//     subject should be.
//   - Gradients (vertical AND horizontal) sit permanently between image
//     and text, so legibility never depends on the photograph being dark
//     enough. Swapping the photo later can't break the headline.
//   - Short viewports (landscape phones, ~390px tall) drop the banner
//     minimum and compress padding — otherwise the hero eats the whole
//     screen and the page below looks empty.
//   - alt="" on the image: the <h1> beside it already names the
//     organisation, so describing it would announce the same thing twice.
//   - Headline repeats the tagline verbatim from AboutPreview rather than
//     paraphrasing. Repetition across touchpoints builds recognition;
//     three slightly different wordings dilute it.

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
    <section
      className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white flex items-end
                 min-h-80 sm:min-h-95 lg:min-h-110
                 [@media(max-height:640px)]:min-h-64"
    >
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          src={aboutHeroImage}
          ratio="21/9"
          rounded="none"
          fit="cover"
          position="top"
          priority
          alt=""
          className="w-full h-full"
        />

        {/* Vertical: carries the text sitting at the bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/80 to-(--jla-navy-950)/40"
        />
        {/* Horizontal: on wide screens the vertical gradient thins out
            behind left-aligned text — this keeps it readable at 2560px */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-(--jla-navy-950)/75 via-(--jla-navy-950)/25 to-transparent"
        />
        {/* Dot field — the same motif used by Leadership; Resources uses
            ruled lines so it reads as its own place */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[22px_22px]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative w-full max-w-(--container-max) mx-auto px-(--container-padding)
                   pt-20 pb-10 sm:pb-12 lg:pb-14
                   [@media(max-height:640px)]:pt-14 [@media(max-height:640px)]:pb-8"
      >
        <Breadcrumb items={[{ label: "About" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          About Juris Leadership Alliance
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-balance
                       text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          Where Law Meets Leadership
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl text-pretty">
          A dynamic movement dedicated to shaping a new generation of
          principled legal minds — rooted in justice, integrity, and
          transformative leadership.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutHero;