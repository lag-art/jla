import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import LeadershipMemberCard from "./LeadershipMemberCard";
import { leadershipByTier } from "../../data/leadershipTeam";

// leadership / LeadershipTeamGrid
// The Leadership page's full roster — the one place on the site that
// shows every member, grouped by tier. (home/LeadershipPreview.jsx and
// about/TeamSection.jsx deliberately show executives only; this is the
// complete list they both hand off to.)
//
// Heuristics baked in:
//   - Renders whatever tiers exist in data/leadershipTeam.js rather than
//     hardcoding "Executive" and "Officials" sections. Adding a third
//     tier (e.g. "Committee Chairs") to that file's TIERS object makes a
//     new section appear here automatically, correctly ordered by rank.
//   - Empty tiers are filtered out entirely — a tier defined in TIERS but
//     with no members yet renders nothing, instead of an orphaned heading
//     above blank space.
//   - Executive tier gets a 3-column max grid (larger cards, `featured`),
//     other tiers get 4 — so the visual hierarchy comes from card size
//     and density, not from an arbitrary decorative difference. This
//     keys off tier RANK, not a hardcoded tier name, so it still works
//     if tiers are renamed.
//   - The `index` passed to each card is per-tier, so each section's
//     stagger cascade restarts rather than the seventh card waiting on a
//     delay accumulated across the whole page.
//   - Renders null if the roster is completely empty, so the page doesn't
//     show a bare section heading with nothing under it.

const LeadershipTeamGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  const populatedTiers = leadershipByTier.filter((tier) => tier.members.length > 0);

  if (populatedTiers.length === 0) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="bg-white">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <SectionTitle
          docket="14"
          eyebrow="The Roster"
          title="Meet your representatives"
          description="Every member of the Alliance's leadership — who they are, and what they're responsible for."
        />

        <div className="flex flex-col gap-14 sm:gap-16 mt-10 sm:mt-12">
          {populatedTiers.map((tier) => {
            const isTopTier = tier.rank === 1;

            return (
              <div key={tier.key}>
                <motion.div {...reveal} className="flex items-center gap-4 mb-6 sm:mb-8">
                  <h3 className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-navy) whitespace-nowrap">
                    {tier.label}
                  </h3>
                  <span aria-hidden="true" className="h-px flex-1 bg-(--jla-line)" />
                  <span className="font-mono text-xs text-(--jla-slate)/60 shrink-0">
                    {String(tier.members.length).padStart(2, "0")}
                  </span>
                </motion.div>

                <div
                  className={`grid gap-5 sm:gap-6 grid-cols-2 ${
                    isTopTier ? "lg:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {tier.members.map((member, index) => (
                    <LeadershipMemberCard
                      key={member.id}
                      member={member}
                      featured={isTopTier}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeamGrid;