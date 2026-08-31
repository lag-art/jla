import React from "react";
import SEO from "../components/common/SEO";
import ResourcesHero from "../components/resources/ResourcesHero";
import ResourcesSideNav from "../components/resources/ResourcesSideNav";
import ConstitutionSection from "../components/resources/ConstitutionSection";
import PoliciesSection from "../components/resources/PoliciesSection";
import ManifestoSection from "../components/resources/ManifestoSection";

// ResourcesPage  —  route: /resources
//
// THIS PAGE IS WHAT MAKES THE ANCHOR LINKS WORK
// The dropdown links to /resources#disciplinary-act, #gender-policy and
// #attendance-policy. Those anchors resolve because:
//   1. this route renders PoliciesSection, and
//   2. PoliciesSection gives each policy panel id={policy.id}, and
//   3. it reads the hash on mount and on hashchange, opening the matching
//      panel before scrolling to it.
// Remove PoliciesSection from this page and all three links silently
// become no-ops — the URL changes and nothing happens.
//
// The Constitution has its own dedicated route as well
// (/resources/constitution) for deep linking, but it also renders here so
// the hub is a complete index rather than a menu of links elsewhere.
//
// SideNav sits above the sections rather than beside them at page level:
// it renders its own sticky rail at lg+ and a sticky chip bar below that,
// so it doesn't need a grid column reserved for it here.

const ResourcesPage = () => {
  return (
    <main className="resourcespage">
      <SEO
        title="Resources"
        description="The Constitution, policies, and procedures that govern the Juris Leadership Alliance — readable in full and free to download."
      />

      <ResourcesHero />
      <ResourcesSideNav />
      <ConstitutionSection />
      <PoliciesSection />
      <ManifestoSection />
    </main>
  );
};

export default ResourcesPage;