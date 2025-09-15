import React from 'react';
import './about.css';
import img2 from '../../assets/about/2.jpg';
import img3 from '../../assets/about/3.jpg';
import img4 from '../../assets/about/4.jpg';
import img5 from '../../assets/about/5.jpg';
import img6 from '../../assets/about/6.jpg';

const steps = [
  {
    title: 'List a Property',
    desc: 'Landlords can easily list their properties by adding details, uploading photos, and submitting for quick approval — all online.',
    img: img2,
  },
  {
    title: 'Search and Browse Rentals',
    desc: 'Tenants can browse verified property listings using filters like location, rent range, and amenities, ensuring the right match quickly.',
    img: img3,
  },
  {
    title: 'Secure Digital Agreement',
    desc: 'Once both parties agree, RentChain generates a legally valid digital rental agreement, securely stored and accessible anytime.',
    img: img4,
  },
  {
    title: 'Pay Rent Online',
    desc: 'Tenants can make secure rent payments via trusted gateways, and landlords receive instant notifications with payment tracking.',
    img: img5,
  },
  {
    title: 'Dispute Resolution & Support',
    desc: 'If issues arise, RentChain provides a transparent platform for raising and resolving disputes with the help of admins.',
    img: img6,
  },
];

const HowRentChainWorks = () => {
  return (
    <section className="how-block">
      <h2 className="about-title" style={{ marginBottom: 8 }}>How RentChain Works</h2>
      <p className="about-helper">A simple, trusted flow from listing to rent payment and support.</p>
      <div className="steps">
        {steps.map((s, i) => {
          const media = (
            <div className="step-media">
              <img src={s.img} alt={s.title} loading="lazy" />
            </div>
          );
          const content = (
            <div className="step-content">
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          );
          const isReverse = i % 2 === 1;
          return (
            <div className={`step-card fade-in ${isReverse ? 'reverse' : ''}`} key={i}>
              {isReverse ? content : media}
              {isReverse ? media : content}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowRentChainWorks;
