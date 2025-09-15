import React from 'react';
import './SocialMedia.css';

const SM = ({ label, href, children }) => (
  <a className="csm" href={href} aria-label={label} target="_blank" rel="noreferrer noopener">{children}</a>
);

const SocialMedia = () => (
  <div className="csm-row">
    {/* TODO: Replace # with actual profile links */}
    <SM label="LinkedIn" href="#">in</SM>
    <SM label="Twitter/X" href="#">X</SM>
    <SM label="Instagram" href="#">IG</SM>
    <SM label="Facebook" href="#">f</SM>
  </div>
);

export default SocialMedia;