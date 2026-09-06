import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaCamera, FaPlay, FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../common/Breadcrumb";
import mediaItems from "../../data/mediaItems";

// media / MediaHero
// The Media page hero — renders this page's single <h1>.
//
// WHY THIS ONE LOOKS DIFFERENT FROM THE OTHER HEROES
// AboutHero, LeadershipHero and ResourcesHero all sit on a single
// background image with a texture overlay. A page whose entire subject is
// photographs should show photographs — so the backdrop here is a mosaic
// built from the real gallery in data/mediaItems.js, not a stock frame.
// It keeps the same banner height, gradient treatment and Breadcrumb as
// its siblings, so the site still reads as one site; only the backdrop
// changes, which is the one thing this page has a reason to differ on.
//
// Heuristics baked in:
//   - Counts are COMPUTED from mediaItems (photos vs videos), never
//     written in. Adding a video updates the hero automatically; a
//     hardcoded "5 photos" quietly becomes false on the next upload.
//   - Each count renders only if that type actually exists, so a gallery
//     with no video yet doesn't advertise "0 videos".
//   - The mosaic degrades: with no media at all it renders nothing and
//     the gradient alone carries the hero, rather than leaving empty
//     boxes. The tile count adapts to what's available instead of
//     assuming a fixed grid.
//   - Mosaic tiles are aria-hidden and alt="" — they're a backdrop. The
//     real, described images live in the gallery below; announcing them
//     twice would make a screen reader read the page's contents in the
//     header.
//   - The slow drift on the mosaic is decorative and disabled under
//     prefers-reduced-motion — a moving background behind a headline is
//     exactly the kind of motion that causes trouble.

const MediaHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const stats = useMemo(() => {
    const photos = mediaItems.filter((m) => m.type === "photo").length;
    const videos = mediaItems.filter((m) => m.type === "video").length;
    return { photos, videos, total: mediaItems.length };
  }, []);

  // Enough tiles to fill the widest grid, repeating only if the gallery is
  // smaller than the mosaic — never padding with blanks.
  const tiles = useMemo(() => {
    if (mediaItems.length === 0) return [];
    const target = 8;
    return Array.from({ length: Math.min(target, Math.max(mediaItems.length, 4)) }, (_, i) => ({
      key: `tile-${i}`,
      src: mediaItems[i % mediaItems.length].image,
    }));
  }, []);

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white min-h-80 sm:min-h-95 lg:min-h-110 flex items-end">
      {/* Mosaic backdrop, built from the real gallery */}
      {tiles.length > 0 && (
        <div className="absolute inset-0 -z-10">
          <motion.div
            aria-hidden="true"
            animate={shouldReduceMotion ? {} : { y: ["0%", "-3%", "0%"] }}
            transition={
              shouldReduceMotion
                ? {}
                : { duration: 24, repeat: Infinity, ease: "easeInOut" }
            }
            className="grid grid-cols-3 sm:grid-cols-4 h-[115%] w-full"
          >
            {tiles.map((tile) => (
              <div key={tile.key} className="relative overflow-hidden">
                <img
                  src={tile.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          {/* Gradient is what makes the headline legible regardless of
              which photos end up in the mosaic — legibility never depends
              on the images being dark enough. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/90 to-(--jla-navy-950)/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-(--jla-navy-950)/35"
          />
        </div>
      )}

      <motion.div
        {...reveal}
        className="relative max-w-(--container-max) mx-auto px-(--container-padding) pt-20 pb-10 sm:pb-12 lg:pb-14 w-full"
      >
        <Breadcrumb items={[{ label: "Media" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Media
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          The Alliance, in frame.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl">
          Summits, outreach days, moot courts and townhalls the work of the
          Alliance as it actually happened.
        </p>

        {/* Computed counts — see heuristics note */}
        {stats.total > 0 && (
          <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-7 pt-6 border-t border-white/15">
            {stats.photos > 0 && (
              <div className="flex items-center gap-2.5">
                <FaCamera aria-hidden="true" className="text-(--jla-gold) text-sm" />
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-white/50">
                    Photograph{stats.photos === 1 ? "" : "s"}
                  </dt>
                  <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl">
                    {stats.photos}
                  </dd>
                </div>
              </div>
            )}

            {stats.videos > 0 && (
              <div className="flex items-center gap-2.5">
                <FaPlay aria-hidden="true" className="text-(--jla-gold) text-sm" />
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-white/50">
                    Video{stats.videos === 1 ? "" : "s"}
                  </dt>
                  <dd className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl">
                    {stats.videos}
                  </dd>
                </div>
              </div>
            )}

            <a
              href="#gallery"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85 hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) transition-colors duration-200"
            >
              Browse the gallery
              <FaArrowDown
                aria-hidden="true"
                className="text-[9px] transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>
          </dl>
        )}
      </motion.div>
    </section>
  );
};

export default MediaHero;