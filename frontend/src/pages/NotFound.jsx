import React from 'react';
import PageLayout from './_layout/PageLayout';

const NotFound = () => (
  <PageLayout title="Not Found">
    <div style={{ padding: 16, background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
      Page not found
    </div>
  </PageLayout>
);

export default NotFound;