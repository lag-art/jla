import { useEffect } from "react";

// common / SEO
// Per-page <head> manager — no react-helmet dependency for a job this
// size. Drop into any page in src/pages/*.jsx:
//   <SEO title="About" description="Who we are and what we stand for." />
//
// Heuristics baked in:
//   - `title` is auto-suffixed with " — Juris Leadership Alliance" unless
//     the caller already included the brand name, so pages never end up
//     with a duplicated "JLA — JLA" title by accident.
//   - `description` is auto-truncated to 160 chars at a word boundary —
//     Google truncates awkwardly mid-word past that length, and it's the
//     kind of detail every page author forgets. Enforced here once.
//   - Open Graph + Twitter Card tags are set alongside <title>/description
//     automatically, not as a separate opt-in — every JLA page can now be
//     shared on Instagram/TikTok/X (already wired in SocialLinks) with a
//     correct preview instead of a blank card.
//   - `image` defaults to the seal logo already in public/brand/, so a
//     page that hasn't set a custom share image still shares something
//     branded rather than nothing.
//   - `noIndex` sets robots meta for pages that shouldn't be indexed
//     (e.g. a future thank-you/confirmation page) — off by default.
//   - Every tag this component touches is restored to its exact previous
//     value on unmount, so navigating between pages never leaves stale
//     meta behind for the next page to inherit.

const SITE_NAME = "Juris Leadership Alliance";
const DEFAULT_IMAGE = "/brand/logo-juris.jpeg";
const DESCRIPTION_LIMIT = 160;

const truncate = (text, limit) => {
  if (!text || text.length <= limit) return text;
  const clipped = text.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : limit)}…`;
};

// Creates or updates a <meta> tag, tracking prior state so it can be
// restored (or removed, if it didn't exist before) on unmount.
const upsertMeta = (attr, key, content) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  const existed = Boolean(el);
  const previousContent = el?.getAttribute("content") ?? null;

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);

  return () => {
    if (!existed) {
      el.remove();
    } else if (previousContent !== null) {
      el.setAttribute("content", previousContent);
    }
  };
};

const upsertLink = (rel, href) => {
  let el = document.querySelector(`link[rel="${rel}"]`);
  const existed = Boolean(el);
  const previousHref = el?.getAttribute("href") ?? null;

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);

  return () => {
    if (!existed) {
      el.remove();
    } else if (previousHref !== null) {
      el.setAttribute("href", previousHref);
    }
  };
};

const SEO = ({ title, description, image, noIndex = false, canonical }) => {
  useEffect(() => {
    const cleanups = [];
    const previousTitle = document.title;

    const fullTitle = title
      ? title.includes(SITE_NAME)
        ? title
        : `${title} — ${SITE_NAME}`
      : SITE_NAME;
    document.title = fullTitle;

    const cleanDescription = truncate(description, DESCRIPTION_LIMIT);
    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedUrl =
      canonical || (typeof window !== "undefined" ? window.location.href : "");

    if (cleanDescription) {
      cleanups.push(upsertMeta("name", "description", cleanDescription));
      cleanups.push(upsertMeta("property", "og:description", cleanDescription));
      cleanups.push(upsertMeta("name", "twitter:description", cleanDescription));
    }

    cleanups.push(upsertMeta("property", "og:title", fullTitle));
    cleanups.push(upsertMeta("property", "og:site_name", SITE_NAME));
    cleanups.push(upsertMeta("property", "og:type", "website"));
    cleanups.push(upsertMeta("property", "og:image", resolvedImage));
    cleanups.push(upsertMeta("name", "twitter:card", "summary_large_image"));
    cleanups.push(upsertMeta("name", "twitter:title", fullTitle));
    cleanups.push(upsertMeta("name", "twitter:image", resolvedImage));

    if (resolvedUrl) {
      cleanups.push(upsertMeta("property", "og:url", resolvedUrl));
      cleanups.push(upsertLink("canonical", resolvedUrl));
    }

    cleanups.push(
      upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow")
    );

    return () => {
      document.title = previousTitle;
      cleanups.forEach((restore) => restore());
    };
  }, [title, description, image, noIndex, canonical]);

  return null;
};

export default SEO;