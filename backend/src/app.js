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
// e.g. app.use('/api/auth', import('./modules/auth/routes.js'));

export default app;
