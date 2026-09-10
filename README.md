# Juris Leadership Alliance

The official website of the Juris Leadership Alliance (JLA) — a law
faculty student movement. Built with React, Vite and Tailwind v4.

**Motto:** *Where law meets leadership.*

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the build locally
```

## Stack

| Package | Version | Used for |
|---|---|---|
| react / react-dom | 18.3 | — |
| react-router-dom | 6.26 | Routing, lazy-loaded pages |
| vite | 5.4 | Build tool |
| tailwindcss + @tailwindcss/vite | 4.3 | Styling (v4, no `tailwind.config.js`) |
| framer-motion | 11.18 | Animation, scroll reveals |
| react-icons | 5.7 | Icons (`react-icons/fa6` throughout) |
| swiper | 11.2 | Carousels (LeadershipPreview, Testimonials) |
| react-hook-form | 7.85 | Forms — **installed, not yet used** |
| react-intersection-observer | 9.16 | **Installed, not yet used** — framer-motion's `whileInView` covered it |

---

## Routes

| Path | Page |
|---|---|
| `/` | HomePage |
| `/about` | AboutPage |
| `/leadership` | LeadershipPage |
| `/resources` | ResourcesPage — the document hub |
| `/resources/constitution` | Constitution, full text |
| `/resources/manifesto` | Manifesto — honest "not yet published" state |
| `/resources/publications` | Publications — empty state until entries exist |
| `/media` | MediaPage |
| `/contact` | ContactPage |
| `/join` | JoinPage |
| `*` | NotFoundPage |

Path strings live in `src/routes/routePaths.js`. Import `ROUTES` rather
than hardcoding strings.

**Removed from the original skeleton:** `/nominations`, `/resources/tenders`,
`/resources/nomination-rules`. Nomination and election rules are not a
separate page — they are **Constitution Article 5**, published in full
under Resources. Tenders don't apply to a student body.

**Anchor deep links.** The three policies live on the Resources hub and
are reached by anchor: `/resources#disciplinary-act`, `#gender-policy`,
`#attendance-policy`. `PoliciesSection` reads the hash on mount and on
`hashchange`, opens the matching panel, then scrolls. Provisions inside a
document are namespaced — `#attendance-policy--clause-3` — because the
Disciplinary Act and Attendance Policy both number their clauses 1–7 and
would otherwise collide.

---

## Conventions that matter

### Assets: import vs `public/`

| What | Where | Why |
|---|---|---|
| Photos, logos, covers | `src/assets/images/` → **imported** | Vite fingerprints and optimises them |
| PDFs | `public/documents/` → **string path** | Stable URLs people bookmark and share; a hash would break them |
| Favicon | `public/logo.jpeg` → **string path** | Same reason |

### The import-shadowing bug — six files have hit this

```jsx
import ImagePlaceholder from "../../assets/images/hero.jpg";  // ❌
```

Naming an image import after a component shadows the component. JSX treats
any capitalised tag as a component, so the render calls
`document.createElement("/src/assets/images/hero.jpg")` and throws
`InvalidCharacterError`. Keep the two names distinct:

```jsx
import ImagePlaceholder from "../common/ImagePlaceholder";     // ✅
import heroImage from "../../assets/images/hero.jpg";
```

### Tailwind v4 syntax

- CSS variables: `bg-(--jla-navy)`, not `bg-[var(--jla-navy)]`
- Font family needs a type hint: `font-(family-name:--font-display)`,
  otherwise it collides with `font-semibold`
- **Computed class names need a lookup map.** Tailwind scans source text
  at build time, so `` `lg:grid-cols-${n}` `` produces no CSS — it compiles
  fine and silently renders unstyled. See `LeadershipTeamGrid.jsx`.

### Layout

- `--sticky-nav-offset` is measured live from the Navbar by `MainLayout`
  (ResizeObserver) and published on `:root`. Anchor targets use
  `scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)]`.
- The sticky lives on the **wrapper div** in `MainLayout`, not on Navbar's
  `<header>` alone — a sticky element only sticks within its parent's box.
- `overflow-x: hidden`, `transform`, `filter` or `contain` on any ancestor
  silently disables sticky. Use `overflow-x: clip` if you need it.
- Heroes use `svh`, not `dvh` — `dvh` resizes as the mobile URL bar hides,
  so the headline shifts while you scroll it.

### Motion

Every animated component checks `useReducedMotion()`. CSS-only animations
use `motion-safe:` / `motion-reduce:` variants instead.

---

## Content architecture

Components never hardcode content. Everything comes from `src/data/`.

```
src/data/
├── navLinks.js         Nav — Resources submenu DERIVED from resourcesData
├── footerLinks.js      Footer columns, contactInfo, social URLs
├── notices.js          NoticeBanner announcements (date-windowed)
├── leadershipTeam.js   Roster, tiered; images imported
├── resourcesData.js    Document REGISTRY (not content) — groups, status, meta
├── missionVision.js    Shared by AboutPreview + MissionVision
├── movement.js         Shared by AboutPreview + HistorySection
├── coreValues.js       Shared by AboutPreview + CoreValues
├── testimonials.js     Real, named students — see warning in file
├── mediaItems.js       Photos + video, imported
├── events.js           Upcoming/past computed from dates
├── pressReleases.js    EMPTY by design
├── newsItems.js        EMPTY by design
└── documents/          Full text of the four governing documents
    ├── constitution.js       10 articles + preamble
    ├── disciplinary-act.js   7 clauses
    ├── gender-policy.js      6 sections
    └── attendance-policy.js  15 clauses
```

### The documents

All four were converted from the source `.docx` files and **verified
lossless** — the structured output was reconstructed back to plain text
and diffed against the original. Text is **verbatim, including errors**
("Displinary Master", "probation" where "prohibition" is meant). These are
enacted documents; correcting them here would publish text differing from
the signed copy. Fix the source, then re-convert.

Two of them number their clauses with Word's *automatic* numbering, which
means the visible numbers don't exist in the extracted text. They were
rebuilt from the numbering definitions — and the Attendance Policy's
reconstruction is confirmed by the document's own cross-reference to
"article 6(II)", which lands on the right provision.

`common/DocumentReader.jsx` renders any of them: section nav, in-page
search, deep-linkable anchors, copy-link, reading progress, PDF download.

### Sections that hide themselves

Several components render `null` rather than an empty shell:
`PressReleases`, `NewsGrid`, `VideoSection` (no videos), `ResourcesSideNav`
(one document), `EventsSection` (no events). Others show an honest pending
state instead: `ManifestoSection`, `ResourcesPublicationsPage`.

---

## ⚠️ Open items before launch

### Content conflicts — the Constitution disagrees with the site

1. **Leadership titles.** Constitution Article 4 establishes eleven
   offices (Chairperson, Vice-Chairperson, Secretary General, Finance
   Director, PR & Communications Director, Director of Programs &
   Outreach, Legal Advisor, Head of Discipline, CEO, Patron, Gender
   Representative). `leadershipTeam.js` lists President, Vice President,
   Secretary General, Treasurer, Organising Secretary, Academic Affairs
   Rep, Communications Secretary. **Only "Secretary General" appears in
   both** — the site is advertising offices the Constitution doesn't create.

2. **Two official emails.** Article 4 names
   `jurisleadershipalliance@gmail.com`; `footerLinks.js` publishes
   `juriscartels@gmail.com`. The site renders only the latter, so it's
   internally consistent — but the conflict is real.

3. **Mission & Vision wording** differs between Article 1 and
   `missionVision.js`. Two official statements on one site.

### Placeholder content still rendering

- `leadershipTeam.js` — every name is literally `"Full Name"`
- `coreValues.js` — descriptions are prefixed `DRAFT —` and **will render
  that way**
- `mediaItems.js` — titles are generic, captions empty. A caption asserts
  what a photograph shows; only someone who was there can write it
- `events.js` — the JLA Run year is **assumed 2026**. The source copy said
  "8th November" with no year. Wrong year = wrong countdown, wrong
  upcoming/past state

### Gaps in the documents themselves

- **The Gender Equality Policy states no reporting route.** It defines
  harassment, prohibits retaliation, guarantees confidentiality — but never
  says how or to whom a complaint is made. `ContactInfo` and
  `PoliciesSection` cross-reference the Disciplinary Act's clause 2 route
  and label it as external, but the real fix is an express clause in the
  policy.
- **None of the four documents records an adoption date** — every
  certification block has a blank `____ day of ______ 20____`. No adoption
  date is displayed anywhere as a result.
- **Disciplinary Act sequencing:** clause 3(h) has the committee decide,
  clauses 4–6 run the appeal and make it final, then clause 7 says the
  committee "thereafter" determines the verdict. Worth a legal read.

### Not yet built

- `contact/ContactForm.jsx`
- `join/JoinForm.jsx`

`react-hook-form` is installed and ready for both.

### Permissions

`PartnersLogos` names five real organisations. Several (Rotary, Unicaf)
publish brand guidelines governing use of their marks — worth confirming
before launch, since a trust strip asserts an association publicly.

Testimonials name five real students with photos and quotes. Confirm each
has agreed to appear that way.

---

## Adding things

**A document:** add an entry to `resourcesData.js` and a module in
`data/documents/`. It appears in the Resources page, the nav dropdown, and
the hero's computed stats automatically. Recompute `meta.sections` and
`meta.readMinutes` — `ResourcesHero` sums them, so a stale count becomes a
false claim on the page.

**A leader:** add to `leadershipTeam.js` with a `tier` and `order`. Grid
columns re-solve themselves to avoid orphaned cards.

**An event:** add to `events.js` with an ISO datetime including the
timezone offset (`+03:00`). Upcoming/past is computed, never stored.

**A partner, social channel, or notice:** the respective data file. No
component edits.