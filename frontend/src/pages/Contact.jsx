import React from 'react';
import PageLayout from './_layout/PageLayout';
import ContactSection from '../components/Contact/Contact';
import FAQ from '../components/FAQ/FAQ';

const ContactPage = () => (
  <PageLayout>
    <ContactSection />
    <FAQ title="Need More Help?" />
  </PageLayout>
);

export default ContactPage;
