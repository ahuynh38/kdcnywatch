import { useState, useEffect } from 'react';
import { fetchAllStats, refreshStats, addPlayer } from '../api/client.js';

export function usePlayerStats() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ─── Load stats on mount ────────────────────────────────────────────────────

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllStats();
      setStats(data);
    } catch (err) {
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

  return {
    stats,
    loading,
    refreshing,
    error,
    handleRefresh,
    handleAddPlayer,
  };
}