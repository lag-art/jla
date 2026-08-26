import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaLink,
} from "react-icons/fa6";
import { socialLinks as defaultLinks } from "../../data/footerLinks";

// common / SocialLinks
// Renders a row of icon buttons from a list of URLs — the platform (icon +
// accessible label) is auto-detected from each URL's hostname rather than
// hand-typed per entry, so data/footerLinks.js only ever needs a real link.
//
// Heuristics baked in:
//   - Hostname sniffing: "instagram.com" in the URL -> Instagram icon +
//     "Instagram" aria-label, automatically. Add a new social link to the
//     data file with zero extra bookkeeping.
//   - Unrecognized domain -> generic link icon instead of breaking or
//     silently rendering nothing, so a future platform never disappears.
//   - `tone` mirrors Card/SectionTitle's light/dark system — Footer sits
//     on navy, so tone="dark" is the default; drop it onto a light section
//     (e.g. ContactInfo) with tone="light".
//   - Hover tilt + scale via framer-motion, disabled under
//     prefers-reduced-motion (falls back to a plain color change).

const PLATFORM_MAP = [
  { match: "instagram.com", label: "Instagram", Icon: FaInstagram },
  { match: "tiktok.com", label: "TikTok", Icon: FaTiktok },
  { match: "x.com", label: "X (Twitter)", Icon: FaXTwitter },
  { match: "twitter.com", label: "X (Twitter)", Icon: FaXTwitter },
  { match: "facebook.com", label: "Facebook", Icon: FaFacebookF },
  { match: "linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
  { match: "youtube.com", label: "YouTube", Icon: FaYoutube },
];

const detectPlatform = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const found = PLATFORM_MAP.find((p) => hostname.includes(p.match));
    if (found) return found;
  } catch {
    // malformed URL — fall through to generic
  }
  return { label: "Link", Icon: FaLink };
};

const TONE = {
  dark: "border-white/25 text-white hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950)",
  light:
    "border-(--jla-line) text-(--jla-navy) hover:bg-(--jla-gold) hover:border-(--jla-gold) hover:text-(--jla-navy-950)",
};

const SocialLinks = ({ links = defaultLinks, tone = "dark", size = "md", className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 sm:w-10 sm:h-10 text-sm";

  return (
    <ul className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${className}`}>
      {links.map(({ url, label: overrideLabel }) => {
        const { label, Icon } = detectPlatform(url);
        const displayLabel = overrideLabel || label;

        return (
          <li key={url}>
            <motion.a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={displayLabel}
              title={displayLabel}
              whileHover={shouldReduceMotion ? {} : { y: -3, rotate: -4 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center justify-center rounded-full border transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--jla-navy-950) ${sizeClasses} ${
                TONE[tone] || TONE.dark
              }`}
            >
              <Icon aria-hidden="true" />
            </motion.a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinks;