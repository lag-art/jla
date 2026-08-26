import React from "react";
import ResourcesHero from "../components/resources/ResourcesHero";
import ResourcesSideNav from "../components/resources/ResourcesSideNav";
import ConstitutionSection from "../components/resources/ConstitutionSection";
import ManifestoSection from "../components/resources/ManifestoSection";
import PublicationsSection from "../components/resources/PublicationsSection";

// ResourcesPage
// TODO: Wire up real content/data for ResourcesPage.

const ResourcesPage = () => {
  return (
    <main className="resourcespage">
      <ResourcesHero />
      <ResourcesSideNav />
      <ConstitutionSection />
      <ManifestoSection />
      <PublicationsSection />
    </main>
  );
};

export default ResourcesPage;
