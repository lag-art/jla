import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import { sortedLeadership, leadershipByTier } from "../../data/leadershipTeam";

// leadership / OrgChart
// Visualises how the Alliance is structured.
//
// THE HARD PART — responsiveness:
// A connected org tree is inherently horizontal, and horizontal doesn't
// fit a phone. The two usual escapes are both bad: overflow-x scrolling
// (you can never see the whole structure) or squashing until nothing is
// readable. So this renders two genuinely different layouts, CSS-switched
// (no matchMedia, no resize listener, no hydration flash):
//   - lg and up: a real connected tree with drawn connector lines.
//   - below lg: an indented vertical spine — the same hierarchy expressed
//     through indentation depth instead of horizontal branching, which is
//     how file trees have always solved this.
//
// THE HONEST PART — data:
// An org chart asserts "X answers to Y." data/leadershipTeam.js has no
// confirmed reporting lines yet, so this component does NOT invent them.
// It runs in one of two modes, chosen automatically:
//   - "tiers"  (current): groups by tier only — asserts just what we know,
//              that some members are executives and others are officials.
//              No connector lines between people, because we'd be making
//              up the relationships those lines represent.
//   - "tree"   (automatic): the moment ANY member gets a `reportsTo` id in
//              the data file, this switches to a true connected tree.
// See that file's REPORTING STRUCTURE note for how to turn tree mode on.
//
// Other heuristics:
//   - Renders as nested <ul>/<li> in both layouts, so a screen reader
//     conveys the hierarchy through real list nesting rather than relying
//     on the visual connector lines (which are aria-hidden decoration).
//   - Cycle-safe: a circular reportsTo (a->b->a) would otherwise produce
//     zero roots and silently render an empty chart. If that happens,
//     every node is promoted to root level so the data is still visible
//     and the misconfiguration is obvious rather than invisible.
//   - Depth-based reveal delay, capped, so deep trees don't crawl in.

const buildTree = (members) => {
  const byId = new Map(members.map((m) => [m.id, { ...m, children: [] }]));
  const roots = [];

  for (const node of byId.values()) {
    const parent = node.reportsTo ? byId.get(node.reportsTo) : null;
    if (parent && parent !== node) parent.children.push(node);
    else roots.push(node);
  }

  // Cycle rescue — see header note.
  if (roots.length === 0 && byId.size > 0) {
    return [...byId.values()].map((n) => ({ ...n, children: [] }));
  }
  return roots;
};

const NodeCard = ({ member, level = 0, compact = false }) => (
  <div
    className={`relative inline-flex items-center gap-3 rounded-md border bg-white text-left transition-colors duration-200 hover:border-(--jla-gold) ${
      level === 0
        ? "border-(--jla-gold) shadow-(--shadow-sm)"
        : "border-(--jla-line)"
    } ${compact ? "p-2.5 pr-4" : "p-3 pr-5"}`}
  >
    <ImagePlaceholder
      src={member.image}
      ratio="1/1"
      rounded="full"
      alt=""
      className={compact ? "w-9 h-9 shrink-0" : "w-11 h-11 shrink-0"}
    />
    <div className="min-w-0">
      <p className="font-mono text-[10px] tracking-wider uppercase text-(--jla-gold-600) truncate">
        {member.role}
      </p>
      <p className="font-(family-name:--font-display) font-semibold text-sm text-(--jla-navy) leading-tight truncate">
        {member.name}
      </p>
    </div>
  </div>
);

// ---- Desktop: connected tree -------------------------------------------
const TreeNode = ({ member, level = 0 }) => {
  const children = member.children || [];
  const hasChildren = children.length > 0;

  return (
    <li className="flex flex-col items-center">
      <NodeCard member={member} level={level} />

      {hasChildren && (
        <>
          {/* stem down from this node */}
          <span aria-hidden="true" className="w-px h-7 bg-(--jla-line)" />

          <ul className="flex items-start justify-center">
            {children.map((child, i) => {
              const isFirst = i === 0;
              const isLast = i === children.length - 1;
              const isOnly = children.length === 1;

              return (
                <li key={child.id} className="relative flex flex-col items-center px-3 lg:px-4">
                  {/* horizontal bar, trimmed at the row's outer edges */}
                  {!isOnly && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 h-px bg-(--jla-line) ${
                        isFirst ? "left-1/2 right-0" : isLast ? "left-0 right-1/2" : "left-0 right-0"
                      }`}
                    />
                  )}
                  {/* stem up into the bar */}
                  <span aria-hidden="true" className="w-px h-7 bg-(--jla-line)" />
                  <TreeNode member={child} level={level + 1} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </li>
  );
};

// ---- Mobile: indented spine --------------------------------------------
const SpineNode = ({ member, level = 0 }) => {
  const children = member.children || [];

  return (
    <li className="relative">
      <div className="py-1.5">
        <NodeCard member={member} level={level} compact />
      </div>

      {children.length > 0 && (
        <ul className="relative ml-5 pl-5 border-l border-(--jla-line)">
          {children.map((child) => (
            <SpineNode key={child.id} member={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const OrgChart = () => {
  const shouldReduceMotion = useReducedMotion();

  const usesExplicitReporting = sortedLeadership.some((m) => m.reportsTo);
  const roots = usesExplicitReporting ? buildTree(sortedLeadership) : [];
  const populatedTiers = leadershipByTier.filter((t) => t.members.length > 0);

  if (sortedLeadership.length === 0) return null;

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section className="bg-(--jla-paper)">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-16 sm:py-20 lg:py-28">
        <SectionTitle
          docket="15"
          eyebrow="How We're Organised"
          title="Structure of the Alliance"
          description="How responsibility is distributed across the Alliance's elected leadership."
        />

        <motion.div {...reveal} className="mt-10 sm:mt-12">
          {usesExplicitReporting ? (
            <>
              {/* Desktop tree */}
              <div className="hidden lg:block overflow-x-auto pb-4">
                <ul className="flex justify-center min-w-fit">
                  {roots.map((root) => (
                    <TreeNode key={root.id} member={root} />
                  ))}
                </ul>
              </div>

              {/* Mobile spine */}
              <ul className="lg:hidden flex flex-col gap-1">
                {roots.map((root) => (
                  <SpineNode key={root.id} member={root} />
                ))}
              </ul>
            </>
          ) : (
            /* Tier mode — see header note on why no connector lines here */
            <div className="flex flex-col gap-8 sm:gap-10">
              {populatedTiers.map((tier) => (
                <div key={tier.key}>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-mono text-xs tracking-widest uppercase text-(--jla-gold-600) whitespace-nowrap">
                      {tier.label}
                    </h3>
                    <span aria-hidden="true" className="h-px flex-1 bg-(--jla-line)" />
                  </div>

                  <ul className="flex flex-wrap gap-3">
                    {tier.members.map((member) => (
                      <li key={member.id}>
                        <NodeCard member={member} level={tier.rank - 1} compact />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default OrgChart;