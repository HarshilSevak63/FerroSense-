import { useState, useEffect } from 'react';
import { useSystemStats } from './hooks/useSystemStats';
import { Dashboard } from './components/Dashboard';
import { CompactOverlay } from './components/CompactOverlay';
import { ThemeSelector } from './components/ThemeSelector';
import { THEMES, ThemeId } from './types/theme';

export function App() {
  const { stats, loading, error, lastUpdated, cpuHistory, gpuHistory, refreshNow } = useSystemStats(1500);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('cyan');
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);

  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', theme.primary);
    root.style.setProperty('--accent-secondary', theme.secondary);
    root.style.setProperty('--accent-glow', theme.glow);
    root.style.setProperty('--accent-gradient', theme.gradient);
    root.style.setProperty('--card-border-glow', theme.cardBorderGlow);
    root.style.setProperty('--badge-bg', theme.badgeBg);
    root.style.setProperty('--accent-text', theme.accentText);
  }, [currentTheme]);

  if (isCompactMode) {
    return (
      <div className="compact-app-shell">
        <CompactOverlay
          stats={stats}
          cpuHistory={cpuHistory}
          gpuHistory={gpuHistory}
          onToggleFullMode={() => setIsCompactMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-glow">⚡</div>
          <div className="brand-text">
            <h1>FerroSense</h1>
            <span className="app-badge">POC V0.1</span>
          </div>
        </div>

        {/* Theme Picker */}
        <ThemeSelector currentTheme={currentTheme} onSelectTheme={setCurrentTheme} />

        {/* Header Right Actions */}
        <div className="header-status">
          <div className="live-indicator">
            <span className="pulsing-dot" />
            <span className="live-text">Live (1.5s)</span>
          </div>
          <span className="live-clock">
            {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>

          <button
            onClick={() => setIsCompactMode(true)}
            className="overlay-mode-toggle-btn"
            title="Switch to Compact Floating Mini-HUD Overlay"
          >
            📌 Overlay Mode
          </button>

          <button onClick={refreshNow} className="refresh-btn" title="Force refresh stats">
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {loading && !stats ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Probing hardware telemetry...</p>
          </div>
        ) : error && !stats ? (
          <div className="error-state">
            <p>⚠️ {error}</p>
          </div>
        ) : stats ? (
          <Dashboard stats={stats} cpuHistory={cpuHistory} gpuHistory={gpuHistory} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
