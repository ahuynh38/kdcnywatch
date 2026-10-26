import { useState, useCallback, useLayoutEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import styles from './StatsTable.module.css';

// Column dragging is a desktop-only feature — touch devices keep the static table
const CAN_DRAG = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ─── Stat definitions ─────────────────────────────────────────────────────────

const STATS = [
  { key: 'eliminations', averageLabel: 'Elims/10',     totalLabel: 'Elims',        hasTotal: true,  higherIsBetter: true },
  { key: 'assists',      averageLabel: 'Assists/10',   totalLabel: 'Assists',      hasTotal: true,  higherIsBetter: true },
  { key: 'deaths',       averageLabel: 'Deaths/10',    totalLabel: 'Deaths',       hasTotal: true,  higherIsBetter: false},
  { key: 'damage',       averageLabel: 'Damage/10',    totalLabel: 'Damage',       hasTotal: true,  higherIsBetter: true },
  { key: 'healing',      averageLabel: 'Healing/10',   totalLabel: 'Healing',      hasTotal: true,  higherIsBetter: true },
  { key: 'kda',          averageLabel: 'KDA',          totalLabel: 'KDA',          hasTotal: false, higherIsBetter: true },
  { key: 'winrate',      averageLabel: 'Winrate %',    totalLabel: 'Winrate %',    hasTotal: false, higherIsBetter: true },
  { key: 'games_played', averageLabel: 'Games Played', totalLabel: 'Games Played', hasTotal: false, higherIsBetter: true },
  { key: 'time_played',  averageLabel: 'Time Played',  totalLabel: 'Time Played',  hasTotal: false, higherIsBetter: true },
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
  if (key === 'time_played') return `${(value / 3600).toFixed(2)} hrs`;
  return value.toLocaleString();
}

// ─── Helper: style for a column that is moving during a drag ─────────────────
// Shared by the header and every body cell so the whole column moves together

function getColumnStyle(motion) {
  if (!motion) return undefined;
  return {
    transform: motion.x ? `translate3d(${motion.x}px, 0, 0)` : undefined,
    transition: motion.transition,
  };
}

// ─── Draggable player header ──────────────────────────────────────────────────
// Owns the sortable item and reports its horizontal offset up to the table,
// since dnd-kit only tracks the header cell and not the body cells below it

function SortablePlayerHeader({ tag, username, onMotionChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tag,
    disabled: !CAN_DRAG,
  });
  const x = transform?.x ?? 0;

  useLayoutEffect(() => {
    onMotionChange(tag, { x, transition, isDragging });
  }, [tag, x, transition, isDragging, onMotionChange]);

  return (
    <th
      ref={setNodeRef}
      style={getColumnStyle({ x, transition })}
      className={`${styles.playerCol}${CAN_DRAG ? ` ${styles.draggable}` : ''}${isDragging ? ` ${styles.dragging}` : ''}`}
      {...attributes}
      {...listeners}
    >
      {username}
    </th>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatsTable({ stats, playerOrder, onReorder, selectedStat, onStatSelect, selectedRole, selectedView }) {
  const battletags = playerOrder;
  const players = battletags.map(tag => stats[tag]);

  // Per-column drag offsets, keyed by battletag
  const [columnMotion, setColumnMotion] = useState({});

  const handleMotionChange = useCallback((tag, motion) => {
    setColumnMotion(prev => {
      const current = prev[tag];
      if (current && current.x === motion.x && current.transition === motion.transition && current.isDragging === motion.isDragging) {
        return prev;
      }
      return { ...prev, [tag]: motion };
    });
  }, []);

  const sensors = useSensors(
    // Small distance threshold so a plain click on a header doesn't start a drag
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    onReorder(active.id, over.id);
  }

  function getSource(player) {
    return selectedRole === 'all' ? player.general : player.roles?.[selectedRole];
  }

  function getCellClass(tag, baseClass) {
    return `${baseClass}${columnMotion[tag]?.isDragging ? ` ${styles.dragging}` : ''}`;
  }

  return (
    <div className={styles.wrapper}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Stat</th>
            <SortableContext items={battletags} strategy={horizontalListSortingStrategy}>
              {players.map((player, idx) => (
                <SortablePlayerHeader
                  key={battletags[idx]}
                  tag={battletags[idx]}
                  username={player.username}
                  onMotionChange={handleMotionChange}
                />
              ))}
            </SortableContext>
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
                    style={getColumnStyle(columnMotion[battletags[idx]])}
                    className={getCellClass(battletags[idx], `${styles.value}${idx === bestIdx ? ` ${styles.valueBest}` : '' }`)}
                  >
                    {formatValue(value, key)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </DndContext>
    </div>
  );
}