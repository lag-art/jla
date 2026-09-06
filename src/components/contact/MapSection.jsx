import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaLocationDot,
  FaMap,
  FaArrowUpRightFromSquare,
  FaCircleInfo,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import { contactInfo } from "../../data/footerLinks";

// contact / MapSection
// Where the Alliance is, and how to get there.
//
// CLICK-TO-LOAD, NOT AN ALWAYS-EMBEDDED IFRAME
// A Google Maps embed is roughly a megabyte of scripts and tiles, and it
// contacts Google — setting cookies and reporting the visit — the moment
// the page loads, for every visitor including the ones who only came to
// read the Constitution. This shows a styled placeholder and mounts the
// iframe only when someone asks for it. Same reasoning as the YouTube
// facade in VideoSection: don't spend a visitor's data, or their privacy,
// on something they haven't asked for.
// The trade-off is one extra tap for people who do want the map — which
// is why the directions links below work WITHOUT loading it at all. The
// map is the optional part; getting there is the point.
//
// THREE MAP APPS, NOT ONE
// A "Get directions" link that assumes Google Maps is a guess about the
// visitor's phone. Apple Maps is the default on iOS and Waze is widely
// used for driving in Nairobi. Coordinates work in all three, so offering
// all three costs nothing and saves a copy-paste.
//
// COORDINATES, WITH AN ADDRESS FALLBACK
// Precise coordinates beat an address string — "Bogani E Rd" is a long
// road, and a search-by-text link drops the visitor somewhere along it.
// Add `coords: { lat, lng }` to contactInfo in data/footerLinks.js to use
// them; without it this falls back to searching the address text, which
// still works, just less precisely.
//
// Heuristics baked in:
//   - The embed URL lives in contactInfo, not here, so the map and the
//     address can't come from two different places.
//   - The iframe carries a real `title` — Google's own snippet omits one,
//     which fails a basic check for embedded frames.
//   - Aspect ratio is reserved before the map loads, so the page never
//     jumps when the iframe mounts.
//   - Self-hiding: no embed URL and no address means no section at all.

const MapSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mapLoaded, setMapLoaded] = useState(false);

  const fullAddress = [contactInfo.addressLine1, contactInfo.addressLine2]
    .filter(Boolean)
    .join(", ");

  // Prefer coordinates; fall back to the address text — see note above.
  const links = useMemo(() => {
    const { lat, lng } = contactInfo.coords || {};
    const label = encodeURIComponent(contactInfo.orgName || "Juris Leadership Alliance");

    if (lat != null && lng != null) {
      return {
        google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        apple: `https://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
        waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      };
    }
    if (!fullAddress) return null;
    const q = encodeURIComponent(fullAddress);
    return {
      google: `https://www.google.com/maps/search/?api=1&query=${q}`,
      apple: `https://maps.apple.com/?q=${q}`,
      waze: `https://waze.com/ul?q=${q}&navigate=yes`,
    };
  }, [fullAddress]);

  if (!contactInfo.mapEmbedSrc && !fullAddress) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  const appLink =
    "group inline-flex items-center justify-center gap-2 rounded-sm border border-(--jla-line) bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:border-(--jla-gold) hover:bg-(--jla-gold)/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 transition-colors duration-200";

  return (
    <section
      id="find-us"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <SectionTitle
          docket="24"
          eyebrow="Find Us"
          title="Where to find the Alliance."
          description="Open the location in whichever map app you actually use."
        />

        <motion.div {...reveal} className="mt-10 sm:mt-12">
          {/* Address + directions — work without loading the map at all */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
            <div className="flex items-start gap-3">
              <FaLocationDot
                aria-hidden="true"
                className="text-(--jla-gold-600) text-lg mt-0.5 shrink-0"
              />
              <div>
                {contactInfo.officeLabel && (
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/70">
                    {contactInfo.officeLabel}
                  </p>
                )}
                <p className="font-(family-name:--font-display) font-semibold text-(--jla-navy) text-lg sm:text-xl mt-0.5">
                  {contactInfo.addressLine1}
                </p>
                {contactInfo.addressLine2 && (
                  <p className="text-sm text-(--jla-slate)">{contactInfo.addressLine2}</p>
                )}
              </div>
            </div>

            {links && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:shrink-0">
                <a href={links.google} target="_blank" rel="noopener noreferrer" className={appLink}>
                  Google Maps
                  <FaArrowUpRightFromSquare
                    aria-hidden="true"
                    className="text-[9px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <a href={links.apple} target="_blank" rel="noopener noreferrer" className={appLink}>
                  Apple Maps
                  <FaArrowUpRightFromSquare aria-hidden="true" className="text-[9px]" />
                </a>
                <a href={links.waze} target="_blank" rel="noopener noreferrer" className={appLink}>
                  Waze
                  <FaArrowUpRightFromSquare aria-hidden="true" className="text-[9px]" />
                </a>
              </div>
            )}
          </div>

          {/* Map — facade until asked for, see note above */}
          {contactInfo.mapEmbedSrc && (
            <div
              className="relative w-full overflow-hidden rounded-md border border-(--jla-line) bg-(--jla-navy-100)"
              style={{ aspectRatio: "16 / 9" }}
            >
              {mapLoaded ? (
                <iframe
                  src={contactInfo.mapEmbedSrc}
                  title={`Map showing ${contactInfo.orgName || "the Alliance"} at ${fullAddress}`}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  {/* Street-grid field — the same crosshatch motif as
                      ContactHero, so the placeholder reads as a map area
                      rather than a broken image */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.12] text-(--jla-navy)
                               bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_44px),repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_44px)]"
                  />
                  <span
                    aria-hidden="true"
                    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-(--jla-navy) text-(--jla-gold)"
                  >
                    <FaMap />
                  </span>

                  <button
                    type="button"
                    onClick={() => setMapLoaded(true)}
                    className="relative inline-flex items-center gap-2 rounded-sm bg-(--jla-navy) px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-(--jla-navy-800) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 transition-colors duration-200"
                  >
                    Load the map
                  </button>

                  {/* Says what loading it costs, before it's loaded */}
                  <p className="relative flex items-start gap-2 max-w-sm text-xs text-(--jla-slate) leading-relaxed">
                    <FaCircleInfo aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span>
                      Loading the map connects to Google, which may set cookies.
                      The directions links above work without it.
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;