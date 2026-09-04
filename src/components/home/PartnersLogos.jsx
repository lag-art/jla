import React from "react";
import littlebox from "../../assets/images/littlebox.jpg";
import rebirth from "../../assets/images/rebirth.jpg";
import rotary from "../../assets/images/rotary.jpg";
import sayds from "../../assets/images/sayds.jpg";
import unicaf from "../../assets/images/unicaf.jpg";

// home / PartnersLogos
// Trust strip between Testimonials and JoinCTA.
//
// THESE ARE REAL, NAMED ORGANISATIONS NOW
// Each entry names an actual body the Alliance works with, which makes
// this section a set of factual claims about real relationships — not
// decoration. Two things follow:
//   - Only list organisations with a genuine, current relationship. A
//     logo strip is read as "these bodies are associated with us."
//   - Many organisations (Rotary especially) publish brand guidelines
//     governing how their mark may be reproduced. Worth confirming use is
//     permitted before launch; that's a permissions question, not a code
//     one, but it belongs next to the logos rather than nowhere.
// `name` is used as the alt text, so it must be the organisation's real
// name — verify exact legal/preferred naming rather than shortening it
// for layout. Add `href` to link a logo to its site; entries without one
// render as plain images rather than dead links.
//
// Heuristics baked in:
//   - alt is the ORGANISATION NAME, not "partner logo". A screen reader
//     hearing "partner organization mark" five times learns nothing; the
//     names are the entire content of this section.
//   - Continuous marquee is pure CSS (the `marquee` keyframe in
//     styles/index.css) — no width measurement, no ResizeObserver, no
//     animation library. The track renders the array TWICE back to back;
//     at -50% translateX the second copy sits exactly where the first
//     began, so the loop has no seam.
//   - motion-safe:/motion-reduce: are CSS media-query variants, so the
//     animation simply doesn't apply under prefers-reduced-motion — no JS
//     check needed here, unlike Testimonials where Swiper's autoplay is
//     JS-driven.
//   - Hover pauses the scroll, so someone stopping to read a mark isn't
//     fighting a strip sliding out from under their cursor. Focus pauses
//     it too — a keyboard user tabbing to a linked logo shouldn't have it
//     travel away mid-tab.
//   - The duplicated track is aria-hidden with empty alts, so each
//     organisation is announced once despite rendering twice.
//   - Grayscale until hover keeps the strip as supporting evidence rather
//     than five competing brand colours next to the section's own
//     content — and makes wildly different logo palettes sit together.

const PARTNERS = [
  { id: "littlebox", name: "Little Box", src: littlebox },
  { id: "rebirth", name: "Rebirth", src: rebirth },
  { id: "rotary", name: "Rotary", src: rotary },
  { id: "sayds", name: "SAYDS", src: sayds },
  { id: "unicaf", name: "Unicaf", src: unicaf },
  { id: "littlebox", name: "Little Box", src: littlebox },
  { id: "rebirth", name: "Rebirth", src: rebirth },
  { id: "rotary", name: "Rotary", src: rotary },
  { id: "sayds", name: "SAYDS", src: sayds },
  { id: "unicaf", name: "Unicaf", src: unicaf },
];

const Logo = ({ partner, decorative }) => {
  const img = (
    <img
      src={partner.src}
      alt={decorative ? "" : partner.name}
      loading="lazy"
      className="h-10 sm:h-14 w-auto max-w-36 sm:max-w-44 object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
    />
  );

  // Linked only when a real URL exists — see note on dead links above.
  if (partner.href && !decorative) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} (opens in a new tab)`}
        className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-4 focus-visible:ring-offset-(--jla-paper) rounded-sm"
      >
        {img}
      </a>
    );
  }

  return <span className="shrink-0">{img}</span>;
};

const LogoTrack = ({ decorative = false }) => (
  <div
    className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0"
    aria-hidden={decorative || undefined}
  >
    {PARTNERS.map((partner) => (
      <Logo key={partner.id} partner={partner} decorative={decorative} />
    ))}
  </div>
);

const PartnersLogos = () => {
  if (PARTNERS.length === 0) return null;

  return (
    <section
      aria-label="Organisations the Alliance works with"
      className="bg-(--jla-paper) border-y border-(--jla-line) py-10 sm:py-12"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) mb-6 sm:mb-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-(--jla-slate)">
          In Partnership With
        </p>
      </div>

      {/* focus-within pauses the marquee for keyboard users too */}
      <div className="group relative overflow-hidden focus-within:[&_.marquee-track]:[animation-play-state:paused]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-linear-to-r from-(--jla-paper) to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-linear-to-l from-(--jla-paper) to-transparent z-10"
        />

        <div className="marquee-track flex w-max motion-safe:animate-[marquee_30s_linear_infinite] motion-reduce:animate-none group-hover:[animation-play-state:paused]">
          <LogoTrack />
          <LogoTrack decorative />
        </div>
      </div>
    </section>
  );
};

export default PartnersLogos;