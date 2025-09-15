import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/User.js';
import PendingUser from '../../models/PendingUser.js';
import nodemailer from 'nodemailer';

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

function validatePasswordRules(pw) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);
}

function indianPhone(num) {
  return /^\d{10}$/.test(num || '');
}

function looksLikeObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id || '');
}

async function getMailer() {
  // Reuse existing transport config from contact if present; else simple JSON transport
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return nodemailer.createTransport({ jsonTransport: true });
}

function otpEmailTemplate({ name = 'there', otp, expiryMins = 10, loginUrl }) {
  const greetingName = name?.split(' ')?.[0] || 'there';
  const siteUrl = process.env.APP_ORIGIN || 'http://localhost:3000';
  const loginLink = loginUrl || `${siteUrl}/join`;
  const brandColor = '#41229F';
  const text = `Hello ${greetingName},\n\nUse the one-time code below to verify your account on RentChain:\n\n${otp}\n\nThis code expires in ${expiryMins} minutes.\n\nLogin: ${loginLink}\n\nAbout RentChain\nRentChain helps renters and hosts connect with trust and transparency.\n\nHelpful links (update these):\n• Website: ${siteUrl}\n• Login: ${loginLink}\n• FAQ: ${siteUrl}/about#faq\n• Support: ${siteUrl}/contact\n\nBest wishes,\nTeam RentChain`;
  const html = `
  <div style="font-family: Inter,Segoe UI,Roboto,Arial,sans-serif; background:#f7f9fc; padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,.08); overflow:hidden;">
      <tr>
        <td style="padding:20px 24px; background:${brandColor}; color:#fff;">
          <h1 style="margin:0; font-size:20px;">RentChain</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 24px 8px; color:#111;">
          <p style="margin:0 0 12px; font-size:16px;">Hi ${greetingName},</p>
          <p style="margin:0 0 16px; line-height:1.6;">Welcome to RentChain! Use the one-time code below to verify your account and continue.</p>
          <div style="margin:16px 0; text-align:center;">
            <div style="display:inline-block; font-size:28px; letter-spacing:6px; font-weight:700; color:${brandColor}; background:#f0ecff; padding:12px 18px; border-radius:10px;">${otp}</div>
          </div>
          <p style="margin:0 0 16px; color:#444;">This code expires in <strong>${expiryMins} minutes</strong>. For your security, don’t share it with anyone.</p>
          <p style="margin:0 0 20px;">
            <a href="${loginLink}" style="display:inline-block; background:${brandColor}; color:#fff; text-decoration:none; padding:10px 14px; border-radius:8px;">Open the Login page</a>
          </p>
          <hr style="border:none; border-top:1px solid #eee; margin:20px 0;"/>
          <h3 style="margin:0 0 8px; font-size:16px;">About RentChain</h3>
          <p style="margin:0 0 12px; color:#555; line-height:1.6;">RentChain helps renters and hosts connect with trust and transparency. Manage listings, inquiries, and secure communication in one place.</p>
          <ul style="margin:0 0 16px 18px; color:#555;">
            <li><a href="${siteUrl}" style="color:${brandColor}; text-decoration:none;">Website</a></li>
            <li><a href="${siteUrl}/join" style="color:${brandColor}; text-decoration:none;">Login / Join</a></li>
            <li><a href="${siteUrl}/about#faq" style="color:${brandColor}; text-decoration:none;">FAQ</a></li>
            <li><a href="${siteUrl}/contact" style="color:${brandColor}; text-decoration:none;">Contact Support</a></li>
          </ul>
          <p style="margin:12px 0 0;">Warm wishes,<br/>Team RentChain</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 24px; background:#fafafa; color:#777; font-size:12px;">
          If you didn’t request this code, you can safely ignore this email.
        </td>
      </tr>
    </table>
  </div>`;
  return { text, html, subject: 'Your RentChain verification code' };
}

export const authService = {
  async signup({ fullName, gender, dob, phone, email, username, password, confirmPassword }) {
    if (!fullName || !/^[A-Za-z ]+$/.test(fullName)) throw new Error('Valid full name required');
    if (dob && new Date(dob) > new Date(Date.now() - 16*365*24*60*60*1000)) throw new Error('Must be at least 16 years old');
    if (phone && !indianPhone(phone)) throw new Error('Phone must be 10 digits');
    if (username && username.length < 4) throw new Error('Username too short');
    if (!validatePasswordRules(password)) throw new Error('Password does not meet requirements');
    if (password !== confirmPassword) throw new Error('Passwords do not match');

    // Block only if a REAL user exists
    if (phone && await User.findOne({ phone })) throw new Error('Phone already registered');
    if (email && await User.findOne({ email })) throw new Error('Email already registered');
    if (username && await User.findOne({ username })) throw new Error('Username already taken');

    // If a pending signup exists, resend OTP and return requiresOtp
    const pendingQuery = {
      $or: [
        ...(email ? [{ email }] : []),
        ...(username ? [{ username }] : []),
        ...(phone ? [{ phone }] : []),
      ]
    };
    if (pendingQuery.$or.length) {
      const existingPending = await PendingUser.findOne(pendingQuery);
      if (existingPending) {
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        existingPending.otp = await bcrypt.hash(otp, 8);
        existingPending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await existingPending.save();
        const mailer = await getMailer();
        const { text, html, subject } = otpEmailTemplate({ name: existingPending.fullName, otp, expiryMins: 10 });
        await mailer.sendMail({
          from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com',
          to: existingPending.email || process.env.CONTACT_TO,
          subject,
          text,
          html,
        });
        const identifier = email || username || phone;
        return { requiresOtp: true, identifier };
      }
    }

    const hash = await bcrypt.hash(password, 10);
    // Create pending user and send OTP
    const pending = await PendingUser.create({ fullName, gender, dob, phone, email, username, password: hash, roles: ['tenant'] });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    pending.otp = await bcrypt.hash(otp, 8);
    pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await pending.save();
    const mailer = await getMailer();
    if (pending.email || process.env.CONTACT_TO) {
      const { text, html, subject } = otpEmailTemplate({ name: pending.fullName, otp, expiryMins: 10 });
      await mailer.sendMail({
        from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com',
        to: pending.email || process.env.CONTACT_TO,
        subject,
        text,
        html,
      });
    }
    const identifier = email || username || phone;
    return { requiresOtp: true, identifier };
  },

  async login({ identifier, password }) {
    const query = indianPhone(identifier)
      ? { phone: identifier }
      : looksLikeObjectId(identifier)
      ? { _id: identifier }
      : { $or: [{ email: identifier }, { username: identifier }] };
    // If a pending signup exists, resend OTP and ask for verification
    const pending = await PendingUser.findOne(query);
    if (pending) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      pending.otp = await bcrypt.hash(otp, 8);
      pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await pending.save();
      const mailer = await getMailer();
      const { text, html, subject } = otpEmailTemplate({ name: pending.fullName, otp, expiryMins: 10 });
      await mailer.sendMail({
        from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com',
        to: pending.email || process.env.CONTACT_TO,
        subject,
        text,
        html,
      });
      return { requiresOtp: true, identifier };
    }
    const user = await User.findOne(query);
    if (!user) throw new Error('User not found');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    const token = signToken({ uid: user._id, roles: user.roles });
    const safeUser = { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, username: user.username, roles: user.roles, isVerified: user.isVerified };
    return { token, safeUser };
  },

  async requestOtp({ identifier }) {
    const query = indianPhone(identifier)
      ? { phone: identifier }
      : looksLikeObjectId(identifier)
      ? { _id: identifier }
      : { $or: [{ email: identifier }, { username: identifier }] };
    // Prefer pending user for signup flow; fallback to existing user for re-verification
    const pending = await PendingUser.findOne(query);
    const user = pending || await User.findOne(query);
    if (!user) throw new Error('User not found');
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = await bcrypt.hash(otp, 8);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    const mailer = await getMailer();
    const { text, html, subject } = otpEmailTemplate({ name: user.fullName, otp, expiryMins: 10 });
    await mailer.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com',
      to: user.email || process.env.CONTACT_TO,
      subject,
      text,
      html,
    });
  },

  async verifyOtp({ identifier, otp }) {
    const query = indianPhone(identifier)
      ? { phone: identifier }
      : looksLikeObjectId(identifier)
      ? { _id: identifier }
      : { $or: [{ email: identifier }, { username: identifier }] };
    const pending = await PendingUser.findOne(query);
    if (pending) {
      if (!pending.otp || !pending.otpExpiresAt) throw new Error('No OTP pending');
      if (Date.now() > new Date(pending.otpExpiresAt).getTime()) throw new Error('OTP expired');
      const ok = await bcrypt.compare(String(otp), pending.otp);
      if (!ok) throw new Error('Invalid OTP');
      // On OTP success, create real User and delete pending
      const user = await User.create({
        fullName: pending.fullName,
        gender: pending.gender,
        dob: pending.dob,
        phone: pending.phone,
        email: pending.email,
        username: pending.username,
        password: pending.password,
        roles: pending.roles,
        isVerified: true,
      });
      // Send welcome email
      const mailer = await getMailer();
      const siteUrl = process.env.APP_ORIGIN || 'http://localhost:3000';
      const subject = 'Welcome to RentChain — You are verified!';
      const text = `Hello ${pending.fullName?.split(' ')?.[0] || ''},\n\nYour account has been successfully verified. You can now log in at ${siteUrl}/join.\n\nBest wishes,\nTeam RentChain`;
      const html = `
        <div style="font-family: Inter,Segoe UI,Roboto,Arial,sans-serif; background:#f7f9fc; padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,.08); overflow:hidden;">
            <tr>
              <td style="padding:20px 24px; background:#41229F; color:#fff;"><h1 style="margin:0; font-size:20px;">RentChain</h1></td>
            </tr>
            <tr>
              <td style="padding:24px; color:#111;">
                <p style="margin:0 0 10px; font-size:16px;">Hi ${pending.fullName?.split(' ')?.[0] || ''},</p>
                <p style="margin:0 0 16px; line-height:1.6;">Your account has been <strong>successfully verified</strong>. You can now log in and start using RentChain.</p>
                <p style="margin:0 0 18px;"><a href="${siteUrl}/join" style="display:inline-block; background:#41229F; color:#fff; text-decoration:none; padding:10px 14px; border-radius:8px;">Go to Login</a></p>
                <p style="margin:0; color:#555;">Warm wishes,<br/>Team RentChain</p>
              </td>
            </tr>
          </table>
        </div>`;
      await mailer.sendMail({ from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com', to: user.email || process.env.CONTACT_TO, subject, text, html });
      await pending.deleteOne();
      return;
    }
    // If not pending, verify existing user re-verification flow
    const user = await User.findOne(query);
    if (!user || !user.otp || !user.otpExpiresAt) throw new Error('No OTP pending');
    if (Date.now() > new Date(user.otpExpiresAt).getTime()) throw new Error('OTP expired');
    const ok = await bcrypt.compare(String(otp), user.otp);
    if (!ok) throw new Error('Invalid OTP');
    user.otp = undefined; user.otpExpiresAt = undefined; user.isVerified = true;
    await user.save();
  },

  async forgotPassword({ identifier }) {
    const query = indianPhone(identifier) ? { phone: identifier } : { $or: [{ email: identifier }, { username: identifier }] };
    const user = await User.findOne(query);
    if (!user) throw new Error('User not found');
    const token = crypto.randomBytes(24).toString('hex');
    user.otp = await bcrypt.hash(token, 8);
    user.otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    const siteUrl = process.env.APP_ORIGIN || 'http://localhost:3000';
    const resetLink = `${siteUrl}/reset-password?token=${token}&id=${user._id}`;
    const brand = '#41229F';
    const subject = 'Reset your RentChain password';
    const text = `Hello ${user.fullName?.split(' ')?.[0] || ''},\n\nWe received a request to reset your RentChain password. If you made this request, click the link below to set a new password. This link expires in 60 minutes.\n\n${resetLink}\n\nIf you didn't request this, you can ignore this email.\n\nTeam RentChain`;
    const html = `
      <div style="font-family: Inter,Segoe UI,Roboto,Arial,sans-serif; background:#f7f9fc; padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,.08); overflow:hidden;">
          <tr>
            <td style="padding:20px 24px; background:${brand}; color:#fff;"><h1 style="margin:0; font-size:20px;">RentChain</h1></td>
          </tr>
          <tr>
            <td style="padding:24px; color:#111;">
              <p style="margin:0 0 10px; font-size:16px;">Hi ${user.fullName?.split(' ')?.[0] || ''},</p>
              <p style="margin:0 0 16px; line-height:1.6;">We received a request to reset your RentChain password. Click the button below to set a new password. This link expires in <strong>60 minutes</strong>.</p>
              <p style="margin:0 0 18px;"><a href="${resetLink}" style="display:inline-block; background:${brand}; color:#fff; text-decoration:none; padding:10px 14px; border-radius:8px;">Reset your password</a></p>
              <p style="margin:0 0 8px; color:#555;">If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="margin:0 0 16px; word-break:break-all;"><a href="${resetLink}" style="color:${brand}; text-decoration:none;">${resetLink}</a></p>
              <hr style="border:none; border-top:1px solid #eee; margin:20px 0;"/>
              <p style="margin:0; color:#555;">If you didn't request this, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </div>`;
    const mailer = await getMailer();
    await mailer.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@example.com',
      to: user.email || process.env.CONTACT_TO,
      subject,
      text,
      html,
    });
  },

  async resetPassword({ id, token, newPassword }) {
    if (!validatePasswordRules(newPassword)) throw new Error('Password does not meet requirements');
    const user = await User.findById(id);
    if (!user || !user.otp || !user.otpExpiresAt) throw new Error('Invalid reset request');
    if (Date.now() > new Date(user.otpExpiresAt).getTime()) throw new Error('Reset link expired');
    const ok = await bcrypt.compare(String(token), user.otp);
    if (!ok) throw new Error('Invalid token');
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined; user.otpExpiresAt = undefined;
    await user.save();
  },

  async checkUnique({ username, email, phone }) {
    const exists = {
      username: username ? !!(await User.findOne({ username }) || await PendingUser.findOne({ username })) : false,
      email: email ? !!(await User.findOne({ email }) || await PendingUser.findOne({ email })) : false,
      phone: phone ? !!(await User.findOne({ phone }) || await PendingUser.findOne({ phone })) : false,
    };
    return exists;
  }
};
