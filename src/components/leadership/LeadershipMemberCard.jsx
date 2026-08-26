import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaEnvelope, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import ImagePlaceholder from "../common/ImagePlaceholder";

// leadership / LeadershipMemberCard
// The unit rendered inside LeadershipTeamGrid's tier sections.
//
// Heuristics baked in:
//   - `featured` prop drives a larger treatment for executive-tier
//     members without needing a second component — the Leadership page
//     needs visual hierarchy between the Executive Committee and other
//     Officials, and one card with a size variant is easier to keep
//     consistent than two near-identical components that drift apart.
//   - Every optional field degrades cleanly: no `bio` renders no bio
//     block (not an empty gap), no `email`/socials renders no contact
//     row. A brand-new roster entry with only name/role/image looks
//     finished, not broken — which matters because that's exactly the
//     state most entries will be in while the roster is filled out.
//   - Falls back to ImagePlaceholder's own default when `image` is
//     missing entirely, so an 8th leader added before their photo exists
//     shows a branded placeholder rather than a broken image icon.
//   - Contact links use aria-labels that include the person's name
//     ("Email Full Name") rather than a bare "Email" — with 7 cards on
//     one page, seven identical "Email" links are unusable for a screen
//     reader user navigating by links.
//   - Name/role sit BELOW the portrait rather than overlaid on it —
//     deliberately different from about/TeamSection.jsx's overlay
//     treatment, so the same people don't render identically on both
//     pages, and so longer role titles ("Academic Affairs
//     Representative") have room to wrap without covering the face.

const LeadershipMemberCard = ({ member, featured = false, index = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const { name, role, image, bio, email, linkedin, twitter } = member;

  const hasContact = Boolean(email || linkedin || twitter);

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: {
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
          delay: Math.min(index * 0.07, 0.35),
        },
      };

  return (
    <motion.article
      {...reveal}
      className="group flex flex-col overflow-hidden rounded-md border border-(--jla-line) bg-white hover:border-(--jla-gold) hover:shadow-(--shadow-md) transition-[border-color,box-shadow] duration-300"
    >
      <div className="relative overflow-hidden">
        <ImagePlaceholder
          src={image}
          ratio="3/4"
          rounded="none"
          alt={`${name} — ${role}`}
          className="w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute top-0 right-0"
          style={{
            borderStyle: "solid",
            borderWidth: "0 20px 20px 0",
            borderColor: "transparent var(--jla-gold) transparent transparent",
          }}
        />
      </div>

      <div className={`flex flex-col flex-1 gap-2 ${featured ? "p-5 sm:p-6" : "p-4 sm:p-5"}`}>
        <p className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-(--jla-gold-600)">
          {role}
        </p>

        <h3
          className={`font-(family-name:--font-display) font-semibold text-(--jla-navy) leading-tight ${
            featured ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          }`}
        >
          {name}
        </h3>

        {bio && (
          <p className="text-sm text-(--jla-slate) leading-relaxed mt-1">{bio}</p>
        )}

        {hasContact && (
          <div className="flex items-center gap-2 mt-auto pt-3">
            {email && (
              <a
                href={`mailto:${email}`}
                aria-label={`Email ${name}`}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-(--jla-line) text-(--jla-slate) hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) transition-colors duration-200"
              >
                <FaEnvelope aria-hidden="true" className="text-xs" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${name} on LinkedIn`}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-(--jla-line) text-(--jla-slate) hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) transition-colors duration-200"
              >
                <FaLinkedinIn aria-hidden="true" className="text-xs" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${name} on X`}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-(--jla-line) text-(--jla-slate) hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950) transition-colors duration-200"
              >
                <FaXTwitter aria-hidden="true" className="text-xs" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default LeadershipMemberCard;