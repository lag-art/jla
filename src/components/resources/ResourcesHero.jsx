import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaFileLines, FaClock, FaListOl, FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import resourceHeroImage from "../../assets/images/resourcehero.jpg";
import resourcesData, { resourcesByGroup } from "../../data/resourcesData";

// resources / ResourcesHero
// The Resources page hero — renders this page's single <h1>.
//
// TWO IMPORTS, TWO NAMES
// `resourceHeroImage` is a STRING URL from Vite; ImagePlaceholder is a
// COMPONENT. Naming the image after the component shadows it and the
// render calls document.createElement("/src/assets/...jpg"), throwing
// InvalidCharacterError. Four files have hit this now — keep them apart.
//
// THE TALLEST HERO ON THE SITE — which is why the short-viewport rules
// here are the most aggressive of the four. This one carries a headline,
// a lead, a four-figure stats row AND a row of jump chips. On a landscape
// phone the untreated version fills the entire screen, so a visitor who
// came to read the Constitution sees only a banner about the Constitution.
// Under max-height:640px the banner minimum drops away, padding
// compresses, and the stats row tightens — the documents stay reachable.
//
// EVERY NUMBER IS COMPUTED — see the note in data/resourcesData.js
// "4 documents · 38 provisions · ~16 min" is summed at render time from
// the registry's measured `meta`. Publishing the Manifesto or amending a
// policy updates this automatically. On a page whose entire purpose is
// publishing governing documents, a stat that quietly goes stale
// undermines the documents themselves.
//
// Other heuristics:
//   - Stats degrade rather than lie: a document with no `meta` (the
//     Manifesto — nothing measured yet) contributes NOTHING to the totals
//     rather than counting as zero-length. If no document had meta the
//     whole row hides instead of showing "0".
//   - Pending documents are counted separately and stated plainly
//     ("1 in preparation"), never folded into the published count.
//   - Jump chips come from resourcesByGroup, which already drops empty
//     groups — so Publications stays invisible until it has an entry,
//     with no conditional logic here.
//   - Ruled-line texture rather than the dot field About and Leadership
//     use: same family, but a document registry reads as its own place.
//   - object-position: top, so a 21:9 photo cropped into a short banner
//     doesn't centre-crop its subject out of frame.

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
    <section
      className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white flex items-end
                 min-h-80 sm:min-h-95 lg:min-h-110
                 [@media(max-height:640px)]:min-h-0"
    >
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          src={resourceHeroImage}
          ratio="21/9"
          rounded="none"
          fit="cover"
          position="top"
          priority
          alt=""
          className="w-full h-full"
        />

        {/* Vertical: carries the text sitting at the bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/85 to-(--jla-navy-950)/45"
        />
        {/* Horizontal: keeps left-aligned text readable on wide screens */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-(--jla-navy-950)/75 via-(--jla-navy-950)/25 to-transparent"
        />
        {/* Ruled paper — the document-registry motif, distinct from the
            dot field used by About and Leadership */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_28px)]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative w-full max-w-(--container-max) mx-auto px-(--container-padding)
                   pt-20 pb-10 sm:pb-12 lg:pb-14
                   [@media(max-height:640px)]:pt-14 [@media(max-height:640px)]:pb-6"
      >
        <Breadcrumb items={[{ label: "Resources" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Resources
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-balance
                       text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          The rules, in the open.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl text-pretty">
          Every document that governs the Alliance readable in full, searchable,
          and free to download. No member should have to ask what the rules are.
        </p>

        {/* Computed stats — see heuristics note */}
        {stats.measured && (
          <dl
            className="flex flex-wrap items-center gap-x-8 gap-y-3
                       mt-7 pt-6 border-t border-white/15
                       [@media(max-height:640px)]:mt-4 [@media(max-height:640px)]:pt-4"
          >
            <div className="flex items-center gap-2.5">
              <FaFileLines aria-hidden="true" className="text-(--jla-gold) text-sm shrink-0" />
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">Published</dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl tabular-nums">
                  {stats.available} document{stats.available === 1 ? "" : "s"}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FaListOl aria-hidden="true" className="text-(--jla-gold) text-sm shrink-0" />
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">Provisions</dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl tabular-nums">
                  {stats.provisions}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <FaClock aria-hidden="true" className="text-(--jla-gold) text-sm shrink-0" />
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">Full read</dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl tabular-nums">
                  ~{stats.minutes} min
                </dd>
              </div>
            </div>

            {stats.pending > 0 && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">
                  In preparation
                </dt>
                <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl text-white/60 tabular-nums">
                  {stats.pending}
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Jump chips — generated from groups, empty groups already dropped.
            Hidden on the shortest viewports: the documents themselves are
            only a scroll away, and the chips cost a whole row there. */}
        {resourcesByGroup.length > 0 && (
          <nav
            aria-label="Jump to document group"
            className="flex flex-wrap gap-2.5 mt-6 [@media(max-height:640px)]:hidden"
          >
            {resourcesByGroup.map((group) => (
              <a
                key={group.key}
                href={`#${group.key}`}
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/85 hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--jla-navy-950) transition-colors duration-200"
              >
                {group.label}
                <span className="font-mono text-[10px] opacity-70 tabular-nums">
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