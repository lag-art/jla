import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import ImagePlaceholder from "./ImagePlaceholder";

// common / Card
// One Card powers every card-shaped surface on the site — Resources docs,
// Leadership members, Media gallery items, Home previews — so its
// heuristics exist to keep 20+ call sites from each reinventing markup.
//
// Heuristics baked in:
//   - Polymorphic like Button: pass `to` -> whole card is a <Link>;
//     pass `href` -> external <a>; neither -> a static, non-clickable card.
//     Nested interactive elements (e.g. a footer button) still work because
//     the wrapper only intercepts clicks that bubble from non-interactive
//     children — see `onClickCapture` guard below.
//   - `image` falls back to ImagePlaceholder automatically when omitted,
//     so a Card never renders a broken/empty media slot mid-build.
//   - `ratio` accepts a CSS aspect-ratio string ("4/3", "1/1", "16/9") and
//     defaults per `orientation` (portrait for people, landscape for docs)
//     so LeadershipMemberCard and ConstitutionSection don't have to agree
//     on one shape.
//   - stamped corner (matches SectionTitle's docket motif) is skippable
//     via `showCorner={false}` for dense grids (e.g. GalleryGrid) where
//     20 corner marks would just be noise.
//   - scroll-reveal + hover-lift both respect prefers-reduced-motion.

const ORIENTATION_RATIO = {
  landscape: "4/3",
  portrait: "3/4",
  square: "1/1",
  wide: "16/9",
};

const Card = ({
  to,
  href,
  image,
  imageAlt,
  orientation = "landscape",
  ratio,
  tag,
  title,
  meta,
  children,
  footer,
  showCorner = true,
  tone = "light",
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isInteractive = Boolean(to || href);
  const aspectRatio = ratio || ORIENTATION_RATIO[orientation] || ORIENTATION_RATIO.landscape;

  const toneClasses =
    tone === "dark"
      ? "bg-[var(--jla-navy-800)] border-[var(--jla-navy-700)] text-white"
      : "bg-white border-[var(--jla-line)] text-[var(--jla-ink)]";

  const baseClasses = [
    "group relative flex flex-col overflow-hidden rounded-md border",
    "transition-[border-color,transform,box-shadow] duration-200 ease-out",
    toneClasses,
    isInteractive ? "hover:border-[var(--jla-gold)] hover:shadow-[var(--shadow-md)] cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        whileHover: isInteractive ? { y: -4 } : {},
      };

  const inner = (
    <>
      {showCorner && (
          <span
            aria-hidden="true"
            className={`absolute top-0 right-0 z-10 border-t-22 border-r-0 border-l-22 border-b-0 border-solid ${
              tone === "dark"
                ? "border-t-(--jla-gold) border-l-transparent"
                : "border-t-(--jla-gold) border-l-transparent"
            }`}
          style={{ borderStyle: "solid", borderWidth: "0 22px 22px 0", borderColor: "transparent var(--jla-gold) transparent transparent" }}
        />
      )}

      <div className="w-full overflow-hidden bg-(--jla-paper)" style={{ aspectRatio }}>
        {image ? (
          <img
            src={image}
            alt={imageAlt || title || ""}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-2">
        {tag && (
          <span className="font-mono text-[11px] tracking-wider uppercase text-(--jla-gold-600)">
            {tag}
          </span>
        )}
        {title && (
          <h3 className="font-(--font-display) text-lg sm:text-xl leading-snug">
            {title}
          </h3>
        )}
        {children && (
          <div
            className={`text-sm sm:text-base leading-relaxed ${
              tone === "dark" ? "text-(--jla-navy-100)/80" : "text-(--jla-slate)"
            }`}
          >
            {children}
          </div>
        )}
        {meta && <div className="mt-auto pt-2 text-xs text-(--jla-slate)">{meta}</div>}
      </div>

      {footer && (
        <div
          className={`px-5 sm:px-6 py-4 border-t ${
            tone === "dark" ? "border-(--jla-navy-700)" : "border-(--jla-line)"
          }`}
          onClickCapture={(e) => e.stopPropagation()}
        >
          {footer}
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={baseClasses}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div {...motionProps}>
        <a href={href} target="_blank" rel="noreferrer" className={baseClasses}>
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div className={baseClasses} {...motionProps}>
      {inner}
    </motion.div>
  );
};

export default Card;