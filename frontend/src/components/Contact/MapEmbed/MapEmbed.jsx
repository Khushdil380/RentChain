import React from 'react';
import './MapEmbed.css';

const MapEmbed = () => (
  <div className="map-embed">
    {/* TODO: Replace with your Google Map embed URL for your office location */}
    <iframe
      title="Office Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.51599365587!2d75.9401446105157!3d22.820391623757324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39631cf455b4cec3%3A0x426141aa8141f7a5!2sAcropolis%20Institute%20Of%20Technology%20And%20Research%20-%20AITR!5e0!3m2!1sen!2sin!4v1757953702412!5m2!1sen!2sin"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
);

export default MapEmbed;