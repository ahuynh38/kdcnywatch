import { useState, useEffect } from 'react';
import { fetchAllStats, fetchPlayers, refreshStats, addPlayer, removePlayer } from '../api/client.js';

export function usePlayerStats() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);

  // ─── Load stats on mount ────────────────────────────────────────────────────

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const [data, playerList] = await Promise.all([
        fetchAllStats(),
        fetchPlayers(),
      ]);
      setStats(data);
      setPlayers(playerList);
    } catch (err) {
      console.log(err)
      setError('Failed to load stats. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  // ─── Manual refresh ─────────────────────────────────────────────────────────

  async function handleRefresh() {
    try {
      setRefreshing(true);
      setError(null);
      await refreshStats();
      await loadStats();
    } catch (err) {
      setError('Refresh failed. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }

  // ─── Add a new player ───────────────────────────────────────────────────────

  async function handleAddPlayer(battletag) {
    try {
      await addPlayer(battletag);
      await handleRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add player.');
    }
  }

  // ─── Remove an existing player ───────────────────────────────────────────────────────
  async function handleRemovePlayer(battletag) {
    try {
      await removePlayer(battletag);
      await handleRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove player.');
    }
  }

  return {
    stats,
    players,
    loading,
    refreshing,
    error,
    handleRefresh,
    handleAddPlayer,
    handleRemovePlayer,
  };
}