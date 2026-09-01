import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaPlay, FaCircleInfo, FaFilm } from "react-icons/fa6";
import SectionTitle from "../common/SectionTitle";
import ImagePlaceholder from "../common/ImagePlaceholder";
import mediaItems from "../../data/mediaItems";

// media / VideoSection
// The Media page's watch experience.
//
// SCOPE — why this isn't a duplicate of GalleryGrid
// GalleryGrid is for BROWSING: thumbnails, filters, a lightbox that shows
// a still. This section is for WATCHING: one video at a time, played in
// place, at a size worth watching. If this ever grows a thumbnail grid
// with filters, the two have collapsed into one and this should be
// deleted rather than maintained alongside it.
//
// HONEST STATE — read before adding a fake player
// Videos in data/mediaItems.js currently carry a thumbnail but no source.
// A play button that does nothing when tapped is worse than no player at
// all, so a video without a source renders an explicit "not available
// yet" panel instead. Add one of these fields to a video item and this
// section starts playing it, no code change:
//   youtubeId  — e.g. "dQw4w9WgXcQ"
//   vimeoId    — e.g. "76979871"
//   videoUrl   — a direct .mp4/.webm URL for self-hosted files
//
// Heuristics baked in:
//   - Self-hiding: renders nothing at all when there are no videos. An
//     empty "Watch" section with a placeholder is worse than no section.
//   - CLICK-TO-LOAD FACADE, not an always-embedded iframe. A YouTube embed
//     pulls hundreds of KB and sets third-party cookies on page load, for
//     a video most visitors will never play. This shows the real thumbnail
//     and only mounts the iframe once someone actually presses play — and
//     uses youtube-nocookie so a visitor who never plays is never tracked.
//   - Switching videos unmounts the player, so selecting a second video
//     doesn't leave the first one playing audio underneath.
//   - The playlist only renders when there's more than one video; a
//     playlist of one is a list that can't be used.
//   - Thumbnails keep a fixed 16:9 box so the section never jumps as
//     images load.

const getVideos = () => mediaItems.filter((m) => m.type === "video");

const hasSource = (v) => Boolean(v?.youtubeId || v?.vimeoId || v?.videoUrl);

const embedUrl = (v) => {
  if (v.youtubeId) {
    // nocookie + autoplay, since the user has explicitly pressed play
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

  // Nothing to watch — see self-hiding note.
  if (videos.length === 0) return null;

  const active = videos.find((v) => v.id === activeId) || videos[0];
  const playable = hasSource(active);
  const iframeSrc = playable ? embedUrl(active) : null;

  const selectVideo = (id) => {
    setIsPlaying(false); // unmount the current player — see note above
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
          description="Recordings from the Alliance's summits, orientations, and proceedings."
          tone="dark"
        />

        <motion.div
          {...reveal}
          className={`grid gap-6 lg:gap-8 mt-10 sm:mt-12 ${
            videos.length > 1 ? "lg:grid-cols-[1.9fr_1fr]" : "lg:grid-cols-1"
          }`}
        >
          {/* Player / facade */}
          <div>
            <div className="relative w-full overflow-hidden rounded-md bg-(--jla-navy-800) border border-(--jla-navy-700)" style={{ aspectRatio: "16 / 9" }}>
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
                // Self-hosted file — controls, no autoplay surprises
                <video
                  src={active.videoUrl}
                  poster={active.image}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full bg-black"
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
                      <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-(--jla-navy-950) group-hover:bg-(--jla-gold) group-hover:scale-105 transition-all duration-200">
                        <FaPlay aria-hidden="true" className="ml-1 text-xl sm:text-2xl" />
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
                          is the still. It’ll play here once the video is
                          available.
                        </span>
                      </p>
                    </div>
                  )}
                </>
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
          {videos.length > 1 && (
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-3 pb-2 border-b border-white/10">
                <FaFilm aria-hidden="true" />
                All recordings
                <span className="ml-auto">{videos.length}</span>
              </p>

              <ul className="flex flex-col gap-2 lg:max-h-104 lg:overflow-y-auto">
                {videos.map((v) => {
                  const isActive = v.id === active.id;
                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => selectVideo(v.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`w-full flex items-start gap-3 p-2 rounded-md text-left transition-colors duration-200 ${
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
                          {!hasSource(v) && (
                            <span className="absolute inset-0 bg-(--jla-navy-950)/55" />
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
                          {!hasSource(v) && (
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