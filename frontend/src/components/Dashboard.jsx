import { useState } from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats.js';
import PlayerGrid from '../components/PlayerGrid.jsx';
import StatsTable from '../components/StatsTable.jsx';
import StatsChart from '../components/StatsChart.jsx';
import AddPlayer from '../components/AddPlayer.jsx';
import RemovePlayer from './RemovePlayer.jsx';
import LastUpdated from '../components/LastUpdated.jsx';
import RoleToggle from '../components/RoleToggle.jsx';
import ViewToggle from '../components/ViewToggle.jsx';
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
  const [selectedView, setSelectedView] = useState('average');

  function handleStatSelect(statKey) {
    if (statKey === selectedStat) return;
    setSelectedStat(statKey);
  }

  function handleRoleSelect(role) {
    if (role === selectedRole) return;
    setSelectedRole(role);
  }

  function handleViewSelect(view) {
    if (view === selectedView) return;
    setSelectedView(view);
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

      {/* ── Role and View Selector ── */}
      <section className={styles.section}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <h2 className={styles.sectionTitle}>Stats by role</h2>
          <RoleToggle
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
          />
          <ViewToggle
            selectedView={selectedView}
            onViewSelect={handleViewSelect}
          />
        </div>
      </section>

      {/* ── Stat Comparison Table ── */}
      <section className={styles.section}>
        <StatsTable
          stats={stats}
          selectedStat={selectedStat}
          onStatSelect={handleStatSelect}
          selectedRole={selectedRole}
          selectedView={selectedView}
        />
      </section>

      {/* ── Stat Chart ── */}
      <section className={styles.section}>
        <StatsChart
          stats={stats}
          selectedStat={selectedStat}
          selectedRole={selectedRole}
          selectedView={selectedView}
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