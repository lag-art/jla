// mediaItems.js
// TODO: Replace with real photos/videos and captions.
// No individual media post pages exist yet — only the /media hub — so
// items intentionally carry no per-item `route`. MediaPreview.jsx opens
// them in a Modal lightbox instead of linking to a page that doesn't
// exist, and points a single CTA at the real /media hub.
//
// Exactly 5 items by design: MediaPreview splits this into 1 featured +
// 4 grid, the same numeric pattern ResourcesPreview uses for its 5
// resource documents — a deliberate, repeated layout so both sections
// resolve their "odd number of items" problem the same way.

const mediaItems = [
  {
    id: 1,
    type: "photo",
    title: "Annual Leadership Summit",
    caption: "Delegates from every faculty cohort gathered for the 2026 summit.",
    image: "/assets/images/placeholders/image4.svg",
  },
  {
    id: 2,
    type: "video",
    title: "JLA Orientation Highlights",
    caption: "A look back at this year's new-member orientation.",
    image: "/assets/images/placeholders/image5.svg",
  },
  {
    id: 3,
    type: "photo",
    title: "Community Outreach Day",
    caption: "Members volunteering with local legal-aid clinics.",
    image: "/assets/images/placeholders/image6.svg",
  },
  {
    id: 4,
    type: "photo",
    title: "Moot Court Finals",
    caption: "The faculty's top advocates faced off in the final round.",
    image: "/assets/images/placeholders/image7.svg",
  },
  {
    id: 5,
    type: "photo",
    title: "Faculty Townhall",
    caption: "An open forum between JLA leadership and the student body.",
    image: "/assets/images/placeholders/image8.svg",
  },
];

export default mediaItems;