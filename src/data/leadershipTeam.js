// leadershipTeam.js
//
// Single source for JLA's leadership roster. Consumed by:
//   - home/LeadershipPreview.jsx   (homepage carousel/grid)
//   - about/TeamSection.jsx        (compact portrait strip)
//   - leadership/LeadershipTeamGrid.jsx + OrgChart.jsx (full page)
//
// ⚠️ NAMES ARE PLACEHOLDERS. Every `name` below is literally "Full Name"
// on purpose — inventing plausible-sounding names for a real
// organisation's leadership page would present fabricated people as
// actual elected officials to anyone visiting the site. Replace each
// with the real person before launch; `role` and `image` are already
// wired correctly and don't need to change.
//
// ADDING / REMOVING A LEADER
// Just add or delete an entry here — no component needs editing:
//   - `tier` drives grouping and display order on the Leadership page.
//     "executive" renders first and larger; "official" renders after.
//   - `order` sorts within a tier (lower first). Leave gaps (10, 20, 30)
//     so a new role can be slotted between two others without renumbering
//     everything else.
//   - `image` is imported at the top of this file so Vite fingerprints and
//     bundles it properly — string paths into src/assets/ would NOT be
//     processed by the bundler and would 404 in the production build.
//   - `bio` is optional. Components render it only when present, so a
//     brand-new entry with no bio yet degrades cleanly instead of
//     showing an empty block.

import leader1 from "../assets/images/leader1.jpg";
import leader2 from "../assets/images/leader2.jpg";
import leader3 from "../assets/images/leader3.jpg";
import leader4 from "../assets/images/leader4.jpg";
import leader5 from "../assets/images/leader5.jpg";
import leader6 from "../assets/images/leader6.jpg";
import leader7 from "../assets/images/leader7.jpg";
import leader8 from "../assets/images/leader8.jpg";

export const TIERS = {
  executive: { label: "Executive Committee", rank: 1 },
  official: { label: "Officials & Representatives", rank: 2 },
};

const leadershipTeam = [
  { id: "president", name: "John otieno", role: "Party Leader", tier: "executive", order: 10, image: leader1, bio: "" },
  { id: "vice-president", name: "Anne tuvia", role: "Deputy Party Leader", tier: "executive", order: 20, image: leader2, bio: "" },
  { id: "secretary-general", name: "Full Name", role: "Secretary General", tier: "executive", order: 30, image: leader3, bio: "" },
  { id: "treasurer", name: "Duncun Kibet", role: "Treasurer", tier: "executive", order: 40, image: leader4, bio: "" },
  { id: "organising-secretary", name: "Ronny adhiambo", role: "Organising Secretary", tier: "official", order: 10, image: leader5, bio: "" },
  { id: "academic-affairs", name: "Leshan brian", role: "Legal Advisor", tier: "official", order: 20, image: leader6, bio: "" },
  { id: "communications", name: "Hellena monda", role: "Media", tier: "official", order: 30, image: leader7, bio: "" },
  { id: "Secretary", name: "Alvan moses", role: "Secretary", tier: "official", order: 40, image: leader8, bio: "" },
];

// Sorted by tier rank, then by order within the tier — so components
// never have to re-implement this ordering themselves.
export const sortedLeadership = [...leadershipTeam].sort((a, b) => {
  const rankDiff = (TIERS[a.tier]?.rank ?? 99) - (TIERS[b.tier]?.rank ?? 99);
  return rankDiff !== 0 ? rankDiff : (a.order ?? 99) - (b.order ?? 99);
});

// Grouped by tier, ready for the Leadership page's sectioned layout.
export const leadershipByTier = Object.keys(TIERS).map((tierKey) => ({
  key: tierKey,
  ...TIERS[tierKey],
  members: sortedLeadership.filter((m) => m.tier === tierKey),
}));

export default sortedLeadership;