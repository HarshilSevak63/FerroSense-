import React from 'react';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
  min?: number;
  max?: number;
  filled?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  height = 36,
  width = 140,
  color = 'var(--accent-primary, #00f0ff)',
  min = 0,
  max = 100,
  filled = true,
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="sparkline-placeholder" />;
  }

  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const clamped = Math.max(min, Math.min(max, val));
    const normalizedY = height - ((clamped - min) / range) * (height - 6) - 3;
    const x = idx * stepX;
    return { x, y: normalizedY };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const gradId = `spark-grad-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <svg width={width} height={height} className="sparkline-svg" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {filled && <path d={areaD} fill={`url(#${gradId})`} />}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="3"
          fill={color}
          className="sparkline-pulse-dot"
        />
      )}
    </svg>
  );
};
