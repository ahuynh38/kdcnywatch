import styles from './StatsTable.module.css';

// ─── Stat definitions ─────────────────────────────────────────────────────────

const STATS = [
  { key: 'eliminations', averageLabel: 'Elims/10',    totalLabel: 'Elims',    hasTotal: true,  higherIsBetter: true  },
  { key: 'assists',      averageLabel: 'Assists/10',  totalLabel: 'Assists',  hasTotal: true,  higherIsBetter: true  },
  { key: 'deaths',       averageLabel: 'Deaths/10',   totalLabel: 'Deaths',   hasTotal: true,  higherIsBetter: false },
  { key: 'damage',       averageLabel: 'Damage/10',   totalLabel: 'Damage',   hasTotal: true,  higherIsBetter: true  },
  { key: 'healing',      averageLabel: 'Healing/10',  totalLabel: 'Healing',  hasTotal: true,  higherIsBetter: true  },
  { key: 'kda',          averageLabel: 'KDA',         totalLabel: 'KDA',      hasTotal: false, higherIsBetter: true  },
  { key: 'winrate',      averageLabel: 'Winrate %',   totalLabel: 'Winrate %',hasTotal: false, higherIsBetter: true  },
  { key: 'games_played', averageLabel: 'Games Played',totalLabel: 'Games Played', hasTotal: false, higherIsBetter: true },
];

// ─── Helper: find the best value index in a row ───────────────────────────────

function getBestIndex(values, higherIsBetter) {
  if (values.every(v => v === null || v === undefined)) return -1;

  return values.reduce((bestIdx, val, idx) => {
    if (val === null || val === undefined) return bestIdx;
    if (bestIdx === -1) return idx;
    return higherIsBetter
      ? val > values[bestIdx] ? idx : bestIdx
      : val < values[bestIdx] ? idx : bestIdx;
  }, -1);
}

// ─── Helper: format a stat value for display ──────────────────────────────────

function formatValue(value, key) {
  if (value === null || value === undefined) return '0';
  if (key === 'winrate') return `${value.toFixed(1)}%`;
  if (key === 'damage' || key === 'healing' || key === 'games_played') return value.toLocaleString();
  if (key === 'kda') return value.toFixed(2);
  return value.toLocaleString();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatsTable({ stats, selectedStat, onStatSelect, selectedRole, selectedView }) {
  const entries = Object.entries(stats);
  const battletags = entries.map(([tag]) => tag);
  const players = entries.map(([, player]) => player);

  function getSource(player) {
    return selectedRole === 'all' ? player.general : player.roles?.[selectedRole];
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Stat</th>
            {players.map((player, idx) => (
              <th key={battletags[idx]} className={styles.playerCol}>
                {player.username}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STATS.map(({ key, averageLabel, totalLabel, hasTotal, higherIsBetter }) => {
            const path = hasTotal ? selectedView : null;
            const label = selectedView === 'average' ? averageLabel : totalLabel;
            const values = players.map(player => {
                const base = getSource(player);
                return (path ? base?.[path]?.[key] : base?.[key]) ?? 0;
            });
            const bestIdx = getBestIndex(values, higherIsBetter);

            return (
              <tr
                key={key}
                className={`${styles.row}${key === selectedStat ? ` ${styles.rowSelected}` : '' }`}
                onClick={() => onStatSelect(key)}
              >
                <td className={styles.label}>{label}</td>
                {values.map((value, idx) => (
                  <td
                    key={battletags[idx]}
                    className={`${styles.value}${idx === bestIdx ? ` ${styles.valueBest}` : '' }`}
                  >
                    {formatValue(value, key)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}