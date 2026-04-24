import { useState } from 'react';
import styles from './AddPlayer.module.css';

export default function AddPlayer({ onAddPlayer }) {
  const [battletag, setBattletag] = useState('');
  const [status, setStatus] = useState(null);

  async function handleSubmit() {
    const trimmed = battletag.trim();

    if (!trimmed) return;

    setStatus({ type: 'loading', message: `Adding ${trimmed}...` });

    try {
      await onAddPlayer(trimmed);
      setStatus({ type: 'success', message: `${trimmed} added successfully!` });
      setBattletag('');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to add player.' });
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className={styles.addPlayer}>
      <input
        className={styles.input}
        type="text"
        placeholder="Battletag (e.g. Player-1234)"
        value={battletag}
        onChange={(e) => setBattletag(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className={styles.button}
        onClick={handleSubmit}
        disabled={!battletag.trim() || status?.type === 'loading'}
      >
        {status?.type === 'loading' ? 'Adding...' : 'Add Player'}
      </button>
      {status && status.type !== 'loading' && (
        <p className={`${styles.status} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}