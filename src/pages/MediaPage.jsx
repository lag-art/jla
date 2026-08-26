import React from "react";
import MediaHero from "../components/media/MediaHero";
import GalleryGrid from "../components/media/GalleryGrid";
import VideoSection from "../components/media/VideoSection";
import PressReleases from "../components/media/PressReleases";
import NewsGrid from "../components/media/NewsGrid";

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
    </main>
  );
};

export default MediaPage;
