import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the data/directory relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// ─── Generic Helpers ────────────────────────────────────────────────────────

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Players ────────────────────────────────────────────────────────────────

export function getPlayers() {
  return readJSON(PLAYERS_FILE);
}

export function addPlayer(battletag) {
  const players = getPlayers();

  if (players.length >= 20) {
    throw new Error('Player limit reached.');
  }

  if (players.includes(battletag)) {
    throw new Error(`Player ${battletag} is already being tracked.`);
  }

  players.push(battletag);
  writeJSON(PLAYERS_FILE, players);
}

export function removePlayer(battletag) {
  const players = getPlayers();
  const updated = players.filter(p => p !== battletag);

  if (updated.length === players.length) {
    throw new Error(`Player ${battletag} not found.`);
  }

  writeJSON(PLAYERS_FILE, updated);
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export function getStats() {
  return readJSON(STATS_FILE);
}

export function getStatsByPlayer(battletag) {
  const stats = getStats();

  if (!stats[battletag]) {
    throw new Error(`No stats found for player ${battletag}.`);
  }

  return stats[battletag];
}

export function writeStats(data) {
  writeJSON(STATS_FILE, data);
}