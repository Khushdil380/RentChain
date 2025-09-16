import React, { useEffect, useMemo, useState } from 'react';
import './auth.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotForm from './ForgotForm';

const TABS = ['Login', 'Sign Up', 'Forgot'];

const AuthCard = () => {
  const [tab, setTab] = useState('Login');
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    try {
      const usp = new URLSearchParams(window.location.search);
      const qTab = usp.get('tab');
      const msg = usp.get('msg');
      if (qTab && TABS.includes(qTab)) setTab(qTab);
      if (msg) setBanner(msg);
      if (msg) {
        const t = setTimeout(() => setBanner(null), 4000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);
  const Tabs = useMemo(() => ({ Login: LoginForm, 'Sign Up': SignupForm, Forgot: ForgotForm }), []);
  const Active = Tabs[tab];
  return (
    <div className="auth-card">
      {banner && <div className="auth-alert ok" style={{ marginBottom: 12 }}>{banner}</div>}
      <div className="auth-tabs">
        {TABS.map(t => (
          <button key={t} className={`auth-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="auth-body">
        <Active onSwitch={setTab} />
      </div>
    </div>
  );
};

export default AuthCard;
