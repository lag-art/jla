import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowUpRightFromSquare, FaRegNewspaper } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import { sortedNews, newsTypes } from "../../data/newsItems";

// media / NewsGrid
// Coverage OF the Alliance by other outlets.
//
// SCOPE — why this isn't PressReleases with a grid layout
// PressReleases publishes what the Alliance SAYS: first-party statements,
// reproduced in full on this site. This section shows what OTHERS have
// written about it: third-party, summarised briefly, always linked out to
// the original. The two look similar (both dated lists) but behave
// oppositely — one keeps the reader here, the other sends them away.
// If an entry ever belongs in both, it's a press release.
//
// LINKING OUT IS THE POINT, NOT A DETAIL
// Every card is an external link with rel="noopener noreferrer" and a
// visible outlet name. Summarising another publication's reporting
// without crediting and linking it is appropriation, so `url` and
// `outlet` are treated as required by the data contract — an entry
// missing either is skipped rather than rendered as an orphan.
//
// Heuristics baked in:
//   - Self-hiding while data/newsItems.js is empty; an empty "In the
//     press" section says less than no section at all.
//   - Type filters derive from types actually present, and only render
//     when there's more than one — same rule as GalleryGrid.
//   - Summaries are the Alliance's own short description, never the
//     article's opening paragraphs. The data file says so; this component
//     also clamps them to three lines so a long paste is visibly wrong
//     rather than quietly republishing someone's article.
//   - Thumbnails are optional and fall back to a typographic card. The
//     data file recommends using a photo the Alliance owns rather than
//     hotlinking an outlet's artwork, which breaks and isn't ours to use.
//   - Outlet name is shown before the headline, so it's clear at a glance
//     this is someone else's reporting rather than a JLA statement.

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const NewsGrid = ({ showWhenEmpty = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const [type, setType] = useState("all");

  // An entry without an outlet or a link isn't attributable coverage.
  const valid = useMemo(() => sortedNews.filter((n) => n.outlet && n.url), []);

  const filtered = useMemo(
    () => (type === "all" ? valid : valid.filter((n) => n.type === type)),
    [valid, type]
  );

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  if (valid.length === 0 && !showWhenEmpty) return null;

  return (
    <section
      id="coverage"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionTitle
            docket="21"
            eyebrow="In the press"
            title="Coverage of the Alliance."
            description="Reporting, interviews, and mentions published by other outlets."
          />

          {newsTypes.length > 1 && (
            <div role="group" aria-label="Filter coverage by type" className="flex flex-wrap gap-2 shrink-0">
              {["all", ...newsTypes].map((t) => {
                const isActive = type === t;
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    aria-pressed={isActive}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
                      isActive
                        ? "bg-(--jla-navy) text-white"
                        : "border border-(--jla-line) text-(--jla-navy) hover:border-(--jla-gold)"
                    }`}
                  >
                    {t === "all" ? "All" : t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {valid.length === 0 ? (
          <motion.div
            {...reveal}
            className="rounded-md border-2 border-dashed border-(--jla-line) bg-(--jla-paper)/60 px-6 py-10 sm:px-10 sm:py-12 mt-10"
          >
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--jla-slate)/30 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)">
                <FaRegNewspaper aria-hidden="true" />
                No coverage listed yet
              </span>
              <p className="text-(--jla-slate) leading-relaxed mt-4">
                When the Alliance is written about elsewhere, those articles
                will be listed here with a link to the original.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.ul
            {...reveal}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-12"
          >
            {filtered.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col h-full overflow-hidden rounded-md border border-(--jla-line) bg-white hover:border-(--jla-gold) hover:shadow-(--shadow-md) transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2"
                >
                  {item.image && (
                    <div className="overflow-hidden">
                      <ImagePlaceholder
                        src={item.image}
                        ratio="16/9"
                        rounded="none"
                        alt=""
                        className="w-full transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 gap-2">
                    {/* Outlet first — makes it obvious this is someone
                        else's reporting, not a JLA statement */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-(--jla-gold-600)">
                        {item.outlet}
                      </span>
                      <time
                        dateTime={item.date}
                        className="font-mono text-[10px] text-(--jla-slate)/70"
                      >
                        {formatDate(item.date)}
                      </time>
                      {item.type && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-(--jla-slate)/60 border border-(--jla-line) rounded-sm px-1.5 py-0.5">
                          {item.type}
                        </span>
                      )}
                    </div>

                    <h3 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-base sm:text-lg leading-snug group-hover:text-(--jla-gold-600) transition-colors duration-200">
                      {item.title}
                    </h3>

                    {item.summary && (
                      // Clamped: a long paste is visibly wrong rather than
                      // quietly republishing someone's article
                      <p className="text-sm text-(--jla-slate) leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    )}

                    <span className="inline-flex items-center gap-1.5 mt-auto pt-3 text-xs font-semibold text-(--jla-navy)">
                      Read at {item.outlet}
                      <FaArrowUpRightFromSquare
                        aria-hidden="true"
                        className="text-[9px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;