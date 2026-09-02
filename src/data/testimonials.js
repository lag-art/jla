// testimonials.js
//
// REAL, ATTRIBUTED TESTIMONIALS — handle accordingly.
// Every entry below is a named student and a quote attributed to them.
// That makes each one a factual claim about a real person, not display
// copy: changing a quote puts words in someone's mouth, and changing a
// name or year misattributes their words to someone else. Edit only from
// what the person actually said and approved.
// Anyone listed here should have agreed to appear on a public site by
// name, photo, and quote. If someone withdraws, delete their entry —
// don't anonymise it, since the photo would still identify them.
//
// Portraits are imported (not string paths) because they live under
// src/assets/. Vite fingerprints and optimises them; a plain string path
// into src/ isn't processed by the bundler and 404s in production.

import testimony1 from "../assets/images/testimony1.jpg";
import testimony2 from "../assets/images/testimony2.jpg";
import testimony3 from "../assets/images/testimony3.jpg";
import testimony4 from "../assets/images/testimony4.jpg";
import testimony5 from "../assets/images/testimony5.jpg";

const testimonials = [
  {
    id: 1,
    name: "Hyran Tamara",
    role: "2nd Year Law Student",
    quote:
      "The Juris Leadership Alliance doesn't just talk about change; they actively champion policies that make a real difference for us on campus.",
    image: testimony1,
  },
  {
    id: 2,
    name: "Daphne Rabera",
    role: "2nd Year Law Student",
    quote:
      "Finding a student party that genuinely prioritizes our well-being and fights for better academic resources has been incredibly refreshing.",
    image: testimony2,
  },
  {
    id: 3,
    name: "Respine Egesa",
    role: "2nd Year Law Student",
    quote:
      "I support JLA because they bring a rare level of transparency and ethical leadership to our student government.",
    image: testimony3,
  },
  {
    id: 4,
    name: "Luke Mwenda",
    role: "4th Year Law Student",
    quote:
      "They make sure every law student, regardless of their background, has a seat at the table and a loud voice in faculty decisions.",
    image: testimony4,
  },
  {
    id: 5,
    name: "Issa Mwanaloma",
    role: "4th Year Law Student",
    quote:
      "JLA goes beyond politics; their focus on career networking and mentorship initiatives truly sets them apart.",
    image: testimony5,
  },
];

// --- Derived helpers -----------------------------------------------------

// Grouped by year of study, for any view that wants to show the spread of
// support across the faculty rather than a flat list.
export const testimonialsByYear = testimonials.reduce((acc, t) => {
  const bucket = acc.find((g) => g.role === t.role);
  if (bucket) bucket.items.push(t);
  else acc.push({ role: t.role, items: [t] });
  return acc;
}, []);

// Longest quote in characters — lets a carousel reserve consistent card
// height instead of jolting between a 90-character quote and a 150-one.
export const longestQuoteLength = testimonials.reduce(
  (max, t) => Math.max(max, t.quote.length),
  0
);

export default testimonials;