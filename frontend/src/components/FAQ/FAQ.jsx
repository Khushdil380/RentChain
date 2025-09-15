import React from 'react';
import FAQItem from './FAQItem';
import './FAQ.css';

const faqs = [
  {
    q: 'What is the RentChain- A Smart Rental Management System (SRMS)?',
    a: 'RentChain is a broker-free platform that allows tenants and landlords to connect, manage rental agreements, pay rent securely, and handle property listings online.'
  },
  {
    q: 'How do I list my property on SRMS?',
    a: 'Simply create an account, navigate to “List a Property,” fill in the property details, upload photos, and submit for admin approval.'
  },
  {
    q: 'Can tenants search for properties without registering?',
    a: 'Yes, anyone can browse property listings, but registration is required to contact landlords or complete rental agreements.'
  },
  {
    q: 'Is rent payment through RentChain secure?',
    a: 'Absolutely. RentChainuses trusted payment gateways like Razorpay to ensure encrypted, safe, and quick transactions.'
  },
  {
    q: 'How does the digital rental agreement work?',
    a: 'Once both parties agree, RentChain generates a legally valid e-agreement, digitally signed and stored securely for future reference.'
  },
  {
    q: 'What documents are required for KYC verification?',
    a: 'Typically, you will need a government-issued ID (Aadhaar, PAN, or Passport) and proof of address.'
  },
  {
    q: 'Can landlords and tenants resolve disputes on RentChain?',
    a: 'Yes, RentChain provides a built-in dispute resolution system where both parties can raise and track complaints.'
  },
  {
    q: 'Does RentChain charge any fees?',
    a: 'Property browsing is free. A small service fee may apply for property listing approvals, agreement generation, or premium services.'
  },
  {
    q: 'Is RentChain available across all cities?',
    a: 'Yes, RentChain is designed to work across India, but the availability of properties depends on landlord participation in each city.'
  },
  {
    q: 'How can I contact SRMS support?',
    a: 'You can reach us via the Contact Page, email us at support@rentchain.com, or call our helpline at +91-XXXXXXXXXX.'
  }
];

const FAQ = ({ title = 'Frequently Asked Questions' }) => {
  return (
    <section className="faq-section">
      <h2 className="faq-heading">{title}</h2>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <FAQItem key={i} question={f.q} answer={f.a} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
