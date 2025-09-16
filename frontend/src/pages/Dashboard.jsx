import React, { useEffect, useState } from 'react';
import PageLayout from './_layout/PageLayout';
import { getApiBase } from '../utils/apiBase';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const api = getApiBase();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${api}/api/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Not authenticated');
        setUser(data.user);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [api]);

  return (
    <PageLayout title="Dashboard">
      <div style={{ padding: 16, background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ marginTop: 0 }}>Welcome to your dashboard</h2>
  {error && <p style={{ color: 'crimson' }}>{error} — please log in again.</p>}
        {user ? (
          <>
            <p>Logged in as <strong>{user.fullName || user.username || user.email}</strong></p>
            <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(user, null, 2)}</pre>
            <button className="btn-primary" onClick={async () => {
              try {
                await fetch(`${api}/api/auth/logout`, { method: 'POST', credentials: 'include' });
                window.location.href = '/join';
              } catch {}
            }}>Logout</button>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
