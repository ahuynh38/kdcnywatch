import { getBestRanks } from '../utils/rankUtils.js';
import styles from './PlayerCard.module.css';

const ROLES = ['tank', 'damage', 'support', 'open'];

const ROLE_LABELS = {
  tank:    'Tank',
  damage:  'Damage',
  support: 'Support',
  open:    'Open',
};

const ROLE_ICONS = {
  tank:    'https://static.playoverwatch.com/img/pages/career/icons/role/tank-f64702b684.svg#icon',
  damage:  'https://static.playoverwatch.com/img/pages/career/icons/role/offense-ab1756f419.svg#icon',
  support: 'https://static.playoverwatch.com/img/pages/career/icons/role/support-0258e13d85.svg#icon',
};

function getMostPlayedRole(roles) {
  if (!roles) return null;
  return ['tank', 'damage', 'support'].reduce((best, role) => {
    const games = roles[role]?.games_played ?? 0;
    const bestGames = roles[best]?.games_played ?? 0;
    return games > bestGames ? role : best;
  }, 'tank');
}

export default function PlayerCard({ player }) {
  const ranks = getBestRanks(player.competitive);
  const mostPlayedRole = getMostPlayedRole(player.roles);

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
          <div className={styles.usernameRow}>
            <h2 className={styles.username}>{player.username}</h2>
            {mostPlayedRole && (
              // for overwatch official role icons
              <img
                className={styles.roleBadgeIcon}
                src={ROLE_ICONS[mostPlayedRole]}
                alt={mostPlayedRole}
                title={`Most played: ${mostPlayedRole}`}
              />
              // FOR CUSTOM BADGE -- uncomment badge styles in this guy's .css to re-enable
              // <span className={`${styles.roleBadge} ${styles[`roleBadge_${mostPlayedRole}`]}`}>
              //   {mostPlayedRole}
              // </span>
            )}
          </div>
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