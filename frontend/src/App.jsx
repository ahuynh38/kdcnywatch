import { usePlayerStats } from './hooks/usePlayerStats.js';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const playerStats = usePlayerStats();
  const { loading, error } = playerStats;

  if (loading) return <p>Loading...This could take up to one minute...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Dashboard {...playerStats} />
    </div>
  );
}