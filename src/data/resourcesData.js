// resourcesData.js
// TODO: Replace hrefs with real document URLs.
// Mirrors the Resources hub sections: Constitution, Manifesto,
// Nomination Rules, Tenders, Publications.

import ROUTES from "../routes/routePaths";

const resourcesData = [
  {
    id: "constitution",
    title: "JLA Constitution",
    tag: "REVISED",
    summary: "The founding constitution governing the Juris Leadership Alliance.",
    route: ROUTES.RESOURCES_CONSTITUTION,
    image: "/assets/images/placeholders/image2.svg",
  },
  {
    id: "manifesto",
    title: "JLA Manifesto",
    tag: "",
    summary: "Our commitment to a transformative leadership agenda.",
    route: ROUTES.RESOURCES_MANIFESTO,
    image: "/assets/images/placeholders/image3.svg",
  },
  {
    id: "nomination-rules",
    title: "Amended Nomination Rules",
    tag: "",
    summary: "Rules governing nominations and internal elections.",
    route: ROUTES.RESOURCES_NOMINATION_RULES,
    image: "/assets/images/placeholders/image4.svg",
  },
  
  {
    id: "publications",
    title: "Publications",
    tag: "",
    summary: "Insight into our journey as an alliance and as a movement.",
    route: ROUTES.RESOURCES_PUBLICATIONS,
    image: "/assets/images/placeholders/image6.svg",
  },
];

export default resourcesData;
