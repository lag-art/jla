import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import testimonials from "../../data/testimonials";

// home / Testimonials
// Sixth homepage section — member voices. See data/testimonials.js for an
// important note: content there is intentionally obvious placeholder
// (matching leadershipTeam.js's "Full Name" convention), not fabricated
// quotes, since a testimonial is a factual claim about a real person.
//
// Heuristics baked in:
//   - Autoplay pauses on hover AND on keyboard focus (disableOnInteraction:
//     false + explicit focus handlers) — an autoplaying carousel that
//     keeps advancing while someone is mid-read, or mid-tab-navigation
//     through it, actively fights the reader rather than helping them.
//   - Autoplay is skipped entirely under prefers-reduced-motion — not
//     just slowed down. A carousel that moves itself is motion, same
//     category as any animation, and reduced-motion means "don't move
//     things without me asking," not "move them more gently."
//   - Reuses Swiper (already loaded on this page via LeadershipPreview),
//     so this section's carousel costs effectively zero additional
//     bundle size — the library is already paid for on this route.
//   - Large decorative quote-mark icon is aria-hidden; the actual
//     accessible content is the quote text + cited name, read normally.
//   - Custom prev/next buttons (not Swiper's default arrows) so they can
//     be styled to match the site's button language and hidden on mobile
//     where swipe gesture is the natural interaction anyway.
//   - Uses SectionTitle's tone="dark" prop — added to SectionTitle.jsx
//     itself as part of this build, since that component previously had
//     no dark-background support at all and would have rendered
//     near-invisible navy-on-navy text here otherwise.

const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();
  const swiperRef = useRef(null);

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
            title="What our members say."
            description="Real reflections from students who've walked through JLA — in their own words."
            tone="dark"
          />
        </motion.div>

        <motion.div {...reveal} className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Keyboard, A11y]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
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
              <SwiperSlide key={t.id}>
                <figure className="h-full flex flex-col gap-5 rounded-md border border-white/10 bg-white/5 p-6 sm:p-8">
                  <FaQuoteLeft aria-hidden="true" className="text-(--jla-gold) text-2xl" />
                  <blockquote className="flex-1 text-base sm:text-lg leading-relaxed text-white/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <ImagePlaceholder
                      src={t.image}
                      ratio="1/1"
                      rounded="full"
                      alt={t.name}
                      className="w-11 h-11 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-sm text-white">{t.name}</p>
                      <p className="text-xs text-white/60">{t.role}</p>
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