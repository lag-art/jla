import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaWhatsapp,
  FaCheck,
  FaArrowUpRightFromSquare,
  FaArrowRight,
} from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import joinImage from "../../assets/images/join.jpg";
import constitution from "../../data/documents/constitution";
import ROUTES from "../../routes/routePaths";

// join / MembershipTiers
//
// ⚠️ THE FILENAME IS WRONG AND KEPT ONLY FOR CONTINUITY
// There are no tiers. The Constitution establishes ONE membership, open
// to all, free of charge — Article 3 says "joining is absolutely FREE. No
// financial barriers shall prevent an individual from participating."
// Rendering pricing tiers here would invent a structure the Alliance
// doesn't have, and imply a paid option exists. The file keeps its
// skeleton name so imports don't break; the section is what it actually
// is: one membership and one way in. Rename to MembershipSection when
// convenient.
//
// CONTENT IS READ FROM THE CONSTITUTION, NOT RETYPED
// Rights and duties below are pulled from Article 3 at render time. If
// the Article is amended, this section changes with it. The alternative —
// a hand-written list of "member benefits" — drifts from the governing
// document the moment either is edited, and a benefits list that
// contradicts the constitution is worse than no list.
// If Article 3's structure ever changes so the headings no longer parse,
// the section degrades to the join panel alone rather than rendering
// something wrong.
//
// THE WHATSAPP LINK IS NOW USED TWICE
// JoinHero has it too. Per the note left there, the second usage is the
// moment to stop copying the URL — it lives in data/footerLinks.js as
// `whatsappInvite` and both import it. A group invite that gets revoked
// and re-issued should need changing in exactly one place.
//
// Heuristics baked in:
//   - The free claim is the Constitution's own sentence, quoted and
//     cited, not a marketing line. On the page where someone decides to
//     join, "free" is the claim most worth being able to verify.
//   - Duties are shown alongside rights. A join page that lists only what
//     you get, when the governing document also sets out what's expected,
//     is selectively quoting its own constitution.
//   - The WhatsApp button names its destination and warns it leaves the
//     site — see the fuller note in JoinHero.

// Pulls "[Heading] followed by a list" pairs out of an article's blocks.
// Returns null rather than a partial guess if the shape isn't as expected.
const extractGroups = (article) => {
  if (!article?.blocks) return null;
  const groups = [];
  let current = null;

  for (const block of article.blocks) {
    if (block.type === "heading") {
      current = { heading: block.text, items: [], text: null };
      groups.push(current);
    } else if (current && block.type === "list") {
      current.items.push(...block.items);
    } else if (current && block.type === "text" && !current.text) {
      current.text = block.text;
    }
  }
  return groups.length > 0 ? groups : null;
};

const MembershipTiers = () => {
  const shouldReduceMotion = useReducedMotion();

  const { rights, duties, feeText } = useMemo(() => {
    const article = constitution?.articles?.find((a) => a.id === "article-3");
    const groups = extractGroups(article) || [];
    const find = (needle) =>
      groups.find((g) => g.heading.toLowerCase().includes(needle)) || null;

    return {
      rights: find("rights")?.items || [],
      duties: find("duties")?.items || [],
      feeText: find("fee")?.text || null,
    };
  }, []);

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
        };

  return (
    <section
      id="membership"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <SectionTitle
          docket="25"
          eyebrow="Membership"
          title="One membership. No fee. One way in."
          description="There are no tiers and nothing to pay the Constitution rules out financial barriers to joining."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 mt-10 sm:mt-12 items-start">
          {/* Join panel — the actual point of the page */}
          <motion.div
            {...reveal()}
            className="relative overflow-hidden rounded-lg bg-(--jla-navy-950) text-white"
          >
            <div className="relative">
              <img
                src={joinImage}
                alt=""
                loading="lazy"
                className="w-full aspect-16/10 object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950) via-(--jla-navy-950)/50 to-transparent"
              />
              <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full bg-(--jla-gold) px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-(--jla-navy-950)">
                Free to join
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <h3 className="font-(family-name:--font-display) font-semibold text-xl sm:text-2xl leading-tight">
                  Join the WhatsApp community
                </h3>
                <p className="text-white/75 leading-relaxed mt-2">
                  That's the whole process. Join the group and you're a member
                  no form, no fee, no waiting on approval.
                </p>
              </div>

              <a
                href="https://chat.whatsapp.com/Dqxjj7GpVL7HSCLZM8tIfP?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 w-full rounded-sm bg-(--jla-gold) px-6 py-4 text-sm font-semibold uppercase tracking-wide text-(--jla-navy-950) hover:bg-(--jla-gold-300) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--jla-navy-950) transition-colors duration-200"
              >
                <FaWhatsapp aria-hidden="true" className="text-lg" />
                Join now
                <FaArrowUpRightFromSquare
                  aria-hidden="true"
                  className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <p className="text-xs text-white/50 leading-relaxed">
                welcome to the party.
              </p>
            </div>
          </motion.div>

          {/* What the Constitution actually says — see notes */}
          <motion.div {...reveal(0.08)} className="flex flex-col gap-6">
            {feeText && (
              <blockquote className="border-l-4 border-(--jla-gold) pl-5 py-1">
                <p className="font-(family-name:--font-display) text-(--jla-navy) text-lg leading-relaxed">
                  “{feeText}”
                </p>
                <cite className="not-italic block font-mono text-[10px] tracking-wider uppercase text-(--jla-slate)/70 mt-2">
                  Constitution, Article 3
                </cite>
              </blockquote>
            )}

            {rights.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-gold-600) mb-3">
                  As a member you may
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {rights.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-(--jla-slate) leading-relaxed">
                      <FaCheck
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-[11px] text-(--jla-gold-600)"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shown alongside the rights on purpose — see notes */}
            {duties.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-(--jla-slate)/70 mb-3">
                  And are expected to
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {duties.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-(--jla-slate) leading-relaxed">
                      <span
                        aria-hidden="true"
                        className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-(--jla-slate)/40"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              to={`${ROUTES.RESOURCES_CONSTITUTION}#article-3`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--jla-navy) hover:text-(--jla-gold-600) transition-colors duration-150"
            >
              Read Article 3 in full
              <FaArrowRight aria-hidden="true" className="text-[9px]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MembershipTiers;