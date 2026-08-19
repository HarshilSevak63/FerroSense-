import React from 'react';
import { SystemStats } from '../types/stats';
import { RadialGauge } from './RadialGauge';
import { LinearGauge } from './LinearGauge';
import { BatteryGauge } from './BatteryGauge';
import { GpuCard } from './GpuCard';
import { ThermalFanCard } from './ThermalFanCard';

interface DashboardProps {
  stats: SystemStats | null;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, loading }) => {
  if (loading && !stats) {
    return (
      <div className="dashboard-loading">
        <div className="loader-spinner" />
        <p>Connecting to FerroSense Telemetry Engine...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-error">
        <p>Unable to retrieve system statistics.</p>
      </div>
    );
  }

  const getTempClass = (t: number | null) => {
    if (!t) return 'temp-normal';
    return t >= 80 ? 'temp-danger' : t >= 68 ? 'temp-warning' : 'temp-normal';
  };

  return (
    <div className="dashboard-grid-wrapper">
      <div className="telemetry-cards-grid">
        {/* CARD 1: CPU USAGE */}
        <div className="telemetry-card card-cpu">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-icon">🧠</span>
              <div>
                <h3>Processor</h3>
                <span className="card-subtitle">{stats.cpu_brand}</span>
              </div>
            </div>
            <div className="card-header-badges">
              {stats.cpu_temp !== null && (
                <span className={`temp-badge ${getTempClass(stats.cpu_temp)}`}>
                  🌡️ {stats.cpu_temp.toFixed(0)}°C
                </span>
              )}
              <span className="card-tag">CPU</span>
            </div>
          </div>

          <div className="card-body-radial">
            <RadialGauge
              value={stats.cpu_usage}
              label="TOTAL LOAD"
              subLabel={stats.cpu_temp ? `${stats.cpu_temp}°C • ${stats.cpu_cores.length} Cores` : `${stats.cpu_cores.length} Cores`}
            />
          </div>

          {stats.cpu_cores.length > 0 && (
            <div className="core-bars-preview">
              <div className="core-bars-header">Core Distribution:</div>
              <div className="core-bars-grid">
                {stats.cpu_cores.slice(0, 16).map((usage, idx) => (
                  <div key={idx} className="core-bar-track" title={`Core ${idx}: ${usage.toFixed(0)}%`}>
                    <div
                      className="core-bar-fill"
                      style={{
                        height: `${Math.min(100, Math.max(8, usage))}%`,
                        backgroundColor:
                          usage > 80
                            ? 'var(--accent-danger)'
                            : usage > 50
                            ? 'var(--accent-warning)'
                            : 'var(--accent-cyan)',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: DEDICATED GPU */}
        <GpuCard
          hasGpu={stats.has_gpu}
          gpuName={stats.gpu_name}
          gpuUsage={stats.gpu_usage}
          gpuTemp={stats.gpu_temp}
          vramUsedGb={stats.gpu_vram_used_gb}
          vramTotalGb={stats.gpu_vram_total_gb}
        />

        {/* CARD 3: THERMALS & COOLING FAN DECK */}
        <ThermalFanCard
          cpuTemp={stats.cpu_temp}
          gpuTemp={stats.gpu_temp}
          fanCpuRpm={stats.fan_cpu_rpm}
          fanGpuRpm={stats.fan_gpu_rpm}
          fanMode={stats.fan_mode}
        />

        {/* CARD 4: RAM USAGE */}
        <div className="telemetry-card card-ram">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-icon">💾</span>
              <div>
                <h3>Memory (RAM)</h3>
                <span className="card-subtitle">Physical Memory</span>
              </div>
            </div>
            <span className="card-tag">RAM</span>
          </div>

          <div className="card-body-metrics">
            <div className="metric-large-row">
              <div className="metric-col">
                <span className="metric-label">USED</span>
                <span className="metric-val font-mono text-cyan">{stats.ram_used_gb.toFixed(2)} <span className="unit">GB</span></span>
              </div>
              <div className="metric-divider">/</div>
              <div className="metric-col">
                <span className="metric-label">TOTAL</span>
                <span className="metric-val font-mono">{stats.ram_total_gb.toFixed(2)} <span className="unit">GB</span></span>
              </div>
            </div>

            <LinearGauge
              value={stats.ram_used_pct}
              max={100}
              showPercentage={true}
              colorScheme="dynamic"
            />

            <div className="ram-subdetails">
              <span>Free Available:</span>
              <strong className="font-mono">{(stats.ram_total_gb - stats.ram_used_gb).toFixed(2)} GB</strong>
            </div>
          </div>
        </div>

        {/* CARD 5: STORAGE USAGE */}
        <div className="telemetry-card card-disk">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-icon">💽</span>
              <div>
                <h3>Primary Storage</h3>
                <span className="card-subtitle">Volume ({stats.disk_name})</span>
              </div>
            </div>
            <span className="card-tag">DRIVE</span>
          </div>

          <div className="card-body-metrics">
            <div className="metric-large-row">
              <div className="metric-col">
                <span className="metric-label">USED SPACE</span>
                <span className="metric-val font-mono text-purple">{stats.disk_used_gb.toFixed(1)} <span className="unit">GB</span></span>
              </div>
              <div className="metric-divider">/</div>
              <div className="metric-col">
                <span className="metric-label">CAPACITY</span>
                <span className="metric-val font-mono">{stats.disk_total_gb.toFixed(1)} <span className="unit">GB</span></span>
              </div>
            </div>

            <LinearGauge
              value={stats.disk_used_pct}
              max={100}
              showPercentage={true}
              colorScheme="purple"
            />

            <div className="ram-subdetails">
              <span>Available Space:</span>
              <strong className="font-mono">{(stats.disk_total_gb - stats.disk_used_gb).toFixed(1)} GB</strong>
            </div>
          </div>
        </div>

        {/* CARD 6: BATTERY & POWER (39% Charging) */}
        <div className="telemetry-card card-battery">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-icon">🔋</span>
              <div>
                <h3>Power & Battery</h3>
                <span className="card-subtitle">{stats.is_laptop ? 'Integrated Battery Pack' : 'Desktop Power Supply'}</span>
              </div>
            </div>
            <span className="card-tag">POWER</span>
          </div>

          <div className="card-body-metrics">
            <BatteryGauge
              batteryPct={stats.battery_pct}
              isCharging={stats.is_charging}
              isLaptop={stats.is_laptop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
