import React from 'react';
import PageLayout from './_layout/PageLayout';
import FAQ from '../components/FAQ/FAQ';
import AboutRentChain from '../components/About/AboutRentChain';
import HowRentChainWorks from '../components/About/HowRentChainWorks';

const About = () => (
  <PageLayout title="About">
    <AboutRentChain />
    <HowRentChainWorks />
    <FAQ />
  </PageLayout>
);

export default About;
