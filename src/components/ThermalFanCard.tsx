import React from 'react';

interface ThermalFanCardProps {
  cpuTemp: number;
  gpuTemp: number;
  fanCpuRpm: number;
  fanGpuRpm: number;
  fanMode?: 'Auto' | 'Max' | 'Custom';
}

export const ThermalFanCard: React.FC<ThermalFanCardProps> = ({
  cpuTemp,
  gpuTemp,
  fanCpuRpm,
  fanGpuRpm,
  fanMode = 'Auto',
}) => {
  const getTempClass = (temp: number) => {
    if (temp >= 80) return 'temp-hot';
    if (temp >= 65) return 'temp-warm';
    return 'temp-cool';
  };

  const getStatusPill = (temp: number) => {
    if (temp >= 80) return { label: '🔥 Hot', color: 'rgba(255, 51, 102, 0.15)', text: '#ff3366' };
    if (temp >= 65) return { label: '⚠️ Warm', color: 'rgba(255, 184, 0, 0.15)', text: '#ffb800' };
    return { label: '🟢 Cool', color: 'rgba(0, 255, 136, 0.15)', text: '#00ff88' };
  };

  const cpuStatus = getStatusPill(cpuTemp);
  const gpuStatus = getStatusPill(gpuTemp);

  return (
    <div className="stat-card">
      <div className="card-header">
        <div className="header-left">
          <span className="card-icon" role="img" aria-label="cooling">🌀</span>
          <div>
            <h3>Thermals & Fans</h3>
            <p className="card-subtitle">NitroSense Cooling Deck</p>
          </div>
        </div>
        <span className="badge">MODE: {fanMode}</span>
      </div>

      <div className="cooling-deck">
        {/* Dual Core Temperatures */}
        <div className="thermals-row">
          <div className="thermal-box">
            <span className="thermal-tag">CPU TEMP</span>
            <span className={`thermal-reading ${getTempClass(cpuTemp)}`}>
              {cpuTemp.toFixed(1)}°C
            </span>
            <span
              className="status-pill"
              style={{ backgroundColor: cpuStatus.color, color: cpuStatus.text }}
            >
              {cpuStatus.label}
            </span>
          </div>

          <div className="thermal-box">
            <span className="thermal-tag">GPU TEMP</span>
            <span className={`thermal-reading ${getTempClass(gpuTemp)}`}>
              {gpuTemp.toFixed(1)}°C
            </span>
            <span
              className="status-pill"
              style={{ backgroundColor: gpuStatus.color, color: gpuStatus.text }}
            >
              {gpuStatus.label}
            </span>
          </div>
        </div>

        {/* Dual Cooling Fan RPM Speeds */}
        <div className="fans-row">
          <div className="fan-box">
            <span className="fan-icon-spin" role="img" aria-label="fan">🌀</span>
            <div className="fan-meta">
              <span className="fan-label">CPU FAN</span>
              <span className="fan-rpm">{fanCpuRpm} <small style={{ fontSize: 10, color: 'var(--text-secondary)' }}>RPM</small></span>
            </div>
          </div>

          <div className="fan-box">
            <span className="fan-icon-spin" role="img" aria-label="fan">🌀</span>
            <div className="fan-meta">
              <span className="fan-label">GPU FAN</span>
              <span className="fan-rpm">{fanGpuRpm} <small style={{ fontSize: 10, color: 'var(--text-secondary)' }}>RPM</small></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
