import { usePlayerStats } from './hooks/usePlayerStats.js';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const { stats, loading, error } = usePlayerStats();

  if (loading) return <p>Loading...This could take up to one minute...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Dashboard />
    </div>
  );
}