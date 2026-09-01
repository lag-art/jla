import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaDownload, FaArrowRight, FaRegNewspaper } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import { sortedReleases, releaseCategories } from "../../data/pressReleases";

// media / PressReleases
// Official statements from the Alliance, newest first.
//
// SELF-HIDING BY DEFAULT — and why
// data/pressReleases.js is deliberately empty: a fabricated press release
// is a statement attributed to a real organisation on a date it never
// said it, which is a different order of problem from a placeholder
// photo. While the array is empty this section renders nothing, so the
// Media page just doesn't have a statements area yet. Pass
// showWhenEmpty to render an explicit "none published yet" panel instead —
// appropriate if this ever gets its own route, where a blank page would
// look broken.
//
// Heuristics baked in:
//   - Ordering and year grouping both derive from the ISO `date` field in
//     the data module, never from a stored display string — so the list
//     order and the printed date can't disagree.
//   - Dates render via Intl.DateTimeFormat in the visitor's locale, with
//     a machine-readable <time dateTime> alongside. A hardcoded
//     "14/03/2026" is ambiguous to half the world.
//   - Category filters are derived from categories that actually appear,
//     and the bar only renders when there's more than one to choose
//     between — a filter with a single option is a control that does
//     nothing.
//   - The most recent release gets a featured treatment; everything else
//     is a compact row. With one entry that's just a card, so the layout
//     doesn't need a special case for a nearly-empty list.
//   - Year headings only appear when releases span more than one year.
//     Grouping four items from the same year under a single "2026"
//     heading is noise.
//   - Download buttons render only where a pdfUrl exists.

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const PressReleases = ({ showWhenEmpty = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () =>
      category === "all"
        ? sortedReleases
        : sortedReleases.filter((r) => r.category === category),
    [category]
  );

  // Year headings only earn their space across multiple years — see note.
  const spansYears = useMemo(() => {
    const years = new Set(filtered.map((r) => new Date(r.date).getFullYear()));
    return years.size > 1;
  }, [filtered]);

  const grouped = useMemo(() => {
    if (!spansYears) return [{ year: null, items: filtered }];
    return filtered.reduce((acc, r) => {
      const year = new Date(r.date).getFullYear();
      const bucket = acc.find((g) => g.year === year);
      if (bucket) bucket.items.push(r);
      else acc.push({ year, items: [r] });
      return acc;
    }, []);
  }, [filtered, spansYears]);

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  // Nothing published — see self-hiding note.
  if (sortedReleases.length === 0 && !showWhenEmpty) return null;

  return (
    <section
      id="press"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-(--jla-paper)"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionTitle
            docket="20"
            eyebrow="Press"
            title="Statements and announcements."
            description="Official communications from the Alliance, published as issued."
          />

          {releaseCategories.length > 1 && (
            <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2 shrink-0">
              {["all", ...releaseCategories].map((c) => {
                const isActive = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    aria-pressed={isActive}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
                      isActive
                        ? "bg-(--jla-navy) text-white"
                        : "border border-(--jla-line) bg-white text-(--jla-navy) hover:border-(--jla-gold)"
                    }`}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {sortedReleases.length === 0 ? (
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-md border-2 border-dashed border-(--jla-line) bg-white/60 px-6 py-10 sm:px-10 sm:py-12 mt-10"
          >
            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--jla-slate)/30 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)">
                <FaRegNewspaper aria-hidden="true" />
                None published yet
              </span>
              <p className="text-(--jla-slate) leading-relaxed mt-4">
                The Alliance hasn’t issued any public statements yet. When it
                does, they’ll be published here in full, as issued.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="mt-10 sm:mt-12 flex flex-col gap-10">
            {grouped.map((group) => (
              <div key={group.year ?? "all"}>
                {group.year && (
                  <div className="flex items-center gap-4 mb-5">
                    <h3 className="font-(family-name:--font-display) font-semibold text-xl text-(--jla-navy)">
                      {group.year}
                    </h3>
                    <span aria-hidden="true" className="h-px flex-1 bg-(--jla-line)" />
                    <span className="font-mono text-xs text-(--jla-slate)/60">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>
                )}

                <ul className="flex flex-col gap-4">
                  {group.items.map((release, i) => {
                    // Most recent overall gets the featured treatment
                    const isFeatured = group === grouped[0] && i === 0;

                    return (
                      <li key={release.id}>
                        <motion.article
                          {...reveal}
                          id={`pr-${release.id}`}
                          className={`scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] rounded-md border bg-white transition-colors duration-200 hover:border-(--jla-gold) ${
                            isFeatured
                              ? "border-(--jla-gold)/50 p-6 sm:p-8"
                              : "border-(--jla-line) p-5 sm:p-6"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <time
                              dateTime={release.date}
                              className="font-mono text-[11px] tracking-wide text-(--jla-gold-600)"
                            >
                              {formatDate(release.date)}
                            </time>
                            {release.category && (
                              <span className="font-mono text-[10px] tracking-wider uppercase text-(--jla-slate)/70 border border-(--jla-line) rounded-sm px-2 py-0.5">
                                {release.category}
                              </span>
                            )}
                            {isFeatured && (
                              <span className="font-mono text-[10px] tracking-wider uppercase text-(--jla-gold-600)">
                                Latest
                              </span>
                            )}
                          </div>

                          <h4
                            className={`font-(family-name:--font-display) font-semibold text-(--jla-navy) leading-snug mt-2 ${
                              isFeatured ? "text-xl sm:text-2xl" : "text-lg"
                            }`}
                          >
                            {release.title}
                          </h4>

                          {release.summary && (
                            <p className="text-sm sm:text-base text-(--jla-slate) leading-relaxed mt-2 max-w-3xl">
                              {release.summary}
                            </p>
                          )}

                          {isFeatured && release.body?.length > 0 && (
                            <div className="flex flex-col gap-3 mt-4">
                              {release.body.map((para, pi) => (
                                <p
                                  key={pi}
                                  className="text-sm text-(--jla-slate) leading-relaxed max-w-3xl"
                                >
                                  {para}
                                </p>
                              ))}
                            </div>
                          )}

                          {(release.pdfUrl || release.contact) && (
                            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-(--jla-line)">
                              {release.pdfUrl && (
                                <a
                                  href={release.pdfUrl}
                                  download
                                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
                                >
                                  <FaDownload aria-hidden="true" /> Download statement
                                </a>
                              )}
                              {release.contact?.email && (
                                <a
                                  href={`mailto:${release.contact.email}`}
                                  className="inline-flex items-center gap-2 text-xs text-(--jla-slate) hover:text-(--jla-gold-600) transition-colors duration-150"
                                >
                                  Press enquiries: {release.contact.name || release.contact.email}
                                  <FaArrowRight aria-hidden="true" className="text-[9px]" />
                                </a>
                              )}
                            </div>
                          )}
                        </motion.article>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PressReleases;