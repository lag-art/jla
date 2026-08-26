import React from "react";
import JoinHero from "../components/join/JoinHero";
import MembershipTiers from "../components/join/MembershipTiers";
import JoinForm from "../components/join/JoinForm";

// JoinPage
// TODO: Wire up real content/data for JoinPage.

const JoinPage = () => {
  return (
    <main className="joinpage">
      <JoinHero />
      <MembershipTiers />
      <JoinForm />
    </main>
  );
};

export default JoinPage;
