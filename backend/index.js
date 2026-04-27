import express from 'express';
import cors from 'cors';
import playerRoutes from './routes/players.js';
import rateLimit from 'express-rate-limit';
import { fetchAllPlayers } from './fetcher.js';
import { getStats } from './storage.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})

app.use(limiter);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/players', playerRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Fetch all players from the get-go to force refresh on backend startup
  await fetchAllPlayers();
  const stats = getStats();
});