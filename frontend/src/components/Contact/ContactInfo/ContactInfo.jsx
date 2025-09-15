import React from 'react';
import './ContactInfo.css';

const ContactInfo = () => {
  return (
    <div className="ci">
      <h3 className="c-title">Contact Information</h3>
      {/* TODO: Replace placeholders with real details */}
      <div className="ci-item"><strong>Email:</strong> support@rentchain.com</div>
      <div className="ci-item"><strong>Phone:</strong> (+91) 90000 00000</div>
      <div className="ci-item"><strong>Address:</strong>
        <div>137 dvarkaVally, A.B Road Mangliya</div>
        <div>Indore (M.P), 453771</div>
        <div>India</div>
      </div>
    </div>
  );
};

export default ContactInfo;