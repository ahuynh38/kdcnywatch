import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─── Players ──────────────────────────────────────────────────────────────────

export async function fetchAllStats() {
  const response = await client.get('/players/stats');
  return response.data;
}

export async function fetchPlayerStats(battletag) {
  const response = await client.get(`/players/${battletag}/stats`);
  return response.data;
}

export async function fetchPlayers() {
  const response = await client.get('/players');
  return response.data;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function refreshStats() {
  const response = await client.post('/players/refresh');
  return response.data;
}

export async function addPlayer(battletag) {
  const response = await client.post('/players/add', { battletag });
  return response.data;
}

export async function removePlayer(battletag) {
  const response = await client.delete(`/players/${battletag}`);
  return response.data;
}