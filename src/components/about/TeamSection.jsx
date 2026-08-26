import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import Button from "../common/Button";
import leadershipTeam from "../../data/leadershipTeam";
import ROUTES from "../../routes/routePaths";

// about / TeamSection
// Compact roster + handoff to the Leadership page.
//
// Scope decision worth knowing: TeamSection (here, on About) and
// leadership/LeadershipTeamGrid (on the Leadership page) both read the
// same data/leadershipTeam.js. Building both as full rosters would mean
// two pages showing identical content, with About quietly duplicating
// the Leadership page's whole purpose. So this one is deliberately the
// LIGHTER treatment — a portrait strip that introduces the executives and
// hands off — while the Leadership page owns the full detail (bios,
// OrgChart, per-member cards). If this section ever grows bios or
// filtering, that's a signal the two pages have collapsed into one and
// the split should be reconsidered.
//
// Heuristics baked in:
//   - Overlay caption (name/role sitting on the portrait) rather than
//     Card.jsx's stacked image-above-text layout — visually distinguishes
//     this compact strip from LeadershipPreview's card treatment on the
//     homepage, so the same four people don't render identically in three
//     different places across the site.
//   - Caption is always visible, not hover-revealed: names and roles are
//     the actual content here, and hiding them behind hover would make
//     them unreachable on touch devices entirely.
//   - Grid is 2-up on mobile (not 1-up) — portraits are tall, so a single
//     column would push the fourth member far below the fold; two narrow
//     portraits side-by-side keeps the whole roster scannable on a phone.
//   - Reveal stagger is index-based and capped small (0.08s), keeping the
//     cascade brisk — this is a supporting section, not the page's
//     centrepiece, so its animation shouldn't demand attention.

const TeamSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
        };

  return (
    <section className="bg-white">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12">
          <SectionTitle
            docket="13"
            eyebrow="The Team"
            title="Who leads the Alliance"
            description="Elected representatives serving the faculty — accountable to the students who chose them."
          />
          <div className="hidden lg:block shrink-0">
            <Button to={ROUTES.LEADERSHIP} variant="secondary" iconRight={FaArrowRight}>
              Full Leadership & Structure
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {leadershipTeam.map((member, index) => (
            <motion.figure
              key={member.id}
              {...reveal(shouldReduceMotion ? 0 : index * 0.08)}
              className="group relative overflow-hidden rounded-md"
            >
              <ImagePlaceholder
                src={member.image}
                ratio="3/4"
                rounded="md"
                alt={`${member.name} — ${member.role}`}
                className="w-full transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-(--jla-navy-950) to-transparent"
              />

              <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <p className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-(--jla-gold)">
                  {member.role}
                </p>
                <p className="font-(family-name:--font-display) font-semibold text-white text-sm sm:text-base leading-tight mt-0.5">
                  {member.name}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="lg:hidden mt-8">
          <Button to={ROUTES.LEADERSHIP} variant="secondary" fullWidth iconRight={FaArrowRight}>
            Full Leadership & Structure
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;