import { authService } from './auth.service.js';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('rc_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function signup(req, res) {
  try {
    const result = await authService.signup(req.body);
    return res.status(201).json({ ok: true, requiresOtp: result.requiresOtp, identifier: result.identifier });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || 'Signup failed' });
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    if (result?.requiresOtp) {
      return res.json({ ok: true, requiresOtp: true, identifier: result.identifier });
    }
    const { token, safeUser } = result;
    setAuthCookie(res, token);
    return res.json({ ok: true, user: safeUser });
  } catch (e) {
    return res.status(401).json({ ok: false, error: e.message || 'Login failed' });
  }
}

export async function requestOtp(req, res) {
  try {
    await authService.requestOtp(req.body);
    return res.json({ ok: true, message: 'OTP sent' });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || 'OTP request failed' });
  }
}

export async function verifyOtp(req, res) {
  try {
    await authService.verifyOtp(req.body);
    return res.json({ ok: true, message: 'OTP verified' });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || 'OTP verify failed' });
  }
}

export async function forgotPassword(req, res) {
  try {
    await authService.forgotPassword(req.body);
    return res.json({ ok: true, message: 'Reset instructions sent' });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || 'Forgot password failed' });
  }
}

export async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body);
    return res.json({ ok: true, message: 'Password reset successful' });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || 'Reset password failed' });
  }
}

export async function checkUnique(req, res) {
  try {
    const exists = await authService.checkUnique(req.query);
    return res.json({ ok: true, exists });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message || 'Check unique failed' });
  }
}

export async function me(req, res) {
  try {
    const token = req.cookies?.rc_token;
    if (!token) return res.status(401).json({ ok: false, error: 'Not authenticated' });
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.uid).lean();
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid session' });
    const safeUser = { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, username: user.username, roles: user.roles, isVerified: user.isVerified };
    return res.json({ ok: true, user: safeUser });
  } catch (e) {
    return res.status(401).json({ ok: false, error: 'Not authenticated' });
  }
}

export async function logout(req, res) {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('rc_token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'strict' : 'lax' });
    return res.json({ ok: true });
  } catch (e) {
    return res.json({ ok: true });
  }
}
