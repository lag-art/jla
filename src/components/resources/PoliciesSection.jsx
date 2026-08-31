import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaDownload,
  FaChevronDown,
  FaTriangleExclamation,
  FaClock,
  FaCircleInfo,
  FaFileLines,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import DocumentReader from "../common/DocumentReader";
import { resourcesByGroup } from "../../data/resourcesData";

import disciplinaryAct, { deadlines } from "../../data/documents/disciplinary-act";
import genderPolicy, { reportingRoute } from "../../data/documents/gender-policy";
import attendancePolicy, { sanctionLadder } from "../../data/documents/attendance-policy";

// resources / PoliciesSection
// Renders the Alliance's policies and procedures on the Resources hub.
// Replaces the three separate section components the original skeleton
// planned (Tenders / NominationRules / Disciplinary) — they were three
// files doing one job, and two of them had no content behind them.
//
// WHY COLLAPSIBLE, NOT THREE STACKED READERS
// Three full documents rendered open at once is a punishing scroll, and
// each DocumentReader runs its own IntersectionObservers and scroll
// listeners — three of them competing on one page. Panels render their
// reader only when opened, so the page starts light and stays responsive.
//
// ANCHOR COLLISIONS — why idPrefix is passed to DocumentReader
// The Disciplinary Act and the Attendance Policy both number their
// provisions clause-1..clause-7. Rendered on one page unprefixed, that
// produces duplicate DOM ids (invalid HTML) and a copy-link for one
// document's clause 3 that scrolls to the other's. Each reader therefore
// gets idPrefix={policy.id}, yielding #attendance-policy--clause-3.
//
// DEEP LINKS STILL WORK — this is the part that's easy to get wrong.
// ResourcesSideNav links to #gender-policy, and DocumentReader's copy-link
// produces URLs like /resources#clause-8. A collapsed panel would swallow
// both. On mount and on every hashchange, the panel matching the hash
// opens itself; a hash pointing at a clause INSIDE a policy also opens
// its parent, then scrolls. Without that, every shared link silently
// lands on a closed accordion.
//
// Heuristics baked in:
//   - Documents come from the registry group, not a hardcoded list — a
//     fourth policy is a data edit.
//   - AT-A-GLANCE panels surface the one thing each policy is actually
//     consulted for: the sanctions ladder (what happens on my 3rd
//     absence), the procedural deadlines (how long do I have to appeal),
//     and — for the Gender Policy — the reporting route. That last one is
//     explicitly labelled as coming from the Disciplinary Act, because
//     the Gender Policy itself states no reporting mechanism. Presenting
//     it as if the policy said so would be inventing a provision.
//   - Only one panel open at a time on the assumption people read one
//     policy at a time; opening a second closes the first, which keeps
//     the page navigable rather than becoming an endless scroll.

const DOC_MODULES = {
  "disciplinary-act": disciplinaryAct,
  "gender-policy": genderPolicy,
  "attendance-policy": attendancePolicy,
};

// ---- per-policy "at a glance" panels ------------------------------------

const SanctionLadder = () => (
  <div className="rounded-md border border-(--jla-line) overflow-hidden">
    <p className="flex items-center gap-2 bg-(--jla-paper) px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)">
      <FaTriangleExclamation aria-hidden="true" className="text-(--jla-gold-600)" />
      Sanctions ladder
    </p>
    <table className="w-full text-sm">
      <thead className="sr-only">
        <tr>
          <th>Offence</th>
          <th>Classification</th>
          <th>Sanction</th>
        </tr>
      </thead>
      <tbody>
        {sanctionLadder.map((tier) => (
          <tr key={tier.offence} className="border-t border-(--jla-line)">
            <td className="px-4 py-2.5 font-mono text-xs text-(--jla-gold-600) whitespace-nowrap align-top">
              {tier.offence}
            </td>
            <td className="px-2 py-2.5 text-(--jla-slate) text-xs align-top hidden sm:table-cell">
              {tier.classification}
            </td>
            <td className="px-4 py-2.5 text-(--jla-navy) font-medium align-top">
              {tier.sanction}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Deadlines = () => (
  <div className="rounded-md border border-(--jla-line) overflow-hidden">
    <p className="flex items-center gap-2 bg-(--jla-paper) px-4 py-2.5 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)">
      <FaClock aria-hidden="true" className="text-(--jla-gold-600)" />
      Time limits
    </p>
    <ul className="divide-y divide-(--jla-line)">
      {deadlines.map((d) => (
        <li key={d.label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
          <span className="text-sm text-(--jla-navy)">{d.label}</span>
          <span className="flex items-baseline gap-2 shrink-0">
            <span className="font-(family-name:--font-display) font-semibold text-(--jla-gold-600)">
              {d.limit}
            </span>
            <span className="font-mono text-[10px] text-(--jla-slate)/60">{d.source}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const ReportingRoute = () => (
  <div className="rounded-md border border-(--jla-gold-600)/40 bg-(--jla-gold)/10 px-4 py-3.5">
    <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-gold-600) mb-2">
      <FaCircleInfo aria-hidden="true" />
      How to report
    </p>
    <p className="text-sm text-(--jla-navy) leading-relaxed">{reportingRoute.summary}</p>
    {/* Labelled as external — this policy does not itself state a route */}
    <p className="text-xs text-(--jla-slate) mt-2 leading-relaxed">
      {reportingRoute.note} (Disciplinary Procedure Act, {reportingRoute.sourceClause}.)
    </p>
  </div>
);

const HIGHLIGHTS = {
  "attendance-policy": SanctionLadder,
  "disciplinary-act": Deadlines,
  "gender-policy": ReportingRoute,
};

// ---- main ---------------------------------------------------------------

const PoliciesSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState(null);

  const group = resourcesByGroup.find((g) => g.key === "policies");
  const policies = (group?.items || []).filter((p) => DOC_MODULES[p.id]);

  // Open whichever panel the URL hash points at — including a hash that
  // targets a clause INSIDE a policy. See the deep-link note above.
  const syncFromHash = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const direct = policies.find((p) => p.id === hash);
    if (direct) {
      setOpenId(direct.id);
      return;
    }
    // Hash may target a provision inside a document. Anchors are
    // namespaced as "<docId>--<sectionId>" (see the collision note above),
    // so the owner is read straight off the prefix. The unprefixed form is
    // still accepted so older shared links keep working — it resolves to
    // the first document containing that id.
    const [prefix] = hash.split("--");
    const owner =
      policies.find((p) => p.id === prefix) ||
      policies.find((p) => {
        const doc = DOC_MODULES[p.id];
        const sections = doc.clauses || doc.sections || [];
        return sections.some((s) => s.id === hash);
      });
    if (owner) {
      setOpenId(owner.id);
      // Let the panel render before jumping to the anchor inside it.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: shouldReduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }, [policies, shouldReduceMotion]);

  useEffect(() => {
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [syncFromHash]);

  if (policies.length === 0) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section id="policies" className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-(--jla-paper)">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <SectionTitle
          docket="16"
          eyebrow={group.label}
          title="The rules that apply to every member."
          description="Conduct, attendance, and discipline — the procedures the Alliance follows, published in full."
        />

        <div className="flex flex-col gap-4 mt-10 sm:mt-12">
          {policies.map((policy) => {
            const doc = DOC_MODULES[policy.id];
            const Highlight = HIGHLIGHTS[policy.id];
            const isOpen = openId === policy.id;
            const label = policy.shortTitle || policy.title;

            return (
              <motion.article
                key={policy.id}
                id={policy.id}
                {...reveal}
                className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] rounded-md border border-(--jla-line) bg-white overflow-hidden"
              >
                {/* Panel header — always visible, always scannable */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-(--jla-gold-600)">
                      {policy.tag}
                    </span>
                    <h3 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-lg sm:text-xl leading-snug mt-1">
                      {label}
                    </h3>
                    <p className="text-sm text-(--jla-slate) leading-relaxed mt-1.5 max-w-2xl">
                      {policy.summary}
                    </p>

                    {policy.meta && (
                      <span className="flex items-center gap-4 mt-2.5 font-mono text-[10px] text-(--jla-slate)/70">
                        <span className="flex items-center gap-1">
                          <FaFileLines aria-hidden="true" />
                          {policy.meta.sections} {policy.sectionLabel?.toLowerCase() || "section"}s
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock aria-hidden="true" />~{policy.meta.readMinutes} min
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {policy.pdfUrl && (
                      <a
                        href={policy.pdfUrl}
                        download
                        aria-label={`Download ${label} as PDF`}
                        className="inline-flex items-center gap-2 rounded-sm border border-(--jla-navy) px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:bg-(--jla-navy) hover:text-white transition-colors duration-200"
                      >
                        <FaDownload aria-hidden="true" />
                        <span className="hidden sm:inline">PDF</span>
                      </a>
                    )}
                    <button
                      onClick={() => setOpenId(isOpen ? null : policy.id)}
                      aria-expanded={isOpen}
                      aria-controls={`${policy.id}-body`}
                      className="inline-flex items-center gap-2 rounded-sm bg-(--jla-navy) px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-(--jla-navy-800) transition-colors duration-200"
                    >
                      {isOpen ? "Close" : "Read"}
                      <FaChevronDown
                        aria-hidden="true"
                        className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* At a glance — visible without opening the full text */}
                {Highlight && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <Highlight />
                  </div>
                )}

                {/* Full text — rendered only when opened */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${policy.id}-body`}
                      initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-(--jla-line)"
                    >
                      <div className="px-5 sm:px-6 pb-6">
                        <DocumentReader document={doc} resource={policy} idPrefix={policy.id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PoliciesSection;