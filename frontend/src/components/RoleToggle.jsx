import styles from './RoleToggle.module.css';

const ROLES = [
  { key: 'all',     label: 'All'     },
  { key: 'tank',    label: 'Tank'    },
  { key: 'damage',  label: 'Damage'  },
  { key: 'support', label: 'Support' },
];

export default function RoleToggle({ selectedRole, onRoleSelect }) {
  return (
    <div className={styles.toggle}>
      {ROLES.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.button}${selectedRole === key ? ` ${styles.buttonActive}` : ''}`}
          onClick={() => onRoleSelect(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}