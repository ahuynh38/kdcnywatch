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
  windowsMs: 15 * 60 * 1000,
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

  const stats = getStats();
  if (Object.keys(stats).length === 0) {
    console.log('stats.json is empty, fetching player stats on startup...');
    await fetchAllPlayers();
    console.log('Startup fetch copmlete.');
  }
});