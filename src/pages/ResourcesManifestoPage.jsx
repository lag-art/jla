import React from "react";
import ResourcesHero from "../components/resources/ResourcesHero";
import ManifestoSection from "../components/resources/ManifestoSection";

// ResourcesManifestoPage
// TODO: Deep-linked single-document view for ManifestoSection.

const ResourcesManifestoPage = () => {
  return (
    <main className="resourcesmanifestopage">
      <ResourcesHero />
      <ManifestoSection />
    </main>
  );
};

export default ResourcesManifestoPage;
