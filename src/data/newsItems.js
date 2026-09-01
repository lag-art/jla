// newsItems.js
// Coverage OF the Alliance — external articles, mentions, and features
// published by other outlets.
//
// SCOPE — how this differs from data/pressReleases.js
//   pressReleases  = what the Alliance SAYS. First-party, formal,
//                    published in full on this site.
//   newsItems      = what OTHERS say about the Alliance. Third-party,
//                    summarised here, linked out to the source.
// If an entry would belong in both, it's a press release — that's the
// first-party record. Coverage is only coverage when someone else wrote it.
//
// ⚠️ INTENTIONALLY EMPTY — DO NOT SEED WITH EXAMPLES
// Every field here is a factual claim about a third party: that a named
// outlet published a named article about JLA on a given date. An invented
// entry misattributes work to a real publication, which is worse than a
// placeholder photo and worse even than a fabricated press release —
// it implicates someone outside the Alliance.
// NewsGrid.jsx renders nothing while this is empty.
//
// ENTRY SHAPE
//   id        Stable slug.
//   date      ISO date, e.g. "2026-04-02". Sorting derives from this.
//   title     The article's headline, as published.
//   outlet    Publication name — required. It's what makes this coverage
//             rather than a first-party post.
//   url       Link to the original. Required: summarising someone else's
//             reporting without linking to it is not coverage, it's
//             appropriation.
//   summary   Optional. A SHORT description in your own words — do not
//             paste the article's opening paragraphs.
//   image     Optional thumbnail. Use one the Alliance owns (e.g. a photo
//             from the event) rather than hotlinking the outlet's artwork.
//   type      Optional: "article" | "interview" | "mention" | "feature".
//             Filters derive from whichever types actually appear.

const newsItems = [];

// Newest first — consumers use this so ordering is defined in one place.
export const sortedNews = [...newsItems].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

export const newsOutlets = [...new Set(newsItems.map((n) => n.outlet).filter(Boolean))];

export const newsTypes = [...new Set(newsItems.map((n) => n.type).filter(Boolean))];

export default sortedNews;