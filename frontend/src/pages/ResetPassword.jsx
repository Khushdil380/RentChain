import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageLayout from './_layout/PageLayout';
import { getApiBase } from '../utils/apiBase';

const strong = (pw) => /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw || '');

export default function ResetPassword() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const token = params.get('token');
  const navigate = useNavigate();
  const api = useMemo(() => getApiBase(), []);

  const [pw, setPw] = useState('');
  const [cpw, setCpw] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!id || !token) {
      setMsg({ ok: false, text: 'Invalid or missing reset link.' });
      return;
    }
    if (!strong(pw)) {
      setMsg({ ok: false, text: 'Password must be 8+ chars, include an uppercase, a number, and a symbol.' });
      return;
    }
    if (pw !== cpw) {
      setMsg({ ok: false, text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${api}/api/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token, newPassword: pw })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Password reset failed');
      setMsg({ ok: true, text: 'Password reset successful. Redirecting to Join…' });
      setTimeout(() => navigate('/join'), 1200);
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Reset Password">
      <form onSubmit={submit} className={`auth-form ${msg && !msg.ok ? 'shake' : ''}`} style={{ maxWidth: 520, margin: '0 auto' }}>
        {msg && <div className={`auth-alert ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        <div className="f-field">
          <label>New password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
          <div className="hint">8+ chars, include uppercase, number, and symbol.</div>
        </div>
        <div className="f-field">
          <label>Confirm password</label>
          <input type="password" value={cpw} onChange={e => setCpw(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="form-actions">
          <button className="btn-primary" disabled={loading || !pw || !cpw}>{loading ? 'Saving…' : 'Reset Password'}</button>
        </div>
      </form>
    </PageLayout>
  );
}
