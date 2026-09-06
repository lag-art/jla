import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaScaleBalanced,
  FaShieldHalved,
  FaClipboardCheck,
  FaUsers,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import coreValues from "../../data/coreValues";
import logo from "../../assets/images/logo.jpeg";
import ROUTES from "../../routes/routePaths";

// home / AboutPreview
// Second homepage section — a condensed teaser for the About page.
//
// TWO IMPORTS, TWO NAMES — the bug this file previously had
// `logo` is a STRING URL from Vite; ImagePlaceholder is a COMPONENT.
// Importing the image AS `ImagePlaceholder` shadows the component, and
// since JSX treats any capitalised tag as a component, <ImagePlaceholder />
// then calls document.createElement("/src/assets/images/logo.jpeg") and
// throws InvalidCharacterError. This file no longer imports
// ImagePlaceholder at all — the seal is rendered directly, for the reason
// below — so the collision can't recur here.
//
// A LOGO IS NOT A PHOTOGRAPH
// The previous version dropped the seal into a 4:3 object-cover slot,
// which crops a mark designed to be seen whole and stretches it to fill a
// photo-shaped box. A seal needs air around it and its own proportions.
// So the right column is a branded panel: the mark centred at its natural
// aspect, the motto beneath it, on a navy field that makes the gold read.
// If real photography of members arrives later, THAT belongs in a photo
// slot — the seal doesn't.
//
// Heuristics baked in:
//   - Values come from data/coreValues.js, the same source the About
//     page's CoreValues section uses, so the homepage can never advertise
//     a different set of values than the page it links to.
//   - LABELS ONLY here. That file's `description` fields are still marked
//     DRAFT; rendering them on the homepage would publish unreviewed copy
//     as if it were settled. Badges show what's confirmed.
//   - Icons live in this component keyed by value id, not in the data
//     file — content is shared, presentation stays local.
//   - Text-first DOM order: on mobile a reader reaches the mission before
//     the mark. Desktop reorders with lg:order-* rather than duplicating
//     markup per breakpoint.
//   - Scroll-reveal matches Card.jsx exactly (once, -60px, reduced-motion
//     aware) so every revealed element on the site shares one feel.

const ICON_MAP = {
  justice: FaScaleBalanced,
  integrity: FaShieldHalved,
  accountability: FaClipboardCheck,
  leadership: FaUsers,
};

const AboutPreview = () => {
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
    <section className="bg-white">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Text + values */}
          <motion.div {...reveal} className="lg:order-1">
            <SectionTitle
              docket="02"
              eyebrow="Who We Are"
              title="Where law meets leadership."
              description="Juris Leadership Alliance is a movement of law students shaping principled legal minds — committed to academic excellence and to meaningful change within the faculty and beyond."
            />

            {/* Labels only — see note on DRAFT descriptions */}
            <ul className="flex flex-wrap gap-2.5 mt-8">
              {coreValues.map(({ id, label }) => {
                const Icon = ICON_MAP[id];
                return (
                  <li
                    key={id}
                    className="flex items-center gap-2 rounded-full border border-(--jla-gold-600)/40 bg-(--jla-gold)/10 px-4 py-2"
                  >
                    {Icon && (
                      <Icon aria-hidden="true" className="text-(--jla-gold-600) text-sm shrink-0" />
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wide text-(--jla-navy)">
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <Button to={ROUTES.ABOUT} variant="secondary">
                Learn About JLA
              </Button>
            </div>
          </motion.div>

          {/* The seal — given its own panel, not cropped into a photo slot */}
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="lg:order-2"
          >
            <div className="relative overflow-hidden rounded-lg bg-(--jla-navy-950) px-8 py-12 sm:px-10 sm:py-16 flex flex-col items-center text-center">
              {/* Ruled field — same motif as the Resources hero, quiet
                  enough that the mark stays the focus */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_28px)] text-white"
              />
              {/* Soft gold bloom behind the seal */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-(--jla-gold)/15 blur-3xl"
              />

              <img
                src={logo}
                alt="The Juris Leadership Alliance seal"
                className="relative w-40 sm:w-48 lg:w-52 h-auto rounded-full ring-2 ring-(--jla-gold)/50 bg-white"
              />

              <p className="relative font-(family-name:--font-display) italic text-white/90 text-lg sm:text-xl mt-6">
                “Where law meets leadership.”
              </p>

              <span className="relative font-mono text-[10px] tracking-[0.2em] uppercase text-(--jla-gold) mt-3">
                Juris Leadership Alliance
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;