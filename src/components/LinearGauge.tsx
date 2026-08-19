import React from 'react';

interface LinearGaugeProps {
  value: number;
  max?: number;
  unit?: string;
  showPercentage?: boolean;
  colorScheme?: 'cyan' | 'purple' | 'emerald' | 'dynamic';
}

export const LinearGauge: React.FC<LinearGaugeProps> = ({
  value,
  max = 100,
  showPercentage = true,
  colorScheme = 'dynamic',
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const getBarColor = () => {
    if (colorScheme === 'cyan') return 'var(--accent-cyan)';
    if (colorScheme === 'purple') return 'var(--accent-purple)';
    if (colorScheme === 'emerald') return 'var(--accent-emerald)';
    if (pct >= 85) return 'var(--accent-danger)';
    if (pct >= 65) return 'var(--accent-warning)';
    return 'var(--accent-cyan)';
  };

  const barColor = getBarColor();

  return (
    <div className="linear-gauge-container">
      <div className="linear-gauge-track">
        <div
          className="linear-gauge-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
            boxShadow: `0 0 12px ${barColor}66`,
          }}
        />
      </div>
      {showPercentage && (
        <div className="linear-gauge-footer">
          <span className="linear-gauge-status" style={{ color: barColor }}>
            {pct >= 85 ? 'High Load' : pct >= 60 ? 'Moderate' : 'Normal'}
          </span>
          <span className="linear-gauge-num font-mono">{pct.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};
