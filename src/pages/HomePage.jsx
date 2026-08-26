import React from "react";
import HeroSection from "../components/home/HeroSection";
import AboutPreview from "../components/home/AboutPreview";
import LeadershipPreview from "../components/home/LeadershipPreview";
import ResourcesPreview from "../components/home/ResourcesPreview";
import MediaPreview from "../components/home/MediaPreview";
import Testimonials from "../components/home/Testimonials";
import PartnersLogos from "../components/home/PartnersLogos";
import JoinCTA from "../components/home/JoinCTA";
import ContactPreview from "../components/home/ContactPreview";

// HomePage
// TODO: Wire up real content/data for HomePage.

const HomePage = () => {
  return (
    <main className="homepage">
      <HeroSection />
      <AboutPreview />
      <LeadershipPreview />
      <ResourcesPreview />
      <MediaPreview />
      <Testimonials />
      <PartnersLogos />
      <JoinCTA />
      <ContactPreview />
    </main>
  );
};

export default HomePage;
