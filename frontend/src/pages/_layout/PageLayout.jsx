import React from 'react';
import '../../styles/colors.css';
import '../../styles/theme.css';
import '../../index.css';
import '../../styles/main.css';
import HeaderTab from '../../components/HeaderTab/HeaderTab';
import Footer from '../../components/Footer/Footer';

const PageLayout = ({ title, children }) => (
  <div className="main-bg">
    <div className="container" style={{ paddingTop: 16, paddingBottom: 40 }}>
      <HeaderTab />
      <div style={{ marginTop: 24 }}>
        {title ? <h1 style={{ margin: 0, color: 'var(--color-accent)' }}>{title}</h1> : null}
        <div style={{ marginTop: title ? 12 : 0 }}>{children}</div>
      </div>
      <Footer />
    </div>
  </div>
);

export default PageLayout;
