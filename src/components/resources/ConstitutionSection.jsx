import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaDownload, FaArrowRight, FaScaleBalanced } from "react-icons/fa6";
import DocumentReader from "../common/DocumentReader";
import constitution from "../../data/documents/constitution";
import { getResourceById } from "../../data/resourcesData";

// resources / ConstitutionSection
// Frames the Constitution on the Resources hub and hands the actual text
// to DocumentReader.
//
// WHAT LIVES HERE vs IN DocumentReader
// DocumentReader owns everything about READING a document — the article
// nav, in-page search, anchors, copy-link, reading progress. It knows
// nothing about JLA specifically. This wrapper owns everything about THIS
// document's place on the site: its heading, cover, version line, and the
// cross-reference jump-in below. Keeping that split means the Manifesto
// wrapper (and any future document) is a twenty-line file.
//
// Heuristics baked in:
//   - Title, version, cover, PDF and meta all come from the registry via
//     getResourceById — never retyped here. Two places stating the
//     document's version is two places to forget to update.
//   - The CROSS_REFERENCED list below is not "popular articles" or
//     "highlights" — those would be claims I can't support. Each entry is
//     an article that ANOTHER part of this site actually links to, with
//     the reason stated. If a link is removed elsewhere, its entry here
//     should go too; that's the test for whether it belongs.
//   - Every cross-reference is verified against the document at render
//     time (articleIndex lookup). An article that doesn't exist is
//     silently dropped rather than rendering a link to a dead anchor —
//     so renumbering the Constitution can't leave broken jump-ins behind.
//   - Renders null if the document module is missing entirely, so a
//     half-finished conversion can't take the whole Resources page down.
//   - id="constitution" matches the registry id, which is what
//     ResourcesSideNav's scroll-spy and anchor links target.

// Articles other parts of the site point at. `reason` documents WHY, so
// the list can be audited rather than accumulating forever.
const CROSS_REFERENCED = [
  {
    id: "article-3",
    label: "Membership",
    reason: "Referenced from the Join page — who may join and on what terms.",
  },
  {
    id: "article-5",
    label: "Elections",
    reason:
      "Referenced from the Nominations page — this is the Alliance's nomination and election rule, rather than a separate document.",
  },
  {
    id: "article-8",
    label: "Discipline & Dispute Resolution",
    reason:
      "The provision the Disciplinary Procedure Act operates under.",
  },
];

const ConstitutionSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const resource = getResourceById("constitution") || {};

  // A missing or half-converted module shouldn't break the hub page.
  if (!constitution) return null;

  // Only surface cross-references that actually resolve — see note above.
  const jumps = CROSS_REFERENCED.filter((ref) =>
    constitution.articles?.some((a) => a.id === ref.id)
  );

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id="constitution"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        {/* Document header */}
        <motion.div
          {...reveal}
          className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10 pb-8 border-b border-(--jla-line)"
        >
          {resource.image && (
            <div className="w-24 sm:w-32 lg:w-40 shrink-0">
              <img
                src={resource.image}
                alt=""
                className="w-full rounded-md border border-(--jla-line) shadow-(--shadow-sm)"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-(--jla-gold-600) border border-(--jla-gold-600)/40 rounded-sm px-2.5 py-1">
              <FaScaleBalanced aria-hidden="true" className="text-[10px]" />
              {resource.tag || "Governing Document"}
            </span>

            <h2 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) leading-tight text-[clamp(1.5rem,1.1rem+1.8vw,2.5rem)] mt-3">
              {constitution.title}
            </h2>

            {constitution.motto && (
              <p className="mt-2 font-(family-name:--font-display) italic text-(--jla-slate)">
                “{constitution.motto}”
              </p>
            )}

            <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 font-mono text-[11px] text-(--jla-slate)">
              {resource.version && (
                <div className="flex gap-1.5">
                  <dt className="uppercase tracking-wider text-(--jla-slate)/60">Version</dt>
                  <dd>{resource.version}</dd>
                </div>
              )}
              {resource.meta && (
                <>
                  <div className="flex gap-1.5">
                    <dt className="uppercase tracking-wider text-(--jla-slate)/60">Articles</dt>
                    <dd>{resource.meta.sections}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="uppercase tracking-wider text-(--jla-slate)/60">Read</dt>
                    <dd>~{resource.meta.readMinutes} min</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {resource.pdfUrl && (
            <a
              href={resource.pdfUrl}
              download
              className="shrink-0 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-white bg-(--jla-navy) rounded-sm px-5 py-3 hover:bg-(--jla-navy-800) transition-colors duration-200"
            >
              <FaDownload aria-hidden="true" /> Download PDF
            </a>
          )}
        </motion.div>

        {/* Cross-referenced articles — see CROSS_REFERENCED note */}
        {jumps.length > 0 && (
          <motion.nav
            {...reveal}
            aria-label="Frequently linked articles"
            className="mt-6"
          >
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/60 mb-2.5">
              Linked from elsewhere on this site
            </p>
            <ul className="flex flex-wrap gap-2.5">
              {jumps.map((ref) => (
                <li key={ref.id}>
                  <a
                    href={`#${ref.id}`}
                    title={ref.reason}
                    className="group inline-flex items-center gap-2 rounded-full border border-(--jla-line) bg-(--jla-paper) px-4 py-2 text-xs font-semibold text-(--jla-navy) hover:border-(--jla-gold) hover:bg-(--jla-gold)/10 transition-colors duration-200"
                  >
                    {ref.label}
                    <FaArrowRight
                      aria-hidden="true"
                      className="text-[9px] text-(--jla-gold-600) transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}

        {/* The document itself */}
        <DocumentReader document={constitution} resource={resource} />
      </div>
    </section>
  );
};

export default ConstitutionSection;