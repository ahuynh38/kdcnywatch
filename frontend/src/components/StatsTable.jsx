import styles from './StatsTable.module.css';

// ─── Stat definitions ─────────────────────────────────────────────────────────

const STATS = [
  { key: 'eliminations', label: 'Elims/10',    source: 'general', path: 'average', higherIsBetter: true  },
  { key: 'assists',      label: 'Assists/10',  source: 'general', path: 'average', higherIsBetter: true  },
  { key: 'deaths',       label: 'Deaths/10',   source: 'general', path: 'average', higherIsBetter: false },
  { key: 'damage',       label: 'Damage/10',   source: 'general', path: 'average', higherIsBetter: true  },
  { key: 'healing',      label: 'Healing/10',  source: 'general', path: 'average', higherIsBetter: true  },
  { key: 'kda',          label: 'KDA',         source: 'general', path: null,    higherIsBetter: true  },
  { key: 'winrate',      label: 'Winrate %',   source: 'general', path: null,    higherIsBetter: true  },
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
  if (key === 'damage' || key === 'healing') return value.toLocaleString();
  return value.toFixed(2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatsTable({ stats, selectedStat, onStatSelect }) {
  const entries = Object.entries(stats);
  const battletags = entries.map(([tag]) => tag);
  const players = entries.map(([, player]) => player);

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
          {STATS.map(({ key, label, source, path, higherIsBetter }) => {
            const values = players.map(player => {
                const base = player[source];
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