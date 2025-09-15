import React from 'react';
import './Footer.css';
import FooterBranding from './FooterBranding/FooterBranding';
import QuickLinks from './QuickLinks/QuickLinks';
import UserLinks from './UserLinks/UserLinks';
import LegalLinks from './LegalLinks/LegalLinks';
import ContactInfo from './ContactInfo/ContactInfo';
import SocialMedia from './SocialMedia/SocialMedia';
import Copyright from './Copyright/Copyright';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-grid">
            <div className="footer-col">
              <FooterBranding />
            </div>
            <div className="footer-col">
              <QuickLinks />
            </div>
            <div className="footer-col">
              <UserLinks />
            </div>
            <div className="footer-col">
              <LegalLinks />
            </div>
          </div>
          <div className="footer-contact">
            <ContactInfo />
          </div>
        </div>
        <div className="footer-bottom">
          <SocialMedia />
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
