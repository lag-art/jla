// mediaItems.js
//
// Real photographs and video from the Alliance. Assets are IMPORTED (not
// string paths) because they live under src/assets/ — Vite fingerprints
// and optimises them. A plain string path into src/ isn't processed by
// the bundler and 404s in production.
//
// ⚠️ TITLES AND CAPTIONS NEED REPLACING — the images are real, the
// descriptions are not.
// A caption asserts what a photograph SHOWS: naming an event, a date, or
// what people in the frame were doing. Those are factual claims that only
// someone who was there can make. The placeholders below are deliberately
// generic rather than plausible-sounding, so a wrong caption can't quietly
// ship attached to a real photo of real members. Replace each `title` and
// `caption` with what the image actually depicts.
//
// FIVE ITEMS, SIX FILES — and why
// There are five photos and one video. The video reuses media5 as its
// poster frame rather than becoming a sixth entry, which keeps the total
// at five. That matters: MediaPreview splits this into 1 featured + 4
// grid, and four divides cleanly at every breakpoint while five leaves an
// orphaned card. If you add a sixth item later, revisit that split — it's
// a visible consequence of the data changing, not a silent breakage.
//
// FIELD REFERENCE
//   type      "photo" | "video". Drives the play badge in GalleryGrid and
//             decides what VideoSection picks up. Never inferred from the
//             filename.
//   image     Thumbnail / poster frame. Required.
//   videoUrl  Self-hosted video file. Present ONLY on video items. Its
//             presence is what flips VideoSection from its "not published
//             yet" state into a real player — no code change needed.
//             YouTube/Vimeo alternatives: set `youtubeId` or `vimeoId`
//             instead, and VideoSection embeds those instead.

import media1 from "../assets/images/media1.jpeg";
import media2 from "../assets/images/media2.jpeg";
import media3 from "../assets/images/media3.jpeg";
import media4 from "../assets/images/media4.jpeg";
import media5 from "../assets/images/media5.jpeg";
import mediaVideo from "../assets/images/mediavid.mp4";

const mediaItems = [
  {
    id: 1,
    type: "photo",
    title: "JLA in action",
    caption: "", // TODO: what does this photograph show?
    image: media1,
  },
  {
    id: 2,
    type: "photo",
    title: "JLA in action",
    caption: "",
    image: media2,
  },
  {
    id: 3,
    type: "photo",
    title: "JLA in action",
    caption: "",
    image: media3,
  },
  {
    id: 4,
    type: "photo",
    title: "JLA in action",
    caption: "",
    image: media4,
  },
  {
    id: 5,
    type: "video",
    title: "JLA video",
    caption: "",
    image: media5,      // poster frame
    videoUrl: mediaVideo,
  },
];

// --- Derived helpers -----------------------------------------------------

export const photos = mediaItems.filter((m) => m.type === "photo");

// VideoSection consumes this. An item counts as playable only when it
// actually carries a source, so a video added before its file exists
// still renders the honest "not published yet" panel.
export const videos = mediaItems.filter((m) => m.type === "video");

export const playableVideos = videos.filter(
  (v) => v.videoUrl || v.youtubeId || v.vimeoId
);

export default mediaItems;