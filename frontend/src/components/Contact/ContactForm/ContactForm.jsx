import React, { useState } from 'react';
import './ContactForm.css';

const initial = { name: '', email: '', subject: '', message: '' };

const ContactForm = ({ onResult }) => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onResult?.(null);
    try {
      // Resolve API base: prefer env, else smart localhost fallback to backend port 5001
      let apiBase = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
      if (!apiBase) {
        try {
          const { protocol, hostname, port } = window.location;
          const isHttp = protocol === 'http:' || protocol === 'https:';
          const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
          if (isHttp) {
            if (isLocal && port !== '5001') {
              apiBase = `${protocol}//localhost:5001`;
            } else {
              apiBase = `${protocol}//${hostname}${port ? ':' + port : ''}`;
            }
          } else {
            // Non-HTTP scheme (e.g., file:) — default to backend dev port
            apiBase = 'http://localhost:5001';
          }
        } catch {
          // window not available — default to backend dev port
          apiBase = 'http://localhost:5001';
        }
      }
      const url = `${apiBase}/api/contact`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form),
      });
      const ct = res.headers.get('content-type') || '';
      let data;
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        // Common dev pitfall: proxy not active or backend not running -> index.html returned
        if (text.trim().startsWith('<!DOCTYPE')) {
          throw new Error('Received HTML instead of JSON. Is the backend running and the dev proxy configured?');
        }
        throw new Error(text || 'Unexpected non-JSON response from server');
      }
      if (!res.ok) throw new Error(data?.error || 'Failed to send');
      onResult?.({ ok: true, message: data.message || 'Message sent successfully' });
      setForm(initial);
    } catch (err) {
      onResult?.({ ok: false, message: err.message || 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="c-form" onSubmit={onSubmit}>
      <h3 className="c-title">Contact Us</h3>
      <div className="c-grid">
        <label className="c-field">
          <span>Name</span>
          <input name="name" placeholder="Your full name" value={form.name} onChange={onChange} required />
        </label>
        <label className="c-field">
          <span>Email</span>
          <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
        </label>
      </div>
      <label className="c-field">
        <span>Subject</span>
        <input name="subject" placeholder="How can we help?" value={form.subject} onChange={onChange} required />
      </label>
      <label className="c-field">
        <span>Message</span>
        <textarea name="message" rows="5" placeholder="Write your message..." value={form.message} onChange={onChange} required />
      </label>
      <div className="c-actions">
        <button type="submit" className="c-btn" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
      </div>
      {/* TODO: Add CAPTCHA/Rate limiting if needed */}
    </form>
  );
};

export default ContactForm;