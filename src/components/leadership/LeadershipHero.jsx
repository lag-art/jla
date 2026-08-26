import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import { leadershipByTier } from "../../data/leadershipTeam";

// leadership / LeadershipHero
// The Leadership page's hero — renders this page's single <h1>.
//
// Heuristics baked in:
//   - Banner-height (not full-viewport), matching about/AboutHero.jsx:
//     interior pages share one hero scale so the site reads as a site,
//     not a series of landing pages.
//   - Breadcrumb now comes from the shared common/Breadcrumb.jsx,
//     extracted here — this is the second page needing it, which is the
//     right moment to generalise rather than copy-paste AboutHero's copy.
//   - Roster counts are COMPUTED from data/leadershipTeam.js, never
//     hardcoded. Adding an eighth leader updates the displayed stats
//     automatically — a hardcoded "7 leaders" would silently become a
//     false statement the moment the roster changes.
//   - Stats render only when a tier actually has members, so an empty
//     tier can't produce a "0 Officials" line.

const LeadershipHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const populatedTiers = leadershipByTier.filter((tier) => tier.members.length > 0);
  const totalMembers = populatedTiers.reduce((sum, tier) => sum + tier.members.length, 0);

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
        <ImagePlaceholder variant={5} ratio="21/9" rounded="none" priority alt="" className="w-full h-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/85 to-(--jla-navy-950)/45" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[22px_22px]" />
      </div>

      <motion.div {...reveal} className="relative max-w-(--container-max) mx-auto px-(--container-padding) pt-20 pb-10 sm:pb-12 lg:pb-14 w-full">
        <Breadcrumb items={[{ label: "Leadership & Structure" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Leadership &amp; Structure
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          Elected to serve, held to account.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl">
          The students representing every voice in the faculty — and the
          structure that keeps that representation answerable.
        </p>

        <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-7 pt-6 border-t border-white/15">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-white/50">Total</dt>
            <dd className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-gold)">{totalMembers}</dd>
          </div>
          {populatedTiers.map((tier) => (
            <div key={tier.key}>
              <dt className="text-[11px] uppercase tracking-wider text-white/50">{tier.label}</dt>
              <dd className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-white">{tier.members.length}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
};

export default LeadershipHero;