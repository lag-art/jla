import React from "react";
import ResourcesHero from "../components/resources/ResourcesHero";
import ConstitutionSection from "../components/resources/ConstitutionSection";

// ResourcesConstitutionPage
// TODO: Deep-linked single-document view for ConstitutionSection.

const ResourcesConstitutionPage = () => {
  return (
    <main className="resourcesconstitutionpage">
      <ResourcesHero />
      <ConstitutionSection />
    </main>
  );
};

export default ResourcesConstitutionPage;
