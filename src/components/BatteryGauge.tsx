import React from 'react';

interface BatteryGaugeProps {
  batteryPct: number | null;
  isCharging: boolean | null;
  isLaptop: boolean;
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({
  batteryPct,
  isCharging,
  isLaptop,
}) => {
  if (!isLaptop || batteryPct === null) {
    return (
      <div className="battery-desktop-fallback">
        <div className="desktop-icon-badge">🖥️</div>
        <div className="desktop-fallback-info">
          <h4>Desktop / AC Station</h4>
          <p>No internal battery detected. Direct wall power active.</p>
        </div>
      </div>
    );
  }

  const clampedPct = Math.min(100, Math.max(0, batteryPct));
  const getBatteryColor = (pct: number) => {
    if (pct <= 20) return 'var(--accent-danger)';
    if (pct <= 40) return 'var(--accent-warning)';
    return 'var(--accent-emerald)';
  };

  const batteryColor = getBatteryColor(clampedPct);

  return (
    <div className="battery-gauge-card">
      <div className="battery-header-row">
        <div className="battery-visual-shell">
          <div
            className="battery-visual-level"
            style={{
              width: `${clampedPct}%`,
              backgroundColor: batteryColor,
              boxShadow: `0 0 10px ${batteryColor}88`,
            }}
          />
          <div className="battery-visual-terminal" />
          {isCharging && <span className="battery-lightning">⚡</span>}
        </div>
        <div className="battery-pct-display font-mono" style={{ color: batteryColor }}>
          {clampedPct.toFixed(0)}%
        </div>
      </div>

      <div className="battery-state-pill" style={{ borderColor: `${batteryColor}44` }}>
        <span className="state-indicator-dot" style={{ backgroundColor: batteryColor }} />
        <span className="state-text">
          {isCharging ? '⚡ AC Connected (Charging)' : '🔋 Discharging (On Battery)'}
        </span>
      </div>
    </div>
  );
};
