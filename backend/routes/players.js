import express from 'express';
import { getPlayers, getStatsByPlayer, getStats, addPlayer, removePlayer } from '../storage.js';
import { fetchAllPlayers } from '../fetcher.js';

const router = express.Router();

// ─── GET /players ─────────────────────────────────────────────────────────────
// Returns the list of all tracked players

router.get('/', (req, res) => {
  try {
    const players = getPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /players/stats ───────────────────────────────────────────────────────
// Returns the full stats object for all players at once

router.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /players/:tag/stats ──────────────────────────────────────────────────
// Returns the latest stats for a specific player

router.get('/:tag/stats', (req, res) => {
  try {
    const stats = getStatsByPlayer(req.params.tag);
    res.json(stats);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ─── POST /players/add ────────────────────────────────────────────────────────
// Adds a new player to the tracking list

router.post('/add', (req, res) => {
  try {
    const { battletag } = req.body;

    if (!battletag) {
      return res.status(400).json({ error: 'battletag is required.' });
    }

    addPlayer(battletag);
    res.json({ message: `${battletag} added successfully.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /players/:tag
router.delete('/:tag', (req, res) => {
  try {
    removePlayer(req.params.tag);
    res.json({ message: `${req.params.tag} removed successfully.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /players/refresh ────────────────────────────────────────────────────
// Manually triggers a fresh fetch for all tracked players

router.post('/refresh', async (req, res) => {
  try {
    const { results, errors } = await fetchAllPlayers();
    res.json({
      message: 'Refresh complete.',
      succeeded: Object.keys(results).length,
      failed: errors.length,
      errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;