import { deliverContactEmail } from './contact.service.js';
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields: name, email, subject, message' });
  }
  try {
    await deliverContactEmail({ name, email, subject, message });
    return res.json({ ok: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact email failed:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send message' });
  }
};
