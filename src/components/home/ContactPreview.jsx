import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaLocationDot, FaPhone, FaEnvelope, FaArrowRight, FaRoute } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import { contactInfo } from "../../data/footerLinks";
import ROUTES from "../../routes/routePaths";

// home / ContactPreview
// Ninth and final homepage section. Contact details are read from
// data/footerLinks.js's `contactInfo` — the exact same object Footer.jsx
// renders — rather than hardcoded a second time here. Two files showing
// two different phone numbers for the same organization is a real,
// user-facing trust problem, not just a code-cleanliness one.
//
// Heuristics baked in:
//   - tel: and mailto: links are built by stripping whitespace from the
//     display-formatted phone number programmatically, so the data file
//     only needs to store one human-readable format ("+254 727 376323")
//     rather than a separate machine-readable copy that could drift out
//     of sync with the display copy.
//   - Google Maps iframe is wrapped in an aspect-ratio container with the
//     iframe itself absolutely positioned to fill it — the raw embed
//     snippet's hardcoded width="600" height="450" attributes don't
//     respond to any container size, so without this wrapper the map
//     would either overflow on mobile or leave dead space on desktop.
//   - "Get Directions" is a real, generic Google Maps search URL built
//     from the actual address text (not the embed's internal place ID,
//     which isn't meant to be reverse-engineered from an iframe src) —
//     works regardless of what device/app the visitor has.
//   - This section sits on a white background, so <Button> is used
//     directly with no local override — unlike JoinCTA (gold bg) and
//     HeroSection (navy bg), Button's default variants are correct here.
//   - Added an accessible `title` to the <iframe> — Google's own embed
//     snippet omits one, which fails a basic accessibility check for
//     embedded frames.

const ContactPreview = () => {
  const shouldReduceMotion = useReducedMotion();

  const phoneDigits = contactInfo.phone.replace(/\s/g, "");
  const fullAddress = `${contactInfo.addressLine1}, ${contactInfo.addressLine2}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress
  )}`;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="bg-white">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Contact details */}
          <motion.div {...reveal}>
            <SectionTitle
              docket="09"
              eyebrow="Get In Touch"
              title="Visit or reach our Nairobi office."
              description="Whether you have a question, a proposal, or just want to learn more — we'd love to hear from you."
            />

            <ul className="flex flex-col gap-5 mt-8">
              <li className="flex items-start gap-3">
                <FaLocationDot aria-hidden="true" className="text-(--jla-gold-600) text-lg mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-(--jla-navy) text-sm">{contactInfo.officeLabel}</p>
                  <p className="text-sm text-(--jla-slate)">{fullAddress}</p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <FaPhone aria-hidden="true" className="text-(--jla-gold-600) text-base shrink-0" />
                <a
                  href={`tel:${phoneDigits}`}
                  className="text-sm text-(--jla-slate) hover:text-(--jla-gold-600) transition-colors duration-150"
                >
                  {contactInfo.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope aria-hidden="true" className="text-(--jla-gold-600) text-base shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm text-(--jla-slate) hover:text-(--jla-gold-600) transition-colors duration-150 break-all"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button href={directionsUrl} variant="secondary" iconLeft={FaRoute}>
                Get Directions
              </Button>
              <Button to={ROUTES.CONTACT} variant="ghost" iconRight={FaArrowRight}>
                Full Contact Page
              </Button>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="relative w-full rounded-md overflow-hidden border border-(--jla-line)"
            style={{ aspectRatio: "4 / 3" }}
          >
            <iframe
              src={contactInfo.mapEmbedSrc}
              title="Juris Leadership Alliance — Nairobi office location"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;