import React from "react";
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import MapSection from "../components/contact/MapSection";
import ContactForm from "../components/contact/ContactForm";

// ContactPage
// TODO: Wire up real content/data for ContactPage.

const ContactPage = () => {
  return (
    <main className="contactpage">
      <ContactHero />
      <ContactInfo />
      <MapSection />
      <ContactForm />
    </main>
  );
};

export default ContactPage;
