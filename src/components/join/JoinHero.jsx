import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { FaArrowDown, FaArrowUpRightFromSquare } from "react-icons/fa6";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import joinHeroImage from "../../assets/images/join.jpg";

// join / JoinHero
// The Join page's hero — renders this page's single <h1>.
//
// TWO IMPORTS, TWO NAMES
// `joinHeroImage` is a STRING URL from Vite; ImagePlaceholder is a
// COMPONENT. Naming the image after the component shadows it and the
// render throws InvalidCharacterError. Six files have hit this now.
//
// THE WHATSAPP LINK NAMES WHAT IT DOES
// Tapping it leaves the site and opens WhatsApp, and on most phones drops
// the person straight into a group invite screen. A button labelled just
// "Join" that suddenly launches another app is jarring, and someone may
// not want their number visible to a group. So the button says WhatsApp,
// carries the external-link icon, opens in a new tab with
// rel="noopener noreferrer", and the line beneath says plainly what
// happens next. The form below stays the route for anyone who'd rather
// not join a group chat — which is why this hero doesn't present WhatsApp
// as the only way in.
//
// WHERE THE LINK LIVES
// Kept as a constant here rather than in a data file, because it's the
// only place using it today. If a second component needs it (JoinForm, or
// a footer channel), move it into data/footerLinks.js beside the other
// channels rather than copying the URL — a group invite that gets revoked
// and re-issued should only need changing once.
//
// Other heuristics:
//   - The secondary CTA scrolls to whatever element actually follows this
//     hero (nextElementSibling) instead of a hardcoded #anchor, so it
//     can't break if the Join page's section order changes or a section
//     is renamed.
//   - object-position: top, so a 21:9 photo cropped into a short banner
//     doesn't centre-crop its subject out of frame.
//   - Diagonal field — About and Leadership use dots, Resources ruled
//     lines, Contact a crosshatch. Join gets its own so the page reads as
//     its own place rather than a recolour.
//   - Short viewports drop the banner minimum and compress padding, so
//     the membership detail below stays reachable on a landscape phone.
//   - Buttons go full-width on phones: two half-width controls on a 375px
//     screen give neither a comfortable tap target.

// Single place this URL appears — see note above before copying it.
const WHATSAPP_INVITE = "https://chat.whatsapp.com/Dqxjj7GpVL7HSCLZM8tIfP?mode=gi_t";

const JoinHero = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling;
    next?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white flex items-end
                 min-h-80 sm:min-h-95 lg:min-h-110
                 [@media(max-height:640px)]:min-h-0"
    >
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          src={joinHeroImage}
          ratio="21/9"
          rounded="none"
          fit="cover"
          position="top"
          priority
          alt=""
          className="w-full h-full"
        />

        {/* Vertical: carries the text sitting at the bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/85 to-(--jla-navy-950)/45"
        />
        {/* Horizontal: keeps left-aligned text readable on wide screens */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-(--jla-navy-950)/75 via-(--jla-navy-950)/25 to-transparent"
        />
        {/* Diagonal field — Join's own motif */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(45deg,currentColor_0_1px,transparent_1px_16px)]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative w-full max-w-(--container-max) mx-auto px-(--container-padding)
                   pt-20 pb-10 sm:pb-12 lg:pb-14
                   [@media(max-height:640px)]:pt-14 [@media(max-height:640px)]:pb-6"
      >
        <Breadcrumb items={[{ label: "Join JLA" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Membership
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-balance
                       text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          Every law student has a place here.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl text-pretty">
          Join a community that studies the law and lives its highest ideals academic support, mentorship, and a real voice in faculty decisions.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-7 w-full sm:w-auto">
          {/* Says where it goes — see note on naming the destination */}
          <a
            href={WHATSAPP_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-sm bg-(--jla-gold) px-8 py-4 text-sm font-semibold uppercase tracking-wide text-(--jla-navy-950) hover:bg-(--jla-gold-300) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--jla-navy-950) transition-colors duration-200"
          >
            <FaWhatsapp aria-hidden="true" className="text-lg" />
            Join our WhatsApp community
            <FaArrowUpRightFromSquare
              aria-hidden="true"
              className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <button
            type="button"
            onClick={scrollToNext}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-sm border border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white hover:text-(--jla-navy-950) hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) transition-colors duration-200"
          >
            See what membership means
            <FaArrowDown aria-hidden="true" className="text-[10px]" />
          </button>
        </div>

        <p className="text-xs text-white/50 mt-3 max-w-md leading-relaxed">
          Opens WhatsApp and takes you to the group invite. Prefer not to use a
          group chat? The form further down works just as well.
        </p>
      </motion.div>
    </section>
  );
};

export default JoinHero;