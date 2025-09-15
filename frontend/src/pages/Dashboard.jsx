import React from 'react';
import PageLayout from './_layout/PageLayout';

const Dashboard = () => (
  <PageLayout title="Dashboard">
    <div style={{ padding: 16, background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ marginTop: 0 }}>Welcome to your dashboard</h2>
      <p>You are logged in.</p>
    </div>
  </PageLayout>
);

export default Dashboard;
