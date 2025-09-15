import mongoose from 'mongoose';

export function requireDb(req, res, next) {
  // 1 = connected, 2 = connecting; allow only fully connected to avoid timeouts
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ok: false, error: 'Database not connected', code: 'DB_OFFLINE' });
  }
  return next();
}
