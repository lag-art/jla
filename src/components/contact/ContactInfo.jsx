import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaScaleBalanced,
  FaShieldHalved,
  FaArrowRight,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import SocialLinks from "../common/SocialLinks";
import { contactInfo } from "../../data/footerLinks";
import ROUTES from "../../routes/routePaths";

// contact / ContactInfo
// How to reach the Alliance, routed by what you're contacting them about.
//
// SCOPE — why this isn't a repeat of ContactHero
// The hero gives the fast path: tap the number, tap the email, tap for
// directions. This answers a different question — WHO to contact for
// WHAT. A member reporting misconduct and a student asking about
// membership need different routes, and a page that offers one inbox for
// both quietly tells the first person their matter is a general enquiry.
//
// EVERY ROUTE CITES ITS SOURCE
// The formal routes below are not invented. Each one comes from a
// governing document published on this site, and links to the exact
// provision that establishes it, so a reader can verify the route rather
// than trusting this page. Where a document establishes an office but the
// site holds no address for it, that is stated plainly instead of an
// address being made up to fill the slot.
//
// ⚠️ UNRESOLVED: TWO OFFICIAL EMAIL ADDRESSES
// Constitution Article 4 names jurisleadershipalliance@gmail.com as the
// Secretary General's inbox; data/footerLinks.js publishes
// juriscartels@gmail.com. This component renders ONLY the one in
// contactInfo, so the site is at least internally consistent — but the
// conflict is real and lives in the Constitution. Resolve it there rather
// than by adding a second address here.
//
// Heuristics baked in:
//   - Contact details come from contactInfo in data/footerLinks.js, the
//     same object Footer, ContactPreview and ContactHero use. Four places
//     publishing four phone numbers is a trust problem, not a tidiness
//     one.
//   - tel: is derived from the display number by stripping whitespace, so
//     the data file stores one format and the two can't drift apart.
//   - Each block renders only if its data exists — remove `email` and its
//     card disappears rather than linking to nothing.
//   - The reporting routes are stated calmly and without added drama.
//     Someone reading them may be in a difficult position; the useful
//     thing is a clear next step and a citation, not reassurance.

const ContactInfo = () => {
  const shouldReduceMotion = useReducedMotion();

  const phoneDigits = contactInfo.phone?.replace(/\s/g, "") || "";
  const fullAddress = [contactInfo.addressLine1, contactInfo.addressLine2]
    .filter(Boolean)
    .join(", ");
  const directionsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
        };

  const card =
    "flex flex-col gap-2 rounded-md border border-(--jla-line) bg-white p-5 sm:p-6 hover:border-(--jla-gold) transition-colors duration-200";

  return (
    <section
      id="contact-info"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-(--jla-paper)"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <SectionTitle
          docket="23"
          eyebrow="Reach Us"
          title="Who to contact, and about what."
          description="General questions go to the Alliance directly. Formal matters follow the routes set out in our governing documents."
        />

        {/* General channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-12">
          {contactInfo.email && (
            <motion.div {...reveal(0)} className={card}>
              <FaEnvelope aria-hidden="true" className="text-(--jla-gold-600) text-xl" />
              <h3 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-lg">
                General enquiries
              </h3>
              <p className="text-sm text-(--jla-slate) leading-relaxed">
                Membership, programmes, partnerships, or anything else.
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="mt-auto pt-3 inline-flex items-center gap-2 text-sm font-semibold text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150 break-all"
              >
                {contactInfo.email}
                <FaArrowRight aria-hidden="true" className="text-[9px] shrink-0" />
              </a>
            </motion.div>
          )}

          {contactInfo.phone && (
            <motion.div {...reveal(0.06)} className={card}>
              <FaPhone aria-hidden="true" className="text-(--jla-gold-600) text-xl" />
              <h3 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-lg">
                Call the Alliance
              </h3>
              <p className="text-sm text-(--jla-slate) leading-relaxed">
                For anything quicker than email.
              </p>
              <a
                href={`tel:${phoneDigits}`}
                className="mt-auto pt-3 inline-flex items-center gap-2 text-sm font-semibold text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
              >
                {contactInfo.phone}
                <FaArrowRight aria-hidden="true" className="text-[9px]" />
              </a>
            </motion.div>
          )}

          {fullAddress && (
            <motion.div {...reveal(0.12)} className={card}>
              <FaLocationDot aria-hidden="true" className="text-(--jla-gold-600) text-xl" />
              <h3 className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-lg">
                {contactInfo.officeLabel || "Visit us"}
              </h3>
              <p className="text-sm text-(--jla-slate) leading-relaxed">
                {contactInfo.addressLine1}
                {contactInfo.addressLine2 && (
                  <>
                    <br />
                    {contactInfo.addressLine2}
                  </>
                )}
              </p>
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-3 inline-flex items-center gap-2 text-sm font-semibold text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
                >
                  Get directions
                  <FaArrowUpRightFromSquare aria-hidden="true" className="text-[9px]" />
                </a>
              )}
            </motion.div>
          )}
        </div>

        {/* Formal routes — each cites the provision that creates it */}
        <motion.div {...reveal(0.18)} className="mt-10 sm:mt-12">
          <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/70 mb-4 pb-2 border-b border-(--jla-line)">
            Formal matters
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <div className="flex gap-4 rounded-md border border-(--jla-line) bg-white p-5 sm:p-6">
              <FaShieldHalved
                aria-hidden="true"
                className="text-(--jla-gold-600) text-lg mt-0.5 shrink-0"
              />
              <div>
                <h4 className="font-semibold text-(--jla-navy)">
                  Complaints and disciplinary matters
                </h4>
                <p className="text-sm text-(--jla-slate) leading-relaxed mt-1.5">
                  Complaints are lodged <strong>in writing</strong> through the
                  Head of Discipline. This is also the route for concerns under
                  the Gender Equality Policy, which sets out protections but
                  does not itself name a reporting channel.
                </p>
                <Link
                  to={`${ROUTES.RESOURCES}#disciplinary-act`}
                  className="inline-flex items-center gap-2 mt-3 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
                >
                  Disciplinary Procedure Act, clause 2
                  <FaArrowRight aria-hidden="true" className="text-[9px]" />
                </Link>
              </div>
            </div>

            <div className="flex gap-4 rounded-md border border-(--jla-line) bg-white p-5 sm:p-6">
              <FaScaleBalanced
                aria-hidden="true"
                className="text-(--jla-gold-600) text-lg mt-0.5 shrink-0"
              />
              <div>
                <h4 className="font-semibold text-(--jla-navy)">
                  Elections and nominations
                </h4>
                <p className="text-sm text-(--jla-slate) leading-relaxed mt-1.5">
                  Eligibility, nomination and election procedure are governed by
                  the Constitution rather than by a separate set of rules read
                  the article itself rather than relying on a summary.
                </p>
                <Link
                  to={`${ROUTES.RESOURCES_CONSTITUTION}#article-5`}
                  className="inline-flex items-center gap-2 mt-3 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
                >
                  Constitution, Article 5
                  <FaArrowRight aria-hidden="true" className="text-[9px]" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social */}
        <motion.div
          {...reveal(0.24)}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mt-10 pt-6 border-t border-(--jla-line)"
        >
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/70">
            Find us online
          </p>
          <SocialLinks tone="light" />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;