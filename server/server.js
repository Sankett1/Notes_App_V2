import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import logsRoutes from './routes/logs.js';

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));
app.get('/api', (req, res) => res.status(200).json({ message: 'Notes App API v2.0', endpoints: { auth: '/api/auth', notes: '/api/notes', logs: '/api/logs' } }));

app.use('/api/auth',  authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/logs',  logsRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', '), details: messages });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already in use` });
  }

  res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║   Notes App API — http://localhost:${PORT}  ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
╚══════════════════════════════════════════╝
    `);
  });

  process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
  process.on('uncaughtException', (err) => { console.error('Uncaught Exception:', err); process.exit(1); });

}).catch(err => { console.error('Failed to connect to database:', err); process.exit(1); });

export default app;
