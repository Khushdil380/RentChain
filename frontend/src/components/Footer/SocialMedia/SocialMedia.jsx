import React from 'react';
import './SocialMedia.css';

const Icon = ({ label, href, children }) => (
  <a className="sm-ic" href={href} aria-label={label} target="_blank" rel="noreferrer noopener">{children}</a>
);

const SocialMedia = () => {
  return (
    <div className="sm">
      <Icon label="LinkedIn" href="#">in</Icon>
      <Icon label="Twitter" href="#">X</Icon>
      <Icon label="Instagram" href="#">IG</Icon>
      <Icon label="Facebook" href="#">f</Icon>
    </div>
  );
};

export default SocialMedia;