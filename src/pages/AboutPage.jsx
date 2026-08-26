import React from "react";
import AboutHero from "../components/about/AboutHero";
import MissionVision from "../components/about/MissionVision";
import HistorySection from "../components/about/HistorySection";
import CoreValues from "../components/about/CoreValues";
import TeamSection from "../components/about/TeamSection";

// AboutPage
// TODO: Wire up real content/data for AboutPage.

const AboutPage = () => {
  return (
    <main className="aboutpage">
      <AboutHero />
      <MissionVision />
      <HistorySection />
      <CoreValues />
      <TeamSection />
    </main>
  );
};

export default AboutPage;
