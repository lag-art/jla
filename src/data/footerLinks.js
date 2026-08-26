import ROUTES from "../routes/routePaths";

// footerLinks.js
// Data source for Footer.jsx. Grouped into 3 columns that map to real
// routes only — no dead "#" links, no placeholder destinations.

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", path: ROUTES.HOME },
      { label: "About Us", path: ROUTES.ABOUT },
      { label: "Leadership & Structure", path: ROUTES.LEADERSHIP },
      { label: "Media", path: ROUTES.MEDIA },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Constitution", path: ROUTES.RESOURCES_CONSTITUTION },
      { label: "Manifesto", path: ROUTES.RESOURCES_MANIFESTO },
      { label: "Publications", path: ROUTES.RESOURCES_PUBLICATIONS },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Membership", path: ROUTES.JOIN },
      { label: "Nominations", path: ROUTES.NOMINATIONS },
      { label: "Contact Us", path: ROUTES.CONTACT },
      { label: "Keep me Updated", path: ROUTES.CONTACT },
    ],
  },
];

// Flat aliases — kept so Footer.jsx's existing two-column render still
// works without a rewrite. Prefer mapping over footerColumns directly
// in any new layout.
export const quickLinks = footerColumns[0].links;
export const serviceRequests = footerColumns[2].links;

export const contactInfo = {
  orgName: "Juris Leadership Alliance",
  officeLabel: "Nairobi Office",
  addressLine1: "Bogani E Rd",
  addressLine2: "Nairobi, Kenya",
  phone: "+254 727 376323",
  email: "juriscartels@gmail.com",
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6076.545655628846!2d36.756669!3d-1.352421!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f0539d181204b%3A0x6e7169577881d08f!2sCatholic%20University%20of%20Eastern%20Africa!5e1!3m2!1sen!2ske!4v1787568731397!5m2!1sen!2ske",
};

// Just real URLs — SocialLinks.jsx auto-detects platform (icon + label)
// from each hostname, so this list never needs a manual label/icon kept
// in sync by hand. Add a new platform here and it just works, as long as
// SocialLinks.jsx's PLATFORM_MAP recognizes the domain (it covers the
// common ones; unknown domains fall back to a generic link icon).
export const socialLinks = [
  { url: "https://www.instagram.com/juris_cartels?igsh=bW02amxwNW5va3p1" },
  { url: "https://www.tiktok.com/@juris.cartels6?_r=1&_t=ZS-94wuHDwylWb" },
  { url: "https://x.com/juris_cartels" },
];