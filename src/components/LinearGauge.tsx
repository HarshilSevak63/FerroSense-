import React from 'react';

export interface LinearGaugeProps {
  value: number;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
}

export const LinearGauge: React.FC<LinearGaugeProps> = ({
  value,
  label,
  sublabel,
  showValue = true,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const getColorClass = (v: number) => {
    if (v >= 85) return 'linear-danger';
    if (v >= 65) return 'linear-warning';
    return 'linear-primary';
  };

  return (
    <div className="linear-gauge-container">
      {(label || sublabel || showValue) && (
        <div className="linear-gauge-labels">
          <span className="linear-label">{label || ''}</span>
          <span className="linear-sublabel">{sublabel || (showValue ? `${clamped.toFixed(1)}%` : '')}</span>
        </div>
      )}
      <div className="linear-gauge-track">
        <div
          className={`linear-gauge-fill ${getColorClass(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
