import styles from './RoleToggle.module.css'; // Reusing RoleToggle button styles

const VIEWS = [
  { key: 'average', label: 'Average' },
  { key: 'total',   label: 'Total'   },
];

export default function ViewToggle({ selectedView, onViewSelect }) {
  return (
    <div className={styles.toggle}>
      {VIEWS.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.button}${selectedView === key ? ` ${styles.buttonActive}` : ''}`}
          onClick={() => onViewSelect(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}