import { useState } from 'react';
import styles from './RemovePlayer.module.css';

export default function RemovePlayer({ stats, players, onRemovePlayer }) {
  const [confirming, setConfirming] = useState(null);

  const battletags = Object.keys(stats);

  async function handleRemove(battletag) {
    if (confirming !== battletag) {
      setConfirming(battletag);
      return;
    }

    await onRemovePlayer(battletag);
    setConfirming(null);
  }

  function handleCancel() {
    setConfirming(null);
  }

  if (battletags.length === 0) {
    return <p className={styles.empty}>No players are being tracked.</p>;
  }

  return (
    <div className="remove-player">
      <ul className={styles.list}>
        {players.map((battletag) => {
            const hasFailed = !stats[battletag];
            return (
                <li key={battletag} className={`${styles.item}${hasFailed ? `${styles.itemFailed}` : ''}`}>
                    <div className={styles.info}>
                        <span className={styles.tag}>{battletag}</span>
                        {hasFailed && (
                            <span className={styles.failedBadge}>fetch failed</span>
                        )}
                    </div>
                    <div className={styles.actions}>
              {confirming === battletag ? (
                <>
                  <span className={styles.confirmText}>Are you sure?</span>
                  <button
                    className={`${styles.button} ${styles.buttonConfirm}`}
                    onClick={() => handleRemove(battletag)}
                  >
                    Yes, remove
                  </button>
                  <button
                    className={`${styles.button} ${styles.buttonCancel}`}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className={`${styles.button} ${styles.buttonRemove}`}
                  onClick={() => handleRemove(battletag)}
                >
                  Remove
                </button>
              )}
                    </div>
                </li>
            );
        })}
      </ul>
    </div>
  );
}