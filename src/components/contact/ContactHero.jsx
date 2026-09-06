import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaPhone, FaEnvelope, FaLocationDot, FaArrowUpRightFromSquare } from "react-icons/fa6";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import contactHeroImage from "../../assets/images/contacthero.jpg";
import { contactInfo } from "../../data/footerLinks";

// contact / ContactHero
// The Contact page's hero — renders this page's single <h1>.
//
// TWO IMPORTS, TWO NAMES
// `contactHeroImage` is a STRING URL from Vite; ImagePlaceholder is a
// COMPONENT. Naming the image after the component shadows it and the
// render calls document.createElement("/src/assets/...jpg"), throwing
// InvalidCharacterError. Five files have hit this — keep them distinct.
//
// THE HERO IS PART OF THE ANSWER HERE
// Every other interior hero introduces its page. This one can partly BE
// its page: someone who lands on /contact wants to contact the Alliance,
// and making them scroll past a banner to find an email address is a
// small failure the banner itself can prevent. So the phone, email and
// address render here as live tel:/mailto:/directions links, above the
// fold, before the form. The form below is still the right route for
// anything that needs a reply thread — this is for people who just want
// the number.
//
// ONE SOURCE FOR CONTACT DETAILS
// Everything comes from contactInfo in data/footerLinks.js — the same
// object Footer and ContactPreview render. Three places publishing three
// phone numbers is a genuine trust problem, not a tidiness one, so no
// detail is retyped here.
//
// Other heuristics:
//   - The tel: link is built by stripping whitespace from the display
//     number programmatically, so the data file stores one human-readable
//     format and the machine-readable form can't drift from it.
//   - Chips degrade individually: remove `email` from contactInfo and its
//     chip disappears rather than rendering a mailto: to nothing.
//   - Crosshatch texture — About and Leadership use dots, Resources ruled
//     lines, Media a photo mosaic. A street-grid crosshatch reads as
//     "find us" and keeps Contact visually its own place.
//   - object-position: top, so a 21:9 photo cropped into a short banner
//     doesn't centre-crop its subject out of frame.
//   - Short viewports (landscape phones) drop the banner minimum and
//     compress padding, so the form below stays reachable.
//   - alt="" — the <h1> names the page and the chips carry the substance;
//     describing the photo would repeat what's already read out.

const ContactHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const phoneDigits = contactInfo.phone?.replace(/\s/g, "") || "";
  const fullAddress = [contactInfo.addressLine1, contactInfo.addressLine2]
    .filter(Boolean)
    .join(", ");
  const directionsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  const chip =
    "group inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-white/90 hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--jla-navy-950) transition-colors duration-200";

  return (
    <section
      className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white flex items-end
                 min-h-80 sm:min-h-95 lg:min-h-110
                 [@media(max-height:640px)]:min-h-0"
    >
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          src={contactHeroImage}
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
        {/* Crosshatch — the "find us" motif, distinct from the dot field
            (About, Leadership) and ruled lines (Resources) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]
                     bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_44px),repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_44px)]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative w-full max-w-(--container-max) mx-auto px-(--container-padding)
                   pt-20 pb-10 sm:pb-12 lg:pb-14
                   [@media(max-height:640px)]:pt-14 [@media(max-height:640px)]:pb-6"
      >
        <Breadcrumb items={[{ label: "Contact Us" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Contact Us
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-balance
                       text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          Talk to the Alliance.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl text-pretty">
          A question, a proposal, or something that needs raising — reach the
          leadership directly, or use the form below.
        </p>

        {/* Live channels, above the fold — see note on why these are here */}
        <div className="flex flex-wrap gap-2.5 mt-7 pt-6 border-t border-white/15
                        [@media(max-height:640px)]:mt-4 [@media(max-height:640px)]:pt-4">
          {contactInfo.phone && (
            <a href={`tel:${phoneDigits}`} className={chip}>
              <FaPhone aria-hidden="true" className="text-xs text-(--jla-gold) group-hover:text-(--jla-navy-950)" />
              <span className="font-medium">{contactInfo.phone}</span>
            </a>
          )}

          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className={`${chip} max-w-full`}>
              <FaEnvelope aria-hidden="true" className="text-xs text-(--jla-gold) group-hover:text-(--jla-navy-950) shrink-0" />
              <span className="font-medium truncate">{contactInfo.email}</span>
            </a>
          )}

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={chip}
            >
              <FaLocationDot aria-hidden="true" className="text-xs text-(--jla-gold) group-hover:text-(--jla-navy-950)" />
              <span className="font-medium">{contactInfo.addressLine1}</span>
              <FaArrowUpRightFromSquare
                aria-hidden="true"
                className="text-[9px] opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}
        </div>

        {contactInfo.officeLabel && (
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/40 mt-3">
            {contactInfo.officeLabel}
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default ContactHero;