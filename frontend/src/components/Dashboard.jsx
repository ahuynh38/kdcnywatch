import { useState } from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats.js';
import PlayerGrid from '../components/PlayerGrid.jsx';
import StatsTable from '../components/StatsTable.jsx';
import StatsChart from '../components/StatsChart.jsx';
import AddPlayer from '../components/AddPlayer.jsx';
import LastUpdated from '../components/LastUpdated.jsx';

const DEFAULT_STAT = 'winrate';

export default function Dashboard() {
  const {
    stats,
    loading,
    refreshing,
    error,
    handleRefresh,
    handleAddPlayer,
  } = usePlayerStats();

  const [selectedStat, setSelectedStat] = useState(DEFAULT_STAT);

  function handleStatSelect(statKey) {
    if (statKey === selectedStat) return;
    setSelectedStat(statKey);
  }

  if (loading) {
    return (
      <div className="dashboard__loading">
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ── Header ── */}
      <header className="dashboard__header">
        <h1 className="dashboard__title">kdcnywatch</h1>
        <LastUpdated
          stats={stats}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </header>

      {/* ── Add Player ── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Add Player</h2>
        <AddPlayer onAddPlayer={handleAddPlayer} />
      </section>

      {/* ── Error Banner ── */}
      {error && (
        <div className="dashboard__error">
          {error}
        </div>
      )}

      {/* ── Player Cards ── */}
      <section className="dashboard__section">
        <PlayerGrid stats={stats} />
      </section>

      {/* ── Stat Comparison Table ── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Stat Comparison Table</h2>
        <StatsTable
          stats={stats}
          selectedStat={selectedStat}
          onStatSelect={handleStatSelect}
        />
      </section>

      {/* ── Stat Chart ── */}
      <section className="dashboard__section">
        <StatsChart
          stats={stats}
          selectedStat={selectedStat}
        />
      </section>

    </div>
  );
}