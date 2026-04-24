import PlayerCard from './PlayerCard.jsx';
import styles from './PlayerGrid.module.css';

export default function PlayerGrid({ stats }) {
  const players = Object.entries(stats);

  if (players.length === 0) {
    return <p className={styles.empty}>No players found. Add some players to get started.</p>;
  }

  return (
    <div className={styles.grid}>
      {players.map(([battletag, player]) => (
        <PlayerCard key={battletag} player={player} />
      ))}
    </div>
  );
}