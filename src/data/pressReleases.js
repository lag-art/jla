// pressReleases.js
// Official statements and announcements issued by the Alliance.
//
// ⚠️ INTENTIONALLY EMPTY — DO NOT SEED WITH EXAMPLES
// A press release is a dated, attributable statement made by a real
// organisation. Unlike a placeholder photo or a "Full Name" in a roster,
// an invented press release is a claim that JLA said something it never
// said, on a date it never said it. Sample entries here would be
// indistinguishable from real ones to any visitor, and would very likely
// survive into production.
// PressReleases.jsx renders nothing while this array is empty, so the
// Media page simply omits the section until there's something real.
//
// ENTRY SHAPE
//   id        Stable slug, used as the anchor (#pr-<id>).
//   date      ISO date string, e.g. "2026-03-14". Sorting and the year
//             grouping both derive from this — don't store a pre-formatted
//             display date, or the two will drift.
//   title     The headline of the statement.
//   summary   One or two sentences. Shown in the list.
//   body      Optional. Full text, as an array of paragraph strings.
//   category  Optional, e.g. "Statement", "Announcement", "Notice".
//             Filters are derived from whatever categories actually
//             appear, so adding one needs no code change.
//   pdfUrl    Optional. Path under public/documents/.
//   contact   Optional { name, email } for press enquiries on this item.
//
// EXAMPLE (commented out on purpose — uncommenting publishes it):
// {
//   id: "2026-orientation-notice",
//   date: "2026-03-14",
//   title: "...",
//   summary: "...",
//   category: "Notice",
// },

const pressReleases = [];

// Newest first. Components consume this rather than sorting themselves,
// so ordering can never differ between two places that show the same list.
export const sortedReleases = [...pressReleases].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

// Grouped by year, newest year first — used by the Media page listing.
export const releasesByYear = sortedReleases.reduce((acc, release) => {
  const year = new Date(release.date).getFullYear();
  const bucket = acc.find((g) => g.year === year);
  if (bucket) bucket.items.push(release);
  else acc.push({ year, items: [release] });
  return acc;
}, []);

// Categories actually present, for the filter bar.
export const releaseCategories = [
  ...new Set(pressReleases.map((r) => r.category).filter(Boolean)),
];

export default sortedReleases;