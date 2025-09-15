import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

// CORS configured for cookie-based auth
const allowedOrigin = process.env.APP_ORIGIN || 'http://localhost:3000';
const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// Handle preflight for all routes
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RentChain backend is running.' });
});

// DB health
import mongoose from 'mongoose';
app.get('/api/health/db', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ ok: true, readyState: state });
});

// TODO: Import and use modular routes here
import contactRoutes from './modules/contact/contact.routes.js';
app.use('/api/contact', contactRoutes);

// Auth routes
import authRoutes from './modules/auth/auth.routes.js';
import { requireDb } from './middleware/dbReady.js';
app.use('/api/auth', requireDb, authRoutes);

// Return JSON for any unknown /api route instead of default HTML
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, error: 'API route not found' });
});

// Centralized error handler returning JSON for API routes
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path && req.path.startsWith('/api')) {
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
  // Fallback to default handler for non-API routes (e.g., static in prod)
  return next(err);
});

export default app;
