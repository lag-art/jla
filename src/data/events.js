import eventPoster from "../assets/images/event.jpeg";

// events.js
// Upcoming and past events run or joined by the Alliance.
//
// WHY THIS ISN'T IN data/pressReleases.js
// A press release is a dated STATEMENT about something that has happened
// or a position taken. An event is an invitation to something that hasn't
// happened yet: it has a future date, a start time, a place, and a way to
// register. Filing this as a press release would put "who's running with
// us?" under the heading "Statements and announcements" and make it the
// Alliance's most recent official statement.
//
// ⚠️ YEAR ASSUMED — CHECK BEFORE PUBLISHING
// The source copy says "8th November" with no year. `date` below assumes
// 2026. If that's wrong the countdown, the upcoming/past split, and the
// event's whole position on the page are wrong with it — this is the one
// field worth double-checking.
//
// FIELD REFERENCE
//   id         Stable slug, also the anchor (#event-<id>).
//   date       ISO datetime INCLUDING the start time and timezone offset.
//              Nairobi is UTC+3, so 6AM local is written 06:00:00+03:00.
//              Storing a bare date would make the countdown expire at
//              midnight rather than at the start gun.
//   endsAt     Optional. When the event stops being "today" and becomes
//              past. Defaults to date + 12h if omitted.
//   title      Short name of the event.
//   blurb      The invitation, in the Alliance's own voice.
//   location / distances / etc — logistics, rendered as scannable chips
//              rather than buried in the paragraph. Someone deciding
//              whether to come needs where/when/how far at a glance.
//   registerUrl / registerLabel  External sign-up. Optional: an event
//              without one renders no button rather than a dead control.
//   image      Poster. Optional.

const events = [
  {
    id: "jla-run-2026",
    date: "2026-11-08T06:00:00+03:00", // ⚠️ year assumed — see note above
    title: "JLA Run",
    blurb:
      "More than just running — it's good vibes, good company, movement, and inclusion. Grab your friends, lace up those sneakers, and let's make 8th November a day to remember. Bring your squad, your running buddy, and your “I'll just walk” friend, and let's hit the streets together.",
    location: "Nairobi",
    startTime: "6:00 AM",
    distances: ["5KM", "10KM", "21KM"],
    registerUrl: "https://zenlipa.co.ke/events/XKGDY0",
    registerLabel: "Register",
    image: eventPoster,
  },
];

// --- Derived helpers -----------------------------------------------------

const endOf = (event) =>
  event.endsAt
    ? new Date(event.endsAt).getTime()
    : new Date(event.date).getTime() + 12 * 60 * 60 * 1000;

// Split by whether the event has actually happened. Computed at read time,
// not stored — an "upcoming" flag written into the data would still say
// upcoming the morning after the race.
export const upcomingEvents = [...events]
  .filter((e) => endOf(e) >= Date.now())
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // soonest first

export const pastEvents = [...events]
  .filter((e) => endOf(e) < Date.now())
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // most recent first

export const nextEvent = upcomingEvents[0] || null;

export default events;