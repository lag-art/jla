import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaArrowRight } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import Card from "../common/Card";
import Button from "../common/Button";
import leadershipTeam from "../../data/leadershipTeam";
import ROUTES from "../../routes/routePaths";

// home / LeadershipPreview
// Third homepage section — introduces the executive team, links through
// to the full LeadershipPage rather than individual profile pages (none
// exist yet, so member cards are intentionally non-interactive: passing
// `to` on a Card with no real destination would be a fake, dead link).
//
// Heuristics baked in:
//   - Two layouts, CSS-switched rather than JS-switched: a Swiper carousel
//     below `lg`, a static grid at `lg` and up. Portrait cards in a rigid
//     grid get cramped on phones (4 competing for one narrow column or an
//     awkward 2x2); a swipeable, peeking-next-card carousel is the more
//     appealing mobile pattern for a small set of profile cards. Using
//     `lg:hidden` / `hidden lg:grid` to switch means no matchMedia/resize
//     listener, no hydration flash — the browser's own CSS engine decides,
//     which is simpler and can't get out of sync with the real viewport.
//   - Team list is fully data-driven from data/leadershipTeam.js — adding
//     a 5th executive member is a one-line data edit; this component
//     never hardcodes a member count anywhere in its layout logic.
//   - Single "Meet the Full Team" CTA rather than per-member links, since
//     that's the only real destination that currently exists for this
//     content (ROUTES.LEADERSHIP).

const LeadershipPreview = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="bg-(--jla-paper)">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <motion.div {...reveal} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12">
          <SectionTitle
            docket="03"
            eyebrow="Our Leadership"
            title="Elected to serve, held to account."
            description="Meet the executive team leading JLA's mission chosen by their peers to represent every law student in the faculty."
          />
          <div className="hidden lg:block shrink-0">
            <Button to={ROUTES.LEADERSHIP} variant="secondary" iconRight={FaArrowRight}>
              Meet the Full Team
            </Button>
          </div>
        </motion.div>

        {/* Mobile / tablet: swipeable carousel */}
        <motion.div {...reveal} className="lg:hidden -mx-(--container-padding) px-(--container-padding)">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1.25}
            breakpoints={{
              480: { slidesPerView: 1.6 },
              640: { slidesPerView: 2.2 },
            }}
            className="pb-10!"
          >
            {leadershipTeam.map((member) => (
              <SwiperSlide key={member.id}>
                <Card
                  image={member.image}
                  imageAlt={`${member.name} — ${member.role}`}
                  orientation="portrait"
                  title={member.name}
                  tag={member.role}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Desktop: static grid */}
        <motion.div {...reveal} className="hidden lg:grid grid-cols-4 gap-6">
          {leadershipTeam.map((member) => (
            <Card
              key={member.id}
              image={member.image}
              imageAlt={`${member.name} — ${member.role}`}
              orientation="portrait"
              title={member.name}
              tag={member.role}
            />
          ))}
        </motion.div>

        <div className="lg:hidden mt-8">
          <Button to={ROUTES.LEADERSHIP} variant="secondary" fullWidth iconRight={FaArrowRight}>
            Meet the Full Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LeadershipPreview;