import React from 'react';
import './LegalLinks.css';

const LegalLinks = () => {
  const links = [
    { label: 'Help Center', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ];
  return (
    <div className="f-legal">
      <h4 className="section-title">Support & Legal</h4>
      <ul className="link-list">
        {links.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
      </ul>
    </div>
  );
};

export default LegalLinks;