import React from "react";
import law1 from "../../assets/images/law1.jpg";
import law2 from "../../assets/images/law2.jpg";
import law3 from "../../assets/images/law3.jpg";
import law4 from "../../assets/images/law4.jpg";

// home / PartnersLogos
// Seventh homepage section — a "trusted by" logo strip between
// Testimonials and JoinCTA.
//
// Honest-content note: these 4 images are NOT paired with invented
// partner organization names. A logo strip implies a real, current
// relationship with whoever's mark is shown — attaching a fabricated
// "In Partnership with [Institution]" label to an image would be the
// same false-endorsement problem as a fabricated testimonial, just
// applied to an institution instead of a person. If/when these need
// real names or links, add a `name`/`href` field per entry then — don't
// invent one now to make the section feel more complete than it is.
//
// Heuristics baked in:
//   - Continuous marquee loop is pure CSS (the `marquee` keyframe in
//     styles/index.css), not JS-driven — no width measurement, no
//     ResizeObserver, no animation library needed for a simple infinite
//     scroll. The track renders the logo array TWICE back-to-back; at
//     -50% translateX the second copy sits exactly where the first
//     started, so the loop has no visible seam or reset-jump.
//   - motion-safe:/motion-reduce: are Tailwind's built-in CSS media-query
//     variants — the animation simply doesn't apply under
//     prefers-reduced-motion, no JS `useReducedMotion` check needed here
//     (unlike Testimonials, which needs JS because Swiper's autoplay is
//     JS-driven; this animation is pure CSS, so a CSS media query alone
//     is sufficient and simpler).
//   - Hover pauses the scroll (`[animation-play-state:paused]`) so a
//     visitor who stops to actually look at one logo isn't fighting a
//     strip that keeps sliding out from under their cursor.
//   - The duplicated second copy of the track is `aria-hidden` — a
//     screen reader should hear each logo once, not twice, even though
//     it's visually rendered twice for the seamless loop.
//   - Grayscale-by-default, full-color-on-hover is the standard trust-bar
//     treatment: it visually de-emphasizes the strip as supporting
//     content rather than competing with the section's actual headline
//     content above and below it.

const PARTNERS = [
  { id: 1, src: law1, alt: "Partner organization mark" },
  { id: 2, src: law2, alt: "Partner organization mark" },
  { id: 3, src: law3, alt: "Partner organization mark" },
  { id: 4, src: law4, alt: "Partner organization mark" },
];

const LogoTrack = ({ hidden = false }) => (
  <div
    className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0"
    aria-hidden={hidden}
  >
    {PARTNERS.map((partner) => (
      <img
        key={partner.id}
        src={partner.src}
        alt={hidden ? "" : partner.alt}
        className="h-10 sm:h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      />
    ))}
  </div>
);

const PartnersLogos = () => {
  return (
    <section
      aria-label="Our partner organizations"
      className="bg-(--jla-paper) border-y border-(--jla-line) py-10 sm:py-12"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) mb-6 sm:mb-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-(--jla-slate)">
          In Partnership With
        </p>
      </div>

      <div className="group relative overflow-hidden">
        {/* Edge fade so logos entering/exiting feel intentional, not clipped */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-linear-to-r from-(--jla-paper) to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-linear-to-l from-(--jla-paper) to-transparent z-10"
        />

        <div className="flex w-max motion-safe:animate-[marquee_24s_linear_infinite] motion-reduce:animate-none group-hover:[animation-play-state:paused]">
          <LogoTrack />
          <LogoTrack hidden />
        </div>
      </div>
    </section>
  );
};

export default PartnersLogos;