import ROUTES from "../routes/routePaths";

// Cover images — imported, not string paths, because they live under
// src/assets/. Vite fingerprints and optimises them (constitutionImg.jpg
// becomes constitutionImg-a8f3d2.jpg in the build), which is what you want
// for images rendered in cards. A plain string path here would NOT be
// processed by the bundler and would 404 in production.
import constitutionImg from "../assets/images/documents/constitutionImg.jpg";
import disciplinaryImg from "../assets/images/documents/disciplinaryImg.jpg";
import genderImg from "../assets/images/documents/genderImg.jpg";
import attendanceImg from "../assets/images/documents/attendanceImg.jpg";

// resourcesData.js
//
// REGISTRY, not content. This file lists WHICH documents exist and how
// they're grouped/displayed. The actual readable text of each document
// lives in src/data/documents/<id>.js and is loaded by DocumentReader.
// Keeping them separate means this file stays small and scannable even
// when the Constitution's ten articles are fully transcribed.
//
// WHERE FILES LIVE — and why the two are treated differently:
//   - readable text -> src/data/documents/<id>.js   (bundled, searchable)
//   - cover image   -> src/assets/images/documents/ (IMPORTED, fingerprinted)
//   - PDF download  -> public/documents/            (STRING PATH, stable URL)
// PDFs deliberately stay unfingerprinted so /documents/jlaconstitution.pdf
// keeps working after a rebuild — people bookmark, cite, and paste these
// links into WhatsApp groups, and a hashed filename would break all of that.
//
// FIELD REFERENCE
//   id        Stable slug. Also the anchor target (#constitution) and the
//             expected filename of its content module.
//   type      "document"    — static, section-numbered, read via DocumentReader
//             "publication" — dated/authored, accumulates over time. Reserved
//             for the Publications group; NOT rendered by DocumentReader,
//             since a newsletter isn't shaped like a constitution.
//   status    "available" — real content exists, fully rendered
//             "pending"   — announced but not ready. Renders an honest
//             "in preparation" state: no download button, no fake preview.
//   group     Key into GROUPS below. Drives SideNav and page ordering.
//   route     Where this document is read. Documents with their own route
//             use it; the three policies share the Resources page and
//             deep-link by anchor, so no new routes were needed for them.
//   pdfUrl    Path under public/. Omitted when no PDF exists yet —
//             components check for it rather than rendering a dead button.
//   version   Shown to readers so they know which revision they're reading.
//             Bump this on amendment instead of renaming the PDF.
//   meta      Display metadata for cards and reader headers: `sections`
//             (articles/clauses the document contains) and `readMinutes`.
//             These are CONFIRMED against the converted modules in
//             src/data/documents/ — each count is the actual length of the
//             parsed structure, not an estimate. ResourcesHero sums them
//             into the totals it displays, so a wrong count here becomes a
//             wrong claim on the page. Recompute after any amendment.
//
// NOT INCLUDED, deliberately: an "adopted on" date. Every source document
// carries an UNFILLED certification block ("duly adopted by the General
// Assembly ... on the ____ day of __________ 20____"), meaning formal
// adoption isn't recorded in the files we have. Publishing a date the
// documents don't actually assert would misrepresent their legal status.
// Add `adoptedOn` per entry once executed copies exist.
//
// ADDING A DOCUMENT: add an entry here + its module in src/data/documents/.
// Nothing else in the app hardcodes the document list.

export const GROUPS = {
  governing: { key: "governing", label: "Governing Document", order: 1 },
  policies: { key: "policies", label: "Policies & Procedures", order: 2 },
  publications: { key: "publications", label: "Publications", order: 3 },
};

const resourcesData = [
  {
    id: "constitution",
    title: "JLA Constitution",
    tag: "Governing Document",
    type: "document",
    status: "available",
    group: "governing",
    summary:
      "The founding instrument of the Alliance — establishing its name, motto, purpose, membership, leadership, elections, finances, and discipline across ten articles.",
    route: ROUTES.RESOURCES_CONSTITUTION,
    image: constitutionImg,
    pdfUrl: "/documents/jlaconstitution.pdf",
    version: "2026",
    sectionLabel: "Article",
    meta: { sections: 10, readMinutes: 7 },
  },
  {
    id: "manifesto",
    title: "JLA Manifesto",
    tag: "",
    type: "document",
    status: "pending", // renders an "in preparation" state — see status note
    group: "governing",
    summary:
      "The Alliance's programme of action for the current leadership cycle.",
    route: ROUTES.RESOURCES_MANIFESTO,
    version: "",
    sectionLabel: "Section",
    // No image, pdfUrl, or meta: nothing to measure or link to yet.
    // Components check for these rather than rendering empty affordances.
  },
  {
    id: "disciplinary-act",
    title: "Disciplinary Procedure Act",
    tag: "Procedure",
    type: "document",
    status: "available",
    group: "policies",
    summary:
      "The procedure followed when a member or office bearer is alleged to have contravened the Constitution — from complaint through hearing, verdict, and appeal.",
    route: `${ROUTES.RESOURCES}#disciplinary-act`,
    image: disciplinaryImg,
    pdfUrl: "/documents/jladisciplinary.pdf",
    version: "2026",
    sectionLabel: "Clause",
    meta: { sections: 7, readMinutes: 2 },
  },
  {
    id: "gender-policy",
    title: "Gender Equality & Prohibition of Discrimination Policy",
    shortTitle: "Gender Equality Policy",
    tag: "Policy",
    type: "document",
    status: "available",
    group: "policies",
    summary:
      "Defines discrimination, harassment, and retaliation, and sets out the Alliance's commitments on non-discrimination in membership, office, and participation.",
    route: `${ROUTES.RESOURCES}#gender-policy`,
    image: genderImg,
    pdfUrl: "/documents/jlagender.pdf",
    version: "2026",
    sectionLabel: "Section",
    meta: { sections: 6, readMinutes: 3 },
  },
  {
    id: "attendance-policy",
    title: "Attendance & Fining Policy",
    tag: "Policy",
    type: "document",
    status: "available",
    group: "policies",
    summary:
      "Attendance expectations for members and the Executive Committee, and the warnings, fines, and suspensions that follow unexcused absence.",
    route: `${ROUTES.RESOURCES}#attendance-policy`,
    image: attendanceImg,
    pdfUrl: "/documents/jlaattendance.pdf",
    version: "2026",
    sectionLabel: "Clause",
    meta: { sections: 15, readMinutes: 4 },
  },
];

// --- Derived helpers: components consume these, not the raw array ------

export const availableResources = resourcesData.filter(
  (r) => r.status === "available"
);

// Grouped + ordered, empty groups dropped — so SideNav and the Resources
// page never render a heading with nothing under it (e.g. Publications
// stays invisible until its first entry is added).
export const resourcesByGroup = Object.values(GROUPS)
  .sort((a, b) => a.order - b.order)
  .map((group) => ({
    ...group,
    items: resourcesData.filter((r) => r.group === group.key),
  }))
  .filter((group) => group.items.length > 0);

export const getResourceById = (id) => resourcesData.find((r) => r.id === id);

export default resourcesData;