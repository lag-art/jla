import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaImages,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import Modal from "../common/Modal";
import ImagePlaceholder from "../common/ImagePlaceholder";
import mediaItems from "../../data/mediaItems";

// media / GalleryGrid
// The Media page's main gallery. id="gallery" because MediaHero's
// "Browse the gallery" chip links to #gallery — renaming it breaks that.
//
// WHY THIS ISN'T JUST MediaPreview AT FULL SIZE
// MediaPreview shows five items and opens one in a lightbox. A real
// gallery has to let you move BETWEEN images once you're in the lightbox —
// otherwise every image means close, find the next one, reopen. So this
// adds prev/next, arrow-key navigation, wrap-around at the ends, and a
// position counter. That navigation is the actual difference between a
// preview and a gallery.
//
// Heuristics baked in:
//   - Filters are derived from what's in the data. If the gallery is all
//     photos, no filter bar renders at all — a filter with one option is
//     a control that can't do anything. Each filter shows its count so
//     nobody clicks "Videos" to find one item.
//   - Lightbox navigation moves within the FILTERED set, not the whole
//     gallery. Filtering to videos and pressing next should stay on
//     videos; jumping to a photo would silently undo the filter.
//   - Bento spans are computed from position in the filtered list, not
//     hardcoded per item — so the layout stays balanced no matter which
//     filter is active or how many items exist.
//   - Arrow keys are bound only while the lightbox is open, and removed
//     on close, so they never hijack normal page scrolling.
//   - Every tile is a real <button> with a descriptive label rather than
//     a clickable div, so the gallery is keyboard-navigable and each item
//     announces what it opens.
//   - Videos are marked by data (type === "video"), never by a hardcoded
//     index, and the play affordance is always visible on touch rather
//     than hover-only — a hover-revealed control is unreachable on a phone.

const FILTERS = [
  { id: "all", label: "All" },
  { id: "photo", label: "Photos" },
  { id: "video", label: "Videos" },
];

// Deterministic bento pattern: every 6th tile is wide, every 6th offset by
// 3 is tall. Based on index within the filtered list so the rhythm holds
// under any filter.
const spanFor = (index) => {
  const slot = index % 6;
  if (slot === 0) return "sm:col-span-2 sm:row-span-2";
  if (slot === 3) return "sm:row-span-2";
  return "";
};

const GalleryGrid = () => {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(null);

  const counts = useMemo(
    () => ({
      all: mediaItems.length,
      photo: mediaItems.filter((m) => m.type === "photo").length,
      video: mediaItems.filter((m) => m.type === "video").length,
    }),
    []
  );

  // Only offer filters that would actually change what's shown.
  const availableFilters = useMemo(
    () => FILTERS.filter((f) => counts[f.id] > 0),
    [counts]
  );
  const showFilters = availableFilters.length > 2;

  const visible = useMemo(
    () => (filter === "all" ? mediaItems : mediaItems.filter((m) => m.type === filter)),
    [filter]
  );

  const activeItem = activeIndex != null ? visible[activeIndex] : null;

  const step = useCallback(
    (delta) => {
      setActiveIndex((i) => {
        if (i == null || visible.length === 0) return i;
        // Wrap at both ends — reaching the last image and being stuck is
        // a dead end in a viewer whose whole job is moving through a set.
        return (i + delta + visible.length) % visible.length;
      });
    },
    [visible.length]
  );

  // Arrow keys, bound only while the lightbox is open.
  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, step]);

  // Changing filter while the lightbox is open would leave activeIndex
  // pointing into a different list. Close instead of showing a surprise.
  const changeFilter = (id) => {
    setActiveIndex(null);
    setFilter(id);
  };

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section id="gallery" className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionTitle
            docket="18"
            eyebrow="Gallery"
            title="Every frame, on the record."
            description="Photographs and video from the Alliance's summits, outreach, and proceedings."
          />

          {showFilters && (
            <div
              role="group"
              aria-label="Filter gallery by type"
              className="flex flex-wrap gap-2 shrink-0"
            >
              {availableFilters.map((f) => {
                const isActive = filter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => changeFilter(f.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
                      isActive
                        ? "bg-(--jla-navy) text-white"
                        : "border border-(--jla-line) text-(--jla-navy) hover:border-(--jla-gold)"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`font-mono text-[10px] ${
                        isActive ? "text-white/60" : "text-(--jla-slate)/60"
                      }`}
                    >
                      {counts[f.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="mt-12 py-12 text-center text-(--jla-slate)">
            Nothing here yet.
          </p>
        ) : (
          <motion.ul
            {...reveal}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(0,10rem)] sm:auto-rows-[minmax(0,11rem)] gap-3 sm:gap-4 mt-10 sm:mt-12"
          >
            {visible.map((item, i) => (
              <li key={item.id} className={spanFor(i)}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Open ${item.title}${
                    item.type === "video" ? " (video)" : ""
                  }`}
                  className="group relative w-full h-full overflow-hidden rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2"
                >
                  <ImagePlaceholder
                    src={item.image}
                    ratio="1/1"
                    rounded="md"
                    alt={item.title}
                    className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950)/90 via-(--jla-navy-950)/15 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Always visible, not hover-only — unreachable on touch */}
                  {item.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 text-(--jla-navy-950) group-hover:bg-(--jla-gold) transition-colors duration-200">
                        <FaPlay aria-hidden="true" className="ml-0.5 text-sm" />
                      </span>
                    </span>
                  )}

                  <span className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between gap-2">
                    <span className="text-white text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                      {item.title}
                    </span>
                    <FaExpand
                      aria-hidden="true"
                      className="shrink-0 text-white/0 group-hover:text-white/80 text-[11px] transition-colors duration-200"
                    />
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Lightbox — navigation is what makes this a gallery, not a preview */}
      <Modal
        isOpen={activeItem != null}
        onClose={() => setActiveIndex(null)}
        title={activeItem?.title}
        size="lg"
      >
        {activeItem && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <ImagePlaceholder
                src={activeItem.image}
                ratio="16/9"
                rounded="md"
                alt={activeItem.title}
                className="w-full"
              />

              {visible.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous item"
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-(--jla-navy-950)/70 text-white hover:bg-(--jla-navy-950) transition-colors duration-200"
                  >
                    <FaChevronLeft aria-hidden="true" className="text-xs" />
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next item"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-(--jla-navy-950)/70 text-white hover:bg-(--jla-navy-950) transition-colors duration-200"
                  >
                    <FaChevronRight aria-hidden="true" className="text-xs" />
                  </button>
                </>
              )}
            </div>

            <p className="text-sm text-(--jla-slate) leading-relaxed">{activeItem.caption}</p>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-(--jla-line)">
              <span className="flex items-center gap-2 font-mono text-[11px] text-(--jla-slate)">
                <FaImages aria-hidden="true" />
                {activeIndex + 1} of {visible.length}
                {filter !== "all" && (
                  <span className="text-(--jla-slate)/60">
                    · {FILTERS.find((f) => f.id === filter)?.label.toLowerCase()}
                  </span>
                )}
              </span>
              <span className="hidden sm:block font-mono text-[10px] text-(--jla-slate)/60">
                Use ← → to move between items
              </span>
            </div>

            {activeItem.type === "video" && (
              <p className="text-sm text-(--jla-navy) bg-(--jla-navy-100) rounded-md px-4 py-3">
                Video playback isn’t wired up yet — this is the thumbnail. Add
                the source to this item in <code>data/mediaItems.js</code> when
                the file is available.
              </p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default GalleryGrid;