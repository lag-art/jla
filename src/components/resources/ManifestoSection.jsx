import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaFeather, FaArrowRight, FaScaleBalanced, FaEnvelope } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import DocumentReader from "../common/DocumentReader";
import { getResourceById } from "../../data/resourcesData";
import ROUTES from "../../routes/routePaths";

// resources / ManifestoSection
// The Manifesto is announced but not written. This renders that state
// honestly rather than pretending otherwise.
//
// WHAT THIS DELIBERATELY DOES NOT DO
//   - No greyed-out "Download" button. A disabled control implies the file
//     exists and is momentarily unavailable. It doesn't exist.
//   - No publication date, ETA, or "coming soon — Q3". Nobody has told me
//     when this will be ready, and a date invented to fill a layout is a
//     commitment the Alliance would then be held to.
//   - No placeholder chapter list, blurred preview, or lorem text. A
//     silhouette of contents implies the contents are drafted.
//   - No progress bar. There is no measured progress to report.
// What's left is a short, plain statement of status plus routes that
// genuinely help someone who came here looking for the Alliance's
// commitments — which is the actual need behind the visit.
//
// SELF-DEACTIVATING — the important heuristic
// This component reads `status` from the registry. The moment the
// Manifesto is published (status flips to "available" and a document
// module is passed in), it stops rendering the pending state and hands
// off to DocumentReader like every other document. Nobody has to remember
// to delete this file or swap a component; the registry is the switch.
// If status says "available" but no module has been wired up yet, it says
// so plainly rather than rendering a confident blank.

const ManifestoSection = ({ document: manifestoDoc = null }) => {
  const shouldReduceMotion = useReducedMotion();
  const resource = getResourceById("manifesto");

  if (!resource) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  // --- Published: behave exactly like any other document ----------------
  if (resource.status === "available") {
    if (!manifestoDoc) {
      // Registry says published, but no content module was passed. Say so
      // rather than rendering an empty section that looks intentional.
      return (
        <section
          id="manifesto"
          className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
        >
          <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14">
            <p className="text-sm text-(--jla-slate)">
              {resource.title} is marked as published, but its text has not been
              connected yet. Add <code>src/data/documents/manifesto.js</code> and
              pass it to this section.
            </p>
          </div>
        </section>
      );
    }

    return (
      <section
        id="manifesto"
        className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
      >
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
          <SectionTitle docket="17" eyebrow="Manifesto" title={resource.title} />
          <DocumentReader document={manifestoDoc} resource={resource} />
        </div>
      </section>
    );
  }

  // --- Pending: the honest state ----------------------------------------
  return (
    <section
      id="manifesto"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <motion.div
          {...reveal}
          className="relative overflow-hidden rounded-md border-2 border-dashed border-(--jla-line) bg-(--jla-paper)/60 px-6 py-10 sm:px-10 sm:py-14"
        >
          {/* Ruled-paper watermark — an empty page, which is what this is.
              Decorative only; conveys nothing the text doesn't say. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35] pointer-events-none bg-[repeating-linear-gradient(to_bottom,transparent_0_31px,var(--jla-line)_31px_32px)]"
          />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--jla-slate)/30 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)">
              <FaFeather aria-hidden="true" className="text-[10px]" />
              Not yet published
            </span>

            <h2 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) leading-tight text-[clamp(1.5rem,1.1rem+1.8vw,2.25rem)] mt-4">
              {resource.title}
            </h2>

            <p className="text-(--jla-slate) leading-relaxed mt-3">
              {resource.summary}
            </p>

            <p className="text-(--jla-slate) leading-relaxed mt-4">
              It hasn’t been written yet, and we’d rather say that plainly than
              show you a placeholder. There’s no publication date to share —
              when there is one, this page will carry the document in full.
            </p>

            {/* Genuinely useful alternatives — the real need behind the visit */}
            <div className="mt-8 pt-6 border-t border-(--jla-line)">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/70 mb-3">
                In the meantime
              </p>

              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    to={`${ROUTES.RESOURCES_CONSTITUTION}#article-1`}
                    className="group flex items-start gap-3 text-sm"
                  >
                    <FaScaleBalanced
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-(--jla-gold-600)"
                    />
                    <span>
                      <span className="font-semibold text-(--jla-navy) group-hover:text-(--jla-gold-600) transition-colors duration-150">
                        The Constitution, Article 1
                        <FaArrowRight
                          aria-hidden="true"
                          className="inline ml-1.5 text-[9px] transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                      <span className="block text-(--jla-slate) leading-relaxed">
                        The Alliance’s vision and mission as formally adopted —
                        the closest thing to a statement of commitments that
                        currently exists in writing.
                      </span>
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to={ROUTES.CONTACT} className="group flex items-start gap-3 text-sm">
                    <FaEnvelope
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-(--jla-gold-600)"
                    />
                    <span>
                      <span className="font-semibold text-(--jla-navy) group-hover:text-(--jla-gold-600) transition-colors duration-150">
                        Ask the Alliance
                        <FaArrowRight
                          aria-hidden="true"
                          className="inline ml-1.5 text-[9px] transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                      <span className="block text-(--jla-slate) leading-relaxed">
                        Questions about the Alliance’s programme can go directly
                        to the leadership.
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ManifestoSection;
