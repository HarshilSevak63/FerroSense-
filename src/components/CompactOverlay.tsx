import React from 'react';
import { SystemStats } from '../types/stats';
import { Sparkline } from './Sparkline';

interface CompactOverlayProps {
  stats: SystemStats | null;
  cpuHistory: number[];
  gpuHistory: number[];
  onToggleFullMode: () => void;
}

export const CompactOverlay: React.FC<CompactOverlayProps> = ({
  stats,
  cpuHistory,
  gpuHistory,
  onToggleFullMode,
}) => {
  if (!stats) return null;

  const gpuUsage = stats.gpu_usage ?? 0;
  const gpuTemp = stats.gpu_temp ?? 45;
  const vramUsed = stats.gpu_vram_used_gb ?? 0;
  const vramTotal = stats.gpu_vram_total_gb ?? 8;

  return (
    <aside aria-label="Compact Floating HUD" className="compact-hud-bar">
      <div className="compact-hud-drag-handle">
        <span className="compact-logo-badge">⚡ FerroSense</span>
        <span className="compact-live-pill">● LIVE</span>
      </div>

      <div className="compact-metric-tile">
        <div className="compact-tile-header">
          <span className="compact-tile-label">CPU LOAD</span>
          <span className="compact-tile-val">{stats.cpu_usage.toFixed(0)}%</span>
        </div>
        <div className="compact-spark-wrap">
          <Sparkline data={cpuHistory} width={80} height={22} color="var(--accent-primary)" />
        </div>
      </div>

      <div className="compact-metric-tile">
        <div className="compact-tile-header">
          <span className="compact-tile-label">CPU TEMP</span>
          <span className="compact-tile-val text-temp">{stats.cpu_temp}°C</span>
        </div>
        <div className="compact-sub-pill">{stats.fan_cpu_rpm} RPM</div>
      </div>

      <div className="compact-metric-tile">
        <div className="compact-tile-header">
          <span className="compact-tile-label">GPU LOAD</span>
          <span className="compact-tile-val text-gpu">{gpuUsage.toFixed(0)}%</span>
        </div>
        <div className="compact-spark-wrap">
          <Sparkline data={gpuHistory} width={80} height={22} color="#00e5ff" />
        </div>
      </div>

      <div className="compact-metric-tile">
        <div className="compact-tile-header">
          <span className="compact-tile-label">GPU TEMP</span>
          <span className="compact-tile-val text-temp">{gpuTemp}°C</span>
        </div>
        <div className="compact-sub-pill">{vramUsed.toFixed(1)}/{vramTotal.toFixed(0)} GB</div>
      </div>

      <div className="compact-metric-tile">
        <div className="compact-tile-header">
          <span className="compact-tile-label">RAM</span>
          <span className="compact-tile-val">{stats.ram_used_pct.toFixed(0)}%</span>
        </div>
        <div className="compact-sub-pill">{stats.ram_used_gb.toFixed(1)} GB</div>
      </div>

      <div className="compact-metric-tile">
        <div className="compact-tile-header">
          <span className="compact-tile-label">BATTERY</span>
          <span className="compact-tile-val text-battery">
            {stats.battery_pct ?? '--'}% {stats.is_charging ? '⚡' : ''}
          </span>
        </div>
        <div className="compact-sub-pill">{stats.is_charging ? 'Charging' : 'Battery'}</div>
      </div>

      <div className="compact-actions">
        <button
          onClick={onToggleFullMode}
          className="compact-expand-btn"
          title="Expand to Full Dashboard"
        >
          🪟 Full View
        </button>
      </div>
    </aside>
  );
};
