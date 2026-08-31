import ROUTES from "../routes/routePaths";
import resourcesData, { resourcesByGroup } from "./resourcesData";

// navLinks.js
// Single data source for the primary navigation.
//
// WHY THE RESOURCES SUBMENU IS DERIVED, NOT TYPED
// Every document's label, path, status and length already exist in
// data/resourcesData.js. Retyping them here would create a second source
// of truth that silently drifts — a renamed policy or changed anchor
// would keep working on the Resources page while the dropdown quietly
// pointed somewhere wrong. Deriving means adding a document to the
// registry puts it in the nav automatically, correctly grouped.
//
// TWO SHAPES, ON PURPOSE
//   children    — flat list. Every existing consumer (mobile menu, any
//                 future sitemap) keeps working untouched.
//   childGroups — the same items grouped, with status and meta attached,
//                 for Navbar's richer dropdown panel. A consumer that
//                 ignores this renders exactly as before, so the richer
//                 menu is an enhancement rather than a breaking change.
//
// Pending documents are INCLUDED (the Manifesto shows in the dropdown)
// because its page renders an honest "not yet published" state rather
// than a dead end. It's marked `pending` so the menu can say so up front
// instead of letting someone click through to find out.
//
// Publications is appended manually: it has a page and route but no
// registry entries yet, so it can't be derived. When the first
// publication lands it arrives through resourcesByGroup and this manual
// entry should be deleted.

const documentGroups = resourcesByGroup.map((group) => ({
  label: group.label,
  items: group.items.map((doc) => ({
    label: doc.shortTitle || doc.title,
    path: doc.route,
    status: doc.status,
    meta: doc.meta || null,
    sectionLabel: doc.sectionLabel,
  })),
}));

const publicationsGroup = {
  label: "Publications",
  items: [
    {
      label: "All Publications",
      path: ROUTES.RESOURCES_PUBLICATIONS,
      status: "available",
      meta: null,
    },
  ],
};

export const resourceGroups = [...documentGroups, publicationsGroup];

const navLinks = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About Us", path: ROUTES.ABOUT },
  { label: "Leadership & Structure", path: ROUTES.LEADERSHIP },
  {
    label: "Resources",
    path: ROUTES.RESOURCES,
    // Flat — kept for the mobile menu and any other existing consumer.
    children: [
      ...resourcesData.map((doc) => ({
        label: doc.shortTitle || doc.title,
        path: doc.route,
        status: doc.status,
      })),
      { label: "Publications", path: ROUTES.RESOURCES_PUBLICATIONS, status: "available" },
    ],
    // Grouped — used by Navbar's dropdown panel.
    childGroups: resourceGroups,
  },
  { label: "Media", path: ROUTES.MEDIA },
  { label: "Nominations", path: ROUTES.NOMINATIONS },
  { label: "Contact Us", path: ROUTES.CONTACT },
];

export const ctaLink = { label: "Join JLA", path: ROUTES.JOIN };

export default navLinks;