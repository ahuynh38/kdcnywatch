import { getBestRanks } from '../utils/rankUtils.js';

const ROLES = ['tank', 'damage', 'support', 'open'];

const ROLE_LABELS = {
  tank:    'Tank',
  damage:  'Damage',
  support: 'Support',
  open:    'Open',
};

export default function PlayerCard({ player }) {
  const ranks = getBestRanks(player.competitive);

  return (
    <div className="player-card">

      {/* ── Avatar + Identity ── */}
      <div className="player-card__header">
        <img
          className="player-card__avatar"
          src={player.avatar}
          alt={`${player.username} avatar`}
        />
        <div className="player-card__identity">
          <h2 className="player-card__username">{player.username}</h2>
          {player.title && (
            <p className="player-card__title">{player.title}</p>
          )}
        </div>
      </div>

      {/* ── Ranks ── */}
      <div className="player-card__ranks">
        {ROLES.map((role) => {
          const rank = ranks[role];
          if (!rank) return null;

          return (
            <div key={role} className="player-card__rank">
              <img
                className="player-card__rank-icon"
                src={rank.rank_icon}
                alt={`${rank.division} ${rank.tier}`}
                title={`${ROLE_LABELS[role]}: ${rank.division} ${rank.tier}`}
              />
              <span className="player-card__rank-label">
                {ROLE_LABELS[role]}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}