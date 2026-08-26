import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import ROUTES from "../../routes/routePaths";

// common / Breadcrumb
// Extracted from about/AboutHero.jsx when leadership/LeadershipHero.jsx
// became the second interior page needing the identical pattern — the
// point at which a shared component is justified by two real usages
// rather than guessed at from one.
//
// Usage: <Breadcrumb items={[{ label: "Leadership & Structure" }]} />
// "Home" is prepended automatically; the final item is treated as the
// current page (not a link, marked aria-current="page").
//
// Heuristics baked in:
//   - Trail is built by prepending Home, so no caller ever has to
//     remember to include it — and it can't drift to a different label
//     or path from one page to the next.
//   - Last item is auto-detected as the current page and rendered as
//     plain text rather than a link to the page you're already on.
//   - An item with no `path` is also rendered unlinked, so an
//     intermediate non-navigable level (e.g. a category with no page of
//     its own) degrades correctly instead of producing a dead link.
//   - `tone` mirrors the light/dark system already used by Card.jsx,
//     SectionTitle.jsx, and SocialLinks.jsx — dark for the navy hero
//     banners, light if it's ever placed on a paper background.
//   - Separators are aria-hidden so a screen reader announces the trail
//     as items, not as a string of chevron characters.

const Breadcrumb = ({ items = [], tone = "dark", className = "" }) => {
  const trail = [{ label: "Home", path: ROUTES.HOME }, ...items];

  const linkColor =
    tone === "dark"
      ? "text-white/60 hover:text-(--jla-gold)"
      : "text-(--jla-slate) hover:text-(--jla-gold-600)";
  const currentColor = tone === "dark" ? "text-(--jla-gold)" : "text-(--jla-gold-600)";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <React.Fragment key={item.label}>
              <li>
                {isLast || !item.path ? (
                  <span aria-current="page" className={currentColor}>
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} className={`${linkColor} transition-colors duration-150`}>
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li
                  aria-hidden="true"
                  className={tone === "dark" ? "text-white/40" : "text-(--jla-slate)/50"}
                >
                  <FaChevronRight className="text-[9px]" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;