import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import LeadershipMemberCard from "./LeadershipMemberCard";
import { leadershipByTier } from "../../data/leadershipTeam";

// leadership / LeadershipTeamGrid
// The Leadership page's full roster — the one place on the site showing
// every member, grouped by tier. home/LeadershipPreview.jsx and
// about/TeamSection.jsx deliberately show executives only; this is the
// complete list they both hand off to.
//
// COLUMN COUNT IS COMPUTED, NOT HARDCODED — and this fixed a real flaw
// The previous version gave the top tier a fixed 3-column grid. With
// exactly four executives that renders three cards and then one alone on
// its own row, which reads as a mistake rather than a layout. Rather than
// hardcode a different number (and break again at five), gridColsFor()
// picks the column count that leaves the FEWEST empty slots in the last
// row, capped by tier so the top tier still gets larger cards.
// For the current roster that means 4 executives in 2×2 and 3 officials
// in a single row of 3 — no orphans in either. Add a fifth executive and
// it re-solves itself.
//
// Other heuristics:
//   - Renders whatever tiers exist in data/leadershipTeam.js rather than
//     hardcoding "Executive" and "Officials". Adding a third tier to that
//     file's TIERS object makes a new section appear here, correctly
//     ordered by rank.
//   - Empty tiers are filtered out, so a tier defined but unfilled never
//     renders an orphaned heading above blank space.
//   - Card size keys off tier RANK, not a tier name, so renaming a tier
//     doesn't silently flatten the visual hierarchy.
//   - The `index` passed to each card is PER TIER, so each section's
//     stagger restarts rather than the last card waiting on a delay
//     accumulated across the whole page.
//   - The roster is marked up as <ul>/<li>. It's a list of people, and a
//     screen reader announcing "list, 4 items" is materially more useful
//     than four unrelated articles in a div.
//   - Each tier carries an id, so a future in-page nav (or a link from
//     the Constitution's Article 4, which establishes these offices) can
//     deep-link straight to a tier.
//   - Renders null on an empty roster rather than a bare heading.

// Fewest empty slots in the final row; ties keep the higher column count.
const gridColsFor = (count, max) => {
  if (count <= 1) return 1;
  let best = Math.min(count, max);
  let fewest = Infinity;
  for (let c = Math.min(count, max); c >= 2; c -= 1) {
    const orphans = count % c === 0 ? 0 : c - (count % c);
    if (orphans < fewest) {
      fewest = orphans;
      best = c;
    }
  }
  return best;
};

// Tailwind needs whole class names at build time — a template string like
// `lg:grid-cols-${n}` is invisible to the scanner and produces no CSS.
const LG_COLS = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};
const SM_COLS = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

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
          description="Every member of the Alliance's leadership who they are, and what they're responsible for."
        />

        <div className="flex flex-col gap-14 sm:gap-16 mt-10 sm:mt-12">
          {populatedTiers.map((tier) => {
            const isTopTier = tier.rank === 1;
            const count = tier.members.length;

            // Top tier caps at 3 so its cards stay larger; others at 4.
            const lgCols = gridColsFor(count, isTopTier ? 3 : 4);
            // Below lg, the mid breakpoint never exceeds 3 regardless.
            const smCols = Math.min(lgCols, 3);

            return (
              <div
                key={tier.key}
                id={tier.key}
                className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)]"
              >
                <motion.div {...reveal} className="flex items-center gap-4 mb-6 sm:mb-8">
                  <h3 className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-navy) text-balance">
                    {tier.label}
                  </h3>
                  <span aria-hidden="true" className="h-px flex-1 bg-(--jla-line)" />
                  <span className="font-mono text-xs text-(--jla-slate)/60 shrink-0 tabular-nums">
                    {String(count).padStart(2, "0")}
                  </span>
                </motion.div>

                {/* A list of people — see markup note above */}
                <ul
                  className={`grid gap-5 sm:gap-6 grid-cols-2 ${SM_COLS[smCols]} ${LG_COLS[lgCols]}`}
                >
                  {tier.members.map((member, index) => (
                    <li key={member.id} className="flex">
                      <LeadershipMemberCard
                        member={member}
                        featured={isTopTier}
                        index={index}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeamGrid;