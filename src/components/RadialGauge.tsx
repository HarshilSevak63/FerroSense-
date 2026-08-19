import React from 'react';

export interface RadialGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  unit?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  size = 180,
  strokeWidth = 14,
  label = 'LOAD',
  sublabel,
  unit = '%',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270 degree arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, value))) / 100;

  const getColor = (v: number) => {
    if (v >= 85) return 'var(--accent-danger, #ff3366)';
    if (v >= 65) return 'var(--accent-warning, #ffb800)';
    return 'var(--accent-primary, #00f0ff)';
  };

  const currentColor = getColor(value);

  return (
    <div className="radial-gauge-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radial-gauge-svg">
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />

        {/* Progress Arc */}
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
          filter="url(#gauge-glow)"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>

      {/* Center Value Display */}
      <div className="gauge-center-content">
        <div className="gauge-value-row">
          <span className="gauge-number" style={{ color: currentColor }}>
            {value.toFixed(1)}
          </span>
          <span className="gauge-unit">{unit}</span>
        </div>
        <span className="gauge-label">{label}</span>
        {sublabel && <span className="gauge-sublabel">{sublabel}</span>}
      </div>
    </div>
  );
};
