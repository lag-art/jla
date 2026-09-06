import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Breadcrumb from "../common/Breadcrumb";
import ImagePlaceholder from "../common/ImagePlaceholder";
import leaderHeroImage from "../../assets/images/leaderhero.jpg";
import { leadershipByTier } from "../../data/leadershipTeam";

// leadership / LeadershipHero
// The Leadership page's hero — renders this page's single <h1>.
//
// TWO IMPORTS, TWO NAMES
// `leaderHeroImage` is a STRING URL from Vite; ImagePlaceholder is a
// COMPONENT. Naming the image after the component shadows it and the
// render then calls document.createElement("/src/assets/...jpg"), which
// throws InvalidCharacterError. This has bitten three files already —
// keep the names distinct.
//
// THIS HERO IS TALLER THAN ITS SIBLINGS, ON PURPOSE
// About, Resources and Media heroes are headline + lead. This one also
// carries a computed stats row, which adds roughly 90px. That's why the
// short-viewport rules below are more aggressive here than in AboutHero:
// on a landscape phone the same padding would push the roster itself
// entirely below the fold, so the hero would fill the screen while
// telling you nothing about who leads the Alliance.
//
// COUNTS ARE COMPUTED, NEVER WRITTEN
// Every number comes from data/leadershipTeam.js at render time. Adding
// an eighth leader updates the hero automatically. A hardcoded "7
// leaders" becomes a false statement the first time the roster changes —
// and on a page whose whole job is showing who holds office, a wrong
// count undermines the thing being shown.
//
// Other heuristics:
//   - Empty tiers are filtered out, so a tier defined but unfilled can't
//     render a "0 Officials" line.
//   - object-position: top. A 21:9 group photo cropped into a 320px
//     banner centre-crops by default — which is how leadership banners
//     end up showing torsos instead of faces.
//   - Vertical AND horizontal gradients sit permanently between image and
//     text, so legibility never depends on the photo being dark enough.
//   - tabular-nums on the figures so they don't jitter in width if the
//     roster changes.
//   - alt="" — the <h1> and the stats already say what this is; the photo
//     would announce it a second time.

const LeadershipHero = () => {
  const shouldReduceMotion = useReducedMotion();

  const populatedTiers = leadershipByTier.filter((tier) => tier.members.length > 0);
  const totalMembers = populatedTiers.reduce((sum, tier) => sum + tier.members.length, 0);

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      className="relative isolate overflow-hidden bg-(--jla-navy-950) text-white flex items-end
                 min-h-80 sm:min-h-95 lg:min-h-110
                 [@media(max-height:640px)]:min-h-0"
    >
      <div className="absolute inset-0 -z-10">
        <ImagePlaceholder
          src={leaderHeroImage}
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
        {/* Horizontal: the vertical gradient thins out behind left-aligned
            text on wide screens — this keeps it readable at 2560px */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-(--jla-navy-950)/75 via-(--jla-navy-950)/25 to-transparent"
        />
        {/* Dot field — shared with About; Resources uses ruled lines and
            Media a photo mosaic, so each page still reads as its own */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(currentColor_1.5px,transparent_1.5px)] bg-size-[22px_22px]"
        />
      </div>

      <motion.div
        {...reveal}
        className="relative w-full max-w-(--container-max) mx-auto px-(--container-padding)
                   pt-20 pb-10 sm:pb-12 lg:pb-14
                   [@media(max-height:640px)]:pt-14 [@media(max-height:640px)]:pb-6"
      >
        <Breadcrumb items={[{ label: "Leadership & Structure" }]} tone="dark" className="mb-4" />

        <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-(--jla-gold) mb-3 inline-block">
          Leadership &amp; Structure
        </span>

        <h1 className="font-(family-name:--font-display) font-semibold leading-[1.1] text-balance
                       text-[clamp(1.875rem,1.3rem+2.8vw,3.25rem)] max-w-2xl">
          Elected to serve, held to account.
        </h1>

        <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed max-w-xl text-pretty">
          The students representing every voice in the faculty and the
          structure that keeps that representation answerable.
        </p>

        {/* Computed from the roster — see note above. Spacing tightens on
            short viewports so the roster below stays reachable. */}
        {totalMembers > 0 && (
          <dl
            className="flex flex-wrap items-center gap-x-8 gap-y-3
                       mt-7 pt-6 border-t border-white/15
                       [@media(max-height:640px)]:mt-4 [@media(max-height:640px)]:pt-4"
          >
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-white/50">Total</dt>
              <dd className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-(--jla-gold) tabular-nums">
                {totalMembers}
              </dd>
            </div>

            {populatedTiers.map((tier) => (
              <div key={tier.key}>
                <dt className="text-[11px] uppercase tracking-wider text-white/50">
                  {tier.label}
                </dt>
                <dd className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl text-white tabular-nums">
                  {tier.members.length}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </motion.div>
    </section>
  );
};

export default LeadershipHero;