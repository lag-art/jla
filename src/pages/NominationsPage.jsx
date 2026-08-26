import React from "react";
import NominationsHero from "../components/nominations/NominationsHero";
import NominationSteps from "../components/nominations/NominationSteps";
import NominationTimeline from "../components/nominations/NominationTimeline";
import NominationForm from "../components/nominations/NominationForm";

// NominationsPage
// TODO: Wire up real content/data for NominationsPage.

const NominationsPage = () => {
  return (
    <main className="nominationspage">
      <NominationsHero />
      <NominationSteps />
      <NominationTimeline />
      <NominationForm />
    </main>
  );
};

export default NominationsPage;
