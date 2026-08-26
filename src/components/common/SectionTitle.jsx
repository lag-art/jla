import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// common / SectionTitle
// The site's signature structural device — every section opens with a
// docket-style eyebrow ("DOCKET NO. 01") above its heading.
//
// Heuristics baked in (so callers rarely need to override anything):
//   - `docket` accepts a number OR string: 1 -> auto-padded to "01".
//   - `id` is auto-derived by slugifying `title` if not passed explicitly,
//     so ResourcesSideNav / any anchor-nav can jump straight to a section
//     without every page having to invent + wire its own ids by hand.
//   - `tone="dark"` flips the palette for use on navy hero/footer sections;
//     default "light" targets the paper background used everywhere else.
//   - the eyebrow row renders only if `docket` or `eyebrow` is actually
//     passed — no empty reserved space on sections that don't need one.
//   - heading level (`as`) defaults to h2, but a page's single H1 (usually
//     in a Hero) can pass as="h1" without duplicating this component.
//   - scroll-triggered reveal via framer-motion, auto-disabled when the
//     user has prefers-reduced-motion set (useReducedMotion), so the same
//     component is safe by default rather than needing an opt-out per use.

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const TONE = {
  light: {
    docket: "text-[var(--jla-gold-600)] border-[var(--jla-gold-600)]",
    label: "text-[var(--jla-slate)]",
    heading: "text-[var(--jla-navy)]",
    desc: "text-[var(--jla-slate)]",
  },
  dark: {
    docket: "text-[var(--jla-gold)] border-[var(--jla-gold)]",
    label: "text-[var(--jla-navy-100)]/80",
    heading: "text-white",
    desc: "text-[var(--jla-navy-100)]/80",
  },
};

const ALIGN = {
  left: "text-left items-start",
  center: "text-center items-center mx-auto",
  right: "text-right items-end ml-auto",
};

const SectionTitle = ({
  docket,
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  id,
  maxWidth = "32ch",
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const palette = TONE[tone] || TONE.light;
  const alignClasses = ALIGN[align] || ALIGN.left;
  const sectionId = id || (title ? slugify(title) : undefined);

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <motion.div
      className={`flex flex-col gap-3 mb-10 sm:mb-12 scroll-mt-24 ${alignClasses} ${className}`}
      {...reveal}
    >
      {(docket || eyebrow) && (
        <div
          className={`flex items-center gap-3 ${
            align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          {docket && (
            <span
              className={`font-mono text-[10px] sm:text-xs tracking-[0.08em] border px-2 py-0.5 rounded-sm whitespace-nowrap ${palette.docket}`}
            >
              DOCKET NO. {typeof docket === "number" ? String(docket).padStart(2, "0") : docket}
            </span>
          )}
          {eyebrow && (
            <span className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.08em] ${palette.label}`}>
              {eyebrow}
            </span>
          )}
        </div>
      )}

      <Heading
        id={sectionId}
        className={`font-semibold leading-[1.15] text-[clamp(1.75rem,1.1rem+2.8vw,3.5rem)] ${
          align === "center" ? "mx-auto" : ""
        } ${palette.heading}`}
        style={{ maxWidth: align === "center" ? "none" : maxWidth, fontFamily: "var(--font-display)" }}
      >
        {title}
      </Heading>

      {description && (
        <p
          className={`font-(--font-body) text-base sm:text-lg leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          } ${palette.desc}`}
          style={{ maxWidth: "56ch" }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;