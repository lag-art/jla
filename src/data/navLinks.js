import ROUTES from "../routes/routePaths";

// navLinks.js
// Single data source for the primary navigation. Navbar.jsx (and any
// mobile menu) should map over this rather than hardcoding <Link> tags.

const navLinks = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About Us", path: ROUTES.ABOUT },
  { label: "Leadership & Structure", path: ROUTES.LEADERSHIP },
  {
    label: "Resources",
    path: ROUTES.RESOURCES,
    children: [
      { label: "Constitution", path: ROUTES.RESOURCES_CONSTITUTION },
      { label: "Manifesto", path: ROUTES.RESOURCES_MANIFESTO },
      { label: "Publications", path: ROUTES.RESOURCES_PUBLICATIONS },
    ],
  },
  { label: "Media", path: ROUTES.MEDIA },
  { label: "Nominations", path: ROUTES.NOMINATIONS },
  { label: "Contact Us", path: ROUTES.CONTACT },
];

export const ctaLink = { label: "Join JLA", path: ROUTES.JOIN };

export default navLinks;