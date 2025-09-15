import React, { useMemo, useState } from 'react';
import './auth.css';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotForm from './ForgotForm';

const TABS = ['Login', 'Sign Up', 'Forgot'];

const AuthCard = () => {
  const [tab, setTab] = useState('Login');
  const Tabs = useMemo(() => ({ Login: LoginForm, 'Sign Up': SignupForm, Forgot: ForgotForm }), []);
  const Active = Tabs[tab];
  return (
    <div className="auth-card">
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
