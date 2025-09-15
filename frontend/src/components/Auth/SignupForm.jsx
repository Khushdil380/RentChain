import React, { useEffect, useMemo, useState } from 'react';
import { getApiBase } from '../../utils/apiBase';

const initial = { fullName: '', gender: '', dob: '', phone: '', email: '', username: '', password: '', confirmPassword: '' };

const pwStrength = (pw) => {
  if (!pw) return '';
  const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
  const medium = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return strong.test(pw) ? 'Strong' : medium.test(pw) ? 'Medium' : 'Weak';
};

export default function SignupForm({ onSwitch }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState({ username: false, email: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [otpStage, setOtpStage] = useState({ active: false, identifier: '', code: '' });

  const api = useMemo(() => getApiBase(), []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validators = {
    fullName: v => v && /^[A-Za-z ]+$/.test(v) ? '' : 'Only alphabets allowed',
    dob: v => {
      if (!v) return '';
      const d = new Date(v);
      const min = new Date(); min.setFullYear(min.getFullYear() - 16);
      return d <= min ? '' : 'Must be at least 16 years old';
    },
    phone: v => /^\d{10}$/.test(v) ? '' : 'Enter 10-digit number',
    email: v => /.+@.+\..+/.test(v) ? '' : 'Enter a valid email',
    username: v => (v && v.length >= 4 ? '' : 'Min 4 characters'),
    password: v => (/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(v) ? '' : 'Min 8 chars incl. uppercase, number, special'),
    confirmPassword: v => (v === form.password ? '' : 'Passwords do not match'),
  };

  const validateField = (k, v) => setErrors(e => ({ ...e, [k]: validators[k] ? validators[k](v) : '' }));

  // uniqueness checks (only when format-valid); do not overwrite existing format errors
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      const validUsername = !!form.username && form.username.length >= 4;
      const validEmail = !!form.email && /.+@.+\..+/.test(form.email);
      const validPhone = !!form.phone && /^\d{10}$/.test(form.phone);
      // Skip if nothing to check
      if (!validUsername && !validEmail && !validPhone) return;

      const params = new URLSearchParams({
        username: validUsername ? form.username : '',
        email: validEmail ? form.email : '',
        phone: validPhone ? form.phone : ''
      }).toString();
      setChecking({ username: validUsername, email: validEmail, phone: validPhone });
      try {
        const res = await fetch(`${api}/api/auth/unique?${params}`, { signal: ctrl.signal });
        let data = null;
        try { data = await res.json(); } catch {}
        if (res.status === 503) {
          setMsg({ ok: false, text: 'Database offline. Please configure MONGO_URI and restart backend.' });
          return;
        }
        if (data?.ok) {
          setErrors(prev => ({
            ...prev,
            username: (validUsername && data.exists.username && !prev.username) ? 'Username already taken' : prev.username,
            email: (validEmail && data.exists.email && !prev.email) ? 'Email already registered' : prev.email,
            phone: (validPhone && data.exists.phone && !prev.phone) ? 'Phone already registered' : prev.phone,
          }));
        }
      } catch {
        // ignore
      } finally {
        setChecking({ username: false, email: false, phone: false });
      }
    }, 300);

    return () => { ctrl.abort(); clearTimeout(timer); };
  }, [form.username, form.email, form.phone, api]);

  const allValid = ['fullName','dob','phone','email','username','password','confirmPassword']
    .every(k => !validators[k] || validators[k](form[k]) === '')
    && Object.values(errors).every(v => !v)
    && form.fullName && form.phone && form.email && form.username && form.password && form.confirmPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setMsg(null);
    try {
      const res = await fetch(`${api}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      let data = null;
      try { data = await res.json(); } catch {}
      if (res.status === 503) {
        throw new Error('Service unavailable. Please configure database (MONGO_URI) and try again.');
      }
      if (!res.ok || !data?.ok) throw new Error((data && data.error) || 'Signup failed');
  const identifier = data.identifier || form.email || form.username || form.phone;
  setOtpStage({ active: true, identifier, code: '' });
  setMsg({ ok: true, text: 'We sent an OTP to your email. Verify to create your account.' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      setMsg(null);
      const res = await fetch(`${api}/api/auth/otp/request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: otpStage.identifier }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not resend OTP');
      setMsg({ ok: true, text: 'OTP resent. Please check your email.' });
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}/api/auth/otp/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: otpStage.identifier, otp: otpStage.code }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Invalid OTP');
      setMsg({ ok: true, text: 'Your account is verified. You can log in now.' });
      setOtpStage({ active: false, identifier: '', code: '' });
      onSwitch?.('Login');
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    }
  };

  if (otpStage.active) {
    return (
      <form className="auth-form" onSubmit={verifyOtp}>
        {msg && <div className={`auth-alert ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        <div className="f-field">
          <label>Enter OTP sent to {otpStage.identifier}</label>
          <input value={otpStage.code} onChange={e => setOtpStage(s => ({ ...s, code: e.target.value }))} placeholder="6-digit code" />
        </div>
        <div className="form-actions">
          <button className="btn-primary" disabled={!otpStage.code}>Verify</button>
          <button type="button" className="link" onClick={resendOtp}>Resend OTP</button>
        </div>
      </form>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-note">Please fill in accurate details. Fields marked * are mandatory.</div>
      {msg && <div className={`auth-alert ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <div className="grid-2">
        <div className={`f-field ${errors.fullName ? 'err' : ''}`}>
          <label>Full Name *</label>
          <input value={form.fullName} onChange={e => { set('fullName', e.target.value); validateField('fullName', e.target.value); }} placeholder="John Doe" />
          {errors.fullName && <div className="f-err">{errors.fullName}</div>}
        </div>
        <div className="f-field">
          <label>Gender</label>
          <select value={form.gender} onChange={e => set('gender', e.target.value)}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className={`f-field ${errors.dob ? 'err' : ''}`}>
          <label>Date of Birth</label>
          <input type="date" value={form.dob} onChange={e => { set('dob', e.target.value); validateField('dob', e.target.value); }} />
          {errors.dob && <div className="f-err">{errors.dob}</div>}
        </div>
        <div className={`f-field ${errors.phone ? 'err' : ''}`}>
          <label>Phone *</label>
          <input value={form.phone} onChange={e => { set('phone', e.target.value.replace(/\D/g, '')); validateField('phone', e.target.value.replace(/\D/g, '')); }} placeholder="9876543210" inputMode="numeric" maxLength={10} />
          {errors.phone && <div className="f-err">{errors.phone}</div>}
        </div>
        <div className={`f-field ${errors.email ? 'err' : ''}`}>
          <label>Email *</label>
          <input value={form.email} onChange={e => { set('email', e.target.value); validateField('email', e.target.value); }} placeholder="you@example.com" />
          {errors.email && <div className="f-err">{errors.email}</div>}
        </div>
        <div className={`f-field ${errors.username ? 'err' : ''}`}>
          <label>Username *</label>
          <input value={form.username} onChange={e => { set('username', e.target.value); validateField('username', e.target.value); }} placeholder="john_doe" />
          {errors.username && <div className="f-err">{errors.username}</div>}
        </div>
        <div className={`f-field ${errors.password ? 'err' : ''}`}>
          <label>Password *</label>
          <input type="password" value={form.password} onChange={e => { set('password', e.target.value); validateField('password', e.target.value); }} placeholder="••••••••" />
          <div className={`pw-meter ${pwStrength(form.password).toLowerCase()}`}>{pwStrength(form.password)}</div>
          {errors.password && <div className="f-err">{errors.password}</div>}
        </div>
        <div className={`f-field ${errors.confirmPassword ? 'err' : ''}`}>
          <label>Confirm Password *</label>
          <input type="password" value={form.confirmPassword} onChange={e => { set('confirmPassword', e.target.value); validateField('confirmPassword', e.target.value); }} placeholder="••••••••" />
          {errors.confirmPassword && <div className="f-err">{errors.confirmPassword}</div>}
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-primary" disabled={!allValid || submitting}>{submitting ? 'Creating...' : 'Create Account'}</button>
      </div>
      <div className="form-foot">Already have an account? <button type="button" className="link" onClick={() => onSwitch?.('Login')}>Login</button></div>
    </form>
  );
}
