import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaPlay } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import Button from "../common/Button";
import Modal from "../common/Modal";
import mediaItems from "../../data/mediaItems";
import ROUTES from "../../routes/routePaths";

// home / MediaPreview
// Fifth (final) homepage preview section — a bento-style gallery teaser.
//
// Heuristics baked in:
//   - No individual media item has a real page yet — only the /media hub
//     does — so items are NOT rendered as links to fake per-item routes.
//     Clicking one opens Modal.jsx as a lightbox instead: real, working
//     interactivity that doesn't depend on a destination that doesn't
//     exist. A single "View Full Gallery" CTA points at the one real
//     destination, ROUTES.MEDIA.
//   - Same 5-into-(1 featured + 4 grid) split as ResourcesPreview, for
//     the same reason: 5 doesn't divide evenly into 2 or 3 columns
//     without an orphaned item, but does once one item is pulled out as
//     a larger feature and 4 remain. Repeating the same numeric pattern
//     across sections is deliberate visual consistency, not coincidence.
//   - `type === "video"` items get a play-button overlay automatically —
//     the grid item component branches on data, not on a hardcoded list
//     of "which items are videos."
//   - The Modal body itself is honest about what it can show: a photo
//     item shows the full-size image; a video item shows the thumbnail
//     plus a note that the real video lives on the Media page, rather
//     than embedding a fake <video> tag with no actual source.

const GalleryItem = ({ item, onOpen, className = "", ratio = "4/3" }) => (
  <button
    type="button"
    onClick={() => onOpen(item)}
    className={`group relative block w-full overflow-hidden rounded-md text-left ${className}`}
  >
    <ImagePlaceholder
      src={item.image}
      ratio={ratio}
      rounded="md"
      alt={item.title}
      className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950)/85 via-(--jla-navy-950)/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    {item.type === "video" && (
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 text-(--jla-navy-950) group-hover:bg-(--jla-gold) transition-colors duration-200">
          <FaPlay aria-hidden="true" className="ml-0.5 text-sm sm:text-base" />
        </span>
      </span>
    )}
    <span className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
      {item.title}
    </span>
  </button>
);

const MediaPreview = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeItem, setActiveItem] = useState(null);
  const [featured, ...rest] = mediaItems;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="bg-(--jla-paper)">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <motion.div
          {...reveal}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12"
        >
          <SectionTitle
            docket="05"
            eyebrow="Media"
            title="Moments from the movement."
            description="Summits, outreach days, and everything in between — a look at JLA in action."
          />
          <div className="hidden lg:block shrink-0">
            <Button to={ROUTES.MEDIA} variant="secondary" iconRight={FaArrowRight}>
              View Full Gallery
            </Button>
          </div>
        </motion.div>

        <motion.div
          {...reveal}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4"
        >
          {featured && (
            <GalleryItem
              item={featured}
              onOpen={setActiveItem}
              ratio="16/9"
              className="sm:col-span-2 lg:col-span-2 lg:row-span-2 aspect-video lg:aspect-auto lg:h-full"
            />
          )}
          {rest.map((item) => (
            <GalleryItem key={item.id} item={item} onOpen={setActiveItem} ratio="1/1" />
          ))}
        </motion.div>

        <div className="lg:hidden mt-8">
          <Button to={ROUTES.MEDIA} variant="secondary" fullWidth iconRight={FaArrowRight}>
            View Full Gallery
          </Button>
        </div>
      </div>

      <Modal isOpen={Boolean(activeItem)} onClose={() => setActiveItem(null)} title={activeItem?.title} size="lg">
        {activeItem && (
          <div className="flex flex-col gap-4">
            <ImagePlaceholder
              src={activeItem.image}
              ratio="16/9"
              rounded="md"
              alt={activeItem.title}
              className="w-full"
            />
            <p className="text-sm text-(--jla-slate) leading-relaxed">{activeItem.caption}</p>
            {activeItem.type === "video" && (
              <p className="text-sm text-(--jla-navy) bg-(--jla-navy-100) rounded-md px-4 py-3">
                The full video is available on our{" "}
                <a href={ROUTES.MEDIA} className="font-semibold underline underline-offset-2 hover:no-underline">
                  Media page
                </a>
                .
              </p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default MediaPreview;