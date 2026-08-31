import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaFileLines,
  FaClock,
  FaArrowUpRightFromSquare,
  FaHourglassHalf,
  FaListUl,
  FaChevronDown,
} from "react-icons/fa6";
import { resourcesByGroup } from "../../data/resourcesData";

// resources / ResourcesSideNav
// Navigates BETWEEN documents on the Resources hub page.
//
// SCOPE — read this before adding features
// This is NOT the same thing as DocumentReader's internal table of
// contents. That one navigates WITHIN a single document (Article 1, 2,
// 3...); this one navigates ACROSS documents (Constitution → Attendance
// Policy → Gender Policy). Both are "side navs", which is exactly how two
// components end up duplicating each other. The boundary: if it lists
// articles or clauses, it belongs in DocumentReader. If it lists
// documents, it belongs here.
//
// Heuristics baked in:
//   - Generated entirely from resourcesByGroup, which already drops empty
//     groups — so Publications stays invisible until it has a first entry,
//     with no conditional logic here.
//   - Hides itself when there is only ONE document to navigate to. A nav
//     offering a single destination is noise, and this page has exactly
//     that state in its future (if policies were ever removed).
//   - Pending documents are LISTED but not linked. Hiding them would make
//     the Manifesto invisible; linking them would send someone to a page
//     with nothing on it. Listing-without-linking says "this is coming"
//     honestly, and matches the registry's `status` contract.
//   - Anchors, not routes. Every document renders as a section on this
//     page with id={doc.id}, so in-page anchors are correct here. The
//     Constitution additionally has its own dedicated route for deep
//     linking from elsewhere; that's offered as a separate "open full
//     page" affordance rather than replacing the anchor, so clicking the
//     nav never unexpectedly navigates away mid-page.
//   - Two genuinely different layouts, CSS-switched (no matchMedia, no
//     resize listener): a sticky rail at lg+, and a horizontally
//     scrollable chip bar below that. A vertical document list on a phone
//     would push the actual documents off-screen — the nav would cost
//     more than it saves.
//   - Scroll-spy marks the document currently in view, so the reader
//     always knows where they are in a long hub page.

const ResourcesSideNav = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(false);

  const allItems = resourcesByGroup.flatMap((g) => g.items);

  // Scroll-spy across document sections.
  useEffect(() => {
    const nodes = allItems
      .map((it) => document.getElementById(it.id))
      .filter(Boolean);
    if (nodes.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveId(top.target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [allItems]);

  // A nav to a single destination isn't worth the space — see note above.
  if (allItems.length <= 1) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  // ---- shared per-document row (desktop rail) --------------------------
  const DocRow = ({ doc }) => {
    const isActive = activeId === doc.id;
    const isPending = doc.status === "pending";
    const label = doc.shortTitle || doc.title;

    const inner = (
      <>
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm leading-snug">{label}</span>
          {isPending && (
            <FaHourglassHalf
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-[10px] text-(--jla-slate)/60"
            />
          )}
        </div>

        {doc.meta ? (
          <span className="flex items-center gap-3 mt-1 font-mono text-[10px] text-(--jla-slate)/70">
            <span className="flex items-center gap-1">
              <FaFileLines aria-hidden="true" />
              {doc.meta.sections}
            </span>
            <span className="flex items-center gap-1">
              <FaClock aria-hidden="true" />
              {doc.meta.readMinutes}m
            </span>
          </span>
        ) : (
          isPending && (
            <span className="block mt-1 font-mono text-[10px] uppercase tracking-wide text-(--jla-slate)/60">
              In preparation
            </span>
          )
        )}
      </>
    );

    // Pending documents are listed, never linked — see heuristics note.
    if (isPending) {
      return (
        <div className="block py-2.5 pl-3 border-l-2 border-(--jla-line) text-(--jla-slate)/60 cursor-default">
          {inner}
        </div>
      );
    }

    return (
      <a
        href={`#${doc.id}`}
        aria-current={isActive ? "true" : undefined}
        className={`block py-2.5 pl-3 border-l-2 transition-colors duration-150 ${
          isActive
            ? "border-(--jla-gold) text-(--jla-gold-600) font-semibold"
            : "border-(--jla-line) text-(--jla-slate) hover:text-(--jla-navy) hover:border-(--jla-slate)"
        }`}
      >
        {inner}
      </a>
    );
  };

  const railContent = (
    <div className="flex flex-col gap-6">
      {resourcesByGroup.map((group) => (
        <div key={group.key} id={group.key} className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1rem)]">
          <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-gold-600) mb-2 pb-2 border-b border-(--jla-line)">
            {group.label}
            <span className="ml-2 text-(--jla-slate)/50">{group.items.length}</span>
          </h3>
          <div className="flex flex-col">
            {group.items.map((doc) => (
              <DocRow key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      ))}

      {/* Documents with their own route get a secondary "full page" link,
          so the anchor above never navigates away unexpectedly. */}
      {allItems.some((d) => d.status !== "pending" && !d.route.includes("#")) && (
        <div className="pt-4 border-t border-(--jla-line)">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/60 mb-2">
            Open full page
          </p>
          {allItems
            .filter((d) => d.status !== "pending" && !d.route.includes("#"))
            .map((d) => (
              <Link
                key={d.id}
                to={d.route}
                className="inline-flex items-center gap-1.5 py-1 text-xs text-(--jla-slate) hover:text-(--jla-gold-600) transition-colors duration-150"
              >
                {d.shortTitle || d.title}
                <FaArrowUpRightFromSquare aria-hidden="true" className="text-[9px]" />
              </Link>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: sticky rail */}
      <motion.aside
        {...reveal}
        aria-label="Documents"
        className="hidden lg:block lg:sticky lg:top-[calc(var(--sticky-nav-offset,5rem)+2rem)] h-fit"
      >
        {railContent}
      </motion.aside>

      {/* Mobile / tablet: sticky chip bar — a vertical document list here
          would push the documents themselves off-screen */}
      <div className="lg:hidden sticky top-(--sticky-nav-offset,5rem) z-20 -mx-(--container-padding) bg-(--jla-paper)/95 backdrop-blur-sm border-b border-(--jla-line)">
        <div className="flex items-center gap-2 px-(--container-padding) py-2.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle document list"
            className="shrink-0 flex items-center gap-1.5 rounded-full border border-(--jla-line) bg-white px-3 py-1.5 text-xs font-semibold text-(--jla-navy)"
          >
            <FaListUl aria-hidden="true" className="text-[10px]" />
            <FaChevronDown
              aria-hidden="true"
              className={`text-[9px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {allItems.map((doc) => {
            const isActive = activeId === doc.id;
            const isPending = doc.status === "pending";
            const label = doc.shortTitle || doc.title;

            if (isPending) {
              return (
                <span
                  key={doc.id}
                  className="shrink-0 rounded-full border border-dashed border-(--jla-line) px-3 py-1.5 text-xs text-(--jla-slate)/60 whitespace-nowrap"
                >
                  {label}
                </span>
              );
            }

            return (
              <a
                key={doc.id}
                href={`#${doc.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? "bg-(--jla-navy) text-white"
                    : "border border-(--jla-line) bg-white text-(--jla-navy) hover:border-(--jla-gold)"
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* Expanded list — grouped, for when the chip row isn't enough */}
        {open && (
          <div className="px-(--container-padding) pb-4 pt-1 max-h-[50dvh] overflow-y-auto">
            {railContent}
          </div>
        )}
      </div>
    </>
  );
};

export default ResourcesSideNav;