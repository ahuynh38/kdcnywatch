import { useState } from 'react';

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
    return <p className="remove-player__empty">No players are being tracked.</p>;
  }

  return (
    <div className="remove-player">
      <ul className="remove-player__list">
        {players.map((battletag) => {
            const hasFailed = !stats[battletag];
            return (
                <li key={battletag} className={`remove-player__item${hasFailed ? ' remove-player__item--failed' : ''}`}>
                    <div className="remove-player__info">
                        <span className="remove-player__tag">{battletag}</span>
                        {hasFailed && (
                            <span className="remove-player__failed-badge"> (FETCH FAILED) </span>
                        )}
                    </div>
                    <div className="remove-player__actions">
              {confirming === battletag ? (
                <>
                  <span className="remove-player__confirm-text">Are you sure?</span>
                  <button
                    className="remove-player__button remove-player__button--confirm"
                    onClick={() => handleRemove(battletag)}
                  >
                    Yes, remove
                  </button>
                  <button
                    className="remove-player__button remove-player__button--cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="remove-player__button remove-player__button--remove"
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