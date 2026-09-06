import React from "react";
import MediaHero from "../components/media/MediaHero";
import GalleryGrid from "../components/media/GalleryGrid";
import VideoSection from "../components/media/VideoSection";
import PressReleases from "../components/media/PressReleases";
import NewsGrid from "../components/media/NewsGrid";
import EventsSection from "../components/media/EventsSection";

// MediaPage
// TODO: Wire up real content/data for MediaPage.

const MediaPage = () => {
  return (
    <main className="mediapage">
      <MediaHero />
      <GalleryGrid />
      <VideoSection />
      <PressReleases />
      <NewsGrid />
      <EventsSection />
    </main>
  );
};

export default MediaPage;
