import React from 'react';
import './FooterBranding.css';

const FooterBranding = () => {
  return (
    <div className="f-brand">
      <div className="f-logo">
        <div className="f-logo-icon" aria-hidden="true" />
        <div className="f-logo-text">RentChain</div>
      </div>
      <p className="f-tag muted">Where Rent Meets Transparency</p>
    </div>
  );
};

export default FooterBranding;
