import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaMagnifyingGlass,
  FaXmark,
  FaDownload,
  FaLink,
  FaCheck,
  FaListUl,
  FaChevronDown,
  FaCircleInfo,
} from "react-icons/fa6";

// common / DocumentReader
// One reader for every governing document the Alliance publishes.
//
// THE PROBLEM IT SOLVES
// The four source documents have genuinely different shapes: the
// Constitution has `articles` with real titles; the Attendance Policy and
// Disciplinary Act have `clauses` whose text IS their heading; the Gender
// Policy has titled `sections`. Their sub-lists use four different numeral
// formats (decimal, i., I., a). Writing a reader per document would mean
// four places to fix every bug. Instead this normalises whatever it is
// given into one internal shape, so a fifth document (the Manifesto)
// costs nothing.
//
// HEURISTICS
//   - Section array is auto-detected (articles | clauses | sections), so
//     documents don't have to agree on a key name.
//   - Section titles are derived when absent: a clause whose text is its
//     own heading gets a trimmed version for the nav, with the full text
//     still rendered in the body. No hand-written duplicate titles that
//     could drift from the clause they label.
//   - Numerals are rendered from the `numeral` recorded at conversion
//     time, so sub-lists appear as they do in the signed document. A
//     policy that says "6(II)" must render II, not 2.
//   - Search filters sections AND highlights matches inside them, matching
//     against every block's text — someone looking for "fine" should find
//     it whether it sits in a clause, a definition, or a list item.
//   - Anchors use scroll-mt tied to --sticky-nav-offset (published by
//     MainLayout), so a deep link never lands under the sticky Navbar.
//   - Per-section copy-link, because the practical use of a constitution
//     is sending someone a specific article.
//   - Download button renders ONLY when pdfUrl exists — no dead affordance
//     for the Manifesto, which has no file yet.
//   - `certification.adopted === false` renders an explicit "no adoption
//     date recorded" notice rather than silently omitting it. Every one of
//     these documents has a blank signature date; a reader deserves to
//     know the document's status, not be left to assume.
//   - Reading progress and scroll-spy both respect prefers-reduced-motion.
//   - `idPrefix` namespaces anchors when more than one document is rendered
//     on the same page. The Disciplinary Act and the Attendance Policy BOTH
//     number their provisions clause-1..clause-7, so on the Resources hub
//     their anchors would collide: duplicate DOM ids (invalid HTML) and a
//     copy-link for one document's clause 3 that jumps to the other's.
//     Passing idPrefix="attendance-policy" yields
//     #attendance-policy--clause-3. Data keeps its clean ids; only the
//     rendered anchors are namespaced. Omit the prefix when a document is
//     alone on its page (the Constitution's article-N ids are unique).

// ---------- numeral rendering -------------------------------------------

const ROMAN = [
  [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
  [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
];

const toRoman = (n) => {
  let out = "";
  let rest = n;
  for (const [v, s] of ROMAN) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
};

const toLetter = (n) => {
  // 1->a, 26->z, 27->aa (spreadsheet-style, so long lists never collide)
  let out = "";
  let rest = n;
  while (rest > 0) {
    const rem = (rest - 1) % 26;
    out = String.fromCharCode(97 + rem) + out;
    rest = Math.floor((rest - 1) / 26);
  }
  return out;
};

// `start` is a zero-based offset for numeral sequences that are interrupted
// by a nested list and must RESUME rather than restart. Attendance Policy
// clause 6 is the case that requires it: its upperRoman run is broken by a
// nested list and resumes at II. Ignoring `start` would restart it at I. and
// break that document's own "article 6(II)" cross-reference.
const formatNumeral = (index, numeral, start = 0) => {
  const n = index + 1 + start;
  switch (numeral) {
    case "lowerRoman":
      return `${toRoman(n)}.`;
    case "upperRoman":
      return `${toRoman(n).toUpperCase()}.`;
    case "lowerLetter":
      return `${toLetter(n)})`;
    case "upperLetter":
      return `${toLetter(n).toUpperCase()})`;
    default:
      return `${n}.`;
  }
};

// ---------- normalisation ------------------------------------------------

const SECTION_KEYS = ["articles", "clauses", "sections"];

const deriveTitle = (section, label, maxLen = 64) => {
  if (section.title) return section.title;
  const raw = (section.text || "").replace(/[;:]\s*$/, "");
  if (raw.length <= maxLen) return raw;
  const cut = raw.slice(0, maxLen);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : maxLen)}…`;
};

const normalizeDocument = (doc) => {
  const key = SECTION_KEYS.find((k) => Array.isArray(doc?.[k]));
  const raw = key ? doc[key] : [];
  const label = doc?.sectionLabel || "Section";

  const sections = raw.map((s) => ({
    id: s.id,
    number: s.number,
    title: deriveTitle(s, label),
    // A clause whose text doubles as its heading shouldn't have that text
    // repeated as a body paragraph directly beneath itself.
    lead: s.title ? null : s.text || null,
    intro: s.title ? s.text || null : null,
    blocks: s.blocks || [],
  }));

  // The Constitution carries a preamble; the policies carry an intro
  // paragraph. Both are "content before section 1" — treated identically.
  const opening = doc?.preamble
    ? {
        id: doc.preamble.id || "preamble",
        title: doc.preamble.title || "Preamble",
        text: doc.preamble.text,
      }
    : doc?.intro
    ? { id: "introduction", title: "Introduction", text: doc.intro }
    : null;

  return { label, opening, sections };
};

const blockText = (b) =>
  [b.text, b.term, ...(b.items || [])].filter(Boolean).join(" ");

const sectionMatches = (section, q) => {
  if (!q) return true;
  const hay = [
    section.title,
    section.lead,
    section.intro,
    ...section.blocks.map(blockText),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
};

// ---------- match highlighting ------------------------------------------

const Highlight = ({ text, query }) => {
  if (!query || !text) return text || null;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-(--jla-gold)/40 text-inherit rounded-sm px-0.5">
        {text.slice(i, i + query.length)}
      </mark>
      <Highlight text={text.slice(i + query.length)} query={query} />
    </>
  );
};

// ---------- block renderer ----------------------------------------------

const Block = ({ block, query }) => {
  if (block.type === "heading") {
    return (
      <h4 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-base mt-6 mb-2">
        <Highlight text={block.text} query={query} />
      </h4>
    );
  }

  if (block.type === "definition") {
    return (
      <div className="grid sm:grid-cols-[minmax(7rem,12rem)_1fr] gap-1 sm:gap-4 py-2.5 border-b border-(--jla-line) last:border-0">
        <dt className="font-semibold text-(--jla-navy) text-sm">
          <Highlight text={block.term} query={query} />
        </dt>
        <dd className="text-(--jla-slate) text-sm leading-relaxed">
          <Highlight text={block.text} query={query} />
        </dd>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="flex flex-col gap-2 my-3">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-(--jla-slate) text-sm sm:text-base leading-relaxed">
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-xs text-(--jla-gold-600) pt-1 w-7 text-right tabular-nums"
            >
              {formatNumeral(i, block.numeral, block.start)}
            </span>
            <span>
              <Highlight text={item} query={query} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="text-(--jla-slate) text-sm sm:text-base leading-relaxed my-3">
      <Highlight text={block.text} query={query} />
    </p>
  );
};

// ---------- main component ----------------------------------------------

const DocumentReader = ({ document: doc, resource = {}, idPrefix = "" }) => {
  // See idPrefix note in the header — prevents anchor collisions between
  // documents that use the same clause numbering on one page.
  const anchorId = (id) => (idPrefix ? `${idPrefix}--${id}` : id);
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef(null);

  const { label, opening, sections } = useMemo(
    () => normalizeDocument(doc),
    [doc]
  );

  const visible = useMemo(
    () => sections.filter((s) => sectionMatches(s, query)),
    [sections, query]
  );

  // Scroll-spy — tracks which section is currently in view.
  useEffect(() => {
    const nodes = visible
      .map((s) => window.document.getElementById(anchorId(s.id)))
      .filter(Boolean);
    if (nodes.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveId(top.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [visible]);

  // Reading progress through the document body.
  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return setProgress(rect.top <= 0 ? 100 : 0);
      const done = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(Math.round(done * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyLink = async (id) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable (insecure context / denied) — the anchor
      // still works, so this degrades to "nothing visibly happened"
      // rather than throwing.
    }
  };

  if (!doc) return null;

  const nav = (
    <ol className="flex flex-col gap-0.5">
      {opening && (
        <li>
          <a
            href={`#${anchorId(opening.id)}`}
            className={`block py-1.5 pl-3 border-l-2 text-sm transition-colors duration-150 ${
              activeId === anchorId(opening.id)
                ? "border-(--jla-gold) text-(--jla-gold-600) font-semibold"
                : "border-(--jla-line) text-(--jla-slate) hover:text-(--jla-navy) hover:border-(--jla-slate)"
            }`}
          >
            {opening.title}
          </a>
        </li>
      )}
      {visible.map((s) => (
        <li key={s.id}>
          <a
            href={`#${anchorId(s.id)}`}
            onClick={() => setNavOpen(false)}
            className={`flex gap-2 py-1.5 pl-3 border-l-2 text-sm transition-colors duration-150 ${
              activeId === anchorId(s.id)
                ? "border-(--jla-gold) text-(--jla-gold-600) font-semibold"
                : "border-(--jla-line) text-(--jla-slate) hover:text-(--jla-navy) hover:border-(--jla-slate)"
            }`}
          >
            {s.number != null && (
              <span className="font-mono text-xs shrink-0 tabular-nums pt-0.5">
                {String(s.number).padStart(2, "0")}
              </span>
            )}
            <span className="min-w-0">{s.title}</span>
          </a>
        </li>
      ))}
      {visible.length === 0 && (
        <li className="py-2 pl-3 text-sm text-(--jla-slate)">No matches</li>
      )}
    </ol>
  );

  return (
    <div className="relative">
      {/* Reading progress */}
      <div
        aria-hidden="true"
        className="sticky top-(--sticky-nav-offset,5rem) z-10 h-0.5 bg-(--jla-line)"
      >
        <div
          className="h-full bg-(--jla-gold) transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-[16rem_1fr] gap-8 lg:gap-12 mt-6">
        {/* Nav — sticky rail on desktop, collapsible on mobile */}
        <aside className="lg:sticky lg:top-[calc(var(--sticky-nav-offset,5rem)+2rem)] h-fit">
          <div className="flex items-center gap-2 mb-3">
            <FaMagnifyingGlass aria-hidden="true" className="text-(--jla-slate) text-xs shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search this ${label.toLowerCase()}…`}
              aria-label={`Search the ${doc.shortTitle || doc.title}`}
              className="w-full bg-transparent border-b border-(--jla-line) py-1.5 text-sm text-(--jla-navy) placeholder:text-(--jla-slate)/70 focus:outline-none focus:border-(--jla-gold)"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-(--jla-slate) hover:text-(--jla-navy) shrink-0"
              >
                <FaXmark className="text-xs" />
              </button>
            )}
          </div>

          {query && (
            <p className="text-xs text-(--jla-slate) mb-3" role="status">
              {visible.length} of {sections.length} {label.toLowerCase()}
              {sections.length === 1 ? "" : "s"} match
            </p>
          )}

          <button
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            className="lg:hidden flex items-center justify-between w-full py-2 text-sm font-semibold text-(--jla-navy) border-b border-(--jla-line)"
          >
            <span className="flex items-center gap-2">
              <FaListUl aria-hidden="true" className="text-xs" /> Contents
            </span>
            <FaChevronDown
              aria-hidden="true"
              className={`text-xs transition-transform duration-200 ${navOpen ? "rotate-180" : ""}`}
            />
          </button>

          <nav
            aria-label={`${doc.shortTitle || doc.title} contents`}
            className={`${navOpen ? "block" : "hidden"} lg:block mt-3`}
          >
            {nav}
          </nav>

          {resource.pdfUrl && (
            <a
              href={resource.pdfUrl}
              download
              className="hidden lg:inline-flex items-center gap-2 mt-6 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) border border-(--jla-navy) rounded-sm px-4 py-2.5 hover:bg-(--jla-navy) hover:text-white transition-colors duration-200"
            >
              <FaDownload aria-hidden="true" /> Download PDF
            </a>
          )}
        </aside>

        {/* Document body */}
        <article ref={bodyRef} className="min-w-0">
          {opening && (
            <section
              id={anchorId(opening.id)}
              className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] mb-10 pb-8 border-b border-(--jla-line)"
            >
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-(--jla-gold-600) mb-3">
                {opening.title}
              </h3>
              <p className="text-(--jla-navy) text-base sm:text-lg leading-relaxed font-(family-name:--font-display)">
                <Highlight text={opening.text} query={query} />
              </p>
            </section>
          )}

          {visible.map((s, i) => (
            <motion.section
              key={s.id}
              id={anchorId(s.id)}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] py-6 border-b border-(--jla-line) last:border-0"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl text-(--jla-navy) leading-snug">
                  {s.number != null && (
                    <span className="text-(--jla-gold-600) mr-2">
                      {label} {s.number}
                      {s.title ? "." : ""}
                    </span>
                  )}
                  {s.title && <Highlight text={s.title} query={query} />}
                </h3>

                <button
                  onClick={() => copyLink(anchorId(s.id))}
                  aria-label={`Copy link to ${label} ${s.number}`}
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-(--jla-slate) hover:bg-(--jla-navy-100) hover:text-(--jla-navy) transition-colors duration-150"
                >
                  {copiedId === s.id ? (
                    <FaCheck aria-hidden="true" className="text-xs text-(--jla-gold-600)" />
                  ) : (
                    <FaLink aria-hidden="true" className="text-xs" />
                  )}
                </button>
              </div>

              {/* Untitled clauses: the clause text IS the provision, so it
                  renders as body copy rather than being repeated as a heading */}
              {s.lead && (
                <p className="text-(--jla-slate) text-sm sm:text-base leading-relaxed mt-2">
                  <Highlight text={s.lead} query={query} />
                </p>
              )}
              {s.intro && (
                <p className="text-(--jla-slate) text-sm sm:text-base leading-relaxed mt-2">
                  <Highlight text={s.intro} query={query} />
                </p>
              )}

              {s.blocks.length > 0 && (
                <div className={s.blocks.some((b) => b.type === "definition") ? "mt-3" : ""}>
                  {s.blocks.map((b, bi) => (
                    <Block key={bi} block={b} query={query} />
                  ))}
                </div>
              )}
            </motion.section>
          ))}

          {visible.length === 0 && (
            <p className="py-12 text-center text-(--jla-slate)">
              Nothing in this document matches “{query}”.
            </p>
          )}

          {/* Certification — status is stated plainly, never implied */}
          {doc.certification && (
            <section className="mt-10 pt-8 border-t border-(--jla-line)">
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-(--jla-gold-600) mb-3">
                Certification
              </h3>
              <p className="text-(--jla-slate) text-sm leading-relaxed">
                {doc.certification.text}
              </p>

              {doc.certification.adopted === false && (
                <p className="flex items-start gap-2 mt-4 text-sm text-(--jla-navy) bg-(--jla-navy-100) rounded-md px-4 py-3">
                  <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0 text-(--jla-gold-600)" />
                  <span>
                    The signed copy of this document does not record an adoption
                    date, so none is shown here.
                  </span>
                </p>
              )}

              {doc.certification.signatories?.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  {doc.certification.signatories.map((s) => (
                    <li key={s} className="text-xs text-(--jla-slate)">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {resource.pdfUrl && (
            <a
              href={resource.pdfUrl}
              download
              className="lg:hidden inline-flex items-center justify-center gap-2 w-full mt-8 text-xs font-semibold uppercase tracking-wide text-white bg-(--jla-navy) rounded-sm px-4 py-3.5"
            >
              <FaDownload aria-hidden="true" /> Download PDF
            </a>
          )}
        </article>
      </div>
    </div>
  );
};

export default DocumentReader;