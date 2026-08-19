import React from 'react';

export interface BatteryGaugeProps {
  battery_pct: number | null;
  is_charging: boolean | null;
  is_laptop: boolean;
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({
  battery_pct,
  is_charging,
  is_laptop,
}) => {
  if (!is_laptop || battery_pct === null) {
    return (
      <div className="battery-desktop-fallback">
        <span className="power-icon">🔌</span>
        <div className="power-meta">
          <span className="power-status-title">Desktop AC Power</span>
          <span className="power-status-sub">Continuous Line Input</span>
        </div>
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, battery_pct));
  const getBatteryColor = (level: number) => {
    if (level <= 15) return '#ff3366';
    if (level <= 30) return '#ffb800';
    return '#00ff88';
  };

  const barColor = getBatteryColor(pct);

  return (
    <div className="battery-gauge-container">
      <div className="battery-visual-row">
        {/* Battery Cell Shell */}
        <div className="battery-cell-outer">
          <div className="battery-terminal" />
          <div className="battery-cell-inner">
            <div
              className="battery-cell-fill"
              style={{
                width: `${pct}%`,
                backgroundColor: barColor,
                boxShadow: `0 0 10px ${barColor}`,
              }}
            />
            {is_charging && <span className="charging-bolt">⚡</span>}
          </div>
        </div>

        <div className="battery-numeric-readout">
          <span className="battery-pct-big" style={{ color: barColor }}>
            {pct}%
          </span>
        </div>
      </div>

      <div className={`battery-status-badge ${is_charging ? 'status-charging' : 'status-discharging'}`}>
        <span className="battery-dot" />
        <span>{is_charging ? '⚡ AC Connected (Charging)' : '🔋 On Battery Power'}</span>
      </div>
    </div>
  );
};
