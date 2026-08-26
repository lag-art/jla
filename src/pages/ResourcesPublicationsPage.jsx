import React from "react";
import ResourcesHero from "../components/resources/ResourcesHero";
import PublicationsSection from "../components/resources/PublicationsSection";

// ResourcesPublicationsPage
// TODO: Deep-linked single-document view for PublicationsSection.

const ResourcesPublicationsPage = () => {
  return (
    <main className="resourcespublicationspage">
      <ResourcesHero />
      <PublicationsSection />
    </main>
  );
};

export default ResourcesPublicationsPage;
