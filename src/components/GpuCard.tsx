import React from 'react';
import { RadialGauge } from './RadialGauge';
import { LinearGauge } from './LinearGauge';
import { Sparkline } from './Sparkline';

export interface GpuCardProps {
  has_gpu: boolean;
  gpu_name: string | null;
  gpu_usage: number | null;
  gpu_temp: number | null;
  gpu_vram_used_gb: number | null;
  gpu_vram_total_gb: number | null;
  gpuHistory?: number[];
}

export const GpuCard: React.FC<GpuCardProps> = ({
  has_gpu,
  gpu_name,
  gpu_usage,
  gpu_temp,
  gpu_vram_used_gb,
  gpu_vram_total_gb,
  gpuHistory = [],
}) => {
  if (!has_gpu) {
    return (
      <div className="stat-card">
        <div className="card-header">
          <div className="header-left">
            <span className="card-icon" role="img" aria-label="gpu">🎮</span>
            <div>
              <h3>Graphics (GPU)</h3>
              <p className="card-subtitle">Integrated / Power Saver</p>
            </div>
          </div>
        </div>
        <div className="empty-gpu-state">
          <p>Integrated graphics active.</p>
        </div>
      </div>
    );
  }

  const usageVal = gpu_usage ?? 0;
  const tempVal = gpu_temp ?? 45;
  const vramUsed = gpu_vram_used_gb ?? 0;
  const vramTotal = gpu_vram_total_gb ?? 8;
  const vramPct = vramTotal > 0 ? (vramUsed / vramTotal) * 100 : 0;

  return (
    <div className="stat-card">
      <div className="card-header">
        <div className="header-left">
          <span className="card-icon" role="img" aria-label="gpu">🎮</span>
          <div>
            <h3>Graphics (GPU)</h3>
            <p className="card-subtitle">{gpu_name || 'NVIDIA Dedicated GPU'}</p>
          </div>
        </div>
        <div className="header-right">
          <span className="badge badge-temp">
            <span className="badge-icon">🌡️</span> {tempVal}°C
          </span>
          <span className="badge">GPU</span>
        </div>
      </div>

      <div className="gauge-container">
        <RadialGauge
          value={usageVal}
          unit="%"
          label="GPU LOAD"
          sublabel={`${tempVal}°C Core`}
        />
      </div>

      <div className="sparkline-row">
        <div className="sparkline-label-group">
          <span className="spark-title">GPU USAGE HISTORY</span>
          <span className="spark-curr-val">{usageVal.toFixed(1)}%</span>
        </div>
        <Sparkline data={gpuHistory} width={180} height={28} color="#00e5ff" />
      </div>

      <div className="vram-section">
        <div className="vram-header">
          <span>VRAM Video Memory:</span>
          <span className="vram-values">{vramUsed.toFixed(2)} / {vramTotal.toFixed(1)} GB</span>
        </div>
        <LinearGauge value={vramPct} />
      </div>
    </div>
  );
};
