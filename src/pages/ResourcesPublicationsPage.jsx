import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FaNewspaper, FaArrowLeft, FaArrowRight, FaEnvelope } from "react-icons/fa6";
import SEO from "../components/common/SEO";
import Breadcrumb from "../components/common/Breadcrumb";
import { resourcesByGroup } from "../data/resourcesData";
import ROUTES from "../routes/routePaths";

// ResourcesPublicationsPage
// Publications are reserved in the registry (GROUPS.publications) but no
// entry exists yet, so there is nothing to list.
//
// WHY THIS PAGE HAS NO PublicationsSection COMPONENT
// A section component that maps an empty array renders nothing, which
// leaves a page with a header and blank space below it — worse than
// saying plainly that there's nothing here. When the first publication is
// added to the registry, that's the point to build the component; until
// then this page owns its own empty state.
//
// WHY IT DOESN'T REUSE ResourcesHero
// That hero belongs to the hub: it counts published documents and renders
// quick-jump chips anchored to #governing and #policies. Neither anchor
// exists on this page, so those chips would be dead links. A lighter
// header is correct here.
//
// SELF-DEACTIVATING, same pattern as ManifestoSection: the count comes
// from the registry, so the moment a publication is added this page stops
// showing the empty state and shows the list instead.

const ResourcesPublicationsPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const group = resourcesByGroup.find((g) => g.key === "publications");
  const publications = group?.items || [];

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <main className="bg-white">
      <SEO
        title="Publications"
        description="Reports, statements, and other publications from the Juris Leadership Alliance."
      />

      {/* Lightweight header — see note on why ResourcesHero isn't reused */}
      <div className="bg-(--jla-navy-950) text-white">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) pt-10 pb-12 sm:pb-14">
          <Breadcrumb
            items={[{ label: "Resources", path: ROUTES.RESOURCES }, { label: "Publications" }]}
            tone="dark"
            className="mb-4"
          />
          <h1 className="font-(family-name:--font-display) font-semibold leading-tight text-[clamp(1.75rem,1.3rem+2vw,2.75rem)]">
            Publications
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
            Reports, statements, and written work from the Alliance.
          </p>
        </div>
      </div>

      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        {publications.length === 0 ? (
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-md border-2 border-dashed border-(--jla-line) bg-(--jla-paper)/60 px-6 py-10 sm:px-10 sm:py-14"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.35] pointer-events-none bg-[repeating-linear-gradient(to_bottom,transparent_0_31px,var(--jla-line)_31px_32px)]"
            />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--jla-slate)/30 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)">
                <FaNewspaper aria-hidden="true" className="text-[10px]" />
                Nothing published yet
              </span>

              <h2 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) leading-tight text-[clamp(1.375rem,1.1rem+1.4vw,2rem)] mt-4">
                The Alliance hasn’t published anything here yet.
              </h2>

              <p className="text-(--jla-slate) leading-relaxed mt-3">
                When reports, position statements, or other written work are
                released, they’ll appear on this page. There’s no date to share
                yet, and we’d rather say so than list placeholders.
              </p>

              <div className="mt-8 pt-6 border-t border-(--jla-line)">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/70 mb-3">
                  In the meantime
                </p>
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link to={ROUTES.RESOURCES} className="group flex items-start gap-3 text-sm">
                      <FaArrowLeft aria-hidden="true" className="mt-1 shrink-0 text-(--jla-gold-600) text-xs" />
                      <span>
                        <span className="font-semibold text-(--jla-navy) group-hover:text-(--jla-gold-600) transition-colors duration-150">
                          Governing documents
                          <FaArrowRight
                            aria-hidden="true"
                            className="inline ml-1.5 text-[9px] transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </span>
                        <span className="block text-(--jla-slate) leading-relaxed">
                          The Constitution and the Alliance’s policies are
                          published in full and available to read now.
                        </span>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.CONTACT} className="group flex items-start gap-3 text-sm">
                      <FaEnvelope aria-hidden="true" className="mt-1 shrink-0 text-(--jla-gold-600) text-xs" />
                      <span>
                        <span className="font-semibold text-(--jla-navy) group-hover:text-(--jla-gold-600) transition-colors duration-150">
                          Request a publication
                          <FaArrowRight
                            aria-hidden="true"
                            className="inline ml-1.5 text-[9px] transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </span>
                        <span className="block text-(--jla-slate) leading-relaxed">
                          If you’re looking for something specific, the
                          leadership can point you to it.
                        </span>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          // Registry has entries — list them. Publications are dated and
          // authored, so they are NOT rendered through DocumentReader; see
          // the `type` note in resourcesData.js.
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <li
                key={pub.id}
                className="rounded-md border border-(--jla-line) p-5 hover:border-(--jla-gold) transition-colors duration-200"
              >
                {pub.tag && (
                  <span className="font-mono text-[10px] tracking-wider uppercase text-(--jla-gold-600)">
                    {pub.tag}
                  </span>
                )}
                <h2 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-lg leading-snug mt-1">
                  {pub.shortTitle || pub.title}
                </h2>
                {pub.summary && (
                  <p className="text-sm text-(--jla-slate) leading-relaxed mt-2">{pub.summary}</p>
                )}
                {pub.pdfUrl && (
                  <a
                    href={pub.pdfUrl}
                    download
                    className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
                  >
                    Download <FaArrowRight aria-hidden="true" className="text-[9px]" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default ResourcesPublicationsPage;