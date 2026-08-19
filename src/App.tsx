import React from 'react';
import { useSystemStats } from './hooks/useSystemStats';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  const { stats, loading, error, lastUpdated, isTick, refreshNow } = useSystemStats(1500);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">⚡</span>
          <div>
            <span className="brand-title">FerroSense</span>
            <span className="brand-tag ml-2">POC v0.1</span>
          </div>
        </div>

        <div className="header-telemetry-status">
          <div className="pulse-indicator">
            <span className={`pulse-dot ${isTick ? 'ticking' : ''}`} />
            <span>Live (1.5s)</span>
          </div>
          <span className="last-updated font-mono text-muted" style={{ fontSize: '11px' }}>
            {lastUpdated.toLocaleTimeString()}
          </span>
          <button className="refresh-btn" onClick={refreshNow} title="Force Instant Refresh">
            🔄 Refresh
          </button>
        </div>
      </header>

      <main>
        {error ? (
          <div className="dashboard-error">
            <p>⚠️ Telemetry Connection Error: {error}</p>
            <button className="refresh-btn" onClick={refreshNow}>Retry Connection</button>
          </div>
        ) : (
          <Dashboard stats={stats} loading={loading} />
        )}
      </main>
    </div>
  );
};

export default App;
