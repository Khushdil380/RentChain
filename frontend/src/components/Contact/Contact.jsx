import React, { useState } from 'react';
import './Contact.css';
import ContactForm from './ContactForm/ContactForm';
import ContactInfo from './ContactInfo/ContactInfo';
import SocialMedia from './SocialMedia/SocialMedia';
import MapEmbed from './MapEmbed/MapEmbed';

const Contact = () => {
  const [status, setStatus] = useState(null); // { ok: boolean, message: string }
  return (
    <section className="contact">
      {status && (
        <div className={`contact-alert ${status.ok ? 'ok' : 'err'}`}>{status.message}</div>
      )}
      <div className="contact-grid">
        <div className="contact-col">
          <ContactForm onResult={setStatus} />
        </div>
        <div className="contact-col">
          <ContactInfo />
          <SocialMedia />
        </div>
      </div>
      <div className="contact-map">
        <MapEmbed />
      </div>
    </section>
  );
};

export default Contact;
