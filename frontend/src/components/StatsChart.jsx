import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useState, useEffect } from 'react';
import styles from './StatsChart.module.css';

const BAR_DEFAULT = '#4A90D9';

// ─── Stat metadata (mirrored from StatsTable) ─────────────────────────────────

const STAT_META = {
  eliminations: { averageLabel: 'Elims/10',     totalLabel: 'Elims',        hasTotal: true,  source: 'general' },
  assists:      { averageLabel: 'Assists/10',   totalLabel: 'Assists',      hasTotal: true,  source: 'general' },
  deaths:       { averageLabel: 'Deaths/10',    totalLabel: 'Deaths',       hasTotal: true,  source: 'general' },
  damage:       { averageLabel: 'Damage/10',    totalLabel: 'Damage',       hasTotal: true,  source: 'general' },
  healing:      { averageLabel: 'Healing/10',   totalLabel: 'Healing',      hasTotal: true,  source: 'general' },
  kda:          { averageLabel: 'KDA',          totalLabel: 'KDA',          hasTotal: false, source: 'general' },
  winrate:      { averageLabel: 'Winrate %',    totalLabel: 'Winrate %',    hasTotal: false, source: 'general' },
  games_played: { averageLabel: 'Games Played', totalLabel: 'Games Played', hasTotal: false, source: 'general' },
  time_played:  { averageLabel: 'Time Played',  totalLabel: 'Time Played',  hasTotal: false, source: 'general' },
};

// ─── Helper: format tooltip values ───────────────────────────────────────────

function formatValue(value, key) {
  if (key === 'winrate') return `${value.toFixed(1)}%`;
  if (key === 'damage' || key === 'healing' || key === 'games_played') return value.toLocaleString();
  if (key === 'kda') return value.toFixed(2);
  if (key === 'time_played') return `${(value / 3600).toFixed(2)} hrs`;
  return value.toLocaleString();
}

// ─── Component ────────────────────────────────────────────────────────────────

// Optimize width for mobile vs. desktop screens
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function CustomXTick({ x, y, payload, stats, compact }) {
    const player = Object.values(stats).find(p => p.username === payload.value);
    if (!player) return null;

    const size = 36;
    const estimatedTextWidth = payload.value.length * 7.5;
    const totalWidth = compact ? size : size + 6 + estimatedTextWidth;

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
          {!compact && (
            <text
              x={size / 2 + 6}
              y={size / 2 + 14}
              textAnchor="start"
              fontSize={13}
              fill="#e8eaf0"
            >
              {payload.value}
            </text>
          )}
        </g>
    );
}

export default function StatsChart({ stats, selectedStat, selectedRole, selectedView }) {
  const { averageLabel, totalLabel, hasTotal } = STAT_META[selectedStat];
  const path = hasTotal ? selectedView : null;
  const label = selectedView === 'average' ? averageLabel : totalLabel;

  // To help with handling mobile screens
  const windowWidth = useWindowWidth();
  const isCompact = windowWidth < 640;

  function getSource(player) {
    return selectedRole === 'all' ? player.general : player.roles?.[selectedRole];
  }

  const data = Object.entries(stats).map(([battletag, player]) => {
    const base = getSource(player);
    const value = (path ? base?.[path]?.[selectedStat] : base?.[selectedStat]) ?? 0;

    return {
      name: player.username,
      value,
    };
  });

  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>{label} — Player Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
          <XAxis
            dataKey="name"
            tick={<CustomXTick stats={stats} compact={isCompact} />}
            interval={0}
          />
          <YAxis hide={isCompact} />
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