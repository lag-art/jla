import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaFileLines, FaClock, FaListOl, FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import resourcesData, { resourcesByGroup } from "../../data/resourcesData";

// resources / ResourcesHero
// The Resources page hero — renders this page's single <h1>.
//
// Heuristics baked in:
//   - Every number shown is COMPUTED from data/resourcesData.js, never
//     written into this component. "4 documents · 38 provisions · 16 min"
//     is derived at render time, so publishing the Manifesto or amending a
//     policy updates the hero automatically. A hardcoded count is a claim
//     that quietly becomes false the first time the registry changes —
//     and on a page whose whole purpose is publishing governing documents,
//     an inaccurate count undermines the thing being published.
//   - Stats degrade rather than lie: a document with no `meta` (the
//     Manifesto, which has no content to measure) contributes nothing to
//     the totals instead of counting as zero-length. If NO document has
//     meta, the stat row hides entirely rather than showing "0".
//   - Pending documents are counted separately and stated plainly
//     ("1 in preparation") rather than folded into the available count.
//   - Quick-jump chips are generated from resourcesByGroup, which already
//     drops empty groups — so Publications stays invisible until it has a
//     first entry, with no conditional logic needed here.
//   - Banner height, not full-viewport: matches AboutHero and
//     LeadershipHero so interior pages read as one site. The scroll cue
//     stays exclusive to the homepage hero, where full height genuinely
//     hides what follows.

const ResourcesHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const stats = useMemo(() => {
    const available = resourcesData.filter((r) => r.status === "available");
    const pending = resourcesData.filter((r) => r.status === "pending");
    const withMeta = available.filter((r) => r.meta);

    return {
      available: available.length,
      pending: pending.length,
      // Sum only what was actually measured — see note above.
      provisions: withMeta.reduce((sum, r) => sum + (r.meta.sections || 0), 0),
      minutes: withMeta.reduce((sum, r) => sum + (r.meta.readMinutes || 0), 0),
      measured: withMeta.length > 0,
    };
  }, []);

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
        <ImagePlaceholder
          variant={6}
          ratio="21/9"
          rounded="none"
          priority
          alt=""
          className="w-full h-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/85 to-(--jla-navy-950)/45"
        />
        {/* Ruled-paper motif — a nod to the document registry this page is,
            using the same dot-grid family as the other heroes but ruled
            rather than dotted, so Resources reads as its own place. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_28px)]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative max-w-(--container-max) mx-auto px-(--container-padding) pt-20 pb-10 sm:pb-12 lg:pb-14 w-full"
      >
        <Breadcrumb items={[{ label: "Resources" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Resources
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          The rules, in the open.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl">
          Every document that governs the Alliance — readable in full, searchable,
          and free to download. No member should have to ask what the rules are.
        </p>

        {/* Computed stats — see heuristics note */}
        {stats.measured && (
          <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-7 pt-6 border-t border-white/15">
            <div className="flex items-center gap-2.5">
              <FaFileLines aria-hidden="true" className="text-(--jla-gold) text-sm" />
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">
                  Published
                </dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl">
                  {stats.available} document{stats.available === 1 ? "" : "s"}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FaListOl aria-hidden="true" className="text-(--jla-gold) text-sm" />
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">
                  Provisions
                </dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl">
                  {stats.provisions}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FaClock aria-hidden="true" className="text-(--jla-gold) text-sm" />
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">
                  Full read
                </dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl">
                  ~{stats.minutes} min
                </dd>
              </div>
            </div>

            {stats.pending > 0 && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">
                  In preparation
                </dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl text-white/60">
                  {stats.pending}
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Quick jump — generated from groups, empty groups already dropped */}
        {resourcesByGroup.length > 0 && (
          <nav aria-label="Jump to document group" className="flex flex-wrap gap-2.5 mt-6">
            {resourcesByGroup.map((group) => (
              <a
                key={group.key}
                href={`#${group.key}`}
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85 hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) transition-colors duration-200"
              >
                {group.label}
                <span className="font-mono text-[10px] opacity-70">
                  {group.items.length}
                </span>
                <FaArrowDown
                  aria-hidden="true"
                  className="text-[9px] transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </a>
            ))}
          </nav>
        )}
      </motion.div>
    </section>
  );
};

export default ResourcesHero;