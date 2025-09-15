import React from 'react';
import './ContactInfo.css';

const ContactInfo = () => {
  return (
    <div className="f-contact">
      <h4 className="section-title">Contact</h4>
      <div className="muted">
        <div>Email: <a href="mailto:support@rentchain.com">support@rentchain.com</a></div>
        <div>Phone: <a href="tel:+919876543210">(+91) 98765 43210</a></div>
        <div style={{ marginTop: 6 }}>
          <div>Address</div>
          <div>137 dvarkavally</div>
          <div>A.B Road Mangliya</div>
          <div>Indore (M.P), 453771</div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;