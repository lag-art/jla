import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// common / ImagePlaceholder
// The site's universal <img> wrapper. Every section that isn't ready with
// real photography yet (most of the site, right now) should render this
// instead of a bare <img>, so swapping in real images later never means
// hunting down markup — just passing a real `src`.
//
// Heuristics baked in:
//   - `variant` (1-8) maps to /assets/images/placeholders/imageN.svg — pass
//     variant={3} instead of hand-typing a path. Omit both `src` and
//     `variant` and it defaults to image1 (the designated generic mark).
//   - Self-healing: if a real `src` 404s (broken upload, bad CMS link), it
//     automatically falls back to image1 rather than showing a browser
//     broken-image icon. Guarded so it can only fall back once, never loops.
//   - `ratio` reserves space via aspect-ratio BEFORE the image loads, so
//     the layout never shifts (CLS) regardless of the source image's real
//     dimensions — this is what makes it "highly responsive," not just
//     percentage widths.
//   - Shimmer skeleton shows while loading and fades out on load, and is
//     replaced by a static tone (no animation) under prefers-reduced-motion.
//   - `priority` flips loading="eager" + fetchPriority="high" for the one
//     or two above-the-fold images per page (e.g. HeroSection); every other
//     usage lazy-loads by default without the caller having to think about it.
//   - `alt` falls back to a real, non-empty branded string rather than "" —
//     an empty alt on a placeholder still reads as a content gap to
//     screen-reader users, which "" would incorrectly mark as decorative.

const VARIANT_COUNT = 8;
const variantSrc = (n) => `/assets/images/placeholders/image${n}.svg`;
const DEFAULT_SRC = variantSrc(1);

const ROUNDED = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const FIT = {
  cover: "object-cover",
  contain: "object-contain",
};

const ImagePlaceholder = ({
  src,
  variant,
  alt = "Juris Leadership Alliance — image placeholder",
  ratio = "4/3",
  fit = "cover",
  position = "center",
  rounded = "md",
  priority = false,
  shimmer = true,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const hasFallenBack = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedVariant =
    variant && variant >= 1 && variant <= VARIANT_COUNT ? variant : null;
  const initialSrc = src || (resolvedVariant ? variantSrc(resolvedVariant) : DEFAULT_SRC);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  const handleError = () => {
    if (!hasFallenBack.current) {
      hasFallenBack.current = true;
      setCurrentSrc(DEFAULT_SRC);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-(--jla-navy-100) ${ROUNDED[rounded] || ROUNDED.md} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {shimmer && !loaded && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-(--jla-navy-100) via-white to-(--jla-navy-100)"
          style={{ backgroundSize: "200% 100%" }}
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { backgroundPosition: ["0% 0%", "200% 0%"] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1.4, repeat: Infinity, ease: "linear" }
          }
        />
      )}

      <img
        src={currentSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`w-full h-full ${FIT[fit] || FIT.cover} transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition: position }}
      />
    </div>
  );
};

export default ImagePlaceholder;