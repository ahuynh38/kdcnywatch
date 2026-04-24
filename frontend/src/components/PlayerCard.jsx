import { getBestRanks } from '../utils/rankUtils.js';
import styles from './PlayerCard.module.css';

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
    <div className={styles.card}>

      {/* ── Avatar + Identity ── */}
      <div className={styles.header}>
        <img
          className={styles.avatar}
          src={player.avatar}
          alt={`${player.username} avatar`}
        />
        <div className={styles.identity}>
          <h2 className={styles.username}>{player.username}</h2>
          {player.title && (
            <p className={styles.title}>{player.title}</p>
          )}
        </div>
      </div>

      {/* ── Ranks ── */}
      <div className={styles.ranks}>
        {ROLES.map((role) => {
          const rank = ranks[role];
          if (!rank) return null;

          return (
            <div key={role} className={styles.rank}>
              <img
                className={styles.rankIcon}
                src={rank.rank_icon}
                alt={`${rank.division} ${rank.tier}`}
                title={`${ROLE_LABELS[role]}: ${rank.division} ${rank.tier}`}
              />
              <span className={styles.rankLabel}>
                {ROLE_LABELS[role]}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}