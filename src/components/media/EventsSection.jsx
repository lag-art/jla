import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaLocationDot,
  FaClock,
  FaCalendarDay,
  FaPersonRunning,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import CountdownTimer from "../common/CountdownTimer";
import { upcomingEvents, pastEvents } from "../../data/events";

// media / EventsSection
// Upcoming events, with past ones listed beneath once they've happened.
//
// SCOPE — why this isn't PressReleases
// PressReleases publishes dated STATEMENTS. This publishes INVITATIONS to
// things that haven't happened yet, which need entirely different
// furniture: a countdown, logistics at a glance, and a register button.
// If an entry has no future date and nothing to sign up for, it's a press
// release, not an event.
//
// Heuristics baked in:
//   - Upcoming vs past is computed from the date at render time, never
//     stored. A hand-set "upcoming" flag would still read upcoming the
//     morning after the race — the one thing an events section must never
//     get wrong.
//   - The countdown reuses CountdownTimer's `blocks` variant, which
//     already stops at zero and turns urgent under 24 hours. Because the
//     stored date carries the start time and the +03:00 offset, it counts
//     to the start gun rather than to midnight.
//   - Logistics (place, time, distances) render as chips rather than
//     sitting inside the paragraph. Someone deciding whether to come needs
//     where, when and how far in one glance; prose hides all three.
//   - The register button only renders when a URL exists, opens in a new
//     tab with rel="noopener noreferrer", and names the destination — it
//     leaves the site, so it shouldn't do that silently.
//   - Self-hiding: no events at all renders nothing rather than an empty
//     "Events" heading.
//   - Poster keeps a fixed aspect box so the card never jumps as it loads,
//     and is decorative (alt="") because the title sits beside it as text.

const formatEventDate = (iso) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const EventsSection = () => {
  const shouldReduceMotion = useReducedMotion();

  if (upcomingEvents.length === 0 && pastEvents.length === 0) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id="events"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-(--jla-navy-950) text-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <SectionTitle
          docket="22"
          eyebrow="Events"
          title="Come out with us."
          description="What the Alliance is putting on next and how to join in."
          tone="dark"
        />

        <div className="flex flex-col gap-6 mt-10 sm:mt-12">
          {upcomingEvents.map((event, i) => (
            <motion.article
              key={event.id}
              id={`event-${event.id}`}
              {...reveal}
              transition={{ ...reveal.transition, delay: shouldReduceMotion ? 0 : i * 0.08 }}
              className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_1fr] gap-6 lg:gap-10 rounded-lg border border-white/10 bg-white/5 overflow-hidden"
            >
              {/* Poster */}
              {event.image && (
                <div className="relative overflow-hidden lg:h-full">
                  <img
                    src={event.image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover aspect-4/3 lg:aspect-auto"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950)/70 to-transparent lg:bg-linear-to-r"
                  />
                </div>
              )}

              <div className="flex flex-col gap-5 p-6 sm:p-8 lg:pl-0">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-(--jla-gold)/50 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-gold)">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-(--jla-gold) motion-safe:animate-pulse"
                    />
                    Upcoming
                  </span>

                  <h3 className="font-(family-name:--font-display) font-semibold text-2xl sm:text-3xl mt-3 leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-white/75 leading-relaxed mt-3 max-w-2xl">
                    {event.blurb}
                  </p>
                </div>

                {/* Logistics — scannable, not buried in the paragraph */}
                <ul className="flex flex-wrap gap-2.5">
                  <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
                    <FaCalendarDay aria-hidden="true" className="text-(--jla-gold) text-xs" />
                    <time dateTime={event.date}>{formatEventDate(event.date)}</time>
                  </li>
                  {event.startTime && (
                    <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
                      <FaClock aria-hidden="true" className="text-(--jla-gold) text-xs" />
                      {event.startTime}
                    </li>
                  )}
                  {event.location && (
                    <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
                      <FaLocationDot aria-hidden="true" className="text-(--jla-gold) text-xs" />
                      {event.location}
                    </li>
                  )}
                  {event.distances?.length > 0 && (
                    <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
                      <FaPersonRunning aria-hidden="true" className="text-(--jla-gold) text-xs" />
                      {event.distances.join(" · ")}
                    </li>
                  )}
                </ul>

                {/* Counts to the start time, not to midnight — see notes */}
                <div>
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-2">
                    Starts in
                  </p>
                  <CountdownTimer targetDate={event.date} variant="blocks" />
                </div>

                {event.registerUrl && (
                  <div className="mt-auto pt-1">
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-sm bg-(--jla-gold) px-8 py-4 text-sm font-semibold uppercase tracking-wide text-(--jla-navy-950) hover:bg-(--jla-gold-300) transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--jla-navy-950)"
                    >
                      {event.registerLabel || "Register"}
                      <FaArrowUpRightFromSquare
                        aria-hidden="true"
                        className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                    {/* Names where the button goes — it leaves the site */}
                    <p className="text-[11px] text-white/45 mt-2">
                      Registration is handled on {new URL(event.registerUrl).hostname.replace(/^www\./, "")}
                    </p>
                  </div>
                )}
              </div>
            </motion.article>
          ))}

          {/* Past events — listed compactly once they've happened */}
          {pastEvents.length > 0 && (
            <motion.div {...reveal} className="pt-4">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-3 pb-2 border-b border-white/10">
                Previously
              </p>
              <ul className="flex flex-col gap-2">
                {pastEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2"
                  >
                    <span className="text-white/80">{event.title}</span>
                    <time
                      dateTime={event.date}
                      className="font-mono text-[11px] text-white/40"
                    >
                      {formatEventDate(event.date)}
                    </time>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;