import React from 'react';

interface ThermalFanCardProps {
  cpuTemp: number | null;
  gpuTemp: number | null;
  fanCpuRpm: number | null;
  fanGpuRpm: number | null;
  fanMode: 'Auto' | 'Max' | 'Custom';
}

export const ThermalFanCard: React.FC<ThermalFanCardProps> = ({
  cpuTemp,
  gpuTemp,
  fanCpuRpm,
  fanGpuRpm,
  fanMode,
}) => {
  const getTempColor = (t: number | null) => {
    if (!t) return 'var(--text-muted)';
    if (t >= 80) return 'var(--accent-danger)';
    if (t >= 68) return 'var(--accent-warning)';
    return 'var(--accent-emerald)';
  };

  return (
    <div className="telemetry-card card-thermals-fans">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">🌀</span>
          <div>
            <h3>Thermals & Fans</h3>
            <span className="card-subtitle">NitroSense Cooling Deck</span>
          </div>
        </div>
        <div className="fan-mode-badge font-mono">
          MODE: <span className="text-cyan">{fanMode}</span>
        </div>
      </div>

      <div className="thermals-fans-grid">
        {/* Dual Temperature Meters */}
        <div className="thermal-duo-container">
          <div className="thermal-stat-box">
            <span className="stat-label">CPU TEMP</span>
            <div className="thermal-readout font-mono" style={{ color: getTempColor(cpuTemp) }}>
              {cpuTemp ? `${cpuTemp.toFixed(1)}°C` : 'N/A'}
            </div>
            <span className="thermal-status-pill">
              {cpuTemp && cpuTemp < 65 ? '🟢 Cool' : cpuTemp && cpuTemp < 80 ? '🟡 Warm' : '🔴 Hot'}
            </span>
          </div>

          <div className="thermal-stat-divider" />

          <div className="thermal-stat-box">
            <span className="stat-label">GPU TEMP</span>
            <div className="thermal-readout font-mono" style={{ color: getTempColor(gpuTemp) }}>
              {gpuTemp ? `${gpuTemp.toFixed(1)}°C` : 'N/A'}
            </div>
            <span className="thermal-status-pill">
              {gpuTemp && gpuTemp < 65 ? '🟢 Cool' : gpuTemp && gpuTemp < 80 ? '🟡 Warm' : '🔴 Hot'}
            </span>
          </div>
        </div>

        {/* Dual Fan Dials */}
        <div className="fan-rpm-duo">
          <div className="fan-rpm-dial">
            <div className="fan-icon-anim spin-fan">🌀</div>
            <div className="fan-details">
              <span className="fan-name">CPU FAN</span>
              <span className="fan-speed font-mono text-cyan">
                {fanCpuRpm ? `${fanCpuRpm} RPM` : 'Auto'}
              </span>
            </div>
          </div>

          <div className="fan-rpm-dial">
            <div className="fan-icon-anim spin-fan">🌀</div>
            <div className="fan-details">
              <span className="fan-name">GPU FAN</span>
              <span className="fan-speed font-mono text-purple">
                {fanGpuRpm ? `${fanGpuRpm} RPM` : 'Auto'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
