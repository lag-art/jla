import React from "react";
import LeadershipHero from "../components/leadership/LeadershipHero";
import OrgChart from "../components/leadership/OrgChart";
import LeadershipTeamGrid from "../components/leadership/LeadershipTeamGrid";

// LeadershipPage
// TODO: Wire up real content/data for LeadershipPage.

const LeadershipPage = () => {
  return (
    <main className="leadershippage">
      <LeadershipHero />
      <OrgChart />
      <LeadershipTeamGrid />
    </main>
  );
};

export default LeadershipPage;
