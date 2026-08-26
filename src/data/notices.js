import ROUTES from "../routes/routePaths";

// notices.js
// Data source for NoticeBanner.jsx. Supports multiple notices; the banner
// picks the first one currently inside its startsAt/endsAt window and not
// yet dismissed — publishing or retiring a notice is a data-file edit,
// never a component edit.
//
// Fields:
//   id        - stable, unique. Used as the dismissal key in localStorage.
//   message   - the banner copy.
//   ctaLabel / ctaPath - optional action link.
//   deadline  - optional ISO date; if set, NoticeBanner shows a live
//               countdown to it.
//   startsAt / endsAt - ISO date window the notice is eligible to show in.

export const notices = [
  {
    id: "nominations-2026",
    message: "Nominations for the 2026 Leadership Cycle are now open.",
    ctaLabel: "Apply Now",
    ctaPath: ROUTES.NOMINATIONS,
    deadline: "2026-12-31T23:59:59Z",
    startsAt: "2026-01-01T00:00:00Z",
    endsAt: "2026-12-31T23:59:59Z",
  },
];