import React from 'react';
import { RadialGauge } from './RadialGauge';
import { LinearGauge } from './LinearGauge';

interface GpuCardProps {
  hasGpu: boolean;
  gpuName: string | null;
  gpuUsage: number | null;
  gpuTemp: number | null;
  vramUsedGb: number | null;
  vramTotalGb: number | null;
}

export const GpuCard: React.FC<GpuCardProps> = ({
  hasGpu,
  gpuName,
  gpuUsage,
  gpuTemp,
  vramUsedGb,
  vramTotalGb,
}) => {
  if (!hasGpu || gpuUsage === null) {
    return (
      <div className="telemetry-card card-gpu">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-icon">🎮</span>
            <div>
              <h3>Dedicated GPU</h3>
              <span className="card-subtitle">Integrated Graphics Only</span>
            </div>
          </div>
          <span className="card-tag">GPU</span>
        </div>
        <div className="gpu-fallback-body">
          <p>No dedicated discrete GPU detected. Using CPU integrated graphics.</p>
        </div>
      </div>
    );
  }

  const vramPct = vramTotalGb && vramUsedGb ? (vramUsedGb / vramTotalGb) * 100 : 0;
  const getTempClass = (t: number) => (t >= 80 ? 'temp-danger' : t >= 68 ? 'temp-warning' : 'temp-normal');

  return (
    <div className="telemetry-card card-gpu">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">🎮</span>
          <div>
            <h3>Graphics (GPU)</h3>
            <span className="card-subtitle">{gpuName || 'Discrete GPU'}</span>
          </div>
        </div>
        <div className="card-header-badges">
          {gpuTemp !== null && (
            <span className={`temp-badge ${getTempClass(gpuTemp)}`}>
              🌡️ {gpuTemp.toFixed(0)}°C
            </span>
          )}
          <span className="card-tag">GPU</span>
        </div>
      </div>

      <div className="card-body-radial">
        <RadialGauge
          value={gpuUsage}
          label="GPU LOAD"
          subLabel={gpuTemp ? `${gpuTemp}°C Core` : undefined}
        />
      </div>

      {vramTotalGb && vramUsedGb !== null && (
        <div className="vram-section">
          <div className="vram-header">
            <span>VRAM Video Memory:</span>
            <strong className="font-mono">{vramUsedGb.toFixed(2)} / {vramTotalGb.toFixed(1)} GB</strong>
          </div>
          <LinearGauge value={vramPct} max={100} showPercentage={false} colorScheme="purple" />
        </div>
      )}
    </div>
  );
};
