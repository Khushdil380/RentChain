import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBase } from '../../utils/apiBase';

export default function LoginForm({ onSwitch }) {
  const api = useMemo(() => getApiBase(), []);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('login'); // 'login' | 'otp'
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
  const res = await fetch(`${api}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ identifier, password }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Login failed');
      // If backend requires OTP verification, move to OTP stage
      if (data.requiresOtp) {
        setStage('otp');
        setMsg({ ok: true, text: 'Enter the OTP sent to your email/phone.' });
      } else {
        setMsg({ ok: true, text: 'Logged in successfully.' });
        setTimeout(() => navigate('/dashboard'), 300);
      }
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
  const res = await fetch(`${api}/api/auth/otp/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ identifier, otp }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'OTP verification failed');
  setMsg({ ok: true, text: 'OTP verified. You are logged in.' });
  setTimeout(() => navigate('/dashboard'), 300);
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`auth-form ${msg && !msg.ok ? 'shake' : ''}`} onSubmit={stage === 'login' ? login : verifyOtp}>
      {msg && <div className={`auth-alert ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      {stage === 'login' && (
        <>
          <div className="f-field">
            <label>Email or Username</label>
            <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="you@example.com or johndoe" />
          </div>
          <div className="f-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="form-actions">
            <button className="btn-primary" disabled={!identifier || !password || loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <button type="button" className="link" onClick={() => onSwitch?.('Forgot')}>Forgot password?</button>
          </div>
          <div className="form-foot">No account? <button type="button" className="link" onClick={() => onSwitch?.('Sign Up')}>Create one</button></div>
        </>
      )}
      {stage === 'otp' && (
        <>
          <div className="f-field">
            <label>One-Time Password</label>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" />
          </div>
          <div className="form-actions">
            <button className="btn-primary" disabled={!otp || loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            <button type="button" className="link" onClick={async () => {
              setLoading(true);
              try {
                const res = await fetch(`${api}/api/auth/otp/request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier }) });
                const data = await res.json();
                if (!res.ok || !data.ok) throw new Error(data.error || 'Could not resend OTP');
                setMsg({ ok: true, text: 'OTP resent.' });
              } catch (err) { setMsg({ ok: false, text: err.message }); }
              setLoading(false);
            }}>Resend OTP</button>
          </div>
        </>
      )}
    </form>
  );
}
