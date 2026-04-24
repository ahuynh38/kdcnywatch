import PlayerCard from './PlayerCard.jsx';

export default function PlayerGrid({ stats }) {
  const players = Object.entries(stats);

  if (players.length === 0) {
    return <p className="player-grid__empty">No players found. Add some players to get started.</p>;
  }

  return (
    <div className="player-grid">
      {players.map(([battletag, player]) => (
        <PlayerCard key={battletag} player={player} />
      ))}
    </div>
  );
}