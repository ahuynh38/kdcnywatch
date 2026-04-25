import { useState } from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats.js';
import PlayerGrid from '../components/PlayerGrid.jsx';
import StatsTable from '../components/StatsTable.jsx';
import StatsChart from '../components/StatsChart.jsx';
import AddPlayer from '../components/AddPlayer.jsx';
import RemovePlayer from './RemovePlayer.jsx';
import LastUpdated from '../components/LastUpdated.jsx';
import RoleToggle from '../components/RoleToggle.jsx'
import styles from './Dashboard.module.css';

const DEFAULT_STAT = 'winrate';

export default function Dashboard() {
  const {
    stats,
    players,
    loading,
    refreshing,
    error,
    handleRefresh,
    handleAddPlayer,
    handleRemovePlayer
  } = usePlayerStats();

  const [selectedStat, setSelectedStat] = useState(DEFAULT_STAT);
  const [selectedRole, setSelectedRole] = useState('all');

  function handleStatSelect(statKey) {
    if (statKey === selectedStat) return;
    setSelectedStat(statKey);
  }

  function handleRoleSelect(role) {
    if (role === selectedRole) return;
    setSelectedRole(role);
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.title}>kdcnywatch</h1>
        <LastUpdated
          stats={stats}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </header>

      {/* ── Player Cards ── */}
      <section className={styles.section}>
        <PlayerGrid stats={stats} />
      </section>

      {/* ── Role Selector ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stats by role</h2>
        <RoleToggle
          selectedRole={selectedRole}
          onRoleSelect={handleRoleSelect}
        />
      </section>

      {/* ── Stat Comparison Table ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stat Comparison Table</h2>
        <StatsTable
          stats={stats}
          selectedStat={selectedStat}
          onStatSelect={handleStatSelect}
          selectedRole={selectedRole}
        />
      </section>

      {/* ── Stat Chart ── */}
      <section className={styles.section}>
        <StatsChart
          stats={stats}
          selectedStat={selectedStat}
          selectedRole={selectedRole}
        />
      </section>

      {/* ── Add and Remove Players ── */}
      <section className={styles.section}>
        <div className={styles.playersGrid}>
          <div>
            <h2 className={styles.sectionTitle}>Player List</h2>
            <RemovePlayer stats={stats} players={players} onRemovePlayer={handleRemovePlayer} />
          </div>
          <div>
            <h2 className={styles.sectionTitle}>Add Player</h2>
            <AddPlayer onAddPlayer={handleAddPlayer} />
          </div>
        </div>
      </section>


      {/* ── Error Banner ── */}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

    </div>
  );
}