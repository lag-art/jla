import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaFileLines } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import Card from "../common/Card";
import ImagePlaceholder from "../common/ImagePlaceholder";
import Button from "../common/Button";
import resourcesData from "../../data/resourcesData";
import ROUTES from "../../routes/routePaths";

// home / ResourcesPreview
// Fourth homepage section — teaser for the Resources hub.
//
// Heuristics baked in:
//   - 5 documents is an odd number, which breaks a naive responsive grid:
//     a 2-column layout strands the 5th item alone on its own half-empty
//     row; a 3-column layout strands a pair. Rather than patch that with
//     a col-span hack, the first resource (the Constitution — the founding
//     document) is pulled out as a horizontal "featured" block, leaving
//     exactly 4 remaining items, which DOES divide cleanly at every
//     breakpoint (1 / 2 / 4 columns, no orphans, no hack).
//   - Featured block reflows direction responsively: stacked (image over
//     text) on mobile, side-by-side from sm up — one flex-col sm:flex-row
//     toggle rather than duplicate markup per breakpoint.
//   - Fully data-driven from data/resourcesData.js. That file is a
//     registry (which documents exist), not content — so adding a 6th
//     document is a data edit. Note the "4 divides evenly" property only
//     holds at exactly 5 entries; a 6th would need this split revisited,
//     which is a visible consequence of the data changing, not a silent
//     breakage.
//   - Cards use Card.jsx's default landscape orientation, since these are
//     document previews rather than portraits.

const ResourcesPreview = () => {
  const shouldReduceMotion = useReducedMotion();
  const [featured, ...rest] = resourcesData;

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
        <motion.div
          {...reveal}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12"
        >
          <SectionTitle
            docket="04"
            eyebrow="Resources"
            title="Every governing document, in one place."
            description="Our constitution, policies, and procedures — open for every member to read."
          />
          <div className="hidden lg:block shrink-0">
            <Button to={ROUTES.RESOURCES} variant="secondary" iconRight={FaArrowRight}>
              Browse All Resources
            </Button>
          </div>
        </motion.div>

        {/* Featured document — stacked on mobile, side-by-side from sm up */}
        {featured && (
          <motion.a
            href={featured.route}
            {...reveal}
            className="group flex flex-col sm:flex-row overflow-hidden rounded-md border border-(--jla-line) hover:border-(--jla-gold) transition-colors duration-200 mb-6 sm:mb-8"
          >
            <div className="sm:w-2/5 lg:w-1/3 shrink-0">
              <ImagePlaceholder
                src={featured.image}
                ratio="16/9"
                rounded="none"
                alt={featured.title}
                className="w-full h-full sm:aspect-auto sm:h-full"
              />
            </div>
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-3">
              <div className="flex items-center gap-2">
                <FaFileLines aria-hidden="true" className="text-(--jla-gold-600)" />
                {featured.tag && (
                  <span className="font-mono text-[11px] tracking-wider uppercase text-(--jla-gold-600) border border-(--jla-gold-600)/40 rounded-sm px-2 py-0.5">
                    {featured.tag}
                  </span>
                )}
              </div>
              <h3 className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-navy) group-hover:text-(--jla-gold-600) transition-colors duration-200">
                {featured.title}
              </h3>
              <p className="text-sm sm:text-base text-(--jla-slate) leading-relaxed max-w-xl">
                {featured.summary}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-(--jla-navy) mt-1">
                Read the document <FaArrowRight aria-hidden="true" className="text-xs" />
              </span>
            </div>
          </motion.a>
        )}

        {/* Remaining 4 — clean grid at every breakpoint, no orphaned items */}
        <motion.div {...reveal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.map((resource) => (
            <Card
              key={resource.id}
              to={resource.route}
              image={resource.image}
              imageAlt={resource.title}
              tag={resource.tag || undefined}
              title={resource.shortTitle || resource.title}
            >
              {resource.summary}
            </Card>
          ))}
        </motion.div>

        <div className="lg:hidden mt-8">
          <Button to={ROUTES.RESOURCES} variant="secondary" fullWidth iconRight={FaArrowRight}>
            Browse All Resources
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreview;