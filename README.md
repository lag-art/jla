# Juris Leadership Alliance — Website Skeleton

A complete React + React Router project skeleton, structured after a
sectioned political/organizational site pattern (Home → About →
Leadership → Resources hub with sub-documents → Media → Nominations →
Contact → Join). Every file below is a working stub component ready to
be filled with real design and content.

## Stack
- React 18
- React Router DOM v6 (nested routes, layout route, lazy-loaded pages)
- Vite

## Getting started
```bash
npm install
npm run dev
```

## Route Map

| Path | Page | Notes |
|---|---|---|
| `/` | HomePage | Hero + preview sections for every other page |
| `/about` | AboutPage | Mission, history, values, team |
| `/leadership` | LeadershipPage | Org chart + leadership grid |
| `/resources` | ResourcesPage | Hub linking to 5 sub-sections |
| `/resources/constitution` | ResourcesConstitutionPage | Deep link |
| `/resources/manifesto` | ResourcesManifestoPage | Deep link |
| `/resources/nomination-rules` | ResourcesNominationRulesPage | Deep link |
| `/resources/tenders` | ResourcesTendersPage | Deep link |
| `/resources/publications` | ResourcesPublicationsPage | Deep link |
| `/media` | MediaPage | Gallery, video, press, news |
| `/nominations` | NominationsPage | Steps, timeline, form |
| `/contact` | ContactPage | Form, info, map |
| `/join` | JoinPage | Membership tiers + form |
| `*` | NotFoundPage | 404 fallback |

All path strings live in `src/routes/routePaths.js` (`ROUTES`) — import
that object instead of hardcoding strings in links/redirects.

## Folder Structure

```
juris-leadership-alliance/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/images/placeholders/   # image1.svg (default) ... image8.svg
└── src/
    ├── main.jsx                      # ReactDOM root
    ├── App.jsx                       # <BrowserRouter> + <AppRoutes>
    ├── routes/
    │   ├── AppRoutes.jsx             # Route table (lazy-loaded)
    │   └── routePaths.js             # ROUTES constants
    ├── layouts/
    │   └── MainLayout.jsx            # Navbar + Outlet + Footer shell
    ├── pages/                        # One file per route (13 pages)
    ├── components/
    │   ├── common/                   # Navbar, Footer, Button, Card,
    │   │                             # SectionTitle, ScrollToTop,
    │   │                             # CountdownTimer, NoticeBanner,
    │   │                             # Modal, SocialLinks, Loader, SEO,
    │   │                             # ImagePlaceholder
    │   ├── home/                     # 9 homepage section components
    │   ├── about/                    # 5 components
    │   ├── leadership/                # 4 components
    │   ├── resources/                # 7 components
    │   ├── media/                    # 5 components
    │   ├── nominations/              # 4 components
    │   ├── contact/                  # 4 components
    │   └── join/                     # 3 components
    ├── data/                         # navLinks, footerLinks,
    │                                 # leadershipTeam, resourcesData
    ├── hooks/                        # useScrollToTop, useCountdown
    └── styles/                       # index.css, variables.css
```

## Image placeholder convention
`public/assets/images/placeholders/` holds generated placeholder
graphics: `image1.svg` is the **default/generic placeholder** (used by
`components/common/ImagePlaceholder.jsx` when no `src` prop is passed).
`image2.svg`–`image8.svg` are visually distinct variants for use across
different sections (leadership photos, resource cards, gallery, etc.)
so the skeleton doesn't look repetitive. Swap these for real photography
before launch.

## Next steps
1. `npm install` the two runtime deps already in `package.json`.
2. Fill in each component's JSX/content, starting with `common/Navbar`
   and `common/Footer` since they render on every page.
3. Replace placeholder images and copy in `data/*.js`.
4. Add real styling (Tailwind, CSS Modules, or plain CSS in `styles/`).
