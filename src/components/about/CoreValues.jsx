import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaScaleBalanced,
  FaShieldHalved,
  FaClipboardCheck,
  FaUsers,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import coreValues from "../../data/coreValues";

// about / CoreValues
// Full About-page treatment of JLA's four core values — the expanded
// counterpart to the compact badge row in home/AboutPreview.jsx. Both
// read labels from data/coreValues.js.
//
// ⚠️ See data/coreValues.js — the `description` text rendered here is
// DRAFT wording, not official JLA copy. The four value LABELS are
// official; the one-line descriptions were drafted to give this section
// substance and need team review before launch. AboutPreview renders
// labels only, so it's unaffected.
//
// Heuristics baked in:
//   - Icons live here in ICON_MAP keyed by the shared data's `id`, not in
//     the data file — same split used by AboutPreview and MissionVision:
//     content is shared, presentation stays local to each component.
//   - Numbered (01–04) to echo the docket motif SectionTitle established
//     site-wide, rather than introducing a new decorative device — the
//     numbering reinforces an existing pattern instead of competing with it.
//   - Staggered reveal delay is index-based, so the four cards cascade in
//     rather than appearing simultaneously — with exactly four items this
//     reads as deliberate sequencing; the delay is capped by the small
//     item count, so it can't turn into a slow crawl if values are added.
//   - 4 items divides cleanly at every breakpoint (1 / 2 / 4 columns), so
//     unlike ResourcesPreview's 5-item problem, no featured-item split is
//     needed here — the grid just reflows.

const ICON_MAP = {
  justice: FaScaleBalanced,
  integrity: FaShieldHalved,
  accountability: FaClipboardCheck,
  leadership: FaUsers,
};

const CoreValues = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
        };

  return (
    <section className="bg-(--jla-paper)">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <SectionTitle
          docket="12"
          eyebrow="What We Stand For"
          title="Our Core Values"
          description="Four commitments that anchor how JLA leads, decides, and represents every law student."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-10 sm:mt-12">
          {coreValues.map(({ id, label, description }, index) => {
            const Icon = ICON_MAP[id];

            return (
              <motion.article
                key={id}
                {...reveal(shouldReduceMotion ? 0 : index * 0.1)}
                className="group relative flex flex-col gap-4 rounded-md border border-(--jla-line) bg-white p-6 sm:p-7 hover:border-(--jla-gold) transition-colors duration-300"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs tracking-widest text-(--jla-slate)/50"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <Icon
                  aria-hidden="true"
                  className="text-(--jla-gold-600) text-2xl group-hover:scale-110 transition-transform duration-300 origin-left"
                />

                <h3 className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl text-(--jla-navy)">
                  {label}
                </h3>

                <p className="text-sm text-(--jla-slate) leading-relaxed">{description}</p>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--jla-gold) group-hover:w-full transition-all duration-500 ease-out"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;