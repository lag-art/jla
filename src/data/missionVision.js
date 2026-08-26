// missionVision.js
// Single source for JLA's Mission and Vision text — used by both
// home/AboutPreview.jsx (compact teaser cards) and about/MissionVision.jsx
// (the full About-page section). Previously this text was hardcoded
// separately inside AboutPreview.jsx; extracted here so an edit to the
// mission statement only ever needs to happen in one place.

const missionVision = [
  {
    id: "mission",
    label: "Our Mission",
    text: "To represent and empower law students through principled leadership, promote academic excellence, and uphold justice, integrity, and accountability within the faculty and beyond.",
  },
  {
    id: "vision",
    label: "Our Vision",
    text: "To build a united and progressive faculty of law led by principled student leaders committed to justice, excellence, and service to society.",
  },
];

export default missionVision;