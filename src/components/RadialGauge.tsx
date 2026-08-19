import React from 'react';

interface RadialGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  size = 170,
  strokeWidth = 14,
  label = 'CPU LOAD',
  subLabel,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (clampedValue / 100) * arcLength;

  const getColor = (pct: number) => {
    if (pct >= 85) return 'var(--accent-danger)';
    if (pct >= 60) return 'var(--accent-warning)';
    return 'var(--accent-cyan)';
  };

  const currentColor = getColor(clampedValue);

  return (
    <div className="radial-gauge-container" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="radial-gauge-svg"
      >
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-track)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={currentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          filter="url(#gauge-glow)"
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
          }}
        />
      </svg>

      <div className="radial-gauge-center">
        <span className="radial-gauge-value" style={{ color: currentColor }}>
          {clampedValue.toFixed(1)}
          <span className="radial-gauge-percent">%</span>
        </span>
        <span className="radial-gauge-label">{label}</span>
        {subLabel && <span className="radial-gauge-sublabel">{subLabel}</span>}
      </div>
    </div>
  );
};
