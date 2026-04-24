import styles from './LastUpdated.module.css'

export default function LastUpdated({ stats, refreshing, onRefresh }) {
  const players = Object.values(stats);
  const fetchedAt = players[0]?.fetchedAt;

  function formatDate(isoString) {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleString();
  }

  return (
    <div className={styles.lastUpdated}>
      <span className={styles.text}>
        Last updated: {formatDate(fetchedAt)}
      </span>
      <button
        className={styles.button}
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Stats'}
      </button>
    </div>
  );
}