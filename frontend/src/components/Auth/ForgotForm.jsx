import React, { useMemo, useState } from 'react';
import { getApiBase } from '../../utils/apiBase';

export default function ForgotForm({ onSwitch }) {
  const api = useMemo(() => getApiBase(), []);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
  const res = await fetch(`${api}/api/auth/forgot`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: email }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Request failed');
      setMsg({ ok: true, text: 'If an account exists, a reset link has been sent.' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      {msg && <div className={`auth-alert ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <div className="f-field">
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="form-actions">
        <button className="btn-primary" disabled={!email || loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
        <button type="button" className="link" onClick={() => onSwitch?.('Login')}>Back to login</button>
      </div>
    </form>
  );
}
