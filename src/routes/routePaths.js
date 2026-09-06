// routePaths.js
// Single source of truth for every route path in the app.
// Import ROUTES anywhere (Navbar, Footer, <Link>, redirects) instead of
// hardcoding path strings, so the whole site stays in sync if a path changes.

const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LEADERSHIP: "/leadership",

  RESOURCES: "/resources",
  RESOURCES_CONSTITUTION: "/resources/constitution",
  RESOURCES_MANIFESTO: "/resources/manifesto",
  RESOURCES_PUBLICATIONS: "/resources/publications",

  MEDIA: "/media",
  CONTACT: "/contact",
  JOIN: "/join",

  NOT_FOUND: "*",
};

export default ROUTES;
