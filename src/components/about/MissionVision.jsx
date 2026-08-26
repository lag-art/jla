import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaBullseye, FaEye } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import missionVision from "../../data/missionVision";

// about / MissionVision
// Full-page treatment of Mission + Vision on the About page — a richer
// counterpart to the compact preview cards in home/AboutPreview.jsx. Both
// read the exact same text from data/missionVision.js; only the
// presentation differs between the teaser and the full page.
//
// Heuristics baked in:
//   - Deliberate conceptual pairing, not just alternating color for
//     variety: Mission (what we do NOW) gets the light/paper panel —
//     grounded, present-tense. Vision (what we're building TOWARD) gets
//     the dark navy panel — aspirational, forward-looking. The color
//     choice maps to the actual meaning of each word, not just visual
//     rhythm for its own sake.
//   - ICON_MAP mirrors the same id-keyed pattern used in AboutPreview.jsx
//     — icons stay a presentation concern local to each component, while
//     the actual mission/vision text stays single-sourced in the shared
//     data file.
//   - Panels stack vertically on mobile (Mission first, Vision second —
//     present before future reads naturally in that order) and sit
//     side-by-side only at lg, where there's enough width for both to
//     breathe without cramming.
//   - Large, low-opacity watermark icon behind each panel's text reinforces
//     the theme without competing with the actual copy for attention —
//     restrained (one watermark per panel, not a busy pattern).

const ICON_MAP = { mission: FaBullseye, vision: FaEye };

const PANEL_STYLES = {
  mission: {
    section: "bg-(--jla-paper) text-(--jla-navy)",
    icon: "text-(--jla-gold-600)",
    label: "text-(--jla-gold-600)",
    body: "text-(--jla-slate)",
    watermark: "text-(--jla-navy)/5",
  },
  vision: {
    section: "bg-(--jla-navy-950) text-white",
    icon: "text-(--jla-gold)",
    label: "text-(--jla-gold)",
    body: "text-white/75",
    watermark: "text-white/5",
  },
};

const MissionVision = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
        };

  return (
    <section>
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) pt-16 sm:pt-20 lg:pt-28">
        <SectionTitle
          docket="10"
          eyebrow="What Drives Us"
          title="Our Mission & Vision"
          description="Two commitments that shape every decision JLA makes — what we stand for today, and what we're building toward."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mt-10 sm:mt-12">
        {missionVision.map(({ id, label, text }, index) => {
          const Icon = ICON_MAP[id];
          const style = PANEL_STYLES[id];

          return (
            <motion.div
              key={id}
              {...reveal(shouldReduceMotion ? 0 : index * 0.12)}
              className={`relative overflow-hidden ${style.section} px-(--container-padding) py-14 sm:py-16 lg:py-20`}
            >
              <Icon
                aria-hidden="true"
                className={`absolute -right-6 -bottom-8 text-[9rem] sm:text-[11rem] ${style.watermark}`}
              />

              <div className="relative max-w-md mx-auto lg:mx-0 lg:max-w-sm">
                <Icon aria-hidden="true" className={`text-2xl mb-4 ${style.icon}`} />
                <p className={`font-mono text-xs tracking-[0.15em] uppercase mb-2 ${style.label}`}>
                  {label}
                </p>
                <p className={`text-lg sm:text-xl leading-relaxed font-(family-name:--font-display) ${style.body}`}>
                  {text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MissionVision;