// coreValues.js
// Single source for JLA's four core values — shared by
// home/AboutPreview.jsx (badge row) and about/CoreValues.jsx (full cards).
//
// ⚠️ REVIEW NEEDED — `description` fields are DRAFT text.
// The source content provides these four values as single words only,
// with no accompanying definitions. The descriptions below were drafted
// to give the full About-page section substance, but they are NOT
// official JLA wording — they're a starting point for the team to
// approve, rewrite, or replace. The `label` values ARE official; the
// `description` values are not. Components that only need the official
// part (e.g. AboutPreview's badges) render `label` alone.

const coreValues = [
  {
    id: "justice",
    label: "Justice",
    description:
      "DRAFT — Fairness is not situational. We advocate for outcomes that hold regardless of who benefits.",
  },
  {
    id: "integrity",
    label: "Integrity",
    description:
      "DRAFT — What we say in public and what we do in private are the same thing.",
  },
  {
    id: "accountability",
    label: "Accountability",
    description:
      "DRAFT — Leadership means answering for decisions, in the open, to the people they affect.",
  },
  {
    id: "leadership",
    label: "Leadership",
    description:
      "DRAFT — A responsibility carried on behalf of others, never a title held for its own sake.",
  },
];

export default coreValues;