import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RentChain backend is running.' });
});

// TODO: Import and use modular routes here
import contactRoutes from './modules/contact/contact.routes.js';
app.use('/api/contact', contactRoutes);

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
