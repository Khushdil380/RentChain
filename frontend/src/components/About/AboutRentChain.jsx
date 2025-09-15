import React from 'react';
import './about.css';
import img1 from '../../assets/about/1.jpg';

const AboutRentChain = () => {
  return (
    <section className="about-block fade-in">
      <div className="about-grid">
        <div className="about-media">
          <img src={img1} alt="Illustration - What is RentChain" loading="lazy" />
        </div>
        <div className="about-content">
          <h2 className="about-title">What is RentChain?</h2>
          <p className="about-desc">
            RentChain is a modern rental management platform that connects tenants and landlords directly without brokers.
            It simplifies property listing, secure rent payments, digital agreements, and dispute resolution — all in one place.
            Designed for transparency, trust, and ease of use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutRentChain;
