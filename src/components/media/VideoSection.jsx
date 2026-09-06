import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaPlay, FaCircleInfo, FaFilm, FaXmark } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import mediaItems from "../../data/mediaItems";

// media / VideoSection
// The Media page's watch experience.
//
// SCOPE — why this isn't a duplicate of GalleryGrid
// GalleryGrid is for BROWSING: a grid, filters, a lightbox. This is for
// WATCHING: one recording at a time, at a size worth watching, with a
// playlist when there's more than one. GalleryGrid can play a video too,
// but incidentally — you opened a tile. Here it's the point. If this ever
// grows a filtered thumbnail grid, the two have collapsed and this should
// be deleted rather than maintained alongside it.
//
// SOURCES — three kinds, detected not configured
// A video item plays when it carries any ONE of these:
//   videoUrl   self-hosted file (this is what data/mediaItems.js uses)
//   youtubeId  → nocookie embed
//   vimeoId    → Vimeo player
// Presence of a source is the only thing that decides whether a real
// player renders. An item without one keeps its poster and says plainly
// that it isn't published — a play button that does nothing when tapped
// is worse than no player at all.
//
// MOBILE: playsInline IS NOT OPTIONAL
// Without it, iOS Safari takes any <video> fullscreen the moment it
// plays, ejecting the visitor out of the page. It's one attribute and the
// difference between watching in context and being thrown into a system
// player.
//
// Heuristics baked in:
//   - Self-hiding when there are no videos at all.
//   - CLICK-TO-LOAD FACADE for embeds: a YouTube iframe pulls hundreds of
//     KB and sets third-party cookies on page load, for a video most
//     visitors never play. The iframe only mounts once someone presses
//     play, and uses youtube-nocookie so a visitor who never plays is
//     never tracked. Self-hosted files get the same treatment via
//     preload="metadata" — dimensions and duration, not the whole file.
//   - object-contain on the player, not cover: a vertical phone video in
//     a 16:9 frame letterboxes rather than having its top and bottom
//     cropped off. Better bars than a beheaded subject.
//   - Switching videos unmounts the current player, so selecting a second
//     never leaves the first playing audio underneath.
//   - A single video gets a capped, centred player. Stretched across a
//     1200px container it becomes a 675px-tall wall; the playlist layout
//     is what justifies full width.
//   - Playing shows a "close" control that returns to the poster — with
//     no playlist to switch away to, a single video otherwise has no way
//     back short of reloading.
//   - The playlist only renders with more than one video; a playlist of
//     one is a list that can't be used.

const getVideos = () => mediaItems.filter((m) => m.type === "video");

const hasSource = (v) => Boolean(v?.youtubeId || v?.vimeoId || v?.videoUrl);

const embedUrl = (v) => {
  // autoplay is set because the visitor has just pressed play — this is a
  // response to a user gesture, not an unprompted autoplay.
  if (v.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`;
  }
  if (v.vimeoId) return `https://player.vimeo.com/video/${v.vimeoId}?autoplay=1`;
  return null;
};

const VideoSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const videos = useMemo(getVideos, []);
  const [activeId, setActiveId] = useState(videos[0]?.id ?? null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (videos.length === 0) return null;

  const active = videos.find((v) => v.id === activeId) || videos[0];
  const playable = hasSource(active);
  const iframeSrc = playable ? embedUrl(active) : null;
  const hasPlaylist = videos.length > 1;

  const selectVideo = (id) => {
    setIsPlaying(false); // unmount the current player before switching
    setActiveId(id);
  };

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id="watch"
      className="scroll-mt-[calc(var(--sticky-nav-offset,5rem)+1.5rem)] bg-(--jla-navy-950) text-white"
    >
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-14 sm:py-16 lg:py-20">
        <SectionTitle
          docket="19"
          eyebrow="Watch"
          title="See it for yourself."
          description="Recordings from the Alliance's events and proceedings."
          tone="dark"
        />

        <motion.div
          {...reveal}
          className={`grid gap-6 lg:gap-8 mt-10 sm:mt-12 ${
            hasPlaylist ? "lg:grid-cols-[1.9fr_1fr]" : "lg:grid-cols-1"
          }`}
        >
          {/* Player / facade — capped when it stands alone, see notes */}
          <div className={hasPlaylist ? "" : "w-full max-w-4xl mx-auto"}>
            <div
              className="relative w-full overflow-hidden rounded-md bg-black border border-(--jla-navy-700)"
              style={{ aspectRatio: "16 / 9" }}
            >
              {isPlaying && iframeSrc ? (
                <iframe
                  src={iframeSrc}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              ) : isPlaying && active.videoUrl ? (
                // Self-hosted. playsInline keeps iOS from hijacking to
                // fullscreen; object-contain letterboxes a vertical clip
                // instead of cropping it.
                <video
                  src={active.videoUrl}
                  poster={active.image}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                >
                  Your browser doesn’t support embedded video.
                </video>
              ) : (
                <>
                  <ImagePlaceholder
                    src={active.image}
                    ratio="16/9"
                    rounded="none"
                    alt={active.title}
                    className="absolute inset-0 w-full h-full"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-(--jla-navy-950)/85 via-(--jla-navy-950)/20 to-transparent"
                  />

                  {playable ? (
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      aria-label={`Play ${active.title}`}
                      className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) focus-visible:ring-inset"
                    >
                      <span className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-(--jla-navy-950) group-hover:bg-(--jla-gold) group-hover:scale-105 transition-all duration-200">
                        {/* Ring pulse — draws the eye without moving the
                            button itself. Motion-safe only. */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full ring-2 ring-white/50 motion-safe:animate-ping"
                        />
                        <FaPlay aria-hidden="true" className="relative ml-1 text-xl sm:text-2xl" />
                      </span>
                    </button>
                  ) : (
                    // No source — say so rather than offering a dead button
                    <div className="absolute inset-0 flex items-end p-5 sm:p-6">
                      <p className="flex items-start gap-2.5 text-sm text-white/85 bg-(--jla-navy-950)/70 rounded-md px-4 py-3 max-w-md">
                        <FaCircleInfo
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-(--jla-gold)"
                        />
                        <span>
                          This recording isn’t published yet — what you’re seeing
                          is the poster frame. It’ll play here once the video is
                          available.
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Return to poster — without a playlist there'd be no way
                  back out of the player short of reloading the page */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  aria-label="Close player"
                  className="absolute top-2 right-2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-(--jla-navy-950)/70 text-white hover:bg-(--jla-navy-950) transition-colors duration-200"
                >
                  <FaXmark aria-hidden="true" className="text-xs" />
                </button>
              )}
            </div>

            <h3 className="font-(family-name:--font-display) font-semibold text-lg sm:text-xl mt-4">
              {active.title}
            </h3>
            {active.caption && (
              <p className="text-sm text-white/70 leading-relaxed mt-1.5 max-w-2xl">
                {active.caption}
              </p>
            )}
          </div>

          {/* Playlist — only when there's more than one, see note */}
          {hasPlaylist && (
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-3 pb-2 border-b border-white/10">
                <FaFilm aria-hidden="true" />
                All recordings
                <span className="ml-auto">{videos.length}</span>
              </p>

              <ul className="flex flex-col gap-2 lg:max-h-104 lg:overflow-y-auto lg:overscroll-contain">
                {videos.map((v) => {
                  const isActive = v.id === active.id;
                  const unpublished = !hasSource(v);

                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => selectVideo(v.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`w-full flex items-start gap-3 p-2 rounded-md text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--jla-gold) ${
                          isActive ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <span className="relative w-24 sm:w-28 shrink-0 overflow-hidden rounded-sm">
                          <ImagePlaceholder
                            src={v.image}
                            ratio="16/9"
                            rounded="none"
                            alt=""
                            className="w-full"
                          />
                          {unpublished && (
                            <span aria-hidden="true" className="absolute inset-0 bg-(--jla-navy-950)/55" />
                          )}
                          {isActive && !unpublished && (
                            <span className="absolute inset-0 flex items-center justify-center bg-(--jla-navy-950)/40">
                              <FaPlay aria-hidden="true" className="text-[10px] text-(--jla-gold)" />
                            </span>
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm leading-snug ${
                              isActive ? "text-(--jla-gold) font-semibold" : "text-white/85"
                            }`}
                          >
                            {v.title}
                          </span>
                          {unpublished && (
                            <span className="block mt-0.5 font-mono text-[10px] uppercase tracking-wide text-white/40">
                              Not published yet
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;