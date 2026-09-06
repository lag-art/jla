import ROUTES from "../routes/routePaths";

// notices.js
// Data source for NoticeBanner.jsx. The banner shows the first notice
// inside its startsAt/endsAt window that hasn't been dismissed.
//
// ⚠️ THIS FILE PREVIOUSLY POINTED AT THE NOMINATIONS PAGE.
// That page has been retired, so the CTA now points at Constitution
// Article 5 — the actual governing text on elections — rather than a
// route that no longer exists. A notice whose CTA 404s is worse than no
// notice, so check `ctaPath` resolves whenever routes change.
//
// Fields:
//   id        Stable, unique. Used as the dismissal key in localStorage.
//   message   The banner copy.
//   ctaLabel / ctaPath  Optional action link.
//   deadline  Optional ISO date; shows a live countdown.
//   startsAt / endsAt   ISO window the notice is eligible to show in.

export const notices = [
  {
    id: "elections-2026",
    message: "Elections for the 2026 Leadership Cycle are approaching.",
    ctaLabel: "Read the rules",
    ctaPath: `${ROUTES.RESOURCES_CONSTITUTION}#article-5`,
    deadline: "2026-12-31T23:59:59Z",
    startsAt: "2026-01-01T00:00:00Z",
    endsAt: "2026-12-31T23:59:59Z",
  },
];