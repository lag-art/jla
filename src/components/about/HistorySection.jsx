import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import movement from "../../data/movement";

// about / HistorySection
// Full narrative treatment of "Our Movement" on the About page.
//
// Naming note: this component is called HistorySection per the original
// site skeleton, but the actual content provided isn't a chronological
// history (no founding date or timeline exists yet) — it's a movement /
// philosophy statement. The file keeps its skeleton name (matches the
// established folder structure), but the section itself is titled "Our
// Movement," not forced into a fabricated "Founded in [year]..." framing
// that was never given. If a real founding date/timeline is added later,
// that's genuinely a different section, not a rename of this one.
//
// Heuristics baked in:
//   - Reads from data/movement.js — the exact same source
//     home/AboutPreview.jsx's condensed version reads from. Two
//     components, two different presentations, one text.
//   - Editorial magazine layout, deliberately different from
//     AboutPreview's plain-paragraph treatment: a CSS drop-cap on the
//     opening letter (first-letter:, no JS/image needed) and a pull-quote
//     sidebar extracting one line as a large visual anchor — this is the
//     "full page" version, so it should read as more considered than the
//     homepage teaser, not identical to it.
//   - Pull-quote text is drawn directly from the source paragraphs (the
//     "beacon of excellence" phrase), not a new invented line — pulling
//     an actual sentence forward for emphasis, not writing new copy.
//   - Two-column at lg (narrative + sticky pull-quote), single column
//     stacked (narrative first, quote second) below that — the quote is
//     supporting emphasis, so it follows the text it's drawn from on
//     mobile rather than competing with it for first attention.

const HistorySection = () => {
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
        <SectionTitle
          docket="11"
          eyebrow="Our Story"
          title={movement.title}
          description="What JLA is, what it's built on, and who it invites in."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mt-10 sm:mt-12">
          {/* Narrative */}
          <motion.div {...reveal} className="lg:col-span-2 flex flex-col gap-6">
            {movement.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`text-base sm:text-lg leading-relaxed text-(--jla-slate) max-w-prose ${
                  i === 0
                    ? "first-letter:font-(family-name:--font-display) first-letter:font-semibold first-letter:text-(--jla-gold-600) first-letter:text-5xl sm:first-letter:text-6xl first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.85]"
                    : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Pull-quote sidebar */}
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: shouldReduceMotion ? 0 : 0.15 }}
            className="lg:sticky lg:top-[calc(var(--sticky-nav-offset,5rem)+2rem)] h-fit"
          >
            <div className="border-l-4 border-(--jla-gold) pl-6 py-2">
              <FaQuoteLeft aria-hidden="true" className="text-(--jla-gold) text-xl mb-3" />
              <p className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-navy) leading-snug">
                JLA stands as a beacon of excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;