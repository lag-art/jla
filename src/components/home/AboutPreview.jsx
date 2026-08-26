import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaScaleBalanced, FaShieldHalved, FaHandshakeSimple } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import Button from "../common/Button";
import ROUTES from "../../routes/routePaths";

// home / AboutPreview
// Second homepage section (after HeroSection) — a condensed teaser for
// the full About page, not a duplicate of it. First of four "preview"
// sections HomePage chains together (About/Leadership/Resources/Media),
// so its scroll-reveal + responsive-grid pattern is the one the other
// three should follow for visual consistency.
//
// Heuristics baked in:
//   - Pillars are data-driven (PILLARS.map), not three hand-copied JSX
//     blocks — adding a 4th value later is a one-line array edit.
//   - Text-first DOM order, image second: on mobile this means a reader
//     hits the mission statement before the photo, which matters more for
//     comprehension than visual variety; desktop reorders via `lg:order-*`
//     rather than duplicating markup for each breakpoint.
//   - Scroll-reveal follows the exact same whileInView pattern as
//     Card.jsx (once: true, -60px margin, respects prefers-reduced-motion)
//     — one motion "feel" across every scroll-triggered element site-wide,
//     not a bespoke animation per component.
//   - Copy is real, specific mission language — not lorem ipsum, and not
//     fabricated statistics (member counts, founding year) that would
//     need to be walked back once real numbers exist.

const PILLARS = [
  {
    Icon: FaScaleBalanced,
    label: "Rule of Law",
    blurb: "Every position we take is anchored in constitutional principle, not convenience.",
  },
  {
    Icon: FaShieldHalved,
    label: "Accountability",
    blurb: "Leaders who serve the public must answer to it — in word and in record.",
  },
  {
    Icon: FaHandshakeSimple,
    label: "Service",
    blurb: "Leadership is a responsibility held on behalf of others, not a title held for oneself.",
  },
];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text + pillars */}
          <motion.div {...reveal} className="lg:order-1">
            <SectionTitle
              docket="02"
              eyebrow="Who We Are"
              title="Leadership built on principle, not proximity to power."
              description="Juris Leadership Alliance trains and supports leaders who treat the law as a boundary on power, not an obstacle to it — equipping them with the integrity and legal literacy public service demands."
            />

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {PILLARS.map(({ Icon, label, blurb }) => (
                <li key={label} className="flex flex-col gap-2">
                  <Icon aria-hidden="true" className="text-(--jla-gold-600) text-xl" />
                  <span className="font-semibold text-(--jla-navy) text-sm">{label}</span>
                  <p className="text-sm text-(--jla-slate) leading-relaxed">{blurb}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button to={ROUTES.ABOUT} variant="secondary">
                Learn About JLA
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="lg:order-2"
          >
            <ImagePlaceholder
              variant={3}
              ratio="4/3"
              rounded="lg"
              alt="Juris Leadership Alliance members in session"
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;