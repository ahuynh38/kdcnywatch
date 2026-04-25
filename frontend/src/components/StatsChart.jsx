import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import styles from './StatsChart.module.css';

const BAR_DEFAULT = '#4A90D9';

// ─── Stat metadata (mirrored from StatsTable) ─────────────────────────────────

const STAT_META = {
  eliminations: { label: 'Elims/10',     source: 'general', path: 'average' },
  assists:      { label: 'Assists/10',   source: 'general', path: 'average' },
  deaths:       { label: 'Deaths/10',    source: 'general', path: 'average' },
  damage:       { label: 'Damage/10',    source: 'general', path: 'average' },
  healing:      { label: 'Healing/10',   source: 'general', path: 'average' },
  kda:          { label: 'KDA',          source: 'general', path: null      },
  winrate:      { label: 'Winrate %',    source: 'general', path: null      },
  games_played: { label: 'Games Played', source: 'general', path: null      },
};

// ─── Helper: format tooltip values ───────────────────────────────────────────

function formatValue(value, key) {
  if (key === 'winrate') return `${value.toFixed(1)}%`;
  if (key === 'damage' || key === 'healing') return value.toLocaleString();
  if (key === 'games_played') return value.toLocaleString();
  return value.toFixed(2);
}

// ─── Component ────────────────────────────────────────────────────────────────

function CustomXTick({ x, y, payload, stats }) {
    const player = Object.values(stats).find(p => p.username === payload.value);
    if (!player) return null;

    const size = 36;
    const estimatedTextWidth = payload.value.length * 7.5;
    const totalWidth = size + 6 + estimatedTextWidth;

    return (
        <g transform={`translate(${x - totalWidth / 2 + size / 2},${y})`}>
          <clipPath id={`clip-${payload.value}`}>
            <circle cx={0} cy={size / 2 + 8} r={size / 2} />
          </clipPath>
          <image
            href={player.avatar}
            x={-size / 2}
            y={8}
            width={size}
            height={size}
            clipPath={`url(#clip-${payload.value})`}
            preserveAspectRatio="xMidYMid slice"
          />
          <text
            x={size / 2 + 6}
            y={size / 2 + 14}
            textAnchor="start"
            fontSize={13}
            fill="#e8eaf0"
          >
            {payload.value}
          </text>
        </g>
    );
}

export default function StatsChart({ stats, selectedStat, selectedRole }) {
  const { source, path, label } = STAT_META[selectedStat];

  const data = Object.entries(stats).map(([battletag, player]) => {
    const base = getSource(player);
    const value = (path ? base?.[path]?.[selectedStat] : base?.[selectedStat]) ?? 0;

    return {
      name: player.username,
      value,
    };
  });

  function getSource(player) {
    return selectedRole === 'all' ? player.general : player.roles?.[selectedRole];
  }

  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>{label} — Player Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
          <XAxis
            dataKey="name"
            tick={<CustomXTick stats={stats} />}
            interval={0}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => formatValue(value, selectedStat)}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            labelStyle={{ color: '#0f1117'}}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={BAR_DEFAULT}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => formatValue(value, selectedStat)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}