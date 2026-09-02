import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import testimonials from "../../data/testimonials";

// home / Testimonials
// Real, named students quoted with their consent — see the note at the
// top of data/testimonials.js before editing any entry.
//
// Heuristics baked in:
//   - `loop` is on because there are five testimonials shown two at a
//     time: without it the final slide sits half-empty with one orphaned
//     card. Looping also means the carousel never dead-ends, so someone
//     paging through doesn't hit an invisible wall.
//   - Autoplay pauses on hover and doesn't disable itself after
//     interaction, so a reader who swipes back isn't fighting a carousel
//     that has stopped cooperating.
//   - Autoplay is skipped ENTIRELY under prefers-reduced-motion, not
//     slowed. A carousel advancing itself is motion in the same category
//     as any animation.
//   - Cards are equal height (h-full + flex) so a 108-character quote and
//     a 139-character one don't produce ragged card bottoms side by side.
//   - Portraits are shown at a size where a face is actually legible.
//     These are real people vouching publicly for the Alliance; rendering
//     them as tiny avatars undercuts the point of naming them.
//   - Names and years are rendered as a <figcaption> inside <figure>, so
//     the attribution is programmatically tied to the quote rather than
//     being loose text that happens to sit underneath it.
//   - Reuses Swiper, already loaded on this page by LeadershipPreview, so
//     this section costs effectively no extra bundle.

const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();
  const swiperRef = useRef(null);

  if (testimonials.length === 0) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="bg-(--jla-navy-950) text-white overflow-hidden">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <motion.div {...reveal} className="mb-10 sm:mb-12">
          <SectionTitle
            docket="06"
            eyebrow="Member Voices"
            title="What law students say."
            description="Members of the faculty, in their own words, on why they back the Alliance."
            tone="dark"
          />
        </motion.div>

        <motion.div {...reveal} className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Keyboard, A11y]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            loop={testimonials.length > 2}
            autoplay={
              shouldReduceMotion
                ? false
                : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }
            }
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            className="pb-12!"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className="h-auto!">
                <figure className="h-full flex flex-col gap-5 rounded-md border border-white/10 bg-white/5 p-6 sm:p-8">
                  <FaQuoteLeft aria-hidden="true" className="text-(--jla-gold) text-2xl shrink-0" />

                  <blockquote className="flex-1 text-base sm:text-lg leading-relaxed text-white/90">
                    {t.quote}
                  </blockquote>

                  <figcaption className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0 ring-2 ring-(--jla-gold)/40"
                    />
                    <div className="min-w-0">
                      <p className="font-(family-name:--font-display) font-semibold text-white leading-tight">
                        {t.name}
                      </p>
                      <p className="font-mono text-[11px] tracking-wide uppercase text-(--jla-gold)/80 mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="hidden sm:flex items-center gap-3 absolute right-0 -top-16">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/80 hover:text-(--jla-gold) hover:border-(--jla-gold) transition-colors duration-200"
            >
              <FaChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/80 hover:text-(--jla-gold) hover:border-(--jla-gold) transition-colors duration-200"
            >
              <FaChevronRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;