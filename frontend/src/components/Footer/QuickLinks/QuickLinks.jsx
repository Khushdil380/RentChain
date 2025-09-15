import React from 'react';
import './QuickLinks.css';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  const links = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'List a Property', to: '/join' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
  ];
  return (
    <div className="f-block">
      <h4 className="section-title">Quick Links</h4>
      <ul className="link-list">
        {links.map(l => (
          <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;