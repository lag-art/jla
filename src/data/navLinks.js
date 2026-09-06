import ROUTES from "../routes/routePaths";
import resourcesData, { resourcesByGroup } from "./resourcesData";

// navLinks.js
// Single data source for the primary navigation.
//
// NOMINATIONS REMOVED
// The Nominations page has been retired. The Alliance's nomination and
// election rules are not a separate page — they are Article 5 of the
// Constitution, which is published in full under Resources. Anyone looking
// for "how do elections work" finds the actual governing text rather than
// a summary that could drift out of step with it.
//
// WHY THE RESOURCES SUBMENU IS DERIVED, NOT TYPED
// Every document's label, path, status and length already exist in
// data/resourcesData.js. Retyping them here would create a second source
// of truth that silently drifts. Deriving means adding a document to the
// registry puts it in the nav automatically, correctly grouped.
//
// TWO SHAPES, ON PURPOSE
//   children    — flat list, for the mobile menu and any other consumer.
//   childGroups — grouped, with status and meta, for Navbar's dropdown.
// A consumer that ignores childGroups renders exactly as before.

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
    children: [
      ...resourcesData.map((doc) => ({
        label: doc.shortTitle || doc.title,
        path: doc.route,
        status: doc.status,
      })),
      { label: "Publications", path: ROUTES.RESOURCES_PUBLICATIONS, status: "available" },
    ],
    childGroups: resourceGroups,
  },
  { label: "Media", path: ROUTES.MEDIA },
  { label: "Contact Us", path: ROUTES.CONTACT },
];

export const ctaLink = { label: "Join JLA", path: ROUTES.JOIN };

export default navLinks;